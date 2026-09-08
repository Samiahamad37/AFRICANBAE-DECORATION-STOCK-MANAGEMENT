# AfricanBae Manager

Full-stack inventory & sales manager for **African Bae** — rebuilt as a single
**Next.js** app (App Router) so it deploys to **Vercel** in one click with a
free **Postgres** database (Neon / Supabase / Vercel Postgres).

> The old Django + React/Vite code is kept in `_archive/` for reference and can
> be deleted once you're happy with the new app.

## Stack

| Concern     | Tech                                             |
| ----------- | ------------------------------------------------ |
| Frontend    | Next.js (React 18), CSS Modules                  |
| Backend     | Next.js API routes (`app/api/*`)                 |
| Database    | Postgres via Prisma ORM                          |
| Auth        | JWT (access 1h / refresh 7d) via `jose`, bcrypt  |
| Images      | Cloudinary                                       |

## Features

- Register / login / logout with JWT refresh
- Change password, forgot-password reset links (24 h expiry)
- Product CRUD with Cloudinary image upload
- Sell & restock with race-safe stock transactions
- Sales history with revenue stats

## Local development

```bash
npm install
cp .env.example .env      # fill in the values
npm run db:push           # create the tables in your Postgres DB
npm run dev               # http://localhost:3000
```

## Environment variables

| Variable                | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `DATABASE_URL`          | Postgres connection string (use the pooled URL on Neon) |
| `JWT_SECRET`            | Long random string (`openssl rand -base64 48`)     |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                              |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                 |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                              |
| `NEXT_PUBLIC_APP_URL`   | Public URL, used in password-reset links           |

## Deploy to Vercel

1. **Database (free):** create a Postgres DB at [neon.tech](https://neon.tech)
   and copy the connection string.
2. Push this repo to GitHub and import it in Vercel.
3. Add all environment variables above in **Vercel → Settings → Environment
   Variables** (`NEXT_PUBLIC_APP_URL` = your `https://<app>.vercel.app` URL).
4. Create the tables once — either:
   - locally: `DATABASE_URL=<neon-url> npx prisma migrate deploy`, **or**
   - change the Vercel build command to
     `prisma generate && prisma migrate deploy && next build`.
5. Deploy. 🎉

## API overview

| Method | Endpoint                                   | Auth | Purpose            |
| ------ | ------------------------------------------ | ---- | ------------------ |
| POST   | `/api/auth/register`                       | –    | Create account     |
| POST   | `/api/auth/login`                          | –    | Get JWT tokens     |
| POST   | `/api/auth/refresh`                        | –    | New access token   |
| POST   | `/api/auth/logout`                         | ✔    | Logout             |
| GET    | `/api/auth/profile`                        | ✔    | Current user       |
| POST   | `/api/auth/change-password`                | ✔    | Change password    |
| POST   | `/api/password-reset`                      | –    | Generate reset link|
| POST   | `/api/password-reset-confirm/:uid/:token`  | –    | Set new password   |
| GET    | `/api/products`                            | –    | List products      |
| POST   | `/api/products`                            | ✔    | Create (multipart) |
| PATCH  | `/api/products/:id`                        | ✔    | Update (multipart) |
| DELETE | `/api/products/:id`                        | ✔    | Delete             |
| POST   | `/api/products/:id/sell`                   | ✔    | Sell quantity      |
| POST   | `/api/products/:id/restock`                | ✔    | Add stock          |
| GET    | `/api/sales`                               | –    | List sales         |

## Migrating old data

The new schema uses clean table names (`User`, `Product`, `Sale`) and bcrypt
password hashing, so old Django rows can't be dropped in directly (Django uses
PBKDF2 hashes). Products/sales can be re-imported with a SQL insert or Prisma
script; users simply register again.
