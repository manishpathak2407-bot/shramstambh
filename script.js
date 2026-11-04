/**
 * ==============================================================================
 * SHRAM STAMBH (श्रम स्तंभ) - Unified Client-Side Welfare & Legal Infrastructure
 * ==============================================================================
 * Single consolidated script powering all client-side welfare & legal operations:
 * 
 * 1. CORE UTILITIES & HELPERS
 *    - HTML Sanitization (XSS Defense)
 *    - Date & Currency Formatters
 *    - Toast Notification Engine
 *    - Tab Switching & View Routing
 * 
 * 2. SPEECH & ACOUSTIC NARRATOR ENGINE (W3C SpeechSynthesis)
 *    - Native text-to-speech for low-literacy migrant workers (0 KB runtime, ₹0 cost)
 *    - Bilingual acoustic voices: Indian English ('en-IN') & Pure Hindi ('hi-IN')
 *    - Voice toggle & active speech state indicators
 * 
 * 3. BILINGUAL INTERNATIONALIZATION ENGINE (i18n)
 *    - Dynamic client-side DOM translation (English + Bracketed Hindi vs Pure Hindi)
 *    - LocalStorage persistence
 * 
 * 4. DIGITAL WAGE KHATA & STATUTORY LEGAL AUDITOR
 *    - Daily wage ledger CRUD (Agreed wage, advance, balance due, payment status)
 *    - Real-time financial KPI aggregators
 *    - Admissible paper wage slip generator with SVG verification QR
 *    - Statutory Minimum Wage Matrix for 8 Indian States (BOCW compliance)
 *    - Wage Theft derivation engine & automated alert dispatcher
 * 
 * 5. ANONYMOUS WHISTLEBLOWER & CONTRACTOR VETTING ENGINE
 *    - Identity sanitization (strips names, phones, IPs)
 *    - Cryptographic ticket token generator (#SH-XXXX)
 *    - Dispute progression tracking timeline
 *    - Contractor directory, weighted community ratings & worksite feedback
 * 
 * 6. UI CONTROLLER, MODAL LIFECYCLES & EVENT ORCHESTRATION
 *    - Single-Page Tab Switching (Home, Khata, Rights, Contractors, Verify, Help)
 *    - Real-time interactive notepad wage calculator with Khata prefill
 *    - High-contrast sunlight mode & large font accessibility toggles
 *    - Inspector / administrative evaluation view modal
 *    - Modal lifecycle managers (Esc key, outside click, close buttons)
 * ==============================================================================
 */

// ==============================================================================
// 1. CORE UTILITIES & HELPERS
// ==============================================================================

/**
 * Sanitize string to prevent Cross-Site Scripting (XSS)
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

/**
 * Format ISO date string (YYYY-MM-DD) into readable format (e.g., 28 Oct 2026)
 */
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

/**
 * Switch Active View Tab
 */
