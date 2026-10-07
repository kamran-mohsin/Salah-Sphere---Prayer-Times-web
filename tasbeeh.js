const zikrCatalog = [
  { id: "subhanallah", name: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", trans: "Subhānallāh", mean: "Glory be to Allah. Free from all imperfections.", urdu: "اللہ پاک ہے اور ہر عیب سے پاک ہے۔", defaultTarget: 33 },
  { id: "alhamdulillah", name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", trans: "Al-ḥamdu lillāh", mean: "All praise and gratitude belong to Allah alone.", urdu: "تمام تعریفیں اور شکر صرف اللہ کے لیے ہیں۔", defaultTarget: 33 },
  { id: "allahuakbar", name: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", trans: "Allāhu Akbar", mean: "Allah is the Greatest over all creation.", urdu: "اللہ سب سے بڑا ہے۔", defaultTarget: 34 },
  { id: "astaghfirullah", name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", trans: "Astaghfirullāh", mean: "I seek forgiveness from Allah, the Most Merciful.", urdu: "میں اللہ سے اپنے گناہوں کی معافی مانگتا ہوں۔", defaultTarget: 100 },
  { id: "lailahaillallah", name: "La Ilaha Illallah", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", trans: "Lā ilāha illallāh", mean: "There is no deity worthy of worship except Allah.", urdu: "اللہ کے سوا کوئی عبادت کے لائق نہیں۔", defaultTarget: 100 },
  { id: "durood", name: "Durood Sharif", arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", trans: "Allāhumma ṣalli 'alā Muḥammad", mean: "O Allah! Send peace and blessings upon Prophet Muhammad ﷺ.", urdu: "اے اللہ! حضرت محمد ﷺ پر رحمت اور سلامتی نازل فرما۔", defaultTarget: 100 },
  { id: "subhanwabihamdihi", name: "SubhanAllahi Wa Bihamdihi", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", trans: "Subhānallāhi wa bi-ḥamdihi", mean: "Glory be to Allah and all praise is His.", urdu: "پاک ہے اللہ اپنی حمد و تعریف کے ساتھ۔", defaultTarget: 100 },
  { id: "lahawla", name: "La Hawla Wa La Quwwata", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", trans: "Lā ḥawla wa lā quwwata illā billāh", mean: "There is no might nor power except with Allah.", urdu: "گناہ سے بچنے اور نیکی کرنے کی طاقت صرف اللہ ہی کی طرف سے ہے۔", defaultTarget: 100 },
  { id: "hasbunallah", name: "Hasbunallahu Wa Ni'mal Wakeel", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", trans: "Ḥasbunallāhu wa ni'mal-wakīl", mean: "Allah alone is sufficient for us, and He is the best Disposer of affairs.", urdu: "ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔", defaultTarget: 100 },
  { id: "yahayyu", name: "Ya Hayyu Ya Qayyum", arabic: "يَا حَيُّ يَا قَيُّومُ", trans: "Yā Ḥayyu yā Qayyūm", mean: "O Ever-Living, O Self-Sustaining Supporter of all.", urdu: "اے ہمیشہ زندہ رہنے والے! اے سب کو قائم رکھنے والے!", defaultTarget: 100 }
];
const duasData = [
  { id: 1, cat: "morning", title: "Morning Protection (Sayyid al-Istighfar)", arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ", trans: "Allahumma anta Rabbi la ilaha illa anta khalaqtani wa ana 'abduka", mean: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant.", urdu: "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا۔" },
  { id: 2, cat: "morning", title: "Morning Gratitude & Contentment", arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ", trans: "Asbahna wa asbahal-mulku lillahi walhamdu lillah", mean: "We have entered the morning and the kingdom belongs to Allah, and all praise is for Allah.", urdu: "ہم نے صبح کی اور سارے جہان کے ملک نے بھی صبح کی اور تمام تعریفیں اللہ کے لیے ہیں۔" },
  { id: 3, cat: "protection", title: "Protection Against All Harm (3 Times)", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", trans: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim", mean: "In the Name of Allah, with Whose Name nothing can cause harm in earth or heaven, and He is All-Hearing, All-Knowing.", urdu: "اللہ کے نام سے جس کے نام کی برکت سے زمین اور آسمان کی کوئی چیز نقصان نہیں پہنچا سکتی۔" },
  { id: 4, cat: "protection", title: "Relief from Anxiety and Debt", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", trans: "Allahumma inni a'udhu bika minal-hammi wal-hazani wal-'ajzi wal-kasali wal-bukhli wal-jubni wa dala'id-dayni wa ghalabatir-rijal", mean: "O Allah, I seek refuge in You from anxiety, grief, incapacity, laziness, cowardice, burden of debt and oppression.", urdu: "اے اللہ! میں پریشانی، غم، عاجزی، سستی، بخل، بزدلی اور قرض کے بوجھ سے تیری پناہ مانگتا ہوں۔" },
  { id: 5, cat: "forgiveness", title: "Dua of Prophet Yunus (A.S) in Distress", arabic: "لَّا إِلٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", trans: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin", mean: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.", urdu: "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی قصوروار تھا۔", audio: "https://everyayah.com/data/Alafasy_128kbps/021087.mp3" },
  { id: 6, cat: "forgiveness", title: "Asking for Total Forgiveness (Rabbanaghfirli)", arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", trans: "Rabbanagh-fir li wa li-walidayya wa lil-mu'minina yawma yaqumul-hisab", mean: "Our Lord, forgive me and my parents and the believers the Day the account is established.", urdu: "اے ہمارے پروردگار! مجھے، میرے والدین کو اور تمام مومنین کو حساب کے دن بخش دے۔", audio: "https://everyayah.com/data/Alafasy_128kbps/014041.mp3" },
  { id: 7, cat: "health", title: "Dua of Prophet Ayyub (A.S) for Shifa", arabic: "أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ", trans: "Anni massaniyad-durru wa anta arhamur-rahimin", mean: "Indeed, adversity has touched me, and You are the Most Merciful of the merciful.", urdu: "بے شک مجھے تکلیف پہنچی ہے اور تو سب رحم کرنے والوں سے بڑھ کر رحم فرمانے والا ہے۔", audio: "https://everyayah.com/data/Alafasy_128kbps/021083.mp3" },
  { id: 8, cat: "health", title: "Seeking Physical Well-being & Good Health", arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي", trans: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari", mean: "O Allah, grant soundness to my body. O Allah, grant soundness to my hearing. O Allah, grant soundness to my sight.", urdu: "اے اللہ! میرے بدن میں عافیت دے، میرے کانوں میں عافیت دے، میری آنکھوں میں عافیت دے۔" },
  { id: 9, cat: "success", title: "Dua for Increase in Beneficial Knowledge", arabic: "رَّبِّ زِدْنِي عِلْمًا", trans: "Rabbi zidni 'ilma", mean: "My Lord, increase me in knowledge.", urdu: "اے میرے رب! میرے علم میں اضافہ فرما۔", audio: "https://everyayah.com/data/Alafasy_128kbps/020114.mp3" },
  { id: 10, cat: "success", title: "Dua for Good in This World & Hereafter", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", trans: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar", mean: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the Fire.", urdu: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی عطا فرما اور آگ کے عذاب سے بچا۔", audio: "https://everyayah.com/data/Alafasy_128kbps/002201.mp3" }
];
let activeZikr = zikrCatalog[0];
let activeTarget = 33;
let activeLap = 1;
let soundMode = "bead";
let isAudioEnabled = true;
let zikrCounts = {};
try {
  let savedCounts = localStorage.getItem("zikr_counters_map");
  if (savedCounts) zikrCounts = JSON.parse(savedCounts);
} catch (e) {}
zikrCatalog.forEach((z) => {
  if (typeof zikrCounts[z.id] !== "number") zikrCounts[z.id] = 0;
});
let lifetimeTotal = parseInt(localStorage.getItem("lifetime_dhikr_total") || "0");
function playZikrSound() {
  if (!isAudioEnabled || soundMode === "mute") {
    if (navigator.vibrate) navigator.vibrate(25);
    return;
  }
  try {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (soundMode === "bead") {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (soundMode === "bell") {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(784, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } else if (soundMode === "drop") {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    }
  } catch (e) {}
}
function playTargetCompletionSound() {
  try {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
    });
  } catch (e) {}
}
function saveCounts() {
  localStorage.setItem("zikr_counters_map", JSON.stringify(zikrCounts));
  localStorage.setItem("lifetime_dhikr_total", lifetimeTotal);
  let badge = document.getElementById("totalLifetimeDhikrBadge");
  if (badge) badge.innerText = lifetimeTotal;
}
function updateActiveUI() {
  let count = zikrCounts[activeZikr.id] || 0;
  let numEl = document.getElementById("zenCountDisplay");
  if (numEl) numEl.innerText = count;
  let arEl = document.getElementById("activeZikrArabic");
  if (arEl) arEl.innerText = activeZikr.arabic;
  let roundEl = document.getElementById("zenRoundDisplay");
  if (roundEl) {
    roundEl.innerText = activeTarget > 0 ? `Lap ${activeLap} • Target: ${activeTarget}` : `Free Flow Mode (∞)`;
  }
  let circumference = 722.5;
  let circle = document.getElementById("auraFillCircle");
  if (circle) {
    if (activeTarget > 0) {
      let progress = (count % activeTarget) / activeTarget;
      if (count > 0 && count % activeTarget === 0) progress = 1;
      let offset = circumference - progress * circumference;
      circle.style.strokeDashoffset = offset;
    } else {
      circle.style.strokeDashoffset = 0;
    }
  }
  let tTitle = document.getElementById("activeZikrEnglishTitle");
  let tTrans = document.getElementById("activeZikrTrans");
  let tMean = document.getElementById("activeZikrMeaning");
  let tUrdu = document.getElementById("activeZikrUrdu");
  let sumZikr = document.getElementById("summaryActiveZikr");
  if (tTitle) tTitle.innerText = activeZikr.name;
  if (tTrans) tTrans.innerText = `"${activeZikr.trans}"`;
  if (tMean) tMean.innerText = activeZikr.mean;
  if (tUrdu) tUrdu.innerText = activeZikr.urdu;
  if (sumZikr) sumZikr.innerText = activeZikr.name;
  renderZikrChips();
  renderZikrGrid();
}
function tapZikr() {
  zikrCounts[activeZikr.id]++;
  lifetimeTotal++;
  saveCounts();
  playZikrSound();
  let ripple = document.getElementById("zenTapRipple");
  if (ripple) {
    ripple.classList.remove("animate");
    void ripple.offsetWidth;
    ripple.classList.add("animate");
  }
  let cur = zikrCounts[activeZikr.id];
  if (activeTarget > 0 && cur % activeTarget === 0) {
    playTargetCompletionSound();
    let modal = document.getElementById("targetReachedModal");
    let txt = document.getElementById("targetModalText");
    if (modal && txt) {
      txt.innerText = `You have completed ${activeTarget} repetitions of ${activeZikr.name}! Masha'Allah!`;
      modal.style.display = "flex";
    }
    activeLap++;
  }
  updateActiveUI();
}
let zenBtn = document.getElementById("zenTapBtn");
if (zenBtn) zenBtn.addEventListener("click", tapZikr);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "INPUT") {
    e.preventDefault();
    tapZikr();
  }
});
let closeTargetBtn = document.getElementById("closeTargetModalBtn");
if (closeTargetBtn) {
  closeTargetBtn.addEventListener("click", () => {
    let modal = document.getElementById("targetReachedModal");
    if (modal) modal.style.display = "none";
  });
}
let resetBtn = document.getElementById("resetActiveCounterBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    zikrCounts[activeZikr.id] = 0;
    activeLap = 1;
    saveCounts();
    updateActiveUI();
  });
}
let soundTogBtn = document.getElementById("soundToggleBtn");
let soundIcon = document.getElementById("soundIcon");
if (soundTogBtn) {
  soundTogBtn.addEventListener("click", () => {
    isAudioEnabled = !isAudioEnabled;
    if (soundIcon) {
      soundIcon.className = isAudioEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
    }
  });
}
let soundSelect = document.getElementById("soundTypeSelect");
let sumSound = document.getElementById("summarySoundMode");
if (soundSelect) {
  soundSelect.addEventListener("change", (e) => {
    soundMode = e.target.value;
    if (sumSound) sumSound.innerText = e.target.options[e.target.selectedIndex].text;
    playZikrSound();
  });
}
document.querySelectorAll(".target-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".target-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeTarget = parseInt(btn.getAttribute("data-target"));
    activeLap = 1;
    updateActiveUI();
  });
});
let currentDuaAudio = null;
let currentDuaBtn = null;
let currentSpeechUtt = null;
function resetDuaBtn(btnEl) {
  if (!btnEl) return;
  btnEl.classList.remove("speaking");
  let ic = btnEl.querySelector("i");
  if (ic) ic.className = "fa-solid fa-volume-high";
}
function speakArabicText(arabicText, btnEl) {
  if (!("speechSynthesis" in window)) { resetDuaBtn(btnEl); return; }
  window.speechSynthesis.cancel();
  let doSpeak = () => {
    let utt = new SpeechSynthesisUtterance(arabicText);
    utt.lang = "ar-SA";
    utt.rate = 0.78;
    utt.pitch = 1.05;
    let voices = window.speechSynthesis.getVoices();
    let arVoice = voices.find(v => v.lang && v.lang.startsWith("ar"));
    if (arVoice) utt.voice = arVoice;
    currentSpeechUtt = utt;
    currentDuaBtn = btnEl;
    if (btnEl) {
      btnEl.classList.add("speaking");
      let icon = btnEl.querySelector("i");
      if (icon) icon.className = "fa-solid fa-volume-high fa-beat";
    }
    utt.onend = () => { resetDuaBtn(btnEl); currentDuaBtn = null; currentSpeechUtt = null; };
    utt.onerror = () => { resetDuaBtn(btnEl); currentDuaBtn = null; currentSpeechUtt = null; };
    window.speechSynthesis.speak(utt);
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener("voiceschanged", function handler() {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      doSpeak();
    });
  } else {
    doSpeak();
  }
}
function playDuaAudio(audioUrl, arabicText, btnEl) {
  if (currentDuaAudio) {
    currentDuaAudio.pause();
    currentDuaAudio = null;
    let prev = currentDuaBtn;
    currentDuaBtn = null;
    resetDuaBtn(prev);
    if (prev === btnEl) return;
  }
  if (currentSpeechUtt) {
    window.speechSynthesis.cancel();
    currentSpeechUtt = null;
    let prev = currentDuaBtn;
    currentDuaBtn = null;
    resetDuaBtn(prev);
    if (prev === btnEl) return;
  }
  if (audioUrl && audioUrl.includes("everyayah.com")) {
    let audio = new Audio();
    currentDuaAudio = audio;
    currentDuaBtn = btnEl;
    if (btnEl) {
      btnEl.classList.add("speaking");
      let icon = btnEl.querySelector("i");
      if (icon) icon.className = "fa-solid fa-volume-high fa-beat";
    }
    audio.src = audioUrl;
    audio.onended = () => { resetDuaBtn(btnEl); currentDuaAudio = null; currentDuaBtn = null; };
    audio.onerror = () => { currentDuaAudio = null; currentDuaBtn = null; speakArabicText(arabicText, btnEl); };
    audio.play().catch(() => { currentDuaAudio = null; currentDuaBtn = null; speakArabicText(arabicText, btnEl); });
  } else {
    speakArabicText(arabicText, btnEl);
  }
}
let speakBtn = document.getElementById("speakZikrBtn");
if (speakBtn) {
  speakBtn.addEventListener("click", () => {
    playDuaAudio("", activeZikr.arabic, speakBtn);
  });
}
function renderZikrChips() {
  let carousel = document.getElementById("zikrListCarousel");
  if (!carousel) return;
  carousel.innerHTML = "";
  zikrCatalog.forEach((item) => {
    let chip = document.createElement("button");
    chip.className = "zikr-chip" + (item.id === activeZikr.id ? " active" : "");
    chip.innerHTML = `<span>${item.name}</span> <span style="font-family:'Amiri';font-size:15px;color:#fbbf24;">${item.arabic}</span>`;
    chip.addEventListener("click", () => {
      activeZikr = item;
      activeLap = 1;
      updateActiveUI();
    });
    carousel.appendChild(chip);
  });
}
function renderZikrGrid() {
  let grid = document.getElementById("zikrCardsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  zikrCatalog.forEach((item) => {
    let count = zikrCounts[item.id] || 0;
    let card = document.createElement("div");
    card.className = "zikr-grid-card" + (item.id === activeZikr.id ? " active-card" : "");
    card.innerHTML = `
      <div class="z-card-top">
        <span class="z-title">${item.name}</span>
        <span class="z-arabic-small">${item.arabic}</span>
      </div>
      <div class="z-trans-small">${item.trans}</div>
      <div class="z-counter-row">
        <span class="z-count-num" id="cardCount_${item.id}">${count}</span>
        <span class="z-target-badge">Goal: ${item.defaultTarget}</span>
      </div>
      <div class="z-card-actions">
        <button class="z-tap-btn" id="btnCount_${item.id}"><i class="fa-solid fa-plus"></i> Count</button>
        <button class="z-reset-mini" id="btnReset_${item.id}" title="Reset"><i class="fa-solid fa-rotate-left"></i></button>
      </div>
    `;
    let countBtn = card.querySelector(`#btnCount_${item.id}`);
    let resetMiniBtn = card.querySelector(`#btnReset_${item.id}`);
    if (countBtn) {
      countBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        zikrCounts[item.id]++;
        lifetimeTotal++;
        saveCounts();
        playZikrSound();
        if (item.id === activeZikr.id) updateActiveUI();
        else {
          let cEl = card.querySelector(`#cardCount_${item.id}`);
          if (cEl) cEl.innerText = zikrCounts[item.id];
        }
      });
    }
    if (resetMiniBtn) {
      resetMiniBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        zikrCounts[item.id] = 0;
        saveCounts();
        if (item.id === activeZikr.id) updateActiveUI();
        else {
          let cEl = card.querySelector(`#cardCount_${item.id}`);
          if (cEl) cEl.innerText = 0;
        }
      });
    }
    card.addEventListener("click", () => {
      activeZikr = item;
      activeLap = 1;
      updateActiveUI();
    });
    grid.appendChild(card);
  });
}
let resetAllBtn = document.getElementById("resetAllZikrsBtn");
if (resetAllBtn) {
  resetAllBtn.addEventListener("click", () => {
    if (confirm("Reset all Zikr counters to 0?")) {
      zikrCatalog.forEach((item) => {
        zikrCounts[item.id] = 0;
      });
      activeLap = 1;
      saveCounts();
      updateActiveUI();
    }
  });
}
let activeDuaCat = "all";
let duaSearchTerm = "";
function renderDuas() {
  let grid = document.getElementById("duasCatalogGrid");
  if (!grid) return;
  grid.innerHTML = "";
  let filtered = duasData.filter((d) => {
    let matchCat = activeDuaCat === "all" || d.cat === activeDuaCat;
    let matchSearch =
      d.title.toLowerCase().includes(duaSearchTerm) ||
      d.arabic.includes(duaSearchTerm) ||
      d.trans.toLowerCase().includes(duaSearchTerm) ||
      d.mean.toLowerCase().includes(duaSearchTerm) ||
      d.urdu.includes(duaSearchTerm);
    return matchCat && matchSearch;
  });
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;color:#94a3b8;">No matching supplications found. Try a different search term.</div>`;
    return;
  }
  filtered.forEach((dua) => {
    let card = document.createElement("div");
    card.className = "dua-card";
    card.innerHTML = `
      <div class="dua-card-head">
        <span class="dua-category-tag">${dua.cat}</span>
        <div class="dua-card-actions">
          <button class="mini-icon-btn copy-btn" title="Copy Dua text"><i class="fa-regular fa-copy"></i></button>
          <button class="mini-icon-btn speak-dua-btn" title="Recite Dua"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
      <h4>${dua.title}</h4>
      <div class="dua-arabic-text">${dua.arabic}</div>
      <div class="dua-trans-text">"${dua.trans}"</div>
      <div class="dua-meaning-text">${dua.mean}</div>
      <div class="dua-urdu-text">${dua.urdu}</div>
    `;
    let copyBtn = card.querySelector(".copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(`${dua.arabic}\n${dua.trans}\n${dua.mean}\n${dua.urdu}`);
        copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color:#34d399"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 1500);
      });
    }
    let speakDuaBtn = card.querySelector(".speak-dua-btn");
    if (speakDuaBtn) {
      speakDuaBtn.addEventListener("click", () => {
        playDuaAudio(dua.audio, dua.arabic, speakDuaBtn);
      });
    }
    grid.appendChild(card);
  });
}
let sInput = document.getElementById("duaSearchInput");
if (sInput) {
  sInput.addEventListener("input", (e) => {
    duaSearchTerm = e.target.value.toLowerCase().trim();
    renderDuas();
  });
}
document.querySelectorAll(".cat-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".cat-pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeDuaCat = pill.getAttribute("data-cat");
    renderDuas();
  });
});
saveCounts();
updateActiveUI();
renderDuas();
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
