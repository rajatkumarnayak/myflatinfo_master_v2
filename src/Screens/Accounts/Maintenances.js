import React, { useEffect, useState } from 'react'
import { Block } from 'galio-framework'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { AccountsListing as Listing, NoData } from '../../Components/Stateless'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/ViewStyles'
import { GENERAL_DAY_DISPLAY_FORMAT } from '../../Constants'

const MaintenancesScreen = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)
  const load = useStoreActions(actions => actions.maintenances.load)
  const { data, status } = useStoreState(state => ({ ...state.maintenances }))
  console.log(data ,"maintenances sdfsdgsdgsd",status);
  const [_data, setData] = useState([])

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  useEffect(() => {
    if (check.assigned(flat)) {
      onLoad()
    }
  }, [flat])

  useEffect(() => {
    setData(data.map(item => ({
      ...item,
      subtitle: item.status === 1
        ? `Paid on ${moment(item.paymentDate).format(GENERAL_DAY_DISPLAY_FORMAT)}`
        : `Due on ${moment(item.dueDate).format(GENERAL_DAY_DISPLAY_FORMAT)}`
    })))
  }, [data])

  return (
    <Block style={viewStyles.mainContainer}>
      <Listing
        items={_data}
        onLoad={onLoad}
        onPressItem={(item) => {
          NavigationService.navigate('Maintenance', { item })
        }}
        status={status}
        noDataComponent={() => <NoData />}
      />
    </Block>
  )
}

export default MaintenancesScreen
