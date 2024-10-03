import { createStore } from 'easy-peasy'
import navigationDebouncer from 'react-navigation-redux-debouncer'
// import logger from 'redux-logger'

import { composeWithDevTools } from 'remote-redux-devtools'
import { name as appName } from '../../app.json'

const devTools = composeWithDevTools({
  name: appName,
  realtime: true,
  injectserver: 'react-native',
  trace: true
})

export default (model, api) => {
  return createStore(model, {
    name: 'easystore',
    /**
     * for api injecting using injections
     */
    injections: { api },
    compose: devTools,
    devTools: false,
    middleware: [navigationDebouncer(600)]
  })
}
