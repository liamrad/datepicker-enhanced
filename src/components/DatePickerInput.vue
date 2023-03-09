<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Component, StyleValue } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder: string
  prefixIcon: Component
}>()

const emits = defineEmits(['update:modelValue'])

const PrefixIcon = props.prefixIcon

const style = inject<StyleValue>('style')

const value = computed({
  get: () => props.modelValue,
  set: (val: string) => emits('update:modelValue', val),
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div
    class="el-input el-input--prefix el-input--suffix el-date-editor el-date-editor--month el-tooltip__trigger el-tooltip__trigger"
    :style="style"
  >
    <div
      class="el-input__wrapper"
    >
      <span
        v-if="props.prefixIcon"
        class="el-input__prefix"
      >
        <span class="el-input__prefix-inner">
          <i class="el-icon el-input__icon el-range__icon">
            <PrefixIcon />
          </i>
        </span>
      </span>
      <input
        v-model="value"
        :placeholder="props.placeholder"
        class="el-input__inner"
        autocomplete="off"
        tabindex="0"
        type="text"
      >
      <span
        class="el-input__suffix"
      >
        <span
          class="el-input__suffix-inner"
        />
      </span>
    </div>
  </div>
</template>
