"use client"

import { useState } from "react"
import { Search, Filter, Eye, Mail, Phone, MapPin, ShoppingBag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { useToast } from "@/hooks/use-toast"

// Mock customers data with detailed information
const mockCustomers = [
  {
    id: "CUST-001",
    name: "Sarah Ahmed",
    email: "sarah@example.com",
    phone: "+880 1712-345678",
    address: "House 123, Road 15, Dhanmondi, Dhaka - 1205",
    joinDate: "2023-08-15",
    totalOrders: 12,
    totalSpent: 45000,
    averageOrderValue: 3750,
    lastOrderDate: "2024-01-15",
    status: "active" as const,
    favoriteCategory: "Women",
    recentOrders: [
      { id: "ORD-001", date: "2024-01-15", total: 4500, status: "processing" },
      { id: "ORD-015", date: "2024-01-10", total: 3200, status: "delivered" },
      { id: "ORD-028", date: "2024-01-05", total: 5800, status: "delivered" },
    ],
  },
  {
    id: "CUST-002",
    name: "Mohammad Rahman",
    email: "rahman@example.com",
    phone: "+880 1812-345678",
    address: "Flat 4B, Building 7, Gulshan, Dhaka - 1212",
    joinDate: "2023-06-20",
    totalOrders: 8,
    totalSpent: 28000,
    averageOrderValue: 3500,
    lastOrderDate: "2024-01-14",
    status: "active" as const,
    favoriteCategory: "Men",
    recentOrders: [
      { id: "ORD-002", date: "2024-01-14", total: 2800, status: "shipped" },
      { id: "ORD-022", date: "2024-01-08", total: 4200, status: "delivered" },
      { id: "ORD-035", date: "2024-01-02", total: 3600, status: "delivered" },
    ],
  },
  {
    id: "CUST-003",
    name: "Fatima Khan",
    email: "fatima@example.com",
    phone: "+880 1912-345678",
    address: "Plot 45, Sector 7, Uttara, Dhaka - 1230",
    joinDate: "2023-09-10",
    totalOrders: 15,
    totalSpent: 62000,
    averageOrderValue: 4133,
    lastOrderDate: "2024-01-13",
    status: "active" as const,
    favoriteCategory: "Accessories",
    recentOrders: [
      { id: "ORD-003", date: "2024-01-13", total: 6200, status: "delivered" },
      { id: "ORD-018", date: "2024-01-09", total: 4800, status: "delivered" },
      { id: "ORD-031", date: "2024-01-04", total: 3900, status: "delivered" },
    ],
  },
  {
    id: "CUST-004",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    phone: "+880 1612-345678",
    address: "House 67, Block C, Bashundhara, Dhaka - 1229",
    joinDate: "2023-11-05",
    totalOrders: 5,
    totalSpent: 18500,
    averageOrderValue: 3700,
    lastOrderDate: "2023-12-28",
    status: "inactive" as const,
    favoriteCategory: "Men",
    recentOrders: [
      { id: "ORD-045", date: "2023-12-28", total: 3200, status: "delivered" },
      { id: "ORD-038", date: "2023-12-15", total: 4100, status: "delivered" },
      { id: "ORD-029", date: "2023-12-02", total: 2800, status: "delivered" },
    ],
  },
]

export default function AdminCustomersPage() {
  const [customers] = useState(mockCustomers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof mockCustomers)[0] | null>(null)
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false)
  const { toast } = useToast()

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewCustomer = (customer: (typeof mockCustomers)[0]) => {
    setSelectedCustomer(customer)
    setIsCustomerDetailOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-2">Manage and view customer information</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Badge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.filter((c) => c.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">Currently shopping</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳
                  {Math.round(
                    customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length,
                  ).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Per customer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">From all customers</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Customer</th>
                      <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-900">Join Date</th>
                      <th className="text-left p-4 font-medium text-gray-900">Orders</th>
                      <th className="text-left p-4 font-medium text-gray-900">Total Spent</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </td>
                        <td className="p-4 text-gray-900">{new Date(customer.joinDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{customer.totalOrders}</div>
                          <div className="text-sm text-gray-500">
                            Last: {new Date(customer.lastOrderDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-900">৳{customer.totalSpent.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(customer.status)} w-fit`}>
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Customer Detail Modal */}
          <Dialog open={isCustomerDetailOpen} onOpenChange={setIsCustomerDetailOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
              </DialogHeader>
              {selectedCustomer && (
                <div className="space-y-6">
                  {/* Customer Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span className="text-sm">{selectedCustomer.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="pt-2">
                          <Badge className={getStatusColor(selectedCustomer.status)}>
                            {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Shopping Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="text-2xl font-bold">৳{selectedCustomer.totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Average Order</p>
                            <p className="text-lg font-semibold">
                              ৳{selectedCustomer.averageOrderValue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Favorite Category</p>
                            <p className="text-lg font-semibold">{selectedCustomer.favoriteCategory}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Order</p>
                          <p className="font-medium">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left p-3 text-sm font-medium">Order ID</th>
                              <th className="text-left p-3 text-sm font-medium">Date</th>
                              <th className="text-left p-3 text-sm font-medium">Total</th>
                              <th className="text-left p-3 text-sm font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCustomer.recentOrders.map((order) => (
                              <tr key={order.id} className="border-t">
                                <td className="p-3 text-sm font-medium">{order.id}</td>
                                <td className="p-3 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-3 text-sm font-medium">৳{order.total.toLocaleString()}</td>
                                <td className="p-3">
                                  <Badge className={`${getOrderStatusColor(order.status)} text-xs`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                    <Button onClick={() => setIsCustomerDetailOpen(false)}>Close</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
