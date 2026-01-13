// Subscription composable
import { computed } from 'vue';
import { supabase } from '../supabase';
import { config } from '../config';
import { useAuth } from './useAuth';

export function useSubscription() {
    const { profile, loadProfile } = useAuth();

    // Check if user has active subscription
    const isSubscribed = computed(() => {
        if (!profile.value) return false;
        if (profile.value.subscription_status === 'active') {
            // Check if not expired
            if (profile.value.subscription_expires_at) {
                return new Date(profile.value.subscription_expires_at) > new Date();
            }
        }
        return false;
    });

    // Check if trial is available for drama
    const canWatchDrama = computed(() => {
        console.log('canWatchDrama check - profile:', profile.value);
        console.log('canWatchDrama check - isSubscribed:', isSubscribed.value);
        if (isSubscribed.value) return true;
        if (!profile.value) {
            console.log('canWatchDrama - No profile, returning true (loading)');
            return true; // Allow during loading, will recheck after profile loads
        }
        const count = profile.value.trial_drama_count || 0;
        const limit = config.subscription.trialDramaLimit;
        console.log(`canWatchDrama - count: ${count}, limit: ${limit}`);
        return count < limit;
    });

    // Check if trial is available for komik
    const canReadKomik = computed(() => {
        if (isSubscribed.value) return true;
        if (!profile.value) return true; // Allow during loading
        const count = profile.value.trial_komik_count || 0;
        const limit = config.subscription.trialKomikLimit;
        return count < limit;
    });

    // Get remaining trial counts
    const remainingDramaTrial = computed(() => {
        if (!profile.value) return 0;
        return Math.max(0, config.subscription.trialDramaLimit - profile.value.trial_drama_count);
    });

    const remainingKomikTrial = computed(() => {
        if (!profile.value) return 0;
        return Math.max(0, config.subscription.trialKomikLimit - profile.value.trial_komik_count);
    });

    // Increment drama trial count
    const incrementDramaTrial = async () => {
        if (!profile.value || isSubscribed.value) return;

        const newCount = (profile.value.trial_drama_count || 0) + 1;

        const { error } = await supabase
            .from('profiles')
            .update({ trial_drama_count: newCount })
            .eq('id', profile.value.id);

        if (!error) {
            profile.value.trial_drama_count = newCount;
        }
    };

    // Increment komik trial count
    const incrementKomikTrial = async () => {
        if (!profile.value || isSubscribed.value) return;

        const newCount = (profile.value.trial_komik_count || 0) + 1;

        const { error } = await supabase
            .from('profiles')
            .update({ trial_komik_count: newCount })
            .eq('id', profile.value.id);

        if (!error) {
            profile.value.trial_komik_count = newCount;
        }
    };

    // Activate subscription (called after payment success)
    const activateSubscription = async () => {
        if (!profile.value) return;

        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        const { error } = await supabase
            .from('profiles')
            .update({
                subscription_status: 'active',
                subscription_expires_at: expiresAt.toISOString(),
            })
            .eq('id', profile.value.id);

        if (!error) {
            await loadProfile();
        }
    };

    return {
        isSubscribed,
        canWatchDrama,
        canReadKomik,
        remainingDramaTrial,
        remainingKomikTrial,
        incrementDramaTrial,
        incrementKomikTrial,
        activateSubscription,
    };
}
