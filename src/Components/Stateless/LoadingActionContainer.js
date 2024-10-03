import React from 'react'
import {
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native'
// https://github.com/th3rdwave/react-native-safe-area-context
import { useSafeArea } from 'react-native-safe-area-context'

export default ({
  onRefresh,
  loading,
  fixed,
  renderHeader,
  noData,
  children,
  ...other
}) => {
  const safeAreaInsets = useSafeArea()

  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <Content
        onRefresh={onRefresh}
        fixed={fixed}
        loading={loading}
        children={children}
      />
    </SafeAreaView>
  )
}

const Content = ({ fixed, children, onRefresh, loading }) => {
  const fallback = () => {}

  return fixed ? (
    <>{children}</>
  ) : (
    <ScrollView keyboardShouldPersistTaps='always' nestedScrollEnabled>
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
    // marginTop: Platform.OS === 'android' ? -StatusBar.currentHeight : 0,
  },
  header: {
    // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
})
