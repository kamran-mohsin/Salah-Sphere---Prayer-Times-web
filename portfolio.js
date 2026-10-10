const val = document.querySelector(".search input");
const searchBtn = document.querySelector(".search .glass");
const fajTime = document.querySelector(".fajr time");
const dhurTime = document.querySelector(".duhr time");
const AsrTime = document.querySelector(".asr time");
const MgribTime = document.querySelector(".mgrib time");
const IshaTime = document.querySelector(".isha time");
const City = document.querySelector(".location p");
const cut = document.querySelector(".search .cut");
const Time = document.querySelector(".location time");
const liveTime = document.querySelector(".clock b");
const pray = document.querySelector(".pray h2");
const remainingTime = document.querySelector(".pray time");
const currentPrayName = document.querySelector(
  ".current-prayer-btn .current-name",
);
const islamicDateElem = document.querySelector(".islamic-date");
const prayerStatusTag = document.querySelector(".prayer-status-tag");
const detectBtn = document.querySelector(".detect");
let timer;
let f, d, s, m, i, sr;
cut.addEventListener("click", () => {
  val.value = "";
});
if (detectBtn) {
  detectBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      City.innerText = "Locating...";
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          try {
            let geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`;
            let geoRes = await fetch(geoUrl);
            let geoData = await geoRes.json();
            let myCity =
              geoData.city ||
              geoData.locality ||
              geoData.principalSubdivision ||
              "Islamabad";
            val.value = myCity;
            nextPray(myCity);
          } catch (err) {
            City.innerText = "Location Error";
          }
        },
        () => {
          alert("Location permission denied.");
          City.innerText = val.value || "Islamabad";
        },
      );
    }
  });
}
searchBtn.addEventListener("click", async () => {
  let getCity = val.value;
  nextPray(getCity);
});

val.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    nextPray(val.value);
  }
});
function updateDynamicProgressBar(
  prevTimeStr,
  nextTimeStr,
  prevName,
  nextName,
) {
  if (!prevTimeStr || !nextTimeStr) return;
  const cleanPrev = prevTimeStr.split(" ")[0];
  const cleanNext = nextTimeStr.split(" ")[0];
  const now = new Date();
  const [prevH, prevM] = cleanPrev.split(":").map(Number);
  const [nextH, nextM] = cleanNext.split(":").map(Number);
  const prevPrayer = new Date();
  prevPrayer.setHours(prevH, prevM, 0, 0);
  const nextPrayer = new Date();
  nextPrayer.setHours(nextH, nextM, 0, 0);
  if (nextPrayer < prevPrayer) {
    nextPrayer.setDate(nextPrayer.getDate() + 1);
  }
  if (now < prevPrayer) {
    prevPrayer.setDate(prevPrayer.getDate() - 1);
  }
  const totalDuration = nextPrayer - prevPrayer;
  const elapsed = now - prevPrayer;
  let percentage = (elapsed / totalDuration) * 100;
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  const progressBarFill = document.querySelector(".progress-fill");
  if (progressBarFill) {
    progressBarFill.style.width = percentage.toFixed(2) + "%";
  }
  const leftLabel = document.querySelector(".label-left");
  const rightLabel = document.querySelector(".label-right");
  if (leftLabel) leftLabel.innerText = prevName;
  if (rightLabel) rightLabel.innerText = nextName;
}
function timeToMin(tStr) {
  if (!tStr) return 0;
  let p = tStr.split(" ")[0].split(":");
  return Number(p[0]) * 60 + Number(p[1]);
}
function checkProgress() {
  if (!f || !d || !s || !m || !i) return;
  let now = new Date();
  let nowMin = now.getHours() * 60 + now.getMinutes();
  let fMin = timeToMin(f);
  let srMin = sr
    ? timeToMin(sr)
    : sunriseTimeRaw
      ? timeToMin(sunriseTimeRaw)
      : fMin + 75;
  let dMin = timeToMin(d);
  let sMin = timeToMin(s);
  let mMin = timeToMin(m);
  let iMin = timeToMin(i);
  let currentPray = "Isha";
  let isNoPrayer = false;
  let isZawal = false;
  if (nowMin >= fMin && nowMin < srMin) {
    updateDynamicProgressBar(f, sr || d, "Fajr", sr ? "Sunrise" : "Dhuhr");
    currentPray = "Fajr";
    highlightActivePrayer("Fajr");
  } else if (nowMin >= srMin && nowMin < dMin) {
    updateDynamicProgressBar(sr, d, "Sunrise", "Dhuhr");
    if (nowMin >= dMin - 15) {
      currentPray = "No Active Prayer (Zawal)";
      isZawal = true;
    } else {
      currentPray = "No Active Prayer";
    }
    isNoPrayer = true;
    highlightActivePrayer(pray ? pray.innerText : "Dhuhr");
  } else if (nowMin >= dMin && nowMin < sMin) {
    updateDynamicProgressBar(d, s, "Dhuhr", "Asr");
    currentPray = "Dhuhr";
    highlightActivePrayer("Dhuhr");
  } else if (nowMin >= sMin && nowMin < mMin) {
    updateDynamicProgressBar(s, m, "Asr", "Maghrib");
    currentPray = "Asr";
    highlightActivePrayer("Asr");
  } else if (nowMin >= mMin && nowMin < iMin) {
    updateDynamicProgressBar(m, i, "Maghrib", "Isha");
    currentPray = "Maghrib";
    highlightActivePrayer("Maghrib");
  } else {
    updateDynamicProgressBar(i, f, "Isha", "Fajr");
    currentPray = "Isha";
    highlightActivePrayer("Isha");
  }
  if (currentPrayName) {
    currentPrayName.innerText = currentPray;
  }
  let currentPrayBtn = document.querySelector(".current-prayer-btn");
  if (currentPrayBtn) {
    if (isNoPrayer) {
      currentPrayBtn.classList.add("no-prayer-active");
    } else {
      currentPrayBtn.classList.remove("no-prayer-active");
    }
  }
  if (prayerStatusTag) {
    let isMakrooh =
      (nowMin >= srMin && nowMin < srMin + 15) ||
      (nowMin >= dMin - 15 && nowMin < dMin) ||
      (nowMin >= mMin - 15 && nowMin < mMin);
    if (isZawal) {
      prayerStatusTag.innerText = "⚠️ Zawal (Prohibited)";
      prayerStatusTag.style.color = "#f87171";
      prayerStatusTag.style.borderColor = "rgba(248, 113, 113, 0.4)";
      prayerStatusTag.style.background = "rgba(248, 113, 113, 0.15)";
    } else if (isMakrooh) {
      prayerStatusTag.innerText = "⚠️ Makrooh Time";
      prayerStatusTag.style.color = "#f59e0b";
      prayerStatusTag.style.borderColor = "rgba(245, 158, 11, 0.3)";
      prayerStatusTag.style.background = "rgba(245, 158, 11, 0.15)";
    } else if (nowMin >= srMin + 15 && nowMin < dMin - 15) {
      prayerStatusTag.innerText = "☀️ Chasht / Ishraq";
      prayerStatusTag.style.color = "#38bdf8";
      prayerStatusTag.style.borderColor = "rgba(56, 189, 248, 0.3)";
      prayerStatusTag.style.background = "rgba(56, 189, 248, 0.15)";
    } else {
      prayerStatusTag.innerText = "✓ Safe Time";
      prayerStatusTag.style.color = "#34d399";
      prayerStatusTag.style.borderColor = "rgba(52, 211, 153, 0.3)";
      prayerStatusTag.style.background = "rgba(52, 211, 153, 0.15)";
    }
  }
}
async function nextPray(city) {
  City.innerText = `${city}`;
  let getCur = await API(city);
  let rawtimings = getCur.raw;
  if (islamicDateElem && getCur.hijri) {
    islamicDateElem.innerText = getCur.hijri;
  }
  fajTime.innerText = getCur.format[0];
  dhurTime.innerText = getCur.format[1];
  AsrTime.innerText = getCur.format[2];
  MgribTime.innerText = getCur.format[3];
  IshaTime.innerText = getCur.format[4];
  f = rawtimings.Fajr.split(" ")[0];
  d = rawtimings.Dhuhr.split(" ")[0];
  s = rawtimings.Asr.split(" ")[0];
  m = rawtimings.Maghrib.split(" ")[0];
  i = rawtimings.Isha.split(" ")[0];
  sr = rawtimings.Sunrise ? rawtimings.Sunrise.split(" ")[0] : "";
  let tuluEl = document.getElementById("tulu-time");
  if (tuluEl && rawtimings.Sunrise)
    tuluEl.innerText = `${convertFormat(rawtimings.Sunrise)} + 15m`;
  let zawalEl = document.getElementById("zawal-window-time");
  if (zawalEl && rawtimings.Dhuhr)
    zawalEl.innerText = `15m Before ${convertFormat(rawtimings.Dhuhr)}`;
  let ghurubEl = document.getElementById("ghurub-time");
  if (ghurubEl && (rawtimings.Sunset || rawtimings.Maghrib))
    ghurubEl.innerText = `15m Before ${convertFormat(rawtimings.Sunset || rawtimings.Maghrib)}`;
  let tahajjudEl = document.getElementById("tahajjud-time");
  if (tahajjudEl && rawtimings.Fajr)
    tahajjudEl.innerText = `Till ${convertFormat(rawtimings.Fajr)}`;
  let duhaEl = document.getElementById("duha-time");
  if (duhaEl && rawtimings.Sunrise)
    duhaEl.innerText = `After ${convertFormat(rawtimings.Sunrise)}`;
  let now = new Date();
  let currentTime = now.getHours() + ":" + now.getMinutes();
  let curMint = currentTime.split(":");
  const c = curMint[0] * 60 + Number(curMint[1]);
  let FajTime = f.split(":");
  const fMin = FajTime[0] * 60 + Number(FajTime[1]);
  let dhrTime = d.split(":");
  const dMin = dhrTime[0] * 60 + Number(dhrTime[1]);
  let AsTime = s.split(":");
  const sMin = AsTime[0] * 60 + Number(AsTime[1]);
  let mgbTime = m.split(":");
  const mMin = mgbTime[0] * 60 + Number(mgbTime[1]);
  let ishTime = i.split(":");
  const iMin = ishTime[0] * 60 + Number(ishTime[1]);
  let arr = [
    { name: "Fajr", Time: fMin },
    { name: "Dhuhr", Time: dMin },
    { name: "Asr", Time: sMin },
    { name: "Maghrib", Time: mMin },
    {
      name: "Isha",
      Time: iMin,
    },
  ];
  const next = arr.find((item) => item.Time > c);
  pray.innerText = next ? next.name : "Fajr";
  checkProgress();
  if (rawtimings.Sunrise && rawtimings.Sunset) {
    initSunCurve(rawtimings.Sunrise, rawtimings.Sunset);
  }
}
setInterval(() => {
  let time = new Date().toLocaleTimeString();
  liveTime.innerText = time;
  checkProgress();
  updateSunPosition();
}, 1000);
let date = new Date();
const day = date.toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
Time.innerText = day;
function convertFormat(time) {
  let clean = time.split(" ")[0];
  let a = clean.split(":");
  let hour = Number(a[0]);
  let period = hour >= 12 ? "PM" : "AM";
  if (hour > 12) {
    hour = hour - 12;
  } else if (hour === 0) {
    hour = 12;
  }
  a[0] = hour;
  return a.join(":") + " " + period;
}
const API = async (city) => {
  const url = `https://api.aladhan.com/v1/timingsByAddress?address=${city}&method=1`;
  let response = await fetch(url);
  let data = await response.json();
  let rawtimings = data.data.timings;
  const fajrTime = convertFormat(rawtimings.Fajr);
  const duhrTime = convertFormat(rawtimings.Dhuhr);
  const asrTime = convertFormat(rawtimings.Asr);
  const magribTime = convertFormat(rawtimings.Maghrib);
  const ishaTime = convertFormat(rawtimings.Isha);

  function convertTime() {
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    return h * 3600 + m * 60 + s;
  }

  function prayerSec() {
    if (timer) clearInterval(timer);
    function updateRemaining() {
      let a = data.data.timings.Fajr.split(" ")[0].split(":");
      let se = Number(a[0]) * 3600 + Number(a[1]) * 60;
      let b = data.data.timings.Dhuhr.split(" ")[0].split(":");
      let sc = Number(b[0]) * 3600 + Number(b[1]) * 60;
      let c = data.data.timings.Asr.split(" ")[0].split(":");
      let sn = Number(c[0]) * 3600 + Number(c[1]) * 60;
      let d = data.data.timings.Maghrib.split(" ")[0].split(":");
      let sg = Number(d[0]) * 3600 + Number(d[1]) * 60;
      let e = data.data.timings.Isha.split(" ")[0].split(":");
      let ec = Number(e[0]) * 3600 + Number(e[1]) * 60;

      let arr = [
        { name: "Fajr", time: se },
        { name: "Dhuhr", time: sc },
        { name: "Asr", time: sn },
        { name: "Maghrib", time: sg },
        { name: "Isha", time: ec },
      ];
      let fin = arr.find((item) => item.time > convertTime());
      let remaining;
      if (fin) {
        remaining = fin.time - convertTime();
      } else {
        remaining = 86400 - convertTime() + se;
      }
      let hor = Math.floor(remaining / 3600);
      let remSec = remaining % 3600;
      let result = Math.floor(remSec / 60);
      let s = Math.floor(remaining % 60);
      let horC = String(hor).padStart(2, "0");
      let minC = String(result).padStart(2, "0");
      let secC = String(s).padStart(2, "0");
      let final = `${horC}:${minC}:${secC}`;
      remainingTime.innerText = final;

      let nextPrayerName = fin ? fin.name : "Fajr";
      pray.innerText = nextPrayerName;
    }
    updateRemaining();
    timer = setInterval(updateRemaining, 1000);
  }
  prayerSec();
  let hij = data.data.date ? data.data.date.hijri : null;
  let hijriStr = hij
    ? `${hij.day} ${hij.month.en} ${hij.year} ${hij.designation.abbreviated}`
    : "";
  return {
    format: [fajrTime, duhrTime, asrTime, magribTime, ishaTime],
    raw: rawtimings,
    hijri: hijriStr,
  };
};
function highlightActivePrayer(prayerName) {
  const prayerClasses = {
    Fajr: ".fajr",
    Dhuhr: ".duhr",
    Asr: ".asr",
    Maghrib: ".mgrib",
    Isha: ".isha",
  };
  const target =
    prayerName || (pray && pray.innerText ? pray.innerText.trim() : "");
  document.querySelectorAll(".prayTimes > div").forEach((card) => {
    card.classList.remove("active-prayer");
  });
  const selector = prayerClasses[target];
  if (selector) {
    const card = document.querySelector(selector);
    if (card) {
      card.classList.add("active-prayer");
    }
  }
}
let sunriseTimeRaw = "";
let sunsetTimeRaw = "";
function initSunCurve(sunriseStr, sunsetStr) {
  if (!sunriseStr || !sunsetStr) return;
  sunriseTimeRaw = sunriseStr;
  sunsetTimeRaw = sunsetStr;
  const sunriseElem = document.querySelector(".sunrise-time");
  const sunsetElem = document.querySelector(".sunset-time");
  if (sunriseElem) sunriseElem.innerText = convertFormat(sunriseStr);
  if (sunsetElem) sunsetElem.innerText = convertFormat(sunsetStr);

  updateSunPosition();
}
function updateSunPosition() {
  if (!sunriseTimeRaw || !sunsetTimeRaw) return;
  const cleanSunrise = sunriseTimeRaw.split(" ")[0];
  const cleanSunset = sunsetTimeRaw.split(" ")[0];
  const [riseH, riseM] = cleanSunrise.split(":").map(Number);
  const [setH, setM] = cleanSunset.split(":").map(Number);
  const sunriseSec = riseH * 3600 + riseM * 60;
  const sunsetSec = setH * 3600 + setM * 60;
  const now = new Date();
  const currentSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let progress = 0;
  const statusElem = document.querySelector(".sun-status");
  if (currentSec <= sunriseSec) {
    progress = 0;
    if (statusElem) statusElem.innerText = "Before Sunrise";
  } else if (currentSec >= sunsetSec) {
    progress = 1;
    if (statusElem) statusElem.innerText = "After Sunset";
  } else {
    progress = (currentSec - sunriseSec) / (sunsetSec - sunriseSec);
    if (statusElem) {
      const percent = Math.round(progress * 100);
      statusElem.innerText = `Daylight (${percent}%)`;
    }
  }
  const curveBg = document.getElementById("sun-curve-bg");
  const curveProgress = document.getElementById("sun-curve-progress");
  const sunBall = document.getElementById("moving-sun-group");
  if (curveBg && sunBall) {
    const totalLength = curveBg.getTotalLength();
    const currentDistance = totalLength * progress;
    const point = curveBg.getPointAtLength(currentDistance);
    sunBall.setAttribute("transform", `translate(${point.x}, ${point.y})`);
    if (curveProgress) {
      curveProgress.style.strokeDasharray = totalLength;
      curveProgress.style.strokeDashoffset = totalLength * (1 - progress);
    }
  }
}
try {
  let hf = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (islamicDateElem)
    islamicDateElem.innerText = hf.format(new Date()) + " AH";
} catch (e) {}
nextPray("Islamabad");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));
const sunnahItems = document.querySelectorAll(".sunnah-item");
const sunnahProgressBadge = document.getElementById("sunnahProgressBadge");
const sunnahBarFill = document.getElementById("sunnahBarFill");
const todayKey = "sunnah_" + new Date().toISOString().slice(0, 10);
let sunnahState = {};
try {
  sunnahState = JSON.parse(localStorage.getItem(todayKey)) || {};
} catch (e) {}
function playSunnahCelebrationSound() {
  try {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(
        0.22,
        ctx.currentTime + idx * 0.12 + 0.03,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + idx * 0.12 + 0.38,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  } catch (e) {}
}
function showSunnahCelebration() {
  playSunnahCelebrationSound();
  let existing = document.getElementById("sunnahCelebModal");
  if (existing) existing.remove();
  let modal = document.createElement("div");
  modal.id = "sunnahCelebModal";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.background = "rgba(10, 15, 29, 0.85)";
  modal.style.backdropFilter = "blur(8px)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "99999";
  modal.innerHTML = `
    <div style="background:#1e293b;border:2px solid #34d399;border-radius:24px;padding:32px 28px;max-width:420px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
      <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;color:#34d399;background:rgba(52,211,153,0.15);padding:4px 12px;border-radius:20px;display:inline-block;margin-bottom:14px;">✦ ALHAMDULILLAH ✦</div>
      <div style="font-size:48px;color:#f59e0b;margin-bottom:10px;">🌟</div>
      <h2 style="font-size:20px;font-weight:800;color:#ffffff;margin-bottom:8px;">Masha'Allah! All Sunnah Habits Completed! 🎉</h2>
      <p style="font-size:13px;color:#94a3b8;line-height:1.5;margin-bottom:16px;">You completed all 5 daily Sunnah habits. May Allah reward your devotion! Ticks are restarting for your next round.</p>
      <button id="sunnahRestartBtn" style="background:linear-gradient(135deg,#065f46,#047857);border:1px solid #34d399;color:#ffffff;padding:10px 24px;border-radius:50px;font-weight:700;font-size:13px;cursor:pointer;width:100%;">Start Next Round</button>
    </div>
  `;
  document.body.appendChild(modal);
  let closeAndReset = () => {
    if (modal) modal.remove();
    sunnahState = {};
    localStorage.removeItem(todayKey);
    updateSunnahProgress();
  };
  let btn = modal.querySelector("#sunnahRestartBtn");
  if (btn) btn.onclick = closeAndReset;
  setTimeout(closeAndReset, 4000);
}
function updateSunnahProgress() {
  let doneCount = 0;
  sunnahItems.forEach((item) => {
    let id = item.getAttribute("data-id");
    if (sunnahState[id]) {
      item.classList.add("done");
      doneCount++;
    } else {
      item.classList.remove("done");
    }
  });
  if (sunnahProgressBadge)
    sunnahProgressBadge.innerText = `${doneCount}/${sunnahItems.length} Done`;
  if (sunnahBarFill)
    sunnahBarFill.style.width = `${(doneCount / sunnahItems.length) * 100}%`;
}
updateSunnahProgress();
sunnahItems.forEach((item) => {
  item.addEventListener("click", () => {
    let id = item.getAttribute("data-id");
    let wasDone = !!sunnahState[id];
    sunnahState[id] = !wasDone;
    localStorage.setItem(todayKey, JSON.stringify(sunnahState));
    updateSunnahProgress();
    if (!wasDone) {
      let totalDone = Object.values(sunnahState).filter(Boolean).length;
      if (totalDone === sunnahItems.length) {
        setTimeout(showSunnahCelebration, 300);
      }
    }
  });
});
const copyAyahBtn = document.getElementById("copyAyahBtn");
if (copyAyahBtn) {
  copyAyahBtn.addEventListener("click", () => {
    const text =
      'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ\n"So remember Me; I will remember you. And be grateful to Me and do not deny Me." — Surah Al-Baqarah (2:152)';
    navigator.clipboard.writeText(text).then(() => {
      copyAyahBtn.innerHTML =
        '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
      setTimeout(() => {
        copyAyahBtn.innerHTML =
          '<i class="fa-regular fa-copy"></i> <span>Copy Ayah</span>';
      }, 2000);
    });
  });
}
const playAyahBtn = document.getElementById("playAyahBtn");
let ayahAudio = null;
if (playAyahBtn) {
  playAyahBtn.addEventListener("click", () => {
    if (ayahAudio) {
      ayahAudio.pause();
      ayahAudio = null;
      playAyahBtn.innerHTML =
        '<i class="fa-solid fa-volume-high"></i> <span>Listen Tilawat</span>';
      return;
    }
    ayahAudio = new Audio(
      "https://everyayah.com/data/Alafasy_128kbps/002152.mp3",
    );
    playAyahBtn.innerHTML =
      '<i class="fa-solid fa-volume-high fa-beat"></i> <span>Playing Tilawat...</span>';
    ayahAudio.onended = () => {
      ayahAudio = null;
      playAyahBtn.innerHTML =
        '<i class="fa-solid fa-volume-high"></i> <span>Listen Tilawat</span>';
    };
    ayahAudio.onerror = () => {
      ayahAudio = null;
      playAyahBtn.innerHTML =
        '<i class="fa-solid fa-volume-high"></i> <span>Listen Tilawat</span>';
    };
    ayahAudio.play();
  });
}
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => scrollObserver.observe(el));
