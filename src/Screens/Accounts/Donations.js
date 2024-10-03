import React, { useEffect, useState } from 'react'
import { FlatList, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { Block, Button } from 'galio-framework'
import { Overlay, ButtonGroup, Input } from 'react-native-elements'
// import { FloatingAction } from 'react-native-floating-action'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { AccountsListing as Listing, FloatingActionButton, RupeeIcon, Divider, NoData } from '../../Components/Stateless'
import NavigationService from '../../Navigation'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import { ApiService } from '../../Store'
import viewStyles from '../../Styles/ViewStyles'
import { GENERAL_DAY_DISPLAY_FORMAT } from '../../Constants'

const MINIMUM_DONATION_AMOUNT = '500'
const DEFAULT_DONATION_AMOUNT_LIST = ['500', '1000', '2000']

const DefaultDonationAmount = ({ amount }) => (
  <Block row middle>
    <RupeeIcon size={12} />
    <Text style={{ ...human.body, marginLeft: 2 }}>{amount}</Text>
  </Block>
)

const DonationCard = ({ data, index, onPress }) => {

  
  console.log(data ,"data at donations >>>>");
  const { title, subtitle, active, admin, start, end } = data
  console.log(active,"admin :",admin,"active at donate >>");

  return (
    <Block
      middle
      space='between'
      style={{
        ...styles.donationCard,
        marginLeft: index === 0 ? 30 : 15
      }}
    >
      <Block center>
        <Text style={styles.donationCardTitle} numberOfLines={2}>{title}</Text>
        <Divider small />
        <Text style={styles.donationCardSubtitle} numberOfLines={3}>{subtitle}</Text>
      </Block>
      <Button
        round
        color={iOSColors.pink}
        onPress={() => onPress(data)}
        // style={styles.donationCardButton}
        style={{  marginTop: 15,
          width: 120, opacity:!active ? 0.5 : null}}
        disabled={!active}
      >
        <Text style={{ ...human.bodyWhite }}>View </Text>
      </Button>
    </Block>
  )
}

const DonationsScreen = ({ navigation }) => {
  const building = useStoreState(state => state.app.building)
  const flat = useStoreState(state => state.app.flat)
  const loadEventList = useStoreActions(actions => actions.donations.loadEventList)
  const load = useStoreActions(actions => actions.donations.load)
  const { eventList, data, status } = useStoreState(state => ({ ...state.donations }))
  console.log(eventList ,data,status,"eventList >>>>>>")
  const [isDonationListModalVisible, setDonationListModalVisibility] = useState(false)
  const [isDonationModalVisible, setDonationModalVisibility] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState({ id: null, title: null, subtitle: null })
  const [selectedDefaultDonationIndex, setSelectedDefaultDonationIndex] = useState(null)
  const [donationAmount, setDonationAmount] = useState(MINIMUM_DONATION_AMOUNT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaymentModalVisible, setPaymentModalVisibility] = useState(false)
  const [_data, setData] = useState([])

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  const onPressDonationItem = (item) => {
    console.log(item,"item >>>>> at donations >>");
    setDonationListModalVisibility(false)
    // setDonationModalVisibility(true)
    NavigationService.navigate('NewDonation', { item })
  }

  const onSubmitDonation = () => {
    const payload = {
      donationId: selectedDonation.id,
      amountPaid: Number(donationAmount || MINIMUM_DONATION_AMOUNT),
      status: 1
    }

    async function putDonation (payload) {
      const response = await ApiService.putDonationItemData(payload)
      console.log(response ,"res >>>>donations")
      if (response.ok) {
        load({ startDate: null, endDate: null })
      }
      setIsSubmitting(false)
    }

    setDonationListModalVisibility(false)
    setDonationModalVisibility(false)
    setPaymentModalVisibility(true)
    setIsSubmitting(true)

    setTimeout(() => {
      putDonation(payload)
      setPaymentModalVisibility(false)
    }, 2000)

    // ApiService.fetchDonationItemData(selectedDonation)
    //   .then(response => {
    //     if (response.ok) {
    //       // debugger

    //       const payload = {
    //         donationId: selectedDonation.id,
    //         amountPaid: Number(donationAmount || MINIMUM_DONATION_AMOUNT),
    //         status: 1
    //       }

    //       setDonationListModalVisibility(false)
    //       setDonationModalVisibility(false)
    //       setPaymentModalVisibility(false)

    //       putDonation(payload)
    //     }
    //   })
  }

  useEffect(() => {
    if (check.assigned(building.id) && check.assigned(flat)) {
      loadEventList()
      onLoad()
    }
  }, [building, flat])

  useEffect(() => {
    setData(data.map(item => ({
      ...item,
      subtitle: `Contributed on ${moment(item.paymentDate).format(GENERAL_DAY_DISPLAY_FORMAT)}`
    })))
  }, [data])

  useEffect(() => {
    setDonationAmount(DEFAULT_DONATION_AMOUNT_LIST[selectedDefaultDonationIndex])
  }, [selectedDefaultDonationIndex])


  const onChange = () => {
    loadEventList();
    setTimeout(() => {
       setDonationListModalVisibility(true);
     }, 2000)
    
  
  }

  return (
    <Block style={styles.container}>
      <Listing
        items={_data}
        onLoad={onLoad}
        onPressItem={(item) => {
          NavigationService.navigate('Donation', { item })
        }}
        status={status}
        noDataComponent={() => <NoData />}
      />
      <FloatingActionButton
        color={iOSColors.pink}
        text='Event List'
        onPress={() => onChange()}
      />
      <Overlay
        isVisible={isDonationListModalVisible}
        onBackdropPress={() => setDonationListModalVisibility(false)}
        windowBackgroundColor='rgba(0, 0, 0, .5)'
        overlayStyle={viewStyles.bottomModal}
      >
        <>
          <Text style={viewStyles.modalHeading}>Event List</Text>
          <FlatList
            data={eventList}
            renderItem={({ item, index }) => (
            
              <DonationCard 
                data={item}
                index={index}
                onPress={() => onPressDonationItem(item)}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            contentOffset={{ x: 50 }}
          />
        </>
      </Overlay>
      <Overlay
        isVisible={isDonationModalVisible}
        onBackdropPress={() => setDonationModalVisibility(false)}
        windowBackgroundColor='rgba(0, 0, 0, 0)'
        overlayStyle={viewStyles.bottomModal}
      >
        <KeyboardAvoidingView>
          <Block style={viewStyles.modalContent}>
            <Block row space='between'>
              <Block>
                {/* <Text numberOfLines={1} style={{ ...human.body, ...systemWeights.semibold }}>You are donating for</Text> */}
                <Text numberOfLines={1} style={{ ...human.headline }}>{selectedDonation.title}</Text>
              </Block>
              <TouchableOpacity onPress={() => setDonationModalVisibility(false)}>
                <Icon
                  size={24}
                  color={colors.ashgrey}
                  name='close'
                />
              </TouchableOpacity>
            </Block>
            <Divider small />
            <Text numberOfLines={3} style={{ ...human.footnote, color: iOSColors.gray }}>{selectedDonation.subtitle}</Text>
            <Divider />
            <ButtonGroup
              onPress={(index) => setSelectedDefaultDonationIndex(index)}
              selectedIndex={selectedDefaultDonationIndex}
              buttons={DEFAULT_DONATION_AMOUNT_LIST.map(amount => (
                { element: () => <DefaultDonationAmount amount={amount} key={amount} /> })
              )}
              selectedButtonStyle={{ backgroundColor: colors.white }}
              selectedTextStyle={{ color: colors.black }}
            />
            <Input
              keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
              returnKeyType='done'
              onSubmitEditing={() => onSubmitDonation()}
              defaultValue={MINIMUM_DONATION_AMOUNT}
              value={donationAmount}
              onChangeText={text => {
                return text === ''
                  ? setDonationAmount(text)
                  : RegExp('^[0-9]+$').test(text)
                    ? setDonationAmount(text)
                    : text
              }}
              leftIcon={<RupeeIcon size={20} style={{ marginRight: 10 }} />}
              inputStyle={styles.donationInput}
            />
            <Divider />
            <Divider />
            <Block middle>
              <Button
                onPress={() => onSubmitDonation()}
                round
                uppercase
                color={donationAmount === '' ? iOSColors.gray : iOSColors.pink}
                size='small'
                disabled={donationAmount === ''}
              >
                <Text style={{ ...human.bodyWhite, ...systemWeights.semibold }}>Donate</Text>
              </Button>
            </Block>
          </Block>
        </KeyboardAvoidingView>
      </Overlay>
      <Overlay
        isVisible={isPaymentModalVisible}
        fullScreen
      >
        <Block flex middle>
          <ActivityIndicator size='large' />
          <Divider />
          <Text>Simulating Payment Gateway...</Text>
        </Block>
      </Overlay>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  donationCard: {
    backgroundColor: iOSColors.gray,
    borderRadius: 30,
    height: 200,
    marginHorizontal: 15,
    marginVertical: 30,
    paddingHorizontal: 15,
    paddingVertical: 25,
    width: 200,
    ...elevationShadowStyle({ elevation: 30 })
  },
  donationCardTitle: {
    ...human.subhead,
    ...systemWeights.semibold,
    textAlign: 'center'
  },
  donationCardSubtitle: {
    ...human.footnote,
    color: iOSColors.gray,
    textAlign: 'center'
  },
  donationCardButton: {
    marginTop: 15,
    width: 120
  },
  donationInput: {
    fontSize: 32
  },
  sliderContainer: {
    marginHorizontal: 30
  }
})

export default DonationsScreen
