import type { DateTypeClear, OriginDateButSimple } from '../types'
import { DATE_ABBR, DATE_FORMAT } from './constant'
import dayjs from './dayjs'

// `年度/半年度/季度`日期缩写正则
const yearReg = /^(\d{4})$/
const halfyearReg = new RegExp(`^(\\d{4})-${DATE_ABBR.halfyear}([1-2])$`)
const quarteryearReg = new RegExp(`^(\\d{4})-${DATE_ABBR.quarteryear}([1-4])$`)

// origin_date --> '2020'
// origin_date --> '2020-H1'
// origin_date --> '2020-Q1'
// [2020, 1] --> '2020'
// [2020, 1] --> '2020-H1'
// [2020, 1] --> '2020-Q1'
export function getDateAbbrStr(type: DateTypeClear, date: OriginDateButSimple | [number, number]) {
  if (Array.isArray(date)) {
    return getDateAbbrStrFromArray(type, date as [number, number])
  }

  const dateStr = dayjs(date).format(DATE_FORMAT)
  const dateArr = dateStr.split('-').map(Number)

  const year = dateArr[0]
  const month = dateArr[1]
  const halfyear = Math.ceil(month / 6)
  const quarteryear = Math.ceil(month / 3)

  let dateAbbrStr = ''

  switch (type) {
    case 'year':
      dateAbbrStr = getDateAbbrStrFromArray(type, [year, 0])
      break
    case 'halfyear':
      dateAbbrStr = getDateAbbrStrFromArray(type, [year, halfyear])
      break
    case 'quarteryear':
      dateAbbrStr = getDateAbbrStrFromArray(type, [year, quarteryear])
      break
    default:
      break
  }

  return dateAbbrStr
}

// [2020] --> '2020'
// [2020, 1] --> '2020-H1'
// [2020, 1] --> '2020-Q1'
function getDateAbbrStrFromArray(type: DateTypeClear, date: [number, number]) {
  let dateAbbrStr = ''

  switch (type) {
    case 'year':
      dateAbbrStr = `${date[0]}`
      break
    case 'halfyear':
      dateAbbrStr = `${date[0]}-${DATE_ABBR[type]}${date[1]}`
      break
    case 'quarteryear':
      dateAbbrStr = `${date[0]}-${DATE_ABBR[type]}${date[1]}`
      break
    default:
      break
  }

  return dateAbbrStr
}

// '2020'    --> '2020-01-01'
// '2020-H2' --> '2020-07-01'
// '2020-Q2' --> '2020-04-01'
// [2020, 1] --> '2020-01-01'
export function parseDateAbbrStr(type: DateTypeClear, date: string | [number, number]) {
  if (Array.isArray(date)) {
    return parseDateAbbrStrFromArr(type, date as [number, number])
  }

  const { test, exec } = valiDateAbbrStr(type, date)

  if (!test) {
    return ''
  }

  let dateStr: string

  switch (type) {
    case 'year':
      dateStr = parseDateAbbrStrFromArr(type, [Number(exec?.[1]), 0])
      break
    case 'halfyear':
      dateStr = parseDateAbbrStrFromArr(type, [Number(exec?.[1]), Number(exec?.[2])])
      break
    case 'quarteryear':
      dateStr = parseDateAbbrStrFromArr(type, [Number(exec?.[1]), Number(exec?.[2])])
      break
    default:
      dateStr = ''
      break
  }

  return dateStr
}

// [2020, 1] --> '2020-01-01'
function parseDateAbbrStrFromArr(type: DateTypeClear, date: [number, number]) {
  let dateStr: string

  switch (type) {
    case 'year':
      dateStr = `${date[0]}-01-01`
      break
    case 'halfyear':
      dateStr = `${date[0]}-${(date[1] - 1) * 6 + 1}-01`
      break
    case 'quarteryear':
      dateStr = `${date[0]}-${(date[1] - 1) * 3 + 1}-01`
      break
    default:
      dateStr = ''
      break
  }

  return dateStr
}

// 验证`年度/半年度/季度`日期缩写字符串是否符合期望的格式
export function valiDateAbbrStr(type: DateTypeClear, date: string) {
  let test = false
  let exec: RegExpExecArray | null = null

  switch (type) {
    case 'year':
      test = yearReg.test(date)
      test && (exec = yearReg.exec(date))
      break
    case 'halfyear':
      test = halfyearReg.test(date)
      test && (exec = halfyearReg.exec(date))
      break
    case 'quarteryear':
      test = quarteryearReg.test(date)
      test && (exec = quarteryearReg.exec(date))
      break
    default:
      test = false
      exec = null
      break
  }

  return {
    test,
    exec,
  }
}
