import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { default as RNAutoCompleteInput } from 'react-native-autocomplete-input'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import check from 'check-types'

import { View, Input, Icon } from '.'
import colors from '../../Themes/Colors'

function AutoCompleteInput ({
  data,
  didAutoComplete,
  offsetTop,
  containerHeight,
  renderSuggestionItem,
  renderHeaderComponent
}) {
  const [query, setQuery] = useState('')

  const findByTitle = (query) => {
    if (query === '') {
      return []
    }

    const regex = new RegExp(`${query.trim()}`, 'i')
    const result = check.not.array(data)
      ? []
      : data.filter(item => item.title.search(regex) >= 0)
    return result
  }

  const _renderSuggestionItem = ({ icon, title, subtitle }) => {
    if (check.assigned(renderSuggestionItem)) {
      return renderSuggestionItem()
    }

    return (
      <Block flex row>
        <Block
          middle
        >
          {
            icon && (
              <Icon
                size={16}
                color={colors.grey400}
                name={icon}
              />
            )
          }
        </Block>
        <Block center style={styles.autocompleteSuggestionItemContent}>
          <Block>
            <Text style={{ ...human.subhead, ...systemWeights.semibold }}>{title}</Text>
            {
              subtitle && <Text style={{ ...human.caption2 }}>{subtitle}</Text>
            }
          </Block>
        </Block>
      </Block>
    )
  }

  const filteredData = findByTitle(query)
  const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim()

  return (
    // <View style={[styles.container, { marginTop: offsetTop || 0 }]}>
    <RNAutoCompleteInput
      autoCapitalize='none'
      autoCorrect={false}
      containerStyle={styles.autocompleteContainer}
      inputContainerStyle={styles.autocompleteInputContainer}
      listContainerStyle={styles.autocompleteSuggestionContainer}
      listStyle={{ borderWidth: 0 }}
      data={filteredData.length === 1 && comp(query, filteredData[0].title) ? [] : filteredData}
      keyExtractor={(item, index) => item.id}
      defaultValue={query}
      placeholder='Type name of item'
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setQuery(item.title)
              didAutoComplete(item)
              // console.log('query -> ', query)
              // console.log('buildingName -> ', buildingName)
            }}
            style={styles.autocompleteSuggestionItem}
          >
            {_renderSuggestionItem(item)}
          </TouchableOpacity>
        )
      }}
      renderTextInput={() => {
        return (
          <Input
            autoCapitalize='none'
            returnKeyType='next'
            onChangeText={text => setQuery(text)}
            value={query}
            placeholder='Type to see suggestions'
            iconContent={
              <Icon
                size={24}
                color={iOSColors.gray}
                name='magnify'
                style={styles.inputIcons}
              />
            }
          />
        )
      }}
    />
    // </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  autocompleteContainer: {
    margin: galioTheme.SIZES.BASE * 2,
    marginTop: 0
  },
  autocompleteInputContainer: {
    borderWidth: 0
  },
  autocompleteSuggestionContainer: {
    height: 300,
    marginHorizontal: -20
  },
  autocompleteSuggestionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey100,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  autocompleteSuggestionItemIcon: {
    backgroundColor: colors.blue300,
    borderRadius: 5,
    height: 40,
    width: 40
  },
  autocompleteSuggestionItemContent: {
    marginLeft: 20
  }
})

export default AutoCompleteInput
