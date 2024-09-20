import { Paper } from "@mui/material"
import { AssignToRoleSchema, ModuleTabPanelProps } from "../types/ManageModulePage.types"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import MuiCheckbox from '@mui/material/Checkbox'

export function ModuleTabPanel(props: ModuleTabPanelProps) {
  const form = useFormContext<AssignToRoleSchema>()
  const fieldArray = useFieldArray({
    control: form.control,
    name: `rows.${props.index}.capabilities` as 'rows.0.capabilities',
  })

  return (
    <div
      role='tabpanel'
      hidden={props.value !== props.index}
      id={`simple-tabpanel-${props.index}`}
      aria-labelledby={`simple-tab-${props.index}`}
    >
      {props.value === props.index ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Cluster</TableCell>
                <TableCell>Page</TableCell>
                <TableCell>Create</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fieldArray.fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{field.cluster.name}</TableCell>
                  <TableCell>{field.page.name}</TableCell>
                  <TableCell>
                    <Controller
                      control={form.control}
                      name={`rows.${props.index}.capabilities.${index}.create`}
                      defaultValue={field.create}
                      render={({ field }) => (
                        <MuiCheckbox
                          {...field}
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      control={form.control}
                      name={`rows.${props.index}.capabilities.${index}.update`}
                      defaultValue={field.update}
                      render={({ field }) => (
                        <MuiCheckbox
                          {...field}
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      control={form.control}
                      name={`rows.${props.index}.capabilities.${index}.delete`}
                      defaultValue={field.delete}
                      render={({ field }) => (
                        <MuiCheckbox
                          {...field}
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </div>
  )
}
