// Supabase Edge Function for Tripay Payment Gateway
// Deploy: supabase functions deploy tripay-payment
// Set secrets: supabase secrets set TRIPAY_API_KEY=xxx TRIPAY_PRIVATE_KEY=xxx TRIPAY_MERCHANT_CODE=xxx

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// HMAC-SHA256 using Web Crypto API
async function hmacSha256(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const dataBytes = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataBytes);
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Tripay config from environment secrets
const TRIPAY_API_KEY = Deno.env.get('TRIPAY_API_KEY') || ''
const TRIPAY_PRIVATE_KEY = Deno.env.get('TRIPAY_PRIVATE_KEY') || ''
const TRIPAY_MERCHANT_CODE = Deno.env.get('TRIPAY_MERCHANT_CODE') || ''
const TRIPAY_BASE_URL = Deno.env.get('TRIPAY_BASE_URL') || 'https://tripay.co.id/api-sandbox'

// Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Check if this is a Tripay callback (via header or URL path)
        const callbackEvent = req.headers.get('X-Callback-Event')
        const url = new URL(req.url)
        const pathEndsWithCallback = url.pathname.endsWith('/callback')

        // Clone body text for signature verification
        const bodyText = await req.text()
        let body: any = {}

        try {
            body = JSON.parse(bodyText)
        } catch {
            body = {}
        }

        // If Tripay callback detected
        if (callbackEvent || pathEndsWithCallback) {
            return await handleWebhook(body, bodyText, req, supabase)
        }

        // Route handling based on action (internal API calls)
        const action = body.action || ''

        if (action === 'create') {
            return await handleCreatePayment(body, supabase)
        } else if (action === 'status') {
            return await handleCheckStatus(body)
        } else if (action === 'callback') {
            return await handleWebhook(body, bodyText, req, supabase)
        }

        return new Response(
            JSON.stringify({ error: 'Invalid action. Use: create, status, or callback' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Edge function error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

// Create QRIS Payment
async function handleCreatePayment(body: any, supabase: any) {
    const { userId, email } = body

    if (!userId || !email) {
        return new Response(
            JSON.stringify({ success: false, error: 'Missing userId or email' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const merchantRef = `MJL-${Date.now()}-${userId.slice(0, 8)}`
    const amount = 10000 // Rp 10.000

    // Generate signature
    const signature = await generateSignature(merchantRef, amount)

    // Create transaction in database first
    const { error: dbError } = await supabase
        .from('transactions')
        .insert([{
            user_id: userId,
            reference: merchantRef,
            amount: amount,
            status: 'PENDING',
            payment_method: 'QRIS',
        }])

    if (dbError) {
        console.error('DB insert error:', dbError)
        return new Response(
            JSON.stringify({ success: false, error: `Failed to create transaction: ${dbError.message}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // Call Tripay API
    const payload = {
        method: 'QRIS',
        merchant_ref: merchantRef,
        amount: amount,
        customer_name: email.split('@')[0],
        customer_email: email,
        order_items: [{
            sku: 'SUB-MONTHLY',
            name: 'Moyejuluk Premium 1 Bulan',
            price: amount,
            quantity: 1,
        }],
        expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        signature: signature,
    }

    const response = await fetch(`${TRIPAY_BASE_URL}/transaction/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TRIPAY_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (result.success) {
        return new Response(
            JSON.stringify({
                success: true,
                reference: result.data.reference, // Use Tripay's reference, not merchantRef
                merchantRef: merchantRef,
                qrUrl: result.data.qr_url || result.data.qr_string,
                checkoutUrl: result.data.checkout_url,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } else {
        // Update transaction status to FAILED
        await supabase
            .from('transactions')
            .update({ status: 'FAILED' })
            .eq('reference', merchantRef)

        return new Response(
            JSON.stringify({ success: false, error: result.message || 'Failed to create payment' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
}

// Check transaction status
async function handleCheckStatus(body: any) {
    const reference = body.reference

    if (!reference) {
        return new Response(
            JSON.stringify({ success: false, error: 'Missing reference' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const response = await fetch(
        `${TRIPAY_BASE_URL}/transaction/detail?reference=${reference}`,
        {
            headers: {
                'Authorization': `Bearer ${TRIPAY_API_KEY}`,
            },
        }
    )

    const result = await response.json()

    if (result.success) {
        return new Response(
            JSON.stringify({
                success: true,
                status: result.data.status,
                paidAt: result.data.paid_at,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } else {
        // Return 200 with success:false so frontend doesn't throw
        return new Response(
            JSON.stringify({ success: false, error: result.message, status: 'ERROR' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
}

// Handle Tripay Webhook/Callback
async function handleWebhook(body: any, bodyText: string, req: Request, supabase: any) {
    // Verify callback signature using original body text
    const callbackSignature = req.headers.get('X-Callback-Signature')
    const expectedSignature = await generateCallbackSignature(bodyText)

    if (callbackSignature !== expectedSignature) {
        console.error('Invalid callback signature. Expected:', expectedSignature, 'Got:', callbackSignature)
        return new Response(
            JSON.stringify({ success: false, error: 'Invalid signature' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const { merchant_ref, status } = body

    // Update transaction status
    const { error: txError } = await supabase
        .from('transactions')
        .update({
            status: status,
            paid_at: status === 'PAID' ? new Date().toISOString() : null
        })
        .eq('reference', merchant_ref)

    if (txError) {
        console.error('Failed to update transaction:', txError)
    }

    // If payment is successful, update user subscription
    if (status === 'PAID') {
        // Get user_id from transaction
        const { data: tx } = await supabase
            .from('transactions')
            .select('user_id')
            .eq('reference', merchant_ref)
            .single()

        if (tx) {
            const expiresAt = new Date()
            expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month subscription

            await supabase
                .from('profiles')
                .update({
                    subscription_status: 'active',
                    subscription_expires_at: expiresAt.toISOString(),
                })
                .eq('id', tx.user_id)
        }
    }

    return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
}

// Generate signature for create transaction
async function generateSignature(merchantRef: string, amount: number): Promise<string> {
    const data = TRIPAY_MERCHANT_CODE + merchantRef + amount
    return await hmacSha256(TRIPAY_PRIVATE_KEY, data)
}

// Generate signature for callback verification
async function generateCallbackSignature(payload: string): Promise<string> {
    return await hmacSha256(TRIPAY_PRIVATE_KEY, payload)
}
