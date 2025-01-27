import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import { human } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Ionicons'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Container } from '../../Components/Stateless'
import NavigationService from '../../Navigation/index'
import Routes from '../../Navigation/Routes/index'
import LaunchScreen from '../../Screens/Launch'
import AppIntroSlider from '../../Lib/AppIntroSlider'
import AppStateContext from '../../Services/Auth/AppContext'
import useTranslation from '../../i18n/index'
import { LOCALES } from '../../Constants/index'
import colors from '../../Themes/Colors'

const LanguageSelection = props => {
  const { localeProvider, changeLocale } = useTranslation()

  const renderLocaleItem = locale => {
    const TextItem = () => (
      <Text
        style={{
          ...human.subheadWhite
        }}
      >
        {locale.label}
      </Text>
    )

    return (
      <TouchableOpacity
        key={locale.id}
        onPress={e => {
          changeLocale(locale)
        }}
        style={{ paddingVertical: 10 }}
      >
        <View styleName='horizontal h-center v-center'>
          {localeProvider.id === locale.id ? (
            <>
              <TextItem />
              <Icon
                name='ios-checkmark'
                size={30}
                color={colors.white}
                style={{ marginLeft: 10 }}
              />
            </>
          ) : (
            <TextItem />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <>{Object.values(LOCALES).map(locale => renderLocaleItem(locale))}</>
    </View>
  )
}

const slides = [
  {
    key: '0',
    renderExtra: LanguageSelection,
    backgroundColor: colors.orange800
  }
]

const AppIntro = props => {
  const { t, localeProvider } = useTranslation()
  const { state, hideAppIntroForever } = useContext(AppStateContext)
  const introData = useStoreState(state => state.app.introData)
  const fetchIntroData = useStoreActions(actions => actions.app.fetchIntroData)
  const [isLoading, setIsLoading] = useState(false)
  const [_slides, setSlides] = useState(introData)

  const _setSlides = () => {
    if (check.nonEmptyArray(introData)) {
      const _data = introData
        .map(item => ({
          key: item.id.toString(),
          title: item.title,
          text: item.subtitle,
          image: item.image
        }))

      setSlides(slides.concat(_data))
    } else {
      setSlides(slides)
    }
  }

  const _onDone = () => {
    hideAppIntroForever()
    NavigationService.navigate(Routes.MAIN_APP)
  }

  useEffect(() => {
    setIsLoading(true)
    fetchIntroData({
      localeId: localeProvider.id
    }).then(() => {
      setIsLoading(false)
    })
  }, [localeProvider.id])

  useEffect(() => {
    _setSlides()
  }, [introData])

  if (isLoading) {
    return <LaunchScreen />
  }

  if (check.emptyArray(introData)) {
  }

  if (check.nonEmptyArray(_slides)) {
    return (
      <AppIntroSlider
        slides={_slides}
        onDone={_onDone}
        onSkip={_onDone}
        renderItem={_renderItem}
        showPrevButton
        showSkipButton
        skipLabel={t('skip')}
        doneLabel={t('done')}
        nextLabel={t('next')}
        prevLabel={t('previous')}
      />
    )
  }
  return <></>
}

const _renderItem = item => {
  if (item.key === '0') {
    return (
      <Container style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/splash.png')}
          style={styles.bg}
        >
          <View
            styleName='vertical v-end h-center'
            style={styles.innerContainer}
          >
            <LanguageSelection />
          </View>
        </ImageBackground>
      </Container>
    )
  } else if (item.key === '1') {
    return (
      <Container style={styles.container}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.bg}
        >
          <View
            styleName='vertical v-start h-center'
            style={styles.innerContainer}
          >
            <Text
              style={{
                ...human.title1White,
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                ...human.bodyWhite,
                textAlign: 'center'
              }}
            >
              {item.text}
            </Text>
          </View>
        </ImageBackground>
      </Container>
    )
  } else if (item.key === '2') {
    return (
      <Container style={styles.container}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.bg}
        >
          <View
            styleName='vertical v-end h-end'
            style={styles.innerContainer}
          >
            <Text
              style={{
                ...human.title1White,
                fontWeight: 'bold',
                textAlign: 'right'
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                ...human.bodyWhite,
                textAlign: 'right'
              }}
            >
              {item.text}
            </Text>
          </View>
        </ImageBackground>
      </Container>
    )
  } else if (item.key === '3') {
    return (
      <Container style={styles.container}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.bg}
        >
          <View
            styleName='vertical v-end h-start'
            style={styles.innerContainer}
          >
            <Text
              style={{
                ...human.title1White,
                fontWeight: 'bold'
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                ...human.bodyWhite
              }}
            >
              {item.text}
            </Text>
          </View>
        </ImageBackground>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.orange800,
    flexGrow: 1
  },
  innerContainer: {
    flexGrow: 1,
    width: '100%'
  },
  bg: {
    flexGrow: 1,
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 120
  },
  logoContainer: {
    height: 80,
    width: 320
  },
  // https://medium.com/the-react-native-log/tips-for-react-native-images-or-saying-goodbye-to-trial-and-error-b2baaf0a1a4d
  logoImage: {
    alignSelf: 'stretch',
    flex: 1,
    height: undefined,
    marginHorizontal: 15,
    width: undefined
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    color: 'white'
  },
  text: {
    fontSize: 16,
    color: 'white'
  }
})

export default AppIntro
