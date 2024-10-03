import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native'
import { Block, Button, theme as galioTheme } from 'galio-framework'
import { ButtonGroup, Input, Overlay } from 'react-native-elements'
import { useStoreActions, useStoreState } from 'easy-peasy'
// import { FloatingAction } from 'react-native-floating-action'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import check from 'check-types'

import { RupeeIcon, Divider } from '../../Components/Stateless'
import colors from '../../Themes/Colors'
import viewStyles from '../../Styles/ViewStyles'
import { ApiService } from '../../Store'
import { ACCOUNTS_PAYMENT } from '../../Constants'
import NavigationService from '../../Navigation'


const MINIMUM_DONATION_AMOUNT = '500'
const DEFAULT_DONATION_AMOUNT_LIST = ['500', '1000', '2000']

const DefaultDonationAmount = ({ amount }) => (
  <Block row middle>
    <RupeeIcon size={12} />
    <Text style={{ ...human.body, marginLeft: 2 }}>{amount}</Text>
  </Block>
)

const DonationForm = (props) => {
  const { data: { id, title, subtitle }, onSuccess } = props

  const [selectedDefaultDonationIndex, setSelectedDefaultDonationIndex] = useState(null)
  const [donationAmount, setDonationAmount] = useState(MINIMUM_DONATION_AMOUNT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaymentModalVisible, setPaymentModalVisibility] = useState(false)

  const loadList = useStoreActions(actions => actions.donations.load)


  const onSubmitDonation = () => {
    setIsSubmitting(true)

    const payload = {
      donationId: id,
      amountPaid: Number(donationAmount || MINIMUM_DONATION_AMOUNT),
      status: ACCOUNTS_PAYMENT.PAID.value
    }

    async function putDonation (payload) {
      console.log(payload," at form donation>>>");
      const response = await ApiService.putDonationItemData(payload)
      console.log(response,"at form donation>>>at form donation>>>");
      if (response.ok) {
        if (check.assigned(onSuccess)) {
          // onSuccess()
          await  loadList({ startDate: null, endDate: null })
          NavigationService.navigate('Donation')
          // NavigationService.navigate('Donation')

        }
      }
      setIsSubmitting(false)
    }

    setPaymentModalVisibility(true)
    setIsSubmitting(true)

    setTimeout(() => {
      putDonation(payload)
      setPaymentModalVisibility(false)
    }, 2000)
  }

  useEffect(() => {
    setDonationAmount(DEFAULT_DONATION_AMOUNT_LIST[selectedDefaultDonationIndex])
  }, [selectedDefaultDonationIndex])

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Block flex space='between'>
          <Block>
            <Text style={{ ...human.title3, ...systemWeights.bold }}>{title}</Text>
            <Divider small />
            <Text style={{ ...human.footnote, color: iOSColors.gray }}>{subtitle}</Text>
            <Divider />
            {/* <Block style={styles.imageContainer}>
              <Image
                resizeMode='cover'
                source={require('../../../assets/images/charity.png')}
                style={styles.image}
              />
            </Block> */}
            <ButtonGroup
              onPress={(index) => setSelectedDefaultDonationIndex(index)}
              selectedIndex={selectedDefaultDonationIndex}
              buttons={DEFAULT_DONATION_AMOUNT_LIST.map(amount => (
                { element: () => <DefaultDonationAmount amount={amount} key={amount} /> })
              )}
              selectedButtonStyle={{ backgroundColor: colors.white }}
              selectedTextStyle={{ color: colors.black }}
            />
            <Divider small />
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
          </Block>
          <Block>
            <Block middle>
              <Button
                onPress={() => onSubmitDonation()}
                round
                uppercase
                color={donationAmount === '' ? iOSColors.gray : iOSColors.pink}
                disabled={donationAmount === ''}
                loading={isSubmitting}
              >
                <Text style={{ ...human.bodyWhite, ...systemWeights.semibold }}>Pay now</Text>
              </Button>
            </Block>
          </Block>
        </Block>
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
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    padding: galioTheme.SIZES.BASE
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: iOSColors.white,
    borderRadius: 20,
    height: 200
  },
  image: {
    height: 160,
    width: 160
  },
  donationInput: {
    fontSize: 24
  }
})

export default DonationForm
