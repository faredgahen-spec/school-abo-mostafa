// Gateway & Role Switcher Logic with Advanced Security Lockout
const MAX_SUPERVISOR_ATTEMPTS = 2;
const FAILED_ATTEMPTS_KEY = 'supervisor_failed_attempts';
const LOCKED_KEY = 'supervisor_portal_locked';

document.addEventListener('DOMContentLoaded', () => {
  // Setup automatic focus stepping for 6 PIN inputs
  const boxes = document.querySelectorAll('.pin-box');
  boxes.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < boxes.length - 1) {
        boxes[index + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        boxes[index - 1].focus();
      } else if (e.key === 'Enter') {
        verifySupervisorPIN();
      }
    });
  });

  // Check if supervisor portal is already locked
  if (localStorage.getItem(LOCKED_KEY) === 'true') {
    lockSupervisorPortal();
  }
});

// Student navigation
window.handleStudentEntry = function() {
  const toast = document.getElementById('notice-toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  
  if (toast && toastMsg && toastIcon) {
    toastMsg.innerText = 'جاري توجيهك لشاشة الاستعلام برقم الجلوس...';
    toastIcon.innerText = 'manage_search';
    toast.classList.remove('hidden');
  }
  
  setTimeout(() => {
    window.location.href = 'student-results.html';
  }, 400);
};

// Toggle password visibility (show / hide dots)
window.togglePinVisibility = function() {
  const boxes = document.querySelectorAll('.pin-box');
  const icon = document.getElementById('pinEyeIcon');
  const text = document.getElementById('pinEyeText');

  if (boxes.length === 0) return;

  const isCurrentPassword = boxes[0].type === 'password';
  const newType = isCurrentPassword ? 'text' : 'password';

  boxes.forEach(box => box.type = newType);

  if (icon) {
    icon.innerText = isCurrentPassword ? 'visibility_off' : 'visibility';
  }
  if (text) {
    text.innerText = isCurrentPassword ? 'إخفاء الرمز' : 'إظهار الرمز';
  }
};

// Verify supervisor PIN with 2-attempts strict lockout
window.verifySupervisorPIN = function() {
  // If already locked, prevent any further action
  if (localStorage.getItem(LOCKED_KEY) === 'true') {
    lockSupervisorPortal();
    return;
  }

  const boxes = document.querySelectorAll('.pin-box');
  let enteredCode = '';
  boxes.forEach(box => enteredCode += box.value.trim());

  const feedback = document.getElementById('pin-feedback');
  const feedbackMsg = document.getElementById('pin-feedback-msg');
  const toast = document.getElementById('notice-toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  // Validate complete 6-digit entry
  if (enteredCode.length < 6) {
    if (feedback && feedbackMsg) {
      feedback.classList.remove('hidden');
      feedbackMsg.innerText = 'يرجى إدخال كود المرور كاملاً (6 أرقام).';
    }
    boxes.forEach(b => {
      b.classList.add('border-error');
      setTimeout(() => b.classList.remove('border-error'), 1200);
    });
    return;
  }

  // Check correct PIN (350927)
  if (enteredCode === '350927') {
    // Reset any previous failed attempts
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKED_KEY);

    if (feedback) feedback.classList.add('hidden');
    if (toast && toastMsg && toastIcon) {
      toastMsg.innerText = 'تم التحقق من هوية المعلم المشرف بنجاح. جاري فتح لوحة الكنترول...';
      toastIcon.innerText = 'lock_open';
      toast.classList.remove('hidden');
    }
    
    // Set authenticated session flag
    sessionStorage.setItem('supervisor_auth', 'true');

    setTimeout(() => {
      window.location.href = 'teacher-dashboard.html';
    }, 600);

  } else {
    // Increment failed attempts
    let currentAttempts = Number(localStorage.getItem(FAILED_ATTEMPTS_KEY) || 0) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, currentAttempts);

    // Clear entered boxes
    boxes.forEach(box => {
      box.value = '';
      box.classList.add('bg-error-container', 'border-error');
      setTimeout(() => box.classList.remove('bg-error-container', 'border-error'), 1000);
    });
    boxes[0]?.focus();

    if (currentAttempts >= MAX_SUPERVISOR_ATTEMPTS) {
      // LOCK OUT SUPERVISOR PORTAL
      localStorage.setItem(LOCKED_KEY, 'true');
      lockSupervisorPortal();
    } else {
      // 1st failed attempt warning
      const remaining = MAX_SUPERVISOR_ATTEMPTS - currentAttempts;
      if (feedback && feedbackMsg) {
        feedback.classList.remove('hidden');
        feedbackMsg.innerText = `⚠️ كلمة المرور غير صحيحة! تبقت لك محاولة أخيرة فقط (${remaining} من ${MAX_SUPERVISOR_ATTEMPTS}).`;
      }
    }
  }
};

// Lock down the supervisor entry on the landing page
function lockSupervisorPortal() {
  const pinInputGroup = document.getElementById('pinInputGroup');
  const lockoutNotice = document.getElementById('supervisorLockoutNotice');
  const submitBtn = document.getElementById('supervisorSubmitBtn');
  const pinFeedback = document.getElementById('pin-feedback');

  if (pinFeedback) pinFeedback.classList.add('hidden');

  // Hide or disable the PIN entry box
  if (pinInputGroup) {
    pinInputGroup.classList.add('hidden');
  }

  // Display prominent lockout alert card
  if (lockoutNotice) {
    lockoutNotice.classList.remove('hidden');
  }

  // Disable the action button
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.className = 'w-full h-12 bg-gray-400 text-white font-bold text-sm rounded-xl shadow-none flex items-center justify-center gap-2 cursor-not-allowed opacity-80';
    submitBtn.innerHTML = '<span class="material-symbols-outlined text-lg">lock_person</span><span>بوابة المشرف مغلقة ومؤمنة</span>';
  }
}

window.hideToast = function() {
  const toast = document.getElementById('notice-toast');
  if (toast) toast.classList.add('hidden');
};
