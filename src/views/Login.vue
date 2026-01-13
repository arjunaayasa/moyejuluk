<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <h1>Moyejuluk!</h1>
        <p>Streaming Drama & Komik</p>
      </div>

      <!-- Login Form -->
      <form class="auth-form" @submit.prevent="handleLogin">
        <h2>Masuk</h2>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="email@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk</span>
        </button>
      </form>

      <!-- Register Link -->
      <div class="auth-footer">
        <p>Belum punya akun?</p>
        <router-link to="/register" class="link">Daftar Sekarang</router-link>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="auth-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login, loading } = useAuth();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';
  
  if (!email.value || !password.value) {
    errorMsg.value = 'Email dan password wajib diisi';
    return;
  }

  const result = await login(email.value, password.value);
  
  if (result.success) {
    router.push('/');
  } else {
    errorMsg.value = result.error || 'Login gagal';
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: var(--space-md);
  position: relative;
  overflow: hidden;
}

.auth-container {
  width: 100%;
  max-width: 380px;
  z-index: 1;
}

.auth-logo {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.auth-logo h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.auth-logo p {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-sm);
  margin-top: var(--space-xs);
}

.auth-form {
  background: rgba(30, 30, 30, 0.4);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  padding: var(--space-xl);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.auth-form h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-lg);
  text-align: center;
  color: white;
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: white;
  font-size: var(--font-size-base);
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.error-msg {
  color: #ff6b6b;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-md);
  text-align: center;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
}

.auth-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--accent), #ff9966);
  color: white;
  font-size: var(--font-size-base);
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: var(--space-sm);
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: var(--space-xl);
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-sm);
  margin-bottom: 4px;
}

.auth-footer .link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.auth-footer .link:hover {
  text-decoration: underline;
}

/* Background decoration */
.auth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(255, 107, 53, 0.3);
  top: -150px;
  right: -150px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: rgba(139, 92, 246, 0.25);
  bottom: -150px;
  left: -150px;
  animation: float 8s ease-in-out infinite 2s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}
</style>
