import { computed, reactive, ref, watch, watchEffect } from 'vue'
import type { Ref } from 'vue'
import type { ElPopover } from 'element-plus'
import {
  getDateAbbrStr,
  parseDateAbbrStr,
  valiDateAbbrStr,
} from '../utils/dateStr'
import generateItems from '../utils/generateItems'
import type {
  DatePickerEnhancedPropsRequired,
  DatePickerPanelItem,
  DateTypeClear,
  OriginDate,
  OriginDateButSimple,
} from '../types'

type LocalModelValue = [number, number]

export function usePopover(props: DatePickerEnhancedPropsRequired): ElPopover {
  return reactive({
    trigger: 'click',
    placement: 'bottom',
    hideAfter: 0,
    transition: 'el-zoom-in-top',
    visible: false,
    popperClass: props.popperClass,
  })
}

function updateModelValue(emits: any, modelValue: OriginDate, newValue: OriginDateButSimple, itemClickTimesOrRange = 0) {
  let preUpdateModelValue
  if (Array.isArray(modelValue)) {
    preUpdateModelValue = [...modelValue]
    preUpdateModelValue[itemClickTimesOrRange] = newValue
  } else {
    preUpdateModelValue = newValue
  }

  emits('update:modelValue', preUpdateModelValue)
}

export default function useDatePickerEnhanced(
  props: DatePickerEnhancedPropsRequired,
  emits: any,
  itemClickTimes: Ref, // 主要针对范围面板时两次点击关闭面板
  range: 0 | 1 = 0, // 0 左面板 1 右面板
  existPopover: ElPopover = false,
  firstPanelTitle?: Ref<string>,
) {
  const typeWithoutRange = props.type.replace('range', '') as DateTypeClear

  // origin_date --> [2020, 1]
  const localModelValue = ref<[number, number]>([0, 0])
  const isLocalModelValueEmpty = computed(() => localModelValue.value.every(i => i === 0))

  // 避免值相同的情况下重新重新生成(针对其中一个面板选择完成时另一个面板重新生成)
  watchEffect(() => {
    const targetValue = Array.isArray(props.modelValue) ? props.modelValue[range] : props.modelValue
    const targetValueAbbrStr = getDateAbbrStr(typeWithoutRange, targetValue)
    const localModelValueAbbrStr = getDateAbbrStr(typeWithoutRange, localModelValue.value)

    if (targetValueAbbrStr === localModelValueAbbrStr) {
      return
    }

    const { test, exec } = valiDateAbbrStr(typeWithoutRange, targetValueAbbrStr)

    if (!test) {
      localModelValue.value = [0, 0]
    }

    localModelValue.value = (exec?.slice(1, 3).map(Number) as LocalModelValue) || [0, 0]
  })

  // popover prop
  const popover = existPopover || usePopover(props)

  // input prop
  const inputValue = computed({
    get() {
      if (isLocalModelValueEmpty.value) {
        return ''
      }

      return getDateAbbrStr(typeWithoutRange, localModelValue.value)
    },
    set(val) {
      if (val === '') {
        updateModelValue(emits, props.modelValue, val, range)
        return
      }

      console.log(val)
      const { test } = valiDateAbbrStr(typeWithoutRange, val)

      if (!test) {
        return
      }

      updateModelValue(emits, props.modelValue, parseDateAbbrStr(typeWithoutRange, val), range)
    },
  })

  // panel prop
  const panelValue = ref<LocalModelValue>(isLocalModelValueEmpty.value ? [new Date().getFullYear(), 1] : [...localModelValue.value]) // 操作所用; 重点：解构; 侦听再赋值
  const panelItems = ref<DatePickerPanelItem[]>([])
  const panelType = ref<DateTypeClear>(typeWithoutRange)
  const isYearPanel = computed(() => panelType.value === 'year')
  const panelStartYear = computed(() => Math.floor(panelValue.value[0] / 10) * 10)
  const panelStopYear = computed(() => panelStartYear.value + 9)
  const panelTitle = computed(() => {
    let title

    if (isYearPanel.value) {
      title = `${panelStartYear.value} - ${panelStopYear.value}`
    } else { // halfyear | quarteryear
      title = `${panelValue.value[0]}`
    }

    return title
  })

  // panel method
  const panelPrevClick = () => {
    isYearPanel.value
      ? panelValue.value[0] -= 10
      : panelValue.value[0] -= 1
  }
  const panelNextClick = () => {
    isYearPanel.value
      ? panelValue.value[0] += 10
      : panelValue.value[0] += 1
  }
  const panelItemClick = (item: DatePickerPanelItem) => {
    console.log('点击了 ==> ', item)

    if (item.isDisabled) {
      console.log('isDisabled')
      return
    }

    // 点击期望类型项时, (有效)点击次数 + 1
    if (panelType.value === typeWithoutRange) {
      itemClickTimes.value += 1
    }

    if (isYearPanel.value && typeWithoutRange !== 'year') {
      panelValue.value[0] = item.year
      panelType.value = typeWithoutRange
    } else {
      panelValue.value = [item.year, item[typeWithoutRange]] as LocalModelValue
    }
  }
  const panelTitleClick = () => {
    if (isYearPanel.value) {
      return
    }

    if (props.type.includes('range')) {
      return
    }

    panelType.value = 'year'
  }

  // 面板类型改变生成面板项目
  watch([panelType, panelTitle], () => {
    generatePanelItems()
  })

  // 面板值改变时同步改变传入数据值
  watch(panelValue, newV => {
    console.log('改变了日期 new old: ', [...newV], localModelValue.value)

    const dateParsed = parseDateAbbrStr(typeWithoutRange, panelValue.value)

    updateModelValue(emits, props.modelValue, dateParsed, itemClickTimes.value)

    // 非范围面板点击一次关闭面板, 范围面板点击两次关闭面板
    if (itemClickTimes.value === 1 || (itemClickTimes.value === 0 && !props.type.includes('range'))) {
      popover.visible = false
    }
  })

  // 传入数据值变动时同步改变面板值, 以打开后最新状态
  watch(localModelValue, () => {
    if (isLocalModelValueEmpty.value) {
      return
    }
    // 单独改变元素而非直接改变数组,阻止循环侦听
    panelValue.value[0] = localModelValue.value[0]
    panelValue.value[1] = localModelValue.value[1]
    generatePanelItems()
  })

  watch(() => popover.visible, (newValue: boolean) => {
    if (!newValue) {
      itemClickTimes.value = -1
    }

    if (newValue && firstPanelTitle && (Number(firstPanelTitle.value.slice(0, 4)) >= Number(panelTitle.value.slice(0, 4)))) {
      panelNextClick()
    }
  })

  // 生成面板项目
  function generatePanelItems() {
    panelItems.value = generateItems(
      panelType.value,
      panelValue.value[0],
      panelStartYear.value,
      isLocalModelValueEmpty.value ? panelValue.value : localModelValue.value,
      props.disabledDate,
    )
  }

  // 立即生成
  generatePanelItems()

  return {
    popover,
    inputValue,
    panelItems,
    panelTitle,
    panelPrevClick,
    panelNextClick,
    panelItemClick,
    panelTitleClick,
  }
}
