import React, { useEffect } from 'react'
import { Block } from 'galio-framework'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Container, Listing, NoData } from '../../Components/Stateless'
import viewStyles from '../../Styles/ViewStyles'

const ParkingsScreen = ({ navigation }) => {
  const flat = useStoreState(state => state.app.flat)
  const load = useStoreActions(actions => actions.parkings.load)
  const { data, status, failureReason, license } = useStoreState(state => ({ ...state.parkings }))

  const onLoad = () => {
    return load({ startDate: null, endDate: null })
  }

  useEffect(() => {
    if (check.assigned(flat)) {
      onLoad()
    }
  }, [flat])

  return (
    <Container
      status={status}
      failureReason={failureReason}
      license={license}
      data={data}
      onLoad={() => onLoad()}
    >
      <Listing
        items={data}
        status={status}
        onLoad={onLoad}
        noDataComponent={() => <NoData text='No parkings found' />}
      />
    </Container>
  )
}

export default ParkingsScreen
