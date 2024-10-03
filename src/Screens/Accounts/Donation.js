import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {Text, Linking } from 'react-native'
import { human, systemWeights } from 'react-native-typography'
import viewStyles from '../../Styles/ViewStyles'
import { Navbar, AccountDetails } from '../../Components/Stateless'
import { ApiService } from '../../Store'
import { STATUS, ACCOUNTS_PAYMENT } from '../../Constants'

const DonationItemScreen = ({ navigation }) => {
 

  const {data} = useStoreState(state => ({ ...state.donations }))
  console.log(data ,"data >>>>>> at daontaion >>");
  const  item = navigation.state.params.item ? navigation.state.params.item: data[0]
  console.log(item , "item >>>>> donation values");
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState(0)
  const [items, setItems] = useState([])
  const [isActive , setIsActive ] = useState(false)

  async function load () {
    setNetworkStatus(STATUS.FETCHING)

    const response = await ApiService.fetchDonationItemData(item)
    console.log(response, "responce >>>donations")

    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      _setData(response.data)
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }

  const _setData = (data) => {
    const { Name, transactionNumber, address, amountPaid, paidOn, paidVia, status, recieptUrl } = data

    setAmount(amountPaid)
    setStatus(status)
    setItems([
      {
        label: 'Occassion',
        value: Name,
        display: true
      },
      {
        label: 'Donated On',
        value: moment(paidOn).format('DD MMM YYYY'),
        display: status === ACCOUNTS_PAYMENT.PAID.value
      },
      {
        label: 'Payment Mode',
        value: paidVia,
        display: status === ACCOUNTS_PAYMENT.PAID.value
      },
      {
        label: 'Transaction Number',
        value: transactionNumber,
        display: true
      },
      {
        label: 'Address',
        value: address,
        display: true
      },
      {
        label: 'Receipt',
        value : recieptUrl ? 
        () => (
              <Text
                onPress={() => Linking.openURL(recieptUrl)}
                style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
              >
                Download
              </Text>
            ):'_',
       display: true
      }
    ])
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AccountDetails
      amount={amount}
      status={status}
      statusText='Donated'
      items={items}
      networkStatus={networkStatus}
    />
  )
}

DonationItemScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => navigation.goBack()}
      />
    )
  }
}

export default DonationItemScreen
