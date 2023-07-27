import { StoreEnhancer, configureStore } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { createInjectorsEnhancer } from 'redux-injectors'
import createSagaMiddleware from 'redux-saga'
import { createReducer } from './reducers'

let store: ToolkitStore

export function configureAppStore(): ToolkitStore {
  const reduxSagaMonitorOptions = {}
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions)
  const { run: runSaga } = sagaMiddleware

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware]

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga
    })
  ] as StoreEnhancer[]

  store = configureStore({
    reducer: createReducer(),
    middleware: (defaultMiddleware: () => any) => [...defaultMiddleware(), ...middlewares],
    devTools: import.meta.env.DEV === true,
    enhancers
  })

  return store
}

export type AppGetState = typeof store.getState
export type AppDispatch = typeof store.dispatch
