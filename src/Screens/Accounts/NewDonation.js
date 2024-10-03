import React, { useState, useEffect } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import check from 'check-types'

import { Navbar } from '../../Components/Stateless'
import { DonationForm } from '../../Components/Stateful'
import NavigationService from '../../Navigation'

const NewDonationScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  console.log(item ,"item >>>>> newdonations form >>");
  const [dataNew, setDataNew] = useState(item)


  const loadList = useStoreActions(actions => actions.donations.load)
  const loadEventList = useStoreActions(actions => actions.donations.loadEventList)
  const eventList = useStoreState(state => state.donations.eventList)

 
  const onSuccess = async () => {
   await loadList({ startDate: null, endDate: null })
    NavigationService.navigate('Donation')
  }

  useEffect(() => {
    loadEventList()
  }, [])

  useEffect(() => {
    if (check.nonEmptyArray(eventList)) {
      try {
        const event = eventList.find(event => event.id === Number(item.id))

        setDataNew(event)
      } catch (error) {

      }
    }
  }, [eventList])

  return (
    <DonationForm
      data={dataNew}
      onSuccess={onSuccess}
    />
  )
}

NewDonationScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => navigation.goBack()}
      />
    )
  }
}

export default NewDonationScreen
