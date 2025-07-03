"use client"

import type React from "react"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("")
  const [orderStatus, setOrderStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const trackOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (trackingId.length < 8) {
      toast({
        title: "Invalid tracking ID",
        description: "Please enter a valid tracking ID (minimum 8 characters)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock order status data
      const mockStatus = {
        orderId: "ORD-001",
        trackingId: trackingId,
        status: "shipped",
        estimatedDelivery: "2024-01-20",
        timeline: [
          {
            status: "Order Placed",
            date: "2024-01-15",
            time: "10:30 AM",
            completed: true,
            icon: Package,
          },
          {
            status: "Processing",
            date: "2024-01-16",
            time: "2:15 PM",
            completed: true,
            icon: Clock,
          },
          {
            status: "Shipped",
            date: "2024-01-17",
            time: "9:45 AM",
            completed: true,
            icon: Truck,
          },
          {
            status: "Out for Delivery",
            date: "2024-01-20",
            time: "Expected",
            completed: false,
            icon: Truck,
          },
          {
            status: "Delivered",
            date: "2024-01-20",
            time: "Expected",
            completed: false,
            icon: CheckCircle,
          },
        ],
        shippingAddress: {
          name: "John Doe",
          address: "123 Fashion Street, Apartment 4B",
          city: "Dhaka, 1000",
        },
        items: [
          {
            name: "Ultra High-Rise Denim Jeans",
            quantity: 1,
            size: "M",
            color: "Blue",
          },
        ],
      }

      setOrderStatus(mockStatus)
      setIsLoading(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
            <p className="text-gray-600">Enter your tracking ID to get real-time updates on your order</p>
          </div>

          {/* Tracking Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={trackOrder} className="space-y-4">
                <div>
                  <Label htmlFor="trackingId">Tracking ID *</Label>
                  <div className="flex mt-2 space-x-4">
                    <Input
                      id="trackingId"
                      type="text"
                      placeholder="Enter your tracking ID (e.g., TRK123456789)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="flex-1"
                      required
                      minLength={8}
                      maxLength={20}
                    />
                    <Button type="submit" disabled={isLoading} className="bg-rose-600 hover:bg-rose-700">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Tracking...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Track Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  You can find your tracking ID in the order confirmation email or in your dashboard.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Order Status Results */}
          {orderStatus && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order #{orderStatus.orderId}</CardTitle>
                    <Badge className={getStatusColor(orderStatus.status)}>
                      {orderStatus.status.charAt(0).toUpperCase() + orderStatus.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>{orderStatus.shippingAddress.name}</p>
                        <p>{orderStatus.shippingAddress.address}</p>
                        <p>{orderStatus.shippingAddress.city}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {orderStatus.items.map((item: any, index: number) => (
                          <div key={index} className="text-sm text-gray-600">
                            {item.name} - {item.size}, {item.color} (x{item.quantity})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {orderStatus.estimatedDelivery && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Estimated Delivery:{" "}
                        {new Date(orderStatus.estimatedDelivery).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {orderStatus.timeline.map((step: any, index: number) => {
                      const Icon = step.icon
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                                {step.status}
                              </h3>
                              <div className="text-sm text-gray-500">
                                {step.date} {step.time !== "Expected" && `• ${step.time}`}
                              </div>
                            </div>

                            {step.completed && index < orderStatus.timeline.length - 1 && (
                              <div className="w-0.5 h-6 bg-green-200 ml-5 mt-2"></div>
                            )}
                            {!step.completed && index < orderStatus.timeline.length - 1 && (
                              <div className="w-0.5 h-6 bg-gray-200 ml-5 mt-2"></div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                      If you have any questions about your order, our customer support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="outline">Contact Support</Button>
                      <Button variant="outline">Call: +880-1234-567890</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
