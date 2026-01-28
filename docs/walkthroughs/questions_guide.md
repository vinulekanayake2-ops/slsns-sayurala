# Quiz Questions Replacement Guide

## Overview
This guide explains how to replace or update quiz questions in the SLNS Sayurala Quiz App. Questions are currently generated in [`lib/questions.ts`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/lib/questions.ts).

## Current Question Structure

### Question Interface
```typescript
export interface Question {
    id: string;           // Unique identifier
    text: string;         // Question text
    options: string[];    // Array of 4 answer options
    correctIndex: number; // Index of correct answer (0-3)
}
```

## Method 1: Update Questions in Code (Current Method)

### Step 1: Open Questions File
Navigate to [`lib/questions.ts`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/lib/questions.ts)

### Step 2: Replace the `generateQuestions` Function

**Current Implementation** (generates 50 mock questions):
```typescript
export const generateQuestions = (moduleId: string): Question[] => {
    return Array.from({ length: 50 }).map((_, i) => ({
        id: `${moduleId}-q-${i + 1}`,
        text: `Question ${i + 1} for ${moduleId.replace(/-/g, ' ').toUpperCase()}: What is the primary function of component X?`,
        options: [
            "To regulate flow",
            "To increase pressure",
            "To monitor temperature",
            "To secure the deck"
        ],
        correctIndex: Math.floor(Math.random() * 4)
    }));
};
```

**Replace with Real Questions**:
```typescript
export const generateQuestions = (moduleId: string): Question[] => {
    // Define questions for each module
    const questionBank: Record<string, Question[]> = {
        'module-1': [
            {
                id: 'module-1-q-1',
                text: 'What is the capital of France?',
                options: ['London', 'Paris', 'Berlin', 'Madrid'],
                correctIndex: 1
            },
            {
                id: 'module-1-q-2',
                text: 'Which planet is known as the Red Planet?',
                options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
                correctIndex: 2
            },
            // Add 48 more questions to reach 50 total
        ],
        'module-2': [
            {
                id: 'module-2-q-1',
                text: 'What is 2 + 2?',
                options: ['3', '4', '5', '6'],
                correctIndex: 1
            },
            // Add 49 more questions
        ],
        'module-3': [
            {
                id: 'module-3-q-1',
                text: 'Who wrote "Romeo and Juliet"?',
                options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
                correctIndex: 1
            },
            // Add 49 more questions
        ]
    };

    // Return questions for the requested module
    return questionBank[moduleId] || [];
};
```

### Step 3: Save and Test
1. Save the file
2. Restart the dev server (if running)
3. Start a quiz to verify new questions appear

## Method 2: Import Questions from JSON

### Step 1: Create Questions JSON File
Create `lib/questions-data.json`:

```json
{
  "module-1": [
    {
      "id": "module-1-q-1",
      "text": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "correctIndex": 1
    },
    {
      "id": "module-1-q-2",
      "text": "Which planet is known as the Red Planet?",
      "options": ["Venus", "Jupiter", "Mars", "Saturn"],
      "correctIndex": 2
    }
  ],
  "module-2": [],
  "module-3": []
}
```

### Step 2: Update `lib/questions.ts`
```typescript
import questionsData from './questions-data.json';

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
}

export const generateQuestions = (moduleId: string): Question[] => {
    return questionsData[moduleId as keyof typeof questionsData] || [];
};
```

### Step 3: Configure TypeScript
Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

## Method 3: Store Questions in Database (Advanced)

### Step 1: Update Prisma Schema
Add to `prisma/schema.prisma`:

```prisma
model Question {
  id            String   @id @default(cuid())
  moduleId      String
  text          String
  options       String[] // Array of options
  correctIndex  Int
  createdAt     DateTime @default(now())
  
  @@index([moduleId])
}
```

### Step 2: Run Migration
```bash
npx prisma db push
```

### Step 3: Create Seed Script
Update `prisma/seed.ts`:

