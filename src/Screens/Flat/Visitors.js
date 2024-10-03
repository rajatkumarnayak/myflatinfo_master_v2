import React, { useState } from 'react'
import { StyleSheet, Text, ScrollView } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { ButtonGroup } from 'react-native-elements'

import { FloatingActionButton } from '../../Components/Stateless'
import { VisitorListing, GatepassListing } from '../../Components/Stateful'
import NavigationService from '../../Navigation'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import colors from '../../Themes/Colors'
import useTheme from '../../Themes/Context'
import viewStyles from '../../Styles/ViewStyles'

const VisitorsScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0)

  const innerTabs = [{
    element: () => <Text style={{ color: selectedInnerTabIndex === 0 ? colors.white : theme.colors.primary }}>Visitors</Text>
  }, {
    element: () => <Text style={{ color: selectedInnerTabIndex === 1 ? colors.white : theme.colors.primary }}>Gate Passes</Text>
  }]

  // useEffect(() => {
  //   if (check.assigned(flat)) {
  //     loadVisitorList({ startDate: null, endDate: null })
  //   }
  // }, [flat])

  return (
    <Block style={viewStyles.mainContainer}>
      <ScrollView style={styles.scrollContainer}>
        <ButtonGroup
          onPress={(index) => setSelectedInnerTabIndex(index)}
          selectedIndex={selectedInnerTabIndex}
          buttons={innerTabs}
          selectedButtonStyle={{ backgroundColor: theme.colors.primary }}
          containerStyle={[styles.buttonGroupContainer, { borderColor: theme.colors.primary }]}
        />
        {
          selectedInnerTabIndex === 0 ? <VisitorListing /> : <GatepassListing />
        }
      </ScrollView>
      
      <FloatingActionButton
        color={theme.colors.primary}
        onPress={() => NavigationService.navigate('NewGatepass')}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexGrow: 1,
    paddingBottom: 100
  },
  buttonGroupContainer: {
    borderWidth: 2,
    borderRadius: 6,
    marginTop: galioTheme.SIZES.BASE,
    marginLeft: galioTheme.SIZES.BASE,
    marginRight: galioTheme.SIZES.BASE,
    ...elevationShadowStyle({ elevation: 2 })
  }
})

export default VisitorsScreen
