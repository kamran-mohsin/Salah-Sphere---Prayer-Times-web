const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
let qadhaData = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
  repaid: 0,
  target: 5
};
const todayStr = new Date().toISOString().slice(0, 10);
let todayData = {};
try {
  let saved = localStorage.getItem("qadha_data_5");
  if (saved) qadhaData = Object.assign(qadhaData, JSON.parse(saved));
  let savedToday = localStorage.getItem("qadha_today_5_" + todayStr);
  if (savedToday) todayData = JSON.parse(savedToday);
} catch (e) {}
function saveQadha() {
  localStorage.setItem("qadha_data_5", JSON.stringify(qadhaData));
  localStorage.setItem("qadha_today_5_" + todayStr, JSON.stringify(todayData));
}
function updateUI() {
  let totalMissed = 0;
  let todayTotal = 0;
  prayers.forEach((p) => {
    let countElem = document.getElementById("count-" + p);
    let doneElem = document.getElementById("done-" + p);
    let c = qadhaData[p] || 0;
    let d = todayData[p] || 0;
    totalMissed += c;
    todayTotal += d;
    if (countElem) countElem.innerText = c.toLocaleString();
    if (doneElem) doneElem.innerText = "Today: " + d;
  });
  let totalElem = document.getElementById("totalCountDisplay");
  let remElem = document.getElementById("totalRemaining");
  let repaidElem = document.getElementById("totalRepaidDisplay");
  let todayElem = document.getElementById("todayCompleted");
  let targetElem = document.getElementById("targetDisplay");
  let estElem = document.getElementById("estDaysText");
  let pctElem = document.getElementById("progressPctText");
  let barFill = document.getElementById("qadhaBarFill");
  if (totalElem) totalElem.innerText = totalMissed.toLocaleString();
  if (remElem) remElem.innerText = totalMissed.toLocaleString();
  if (repaidElem) repaidElem.innerText = (qadhaData.repaid || 0).toLocaleString();
  if (todayElem) todayElem.innerText = todayTotal.toLocaleString();
  if (targetElem) targetElem.innerText = qadhaData.target;
  let t = qadhaData.target || 5;
  if (estElem) {
    if (totalMissed === 0) {
      estElem.innerText = "Alhamdulillah! All 5 Farz Qadha prayers completed.";
    } else {
      let days = Math.ceil(totalMissed / t);
      let months = (days / 30).toFixed(1);
      estElem.innerText = `Estimated: ~${days} days (${months} months) at ${t} prayers/day`;
    }
  }
  let totalEver = totalMissed + (qadhaData.repaid || 0);
  let pct = 0;
  if (totalEver > 0) {
    pct = Math.round(((qadhaData.repaid || 0) / totalEver) * 100);
  }
  if (pctElem) pctElem.innerText = pct + "%";
  if (barFill) barFill.style.width = pct + "%";
}
document.querySelectorAll(".dec-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    let p = btn.getAttribute("data-prayer");
    if (qadhaData[p] > 0) {
      qadhaData[p]--;
      qadhaData.repaid = (qadhaData.repaid || 0) + 1;
      todayData[p] = (todayData[p] || 0) + 1;
      saveQadha();
      updateUI();
    }
  });
});
document.querySelectorAll(".inc-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    let p = btn.getAttribute("data-prayer");
    qadhaData[p] = (qadhaData[p] || 0) + 1;
    saveQadha();
    updateUI();
  });
});
document.querySelectorAll(".add-five-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    let p = btn.getAttribute("data-prayer");
    qadhaData[p] = (qadhaData[p] || 0) + 5;
    saveQadha();
    updateUI();
  });
});
const decTarget = document.getElementById("decTarget");
const incTarget = document.getElementById("incTarget");
if (decTarget) {
  decTarget.addEventListener("click", () => {
    if (qadhaData.target > 1) {
      qadhaData.target--;
      saveQadha();
      updateUI();
    }
  });
}
if (incTarget) {
  incTarget.addEventListener("click", () => {
    if (qadhaData.target < 50) {
      qadhaData.target++;
      saveQadha();
      updateUI();
    }
  });
}
const calcYears = document.getElementById("calcYears");
const calcMonths = document.getElementById("calcMonths");
const calcDays = document.getElementById("calcDays");
const calcGender = document.getElementById("calcGender");
const calcResult = document.getElementById("calcResultDisplay");
const applyCalcBtn = document.getElementById("applyCalcBtn");
const resetCalcBtn = document.getElementById("resetCalcBtn");
function computeStripCalc() {
  let y = Number(calcYears.value) || 0;
  let m = Number(calcMonths.value) || 0;
  let d = Number(calcDays.value) || 0;
  let isFemale = calcGender.value === "female";
  let daysPerYear = isFemale ? 300 : 365;
  let daysPerMonth = isFemale ? 25 : 30;
  let totalDays = y * daysPerYear + m * daysPerMonth + d;
  let perPrayer = totalDays;
  let grandTotal = perPrayer * 5;
  if (calcResult) {
    calcResult.innerText = `${perPrayer.toLocaleString()} Prayers (${grandTotal.toLocaleString()} Total)`;
  }
  return perPrayer;
}
if (calcYears) calcYears.addEventListener("input", computeStripCalc);
if (calcMonths) calcMonths.addEventListener("input", computeStripCalc);
if (calcDays) calcDays.addEventListener("input", computeStripCalc);
if (calcGender) calcGender.addEventListener("change", computeStripCalc);
if (applyCalcBtn) {
  applyCalcBtn.addEventListener("click", () => {
    let perPrayer = computeStripCalc();
    prayers.forEach((p) => {
      qadhaData[p] = perPrayer;
    });
    saveQadha();
    updateUI();
  });
}
if (resetCalcBtn) {
  resetCalcBtn.addEventListener("click", () => {
    if (confirm("Reset all 5 prayer qadha counters to 0?")) {
      prayers.forEach((p) => {
        qadhaData[p] = 0;
      });
      qadhaData.repaid = 0;
      todayData = {};
      saveQadha();
      updateUI();
    }
  });
}
const daysName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekContainer = document.getElementById("weekRowsContainer");
let habitData = {};
try {
  let savedHabit = localStorage.getItem("salat_habit_week_5");
  if (savedHabit) habitData = JSON.parse(savedHabit);
} catch (e) {}
function playCelebrationSound() {
  try {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
    });
  } catch (e) {}
}
function showHabitToast(msg) {
  let existing = document.getElementById("habitToastMsg");
  if (existing) existing.remove();
  let toast = document.createElement("div");
  toast.id = "habitToastMsg";
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "linear-gradient(135deg, #065f46, #047857)";
  toast.style.color = "#ffffff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "30px";
  toast.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
  toast.style.border = "1px solid #34d399";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "700";
  toast.style.zIndex = "9999";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "8px";
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#fbbf24"></i> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast) toast.remove(); }, 2500);
}
function checkWeekCompletion() {
  let count = 0;
  daysName.forEach((day) => {
    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach((pr) => {
      if (habitData[day + "_" + pr]) count++;
    });
  });
  if (count === 35) {
    playCelebrationSound();
    let modal = document.getElementById("weekCelebrationModal");
    if (modal) modal.style.display = "flex";
    let timer = setTimeout(() => {
      resetWeek();
    }, 4000);
    let nextBtn = document.getElementById("nextWeekBtn");
    if (nextBtn) {
      nextBtn.onclick = () => {
        clearTimeout(timer);
        resetWeek();
      };
    }
  }
}
function resetWeek() {
  let modal = document.getElementById("weekCelebrationModal");
  if (modal) modal.style.display = "none";
  habitData = {};
  localStorage.setItem("salat_habit_week_5", JSON.stringify(habitData));
  renderHabitGrid();
}
function renderHabitGrid() {
  if (!weekContainer) return;
  weekContainer.innerHTML = "";
  daysName.forEach((day) => {
    let row = document.createElement("div");
    row.className = "week-row";
    let daySpan = document.createElement("span");
    daySpan.className = "day-col";
    daySpan.innerText = day;
    row.appendChild(daySpan);
    let dayDone = 0;
    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach((pr) => {
      let key = day + "_" + pr;
      let btn = document.createElement("button");
      btn.className = "prayer-dot-btn";
      if (habitData[key]) {
        btn.classList.add("prayed");
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        dayDone++;
      }
      btn.addEventListener("click", () => {
        let prevVal = !!habitData[key];
        habitData[key] = !prevVal;
        localStorage.setItem("salat_habit_week_5", JSON.stringify(habitData));
        renderHabitGrid();
        if (!prevVal) {
          let updatedDone = 0;
          ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach((p) => {
            if (habitData[day + "_" + p]) updatedDone++;
          });
          if (updatedDone === 5) {
            showHabitToast(`Alhamdulillah! All 5 prayers marked for ${day}! 🌟`);
          }
        }
        checkWeekCompletion();
      });
      row.appendChild(btn);
    });
    let statusSpan = document.createElement("span");
    statusSpan.className = "day-status" + (dayDone === 5 ? " complete" : "");
    statusSpan.innerText = `${dayDone}/5`;
    row.appendChild(statusSpan);
    weekContainer.appendChild(row);
  });
}
renderHabitGrid();
computeStripCalc();
updateUI();
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
