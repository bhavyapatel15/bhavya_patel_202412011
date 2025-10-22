Overview
A minimal production-ready full-stack e-commerce sample implementing required features for the exam. Backend is Node.js/Express with Prisma (PostgreSQL) for relational data and Mongoose (MongoDB) for product catalog. Frontend is Next.js (App Router) with TypeScript and Tailwind CSS.

Key features
- JWT authentication with bcrypt password hashing
- Role-based access control (admin/customer)
- Product CRUD stored in MongoDB with server-side sorting, filtering and pagination
- Checkout writes orders and order_items to SQL (Prisma schema provided)
- Reports page with one SQL aggregation and one MongoDB aggregation
- One Jest test validating server-side sorting logic

Tech stack
Backend: Node.js, Express, Prisma (@prisma/client), PostgreSQL (schema provided), MongoDB (Mongoose)
Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
Testing: Jest

Setup
1. Clone or extract the project.
2. Backend:
   - Copy backend/.env.example to backend/.env and set DATABASE_URL and MONGODB_URI and JWT_SECRET.
   - Run `npm install` inside backend.
   - Run `npx prisma migrate deploy` or `npx prisma db push` after configuring DATABASE_URL.
   - Start server with `npm start` or `npm run dev`.
3. Frontend:
   - Copy frontend/.env.local.example to frontend/.env.local and set NEXT_PUBLIC_API_URL to the backend base URL.
   - Run `npm install` inside frontend.
   - Start with `npm run dev`.

Databases and migration
- Prisma schema is available at backend/prisma/schema.prisma and targets PostgreSQL.
- MongoDB models are in backend/models.

Testing
Testing framework used: Jest
Run tests:
cd backend
npm run test
Test description:
This test verifies that the server-side product sorting logic returns descending order by default and supports ascending order via an x-sort header or query parameter.

Deployment
A Vercel config is included at vercel.json for deploying the frontend. The backend can be deployed to any provider that supports Node.js (Render, Railway, Heroku, etc.). Ensure environment variables are configured in the chosen provider.

Admin credentials for evaluation
Login using this credentials to acess Admin benefits:
email: admin@gmail.com
password: 123456

Additional notes:
- Run `cd backend && npm install` to install dotenv and other dependencies.
- Seed databases: `cd backend && npm run seed`.
- Admin credentials (local): admin@example.com / AdminPass123
- Customer credentials (local): customer@example.com / CustomerPass123
- Frontend NEXT_PUBLIC_API_URL must point to backend base URL.
