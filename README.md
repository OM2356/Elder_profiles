# Buddy AI Agents: AI-Powered Educational Assistant for Elderly Users

A patient, accessible AI tutor and educational assistant designed specifically for older adults. It implements a complete, end-to-end verified teaching workflow:

```
ELDERLY USER
     ↓
ACCESSIBLE FRONTEND
     ↓
VOICE / TEXT INPUT
     ↓
BUDDY AGENT — GEMINI LLM
     ↓
SAFETY AND PROMPT PROCESSING
     ↓
EDUCATIONAL RAG
     ↓
VERIFIED ANSWERS
     ↓
SIMPLE EXPLANATIONS
     ↓
GOOD / OKAY / NOT GOOD FEEDBACK
     ↓
DATABASE
     ↓
ADAPTATION SYSTEM
```

---

## 1. Architecture & Core Pages

### 1. Home / Welcome (`tabHome`)
- Introduces Buddy in simple, warm language.
- Highlights what Buddy can help with.
- Prominent **"Start Learning with Buddy"** action that launches the AI Chat.
- Direct shortcuts to all 7 core educational topics.

### 2. AI Chat (`tabChat`)
- Full conversational interface supporting both typed queries and voice input.
- Real-time response generation with Gemini 3.8 Flash, grounded in retrieved educational materials.
- Action controls: **Send**, **Explain More Simply**, **Repeat Instructions**, **Stop Voice**, and **New Chat**.
- Citations accordion displaying the exact verified sources used.
- Rating controls (`Good 😊`, `Okay 😐`, `Not Good 🙁`) with optional feedback notes.

### 3. Learning Topics (`tabGuides`)
- Instant keyword search and category filtering for the 7 core senior tech areas:
  1. *Smartphone Basics*
  2. *Internet & Wi-Fi*
  3. *WhatsApp & Messaging*
  4. *Email & Video Calling*
  5. *Online Fraud Awareness*
  6. *Digital Payments & Privacy*
  7. *Accessibility Settings*
- Interactive "Practice with Buddy" buttons.

### 4. Progress Dashboard (`tabProgress`)
- Personal milestone dashboard tracking real recorded user activity:
  - Total questions asked.
  - Topics visited and mastered out of 7.
  - Overall percentage completion bar.
  - Helpful answers count.
  - Interactive topic checklist.

### 5. Specialist Agents & Safety Architecture (`tabAgents`)
Coordinated network of 7 specialist agents:
1. **Learning Agent:** Explains everyday technology and basic smartphone operations.
2. **Safety Agent:** Identifies scam, phishing, OTP theft, and remote-access risks.
3. **Communication Agent:** Guides messaging, WhatsApp voice notes, and video calls.
4. **Accessibility Agent:** Assists with font sizing, display zoom, high contrast, and screen clarity.
5. **Support Agent:** Provides patient, calming reassurance when users feel confused.
6. **Verification Agent:** Evaluates factual grounding against retrieved documents.
7. **Feedback Agent:** Processes feedback ratings to drive adaptive teaching.

### 6. Protected Administration Dashboard (`tabDashboard`)
- Protected by passkey authentication (`admin123` by default).
- Recharts visualizations:
  - **Feedback Distribution (Pie Chart):** Real user sentiment across Good, Okay, and Not Good.
  - **Language Usage (Bar Chart):** Real interaction counts across English, Hindi, and Marathi.
- Telemetry: RAG retrieval hit rate, verification status breakdown, and response latency.
- Dynamic Document Ingestion: Form allowing authorized researchers to ingest new Markdown/TXT educational content directly into the vector search engine.
- Data export (JSON dump) and history reset controls.

### 7. User Preferences Modal
- Language switcher: **English**, **हिन्दी (Hindi)**, **मराठी (Marathi)**.
- Text sizing: **Normal (16px)**, **Large (19px)**, **Extra Large (22px)**.
- Voice reading speed slider (0.7x to 1.1x).
- Explanation style: Standard vs. Ultra-Simple.
- Save, reset, and delete preference controls.

---

## 2. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & service status (DB, RAG, Gemini) |
| `POST` | `/api/chat` | Main pipeline: Safety → RAG → Gemini → Verification → DB |
| `POST` | `/api/simplify` | Simplifies previous answer using everyday analogies |
| `POST` | `/api/repeat` | Recaps and repeats previous instructions |
| `POST` | `/api/feedback` | Submits Good / Okay / Not Good rating + notes |
| `GET` | `/api/topics` | Lists all 7 educational topics with keyword search |
| `GET` | `/api/progress/:participantId` | Returns learning topic progress for participant |
| `POST` | `/api/progress` | Marks topic as visited or completed |
| `GET` | `/api/preferences/:participantId`| Retrieves persistent user preferences |
| `POST` | `/api/preferences` | Updates persistent user preferences |
| `DELETE`| `/api/preferences/:participantId`| Deletes user preferences |
| `POST` | `/api/documents/ingest` | Ingests new educational document into RAG engine |
| `GET` | `/api/summary` | Aggregated analytics & research metrics |
| `GET` | `/api/interactions` | Returns interaction audit log |
| `GET` | `/api/export` | Downloads JSON telemetry database dump |
| `POST` | `/api/reset` | Clears all telemetry records |

---

## 3. Running & Testing Locally

```bash
# Install dependencies
npm install

# Run automated test suite (14 checks, 25 assertions)
npm test

# Start the full-stack development server on port 3000
npm run dev

# Build for production
npm run build
```

The application runs on `http://0.0.0.0:3000`.

### Environment Configuration (`.env`)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```
*(If no API key is set, Buddy functions seamlessly in demo/fallback mode using built-in specialist agent knowledge).*
