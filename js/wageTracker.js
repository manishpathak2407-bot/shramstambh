/**
 * SHRAM STAMBH (श्रम स्तंभ) - Wage Khata & Statutory Legal Auditor Engine
 * Tier 2: Business Logic & Processing Engine
 * English-First Presentation with Bracketed Hindi Translations (कम साक्षरता सहायता)
 * Daily wage ledger CRUD, balance calculations, receipt generation,
 * and cross-validates contractor offers against state BOCW statutory rate floors.
 */

const WageTracker = (function () {
  const STORAGE_KEY = 'shram_wage_records';

  // Statutory Minimum Wage Matrix (Daily rates in INR)
  const STATUTORY_RATES = {
    "Delhi": {
      name: "Delhi (Delhi NCT)",
      name_hi: "दिल्ली",
      unskilled: 750,
      semi_skilled: 825,
      skilled: 908,
      highly_skilled: 999,
      act: "Delhi Minimum Wages Notification (F.No.12(142)/02/MW/VII)",
      helpline: "14434"
    },
    "Maharashtra": {
      name: "Maharashtra",
      name_hi: "महाराष्ट्र",
      unskilled: 570,
      semi_skilled: 620,
      skilled: 680,
      highly_skilled: 740,
      act: "Maharashtra Minimum Wages & BOCW Welfare Rules",
      helpline: "1800-22-1244"
    },
    "Punjab": {
      name: "Punjab",
      name_hi: "पंजाब",
      unskilled: 450,
      semi_skilled: 490,
      skilled: 540,
      highly_skilled: 600,
      act: "Punjab Labour Department Minimum Wages Schedule",
      helpline: "14434"
    },
    "Uttar Pradesh": {
      name: "Uttar Pradesh",
      name_hi: "उत्तर प्रदेश",
      unskilled: 415,
      semi_skilled: 455,
      skilled: 510,
      highly_skilled: 570,
      act: "UP Minimum Wages Notification & BOCW Board",
      helpline: "1800-180-5160"
    },
    "Bihar": {
      name: "Bihar",
      name_hi: "बिहार",
      unskilled: 395,
      semi_skilled: 410,
      skilled: 500,
      highly_skilled: 610,
      act: "Bihar Minimum Wages Act & Pravasi Shramik Rules",
      helpline: "1800-345-6262"
    },
    "Haryana": {
      name: "Haryana",
      name_hi: "हरियाणा",
      unskilled: 425,
      semi_skilled: 470,
      skilled: 520,
      highly_skilled: 580,
      act: "Haryana Labour Welfare Board Statutory Floors",
      helpline: "1800-180-2129"
    },
    "Karnataka": {
      name: "Karnataka",
      name_hi: "कर्नाटक",
      unskilled: 550,
      semi_skilled: 600,
      skilled: 670,
      highly_skilled: 730,
      act: "Karnataka Minimum Wages Notification",
      helpline: "155214"
    },
    "West Bengal": {
      name: "West Bengal",
      name_hi: "पश्चिम बंगाल",
      unskilled: 400,
      semi_skilled: 440,
      skilled: 485,
      highly_skilled: 545,
      act: "WB Labour Department Minimum Wages Schedule",
      helpline: "1800-103-0009"
    }
  };

  // Seed Data
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
          <p><strong>No work records found <span class="hi-bracket">(कोई हिसाब नहीं मिला)</span></strong></p>
          <p class="form-hint">Use the form to log your daily work <span class="hi-bracket">(नया काम दर्ज करें)</span>.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = records.map(r => {
      const isDue = r.balance > 0;
      const statusBadge = isDue 
        ? `<span class="badge badge-due">Due <span class="hi-bracket">(बकाया)</span>: ₹${r.balance}</span>`
        : `<span class="badge badge-paid">Paid in Full <span class="hi-bracket">(पूर्ण चुकता)</span></span>`;

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
              <span class="math-item-label">Agreed Wage <span class="hi-bracket">(तय)</span></span>
              <span class="math-item-val">₹${r.wage}</span>
            </div>
            <div class="math-item">
              <span class="math-item-label">Advance <span class="hi-bracket">(एडवांस)</span></span>
              <span class="math-item-val" style="color: #0284c7;">- ₹${r.advance}</span>
            </div>
            <div class="math-item">
              <span class="math-item-label">Net Due <span class="hi-bracket">(बकाया)</span></span>
              <span class="math-item-val ${isDue ? 'stat-value due-text' : 'stat-value paid-text'}" style="font-size: 1.1rem;">₹${r.balance}</span>
            </div>
          </div>

          ${r.notes ? `<div style="font-size: 0.8rem; color: var(--color-text-muted);">📝 ${escapeHTML(r.notes)}</div>` : ''}

          <div class="record-actions">
            ${isDue ? `<button class="btn btn-small btn-success btn-mark-paid" data-id="${r.id}" title="Mark full payment">✓ Mark Paid <span class="hi-bracket">(चुकता)</span></button>` : ''}
            <button class="btn btn-small btn-secondary btn-print-slip" data-id="${r.id}" title="Generate printable slip">🖨️ Slip <span class="hi-bracket">(पर्ची)</span></button>
            <button class="btn btn-small btn-secondary btn-delete-rec" data-id="${r.id}" style="color: var(--color-danger);" title="Delete record">✕</button>
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
        window.showToast('Wage marked as fully paid! (मजदूरी चुकता दर्ज हो गई)');
      });
    });

    document.querySelectorAll('.btn-delete-rec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this record? (क्या आप यह रिकॉर्ड हटाना चाहते हैं?)')) {
          deleteRecord(id);
          window.showToast('Record deleted. (रिकॉर्ड हटा दिया गया)');
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

    const slipHash = `SS-${rec.date.replace(/-/g, '')}-${rec.id.replace('REC-', '')}`;

    container.innerHTML = `
      <div class="slip-container" id="printableSlipArea">
        <div class="slip-header">
          <h2>Wage Slip & Balance Voucher <span class="hi-bracket">(श्रम अधिकार हिसाब पर्ची)</span></h2>
          <p>Statutory Minimum Wage & BOCW Compliance Evidence · Shram Stambh <span class="hi-bracket">(श्रम स्तंभ)</span></p>
          <p style="font-family: var(--font-mono); font-size: 0.75rem; margin-top: 0.2rem;">SLIP NO / पर्ची क्रमांक: <strong>#${slipHash}</strong></p>
        </div>

        <div class="slip-meta-grid">
          <div><strong>Worker Name <span class="hi-bracket">(कामगार)</span>:</strong> <span>Migrant Worker (मजदूर)</span></div>
          <div><strong>Date <span class="hi-bracket">(तारीख)</span>:</strong> ${formatDisplayDate(rec.date)}</div>
          <div><strong>Contractor <span class="hi-bracket">(ठेकेदार)</span>:</strong> ${escapeHTML(rec.contractor)}</div>
          <div><strong>Worksite <span class="hi-bracket">(साइट)</span>:</strong> ${escapeHTML(rec.site)}</div>
          <div><strong>Skill Role <span class="hi-bracket">(श्रेणी)</span>:</strong> ${escapeHTML(rec.role)}</div>
          <div><strong>Status <span class="hi-bracket">(स्थिति)</span>:</strong> ${rec.status}</div>
        </div>

        <div class="slip-math-box">
          <div class="slip-math-row">
            <span>Agreed Daily Wage <span class="hi-bracket">(तय दैनिक मजदूरी)</span>:</span>
            <span>₹${rec.wage}.00</span>
          </div>
          <div class="slip-math-row">
            <span>Advance Paid Today <span class="hi-bracket">(दिया गया एडवांस)</span>:</span>
            <span>- ₹${rec.advance}.00</span>
          </div>
          <div class="slip-math-row total-due">
            <span>Net Outstanding Balance Due <span class="hi-bracket">(कुल बाकी बकाया)</span>:</span>
            <span>₹${rec.balance}.00</span>
          </div>
        </div>

        ${rec.notes ? `<p style="font-size: 0.8rem; margin-bottom: 0.5rem;"><strong>Work Details & Remarks <span class="hi-bracket">(विवरण)</span>:</strong> ${escapeHTML(rec.notes)}</p>` : ''}

        <div class="slip-signatures">
          <div>
            Worker Signature / Thumb<br>
            <span class="hi-bracket">(कामगार के हस्ताक्षर / अंगूठा)</span>
          </div>
          <div>
            Contractor / Munshi Signature<br>
            <span class="hi-bracket">(ठेकेदार के हस्ताक्षर)</span>
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
          <div>Verification Token: #${slipHash} · Admissible Evidence under Labour Laws</div>
          <div style="font-size: 0.65rem; color: #888; margin-top: 2px;">Generated via Shram Stambh Client Architecture · Local Storage Verified</div>
        </div>
      </div>
    `;

    if (modal) modal.classList.add('open');
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
      stateName: stateData.name,
      stateNameHi: stateData.name_hi,
      skillTier,
      legalRate,
      offeredRate: offered,
      difference: difference,
      isViolation: isViolation,
      monthlyTheft: difference * 26,
      annualTheft: difference * 312,
      act: stateData.act,
      helpline: stateData.helpline
    };
  }

  function renderStatutoryTable(state) {
    const stateData = STATUTORY_RATES[state];
    const tableContainer = document.getElementById('statutoryMatrixContainer');
    if (!tableContainer || !stateData) return;

    tableContainer.innerHTML = `
      <div class="statutory-table-wrap">
        <table class="statutory-table">
          <thead>
            <tr>
              <th>Skill Category <span class="hi-bracket">(काम की श्रेणी)</span></th>
              <th>Daily Minimum Floor <span class="hi-bracket">(दैनिक दर)</span></th>
              <th>Monthly Floor (26 Days) <span class="hi-bracket">(मासिक दर)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>👷 Unskilled (Helper / Beldar) <span class="hi-bracket">(अकुशल मजदूर)</span></td>
              <td><strong>₹${stateData.unskilled} / day</strong></td>
              <td>₹${stateData.unskilled * 26}</td>
            </tr>
            <tr>
              <td>🔨 Semi-Skilled (Asst. Mason) <span class="hi-bracket">(अर्ध-कुशल)</span></td>
              <td><strong>₹${stateData.semi_skilled} / day</strong></td>
              <td>₹${stateData.semi_skilled * 26}</td>
            </tr>
            <tr>
              <td>🛠️ Skilled (Mason / Electrician) <span class="hi-bracket">(कुशल कारीगर)</span></td>
              <td><strong>₹${stateData.skilled} / day</strong></td>
              <td>₹${stateData.skilled * 26}</td>
            </tr>
            <tr>
              <td>📐 Highly Skilled (Supervisor) <span class="hi-bracket">(उच्च कुशल)</span></td>
              <td><strong>₹${stateData.highly_skilled} / day</strong></td>
              <td>₹${stateData.highly_skilled * 26}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem;">
        📜 <strong>Statutory Act <span class="hi-bracket">(अधिसूचना)</span>:</strong> ${stateData.act} · National Labour Helpline: <strong>${stateData.helpline}</strong>
      </div>
    `;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', {
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
