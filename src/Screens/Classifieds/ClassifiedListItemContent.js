import React from 'react'
import { Text } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights } from 'react-native-typography'

import { Divider } from '../../Components/Stateless'
import colors from '../../Themes/Colors'

const ClassifiedListItemContent = ({ data }) => {
  console.log(data, 'data fromm main valiue >>>')
  
  const { title, description, price, phone, builderName } = data

  return (
    <Block flex row space='between' style={{ padding: galioTheme.SIZES.BASE, paddingRight: 0 }}>
      <Block>
      <Text
          numberOfLines={1}
          style={{ ...human.subhead, ...systemWeights.bold }}
        >
          {builderName}
        </Text>
        <Text
          numberOfLines={1}
          style={{ ...human.subhead, ...systemWeights.bold }}
        >
          {title}
        </Text>
        <Text
          numberOfLines={2}
          style={{ ...human.footnote, color: colors.grey400 }}
        >
          {description}
        </Text>
        <Divider small />
        <Block row>
          <Block>
            <Text style={{ ...human.caption2 }}>
              Price per Sq. Ft.
            </Text>
            <Text style={{ ...human.caption1, ...systemWeights.semibold }}>
              {price || '-'}
            </Text>
          </Block>
          <Divider vertical />
          <Block>
            <Text style={{ ...human.caption2 }}>
              Contact
            </Text>
            <Text style={{ ...human.caption1, ...systemWeights.semibold }}>
              {phone || '-'}
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  )
}

export default ClassifiedListItemContent
