import React, { useEffect, useState } from 'react'
import { Linking, Text } from 'react-native'
import { human, systemWeights } from 'react-native-typography'
import { useStoreActions } from 'easy-peasy'
import moment from 'moment'

import { Navbar, AccountDetails } from '../../Components/Stateless'
import { ApiService, StoreService } from '../../Store'
import NavigationService from '../../Navigation'
import { STATUS, ACCOUNTS_PAYMENT } from '../../Constants'
import viewStyles from '../../Styles/ViewStyles'

const Other = ({ navigation }) => {
  const { item } = navigation.state.params
  console.log(item ,'others data >>>>>>>>>');
  console.log(StoreService.getState().app.flat.flatId,"StoreService.getState().app.flat.flatId>>>>>");
 
  // const item={
  //   OtherActivtyId:31,
  //   flatId:235
  // }

  // const i=parseInt(item.id);  
  

   
  //  item.flatId = 235
  //  item.otherActivityId=item.id
 

  // console.log(StoreService.getState().app.id,"item ,>>>>>>>>");

  const loadList = useStoreActions(actions => actions.corpuses.load)
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
  const [data, setData] = useState(null)
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState(0)
  const [active, setActive] = useState(item.active)
  const [items, setItems] = useState([])

  const _setData = (data) => {
    console.log(data,"data amount >>>");
    const { billAmount, status, billDueDate, billDate, billNumber, transactionNumber, paidVia, paidOn, invoiceUrl, isActive ,amountPaid ,recieptUrl} = data

    console.log(billAmount,isActive,billDueDate ,"billAmount>>>>");
    // alert(`${JSON.stringify(data).split(',').join('\n')}\n\nACCOUNTS_PAYMENT.PAID.value = ${ACCOUNTS_PAYMENT.PAID.value}\n\n${status === ACCOUNTS_PAYMENT.PAID.value}`)

    setData(data)
    setAmount(billAmount)
    setActive(isActive)
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
      // {
      //   label: 'Due Date',
      //   value: moment(billDueDate).format('DD MMM YYYY'),
      //   display: true
      // },
        // {
        //   label: 'Bill Number',
        //   value: billNumber,
        //   display: true
        // },
      {
        label: recieptUrl ? 'Receipt':'Invoice',
        value : recieptUrl ? 
        () => (
              <Text
                onPress={() => Linking.openURL(recieptUrl)}
                style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
              >
                Download
              </Text>
            ): <Text
            onPress={() => Linking.openURL(invoiceUrl)}
            style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
          >
            Download
          </Text>,

        // value: !invoiceUrl
        //   ? '-'
        //   : () => (
        //     <Text
        //       onPress={() => Linking.openURL(invoiceUrl)}
        //       style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
        //     >
        //       Download
        //     </Text>
        //   ),
        display: true
      }
    ])
  }

  const onUpdate = () => {
    setNetworkStatus(STATUS.FETCHING)

    setData({ ...data, status: 1 })
    console.log(data ,"data >>>>>");
    let payload=  {
      OtherActivityId:data.otherActivityID,
      FlatID:StoreService.getState().app.flat.flatId,
      Name:data.name,
      Address:StoreService.getState().app.flat.flatId,
      transNumber:data.transactionNumber,
      AmountPaid:data.billAmount,
      dateTime:data.paidOn,
      PaidVia:data.paidVia,
      otherBillID:  data.otherBillID,
      userId: StoreService.getState().login.id
  }

console.log(payload ,"payload >>>>>> updarte ");
//   {
//     "OtherActivityId":9,
//     "FlatID":236,
//     "otherBillID": 25,
//     "Name":"15-Dec",
//     "Address":235,
//     "AmountPaid":"250",
//     "PaidVia":1,
//     "userId": StoreService.getState().login.id
// }
  console.log(data,"data >> at update >>>");
    async function update () {
      const response = await ApiService.updateOthersItemData(payload)
      console.log(response ,"response >>>> others payment >>>");
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
      if(item.otherActivityId){
        console.log(item,'calling to hit service >>>>> hhh', StoreService.getState().app.flat.flatId);
        item.flatId=StoreService.getState().app.flat.flatId
        const data = {
          flatId:StoreService.getState().app.flat.flatId,
          otherBillId : item.otherBillId
        }
        const response = await ApiService.fetchOthersItemData(data)
        console.log(response,"res others fetch >>>>>>>>>>>>>>>>>  ggg");
        if (response.ok) {
          setNetworkStatus(STATUS.SUCCESS)
          _setData(response.data)
        } else {
          setNetworkStatus(STATUS.FAILED)
        }
    
      }else{
        // const i= parseInt(StoreService.getState().app.flat.flatId)
        console.log();
        item.flatId=StoreService.getState().app.flat.flatId
        item.otherActivityId=item.id

        const data = {
          flatId:StoreService.getState().app.flat.flatId,
          otherBillId : item.otherBillId
        }
        console.log('calling to hit service >>>>>');
        const response = await ApiService.fetchOthersItemData(data)
        console.log(response,"res others fetch >>>>>>>>>>>>>>>>>");
        if (response.ok) {
          setNetworkStatus(STATUS.SUCCESS)
          _setData(response.data)
        } else {
          setNetworkStatus(STATUS.FAILED)
        }

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

Other.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.goBack(()=>{
           load()
        })}
      />
    )
  }
}

