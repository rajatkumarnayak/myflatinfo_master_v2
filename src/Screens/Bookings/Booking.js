import React, { useState, useEffect } from 'react'
import { ScrollView, Text, InteractionManager, StyleSheet, Linking } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { Overlay } from 'react-native-elements'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Divider, Loader, NoData, Navbar, RupeeIcon, Button, Icon } from '../../Components/Stateless'
import NavigationService from '../../Navigation'
import { ApiService } from '../../Store'
import viewStyles from '../../Styles/ViewStyles'
import { STATUS } from '../../Constants'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import { View } from 'native-base'

const statusColor = (status) => {
  if (status === 1 || status === 2) {
    return iOSColors.green
  }

  if (status === 6) {
    return iOSColors.blue
  }

  return iOSColors.red
}

const BookingScreen = ({ navigation }) => {
  const { item } = navigation.state.params

  const loadList = useStoreActions(actions => actions.bookings.load)

  const userId = useStoreState(state => state.login.id)

  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(0)
  const [toShowCancelButton, setToShowCancelButton] = useState(false)
  const [items, setItems] = useState([])
  const [isConfirmModalVisible, setConfirmModalVisibility] = useState(false)
  const [isSuccessModalVisible, setisSuccessModalVisible] = useState(false)
  const [isSuccessText, setisSuccessText] = useState()
  const [cancelMode , setCancelMode]=useState()
  const [cancelBooking , setCancelBooking]=useState(false)

  const { statusText } = data || item

  const _setData = (data) => {
    const {
      name,
      description,
      startDate,
      endDate,
      status,
      statusText,
      bookingType,
      caption,
      numberOfHours,
      perDayCharge,
      perHourCharge,
      cancellationCharge,
      bookingCharge,
      receiptUrl,
      cancellationReceiptUrl,
      bookedByUserId,
      CancellationType
    } = data
    setCancelMode(CancellationType)
   console.log(data,"receiptUrl >>>>>");
  //  const string = receiptUrl.slice(0, -4); 
  //  const apendUrl=`${string}.html`

    setData(data)
    setStatus(status)
    setToShowCancelButton(status === 1 || status === 2 || status === 6)

    const _items = [
      {
        label: null,
        value: () => (
          <Text style={{ ...human.title2, ...systemWeights.bold }}>
            {name}
          </Text>
        ),
        display: true
      },
      {
        label: 'About Facility',
        value: description,
        display: true
      },
      {
        label: 'Facility Charges',
        value: () => (
          <Block row space='between'>
            <Block flex>
              <Block row>
                <ChargeItem value={perDayCharge} label='Daily Charge' />
                <ChargeItem value={perHourCharge} label='Hourly Charge' />
                {statusText == "Cancelled" ? ( <ChargeItem value={cancellationCharge} label= 'Cancellation Charge'/>):
                (
                  <View>
                       {CancellationType =="M"? (<View>
                  <Text style={{fontWeight:'bold'}}>Contact Admin</Text>
                  <Text>Cancellation Charge</Text>
                </View>):
                (                <ChargeItem value={cancellationCharge} label= 'Cancellation Charge'/>
                )}
                  </View>
                )}
                {/* {CancellationType =="M"? (<View>
                  <Text style={{fontWeight:'bold'}}>Contact Admin</Text>
                  <Text>Cancellation Charge</Text>
                </View>):
                (                <ChargeItem value={cancellationCharge} label= 'Cancellation Charge'/>
                )} */}
                {/* <ChargeItem value={cancellationCharge} label= 'Cancellation Charge'/> */}
                {/* <ChargeItem value={cancellationCharge} label={CancellationType == "M" ? null: 'Cancellation Charge'} /> */}
              </Block>
            </Block>
          </Block>
        ),
        display: true
      },
      {
        label: 'Booking Type',
        value: bookingType,
        display: true
      }
    ]

    if (check.assigned(numberOfHours)) {
      _items.push(
        {
          label: 'Hours Booked',
          value: numberOfHours,
          display: true
        }
      )
    }

    if (check.assigned(startDate) && check.assigned(endDate)) {
      const dates = startDate === endDate
        ? startDate
        : `${startDate} - ${endDate}`

      _items.push(
        {
          label: 'Dates Booked',
          value: dates,
          display: true
        },
        {
          label: 'Days Booked',
          value: caption,
          display: true
        }
      )
    }

    _items.push(
      {
        // label: 'Final Charges',
        // label: cancelBooking  || statusText == 'Cancelled'  ? 'Refund Amount' : 'Total Amount',
          label: CancellationType =="M"?cancelBooking  || statusText == 'Cancelled'  ? 'Refund Amount' : 'Total Amount':
          cancelBooking  || statusText == 'Cancelled'  ? 'Refund Amount' : 'Total Amount',

        value: () =>  
        statusText == "Cancel Request" ? 
        (<View>
          <Text style={{fontWeight:'bold'}}>Contact Admin</Text>
          <Text></Text>
        </View>):<ChargeItem value={bookingCharge} />
        // <ChargeItem value={bookingCharge} /> ,
      
        // (<View>
        //   <Text style={{fontWeight:'bold'}}>Contact Admin</Text>
        //   <Text></Text>
        // </View>)}</View>,
        ,
        display: true
      },
      {
        label: 'Booking Status',
        value: statusText,
        display: true
      }
    )

    if (bookedByUserId === userId) {
      if (check.not.assigned(receiptUrl)) {
        _items.push(
          {
            label: 'Invoice',
            value: 'Not Available',
            display: true
          }
        )
      } else {
        _items.push(
          {
            label:'Receipt',
            value: () => (
              <Text
                onPress={() => Linking.openURL(receiptUrl)}
                style={viewStyles.linkText}
              >
                Download
              </Text>
            ),
            display: true
          }
        )
      }

      if (status === 4) {
        if (check.not.assigned(cancellationReceiptUrl)) {
          _items.push(
            {
              label: 'Cancellation Invoice',
              value: 'Not Available',
              display: true
            }
          )
        } else {
          _items.push(
            {
              label: 'Cancellation Invoice',
              value: () => (
                <Text
                  onPress={() => Linking.openURL(cancellationReceiptUrl)}
                  style={viewStyles.linkText}
                >
                  Download
                </Text>
              ),
              display: true
            }
          )
        }
      }
    }

    setItems(_items)
  }

  async function load () {
    const response = await ApiService.fetchBookingItemData(item)
    console.log(response,'responseresponse')
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      // merge incoming response with the 'item' param in route
      _setData({ ...item, ...response.data })
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }

  async function update (payload) {
    const response = await ApiService.cancelBookingItem(payload)
    console.log(response ,"update >>>");

    if (response) {
      setisSuccessModalVisible(true)
      setisSuccessText(response.data)
      load()
    } else {
      if (response.status === 409) {
      }
    }
  }

  const onCancelBooking = (item) => {
    setCancelBooking(true)
    setConfirmModalVisibility(true)
  }

  const onConfirmCancelBooking = () => {
    setConfirmModalVisibility(false)

    const payload = {
      id: data.id
    }

    update(payload)
    // alert('value ofthe item' + selectId)
  }

  const onConfirmCancelledBooking = () => {
    loadList({ startDate: null, endDate: null })
    setisSuccessModalVisible(false)
  }

  useEffect(() => {
    setNetworkStatus(STATUS.FETCHING)

    InteractionManager.runAfterInteractions(() => {
      load()
    })
  }, [])

  if (networkStatus === STATUS.FETCHING) {
    return (
      <Block style={viewStyles.mainContainer}>
        <Loader />
      </Block>
    )
  }

  if (networkStatus === STATUS.FAILED) {
    return (
      <Block middle style={viewStyles.mainContainer}>
        <NoData text='Something went wrong' />
      </Block>
    )
  }

  return (
    <>
      <Block style={viewStyles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Status status={status} statusText={statusText} />
          <Divider small />
          {items.map((item, index) => (
            <Item key={index} {...item} />
          ))}
          <Divider large />
          {toShowCancelButton && (
            <Block center>
              <Text style={{ color: iOSColors.red }} onPress={() => onCancelBooking()}>
                Cancel Booking
              </Text>
            </Block>
          )}
        </ScrollView>
      </Block>
      <Overlay
        isVisible={isConfirmModalVisible}
        overlayStyle={styles.overlay}
      >
        <Block flex space='between'>
          <Block flex style={styles.overlayContent}>
            <Text style={{ ...human.footnote, textAlign: 'center' }}>
            {'Are you sure you want to cancel this booking?'}

              {/* {'Are you sure you want to cancel this booking?'} */}
            </Text>
            <Divider small />
            <Block row width='95%'>
              <Icon name='alert-circle-outline' size={12} color={iOSColors.red} />
              <Text style={{ ...human.caption2, textAlign: 'left', marginLeft: 5 }}>
                {'The facility may have cancellation charges, that will be deducted before refunding the booking amount.'}
              </Text>
            </Block>
          </Block>
          <Block row space='around'>
            <Button onPress={() => onConfirmCancelBooking()} color={iOSColors.black} style={styles.overlayButton}>
              <Text style={{ ...human.caption1White }}>Yes</Text>
            </Button>
            <Button onPress={() => setConfirmModalVisibility(false)} color={iOSColors.customGray} style={styles.overlayButton}>
              <Text style={{ ...human.caption1 }}>Not Now</Text>
            </Button>
          </Block>
        </Block>
      </Overlay>
      <Overlay
        isVisible={isSuccessModalVisible}
        overlayStyle={styles.overlay}
      >
        <Block flex space='between'>
          <Block style={styles.overlayContent}>
            <Text style={{ ...human.footnote, textAlign: 'center' }}>
              {isSuccessText}
            </Text>
          </Block>
          <Block row space='around'>
            <Button onPress={() => onConfirmCancelledBooking()} color={iOSColors.black} style={[styles.overlayButton, { width: '100%' }]}>
              <Text style={{ ...human.caption1White }}>Okay</Text>
            </Button>
          </Block>
        </Block>
      </Overlay>
    </>
  )
}

BookingScreen.navigationOptions = ({ navigation, screenProps }) => {
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

const Status = ({ status, statusText }) => {
  return (
    <Block row left>
      <Block
        row
        style={{
          backgroundColor: statusColor(status),
          borderRadius: 2,
          paddingHorizontal: 6
        }}
      >
        <Text
          style={{
            ...human.caption2White,
            fontSize: 8,
            textTransform: 'uppercase'
          }}
        >
          {statusText}
        </Text>
      </Block>
    </Block>
  )
}

const ChargeItem = ({ value, label }) => {
  return (
    <Block flex>
      <Block row>
        <Block row middle>
          {
            check.assigned(value)
              ? (
                <>
                  <RupeeIcon size={12} style={{ marginRight: 2 }} />
                  <Text style={{ ...human.subhead, ...systemWeights.bold }}>
                    {value}
                  </Text>
                </>
              )
              : (
                <Text style={{ ...human.subhead }}>
                  {value || '-'}
                </Text>
              )
          }
        </Block>
      </Block>
      {label && (
        <Text style={{ ...human.caption2, marginTop: 2 }}>
          {label}
        </Text>
      )}
    </Block>
  )
}

const Item = ({ label, value, display }) => {
  if (!display) {
    return <></>
  }

  const _label = () => {
    if (check.not.assigned(label)) {
      return <></>
    }

    return (
      <>
        <Text
          style={{ ...human.caption2, color: iOSColors.gray, letterSpacing: 2, textTransform: 'uppercase' }}
        >
          {label}
        </Text>
        <Divider small />
      </>
    )
  }

  const _value = () => {
    if (check.function(value)) {
      return value()
    }

    return (
      <Text style={{ ...human.subhead, ...systemWeights.bold }}>{value}</Text>
    )
  }

  return (
    <Block style={styles.item}>
      {_label()}
      {_value()}
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: galioTheme.SIZES.BASE
  },
  item: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.customGray,
    marginBottom: galioTheme.SIZES.BASE * 2
  },
  overlayButton: {
    borderRadius: 0,
    flex: 1
  },
  overlay: {
    borderRadius: 10,
    ...elevationShadowStyle({ elevation: 20 }),
    height: 165,
    overflow: 'hidden',
    padding: 0,
    width: 280
  },
  overlayContent: {
    paddingHorizontal: 10,
    paddingVertical: 20
  }
})

