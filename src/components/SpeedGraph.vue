<template>
  <div class="speed-graph-container px-2 pb-4 border-b border-neutral-700">
    <!-- One-line download/upload display -->
    <div class="flex items-center justify-between text-white text-sm font-medium mb-2">
      <div class="flex items-center gap-2">
        <ArrowDown class="size-5 text-blue-400" />
        <span class="text-md font-light text-neutral-300">{{ formattedDownloadSpeed }}</span>
      </div>


      <div class="flex items-center gap-2">
        <ArrowUp class="size-5 text-emerald-400" />
        <span class="text-md font-light text-neutral-300">{{ formattedUploadSpeed }}</span>
      </div>
    </div>

    <div class="chart-container h-20">
      <Line v-if="chartReady" :data="chartData" :options="chartOptions" class="chart" />
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { useTransferStore } from '../stores/transfer'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
)

const transferStore = useTransferStore()
const updateInterval = ref(null)
const chartReady = ref(false)

const createGradient = (ctx, color) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 80)
  gradient.addColorStop(0, `${color}80`) // 50% opacity
  gradient.addColorStop(1, `${color}00`) // 0% opacity
  return gradient
}

const chartData = computed(() => ({
  labels: Array(transferStore.downloadHistory.length).fill(''),
  datasets: [
    {
      label: 'Download Speed',
      data: [...transferStore.downloadHistory],
      fill: true,
      backgroundColor: (context) => {
        const { chartArea, ctx } = context.chart
        if (!chartArea) return null
        return createGradient(ctx, '#3b82f6') // Tailwind blue-500
      },
      borderColor: 'rgba(59, 130, 246, 0.8)',
      borderWidth: 1.5,
      tension: 0.4,
      pointRadius: 0,
    },
    {
      label: 'Upload Speed',
      data: [...transferStore.uploadHistory],
      fill: true,
      backgroundColor: (context) => {
        const { chartArea, ctx } = context.chart
        if (!chartArea) return null
        return createGradient(ctx, '#10b981') // Tailwind purple-500
      },
      borderColor: 'rgba(16, 185, 129, 0.8)',
      borderWidth: 1.5,
      tension: 0.4,
      pointRadius: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
      grid: { display: false },
    },
    y: {
      display: false,
      beginAtZero: true,
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  animation: {
    duration: 800,
  },
  elements: {
    line: { borderWidth: 1.5 },
  },
}

const formattedDownloadSpeed = computed(() => transferStore.formattedDownloadSpeed)
const formattedUploadSpeed = computed(() => transferStore.formattedUploadSpeed)

watch(
  () => transferStore.downloadHistory,
  (newVal) => {
    if (newVal.length > 0 && !chartReady.value) {
      chartReady.value = true
    }
  },
  { immediate: true },
)

onMounted(() => {
  transferStore.fetchTransferInfo()
  updateInterval.value = setInterval(() => {
    transferStore.fetchTransferInfo()
  }, 5000)
})

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
}

.chart {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