export default Other





























// import React, { useEffect, useState } from 'react'
// import { useStoreActions } from 'easy-peasy'
// import { human, systemWeights } from 'react-native-typography'
// import moment from 'moment'

// import { Navbar, AccountDetails } from '../../Components/Stateless'
// import { ApiService } from '../../Store'
// import NavigationService from '../../Navigation'
// import { STATUS, ACCOUNTS_PAYMENT } from '../../Constants'
// import { Text, Linking } from 'react-native'
// import viewStyles from '../../Styles/ViewStyles'

// const Other = ({ navigation }) => {
//   const { item } = navigation.state.params
//   console.log(item ,"OtherData");
//   const loadList = useStoreActions(actions => actions.others.load)
//   const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
//   const [data, setData] = useState(null)
//   const [amount, setAmount] = useState(item.amount)
//   const [status, setStatus] = useState(0)
//   const [active, setActive] = useState()
//   const [items, setItems] = useState([])

//   const _setData = (data) => {
//     console.log(data ,"data >>>at firsr");
//     const { billAmount, status, billDueDate, billDate, 
//       billNumber, transactionNumber, paidVia, paidOn, invoiceUrl,receiptUrl, isActive } = data
  
//       const string = invoiceUrl ? invoiceUrl.slice(0, -4) : receiptUrl.slice(0, -4)     
//       const apendUrl=`${string}.html`

//     setData(data)
//     setActive(isActive)
//     setAmount(amount)
//     setStatus(status)
//     setItems([
//       {
//         label: 'Paid On',
//         value: moment(paidOn).format('DD MMM YYYY'),
//         display: status === 1
//       },
//       {
//         label: 'Payment Mode',
//         value: paidVia,
//         display: status === 1
//       },
//       {
//         label: 'Transaction Number',
//         value: transactionNumber,
//         display: status === 1
//       },
//       {
//         label: 'Due Date',
//         value: moment(billDueDate).format('DD MMM YYYY'),
//         display: true
//       },
//       {
//         label: 'Generated on',
//         value: moment(billDate).format('DD MMM YYYY'),
//         display: true
//       },
//       {
//         label: 'Bill Number',
//         value: billNumber,
//         display: true
//       },
      
//       {
//         label: status === 1 ? 'Receipt' : 'InVoice',
//         value: !invoiceUrl || !receiptUrl
//           ? '-'
//           : () => (
//             <Text
//               onPress={() => Linking.openURL(apendUrl)}
//               style={[{ ...human.subhead, ...systemWeights.bold }, viewStyles.linkText]}
//             >
//               View
//             </Text>
//           ),
//         display: true
//       }
//     ])
//   }

//   const onUpdate = () => {
//     setNetworkStatus(STATUS.FETCHING)

//     setData({ ...data, status: 1 })
//     async function update () {
    // let payload=  {
    //     OtherActivityId:data.otherActivityID,
    //     FlatID:data.flatId,
    //     Name:data.Name,
    //     Address:null,
    //     transNumber:data.transactionNumber,
    //     AmountPaid:data.amountPaid,
    //     dateTime:data.paidOn,
    //     PaidVia:data.paidVia
    // }
//     console.log(payload ,"payload");
//       const response = await ApiService.updateOthersItemData(payload)
//       console.log(response ,"response >>>> others Bddd");
//       if (response.ok) {
//         setNetworkStatus(STATUS.SUCCESS)
//         _setData(response.data)
//         loadList({ startDate: null, endDate: null })
//       } else {
//         setNetworkStatus(STATUS.FAILED)
//       }
//     }

//     update()
//   }

//   useEffect(() => {
//     console.log(item,"item > others >>>");
//     setNetworkStatus(STATUS.FETCHING)
//   console.log('calling at others');
//     async function load () {
//       const response = await ApiService.fetchOthersItemData(item)
//       console.log(response ,"res >>>>>> at others ")
//       if (response.ok) {
//         setNetworkStatus(STATUS.SUCCESS)
//         _setData(response.data)
//         setActive(response.data.isActive)
//       } else {
//         setNetworkStatus(STATUS.FAILED)
//       }
//     }

//     load()
//   }, [])

//   return (
//     <AccountDetails
//       amount={amount}
//       status={status}
//       items={items}
//       active={active}
//       networkStatus={networkStatus}
//       onUpdate={onUpdate}
//     />
//   )
// }

// Other.navigationOptions = ({ navigation, screenProps }) => {
//   const { navbarTitle } = navigation.state.params

//   return {
//     header: (
//       <Navbar
//         title={navbarTitle}
//         onPressBack={() => NavigationService.goBack()}
//       />
//     )
//   }
// }

// export default Other
