/**
 * SHRAM STAMBH (श्रम स्तंभ) - Internationalization & Dual Language Engine (i18n)
 * Provides seamless client-side bilingual translation:
 *  - 'en': English-first with bracketed Hindi translations (कम साक्षरता सहायता)
 *  - 'hi': 100% Pure Natural Hindi UI Mode (शुद्ध हिन्दी दृश्य)
 * Zero external libraries · Instant DOM morphing · LocalStorage persistence
 */

const I18n = (function () {
  let currentLang = 'en';

  const translations = {
    en: {
      // Top Navigation
      navHome: 'Home <span class="hi-bracket">(होम)</span>',
      navKhata: 'Find work <span class="hi-bracket">(काम/खाता)</span>',
      navRights: 'Know your rights <span class="hi-bracket">(अधिकार)</span>',
      navContractors: 'Check a contractor <span class="hi-bracket">(ठेकेदार)</span>',
      navVerify: 'Wage calculator <span class="hi-bracket">(कैलकुलेटर)</span>',
      navGrievance: 'Get help <span class="hi-bracket">(मदद)</span>',

      // Hero Section
      heroTitle: 'Your hard work<br>deserves fair pay.',
      heroSubHindi: '(आपकी मेहनत का पूरा और सही हक।)',
      heroSubtitle: 'Find work with greater confidence, maintain an indisputable record of your daily wages, verify state legal minimum floors, and discover where to seek confidential help when something goes wrong.',
      btnFindWork: 'Find work <span class="hi-bracket">(काम खोजें व हिसाब)</span>',
      btnReportIssue: 'Report a wage issue <span class="hi-bracket">(मजदूरी चोरी की रिपोर्ट)</span>',
      btnListenPage: '<span>🔊</span> <span>Listen to this page</span> <span class="hi-bracket">(सुनिए)</span>',

      // Notepad Widget
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

      // Gateway Cards Section
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

      // Module 1: Wage Khata
      khataBannerTitle: '📋 Digital Daily Wage Ledger <span class="hi-bracket">(डिजिटल दैनिक मजदूरी खाता)</span>',
      khataBannerDesc: 'Maintain tamper-evident digital records of agreed daily wages and advance payments. <span class="hi-bracket">(दैनिक मजदूरी और एडवांस का पक्का हिसाब रखें।)</span>',
      kpiEarnedLabel: 'Total Wages Earned <span class="hi-bracket">(कुल कमाई)</span>',
      kpiAdvanceLabel: 'Advance Received <span class="hi-bracket">(प्राप्त एडवांस)</span>',
      kpiDueLabel: 'Net Balance Due <span class="hi-bracket">(कुल बकाया)</span>',
      kpiDaysLabel: 'Total Work Days <span class="hi-bracket">(काम के कुल दिन)</span>',
      formWorkTitle: '✏️ Record Daily Work &amp; Advance <span class="hi-bracket">(दैनिक काम व एडवांस दर्ज करें)</span>',
      btnSaveWork: '💾 Save Work Record to Ledger <span class="hi-bracket">(खाते में दर्ज करें)</span>',

      // Module 2: Wage Auditor
      verifyBannerTitle: '⚖️ Statutory Legal Wage Auditor <span class="hi-bracket">(कानूनी मजदूरी जांच केंद्र)</span>',
      verifyBannerDesc: 'Verify offered daily wages against official state minimum wage schedules under the Minimum Wages Act 1948 and BOCW regulations. <span class="hi-bracket">(सरकारी न्यूनतम मजदूरी से अपनी मजदूरी जांचें।)</span>',
      btnVerifyWage: '🔍 Verify Wage Compliance <span class="hi-bracket">(मजदूरी की कानूनी जांच करें)</span>',

      // Module 3: Contractor Directory
      contractorBannerTitle: '👷 Labor Contractor Directory &amp; Community Ratings <span class="hi-bracket">(ठेकेदार डायरेक्टरी व रेटिंग)</span>',
      contractorBannerDesc: 'Vet labor contractors and sub-contractors before accepting work at distant sites. <span class="hi-bracket">(काम स्वीकार करने से पहले ठेकेदार की साख और रेटिंग जांचें।)</span>',
      btnOpenRate: '⭐ Write Anonymous Contractor Review <span class="hi-bracket">(समीक्षा दर्ज करें)</span>',

      // Module 4: Whistleblower Portal
      grievanceBannerTitle: '🛡️ Gupt Whistleblower Portal <span class="hi-bracket">(गोपनीय व्हिसलब्लोअर शिकायत केंद्र)</span>',
      grievanceBannerDesc: 'Report wage theft, physical exploitation, or confiscated identity documents with 100% identity sanitization. <span class="hi-bracket">(पहचान गोपनीय रखकर मजदूरी चोरी की रिपोर्ट करें।)</span>',
      btnSubmitGrievance: '🚨 Submit Confidential Grievance <span class="hi-bracket">(गोपनीय शिकायत दर्ज करें)</span>',

      // Module 5: Legal Rights
      rightsBannerTitle: '📜 Migrant Workers\' Legal Bill of Rights <span class="hi-bracket">(प्रवासी श्रमिक कानूनी अधिकार पत्र)</span>',
      rightsBannerDesc: 'Fundamental statutory protections guaranteed under Indian labor laws. No contractor can waive these constitutional guarantees. <span class="hi-bracket">(भारत के श्रम कानूनों द्वारा प्रदत्त आपके मौलिक अधिकार।)</span>'
    },

    hi: {
      // Top Navigation
      navHome: 'होम',
      navKhata: 'काम व खाता',
      navRights: 'श्रमिक अधिकार',
      navContractors: 'ठेकेदार की जांच',
      navVerify: 'मजदूरी कैलकुलेटर',
      navGrievance: 'मदद व शिकायत',

      // Hero Section
      heroTitle: 'आपकी मेहनत का<br>पूरा और सही हक।',
      heroSubHindi: '(हर श्रमिक का कानूनी और संवैधानिक अधिकार)',
      heroSubtitle: 'पूरे विश्वास के साथ काम खोजें, अपनी दैनिक मजदूरी का पक्का हिसाब रखें, अपने कानूनी अधिकारों को जानें और संकट के समय गोपनीय मदद पाएं।',
      btnFindWork: 'काम खोजें व खाता खोलें',
      btnReportIssue: 'मजदूरी चोरी की रिपोर्ट करें',
      btnListenPage: '<span>🔊</span> <span>यह पेज सुनें (हिंदी आवाज)</span>',

      // Notepad Widget
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

      // Gateway Cards Section
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

      // Module 1: Wage Khata
      khataBannerTitle: '📋 डिजिटल दैनिक मजदूरी खाता',
      khataBannerDesc: 'दैनिक तय मजदूरी और एडवांस का पक्का डिजिटल हिसाब रखें। कोर्ट में मान्य विधिक पर्ची प्रिंट करें।',
      kpiEarnedLabel: 'कुल कमाई (Wages Earned)',
      kpiAdvanceLabel: 'प्राप्त एडवांस (Advance Paid)',
      kpiDueLabel: 'कुल बाकी बकाया (Net Due)',
      kpiDaysLabel: 'काम के कुल दिन (Work Days)',
      formWorkTitle: '✏️ दैनिक काम व एडवांस दर्ज करें',
      btnSaveWork: '💾 खाते में पक्का हिसाब दर्ज करें',

      // Module 2: Wage Auditor
      verifyBannerTitle: '⚖️ कानूनी मजदूरी जांच केंद्र',
      verifyBannerDesc: 'न्यूनतम मजदूरी अधिनियम 1948 और भवन निर्माण कल्याण बोर्ड (BOCW) की सरकारी दरों से अपनी मजदूरी जांचें।',
      btnVerifyWage: '🔍 मजदूरी की कानूनी जांच करें',

      // Module 3: Contractor Directory
      contractorBannerTitle: '👷 ठेकेदार डायरेक्टरी व साख रेटिंग',
      contractorBannerDesc: 'दूर-दराज की साइट पर जाने से पहले ठेकेदार का पिछला ट्रैक रिकॉर्ड, समय पर भुगतान और रेटिंग जांचें।',
      btnOpenRate: '⭐ ठेकेदार की गुप्त समीक्षा दर्ज करें',

      // Module 4: Whistleblower Portal
      grievanceBannerTitle: '🛡️ गोपनीय व्हिसलब्लोअर शिकायत केंद्र',
      grievanceBannerDesc: '100% पहचान सुरक्षित रखकर मजदूरी चोरी या प्रताड़ना की गोपनीय रिपोर्ट दर्ज करें और ट्रैकिंग टोकन पाएं।',
      btnSubmitGrievance: '🚨 गोपनीय शिकायत तुरंत दर्ज करें',

      // Module 5: Legal Rights
      rightsBannerTitle: '📜 प्रवासी श्रमिक कानूनी अधिकार पत्र',
      rightsDesc: 'भारतीय श्रम कानूनों के तहत मिले संवैधानिक व विधिक अधिकार। कोई भी ठेकेदार इन्हें छीन नहीं सकता।'
    }
  };

  function setLanguage(lang) {
    if (lang !== 'hi' && lang !== 'en') lang = 'en';
    currentLang = lang;
    localStorage.setItem('shram_lang', lang);

    document.documentElement.lang = lang;

    // Apply translations to all data-i18n elements
    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Update Dropdown Selection
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = lang;

    // Sync speech narrator voice language
    if (window.SpeechNarrator) {
      SpeechNarrator.setVoiceLanguage(lang === 'hi' ? 'hi-IN' : 'en-IN');
    }

    if (window.showToast) {
      showToast(
        lang === 'hi'
          ? 'वेबसाइट भाषा: शुद्ध हिन्दी में परिवर्तित (Hindi Mode Activated)'
          : 'Website Language: English (हिन्दी सहायता)',
        'info'
      );
    }
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
