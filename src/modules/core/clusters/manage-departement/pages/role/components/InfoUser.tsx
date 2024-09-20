import React from 'react'
import { fetchListDepartment } from '@/components/complexes/user'
import { type GridValueGetterParams } from '@mui/x-data-grid'
import { GetTableUsersResponse } from '@/components/templates/page-primary'
import { GetTableUsers } from '../services/GetTableUsers.service'
import { SectionGroup } from '@/components/molecules/section-group'
import { TableAsyncV2 } from '@/components/molecules/table-async-v2'
import { IResultController } from '@/components/molecules/filter/types/filter.types'
import { FetchParameters } from '../types/ManageRoleDetailPage.types'

const InfoUser: React.FC<{ title: string; currId: string | string[] | undefined }> = ({ title, currId }) => {
  const COLUMNS = [
    {
      field: 'profile.id_number',
      headerName: 'ID',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.id_number || '-',
      searchable: true
    },
    {
      field: 'profile.full_name',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.profile?.full_name || '-',
      searchable: true
    },
    {
      field: 'werk.name',
      headerName: 'Work Center',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.werk?.name || '-',
      searchable: true
    },
    {
      field: 'sto.name',
      headerName: 'Department',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams<GetTableUsersResponse['data'][number]>) =>
        params.row.sto?.name || '-',
      searchable: true
    }
  ]

  const filterControllers = [
    {
      key: 'profile.full_name',
      name: 'Search User',
      type: 'SEARCH'
    },
    {
      key: 'sto.name',
      name: 'Department',
      type: 'MULTI_SELECT',
      dataFetchService: fetchListDepartment,
      valueKey: 'id',
      labelKey: 'name'
    }
  ]

  const getTableUserByRole = (params: FetchParameters | undefined) => {
    return GetTableUsers({
      ...params,
      filter: {
        privileges: {
          role: {
            id: {
              _eq: currId
            }
          }
        }
      }
    })
  }

  return (
    <SectionGroup title={title} color='default'>
      <TableAsyncV2
        columns={COLUMNS}
        dataFetchService={getTableUserByRole}
        resultController={filterControllers as IResultController[]}
        type='inline'
      />
    </SectionGroup>
  )
}

export default InfoUser
