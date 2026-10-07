const todayKey = new Date().toISOString().slice(0,10);
let actData = { xp: 0, streak: 0, badges: [], lastDay: "", todayXp: 0, sadaqahCounts: {}, journalEntries: [] };
try { let s = localStorage.getItem("activity_hub_v1"); if(s) actData = Object.assign(actData, JSON.parse(s)); } catch(e) {}
if(actData.lastDay !== todayKey) { actData.todayXp = 0; actData.lastDay = todayKey; saveActData(); }
function saveActData() { localStorage.setItem("activity_hub_v1", JSON.stringify(actData)); }
let todayChallenges = {};
try { let c = localStorage.getItem("act_challenges_"+todayKey); if(c) todayChallenges = JSON.parse(c); } catch(e) {}
function saveChallenges() { localStorage.setItem("act_challenges_"+todayKey, JSON.stringify(todayChallenges)); }
const challenges = [
  { id:"fajr", icon:"🌅", title:"Pray Fajr on Time", desc:"Wake up before sunrise and pray Fajr", xp:20 },
  { id:"quran", icon:"📖", title:"Read 1 Page Quran", desc:"Read at least one page of the Holy Quran", xp:15 },
  { id:"tasbeeh100", icon:"📿", title:"100x SubhanAllah", desc:"Complete 100 repetitions of SubhanAllah", xp:10 },
  { id:"sadaqah", icon:"🤲", title:"Give Sadaqah", desc:"Give charity or help someone today", xp:15 },
  { id:"sunnah", icon:"☀️", title:"2 Sunnah Prayers", desc:"Pray at least 2 Sunnah rakats today", xp:10 },
  { id:"dhikr", icon:"💫", title:"Morning Adhkar", desc:"Complete morning remembrance after Fajr", xp:10 },
  { id:"dua", icon:"🙏", title:"Make Heartfelt Dua", desc:"Spend 5 minutes in sincere supplication", xp:10 },
  { id:"family", icon:"❤️", title:"Be Kind to Family", desc:"Do something kind for a family member", xp:10 },
];
const sadaqahDeeds = [
  { id:"smile", icon:"😊", label:"Smiled at someone" },
  { id:"help", icon:"🤝", label:"Helped someone" },
  { id:"food", icon:"🍱", label:"Gave food" },
  { id:"money", icon:"💵", label:"Gave charity" },
  { id:"dua2", icon:"🙏", label:"Made dua for others" },
  { id:"teach", icon:"📚", label:"Taught something" },
  { id:"visit", icon:"🏠", label:"Visited family/sick" },
  { id:"water", icon:"💧", label:"Gave water" },
  { id:"plant", icon:"🌱", label:"Planted/watered plant" },
  { id:"kind", icon:"💌", label:"Said kind words" },
];
const allBadges = [
  { id:"first_done", emoji:"⭐", name:"First Step", desc:"Complete your first challenge" },
  { id:"all_daily", emoji:"🏆", name:"Perfect Day", desc:"Complete all daily challenges" },
  { id:"quiz_ace", emoji:"🎓", name:"Quiz Ace", desc:"Score 5/5 in the quiz" },
  { id:"streak3", emoji:"🔥", name:"3-Day Streak", desc:"Use Activity Hub 3 days in a row" },
  { id:"journal5", emoji:"📓", name:"Reflector", desc:"Write 5 journal entries" },
  { id:"sadaqah10", emoji:"🤲", name:"Generous", desc:"Log 10 good deeds total" },
  { id:"xp100", emoji:"💎", name:"Century", desc:"Earn 100 XP total" },
  { id:"xp500", emoji:"👑", name:"Champion", desc:"Earn 500 XP total" },
  { id:"breather", emoji:"🌬️", name:"Mindful Soul", desc:"Complete 3 breathing sessions" },
];
let breathingSessions = 0;
try { breathingSessions = parseInt(localStorage.getItem("act_breath_sessions")||"0"); } catch(e) {}
let totalSadaqahCount = 0;
Object.values(actData.sadaqahCounts||{}).forEach(v => { totalSadaqahCount += v; });
function awardXp(amount) {
  actData.xp += amount;
  actData.todayXp = (actData.todayXp||0) + amount;
  saveActData();
  updateStatsUI();
  checkBadges();
}
function showCelebModal(emoji, title, msg) {
  let modal = document.getElementById("actCelebModal");
  let emEl = document.getElementById("actCelebEmoji");
  let ttl = document.getElementById("actCelebTitle");
  let msgEl = document.getElementById("actCelebMsg");
  if(emEl) emEl.textContent = emoji;
  if(ttl) ttl.textContent = title;
  if(msgEl) msgEl.textContent = msg;
  if(modal) { modal.style.display = "flex"; playCelebSound(); }
}
function playCelebSound() {
  try {
    let ctx = new (window.AudioContext||window.webkitAudioContext)();
    [523,659,784,1047].forEach((f,i) => {
      let o=ctx.createOscillator(), g=ctx.createGain();
      o.type="sine"; o.frequency.value=f;
      g.gain.setValueAtTime(0.001,ctx.currentTime+i*0.1);
      g.gain.exponentialRampToValueAtTime(0.22,ctx.currentTime+i*0.1+0.03);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.1+0.38);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime+i*0.1); o.stop(ctx.currentTime+i*0.1+0.4);
    });
  } catch(e) {}
}
let pendingChallengesReset = false;
let closeBtn = document.getElementById("actCelebCloseBtn");
if(closeBtn) closeBtn.addEventListener("click",()=>{
  document.getElementById("actCelebModal").style.display="none";
  if(pendingChallengesReset) {
    pendingChallengesReset = false;
    todayChallenges = {};
    saveChallenges();
    renderChallenges();
    updateStatsUI();
  }
});
function resetDailyChallenges() {
  todayChallenges = {};
  saveChallenges();
  renderChallenges();
  updateStatsUI();
}
let resetChBtn = document.getElementById("resetChallengesBtn");
if(resetChBtn) resetChBtn.addEventListener("click", resetDailyChallenges);
function checkBadges() {
  let newBadge = false;
  let totalDone = Object.keys(todayChallenges).filter(k=>todayChallenges[k]).length;
  function award(id) {
    if(!actData.badges.includes(id)) { actData.badges.push(id); saveActData(); renderBadges(); newBadge=true; return true; }
    return false;
  }
  if(totalDone>=1) award("first_done");
  if(totalDone>=challenges.length) award("all_daily");
  if(actData.xp>=100) award("xp100");
  if(actData.xp>=500) award("xp500");
  if(breathingSessions>=3) award("breather");
  if((actData.journalEntries||[]).length>=5) award("journal5");
  if(totalSadaqahCount>=10) award("sadaqah10");
  let el=document.getElementById("actBadgeCount"); if(el) el.textContent=actData.badges.length;
}
function updateStatsUI() {
  let xpEl=document.getElementById("actXpDisplay"); if(xpEl) xpEl.textContent=actData.xp;
  let xpBadge=document.getElementById("activityXpBadge"); if(xpBadge) xpBadge.textContent=actData.xp;
  let todayXpEl=document.getElementById("actTodayXp"); if(todayXpEl) todayXpEl.textContent=actData.todayXp||0;
  let bar=document.getElementById("actXpBarFill"); if(bar) bar.style.width=Math.min(100,(actData.todayXp||0))+"%" ;
  let tipEl=document.getElementById("actXpTip");
  if(tipEl) {
    let tx=actData.todayXp||0;
    if(tx>=100) tipEl.textContent="Masha'Allah! Daily goal reached! Keep going!";
    else if(tx>=50) tipEl.textContent="Great progress! You're halfway there!";
    else tipEl.textContent="Complete daily challenges to earn XP and level up your Deen!";
  }
  let doneEl=document.getElementById("actDoneToday");
  if(doneEl) doneEl.textContent=Object.keys(todayChallenges).filter(k=>todayChallenges[k]).length;
  let streakEl=document.getElementById("actStreakDisplay"); if(streakEl) streakEl.textContent=actData.streak||0;
  let badgeEl=document.getElementById("actBadgeCount"); if(badgeEl) badgeEl.textContent=actData.badges.length;
}
function renderChallenges() {
  let grid=document.getElementById("dailyChallengesGrid"); if(!grid) return;
  grid.innerHTML="";
  challenges.forEach(ch => {
    let done=!!todayChallenges[ch.id];
    let card=document.createElement("div");
    card.className="challenge-card"+(done?" done":"");
    card.innerHTML=`<div class="challenge-icon">${ch.icon}</div><div class="challenge-info"><div class="challenge-title">${ch.title}</div><div class="challenge-desc">${ch.desc}</div><div class="challenge-xp">+${ch.xp} XP</div></div><div class="challenge-tick">${done?'<i class="fa-solid fa-check"></i>':''}</div>`;
    card.addEventListener("click",()=>{
      if(!done) {
        todayChallenges[ch.id]=true;
        saveChallenges();
        awardXp(ch.xp);
        renderChallenges();
        updateStatsUI();
        if(Object.keys(todayChallenges).filter(k=>todayChallenges[k]).length===challenges.length) {
          pendingChallengesReset = true;
          setTimeout(()=>{
            showCelebModal("🎉","Masha'Allah! All Challenges Completed!","Incredible consistency! You completed all 8 challenges. Click below to start a fresh round and keep your good deeds going!");
          },350);
        }
      } else {
        todayChallenges[ch.id]=false;
        saveChallenges();
        renderChallenges();
        updateStatsUI();
      }
    });
    grid.appendChild(card);
  });
}
function renderSadaqah() {
  let grid=document.getElementById("sadaqahDeedsGrid"); if(!grid) return;
  grid.innerHTML="";
  sadaqahDeeds.forEach(d => {
    let count=(actData.sadaqahCounts||{})[d.id]||0;
    let btn=document.createElement("button");
    btn.className="sadaqah-deed-btn"+(count>0?" logged":"");
    btn.innerHTML=`<span class="deed-icon">${d.icon}</span>${d.label}<span class="sadaqah-deed-count">${count>0?"x"+count:""}</span>`;
    btn.addEventListener("click",()=>{
      if(!actData.sadaqahCounts) actData.sadaqahCounts={};
      actData.sadaqahCounts[d.id]=(actData.sadaqahCounts[d.id]||0)+1;
      totalSadaqahCount++;
      awardXp(5);
      saveActData();
      let tot=document.getElementById("sadaqahTotalToday");
      let total=Object.values(actData.sadaqahCounts).reduce((a,b)=>a+b,0);
      if(tot) tot.textContent=total;
      renderSadaqah();
    });
    grid.appendChild(btn);
  });
  let tot=document.getElementById("sadaqahTotalToday");
  if(tot) { let total=Object.values(actData.sadaqahCounts||{}).reduce((a,b)=>a+b,0); tot.textContent=total; }
}
function renderBadges() {
  let grid=document.getElementById("badgesGrid"); if(!grid) return;
  grid.innerHTML="";
  allBadges.forEach(b => {
    let earned=actData.badges.includes(b.id);
    let card=document.createElement("div");
    card.className="badge-card"+(earned?" earned":"");
    card.innerHTML=`<span class="badge-emoji">${b.emoji}</span><span class="badge-name">${b.name}</span><span class="badge-desc">${b.desc}</span>`;
    grid.appendChild(card);
  });
}
const journalPrompts = [
  "What are you most grateful to Allah for today?",
  "How did you draw closer to Allah this week?",
  "What is one thing you want to improve in your Ibadah?",
  "Which quality of Allah (SWT) touched your heart today?",
  "Write about a moment today where you felt Allah's mercy.",
  "What dua is closest to your heart right now?",
  "How can you be a better Muslim tomorrow?",
  "What lesson did you learn from the Quran today?",
  "Who in your life are you grateful for? Make dua for them.",
  "What small act of Sadaqah can you do tomorrow?",
];
function renderJournal() {
  let today=new Date();
  let idx=today.getDate()%journalPrompts.length;
  let promptEl=document.getElementById("journalPrompt"); if(promptEl) promptEl.textContent='"'+journalPrompts[idx]+'"';
  let list=document.getElementById("journalSavedList"); if(!list) return;
  list.innerHTML="";
  let entries=(actData.journalEntries||[]).slice().reverse().slice(0,5);
  entries.forEach(e => {
    let div=document.createElement("div");
    div.className="journal-entry";
    div.innerHTML=`<div class="journal-entry-date">${e.date}</div><div>${e.text}</div>`;
    list.appendChild(div);
  });
}
let journalTA=document.getElementById("journalTextarea");
let journalChars=document.getElementById("journalChars");
if(journalTA && journalChars) {
  journalTA.addEventListener("input",()=>{ journalChars.textContent=(journalTA.value.length)+" / 300"; });
}
let journalSaveBtn=document.getElementById("journalSaveBtn");
if(journalSaveBtn) {
  journalSaveBtn.addEventListener("click",()=>{
    let ta=document.getElementById("journalTextarea");
    if(!ta||!ta.value.trim()) return;
    if(!actData.journalEntries) actData.journalEntries=[];
    actData.journalEntries.push({ date: new Date().toLocaleDateString("en-PK",{weekday:"short",day:"numeric",month:"short"}), text: ta.value.trim() });
    awardXp(15);
    saveActData();
    ta.value="";
    if(journalChars) journalChars.textContent="0 / 300";
    renderJournal();
    showCelebModal("📓","Reflection Saved!","JazakAllah Khair! Your spiritual reflection has been saved. +15 XP earned!");
  });
}
const quizQuestions = [
  { q:"How many obligatory prayers are there in a day?", opts:["3","4","5","6"], ans:2 },
  { q:"Which surah is called 'The Heart of the Quran'?", opts:["Al-Fatiha","Yaseen","Al-Baqarah","Al-Ikhlas"], ans:1 },
  { q:"What is the Arabic word for obligatory prayer?", opts:["Sunnah","Nafl","Fardh","Waajib"], ans:2 },
  { q:"Which prophet built the Kaaba with his son?", opts:["Musa (A.S)","Isa (A.S)","Ibrahim (A.S)","Nuh (A.S)"], ans:2 },
  { q:"How many Surahs are there in the Quran?", opts:["109","112","114","120"], ans:2 },
  { q:"What does 'Alhamdulillah' mean?", opts:["God is Great","All praise be to Allah","Glory be to Allah","Allah is sufficient"], ans:1 },
  { q:"In which month was the Quran first revealed?", opts:["Muharram","Sha'ban","Ramadan","Dhul-Hijjah"], ans:2 },
  { q:"What is the minimum number of rakats in Fajr prayer?", opts:["1","2","3","4"], ans:1 },
  { q:"Which angel is responsible for delivering revelation?", opts:["Mikail","Israfil","Jibreel","Azrael"], ans:2 },
  { q:"What is the holy book of Islam called?", opts:["Torah","Zabur","Injeel","Quran"], ans:3 },
];
let quizSet = [], quizIndex = 0, quizScore = 0;
function startQuiz() {
  let shuffled = [...quizQuestions].sort(()=>Math.random()-0.5).slice(0,5);
  quizSet=shuffled; quizIndex=0; quizScore=0;
  document.getElementById("quizQuestionWrap").style.display="";
  document.getElementById("quizResultWrap").style.display="none";
  document.getElementById("quizEndWrap").style.display="none";
  renderQuizQuestion();
}
function renderQuizQuestion() {
  let q=quizSet[quizIndex];
  document.getElementById("quizQNum").textContent="Question "+(quizIndex+1)+" of "+quizSet.length;
  document.getElementById("quizQuestion").textContent=q.q;
  let opts=document.getElementById("quizOptions"); opts.innerHTML="";
  q.opts.forEach((opt,i)=>{
    let btn=document.createElement("button");
    btn.className="quiz-opt-btn"; btn.textContent=opt;
    btn.addEventListener("click",()=>{
      let allBtns=opts.querySelectorAll(".quiz-opt-btn");
      allBtns.forEach(b=>b.disabled=true);
      if(i===q.ans) { btn.classList.add("correct"); quizScore++; }
      else { btn.classList.add("wrong"); allBtns[q.ans].classList.add("correct"); }
      document.getElementById("quizQuestionWrap").style.display="none";
      let res=document.getElementById("quizResultWrap"); res.style.display="flex";
      document.getElementById("quizResultIcon").textContent=i===q.ans?"✅":"❌";
      document.getElementById("quizResultMsg").textContent=i===q.ans?"Correct! Masha'Allah! (+10 XP)":"That's not right. The correct answer is: "+q.opts[q.ans];
      if(i===q.ans) awardXp(10);
    });
    opts.appendChild(btn);
  });
}
let quizNextBtn=document.getElementById("quizNextBtn");
if(quizNextBtn) quizNextBtn.addEventListener("click",()=>{
  quizIndex++;
  if(quizIndex>=quizSet.length) {
    document.getElementById("quizResultWrap").style.display="none";
    document.getElementById("quizEndWrap").style.display="flex";
    document.getElementById("quizEndTitle").textContent="Quiz Complete!";
    document.getElementById("quizEndMsg").textContent="You scored "+quizScore+" out of "+quizSet.length+". "+(quizScore===quizSet.length?"Perfect score! Masha'Allah! +50 Bonus XP!":quizScore>=3?"Great effort! Keep learning!":"Keep practicing, every question is a lesson!");
    if(quizScore===quizSet.length) { if(!actData.badges.includes("quiz_ace")) { actData.badges.push("quiz_ace"); saveActData(); renderBadges(); } awardXp(50); showCelebModal("🎓","Quiz Ace!","You scored perfectly! Masha'Allah! +50 Bonus XP awarded!"); }
  } else {
    document.getElementById("quizResultWrap").style.display="none";
    document.getElementById("quizQuestionWrap").style.display="";
    renderQuizQuestion();
  }
});
let quizRestartBtn=document.getElementById("quizRestartBtn");
if(quizRestartBtn) quizRestartBtn.addEventListener("click",startQuiz);
const breathZikrs = ["سُبْحَانَ اللَّهِ","الْحَمْدُ لِلَّهِ","اللَّهُ أَكْبَرُ","لَا إِلٰهَ إِلَّا اللّٰهُ","أَسْتَغْفِرُ اللَّهَ"];
let breathActive=false, breathInterval=null, breathPhaseIndex=0, breathRoundsCount=0;
const breathPhases=[{name:"Inhale",dur:4,cls:"inhale"},{name:"Hold",dur:4,cls:"hold"},{name:"Exhale",dur:6,cls:"exhale"},{name:"Rest",dur:2,cls:""}];
let breathPhaseTimer=0, breathCurrentPhase=0, breathZikrIdx=0;
function startBreathing() {
  breathActive=true;
  breathRoundsCount=0; breathPhaseTimer=0; breathCurrentPhase=0;
  document.getElementById("breathStartBtn").style.display="none";
  document.getElementById("breathStopBtn").style.display="";
  document.getElementById("breathRounds").textContent="0";
  document.getElementById("breathXpEarned").textContent="0";
  document.getElementById("breathZikrArabic").textContent=breathZikrs[0];
  runBreathPhase();
}
function runBreathPhase() {
  if(!breathActive) return;
  let phase=breathPhases[breathCurrentPhase];
  let circle=document.getElementById("breathCircle");
  let textEl=document.getElementById("breathText");
  let phaseEl=document.getElementById("breathPhase");
  if(circle) { circle.className="breath-circle"+(phase.cls?" "+phase.cls:""); }
  if(textEl) textEl.textContent=phase.name;
  if(phaseEl) phaseEl.textContent=phase.name==="Inhale"?"Breathe in slowly...":phase.name==="Hold"?"Hold gently...":phase.name==="Exhale"?"Release slowly...":"Rest...";
  breathInterval=setTimeout(()=>{
    breathCurrentPhase=(breathCurrentPhase+1)%breathPhases.length;
    if(breathCurrentPhase===0) {
      breathRoundsCount++;
      let rEl=document.getElementById("breathRounds"); if(rEl) rEl.textContent=breathRoundsCount;
      breathZikrIdx=(breathZikrIdx+1)%breathZikrs.length;
      let zEl=document.getElementById("breathZikrArabic"); if(zEl) zEl.textContent=breathZikrs[breathZikrIdx];
      if(breathRoundsCount%3===0) { awardXp(5); let xpEl=document.getElementById("breathXpEarned"); if(xpEl) xpEl.textContent=Math.floor(breathRoundsCount/3)*5; }
      if(breathRoundsCount===5) {
        breathingSessions++;
        localStorage.setItem("act_breath_sessions",breathingSessions);
        checkBadges();
        showCelebModal("🌬️","Breathing Session Complete!","Masha'Allah! 5 rounds completed. You earned XP for mindfulness!");
        stopBreathing();
        return;
      }
    }
    if(breathActive) runBreathPhase();
  }, breathPhases[breathCurrentPhase].dur*1000);
}
function stopBreathing() {
  breathActive=false;
  clearTimeout(breathInterval);
  document.getElementById("breathStartBtn").style.display="";
  document.getElementById("breathStopBtn").style.display="none";
  let circle=document.getElementById("breathCircle");
  if(circle) circle.className="breath-circle";
  let textEl=document.getElementById("breathText"); if(textEl) textEl.textContent="Tap to Start";
  let phaseEl=document.getElementById("breathPhase"); if(phaseEl) phaseEl.textContent="Breathe & Remember Allah";
}
let breathStartBtn=document.getElementById("breathStartBtn");
let breathStopBtn=document.getElementById("breathStopBtn");
if(breathStartBtn) breathStartBtn.addEventListener("click",startBreathing);
if(breathStopBtn) breathStopBtn.addEventListener("click",stopBreathing);
renderChallenges();
renderSadaqah();
renderBadges();
renderJournal();
startQuiz();
updateStatsUI();
checkBadges();
const observer=new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); }); },{threshold:0.1});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
