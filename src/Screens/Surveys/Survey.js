import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, ScrollView } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { human, systemWeights } from 'react-native-typography'
import check from 'check-types'

import { Navbar, Loader, NoData, Survey } from '../../Components/Stateless'
import viewStyles from '../../Styles/ViewStyles'
import NavigationService from '../../Navigation'
import { ApiService } from '../../Store'
import useTheme from '../../Themes/Context'
import { STATUS } from '../../Constants'

const SurveyScreen = ({ navigation }) => {
  const { item } = navigation.state.params
  const { theme } = useTheme()
  const [data, setData] = useState(null)
  const [title, setTitle] = useState(null)
  const [surveyData, setSurveyData] = useState([])
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED)

  const _setData = (responseData) => {
    const _surveyData = responseData.questions.map(item => ({
      ...item,
      questionId: item.questionId.toString(),
      questionType: 'SelectionGroup'
    }))
    setSurveyData(_surveyData)
    setData(responseData)
    setTitle(responseData.title)
  }

  async function load () {
    setNetworkStatus(STATUS.FETCHING)
    const response = await ApiService.fetchSurveyItemData(item)
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      _setData(response.data)
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }

  async function update (payload) {
    setNetworkStatus(STATUS.FETCHING)
    const response = await ApiService.updateSurveyItemData(payload)
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS)
      NavigationService.goBack()
    } else {
      setNetworkStatus(STATUS.FAILED)
    }
  }

  const onSubmit = (result) => {
    update({
      id: data.id,
      options: result
    })
  }

  const renderContent = () => {
    if (check.assigned(data)) {
      if (data.isCompleted) {
        return (
          <Text style={styles.subtitle}>
            You have already completed this survey. Thank you for your participation.
          </Text>
        )
      } else {
        if (check.assigned(data.questions)) {
          return (
            <Survey
              data={surveyData}
              onSubmit={onSubmit}
              primaryColor={theme.colors.primary}
            />
          )
        }
      }
    }
  }

  useEffect(() => {
    if (check.not.assigned(data)) {
      load()
    }
  }, [data])

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

SurveyScreen.navigationOptions = ({ navigation, screenProps }) => {
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

export default SurveyScreen
