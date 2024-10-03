import React, { useState, useRef, useEffect } from 'react'
import { Text, TouchableOpacity, Dimensions } from 'react-native'
import { Block, Button } from 'galio-framework'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Divider, Input, Panel, AutoCompleteInput } from '../Stateless'
import useTheme from '../../Themes/Context'
import { ApiService } from '../../Store'
import viewStyles from '../../Styles/ViewStyles'
import { showErrorToast, showSuccessToast } from '../../Lib/Toast'

const { height } = Dimensions.get('screen')

const ForgotPasswordForm = ({ onSubmit, onSuccess }) => {
  const { theme } = useTheme()
  const loadBuildingList = useStoreActions(actions => actions.app.loadBuildingList)
  const buildingList = useStoreState(state => state.app.buildingList)
  const [_buildingList, setBuildingList] = useState(buildingList)
  const [contact, setContact] = useState(null)
  const [selectedBuilding, setSelectedBuilding] = useState({ id: null, name: null })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const searchBuildingModalRef = useRef()

  const onSelectBuilding = (selectedBuilding) => {
    searchBuildingModalRef.current.hide()
    setSelectedBuilding(selectedBuilding)
  }

  const resetPassword = () => {
    setIsSubmitting(true)
    let phoneNumber = null
    let email = null

    if (contact.includes('@')) {
      email = contact
    } else {
      phoneNumber = contact
    }

    const payload = {
      building: selectedBuilding,
      phoneNumber,
      email
    }

    async function update () {
      const response = await ApiService.resetPassword(payload)
      if (response.ok) {
        showSuccessToast(response.data || 'Reset password link sent to registered email address successfully')
        if (check.assigned(onSuccess)) {
          onSuccess()
        }
      } else {
        showErrorToast(response.data || 'Failed to send reset password link')
        setIsSubmitting(false)
      }
    }

    update()
  }

  const _onSubmit = () => {
    if (check.not.assigned(selectedBuilding.id)) {
      showErrorToast('Please select a building', 'error')
      return
    }

    if (check.not.assigned(contact)) {
      showErrorToast('Please enter your registered phone number or email address', 'error')
      return
    }

    if (check.assigned(onSubmit)) {
      onSubmit()
    }

    resetPassword()
  }

  useEffect(() => {
    // console.log(theme.colors);
    if (check.nonEmptyArray(buildingList)) {
      setBuildingList(buildingList.map(({ id, name, address }) => ({
        id,
        title: name,
        subtitle: address,
        icon: 'home-city-outline'
      })))
    }
  }, [buildingList])

  return (
    <Block>
      <TouchableOpacity onPress={() => searchBuildingModalRef.current.show()}>
        <Input
          editable={false}
          value={selectedBuilding.title}
          placeholder='Building'
          iconContent={null}
        />
      </TouchableOpacity>
      <Divider small />
      <Input
        returnKeyType='next'
        onChangeText={text => setContact(text)}
        value={contact}
        placeholder='Phone number or email address'
        iconContent={null}
      />
      <Divider />
      <Block center>
        <Button
          onPress={_onSubmit}
          loading={isSubmitting}
          size='small'
          round
          uppercase
          color={theme.colors.primary}
        >
          <Text style={{ ...human.footnoteWhite, ...systemWeights.bold }}>
            Send Password Reset Email
          </Text>
        </Button>
      </Block>
      <Panel
        ref={searchBuildingModalRef}
        height={height / 2}
      >
        <>
          <Block row space='between' style={viewStyles.modalHeading}>
            <Text style={{ ...human.title3, ...systemWeights.bold }}>Select Building</Text>
            <TouchableOpacity onPress={() => loadBuildingList()}>
              <Text caption2 style={{ color: iOSColors.blue }}>Refresh</Text>
            </TouchableOpacity>
          </Block>
          <Divider />
          <Block style={{ height: 360 }}>
            <AutoCompleteInput
              data={_buildingList}
              didAutoComplete={(item) => onSelectBuilding(item)}
            />
          </Block>
        </>
      </Panel>
    </Block>
  )
}

export default ForgotPasswordForm
