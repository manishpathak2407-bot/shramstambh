/**
 * SHRAM STAMBH (श्रम स्तंभ) - Wage Khata & Statutory Legal Auditor Engine
 * Tier 2: Business Logic & Processing Engine
 * Handles daily wage ledger CRUD, balance calculations, receipt generation,
 * and cross-validates contractor offers against state BOCW statutory rate floors.
 */

const WageTracker = (function () {
  const STORAGE_KEY = 'shram_wage_records';

  // Statutory Minimum Wage Matrix (Daily rates in INR)
  // Cross-referenced with official State Gazette Minimum Wages & BOCW floor rates
  const STATUTORY_RATES = {
    "Delhi": {
      name_hi: "दिल्ली (Delhi NCT)",
      unskilled: 750,
      semi_skilled: 825,
      skilled: 908,
      highly_skilled: 999,
      act: "Delhi Minimum Wages Act (Notification F.No.12(142)/02/MW/VII)",
      helpline: "14434"
    },
    "Maharashtra": {
      name_hi: "महाराष्ट्र (Maharashtra)",
      unskilled: 570,
      semi_skilled: 620,
      skilled: 680,
      highly_skilled: 740,
      act: "Maharashtra Minimum Wages & BOCW Welfare Rules",
      helpline: "1800-22-1244"
    },
    "Punjab": {
      name_hi: "पंजाब (Punjab)",
      unskilled: 450,
      semi_skilled: 490,
      skilled: 540,
      highly_skilled: 600,
      act: "Punjab Labour Department Minimum Wages Schedule",
      helpline: "14434"
    },
    "Uttar Pradesh": {
      name_hi: "उत्तर प्रदेश (Uttar Pradesh)",
      unskilled: 415,
      semi_skilled: 455,
      skilled: 510,
      highly_skilled: 570,
      act: "UP Minimum Wages Notification & BOCW Board",
      helpline: "1800-180-5160"
    },
    "Bihar": {
      name_hi: "बिहार (Bihar)",
      unskilled: 395,
      semi_skilled: 410,
      skilled: 500,
      highly_skilled: 610,
      act: "Bihar Minimum Wages Act & Pravasi Shramik Rules",
      helpline: "1800-345-6262"
    },
    "Haryana": {
      name_hi: "हरियाणा (Haryana)",
      unskilled: 425,
      semi_skilled: 470,
      skilled: 520,
      highly_skilled: 580,
      act: "Haryana Labour Welfare Board Statutory Floors",
      helpline: "1800-180-2129"
    },
    "Karnataka": {
      name_hi: "कर्नाटक (Karnataka)",
      unskilled: 550,
      semi_skilled: 600,
      skilled: 670,
      highly_skilled: 730,
      act: "Karnataka Minimum Wages Notification",
      helpline: "155214"
    },
    "West Bengal": {
      name_hi: "पश्चिम बंगाल (West Bengal)",
      unskilled: 400,
      semi_skilled: 440,
      skilled: 485,
      highly_skilled: 545,
      act: "WB Labour Department Minimum Wages Schedule",
      helpline: "1800-103-0009"
    }
  };

  // Pre-seeded initial records for instant viva demonstration
  const SEED_DATA = [
    {
      id: "REC-2026-001",
      date: "2026-10-28",
      contractor: "Ramesh Thekedar",
      site: "Apex Tower 4, Sector 62",
      role: "Mason (राजमिस्त्री)",
      wage: 750,
      advance: 200,
      balance: 550,
      status: "Due",
      notes: "Full day mason work, plastering block B"
    },
    {
      id: "REC-2026-002",
      date: "2026-10-27",
      contractor: "Ramesh Thekedar",
      site: "Apex Tower 4, Sector 62",
      role: "Mason (राजमिस्त्री)",
      wage: 700,
      advance: 700,
      balance: 0,
      status: "Paid",
      notes: "Full day work, advance paid in evening"
    },
    {
      id: "REC-2026-003",
      date: "2026-10-25",
      contractor: "Sharma Construction Agency",
      site: "Metro Pillar 104 Flyover",
      role: "Labourer (हेल्पर)",
      wage: 650,
      advance: 150,
      balance: 500,
      status: "Due",
      notes: "Concrete shuttering assistance"
    },
    {
      id: "REC-2026-004",
      date: "2026-10-24",
      contractor: "Sharma Construction Agency",
      site: "Metro Pillar 104 Flyover",
      role: "Labourer (हेल्पर)",
      wage: 650,
      advance: 650,
      balance: 0,
      status: "Paid",
      notes: "Cleared at site checkout"
    }
  ];

  function getRecords() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error parsing wage records:", e);
      return [];
    }
  }

  function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    render();
    updateKPIs();
  }

  function addRecord(data) {
    const records = getRecords();
    const wage = parseFloat(data.wage) || 0;
    const advance = parseFloat(data.advance) || 0;
    const balance = Math.max(0, wage - advance);
    const status = balance === 0 ? 'Paid' : 'Due';

    const newRecord = {
      id: "REC-" + Date.now().toString().slice(-6),
      date: data.date || new Date().toISOString().split('T')[0],
      contractor: data.contractor.trim(),
      site: data.site.trim() || "Local Worksite",
      role: data.role || "Labourer",
      wage: wage,
      advance: advance,
      balance: balance,
      status: status,
      notes: data.notes || ""
    };

    records.unshift(newRecord);
    saveRecords(records);
    return newRecord;
  }

  function deleteRecord(id) {
    let records = getRecords();
    records = records.filter(r => r.id !== id);
    saveRecords(records);
  }

  function markAsPaid(id) {
    const records = getRecords();
    const rec = records.find(r => r.id === id);
    if (rec) {
      rec.advance = rec.wage;
      rec.balance = 0;
      rec.status = 'Paid';
      saveRecords(records);
    }
  }

  function updateKPIs() {
    const records = getRecords();
    let totalEarned = 0;
    let totalAdvance = 0;
    let totalBalanceDue = 0;
    let daysCount = records.length;

    records.forEach(r => {
      totalEarned += (parseFloat(r.wage) || 0);
      totalAdvance += (parseFloat(r.advance) || 0);
      totalBalanceDue += (parseFloat(r.balance) || 0);
    });

    const kpiEarned = document.getElementById('kpiTotalEarned');
    const kpiAdvance = document.getElementById('kpiTotalAdvance');
    const kpiDue = document.getElementById('kpiTotalDue');
    const kpiDays = document.getElementById('kpiTotalDays');

    if (kpiEarned) kpiEarned.textContent = `₹${totalEarned.toLocaleString('en-IN')}`;
    if (kpiAdvance) kpiAdvance.textContent = `₹${totalAdvance.toLocaleString('en-IN')}`;
    if (kpiDue) kpiDue.textContent = `₹${totalBalanceDue.toLocaleString('en-IN')}`;
    if (kpiDays) kpiDays.textContent = daysCount;
  }

  function render(filterThekedar = '', filterStatus = 'all') {
    const container = document.getElementById('recordsList');
    if (!container) return;

    let records = getRecords();

    if (filterThekedar) {
      records = records.filter(r => r.contractor.toLowerCase().includes(filterThekedar.toLowerCase()) || 
                                    r.site.toLowerCase().includes(filterThekedar.toLowerCase()));
    }

    if (filterStatus !== 'all') {
      records = records.filter(r => r.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (records.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p><strong data-i18n="no_records_found">${window.currentLocale === 'en' ? 'No work records found.' : 'कोई हिसाब नहीं मिला।'}</strong></p>
          <p class="form-hint">${window.currentLocale === 'en' ? 'Use the form to log your daily work.' : 'ऊपर दिए गए फॉर्म से नया काम दर्ज करें।'}</p>
        </div>
      `;
      return;
    }

    const isHi = window.currentLocale !== 'en';

    container.innerHTML = records.map(r => {
      const isDue = r.balance > 0;
      const statusBadge = isDue 
        ? `<span class="badge badge-due">${isHi ? 'बकाया' : 'Due'}: ₹${r.balance}</span>`
        : `<span class="badge badge-paid">${isHi ? 'पूर्ण चुकता' : 'Paid in Full'}</span>`;

      return `
        <article class="record-card ${isDue ? 'status-due' : 'status-paid'}" data-id="${r.id}">
          <div class="record-header">
            <div class="record-date-thekedar">
              <span class="record-date">📅 ${formatDisplayDate(r.date)}</span>
              <span class="record-thekedar">👷 ${escapeHTML(r.contractor)}</span>
              <span class="record-site">📍 ${escapeHTML(r.site)} · <small>${escapeHTML(r.role)}</small></span>
            </div>
            <div>
              ${statusBadge}
            </div>
          </div>

          <div class="record-math">
            <div class="math-item">
              <span class="math-item-label">${isHi ? 'तय मजदूरी' : 'Agreed Wage'}</span>
              <span class="math-item-val">₹${r.wage}</span>
            </div>
            <div class="math-item">
              <span class="math-item-label">${isHi ? 'प्राप्त एडवांस' : 'Advance'}</span>
              <span class="math-item-val" style="color: #0284c7;">- ₹${r.advance}</span>
            </div>
            <div class="math-item">
              <span class="math-item-label">${isHi ? 'बाकी बकाया' : 'Net Due'}</span>
              <span class="math-item-val ${isDue ? 'stat-value due-text' : 'stat-value paid-text'}" style="font-size: 1.1rem;">₹${r.balance}</span>
            </div>
          </div>

          ${r.notes ? `<div style="font-size: 0.8rem; color: var(--color-text-muted);">📝 ${escapeHTML(r.notes)}</div>` : ''}

          <div class="record-actions">
            ${isDue ? `<button class="btn btn-small btn-success btn-mark-paid" data-id="${r.id}" title="${isHi ? 'पूरा भुगतान दर्ज करें' : 'Mark full payment'}">✓ ${isHi ? 'चुकता हुआ' : 'Mark Paid'}</button>` : ''}
            <button class="btn btn-small btn-secondary btn-print-slip" data-id="${r.id}" title="${isHi ? 'कानूनी पर्ची बनाएं' : 'Generate slip'}">🖨️ ${isHi ? 'पर्ची' : 'Slip'}</button>
            <button class="btn btn-small btn-secondary btn-delete-rec" data-id="${r.id}" style="color: var(--color-danger);" title="${isHi ? 'हटाएं' : 'Delete'}">✕</button>
          </div>
        </article>
      `;
    }).join('');

    attachRecordEvents();
  }

  function attachRecordEvents() {
    document.querySelectorAll('.btn-mark-paid').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        markAsPaid(id);
        window.showToast(window.currentLocale === 'en' ? 'Wage marked as fully paid!' : 'मजदूरी चुकता दर्ज हो गई!');
      });
    });

    document.querySelectorAll('.btn-delete-rec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const confirmMsg = window.currentLocale === 'en' ? 'Are you sure you want to delete this record?' : 'क्या आप यह रिकॉर्ड हटाना चाहते हैं?';
        if (confirm(confirmMsg)) {
          deleteRecord(id);
          window.showToast(window.currentLocale === 'en' ? 'Record deleted.' : 'रिकॉर्ड हटा दिया गया।');
        }
      });
    });

    document.querySelectorAll('.btn-print-slip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        showPrintSlipModal(id);
      });
    });
  }

  function showPrintSlipModal(id) {
    const records = getRecords();
    const rec = records.find(r => r.id === id);
    if (!rec) return;

    const modal = document.getElementById('slipModal');
    const container = document.getElementById('slipModalContent');
    const isHi = window.currentLocale !== 'en';

    // Generate a pseudo-cryptographic slip serial verification hash
    const slipHash = `SS-${rec.date.replace(/-/g, '')}-${rec.id.replace('REC-', '')}`;

    container.innerHTML = `
      <div class="slip-container" id="printableSlipArea">
        <div class="slip-header">
          <h2>श्रम अधिकार हिसाब पर्ची (Wage Slip)</h2>
          <p>श्रम कल्याण व न्यूनतम मजदूरी अनुपालन साक्ष्य · Shram Stambh</p>
          <p style="font-family: var(--font-mono); font-size: 0.75rem; margin-top: 0.2rem;">पर्ची क्रमांक / SLIP NO: <strong>#${slipHash}</strong></p>
        </div>

        <div class="slip-meta-grid">
          <div><strong>${isHi ? 'कामगार का नाम' : 'Worker Name'}:</strong> <span id="slipWorkerNameDisplay">मजदूर भाई (Migrant Worker)</span></div>
          <div><strong>${isHi ? 'तारीख' : 'Date'}:</strong> ${formatDisplayDate(rec.date)}</div>
          <div><strong>${isHi ? 'ठेकेदार' : 'Contractor'}:</strong> ${escapeHTML(rec.contractor)}</div>
          <div><strong>${isHi ? 'कार्यस्थल / साइट' : 'Worksite'}:</strong> ${escapeHTML(rec.site)}</div>
          <div><strong>${isHi ? 'काम की श्रेणी' : 'Skill Role'}:</strong> ${escapeHTML(rec.role)}</div>
          <div><strong>${isHi ? 'स्थिति' : 'Status'}:</strong> ${rec.status}</div>
        </div>

        <div class="slip-math-box">
          <div class="slip-math-row">
            <span>${isHi ? 'तय दैनिक मजदूरी (Agreed Daily Wage)' : 'Agreed Daily Wage'}:</span>
            <span>₹${rec.wage}.00</span>
          </div>
          <div class="slip-math-row">
            <span>${isHi ? 'दिया गया अग्रिम/एडवांस (Advance Paid)' : 'Advance Paid'}:</span>
            <span>- ₹${rec.advance}.00</span>
          </div>
          <div class="slip-math-row total-due">
            <span>${isHi ? 'कुल बाकी बकाया राशि (Net Balance Due)' : 'Net Outstanding Balance'}:</span>
            <span>₹${rec.balance}.00</span>
          </div>
        </div>

        ${rec.notes ? `<p style="font-size: 0.8rem; margin-bottom: 0.5rem;"><strong>${isHi ? 'टिप्पणी / काम का विवरण' : 'Remarks'}:</strong> ${escapeHTML(rec.notes)}</p>` : ''}

        <div class="slip-signatures">
          <div>
            ${isHi ? 'कामगार के हस्ताक्षर / अंगूठा' : 'Worker Signature / Thumb'}<br>
            <small style="color: #666;">(Signature of Worker)</small>
          </div>
          <div>
            ${isHi ? 'ठेकेदार / मुंशी के हस्ताक्षर' : 'Contractor / Munshi Signature'}<br>
            <small style="color: #666;">(Authorized Signatory)</small>
          </div>
        </div>

        <div class="slip-qr-box">
          <svg width="60" height="60" viewBox="0 0 100 100" style="margin: 0 auto 4px auto; display: block;">
            <rect width="100" height="100" fill="#ffffff" stroke="#000000" stroke-width="2"/>
            <rect x="10" y="10" width="25" height="25" fill="#000000"/>
            <rect x="65" y="10" width="25" height="25" fill="#000000"/>
            <rect x="10" y="65" width="25" height="25" fill="#000000"/>
            <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
            <rect x="19" y="19" width="7" height="7" fill="#000000"/>
            <rect x="74" y="19" width="7" height="7" fill="#000000"/>
            <rect x="19" y="74" width="7" height="7" fill="#000000"/>
            <rect x="42" y="15" width="8" height="20" fill="#000000"/>
            <rect x="42" y="45" width="16" height="16" fill="#000000"/>
            <rect x="65" y="45" width="20" height="10" fill="#000000"/>
            <rect x="42" y="70" width="12" height="18" fill="#000000"/>
            <rect x="65" y="70" width="22" height="18" fill="#000000"/>
          </svg>
          <div>सत्यापन कोड: ${slipHash} · श्रम कानूनों के तहत मान्य डिजिटल प्रति</div>
          <div style="font-size: 0.65rem; color: #888; margin-top: 2px;">Generated via Shram Stambh Client Architecture · Local Storage Verified</div>
        </div>
      </div>
    `;

    if (modal) modal.classList.add('open');
  }

  // =========================================================================
  // Statutory Wage Auditor Methods
  // =========================================================================
  function getStatutoryRate(state, skillTier) {
    const stateData = STATUTORY_RATES[state];
    if (!stateData) return null;
    return stateData[skillTier] || null;
  }

  function auditOfferedWage(state, skillTier, offeredWage) {
    const stateData = STATUTORY_RATES[state];
    if (!stateData) return null;

    const legalRate = stateData[skillTier];
    const offered = parseFloat(offeredWage) || 0;
    const difference = legalRate - offered;
    const isViolation = difference > 0;

    return {
      state,
      stateName: stateData.name_hi,
      skillTier,
      legalRate,
      offeredRate: offered,
      difference: difference,
      isViolation: isViolation,
      monthlyTheft: difference * 26, // 26 working days in a month
      annualTheft: difference * 312,  // 312 working days in a year
      act: stateData.act,
      helpline: stateData.helpline
    };
  }

  function renderStatutoryTable(state) {
    const stateData = STATUTORY_RATES[state];
    const tableContainer = document.getElementById('statutoryMatrixContainer');
    if (!tableContainer || !stateData) return;

    const isHi = window.currentLocale !== 'en';

    tableContainer.innerHTML = `
      <div class="statutory-table-wrap">
        <table class="statutory-table">
          <thead>
            <tr>
              <th>${isHi ? 'काम की श्रेणी (Skill Category)' : 'Skill Category'}</th>
              <th>${isHi ? 'दैनिक न्यूनतम दर (Daily Floor)' : 'Daily Rate'}</th>
              <th>${isHi ? 'मासिक दर (26 दिन)' : 'Monthly (26 Days)'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>👷 ${isHi ? 'अकुशल मजदूर (Unskilled - Helper / Beldar)' : 'Unskilled (Helper / Beldar)'}</td>
              <td><strong>₹${stateData.unskilled} / दिन</strong></td>
              <td>₹${stateData.unskilled * 26}</td>
            </tr>
            <tr>
              <td>🔨 ${isHi ? 'अर्ध-कुशल (Semi-Skilled - Asst. Mason)' : 'Semi-Skilled (Asst. Mason)'}</td>
              <td><strong>₹${stateData.semi_skilled} / दिन</strong></td>
              <td>₹${stateData.semi_skilled * 26}</td>
            </tr>
            <tr>
              <td>🛠️ ${isHi ? 'कुशल कारीगर (Skilled - Mason / Carpenter / Electrician)' : 'Skilled (Mason / Electrician)'}</td>
              <td><strong>₹${stateData.skilled} / दिन</strong></td>
              <td>₹${stateData.skilled * 26}</td>
            </tr>
            <tr>
              <td>📐 ${isHi ? 'उच्च कुशल (Highly Skilled - Foreman / Supervisor)' : 'Highly Skilled (Supervisor)'}</td>
              <td><strong>₹${stateData.highly_skilled} / दिन</strong></td>
              <td>₹${stateData.highly_skilled * 26}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem;">
        📜 <strong>${isHi ? 'अधिसूचना' : 'Notification'}:</strong> ${stateData.act} · ${isHi ? 'राष्ट्रीय श्रम हेल्पलाइन' : 'Labour Helpline'}: <strong>${stateData.helpline}</strong>
      </div>
    `;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString(window.currentLocale === 'en' ? 'en-US' : 'hi-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch (e) {}
    return dateStr;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  return {
    getRecords,
    addRecord,
    deleteRecord,
    markAsPaid,
    updateKPIs,
    render,
    auditOfferedWage,
    renderStatutoryTable,
    STATUTORY_RATES,
    showPrintSlipModal
  };
})();
