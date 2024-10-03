import React, { useEffect } from 'react'
import {
  createStackNavigator,
  createSwitchNavigator,
  // createDrawerNavigator,
  createBottomTabNavigator,
  createAppContainer
} from '@react-navigation/native'

import Routes from './Routes'
import { Icon, ICON_TYPE } from '../Icons'
import colors from '../Themes/Colors'
import elevationShadowStyle from '../Utils/ShadowStyle'

import ProfileScreen from '../Screens/Profile'
import AppUpdate from '../Screens/AppUpdate'
import AppIntroScreen from '../Screens/AppIntro'
import LaunchScreen from '../Screens/Launch'
import LoginScreen from '../Screens/Login'
import HomeScreen from '../Screens/Home'
import FlatScreen from '../Screens/Flat'
import VisitorItemScreen from '../Screens/Flat/Visitor'
import NewGatepassScreen from '../Screens/Flat/NewGatepass'
import AccountsScreen from '../Screens/Accounts'
import MaintenanceItemScreen from '../Screens/Accounts/Maintenance'
import Other  from '../Screens/Accounts/Other'
import DonationItemScreen from '../Screens/Accounts/Donation'
import DonationsScreen from '../Screens/Accounts/Donations'
// DonationsScreen
import NewDonationScreen from '../Screens/Accounts/NewDonation'
import CorpusItemScreen from '../Screens/Accounts/Corpus'
import IssuesScreen from '../Screens/Issues'
import IssueScreen from '../Screens/Issues/Issue'
import NewIssueScreen from '../Screens/Issues/NewIssue'
import MenuScreen from '../Screens/Menu'
import BookingsScreen from '../Screens/Bookings'
import BookingScreen from '../Screens/Bookings/Booking'
import NewBookingScreen from '../Screens/Bookings/NewBooking'
import ActivitiesScreen from '../Screens/Activities'
import ActivityScreen from '../Screens/Activities/Activity'
import NewActivityScreen from '../Screens/Activities/NewActivity'
import EditActivityScreen from '../Screens/Activities/EditActivity'
import SurveysScreen from '../Screens/Surveys'
import SurveyScreen from '../Screens/Surveys/Survey'
import PollsScreen from '../Screens/Polls'
import PollScreen from '../Screens/Polls/Poll'
import Settings from '../Screens/Settings'
import ClassifiedsScreen from '../Screens/Classifieds'
import ClassifiedScreen from '../Screens/Classifieds/Classified'
import SellClassifieds from '../Screens/UserClassifieds/UserClassifieds'
import SellFormScreen from '../Screens/UserClassifieds/SellForm'
import UserClassifiedsScreen from '../Screens/UserClassifieds/UserClassifiedsDetails'
import EditUserClassifiedForm from '../Screens/UserClassifieds/EditUserClassifiedForm'
import SecurityScreen from '../Screens/SecurityDashboard'
// import DetailPage from '../Screens/UserClassifieds/UserClassifiedsDetails'UserClassifiedContent
// import AsyncStorage from '@react-native-async-storage/async-storage'
import CreatePass from '../Screens/SecurityDashboard/CreatePass'
import InitialScreen  from '../Screens/InitialScreen'


// const getUserid=()=>{
//   console.log('ganesh');
// }
//  

const FlatStack = createStackNavigator(
  {
    Flat: {
      screen: FlatScreen,
      params: { navbarTitle: 'myflatinfo' }
    },
    Visitor: {
      screen: VisitorItemScreen,
      params: { navbarTitle: 'Visitor' }
    },
    NewGatepass: {
      screen: NewGatepassScreen,
      params: { navbarTitle: 'New Gate Pass' }
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

const AccountsStack = createStackNavigator(
  {
    Accounts: {
      screen: AccountsScreen,
      params: { navbarTitle: 'Accounts' }
    },
    Maintenance: {
      screen: MaintenanceItemScreen,
      params: { navbarTitle: 'Maintenance' }
    },
    Donation: {
      screen: DonationItemScreen,
      params: { navbarTitle: 'Event' }
     },
    // Donations:{
    //   screen: DonationsScreen,
    //   params: { navbarTitle: 'Event' }
    // },
    NewDonation: {
      screen: NewDonationScreen,
      // params: { navbarTitle: 'Event' }
    },
    Corpus: {
      screen: CorpusItemScreen,
      params: { navbarTitle: 'Corpus' }
    },
    Other:{
      screen :Other,
      params: { navbarTitle: 'Essential'}
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

const IssuesStack = createStackNavigator({
  Issues: {
    screen: IssuesScreen,
    params: { navbarTitle: 'Issues' }
  },
  Issue: {
    screen: IssueScreen,
    params: { navbarTitle: 'Issue' }
  },
  NewIssue: {
    screen: NewIssueScreen,
    params: { navbarTitle: 'New Issue' }
  }
})

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    params: { navbarTitle: 'Profile' }
  }
})

const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    params: { navbarTitle: 'Settings' }
  }
})

