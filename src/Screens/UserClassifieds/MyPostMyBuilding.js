
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { ButtonGroup } from 'react-native-elements'
import { useStoreActions, useStoreState } from 'easy-peasy'

import { Navbar, Listing, NoData } from '../../Components/Stateless'
import UserClassifiedListItemContent from './UserClassifiedListItemContent'
import viewStyles from '../../Styles/ViewStyles'
import NavigationService from '../../Navigation'
import useTheme from '../../Themes/Context'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import { Searchbar } from 'react-native-paper';


const MyPostMyBuilding = (props) => {
  const { theme } = useTheme()

const dataValue = props
console.log(dataValue ,"dataValue >>>>");

  const load = useStoreActions(actions => actions.userClassifieds.loadUserMyPostData)
  

  const { userData: data, status } = useStoreState(state => ({ ...state.userClassifieds }))
      console.log(data ,status ,"data >>>>  my posts");
  const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0)

  // const innerTabs = [
  //   {
  //     element: () => <Text style={{ color: selectedInnerTabIndex === 0 ? colors.white : theme.colors.primary }}>Rent</Text>
  //   },
  //   {
  //     element: () => <Text style={{ color: selectedInnerTabIndex === 1 ? colors.white : theme.colors.primary }}>Purchase</Text>
  //   },
  //   // {
  //   //   element: () => <Text style={{ color: selectedInnerTabIndex === 2 ? colors.white : theme.colors.primary }}>Completed</Text>
  //   // }
  // ]

  const onLoad = () => {
    return load()
  }

  const onPressItem = (item) => {
    NavigationService.navigate('ClassfiedDetails', { item })
  }

  const renderHeader = () => {
    return (
      <ButtonGroup
        // onPress={(index) => setSelectedInnerTabIndex(index)}
        // selectedIndex={selectedInnerTabIndex}
        buttons={innerTabs}
        selectedButtonStyle={{ backgroundColor: theme.colors.primary }}
        containerStyle={[styles.buttonGroupContainer, { borderColor: theme.colors.primary }]}
      />
    )
  }

  const renderNoData = () => {
    return (
      <Block>
        {/* {renderHeader()} */}
        <NoData text='No posts found' />
      </Block>
    )
  }

  const renderContent = () => {

     const reverseData = data.reverse().filter((item)  => {
       return item.scope === 2
      })
      console.log(reverseData,'reverseData')
      return (
        <Listing
          //items={data.reverse().filter(item => item.scope === 2)}
          items={reverseData}
          onLoad={onLoad}
           onPressItem={onPressItem}
          networkStatus={status}
          itemContentComponent={(item) => <UserClassifiedListItemContent data={item} />}
          noDataComponent={renderNoData}
          // ListHeaderComponent={renderHeader}
        />
      )
    

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

    // return (
    //   <Listing
    //      items={data.filter(item => item.propertyType === 1)}
    //     onLoad={onLoad}
    //      onPressItem={onPressItem}
    //      networkStatus={status}
    //      itemContentComponent={(item) => <UserClassifiedListItemContent data={item} />}
    //     noDataComponent={renderNoData}
    //     ListHeaderComponent={renderHeader}
    //   />
    // )
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <Block style={viewStyles.mainContainer}>
 <Block style={{marginLeft:15,marginRight:15,marginTop:10,marginBottom:5}}>
        <Searchbar
      placeholder="Search"
      // onChangeText={onChangeSearch}
      // value={searchQuery}
    />
        </Block>

      {renderContent()}
    </Block>
  )
}

MyPostMyBuilding.navigationOptions = ({ navigation }) => {
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

export default MyPostMyBuilding


