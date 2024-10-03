import React from 'react'
import { Dimensions, FlatList } from 'react-native'
import ContentLoader, { Rect } from 'react-content-loader/native'

const { height } = Dimensions.get('screen')

// generate an array of 1's (it could be anything other than null or undefined)
// this data will serve as the number of items to be displayed on screen
const numberOfItemsToDisplay = Math.floor(height / 100)
const DATA = Array(numberOfItemsToDisplay).fill(1)

const SkeletonLoader = ({ text }) => {
  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => <Item />}
      keyExtractor={item => item.id}
    />
  )
}

const Item = () => {
  return (
    <ContentLoader
      speed={2}
      width={320}
      height={100}
      viewBox='0 0 320 80'
      backgroundColor='#f3f3f3'
      foregroundColor='#bebaba'
    >
      <Rect x='16' y='-1' rx='0' ry='0' width='80' height='80' />
      <Rect x='120' y='4' rx='3' ry='3' width='220' height='20' />
      <Rect x='120' y='40' rx='3' ry='3' width='160' height='8' />
      <Rect x='120' y='60' rx='3' ry='3' width='50' height='6' />
    </ContentLoader>
  )
}

export default SkeletonLoader
