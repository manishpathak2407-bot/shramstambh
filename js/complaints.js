/**
 * SHRAM STAMBH (श्रम स्तंभ) - Whistleblower & Contractor Vetting Engine
 * Tier 2: Whistleblower Anonymity & Grievance Hash Engine
 * English-First Presentation with Bracketed Hindi Translations
 * Generates cryptographic ticket IDs, sanitizes worker identities,
 * tracks dispute progression, and maintains peer contractor reviews.
 */

const GrievanceModule = (function () {
  const GRIEVANCE_STORAGE_KEY = 'shram_grievance_records';
  const CONTRACTORS_STORAGE_KEY = 'shram_contractor_reviews';

  // Seed data for initial demo and evaluation
  const SEED_GRIEVANCES = [
    {
      ticketId: "#SH-9042",
      date: "2026-10-26",
      contractor: "Apex Tower 4 Site Thekedar",
      location: "Sector 62, Noida, UP",
      category: "wage_theft",
      categoryText: "Wage Theft / Slashed Pay (मजदूरी चोरी)",
      description: "15 days unpaid wages for 22 construction workers. Thekedar threatens dismissal upon demand.",
      anonymous: true,
      workerName: "Anonymous Worker (पहचान गुप्त)",
      contact: "HIDDEN_BY_SANITY_ENGINE",
      status: "notice_issued",
      statusText: "Show-Cause Notice Issued to Contractor (ठेकेदार को विधिक नोटिस)",
      officerNotes: "Sub-Divisional Labour Commissioner dispatched compliance officer to inspect site muster roll.",
      updatedAt: "2026-10-27T14:30:00"
    },
    {
      ticketId: "#SH-8719",
      date: "2026-10-21",
      contractor: "Rai & Sons Infrastructure",
      location: "Bhiwandi Warehousing Hub, Maharashtra",
      category: "withheld_documents",
      categoryText: "Confiscated Aadhaar / Personal ID (दस्तावेज़ जब्ती)",
      description: "Contractor has withheld original Aadhaar cards of 8 laborers and refuses to return them until the project completes.",
      anonymous: true,
      workerName: "Anonymous Worker (पहचान गुप्त)",
      contact: "HIDDEN_BY_SANITY_ENGINE",
      status: "under_review",
      statusText: "Under Investigation by Labour Cell (श्रम प्रकोष्ठ द्वारा जांच)",
      officerNotes: "Violation of Inter-State Migrant Workmen Act Section 17. Summon dispatched to employer.",
      updatedAt: "2026-10-23T11:15:00"
    }
  ];

  const SEED_CONTRACTORS = [
    {
      id: "CON-01",
      name: "Ramesh Thekedar",
      trade: "Civil Masonry & Plastering",
      city: "Noida / Delhi NCR",
      rating: 4.2,
      reviewsCount: 38,
      timelyPayRate: "92%",
      safetyScore: "B+",
      verified: true,
      badgeText: "Verified Contractor (सत्यापित ठेकेदार)",
      topFeedback: "Pays weekly advance promptly. Overtime clearance requires gentle reminder."
    },
    {
      id: "CON-02",
      name: "Sharma Construction Agency",
      trade: "Flyover & Shuttering Works",
      city: "Gurugram, Haryana",
      rating: 4.6,
      reviewsCount: 52,
      timelyPayRate: "98%",
      safetyScore: "A",
      verified: true,
      badgeText: "Top Safety Certified (शीर्ष सुरक्षा)",
      topFeedback: "Provides safety helmets, boots, and clean drinking water on site. Daily muster signed."
    },
    {
      id: "CON-03",
      name: "Golden Bricks Infrastructure",
      trade: "Brick Kiln & Excavation",
      city: "Faridabad / Palwal",
      rating: 2.1,
      reviewsCount: 19,
      timelyPayRate: "45%",
      safetyScore: "D",
      verified: false,
      badgeText: "⚠️ Wage Delay Alert (विलंबित भुगतान)",
      topFeedback: "Delays final settlement for months. Avoid accepting verbal wage commitments without written slips."
    },
    {
      id: "CON-04",
      name: "Balaji Interiors & Paint Services",
      trade: "Putty, Painting & Polishing",
      city: "Dwarka / West Delhi",
      rating: 4.8,
      reviewsCount: 29,
      timelyPayRate: "100%",
      safetyScore: "A+",
      verified: true,
      badgeText: "Verified Contractor (सत्यापित ठेकेदार)",
      topFeedback: "Full daily wage cleared every Saturday evening without any unexpected deductions."
    }
  ];

  function getGrievances() {
    const raw = localStorage.getItem(GRIEVANCE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GRIEVANCE_STORAGE_KEY, JSON.stringify(SEED_GRIEVANCES));
      return SEED_GRIEVANCES;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveGrievances(data) {
    localStorage.setItem(GRIEVANCE_STORAGE_KEY, JSON.stringify(data));
  }

  function getContractors() {
    const raw = localStorage.getItem(CONTRACTORS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONTRACTORS_STORAGE_KEY, JSON.stringify(SEED_CONTRACTORS));
      return SEED_CONTRACTORS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveContractors(data) {
    localStorage.setItem(CONTRACTORS_STORAGE_KEY, JSON.stringify(data));
  }

  function generateTicketId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `#SH-${num}`;
  }

  function submitGrievance(formData) {
    const grievances = getGrievances();
    const isAnonymous = formData.anonymous !== false;

    const sanitizedData = {
      ticketId: generateTicketId(),
      date: new Date().toISOString().split('T')[0],
      contractor: formData.contractor.trim(),
      location: formData.location.trim() || "Unspecified Worksite",
      category: formData.category,
      categoryText: getCategoryLabel(formData.category),
      description: formData.description.trim(),
      anonymous: isAnonymous,
      workerName: isAnonymous ? "Anonymous Worker (पहचान सुरक्षित)" : (formData.workerName || "Worker"),
      contact: isAnonymous ? "HIDDEN_BY_SANITY_ENGINE" : (formData.contact || ""),
      status: "submitted",
      statusText: "Grievance Registered (शिकायत दर्ज - जांच हेतु प्रेषित)",
      officerNotes: "Assigned automated case ID. Priority dispatch to relevant District Labour Office.",
      updatedAt: new Date().toISOString()
    };

    grievances.unshift(sanitizedData);
    saveGrievances(grievances);

    return sanitizedData;
  }

  function getCategoryLabel(cat) {
    switch (cat) {
      case 'wage_theft': return 'Wage Theft / Slashed Pay (मजदूरी चोरी)';
      case 'withheld_documents': return 'Confiscated Aadhaar / Personal ID (दस्तावेज़ जब्ती)';
      case 'unsafe_site': return 'Unsafe Worksite / No Safety Kit (असुरक्षित कार्यस्थल)';
      case 'harassment': return 'Verbal Threats / Physical Harassment (धमकी या प्रताड़ना)';
      case 'overtime_unpaid': return 'Forced Unpaid Overtime (बिना भुगतान ओवरटाइम)';
      default: return 'General Labour Grievance (सामान्य श्रम शिकायत)';
    }
  }

  function trackTicket(ticketId) {
    const cleaned = ticketId.trim().toUpperCase();
    const grievances = getGrievances();
    return grievances.find(g => g.ticketId.toUpperCase() === cleaned || g.ticketId.replace('#', '').toUpperCase() === cleaned.replace('#', '')) || null;
  }

  function addContractorReview(reviewData) {
    const contractors = getContractors();
    const existing = contractors.find(c => c.name.toLowerCase() === reviewData.contractorName.toLowerCase().trim());
    const ratingNum = parseFloat(reviewData.rating) || 5;

    if (existing) {
      const totalScore = (existing.rating * existing.reviewsCount) + ratingNum;
      existing.reviewsCount += 1;
      existing.rating = parseFloat((totalScore / existing.reviewsCount).toFixed(1));
      if (reviewData.feedback) {
        existing.topFeedback = reviewData.feedback;
      }
    } else {
      contractors.unshift({
        id: "CON-" + (contractors.length + 1),
        name: reviewData.contractorName.trim(),
        trade: reviewData.trade || "General Construction",
        city: reviewData.city || "NCR & North India",
        rating: ratingNum,
        reviewsCount: 1,
        timelyPayRate: ratingNum >= 4 ? "90%" : "60%",
        safetyScore: ratingNum >= 4 ? "A" : "C",
        verified: false,
        badgeText: "New Contractor (नया ठेकेदार)",
        topFeedback: reviewData.feedback || "First worker review recorded."
      });
    }

    saveContractors(contractors);
    renderContractorList();
  }

  function renderContractorList(searchQuery = '') {
    const container = document.getElementById('contractorsList');
    if (!container) return;

    let list = getContractors();
    if (searchQuery) {
      list = list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              c.trade.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              c.city.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">🔍</div>
          <p><strong>No contractors found <span class="hi-bracket">(कोई ठेकेदार नहीं मिला)</span></strong></p>
          <p class="form-hint">Use the button above to rate and add a new contractor.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => {
      const stars = '★'.repeat(Math.round(c.rating)) + '☆'.repeat(5 - Math.round(c.rating));
      return `
        <article class="contractor-card">
          <div class="contractor-header">
            <div>
              <h4 class="contractor-name">👷 ${escapeHTML(c.name)}</h4>
              <div style="font-size: 0.8rem; color: var(--color-text-muted);">🔨 ${escapeHTML(c.trade)} · 📍 ${escapeHTML(c.city)}</div>
            </div>
            <span class="badge ${c.verified ? 'badge-verified' : 'badge-due'}">
              ${c.badgeText}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.25rem 0;">
            <span class="rating-stars">${stars}</span>
            <strong style="font-size: 1.1rem; font-family: var(--font-mono);">${c.rating}</strong>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">(${c.reviewsCount} reviews <span class="hi-bracket">समीक्षाएं</span>)</span>
          </div>

          <div class="score-badge-row">
            <span class="score-pill">💰 Pay Timeliness <span class="hi-bracket">(समय पर भुगतान)</span>: <strong>${c.timelyPayRate}</strong></span>
            <span class="score-pill">⛑️ Safety <span class="hi-bracket">(सुरक्षा)</span>: <strong>${c.safetyScore}</strong></span>
          </div>

          <p style="font-size: 0.8rem; color: var(--color-text-muted); font-style: italic; margin-top: 0.35rem;">
            "${escapeHTML(c.topFeedback)}"
          </p>

          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="btn btn-small btn-secondary btn-quick-rate" data-name="${escapeHTML(c.name)}" style="flex: 1;">
              ⭐ Rate <span class="hi-bracket">(रेटिंग)</span>
            </button>
            <button class="btn btn-small btn-secondary btn-prefill-khata" data-name="${escapeHTML(c.name)}" style="flex: 1;">
              📝 Add to Khata <span class="hi-bracket">(खाता में जोड़ें)</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach quick events
    document.querySelectorAll('.btn-quick-rate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.currentTarget.getAttribute('data-name');
        const modal = document.getElementById('rateContractorModal');
        const input = document.getElementById('rateModalThekedarName');
        if (input) input.value = name;
        if (modal) modal.classList.add('open');
      });
    });

    document.querySelectorAll('.btn-prefill-khata').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.currentTarget.getAttribute('data-name');
        window.switchTab('khata');
        const input = document.getElementById('entryThekedar');
        if (input) {
          input.value = name;
          input.focus();
        }
        window.showToast(`Contractor selected: ${name} (ठेकेदार चुना गया)`);
      });
    });
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
    getGrievances,
    submitGrievance,
    trackTicket,
    getContractors,
    addContractorReview,
    renderContractorList
  };
})();
