<script setup lang="ts">
import type { Tone } from '../types'

withDefaults(defineProps<{ label: string; tone?: Tone }>(), { tone: 'neutral' })
</script>

<template>
  <span class="status-pill" :class="`status-${tone}`">{{ label }}</span>
</template>