const UserClassifiedStack = createStackNavigator({
  UserClassified: {
    screen: SellClassifieds,
    params: { navbarTitle: 'User Classified' }
  },
  SellClassified: {
    screen: SellFormScreen,
    params: { navbarTitle: 'Sell' }
  },
 ClassfiedDetails: {
    screen : UserClassifiedsScreen,
    parmas : {navbarTitle : 'User Classifieds'}
 },
 EditClassifedForm: {
   screen:EditUserClassifiedForm,
   params: {navbarTitle : 'Edit Form'}
 }
  // ClassifiedDetail: {
  //   screen : DetailPage,
  //   params: { navbarTitle: 'Sell' }
  // }
 
  
})

const BookingsStack = createStackNavigator({
  Bookings: {
    screen: BookingsScreen,
    params: { navbarTitle: 'Bookings' }
  },
  Booking: {
    screen: BookingScreen,
    params: { navbarTitle: 'Booking' }
  },
  NewBooking: {
    screen: NewBookingScreen,
    params: { navbarTitle: 'New Booking' }
  }
})

const ActivitiesStack = createStackNavigator({
  Activities: {
    screen: ActivitiesScreen,
    params: { navbarTitle: 'Activities' }
  },
  Activity: {
    screen: ActivityScreen,
    params: { navbarTitle: 'Activity' }
  },
  NewActivity: {
    screen: NewActivityScreen,
    params: { navbarTitle: 'New Activity' }
  },
  EditActivity: {
    screen: EditActivityScreen,
    params: { navbarTitle: 'Edit Activity' }
  }
})

const SurveysStack = createStackNavigator({
  Surveys: {
    screen: SurveysScreen,
    params: { navbarTitle: 'Surveys' }
  },
  Survey: {
    screen: SurveyScreen,
    params: { navbarTitle: 'Survey' }
  }
})

const PollsStack = createStackNavigator({
  Polls: {
    screen: PollsScreen,
    params: { navbarTitle: 'Polls' }
  },
  Poll: {
    screen: PollScreen,
    params: { navbarTitle: 'Poll' }
  }
})

const ClassifiedsStack = createStackNavigator({
  Classifieds: {
    screen: ClassifiedsScreen,
    params: { navbarTitle: 'Classifieds' }
  },
  Classified: {
    screen: ClassifiedScreen,
    params: { navbarTitle: 'Classified' }
  }
})

const MenuStack = createStackNavigator(
  {
    Menu: {
      screen: MenuScreen
    },
    ProfileStack: {
      screen: ProfileStack
    },
    SettingsStack: {
      screen: SettingsStack
    },
    BookingsStack: {
      screen: BookingsStack
    },
    ActivitiesStack: {
      screen: ActivitiesStack
    },
    SurveysStack: {
      screen: SurveysStack
    },
    PollsStack: {
      screen: PollsStack
    },
    ClassifiedsStack: {
      screen: ClassifiedsStack
    },
    UserClassifiedStack: {
      screen: UserClassifiedStack
    },
  },
  {
    headerMode: 'none'
  }
)

const 
HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

const LoginStack = createStackNavigator(
  {
    // [Routes.APP_INTRO]: AppIntro,
    [Routes.LOGIN_STACK]: InitialScreen
  },
  {
    // Default config for all screens
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: Routes.LOGIN_STACK
  }
)

