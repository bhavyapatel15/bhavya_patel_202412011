Overview
A minimal production-ready full-stack e-commerce sample implementing required features for the exam. Backend is Node.js/Express with Prisma (PostgreSQL) for relational data and Mongoose (MongoDB) for product catalog. Frontend is Next.js (App Router) with TypeScript and Tailwind CSS.

Key features
- JWT authentication with bcrypt password hashing
- Role-based access control (admin/customer)
- Product CRUD stored in MongoDB with server-side sorting, filtering and pagination
- Checkout writes orders and order_items to SQL (Prisma schema provided)
- Reports page with one SQL aggregation and one MongoDB aggregation
- One Jest test validating server-side sorting logic

ScreenShots:

Customer Side:

<img width="1907" height="916" alt="Screenshot 2025-10-22 222912" src="https://github.com/user-attachments/assets/af54dead-0af8-495a-bea4-a0471284ba39" />
<img width="1912" height="919" alt="Screenshot 2025-10-22 223007" src="https://github.com/user-attachments/assets/e7887199-3051-4299-959b-2d3bea216847" />
<img width="1919" height="921" alt="Screenshot 2025-10-22 223023" src="https://github.com/user-attachments/assets/22cf61e1-c56b-4cbe-beed-398685be0046" />
<img width="1911" height="917" alt="Screenshot 2025-10-22 223047" src="https://github.com/user-attachments/assets/a67733e0-5e11-4d9f-929f-e5c15766ad95" />
<img width="1914" height="916" alt="Screenshot 2025-10-22 223106" src="https://github.com/user-attachments/assets/0616cfd7-1cbc-4a94-aec1-7e8468edcafc" />
<img width="1916" height="921" alt="Screenshot 2025-10-22 223116" src="https://github.com/user-attachments/assets/54e749a6-4e04-448c-a9ca-d68b240954ee" />


Admin Side:

<img width="1919" height="921" alt="Screenshot 2025-10-22 223223" src="https://github.com/user-attachments/assets/c461f9a1-8e56-4eb1-9805-b2fa88f1a413" />
<img width="1915" height="929" alt="Screenshot 2025-10-22 223242" src="https://github.com/user-attachments/assets/022d200a-b477-4bfc-a8cf-76fe702b71cf" />
<img width="1911" height="922" alt="Screenshot 2025-10-22 223252" src="https://github.com/user-attachments/assets/9d0bfa24-0e44-44a9-87e5-3bc190248e3f" />


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
- Admin credentials (local): admin@gmail.com / 123456
- Customer credentials (local): bhavya123@example.com / 123456
- Frontend NEXT_PUBLIC_API_URL must point to backend base URL.
