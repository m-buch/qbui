<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-950/70 md:p-6">
    <Card
      class="w-full max-w-md p-6 md:p-8 md:py-10 backdrop-blur-xl dark:bg-neutral-900 border border-neutral-800 shadow-xl"
    >
      <CardHeader class="text-center">
        <img src="@/assets/logo.png" alt="qBittorrent" class="h-24 mx-auto mb-4" />
        <CardTitle class="text-white text-2xl font-medium">Sign In</CardTitle>
        <CardDescription class="text-neutral-400"
          >Enter your credentials to access the qB WebUI</CardDescription
        >
      </CardHeader>

      <Form>
        <form @submit.prevent="handleLogin">
          <CardContent class="space-y-6">
            <!-- Username -->
            <FormField name="username">
              <FormItem>
                <Label for="username" class="text-neutral-300">Username</Label>
                <div class="relative">
                  <User class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5" />
                  <Input
                    id="username"
                    v-model="username"
                    autocomplete="username"
                    placeholder="Your username"
                    required
                    class="pl-10 bg-neutral-800/60 text-white border-neutral-700 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-blue-500"
                  />
                </div>
                <FormMessage v-if="error && !username" class="text-red-500"
                  >Username is required</FormMessage
                >
              </FormItem>
            </FormField>

            <!-- Password -->
            <FormField name="password">
              <FormItem>
                <Label for="password" class="text-neutral-300">Password</Label>
                <div class="relative">
                  <LockOpen
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5"
                  />
                  <Input
                    id="password"
                    type="password"
                    v-model="password"
                    autocomplete="current-password"
                    placeholder="Your password"
                    required
                    class="pl-10 bg-neutral-800/60 text-white border-neutral-700 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-blue-500"
                  />
                </div>
                <FormMessage v-if="error && !password" class="text-red-500"
                  >Password is required</FormMessage
                >
              </FormItem>
            </FormField>

            <!-- Submit Button -->
            <div class="flex justify-center">
              <Button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Sign In
              </Button>
            </div>

            <!-- Error Message -->
            <div class="min-h-[1.25rem] text-sm text-center">
              <p v-show="error" class="text-red-400">{{ error }}</p>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/api'

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { LockOpen, User } from 'lucide-vue-next'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Both fields are required'
    return
  }

  try {
    await authApi.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Login failed'
    password.value = ''
  }
}
</script>