function switchTab(tabId) {
  document.querySelectorAll('.nav-link-btn, .nav-tab').forEach(tab => {
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
 * Lightweight Toast Notification Dispatcher
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


// ==============================================================================
// 2. SPEECH & ACOUSTIC NARRATOR ENGINE (W3C SpeechSynthesis)
// ==============================================================================

const SpeechNarrator = (function () {
  const synth = window.speechSynthesis;
  let currentUtterance = null;
  let isSpeaking = false;
  let activeNarrateBtn = null;

  let currentVoiceLang = 'en-IN'; // 'en-IN' or 'hi-IN'
  let indianEnglishVoice = null;
  let hindiVoice = null;

  function initVoices() {
    if (!synth) return;
    const voices = synth.getVoices();

    // 1. Indian English Voice
    indianEnglishVoice =
      voices.find((v) => v.lang === 'en-IN') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    // 2. Pure Hindi Voice
    hindiVoice =
      voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
      null;
  }

  if (synth) {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = initVoices;
    }
    initVoices();
  }

  const narratives = {
    homeSection:
      "Welcome to Shram Stambh. Your hard work deserves fair pay. Check what you are owed right now on our quick check notebook, maintain an indisputable record of your daily wages, verify state legal minimum wage floors, and seek confidential help when needed. श्रम स्तंभ में आपका स्वागत है। आपकी मेहनत का पूरा और सही हक।",
    khataSection:
      "Welcome to Shram Stambh Digital Wage Ledger. Here you can record your daily agreed wage and advance payments. The system automatically computes your outstanding balance and generates official printable wage slips. श्रम स्तंभ डिजिटल खाता में आपका स्वागत है।",
    verifySection:
      "Statutory Wage Auditor. Select your state and skill tier to verify contractor wages against official legal minimum wage floors. If underpaid, it triggers an instant Wage Theft Alert. कानूनी मजदूरी जांच केंद्र।",
    reviewsSection:
      "Contractor Directory and Community Ratings. Vet contractors before taking a job. Check wage timeliness, safety score, and community feedback. ठेकेदार डायरेक्टरी।",
    grievanceSection:
      "Whistleblower Portal. Submit wage theft or abuse complaints with 100 percent anonymity. Receive a secure tracking ticket ID to monitor enforcement actions. गुप्त शिकायत केंद्र।",
    balanceSlip:
      "This is your legally valid balance wage slip showing employer, agreed wage, advance received, and net balance due. It serves as admissible evidence in labour disputes. यह आपकी कानूनी बकाया हिसाब पर्ची है।"
  };

  const narrativesHindi = {
    homeSection:
      "श्रम स्तंभ में आपका स्वागत है। आपकी मेहनत का पूरा और सही हक। नोटबुक पर तुरंत अपना बकाया हिसाब जांचें, अपनी दैनिक मजदूरी का पक्का रिकॉर्ड रखें, सरकारी न्यूनतम दरें जांचें और जरूरत पड़ने पर गोपनीय मदद प्राप्त करें।",
    khataSection:
      "श्रम स्तंभ डिजिटल मजदूरी खाता में आपका स्वागत है। यहाँ आप अपनी दैनिक तय मजदूरी और प्राप्त एडवांस का पक्का हिसाब रख सकते हैं। सिस्टम आपके बाकी बकाया की स्वतः गणना करता है और विधिक हिसाब पर्ची बनाता है।",
    verifySection:
      "कानूनी मजदूरी जांच केंद्र। अपने राज्य और कारीगरी की श्रेणी चुनकर ठेकेदार की मजदूरी की जांच करें। सरकारी दर से कम होने पर तुरंत मजदूरी चोरी का अलर्ट मिलेगा।",
    reviewsSection:
      "ठेकेदार डायरेक्टरी और रेटिंग। काम शुरू करने से पहले ठेकेदार का पिछला रिकॉर्ड, समय पर भुगतान और सुरक्षा रेटिंग देखें।",
    grievanceSection:
      "गोपनीय व्हिसलब्लोअर पोर्टल। बिना पहचान उजागर किए मजदूरी चोरी की शिकायत दर्ज करें और कार्रवाई की निगरानी के लिए गुप्त टिकट नंबर प्राप्त करें।",
    balanceSlip:
      "यह आपकी कानूनी बकाया मजदूरी पर्ची है। इसमें ठेकेदार का नाम, तय मजदूरी, एडवांस और बाकी बकाया राशि का पूर्ण प्रमाण है।"
  };

  function setVoiceLanguage(lang) {
    if (lang === 'hi' || lang === 'hi-IN') {
      currentVoiceLang = 'hi-IN';
    } else {
      currentVoiceLang = 'en-IN';
    }

    const btnLabel = document.getElementById('voiceBtnLabel');
    if (btnLabel) {
      btnLabel.textContent = currentVoiceLang === 'hi-IN' ? 'आवाज: हिन्दी' : 'Voice: En';
    }
  }

  function getVoiceLanguage() {
    return currentVoiceLang;
  }

  function toggleVoiceLanguage() {
    const newLang = currentVoiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN';
    setVoiceLanguage(newLang);

    showToast(
      newLang === 'hi-IN'
        ? '🗣️ ऑडियो आवाज: हिन्दी (Hindi Voice Active)'
        : '🗣️ Audio Voice: Indian English (English Voice Active)',
      'info'
    );

    speak(
      newLang === 'hi-IN'
        ? 'आवाज अब हिंदी में सेट हो गई है।'
        : 'Voice language is now set to English.'
    );
  }

  function speak(text, options = {}) {
    if (!synth) {
      console.warn("SpeechSynthesis is not supported on this browser.");
      return;
    }

    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    const targetLang = options.lang || currentVoiceLang;
    utterance.lang = targetLang;

    if (targetLang.startsWith('hi')) {
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      if (indianEnglishVoice) utterance.voice = indianEnglishVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const speechBar = document.getElementById('speechBar');
    const speechText = document.getElementById('speechText');
    const triggerBtn = options.triggerBtn || null;

    utterance.onstart = function () {
      isSpeaking = true;
      if (speechBar && speechText) {
        speechText.textContent =
          text.length > 90 ? text.substring(0, 90) + '...' : text;
        speechBar.classList.add('active');
      }
      if (triggerBtn) {
        activeNarrateBtn = triggerBtn;
        triggerBtn.classList.add('speaking');
      }
    };

    utterance.onend = function () {
      cleanUpSpeechState();
    };

    utterance.onerror = function (e) {
      console.warn("Speech error:", e);
      cleanUpSpeechState();
    };

    synth.speak(utterance);
  }

  function cleanUpSpeechState() {
    isSpeaking = false;
    currentUtterance = null;
    const speechBar = document.getElementById('speechBar');
    if (speechBar) speechBar.classList.remove('active');
    if (activeNarrateBtn) {
      activeNarrateBtn.classList.remove('speaking');
      activeNarrateBtn = null;
    }
  }

  function stop() {
    if (synth && synth.speaking) {
      synth.cancel();
    }
    cleanUpSpeechState();
  }

  function narrateKey(key, triggerBtn = null) {
    const textDict = currentVoiceLang.startsWith('hi') ? narrativesHindi : narratives;
    const text = textDict[key] || narratives[key] || null;
    if (text) {
      speak(text, { triggerBtn, lang: currentVoiceLang });
    }
  }

  return {
    speak,
    stop,
    narrateKey,
    setVoiceLanguage,
    getVoiceLanguage,
    toggleVoiceLanguage,
    isSpeaking: () => isSpeaking
  };
})();
window.SpeechNarrator = SpeechNarrator;


// ==============================================================================
// 3. BILINGUAL INTERNATIONALIZATION ENGINE (i18n)
// ==============================================================================

const I18n = (function () {
  let currentLang = 'en';

  const translations = {
    en: {
      navHome: 'Home <span class="hi-bracket">(होम)</span>',
      navKhata: 'Find work <span class="hi-bracket">(काम/खाता)</span>',
      navRights: 'Know your rights <span class="hi-bracket">(अधिकार)</span>',
      navContractors: 'Check a contractor <span class="hi-bracket">(ठेकेदार)</span>',
      navVerify: 'Wage calculator <span class="hi-bracket">(कैलकुलेटर)</span>',
      navGrievance: 'Get help <span class="hi-bracket">(मदद)</span>',

      heroTitle: 'Your hard work<br>deserves fair pay.',
      heroSubHindi: '(आपकी मेहनत का पूरा और सही हक।)',
      heroSubtitle: 'Find work with greater confidence, maintain an indisputable record of your daily wages, verify state legal minimum floors, and discover where to seek confidential help when something goes wrong.',
      btnFindWork: 'Find work <span class="hi-bracket">(काम खोजें व हिसाब)</span>',
      btnReportIssue: 'Report a wage issue <span class="hi-bracket">(मजदूरी चोरी की रिपोर्ट)</span>',
      btnListenPage: '<span>🔊</span> <span>Listen to this page</span> <span class="hi-bracket">(सुनिए)</span>',

      quickCheckTitle: 'Quick check: what are you owed?',
      quickCheckSub: '(तुरंत अपना बाकी हिसाब जांचें)',
      labelWageAgreed: 'Daily wage agreed <span class="hi-bracket">(तय दैनिक मजदूरी)</span>',
      labelDaysWorked: 'Days worked <span class="hi-bracket">(काम के दिन)</span>',
      labelAdvanceReceived: 'Money received so far <span class="hi-bracket">(मिला हुआ एडवांस)</span>',
      labelEarned: 'You earned <span class="hi-bracket">(कुल कमाई)</span>',
      labelOwed: 'Still owed to you <span class="hi-bracket">(बाकी बकाया)</span>',
      notepadHint: 'Fill in the three lines above to see the amount automatically.',
      notepadAction: '<u>Add overtime and keep a record ➔</u>',
      notepadPrivacy: 'Nothing you type here is saved. Runs 100% privately on your device.',

      gatewaySectionTitle: 'Everything you need to protect your labor and wages',
      gatewaySectionSubtitle: "Explore Shram Stambh's four dedicated civic modules built for unorganized workers.",
      gw1Title: 'Wage Khata &amp; Slip Engine <span class="hi-bracket">(दैनिक हिसाब)</span>',
      gw1Desc: 'Log daily agreed wages, partial advance payments, and calculate net dues with automated printable balance slips featuring QR verification.',
      gw1Link: 'Open Wage Ledger ➔',
      gw2Title: 'Statutory Wage Auditor <span class="hi-bracket">(कानूनी मजदूरी जांच)</span>',
      gw2Desc: 'Cross-validate contractor wage offers against official state BOCW rate floors in Delhi, Maharashtra, UP, Bihar and 4 other states to detect wage theft.',
      gw2Link: 'Audit Wage Offer ➔',
      gw3Title: 'Contractor Vetting Directory <span class="hi-bracket">(ठेकेदार साख)</span>',
      gw3Desc: 'Inspect labor contractor track records, timely payment percentages, worksite safety grades, and community feedback before arriving at a site.',
      gw3Link: 'Check a Contractor ➔',
      gw4Title: 'Gupt Whistleblower Portal <span class="hi-bracket">(गोपनीय शिकायत)</span>',
      gw4Desc: 'Submit retaliation-proof reports of withheld wages or confiscated IDs with 100% identity sanitization and live tracking token (#SH-XXXX).',
      gw4Link: 'Report Anonymously ➔',

      khataBannerTitle: '📋 Digital Daily Wage Ledger <span class="hi-bracket">(डिजिटल दैनिक मजदूरी खाता)</span>',
      khataBannerDesc: 'Maintain tamper-evident digital records of agreed daily wages and advance payments. <span class="hi-bracket">(दैनिक मजदूरी और एडवांस का पक्का हिसाब रखें।)</span>',
      kpiEarnedLabel: 'Total Wages Earned <span class="hi-bracket">(कुल कमाई)</span>',
      kpiAdvanceLabel: 'Advance Received <span class="hi-bracket">(प्राप्त एडवांस)</span>',
      kpiDueLabel: 'Net Balance Due <span class="hi-bracket">(कुल बकाया)</span>',
      kpiDaysLabel: 'Total Work Days <span class="hi-bracket">(काम के कुल दिन)</span>',
      formWorkTitle: '✏️ Record Daily Work &amp; Advance <span class="hi-bracket">(दैनिक काम व एडवांस दर्ज करें)</span>',
      btnSaveWork: '💾 Save Work Record to Ledger <span class="hi-bracket">(खाते में दर्ज करें)</span>',

      verifyBannerTitle: '⚖️ Statutory Legal Wage Auditor <span class="hi-bracket">(कानूनी मजदूरी जांच केंद्र)</span>',
      verifyBannerDesc: 'Verify offered daily wages against official state minimum wage schedules under the Minimum Wages Act 1948 and BOCW regulations. <span class="hi-bracket">(सरकारी न्यूनतम मजदूरी से अपनी मजदूरी जांचें।)</span>',
      btnVerifyWage: '🔍 Verify Wage Compliance <span class="hi-bracket">(मजदूरी की कानूनी जांच करें)</span>',

      contractorBannerTitle: '👷 Labor Contractor Directory &amp; Community Ratings <span class="hi-bracket">(ठेकेदार डायरेक्टरी व रेटिंग)</span>',
      contractorBannerDesc: 'Vet labor contractors and sub-contractors before accepting work at distant sites. <span class="hi-bracket">(काम स्वीकार करने से पहले ठेकेदार की साख और रेटिंग जांचें।)</span>',
      btnOpenRate: '⭐ Write Anonymous Contractor Review <span class="hi-bracket">(समीक्षा दर्ज करें)</span>',

      grievanceBannerTitle: '🛡️ Gupt Whistleblower Portal <span class="hi-bracket">(गोपनीय व्हिसलब्लोअर शिकायत केंद्र)</span>',
      grievanceBannerDesc: 'Report wage theft, physical exploitation, or confiscated identity documents with 100% identity sanitization. <span class="hi-bracket">(पहचान गोपनीय रखकर मजदूरी चोरी की रिपोर्ट करें।)</span>',
      btnSubmitGrievance: '🚨 Submit Confidential Grievance <span class="hi-bracket">(गोपनीय शिकायत दर्ज करें)</span>',

      rightsBannerTitle: '📜 Migrant Workers\' Legal Bill of Rights <span class="hi-bracket">(प्रवासी श्रमिक कानूनी अधिकार पत्र)</span>',
      rightsBannerDesc: 'Fundamental statutory protections guaranteed under Indian labor laws. No contractor can waive these constitutional guarantees. <span class="hi-bracket">(भारत के श्रम कानूनों द्वारा प्रदत्त आपके मौलिक अधिकार।)</span>'
    },

    hi: {
      navHome: 'होम',
      navKhata: 'काम व खाता',
      navRights: 'श्रमिक अधिकार',
      navContractors: 'ठेकेदार की जांच',
      navVerify: 'मजदूरी कैलकुलेटर',
      navGrievance: 'मदद व शिकायत',

      heroTitle: 'आपकी मेहनत का<br>पूरा और सही हक।',
      heroSubHindi: '(हर श्रमिक का कानूनी और संवैधानिक अधिकार)',
      heroSubtitle: 'पूरे विश्वास के साथ काम खोजें, अपनी दैनिक मजदूरी का पक्का हिसाब रखें, अपने कानूनी अधिकारों को जानें और संकट के समय गोपनीय मदद पाएं।',
      btnFindWork: 'काम खोजें व खाता खोलें',
      btnReportIssue: 'मजदूरी चोरी की रिपोर्ट करें',
      btnListenPage: '<span>🔊</span> <span>यह पेज सुनें (हिंदी आवाज)</span>',

      quickCheckTitle: 'तुरंत जांचें: आपका क्या बकाया है?',
      quickCheckSub: '(एक मिनट में अपना हिसाब निकालें)',
      labelWageAgreed: 'तय दैनिक मजदूरी (प्रति दिन)',
      labelDaysWorked: 'काम के कुल दिन',
      labelAdvanceReceived: 'मिला हुआ एडवांस / पैसा',
      labelEarned: 'आपकी कुल कमाई',
      labelOwed: 'आपका बाकी बकाया',
      notepadHint: 'ऊपर की तीन लाइनें भरें और अपना बकाया खुद देखें।',
      notepadAction: '<u>दैनिक खाते में जोड़ें और पक्का रिकॉर्ड रखें ➔</u>',
      notepadPrivacy: 'यहाँ दर्ज किया गया डेटा पूरी तरह सुरक्षित है और आपके फोन में ही रहता है।',

      gatewaySectionTitle: 'अपने श्रम और मजदूरी की सुरक्षा के लिए सब कुछ एक जगह',
      gatewaySectionSubtitle: 'असंगठित व प्रवासी श्रमिकों के लिए श्रम स्तंभ के चार प्रमुख नागरिक उपकरण।',
      gw1Title: 'डिजिटल मजदूरी खाता व पर्ची',
      gw1Desc: 'दैनिक तय मजदूरी, प्राप्त एडवांस और कुल बकाया का पक्का हिसाब रखें। कोर्ट में मान्य विधिक पर्ची पाएं।',
      gw1Link: 'मजदूरी खाता खोलें ➔',
      gw2Title: 'कानूनी मजदूरी जांच केंद्र',
      gw2Desc: 'दिल्ली, महाराष्ट्र, यूपी, बिहार सहित राज्यों की सरकारी न्यूनतम दर से ठेकेदार की दर जांचें और चोरी रोकें।',
      gw2Link: 'मजदूरी जांचें ➔',
      gw3Title: 'ठेकेदार डायरेक्टरी व रेटिंग',
      gw3Desc: 'काम स्वीकार करने से पहले ठेकेदार की साख, समय पर भुगतान का प्रतिशत और सुरक्षा रेटिंग देखें।',
      gw3Link: 'ठेकेदार की जांच करें ➔',
      gw4Title: 'गोपनीय व्हिसलब्लोअर पोर्टल',
      gw4Desc: 'बिना नाम बताए मजदूरी चोरी या दस्तावेज जब्ती की रिपोर्ट दर्ज करें और गुप्त टोकन नंबर पाएं।',
      gw4Link: 'गोपनीय रिपोर्ट करें ➔',

      khataBannerTitle: '📋 डिजिटल दैनिक मजदूरी खाता',
      khataBannerDesc: 'दैनिक तय मजदूरी और एडवांस का पक्का डिजिटल हिसाब रखें। कोर्ट में मान्य विधिक पर्ची प्रिंट करें।',
      kpiEarnedLabel: 'कुल कमाई (Wages Earned)',
      kpiAdvanceLabel: 'प्राप्त एडवांस (Advance Paid)',
      kpiDueLabel: 'कुल बाकी बकाया (Net Due)',
      kpiDaysLabel: 'काम के कुल दिन (Work Days)',
      formWorkTitle: '✏️ दैनिक काम व एडवांस दर्ज करें',
      btnSaveWork: '💾 खाते में पक्का हिसाब दर्ज करें',

      verifyBannerTitle: '⚖️ कानूनी मजदूरी जांच केंद्र',
      verifyBannerDesc: 'न्यूनतम मजदूरी अधिनियम 1948 और भवन निर्माण कल्याण बोर्ड (BOCW) की सरकारी दरों से अपनी मजदूरी जांचें।',
      btnVerifyWage: '🔍 मजदूरी की कानूनी जांच करें',

      contractorBannerTitle: '👷 ठेकेदार डायरेक्टरी व साख रेटिंग',
      contractorBannerDesc: 'दूर-दराज की साइट पर जाने से पहले ठेकेदार का पिछला ट्रैक रिकॉर्ड, समय पर भुगतान और रेटिंग जांचें।',
      btnOpenRate: '⭐ ठेकेदार की गुप्त समीक्षा दर्ज करें',

      grievanceBannerTitle: '🛡️ गोपनीय व्हिसलब्लोअर शिकायत केंद्र',
      grievanceBannerDesc: '100% पहचान सुरक्षित रखकर मजदूरी चोरी या प्रताड़ना की गोपनीय रिपोर्ट दर्ज करें और ट्रैकिंग टोकन पाएं।',
      btnSubmitGrievance: '🚨 गोपनीय शिकायत तुरंत दर्ज करें',

      rightsBannerTitle: '📜 प्रवासी श्रमिक कानूनी अधिकार पत्र',
      rightsDesc: 'भारतीय श्रम कानूनों के तहत मिले संवैधानिक व विधिक अधिकार। कोई भी ठेकेदार इन्हें छीन नहीं सकता।'
    }
  };

  function setLanguage(lang) {
    if (lang !== 'hi' && lang !== 'en') lang = 'en';
    currentLang = lang;
    localStorage.setItem('shram_lang', lang);

    document.documentElement.lang = lang;

    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = lang;

    if (window.SpeechNarrator) {
      SpeechNarrator.setVoiceLanguage(lang === 'hi' ? 'hi-IN' : 'en-IN');
    }

    showToast(
      lang === 'hi'
        ? 'वेबसाइट भाषा: शुद्ध हिन्दी में परिवर्तित (Hindi Mode Activated)'
        : 'Website Language: English (हिन्दी सहायता)',
      'info'
    );
  }

  function getLanguage() {
    return currentLang;
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'hi' : 'en');
  }

  function init() {
    const saved = localStorage.getItem('shram_lang') || 'en';
    setLanguage(saved);
  }

  return {
    init,
    setLanguage,
    getLanguage,
    toggleLanguage,
    translations
  };
})();
window.I18n = I18n;


// ==============================================================================
// 4. DIGITAL WAGE KHATA & STATUTORY LEGAL AUDITOR
// ==============================================================================

const WageTracker = (function () {
  const STORAGE_KEY = 'shram_wage_records';

  // Statutory Minimum Wage Matrix (Daily rates in INR under Minimum Wages Act & BOCW)
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

  // Seed Data for initial demonstration
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
              <span class="math-item-val" style="color: var(--color-trust);">- ₹${r.advance}</span>
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
        showToast('Wage marked as fully paid! (मजदूरी चुकता दर्ज हो गई)');
      });
    });

    document.querySelectorAll('.btn-delete-rec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this record? (क्या आप यह रिकॉर्ड हटाना चाहते हैं?)')) {
          deleteRecord(id);
          showToast('Record deleted. (रिकॉर्ड हटा दिया गया)');
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
window.WageTracker = WageTracker;


// ==============================================================================
// 5. ANONYMOUS WHISTLEBLOWER & CONTRACTOR VETTING ENGINE
// ==============================================================================

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

    // Attach quick card event handlers
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
        switchTab('khata');
        const input = document.getElementById('entryThekedar');
        if (input) {
          input.value = name;
          input.focus();
        }
        showToast(`Contractor selected: ${name} (ठेकेदार चुना गया)`);
      });
    });
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
window.GrievanceModule = GrievanceModule;


