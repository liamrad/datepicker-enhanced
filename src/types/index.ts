import type { Component, StyleValue } from 'vue'
import type { DateModelType } from 'element-plus'

export type ExtraDateType =
  | 'quarteryear'
  | 'halfyear'
  | 'quarteryearrange'
  | 'halfyearrange'
  | 'yearrange'

export type DateType = ExtraDateType

export type DateTypeClear =
  | 'quarteryear'
  | 'halfyear'
  | 'year'

export interface DatePickerPanelItem {
  label: string
  year: number
  quarteryear?: number
  halfyear?: number
  isToday: boolean
  isCurrent: boolean
  isDisabled?: boolean
}

export interface DatePickerEnhancedProps {
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

export type DatePickerEnhancedPropsRequired = Required<DatePickerEnhancedProps>

export type OriginDateButSimple = string | number | Date
export type OriginDateButArray = [OriginDateButSimple, OriginDateButSimple]
export type OriginDate = OriginDateButSimple | OriginDateButArray
