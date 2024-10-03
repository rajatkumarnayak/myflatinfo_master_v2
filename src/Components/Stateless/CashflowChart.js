import React, { useEffect, useRef } from 'react'
import { Dimensions, Text, FlatList } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { StackedBarChart, BarChart, LineChart, XAxis } from 'react-native-svg-charts'
import { iOSColors, human } from 'react-native-typography'
import * as shape from 'd3-shape'
import check from 'check-types'

import useTheme from '../../Themes/Context'

const { width, height } = Dimensions.get('screen')

const CHART_LEGEND = {
  enabled: false,
  textSize: 10,
  form: 'SQUARE',
  formSize: 14,
  xEntrySpace: 10,
  yEntrySpace: 5,
  wordWrapEnabled: true
}

const CHART_CONFIG = {
  barWidth: 0.2,
  group: {
    fromX: 0,
    groupSpace: 0.1,
    barSpace: 0.05
  }
}

const CashflowChart = ({ navigation }) => {
  // https://github.com/JesperLekland/react-native-svg-charts/pull/239
  const data = [
    {
      data: [
        {
          month: new Date(2015, 0, 1),
          income: 3840
        },
        {
          month: new Date(2015, 1, 1),
          income: 1600
        },
        {
          month: new Date(2015, 2, 1),
          income: 640
        },
        {
          month: new Date(2015, 3, 1),
          income: 3320
        },
        {
          month: new Date(2015, 1, 1),
          income: 1600
        },
        {
          month: new Date(2015, 0, 1),
          income: 3840
        }]
    },
    {
      data: [
        {
          month: new Date(2015, 0, 1),
          expense: 1920
        },
        {
          month: new Date(2015, 1, 1),
          expense: 1440
        },
        {
          month: new Date(2015, 2, 1),
          expense: 960
        },
        {
          month: new Date(2015, 3, 1),
          expense: 480
        },
        {
          month: new Date(2015, 1, 1),
          expense: 1440
        },
        {
          month: new Date(2015, 0, 1),
          expense: 1920
        }]
    }
  ]
  const months = [{ month: 'Jan' }, { month: 'Feb' }, { month: 'Mar' }, { month: 'Apr' }, { month: 'May' }, { month: 'Jun' }]
  const colors = [[iOSColors.blue], [iOSColors.pink]]
  const keys = [['income'], ['expense']]

  useEffect(() => {
    // setChartData()
  }, [])

  return (
    <Block style={{ marginHorizontal: -galioTheme.SIZES.BASE }}>
      <StackedBarChart
        style={{ height: 200 }}
        keys={keys}
        colors={colors}
        data={data}
        xAccessor={({ item }) => item.month}
        showGrid
        spacingInner={0.3}
        spacingOuter={0.5}
        svg={{ stroke: 'rgb(134, 65, 244)' }}
        contentInset={{ top: 20, bottom: 20 }}
        animate
      />
      <FlatList
        data={months}
        keyExtractor={item => item}
        renderItem={({ item, index }) => (
          <Text style={{ ...human.caption1, color: iOSColors.gray }}>{item.month}</Text>
        )}
        horizontal
        contentContainerStyle={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20 }}
      />
      {/* <XAxis
        data={data[0].data}
        xAccessor={({ item }) => item.month}
        formatLabel={(value, index) => {
          console.log(value);
          // dateFns.format(value, 'LLL yy')
          return value.toString().substr(4, 3)
        }}
        spacingInner={0.3}
        spacingOuter={0.5}
        contentInset={{ top: 20, bottom: 20 }}
        svg={{ fontSize: 10, fill: 'black' }}
      /> */}
    </Block>
  )
}

const styles = {
  chart: {
    height: 200,
    width: width - (galioTheme.SIZES.BASE * 2)
  }
}

export default CashflowChart
