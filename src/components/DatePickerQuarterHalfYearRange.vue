<!-- eslint-disable import/order -->
<script setup lang="ts">
import { computed, inject, ref, watch, watchEffect } from 'vue'
import { ElPopover } from 'element-plus'
import type { Component } from 'vue'
import type { DateModelType } from 'element-plus'
import DatePickerPanelWrapper from './DatePickerPanelWrapper.vue'
import DatePickerPanel from './DatePickerPanel.vue'
import DatePickerInputRange from './DatePickerInputRange.vue'
import useDatePickerEnhanced from './useDatePickerEnhanced'
import type { DatePickerPanelItem } from '../types'

interface Props {
  type:
  | 'quarteryearrange'
  | 'halfyearrange'
  | 'yearrange'
  modelValue: [DateModelType, DateModelType]
  startPlaceholder: string
  endPlaceholder: string
  popperClass: string
  prefixIcon: Component
  disabledDate: (date: Date) => boolean
  rangeSeparator: string
}

const props = defineProps<Props>()

const emits = defineEmits(['update:modelValue'])

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
} = useDatePickerEnhanced(props as any, emits, itemClickTimes, 0, false)

const {
  inputValue: inputValueSecond,
  panelTitle: panelTitleSecond,
  panelItems: panelItemsSecond,
  panelPrevClick: panelPrevClickSecond,
  panelNextClick: panelNextClickSecond,
  panelItemClick: panelItemClickSecond,
  panelTitleClick: panelTitleClickSecond,
} = useDatePickerEnhanced(props as any, emits, itemClickTimes, 1, popover, panelTitle)

watch(
  () => props.modelValue,
  () => {
    // 如果选择中
    if (itemClickTimes.value !== -1) {
      return
    }
    // 如果两个值都存在的情况下,判断大小关系, 不符合则排序,小的在前大的在后
    if (!(props.modelValue[0] || props.modelValue[1])) {
      return
    }

    const [start, end] = props.modelValue
    if (new Date(start) > new Date(end)) {
      emits('update:modelValue', [end, start])
    }
  },
  { immediate: true },
)

watch(() => popover.visible, () => {
  // 面板关闭时排序
  if (popover.visible) {
    return
  }
  const [start, end] = props.modelValue
  if (new Date(start) > new Date(end)) {
    emits('update:modelValue', [end, start])
  }
})

// 范围面板左右箭头禁用
const isArrowDisabled = computed(() => {
  if (props.type === 'yearrange') {
    if (Number(panelTitle.value.slice(0, 4)) + 10 >= Number(panelTitleSecond.value.slice(0, 4))) {
      return true
    }
  } else {
    if (Number(panelTitle.value.slice(0, 4)) + 1 >= Number(panelTitleSecond.value.slice(0, 4))) {
      return true
    }
  }

  return false
})
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
    <!--  -->
    <template #reference>
      <DatePickerInputRange
        v-model:startModelValue="inputValue"
        v-model:endModelValue="inputValueSecond"
        :start-placeholder="props.startPlaceholder"
        :end-placeholder="props.endPlaceholder"
        :prefix-icon="props.prefixIcon"
        :range-separator="props.rangeSeparator"
      />
    </template>
    <!--  -->
    <template #default>
      <DatePickerPanelWrapper
        is-range
      >
        <template #range-left>
          <!-- left -->
          <DatePickerPanel
            class="el-date-range-picker__content is-left"
            :title="panelTitle"
            :items="panelItems"
            :is-arrow-disabled="isArrowDisabled && 'right'"
            @clickPrev="panelPrevClick"
            @clickNext="panelNextClick"
            @clickItem="panelItemClick"
            @clickTitle="panelTitleClick"
          />
        </template>

        <template #range-right>
          <!-- right -->
          <DatePickerPanel
            class="el-date-range-picker__content is-right"
            :title="panelTitleSecond"
            :items="panelItemsSecond"
            :is-arrow-disabled="isArrowDisabled && 'left'"
            @clickPrev="panelPrevClickSecond"
            @clickNext="panelNextClickSecond"
            @clickItem="panelItemClickSecond"
            @clickTitle="panelTitleClickSecond"
          />
        </template>
      </DatePickerPanelWrapper>
    </template>
  </ElPopover>
</template>
