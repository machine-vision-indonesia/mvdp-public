import { lazy } from 'react'

const User = lazy(() => import('./clusters'))
const DetailUser = lazy(() => import("./clusters/id"))
const Add = lazy(() => import('./clusters/add'))
const EditAddUserressAndContact = lazy(() => import('./clusters/id/edit/address-and-contact'))
const EditAuthAndField = lazy(() => import('./clusters/id/edit/auth-and-field'))
const EditPersonalData = lazy(() => import('./clusters/id/edit/personal-data'))
const Edit = lazy(() => import('./clusters/id'))

const userRoutes = [
  {
    path: '',
    children: [
      {
        index: true,
        element: <User />,
      },
      {
        path: 'edit/:id',
        element: <Edit />
      },
      {
        path: 'add',
        element: <Add />
      }
    ]
  }
];

export default userRoutes
