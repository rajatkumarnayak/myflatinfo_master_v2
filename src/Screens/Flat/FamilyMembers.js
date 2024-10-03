import React, { useEffect, useState } from 'react'
import { Block } from 'galio-framework'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Listing, NoData } from '../../Components/Stateless'
import viewStyles from '../../Styles/ViewStyles'

const FamilyMembersScreen = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)
  const load = useStoreActions(actions => actions.familyMembers.load)
  const { data, status } = useStoreState(state => ({ ...state.familyMembers }))
  const [_data, setData] = useState(data)

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  useEffect(() => {
    if (check.assigned(flat)) {
      onLoad()
    }
  }, [flat])

  useEffect(() => {
    setData(data.map(({ id, name, image }) => ({ id, title: name, image })))
  }, [data])

  return (
    <Block style={viewStyles.mainContainer}>
      <Listing
        items={_data}
        status={status}
        onLoad={onLoad}
        noDataComponent={() => <NoData text='No family members found' />}
      />
    </Block>
  )
}

export default FamilyMembersScreen
