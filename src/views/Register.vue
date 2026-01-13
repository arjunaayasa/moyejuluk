<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <h1>Moyejuluk!</h1>
        <p>Streaming Drama & Komik</p>
      </div>

      <!-- Register Form -->
      <form class="auth-form" @submit.prevent="handleRegister">
        <h2>Daftar</h2>
        
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
            placeholder="Minimal 6 karakter"
            required
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Password</label>
          <input 
            id="confirmPassword"
            v-model="confirmPassword" 
            type="password" 
            placeholder="Ulangi password"
            required
            autocomplete="new-password"
          />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading">Memproses...</span>
          <span v-else>Daftar</span>
        </button>
      </form>

      <!-- Login Link -->
      <div class="auth-footer">
        <p>Sudah punya akun?</p>
        <router-link to="/login" class="link">Masuk</router-link>
      </div>

      <!-- Trial Info -->
      <div class="trial-info">
        <div class="trial-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8V3M12 8L7 3M12 8l5-5"/></svg> Trial Gratis</div>
        <p>Dapatkan akses trial untuk menonton 3 episode drama dan membaca 3 chapter komik gratis!</p>
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
const { register, loading } = useAuth();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');
const successMsg = ref('');

const handleRegister = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  
  if (!email.value || !password.value) {
    errorMsg.value = 'Semua field wajib diisi';
    return;
  }

  if (password.value.length < 6) {
    errorMsg.value = 'Password minimal 6 karakter';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Password tidak cocok';
    return;
  }

  const result = await register(email.value, password.value);
  
  if (result.success) {
    successMsg.value = 'Pendaftaran berhasil! Silakan cek email untuk verifikasi.';
    // Auto redirect after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } else {
    errorMsg.value = result.error || 'Pendaftaran gagal';
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
  max-width: 400px;
  z-index: 1;
}

.auth-logo {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.auth-logo h1 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent), #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-logo p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--space-xs);
}

.auth-form {
  background: var(--bg-card);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-form h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-lg);
  text-align: center;
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.form-group input {
  width: 100%;
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.08);
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.error-msg {
  color: #ff6b6b;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-md);
  text-align: center;
}

.success-msg {
  color: #51cf66;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-md);
  text-align: center;
}

.auth-btn {
  width: 100%;
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--accent), #ff9966);
  color: white;
  font-size: var(--font-size-base);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: var(--space-lg);
}

.auth-footer p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.auth-footer .link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}

.trial-info {
  margin-top: var(--space-lg);
  padding: var(--space-md);
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: var(--radius-md);
  text-align: center;
}

.trial-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--accent), #ff9966);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.trial-info p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

/* Background decoration */
.auth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--accent);
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: #8b5cf6;
  bottom: -100px;
  left: -100px;
}
</style>
