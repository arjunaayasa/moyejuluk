<template>
  <div class="account-page">
    <!-- Header -->
    <header class="account-header">
      <h1>Akun Saya</h1>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
    </div>

    <template v-else>
      <!-- Profile Section -->
      <section class="profile-section">
        <div class="profile-avatar">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="profile-info">
          <h2>{{ profile?.email || 'Loading...' }}</h2>
          <p class="join-date">Bergabung {{ formatDate(profile?.created_at) }}</p>
        </div>
      </section>

      <!-- Subscription Status -->
      <section class="subscription-section">
        <h3>Status Langganan</h3>
        
        <!-- Trial Status -->
        <div v-if="subscriptionStatus === 'trial'" class="status-card trial">
          <div class="status-header">
            <span class="status-badge trial">Trial</span>
            <span class="status-text">Masa Percobaan</span>
          </div>
          <div class="trial-info">
            <p>Sisa trial drama: <strong>{{ remainingDramaTrial }}</strong> episode</p>
            <p>Sisa trial komik: <strong>{{ remainingKomikTrial }}</strong> chapter</p>
          </div>
        </div>

        <!-- Active Status -->
        <div v-else-if="subscriptionStatus === 'active'" class="status-card active">
          <div class="status-header">
            <span class="status-badge active">Premium</span>
            <span class="status-text">Langganan Aktif</span>
          </div>
          <div class="subscription-info">
            <p>Berlaku hingga: <strong>{{ formatDate(profile?.subscription_expires_at) }}</strong></p>
          </div>
        </div>

        <!-- Expired Status -->
        <div v-else class="status-card expired">
          <div class="status-header">
            <span class="status-badge expired">Expired</span>
            <span class="status-text">Langganan Berakhir</span>
          </div>
          <p class="expired-text">Langganan kamu sudah berakhir. Perpanjang untuk akses unlimited!</p>
        </div>
      </section>

      <!-- Subscribe Plan (show if not active) -->
      <section v-if="subscriptionStatus !== 'active'" class="plan-section">
        <h3>Berlangganan Premium</h3>
        
        <div class="plan-card">
          <div class="plan-header">
            <span class="plan-name">Premium Monthly</span>
            <span class="plan-badge">Populer</span>
          </div>
          <div class="plan-price">
            <span class="price">Rp 10.000</span>
            <span class="period">/bulan</span>
          </div>
          <ul class="plan-features">
            <li>
              <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Akses unlimited drama
            </li>
            <li>
              <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Akses unlimited komik
            </li>
            <li>
              <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Tanpa iklan
            </li>
            <li>
              <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Kualitas HD
            </li>
          </ul>

          <!-- Subscribe Button -->
          <button 
            class="subscribe-btn" 
            :disabled="paymentLoading"
            @click="handleSubscribe"
          >
            <span v-if="paymentLoading">Memproses...</span>
            <span v-else>Berlangganan Sekarang</span>
          </button>
        </div>
      </section>

      <!-- Transaction History Link -->
      <section class="history-section">
        <div class="history-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span>Riwayat Transaksi</span>
          <span class="coming-soon">Segera Hadir</span>
        </div>
      </section>

      <!-- Logout Button -->
      <section class="logout-section">
        <button class="logout-btn" @click="handleLogout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar
        </button>
      </section>
    </template>

    <!-- QR Code Modal Popup -->
    <Teleport to="body">
      <div v-if="qrCodeUrl" class="qr-modal-overlay" @click.self="closeQrModal">
        <div class="qr-modal">
          <!-- Close button -->
          <button class="qr-close-btn" @click="closeQrModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <h3>Scan QRIS untuk Bayar</h3>
          <div class="qr-amount">Rp 10.000</div>
          <img :src="qrCodeUrl" alt="QRIS Payment" class="qr-modal-image" />
          <p class="qr-modal-note">Pembayaran akan otomatis terverifikasi</p>
          <button class="qr-check-btn" @click="checkPaymentStatus" :disabled="paymentLoading">
            {{ paymentLoading ? 'Mengecek...' : 'Cek Status Pembayaran' }}
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="success-modal-overlay" @click.self="closeSuccessModal">
        <div class="success-modal">
          <!-- Animated Checkmark -->
          <div class="success-checkmark">
            <svg class="checkmark-svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          
          <h3>Pembayaran Berhasil!</h3>
          <p>Selamat menikmati akses premium Moyejuluk 🎉</p>
          <p class="success-detail">Langganan aktif selama 1 bulan</p>
          
          <button class="success-btn" @click="closeSuccessModal">
            Mulai Menonton
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useSubscription } from '../composables/useSubscription';
import { createQrisPayment, checkTransaction } from '../services/tripay';

const router = useRouter();
const { profile, loading, logout } = useAuth();
const { 
  isSubscribed, 
  remainingDramaTrial, 
  remainingKomikTrial,
  activateSubscription 
} = useSubscription();

const paymentLoading = ref(false);
const qrCodeUrl = ref('');
const transactionRef = ref('');
const showSuccessModal = ref(false);

