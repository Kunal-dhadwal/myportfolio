# 🚀 Animated Portfolio Website

A full-stack animated portfolio/resume platform with admin dashboard. Built with React.js, Node.js, Express, and MongoDB.

---

## ✨ Features

- **Animated Hero** – Particle canvas, typing animation, parallax orbs
- **Projects Gallery** – Category filter, carousel, search, detail pages
- **Experience Timeline** – Animated work history with tech stacks
- **Certificates Gallery** – Image cards with verification links
- **Contact Form** – Sends email to admin + auto-reply to visitor
- **Admin Dashboard** – Full CRUD for all portfolio data
- **JWT Auth** – Secure admin login with bcrypt password hashing
- **Cloudinary Uploads** – Images, videos, documents via API
- **Analytics** – Dashboard with view counts, contact stats, charts
- **Activity Logs** – Track admin login/logout/actions
- **SEO Ready** – react-helmet-async dynamic metadata
- **Mobile Responsive** – Tailwind CSS utility-first responsive design

---

## 🗂 Project Structure

```
portfolio/
├── backend/
│   ├── src/
│   │   ├── config/         # DB + Cloudinary config
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth + error handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   └── utils/          # Logger, seed script
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/     # Layout + shared components
│       ├── pages/          # Route pages (public + admin)
│       ├── services/       # Axios API layer
│       ├── store/          # Redux Toolkit slices
│       └── styles/         # Tailwind globals
└── package.json            # Root monorepo scripts
```

---

## ⚙️ Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or [MongoDB Atlas](https://cloud.mongodb.com))
- **Cloudinary** account (free tier works)
- **Gmail** account with App Password (for email)

---

## 🛠 Local Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd portfolio
npm install          # installs root + both workspaces
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

# Cloudinary (get from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (use App Password, NOT your real password)
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM=Portfolio Contact <yourname@gmail.com>

# Admin credentials for seeder
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@1234

NODE_ENV=development
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- Admin user (`admin@portfolio.com` / `Admin@1234`)
- Sample profile, 17 skills, 2 educations, 2 experiences, 3 projects, 2 certificates

### 4. Run development servers

From the **root** directory:

```bash
npm run dev
```

This runs both frontend (port 3000) and backend (port 5000) concurrently.

Or run separately:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### 5. Open the app

- **Portfolio**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
  - Email: `admin@portfolio.com`
  - Password: `Admin@1234`

---

## 📧 Gmail App Password Setup

1. Go to [Google Account → Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a password for "Mail" → "Other (custom name)"
5. Use that 16-character password as `EMAIL_PASS`

---

## ☁️ Deployment

### Option A – Render (recommended free tier)

#### Backend

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add all environment variables from `.env.example`
5. Set `NODE_ENV=production`

#### Frontend

1. Create a new **Static Site** on Render
2. Set:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
3. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend.onrender.com`

Update `frontend/src/services/api.js` baseURL to use env var:
```js
baseURL: process.env.REACT_APP_API_URL || "/api",
```

---

### Option B – Railway

1. Create a project on [Railway](https://railway.app)
2. Add a MongoDB service (or use Atlas)
3. Deploy backend as a Node.js service
4. Set environment variables in Railway dashboard
5. Deploy frontend to Vercel or Netlify

---

### Option C – VPS (Ubuntu)

```bash
# Install Node + PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# Install MongoDB
# Follow: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

# Clone project
git clone <your-repo> /var/www/portfolio
cd /var/www/portfolio

# Build frontend
cd frontend
npm install
npm run build

# Configure backend
cd ../backend
cp .env.example .env
# Edit .env with production values

# Serve frontend from backend (already configured in server.js for production)
# Copy build to backend public folder
cp -r ../frontend/build ./public

# Start with PM2
pm2 start src/server.js --name portfolio
pm2 save
pm2 startup

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/portfolio
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔧 Customization

### Update personal data

1. Login to admin: `/admin/login`
2. Go to **Profile** → Update your name, title, bio, social links
3. Go to **Projects** → Add your real projects
4. Go to **Experience** → Add work history
5. Go to **Skills** → Update your tech stack
6. Go to **Certificates** → Add certifications

### Change theme color

In admin **Profile** → Theme Settings → pick your primary color.

Or edit `frontend/tailwind.config.js`:
```js
colors: {
  primary: {
    500: "#your-color",
    // ...
  }
}
```

### Add new admin pages

1. Create `frontend/src/pages/admin/AdminYourPage.jsx`
2. Add route to `App.js`
3. Add nav item to `AdminLayout.jsx`
4. Create backend route + controller + model

---

## 📦 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/change-password` | ✅ | Change password |
| GET | `/api/profile` | ❌ | Get public profile |
| PUT | `/api/profile` | ✅ | Update profile |
| GET | `/api/projects` | ❌ | List projects (paginated) |
| GET | `/api/projects/grouped` | ❌ | Projects grouped by category |
| GET | `/api/projects/:id` | ❌ | Get project + increment views |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/experiences` | ❌ | List experiences |
| GET | `/api/education` | ❌ | List education |
| GET | `/api/skills` | ❌ | List skills + grouped |
| GET | `/api/certificates` | ❌ | List certificates |
| POST | `/api/contacts` | ❌ | Submit contact form |
| GET | `/api/contacts` | ✅ | List contacts (admin) |
| POST | `/api/uploads/image` | ✅ | Upload image to Cloudinary |
| POST | `/api/uploads/video` | ✅ | Upload video |
| GET | `/api/analytics/dashboard` | ✅ | Dashboard analytics |

---

## 🛡 Security

- JWT tokens with 7-day expiry
- bcrypt password hashing (salt rounds: 12)
- Helmet.js security headers
- Rate limiting: 100 requests / 15 minutes
- CORS restricted to `CLIENT_URL`
- Admin-only middleware on all write endpoints
- Input validation via Mongoose schema validators

---

## 📄 License

MIT — free to use for personal portfolios.

---

## 🙏 Credits

Built with: React, Tailwind CSS, Framer Motion, Express.js, MongoDB, Cloudinary, Nodemailer.
