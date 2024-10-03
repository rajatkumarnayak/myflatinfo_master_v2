import React, { useState, useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { ButtonGroup } from 'react-native-elements'
import { useStoreActions, useStoreState } from 'easy-peasy'

import { Navbar, Listing, NoData } from '../../Components/Stateless'
 import UserClassifiedContent from './UserClassifiedContent'
import viewStyles from '../../Styles/ViewStyles'
import NavigationService from '../../Navigation'
import useTheme from '../../Themes/Context'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const BrowseClassifieds = (props) => {
  const { theme } = useTheme()

  const dataValue = props
  console.log(dataValue , "dataValue >>>>>");

  const load = useStoreActions(actions => actions.userClassifieds.loadAllData)
  

  const { allData: data, status } = useStoreState(state => ({ ...state.userClassifieds }))
  console.log(data ,"uiser classisfge");
//  console.log(data ,status ,"data >>>>");
  const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0)

  const innerTabs = [
    {
      element: () => <Text style={{ color: selectedInnerTabIndex === 0 ? colors.white : theme.colors.primary }}>Rent</Text>
    },
    {
      element: () => <Text style={{ color: selectedInnerTabIndex === 1 ? colors.white : theme.colors.primary }}>Purchase</Text>
    },
    // {
    //   element: () => <Text style={{ color: selectedInnerTabIndex === 2 ? colors.white : theme.colors.primary }}>Completed</Text>
    // }
  ]

  const onLoad = () => {
    return load()
  }

  const onPressItem = (item) => {
    NavigationService.navigate('ClassfiedDetails', { item })
  }

  const renderHeader = () => {
    return (
      <ButtonGroup
        onPress={(index) => setSelectedInnerTabIndex(index)}
        selectedIndex={selectedInnerTabIndex}
        buttons={innerTabs}
        selectedButtonStyle={{ backgroundColor: theme.colors.primary }}
        containerStyle={[styles.buttonGroupContainer, { borderColor: theme.colors.primary }]}
      />
    )
  }

  const renderNoData = () => {
    return (
      <Block>
        {renderHeader()}
        <NoData text='No projects found' />
      </Block>
    )
  }

  const renderContent = () => {
    if (selectedInnerTabIndex === 1) {
     console.log(data, 'buillll')
      return (
        <Listing
          items={data.filter(item => item.propertyType === 2)}
          onLoad={onLoad}
           onPressItem={onPressItem}
          networkStatus={status}
           itemContentComponent={(item) => <UserClassifiedContent data={item} />}
          noDataComponent={renderNoData}
          ListHeaderComponent={renderHeader}
        />
      )
    }

    // if (selectedInnerTabIndex === 2) {
    //   return (
    //     <Listing
    //    items={data.filter(item => item.projectStatus === 'completed')}
    //       onLoad={onLoad}
    //    onPressItem={onPressItem}
    //    networkStatus={status}
    //     //    itemContentComponent={(item) => <ClassifiedListItemContent data={item} />}
    //       noDataComponent={renderNoData}
    //       ListHeaderComponent={renderHeader}
    //     />
    //   )
    // }

    return (
      <Listing
         items={data.filter(item => item.propertyType === 1)}
        onLoad={onLoad}
         onPressItem={onPressItem}
         networkStatus={status}
        itemContentComponent={(item) => <UserClassifiedContent data={item} />}
        noDataComponent={renderNoData}
        ListHeaderComponent={renderHeader}
      />
    )
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <Block style={viewStyles.mainContainer}>
      {renderContent()}
    </Block>
  )
}

BrowseClassifieds.navigationOptions = ({ navigation }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.goBack()}
      />
    )
  }
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

export default BrowseClassifieds

