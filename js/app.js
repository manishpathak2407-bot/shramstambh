/**
 * SHRAM STAMBH (श्रम स्तंभ) - Main Application Controller
 * Bilingual DOM Engine, Tab Routing, Event Orchestration & UI State
 */

window.currentLocale = localStorage.getItem('shram_lang') || 'hi';

const I18N_DICTIONARY = {
  hi: {
    app_title: "श्रम स्तंभ",
    app_subtitle: "असंगठित कामगार कल्याण व विधिक अधिकार मंच",
    badge_emergency: "श्रम हेल्पलाइन: 14434",
    tab_khata: "खाता",
    tab_khata_sub: "डिजिटल लेजर",
    tab_verify: "जांचें",
    tab_verify_sub: "कानूनी मजदूरी",
    tab_contractors: "रेटिंग",
    tab_contractors_sub: "ठेकेदार साख",
    tab_grievance: "शिकायत",
    tab_grievance_sub: "गोपनीय केंद्र",
    btn_listen: "सुनिए",
    btn_stop_audio: "आवाज बंद करें",
    audio_playing_ticker: "श्रम स्तंभ ऑडियो उद्घोषक सक्रिय है...",
    
    // Khata Tab
    khata_banner_title: "📋 डिजिटल दैनिक मजदूरी खाता",
    khata_banner_sub: "रोज़ की मजदूरी और एडवांस का पक्का डिजिटल हिसाब रखें।",
    stat_total_earned: "कुल अर्जित मजदूरी",
    stat_total_advance: "प्राप्त एडवांस",
    stat_total_due: "कुल बाकी बकाया",
    stat_total_days: "कुल दर्ज कार्य दिवस",
    form_log_work_title: "नया काम दर्ज करें (Log Work)",
    lbl_date: "काम की तारीख",
    lbl_thekedar: "ठेकेदार का नाम / मुंशी",
    ph_thekedar: "उदा. रमेश ठेकेदार, गुप्ता कंस्ट्रक्शन",
    lbl_site: "साइट / कार्यस्थल का नाम",
    ph_site: "उदा. एपेक्स टॉवर 4, मेट्रो पिलर 104",
    lbl_role: "काम की श्रेणी (Role)",
    opt_unskilled: "अकुशल मजदूर / हेल्पर / बेलदार",
    opt_semiskilled: "अर्ध-कुशल / सहायक राजमिस्त्री",
    opt_skilled: "कुशल कारीगर / राजमिस्त्री / बढ़ई / प्लंबर",
    opt_highlyskilled: "उच्च कुशल / सुपरवाइजर / फोरमैन",
    lbl_wage: "तय दैनिक मजदूरी (₹)",
    lbl_advance: "आज मिला एडवांस (₹)",
    lbl_notes: "काम का विवरण व टिप्पणी",
    ph_notes: "उदा. 2 घंटे ओवरटाइम किया, सीमेंट मिक्सिंग",
    btn_save_work: "💾 हिसाब सेव करें (Save Entry)",
    recent_slips_title: "बाकी हिसाब पर्चियां (Balance Records)",
    filter_all: "सभी रिकॉर्ड",
    filter_due: "केवल बकाया",
    filter_paid: "केवल चुकता",
    ph_search_records: "ठेकेदार या साइट से खोजें...",
    
    // Verify Tab
    verify_banner_title: "⚖️ कानूनी मजदूरी जांच केंद्र",
    verify_banner_sub: "अपने राज्य की सरकारी न्यूनतम मजदूरी से ठेकेदार की दर जांचें।",
    calculator_card_title: "सरकारी न्यूनतम मजदूरी कैलकुलेटर",
    lbl_select_state: "राज्य चुनें (Select State)",
    lbl_offered_wage: "ठेकेदार द्वारा ऑफर की गई दैनिक मजदूरी (₹)",
    ph_offered_wage: "उदा. 500",
    btn_audit_wage: "⚖️ कानूनी जांच करें (Verify Rate)",
    statutory_reference_title: "सरकारी न्यूनतम मजदूरी दर सूची (BOCW Floor Rates)",
    rights_card_title: "असंगठित व प्रवासी कामगारों के 5 मौलिक अधिकार",
    
    // Contractors Tab
    contractors_banner_title: "👷 ठेकेदार डायरेक्टरी व जन-समीक्षा",
    contractors_banner_sub: "काम लेने से पहले ठेकेदार की साख, समय पर भुगतान और सुरक्षा जांचें।",
    btn_rate_new_contractor: "+ ठेकेदार को रेटिंग दें",
    ph_search_contractor: "ठेकेदार, शहर या काम के प्रकार से खोजें...",
    
    // Grievance Tab
    grievance_banner_title: "🛡️ गुप्त शिकायत केंद्र (Whistleblower Portal)",
    grievance_banner_sub: "100% गोपनीय व सुरक्षित। आपकी पहचान कभी उजागर नहीं होगी।",
    shield_banner_title: "पूर्ण पहचान सुरक्षा (Zero-Retaliation Guarantee)",
    shield_banner_desc: "आपका नाम, फोन व पहचान पूरी तरह गोपनीय रखी जाती है। ठेकेदार को आपकी जानकारी कभी नहीं दी जाती।",
    form_grievance_title: "शोषण या मजदूरी चोरी की रिपोर्ट दर्ज करें",
    lbl_grievance_contractor: "आरोपी ठेकेदार / साइट का नाम",
    ph_grievance_contractor: "उदा. शर्मा इंफ्रास्ट्रक्चर / मॉल कंस्ट्रक्शन साइट",
    lbl_grievance_location: "घटना स्थल / शहर",
    ph_grievance_location: "उदा. सेक्टर 62, नोएडा, उत्तर प्रदेश",
    lbl_grievance_category: "शिकायत का प्रकार (Category)",
    opt_cat_wage_theft: "मजदूरी नहीं दी या कम दी (Wage Theft)",
    opt_cat_docs: "आधार कार्ड या दस्तावेज जब्ती (Confiscated ID)",
    opt_cat_unsafe: "असुरक्षित कार्यस्थल व बिना सेफ्टी किट (Unsafe Site)",
    opt_cat_harassment: "धमकी या शारीरिक/मानसिक प्रताड़ना (Abuse/Harassment)",
    opt_cat_overtime: "बिना भुगतान 12-14 घंटे काम (Forced Unpaid Overtime)",
    lbl_grievance_details: "घटना का पूरा विवरण",
    ph_grievance_details: "विस्तार से बताएं: कितने मजदूरों का पैसा रुका है, कब से काम कर रहे हैं...",
    lbl_anonymous_toggle_title: "मेरी पहचान 100% गुप्त रखें (Keep Identity Anonymous)",
    lbl_anonymous_toggle_desc: "सिस्टम आपके फोन नंबर व नाम को हटाकर केवल क्रिप्टोग्राफिक टिकट जारी करेगा।",
    btn_submit_grievance: "📢 गुप्त शिकायत भेजें (Submit Report)",
    track_card_title: "शिकायत स्थिति जांचें (Track Ticket ID)",
    ph_enter_ticket: "उदा. #SH-9042",
    btn_track_ticket: "🔍 स्थिति देखें (Track)",
    btn_toggle_admin: "👔 श्रम अधिकारी डैशबोर्ड (Inspector Demo View)"
  },
  en: {
    app_title: "Shram Stambh",
    app_subtitle: "Client-Side Welfare & Legal Infrastructure for Migrant Labor",
    badge_emergency: "Labour Helpline: 14434",
    tab_khata: "Ledger",
    tab_khata_sub: "Wage Khata",
    tab_verify: "Audit",
    tab_verify_sub: "Legal Wages",
    tab_contractors: "Vetting",
    tab_contractors_sub: "Thekedar Ratings",
    tab_grievance: "Grievance",
    tab_grievance_sub: "Whistleblower",
    btn_listen: "Listen",
    btn_stop_audio: "Stop Audio",
    audio_playing_ticker: "Shram Stambh Audio Narrator is actively reading...",
    
    // Khata Tab
    khata_banner_title: "📋 Digital Daily Wage Ledger (Khata)",
    khata_banner_sub: "Maintain tamper-evident digital records of agreed wages and advance payments.",
    stat_total_earned: "Total Wages Earned",
    stat_total_advance: "Advance Received",
    stat_total_due: "Net Balance Due",
    stat_total_days: "Days Recorded",
    form_log_work_title: "Log Daily Work Entry",
    lbl_date: "Date of Work",
    lbl_thekedar: "Contractor Name / Munshi",
    ph_thekedar: "e.g. Ramesh Thekedar, Apex Builders",
    lbl_site: "Worksite / Project Name",
    ph_site: "e.g. Apex Tower 4, Metro Pillar 104",
    lbl_role: "Skill Category (Role)",
    opt_unskilled: "Unskilled Labourer / Helper / Beldar",
    opt_semiskilled: "Semi-Skilled / Assistant Mason",
    opt_skilled: "Skilled Mason / Carpenter / Electrician",
    opt_highlyskilled: "Highly Skilled / Site Supervisor / Foreman",
    lbl_wage: "Agreed Daily Wage (₹)",
    lbl_advance: "Advance Received Today (₹)",
    lbl_notes: "Work Details & Notes",
    ph_notes: "e.g. 2 hours overtime, shuttering work block C",
    btn_save_work: "💾 Save Entry to Ledger",
    recent_slips_title: "Balance Slips & Work Entries",
    filter_all: "All Records",
    filter_due: "Due Only",
    filter_paid: "Paid Only",
    ph_search_records: "Search by contractor or worksite...",
    
    // Verify Tab
    verify_banner_title: "⚖️ Statutory Wage Auditor & BOCW Checker",
    verify_banner_sub: "Cross-validate contractor offers against state statutory minimum wage floors.",
    calculator_card_title: "Statutory Minimum Wage Auditor",
    lbl_select_state: "Select State (राज्य चुनें)",
    lbl_offered_wage: "Contractor Offered Daily Wage (₹)",
    ph_offered_wage: "e.g. 500",
    btn_audit_wage: "⚖️ Verify Statutory Compliance",
    statutory_reference_title: "Official State Minimum Wage Matrix (BOCW)",
    rights_card_title: "5 Core Legal Protections for Migrant Workers",
    
    // Contractors Tab
    contractors_banner_title: "👷 Contractor Directory & Community Vetting",
    contractors_banner_sub: "Vet contractors before accepting a job. Inspect timely payment scores and safety grades.",
    btn_rate_new_contractor: "+ Rate a Contractor",
    ph_search_contractor: "Search by thekedar, city or trade...",
    
    // Grievance Tab
    grievance_banner_title: "🛡️ Gupt Shikayat Kendra (Whistleblower Portal)",
    grievance_banner_sub: "100% Anonymous & Retaliation-Proof. Your identity is cryptographically sanitized.",
    shield_banner_title: "Zero Retaliation Guarantee",
    shield_banner_desc: "Worker identity keys are stripped before storage. Unique tracking hashes protect against blacklisting.",
    form_grievance_title: "Report Wage Theft, Confiscation or Abuse",
    lbl_grievance_contractor: "Accused Contractor / Worksite",
    ph_grievance_contractor: "e.g. Sharma Infrastructure / Metro Flyover Site",
    lbl_grievance_location: "Incident Location / City",
    ph_grievance_location: "e.g. Sector 62, Noida, Uttar Pradesh",
    lbl_grievance_category: "Violation Category",
    opt_cat_wage_theft: "Unpaid / Slashed Wages (Wage Theft)",
    opt_cat_docs: "Withheld Aadhaar / Personal Documents",
    opt_cat_unsafe: "Unsafe Worksite / No Safety Equipment",
    opt_cat_harassment: "Verbal Threats / Physical Harassment",
    opt_cat_overtime: "Forced Unpaid Overtime (12-14 hr shifts)",
    lbl_grievance_details: "Detailed Incident Description",
    ph_grievance_details: "Provide details: number of affected workers, pending days, site location...",
    lbl_anonymous_toggle_title: "Keep Identity 100% Anonymous (मेरी पहचान छुपाएं)",
    lbl_anonymous_toggle_desc: "Client-side sanitizer strips personal details and generates an isolated ticket hash.",
    btn_submit_grievance: "📢 Submit Whistleblower Report",
    track_card_title: "Track Grievance Status (Ticket ID)",
    ph_enter_ticket: "e.g. #SH-9042",
    btn_track_ticket: "🔍 Track Status",
    btn_toggle_admin: "👔 Labour Officer Dashboard (Inspector Demo)"
  }
};

