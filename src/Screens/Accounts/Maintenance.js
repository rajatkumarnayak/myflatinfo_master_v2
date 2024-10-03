import React, { useEffect, useState } from 'react'
import { useStoreActions } from 'easy-peasy'
import { human, systemWeights } from 'react-native-typography'
import moment from 'moment'

import { Navbar, AccountDetails ,AccountDetailsMaintainance} from '../../Components/Stateless'
import { ApiService } from '../../Store'
import NavigationService from '../../Navigation'
import { STATUS, ACCOUNTS_PAYMENT } from '../../Constants'
import { Text, Linking } from 'react-native'
import viewStyles from '../../Styles/ViewStyles'
import {PdfConverter} from '../../Components/Stateful'

// import RNFetchBlob from 'rn-fetch-blob'


const MaintenanceItemScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  console.log(item , " maintanekeljsdjfsdlkf");
  const loadList = useStoreActions(actions => actions.maintenances.load)
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
  const [data, setData] = useState(null)
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState(0)
  const [active, setActive] = useState()
  const [items, setItems] = useState([])

  const _setData = (data) => {
    console.log(data ,"data >>>at firsr");
    const { billAmount, status, billDueDate, billDate, billNumber, transactionNumber, 
      paidVia, paidOn, receiptUrl, isActive, invoiceUrl } = data
  // console.log(receiptUrl ,"receiptUrl >>>>>");
  // const string = receiptUrl.slice(0, -4); 
  // const apendUrl=`${string}.html`

  // const handlePdfConvert = () =>{
  //   RNFetchBlob
  //   .config({
  //       addAndroidDownloads : {
  //           useDownloadManager : true, // <-- this is the only thing required
  //           notification : false,
  //           mime : 'text/plain',
  //           description : 'File downloaded by download manager.'
  //       }
  //   })
  //   .fetch('GET', 'http://www.africau.edu/images/default/sample.pdf')
  //   .then((resp) => {
  //     // the path of downloaded file
  //     resp.path()
  //   })
  // }
   
    setData(data)
    setActive(isActive)
    setAmount(billAmount)
    setStatus(status)
    setItems([
      {
        label: 'Paid On',
        value: moment(paidOn).format('DD MMM YYYY'),
        display: status === 1
      },
      {
        label: 'Payment Mode',
        value: paidVia,
        display: status === 1
      },
      {
        label: 'Transaction Number',
        value: transactionNumber,
        display: status === 1
      },
      {
        label: 'Due Date',
        value: moment(billDueDate).format('DD MMM YYYY'),
        display: true
      },
      {
        label: 'Generated on',
        value: moment(billDate).format('DD MMM YYYY'),
        display: true
      },
      {
        label: 'Bill Number',
        value: billNumber,
        display: true
      },
      
      {
        label: receiptUrl ? 'Receipt':'InVoice',
        value: receiptUrl ? 
        () => (
          <Text
            //onPress={handlePdfConvert}
            onPress={() => Linking.openURL(receiptUrl)}
            style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
          >
            Download
          </Text>
        ):
        () => (
          <Text
            //onPress={handlePdfConvert}
            onPress={() => Linking.openURL(invoiceUrl)}
            style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
          >
           Download
          </Text>
        ),

        // value: !receiptUrl
        //   ? '-'
          // : () => (
          //   <Text
          //     //onPress={handlePdfConvert}
          //     onPress={() => Linking.openURL(apendUrl)}
          //     style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
          //   >
          //     View Invoice
          //   </Text>
          // ),
        display: true
      }
    ])
  }

  const onUpdate = () => {
    console.log('calling >>>>>> at updarte');
    setNetworkStatus(STATUS.FETCHING)

    setData({ ...data, status: 1 })
    console.log(data,"at update >>>>>");
    async function update () {
      console.log('calling >>>> updatre');
      const response = await ApiService.updateMaintenanceItemData(data)
      console.log(response ,"response >>>> mainatance Item");
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
      console.log(item ,"item ata load >>>");
      const response = await ApiService.fetchMaintenanceItemData(item)
      console.log(response ,"res >>>>>> at maintainance ")
      if (response.ok) {
        setNetworkStatus(STATUS.SUCCESS)
        _setData(response.data)
        setActive(response.data.isActive)
      } else {
        setNetworkStatus(STATUS.FAILED)
      }
    }

    load()
  }, [active])

  return (
    <AccountDetailsMaintainance
      amount={amount}
      status={status}
      items={items}
      active={active}
      networkStatus={networkStatus}
      onUpdate={onUpdate}
    />
  )
}

MaintenanceItemScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default MaintenanceItemScreen
