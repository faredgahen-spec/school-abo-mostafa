// Teacher Dashboard Logic & Firebase Firestore Integration
import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from "./firebase-config.js";

// Subjects configuration with max and min grades
export const SUBJECTS_CONFIG = [
  { id: "arabic", name: "اللغة العربية", max: 50, min: 25 },
  { id: "math", name: "الرياضيات العامة", max: 60, min: 30 },
  { id: "science", name: "العلوم المتكاملة", max: 60, min: 30 },
  { id: "programming", name: "البرمجة والذكاء الاصطناعي", max: 40, min: 20 },
  { id: "religion", name: "التربية الدينية", max: 40, min: 20 },
  { id: "philosophy", name: "الفلسفة ومبادئ التفكير", max: 40, min: 20 },
  { id: "english", name: "اللغة الإنجليزية", max: 50, min: 25 },
  { id: "history", name: "التاريخ والحضارة", max: 40, min: 20 },
  { id: "french", name: "اللغة الفرنسية (لغة ثانية)", max: 40, min: 20 },
];

export const TOTAL_MAX_SCORE = 420;
const STORAGE_KEY = "SCHOOL_STUDENTS_DATA";

// Initial demo students
export const INITIAL_DEMO_STUDENTS = [
  {
    seatNumber: "10452",
    name: "أحمد محمد علي حسن",
    gradeLevel: "الصف الأول الثانوي (عام)",
    grades: {
      arabic: 46,
      math: 55,
      science: 52,
      programming: 38,
      religion: 37,
      philosophy: 35,
      english: 44,
      history: 36,
      french: 36
    },
    total: 379,
    percentage: 90.2,
    appreciation: "ممتاز",
    status: "ناجح بتفوق"
  },
  {
    seatNumber: "10453",
    name: "ياسمين طارق كامل",
    gradeLevel: "الصف الأول الثانوي (عام)",
    grades: {
      arabic: 48,
      math: 58,
      science: 57,
      programming: 39,
      religion: 38,
      philosophy: 38,
      english: 47,
      history: 39,
      french: 38
    },
    total: 402,
    percentage: 95.7,
    appreciation: "ممتاز مرتفع",
    status: "ناجح بتفوق"
  },
  {
    seatNumber: "10454",
    name: "عمر خالد منصور",
    gradeLevel: "الصف الأول الثانوي (عام)",
    grades: {
      arabic: 40,
      math: 48,
      science: 45,
      programming: 32,
      religion: 34,
      philosophy: 30,
      english: 38,
      history: 31,
      french: 32
    },
    total: 330,
    percentage: 78.5,
    appreciation: "جيد جداً",
    status: "ناجح"
  }
];

// Persistent local storage helpers
export function getLocalStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Storage read error:", e);
  }
  // Initialize with demo students
  setLocalStudents(INITIAL_DEMO_STUDENTS);
  return [...INITIAL_DEMO_STUDENTS];
}

export function setLocalStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.warn("Storage write error:", e);
  }
}

let allStudents = getLocalStudents();

// Calculate total metrics
export function calculateTotals(grades) {
  let total = 0;
  for (const sub of SUBJECTS_CONFIG) {
    const val = Number(grades[sub.id]) || 0;
    total += val;
  }
  const percentage = Number(((total / TOTAL_MAX_SCORE) * 100).toFixed(1));
  
  let appreciation = "مقبول";
  let status = "ناجح";

  if (percentage >= 85) {
    appreciation = percentage >= 95 ? "ممتاز مرتفع" : "ممتاز";
    status = "ناجح بتفوق";
  } else if (percentage >= 75) {
    appreciation = "جيد جداً";
    status = "ناجح";
  } else if (percentage >= 65) {
    appreciation = "جيد";
    status = "ناجح";
  } else if (percentage >= 50) {
    appreciation = "مقبول";
    status = "ناجح";
  } else {
    appreciation = "ضعيف";
    status = "له دور ثان";
  }

  return { total, percentage, appreciation, status };
}

// Timeout helper for promises so Firestore calls never hang UI
function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), ms))
  ]);
}