export default BookingScreen
































// import React, { useState, useEffect } from 'react'
// import { ScrollView, Text, InteractionManager, StyleSheet, Linking } from 'react-native'
// import { Block, theme as galioTheme } from 'galio-framework'
// import { Overlay } from 'react-native-elements'
// import { human, systemWeights, iOSColors } from 'react-native-typography'
// import { useStoreState, useStoreActions } from 'easy-peasy'
// import check from 'check-types'

// import { Divider, Loader, NoData, Navbar, RupeeIcon, Button, Icon } from '../../Components/Stateless'
// import NavigationService from '../../Navigation'
// import { ApiService } from '../../Store'
// import viewStyles from '../../Styles/ViewStyles'
// import { STATUS } from '../../Constants'
// import elevationShadowStyle from '../../Utils/ShadowStyle'

// const statusColor = (status) => {
//   if (status === 1 || status === 2) {
//     return iOSColors.green
//   }

//   if (status === 6) {
//     return iOSColors.blue
//   }

//   return iOSColors.red
// }

// const BookingScreen = ({ navigation }) => {
//   const { item } = navigation.state.params

//   const loadList = useStoreActions(actions => actions.bookings.load)

//   const userId = useStoreState(state => state.login.id)

//   const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)
//   const [data, setData] = useState(null)
//   const [status, setStatus] = useState(0)
//   const [toShowCancelButton, setToShowCancelButton] = useState(false)
//   const [items, setItems] = useState([])
//   const [isConfirmModalVisible, setConfirmModalVisibility] = useState(false)
//   const [isSuccessModalVisible, setisSuccessModalVisible] = useState(false)
//   const [isSuccessText, setisSuccessText] = useState()
//   const [cancelMode , setCancelMode]=useState()

