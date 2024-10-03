import React from 'react'
import { Text } from 'react-native'
import { Header, Button } from 'react-native-elements'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import Ionicons from 'react-native-vector-icons/Ionicons'
import check from 'check-types'

import useTheme from '../../Themes/Context'

const Navbar = ({
  title,
  leftComponent,
  rightComponent,
  onPressBack,
  containerStyle
}) => {
  const { theme } = useTheme()

  return (
    <Header
      leftComponent={
        check.not.assigned(onPressBack)
          ? null
          : (
            <Button
              onPress={() => onPressBack()}
              type='clear'
               icon={<Ionicons name='arrow-back' size={30} color={theme.colors.primary} />}
            />
          )
      }
      centerComponent={
        <Text
          numberOfLines={1}
          style={{
            ...human.subhead,
            ...systemWeights.semibold,
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: iOSColors.gray
          }}
        >
          {title}
        </Text>
      }
      rightComponent={rightComponent || null}
      containerStyle={{
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        ...containerStyle
      }}
    />
  )
}

export default Navbar
