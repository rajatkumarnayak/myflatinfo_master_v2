import React from 'react'
import { ActivityIndicator, StyleSheet, ImageBackground } from 'react-native'
import { Block } from 'galio-framework'

import useTheme from '../../Themes/Context'
import viewStyles from '../../Styles/ViewStyles'

export default function () {
  const { theme } = useTheme()

  return (
    <Block style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/splash.png')}
        style={styles.bg}
      >
        <Block style={styles.innerContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </Block>
      </ImageBackground>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.container
  },
  innerContainer: {
    flexDirection: 'column-reverse',
    flexGrow: 1
  },
  bg: {
    flexGrow: 1,
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 120
  }
})
