import React, { useEffect, useState, useCallback } from 'react'
import { Block } from 'galio-framework'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Container, IssuesListing as Listing, NoData } from '../../Components/Stateless'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/ViewStyles'

const OngoingIssuesScreen = ({ data }) => {
  const load = useStoreActions(actions => actions.issues.load)
  const [_data, setData] = useState([])

  const onLoad = useCallback(() => {
    return load({ startDate: null, endDate: null })
  })

  useEffect(() => {
    setData(data.filter(item => item.status !== 2))
  }, [data])

  return (
    <Block style={viewStyles.mainContainer}>
      <Listing
        items={_data}
        onLoad={() => onLoad()}
        onPressItem={(item) => {
          NavigationService.navigate('Issue', { item })
        }}
        noDataComponent={() => <NoData />}
      />
    </Block>
  )
}

export default OngoingIssuesScreen
