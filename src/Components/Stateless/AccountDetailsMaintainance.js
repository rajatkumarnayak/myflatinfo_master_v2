import React, { useState, useEffect } from 'react'
import { ScrollView, Text, Dimensions, ActivityIndicator, FlatList } from 'react-native'
import { Block, Button, theme as galioTheme } from 'galio-framework'
import { Overlay } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { human, systemWeights, iOSColors, material } from 'react-native-typography'
import check from 'check-types'
import isUrl from 'is-url'

import { Divider, NoData, FileLink, RupeeIcon, Loader } from '.'
import { Icon } from '../../Icons'
import colors from '../../Themes/Colors'
import { STATUS, ACCOUNTS_PAYMENT } from '../../Constants'
import { formattedMoney } from '../../Utils/Utils'

const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

const statusColors = (status) => {
  if (status === ACCOUNTS_PAYMENT.PAID.value) {
    return [colors.green300, colors.green600]
  } else {
    return [colors.orange300, colors.orange600]
  }
}

const AccountDetailsMaintainance = ({ amount, status, statusText, items, networkStatus, onUpdate, active }) => {
 
  console.log(active, "isaCTIVE >>>> active");
  // const value = active.toLowerCase();
  // console.log(value,"value >>>>>");
  const [_status, setStatus] = useState(status)

  const [isPaymentModalVisible, setPaymentModalVisibility] = useState(false)
  const [isActive , setIsActive ] = useState(active)
  console.log(isActive ,"isActive >>>>>>>>>>");
  

  

  const _onUpdate = () => {
    setPaymentModalVisibility(true)
    setTimeout(() => {
      onUpdate()
      setPaymentModalVisibility(false)
    }, 3000)
  }

  const renderHeaderContent = () => (
    <LinearGradient colors={statusColors(_status)} style={styles.headerBg}>
      <Block center middle style={styles.headerFg}>
        <Block row>
          <RupeeIcon style={{ color: iOSColors.white, fontSize: 30, opacity: 0.7 }} />
          <Text
            style={{ ...material.display3White, ...systemWeights.semibold, color: iOSColors.white }}
          >
            {formattedMoney(amount)}
          </Text>
        </Block>
        <Divider small />
        <StatusTag status={_status} statusText={statusText} />
      </Block>
    </LinearGradient>
  )

  const renderPayButton = () => {
    if (_status === ACCOUNTS_PAYMENT.PENDING.value) {
      console.log(isActive ,"aaaa");
      // let value = isActive.toString();
      // let main = value.toLowerCase()
      // console.log(main,"main >>>>");
      // let value = isActive !=null && undefined.toLowerCase();
      // console.log(value ,"value >>>>");
      return (
        <Block center>
         <Button
          
           onPress={isActive =="true" ? _onUpdate:null} 
            round uppercase color={iOSColors.blue} size='small'  disabled={!isActive} style={{opacity : isActive == "true"  ? 1 :0.3}}
          >
            <Text
              style={{ ...human.bodyWhite, ...systemWeights.bold, textTransform: 'uppercase' }}
            >
              Pay Now 
            </Text>
          </Button>
          <Divider />
        </Block>
      )
    }
  }

  const renderMainContent = () => {
    if (check.not.assigned(items)) {
      return <></>
    }

    return (
      <ScrollView>
        <Block flex style={styles.container}>
          {renderHeaderContent()}
          <Block flex style={styles.panel}>
            <Divider small />
            {renderPayButton()}
            <FlatList
              data={items}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => <Item {...item} />}
            />
          </Block>
        </Block>
      </ScrollView>
    )
  }

  useEffect(() => {
    if (check.assigned(status)) {
      setStatus(status)
    }
    if(check.assigned(active)){
      setIsActive(active)
    
    }
  }, [status,active,isActive])

  if (networkStatus === STATUS.FETCHING) {
    return (
      <Block flex middle height={height}>
        <Loader />
      </Block>
    )
  }

  if (networkStatus === STATUS.FAILED) {
    return (
      <Block flex middle height={height}>
        <NoData text='Something went wrong' />
      </Block>
    )
  }

  return (
    <Block>
      {renderMainContent()}
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

const StatusTag = ({ status, statusText }) => {
  let _statusText = ACCOUNTS_PAYMENT.PENDING.label
  let icon = 'alert-circle-outline'
  let color = iOSColors.orange

  if (status === ACCOUNTS_PAYMENT.PAID.value) {
    _statusText = ACCOUNTS_PAYMENT.PAID.label
    icon = 'check-circle-outline'
    color = iOSColors.green
  }

  if (check.assigned(statusText)) {
    _statusText = statusText
  }

  return (
    <Block middle>
      <Block row middle style={styles.status}>
        <Icon
          name={icon}
          size={16}
          color={color}
        />
        <Text
          style={{
            ...human.caption1,
            ...systemWeights.bold,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginLeft: 10,
            color: color
          }}
        >
          {_statusText}
        </Text>
      </Block>
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
    <Block middle style={styles.item}>
      {_label()}
      {_value()}
    </Block>
  )
}

const styles = {
  headerBg: { height: 260, position: 'absolute', left: 0, top: 0, right: 0 },
  headerFg: {
    height: 240,
    paddingVertical: 60
  },
  status: {
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  payButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
    width: 120
  },
  payButtonText: {

  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.customGray,
    height: 80,
    paddingHorizontal: galioTheme.SIZES.BASE
  },
  profile: {
    marginTop: 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  container: {
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  panel: {
    flex: 1,
    flexGrow: 1,
    height: '100%',
    // position: "relative",
    padding: galioTheme.SIZES.BASE,
    // marginHorizontal: theme.SIZES.BASE,
    marginTop: 240,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: galioTheme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  }
}

export default AccountDetailsMaintainance
