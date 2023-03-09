import type { DateTypeClear } from '../types'

export const DATE_ABBR: Record<DateTypeClear, string> = {
  year: 'Y',
  halfyear: 'H',
  quarteryear: 'Q',
}

export const HALFYEAR_Enum = ['上半年', '下半年']

export const QUARTERYEAR_ENUM = ['第一季度', '第二季度', '第三季度', '第四季度']

export const DATE_FORMAT = 'YYYY-MM-DD'

export const DATE_TYPE: DateTypeClear[] = [
  'year', 'halfyear', 'quarteryear',
]
