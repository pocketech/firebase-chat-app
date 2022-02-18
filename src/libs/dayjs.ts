/* eslint-disable @typescript-eslint/naming-convention */
import Dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'
import isBetween from 'dayjs/plugin/isBetween'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import relativeTime from 'dayjs/plugin/relativeTime'

Dayjs.locale(ja)
Dayjs.extend(isBetween)
Dayjs.extend(relativeTime)
Dayjs.extend(isYesterday)
Dayjs.extend(isToday)

export const dayjs = Dayjs

export const DateFormat = {
  JpDate: 'YYYY年M月D日',
  JpDateTime: 'YYYY年M月D日 H:mm',
  JpMonthDate: 'M月D日',
  JpMonthDateTime: 'M月D日 H:mm',
  Time: 'H:mm',

  DatePeriod: 'YYYY.M.D',
  DateTimePeriod: 'YYYY.M.D (dd) H:mm',

  DateHyphen: 'YYYY-MM-DD',
  DateTimeSecondHyphen: 'YYYY-MM-DD H:mm:ss',
} as const

export const formatDateFromUTC = (utc: string | Date, format: keyof typeof DateFormat) => {
  return dayjs(utc).format(DateFormat[format])
}

export const formatMessageDividerDate = (date: string) => {
  if (dayjs(date).isYesterday()) return '昨日'
  if (dayjs(date).isToday()) return '今日'
  if (dayjs(date).year() < dayjs().year()) return formatDateFromUTC(date, 'JpDate')

  return formatDateFromUTC(date, 'JpMonthDate')
}
