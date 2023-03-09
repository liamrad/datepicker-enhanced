<!-- eslint-disable import/order -->
<script setup lang="ts">
import { inject, ref, watchEffect } from 'vue'
import { ElPopover } from 'element-plus'
import type { Component, Ref } from 'vue'
import type { DateModelType } from 'element-plus'
import DatePickerPanelWrapper from './DatePickerPanelWrapper.vue'
import DatePickerPanel from './DatePickerPanel.vue'
import DatePickerInput from './DatePickerInput.vue'
import useDatePickerEnhanced from './useDatePickerEnhanced'

interface Props {
  type: 'quarteryear' | 'halfyear'
  modelValue: DateModelType
  placeholder: string
  popperClass: string
  prefixIcon: Component
  disabledDate: (date: Date) => boolean
}

const props = defineProps<Props>()

const emits = defineEmits([
  'update:modelValue',
])

// 0 表示点击一次，1 表示点击两次(为了对齐range的逻辑)
const itemClickTimes = ref(-1)

const {
  popover,
  inputValue,
  panelTitle,
  panelItems,
  panelPrevClick,
  panelNextClick,
  panelItemClick,
  panelTitleClick,
} = useDatePickerEnhanced(props as any, emits, itemClickTimes)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ElPopover
    width="auto"
    v-bind="popover"
    @update:visible="popover.visible = $event"
  >
    <template #reference>
      <DatePickerInput
        v-model:modelValue="inputValue"
        :placeholder="props.placeholder"
        :prefix-icon="props.prefixIcon"
      />
    </template>

    <template #default>
      <DatePickerPanelWrapper>
        <template #default>
          <DatePickerPanel
            :title="panelTitle"
            :items="panelItems"
            @clickPrev="panelPrevClick"
            @clickNext="panelNextClick"
            @clickItem="panelItemClick"
            @clickTitle="panelTitleClick"
          />
        </template>
      </DatePickerPanelWrapper>
    </template>
  </ElPopover>
</template>
