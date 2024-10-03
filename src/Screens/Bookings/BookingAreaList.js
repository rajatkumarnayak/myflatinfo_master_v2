import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, TouchableOpacity, Platform, Dimensions, StyleSheet } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { human, systemWeights, iOSColors } from 'react-native-typography'

import { Divider, RupeeIcon } from '../../Components/Stateless'
import colors from '../../Themes/Colors'

const IS_IOS = Platform.OS === 'ios'
const { width: viewportWidth } = Dimensions.get('window')

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideHeight = 240
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth + itemHorizontalMargin * 2

const entryBorderRadius = 8

const BookingAreaListItem = ({ data, parallax, parallaxProps, onPress }) => {
  const { name, image, cost, unit } = data

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.slideInnerContainer}
      onPress={onPress}
    >
      <View style={styles.shadow} />
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
        <View style={styles.radiusMask} />
      </View>
      <View style={styles.textContainer}>
        <Block>
          <Text
            style={{ ...human.footnote }}
            numberOfLines={2}
          >
            {name.toUpperCase()}
          </Text>
        </Block>
        <Divider small />
        <Block>
          <Block row>
            <RupeeIcon style={{ marginRight: 5 }} />
            <Text
              style={{ ...human.title3, ...systemWeights.bold, marginRight: 5 }}
            >
              {cost}
            </Text>
          </Block>
          <Text
            style={{ ...human.caption2, fontStyle: 'italic', color: iOSColors.gray, marginLeft: 14 }}
          >
            {unit}
          </Text>
        </Block>
      </View>
    </TouchableOpacity>
  )
}

const BookingAreaList = ({ data, onPressItem }) => {
  const building = useStoreState(state => state.app.building)
  const loadAreas = useStoreActions(actions => actions.bookings.loadAreas)
  const { areaList } = useStoreState(state => ({ ...state.bookings }))
  const [activeSlide, setActiveSlide] = useState(1)

  const carouselRef = useRef()

  useEffect(() => {
    loadAreas()
  }, [building])

  return (
    <>
      <Carousel
        ref={carouselRef}
        data={areaList}
        renderItem={({ item, index }) => <BookingAreaListItem data={item} onPress={onPressItem} />}
        onSnapToItem={(index) => setActiveSlide(index)}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0.7}
        // enableMomentum
        // activeSlideAlignment='start'
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
        activeAnimationType='spring'
        activeAnimationOptions={{
          friction: 4,
          tension: 40
        }}
      />
      <Divider />
      <Pagination
        dotsLength={areaList.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotColor='rgba(255, 255, 255, 0.92)'
        dotStyle={styles.paginationDot}
        inactiveDotColor={colors.black}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={carouselRef}
        tappableDots={false}
      />
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  titleDark: {
    color: colors.black
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  slider: {
    marginTop: 15,
    overflow: 'visible'
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18 // needed for shadow
  },
  sliderContentContainer: {
    margin: -galioTheme.SIZES.BASE,
    marginLeft: 0
  },
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
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
  }
})

export default BookingAreaList