// Show Firebase notification banner
function showFirebaseNotice(type, title, message) {
  let banner = document.getElementById("firebase-status-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "firebase-status-banner";
    const container = document.querySelector("main .flex-col");
    if (container) {
      container.insertBefore(banner, container.firstChild);
    }
  }

  const isWarning = type === "warning" || type === "error";
  banner.className = `w-full p-4 rounded-xl mb-3 flex items-start gap-3 border shadow-sm transition-all ${
    isWarning 
      ? "bg-amber-50 border-amber-300 text-amber-900" 
      : "bg-emerald-50 border-emerald-300 text-emerald-900"
  }`;

  banner.innerHTML = `
    <span class="material-symbols-outlined text-2xl shrink-0 mt-0.5 ${
      isWarning ? "text-amber-600" : "text-emerald-600"
    }">
      ${isWarning ? "cloud_alert" : "cloud_done"}
    </span>
    <div class="flex-1 text-right">
      <div class="font-bold text-sm">${title}</div>
      <div class="text-xs mt-1 leading-relaxed">${message}</div>
    </div>
    <button type="button" onclick="this.parentElement.remove()" class="text-xs opacity-60 hover:opacity-100 p-1">
      <span class="material-symbols-outlined text-lg">close</span>
    </button>
  `;
}

