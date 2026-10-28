# SHRAM STAMBH (श्रम स्तंभ) — Comprehensive Viva Voce Preparation Guide
### Maximum Marks: 10 Marks | Academic Task 26271

This guide prepares all team members to confidently ace the technical viva examination before the university evaluation panel.

---

## 🎯 1. Problem Statement & Motivation
* **Question:** What specific problem did your team choose, and why is existing software inadequate?
* **Model Answer:**
  > "We addressed the chronic vulnerabilities of India's 450+ million informal migrant laborers working under informal thekedars (labor contractors). Existing solutions are either English-heavy, require complex cloud accounts, or don't operate on budget smartphones at construction sites. We built Shram Stambh—a zero-cost, high-reliability, client-side welfare web application providing a digital daily wage ledger (Khata), statutory wage auditing, contractor vetting, and an anonymous whistleblower reporting system."

---

## 💻 2. Technical Stack & Architectural Decisions
* **Question:** Why didn't you use React, Angular, or a backend database like Node/MongoDB?
* **Model Answer:**
  > "Our design follows an engineering defense centered on the real end-user:
  > 1. **Zero External Overhead (0 KB Bundle):** React adds 140KB+ of script parsing. Migrant workers on 2G/3G connections need instant cold boot (<150ms).
  > 2. **₹0 Operating & Server Cost:** Unorganized sector workers cannot maintain paid server subscriptions. A purely client-side architecture runs forever on free static CDNs like GitHub Pages.
  > 3. **Offline Field Persistence:** Construction sites frequently have zero connectivity. Browser `localStorage` and Service Worker caching allow workers to record wages offline without network interruptions."

---

## 🔊 3. Low-Literacy Accessibility & Speech Engine
* **Question:** How does the app assist illiterate or semi-literate workers?
* **Model Answer:**
  > "We implemented a two-fold accessibility layer:
  > 1. **Icon-First UI & Minimum 48px Touch Targets:** Every button has clear visual cues and exceeds WCAG AA sizing for thumb-friendly interaction.
  > 2. **W3C SpeechSynthesis Integration (`js/speech.js`):** We integrated the browser's native speech synthesis engine configured to the `hi-IN` (Hindi-India) locale. Any worker can tap the 'सुनिए (Listen)' speaker button on any card or alert, and the device speaks the explanation in clear Hindi with ₹0 external API costs."

---

## ⚖️ 4. Statutory Wage Auditor & Business Logic
* **Question:** How does your Statutory Wage Auditor work mathematically?
* **Model Answer:**
  > "The auditor cross-checks the user's offered wage against statutory state minimum wage matrices (compiled for states like Delhi, Maharashtra, Punjab, UP, Bihar, etc.) across 4 skill tiers: Unskilled, Semi-skilled, Skilled, and Highly Skilled.
  > If `Offered Wage < Legal Minimum Wage`:
  > - Daily Underpayment = Legal Rate - Offered Rate
  > - Monthly Underpayment = Daily Loss × 26 working days
  > - Annual Deprivation = Daily Loss × 312 working days
  > It triggers an immediate high-contrast Wage Theft Alert, citing the Minimum Wages Act 1948 and BOCW Act 1996, and provides a direct 1-tap call to National Labour Helpline 14434."

---

## 🛡️ 5. Anonymity & Whistleblower Engine
* **Question:** How do you guarantee the worker's identity isn't leaked to contractors?
* **Model Answer:**
  > "In `js/complaints.js`, when 'मेरी पहचान 100% गुप्त रखें' is selected, the client-side sanitizer completely strips identifying keys (name, phone, IP) before writing to the ledger. It issues an isolated cryptographic ticket hash (e.g., `#SH-9042`). Workers track dispute progress safely using only this ticket token without fearing contractor retaliation or blacklisting."

---

## 🖨️ 6. Physical Paper Evidence
* **Question:** Can digital records be used in legal disputes?
* **Model Answer:**
  > "Yes. We implemented a dedicated CSS `@media print` engine. Clicking 'पर्ची (Slip)' generates a legally formatted physical balance slip complete with worker and thekedar identifiers, agreed daily rates, net outstanding dues, signature lines, and an authentic QR code verification hash that workers can print and submit to local labor enforcement officers."

---

## 💡 Quick Tips for Viva Day
1. **Open the App in Chrome:** Have `index.html` open in full screen.
2. **Demonstrate Speech Synthesis:** Click the "🔊 सुनिए" button so the examiner hears Hindi voice feedback live.
3. **Show Wage Theft Alert:** Enter Delhi + Unskilled + ₹500 offered wage; trigger the red Wage Theft alert showing ₹250/day loss.
4. **Show Slip Modal:** Click "पर्ची" on Ramesh Thekedar's record to display the printable voucher.
5. **Show Inspector Mode:** Click "👔 श्रम अधिकारी डैशबोर्ड" to show the administrative view.
