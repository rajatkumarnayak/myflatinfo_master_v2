import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import { downloadFile } from '../../Utils/Utils'

const FileLink = ({ url, contents, encoding, fileName, displayName, path }) => {
  // const _path = RNFS.DocumentDirectoryPath + '/' + fileName
  // const writeFile = () => {
  //   RNFS.writeFile(_path, contents, encoding)
  //     .then((success) => {
  //       alert('File saved successfully at\n' + _path)
  //     })
  //     .catch((err) => {
  //       alert('Could not save file.\nError message: ' + err.message)
  //     })
  // }

  return (
    <TouchableOpacity onPress={() => downloadFile({ url, fileName, path })}>
      <Text
        style={{
          ...human.subhead,
          ...systemWeights.bold,
          color: iOSColors.blue,
          textDecorationLine: 'underline'
        }}
      >
        {displayName}
      </Text>
    </TouchableOpacity>
  )
}

export default FileLink
