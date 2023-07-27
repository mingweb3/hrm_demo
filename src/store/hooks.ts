import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/types'
import { AppDispatch } from './configureStore'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
