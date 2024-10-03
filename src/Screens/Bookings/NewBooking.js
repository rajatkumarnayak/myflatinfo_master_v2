import React, { useEffect, useState, useRef } from 'react'
import { Text, StyleSheet, ScrollView, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { Block, theme as galioTheme, Button } from 'galio-framework'
import { Overlay } from 'react-native-elements'
import { iOSColors, human, systemWeights } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check  from 'check-types'
import moment from 'moment'

import { Navbar, RupeeIcon, Divider, DatePicker, Confirm, Switch, Picker, TimePicker, Icon } from '../../Components/Stateless'
import viewStyles from '../../Styles/ViewStyles'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import useTheme from '../../Themes/Context'
import colors from '../../Themes/Colors'
import NavigationService from '../../Navigation'
import { formattedMoney, enumerateTimeDuration } from '../../Utils/Utils'
import { ApiService, StoreService } from '../../Store'
import { BOOKING_DEFAULT_START_DATE, API_REQUEST_DATE_FORMAT, GATEPASS_DEFAULT_START_TIME, GATEPASS_DEFAULT_END_TIME } from '../../Constants'

const { height } = Dimensions.get('window')
const timeDurations = enumerateTimeDuration(60)
const Label = ({ children }) => <Text style={{ ...human.footnote }}>{children}</Text>

const NewBookingScreen = ({ navigation, data }) => {
  const { startTime, endTime } = data ||
  {
    id: null,
    name: null,
    description: null,
    venue: null,
    startDate: BOOKING_DEFAULT_START_DATE,
    endDate: BOOKING_DEFAULT_START_DATE,
    startTime: GATEPASS_DEFAULT_START_TIME,
    endTime: GATEPASS_DEFAULT_END_TIME
  }
  const { theme } = useTheme()
  const [selectedValue, setSelectedValue] = useState(1)
  const [isHourlyEnabled, setIsHourlyEnabled] = useState(true)
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true)
  const loadList = useStoreActions(actions => actions.bookings.load)
  const loadFacilityList = useStoreActions(actions => actions.bookings.loadAreaList)
  const facilityList = useStoreState(state => state.bookings.areaList)
  const [selectedArea, setSelectedArea] = useState(null)
  const [facilityName, setFacilityName] = useState(null)
  const [startDate, setStartDate] = useState(BOOKING_DEFAULT_START_DATE)
  const [endDate, setEndDate] = useState(BOOKING_DEFAULT_START_DATE)
  const [facilityChargeDaily, setFacilityChargeDaily] = useState(null)
  const [facilityChargeHourly, setFacilityChargeHourly] = useState(null)
  const [facilityChargeCancellation, setFacilityChargeCancellation] = useState(null)
  const [isFacilityListModalVisible, setFacilityListModalVisibility] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmResponseText, setConfirmResponseText] = useState(null)
  const [_startTime, setStartTime] = useState(startTime)
  const [_endTime, setEndTime] = useState(endTime)
  const [isActive , setIsActive ] = useState(false)
  const [endTimeList, setEndTimeList] = useState(timeDurations
    .slice(1) // remove first item '00:00'
    .concat([timeDurations[0]]) // add '00:00' to end of list
    .slice(timeDurations.indexOf(_startTime)) // remove all items lesser than the start time
  )
  const confirmRef = useRef()

  const _setFacility = (_facility) => {
    const { name, perHourCharge, perDayCharge, cancellationCharge } = _facility
    const _isHourlyBookingAvailable = check.assigned(perHourCharge) && perHourCharge > 0
    const _isDailyBookingAvailable = check.assigned(perDayCharge) && perDayCharge > 0

    setSelectedArea(_facility)
    setFacilityName(name)
    setFacilityChargeHourly(perHourCharge)
    setFacilityChargeDaily(perDayCharge)
    setFacilityChargeCancellation(cancellationCharge)
    setIsHourlyEnabled(_isHourlyBookingAvailable)
    setIsSwitchEnabled(_isHourlyBookingAvailable && _isDailyBookingAvailable)
  }

  const onPressBookingAreaItem = (item) => {
    setFacilityListModalVisibility(false)
    _setFacility(item)
  }

  const daysBooked = () => {
    const diff = moment(endDate).diff(moment(startDate), 'days')

    return diff + 1
  }

  const onChangeBookingPeriod = () => {
    setIsHourlyEnabled(!isHourlyEnabled)
  }

  async function create (payload) {
    console.log(payload ,"payload >>>>> booking new >>>");
    const response = await ApiService.putBookingItemData(payload)
     console.log(response ,"response >>>>> booking new");
    if (response.ok) {
      loadList({ startDate: null, endDate: null })
      NavigationService.goBack()
    } else {
      if (response.status === 409) {
        setConfirmResponseText(response.data)
        confirmRef.current.show()
      }
    }
    setIsSubmitting(false)
  }
  const onSubmit = () => {
    if (isHourlyEnabled) {
      const payload = {

        typeId: selectedArea.typeId,
        startDate: null,
        endDate: null,
        numberOfHours: selectedValue,
        flatId:StoreService.getState().app.flat.flatId
      }

      setIsSubmitting(true)
      create(payload)
    } else {
      const payload = {
        typeId: selectedArea.typeId,
        startDate: moment(startDate).format(API_REQUEST_DATE_FORMAT),
        endDate: moment(endDate).format(API_REQUEST_DATE_FORMAT),
        numberOfHours: null
      }

      setIsSubmitting(true)
      create(payload)
    }
  }
  const onSelect = (item) => {
    setSelectedValue(item)
  }
  useEffect(() => {
    loadFacilityList()
  }, [])

  useEffect(() => {
    if (check.nonEmptyArray(facilityList)) {
      _setFacility(facilityList[0])
    }
  }, [facilityList])

  useEffect(() => {
    setEndTimeList(timeDurations
      .concat([timeDurations[0]]) // add '00:00' to end of list
      .slice(timeDurations.indexOf(_startTime) + 1))
  }, [_startTime])

  useEffect(() => {
    if (Number(_startTime.split(':').join('')) >= Number(_endTime.split(':').join(''))) {
      setEndTime(endTimeList[0])
    }
  }, [endTimeList])
  return (
    <Block style={styles.container}>
      <ScrollView>
        <Divider />
        <Block style={styles.section}>
               <Block row>
                 <Block>
                   <Label>Facility</Label>
                 </Block>
               </Block>
     
               <Divider small />
               <Block style={viewStyles.pickerContainer}>
                 <TouchableOpacity
                   onPress={() => setFacilityListModalVisibility(true)}
                 >
                   <Block>
                     <Picker
                     disabled ={true}
                       selectedValue={facilityName}
     
                     />
                     <Text numberOfLines={1} style={styles.pickerText}>
                       {facilityName}
                     </Text>
                   </Block>
                 </TouchableOpacity>
     
               </Block>
             </Block>
        {/* {facilityList && facilityList > 0 ? 
        (
          <View>
            {facilityList.isActive ? (
               <Block style={styles.section}>
               <Block row>
                 <Block>
                   <Label>Facility</Label>
                 </Block>
               </Block>
     
               <Divider small />
               <Block style={viewStyles.pickerContainer}>
                 <TouchableOpacity
                   onPress={() => setFacilityListModalVisibility(true)}
                 >
                   <Block>
                     <Picker
                     disabled ={true}
                       selectedValue={facilityName}
     
                     />
                     <Text numberOfLines={1} style={styles.pickerText}>
                       {facilityName}
                     </Text>
                   </Block>
                 </TouchableOpacity>
     
               </Block>
             </Block>

            ):null}
          </View>
        ):null} */}
         {/* <Block style={styles.section}>
          <Block row>
            <Block>
              <Label>Facility</Label>
            </Block>
          </Block>

          <Divider small />
          <Block style={viewStyles.pickerContainer}>
            <TouchableOpacity
              onPress={() => setFacilityListModalVisibility(true)}
            >
              <Block>
                <Picker
                disabled ={true}
                  selectedValue={facilityName}

                />
                <Text numberOfLines={1} style={styles.pickerText}>
                  {facilityName}
                </Text>
              </Block>
            </TouchableOpacity>

          </Block>
        </Block> */}
        <Divider large />
        {isSwitchEnabled && (
          <>
            <Block row space='between' middle style={styles.section}>
              <Block>
                <Label>{isHourlyEnabled ? 'Hourly booking enabled' : 'Enable hourly booking'}</Label>
              </Block>
              <Block style={styles.switchStyles}>
                <Switch
                  value={isHourlyEnabled}
                  onChange={() => onChangeBookingPeriod()}
                  trackColor={{ false: colors.grey400, true: theme.colors.primary }}
                />
              </Block>
            </Block>
            <Divider large />
          </>
        )}

        {isHourlyEnabled ? (
          <Block style={styles.section}>
            <Label>Select number of hours</Label>
            <Divider small />
            <TimePicker onSelect={onSelect} selectedValue={selectedValue} />
          </Block>
        ) : (
          <Block style={styles.section}>

            <Label>Dates</Label>
            <Divider small />
            <Block>
              <Block style={viewStyles.pickerContainer}>
                <DatePicker
                  initialRange={[startDate, endDate]}
                  onSelect={(s, e) => {
                    setStartDate(s)
                    setEndDate(e)
                  }}
                />
              </Block>

            </Block>
          </Block>
        )}

        <Divider large />
        <Block style={styles.section}>
          <Block row middle space='between'>
            <Block>
              <Text
                style={{ ...human.footnote, color: iOSColors.gray }}
              >
                {`Charge per ${isHourlyEnabled ? 'hour' : 'day'}`}
              </Text>
            </Block>
            <Block middle row>
              <RupeeIcon size={12} style={{ marginRight: 5 }} />
              <Text
                style={{ ...human.body, marginRight: 5 }}
              >
                {isHourlyEnabled ? formattedMoney(facilityChargeHourly) : formattedMoney(facilityChargeDaily)}
              </Text>
            </Block>
          </Block>
        </Block>
        <Divider line large />
        <Block style={styles.section}>
          <Block row middle space='between'>
            <Block>
              <Text
                style={{ ...human.footnote, color: iOSColors.gray }}
              >
                {`${isHourlyEnabled ? 'Hours booked' : 'Days booked'}`}
              </Text>
            </Block>
            <Block middle row>
              <Text
                style={{ ...human.body, marginRight: 5 }}
              >
                {isHourlyEnabled ? selectedValue : daysBooked()}
              </Text>
            </Block>
          </Block>
        </Block>
        <Divider line large />
        <Block style={styles.section}>
          <Block row middle space='between'>
            <Block>
              <Text
                style={{ ...human.footnote, ...systemWeights.semibold, color: iOSColors.gray }}
              >
                Total charges
              </Text>
            </Block>
            <Block middle row>
              <RupeeIcon size={12} style={{ marginRight: 5 }} />
              <Text
                style={{ ...human.body, marginRight: 5 }}
              >
                {isHourlyEnabled ? formattedMoney(facilityChargeHourly * selectedValue) : formattedMoney(facilityChargeDaily * daysBooked())}

              </Text>
            </Block>
          </Block>
        </Block>
        <Divider line large />
        <Block style={styles.section}>
          <Block row middle space='between'>
            <Block row>
              <Icon name='alert-circle-outline' size={18} color={iOSColors.red} />
              <Text
                style={{ ...human.footnote, color: iOSColors.gray, marginLeft: 5 }}
              >
                Cancellation charges
              </Text>
            </Block>
            <Block middle row>
              <RupeeIcon size={12} style={{ marginRight: 5 }} />
              <Text
                style={{ ...human.body, marginRight: 5 }}
              >
                {formattedMoney(facilityChargeCancellation)}
              </Text>
            </Block>
          </Block>
        </Block>
        <Divider small />
      </ScrollView>
      <Block style={[viewStyles.submitButtonContainer]}>
        <Button
          onPress={onSubmit}
          loading={isSubmitting}
          round
          size='large'
          color={theme.colors.primary}
        >
          <Text style={{ ...human.bodyWhite }}>Book</Text>
        </Button>
      </Block>
      <Overlay
        isVisible={isFacilityListModalVisible}
        onBackdropPress={() => setFacilityListModalVisibility(false)}
        windowBackgroundColor='rgba(0, 0, 0, .5)'
        overlayStyle={styles.modal}
        containerStyle={styles.modalContainer}
      >
        <>
          <Text style={styles.modalHeading}>Select Facility</Text>
          <FlatList
            data={facilityList}
            renderItem={({ item, index }) => (
              <Facility
                data={item}
                index={index}
                onPress={() => onPressBookingAreaItem(item)}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            contentOffset={{ x: 50 }}
          />
        </>
      </Overlay>
      <Confirm
        ref={confirmRef}
        showCancelButton={false}
        text={confirmResponseText}
      />
    </Block>
  )
}

const Facility = ({ data, index, onPress }) => {
  const { name, description, perDayCharge, perHourCharge, isActive } = data
  return (
    <Block
      middle
      space='between'
      style={{
        ...styles.bookingAreaCard,
        marginLeft: index === 0 ? 30 : 15
      }}
    >
      <Block center>
        <Text style={{ ...human.body, ...systemWeights.semibold }}>{name}</Text>
        <Divider small />
        <Text style={{ ...human.footnote }}>{description}</Text>
        <Divider small />
        <Block space='between'>
          {perHourCharge && perHourCharge > 0 && (
            <>
              <Block>
                <Block middle row>
                  <RupeeIcon size={14} style={{ marginRight: 5 }} />
                  <Text
                    style={{ ...human.title3, ...systemWeights.bold, marginRight: 5 }}
                  >
                    {formattedMoney(perHourCharge)}
                  </Text>
                  <Text
                    style={{ ...human.caption2, color: iOSColors.gray, marginLeft: 5 }}
                  >
                per hour
                  </Text>
                </Block>
              </Block>
              <Divider small />
            </>
          )}
          <Block>
            <Block middle row>
              <RupeeIcon size={14} style={{ marginRight: 5 }} />
              <Text
                style={{ ...human.title3, ...systemWeights.bold, marginRight: 5 }}
              >
                {formattedMoney(perDayCharge)}
              </Text>
              <Text
                style={{ ...human.caption2, color: iOSColors.gray, marginLeft: 5 }}
              >
            per day
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
      <Button
        round
        small
        color={colors.blue300}
        onPress={() => onPress(data)}
        style={{ marginTop: 15, width: 120,opacity:!isActive ? 0.5 : null}}
        disabled={!isActive}
      >
        <Text style={{ ...human.footnoteWhite }}>Select</Text>
      </Button>
    </Block>
  )
}

NewBookingScreen.navigationOptions = ({ navigation, screenProps }) => {
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

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  section: {
    marginHorizontal: galioTheme.SIZES.BASE
  },
  opacity:{
     opacity:0.5
  },
  textarea: {
    borderRadius: 6,
    height: 100,
    ...elevationShadowStyle({ elevation: 2 })
  },
  buttonGroupContainer: {
    borderRadius: 6,
    borderWidth: 0,
    marginTop: 0,
    marginLeft: 0,
    overflow: 'hidden',
    width: '100%',
    ...elevationShadowStyle({ elevation: 2 })
  },
  pickerContainer: {
    borderRadius: 6,
    height: 50,
    width: undefined,
    ...elevationShadowStyle({ elevation: 0.5 })
  },
  pickerText: {
    fontSize: 15,
    position: 'absolute',
    top: 15,
    right: 8,
    width: '90%'
  },
  imageContainer: {
    borderRadius: 6,
    height: height / 3,
    overflow: 'hidden',
    ...elevationShadowStyle({ elevation: 2 })
  },
  photoName: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 20,
    left: 20,
    ...human.caption2White
  },
  removeImage: {
    opacity: 0.5,
    position: 'absolute',
    top: 20,
    right: 20
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 420,
    margin: 0,
    padding: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  modalContent: {
    padding: 30
  },
  modalHeading: {
    ...human.body,
    ...systemWeights.bold,
    marginHorizontal: 30,
    marginTop: 30
  },
  bookingAreaCard: {
    backgroundColor: iOSColors.gray,
    borderRadius: 30,
    height: 280,
    marginHorizontal: 15,
    marginVertical: 30,
    paddingHorizontal: 15,
    paddingVertical: 25,
    width: 280,
    ...elevationShadowStyle({ elevation: 6 })
  },
  bookingAreaCardButton: {
    marginTop: 15,
    width: 120
  }
})

export default NewBookingScreen
