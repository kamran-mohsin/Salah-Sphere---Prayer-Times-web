const cityCoords = {
  Islamabad: { lat: 33.6844, lon: 73.0479, name: "Islamabad, Pakistan" },
  Lahore: { lat: 31.5204, lon: 74.3587, name: "Lahore, Pakistan" },
  Karachi: { lat: 24.8607, lon: 67.0011, name: "Karachi, Pakistan" },
  Makkah: { lat: 21.4225, lon: 39.8262, name: "Makkah, Saudi Arabia" },
  Dubai: { lat: 25.2048, lon: 55.2708, name: "Dubai, UAE" },
  Istanbul: { lat: 41.0082, lon: 28.9784, name: "Istanbul, Turkey" },
  London: { lat: 51.5074, lon: -0.1278, name: "London, UK" },
  New_York: { lat: 40.7128, lon: -74.0060, name: "New York, USA" }
};
let curLat = 33.6844;
let curLon = 73.0479;
let curQibla = 256.4;
let curHeading = 0;
function calcQibla(uLat, uLon) {
  const kLat = 21.422487 * Math.PI / 180;
  const kLon = 39.826206 * Math.PI / 180;
  const phi1 = uLat * Math.PI / 180;
  const phi2 = kLat;
  const dLon = kLon - (uLon * Math.PI / 180);
  const y = Math.sin(dLon);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLon);
  let b = Math.atan2(y, x) * 180 / Math.PI;
  return (b + 360) % 360;
}
function calcDist(uLat, uLon) {
  const R = 6371;
  const dLat = (21.422487 - uLat) * Math.PI / 180;
  const dLon = (39.826206 - uLon) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(uLat * Math.PI / 180) * Math.cos(21.422487 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
function getCompassDir(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  let idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}
const qiblaAngle = document.getElementById("qiblaAngle");
const qiblaDirectionText = document.getElementById("qiblaDirectionText");
const kaabaDistance = document.getElementById("kaabaDistance");
const userLat = document.getElementById("userLat");
const userLon = document.getElementById("userLon");
const currentLocationName = document.getElementById("currentLocationName");
const detectedCityDisplay = document.getElementById("detectedCityDisplay");
const bannerBearing = document.getElementById("bannerBearing");
const alignBanner = document.getElementById("alignBanner");
const alignStatusText = document.getElementById("alignStatusText");
const turnIcon = document.getElementById("turnIcon");
const kaabaPointer = document.getElementById("kaabaPointer");
const compassDisc = document.getElementById("compassDisc");
const compassNeedle = document.getElementById("compassNeedle");
const headingSlider = document.getElementById("headingSlider");
const simHeadingDisplay = document.getElementById("simHeadingDisplay");
const qiblaDetectBtn = document.getElementById("qiblaDetectBtn");
const qiblaSearchInput = document.getElementById("qiblaSearchInput");
const qiblaSearchBtn = document.getElementById("qiblaSearchBtn");
const qiblaSearchCut = document.getElementById("qiblaSearchCut");
const sensorToggleBtn = document.getElementById("sensorToggleBtn");
const sensorDot = document.getElementById("sensorDot");
const sensorLabel = document.getElementById("sensorLabel");
function setLocation(lat, lon, name) {
  curLat = lat;
  curLon = lon;
  curQibla = calcQibla(lat, lon);
  let dist = calcDist(lat, lon);
  let dir = getCompassDir(curQibla);
  if (qiblaAngle) qiblaAngle.innerText = curQibla.toFixed(1) + "°";
  if (qiblaDirectionText) qiblaDirectionText.innerText = dir;
  if (kaabaDistance) kaabaDistance.innerText = dist.toLocaleString();
  if (bannerBearing) bannerBearing.innerText = `${curQibla.toFixed(1)}° ${dir}`;
  if (userLat) userLat.innerText = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  if (userLon) userLon.innerText = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
  if (currentLocationName) currentLocationName.innerText = name;
  if (detectedCityDisplay) detectedCityDisplay.innerText = name.split(",")[0];
  if (qiblaSearchInput) qiblaSearchInput.value = name.split(",")[0];
  if (kaabaPointer) kaabaPointer.style.transform = `rotate(${curQibla}deg)`;
  updateAlignment();
}
function updateAlignment() {
  let diff = (curQibla - curHeading + 360) % 360;
  if (diff > 180) diff -= 360;
  let isAligned = Math.abs(diff) <= 3;
  if (isAligned) {
    if (alignBanner) alignBanner.classList.add("aligned");
    if (alignStatusText) alignStatusText.innerText = "✓ Facing the Holy Kaaba! Allahu Akbar";
    if (turnIcon) {
      turnIcon.className = "fa-solid fa-circle-check";
      turnIcon.style.transform = "none";
    }
  } else {
    if (alignBanner) alignBanner.classList.remove("aligned");
    let absDiff = Math.round(Math.abs(diff));
    if (diff > 0) {
      if (alignStatusText) alignStatusText.innerText = `Turn Right ${absDiff}° to face the Kaaba`;
      if (turnIcon) {
        turnIcon.className = "fa-solid fa-arrow-rotate-right";
        turnIcon.style.transform = "none";
      }
    } else {
      if (alignStatusText) alignStatusText.innerText = `Turn Left ${absDiff}° to face the Kaaba`;
      if (turnIcon) {
        turnIcon.className = "fa-solid fa-arrow-rotate-left";
        turnIcon.style.transform = "none";
      }
    }
  }
}
function setHeading(h) {
  curHeading = (h + 360) % 360;
  if (compassDisc) compassDisc.style.transform = `rotate(${-curHeading}deg)`;
  if (compassNeedle) compassNeedle.style.transform = `rotate(${curHeading}deg)`;
  if (simHeadingDisplay) simHeadingDisplay.innerText = `Heading: ${Math.round(curHeading)}°`;
  updateAlignment();
}
if (headingSlider) {
  headingSlider.addEventListener("input", (e) => {
    setHeading(Number(e.target.value));
  });
}
async function searchCity(cityQuery) {
  if (!cityQuery || !cityQuery.trim()) return;
  let clean = cityQuery.trim();
  let key = clean.replace(" ", "_");
  if (cityCoords[key]) {
    let c = cityCoords[key];
    setLocation(c.lat, c.lon, c.name);
    return;
  }
  if (detectedCityDisplay) detectedCityDisplay.innerText = "Searching...";
  try {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&limit=1`;
    let res = await fetch(url);
    let data = await res.json();
    if (data && data.length > 0) {
      let lat = parseFloat(data[0].lat);
      let lon = parseFloat(data[0].lon);
      let name = data[0].display_name.split(",").slice(0, 2).join(",");
      setLocation(lat, lon, name);
    } else {
      let geoUrl = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(clean)}`;
      let geoRes = await fetch(geoUrl);
      let geoData = await geoRes.json();
      if (geoData && geoData.data && geoData.data.meta) {
        let lat = geoData.data.meta.latitude;
        let lon = geoData.data.meta.longitude;
        setLocation(lat, lon, clean);
      } else {
        alert("City not found. Please try another city.");
        if (detectedCityDisplay) detectedCityDisplay.innerText = "Islamabad";
      }
    }
  } catch (err) {
    alert("Could not load location. Check connection.");
    if (detectedCityDisplay) detectedCityDisplay.innerText = "Islamabad";
  }
}
if (qiblaSearchBtn) {
  qiblaSearchBtn.addEventListener("click", () => {
    searchCity(qiblaSearchInput.value);
  });
}
if (qiblaSearchInput) {
  qiblaSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchCity(qiblaSearchInput.value);
    }
  });
}
if (qiblaSearchCut) {
  qiblaSearchCut.addEventListener("click", () => {
    qiblaSearchInput.value = "";
    qiblaSearchInput.focus();
  });
}
document.querySelectorAll(".city-pill-btn").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".city-pill-btn").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    let key = pill.getAttribute("data-city");
    let c = cityCoords[key] || cityCoords.Islamabad;
    setLocation(c.lat, c.lon, c.name);
  });
});
if (qiblaDetectBtn) {
  qiblaDetectBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      if (detectedCityDisplay) detectedCityDisplay.innerText = "Locating...";
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          try {
            let res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`);
            let data = await res.json();
            let cName = `${data.city || data.locality || data.principalSubdivision || "My Location"}, ${data.countryName || ""}`;
            setLocation(lat, lon, cName);
          } catch (err) {
            setLocation(lat, lon, "Detected GPS");
          }
        },
        () => {
          alert("Location permission denied.");
          if (detectedCityDisplay) detectedCityDisplay.innerText = qiblaSearchInput.value || "Islamabad";
        }
      );
    }
  });
}
let liveSensorActive = false;
function handleOrientation(e) {
  let heading = null;
  if (e.webkitCompassHeading !== undefined) {
    heading = e.webkitCompassHeading;
  } else if (e.alpha !== null) {
    heading = 360 - e.alpha;
  }
  if (heading !== null) {
    setHeading(heading);
    if (headingSlider) headingSlider.value = Math.round(heading);
  }
}
if (sensorToggleBtn) {
  sensorToggleBtn.addEventListener("click", async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        let perm = await DeviceOrientationEvent.requestPermission();
        if (perm === "granted") {
          startSensor();
        } else {
          alert("Compass permission denied.");
        }
      } catch (err) {
        startSensor();
      }
    } else {
      startSensor();
    }
  });
}
function startSensor() {
  if (!liveSensorActive) {
    window.addEventListener("deviceorientation", handleOrientation, true);
    liveSensorActive = true;
    if (sensorDot) sensorDot.classList.add("active");
    if (sensorLabel) sensorLabel.innerText = "Sensor: Live Gyroscope";
    if (sensorToggleBtn) sensorToggleBtn.innerHTML = '<i class="fa-solid fa-check"></i> Live Active';
  } else {
    window.removeEventListener("deviceorientation", handleOrientation, true);
    liveSensorActive = false;
    if (sensorDot) sensorDot.classList.remove("active");
    if (sensorLabel) sensorLabel.innerText = "Sensor: Manual Mode";
    if (sensorToggleBtn) sensorToggleBtn.innerHTML = '<i class="fa-solid fa-mobile-screen"></i> Enable Live Compass';
  }
}
setLocation(curLat, curLon, "Islamabad, Pakistan");
setHeading(0);
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