//   const { statusText } = data || item

//   const _setData = (data) => {
//     const {
//       name,
//       description,
//       startDate,
//       endDate,
//       status,
//       statusText,
//       bookingType,
//       caption,
//       numberOfHours,
//       perDayCharge,
//       perHourCharge,
//       cancellationCharge,
//       bookingCharge,
//       receiptUrl,
//       cancellationReceiptUrl,
//       bookedByUserId,
//       CancellationType
//     } = data
//     setCancelMode(CancellationType)
//    console.log(status,"receiptUrl >>>>>");
//   //  const string = receiptUrl.slice(0, -4); 
//   //  const apendUrl=`${string}.html`

//     setData(data)
//     setStatus(status)
//     setToShowCancelButton(status === 1 || status === 2 || status === 6)

//     const _items = [
//       {
//         label: null,
//         value: () => (
//           <Text style={{ ...human.title2, ...systemWeights.bold }}>
//             {name}
//           </Text>
//         ),
//         display: true
//       },
//       {
//         label: 'About Facility',
//         value: description,
//         display: true
//       },
//       {
//         label: 'Facility Charges',
//         value: () => (
//           <Block row space='between'>
//             <Block flex>
//               <Block row>
//                 <ChargeItem value={perDayCharge} label='Daily Charge' />
//                 <ChargeItem value={perHourCharge} label='Hourly Charge' />
//                 <ChargeItem value={cancellationCharge} label={CancellationType == "M" ? "Contact Admin": 'Cancellation Charge'} />
//               </Block>
//             </Block>
//           </Block>
//         ),
//         display: true
//       },
//       {
//         label: 'Booking Type',
//         value: bookingType,
//         display: true
//       }
//     ]

