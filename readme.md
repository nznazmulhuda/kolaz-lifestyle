# 🛍️ KoLaz – Modern Clothing E-Commerce Frontend

**KoLaz** is a fully responsive, scalable, and UI-focused frontend for a modern clothing e-commerce platform.  
This frontend connects to an external backend API built using Express.js and Mongoose, and is fully built with **Next.js**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, and **React Context API**.

> 🔴 The project uses a **Red Theme**. All theme-related colors are centralized in `globals.css` for easy customization.

---

## 🚀 Features

### 👨‍💼 User Features
- ✅ Homepage with Swiper banner, latest & top-selling products
- ✅ Shop page with filtering (category, price, gender, color) & pagination
- ✅ Product details with image gallery, size selector, related products
- ✅ Cart sidebar with coupon system & dynamic price updates
- ✅ OTP-based checkout flow with phone number authentication
- ✅ Track orders via tracking ID
- ✅ User dashboard to view orders & update profile (except phone)
- ✅ Red theme, animated UI, responsive across all devices

### 🛠️ Admin Features
- ✅ Admin dashboard with analytics cards and charts
- ✅ Product management: add, preview, update, delete
- ✅ Orders management with real-time status updates
- ✅ Sidebar navigation with route-based access

---

## 🧑‍💻 Tech Stack

| Layer        | Technology                           |
|--------------|--------------------------------------|
| Framework    | Next.js 14 (App Router)              |
| Language     | TypeScript                           |
| Styling      | Tailwind CSS                         |
| UI Kit       | shadcn/ui + Lucide Icons             |
| State Mgmt   | React Context API                    |
| Validation   | Zod (for form structure)             |
| Charts       | Chart.js (or your preferred lib)     |
| Animation    | Tailwind Transitions + SwiperJS      |
| Notifications| Sonner                               |

---

## 🧩 Project Structure (App Router)

```bash
app/
├── layout.tsx
├── page.tsx                # Homepage
├── shop/
│   └── page.tsx
├── product/
│   └── [slug]/page.tsx     # Single product
├── checkout/
│   └── page.tsx
├── track-order/
│   └── page.tsx
├── dashboard/
│   ├── page.tsx
│   ├── orders/page.tsx
│   └── profile/page.tsx
├── admin/
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── add/page.tsx
│   ├── orders/page.tsx
│   └── analytics/page.tsx
```

---

## ⚙️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/nznazmulhuda/kolaz-lifestyle
cd kolaz-lifestyle

# 2. Install dependencies
pnpm install

# 3. Run development server
pnpm dev
```

> Ensure your backend API is already running and connected to provide product, cart, checkout, and OTP endpoints.

---
<!-- 
## 🌐 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.kolaz.com
NEXT_PUBLIC_OTP_LENGTH=6
NEXT_PUBLIC_THEME_COLOR=#e11d48
```

--- -->

## 🧠 Developer Notes

- All state management handled via React Context only (no Redux/Zustand)
- All pages are UI-only, backend interaction assumed via REST API
- Form structure implies Zod validation rules (min/max/required)
- Admin vs User dashboard separated by route

---

## 📌 Future Improvements (Optional)
- Role-based route protection
- Dark mode toggle
- Wishlist system
- Product rating and reviews section

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

---

## 📄 License

MIT License © 2025 [Nazmul Huda Nahid](https://github.com/nznazmulhuda)
