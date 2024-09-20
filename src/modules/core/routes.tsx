import { lazy } from 'react'

const ManageUserPage = lazy(() => import('./clusters/md-user/pages/user/components/ManageUserPage'))
const ManageUserAddPage = lazy(() => import('./clusters/md-user/pages/user/components/ManageUserAddPage'))
const ManageUserDetailPage = lazy(() => import('./clusters/md-user/pages/user/components/ManageUserDetailPage'))

const coreRoutes = [
  {
    path: 'user',
    children: [
      {
        index: true,
        element: <ManageUserPage />
      },
      {
        path: 'add',
        element: <ManageUserAddPage />
      },
      {
        path: ':id',
        element: <ManageUserDetailPage />
      }
    ]
  }
]

export default coreRoutes
