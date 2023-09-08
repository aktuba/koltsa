<script setup>
import { colors } from '@/helpers/colors';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  withoutCenter: {
    type: Boolean,
    default: false,
  },
})

const color = index => props.value[index] ? colors[props.value[index]] : 'transparent'
</script>

<template>
  <div class="circle c1" :style="{ 'border-color': color(0) }">
    <div class="circle c2" :style="{ 'border-color': color(1) }">
      <div class="circle c3" :style="{ 'border-color': color(2) }">
        <div v-if="!props.withoutCenter" class="circle c4" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.circle {
  border-radius: 50%;
  background: transparent;
  border: 0.5rem solid transparent;
  width: 11rem;
  height: 11rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle.c1 {
  width: 5.5rem;
  height: 5.5rem;
}

.circle.c2 {
  width: 4rem;
  height: 4rem;
}

.circle.c3 {
  width: 2.5rem;
  height: 2.5rem;
}

.circle.c4 {
  width: 0.5rem;
  height: 0.5rem;
  border-color: white;
  border-width: 0.5rem;
}
</style>
