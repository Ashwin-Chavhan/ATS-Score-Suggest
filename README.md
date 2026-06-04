# 🚀 ATS Tracker — AI-Powered Resume Optimizer

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?style=flat-square)
![AI](https://img.shields.io/badge/AI-GPT%20Powered-purple?style=flat-square)
![Full Stack](https://img.shields.io/badge/full--stack-React%20%2B%20Node.js-0A66C2?style=flat-square)

---

## 📌 Overview

ATS Tracker is a full-stack AI-powered resume optimization tool that evaluates how well a resume matches a job description.

It simulates ATS (Applicant Tracking System) behavior and generates:

- ATS compatibility score (0–100)
- Matching keywords
- Missing keywords
- Actionable improvement suggestions

---

## ✨ Features

- 📊 ATS scoring engine (0–100)
- 🔍 Keyword matching & gap detection
- 🧠 AI-powered resume analysis
- 💡 Actionable suggestions
- 📚 Scan history stored in PostgreSQL
- ⚡ Fast structured JSON responses
- 📱 Responsive modern UI

---

## 🧰 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui + Radix UI
- Framer Motion
- TanStack Query
- Wouter
- React Hook Form + Zod

### Backend
- Node.js + Express 5
- TypeScript
- OpenAI API (GPT-based analysis)
- Drizzle ORM
- PostgreSQL
- Zod validation

---

## 📁 Folder Structure

```

.
├── client/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── App.tsx
│
├── server/
│   ├── db.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── index.ts
│
├── shared/
│   ├── schema.ts
│   └── routes.ts
│
├── drizzle.config.ts
└── package.json

````

---

## 🔌 API Endpoints

### Get all scans
```http
GET /api/scans
````

### Get scan by id

```http
GET /api/scans/:id
```

### Create new scan

```http
POST /api/scans
```

### Request Body

```json
{
  "resumeText": "Resume content here...",
  "jobDescription": "Job description here..."
}
```

### Response

```json
{
  "score": 82,
  "analysis": {
    "matchingKeywords": ["React", "Node.js"],
    "missingKeywords": ["Docker", "CI/CD"],
    "suggestions": ["Add deployment experience"]
  }
}
```

---

## 🧠 How It Works

* User submits resume and job description
* Input is validated using shared Zod schema
* AI model analyzes compatibility using structured prompt
* Response is returned in strict JSON format
* Backend validates and stores result in PostgreSQL
* Frontend displays score and insights

---

## 📊 Score Interpretation

| Score Range | Meaning           |
| ----------- | ----------------- |
| 80–100      | Excellent match   |
| 60–79       | Good match        |
| 40–59       | Needs improvement |
| 0–39        | Poor match        |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL database

### Installation

```bash
npm install
npm run db:push
npm run dev
```

App runs at:

```
http://localhost:5000
```

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

```env
DATABASE_URL=your_postgres_url
OPENAI_API_KEY=your_api_key
```

---

## 🏆 Highlights

* Full-stack AI SaaS-style application
* Real ATS simulation system
* Structured AI output (not raw text)
* Shared type-safe architecture
* Scalable backend design
* Production-ready project structure

---

## 📄 License

MIT

```

---

If you want next upgrade, I can turn this into:
- 🔥 “FAANG-level README (extremely impressive for recruiters)”
- 💼 Resume bullet points from this project
- 🚀 SaaS landing page style README (very high conversion)
- 🧠 Or add “live demo + deployment section” for portfolio boost
```
