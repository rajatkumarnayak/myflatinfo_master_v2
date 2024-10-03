// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Animated } from 'react-native'
class TriggeringView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      touched: false,
      hidden: false
    }
    this.onRef = ref => {
      this.ref = ref
    }
    this.onLayout = e => {
      if (this.props.onLayout) {
        this.props.onLayout(e)
      }
      if (!this.ref) {
        return
      }
      const layout = e.nativeEvent.layout
      this.height = layout.height
      this.ref.measure((x, y, width, height, pageX, pageY) => {
        this.initialPageY = pageY
      })
    }
    this.onScroll = event => {
      console.log('trigger -> ', event)

      if (!this.context.scrollPageY) {
        return
      }
      const pageY = this.initialPageY - event.value
      this.triggerEvents(this.context.scrollPageY, pageY, pageY + this.height)
    }
    this.initialPageY = 0
  }

  componentWillMount () {
    if (!this.context.scrollY) {
      return
    }
    this.listenerId = this.context.scrollY.addListener(this.onScroll)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (!this.context.scrollY) {
      return
    }
    this.context.scrollY.removeListener(this.listenerId)
    this.listenerId = nextContext.scrollY.addListener(this.onScroll)
  }

  triggerEvents (value, top, bottom) {
    const { bottomOffset, topOffset } = this.props
    if (!this.state.touched && value >= top + topOffset) {
      this.setState({ touched: true })
      this.props.onBeginHidden()
      this.props.onTouchTop(true)
    } else if (this.state.touched && value < top + topOffset) {
      this.setState({ touched: false })
      this.props.onDisplay()
      this.props.onTouchTop(false)
    }
    if (!this.state.hidden && value >= bottom + bottomOffset) {
      this.setState({ hidden: true })
      this.props.onHide()
      this.props.onTouchBottom(true)
    } else if (this.state.hidden && value < bottom + bottomOffset) {
      this.setState({ hidden: false })
      this.props.onBeginDisplayed()
      this.props.onTouchBottom(false)
    }
  }

  render () {
    /* eslint-disable no-unused-vars */
    const {
      onBeginHidden,
      onHide,
      onBeginDisplayed,
      onDisplay,
      onTouchTop,
      onTouchBottom,
      ...viewProps
    } = this.props
    /* eslint-enable no-unused-vars */
    return (
      <View
        ref={this.onRef}
        collapsable={false}
        {...viewProps}
        onLayout={this.onLayout}
      >
        {this.props.children}
      </View>
    )
  }
}
TriggeringView.defaultProps = {
  onBeginHidden: () => {},
  onHide: () => {},
  onBeginDisplayed: () => {},
  onDisplay: () => {},
  onTouchTop: () => {},
  onTouchBottom: () => {},
  bottomOffset: 0,
  topOffset: 0
}
TriggeringView.contextTypes = {
  scrollY: PropTypes.instanceOf(Animated.Value),
  scrollPageY: PropTypes.number
}
export default TriggeringView
