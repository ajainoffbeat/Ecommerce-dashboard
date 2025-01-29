import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  PlusIcon
} from 'lucide-react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table"
import { SidebarInset } from '@/components/ui/sidebar'
import Header from '@/components/header'
import axiosInstance from '@/config/axios'
import { Label } from '@/components/ui/label'
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Textarea } from '@/components/ui/textarea'

// Define the type for our data
type DataItem = {
  _id: string
  name: string
  description: string
  slug: string,
}

// Validation schema using Yup
const createCategorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

export default function CategoryPage() {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'view' | 'edit' | 'delete'>('add');
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);

  const handleViewDetails = (item: DataItem) => {
    setModalMode('view');
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleEditDetails = (item: DataItem) => {
    setModalMode('edit');
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteDetails = (item: DataItem) => {
    setModalMode('delete');
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace this URL with your actual API endpoint
        const { data } = await axiosInstance.get(`/category`)
        setData(data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<DataItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue(`createdAt`))
        return date.toLocaleString();
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(item)}>View details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditDetails(item)}>Edit item</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteDetails(item)}>Delete item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
  })

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <SidebarInset>
      <Header />
      <div className="container p-4 pt-0">
        <div className="flex justify-between items-center mb-4 ">
          <div className="flex items-center space-x-2 w-[400px]">
            <Input
              placeholder="Search by name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="flex space-x-2">
            <Select
              onValueChange={(value) => table.setPageSize(Number(value))}
              defaultValue="10"
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Select limit" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                table.setSorting([{ id: 'createdAt', desc: value === 'desc' }])
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Oldest</SelectItem>
                <SelectItem value="desc">Newest</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default" onClick={() => {
                  setModalMode('add');
                  setCurrentItem(null);
                  setIsModalOpen(true);
                }}>
                  <PlusIcon className='h-4 w-4 text-white' />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  {/* <DialogTitle>Add New Category</DialogTitle> */}
                  <DialogTitle>
                    {modalMode === 'add' && 'Add New Category'}
                    {modalMode === 'view' && 'View Category Details'}
                    {modalMode === 'edit' && 'Edit Category'}
                    {modalMode === 'delete' && 'Delete Category'}
                  </DialogTitle>
                </DialogHeader>
                <Formik
                  initialValues={{
                    name: currentItem?.name || '',
                    description: currentItem?.description || '',
                  }}
                  // enableReinitialize
                  validationSchema={createCategorySchema}
                  // onSubmit={async (values, { setSubmitting, resetForm }) => {
                  //   try {
                  //     await axiosInstance.post('/category', values)
                  //     setIsModalOpen(false)
                  //     resetForm()
                  //     // Refetch data or update the table
                  //     const { data } = await axiosInstance.get('/category')
                  //     setData(data.data)
                  //   } catch (error) {
                  //     console.error('Error saving category:', error)
                  //   } finally {
                  //     setSubmitting(false)
                  //   }
                  // }}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                      if (modalMode === 'edit' && currentItem) {
                        await axiosInstance.put(`/category/${currentItem.slug}`, values);
                      } else if (modalMode === 'delete' && currentItem) {
                        await axiosInstance.delete(`/category/${currentItem?.slug}`);
                      } else {
                        await axiosInstance.post('/category', values);
                      }
                      setIsModalOpen(false);
                      resetForm();
                      const { data } = await axiosInstance.get('/category');
                      setData(data.data);
                    } catch (error) {
                      console.error('Error saving category:', error);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Field
                          name="name"
                          id="name"
                          placeholder="Enter category name"
                          as={Input}
                          className="col-span-3"
                          disabled={modalMode === 'view' || modalMode === 'delete'}
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm pt-1" />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Field
                          name="description"
                          id="description"
                          placeholder="Enter description"
                          as={Textarea}
                          className="col-span-3"
                          disabled={modalMode === 'view' || modalMode === 'delete'}
                        />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                      </div>
                      <DialogFooter>
                        {modalMode != 'view' && <Button type="submit" disabled={isSubmitting}>
                          {modalMode === 'delete' ? isSubmitting ? 'Deleting...' : 'Delete' : isSubmitting ? 'Saving...' : 'Save changes'}
                          {/* {isSubmitting ? 'Saving...' : 'Save changes'} */}
                        </Button>}

                      </DialogFooter>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Go to first page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Go to previous page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Go to next page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Go to last page</span>
            </Button>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}