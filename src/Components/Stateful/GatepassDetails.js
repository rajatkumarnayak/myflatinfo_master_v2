import React from 'react'
import { StyleSheet } from 'react-native'
import { Block, theme as galioTheme, Button } from 'galio-framework'

import viewStyles from '../../Styles/ViewStyles'

const GatepassDetails = () => {
  return (
    <Block style={styles.container} />
  )
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  section: {
    marginHorizontal: galioTheme.SIZES.BASE
  }
})

export default GatepassDetails
