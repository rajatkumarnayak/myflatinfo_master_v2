import React, { useState } from 'react'
import { ScrollView, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { Block, Button, theme as galioTheme } from 'galio-framework'
import { human } from 'react-native-typography'
import check from 'check-types'

import { Divider, Input } from '../Stateless'
import useTheme from '../../Themes/Context'
import { ApiService } from '../../Store'
import showToast, { showErrorToast, showSuccessToast } from '../../Lib/Toast'

const ChangePasswordForm = ({ onSubmit, onSuccess }) => {
  const { theme } = useTheme()
  const [currentPassword, setCurrentPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [newPasswordRepeated, setNewPasswordRepeated] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const changePassword = () => {
    setIsSubmitting(true)

    const payload = {
      oldPassword: currentPassword,
      newPassword
    }

    async function update () {
      const response = await ApiService.changePassword(payload)
      if (response.ok) {
        showSuccessToast(response.data || 'Password changed successfully')
        if (check.assigned(onSuccess)) {
          onSuccess()
        }
      } else {
        showErrorToast(response.data || 'Failed to change password')
        setIsSubmitting(false)
      }
    }

    update()
  }

  const _onSubmit = () => {
    if (check.not.assigned(currentPassword)) {
      showErrorToast('Please enter your current password', 'error')
      return
    }

    if (check.not.assigned(newPassword)) {
      showErrorToast('Please enter a new password', 'error')
      return
    }

    if (check.equal(currentPassword, newPassword)) {
      showToast('Current password and new password are identical', 'info')
      return
    }

    if (check.not.assigned(newPasswordRepeated)) {
      showErrorToast('Please confirm the new password', 'error')
      return
    }

    if (check.not.equal(newPassword, newPasswordRepeated)) {
      showToast('New password and confirm password do not match', 'error')
      return
    }

    if (check.assigned(onSubmit)) {
      onSubmit()
    }

    changePassword()
  }

  return (
    <Block>
      <KeyboardAvoidingView>
        <ScrollView>
          <Block style={styles.section}>
            <Text style={{ ...human.footnote }}>Current Password</Text>
            <Divider small />
            <Input
              returnKeyType='next'
              onChangeText={text => setCurrentPassword(text)}
              value={currentPassword}
              password
              placeholder=''
            />
          </Block>
          <Divider />
          <Block style={styles.section}>
            <Text style={{ ...human.footnote }}>New Password</Text>
            <Divider small />
            <Input
              returnKeyType='next'
              onChangeText={text => setNewPassword(text)}
              value={newPassword}
              password
              placeholder=''
            />
          </Block>
          <Divider />
          <Block style={styles.section}>
            <Text style={{ ...human.footnote }}>Confirm New Password</Text>
            <Divider small />
            <Input
              returnKeyType='next'
              onChangeText={text => setNewPasswordRepeated(text)}
              value={newPasswordRepeated}
              password
              placeholder=''
            />
          </Block>
          <Divider large />
          <Block middle>
            <Button
              onPress={_onSubmit}
              loading={isSubmitting}
              size='small'
              round
              uppercase
              color={theme.colors.primary}
            >
              <Text style={{ ...human.footnoteWhite }}>
                Save Changes
              </Text>
            </Button>
          </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  section: {
    marginHorizontal: galioTheme.SIZES.BASE * 2
  }
})

export default ChangePasswordForm
