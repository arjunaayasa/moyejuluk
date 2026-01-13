// Authentication composable
import { ref, computed } from 'vue';
import { supabase } from '../supabase';
import { config } from '../config';

// Global auth state
const user = ref(null);
const profile = ref(null);
const loading = ref(true);
const initialized = ref(false);

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value);

    // Initialize auth state
    const init = async () => {
        if (initialized.value) return;

        loading.value = true;
        try {
            // Get current session
            const { data: { session } } = await supabase.auth.getSession();
            user.value = session?.user || null;

            if (user.value) {
                await loadProfile();
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
                user.value = session?.user || null;
                if (user.value) {
                    await loadProfile();
                } else {
                    profile.value = null;
                }
            });
        } catch (e) {
            console.error('Auth init error:', e);
        } finally {
            loading.value = false;
            initialized.value = true;
        }
    };

    // Load user profile
    const loadProfile = async () => {
        if (!user.value) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.value.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // Profile doesn't exist, create it
                await createProfile();
            } else if (data) {
                profile.value = data;
            }
        } catch (e) {
            console.error('Load profile error:', e);
        }
    };

    // Create new profile
    const createProfile = async () => {
        if (!user.value) return;

        const newProfile = {
            id: user.value.id,
            email: user.value.email,
            subscription_status: 'trial',
            subscription_expires_at: null,
            trial_drama_count: 0,
            trial_komik_count: 0,
        };

        const { data, error } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

        if (!error && data) {
            profile.value = data;
        }
    };

    // Register
    const register = async (email, password) => {
        loading.value = true;
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        } finally {
            loading.value = false;
        }
    };

    // Login
    const login = async (email, password) => {
        loading.value = true;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Login error details:', error);
                throw error;
            }
            return { success: true, data };
        } catch (e) {
            console.error('Login catch error:', e);
            return { success: false, error: e.message };
        } finally {
            loading.value = false;
        }
    };

    // Logout
    const logout = async () => {
        loading.value = true;
        try {
            await supabase.auth.signOut();
            user.value = null;
            profile.value = null;
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            loading.value = false;
        }
    };

    return {
        user,
        profile,
        loading,
        isAuthenticated,
        init,
        register,
        login,
        logout,
        loadProfile,
    };
}
