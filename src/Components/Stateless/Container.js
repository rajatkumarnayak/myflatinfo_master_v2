import React from 'react'
import { Text } from 'react-native'
import { Block } from 'galio-framework'
import { human, iOSColors } from 'react-native-typography'
import check from 'check-types'

import { Loader, SkeletonLoader, Divider, Button } from '.'
import { Icon, ICON_TYPE } from '../../Icons'
import viewStyles from '../../Styles/ViewStyles'
import { STATUS, LICENSE } from '../../Constants'

const UnlicensedMessage = ({ message, onReload }) => {
  return (
    <Block flex middle style={viewStyles.mainContainer}>
      <Icon name='do-not-disturb' size={60} color={iOSColors.red} />
      <Divider />
      <Text
        style={{ ...human.caption1, color: iOSColors.gray, marginTop: 5 }}
      >
        {message}
      </Text>
      <Divider />
      <Button
        onPress={onReload}
        small
        shadowless
        round
        outline
        color='info'
      >
        Retry
      </Button>
    </Block>
  )
}

const NetworkFailureMessage = ({ message, onReload }) => {
  return (
    <Block flex middle style={viewStyles.mainContainer}>
      <Icon origin={ICON_TYPE.ANT_ICON} name='questioncircleo' size={50} color={iOSColors.gray} />
      <Divider />
      <Text
        style={{ ...human.caption1, color: iOSColors.gray, marginTop: 5 }}
      >
        {check.assigned(message) ? message : 'Something went wrong'}
      </Text>
      <Divider />
      <Button
        onPress={onReload}
        small
        shadowless
        round
        outline
        color='info'
      >
        Retry
      </Button>
    </Block>
  )
}

const Container = ({
  status,
  failureReason,
  license,
  data,
  onLoad,
  showSkeletonLoader = false,
  children
}) => {
  if (status === STATUS.FETCHING) {
    if (showSkeletonLoader) {
      return <SkeletonLoader />
    }

    return <Loader />
  }

  if (status === STATUS.FAILED) {
    if (license === LICENSE.NOT_PURCHASED) {
      return <UnlicensedMessage message={failureReason} onReload={() => onLoad()} />
    }
    return <NetworkFailureMessage message={failureReason} onReload={() => onLoad()} />
  }

  return (
    <Block flex style={viewStyles.mainContainer}>
      {children}
    </Block>
  )
}

export default Container