//     if (check.assigned(numberOfHours)) {
//       _items.push(
//         {
//           label: 'Hours Booked',
//           value: numberOfHours,
//           display: true
//         }
//       )
//     }

//     if (check.assigned(startDate) && check.assigned(endDate)) {
//       const dates = startDate === endDate
//         ? startDate
//         : `${startDate} - ${endDate}`

//       _items.push(
//         {
//           label: 'Dates Booked',
//           value: dates,
//           display: true
//         },
//         {
//           label: 'Days Booked',
//           value: caption,
//           display: true
//         }
//       )
//     }

//     _items.push(
//       {
//         // label: 'Final Charges',
//         label: 'Total Amount',

//         value: () => <ChargeItem value={bookingCharge} />,
//         display: true
//       },
//       {
//         label: 'Booking Status',
//         value: statusText,
//         display: true
//       }
//     )

//     if (bookedByUserId === userId) {
//       if (check.not.assigned(receiptUrl)) {
//         _items.push(
//           {
//             label: 'Invoice',
//             value: 'Not Available',
//             display: true
//           }
//         )
//       } else {
//         _items.push(
//           {
//             label:'Receipt',
//             value: () => (
//               <Text
//                 onPress={() => Linking.openURL(receiptUrl)}
//                 style={viewStyles.linkText}
//               >
//                 Download
//               </Text>
//             ),
//             display: true
//           }
//         )
//       }

