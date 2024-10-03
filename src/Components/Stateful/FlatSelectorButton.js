import React, { useRef } from 'react'
import { Text } from 'react-native'
import {
  human,
  systemWeights
} from 'react-native-typography'
import { useStoreState } from 'easy-peasy'
import check from 'check-types'

import { Icon } from '../../Icons'
import { Button } from '../Stateless'
import { FlatSelectorModal } from './index'
import NavigationStyles from '../../Styles/NavigationStyles'

const FlatSelectorButton = () => {
  const flat = useStoreState(state => state.app.flat)

  const overlayRef = useRef()

  return (
    <>
      <Button
        onPress={() => overlayRef.current.show()}
        colors={['#348f50', '#56b4d3']}
        style={NavigationStyles.navbarFlatSelector}
      >
        <Icon name='home-account' size={20} color='#fff' />
        <Text
          style={{ ...human.caption2White, ...systemWeights.bold }}
        >
          {check.assigned(flat) ? flat.flatNumber : ''}
        </Text>
      </Button>
      <FlatSelectorModal ref={overlayRef} />
    </>
  )
}

export default FlatSelectorButton
