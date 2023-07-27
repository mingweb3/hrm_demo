/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers as reduxJsCombineReducers } from '@reduxjs/toolkit'
import { InjectedReducersType } from '@/utils/types/injector-typings'

let combineReducers: any

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0) {
    return (state: any) => state
  }

  combineReducers = reduxJsCombineReducers({
    ...injectedReducers
  })

  return combineReducers
}

export type RootState = ReturnType<typeof combineReducers>
