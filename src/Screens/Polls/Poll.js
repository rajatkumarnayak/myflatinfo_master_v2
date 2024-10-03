import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, ScrollView } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights } from 'react-native-typography'
import check from 'check-types'

import { Navbar, Loader, NoData, Survey } from '../../Components/Stateless'
import viewStyles from '../../Styles/ViewStyles'
import NavigationService from '../../Navigation'
import useTheme from '../../Themes/Context'
import { STATUS, POLL_STATUS } from '../../Constants'
import { ApiService } from '../../Store'

const PollScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  const { theme } = useTheme()
  const [data, setData] = useState(null)
  const [title, setTitle] = useState(null)
  const [surveyData, setSurveyData] = useState(null)
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)

  const _setData = (responseData) => {
    const _surveyData = [{
      questionId: Math.floor(Math.random() * Math.floor(100)),
      questionType: 'SelectionGroup',
      questionText: '',
      options: responseData.options
    }]

    setSurveyData(_surveyData)
    setData(responseData)
    setTitle(responseData.title)
  }

  async function load () {
    setNetworkStatus(STATUS.FETCHING)
    const response = await ApiService.fetchPollItemData(item)
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      _setData(response.data)
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }

  async function update (payload) {
    setNetworkStatus(STATUS.FETCHING)
    const response = await ApiService.updatePollItemData(payload)
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      NavigationService.goBack()
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }

  const onSubmit = (result) => {
    const { value } = result[0]
    update({ id: data.id, value })
  }

  const renderContent = () => {
    if (check.not.assigned(data)) {
      return <></>
    }

    if (data.isCompleted) {
      return (
        <Text style={styles.subtitle}>
          You have already taken this poll. Thank you for your participation.
        </Text>
      )
    }

    if (data.status === POLL_STATUS.CLOSED.value) {
      return (
        <Text style={styles.subtitle}>
          This poll is closed.
        </Text>
      )
    } else {
      if (check.assigned(data.options)) {
        return (
          <Block style={{ marginTop: -30 }}>
            <Survey
              data={surveyData}
              onSubmit={onSubmit}
              showPreviousButton={false}
              primaryColor={theme.colors.primary}
              submitText='Submit'
            />
          </Block>
        )
      }
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (networkStatus === STATUS.FETCHING) {
    return (
      <Block middle style={styles.container}>
        <Loader />
      </Block>
    )
  }

  if (networkStatus === STATUS.FAILED) {
    return (
      <Block middle style={styles.container}>
        <NoData text='Something went wrong' />
      </Block>
    )
  }

  return (
    <Block style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{title}</Text>
        {renderContent()}
      </ScrollView>
    </Block>
  )
}

PollScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { navbarTitle } = navigation.state.params

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.goBack()}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer
  },
  title: {
    ...human.body,
    ...systemWeights.bold,
    margin: galioTheme.SIZES.BASE,
    marginHorizontal: galioTheme.SIZES.BASE + 5
  },
  subtitle: {
    ...human.footnote,
    marginHorizontal: galioTheme.SIZES.BASE + 5
  }
})

export default PollScreen