// Initialize Teacher Dashboard
export async function initTeacherDashboard() {
  const studentFormSection = document.getElementById("studentFormSection");
  const toggleFormBtn = document.getElementById("toggleFormBtn");
  const saveBtn = document.getElementById("saveStudentBtn") || document.getElementById("saveGradesBtn");
  const resetBtn = document.getElementById("resetFormBtn");
  const searchInput = document.getElementById("studentSearchInput");
  const gradeInputs = document.querySelectorAll(".grade-input");

  // Initial render from local storage immediately!
  renderStudentsTable(allStudents);

  // Toggle form visibility
  if (toggleFormBtn && studentFormSection) {
    toggleFormBtn.addEventListener("click", () => {
      studentFormSection.classList.toggle("hidden");
      if (!studentFormSection.classList.contains("hidden")) {
        studentFormSection.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("studentName")?.focus();
      }
    });
  }

  const subjectKeys = ["arabic", "math", "science", "programming", "religion", "philosophy", "english", "history", "french"];

  // Recalculate summary metrics as teacher inputs grades
  function updateLiveSummary() {
    const grades = {};
    gradeInputs.forEach((input, idx) => {
      const subId = input.getAttribute("data-subject") || subjectKeys[idx];
      if (subId) {
        grades[subId] = Number(input.value) || 0;
      }
    });

    const { total, percentage, appreciation } = calculateTotals(grades);
    
    const liveTotalEl = document.getElementById("liveCalculatedTotal") || document.getElementById("calculatedTotal");
    const livePercentEl = document.getElementById("liveCalculatedPercentage");
    const liveApprecEl = document.getElementById("liveCalculatedAppreciation") || document.getElementById("calculatedStatus");

    if (liveTotalEl) liveTotalEl.textContent = total;
    if (livePercentEl) livePercentEl.textContent = `${percentage}%`;
    if (liveApprecEl) liveApprecEl.textContent = appreciation;
  }

  gradeInputs.forEach((input) => {
    input.addEventListener("input", updateLiveSummary);
  });

  // Reset form
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearForm();
    });
  }

  // Save student handler
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const nameInput = document.getElementById("studentName");
      const seatInput = document.getElementById("seatNumber");

      const name = nameInput ? nameInput.value.trim() : "";
      const seatNumber = seatInput ? seatInput.value.trim() : "";

      // Validation
      if (!name || !seatNumber) {
        let msg = "يرجى استكمال البيانات المطلوبة:\n";
        if (!name) {
          msg += "- اسم الطالب رباعي\n";
          nameInput?.classList.add("ring-2", "ring-error", "bg-red-50");
        }
        if (!seatNumber) {
          msg += "- رقم الجلوس\n";
          seatInput?.classList.add("ring-2", "ring-error", "bg-red-50");
        }

        alert(msg);
        
        setTimeout(() => {
          nameInput?.classList.remove("ring-2", "ring-error", "bg-red-50");
          seatInput?.classList.remove("ring-2", "ring-error", "bg-red-50");
        }, 3000);

        if (!name) nameInput?.focus();
        else if (!seatNumber) seatInput?.focus();
        return;
      }

      // Collect subject grades
      const grades = {};
      gradeInputs.forEach((input, idx) => {
        const subId = input.getAttribute("data-subject") || subjectKeys[idx];
        if (subId) {
          grades[subId] = Number(input.value) || 0;
        }
      });

      const { total, percentage, appreciation, status } = calculateTotals(grades);

      const studentData = {
        name,
        seatNumber: String(seatNumber),
        gradeLevel: "الصف الأول الثانوي (عام)",
        grades,
        total,
        percentage,
        appreciation,
        status,
        savedAt: new Date().toISOString()
      };

      // 1. SAVE IMMEDIATELY TO LOCAL STORAGE (Guaranteed instant save!)
      const existingIdx = allStudents.findIndex(s => String(s.seatNumber) === String(seatNumber));
      if (existingIdx >= 0) {
        allStudents[existingIdx] = studentData;
      } else {
        allStudents.unshift(studentData);
      }
      setLocalStudents(allStudents);
      renderStudentsTable(allStudents);

      // Button feedback
      const originalText = saveBtn.innerHTML;
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">sync</span><span>جاري الحفظ في الكنترول والسحابة...</span>';

      // 2. ATTEMPT SYNC WITH FIREBASE FIRESTORE (with 3-second timeout guard)
      let firebaseSaved = false;
      let firebaseErrorMsg = "";

      try {
        await withTimeout(setDoc(doc(db, "students", String(seatNumber)), {
          ...studentData,
          updatedAt: serverTimestamp()
        }), 3500);

        firebaseSaved = true;
      } catch (err) {
        console.warn("Firebase Firestore Sync Notice:", err);
        firebaseErrorMsg = err.code || err.message || "فشل الاتصال";
      }

      // Restore button and notify
      if (firebaseSaved) {
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check_circle</span><span>تم الاعتماد والحفظ في فايربيز!</span>';
        saveBtn.classList.remove("bg-primary", "bg-primary-container");
        saveBtn.classList.add("bg-emerald-600");
        showFirebaseNotice(
          "success",
          "تم الحفظ بنجاح في قاعدة بيانات فايربيز!",
          `تم حفظ بيانات ودرجات الطالب "${name}" (رقم جلوس: ${seatNumber}) في الكنترول وقاعدة بيانات Cloud Firestore.`
        );
      } else {
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check</span><span>تم الحفظ في الكنترول محلياً!</span>';
        saveBtn.classList.remove("bg-primary", "bg-primary-container");
        saveBtn.classList.add("bg-amber-600");

        showFirebaseNotice(
          "warning",
          "تم الحفظ في الكنترول بنجاح! (تنبيه فايربيز)",
          `تم تسجيل الطالب "${name}" في الكنترول وأصبح متاحاً للاستعلام فوراً. <br/>
          <strong>ملاحظة للمزامنة مع سحابة فايربيز:</strong> قاعدة بيانات Firestore حالياً ترفض الكتابة (Permission Denied). يرجى فتح Firebase Console وإتاحة القواعد (Rules) في تبويب Firestore Database.`
        );
      }

      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.classList.remove("bg-emerald-600", "bg-amber-600");
        saveBtn.classList.add("bg-primary");
        saveBtn.disabled = false;
        clearForm();
      }, 2200);
    });
  }

  // Search filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.trim().toLowerCase();
      if (!term) {
        renderStudentsTable(allStudents);
        return;
      }
      const filtered = allStudents.filter(
        (s) => s.name.toLowerCase().includes(term) || String(s.seatNumber).includes(term)
      );
      renderStudentsTable(filtered);
    });
  }

  // Real-time listener for Firestore (with graceful fallback)
  try {
    const studentsCol = collection(db, "students");
    onSnapshot(studentsCol, (snapshot) => {
      if (!snapshot.empty) {
        const cloudStudents = [];
        snapshot.forEach((docSnap) => {
          cloudStudents.push(docSnap.data());
        });
        
        // Merge cloud students with local students
        cloudStudents.forEach(cs => {
          const idx = allStudents.findIndex(s => String(s.seatNumber) === String(cs.seatNumber));
          if (idx >= 0) allStudents[idx] = cs;
          else allStudents.push(cs);
        });

        setLocalStudents(allStudents);
        renderStudentsTable(allStudents);
      }
    }, (error) => {
      console.warn("Firestore snapshot listener notice (working in local storage mode):", error.message);
    });
  } catch (err) {
    console.warn("Firestore listener init note:", err);
  }
}

