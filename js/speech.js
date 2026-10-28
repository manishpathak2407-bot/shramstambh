/**
 * SHRAM STAMBH (श्रम स्तंभ) - Speech & Acoustic Narrator Engine
 * Tier 1: Low-Literacy Interface Layer
 * Implements native W3C SpeechSynthesis API (0 KB external weight, ₹0 cost)
 * Designed to bypass reading literacy barriers for migrant workers.
 */

const SpeechNarrator = (function () {
  let synth = window.speechSynthesis;
  let currentUtterance = null;
  let isSpeaking = false;
  let activeNarrateBtn = null;

  // Cached voice references
  let hindiVoice = null;
  let englishVoice = null;

  function initVoices() {
    if (!synth) return;
    const voices = synth.getVoices();
    
    // Look for Indian Hindi voices
    hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.name.toLowerCase().includes('hindi')) 
                 || voices.find(v => v.lang.startsWith('hi')) 
                 || null;

    // Look for Indian English or standard English voices
    englishVoice = voices.find(v => v.lang === 'en-IN') 
                   || voices.find(v => v.lang === 'en-GB') 
                   || voices.find(v => v.lang.startsWith('en')) 
                   || null;
  }

  // Voices are loaded asynchronously in Chrome/Edge
  if (synth) {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = initVoices;
    }
    initVoices();
  }

  /**
   * Speak arbitrary text in specified or current active language
   */
  function speak(text, options = {}) {
    if (!synth) {
      console.warn("SpeechSynthesis is not supported on this browser.");
      return;
    }

    // Cancel any ongoing speech
    stop();

    const lang = options.lang || (window.currentLocale === 'en' ? 'en' : 'hi');
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    // Select appropriate voice
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.rate = 0.95; // Slightly slower for clear rural Hindi comprehension
      utterance.pitch = 1.0;
    } else {
      utterance.lang = 'en-IN';
      if (englishVoice) utterance.voice = englishVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    // Update UI elements during speech
    const speechBar = document.getElementById('speechBar');
    const speechText = document.getElementById('speechText');
    const triggerBtn = options.triggerBtn || null;

    utterance.onstart = function () {
      isSpeaking = true;
      if (speechBar && speechText) {
        speechText.textContent = text.length > 80 ? text.substring(0, 80) + '...' : text;
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

  /**
   * Pre-composed acoustic narrative explanations for core system views
   */
  const narratives = {
    khataSection: {
      hi: "श्रम स्तंभ डिजिटल खाता में आपका स्वागत है। यहाँ आप अपनी रोज़ की तय मजदूरी और मिला हुआ एडवांस दर्ज कर सकते हैं। सिस्टम अपने आप आपका बकाया हिसाब निकाल देगा और आप कानूनी पर्ची भी डाउनलोड कर सकते हैं।",
      en: "Welcome to Shram Stambh Digital Ledger. Here you can record your daily agreed wage and advance payments. The system automatically computes your outstanding balance and generates official printable wage slips."
    },
    verifySection: {
      hi: "कानूनी मजदूरी जांच केंद्र। अपने राज्य और काम की श्रेणी चुनें और ठेकेदार द्वारा दी जा रही मजदूरी डालें। यदि मजदूरी सरकारी न्यूनतम दर से कम है, तो यह तुरंत मजदूरी चोरी अलर्ट देगा।",
      en: "Statutory Wage Auditor. Select your state and skill category to verify contractor wages against official legal minimum wage floors. If underpaid, it triggers an instant Wage Theft Alert."
    },
    reviewsSection: {
      hi: "ठेकेदार डायरेक्टरी व रेटिंग। यहाँ आप काम स्वीकार करने से पहले ठेकेदार की साख, समय पर भुगतान का रिकॉर्ड और सुरक्षा रेटिंग देख सकते हैं। आप भी अपना अनुभव साझा कर सकते हैं।",
      en: "Contractor Directory & Community Ratings. Vet contractors before taking a job. Check wage timeliness, safety score, and community feedback from fellow workers."
    },
    grievanceSection: {
      hi: "गुप्त शिकायत केंद्र। यहाँ आप बिना अपनी पहचान बताए मजदूरी चोरी या दुर्व्यवहार की शिकायत दर्ज कर सकते हैं। आपको एक गोपनीय टिकट नंबर मिलेगा जिससे आप जांच की स्थिति देख सकते हैं।",
      en: "Gupt Shikayat Whistleblower Portal. Submit wage theft or abuse complaints with 100 percent anonymity. Receive a secure tracking ticket ID to monitor labour enforcement actions."
    },
    balanceSlip: {
      hi: "यह आपकी कानूनी बकाया हिसाब पर्ची है। इसमें आपका नाम, ठेकेदार का नाम, काम का विवरण, कुल मजदूरी और बकाया राशि दर्ज है। इसे श्रम न्यायालय या पुलिस में सबूत के तौर पर इस्तेमाल किया जा सकता है।",
      en: "This is your legally valid balance wage slip showing employer, agreed wage, advance received, and net balance due. It can serve as admissible evidence in labour disputes."
    }
  };

  function narrateKey(key, triggerBtn = null) {
    const lang = window.currentLocale || 'hi';
    const text = narratives[key] ? narratives[key][lang] : null;
    if (text) {
      speak(text, { lang, triggerBtn });
    }
  }

  return {
    speak,
    stop,
    narrateKey,
    isSpeaking: () => isSpeaking
  };
})();
