import { StyleSheet, Dimensions } from 'react-native'
import { theme as galioTheme } from 'galio-framework'
import colors from '../Themes/Colors'
import metrics from '../Themes/Metrics'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import elevationShadowStyle from '../Utils/ShadowStyle'

const { width, height } = Dimensions.get('window')

const viewStyles = StyleSheet.create({
  container: {
    flex: 1
  },

  section: {
    padding: metrics.s20
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  rowSpread: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  justifyCenter: {
    justifyContent: 'center'
  },

  mainContainer: {
    backgroundColor: colors.grey100,
    flex: 1,
    flexGrow: 1
  },

  linkText: {
    color: iOSColors.blue,
    textDecorationLine: 'underline'
  },

  mainPanelHeaderBg: {
    height: 120
  },

  mainPanelHeaderFg: {
    justifyContent: 'center',
    marginLeft: galioTheme.SIZES.BASE
  },

  mainPanel: {
    backgroundColor: colors.grey100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    marginTop: -galioTheme.SIZES.BASE,
    paddingTop: galioTheme.SIZES.BASE,
    paddingBottom: galioTheme.SIZES.BASE * 2,
    paddingHorizontal: galioTheme.SIZES.BASE,
    ...elevationShadowStyle({ elevation: 6 })
  },

  pickerTextStyle: {
    ...human.caption1
  },

  pickerContainer: {
    borderRadius: 6,
    height: 50,
    width: undefined,
    ...elevationShadowStyle({ elevation: 2 })
  },

  noDataRefreshButton: {
    paddingVertical: 5,
    width: 100
  },

  fullScreenCalendar: {
    backgroundColor: colors.grey100
  },

  submitButtonContainer: {
    alignItems: 'center',
  marginHorizontal: '5%',
    borderRadius: galioTheme.SIZES.BASE * 2,
    marginVertical: galioTheme.SIZES.BASE,
    position: 'absolute',
    bottom: 0,
    width: '90%',
    ...elevationShadowStyle({ elevation: 6, backgroundColor: 'transparent' })
  },

  bottomModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 360,
    margin: 0,
    padding: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },

  modalContent: {
    margin: 30
  },

  modalHeading: {
    ...human.body,
    ...systemWeights.bold,
    marginHorizontal: 30,
    marginTop: 30
  },

  modalHeadingSmall: {
    ...human.body,
    ...systemWeights.bold,
    marginHorizontal: 30,
    marginTop: 30
  },

  settingGroupTitle: {
    ...human.caption1,
    color: iOSColors.gray,
    margin: galioTheme.SIZES.BASE,
    marginBottom: -galioTheme.SIZES.BASE / 2
  },

  settingGroup: {
    backgroundColor: colors.white,
    borderRadius: galioTheme.SIZES.BASE / 2,
    margin: galioTheme.SIZES.BASE,
    marginBottom: galioTheme.SIZES.BASE / 2,
    ...elevationShadowStyle({ elevation: 6 })
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: galioTheme.SIZES.BASE
  }
})

export default viewStyles
