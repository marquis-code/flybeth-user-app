import { ref } from 'vue'

interface ConfirmationOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'warning' | 'danger' | 'logout' | 'info' | 'exit'
}

const visible = ref(false)
const options = ref<ConfirmationOptions>({
  title: 'Are you sure?',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'warning'
})

let resolvePromise: (value: boolean) => void

export const useConfirmation = () => {
  const confirm = (newOptions: Partial<ConfirmationOptions>) => {
    options.value = {
      title: 'Are you sure?',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'warning',
      ...newOptions
    }
    visible.value = true
    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    visible.value = false
    resolvePromise(true)
  }

  const handleCancel = () => {
    visible.value = false
    resolvePromise(false)
  }

  return {
    visible,
    options,
    confirm,
    handleConfirm,
    handleCancel
  }
}
