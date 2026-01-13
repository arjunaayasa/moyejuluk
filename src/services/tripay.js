// Tripay Payment Gateway Service (via Supabase Edge Function)
import { supabase } from '../supabase';

// Create QRIS Payment via Edge Function
export async function createQrisPayment(userId, email) {
    try {
        // Get current session for auth
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return {
                success: false,
                error: 'User not authenticated',
            };
        }

        const { data, error } = await supabase.functions.invoke('tripay-payment', {
            body: { action: 'create', userId, email },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        if (error) throw new Error(error.message);

        return data;
    } catch (e) {
        console.error('Create payment error:', e);
        return {
            success: false,
            error: e.message,
        };
    }
}

// Check transaction status via Edge Function
export async function checkTransaction(merchantRef) {
    try {
        // Get current session for auth
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return {
                success: false,
                error: 'User not authenticated',
            };
        }

        const { data, error } = await supabase.functions.invoke('tripay-payment', {
            body: { action: 'status', reference: merchantRef },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        if (error) throw new Error(error.message);

        return data;
    } catch (e) {
        console.error('Check transaction error:', e);
        return {
            success: false,
            error: e.message,
        };
    }
}

// Get available payment channels (not needed for now, QRIS only)
export async function getPaymentChannels() {
    // For now we only support QRIS
    return [{
        code: 'QRIS',
        name: 'QRIS (Semua E-Wallet)',
        icon_url: 'https://tripay.co.id/images/payment-icon/qris.png',
    }];
}
