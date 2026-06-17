# 📄 EasyPDF v2.0
> **Production-Grade AI Document Intelligence Platform**
> 
> *Stop reading endless pages. Extract uncompromised, structured, high-fidelity intelligence in seconds.*
>
> Built by **[Anuvansh Chaudhary](mailto:anuvanshchaudhary8755@gmail.com)**. If you are a technical recruiter or engineering manager, check out the [Engineering Highlights](#-engineering-highlights-why-this-was-built-this-way) and [Let's Connect](#-lets-connect-hiring-managers--recruiters) sections below!

---

## ⚡ Overview
EasyPDF v2.0 is a highly resilient, serverless AI-powered PDF summarization engine built on **Next.js 16 (App Router)** and **React 19**. It features a dual-LLM fallback architecture, hierarchical text chunking, and index-optimized database queries.

The platform is designed around a hard-edged, retro-hacker **Brutalist ("Data Anarchy")** aesthetic, aligning a raw and distraction-free visual design directly with its core utility: stripping away the fluff to deliver rapid, density-optimized document summaries.

---

## 🚀 Key Features

*   **Dual-LLM High-Availability Failover:** Automatic transparent fallback to OpenAI GPT-4o if primary Google Gemini 2.5 Flash API calls fail.
*   **Hierarchical "Map-Reduce" Chunking:** Smart text splitting (8,000-character chunks with 500-character overlap) with intermediate syntheses to prevent context loss in large documents.
*   **Performance-Optimized Rate Limiting:** Pure SQL-based 24-hour rate limit checks running in **< 5ms** directly in Neon serverless PostgreSQL, eliminating the need (and cost) of an external Redis layer.
*   **Image/Scanned PDF Detection:** File content pre-validation to detect unparseable or scanned documents early, saving API compute and user quota.
*   **Stateful Markdown Parser:** Custom React line-by-line renderer designed to parse nested markdown blocks and code syntax without breaking layout components.
*   **Direct-to-Cloud Uploads:** Bypasses Next.js serverless execution timeouts by streaming files (up to 16MB) directly to UploadThing storage.

---

## 🏗️ Tech Stack

| Layer | Technology | Engineering Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.1 (App Router)** | Zero-API-boilerplate Server Actions, App Route handlers, and React Server Components (RSC). |
| **Runtime** | **React 19.2** | State management, dynamic transitions (`useTransition`), and micro-animation rendering. |
| **Auth** | **Clerk** | Secure session authentication intercepted at the Edge via custom middleware. |
| **Storage** | **UploadThing** | Direct client-to-S3 file uploads to protect serverless worker execution limits. |
| **Database** | **Neon PostgreSQL** | Serverless SQL connection pooling over HTTP/WebSockets. |
| **PDF Parsing** | **LangChain & PDFLoader** | Stream-based page extraction and text chunking splitters. |
| **Primary LLM** | **Google Gemini 2.5 Flash** | Low latency, high-throughput model used for primary extraction. |
| **Fallback LLM** | **OpenAI GPT-4o** | Secondary high-reasoning model for automatic API failover recovery. |
| **Styling** | **Tailwind CSS v4** | Custom brutalist "Data Anarchy" styling, Card Tilt grids, and Radix UI primitives. |

---

## 🛠️ Engineering Highlights: Why This Was Built This Way

### 1. Dual-LLM Resiliency Engine (Failover)
To build a production-grade system, API outages must be treated as inevitable. EasyPDF implements a custom retry loop with exponential backoff on Gemini. If the third retry fails, the pipeline transitions immediately to OpenAI GPT-4o. Both engines implement the identical prompts and constraint interface contracts, making the transition completely transparent to the user.

```mermaid
sequenceDiagram
    participant Pipeline as upload-actions.ts
    participant Gemini as Gemini API (2.5-flash)
    participant OpenAI as OpenAI API (gpt-4o)

    Pipeline->>Gemini: Attempt 1/3 (0s delay)
    Gemini-->>Pipeline: Rate Limit / Outage
    Note over Pipeline: Catch error, wait 1000ms
    Pipeline->>Gemini: Attempt 2/3 (1s delay)
    Gemini-->>Pipeline: Timeout
    Note over Pipeline: Catch error, wait 2000ms
    Pipeline->>Gemini: Attempt 3/3 (2s delay)
    Gemini-->>Pipeline: API Unavailable
    
    rect rgb(245, 245, 245)
        Note over Pipeline: Trigger Fallback Engine
        Pipeline->>OpenAI: Request GPT-4o Summary
        OpenAI-->>Pipeline: Returns formatted Markdown
    end
    Note over Pipeline: Save Summary to Neon DB & Redirect
```

### 2. Hierarchical Summarization Pipeline
Large PDFs often suffer from **"lost in the middle"** syndrome where LLMs ignore intermediate pages. EasyPDF uses a recursive map-reduce architecture:
1. LangChain parses text page-by-page.
2. A recursive text splitter chunks text into 8,000 characters with 500-character overlap (to preserve sentence integrity).
3. If multi-chunk, each chunk is summarized into 2–3 concise bullets.
4. The pipeline merges all intermediate summaries and runs a final synthesis prompt to generate a structured, three-section dashboard summary.

### 3. Serverless-Friendly SQL Rate Limiting
Instead of hosting or paying for a Redis cluster (Upstash/Redis Labs) to prevent user API abuse, EasyPDF leverages Neon PostgreSQL’s speed. A highly optimized, index-supported SQL query checks the user's summary submissions in the past 24 hours:
```sql
CREATE INDEX idx_pdf_summaries_user_id_created_at 
ON pdf_summaries(user_id, created_at DESC);
```
By querying an indexed compound key, rate-limit evaluation finishes in **under 5ms** on the database server, keeping the application fast and cost-free.

---

## 📂 System Architecture

```
                  ┌──────────────────────┐
                  │   User Browser UI    │◄─────────────────────────────┐
                  └──────────┬───────────┘                              │
                             │ Drop PDF File                            │
                             ▼                                          │
                  ┌──────────────────────┐                              │
                  │   UploadThing Cloud  │                              │
                  └──────────┬───────────┘                              │
                             │ File URL & Metadata                      │
                             ▼                                          │
                  ┌──────────────────────┐                              │
                  │  upload-actions.ts   │                              │
                  └──────────┬───────────┘                              │
                             │                                          │
      ┌──────────────────────┴──────────────────────┐                   │
      ▼                                             ▼                   │
┌───────────┐ Read User Session               ┌───────────┐ Read counts │
│ Clerk API │                                 │  Neon DB  │ last 24h    │
└───────────┘                                 └───────────┘             │
      │                                             │                   │
      └──────────────────────┬──────────────────────┘                   │
                             │ Approved?                                │
                             ▼                                          │
                  ┌──────────────────────┐                              │
                  │   LangChain Parser   │                              │
                  └──────────┬───────────┘                              │
                             │ Extract Text (Check >= 200 Chars)        │
                             ▼                                          │
                  ┌──────────────────────┐                              │
                  │ Recursive Splitter   │                              │
                  └──────────┬───────────┘                              │
                             │ 8,000 Char Chunks                        │
                             ▼                                          │
                  ┌──────────────────────┐                              │
                  │ Hierarchical Pass    │ (If multiple chunks)         │
                  └──────────┬───────────┘                              │
                             │ Combined Mini-Briefs                     │
                             ▼                                          │
                  ┌──────────────────────┐                              │
                  │ generateSummary      │                              │
                  └──────────┬───────────┘                              │
                             │                                          │
              ┌──────────────┴──────────────┐                           │
              │ Gemini Primary (3 Retries)  │                           │
              └──────────────┬──────────────┘                           │
                             │                                          │
                     ┌───────┴───────┐                                  │
             [SUCCESS]               [GEMINI_FAILED]                    │
                     │                       │                          │
                     ▼                       ▼                          │
             ┌──────────────┐        ┌──────────────┐                   │
             │ Save to Neon │        │ Fallback LLM │                   │
             └──────┬───────┘        │ (OpenAI GPT) │                   │
                    │                └──────┬───────┘                   │
                    │                       │                           │
                    └────────┬──────────────┘                           │
                             │                                          │
                             ▼                                          │
                  ┌──────────────────────┐                              │
                  │  /summaries/[uuid]   │──────────────────────────────┘
                  │  (SummaryViewer UI)  │ Renders custom brutalist cards
                  └──────────────────────┘
```

---

## ⚙️ Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anuvanshchaudhary/EasyPDF.git
cd EasyPDF
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon PostgreSQL Database
DATABASE_URL=postgresql://user:password@endpoint/dbname?sslmode=require

# UploadThing Token
UPLOADTHING_TOKEN=...

# Gemini API Key (Primary LLM)
GEMINI_API_KEY=...

# OpenAI API Key (Fallback LLM)
OPENAI_API_KEY=sk-...
```

### 3. Initialize Database Schema
Apply the database schema and indexes defined in [schema.sql](file:///c:/Users/anuva/vs/EasyPDF/schema.sql) directly to your Neon PostgreSQL instance:
```bash
# You can use the Neon Console SQL Editor or your local psql client
psql -d $DATABASE_URL -f schema.sql
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your local instance.

---

## 💼 Let's Connect: Hiring Managers & Recruiters

Hi, I'm **Anuvansh Chaudhary**. I build resilient, scale-conscious web applications and AI pipelines. I'm currently looking for new opportunities as a Software Engineer / Full Stack Developer where I can build impactful products.

If you are looking for someone who:
*   Understands how to build resilient systems beyond happy path scenarios (API fallbacks, circuit breakers, proper error state handlers).
*   Designs cost-conscious cloud topologies (avoiding database bloat, structuring efficient SQL queries and compound indexes).
*   Enjoys translating complex concepts into high-performance, polished frontends.

**Let's get in touch:**
*   📧 **Email:** [anuvanshchaudhary8755@gmail.com](mailto:anuvanshchaudhary8755@gmail.com)
*   💻 **GitHub:** [@anuvanshchaudhary](https://github.com/anuvanshchaudhary)
*   💼 **LinkedIn:** [anuvanshchaudhary](https://www.linkedin.com/in/anuvansh-chaudhary9/)