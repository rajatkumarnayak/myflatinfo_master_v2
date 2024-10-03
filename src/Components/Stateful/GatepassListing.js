import React, { useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import moment from 'moment'
import { Overlay } from 'react-native-elements'
import { Container, Listing, NoData, Divider, Tag, Icon, Button } from '../Stateless'
import { GATEPASS_STATUS, GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT } from '../../Constants'
import { ApiService } from '../../Store'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const GatepassListing = ({ navigation }) => {
  const load = useStoreActions(actions => actions.gatepasses.load)
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.gatepasses }))
  const [itemToUpdate, setItemToUpdate] = useState({ primaryVisitor: null, startDateTime: null, endDateTime: null, status: GATEPASS_STATUS.INVALID.value })
  const [isConfirmModalVisible, setConfirmModalVisibility] = useState(false)

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  async function update (payload) {
    const response = await ApiService.patchGatepassItemData(payload)
    if (response.ok) {
      onLoad()
    }
  }

  const onPressAction = (item) => {
    setItemToUpdate(item)
    setConfirmModalVisibility(true)
  }

  const onConfirmRevoke = () => {
    setConfirmModalVisibility(false)
    const payload = {
      ...itemToUpdate,
      status: GATEPASS_STATUS.INVALID.value
    }
    update(payload)
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <Block style={styles.container}>
      <Container
        status={status}
        failureReason={failureReason}
        license={license}
        data={data}
        onLoad={() => onLoad()}
        showSkeletonLoader
      >
        <Listing
          items={data}
          onLoad={onLoad}
          itemContentComponent={(item) => <ItemContentComponent data={item} onPressAction={onPressAction} />}

          noDataComponent={() => <NoData text='No gate passes found' />}
        />
      </Container>
      <Overlay
        isVisible={isConfirmModalVisible}
        overlayStyle={{ ...styles.overlay, ...elevationShadowStyle({ elevation: 20 }) }}
      >
        <Block flex space='between'>
          <Block style={styles.overlayContent}>
            <Text style={{ ...human.footnote, textAlign: 'center' }}>
              {'Are you sure you want to revoke gate pass of '}
              <Text style={{ ...human.footnote, ...systemWeights.semibold }}>{itemToUpdate.primaryVisitor}</Text>
              {'?'}
            </Text>
          </Block>
          <Block row space='around'>
            <Button onPress={onConfirmRevoke} color={iOSColors.black} style={styles.overlayButton}>
              <Text style={{ ...human.caption1White }}>Yes</Text>
            </Button>
            <Button onPress={() => setConfirmModalVisibility(false)} color={iOSColors.customGray} style={styles.overlayButton}>
              <Text style={{ ...human.caption1 }}>Not Now</Text>
            </Button>
          </Block>
        </Block>
      </Overlay>
    </Block>
  )
}

const ItemContentComponent = ({ data, onPressAction }) => {
  const { id, gpNumber, primaryVisitor, startDate, endDate, startTime, endTime, startDateTime, endDateTime, status, statusText } = data

  const renderTimePeriodText = () => {
    if (startDateTime && endDateTime) {
      return `${moment(startDateTime).format(GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT)} - ${moment(endDateTime).format(GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT)}`
    }

    if (startDate && endDate) {
      return `${startDate} - ${endDate}`
    }
  }

  return (
    <Block flex row space='between' style={{ padding: galioTheme.SIZES.BASE, paddingRight: 0 }}>
      <Block>
        <Text
          numberOfLines={1}
          style={{ ...human.body, ...systemWeights.bold }}
        >
          {gpNumber}
        </Text>
        <Text
          numberOfLines={1}
          style={{ ...human.footnote }}
        >
          {primaryVisitor}
        </Text>
        <Divider small />
        <Text style={{ ...human.caption1 }}>
          {renderTimePeriodText()}
        </Text>
        <Block left>
          {
            status === GATEPASS_STATUS.VALID.value
              ? <Tag success text={statusText} />
              : <Tag error text={statusText} />
          }
        </Block>
      </Block>
      <Block middle>
        {
          status === GATEPASS_STATUS.VALID.value
            ? (
              <Button
                onPress={() => onPressAction(data)}
                round
                style={{ width: 75, marginRight: 12, height: 28 }}
                color={iOSColors.red}
              >
                <Text style={{ ...human.caption2White }}>Revoke</Text>
              </Button>
            ) : null
        }
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    paddingBottom: 100
  },
  overlay: {
    borderRadius: 10,
    height: 125,
    overflow: 'hidden',
    padding: 0,
    width: 240
  },
  overlayContent: {
    marginTop: 20
  },
  overlayButton: {
    borderRadius: 0,
    width: 120
  }
})

export default GatepassListing
