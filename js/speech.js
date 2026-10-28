/**
 * SHRAM STAMBH (श्रम स्तंभ) - Speech & Acoustic Narrator Engine v3.5
 * Tier 1: Low-Literacy Interface Layer
 * Implements native W3C SpeechSynthesis API (0 KB external weight, ₹0 cost)
 * Designed to bypass reading literacy barriers for migrant workers.
 * Supports on-demand acoustic voice language switching between Indian English and pure Hindi (हिन्दी).
 */

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

    // Update UI button labels if present
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

    if (window.showToast) {
      showToast(
        newLang === 'hi-IN'
          ? '🗣️ ऑडियो आवाज: हिन्दी (Hindi Voice Active)'
          : '🗣️ Audio Voice: Indian English (English Voice Active)',
        'info'
      );
    }

    // Audible confirmation
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

    // Select voice according to requested language
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
