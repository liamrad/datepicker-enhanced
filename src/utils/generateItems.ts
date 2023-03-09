import { DATE_ABBR } from '../utils/constant'
import type {
  DatePickerPanelItem,
  DateTypeClear,
} from '../types'

// 生成视图数据
export default function generateItems(
  panelType: DateTypeClear,
  panelYear: number,
  panelStartYear: number,
  datepickerValue: [number, number],
  disabledDate: (date: Date) => boolean,
) {
  let items: DatePickerPanelItem[] = []

  const curDate = new Date()
  const current = {
    year: curDate.getFullYear(),
    month: curDate.getMonth() + 1,
    quarteryear: Math.ceil(curDate.getMonth() / 3),
    halfyear: Math.ceil(curDate.getMonth() / 6),
  }

  if (panelType === 'year') { // 年度
    items = Array(10).fill(0).map((_cur, idx): DatePickerPanelItem => {
      const year = panelStartYear + idx

      return {
        label: `${year}`,
        year,
        isToday: year === current.year,
        isCurrent: year === datepickerValue[0],
        isDisabled: disabledDate(new Date(`${year}`)),
      }
    })
  } else if (panelType === 'halfyear') { // 半年
    items = Array(2).fill(0).map((_cur, idx): DatePickerPanelItem => {
      const year = panelYear
      const halfyear = idx + 1

      return {
        label: `${DATE_ABBR.halfyear}${halfyear}`,
        year,
        halfyear,
        isToday: year === current.year && halfyear === current.halfyear,
        isCurrent: year === datepickerValue[0] && halfyear === datepickerValue[1],
        isDisabled: disabledDate(new Date(`${year}-${idx * 6 + 1}`)),
      }
    })
  } else if (panelType === 'quarteryear') { // 季度
    items = Array(4).fill(0).map((_cur, idx): DatePickerPanelItem => {
      const year = panelYear
      const quarteryear = idx + 1

      return {
        label: `${DATE_ABBR.quarteryear}${quarteryear}`,
        year,
        quarteryear,
        isToday: year === current.year && quarteryear === current.quarteryear,
        isCurrent: year === datepickerValue[0] && quarteryear === datepickerValue[1],
        isDisabled: disabledDate(new Date(`${year}-${idx * 3 + 1}`)),
      }
    })
  } else {
    items = []
  }

  return items
}
