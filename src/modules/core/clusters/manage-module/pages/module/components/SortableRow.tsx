import { useSortable } from "@dnd-kit/sortable"
import { SortableTableRowProps } from "../types/ManageModulePage.types"
import { TableRow } from "@mui/material"
import { CSS } from '@dnd-kit/utilities'

export function SortableTableRow(props: SortableTableRowProps) {
  const { style, sortableId, ...rest } = props

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sortableId })

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        ...style
      }}
      {...attributes}
      {...listeners}
      {...rest}
    >
      {props.children}
    </TableRow>
  )
}
