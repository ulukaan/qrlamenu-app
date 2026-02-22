# 🍽️ QRlamenü Premium - Digital Menu & Restaurant Management System

QRlamenü is a next-generation SaaS solution for restaurants, cafes, and hotels to manage their digital menus, orders, and waiter calls through a modern, premium interface.

## 🚀 Features

- **Dynamic QR Menu:** Beautifully designed themes (Lite, Classic, Modern, Signature, Luxury).
- **Admin Dashboard:** Manage categories, products, prices, and availability in real-time.
- **Super Admin Panel:** SaaS management, tenant control, subscription plans, and system logs.
- **Real-time Notifications:** Instant waiter call and order alerts (via Pusher).
- **Advanced Security:** Rate limiting, WAF patterns, CSP headers, and secure cookie management.
- **SEO Ready:** Optimized for social sharing and search engines.

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Veritabanı:** MySQL (Prisma ORM ile)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Real-time:** [Pusher](https://pusher.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- MySQL Database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ulukaan/qrlamenu.com.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your `.env` file (see `.env.example`).

4. Sync the database:

   ```bash
   npx prisma db push
   npx prisma seed
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is optimized for deployment on **Hostinger** (Managed Node.js).

1. Connect your GitHub repository to your hosting panel.
2. Configure environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).
3. Run the build command as defined in `package.json`.

## 🔒 Security

QRlamenü includes advanced security measures:

- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- Rate Limiting (IP-based)
- Web Application Firewall (WAF) to block malicious patterns.

---

Built with ❤️ for better dining experiences.
