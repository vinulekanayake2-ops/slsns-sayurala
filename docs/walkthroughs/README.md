# SLNS Sayurala Quiz App - Documentation

This folder contains comprehensive guides and walkthroughs for the SLNS Sayurala Quiz Application.

## 📚 Available Guides

### 1. [Setup Guide](./setup_guide.md)
Complete guide for setting up the application on a new PC.

**Contents:**
- Prerequisites and required software
- Step-by-step installation instructions
- Database setup and seeding
- Testing procedures
- Troubleshooting common issues
- Network access configuration
- Production deployment checklist

**Use this when:**
- Setting up the app on a new computer
- Deploying to a new environment
- Troubleshooting installation issues

---

### 2. [Questions Guide](./questions_guide.md)
Comprehensive guide for replacing and managing quiz questions.

**Contents:**
- Three methods for updating questions (code, JSON, database)
- Question structure and templates
- Bulk import from Excel/CSV
- Best practices for question writing
- Verification checklist
- Troubleshooting tips

**Use this when:**
- Adding new quiz questions
- Updating existing questions
- Importing questions from external sources
- Organizing questions by module

---

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Start application
npm run dev
```

### Update Questions
Edit `lib/questions.ts` and replace the `generateQuestions` function with your questions.

---

## 📁 Project Structure

```
slns-sayurala/
├── app/                    # Next.js app directory
│   ├── actions.ts         # Server actions
│   ├── admin/             # Admin dashboard
│   ├── modules/           # Module selection
│   └── quiz/              # Quiz interface
├── components/            # React components
├── docs/                  # Documentation (you are here)
│   └── walkthroughs/     # Setup and usage guides
├── lib/                   # Utilities and helpers
│   └── questions.ts      # Quiz questions
├── prisma/               # Database schema and migrations
└── middleware.ts         # Route protection
```

---

## 🔗 Key Files

- [`app/actions.ts`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/app/actions.ts) - Server actions for login, quiz submission, admin data
- [`components/QuizInterface.tsx`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/components/QuizInterface.tsx) - Main quiz component
- [`lib/questions.ts`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/lib/questions.ts) - Quiz questions data
- [`prisma/schema.prisma`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/prisma/schema.prisma) - Database schema
- [`middleware.ts`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/middleware.ts) - Route protection

---

## 🆘 Need Help?

1. Check the relevant guide above
2. Review the troubleshooting sections
3. Verify your setup matches the requirements
4. Check browser console for errors

---

## 📝 Notes

- The app uses SQLite for the database (stored in `prisma/dev.db`)
- Admin credentials: Access via `/admin/login` (no password required in development)
- Default quiz: 50 questions per module, 60-minute timer
- Real-time monitoring updates every 3 seconds