// ==============================================================================
// 6. UI MODAL HELPERS & ADMINISTRATIVE VIEWS
// ==============================================================================

function showTicketReceiptModal(ticket) {
  const modal = document.getElementById('ticketModal');
  const content = document.getElementById('ticketModalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="text-align: center; padding: 1rem 0;">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">🛡️</div>
      <h3 style="font-size: var(--fs-xl); color: var(--color-trust); margin-bottom: 0.25rem;">Whistleblower Report Submitted! <span class="hi-bracket">(गोपनीय शिकायत दर्ज)</span></h3>
      <p style="font-size: 0.85rem; color: var(--color-text-muted);">
        Your identity is 100% cryptographically sanitized. <span class="hi-bracket">(आपकी पहचान पूरी तरह सुरक्षित है।)</span>
      </p>

      <div class="ticket-receipt-card" style="margin: 1.25rem auto; max-width: 380px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-trust);">
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
        <div><strong>Contractor <span class="hi-bracket">(ठेकेदार)</span>:</strong> ${escapeHTML(ticket.contractor)}</div>
        <div><strong>Category <span class="hi-bracket">(श्रेणी)</span>:</strong> ${escapeHTML(ticket.categoryText)}</div>
        <div><strong>Date <span class="hi-bracket">(तारीख)</span>:</strong> ${formatDisplayDate(ticket.date)}</div>
        <div><strong>Status <span class="hi-bracket">(स्थिति)</span>:</strong> <span class="badge badge-due">${escapeHTML(ticket.statusText)}</span></div>
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
                <strong style="font-family: var(--font-mono); color: var(--color-trust);">${escapeHTML(g.ticketId)}</strong> · 
                <span style="font-size: 0.8rem; color: var(--color-text-muted);">${formatDisplayDate(g.date)}</span>
              </div>
              <span class="badge ${g.status === 'notice_issued' ? 'badge-due' : 'badge-verified'}">${escapeHTML(g.statusText)}</span>
            </div>
            <div style="font-size: 0.85rem;">
              <strong>👷 Contractor / Site <span class="hi-bracket">(ठेकेदार)</span>:</strong> ${escapeHTML(g.contractor)} (📍 ${escapeHTML(g.location)})<br>
              <strong>⚠️ Allegation <span class="hi-bracket">(आरोप)</span>:</strong> ${escapeHTML(g.categoryText)}<br>
              <strong>📝 Details <span class="hi-bracket">(विवरण)</span>:</strong> ${escapeHTML(g.description)}<br>
              <strong>🔒 Worker Identity <span class="hi-bracket">(पहचान)</span>:</strong> <code style="background: var(--color-bg-subtle); padding: 2px 4px; border-radius: 3px;">${escapeHTML(g.workerName)} (${escapeHTML(g.contact)})</code>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--color-text-main); background: var(--color-bg-subtle); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border-left: 4px solid var(--color-trust);">
              <strong>⚖️ Enforcement Officer Note <span class="hi-bracket">(विधिक नोट)</span>:</strong> ${escapeHTML(g.officerNotes)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}


// ==============================================================================
// 7. APPLICATION LIFECYCLE & EVENT ORCHESTRATION
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Accessibility: High Contrast Sunlight Mode Toggle
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

  // 2. Accessibility: Large Font Mode Toggle
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

  // 3. Audio Narration Controls
  const btnStopSpeech = document.getElementById('btnStopSpeech');
  if (btnStopSpeech) {
    btnStopSpeech.addEventListener('click', () => {
      SpeechNarrator.stop();
    });
  }

  // Bilingual Translation Dropdown
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      I18n.setLanguage(e.target.value);
    });
  }

  // Audio Voice Language Toggle Button
  const btnVoiceToggle = document.getElementById('btnVoiceToggle');
  if (btnVoiceToggle) {
    btnVoiceToggle.addEventListener('click', () => {
      SpeechNarrator.toggleVoiceLanguage();
    });
  }

  // Initialize Dual-Language Engine from LocalStorage
  I18n.init();

  // Section & Hero Narration Trigger Buttons
  document.querySelectorAll('.btn-narrate, .btn-narrate-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.currentTarget.getAttribute('data-narrate-key');
      if (SpeechNarrator.isSpeaking()) {
        SpeechNarrator.stop();
      } else {
        SpeechNarrator.narrateKey(key, e.currentTarget);
      }
    });
  });

  // Navigation Links & Bottom Tab Bar
  document.querySelectorAll('.nav-link-btn, .nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-tab');
      if (target) {
        switchTab(target);
      }
    });
  });

  // Gateway Cards Keyboard Accessibility
  document.querySelectorAll('.gateway-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // 4. Interactive Notepad Widget (Quick Wage Calculator)
  const quickWageInput = document.getElementById('quickWage');
  const quickDaysInput = document.getElementById('quickDays');
  const quickAdvanceInput = document.getElementById('quickAdvance');
  const quickEarnedDisplay = document.getElementById('quickEarned');
  const quickOwedDisplay = document.getElementById('quickOwed');
  const btnQuickTransfer = document.getElementById('btnQuickTransferToKhata');

  function calculateQuickWage() {
    if (!quickWageInput || !quickDaysInput || !quickAdvanceInput) return;
    const wage = Math.max(0, parseFloat(quickWageInput.value) || 0);
    const days = Math.max(0, parseFloat(quickDaysInput.value) || 0);
    const advance = Math.max(0, parseFloat(quickAdvanceInput.value) || 0);

    const earned = wage * days;
    const owed = Math.max(0, earned - advance);

    if (quickEarnedDisplay) {
      quickEarnedDisplay.textContent = '₹' + earned.toLocaleString('en-IN');
    }
    if (quickOwedDisplay) {
      quickOwedDisplay.textContent = '₹' + owed.toLocaleString('en-IN');
    }
  }

  if (quickWageInput && quickDaysInput && quickAdvanceInput) {
    [quickWageInput, quickDaysInput, quickAdvanceInput].forEach(inp => {
      inp.addEventListener('input', calculateQuickWage);
    });
    calculateQuickWage();
  }

  if (btnQuickTransfer) {
    btnQuickTransfer.addEventListener('click', () => {
      const wage = Math.max(0, parseFloat(quickWageInput ? quickWageInput.value : 0) || 0);
      const days = Math.max(1, parseFloat(quickDaysInput ? quickDaysInput.value : 1) || 1);
      const advance = Math.max(0, parseFloat(quickAdvanceInput ? quickAdvanceInput.value : 0) || 0);
      const earned = wage * days;
      const owed = Math.max(0, earned - advance);

      const entryWage = document.getElementById('entryWage');
      const entryAdvance = document.getElementById('entryAdvance');
      const entryNotes = document.getElementById('entryNotes');
      const entryThekedar = document.getElementById('entryThekedar');

      if (entryWage) entryWage.value = wage;
      if (entryAdvance) entryAdvance.value = advance;
      if (entryNotes) {
        entryNotes.value = `Quick Check prefill: ${days} days worked @ ₹${wage}/day. Net owed: ₹${owed.toLocaleString('en-IN')}`;
      }

      switchTab('khata');

      if (entryThekedar) {
        entryThekedar.focus();
      }

      showToast(`Transferred calculation to Wage Khata! Daily: ₹${wage}, Advance: ₹${advance}. Please enter contractor name. (खाते में विवरण दर्ज)`, 'success');
    });
  }

  // 5. Initialize Wage Khata Ledger
  WageTracker.render();
  WageTracker.updateKPIs();

  const entryDateInput = document.getElementById('entryDate');
  if (entryDateInput) {
    entryDateInput.value = new Date().toISOString().split('T')[0];
  }

  // Daily Work Entry Form Submission
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

      document.getElementById('entryAdvance').value = '0';
      document.getElementById('entryNotes').value = '';
    });
  }

  // Ledger Search & Status Filter Controls
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

  // 6. Statutory Wage Auditor Controls
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

  // 7. Whistleblower Grievance Form & Tracking
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
                📅 ${formatDisplayDate(record.date)} · 👷 ${escapeHTML(record.contractor)} · 📍 ${escapeHTML(record.location)}
              </div>
            </div>
            <span class="badge badge-due" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
              ${escapeHTML(record.statusText)}
            </span>
          </div>

          <div style="margin-top: 0.75rem; font-size: 0.85rem; background: var(--color-bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
            <strong>Category <span class="hi-bracket">(श्रेणी)</span>:</strong> ${escapeHTML(record.categoryText)}<br>
            <strong>Details <span class="hi-bracket">(विवरण)</span>:</strong> ${escapeHTML(record.description)}<br>
            <strong>Identity Status <span class="hi-bracket">(पहचान स्थिति)</span>:</strong> <span style="color: var(--color-success); font-weight: 700;">🔒 100% Anonymous & Sanitized (गोपनीय)</span>
          </div>

          <div class="timeline">
            <div class="timeline-step completed">
              <div class="timeline-dot">✓</div>
              <div class="timeline-step-title">1. Grievance Sanitized & Registered <span class="hi-bracket">(दर्ज व पहचान सुरक्षित)</span></div>
              <div class="timeline-step-time">${formatDisplayDate(record.date)} · System Cryptographic Token Assigned</div>
            </div>
            <div class="timeline-step ${record.status !== 'submitted' ? 'completed' : 'active'}">
              <div class="timeline-dot">${record.status !== 'submitted' ? '✓' : '2'}</div>
              <div class="timeline-step-title">2. Dispatched to District Labour Cell (DLC) <span class="hi-bracket">(श्रम प्रकोष्ठ को प्रेषित)</span></div>
              <div class="timeline-step-time">${record.status !== 'submitted' ? 'Assigned to Sub-Divisional Labour Inspector' : 'Pending Inspector review'}</div>
            </div>
            <div class="timeline-step ${record.status === 'notice_issued' || record.status === 'resolved' ? 'completed' : 'pending'}">
              <div class="timeline-dot">${record.status === 'notice_issued' || record.status === 'resolved' ? '✓' : '3'}</div>
              <div class="timeline-step-title">3. Statutory Show-Cause Notice Dispatched <span class="hi-bracket">(ठेकेदार को नोटिस)</span></div>
              <div class="timeline-step-time">${escapeHTML(record.officerNotes) || 'Pending'}</div>
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

  // 8. Contractor Vetting & Ratings Setup
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

  // 9. Inspector / Admin Demonstration Modal
  const btnToggleAdmin = document.getElementById('btnToggleAdmin');
  const adminModal = document.getElementById('adminModal');
  if (btnToggleAdmin && adminModal) {
    btnToggleAdmin.addEventListener('click', () => {
      renderAdminDashboard();
      adminModal.classList.add('open');
    });
  }

  // 10. Modal Close Handling (Close button, outside click, ESC key)
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