//       if (status === 4) {
//         if (check.not.assigned(cancellationReceiptUrl)) {
//           _items.push(
//             {
//               label: 'Cancellation Invoice',
//               value: 'Not Available',
//               display: true
//             }
//           )
//         } else {
//           _items.push(
//             {
//               label: 'Cancellation Invoice',
//               value: () => (
//                 <Text
//                   onPress={() => Linking.openURL(cancellationReceiptUrl)}
//                   style={viewStyles.linkText}
//                 >
//                   Download
//                 </Text>
//               ),
//               display: true
//             }
//           )
//         }
//       }
//     }

//     setItems(_items)
//   }

//   async function load () {
//     const response = await ApiService.fetchBookingItemData(item)
//     console.log(response,'responseresponse')
//     if (response.ok) {
//       setNetworkStatus(STATUS.SUCCESS)
//       // merge incoming response with the 'item' param in route
//       _setData({ ...item, ...response.data })
//     } else {
//       setNetworkStatus(STATUS.FAILED)
//     }
//   }

//   async function update (payload) {
//     const response = await ApiService.cancelBookingItem(payload)
//     console.log(response ,"update >>>");

//     if (response) {
//       setisSuccessModalVisible(true)
//       setisSuccessText(response.data)
//       load()
//     } else {
//       if (response.status === 409) {
//       }
//     }
//   }

//   const onCancelBooking = (item) => {
//     setConfirmModalVisibility(true)
//   }

//   const onConfirmCancelBooking = () => {
//     setConfirmModalVisibility(false)

//     const payload = {
//       id: data.id
//     }

//     update(payload)
//     // alert('value ofthe item' + selectId)
//   }

//   const onConfirmCancelledBooking = () => {
//     loadList({ startDate: null, endDate: null })
//     setisSuccessModalVisible(false)
//   }

//   useEffect(() => {
//     setNetworkStatus(STATUS.FETCHING)

//     InteractionManager.runAfterInteractions(() => {
//       load()
//     })
//   }, [])

//   if (networkStatus === STATUS.FETCHING) {
//     return (
//       <Block style={viewStyles.mainContainer}>
//         <Loader />
//       </Block>
//     )
//   }

//   if (networkStatus === STATUS.FAILED) {
//     return (
//       <Block middle style={viewStyles.mainContainer}>
//         <NoData text='Something went wrong' />
//       </Block>
//     )
//   }

//   return (
//     <>
//       <Block style={viewStyles.mainContainer}>
//         <ScrollView contentContainerStyle={styles.container}>
//           <Status status={status} statusText={statusText} />
//           <Divider small />
//           {items.map((item, index) => (
//             <Item key={index} {...item} />
//           ))}
//           <Divider large />
//           {toShowCancelButton && (
//             <Block center>
//               <Text style={{ color: iOSColors.red }} onPress={() => onCancelBooking()}>
//                 Cancel Booking
//               </Text>
//             </Block>
//           )}
//         </ScrollView>
//       </Block>
//       <Overlay
//         isVisible={isConfirmModalVisible}
//         overlayStyle={styles.overlay}
//       >
//         <Block flex space='between'>
//           <Block flex style={styles.overlayContent}>
//             <Text style={{ ...human.footnote, textAlign: 'center' }}>
//             {'Are you sure you want to cancel this booking?'}

