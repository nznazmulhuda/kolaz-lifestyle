"use client"

import { X, Minus, Plus, ShoppingBag, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useApp, validateCoupon } from "@/contexts/AppContext"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export function CartSidebar() {
  const { state, dispatch } = useApp()
  const { cart, isCartOpen, appliedCoupon, couponDiscount } = state
  const [couponCode, setCouponCode] = useState("")
  const { toast } = useToast()

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price
    return sum + price * item.quantity
  }, 0)

  const discountAmount = subtotal * couponDiscount
  const total = subtotal - discountAmount

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: itemId })
    } else {
      dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id: itemId, quantity: newQuantity } })
    }
  }

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    if (appliedCoupon) {
      toast({
        title: "Coupon already applied",
        description: "Remove the current coupon to apply a new one",
        variant: "destructive",
      })
      return
    }

    const validation = validateCoupon(couponCode.trim().toUpperCase())

    if (validation.isValid) {
      dispatch({
        type: "APPLY_COUPON",
        payload: { code: couponCode.trim().toUpperCase(), discount: validation.discount },
      })
      setCouponCode("")
      toast({
        title: validation.message,
        description: `You saved ৳${(subtotal * validation.discount).toLocaleString()}!`,
      })
    } else {
      toast({
        title: validation.message,
        variant: "destructive",
      })
    }
  }

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" })
    toast({
      title: "Coupon removed",
      description: "The discount has been removed from your order",
    })
  }

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => dispatch({ type: "TOGGLE_CART" })} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Shopping Cart ({cart.length})</h2>
            <Button variant="ghost" size="icon" onClick={() => dispatch({ type: "TOGGLE_CART" })}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some products to get started</p>
                <Button onClick={() => dispatch({ type: "TOGGLE_CART" })} className="bg-rose-600 hover:bg-rose-700">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4 border-b pb-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="text-sm font-medium line-clamp-2">{item.product.name}</h3>
                      <div className="flex text-xs text-gray-600 space-x-2">
                        <span>Size: {item.size}</span>
                        <span>•</span>
                        <span>Color: {item.color}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            ৳{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}
                          </p>
                          {item.product.salePrice && (
                            <p className="text-xs text-gray-500 line-through">
                              ৳{(item.product.price * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coupon Section */}
          {cart.length > 0 && (
            <div className="border-t p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Coupon Code</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600 text-white">{appliedCoupon}</Badge>
                      <span className="text-sm text-green-700">{Math.round(couponDiscount * 100)}% off applied</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-green-700 hover:text-green-800"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                    />
                    <Button variant="outline" onClick={applyCoupon} disabled={!couponCode.trim()}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon}):</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={() => dispatch({ type: "TOGGLE_CART" })}>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">Proceed to Checkout</Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => dispatch({ type: "TOGGLE_CART" })}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
