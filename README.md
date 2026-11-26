# FreshCart

An e-commerce store built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and TanStack Query, connected to the Route E-Commerce REST API.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI & Styling:** React 19, Tailwind CSS v4, Lucide React, Swiper
- **State & Data Fetching:** TanStack React Query v5, Axios
- **Form Management:** React Hook Form, Zod
- **Authentication:** HttpOnly session cookies with JWT decoding

## Features

- **Product Catalog:** Filtering by category, brand, and price range, sorting, debounced search, and pagination.
- **Product Details:** Image gallery, product specifications, stock status, ratings, and related category products.
- **Categories & Brands:** Dedicated browsing pages and filtered views.
- **Cart & Wishlist:** Item additions, quantity adjustments, line removals, and one-click move from wishlist to cart.
- **Checkout & Orders:** Cash on Delivery and Stripe card checkout, address management, and previous order history.
- **Account:** Sign up with Egyptian phone validation, login, profile updates, password change, and 3-step code reset.

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### Installation

```bash
npm install
```

### Development

Start the development server at `http://localhost:3000`:

```bash
npm run dev
```

### Production Build

Check types and build the production bundle:

```bash
npx tsc --noEmit
npm run build
```

Start the production server:

```bash
npm run start
```
