import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, ScrollView, Text, View } from 'react-native'
import { Block, Button, theme as galioTheme } from 'galio-framework'
import { iOSColors, human, systemWeights } from 'react-native-typography'
import { SimpleSurvey } from 'react-native-simple-survey'
import check from 'check-types'

import Divider from './Divider'
import { Icon } from '../../Icons'
import colors from '../../Themes/Colors'
import elevationShadowStyle from '../../Utils/ShadowStyle'

const Survey = ({ data, onSubmit, showPreviousButton, submitText, primaryColor }) => {
  const [answersSoFar, setAnswersSoFar] = useState(null)
  const surveyRef = useRef()

  const onSurveyFinished = (answers) => {
    const result = answers.map(({ questionId, value: { value } }) => ({ questionId, value }))
    onSubmit(result)
  }

  const onAnswerSubmitted = (answer) => {
    setAnswersSoFar(JSON.stringify(surveyRef.current.getAnswers(), 2))
  }

  const renderButton = (text, onPress, enabled) => {
    return (
      <Block flex center>
        <Divider />
        <Button
          onPress={onPress}
          size='small'
          round
          color={enabled ? primaryColor : colors.grey300}
          disabled={!enabled}
          style={styles.actionButton}
        >
          <Text style={{
            ...human.bodyWhite,
            ...systemWeights.bold
          }}
          >
            {text}
          </Text>
        </Button>
      </Block>
    )
  }

  const renderPreviousButton = (onPress, enabled) => {
    if (check.not.assigned(showPreviousButton)) {
      return renderButton('Previous', onPress, enabled)
    }
    if (check.assigned(showPreviousButton) && !check.boolean(showPreviousButton)) {
      return null
    }
}
  const renderNextButton = (onPress, enabled) => renderButton('Next', onPress, enabled)

  const renderFinishedButton = (onPress, enabled) => renderButton(submitText || 'Finish', onPress, enabled)

  const renderOption = (data, index, isSelected, onPress) => {
    return (
      <Block
        key={`selection_button_view_${index}`}
      >
        <Button
          onPress={onPress}
          round
          color={isSelected ? primaryColor : colors.white}
          key={`button_${index}`}
          style={styles.optionButton}
        >
          <Icon
            name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
            color={isSelected ? primaryColor : iOSColors.gray}
          />
          <Block width={10} />
          <Text style={{
            ...human.caption1,
            color: isSelected ? primaryColor : iOSColors.black,
            fontWeight: isSelected ? 'bold' : 'normal'
          }}
          >
            {data.optionText}
          </Text>
        </Button>
        <Divider small />
      </Block>
    )
  }

  const renderQuestionText = (questionText) => {
    return (
      <Block>
        <Text style={{ ...human.footnote }}>{questionText}</Text>
        <Divider />
      </Block>
    )
  }

  const renderInfoText = (infoText) => {
    return (
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Text style={styles.infoText}>{infoText}</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <SimpleSurvey
        ref={surveyRef}
        survey={data}
        renderSelector={renderOption}
        containerStyle={styles.surveyContainer}
        selectionGroupContainerStyle={styles.selectionGroupContainer}
        navButtonContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}
        renderPrevious={renderPreviousButton}
        renderNext={renderNextButton}
        renderFinished={renderFinishedButton}
        renderQuestionText={renderQuestionText}
        onSurveyFinished={(answers) => onSurveyFinished(answers)}
        onAnswerSubmitted={(answer) => onAnswerSubmitted(answer)}
        renderInfo={renderInfoText}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
    flexGrow: 1
  },
  answersContainer: {
    width: '90%',
    maxHeight: '20%',
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    elevation: 20,
    borderRadius: 10
  },
  surveyContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 0,
    width: 'auto'
  },
  optionButton: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'flex-start',
    paddingHorizontal: galioTheme.SIZES.BASE,
    ...elevationShadowStyle({ elevation: 4 })
  },
  selectionGroupContainer: {
    flexDirection: 'column',
    alignContent: 'flex-end'
  },
  actionButton: {
    width: 140
  }
})

export default Survey
