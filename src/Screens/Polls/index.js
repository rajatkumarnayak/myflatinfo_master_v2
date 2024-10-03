import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { Container, Navbar, Divider, Tag, Listing, NoData } from '../../Components/Stateless'
import { Icon, ICON_TYPE } from '../../Icons'
import NavigationService from '../../Navigation'
import { GENERAL_DAY_DISPLAY_FORMAT, POLL_STATUS } from '../../Constants'

const PollsScreen = ({ navigation }) => {
  const load = useStoreActions(actions => actions.polls.load)
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.polls }))
  const [_data, setData] = useState(data)

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  useEffect(() => {
    onLoad()
  }, [])

  useEffect(() => {
    if (check.nonEmptyArray(data)) {
      setData(data)
    }
  }, [data])

  return (
    <Container
      status={status}
      failureReason={failureReason}
      license={license}
      data={data}
    >
      <Listing
        items={_data}
        onLoad={onLoad}
        onPressItem={(item) => {
          NavigationService.navigate('Poll', { item })
        }}
        itemContentComponent={(item) => <ItemContentComponent data={item} />}
        noDataComponent={() => <NoData text='No polls found' />}
      />
    </Container>
  )
}

const ItemContentComponent = ({ data }) => {
  const { title, expiryDate, status, statusText, isCompleted } = data
  // alert(JSON.stringify(data))
  return (
    <Block flex row space='between' style={{ padding: galioTheme.SIZES.BASE, paddingRight: 0 }}>
      <Block>
        <Text
          numberOfLines={1}
          style={{ ...human.body, ...systemWeights.bold }}
        >
          {title}
        </Text>
        <Divider small />
        <Block>
          <Text
            style={{ ...human.caption1 }}
          >
            {
              status === POLL_STATUS.OPEN.value
                ? `Ends on ${moment(expiryDate).format(GENERAL_DAY_DISPLAY_FORMAT)}`
                : `Ended on ${moment(expiryDate).format(GENERAL_DAY_DISPLAY_FORMAT)}`
            }
          </Text>
          <Divider small vertical />
          <Block left>
            {
              status === POLL_STATUS.OPEN.value
                ? <Tag success text={statusText} />
                : <Tag error text={statusText} />
            }
          </Block>
        </Block>
      </Block>
      <Block middle>
        {
          isCompleted
            ? (
              <Icon
                origin={ICON_TYPE.ANT_ICON}
                name='checkcircle'
                color={iOSColors.green}
              />
            )
            : <></>
        }
      </Block>
    </Block>
  )
}

PollsScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default PollsScreen
