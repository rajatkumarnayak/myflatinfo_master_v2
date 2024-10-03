import React, { useEffect, useState } from 'react'
import { Linking, Text } from 'react-native'
import { human, systemWeights } from 'react-native-typography'
import { useStoreActions } from 'easy-peasy'
import moment from 'moment'

import { Navbar, AccountDetails } from '../../Components/Stateless'
import { ApiService } from '../../Store'
import NavigationService from '../../Navigation'
import { STATUS, ACCOUNTS_PAYMENT } from '../../Constants'
import viewStyles from '../../Styles/ViewStyles'

const CorpusItemScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  console.log(item ,'corpus >>>>>>>>>');
  const loadList = useStoreActions(actions => actions.corpuses.load)
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
  const [data, setData] = useState(null)
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState(0)
  const [active, setActive] = useState(item.active)
  const [items, setItems] = useState([])

  const _setData = (data) => {
    const { billAmount, status, billDueDate, billDate, billNumber, transactionNumber, paidVia, paidOn, invoiceUrl , receiptUrl} = data
    // alert(`${JSON.stringify(data).split(',').join('\n')}\n\nACCOUNTS_PAYMENT.PAID.value = ${ACCOUNTS_PAYMENT.PAID.value}\n\n${status === ACCOUNTS_PAYMENT.PAID.value}`)
   console.log(data ,"dara at corpis >>>>");
    setData(data)
    setAmount(billAmount)
    setStatus(status)
    setItems([
      {
        label: 'Paid On',
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
        display: status === ACCOUNTS_PAYMENT.PAID.value
      },
      {
        label: 'Generated on',
        value: moment(billDate).format('DD MMM YYYY'),
        display: true
      },
      {
        label: 'Due Date',
        value: moment(billDueDate).format('DD MMM YYYY'),
        display: true
      },
      {
        label: 'Bill Number',
        value: billNumber,
        display: true
      },
      {
        label: receiptUrl ? 'Receipt': 'Invoice',
        value :receiptUrl ? 
        () => (
          <Text
            onPress={() => Linking.openURL(receiptUrl)}
            style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
          >
            Download
          </Text>
        ):
        () => (
          <Text
            onPress={() => Linking.openURL(invoiceUrl)}
            style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
          >
            Download
          </Text>
        ),

        // value: !invoiceUrl
        //   ? '-'
          // : () => (
          //   <Text
          //     onPress={() => Linking.openURL(invoiceUrl)}
          //     style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
          //   >
          //     Download
          //   </Text>
          // ),
        display: true
      }
    ])
  }

  const onUpdate = () => {
    setNetworkStatus(STATUS.FETCHING)

    setData({ ...data, status: ACCOUNTS_PAYMENT.PAID.value })

    async function update () {
      const response = await ApiService.updateCorpusItemData(data)
      console.log(response ,"response >>>>corpus >>>");
      if (response.ok) {
        setNetworkStatus(STATUS.SUCCESS)
        _setData(response.data)
        loadList({ startDate: null, endDate: null })
      } else {
        setNetworkStatus(STATUS.FAILED)
      }
    }

    update()
  }

  useEffect(() => {
    setNetworkStatus(STATUS.FETCHING)

    async function load () {
      const response = await ApiService.fetchCorpusItemData(item)
      console.log(response , "corpussssss");
      if (response.ok) {
        setNetworkStatus(STATUS.SUCCESS)
        _setData(response.data)
      } else {
        setNetworkStatus(STATUS.FAILED)
      }
    }

    load()
  }, [])

  return (
    <AccountDetails
      amount={amount}
      status={status}
      items={items}
      active={active}
      networkStatus={networkStatus}
      onUpdate={onUpdate}
    />
  )
}

CorpusItemScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default CorpusItemScreen
