// Tripay Payment Gateway Service
import { config } from '../config';
import { supabase } from '../supabase';

const { tripay, subscription } = config;

// Generate signature for API calls
function generateSignature(merchantRef, amount) {
    // Note: In production, signature should be generated server-side
    // For sandbox, we'll create transaction and let webhook handle signature validation
    return '';
}

// Create QRIS Payment
export async function createQrisPayment(userId, email) {
    const merchantRef = `MJL-${Date.now()}-${userId.slice(0, 8)}`;
    const amount = subscription.monthlyPrice;

    try {
        // Create local transaction record first
        const { error: dbError } = await supabase
            .from('transactions')
            .insert([{
                user_id: userId,
                reference: merchantRef,
                amount: amount,
                status: 'PENDING',
                payment_method: 'QRIS',
            }]);

        if (dbError) throw new Error(dbError.message);

        // Call Tripay API to create transaction
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
            signature: generateSignature(merchantRef, amount),
        };

        const response = await fetch(`${tripay.baseUrl}/transaction/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tripay.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success) {
            return {
                success: true,
                reference: merchantRef,
                qrUrl: result.data.qr_url || result.data.qr_string,
                checkoutUrl: result.data.checkout_url,
            };
        } else {
            throw new Error(result.message || 'Failed to create payment');
        }
    } catch (e) {
        console.error('Create payment error:', e);
        return {
            success: false,
            error: e.message,
        };
    }
}

// Check transaction status
export async function checkTransaction(merchantRef) {
    try {
        const response = await fetch(
            `${tripay.baseUrl}/transaction/detail?reference=${merchantRef}`,
            {
                headers: {
                    'Authorization': `Bearer ${tripay.apiKey}`,
                },
            }
        );

        const result = await response.json();

        if (result.success) {
            return {
                success: true,
                status: result.data.status,
                paidAt: result.data.paid_at,
            };
        } else {
            throw new Error(result.message);
        }
    } catch (e) {
        console.error('Check transaction error:', e);
        return {
            success: false,
            error: e.message,
        };
    }
}

// Get available payment channels
export async function getPaymentChannels() {
    try {
        const response = await fetch(`${tripay.baseUrl}/merchant/payment-channel`, {
            headers: {
                'Authorization': `Bearer ${tripay.apiKey}`,
            },
        });

        const result = await response.json();
        return result.success ? result.data : [];
    } catch (e) {
        console.error('Get channels error:', e);
        return [];
    }
}
