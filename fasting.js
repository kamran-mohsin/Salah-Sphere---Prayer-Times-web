const cityData = {
  Lahore: { sehri: "04:52", iftar: "18:15", name: "Lahore, Pakistan" },
  Karachi: { sehri: "05:14", iftar: "18:32", name: "Karachi, Pakistan" },
  Islamabad: { sehri: "04:50", iftar: "18:18", name: "Islamabad, Pakistan" },
  Makkah: { sehri: "05:02", iftar: "18:28", name: "Makkah, Saudi Arabia" },
  Madinah: { sehri: "05:04", iftar: "18:29", name: "Madinah, Saudi Arabia" },
  Dubai: { sehri: "05:01", iftar: "18:22", name: "Dubai, UAE" },
  Istanbul: { sehri: "05:38", iftar: "19:04", name: "Istanbul, Turkey" },
  London: { sehri: "05:22", iftar: "18:50", name: "London, UK" },
  New_York: { sehri: "05:35", iftar: "18:55", name: "New York, USA" }
};
let savedCity = localStorage.getItem("fasting_saved_city") || "Lahore, Pakistan";
let currentSehriStr = "04:52";
let currentIftarStr = "18:15";
let cityPill = document.getElementById("fastingCityName");
if (cityPill) cityPill.innerText = savedCity;
let fastStreak = parseInt(localStorage.getItem("fast_streak_count") || "0");
let totalFasts = parseInt(localStorage.getItem("total_fasts_count") || "0");
let sunnahFasts = parseInt(localStorage.getItem("sunnah_fasts_count") || "0");
let qadhaFasts = parseInt(localStorage.getItem("qadha_fasts_count") || "0");
let waterCups = parseInt(localStorage.getItem("fasting_water_cups") || "0");
let todayStr = new Date().toDateString();
let isFastingToday = localStorage.getItem("fasting_active_date") === todayStr;
function applyCity(cityName) {
  let key = cityName.replace(/\s+/g, "_");
  if (cityData[key]) {
    currentSehriStr = cityData[key].sehri;
    currentIftarStr = cityData[key].iftar;
    savedCity = cityData[key].name;
    updateCityUI();
  } else {
    fetchCityTimes(cityName);
  }
}
async function fetchCityTimes(city) {
  try {
    let res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=`);
    let data = await res.json();
    if (data && data.data && data.data.timings) {
      currentSehriStr = data.data.timings.Fajr.substring(0, 5);
      currentIftarStr = data.data.timings.Maghrib.substring(0, 5);
      savedCity = city;
      updateCityUI();
    }
  } catch (e) {
    savedCity = city;
    updateCityUI();
  }
}
function updateCityUI() {
  if (cityPill) cityPill.innerText = savedCity;
  document.querySelectorAll(".city-pill-btn").forEach((b) => {
    let c = b.getAttribute("data-city");
    if (c && savedCity.toLowerCase().includes(c.toLowerCase().replace("_", " "))) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });
  localStorage.setItem("fasting_saved_city", savedCity);
  runCountdown();
}
document.querySelectorAll(".city-pill-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    let c = btn.getAttribute("data-city");
    applyCity(c);
  });
});
let fInput = document.getElementById("fastingSearchInput");
let fSearchBtn = document.getElementById("fastingSearchBtn");
if (fSearchBtn && fInput) {
  fSearchBtn.addEventListener("click", () => {
    let q = fInput.value.trim();
    if (q) applyCity(q);
  });
  fInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      let q = fInput.value.trim();
      if (q) applyCity(q);
    }
  });
}
function updateCountersUI() {
  let sEl = document.getElementById("fastStreakNum");
  if (sEl) sEl.innerText = fastStreak;
  let tfEl = document.getElementById("totalFastsCount");
  if (tfEl) tfEl.innerText = totalFasts;
  let sfEl = document.getElementById("sunnahFastsCount");
  if (sfEl) sfEl.innerText = sunnahFasts;
  let qfEl = document.getElementById("qadhaFastsCount");
  if (qfEl) qfEl.innerText = qadhaFasts;
  let fBtn = document.getElementById("toggleFastTodayBtn");
  let fText = document.getElementById("toggleFastBtnText");
  let statusBadge = document.getElementById("heroFastingStatus");
  if (fBtn && fText) {
    if (isFastingToday) {
      fBtn.classList.add("fasting-active");
      fText.innerText = "Fasting Today (Active)";
      if (statusBadge) statusBadge.innerText = "Fasting in Progress";
    } else {
      fBtn.classList.remove("fasting-active");
      fText.innerText = "I am Fasting Today";
      if (statusBadge) statusBadge.innerText = "Non-Fasting Window";
    }
  }
}
let toggleBtn = document.getElementById("toggleFastTodayBtn");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    isFastingToday = !isFastingToday;
    if (isFastingToday) {
      localStorage.setItem("fasting_active_date", todayStr);
      fastStreak++;
      totalFasts++;
      let dayIdx = new Date().getDay();
      if (dayIdx === 1 || dayIdx === 4) sunnahFasts++;
    } else {
      localStorage.removeItem("fasting_active_date");
      if (fastStreak > 0) fastStreak--;
      if (totalFasts > 0) totalFasts--;
    }
    localStorage.setItem("fast_streak_count", fastStreak);
    localStorage.setItem("total_fasts_count", totalFasts);
    localStorage.setItem("sunnah_fasts_count", sunnahFasts);
    updateCountersUI();
  });
}
let decQfBtn = document.getElementById("decQadhaFastBtn");
let incQfBtn = document.getElementById("incQadhaFastBtn");
if (decQfBtn) {
  decQfBtn.addEventListener("click", () => {
    if (qadhaFasts > 0) {
      qadhaFasts--;
      localStorage.setItem("qadha_fasts_count", qadhaFasts);
      updateCountersUI();
    }
  });
}
if (incQfBtn) {
  incQfBtn.addEventListener("click", () => {
    qadhaFasts++;
    localStorage.setItem("qadha_fasts_count", qadhaFasts);
    updateCountersUI();
  });
}
let waterContainer = document.getElementById("waterCupsContainer");
let waterText = document.getElementById("waterCountText");
let resetWaterBtn = document.getElementById("resetWaterBtn");
function playWaterCelebrationSound() {
  try {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  } catch (e) {}
}
function checkWaterCompletion() {
  if (waterCups === 8) {
    playWaterCelebrationSound();
    let modal = document.getElementById("waterCelebrationModal");
    if (modal) modal.style.display = "flex";
    let refillBtn = document.getElementById("refillWaterBtn");
    if (refillBtn) {
      refillBtn.onclick = () => {
        if (modal) modal.style.display = "none";
        waterCups = 0;
        localStorage.setItem("fasting_water_cups", 0);
        renderWater();
      };
    }
  }
}
function renderWater() {
  if (!waterContainer) return;
  waterContainer.innerHTML = "";
  for (let i = 1; i <= 8; i++) {
    let btn = document.createElement("button");
    btn.className = "water-cup-btn" + (i <= waterCups ? " filled" : "");
    btn.innerHTML = '<i class="fa-solid fa-droplet"></i>';
    btn.title = `Cup ${i} (250ml)`;
    btn.addEventListener("click", () => {
      waterCups = i === waterCups ? i - 1 : i;
      localStorage.setItem("fasting_water_cups", waterCups);
      renderWater();
      if (waterCups === 8) checkWaterCompletion();
    });
    waterContainer.appendChild(btn);
  }
  if (waterText) waterText.innerText = `${waterCups}/8 Cups (${waterCups * 250}ml)`;
}
if (resetWaterBtn) {
  resetWaterBtn.addEventListener("click", () => {
    waterCups = 0;
    localStorage.setItem("fasting_water_cups", 0);
    renderWater();
  });
}
let currentFastAudio = null;
let currentFastBtn = null;
function playFastDua(text, btn) {
  if (currentFastAudio) {
    currentFastAudio.pause();
    currentFastAudio = null;
    if (currentFastBtn) {
      let icon = currentFastBtn.querySelector("i");
      if (icon) icon.className = "fa-solid fa-volume-high";
    }
    if (currentFastBtn === btn) {
      currentFastBtn = null;
      return;
    }
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    let utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ar-SA";
    utt.rate = 0.8;
    utt.pitch = 1.05;
    let voices = window.speechSynthesis.getVoices();
    let arVoice = voices.find((v) => v.lang && v.lang.startsWith("ar"));
    if (arVoice) utt.voice = arVoice;
    currentFastBtn = btn;
    if (btn) {
      let icon = btn.querySelector("i");
      if (icon) icon.className = "fa-solid fa-volume-high fa-beat";
    }
    utt.onend = () => {
      if (btn) {
        let icon = btn.querySelector("i");
        if (icon) icon.className = "fa-solid fa-volume-high";
      }
      currentFastBtn = null;
    };
    utt.onerror = () => {
      if (btn) {
        let icon = btn.querySelector("i");
        if (icon) icon.className = "fa-solid fa-volume-high";
      }
      currentFastBtn = null;
    };
    window.speechSynthesis.speak(utt);
  }
}
let suhoorAudioBtn = document.getElementById("playSuhoorDuaBtn");
if (suhoorAudioBtn) {
  suhoorAudioBtn.addEventListener("click", () => {
    playFastDua("وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ", suhoorAudioBtn);
  });
}
let iftarAudioBtn = document.getElementById("playIftarDuaBtn");
if (iftarAudioBtn) {
  iftarAudioBtn.addEventListener("click", () => {
    playFastDua("اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ", iftarAudioBtn);
  });
}
function pad(num) {
  return num < 10 ? "0" + num : num;
}
function format12h(timeStr) {
  let [h, m] = timeStr.split(":").map(Number);
  let suff = h >= 12 ? "PM" : "AM";
  let h12 = h % 12 || 12;
  return `${pad(h12)}:${pad(m)} ${suff}`;
}
function runCountdown() {
  let now = new Date();
  let [sH, sM] = currentSehriStr.split(":").map(Number);
  let [iH, iM] = currentIftarStr.split(":").map(Number);
  let sehriTime = new Date();
  sehriTime.setHours(sH, sM, 0, 0);
  let iftarTime = new Date();
  iftarTime.setHours(iH, iM, 0, 0);
  let sDisp = document.getElementById("sehriTimeDisplay");
  let iDisp = document.getElementById("iftarTimeDisplay");
  if (sDisp) sDisp.innerText = format12h(currentSehriStr);
  if (iDisp) iDisp.innerText = format12h(currentIftarStr);
  let target;
  let eventTitle = document.getElementById("nextEventTitle");
  let isCurrentlyFastingTime = now >= sehriTime && now < iftarTime;
  if (isCurrentlyFastingTime) {
    target = iftarTime;
    if (eventTitle) eventTitle.innerText = "Countdown to Iftar (Breaking Fast)";
    let totalSpan = iftarTime - sehriTime;
    let elapsed = now - sehriTime;
    let pct = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
    let fill = document.getElementById("fastingProgressFill");
    if (fill) fill.style.width = pct + "%";
    let elText = document.getElementById("fastingElapsedText");
    if (elText) elText.innerText = `Fasting Progress: ${Math.round(pct)}% elapsed`;
  } else {
    if (now >= iftarTime) {
      sehriTime.setDate(sehriTime.getDate() + 1);
    }
    target = sehriTime;
    if (eventTitle) eventTitle.innerText = "Countdown to Suhoor (Sehri Ends)";
    let fill = document.getElementById("fastingProgressFill");
    if (fill) fill.style.width = "0%";
    let elText = document.getElementById("fastingElapsedText");
    if (elText) elText.innerText = "Non-Fasting Window (Hydration & Rest)";
  }
  let diff = Math.max(0, target - now);
  let hrs = Math.floor(diff / (1000 * 60 * 60));
  let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let secs = Math.floor((diff % (1000 * 60)) / 1000);
  let hEl = document.getElementById("cdHours");
  let mEl = document.getElementById("cdMins");
  let sEl = document.getElementById("cdSecs");
  if (hEl) hEl.innerText = pad(hrs);
  if (mEl) mEl.innerText = pad(mins);
  if (sEl) sEl.innerText = pad(secs);
}
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
setInterval(runCountdown, 1000);
applyCity(savedCity);
renderWater();
updateCountersUI();
