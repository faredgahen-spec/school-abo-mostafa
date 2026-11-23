// Student Results Query & Official Certificate Logic
import { 
  db, 
  doc, 
  getDoc, 
  collection, 
  getDocs 
} from "./firebase-config.js";

import { SUBJECTS_CONFIG, TOTAL_MAX_SCORE, calculateTotals, getLocalStudents } from "./teacher.js";

document.addEventListener("DOMContentLoaded", () => {
  const lookupForm = document.getElementById("lookup-form");
  const studentNameInput = document.getElementById("student-name");
  const seatNumberInput = document.getElementById("seat-number");
  const notFoundAlert = document.getElementById("student-not-found-alert");

  // Check URL parameters or search default seat number on page load
  const urlParams = new URLSearchParams(window.location.search);
  const seatParam = urlParams.get("seat");
  const initialSeat = seatParam || (seatNumberInput ? seatNumberInput.value.trim() : "10452");
  
  if (seatParam && seatNumberInput) {
    seatNumberInput.value = seatParam;
  }
  
  if (initialSeat) {
    searchStudentResult(initialSeat);
  }

  if (lookupForm) {
    lookupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const seat = seatNumberInput?.value.trim();
      const name = studentNameInput?.value.trim();

      if (!seat && !name) {
        seatNumberInput?.focus();
        return;
      }

      await searchStudentResult(seat, name);
    });
  }
});

function withTimeout(promise, ms = 2500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), ms))
  ]);
}

export async function searchStudentResult(seatNumber, studentName = "") {
  const submitBtn = document.getElementById("submit-btn");
  const resultView = document.getElementById("result-view");
  const notFoundAlert = document.getElementById("student-not-found-alert");

  if (notFoundAlert) notFoundAlert.classList.add("hidden");

  // Button loading spinner
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-75");
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
      <span>جارِ جلب النتيجة...</span>
    `;
  }

  let studentData = null;

  // 1. Check local persistent store first (always fast and contains newly saved students)
  const localList = getLocalStudents();
  if (seatNumber) {
    studentData = localList.find(s => String(s.seatNumber) === String(seatNumber));
  }
  if (!studentData && studentName) {
    studentData = localList.find(s => s.name && s.name.toLowerCase().includes(studentName.toLowerCase()));
  }

  // 2. If not found locally, query Firebase Firestore with timeout
  if (!studentData) {
    try {
      if (seatNumber) {
        const docRef = doc(db, "students", String(seatNumber));
        const docSnap = await withTimeout(getDoc(docRef), 2500);
        if (docSnap.exists()) {
          studentData = docSnap.data();
        }
      }

      if (!studentData) {
        const querySnapshot = await withTimeout(getDocs(collection(db, "students")), 2500);
        querySnapshot.forEach((d) => {
          const data = d.data();
          if (
            (seatNumber && String(data.seatNumber) === String(seatNumber)) ||
            (studentName && data.name && data.name.includes(studentName))
          ) {
            studentData = data;
          }
        });
      }
    } catch (err) {
      console.warn("Firestore lookup notice:", err);
    }
  }

  // Restore button state
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-75");
    submitBtn.innerHTML = originalBtnHtml;
  }

  if (studentData) {
    renderStudentCertificate(studentData);
    if (resultView) {
      resultView.classList.remove("hidden");
      resultView.classList.add("fade-in");
      resultView.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else {
    if (resultView) resultView.classList.add("hidden");
    if (notFoundAlert) {
      notFoundAlert.classList.remove("hidden");
      notFoundAlert.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

function renderStudentCertificate(data) {
  // Update header info
  const nameEl = document.getElementById("cert-student-name");
  const seatEl = document.getElementById("cert-seat-number");
  const stageEl = document.getElementById("cert-stage-name");
  const statusEl = document.getElementById("cert-status-badge");
  const apprecEl = document.getElementById("cert-appreciation-badge");
  const totalScoreEl = document.getElementById("cert-total-score");
  const percentEl = document.getElementById("cert-percentage");
  const progressBarEl = document.getElementById("cert-progress-bar");
  const subjectsContainer = document.getElementById("cert-subjects-list");

  if (nameEl) nameEl.textContent = data.name;
  if (seatEl) seatEl.textContent = data.seatNumber;
  if (stageEl) stageEl.textContent = data.gradeLevel || "الصف الأول الثانوي (عام)";
  if (statusEl) statusEl.textContent = data.status || "ناجح";
  if (apprecEl) apprecEl.textContent = data.appreciation || "ممتاز";
  if (totalScoreEl) totalScoreEl.textContent = data.total;
  if (percentEl) percentEl.textContent = `${data.percentage}%`;
  if (progressBarEl) progressBarEl.style.width = `${data.percentage}%`;

  // Render 9 subjects with progress bars
  if (subjectsContainer && data.grades) {
    subjectsContainer.innerHTML = SUBJECTS_CONFIG.map((sub, idx) => {
      const score = Number(data.grades[sub.id]) || 0;
      const subPct = Number(((score / sub.max) * 100).toFixed(1));
      let subRating = "مقبول";
      let ratingClass = "bg-surface-container text-on-surface";
      let barColor = "bg-secondary";

      if (subPct >= 85) {
        subRating = "ممتاز";
        ratingClass = "bg-tertiary-fixed text-on-tertiary-fixed";
        barColor = "bg-on-tertiary-container";
      } else if (subPct >= 75) {
        subRating = "جيد جداً";
        ratingClass = "bg-secondary-fixed text-on-secondary-fixed";
        barColor = "bg-secondary";
      } else if (subPct >= 65) {
        subRating = "جيد";
        ratingClass = "bg-primary-fixed text-on-primary-fixed";
        barColor = "bg-primary";
      } else if (subPct < 50) {
        subRating = "دور ثان";
        ratingClass = "bg-error-container text-on-error-container";
        barColor = "bg-error";
      }

      const isAlternate = idx % 2 === 1;
      const bgClass = isAlternate ? "bg-surface-container-low/40" : "bg-surface-container-lowest";

      return `
        <div class="p-space-md flex flex-col gap-space-xs ${bgClass} hover:bg-surface-container-low/70 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-space-xs">
              <span class="w-2.5 h-2.5 rounded-full ${barColor}"></span>
              <span class="font-title-md text-title-md text-on-surface font-semibold">${idx + 1}. ${sub.name}</span>
            </div>
            <div class="flex items-center gap-space-sm">
              <span class="font-label-md text-label-md px-space-xs py-0.5 rounded ${ratingClass} font-bold">${subRating}</span>
              <span class="font-title-md text-title-md text-primary font-bold font-mono">${score} <span class="text-on-surface-variant text-body-sm font-normal">/ ${sub.max}</span></span>
            </div>
          </div>
          <div class="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
            <div class="${barColor} h-full rounded-full transition-all duration-1000" style="width: ${subPct}%;"></div>
          </div>
        </div>
      `;
    }).join("");
  }
}

// Global actions
window.resetQuery = function() {
  const nameInput = document.getElementById("student-name");
  const seatInput = document.getElementById("seat-number");
  const notFoundAlert = document.getElementById("student-not-found-alert");
  const resultView = document.getElementById("result-view");

  if (nameInput) nameInput.value = "";
  if (seatInput) seatInput.value = "";
  if (notFoundAlert) notFoundAlert.classList.add("hidden");
  if (resultView) resultView.classList.add("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
  seatInput?.focus();
};

window.printReportCard = function() {
  window.print();
};
