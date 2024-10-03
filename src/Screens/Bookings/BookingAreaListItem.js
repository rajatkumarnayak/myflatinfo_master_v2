import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { ParallaxImage } from 'react-native-snap-carousel'
import { human, systemWeights } from 'react-native-typography'

import { Divider, RupeeIcon } from '../../Components/Stateless'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const IS_IOS = Platform.OS === 'ios'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideHeight = viewportHeight * 0.36
const slideWidth = wp(50)
const itemHorizontalMargin = wp(2)

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth + itemHorizontalMargin * 2

const entryBorderRadius = 8

const BookingAreaListItem = ({ data, parallax, parallaxProps, onPress }) => {
  const _image = () => {
    const { image } = data

    return parallax ? (
      <ParallaxImage
        source={{ uri: image }}
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner
        spinnerColor='rgba(0, 0, 0, 0.25)'
        {...parallaxProps}
      />
    ) : (
      <Image
        source={{ uri: image }}
        style={styles.image}
      />
    )
  }

  const { name, cost, unit } = data

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
    >
      {/* <Block style={styles.shadow} /> */}
      {/* <View style={styles.imageContainer}>
        {_image()}
        <View style={styles.radiusMask} />
      </View> */}
      <Block row style={styles.slideInnerContainer}>
        <Block middle>
          <Block>
            <Text
              style={{ ...human.footnote }}
              numberOfLines={2}
            >
              {name.toUpperCase()}
            </Text>
          </Block>
          <Divider small />
          <Block row>
            <Block row middle>
              <RupeeIcon style={{ marginRight: 5 }} />
              <Text
                style={{ ...human.title3, ...systemWeights.bold, marginRight: 5 }}
              >
                {cost}
              </Text>
            </Block>
            <Text
              style={{ ...human.caption2 }}
            >
              {unit}
            </Text>
          </Block>
        </Block>
      </Block>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  slideInnerContainer: {
    backgroundColor: colors.white,
    borderRadius: galioTheme.SIZES.BASE / 2,
    width: itemWidth,
    height: 100,
    margin: galioTheme.SIZES.BASE,
    padding: galioTheme.SIZES.BASE,
    ...elevationShadowStyle({ elevation: 2 })
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
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
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
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
  },
  radiusMaskEven: {
    backgroundColor: colors.black
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
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
  }
})

export default BookingAreaListItem
