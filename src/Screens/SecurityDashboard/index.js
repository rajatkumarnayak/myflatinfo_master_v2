

import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { ButtonGroup } from 'react-native-elements'
import { StoreService, ApiService } from '../../Store'


import { FloatingActionButton } from '../../Components/Stateless'
import { VisitorListing, GatepassListing } from '../../Components/Stateful'
import NavigationService from '../../Navigation'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import SecurityVisitors from './SecurityVisitors'
import SecurityGatepass from './SecurityGatepass'
import colors from '../../Themes/Colors'
import useTheme from '../../Themes/Context'
import viewStyles from '../../Styles/ViewStyles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import useAuth from '../../Services/Auth'
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler'
import { showErrorToast, showLoading, showSuccessToast, showInfoToast } from '../../Lib/Toast'



const SecurityScreen = ({ navigation }) => {
  const { logout } = useAuth()
  const { theme } = useTheme()
  const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0)
  const [modalvisable, setModalVisible] = useState(false)
  const [otp, setOtp] = useState()

  const closeModal = () => {
    setModalVisible(false)
  }

  const openModal = () => {
    setModalVisible(true)
  }

  const otpSubmit = async () => {
    console.log(otp, 'log value >>>');
    const payload = {
      gatePassCode: otp
    }
    const response = await ApiService.validateCode(payload);
    console.log(response, "response >.>> gg");
    if (response.data == "GatePass is not valid") {
      showErrorToast(response.data)
    } else {
      showSuccessToast('Sucess')
      closeModal()
    }

  }

  const innerTabs = [{
    element: () => <Text style={{ color: selectedInnerTabIndex === 0 ? colors.white : theme.colors.primary }}>Visitors</Text>
  }, {
    element: () => <Text style={{ color: selectedInnerTabIndex === 1 ? colors.white : theme.colors.primary }}>Gate Passes</Text>
  }]


  return (


    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, backgroundColor: colors.blue300, padding: 20, paddingTop: 35 }}>
        <View>
          <Text style={{ fontSize: 18, marginLeft: 15, color: 'white' }}>Security Dashboard</Text>
        </View>
        <TouchableOpacity onPress={logout} >
          <View>
            <AntDesign name="logout" size={25} style={{ marginRight: 20 }} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <Block style={viewStyles.mainContainer}>
        <View style={styles.scrollContainer}>
          <ButtonGroup
            onPress={(index) => setSelectedInnerTabIndex(index)}
            selectedIndex={selectedInnerTabIndex}
            buttons={innerTabs}
            selectedButtonStyle={{ backgroundColor: theme.colors.primary }}
            containerStyle={[styles.buttonGroupContainer, { borderColor: theme.colors.primary }]}
          />


          {selectedInnerTabIndex === 1 ?
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 0, marginTop: 16 }}>
              <View style={{ backgroundColor: colors.blue300, padding: 10, borderRadius: 5 }}>
                <TouchableOpacity onPress={() => openModal()}>
                  <Text style={styles.otpText}>Validate Code</Text>
                </TouchableOpacity>
              </View>
            </View>
            : <Text></Text>}


          {selectedInnerTabIndex === 0 ?
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 0, marginTop: 0 }}>
              <View style={{ backgroundColor: colors.blue300, padding: 10, borderRadius: 5 }}>
                  <TouchableOpacity onPress={() => NavigationService.navigate('CreatePass')}>
                    <Text style={styles.otpText}>Create Visitor</Text>
                  </TouchableOpacity>
              </View>
            </View> 
            : <Text></Text>}

          {
            selectedInnerTabIndex === 0
              ? <SecurityVisitors />
              : <SecurityGatepass />
          }

        </View>
        {/* <View style={styles.otpButtonView}>
        <TouchableOpacity onPress={()=> openModal()}>
          <Text style={styles.otpText}>Validate Code</Text>
          </TouchableOpacity>
        </View> */}


        {/* <FloatingActionButton
          color={theme.colors.primary}
          onPress={() => NavigationService.navigate('CreatePass')}
        /> */}
        <View>
          <Modal
            isVisible={modalvisable}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            onSwipeComplete={closeModal}
            // swipeDirection={['down']}
            style={styles.bottomModal}
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}>
            <View style={styles.content}>
              <View style={styles.contentContainer}>
                <View style={styles.MainView}>
                  <View>
                    <TextInput
                      placeholder="Please enter valid code"
                      style={{ borderWidth: 0.5, borderRadius: 5, width: '200%', paddingLeft: 15 }}
                      onChangeText={(text) => setOtp(text)}
                    />
                    <TouchableOpacity onPress={() => otpSubmit()}>
                      <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Text style={{ backgroundColor: colors.blue300, padding: 10, borderRadius: 5, textAlign: 'center', color: 'white' }}>Submit</Text>
                      </View>
                    </TouchableOpacity>

                  </View>

                </View>
              </View>

            </View>
          </Modal>
        </View>

      </Block>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexGrow: 1,
    paddingBottom: 0
  },
  buttonGroupContainer: {
    borderWidth: 2,
    borderRadius: 6,
    marginTop: galioTheme.SIZES.BASE,
    marginLeft: galioTheme.SIZES.BASE,
    marginRight: galioTheme.SIZES.BASE,
    ...elevationShadowStyle({ elevation: 2 })
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  otpButtonView: {
    backgroundColor: colors.blue300,
    borderRadius: 50,
    position: 'absolute',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 130, right: 30,
    elevation: 5
    // position:'absolute',bottom:150,right:40
  },
  otpText: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    color: 'white'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  MainView: {
    marginLeft: 0,
    width: '90%',
    paddingTop: 0,
    paddingBottom: 0,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 20,
  },
})

export default SecurityScreen


