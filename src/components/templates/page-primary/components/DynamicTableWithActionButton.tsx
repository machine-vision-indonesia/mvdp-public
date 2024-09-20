import { TableAsyncV2 } from '@/components/molecules/table-async-v2'
import { GridColDef } from '@mui/x-data-grid'
import { DynamicTableProps } from '../types/PagePrimary.type'
import { TableAsyncCollapsed } from '../../table-async-collapse'

export function DynamicTableWithActionButton<T>({
  columns,
  dataFetchService,
  filters,
  renderActionButton,
  isCollapsed,
  groupFieldKeyTitle,
  groupName
}: DynamicTableProps<T>) {
  const enhancedColumns: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      maxWidth: 126,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderActionButton,
      headerAlign: 'center'
    }
  ]

  return (
    <>
      {
        isCollapsed ? (
          <TableAsyncCollapsed
            columns={enhancedColumns}
            dataFetchService={dataFetchService}
            resultController={filters}
            groupFieldKeyTitle={groupFieldKeyTitle}
            groupName={groupName}
            isCollapsed={isCollapsed}
          />
        ) : (
          <TableAsyncV2
            columns={enhancedColumns}
            dataFetchService={dataFetchService}
            resultController={filters}
            type='inline'
          />
        )
      }

    </>
  )
}
