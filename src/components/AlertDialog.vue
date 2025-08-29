<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogContent
      class="p-4 dark:bg-neutral-900/80 dark:backdrop-blur-sm dark:border-neutral-800"
    >
      <AlertDialogHeader>
        <AlertDialogTitle class="text-white">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription class="text-neutral-400 whitespace-pre-wrap break-normal">
          {{ description }}
          <span class="block mt-2 font-mono text-xs text-neutral-300 break-all">{{
            filename
          }}</span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          @click="handleCancel"
          class="border-neutral-700 hover:bg-neutral-600 text-white cursor-pointer"
          >{{ cancelText }}</AlertDialogCancel
        >
        <AlertDialogAction
          @click="handleConfirm"
          class="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          >{{ confirmText }}</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup>
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

import { useAlertDialogConfirm } from '@/composables/useAlertDialogConfirm'

const {
  isOpen,
  title,
  description,
  filename,
  confirmText,
  cancelText,
  handleConfirm,
  handleCancel,
} = useAlertDialogConfirm()
</script>