//               {/* {'Are you sure you want to cancel this booking?'} */}
//             </Text>
//             <Divider small />
//             <Block row width='95%'>
//               <Icon name='alert-circle-outline' size={12} color={iOSColors.red} />
//               <Text style={{ ...human.caption2, textAlign: 'left', marginLeft: 5 }}>
//                 {'The facility may have cancellation charges, that will be deducted before refunding the booking amount.'}
//               </Text>
//             </Block>
//           </Block>
//           <Block row space='around'>
//             <Button onPress={() => onConfirmCancelBooking()} color={iOSColors.black} style={styles.overlayButton}>
//               <Text style={{ ...human.caption1White }}>Yes</Text>
//             </Button>
//             <Button onPress={() => setConfirmModalVisibility(false)} color={iOSColors.customGray} style={styles.overlayButton}>
//               <Text style={{ ...human.caption1 }}>Not Now</Text>
//             </Button>
//           </Block>
//         </Block>
//       </Overlay>
//       <Overlay
//         isVisible={isSuccessModalVisible}
//         overlayStyle={styles.overlay}
//       >
//         <Block flex space='between'>
//           <Block style={styles.overlayContent}>
//             <Text style={{ ...human.footnote, textAlign: 'center' }}>
//               {isSuccessText}
//             </Text>
//           </Block>
//           <Block row space='around'>
//             <Button onPress={() => onConfirmCancelledBooking()} color={iOSColors.black} style={[styles.overlayButton, { width: '100%' }]}>
//               <Text style={{ ...human.caption1White }}>Okay</Text>
//             </Button>
//           </Block>
//         </Block>
//       </Overlay>
//     </>
//   )
// }

// BookingScreen.navigationOptions = ({ navigation, screenProps }) => {
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

// const Status = ({ status, statusText }) => {
//   return (
//     <Block row left>
//       <Block
//         row
//         style={{
//           backgroundColor: statusColor(status),
//           borderRadius: 2,
//           paddingHorizontal: 6
//         }}
//       >
//         <Text
//           style={{
//             ...human.caption2White,
//             fontSize: 8,
//             textTransform: 'uppercase'
//           }}
//         >
//           {statusText}
//         </Text>
//       </Block>
//     </Block>
//   )
// }

// const ChargeItem = ({ value, label }) => {
//   return (
//     <Block flex>
//       <Block row>
//         <Block row middle>
//           {
//             check.assigned(value)
//               ? (
//                 <>
//                   <RupeeIcon size={12} style={{ marginRight: 2 }} />
//                   <Text style={{ ...human.subhead, ...systemWeights.bold }}>
//                     {value}
//                   </Text>
//                 </>
//               )
//               : (
//                 <Text style={{ ...human.subhead }}>
//                   {value || '-'}
//                 </Text>
//               )
//           }
//         </Block>
//       </Block>
//       {label && (
//         <Text style={{ ...human.caption2, marginTop: 2 }}>
//           {label}
//         </Text>
//       )}
//     </Block>
//   )
// }

// const Item = ({ label, value, display }) => {
//   if (!display) {
//     return <></>
//   }

//   const _label = () => {
//     if (check.not.assigned(label)) {
//       return <></>
//     }

//     return (
//       <>
//         <Text
//           style={{ ...human.caption2, color: iOSColors.gray, letterSpacing: 2, textTransform: 'uppercase' }}
//         >
//           {label}
//         </Text>
//         <Divider small />
//       </>
//     )
//   }

//   const _value = () => {
//     if (check.function(value)) {
//       return value()
//     }

//     return (
//       <Text style={{ ...human.subhead, ...systemWeights.bold }}>{value}</Text>
//     )
//   }

//   return (
//     <Block style={styles.item}>
//       {_label()}
//       {_value()}
//     </Block>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: galioTheme.SIZES.BASE
//   },
//   item: {
//     justifyContent: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: iOSColors.customGray,
//     marginBottom: galioTheme.SIZES.BASE * 2
//   },
//   overlayButton: {
//     borderRadius: 0,
//     flex: 1
//   },
//   overlay: {
//     borderRadius: 10,
//     ...elevationShadowStyle({ elevation: 20 }),
//     height: 165,
//     overflow: 'hidden',
//     padding: 0,
//     width: 280
//   },
//   overlayContent: {
//     paddingHorizontal: 10,
//     paddingVertical: 20
//   }
// })

// export default BookingScreen
