import { StyleSheet, Platform } from 'react-native'
import { isAndroid } from '../Constants'
import metrics from '../Themes/Metrics'
import theme from '../Themes/configs/default'
import colors from '../Themes/Colors'
import elevationShadowStyle from '../Utils/ShadowStyle'
import { systemWeights, human, iOSColors } from 'react-native-typography'

export default StyleSheet.create({
  header: {
    height: 60
  },

  header_statusBar: {
    ...getHeaderInfo()
  },

  headerTitle: {
    width: (metrics.screenWidth * 2) / 3,
    fontWeight: '300'
  },

  navbarFlatSelector: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    ...elevationShadowStyle({ elevation: 20 })
  },

  tabBarUnderlineStyle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    height: 3
  },

  activeColor:{
      color: theme.colors.primary
  },

  tabStyle: {
    backgroundColor: '#fff',
    paddingVertical: 2,
  },

  activeTabStyle: {
    backgroundColor: '#fff'
  },

  tabTextStyle: {
    // fontSize: 8,
    ...human.subhead,
    ...systemWeights.semibold,
    color: iOSColors.gray
    // textTransform: 'uppercase'
  },

  activeTabTextStyle: {
    // fontSize: 8,
    ...human.subhead,
    ...systemWeights.semibold,
    color: theme.colors.primary
    // textTransform: 'uppercase'
  }
})

function getHeaderInfo () {
  return isAndroid && Platform.Version > 20
    ? {
      height: 90,
      elevation: 0,
      paddingTop: 30
    }
    : {
      height: 60
    }
}
