<template>
  <Transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="close-btn" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Current Total Badge -->
        <div class="total-badge">
          <div class="flag-circle">
            <img :src="`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`" class="flag-img-small" />
          </div>
          <div class="total-info">
            <span class="total-label">{{ currency }}</span>
            <span class="total-amount">{{ formatAmount(amount) }}</span>
          </div>
        </div>

        <div class="instruction-box">
          <p class="instruction-text">
            Select this payment option and transfer the exact ticket amount to the account below and get confirmation instantly.
            <span class="instruction-sub">
              The below account details is unique to this particular transaction. Do not use for other transaction. <span class="text-red-500">Account details will expire in 9 hours</span>
            </span>
          </p>
        </div>

        <!-- Bank Accounts List -->
        <div class="accounts-container">
          <div
            v-for="account in bankAccounts"
            :key="account.accountNumber"
            class="account-card"
            :class="{ active: selectedAccount?.accountNumber === account.accountNumber }"
            @click="selectedAccount = account"
          >
            <div class="bank-info">
              <span class="bank-name">{{ account.bankName }}</span>
              <span class="account-label">Account Number</span>
              <span class="account-number">{{ account.accountNumber }}</span>
              <span class="beneficiary-label">Beneficiary</span>
              <span class="beneficiary-name">{{ account.accountName }}</span>
            </div>
            <div v-if="selectedAccount?.accountNumber === account.accountNumber" class="check-icon">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-confirm" @click="handleConfirm">
            Continue To See Bank Transfer Details
          </button>
          
          <div class="security-info">
            <div class="security-item main">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              This booking is 100% protected
            </div>
            <div class="security-items">
              <span class="security-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Secure transmission
              </span>
              <span class="security-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Encrypted storage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useConfirmation } from '@/composables/core/useConfirmation'

const { confirm } = useConfirmation()

const props = defineProps({
  visible: Boolean,
  amount: Number,
  currency: String,
  bankAccounts: {
    type: Array as any,
    default: () => []
  }
})

const emit = defineEmits(['close', 'confirm'])

const selectedAccount = ref<any>(null)

const countryCode = computed(() => {
  const map: Record<string, string> = { NGN: 'NG', GHS: 'GH', USD: 'US', EUR: 'EU', GBP: 'GB', ZAR: 'ZA', KES: 'KE' }
  return map[props.currency || 'USD'] || 'US'
})

const formatAmount = (val?: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency || 'USD',
    minimumFractionDigits: 2
  }).format(val || 0)
}

const handleConfirm = async () => {
  if (selectedAccount.value) {
    emit('confirm', selectedAccount.value)
  } else {
    await confirm({
      title: 'Action Required',
      message: 'Please select a preferred bank account to continue with your secure transmission.',
      confirmText: 'Understood',
      cancelText: '',
      variant: 'info'
    })
  }
}

onMounted(() => {
  if (props.bankAccounts.length > 0) {
    selectedAccount.value = props.bankAccounts[0]
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 520px;
  border-radius: 1.5rem;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
}

.total-badge {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  margin-bottom: 2rem;
}

.flag-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.flag-img-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.total-info {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748b;
  
  line-height: 1;
  margin-bottom: 0.15rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e293b;
  line-height: 1;
}

.instruction-box {
  border: 1px solid #dcfce7;
  background: #f0fdf4;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.instruction-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #16a34a;
  line-height: 1.6;
}

.instruction-sub {
  display: block;
  margin-top: 0.5rem;
  font-weight: 800;
  color: #374151;
}

.accounts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.account-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-card:hover {
  background: #f8fafc;
  border-color: #3b82f6;
}

.account-card.active {
  border-color: #3b82f6;
  background: #f0f9ff;
  box-shadow: 0 0 0 1px #3b82f6;
}

.bank-info {
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
}

.bank-name {
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 0.25rem;
}

.account-label, .beneficiary-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  margin-top: 0.5rem;
}

.account-number {
  font-size: 1.15rem;
  font-weight: 900;
  color: #2563eb;
  letter-spacing: 0.05em;
}

.beneficiary-name {
  font-size: 0.85rem;
  font-weight: 800;
  color: #334155;
}

.btn-confirm {
  width: 100%;
  background: #f97316;
  color: white;
  font-weight: 800;
  
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-confirm:hover {
  background: #ea580c;
  transform: translateY(-1px);
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 700;
}

.security-item.main {
  color: #111827;
  font-size: 0.85rem;
}

.security-items {
  display: flex;
  gap: 1.5rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
