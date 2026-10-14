<script setup lang="ts">
import { computed } from 'vue'
import type { Metric } from '../types'
import AppIcon from './AppIcon.vue'

const props = defineProps<{ metric: Metric }>()
const color = computed(() => ({ primary: '#246bfd', success: '#149c67', danger: '#df563d', warning: '#be7915', neutral: '#7656d8' }[props.metric.tone]))
</script>

<template>
  <article class="metric-card" :style="{ '--metric-color': color }">
    <div class="metric-icon"><AppIcon :name="metric.icon" /></div>
    <div class="metric-value"><b>{{ metric.value }}</b><span>{{ metric.label }}</span></div>
    <div class="metric-note">{{ metric.note }}</div>
  </article>
</template>

