import { ref } from 'vue'

const isOpen = ref(false)
const resolve = ref(null)

const title = ref('')
const description = ref('')
const filename = ref('')
const confirmText = ref('Confirm')
const cancelText = ref('Cancel')

const confirm = (options) => {
  title.value = options.title
  description.value = options.description
  filename.value = options.filename || ''
  confirmText.value = options.confirmText || 'Confirm'
  cancelText.value = options.cancelText || 'Cancel'
  isOpen.value = true

  return new Promise((res) => {
    resolve.value = res
  })
}

const handleConfirm = () => {
  isOpen.value = false
  resolve.value?.(true)
}

const handleCancel = () => {
  isOpen.value = false
  resolve.value?.(false)
}

export function useAlertDialogConfirm() {
  return {
    isOpen,
    title,
    description,
    filename,
    confirmText,
    cancelText,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
