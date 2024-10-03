import React from 'react'
import { StyleSheet, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights } from 'react-native-typography'

import { Divider } from '../../Components/Stateless'
import { Icon, ICON_TYPE } from '../../Icons'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/ViewStyles'
import useAuth from '../../Services/Auth'

const MenuItem = ({ icon, iconOrigin, title, onPress }) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={styles.menuItem}
      >
        <Block flex row>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            <Icon
              name={icon}
              size={20}
              origin={iconOrigin || ICON_TYPE.MATERIAL_COMMUNITY}
            />
          </Block>
          <Block row center flex={0.9}>
            <Text style={{ ...human.callout }}>
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    </>
  )
}

const MenuScreen = props => {
  const { logout } = useAuth()
  // const isUserLoggedIn = useStoreState(state => state.login.isUserLoggedIn)
  // const logout = useStoreActions(state => state.login.logoutUser)

  const renderMenuItems = () => (
    <>
      <MenuItem
        title='Profile'
        icon='account-circle-outline'
        onPress={() => NavigationService.navigate('Profile')}
      />
      <MenuItem
        title='Settings'
        icon='cog'
        onPress={() => NavigationService.navigate('Settings')}
      />
      <MenuItem
        title='Bookings'
        icon='calendar-check-outline'
        onPress={() => NavigationService.navigate('Bookings')}
      />
      <MenuItem
        title='Activities'
        icon='run'
        onPress={() => NavigationService.navigate('Activities')}
      />
      <MenuItem
        title='Surveys'
        icon='clipboard-text-outline'
        onPress={() => NavigationService.navigate('Surveys')}
      />
      <MenuItem
        title='Polls'
        icon='poll'
        onPress={() => NavigationService.navigate('Polls')}
      />
      <MenuItem
        title='Classifieds'
        icon='format-list-bulleted'
        onPress={() => NavigationService.navigate('Classifieds')}
      />
      <MenuItem
        title='UserClassifieds'
        icon='format-list-bulleted'
        onPress={() => NavigationService.navigate('UserClassified')}
      />
      {/* <Divider large /> */}
      <MenuItem
        title='Logout'
        icon='logout-variant'
        onPress={logout}
      />
    </>
  )

  return (
    <Block flex style={styles.container}>
      <ScrollView>
        <Block style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../../assets/images/logo.png')}
            resizeMode='contain'
          />
        </Block>
        <Block>
          <Divider />
          {renderMenuItems()}
        </Block>
      </ScrollView>
    </Block>
    // <Block flex style={viewStyles.mainContainer}>
    //   <ScrollView>
    //     <MenuItem
    //       label='Issues'
    //       icon='issue-opened'
    //       iconOrigin={ICON_TYPE.OCTICONS}
    //     />
    //     {isUserLoggedIn ? (
    //       <TouchableOpacity
    //         onPress={() => {
    //           logout()
    //           NavigationService.navigate('Home')
    //         }}
    //         style={styles.menuItem}
    //       >
    //         <Text style={{ ...human.subhead, color: iOSColors.gray }}>
    //           {t('signOut')}
    //         </Text>
    //       </TouchableOpacity>
    //     ) : (
    //       <></>
    //     )}
    //     <Overlay
    //       isVisible={isLocaleSelectionPanelVisible}
    //       onBackdropPress={() => setLocaleSelectionPanelVisibility(false)}
    //       width={200}
    //       height='auto'
    //     >
    //       <>{Object.values(LOCALES).map(locale => renderLocaleItem(locale))}</>
    //     </Overlay>
    //   </ScrollView>
    // </Block>
  )
}

MenuScreen.navigationOptions = ({ navigation, screenProps }) => {
  return {
    header: null
  }
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer
  },
  logoContainer: {
    height: 80,
    marginTop: galioTheme.SIZES.BASE * 4,
    paddingHorizontal: galioTheme.SIZES.BASE * 2,
    width: 200
  },
  // https://medium.com/the-react-native-log/tips-for-react-native-images-or-saying-goodbye-to-trial-and-error-b2baaf0a1a4d
  logo: {
    alignSelf: 'stretch',
    flex: 1,
    width: undefined,
    height: undefined
  },
  menuItem: {
    paddingVertical: galioTheme.SIZES.BASE,
    paddingHorizontal: galioTheme.SIZES.BASE
  }
})

export default MenuScreen
