<template>
  <Teleport to="body">
    <div v-if="show" class="popup-overlay" @click.self="$emit('close')">
      <div class="popup-container">
        <!-- Close button -->
        <button class="close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Lock Icon -->
        <div class="lock-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <!-- Content -->
        <div class="popup-content">
          <h2>Trial Habis</h2>
          <p class="subtitle">Kamu sudah menikmati trial gratis. Berlangganan untuk akses unlimited!</p>

          <!-- Subscription Plan -->
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
              <li><svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Akses unlimited drama</li>
              <li><svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Akses unlimited komik</li>
              <li><svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Tanpa iklan</li>
              <li><svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Kualitas HD</li>
            </ul>
          </div>

          <!-- Payment Button -->
          <button 
            class="subscribe-btn" 
            :disabled="loading"
            @click="handleSubscribe"
          >
            <span v-if="loading">Memproses...</span>
            <span v-else>Berlangganan Sekarang</span>
          </button>

          <!-- QR Code Display -->
          <div v-if="qrCodeUrl" class="qr-section">
            <h3>Scan QRIS untuk Bayar</h3>
            <img :src="qrCodeUrl" alt="QRIS Payment" class="qr-image" />
            <p class="qr-note">Pembayaran akan otomatis terverifikasi</p>
            <button class="check-btn" @click="checkPaymentStatus">
              Cek Status Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { createQrisPayment, checkTransaction } from '../services/tripay';
import { useAuth } from '../composables/useAuth';
import { useSubscription } from '../composables/useSubscription';

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['close', 'subscribed']);

const { profile } = useAuth();
const { activateSubscription } = useSubscription();

const loading = ref(false);
const qrCodeUrl = ref('');
const transactionRef = ref('');

const handleSubscribe = async () => {
  if (!profile.value) return;
  
  loading.value = true;
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
    loading.value = false;
  }
};

const checkPaymentStatus = async () => {
  if (!transactionRef.value) return;
  
  loading.value = true;
  try {
    const result = await checkTransaction(transactionRef.value);
    
    if (result.status === 'PAID') {
      await activateSubscription();
      emit('subscribed');
      emit('close');
      alert('Pembayaran berhasil! Selamat menikmati akses premium 🎉');
    } else if (result.status === 'PENDING') {
      alert('Pembayaran belum diterima. Silakan selesaikan pembayaran.');
    } else {
      alert('Status: ' + result.status);
    }
  } catch (e) {
    alert('Error: ' + e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
}

.popup-container {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  color: var(--text-secondary);
  padding: var(--space-xs);
}

.lock-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  color: var(--accent);
}

.popup-content {
  text-align: center;
}

.popup-content h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-lg);
}

.plan-card {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  text-align: left;
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
  margin-bottom: var(--space-md);
}

.plan-price .price {
  font-size: 1.75rem;
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
  margin: 0;
}

.plan-features li {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--space-xs) 0;
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

.qr-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.qr-section h3 {
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
</style>
