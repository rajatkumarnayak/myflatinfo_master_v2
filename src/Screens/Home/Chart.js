import React, { useState, useEffect } from 'react'
import { Dimensions, processColor } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { StackedAreaChart, XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import useTheme from '../../Themes/Context'

const { width } = Dimensions.get('screen')

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

const Chart = ({ navigation }) => {
  const { theme } = useTheme()
  const [chartData, setChartData] = useState({
    dataSets: [{
      values: [5, 40, 77, 81, 43],
      label: 'Income',
      config: {
        drawValues: true,
        colors: [processColor('lightseagreen')]
      }
    }, {
      values: [40, 5, 50, 23, 79],
      label: 'Expense',
      config: {
        drawValues: true,
        colors: [processColor('crimson')]
      }
    }],
    config: CHART_CONFIG
  })
  const [xAxis, setXAxis] = useState({
    valueFormatter: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    granularityEnabled: true,
    granularity: 1
  })

  const data = [
    {
      month: new Date(2015, 0, 1),
      apples: 3840,
      bananas: 1920
    },
    {
      month: new Date(2015, 1, 1),
      apples: 1600,
      bananas: 1440
    },
    {
      month: new Date(2015, 1, 1),
      apples: 1440,
      bananas: 1600
    },
    {
      month: new Date(2015, 2, 1),
      apples: 640,
      bananas: 960
    },
    {
      month: new Date(2015, 3, 1),
      apples: 3320,
      bananas: 480
    }
  ]

  const colors = ['#ff9aa2', '#b5ead7']
  const keys = ['apples', 'bananas']
  const svgs = [
    { onPress: () => console.log('apples') },
    { onPress: () => console.log('bananas') }
  ]

  useEffect(() => {
    // setChartData()
  }, [])

  return (
    <Block style={{ marginHorizontal: -galioTheme.SIZES.BASE }}>
      <StackedAreaChart
        style={{ height: 200, paddingVertical: 16 }}
        data={data}
        keys={keys}
        colors={colors}
        curve={shape.curveNatural}
        showGrid={false}
        svgs={svgs}
      />
      {/* <XAxis
        style={{ marginHorizontal: -10 }}
        data={ data }
        formatLabel={ (value, index) => index }
        contentInset={{ left: 10, right: 10 }}
        svg={{ fontSize: 10, fill: 'black' }}
      />       */}
      {/* <BarChart
        style={styles.chart}
        xAxis={xAxis}
        data={chartData}
        legend={CHART_LEGEND}
        drawValueAboveBar={false}
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

export default Chart
