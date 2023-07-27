import { useRoutes } from 'react-router-dom'
import { AuthRoutes } from './AuthRoutes'
import { FirstLookRoutes } from './FirstLookRoute'
import { MainRoutes } from './MainRoutes'
import { OrgRoutes } from './OrgRoutes'
import { PlacementRoutes } from './PlacementRoutes'

export function AppRoutes() {
  return useRoutes([AuthRoutes, MainRoutes, OrgRoutes, FirstLookRoutes, PlacementRoutes])
}
