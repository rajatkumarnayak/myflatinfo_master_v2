import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ImageBackground, Keyboard } from 'react-native'
import { Block, theme as galioTheme, Button } from 'galio-framework'
import { ButtonGroup } from 'react-native-elements'
import { Picker } from 'native-base'
import { iOSColors, human } from 'react-native-typography'
import ImagePicker from 'react-native-image-crop-picker'
import { useStoreState, useStoreActions } from 'easy-peasy'
import check from 'check-types'

import { Navbar, Input, Divider } from '../../Components/Stateless'
import { Icon } from '../../Icons'
import viewStyles from '../../Styles/ViewStyles'
import elevationShadowStyle from '../../Utils/ShadowStyle'
import useTheme from '../../Themes/Context'
import colors from '../../Themes/Colors'
import { ApiService } from '../../Store'
import NavigationService from '../../Navigation'
import showToast from '../../Lib/Toast'

const { height } = Dimensions.get('window')
const IMAGE_PICKER_SETTINGS = {
  mediaType: 'photo',
  includeBase64: true,
  cropping: true,
  compressImageMaxWidth: 1024,
  compressImageQuality: 0.8
}

const PRIORITY_LIST = ['High', 'Medium', 'Low']
const PHOTO_SELECTOR_LIST = [{ text: 'Camera', icon: 'camera-iris' }, { text: 'Gallery', icon: 'image' }]

const Label = ({ children }) => <Text style={{ ...human.footnote }}>{children}</Text>

const ImagePickerButton = ({ icon, text }) => {
  console.log(icon, text ,"icons >>>>");
  return (
    <Block row middle>
      <Icon
        name={icon}
        size={20}
        style={{ marginRight: 5 }}
        color={iOSColors.black}
      />
      <Text style={{ ...human.caption1 }}>{text}</Text>
    </Block>
  )
}

const NewIssueScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const building = useStoreState(state => state.app.building)
  const flat = useStoreState(state => state.app.flat)
  const loadList = useStoreActions(actions => actions.issues.load)
  const loadAssigneeList = useStoreActions(actions => actions.issues.loadAssigneeList)
  const { assigneeList } = useStoreState(state => ({ ...state.issues }))
  const [title, setTitle] = useState(null)
  const [titleFeedback, setTitleFeedback] = useState(null)
  const [description, setDescription] = useState(null)
  const [descriptionFeedback, setDescriptionFeedback] = useState(null)
  const [selectedPriorityIndex, setSelectedPriorityIndex] = useState(null)
  const [selectedPriorityColor, setSelectedPriorityColor] = useState(iOSColors.blue)
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null)
  const [photoUri, setPhotoUri] = useState(null)
  const [photoName, setPhotoName] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setPhoto = (image) => {
    setPhotoUri(`data:${image.mime};base64,${image.data}`)
    setPhotoName(image.path)
    console.log(photoName,"photoName >>>>>>");
    console.log(photoUri,"photoUri >>>>>>");
    
  }

  const unsetPhoto = () => {
    setPhotoUri(null)
    setPhotoName(null)
  }

  const openPicker = (actionItem) => {
    ImagePicker.openPicker(IMAGE_PICKER_SETTINGS).then(image => {
      setPhoto(image)
      console.log(image,"image at open gallery >>>");
    })
  }

  const openCamera = (actionItem) => {
    ImagePicker.openCamera(IMAGE_PICKER_SETTINGS).then(image => {
      setPhoto(image)
      console.log(image,"image at open camera >>>");
    })
  }

  const pickImage = (index) => {
    index === 0 ? openCamera() : openPicker()
  }

  const isFormValid = () => {
    Keyboard.dismiss()

    if (check.not.assigned(title)) {
      showToast('Enter a title for the issue', 'error')
      setTitleFeedback('error')
      return false
    }

    if (check.not.assigned(description)) {
      showToast('Enter a description for the issue', 'error')
      setDescriptionFeedback('error')
      return false
    }

    return true
  }

  const onSubmit = () => {
    if (!isFormValid()) {
      return
    }

    const payload = {
      name: title,
      description: description,
      priorityId: check.assigned(selectedPriorityIndex) ? selectedPriorityIndex + 1 : 3,
      assigneeId: selectedAssigneeId,
      attachmentName: photoName,
      attachmentContent: photoUri
    }

    async function create (payload) {
      const response = await ApiService.putIssueItemData(payload)

      if (response.ok) {
        loadList({ startDate: null, endDate: null })
        NavigationService.goBack()
      }
      setIsSubmitting(false)
    }

    setIsSubmitting(true)
    create(payload)
  }

  useEffect(() => {
    loadAssigneeList()
  }, [building, flat])

  useEffect(() => {
    switch (selectedPriorityIndex) {
      case 1:
        setSelectedPriorityColor(colors.red100)
        break
      case 2:
        setSelectedPriorityColor(colors.orange100)
        break
      default:
        setSelectedPriorityColor(colors.blue100)
        break
    }
  }, [selectedPriorityIndex])

  return (
    <Block style={styles.container}>
      <ScrollView>
        <Divider />
        <Block style={styles.section}>
          <Label>Title</Label>
          <Input
            returnKeyType='next'
            onChangeText={text => setTitle(text)}
            value={title}
            borderless={titleFeedback !== 'error'}
            placeholder='A short heading to quickly identify the issue'
            style={[styles.input, titleFeedback === 'error' && styles.inputError]}
          />
        </Block>
        <Divider />
        <Block style={styles.section}>
          <Label>Description</Label>
          <Input
            returnKeyType='next'
            onChangeText={text => setDescription(text)}
            value={description}
            multiline
            numberOfLines={4}
            borderless={descriptionFeedback !== 'error'}
            placeholder='Detailed information about the issue'
            style={[styles.input, styles.inputTextarea, descriptionFeedback === 'error' && styles.inputError]}
            textAlignVertical='top'
          />
        </Block>
        <Divider />
        <Block style={styles.section}>
          <Label>Priority</Label>
          <Divider small />
          <ButtonGroup
            onPress={(index) => setSelectedPriorityIndex(index)}
            selectedIndex={selectedPriorityIndex}
            buttons={PRIORITY_LIST.map((priorityItemText, index) => (
              { element: () => <Text style={{ ...human.caption1 }}>{priorityItemText}</Text> })
            )}
            selectedButtonStyle={{ backgroundColor: colors.grey400 }}
            containerStyle={styles.buttonGroupContainer}
            containerBorderRadius={6}
          />
        </Block>
        <Divider />
        <Block style={styles.section}>
          <Label>Issue posted to</Label>
          <Divider small />
          <Block style={viewStyles.pickerContainer}>
            <Picker
              mode='dropdown'
              iosHeader='Issue posted to'
              iosIcon={<Icon name='arrow-down' />}

              selectedValue={selectedAssigneeId}
              onValueChange={(value) => {
                setSelectedAssigneeId(value)
              }}
            >
              {assigneeList.map(({ id, name }) => <Picker.Item label={name} value={id} key={id} />)}
            </Picker>
          </Block>
        </Block>
        <Divider />
        <Block style={styles.section}>
          <Label>Photo</Label>
          <Text style={{ ...human.caption2 }}>Attach a photo of the issue, if required</Text>
          <Divider small />
          {
            check.not.assigned(photoUri)
              ? (
                <ButtonGroup
                  onPress={(index) => pickImage(index)}
                  buttons={PHOTO_SELECTOR_LIST.map((photoSelectorItem, index) => ({
                    element: () => <ImagePickerButton {...photoSelectorItem} />
                  }))}
                  containerStyle={styles.buttonGroupContainer}
                />
              )
              : (
                <ImageBackground
                  source={{ uri: photoUri }}
                  style={styles.imageContainer}
                >
                  <TouchableOpacity
                    onPress={() => unsetPhoto()}
                    style={styles.removeImage}
                  >
                    <Icon
                      name='close-circle'
                      size={25}
                      color={colors.grey300}
                    />
                  </TouchableOpacity>
                  {/* <Text style={styles.photoName}>{photoName}</Text> */}
                </ImageBackground>
              )
          }
        </Block>
        <Divider large />
        <Divider large />
      </ScrollView>
      <Block style={viewStyles.submitButtonContainer}>
        <Button
          onPress={onSubmit}
          loading={isSubmitting}
          round
          color={theme.colors.primary}
        >
          <Text style={{ ...human.bodyWhite }}>Raise Issue</Text>
        </Button>
      </Block>
    </Block>
  )
}

NewIssueScreen.navigationOptions = ({ navigation, screenProps }) => {
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

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  section: {
    marginHorizontal: galioTheme.SIZES.BASE
  },
  input: {
    borderRadius: 6,
    ...elevationShadowStyle({ elevation: 2 })
  },
  inputTextarea: {
    height: 100
  },
  inputError: {
    backgroundColor: 'rgba(255, 89, 89, .10)',
    borderColor: galioTheme.COLORS.ERROR
  },
  buttonGroupContainer: {
    borderRadius: 6,
    borderWidth: 0,
    marginTop: 0,
    marginLeft: 0,
    overflow: 'hidden',
    width: '100%',
    ...elevationShadowStyle({ elevation: 2 })
  },
  imageContainer: {
    borderRadius: 6,
    height: height / 3,
    overflow: 'hidden',
    ...elevationShadowStyle({ elevation: 2 })
  },
  photoName: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 20,
    left: 20,
    ...human.caption2White
  },
  removeImage: {
    opacity: 0.5,
    position: 'absolute',
    top: 20,
    right: 20
  }
})

export default NewIssueScreen
