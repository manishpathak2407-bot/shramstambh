/**
 * SHRAM STAMBH (श्रम स्तंभ) - Main Application Controller
 * English-First Layout with Bracketed Hindi Translations (कम साक्षरता सहायता)
 * Tab Routing, Event Orchestration & UI State
 */

/**
 * Switch Active View Tab
 */
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-tab') === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  document.querySelectorAll('.view-panel').forEach(panel => {
    if (panel.id === `view-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchTab = switchTab;

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'danger' ? 'toast-danger' : ''}`;
  toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

/**
 * Application Bootstrap
 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. High Contrast Mode Toggle
  const contrastBtn = document.getElementById('btnContrastToggle');
  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHigh = document.body.classList.contains('high-contrast');
      contrastBtn.classList.toggle('active', isHigh);
      showToast(isHigh 
        ? 'High Contrast: ON (Field Mode / धूप मोड)' 
        : 'High Contrast: OFF (सामान्य मोड)');
    });
  }

  // 2. Large Font Mode Toggle
  const fontBtn = document.getElementById('btnFontToggle');
  if (fontBtn) {
    fontBtn.addEventListener('click', () => {
      document.body.classList.toggle('large-font');
      const isLarge = document.body.classList.contains('large-font');
      fontBtn.classList.toggle('active', isLarge);
      showToast(isLarge 
        ? 'Large Text: ON (बड़ा फॉन्ट)' 
        : 'Large Text: OFF (सामान्य फॉन्ट)');
    });
  }

  // 3. Speech Audio Stop Button
  const btnStopSpeech = document.getElementById('btnStopSpeech');
  if (btnStopSpeech) {
    btnStopSpeech.addEventListener('click', () => {
      SpeechNarrator.stop();
    });
  }

  // 4. Section Narrator Buttons
  document.querySelectorAll('.btn-narrate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.currentTarget.getAttribute('data-narrate-key');
      if (SpeechNarrator.isSpeaking()) {
        SpeechNarrator.stop();
      } else {
        SpeechNarrator.narrateKey(key, e.currentTarget);
      }
    });
  });

  // 5. Navigation Tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // 6. Initialize Wage Tracker Data
  WageTracker.render();
  WageTracker.updateKPIs();

  // Set default date in work entry form to today
  const entryDateInput = document.getElementById('entryDate');
  if (entryDateInput) {
    entryDateInput.value = new Date().toISOString().split('T')[0];
  }

  // Work Entry Form Submission
  const formWork = document.getElementById('formLogWork');
  if (formWork) {
    formWork.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('entryDate').value;
      const thekedar = document.getElementById('entryThekedar').value;
      const site = document.getElementById('entrySite').value;
      const role = document.getElementById('entryRole').value;
      const wage = document.getElementById('entryWage').value;
      const advance = document.getElementById('entryAdvance').value;
      const notes = document.getElementById('entryNotes').value;

      if (!thekedar || !wage) {
        showToast('Please enter Contractor Name and Agreed Wage (ठेकेदार का नाम और तय मजदूरी दर्ज करें)', 'danger');
        return;
      }

      WageTracker.addRecord({ date, contractor: thekedar, site, role, wage, advance, notes });

      showToast('Daily work entry saved to Khata! (दैनिक हिसाब सेव हो गया)', 'success');

      // Clear non-retained fields
      document.getElementById('entryAdvance').value = '0';
      document.getElementById('entryNotes').value = '';
    });
  }

  // Ledger Filter Controls
  const filterThekedar = document.getElementById('filterThekedar');
  const filterStatus = document.getElementById('filterStatus');
  if (filterThekedar) {
    filterThekedar.addEventListener('input', () => {
      WageTracker.render(filterThekedar.value, filterStatus ? filterStatus.value : 'all');
    });
  }
  if (filterStatus) {
    filterStatus.addEventListener('change', () => {
      WageTracker.render(filterThekedar ? filterThekedar.value : '', filterStatus.value);
    });
  }

  // 7. Statutory Legal Auditor Setup
  const auditStateSelect = document.getElementById('auditStateSelect');
  const auditSkillSelect = document.getElementById('auditSkillSelect');
  const auditWageInput = document.getElementById('auditWageInput');
  const btnVerifyWage = document.getElementById('btnVerifyWage');
  const auditResultBox = document.getElementById('auditResultBox');

  if (auditStateSelect) {
    WageTracker.renderStatutoryTable(auditStateSelect.value);
    auditStateSelect.addEventListener('change', () => {
      WageTracker.renderStatutoryTable(auditStateSelect.value);
    });
  }

  if (btnVerifyWage) {
    btnVerifyWage.addEventListener('click', () => {
      const state = auditStateSelect.value;
      const skill = auditSkillSelect.value;
      const offered = parseFloat(auditWageInput.value);

      if (isNaN(offered) || offered <= 0) {
        showToast('Please enter a valid offered wage amount (वैध मजदूरी दर्ज करें)', 'danger');
        return;
      }

      const audit = WageTracker.auditOfferedWage(state, skill, offered);
      if (!audit) return;

      if (audit.isViolation) {
        auditResultBox.innerHTML = `
          <div class="alert-box alert-danger">
            <div class="alert-header">
              <span>⚠️</span>
              <span>WAGE THEFT DETECTED! <span class="hi-bracket">(मजदूरी चोरी अलर्ट!)</span></span>
            </div>
            <div class="alert-body">
              <p>
                Offered Wage <span class="hi-bracket">(प्रस्तावित मजदूरी)</span>: <strong>₹${audit.offeredRate} / day</strong> · 
                ${audit.stateName} Statutory Minimum Floor <span class="hi-bracket">(कानूनी न्यूनतम दर)</span>: <strong>₹${audit.legalRate} / day</strong>
              </p>
              <div class="theft-calc-breakdown">
                <div class="calc-pill">
                  <span class="calc-pill-label">Daily Loss <span class="hi-bracket">(दैनिक नुकसान)</span></span>
                  <span class="calc-pill-val">₹${audit.difference} / day</span>
                </div>
                <div class="calc-pill">
                  <span class="calc-pill-label">Monthly Theft (26d) <span class="hi-bracket">(मासिक चोरी)</span></span>
                  <span class="calc-pill-val">₹${audit.monthlyTheft.toLocaleString('en-IN')}</span>
                </div>
                <div class="calc-pill">
                  <span class="calc-pill-label">Annual Deprivation <span class="hi-bracket">(वार्षिक नुकसान)</span></span>
                  <span class="calc-pill-val">₹${audit.annualTheft.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p style="font-size: 0.8rem; margin-top: 0.4rem;">
                ⚖️ <strong>Legal Violation <span class="hi-bracket">(कानूनी उल्लंघन)</span>:</strong> Paying below statutory floor rates is a punishable offense under ${audit.act}.
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;">
                <a href="tel:${audit.helpline}" class="btn btn-danger" style="flex: 1; min-width: 180px;">
                  📞 Call Labour Helpline: ${audit.helpline} <span class="hi-bracket">(हेल्पलाइन)</span>
                </a>
                <button class="btn btn-secondary btn-jump-report" data-state="${audit.state}" style="flex: 1; min-width: 180px;">
                  🚨 File Whistleblower Report <span class="hi-bracket">(गुप्त रिपोर्ट करें)</span>
                </button>
              </div>
            </div>
          </div>
        `;

        SpeechNarrator.speak(
          `Wage theft detected! Statutory minimum in ${audit.state} is ₹${audit.legalRate} per day. You are being underpaid by ₹${audit.difference} daily. Call labour helpline 14434. मजदूरी चोरी अलर्ट! सरकारी न्यूनतम दर से ₹${audit.difference} प्रतिदिन कम दिया जा रहा है।`
        );

        // Bind quick whistleblower button
        const reportBtn = auditResultBox.querySelector('.btn-jump-report');
        if (reportBtn) {
          reportBtn.addEventListener('click', () => {
            switchTab('grievance');
            const catSelect = document.getElementById('grievanceCategory');
            const descArea = document.getElementById('grievanceDetails');
            if (catSelect) catSelect.value = 'wage_theft';
            if (descArea) {
              descArea.value = `Wage underpayment report: In ${audit.state}, contractor offered ₹${audit.offeredRate}/day instead of statutory floor ₹${audit.legalRate}/day (Underpaid by ₹${audit.difference}/day).`;
            }
            showToast('Audit details transferred to Whistleblower form (विवरण गुप्त शिकायत में दर्ज हुआ)');
          });
        }

      } else {
        auditResultBox.innerHTML = `
          <div class="alert-box alert-success">
            <div class="alert-header">
              <span>✅</span>
              <span>STATUTORY WAGE COMPLIANT <span class="hi-bracket">(कानूनी रूप से सुरक्षित मजदूरी)</span></span>
            </div>
            <div class="alert-body">
              <p>
                Offered Wage <span class="hi-bracket">(प्रस्तावित मजदूरी)</span>: <strong>₹${audit.offeredRate} / day</strong> meets or exceeds ${audit.stateName}'s statutory floor of <strong>₹${audit.legalRate} / day</strong>.
              </p>
              <p style="font-size: 0.8rem; margin-top: 0.3rem;">
                🛡️ This rate satisfies mandatory statutory compliance under the Minimum Wages Act 1948 and BOCW regulations.
              </p>
            </div>
          </div>
        `;

        SpeechNarrator.speak(
          `Compliant wage rate! Offered wage meets or exceeds the statutory floor of ₹${audit.legalRate} per day. प्रस्तावित मजदूरी कानूनी न्यूनतम दर के अनुरूप है।`
        );
      }
    });
  }

  // 8. Grievance Module Form & Tracking
  const formGrievance = document.getElementById('formGrievance');
  if (formGrievance) {
    formGrievance.addEventListener('submit', (e) => {
      e.preventDefault();
      const contractor = document.getElementById('grievanceContractor').value;
      const location = document.getElementById('grievanceLocation').value;
      const category = document.getElementById('grievanceCategory').value;
      const description = document.getElementById('grievanceDetails').value;
      const anonymous = document.getElementById('grievanceAnonCheckbox').checked;

      if (!contractor || !description) {
        showToast('Please enter Contractor Name and Incident Details (ठेकेदार का नाम और विवरण दर्ज करें)', 'danger');
        return;
      }

      const ticket = GrievanceModule.submitGrievance({
        contractor,
        location,
        category,
        description,
        anonymous
      });

      // Show Ticket Modal
      showTicketReceiptModal(ticket);

      formGrievance.reset();
      document.getElementById('grievanceAnonCheckbox').checked = true;
    });
  }

  // Ticket Status Tracker
  const btnTrackTicket = document.getElementById('btnTrackTicket');
  const inputTrackTicket = document.getElementById('inputTrackTicket');
  const trackResultContainer = document.getElementById('trackResultContainer');

  if (btnTrackTicket && inputTrackTicket) {
    btnTrackTicket.addEventListener('click', () => {
      const tid = inputTrackTicket.value;
      if (!tid) {
        showToast('Please enter a Ticket ID (e.g. #SH-9042)', 'danger');
        return;
      }

      const record = GrievanceModule.trackTicket(tid);

      if (!record) {
        trackResultContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <p><strong>Ticket ID not found <span class="hi-bracket">(टिकट नहीं मिला)</span></strong></p>
            <p class="form-hint">Please verify your ticket token (e.g. #SH-9042).</p>
          </div>
        `;
        return;
      }

      trackResultContainer.innerHTML = `
        <div class="ticket-receipt-card">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span class="ticket-id-display">🎫 ${record.ticketId}</span>
              <div style="font-size: 0.8rem; color: var(--color-text-muted);">
                📅 ${record.date} · 👷 ${record.contractor} · 📍 ${record.location}
              </div>
            </div>
            <span class="badge badge-due" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
              ${record.statusText}
            </span>
          </div>

          <div style="margin-top: 0.75rem; font-size: 0.85rem; background: var(--color-bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
            <strong>Category <span class="hi-bracket">(श्रेणी)</span>:</strong> ${record.categoryText}<br>
            <strong>Details <span class="hi-bracket">(विवरण)</span>:</strong> ${record.description}<br>
            <strong>Identity Status <span class="hi-bracket">(पहचान स्थिति)</span>:</strong> <span style="color: var(--color-success); font-weight: 700;">🔒 100% Anonymous & Sanitized (गोपनीय)</span>
          </div>

          <div class="timeline">
            <div class="timeline-step completed">
              <div class="timeline-dot">✓</div>
              <div class="timeline-step-title">1. Grievance Sanitized & Registered <span class="hi-bracket">(दर्ज व पहचान सुरक्षित)</span></div>
              <div class="timeline-step-time">${record.date} · System Cryptographic Token Assigned</div>
            </div>
            <div class="timeline-step ${record.status !== 'submitted' ? 'completed' : 'active'}">
              <div class="timeline-dot">${record.status !== 'submitted' ? '✓' : '2'}</div>
              <div class="timeline-step-title">2. Dispatched to District Labour Cell (DLC) <span class="hi-bracket">(श्रम प्रकोष्ठ को प्रेषित)</span></div>
              <div class="timeline-step-time">${record.status !== 'submitted' ? 'Assigned to Sub-Divisional Labour Inspector' : 'Pending Inspector review'}</div>
            </div>
            <div class="timeline-step ${record.status === 'notice_issued' || record.status === 'resolved' ? 'completed' : 'pending'}">
              <div class="timeline-dot">${record.status === 'notice_issued' || record.status === 'resolved' ? '✓' : '3'}</div>
              <div class="timeline-step-title">3. Statutory Show-Cause Notice Dispatched <span class="hi-bracket">(ठेकेदार को नोटिस)</span></div>
              <div class="timeline-step-time">${record.officerNotes || 'Pending'}</div>
            </div>
            <div class="timeline-step ${record.status === 'resolved' ? 'completed' : 'pending'}">
              <div class="timeline-dot">${record.status === 'resolved' ? '✓' : '4'}</div>
              <div class="timeline-step-title">4. Wage Recovery & Dispute Resolution <span class="hi-bracket">(विधिक समाधान)</span></div>
              <div class="timeline-step-time">${record.status === 'resolved' ? 'Resolved' : 'In Progress'}</div>
            </div>
          </div>
        </div>
      `;

      SpeechNarrator.speak(
        `Status for ticket ${record.ticketId}: ${record.statusText}. Action is in progress under District Labour Cell.`
      );
    });
  }

  // 9. Contractor Vetting & Ratings Setup
  GrievanceModule.renderContractorList();

  const searchContractorInput = document.getElementById('searchContractorInput');
  if (searchContractorInput) {
    searchContractorInput.addEventListener('input', () => {
      GrievanceModule.renderContractorList(searchContractorInput.value);
    });
  }

  const btnOpenRateModal = document.getElementById('btnOpenRateModal');
  const rateContractorModal = document.getElementById('rateContractorModal');
  if (btnOpenRateModal && rateContractorModal) {
    btnOpenRateModal.addEventListener('click', () => {
      rateContractorModal.classList.add('open');
    });
  }

  const formRateContractor = document.getElementById('formRateContractor');
  if (formRateContractor) {
    formRateContractor.addEventListener('submit', (e) => {
      e.preventDefault();
      const contractorName = document.getElementById('rateModalThekedarName').value;
      const trade = document.getElementById('rateModalTrade').value;
      const city = document.getElementById('rateModalCity').value;
      const rating = document.getElementById('rateModalStars').value;
      const feedback = document.getElementById('rateModalFeedback').value;

      if (!contractorName) {
        showToast('Please provide Contractor Name (ठेकेदार का नाम दर्ज करें)', 'danger');
        return;
      }

      GrievanceModule.addContractorReview({
        contractorName,
        trade,
        city,
        rating,
        feedback
      });

      rateContractorModal.classList.remove('open');
      formRateContractor.reset();
      showToast('Contractor review saved anonymously! (समीक्षा सफलतापूर्वक दर्ज हुई)', 'success');
    });
  }

  // 10. Inspector / Admin Demonstration Modal
  const btnToggleAdmin = document.getElementById('btnToggleAdmin');
  const adminModal = document.getElementById('adminModal');
  if (btnToggleAdmin && adminModal) {
    btnToggleAdmin.addEventListener('click', () => {
      renderAdminDashboard();
      adminModal.classList.add('open');
    });
  }

  // 11. Modal Close Handling
  document.querySelectorAll('.btn-close-modal, .btn-modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    }
  });

  // Print button in Slip Modal
  const btnTriggerPrint = document.getElementById('btnTriggerPrint');
  if (btnTriggerPrint) {
    btnTriggerPrint.addEventListener('click', () => {
      window.print();
    });
  }
});

function showTicketReceiptModal(ticket) {
  const modal = document.getElementById('ticketModal');
  const content = document.getElementById('ticketModalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="text-align: center; padding: 1rem 0;">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">🛡️</div>
      <h3 style="font-size: var(--fs-xl); color: #0284c7; margin-bottom: 0.25rem;">Whistleblower Report Submitted! <span class="hi-bracket">(गोपनीय शिकायत दर्ज)</span></h3>
      <p style="font-size: 0.85rem; color: var(--color-text-muted);">
        Your identity is 100% cryptographically sanitized. <span class="hi-bracket">(आपकी पहचान पूरी तरह सुरक्षित है।)</span>
      </p>

      <div class="ticket-receipt-card" style="margin: 1.25rem auto; max-width: 380px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #0284c7;">
          Confidential Tracking Ticket <span class="hi-bracket">(ट्रैकिंग टिकट नंबर)</span>
        </span>
        <div class="ticket-id-display" style="justify-content: center; margin: 0.35rem 0;">
          ${ticket.ticketId}
        </div>
        <p style="font-size: 0.8rem; color: var(--color-text-muted);">
          Preserve this ticket token. Use it in the tracker card to monitor enforcement updates.
        </p>
      </div>

      <div style="background: var(--color-bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; text-align: left;">
        <div><strong>Contractor <span class="hi-bracket">(ठेकेदार)</span>:</strong> ${ticket.contractor}</div>
        <div><strong>Category <span class="hi-bracket">(श्रेणी)</span>:</strong> ${ticket.categoryText}</div>
        <div><strong>Date <span class="hi-bracket">(तारीख)</span>:</strong> ${ticket.date}</div>
        <div><strong>Status <span class="hi-bracket">(स्थिति)</span>:</strong> <span class="badge badge-due">${ticket.statusText}</span></div>
      </div>
    </div>
  `;

  modal.classList.add('open');

  SpeechNarrator.speak(
    `Your anonymous grievance has been registered. Your confidential ticket ID is ${ticket.ticketId}. Please preserve this number. आपकी गुप्त शिकायत दर्ज हो गई है। टिकट नंबर है ${ticket.ticketId}।`
  );
}

function renderAdminDashboard() {
  const container = document.getElementById('adminModalContent');
  if (!container) return;

  const grievances = GrievanceModule.getGrievances();

  container.innerHTML = `
    <div>
      <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem;">
        👔 <strong>Labour Officer Evaluation Portal <span class="hi-bracket">(श्रम अधिकारी दृश्य)</span>:</strong> 
        Demonstrates client-side worker anonymization and enforcement dispatch workflow for viva evaluation.
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${grievances.map(g => `
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.85rem; background: var(--color-bg-surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
              <div>
                <strong style="font-family: var(--font-mono); color: #0284c7;">${g.ticketId}</strong> · 
                <span style="font-size: 0.8rem; color: var(--color-text-muted);">${g.date}</span>
              </div>
              <span class="badge ${g.status === 'notice_issued' ? 'badge-due' : 'badge-verified'}">${g.statusText}</span>
            </div>
            <div style="font-size: 0.85rem;">
              <strong>👷 Contractor / Site <span class="hi-bracket">(ठेकेदार)</span>:</strong> ${g.contractor} (📍 ${g.location})<br>
              <strong>⚠️ Allegation <span class="hi-bracket">(आरोप)</span>:</strong> ${g.categoryText}<br>
              <strong>📝 Details <span class="hi-bracket">(विवरण)</span>:</strong> ${g.description}<br>
              <strong>🔒 Worker Identity <span class="hi-bracket">(पहचान)</span>:</strong> <code style="background: #f1f5f9; padding: 2px 4px; border-radius: 3px;">${g.workerName} (${g.contact})</code>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #1e293b; background: #f8fafc; padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border-left: 3px solid #0284c7;">
              <strong>⚖️ Enforcement Officer Note <span class="hi-bracket">(विधिक नोट)</span>:</strong> ${g.officerNotes}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
