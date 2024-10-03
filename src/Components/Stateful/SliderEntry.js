import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native'
// import PropTypes from 'prop-types'
import { Block } from 'galio-framework'
import { ParallaxImage } from 'react-native-snap-carousel'
import { human, systemWeights, material } from 'react-native-typography'
import { useStoreState } from 'easy-peasy'

import { Icon } from '../../Icons'
import colors from '../../Themes/Colors'
import LinearGradient from 'react-native-linear-gradient'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import theme from '../../Themes/configs/default'

const IS_IOS = Platform.OS === 'ios'
const { width: viewportWidth } = Dimensions.get('window')

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideHeight = 300
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth + itemHorizontalMargin * 2

const entryBorderRadius = 8

const SliderEntry = ({ data, even, parallax, parallaxProps, onPress }) => {
  const flat = useStoreState(state => state.app.flat)
  const { flatId, flatNumber, flatArea, block, tenantName, image } = data

  const renderImage = () => {
    return parallax ? (
      <ParallaxImage
        source={{ uri: image }}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image
        source={{ uri: image }}
        style={styles.image}
      />
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.slideInnerContainer}
      onPress={() => onPress(data)}
    >
      <View style={styles.shadow} />
      <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
        {renderImage()}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.radiusMask} />
      </View>
      <Block style={{ ...styles.check, ...elevationShadowStyle({ elevation: 6 }) }}>
        {
          flat.flatId === flatId
            ? <Icon name='check-circle' size={40} color={theme.colors.primary} />
            : <></>
        }
      </Block>
      <View style={styles.textContainer}>
        <Block flex row bottom>
          <Block flex>
            <Text
              style={{ ...human.caption2White }}
            >
              AREA
            </Text>
            <Text
              style={{ ...human.bodyWhite, ...systemWeights.semibold, marginTop: 3 }}
            >
              {flatArea}
            </Text>
            <Text
              style={{ ...human.caption2White, marginTop: 15 }}
            >
              RESIDENT
            </Text>
            <Text
              style={{ ...human.bodyWhite, ...systemWeights.semibold, marginTop: 3 }}
              numberOfLines={1}
            >
              {tenantName}
            </Text>
          </Block>
          <Block flex right>
            <Text
              style={{ ...material.display3White, ...systemWeights.bold, textAlign: 'right' }}
            >
              {flatNumber}
            </Text>
            <Text
              style={{ ...human.title3White, ...systemWeights.semibold }}
            >
              {`${block}`}
            </Text>
          </Block>
        </Block>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18 // needed for shadow
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: entryBorderRadius
  },
  imageContainerEven: {
    backgroundColor: colors.black
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  radiusMaskEven: {
    backgroundColor: colors.black
  },
  textContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  textContainerEven: {
    backgroundColor: colors.black
  },
  title: {
    color: colors.black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    marginTop: 6,
    color: colors.gray,
    fontSize: 12,
    fontStyle: 'italic'
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  check: {
    backgroundColor: 'white',
    borderRadius: 100,
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 1
  }
})

export default SliderEntry
