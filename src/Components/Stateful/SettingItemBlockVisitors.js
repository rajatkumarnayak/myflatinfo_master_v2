import React, { useEffect, useState, useRef } from 'react'
import { TouchableOpacity, Text, StyleSheet,View,Dimensions } from 'react-native'
import { Block, Switch, Button } from 'galio-framework'
import { Picker } from 'native-base'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import moment from 'moment'
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modal'

import { Divider, Panel, DatePicker, Icon } from '../Stateless'
import useTheme from '../../Themes/Context'
import viewStyles from '../../Styles/ViewStyles'
import { enumerateTimeDuration } from '../../Utils/Utils'
import { BOOKING_DEFAULT_START_DATE, API_REQUEST_DATE_FORMAT, SETTING_ITEM_BLOCK_VISITORS_DATE_DISPLAY_FORMAT, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_DATE_FORMAT, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_TIME_FORMAT, SETTING_ITEM_BLOCK_VISITORS_TIME_DISPLAY_FORMAT } from '../../Constants'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const timeDurations = enumerateTimeDuration()
const screenHeight = Dimensions.get('screen').height

const PanelHandle = () => <View style={styles.panelHandle} />


const SettingItemBlockVisitors = () => {
  const { theme } = useTheme()

  const {
    activateBlockVisitors,
    deactivateBlockVisitors,
    statusOfBlockVisitors
  } = useStoreActions(actions => ({ ...actions.settings }))
  const { blockVisitorsData } = useStoreState(state => ({ ...state.settings }))

  const [_startDate, setStartDate] = useState(BOOKING_DEFAULT_START_DATE)
  const [_endDate, setEndDate] = useState(BOOKING_DEFAULT_START_DATE)
  const [_startTime, setStartTime] = useState(moment().add(1, 'hours').format('HH:00'))
  const [_endTime, setEndTime] = useState(moment().add(1, 'hours').add(30, 'minutes').format('HH:00'))
  const [startTimeList, setStartTimeList] = useState(timeDurations)
  const [endTimeList, setEndTimeList] = useState(timeDurations
    .slice(1) // remove first item '00:00'
    .concat([timeDurations[0]]) // add '00:00' to end of list
    .slice(timeDurations.indexOf(_startTime)))

  const { startDate, endDate, starttime, endtime, isActive } = blockVisitorsData

  const [isVisible, setVisibility] = useState(false)


  const modalRef = useRef()

  useEffect(() => {
    setEndTimeList(timeDurations
      .concat([timeDurations[0]]) // add '00:00' to end of list
      .slice(timeDurations.indexOf(_startTime) + 1))
  }, [_startTime])

  const onSubmit = () => {
    //modalRef.current.hide()
    if (isActive) {
      deactivateBlockVisitors()
    } else {
      const payload = {
        startDate: moment(_startDate).format(API_REQUEST_DATE_FORMAT),
        endDate: moment(_endDate).format(API_REQUEST_DATE_FORMAT),
        startTime: _startTime,
        endTime: _endTime
      }
      activateBlockVisitors(payload)
      setVisibility(false)
    }
  }

  const onClickItem = () => {
    //modalRef.current.show()
    setVisibility(true)
  }

  const handleModalHide = () =>{
    setVisibility(false)
  }

  const handelSwitch = () =>{

  }



  useEffect(() => {
    //modalRef.current.hide()
    statusOfBlockVisitors()
  }, [])

  

  useEffect(() => {
    if (Number(_startTime.split(':').join('')) >= Number(_endTime.split(':').join(''))) {
      setEndTime(endTimeList[0])
    }

    statusOfBlockVisitors()
  }, [endTimeList])
  return (
    <>
      <TouchableOpacity onPress={() => onClickItem()} style={viewStyles.settingItem}>
        <Block>
          <Text
            numberOfLines={1}
            style={{ ...human.body, ...systemWeights.semibold }}
          >
            Block Visitors
          </Text>
          {
            isActive ? (<Text style={{ ...human.caption1, color: iOSColors.gray }}>Active</Text>) : null
          }
        </Block>
        <Switch value={isActive} trackColor 
        onChange={handelSwitch}
         />
      </TouchableOpacity>

      <Modal
        //animationType='slide'
        swipeDirection={['down']}
        hideModalContentWhileAnimating
        propagateSwipe
        backdropOpacity={0.5}
        useNativeDriver
        isVisible={isVisible}
        swipeThreshold={100}
        onSwipeComplete={handleModalHide}
        onBackButtonPress={handleModalHide}
        onBackdropPress={handleModalHide}
        style={styles.animatedModal}
        avoidKeyboard
      >
                <PanelHandle />

        <View style={[styles.panelContainer]}>

        <Block style={viewStyles.modalContent}>
          <Block>
            <Text style={{ ...human.title3, ...systemWeights.bold }}>Block Visitors</Text>
            <Divider small />
            <Text style={{ ...human.caption1, color: iOSColors.gray }}>Don't want to be disturbed for a certain period of time? You can conveniently block everyone from visiting you. *</Text>
            <Divider />
            {isActive ? (
              <>
                <Text style={{ ...human.subhead, color: iOSColors.gray }}>You are currently blocking visitors from</Text>
                <Divider small />
                <Text style={{ ...human.title3, ...systemWeights.semibold }}>
                  {moment(startDate, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_DATE_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_DATE_DISPLAY_FORMAT)}, {moment(starttime, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_TIME_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_TIME_DISPLAY_FORMAT)}
                </Text>
                <Divider small />
                <Text style={{ ...human.subhead, color: iOSColors.gray }}>till</Text>
                <Divider small />
                <Text style={{ ...human.title3, ...systemWeights.semibold }}>
                  {moment(endDate, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_DATE_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_DATE_DISPLAY_FORMAT)}, {moment(endtime, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_TIME_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_TIME_DISPLAY_FORMAT)}
                </Text>
              </>
            ) : (
              <>
                <Block style={styles.section}>
                  <Text style={{ ...human.footnote }}>Dates</Text>
                  <Divider small />
                  <Block style={viewStyles.pickerContainer}>
                    <DatePicker
                      initialRange={[_startDate, _endDate]}
                      onSelect={(s, e) => {
                        setStartDate(s)
                        setEndDate(e)
                      }}
                    />
                  </Block>
                </Block>
                <Divider />
                <Block>
                  <Block row middle>
                    <Block flex>
                      <Text style={{ ...human.footnote }}>Start Time</Text>
                      <Divider small />
                      <Block style={viewStyles.pickerContainer}>
                        <Picker
                          mode='dropdown'
                          iosHeader='Start time'
                          iosIcon={<Icon name='arrow-down' />}
                          style={{ width: undefined }}
                          selectedValue={_startTime}
                          onValueChange={(value) => {
                            setStartTime(value)
                          }}
                        >
                          {startTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)}
                        </Picker> 
                      </Block>
                    </Block>
                    <Block width={20} />
                    <Block flex>
                      <Text style={{ ...human.footnote }}>End time</Text>
                      <Divider small />
                      <Block style={viewStyles.pickerContainer}>
                        <Picker
                          mode='dropdown'
                          iosHeader='Start time'
                          iosIcon={<Icon name='arrow-down' />}
                          style={{ width: undefined }}
                          selectedValue={_endTime}
                          onValueChange={(value) => {
                            setEndTime(value)
                          }}
                        >
                          {endTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)}
                        </Picker> 
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </>
            )}
          </Block>
          <Block>
            <Divider large />
            <Block center>
              <Button
                onPress={() => onSubmit()}
                round
                color={theme.colors.primary}
              >
                <Text style={{ ...human.footnoteWhite, ...systemWeights.bold }}>
                  {isActive ? 'Unblock' : 'Save Changes'}
                </Text>
              </Button>
            </Block>
            <Divider small />
            <Text style={{ ...human.caption2, color: iOSColors.gray }}>* Please note that all visitors will be turned away and you won't receive any notifications about them.</Text>
          </Block>
        </Block>

        </View>

      </Modal>

      {/* <Panel
        ref={modalRef}
        height={450}
        
      >
        <Block style={viewStyles.modalContent}>
          <Block>
            <Text style={{ ...human.title3, ...systemWeights.bold }}>Block Visitors</Text>
            <Divider small />
            <Text style={{ ...human.caption1, color: iOSColors.gray }}>Don't want to be disturbed for a certain period of time? You can conveniently block everyone from visiting you. *</Text>
            <Divider />
            {isActive ? (
              <>
                <Text style={{ ...human.subhead, color: iOSColors.gray }}>You are currently blocking visitors from</Text>
                <Divider small />
                <Text style={{ ...human.title3, ...systemWeights.semibold }}>
                  {moment(startDate, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_DATE_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_DATE_DISPLAY_FORMAT)}, {moment(starttime, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_TIME_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_TIME_DISPLAY_FORMAT)}
                </Text>
                <Divider small />
                <Text style={{ ...human.subhead, color: iOSColors.gray }}>till</Text>
                <Divider small />
                <Text style={{ ...human.title3, ...systemWeights.semibold }}>
                  {moment(endDate, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_DATE_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_DATE_DISPLAY_FORMAT)}, {moment(endtime, SETTING_ITEM_BLOCK_VISITORS_API_RESPONSE_TIME_FORMAT).format(SETTING_ITEM_BLOCK_VISITORS_TIME_DISPLAY_FORMAT)}
                </Text>
              </>
            ) : (
              <>
                <Block style={styles.section}>
                  <Text style={{ ...human.footnote }}>Dates</Text>
                  <Divider small />
                  <Block style={viewStyles.pickerContainer}>
                    <DatePicker
                      initialRange={[_startDate, _endDate]}
                      onSelect={(s, e) => {
                        setStartDate(s)
                        setEndDate(e)
                      }}
                    />
                  </Block>
                </Block>
                <Divider />
                <Block>
                  <Block row middle>
                    <Block flex>
                      <Text style={{ ...human.footnote }}>Start Time</Text>
                      <Divider small />
                      <Block style={viewStyles.pickerContainer}>
                      <ModalDropdown
                       options={startTimeList}
                       onSelect={handleSelectStartTime}
                       textStyle={{fontSize:16}}
                       style={{height:200,paddingTop:14,paddingLeft:16}}
                       dropdownStyle={{width:100,backgroundColor:'white',elevation:10}}
                       dropdownTextStyle={{fontSize:16}}
                      >
                    </ModalDropdown>
                        <Picker
                          mode='dropdown'
                          iosHeader='Start time'
                          iosIcon={<Icon name='arrow-down' />}
                          style={{ width: undefined }}
                          selectedValue={_startTime}
                          onValueChange={(value) => {
                            setStartTime(value)
                          }}
                        >
                          {startTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)}
                        </Picker> 
                      </Block>
                    </Block>
                    <Block width={20} />
                    <Block flex>
                      <Text style={{ ...human.footnote }}>End time</Text>
                      <Divider small />
                      <Block style={viewStyles.pickerContainer}>
                      <ModalDropdown
                       options={endTimeList}
                       onSelect={handleSelectEndTime}
                       textStyle={{fontSize:16}}
                       style={{height:200,paddingTop:14,paddingLeft:16}}
                       dropdownStyle={{width:100,backgroundColor:'white',elevation:10}}
                       dropdownTextStyle={{fontSize:16}}
                      >
                    </ModalDropdown>
                        <Picker
                          mode='dropdown'
                          iosHeader='Start time'
                          iosIcon={<Icon name='arrow-down' />}
                          style={{ width: undefined }}
                          selectedValue={_endTime}
                          onValueChange={(value) => {
                            setEndTime(value)
                          }}
                        >
                          {endTimeList.map((time) => <Picker.Item label={time} value={time} key={time} />)}
                        </Picker> 
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </>
            )}
          </Block>
          <Block>
            <Divider large />
            <Block center>
              <Button
                onPress={() => onSubmit()}
                round
                color={theme.colors.primary}
              >
                <Text style={{ ...human.footnoteWhite, ...systemWeights.bold }}>
                  {isActive ? 'Unblock' : 'Save Changes'}
                </Text>
              </Button>
            </Block>
            <Divider small />
            <Text style={{ ...human.caption2, color: iOSColors.gray }}>* Please note that all visitors will be turned away and you won't receive any notifications about them.</Text>
          </Block>
        </Block>
      </Panel> */}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  section: {
    // marginHorizontal: galioTheme.SIZES.BASE
  },
  staticModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight / 2,
    margin: 0,
    padding: 0,
    // position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    // bottom: 0,
    width: '100%',
    ...elevationShadowStyle({ elevation: 30 })
  },
  animatedModal: {
    justifyContent: 'flex-end',
    margin: 0,
    height:450
  },
  panelHandle: {
    alignSelf: 'center',
    backgroundColor: '#ededed',
    borderRadius: 4,
    height: 5,
    marginVertical: 10,
    width: 50
  },
  panelContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight / 2,
    ...elevationShadowStyle({ elevation: 30 }),
    backgroundColor:'white'
  },
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  modalContainer: {
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width,
    backgroundColor: 'red'
  }
})

export default SettingItemBlockVisitors
