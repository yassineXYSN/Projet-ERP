# Procurement Management System

A comprehensive procurement and supply chain management application built with Next.js, Supabase, and TypeScript.

## Features

This application transforms your BPMN workflow into a fully functional procurement system with the following modules:

### 🔐 Authentication & User Management
- Role-based access control (Admin, Buyer, Inventory Manager, Quality Control, Finance, Supplier)
- Secure email/password authentication with Supabase
- User profiles with department assignments

### 📊 Dashboard
- Real-time statistics and KPIs
- Recent orders and projects overview
- Low stock alerts
- Activity monitoring

### 📁 Project Management
- Create and track procurement projects
- Multi-status workflow (Draft → Approval → In Progress → Completed)
- Project assignment to purchase orders

### 📦 Inventory Management
- Product catalog with SKU tracking
- Stock level monitoring
- Automatic reorder alerts
- Category-based organization

### 🤝 Supplier Management
- Supplier validation workflow
- Contact information management
- Status tracking (Pending → Validated → Active/Suspended)
- Supplier performance tracking

### 🛒 Purchase Order Processing
- Multi-item order creation
- Supplier and project linking
- Order status workflow
- Total amount calculations
- Order history and tracking

### ✅ Quality Control
- Product inspection workflows
- Quality check documentation
- Pass/Fail/Conditional results
- Inspector assignment and tracking

### 💰 Invoice Management
- Invoice creation and tracking
- Payment status monitoring
- Supplier invoice linkage
- Balance and payment tracking

### 🔄 ERP Integration
- Automatic sync logging
- Integration status monitoring
- Error tracking and reporting
- Audit trail for all transactions

### 📈 Reports & Analytics
- Comprehensive procurement statistics
- Order status breakdowns
- Financial summaries
- ERP sync logs

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Row Level Security
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Type Safety**: TypeScript
- **State Management**: React Server Components + Client Components

## Database Schema

The application includes 12 comprehensive tables:
- `profiles` - User profiles and roles
- `projects` - Procurement projects
- `products` - Inventory items
- `suppliers` - Supplier information
- `purchase_orders` - Purchase orders
- `purchase_order_items` - Order line items
- `receptions` - Goods receiving
- `quality_checks` - Quality inspections
- `invoices` - Supplier invoices
- `approvals` - Approval workflows
- `notifications` - User notifications
- `erp_logs` - ERP integration logs

All tables have Row Level Security (RLS) enabled for data protection.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up your Supabase project:
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts` folder in order:
     - `001_create_tables.sql`
     - `002_profile_trigger.sql`
     - `003_seed_data.sql`

4. Configure environment variables (already set up in v0):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - And other Supabase-related variables

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

### First Steps

1. Sign up for an account at `/signup`
2. Confirm your email (check your inbox)
3. Sign in at `/login`
4. Start by adding suppliers and products
5. Create projects and purchase orders
6. Track deliveries and quality checks
7. Manage invoices and payments

## User Roles

- **Admin**: Full access to all features
- **Buyer**: Manage suppliers, orders, and projects
- **Inventory Manager**: Manage products and stock levels
- **Quality Control**: Perform quality inspections
- **Finance**: Manage invoices and payments
- **Supplier**: Limited view of their orders (future feature)

## Security

- All database access is protected by Row Level Security (RLS)
- Authentication required for all app routes
- Role-based permissions at the database level
- Secure session management with Supabase

## Deployment

This application is ready to deploy on Vercel:

1. Click "Publish" in the v0 interface
2. Connect your Supabase project
3. Ensure all environment variables are set
4. Deploy!

## Support

For issues or questions:
- Check the Supabase documentation
- Review the Next.js 16 documentation
- Open a support ticket at vercel.com/help

## License

Built with v0 by Vercel - your BPMN workflow transformed into a production-ready application!
