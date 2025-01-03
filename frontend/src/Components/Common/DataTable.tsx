
import { useState, useEffect } from 'react'
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { getAllUsersAndDoctors, listUnlistDoctor, userBlockUnblock } from '../../services/adminServices'
import { toast } from 'sonner'


interface DoctorDetailsOrUserDetails {
    _id: string;
    doctorId?: string;
    name: string;
    phone: string;
    email: string;
    isBlocked: boolean;
    docStatus?: string;
    rejectedReason?: string;
    userId?: string;
}

const DataTable = ({ role }) => {
    console.log("role", role);

    // const [data, setData] = useState<any>([])
    const [data, setData] = useState<DoctorDetailsOrUserDetails[] | []>([])
    const [filters, setFilters] = useState({ search: '' })
    const [sortOptions, setSortOptions] = useState({ sort: 'createdAt', order: 'asc' })
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 0 })

    useEffect(() => {
        fetchData()
    }, [filters, sortOptions, pagination.page, role])


    const toggleListState = async (id: string) => {
        console.log("hello toggled");
        if (role == "user") {
            const response = await userBlockUnblock(id as string)
            console.log(response)
            if (response) {
                toast.success("The Action was successful");
            }
            setData((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
                )
            );
        } else if (role == "doctor") {
            const response = await listUnlistDoctor(id as string)
            if (response) {
                toast.success("The Action was successful");
            } else {
                toast.error("The Action was unsuccessful");
            }
            setData((prevDoctors) =>
                prevDoctors.map((doctor) =>
                    doctor._id === id ? { ...doctor, isBlocked: !doctor.isBlocked } : doctor
                )
            );
        }

    };

    const fetchData = async () => {
        try {
            const response: any = await getAllUsersAndDoctors({
                ...filters,
                ...sortOptions,
                page: pagination.page,
                limit: pagination.limit,
                role: role
            })
            console.log("userData : ", response)
            setData(response.data.response)




            // const response = await adminAxiosUrl.get(role === "user" ?, {
            //     params: {
            //         ...filters,
            //         ...sortOptions,
            //         page: pagination.page,
            //         limit: pagination.limit,
            //     },
            // })
            // setData(response.data.items)
            // setPagination((prev) => ({ ...prev, totalPages: response.data.pagination.totalPages }))
        } catch (error) {
            console.error('Error fetching data', error)
        }
    }

    const handleFilterChange = (filterKey, value) => {
        setFilters((prev) => ({ ...prev, [filterKey]: value }))
        setPagination((prev) => ({ ...prev, page: 1 })) // Reset to first page
    }

    const handleSortChange = (sortKey) => {
        setSortOptions((prev) => ({
            sort: sortKey,
            order: prev.order === 'asc' ? 'desc' : 'asc',
        }))
    }

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }))
    }

    return (
        <Card className="w-full max-w-6xl mx-auto ">
            <CardHeader>
                <CardTitle className='text-xl'>
                    {`${role == "user" ? "Users List" : "Doctors List"}`}
                </CardTitle>
                {role === "doctor" && (
                    <p className="text-sm text-gray-400 font-bold">Manage your doctors and their statuses.</p>
                )}
                {role === "user" && (
                    <p className="text-sm text-gray-400">Manage your users and their statuses.</p>
                )}
            </CardHeader>
            <CardContent>
                {/* Search Section */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-8"
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Sort Section */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handleSortChange('createdAt')}
                        className="group"
                    >
                        Sort by Date
                        <ArrowUpDown className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSortChange('name')}
                        className="group"
                    >
                        Sort by Name
                        <ArrowUpDown className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                    </Button>


                </div>

                {/* Data Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${!item.isBlocked ? 'bg-green-100 text-green-800' :

                                                'bg-red-100 text-red-800'
                                                }`}>
                                                {`${!item.isBlocked ? "Active" : "InActive"}`}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span >
                                                {item.email}
                                            </span>
                                        </TableCell>

                                        <TableCell>  <DropdownMenu>                     <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => toggleListState(item._id)}>
                                                    {item.isBlocked ? "UnBlock" : "Block"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default DataTable

