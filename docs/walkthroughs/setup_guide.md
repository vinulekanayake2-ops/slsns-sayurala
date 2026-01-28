# SLNS Sayurala Quiz App - Setup Guide for New PC

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Git** (optional, for version control)
   - Download from [git-scm.com](https://git-scm.com/)

3. **Code Editor** (recommended: VS Code)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Setup Steps

### 1. Copy Project Files
Copy the entire `slns-sayurala` folder to your new PC.

### 2. Install Dependencies
Open terminal in the project folder and run:
```bash
npm install
```

This will install all required packages including:
- Next.js
- Prisma
- Framer Motion
- Lucide React
- And other dependencies

### 3. Set Up Database

#### Initialize Database
```bash
npx prisma generate
npx prisma db push
```

This creates the SQLite database file at `prisma/dev.db` with all required tables.

#### Seed Initial Data
```bash
npx prisma db seed
```

This creates:
- Admin user (Official ID: `ADMIN`)
- Module data (Module 1, Module 2, Module 3)
- Sample quiz questions

> [!NOTE]
> If seeding fails, check that `prisma/seed.ts` exists and is properly configured in `package.json`.

### 4. Verify Database Setup
Open Prisma Studio to inspect the database:
```bash
npx prisma studio
```

Navigate to `http://localhost:5555` and verify:
- ✅ User table has ADMIN user
- ✅ ActiveSession table exists with all fields
- ✅ QuizAttempt table exists
- ✅ Questions are loaded (if using database-stored questions)

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 6. Test the Application

#### Test User Login
1. Navigate to `http://localhost:3000`
2. Enter any Official ID and Name
3. Click "Begin Assessment"
4. Verify you reach the Module Selection page

#### Test Admin Dashboard
1. Navigate to `http://localhost:3000/admin/login`
2. Click "Access Dashboard"
3. Verify the dashboard loads with:
   - Personnel Status table
   - Live Monitor section
   - Assessment Logs section

#### Test Quiz Flow
1. Log in as a user
2. Select a module
3. Verify quiz interface loads with:
   - 60-minute timer
   - Question navigation
   - Info block (question status)
4. Answer some questions
5. Submit quiz
6. Verify results are saved

#### Test Real-time Monitoring
1. Open two browser windows
2. Window 1: Log in as user and start a quiz
3. Window 2: Open Admin Dashboard → Live Monitor
4. Navigate through questions in Window 1
5. Verify Window 2 updates progress every 3 seconds

## Troubleshooting

### Port Already in Use
If port 3000 is occupied:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in package.json
"dev": "next dev -p 3001"
```

### Database Locked Error
If you get "database is locked":
1. Close Prisma Studio
2. Stop the dev server
3. Run migration again: `npx prisma db push`
4. Restart dev server

### Migration Errors
If schema changes don't apply:
```bash
# Stop all services
# Then run:
npx prisma db push --force-reset
npx prisma db seed
```

> [!WARNING]
> `--force-reset` will delete all data. Only use for fresh setup.

### Missing Dependencies
If you get module not found errors:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Network Access (Optional)

To access the app from other devices on your network:

1. Find your local IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Access from other devices:
   ```
   http://YOUR_IP:3000
   ```

> [!IMPORTANT]
> The app uses `secure: false` for cookies in development to allow local IP access. For production, set `secure: true` and use HTTPS.

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create `.env.production`:
```env
DATABASE_URL="file:./prod.db"
NODE_ENV="production"
```

### Security Checklist
- [ ] Change cookie `secure` flag to `true` in [`app/actions.ts`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/app/actions.ts)
- [ ] Set up HTTPS
- [ ] Change admin credentials
- [ ] Enable CORS restrictions
- [ ] Set up proper database backup

## File Structure Reference

```
slns-sayurala/
├── app/
│   ├── actions.ts          # Server actions (login, quiz, admin)
│   ├── admin/              # Admin routes
│   ├── modules/            # Module selection
│   └── quiz/               # Quiz interface
├── components/
│   └── QuizInterface.tsx   # Main quiz component
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed data
│   └── dev.db              # SQLite database (created after setup)
├── lib/
│   └── questions.ts        # Question data (if file-based)
└── middleware.ts           # Route protection
```

## Next Steps

After setup is complete:
- Review [`questions_guide.md`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/docs/walkthroughs/questions_guide.md) to learn how to update quiz questions
- Customize modules and questions for your needs
- Configure admin credentials
- Test all features thoroughly before deployment