```typescript
const questions = [
  {
    moduleId: 'module-1',
    text: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctIndex: 1
  },
  // Add more questions
];

for (const question of questions) {
  await prisma.question.create({
    data: question
  });
}
```

### Step 4: Update `generateQuestions` Function
In `lib/questions.ts`:

```typescript
import { prisma } from '@/lib/prisma';

export const generateQuestions = async (moduleId: string): Promise<Question[]> => {
    const questions = await prisma.question.findMany({
        where: { moduleId },
        select: {
            id: true,
            text: true,
            options: true,
            correctIndex: true
        }
    });
    
    return questions;
};
```

### Step 5: Update Quiz Page
Change `app/quiz/[moduleId]/page.tsx` to async:

```typescript
export default async function QuizPage({ params }: { params: { moduleId: string } }) {
    const { moduleId } = params;
    const questions = await generateQuestions(moduleId);
    // Rest of the code
}
```

## Quick Question Template

Use this template for adding new questions:

```typescript
{
    id: 'module-X-q-Y',  // X = module number, Y = question number
    text: 'Your question text here?',
    options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D'
    ],
    correctIndex: 0  // 0=A, 1=B, 2=C, 3=D
}
```

## Best Practices

### Question Writing
- ✅ Keep questions clear and concise
- ✅ Ensure only one correct answer
- ✅ Make distractors (wrong answers) plausible
- ✅ Avoid "all of the above" or "none of the above"
- ✅ Use consistent formatting

### Technical Guidelines
- ✅ Always provide exactly 4 options
- ✅ Use unique IDs for each question
- ✅ Verify `correctIndex` is between 0-3
- ✅ Test questions before deployment
- ✅ Keep backup of original questions

### Module Organization
- **Module 1**: General knowledge or introductory topics
- **Module 2**: Intermediate difficulty
- **Module 3**: Advanced topics

## Bulk Import from Excel/CSV

### Step 1: Prepare CSV File
Create `questions.csv`:

```csv
moduleId,text,option1,option2,option3,option4,correctIndex
module-1,"What is 2+2?","3","4","5","6",1
module-1,"What is the capital of France?","London","Paris","Berlin","Madrid",1
```

### Step 2: Create Import Script
Create `scripts/import-questions.js`:

```javascript
const fs = require('fs');
const csv = require('csv-parser');

const questions = [];

fs.createReadStream('questions.csv')
  .pipe(csv())
  .on('data', (row) => {
    questions.push({
      id: `${row.moduleId}-q-${questions.length + 1}`,
      text: row.text,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctIndex: parseInt(row.correctIndex)
    });
  })
  .on('end', () => {
    fs.writeFileSync(
      'lib/questions-data.json',
      JSON.stringify({ 'module-1': questions }, null, 2)
    );
    console.log('✅ Questions imported successfully!');
  });
```

### Step 3: Run Import
```bash
npm install csv-parser
node scripts/import-questions.js
```

## Verification Checklist

After updating questions:
- [ ] All questions have unique IDs
- [ ] Each question has exactly 4 options
- [ ] `correctIndex` values are valid (0-3)
- [ ] Total of 50 questions per module
- [ ] Questions display correctly in quiz interface
- [ ] Correct answers are properly marked
- [ ] Score calculation works correctly

## Troubleshooting

### Questions Not Appearing
- Check that `moduleId` matches exactly (e.g., 'module-1')
- Verify file is saved and server is restarted
- Check browser console for errors

### Wrong Answers Marked Correct
- Verify `correctIndex` is 0-based (0=first option)
- Check for typos in option text
- Ensure options array order is correct

### TypeScript Errors
- Ensure all required fields are present
- Check that types match the `Question` interface
- Verify JSON syntax if using JSON import

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify the question format matches the interface
3. Test with a small set of questions first
4. Review the [`lib/questions.ts`](file:///c:/Users/dulithaw/Downloads/Quiz/slns-sayurala/lib/questions.ts) file for syntax errors
