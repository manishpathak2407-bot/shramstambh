# 💻 Shram Stambh (श्रम स्तंभ) — Code Documentation & Technical Reference

This document provides a complete technical walkthrough of the codebase, data schemas, mathematical algorithms, and accessibility implementations for **Shram Stambh**.

---

## 🏗️ 1. Architecture & Module Responsibilities

The codebase follows a strict **Vanilla Web Architecture** with separation of concerns across presentation, business logic, storage, and accessibility:

```
shramstambh/
│
├── index.html               # Presentation Layer: Semantic HTML5 container with English-first & bracketed Hindi UI
├── css/style.css            # Presentation Layer: CSS3 variables, WCAG AA touch targets (>=48px), @media print
│
├── js/wageTracker.js        # Business Logic: Wage Khata CRUD, balance formulas, statutory auditor matrix
├── js/complaints.js         # Business Logic: Identity sanitization, ticket hashing, contractor vetting
├── js/speech.js             # Accessibility Layer: W3C SpeechSynthesis acoustic narration engine
├── js/app.js                # Controller Layer: Tab routing, modal lifecycles, and toast notifications
│
├── manifest.json            # Deployment: PWA manifest for mobile installation
└── sw.js                    # Deployment: Service Worker for zero-connectivity offline cache
```

---

## 📐 2. Core Mathematical Formulas & Algorithms

### A. Digital Wage Ledger & Balance Engine (`js/wageTracker.js`)

For every daily attendance log, the engine computes:

$$\text{Balance Due} = \max(0, \text{Agreed Daily Wage} - \text{Advance Received})$$

$$\text{Status} = \begin{cases} \text{"Paid"}, & \text{if } \text{Balance Due} = 0 \\ \text{"Due"}, & \text{if } \text{Balance Due} > 0 \end{cases}$$

Aggregate financial metrics computed across all active records:

$$\text{Total Wages Earned} = \sum_{i=1}^n \text{Wage}_i$$

$$\text{Total Advance Received} = \sum_{i=1}^n \text{Advance}_i$$

$$\text{Net Outstanding Dues} = \sum_{i=1}^n \text{Balance}_i$$

---

### B. Statutory Wage Auditor & Wage Theft Derivation (`js/wageTracker.js`)

Cross-validates contractor wage offers against official state statutory minimum floors ($F_{\text{state, skill}}$):

$$\Delta = F_{\text{state, skill}} - W_{\text{offered}}$$

$$\text{Violation Status} = \begin{cases} \text{BREACH (Wage Theft Detected)}, & \text{if } \Delta > 0 \\ \text{COMPLIANT}, & \text{if } \Delta \le 0 \end{cases}$$

When a breach is detected, the engine calculates the compounding financial deprivation:

$$\text{Daily Deprivation} = \Delta$$

$$\text{Monthly Wage Theft (26 Working Days)} = \Delta \times 26$$

$$\text{Annual Deprivation (312 Working Days)} = \Delta \times 312$$

---

### C. Cryptographic Whistleblower Ticket Token (`js/complaints.js`)

To guarantee whistleblower anonymity and prevent contractor retaliation, personal identity keys (`name`, `phone`, `IP`) are completely stripped from the JSON payload when "Keep Identity 100% Anonymous" is checked.

The system issues an isolated alphanumeric tracking token:

$$\text{Ticket ID} = \text{"#SH-"} + \lfloor 1000 + \text{random}() \times 9000 \rfloor$$

This token is stored as the primary lookup key, allowing workers to track enforcement dispatch without ever revealing their personal identity.

---

## 💾 3. Data Schemas & Client-Side Persistence

All data is structured in clean JSON schemas and persisted client-side via the HTML5 `localStorage` API (zero cloud server cost, ₹0 maintenance):

### 1. Wage Record Schema (`shram_wage_records`)
```json
{
  "id": "REC-2026-001",
  "date": "2026-10-28",
  "contractor": "Ramesh Thekedar",
  "site": "Apex Tower 4, Sector 62",
  "role": "Mason (राजमिस्त्री)",
  "wage": 750,
  "advance": 200,
  "balance": 550,
  "status": "Due",
  "notes": "Full day mason work, plastering block B"
}
```

### 2. Whistleblower Grievance Schema (`shram_grievance_records`)
```json
{
  "ticketId": "#SH-9042",
  "date": "2026-10-26",
  "contractor": "Apex Tower 4 Site Thekedar",
  "location": "Sector 62, Noida, UP",
  "category": "wage_theft",
  "categoryText": "Wage Theft / Slashed Pay (मजदूरी चोरी)",
  "description": "15 days unpaid wages for 22 construction workers.",
  "anonymous": true,
  "workerName": "Anonymous Worker (पहचान गुप्त)",
  "contact": "HIDDEN_BY_SANITY_ENGINE",
  "status": "notice_issued",
  "statusText": "Show-Cause Notice Issued to Contractor",
  "officerNotes": "Sub-Divisional Labour Commissioner dispatched compliance officer.",
  "updatedAt": "2026-10-27T14:30:00"
}
```

### 3. Contractor Vetting Schema (`shram_contractor_reviews`)
```json
{
  "id": "CON-01",
  "name": "Ramesh Thekedar",
  "trade": "Civil Masonry & Plastering",
  "city": "Noida / Delhi NCR",
  "rating": 4.2,
  "reviewsCount": 38,
  "timelyPayRate": "92%",
  "safetyScore": "B+",
  "verified": true,
  "badgeText": "Verified Contractor (सत्यापित ठेकेदार)",
  "topFeedback": "Pays weekly advance promptly."
}
```

---

## 🔊 4. Low-Literacy Acoustic Narration (`js/speech.js`)

Implements the native W3C SpeechSynthesis API with Indian locale voice filtering (`en-IN` / `hi-IN`):

```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'en-IN';
utterance.rate = 0.95; // Slightly slower cadence for clear field comprehension
window.speechSynthesis.speak(utterance);
```

Provides auditory access across all 4 major views so workers who face reading literacy challenges can hear their legal rights, balance calculations, and grievance updates read aloud.

---

## 🖨️ 5. CSS Print Engine (`css/style.css`)

Utilizes `@media print` rules to convert client screen states directly into admissible paper evidence:

* Hides web UI controls, navigation docks, and buttons (`display: none !important;`).
* Centers the `.slip-container` with sharp black borders (`border: 2px solid #000;`).
* Formats employee/employer signature sections and embedded SVG QR codes for physical submission to local District Labour Officers.

---

## 🚀 6. Offline PWA Service Worker (`sw.js`)

Implements a Cache-First runtime strategy:
1. `install` event pre-caches core markup, CSS, JS, and manifest.
2. `fetch` event intercepts network requests and serves cached resources when offline at remote construction sites.
3. Fallback routing automatically serves `index.html` during offline navigation.