/**
 * Apply Language Strings to DOM
 */
function setLanguage(lang) {
  window.currentLocale = lang;
  localStorage.setItem('shram_lang', lang);
  document.documentElement.lang = lang;

  const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.hi;

  // Replace text in [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Replace placeholders in [data-i18n-placeholder]
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Update Language Button label
  const langBtn = document.getElementById('btnLangToggle');
  if (langBtn) {
    langBtn.innerHTML = lang === 'hi' ? '🌐 English' : '🌐 हिंदी';
  }

  // Re-render dependent dynamic lists
  if (window.WageTracker) {
    WageTracker.render();
    const stateSelect = document.getElementById('auditStateSelect');
    if (stateSelect) {
      WageTracker.renderStatutoryTable(stateSelect.value || 'Delhi');
    }
  }
  if (window.GrievanceModule) {
    GrievanceModule.renderContractorList();
  }
}

/**
 * Switch Active View Tab
 */
function switchTab(tabId) {
  // Update nav buttons
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-tab') === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update view panels
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
  // 1. Initialize Language
  setLanguage(window.currentLocale);

  // 2. Language Toggle Button
  const langBtn = document.getElementById('btnLangToggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = window.currentLocale === 'hi' ? 'en' : 'hi';
      setLanguage(nextLang);
      showToast(nextLang === 'en' ? 'Switched to English' : 'हिंदी भाषा चुनी गई');
    });
  }

  // 3. High Contrast Mode Toggle
  const contrastBtn = document.getElementById('btnContrastToggle');
  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHigh = document.body.classList.contains('high-contrast');
      contrastBtn.classList.toggle('active', isHigh);
      showToast(isHigh 
        ? (window.currentLocale === 'en' ? 'High Contrast: ON (Field Mode)' : 'हाई कंट्रास्ट: चालू (धूप व निर्माण स्थल मोड)') 
        : (window.currentLocale === 'en' ? 'High Contrast: OFF' : 'हाई कंट्रास्ट: बंद'));
    });
  }

  // 4. Large Font Mode Toggle
  const fontBtn = document.getElementById('btnFontToggle');
  if (fontBtn) {
    fontBtn.addEventListener('click', () => {
      document.body.classList.toggle('large-font');
      const isLarge = document.body.classList.contains('large-font');
      fontBtn.classList.toggle('active', isLarge);
      showToast(isLarge 
        ? (window.currentLocale === 'en' ? 'Large Text: ON' : 'बड़ा फॉन्ट: चालू') 
        : (window.currentLocale === 'en' ? 'Large Text: OFF' : 'बड़ा फॉन्ट: सामान्य'));
    });
  }

  // 5. Speech Audio Stop Button
  const btnStopSpeech = document.getElementById('btnStopSpeech');
  if (btnStopSpeech) {
    btnStopSpeech.addEventListener('click', () => {
      SpeechNarrator.stop();
    });
  }

  // 6. Section Narrator Buttons
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

  // 7. Navigation Tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // 8. Initialize Wage Tracker Data
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
        showToast(window.currentLocale === 'en' ? 'Please enter Contractor name and Agreed Wage' : 'कृपया ठेकेदार का नाम और तय मजदूरी दर्ज करें', 'danger');
        return;
      }

      WageTracker.addRecord({ date, contractor: thekedar, site, role, wage, advance, notes });

      showToast(window.currentLocale === 'en' ? 'Daily work entry saved to Khata!' : 'दैनिक काम का हिसाब सफलतापूर्वक सेव हो गया!', 'success');

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

  // 9. Statutory Legal Auditor Setup
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
        showToast(window.currentLocale === 'en' ? 'Please enter a valid offered wage amount' : 'कृपया वैध मजदूरी राशि दर्ज करें', 'danger');
        return;
      }

      const audit = WageTracker.auditOfferedWage(state, skill, offered);
      if (!audit) return;

      const isHi = window.currentLocale !== 'en';

      if (audit.isViolation) {
        auditResultBox.innerHTML = `
          <div class="alert-box alert-danger">
            <div class="alert-header">
              <span>⚠️</span>
              <span>${isHi ? 'मजदूरी चोरी अलर्ट! (WAGE THEFT DETECTED)' : 'WAGE THEFT DETECTED!'}</span>
            </div>
            <div class="alert-body">
              <p>
                ${isHi ? 'प्रस्तावित मजदूरी' : 'Offered Wage'}: <strong>₹${audit.offeredRate} / दिन</strong> · 
                ${audit.stateName} ${isHi ? 'में वैधानिक न्यूनतम दर' : 'Statutory Minimum Floor'}: <strong>₹${audit.legalRate} / दिन</strong>
              </p>
              <div class="theft-calc-breakdown">
                <div class="calc-pill">
                  <span class="calc-pill-label">${isHi ? 'दैनिक नुकसान' : 'Daily Loss'}</span>
                  <span class="calc-pill-val">₹${audit.difference} / दिन</span>
                </div>
                <div class="calc-pill">
                  <span class="calc-pill-label">${isHi ? 'मासिक चोरी (26 दिन)' : 'Monthly Theft (26d)'}</span>
                  <span class="calc-pill-val">₹${audit.monthlyTheft.toLocaleString('en-IN')}</span>
                </div>
                <div class="calc-pill">
                  <span class="calc-pill-label">${isHi ? 'वार्षिक नुकसान' : 'Annual Deprivation'}</span>
                  <span class="calc-pill-val">₹${audit.annualTheft.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p style="font-size: 0.8rem; margin-top: 0.4rem;">
                ⚖️ <strong>${isHi ? 'कानूनी उल्लंघन' : 'Legal Violation'}:</strong> ${audit.act} के तहत कानूनी न्यूनतम मजदूरी से कम भुगतान करना दंडनीय अपराध है।
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;">
                <a href="tel:${audit.helpline}" class="btn btn-danger" style="flex: 1; min-width: 180px;">
                  📞 ${isHi ? 'लेबर हेल्पलाइन' : 'Call Labour Helpline'} ${audit.helpline}
                </a>
                <button class="btn btn-secondary btn-jump-report" data-state="${audit.state}" style="flex: 1; min-width: 180px;">
                  🚨 ${isHi ? 'इस ठेकेदार की गुप्त रिपोर्ट करें' : 'File Anonymous Whistleblower Report'}
                </button>
              </div>
            </div>
          </div>
        `;

        // Read breach out loud for low literacy
        SpeechNarrator.speak(
          isHi 
            ? `मजदूरी चोरी अलर्ट! इस राज्य में कानूनी न्यूनतम दर ₹${audit.legalRate} है। आपको ₹${audit.difference} प्रतिदिन कम दिया जा रहा है। हेल्पलाइन 14434 पर कॉल करें या गुप्त रिपोर्ट करें।`
            : `Wage theft detected! Statutory minimum is ₹${audit.legalRate} per day. You are being underpaid by ₹${audit.difference} daily. Call labour helpline 14434.`,
          { lang: isHi ? 'hi' : 'en' }
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
              descArea.value = `${audit.state} mein statutory rate ₹${audit.legalRate} ki jagah sirf ₹${audit.offeredRate} offer kiya ja raha hai (Difference: ₹${audit.difference}/day).`;
            }
            showToast(isHi ? 'विवरण गुप्त शिकायत फॉर्म में जोड़ दिया गया' : 'Audit details transferred to Whistleblower form');
          });
        }

      } else {
        auditResultBox.innerHTML = `
          <div class="alert-box alert-success">
            <div class="alert-header">
              <span>✅</span>
              <span>${isHi ? 'कानूनी रूप से मान्य मजदूरी (Compliant Rate)' : 'Statutory Wage Compliant'}</span>
            </div>
            <div class="alert-body">
              <p>
                ${isHi ? 'प्रस्तावित मजदूरी' : 'Offered Wage'} <strong>₹${audit.offeredRate} / दिन</strong>, 
                ${audit.stateName} ${isHi ? 'की न्यूनतम दर' : 'statutory floor of'} <strong>₹${audit.legalRate} / दिन</strong> ${isHi ? 'के अनुरूप या अधिक है।' : 'meets or exceeds the legal rate.'}
              </p>
              <p style="font-size: 0.8rem; margin-top: 0.3rem;">
                🛡️ ${isHi ? 'यह दर न्यूनतम मजदूरी कानून 1948 व BOCW नियमों के अनुरूप है।' : 'This offer satisfies statutory compliance under the Minimum Wages Act 1948.'}
              </p>
            </div>
          </div>
        `;

        SpeechNarrator.speak(
          isHi 
            ? `बधाई! प्रस्तावित मजदूरी सरकारी न्यूनतम दर ₹${audit.legalRate} के अनुरूप या अधिक है।`
            : `Compliant! Offered wage meets or exceeds the statutory rate of ₹${audit.legalRate} per day.`,
          { lang: isHi ? 'hi' : 'en' }
        );
      }
    });
  }

  // 10. Grievance Module Form & Tracking
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
        showToast(window.currentLocale === 'en' ? 'Please enter Contractor name and details' : 'कृपया ठेकेदार का नाम और विवरण दर्ज करें', 'danger');
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

      // Reset form
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
        showToast(window.currentLocale === 'en' ? 'Please enter a Ticket ID (e.g. #SH-9042)' : 'कृपया टिकट नंबर दर्ज करें (उदा. #SH-9042)', 'danger');
        return;
      }

      const record = GrievanceModule.trackTicket(tid);
      const isHi = window.currentLocale !== 'en';

      if (!record) {
        trackResultContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <p><strong>${isHi ? 'टिकट नहीं मिला!' : 'Ticket ID not found.'}</strong></p>
            <p class="form-hint">${isHi ? 'कृपया टिकट नंबर जांचें। (उदाहरण: #SH-9042)' : 'Please verify the ticket token. (e.g. #SH-9042)'}</p>
          </div>
        `;
        return;
      }

      // Render Status Timeline
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
              ${isHi ? record.statusTextHi : record.statusTextEn}
            </span>
          </div>

          <div style="margin-top: 0.75rem; font-size: 0.85rem; background: var(--color-bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
            <strong>${isHi ? 'शिकायत श्रेणी' : 'Category'}:</strong> ${record.categoryText}<br>
            <strong>${isHi ? 'विवरण' : 'Details'}:</strong> ${record.description}<br>
            <strong>${isHi ? 'पहचान स्थिति' : 'Identity Status'}:</strong> <span style="color: var(--color-success); font-weight: 700;">🔒 ${isHi ? '100% गोपनीय व सुरक्षित (Sanitized)' : '100% Anonymous & Sanitized'}</span>
          </div>

          <div class="timeline">
            <div class="timeline-step completed">
              <div class="timeline-dot">✓</div>
              <div class="timeline-step-title">${isHi ? '1. शिकायत प्राप्त व पहचान गुप्त कोडित' : '1. Grievance Sanitized & Registered'}</div>
              <div class="timeline-step-time">${record.date} · System Cryptographic Token Assigned</div>
            </div>
            <div class="timeline-step ${record.status !== 'submitted' ? 'completed' : 'active'}">
              <div class="timeline-dot">${record.status !== 'submitted' ? '✓' : '2'}</div>
              <div class="timeline-step-title">${isHi ? '2. क्षेत्रीय श्रम अधिकारी (DLC) को प्रेषित' : '2. Dispatched to District Labour Cell'}</div>
              <div class="timeline-step-time">${record.status !== 'submitted' ? 'Assigned to Sub-Divisional Labour Inspector' : 'Pending Inspector review'}</div>
            </div>
            <div class="timeline-step ${record.status === 'notice_issued' || record.status === 'resolved' ? 'completed' : 'pending'}">
              <div class="timeline-dot">${record.status === 'notice_issued' || record.status === 'resolved' ? '✓' : '3'}</div>
              <div class="timeline-step-title">${isHi ? '3. ठेकेदार को वैधानिक नोटिस जारी' : '3. Statutory Show-Cause Notice Dispatched'}</div>
              <div class="timeline-step-time">${record.officerNotes || 'Pending'}</div>
            </div>
            <div class="timeline-step ${record.status === 'resolved' ? 'completed' : 'pending'}">
              <div class="timeline-dot">${record.status === 'resolved' ? '✓' : '4'}</div>
              <div class="timeline-step-title">${isHi ? '4. मजदूरी वसूली / विधिक समाधान' : '4. Wage Recovery & Dispute Resolution'}</div>
              <div class="timeline-step-time">${record.status === 'resolved' ? 'Resolved' : 'In Progress'}</div>
            </div>
          </div>
        </div>
      `;

      SpeechNarrator.speak(
        isHi 
          ? `टिकट ${record.ticketId} की स्थिति: ${record.statusTextHi}। श्रम अधिकारी द्वारा जांच की जा रही है।`
          : `Status for ticket ${record.ticketId}: ${record.statusTextEn}.`,
        { lang: isHi ? 'hi' : 'en' }
      );
    });
  }

  // 11. Contractor Vetting & Ratings Setup
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
        showToast(window.currentLocale === 'en' ? 'Please provide contractor name' : 'कृपया ठेकेदार का नाम दर्ज करें', 'danger');
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
      showToast(window.currentLocale === 'en' ? 'Contractor review saved anonymously!' : 'ठेकेदार की समीक्षा सफलतापूर्वक दर्ज हो गई!', 'success');
    });
  }

  // 12. Inspector / Admin Demonstration Modal
  const btnToggleAdmin = document.getElementById('btnToggleAdmin');
  const adminModal = document.getElementById('adminModal');
  if (btnToggleAdmin && adminModal) {
    btnToggleAdmin.addEventListener('click', () => {
      renderAdminDashboard();
      adminModal.classList.add('open');
    });
  }

  // 13. General Modal Close Handling
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

  // Handle ESC key to dismiss modals
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

  const isHi = window.currentLocale !== 'en';

  content.innerHTML = `
    <div style="text-align: center; padding: 1rem 0;">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">🛡️</div>
      <h3 style="font-size: var(--fs-xl); color: #0284c7; margin-bottom: 0.25rem;">${isHi ? 'गोपनीय शिकायत सफलतापूर्वक दर्ज!' : 'Whistleblower Report Submitted!'}</h3>
      <p style="font-size: 0.85rem; color: var(--color-text-muted);">
        ${isHi ? 'आपकी पहचान 100% सुरक्षित और गोपनीय है।' : 'Your identity is cryptographically sanitized.'}
      </p>

      <div class="ticket-receipt-card" style="margin: 1.25rem auto; max-width: 380px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #0284c7;">
          ${isHi ? 'आपका ट्रैकिंग टिकट नंबर' : 'Confidential Tracking Ticket'}
        </span>
        <div class="ticket-id-display" style="justify-content: center; margin: 0.35rem 0;">
          ${ticket.ticketId}
        </div>
        <p style="font-size: 0.8rem; color: var(--color-text-muted);">
          ${isHi ? 'इस टिकट नंबर को संभाल कर रखें। इससे आप जांच की स्थिति देख सकते हैं।' : 'Save this ticket token. Use it in the grievance tracker to view updates.'}
        </p>
      </div>

      <div style="background: var(--color-bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; text-align: left;">
        <div><strong>${isHi ? 'ठेकेदार' : 'Contractor'}:</strong> ${ticket.contractor}</div>
        <div><strong>${isHi ? 'श्रेणी' : 'Category'}:</strong> ${ticket.categoryText}</div>
        <div><strong>${isHi ? 'तारीख' : 'Date'}:</strong> ${ticket.date}</div>
        <div><strong>${isHi ? 'स्थिति' : 'Status'}:</strong> <span class="badge badge-due">${ticket.statusTextHi}</span></div>
      </div>
    </div>
  `;

  modal.classList.add('open');

  SpeechNarrator.speak(
    isHi 
      ? `आपकी गुप्त शिकायत दर्ज हो गई है। आपका टिकट नंबर है ${ticket.ticketId}। यह नंबर संभाल कर रखें।`
      : `Your anonymous grievance is registered. Ticket ID is ${ticket.ticketId}. Please preserve this number.`,
    { lang: isHi ? 'hi' : 'en' }
  );
}