// Render cards list in teacher dashboard
export function renderStudentsTable(students) {
  const container = document.getElementById("studentsContainer") || document.getElementById("studentsListContainer");
  const countBadge = document.getElementById("recordedCountBadge");
  if (countBadge) countBadge.textContent = `${students.length} طلاب`;

  if (!container) return;

  if (students.length === 0) {
    container.innerHTML = `
      <div class="p-space-lg text-center bg-surface-container-low rounded-xl text-on-surface-variant border border-surface-container">
        <span class="material-symbols-outlined text-4xl text-outline mb-1">person_off</span>
        <p class="font-title-md">لا توجد نتائج مطابقة للبحث</p>
      </div>
    `;
    return;
  }

  container.innerHTML = students.map((s) => `
    <article class="student-card w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm border border-surface-container hover:shadow-md transition-all" data-seat="${s.seatNumber}" data-name="${s.name}">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-space-xs">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            <span class="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <div class="flex flex-col text-right">
            <span class="font-title-md text-title-md text-primary font-bold">${s.name}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">رقم الجلوس: <span class="font-mono text-secondary font-bold">${s.seatNumber}</span></span>
          </div>
        </div>
        <span class="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold ${
          s.percentage >= 85 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-secondary-fixed text-on-secondary-fixed'
        }">
          ${s.appreciation} (${s.percentage}%)
        </span>
      </div>

      <div class="grid grid-cols-2 gap-space-xs bg-surface-container-low p-space-xs rounded-lg text-center border border-surface-container">
        <div>
          <span class="font-label-sm text-label-sm text-outline">المجموع الكلي:</span>
          <span class="font-title-md text-title-md text-primary font-bold font-mono"> ${s.total} / ${TOTAL_MAX_SCORE}</span>
        </div>
        <div>
          <span class="font-label-sm text-label-sm text-outline">الحالة الأكاديمية:</span>
          <span class="font-label-md text-label-md text-on-tertiary-container font-bold"> ${s.status}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-surface-container">
        <a href="student-results.html?seat=${s.seatNumber}" class="text-secondary hover:text-primary font-bold text-xs flex items-center gap-1">
          <span class="material-symbols-outlined text-[18px]">visibility</span>
          <span>عرض الشهادة الرسمية</span>
        </a>
        <div class="flex items-center gap-space-xs">
          <button class="edit-btn p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors cursor-pointer" data-seat="${s.seatNumber}" title="تعديل الدرجات">
            <span class="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button class="delete-btn p-1.5 rounded-lg bg-surface-container hover:bg-error-container text-error transition-colors cursor-pointer" data-seat="${s.seatNumber}" title="حذف الطالب">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </article>
  `).join("");

  // Hook delete & edit buttons
  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const seat = e.currentTarget.getAttribute("data-seat");
      if (confirm(`هل أنت متأكد من حذف الطالب رقم جلوس: ${seat} نهائياً من الكنترول؟`)) {
        // Remove locally
        allStudents = allStudents.filter(s => String(s.seatNumber) !== String(seat));
        setLocalStudents(allStudents);
        renderStudentsTable(allStudents);

        // Attempt cloud delete
        try {
          await withTimeout(deleteDoc(doc(db, "students", String(seat))), 3000);
        } catch (err) {
          console.warn("Delete cloud sync notice:", err);
        }
      }
    });
  });

  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const seat = e.currentTarget.getAttribute("data-seat");
      const student = allStudents.find(s => String(s.seatNumber) === String(seat));
      if (student) {
        populateFormForEdit(student);
      }
    });
  });
}

function populateFormForEdit(student) {
  const formSection = document.getElementById("studentFormSection");
  if (formSection) formSection.classList.remove("hidden");

  const nameInput = document.getElementById("studentName");
  const seatInput = document.getElementById("seatNumber");

  if (nameInput) nameInput.value = student.name;
  if (seatInput) seatInput.value = student.seatNumber;

  const gradeInputs = document.querySelectorAll(".grade-input");
  gradeInputs.forEach((input) => {
    const subId = input.getAttribute("data-subject");
    if (student.grades && student.grades[subId] !== undefined) {
      input.value = student.grades[subId];
    } else {
      input.value = "";
    }
  });

  // Trigger calculation
  const evt = new Event("input");
  if (gradeInputs[0]) gradeInputs[0].dispatchEvent(evt);

  formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  nameInput?.focus();
}

function clearForm() {
  const nameInput = document.getElementById("studentName");
  const seatInput = document.getElementById("seatNumber");
  if (nameInput) nameInput.value = "";
  if (seatInput) seatInput.value = "";

  const gradeInputs = document.querySelectorAll(".grade-input");
  gradeInputs.forEach((input) => input.value = "");

  const liveTotalEl = document.getElementById("liveCalculatedTotal") || document.getElementById("calculatedTotal");
  const livePercentEl = document.getElementById("liveCalculatedPercentage");
  const liveApprecEl = document.getElementById("liveCalculatedAppreciation") || document.getElementById("calculatedStatus");

  if (liveTotalEl) liveTotalEl.textContent = "0";
  if (livePercentEl) livePercentEl.textContent = "0%";
  if (liveApprecEl) liveApprecEl.textContent = "-";
}

// Auto-run when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTeacherDashboard);
} else {
  initTeacherDashboard();
}
