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

  let indianVoice = null;

  function initVoices() {
    if (!synth) return;
    const voices = synth.getVoices();
    
    // Look for Indian English or Hindi voices
    indianVoice = voices.find(v => v.lang === 'en-IN') 
                 || voices.find(v => v.lang === 'hi-IN') 
                 || voices.find(v => v.lang.startsWith('en')) 
                 || null;
  }

  if (synth) {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = initVoices;
    }
    initVoices();
  }

  function speak(text, options = {}) {
    if (!synth) {
      console.warn("SpeechSynthesis is not supported on this browser.");
      return;
    }

    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    utterance.lang = options.lang || 'en-IN';
    if (indianVoice) utterance.voice = indianVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

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

  const narratives = {
    khataSection: "Welcome to Shram Stambh Digital Wage Ledger. Here you can record your daily agreed wage and advance payments. The system automatically computes your outstanding balance and generates official printable wage slips. श्रम स्तंभ डिजिटल खाता में आपका स्वागत है। यहाँ आप अपनी दैनिक मजदूरी और एडवांस का पक्का हिसाब रख सकते हैं।",
    verifySection: "Statutory Wage Auditor. Select your state and skill tier to verify contractor wages against official legal minimum wage floors. If underpaid, it triggers an instant Wage Theft Alert. कानूनी मजदूरी जांच केंद्र। अपने राज्य की सरकारी न्यूनतम दर से ठेकेदार की मजदूरी जांचें।",
    reviewsSection: "Contractor Directory & Community Ratings. Vet contractors before taking a job. Check wage timeliness, safety score, and community feedback. ठेकेदार डायरेक्टरी। काम स्वीकार करने से पहले ठेकेदार की साख और समय पर भुगतान का रिकॉर्ड देखें।",
    grievanceSection: "Whistleblower Portal. Submit wage theft or abuse complaints with 100 percent anonymity. Receive a secure tracking ticket ID to monitor enforcement actions. गुप्त शिकायत केंद्र। बिना पहचान बताए मजदूरी चोरी या प्रताड़ना की गोपनीय रिपोर्ट दर्ज करें।",
    balanceSlip: "This is your legally valid balance wage slip showing employer, agreed wage, advance received, and net balance due. It serves as admissible evidence in labour disputes. यह आपकी कानूनी बकाया हिसाब पर्ची है।"
  };

  function narrateKey(key, triggerBtn = null) {
    const text = narratives[key] || null;
    if (text) {
      speak(text, { triggerBtn });
    }
  }

  return {
    speak,
    stop,
    narrateKey,
    isSpeaking: () => isSpeaking
  };
})();
