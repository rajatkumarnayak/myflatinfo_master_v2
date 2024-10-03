// import RNFetchBlob from 'rn-fetch-blob'
import check from 'check-types'
import moment from 'moment'

import { CALENDAR_DATE_FORMAT, GENERAL_DAY_DISPLAY_FORMAT } from '../Constants'

export const formattedMoney = (number) => Number(number).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,').split('.')[0]

export const formattedDate = (dateString, formatsObj) => {
  if (check.not.assigned(dateString)) {
    return dateString
  }

  if (check.assigned(formatsObj)) {
    const { inputFormat, outputFormat } = formatsObj

    if (check.assigned(inputFormat) && check.assigned(outputFormat)) {
      return moment(dateString, inputFormat).format(outputFormat)
    } else if (check.assigned(inputFormat)) {
      return moment(dateString, inputFormat).format(GENERAL_DAY_DISPLAY_FORMAT)
    } else {
      return moment(dateString, CALENDAR_DATE_FORMAT).format(outputFormat)
    }
  }

  return moment(dateString, CALENDAR_DATE_FORMAT).format(GENERAL_DAY_DISPLAY_FORMAT)
}

export const downloadFile = ({ url, fileName, path }) => {
  const urlParts = url.split('/')
  const _fileName = fileName || urlParts[urlParts.length - 1]
  // const _path = (path || RNFetchBlob.fs.dirs.DownloadDir) + '/' + _fileName
  const _path = (path) + '/' + _fileName

  const options = {
    fileCache: true,
    // android only options, these options be a no-op on IOS
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path: _path
      // description: 'Image'
    }
  }
  // RNFetchBlob
  //   .config(options)
  //   .fetch('GET', url).then((res) => {
  //     alert('Success Downloaded')
  //   })
}

export const enumerateDaysBetweenDates = function (startDate, endDate, outputDateFormat) {
  const now = moment(startDate).clone()
  const dates = []

  while (now.isSameOrBefore(moment(endDate))) {
    dates.push(now.format(outputDateFormat || 'YYYY-MM-DD'))
    now.add(1, 'days')
  }
  return dates
}

export const enumerateEventsByDate = (acc, cur, idx, src) => {
  const startDate = moment(cur.startDate)
  const endDate = moment(cur.endDate)
  const dateRun = startDate.clone()

  while (dateRun.isSameOrBefore(endDate)) {
    acc.push({
      date: dateRun.format(CALENDAR_DATE_FORMAT),
      data: {
        ...cur,
        startingDay: dateRun.isSame(startDate),
        endingDay: dateRun.isSame(endDate)
      }
    })
    dateRun.add(1, 'days')
  }

  return acc.sort((a, b) => moment(a.date).unix() - moment(b.date).unix())
}

export const groupEventsByDate = (acc, currentItem, idx, src) => {
  const { date, data } = currentItem
  const isDatePresentInAccumulator = check.emptyArray(acc)
    ? false
    : acc.some(item => item.date === date)

  // find if the date is already saved in the accumulator
  if (!isDatePresentInAccumulator) {
    // if not already saved, add the date and a 'data' list containing the single current item into the accumulator
    acc.push({ date, data: [data] })
  } else {
    // if already saved, then find the item whose date matches the date and add the current item into the 'data' field
    acc.find(item => item.date === date).data.push(data)
  }

  return acc
}

export const enumerateTimeDuration = (minute) => {
  const items = []
  if (minute === 60) {
    new Array(24).fill().forEach((acc, index) => {
      items.push(moment({ hour: index }).format('HH:mm'))
    })
    return items
  } else {
    new Array(24).fill().forEach((acc, index) => {
      items.push(moment({ hour: index }).format('HH:mm'))
      items.push(moment({ hour: index, minute: minute || 30 }).format('HH:mm'))
    })
    return items
  }
}

export const enumerateTimePairs = (minute) => {
  const items = enumerateTimeDuration(minute)

  const createPairs = (acc, cur, idx, src) => {
    if (acc.length === 0) {
      acc.push([cur])
    } else {
      acc.push([cur])
      acc[idx - 1].push(cur)
    }

    if (idx === src.length - 1) {
      acc[idx].push(acc[0][0])
    }

    return acc
  }

  return items.reduce(createPairs, [])
}
