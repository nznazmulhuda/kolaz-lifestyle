"use client"

import { useState } from "react"
import { Search, Filter, Eye, Printer, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { useToast } from "@/hooks/use-toast"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Ahmed",
    email: "sarah@example.com",
    phone: "+880 1712-345678",
    total: 4500,
    status: "processing" as const,
    paymentMethod: "cod" as const,
    items: [
      { name: "Premium Cotton T-Shirt", quantity: 2, price: 1500 },
      { name: "Denim Jeans", quantity: 1, price: 3000 },
    ],
    shippingAddress: {
      fullName: "Sarah Ahmed",
      phone: "+880 1712-345678",
      address: "House 123, Road 15, Dhanmondi",
      city: "Dhaka",
      zip: "1205",
    },
    createdAt: "2024-01-15T10:30:00Z",
    trackingId: "TRK123456789",
  },
  {
    id: "ORD-002",
    customer: "Mohammad Rahman",
    email: "rahman@example.com",
    phone: "+880 1812-345678",
    total: 2800,
    status: "shipped" as const,
    paymentMethod: "sslcommerz" as const,
    items: [{ name: "Casual Hoodie", quantity: 1, price: 2800 }],
    shippingAddress: {
      fullName: "Mohammad Rahman",
      phone: "+880 1812-345678",
      address: "Flat 4B, Building 7, Gulshan",
      city: "Dhaka",
      zip: "1212",
    },
    createdAt: "2024-01-14T15:45:00Z",
    trackingId: "TRK987654321",
  },
  {
    id: "ORD-003",
    customer: "Fatima Khan",
    email: "fatima@example.com",
    phone: "+880 1912-345678",
    total: 6200,
    status: "delivered" as const,
    paymentMethod: "cod" as const,
    items: [
      { name: "Designer Dress", quantity: 1, price: 4500 },
      { name: "Leather Handbag", quantity: 1, price: 1700 },
    ],
    shippingAddress: {
      fullName: "Fatima Khan",
      phone: "+880 1912-345678",
      address: "Plot 45, Sector 7, Uttara",
      city: "Dhaka",
      zip: "1230",
    },
    createdAt: "2024-01-13T09:20:00Z",
    trackingId: "TRK456789123",
  },
]

export default function AdminOrdersPage() {
  const [orders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const { toast } = useToast()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
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

  const handleViewOrder = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }

  const handlePrintInvoice = (order: (typeof mockOrders)[0]) => {
    const invoiceWindow = window.open("", "_blank")
    if (!invoiceWindow) return

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e11d48; padding-bottom: 20px; }
            .company-name { font-size: 28px; font-weight: bold; color: #e11d48; margin-bottom: 5px; }
            .invoice-title { font-size: 24px; margin-bottom: 20px; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-block { width: 45%; }
            .info-block h3 { margin-bottom: 10px; color: #374151; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
            .table th { background-color: #f9fafb; font-weight: bold; }
            .total-section { text-align: right; margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #374151; padding-top: 10px; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">KoLaz Fashion</div>
            <div>Premium Fashion Store</div>
            <div>Dhaka, Bangladesh | Phone: +880 1700-000000</div>
          </div>

          <div class="invoice-title">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
          </div>

          <div class="info-section">
            <div class="info-block">
              <h3>Bill To:</h3>
              <p><strong>${order.customer}</strong></p>
              <p>${order.email}</p>
              <p>${order.phone}</p>
            </div>
            <div class="info-block">
              <h3>Ship To:</h3>
              <p><strong>${order.shippingAddress.fullName}</strong></p>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city} - ${order.shippingAddress.zip}</p>
              <p>${order.shippingAddress.phone}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>৳${item.price.toLocaleString()}</td>
                  <td>৳${(item.quantity * item.price).toLocaleString()}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>৳${order.total.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>৳0</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>৳${order.total.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <p><strong>Payment Method:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
            ${order.trackingId ? `<p><strong>Tracking ID:</strong> ${order.trackingId}</p>` : ""}
            <p>Thank you for shopping with KoLaz Fashion!</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `

    invoiceWindow.document.write(invoiceHTML)
    invoiceWindow.document.close()

    toast({
      title: "Invoice generated",
      description: "The invoice has been opened in a new window for printing.",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-2">Track and manage customer orders</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</div>
                <p className="text-xs text-muted-foreground">In transit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total this month</p>
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
                      placeholder="Search orders..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Order ID</th>
                      <th className="text-left p-4 font-medium text-gray-900">Customer</th>
                      <th className="text-left p-4 font-medium text-gray-900">Date</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Total</th>
                      <th className="text-left p-4 font-medium text-gray-900">Payment</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{order.id}</div>
                          {order.trackingId && <div className="text-sm text-gray-500">Track: {order.trackingId}</div>}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </td>
                        <td className="p-4 text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium text-gray-900">৳{order.total.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant={order.paymentMethod === "cod" ? "secondary" : "default"}>
                            {order.paymentMethod === "cod" ? "COD" : "Online"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(order)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Order Detail Modal */}
          <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Order Information</h3>
                      <p className="text-sm text-gray-600">Order ID: {selectedOrder.id}</p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status:{" "}
                        <Badge className={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </p>
                      {selectedOrder.trackingId && (
                        <p className="text-sm text-gray-600">Tracking: {selectedOrder.trackingId}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <p className="text-sm text-gray-600">Name: {selectedOrder.customer}</p>
                      <p className="text-sm text-gray-600">Email: {selectedOrder.email}</p>
                      <p className="text-sm text-gray-600">Phone: {selectedOrder.phone}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.zip}
                      </p>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium">Item</th>
                            <th className="text-left p-3 text-sm font-medium">Qty</th>
                            <th className="text-left p-3 text-sm font-medium">Price</th>
                            <th className="text-left p-3 text-sm font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3 text-sm">{item.name}</td>
                              <td className="p-3 text-sm">{item.quantity}</td>
                              <td className="p-3 text-sm">৳{item.price.toLocaleString()}</td>
                              <td className="p-3 text-sm font-medium">
                                ৳{(item.quantity * item.price).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold">৳{selectedOrder.total.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Payment Method: {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => handlePrintInvoice(selectedOrder)}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Invoice
                    </Button>
                    <Button onClick={() => setIsOrderDetailOpen(false)}>Close</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
