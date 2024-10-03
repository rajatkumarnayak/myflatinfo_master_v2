import React, { useEffect, useState } from 'react'
import { Block } from 'galio-framework'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'
import moment from 'moment'

import { AccountsListing as Listing, NoData } from '../../Components/Stateless'
import NavigationService from '../../Navigation'
import viewStyles from '../../Styles/ViewStyles'
import { GENERAL_DAY_DISPLAY_FORMAT } from '../../Constants'
import { AppState } from 'react-native'

const Others = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)
  const load = useStoreActions(actions => actions.others.load)
  const { data, status } = useStoreState(state => ({ ...state.others }))
  console.log(data ,"data >>>>others > ");
  const [_data, setData] = useState([])
  const [appState, setAppState] = useState(AppState.currentState);
  const onLoad = () => {
    return load()
  }

  const handleAppStateChange = (state) => {
    console.log(state,"statslllll");
  }
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return (() => {
      AppState.removeEventListener('change', handleAppStateChange);
    })
  }, []);

  useEffect(() => {
    console.log('calling >>>');
    if (check.assigned(flat)) {
      onLoad()
     }
 }, [flat,load ])

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
          NavigationService.navigate('Other', { item })
        }}
        status={status}
        noDataComponent={() => <NoData />}
      />
    </Block>
  )
}

export default Others