// Computed subscription status
const subscriptionStatus = computed(() => {
  if (!profile.value) return 'trial';
  
  if (profile.value.subscription_status === 'active') {
    // Check if expired
    if (profile.value.subscription_expires_at) {
      const expiresAt = new Date(profile.value.subscription_expires_at);
      if (expiresAt > new Date()) {
        return 'active';
      }
      return 'expired';
    }
  }
  return profile.value.subscription_status || 'trial';
});

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Handle subscribe
const handleSubscribe = async () => {
  if (!profile.value) return;
  
  paymentLoading.value = true;
  try {
    const result = await createQrisPayment(
      profile.value.id,
      profile.value.email
    );
    
    if (result.success) {
      qrCodeUrl.value = result.qrUrl;
      transactionRef.value = result.reference;
    } else {
      alert('Gagal membuat pembayaran: ' + result.error);
    }
  } catch (e) {
    alert('Error: ' + e.message);
  } finally {
    paymentLoading.value = false;
  }
};

// Check payment status
const checkPaymentStatus = async () => {
  if (!transactionRef.value) return;
  
  paymentLoading.value = true;
  try {
    console.log('Checking transaction:', transactionRef.value);
    const result = await checkTransaction(transactionRef.value);
    console.log('Check result:', result);
    
    // Check for null/undefined result
    if (!result) {
      alert('Error: Tidak ada response dari server');
      return;
    }
    
    // Check for API error
    if (result.success === false) {
      alert('Error: ' + (result.error || 'Gagal cek status'));
      return;
    }
    
    if (result.status === 'PAID') {
      await activateSubscription();
      qrCodeUrl.value = '';
      transactionRef.value = '';
      showSuccessModal.value = true;
    } else if (result.status === 'PENDING') {
      alert('Pembayaran belum diterima. Silakan selesaikan pembayaran.');
    } else {
      alert('Status: ' + result.status);
    }
  } catch (e) {
    console.error('Check payment error:', e);
    alert('Error: ' + e.message);
  } finally {
    paymentLoading.value = false;
  }
};

// Handle logout
const handleLogout = async () => {
  await logout();
  router.push('/login');
};

// Close QR modal
const closeQrModal = () => {
  qrCodeUrl.value = '';
  transactionRef.value = '';
};

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false;
};
</script>

<style scoped>
.account-page {
  padding: var(--space-lg);
  padding-bottom: calc(var(--navbar-height) + var(--space-xl));
  max-width: 600px;
  margin: 0 auto;
}

.account-header {
  margin-bottom: var(--space-xl);
}

.account-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: var(--space-2xl);
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Profile Section */
.profile-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
}

.profile-avatar {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--accent), #ff9966);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profile-info h2 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-xs);
  word-break: break-all;
}

.join-date {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* Subscription Section */
.subscription-section {
  margin-bottom: var(--space-xl);
}

.subscription-section h3,
.plan-section h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.status-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.trial {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.status-badge.expired {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.status-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.trial-info p,
.subscription-info p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--space-xs) 0;
}

.trial-info strong,
.subscription-info strong {
  color: var(--text-primary);
}

.expired-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* Plan Section */
.plan-section {
  margin-bottom: var(--space-xl);
}

.plan-card {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.plan-name {
  font-weight: 600;
  font-size: var(--font-size-base);
}

.plan-badge {
  background: var(--accent);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 10px;
}

.plan-price {
  margin-bottom: var(--space-lg);
}

.plan-price .price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.plan-price .period {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-lg) 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--space-xs) 0;
}

.check-icon {
  color: var(--accent);
  flex-shrink: 0;
}

.subscribe-btn {
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

.subscribe-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
}

.subscribe-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* QR Section */
.qr-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.qr-section h4 {
  font-size: var(--font-size-base);
  margin-bottom: var(--space-md);
}

.qr-image {
  width: 200px;
  height: 200px;
  background: white;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
}

.qr-note {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  margin-bottom: var(--space-md);
}

.check-btn {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.check-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* QR Modal Popup */
.qr-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
}

.qr-modal {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  max-width: 360px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: modalSlideUp 0.3s ease;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.qr-close-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  transition: color 0.2s;
}

.qr-close-btn:hover {
  color: var(--text-primary);
}

.qr-modal h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.qr-amount {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--accent);
  margin-bottom: var(--space-lg);
}

.qr-modal-image {
  width: 220px;
  height: 220px;
  background: white;
  border-radius: var(--radius-md);
  margin: 0 auto var(--space-md) auto;
  display: block;
}

.qr-modal-note {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-lg);
}

.qr-check-btn {
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

.qr-check-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
}

.qr-check-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* History Section */
.history-section {
  margin-bottom: var(--space-xl);
}

.history-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
}

.history-card span:first-of-type {
  flex: 1;
}

.coming-soon {
  font-size: var(--font-size-xs);
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

/* Logout Section */
.logout-section {
  margin-bottom: var(--space-xl);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Success Modal */
.success-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
}

.success-modal {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  max-width: 360px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: modalSlideUp 0.3s ease;
}

.success-checkmark {
  width: 100px;
  height: 100px;
  margin: 0 auto var(--space-lg);
}

.checkmark-svg {
  width: 100%;
  height: 100%;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4ade80;
  animation: checkmarkStroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #4ade80;
  animation: checkmarkStroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes checkmarkStroke {
  100% {
    stroke-dashoffset: 0;
  }
}

.success-modal h3 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: #4ade80;
}

.success-modal p {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-xs);
}

.success-detail {
  font-size: var(--font-size-sm) !important;
  opacity: 0.7;
  margin-bottom: var(--space-lg) !important;
}

.success-btn {
  width: 100%;
  padding: var(--space-md);
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  font-size: var(--font-size-base);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.success-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(74, 222, 128, 0.3);
}
</style>