function renderAdminDashboard() {
  const container = document.getElementById('adminModalContent');
  if (!container) return;

  const grievances = GrievanceModule.getGrievances();
  const isHi = window.currentLocale !== 'en';

  container.innerHTML = `
    <div>
      <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem;">
        👔 <strong>${isHi ? 'श्रम प्रवर्तन अधिकारी दृश्य' : 'Labour Officer Evaluation Portal'}:</strong> 
        ${isHi ? 'यह दृश्य दिखाता है कि कैसे सिस्टम असंगठित मजदूरों की पहचान छुपाते हुए शिकायतों को विधिक कार्रवाई हेतु प्रोसेस करता है।' : 'Demonstrates client-side anonymization and enforcement dispatch workflow for viva evaluation.'}
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${grievances.map(g => `
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.85rem; background: var(--color-bg-surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
              <div>
                <strong style="font-family: var(--font-mono); color: #0284c7;">${g.ticketId}</strong> · 
                <span style="font-size: 0.8rem; color: var(--color-text-muted);">${g.date}</span>
              </div>
              <span class="badge ${g.status === 'notice_issued' ? 'badge-due' : 'badge-verified'}">${g.statusTextHi}</span>
            </div>
            <div style="font-size: 0.85rem;">
              <strong>👷 ${isHi ? 'ठेकेदार/साइट' : 'Contractor/Site'}:</strong> ${g.contractor} (📍 ${g.location})<br>
              <strong>⚠️ ${isHi ? 'आरोप' : 'Allegation'}:</strong> ${g.categoryText}<br>
              <strong>📝 ${isHi ? 'विवरण' : 'Details'}:</strong> ${g.description}<br>
              <strong>🔒 ${isHi ? 'कामगार पहचान' : 'Worker Identity'}:</strong> <code style="background: #f1f5f9; padding: 2px 4px; border-radius: 3px;">${g.workerName} (${g.contact})</code>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #1e293b; background: #f8fafc; padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border-left: 3px solid #0284c7;">
              <strong>⚖️ ${isHi ? 'अधिकारी विधिक नोट' : 'Officer Enforcement Note'}:</strong> ${g.officerNotes}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
