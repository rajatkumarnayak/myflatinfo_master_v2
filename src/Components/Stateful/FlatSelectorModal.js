import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Block } from 'galio-framework'
import { Overlay } from 'react-native-elements'
import Carousel from 'react-native-snap-carousel'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import SliderEntry from './SliderEntry'

const { width: viewportWidth } = Dimensions.get('window')

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth + itemHorizontalMargin * 2

const FlatSelectorModal = (props, ref) => {
  const flatList = useStoreState(state => state.app.flatList)
  const selectFlat = useStoreActions(actions => actions.app.selectFlat)
  const flat = useStoreState(state => state.app.flat)
  const [isVisible, setVisibility] = useState(false)
  const [activeSlide, setActiveSlide] = useState(1)

  const overlayRef = useRef()
  const sliderRef = useRef()

  const _renderItemWithParallax = ({ item, index }, parallaxProps) => {
    return (
      <SliderEntry
        data={item}
        onPress={(item) => {
          selectFlat(item)
          setVisibility(false)
        }}
        parallax
        parallaxProps={parallaxProps}
      />
    )
  }

  useEffect(() => {
    if (check.nonEmptyArray(flatList)) {
      setActiveSlide(flatList.indexOf(f => f.id === flat.id))
    }
  }, [flatList])

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisibility(true)
    },
    hide: () => {
      setVisibility(false)
    }
  }))

  return (
    <Overlay
      ref={overlayRef}
      isVisible={isVisible}
      onBackdropPress={() => setVisibility(false)}
      windowBackgroundColor='rgba(0, 0, 0, .5)'
      overlayBackgroundColor='transparent'
      width='auto'
      height='auto'
      overlayStyle={{ elevation: 0, shadowOpacity: 0 }}
    >
      <Block flex center middle>
        <Block height={300}>
          <Carousel
            ref={sliderRef}
            data={flatList}
            renderItem={_renderItemWithParallax}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            hasParallaxImages
            firstItem={activeSlide}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            // inactiveSlideShift={20}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            loop={false}
            loopClonesPerSide={2}
            autoplay={false}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
          {/* <Pagination
          dotsLength={ENTRIES1.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          dotColor='rgba(255, 255, 255, 0.92)'
          dotStyle={styles.paginationDot}
          inactiveDotColor={colors.black}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={sliderRef}
          tappableDots={!!sliderRef}
        /> */}
        </Block>
      </Block>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  slider: {
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
  },
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  }
})

export default forwardRef(FlatSelectorModal)
