<script setup lang="ts">
import { computed, provide } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import type { Component, StyleValue } from 'vue'

import DatePickerQuarterHalfYear from './components/DatePickerQuarterHalfYear.vue'
import DatePickerQuarterHalfYearRange from './components/DatePickerQuarterHalfYearRange.vue'

import 'element-plus/es/components/date-picker/style/css'
import 'element-plus/es/components/calendar/style/css'

type DateType =
  | 'quarteryear'
  | 'halfyear'
  | 'quarteryearrange'
  | 'halfyearrange'
  | 'yearrange'

type DateModelType = string | number | Date

interface Props {
  type: DateType
  modelValue: DateModelType | [DateModelType, DateModelType]

  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  popperClass?: string
  rangeSeparator?: string
  prefixIcon?: Component
  clearIcon?: Component
  disabledDate?: (date: Date) => boolean
  cellClassName?: (date: Date) => string

  style?: StyleValue
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '选择日期',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  popperClass: '',
  rangeSeparator: '至',
  disabledDate: () => false,
  prefixIcon: Calendar,
  style: '',
})

const emits = defineEmits([
  'update:modelValue',
])

// handle style
const enhancedPopperClass = computed(() => {
  return `${props.popperClass} el-picker__popper p-0`
})

// 向下提供给输入框
provide('style', props.style)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="component-datepicker-enhanced" style="display: inline-block">
    <!-- 季度/半年度 -->
    <template v-if="['quarteryear', 'halfyear'].includes(props.type)">
      <DatePickerQuarterHalfYear
        :type="props.type as ('quarteryear' | 'halfyear')"
        :model-value="Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue"
        :placeholder="props.placeholder"
        :popper-class="enhancedPopperClass"
        :prefix-icon="props.prefixIcon"
        :disabled-date="props.disabledDate"
        @update:modelValue="emits('update:modelValue', $event)"
      />
    </template>

    <!-- 季度/半年度/年度范围 -->
    <template v-else-if="['quarteryearrange', 'halfyearrange', 'yearrange'].includes(props.type)">
      <DatePickerQuarterHalfYearRange
        :type="props.type as ('quarteryearrange' | 'halfyearrange' | 'yearrange')"
        :model-value="Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue, props.modelValue]"
        :start-placeholder="props.startPlaceholder"
        :end-placeholder="props.endPlaceholder"
        :popper-class="enhancedPopperClass"
        :range-separator="props.rangeSeparator"
        :prefix-icon="props.prefixIcon"
        :disabled-date="props.disabledDate"
        @update:modelValue="emits('update:modelValue', $event)"
      />
    </template>
  </div>
</template>

<style scoped>
.p-0 {
    padding: 0;
}

:deep() .cursor-not-allowed {
  cursor: not-allowed;
}

:deep() .pointer-events-none {
  pointer-events: none;
}
</style>