// const SecurityStack = createStackNavigator(
//   {
//     // [Routes.APP_INTRO]: AppIntro,
//     [Routes.SECURITY_SCREEN]: SecurityScreen
//   },
//   // {
//   //   // Default config for all screens
//   //   mode: 'modal',
//   //   headerMode: 'none',
//   //   initialRouteName: Routes.LOGIN_STACK
//   // }
// )
const SecurityStack = createStackNavigator(
  {
    Flat: {
      screen: SecurityScreen,
      params: { navbarTitle: 'Security Dashboard' }
    },
    CreatePass:{
      screen: CreatePass,
      params: { navbarTitle: 'CreatePass' }
    }
    // Visitor: {
    //   screen: VisitorItemScreen,
    //   params: { navbarTitle: 'Visitor' }
    // },
    // NewGatepass: {
    //   screen: NewGatepassScreen,
    //   params: { navbarTitle: 'New Gate Pass' }
    // }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

const InitialStack = createStackNavigator(
  {
    Flat: {
      screen: InitialScreen,
      params: { navbarTitle: 'InitialScreen' }
    },
    // CreatePass:{
    //   screen: CreatePass,
    //   params: { navbarTitle: 'CreatePass' }
    // }
    // Visitor: {
    //   screen: VisitorItemScreen,
    //   params: { navbarTitle: 'Visitor' }
    // },
    // NewGatepass: {
    //   screen: NewGatepassScreen,
    //   params: { navbarTitle: 'New Gate Pass' }
    // }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
)

const BottomTabStack = createBottomTabNavigator(

  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Dashboard',
        tabBarIcon: getDashboardIcon
      }
    },
    MyFlatInfo: {
      screen: FlatStack,
      navigationOptions: {
        tabBarLabel: 'myflatinfo',
        tabBarIcon: getFlatIcon
      }
    },
    Accounts: {
      screen: AccountsStack,
      navigationOptions: {
        tabBarIcon: getAccountsIcon
      }
    },
    Issues: {
      screen: IssuesStack,
      navigationOptions: {
        tabBarIcon: getIssueIcon
      }
    },
    Menu: {
      screen: MenuStack,
      navigationOptions: {
        tabBarIcon: getMenuIcon
      }
    }
  },
  {
    tabBarOptions: {
      initialRouteName: ' ',
      // showLabel: false,
      animationEnabled: false,
      lazy: true,
      transitionConfig: () => ({
        transitionSpec: {
          duration: 0
        }
      }),
      activeTintColor: colors.blue300,
      activeColor: colors.blue300,
      shifting: true,
      labeled: false,
      inactiveColor: 'rgba(255,255,255,0.4)',
      keyboardHidesTabBar: true,
      style: {
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        borderWidth: 1,
        borderColor: '#fff',
        height: 60,
        ...elevationShadowStyle({ elevation: 20 })
      },
      tabStyle: {
        paddingTop: 7
      },
      labelStyle: {
        position: 'relative',
        top: -5,
        fontSize: 10
      }
    }
  }
)

// Manifest of possible screens
const MainStack = createSwitchNavigator(
  {
    [Routes.LOGIN_STACK]: {
      screen: LoginStack
    },
    [Routes.APP_INTRO]: {
      screen: AppIntroScreen
    },
    [Routes.LOADING]: {
      screen: LaunchScreen
    },
    [Routes.MAIN_APP]: {
      screen: BottomTabStack
    },
    [Routes.SECURITY_SCREEN]: {
      screen: SecurityStack
    },
    [Routes.INITIAL_SCREEN]: {
      screen: InitialStack
    }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: Routes.LOADING
  }
)

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
      path: 'app'
    },

    AppUpdate: {
      screen: AppUpdate,
      path: 'update'
    }
  },
  {
    mode: 'modal',
    initialRouteName: 'Main',
    headerMode: 'none'
  },
  {
    navigationOptions: {
      headerMode: 'none'
    }
  }
)

function getDashboardIcon ({ focused, horizontal, tintColor }) {
  return <Icon name='view-dashboard-outline' size={30} color={tintColor} />
}

function getFlatIcon ({ focused, horizontal, tintColor }) {
  return <Icon name='home-city-outline' size={30} color={tintColor} />
}

function getAccountsIcon ({ focused, horizontal, tintColor }) {
  return <Icon name='briefcase-outline' size={30} color={tintColor} />
}

function getIssueIcon ({ focused, horizontal, tintColor }) {
  return <Icon name='issue-opened' origin={ICON_TYPE.OCTICONS} size={30} color={tintColor} />
}

// function getProfileIcon ({ focused, horizontal, tintColor }) {
//   return <Icon name='account-circle-outline' size={30} color={tintColor} />
// }

function getMenuIcon ({ focused, horizontal, tintColor }) {
  return <Icon name='menu' size={30} color={tintColor} />
}

export default createAppContainer(RootStack)
