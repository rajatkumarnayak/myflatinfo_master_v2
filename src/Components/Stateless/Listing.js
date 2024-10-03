import React, { useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
import { Block, theme } from 'galio-framework'
import { human, iOSColors } from 'react-native-typography'
import check from 'check-types'

import { Button, Divider, Loader } from '../../Components/Stateless'
import { Icon } from '../../Icons'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import { STATUS } from '../../Constants'
import View from './View'

const cardBorderRadius = 6

const ItemContentComponent = ({ title, subtitle }) => {
  return (
    <Block style={styles.content}>
      <Text
        numberOfLines={1}
        style={{ ...human.body }}
      >
        {title}
      </Text>
      <Divider small />
      {
        check.assigned(subtitle)
          ? (
            <Text style={{ ...human.caption1 }}>
              {subtitle}
            </Text>
          )
          : <></>
      }
    </Block>
  )
}

const ThumbnailComponent = ({ image,type }) => {
  console.log(image,'imageimage')
  if (check.not.assigned(image)) {
    return <></>
  } else {
    return (
      <View>
        {
          type == "1" ? 
          (
            <Image
            source={require('../../../assets/images/motorcycle-default.png')}
            style={styles.image}
          />
          ):type == "2" ?
          (
            <Image
            source={require('../../../assets/images/car-default.png')}
            style={styles.image}
          />
          ):<Image
          source={{ uri: image }}
          style={styles.image}
        />
        }
      </View>
     
    )
  }
}

const Disclosure = () => (
  <Block middle style={styles.disclosure}>
    <Icon name='chevron-right' size={20} color={iOSColors.midGray} style={styles.chevron} />
  </Block>
)

const Listing = ({
  items,
  thumbnailContentComponent,
  itemContentComponent,
  onPressItem,
  noDataComponent,
  onLoad,
  networkStatus,
  ...props
}) => {
  console.log(items, "items >>>>>m items >>>>");
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = useCallback(() => {
    onLoad()
      .then(() => {
        setRefreshing(false)
      })
  }, [refreshing])

  const renderCard = (item) => {
    const { title, subtitle, image,type } = item
   console.log(item,'itemitem')
    return (
      <Block style={styles.card}>
        <TouchableOpacity onPress={() => check.not.assigned(onPressItem) ? null : onPressItem(item)}>
          <Block flex row>
            {
              check.not.assigned(thumbnailContentComponent)
                ? <ThumbnailComponent image={image} type={type} />
                : thumbnailContentComponent(item)
            }
            <Block flex row center space='between'>
              {
                check.not.assigned(itemContentComponent)
                  ? <ItemContentComponent title={title} subtitle={subtitle} />
                  : itemContentComponent(item)
              }
            </Block>
            {onPressItem && <Disclosure />}
          </Block>
        </TouchableOpacity>
      </Block>
    )
  }

  if (check.not.assigned(items)) {
    return <></>
  }

  if (networkStatus === STATUS.FETCHING) {
    return <Loader />
  }

  if (networkStatus === STATUS.FAILED) {
    return (
      <Text
        style={{ ...human.caption1, color: iOSColors.gray, marginTop: 5 }}
      >
        Something went wrong
      </Text>
    )
  }

  if (check.emptyArray(items)) {
    return (
      <Block flex>
        {noDataComponent()}
        <Block middle>
          <Divider />
          <Button
            onPress={onLoad}
            small
            shadowless
            round
            outline
            color='info'
          >
            Reload
          </Button>
        </Block>
      </Block>
    )
  }

  if (check.string(items)) {
    return (
      <Text
        style={{ ...human.caption1, color: iOSColors.gray, marginTop: 5 }}
      >
        {items}
      </Text>
    )
  }

  return (
    <Block flex style={styles.group}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => renderCard(item, index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        {...props}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  group: {
    marginTop: theme.SIZES.BASE / 2
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: cardBorderRadius,
    marginHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
    overflow: 'hidden',
    ...elevationShadowStyle({ elevation: 2 })
  },
  imageContainer: {
    height: 120,
    width: 120
  },
  image: {
    height: 120,
    resizeMode: 'cover',
    width: 120
  },
  mask: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: cardBorderRadius,
    borderBottomRightRadius: cardBorderRadius
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  disclosure: {
    width: 40
  }
})

export default Listing
