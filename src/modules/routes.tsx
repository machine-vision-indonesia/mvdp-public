import { useRouter } from 'next/router'
// import exampleRoutes from '@/components/solutions/example/routes';
import { Suspense } from 'react'
import { lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import exampleRoutes from './core/example/routes'
import coreRoutes from './core/routes'

const SolutionsLayout = lazy(() => import('@/modules'))
const NotFound = lazy(() => import('@/modules/error/pages/404'))
const User = lazy(() => import('./core/user/clusters'))

function SolutionsRoute() {
  const router = useRouter()

  const routes = createBrowserRouter([
    {
      path: 'solutions',
      element: <SolutionsLayout />,
      children: [
        {
          path: 'example',
          children: exampleRoutes
        },
        {
          path: 'example2',
          children: exampleRoutes
        }
      ]
    },
    {
      path: 'core',
      element: <SolutionsLayout />,
      children: [
        {
          path: '',
          children: coreRoutes
        }
      ]
    },
    {
      path: '*',
      loader: () => {
        return router.push('/404')
      },
      element: <NotFound />
    }
  ])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={routes} />
    </Suspense>
  )
}

export default SolutionsRoute
