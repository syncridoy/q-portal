// Q-PORTAL - ADMINISTRATIVE CORE APP SCRIPT (Modular ES Modules Entry Point)

import { state, BRIGADES, ALL_UNITS_LIST, ROLE_TABS, getRoleCategory, toTitleCase, normalizeAppointment } from './state.js';
import { TRANSLATIONS, t, setLanguage, convertDigitsToBengali, formatDisplayNumber } from './translations.js';
import { initMainDashboardCharts } from './charts.js';
import {
  updateNavIndicator,
  renderNavigationTabs,
  syncLanguageSwitchers,
  switchView,
  switchSubContent,
  renderPortalMainContent,
  renderMainDashboard,
  renderDashboardContent,
  computeAggregates,
  updateDashboardCharts,
  renderHierarchyTree,
  selectUnitFromTree,
  populateUnitsDropdown,
  renderUnitsManagementTable,
  checkWriteAccess,
  selectUnitForEditing,
  handleSaveUnitData,
  renderDirectoryCards,
  populateDirectoryUnitFilters,
  simulateCall,
  renderRoleImpersonatorList
} from './ui-renderer.js';

// Define constants that need to be globally accessible by other modules in this scope
export let cpTimerInterval = null;
export let cpOtpCode = "";
export let cpTempNewPassword = "";
export let activeCropperInstance = null;
export let currentCropFileInput = null;


export async function initDatabases() {
  try {
    const usersRes = await fetch("/api/users");
    state.usersDB = await usersRes.json();
    
    const logisticsRes = await fetch("/api/logistics");
    state.logisticsDB = await logisticsRes.json();
  } catch (err) {
    console.error("Failed to initialize database from API:", err);
  }
}

export function initDashboard(preserveTab = false) {
  if (!state.currentUser) return;

  // Reset active tab key when initializing dashboard unless preserveTab is set
  if (!preserveTab) {
    const role = state.currentUser.role;
    const category = getRoleCategory(role);
    state.activeTabKey = ROLE_TABS[category][0];
  }

  // Render Branding name and Logo dynamically resolving assigned unit name
  let brandName = state.currentUser.assigned || state.currentUser.assignedUnit || state.currentUser.unitName || state.currentUser.scopeUnit || state.currentUser.scopeBde || "HQ 55 Inf Div";
  if (Array.isArray(brandName)) {
    brandName = brandName[0];
  }
  if (brandName === "ALL") {
    brandName = "HQ 55 Inf Div";
  }
  
  const brandNameEl = document.getElementById("header-brand-name");
  if (brandNameEl) {
    brandNameEl.innerText = brandName;
  }

  // Set profile info
  const avatarEl = document.getElementById("header-user-avatar");
  if (avatarEl) {
    avatarEl.src = state.currentUser.avatar || "55_Inf_div.svg";
  }

  // Strip away any "BA No" or "Army No" literal string prefixes. Render only the raw identification number
  const baEl = document.getElementById("header-user-ba");
  if (baEl) baEl.innerText = state.currentUser.baNo || "";

  // Render Rank with title-case format
  const rankEl = document.getElementById("header-user-rank");
  if (rankEl) rankEl.innerText = toTitleCase(state.currentUser.rank);

  const nameEl = document.getElementById("header-user-name");
  if (nameEl) nameEl.innerText = state.currentUser.fullName;

  // Normalize appointment to standard mixed-case/title-case format
  const apptEl = document.getElementById("header-user-appt");
  if (apptEl) apptEl.innerText = normalizeAppointment(state.currentUser.appointment);

  // Render tabs
  renderNavigationTabs();

  // Sync language switchers
  syncLanguageSwitchers();

  // Conditionally hide/show notification bell with strict !important rules (Division level Role 5/6 gets hidden)
  const isDivLevel = [5, 6].includes(Number(state.currentUser.role));
  const bellBtn = document.getElementById("notification-bell-btn");
  if (bellBtn) {
    if (isDivLevel) {
      bellBtn.style.setProperty("display", "none", "important");
    } else {
      bellBtn.style.setProperty("display", "flex", "important");
    }
  }

  // Render active tab content
  renderPortalMainContent();
}

export function showToast(title, body, type = "info") {
  const container = document.getElementById("toast-wrapper");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  toast.innerHTML = `
    <div class="toast-body">
      <h5>${title}</h5>
      <p>${body}</p>
    </div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeIn 0.3s reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

async function handleLogin(e) {
  if (e) e.preventDefault();
  const userInp = document.getElementById("username").value.trim().toLowerCase();
  const passInp = document.getElementById("password").value;

  const usernameError = document.getElementById("username-error-msg");
  const passwordError = document.getElementById("password-error-msg");

  // Reset error displays
  if (usernameError) {
    usernameError.style.display = "none";
    usernameError.innerText = "";
  }
  if (passwordError) {
    passwordError.style.display = "none";
    passwordError.innerText = "";
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userInp, password: passInp })
    });
    
    if (res.ok) {
      const data = await res.json();
      const user = data.user;
      state.currentUser = user;
      state.usersDB[user.username] = user;
      
      showToast(
        TRANSLATIONS[state.language].toast_login_success, 
        `${user.fullName} (${user.rank}) - Role ${user.role} Active`, 
        "success"
      );

      if (user.is_first_login) {
        // 1. Content Cross-fade: Fade out the login form input fields within 0.2s
        const loginWrapper = document.getElementById("login-form-wrapper");
        if (loginWrapper) {
          loginWrapper.style.opacity = "0";
          loginWrapper.style.pointerEvents = "none";
        }

        // 2. Dynamic style / dimension overhaul & glide morph triggers
        const splitCard = document.querySelector(".login-split-card");
        if (splitCard) {
          splitCard.classList.add("morph-to-setup");
        }
        
        // 3. Global Canvas Backdrop Blur overlay activation
        const blurOverlay = document.getElementById("global-blur-overlay");
        if (blurOverlay) {
          blurOverlay.classList.add("active");
        }

        // 4. Delay state swap and Wizard instantiation until morph animation (600ms) finishes
        setTimeout(() => {
          switchView("setup");
          initSetupWizard();
        }, 600);
      } else {
        switchView("dashboard");
        initDashboard();
      }
    } else {
      const errData = await res.json();
      if (res.status === 401 && errData.old_password) {
        if (passwordError) {
          passwordError.innerText = state.language === "en" 
            ? "You entered an old password." 
            : "আপনি একটি পুরাতন পাসওয়ার্ড লিখেছেন।";
          passwordError.style.display = "block";
        }
      } else if (res.status === 401 && errData.message === "Incorrect password.") {
        if (passwordError) {
          passwordError.innerText = state.language === "en" 
            ? "Incorrect password." 
            : "পাসওয়ার্ড সঠিক নয়।";
          passwordError.style.display = "block";
        }
      } else {
        if (usernameError) {
          usernameError.innerText = state.language === "en" 
            ? "Incorrect username or phone." 
            : "ইউজারনেম বা ফোন নম্বর সঠিক নয়।";
          usernameError.style.display = "block";
        }
      }
    }
  } catch (error) {
    console.error("Login connection error:", error);
    showToast("Connection Error", "Failed to connect to login server.", "danger");
  }
}

function handleLogout() {
  state.currentUser = null;
  switchView("login");
  document.getElementById("login-form").reset();
  const badge = document.getElementById("nav-profile-badge");
  if (badge) badge.style.display = "none";
  const indicator = document.getElementById("live-indicator-wrapper");
  if (indicator) indicator.style.display = "none";
  const navbar = document.getElementById("main-nav-bar");
  if (navbar) navbar.style.display = "none";
}

async function resetSystemState() {
  try {
    const res = await fetch("/api/reset", { method: "POST" });
    if (res.ok) {
      await initDatabases();
      showToast(
        state.language === "en" ? "System Reset" : "সিস্টেম রিসেট",
        state.language === "en" ? "Demo accounts and setup states have been reset." : "ডেমো অ্যাকাউন্ট এবং সেটআপ স্টেট রিসেট করা হয়েছে।",
        "success"
      );
      handleLogout();
    } else {
      showToast("Error", "Failed to reset system database.", "danger");
    }
  } catch (err) {
    console.error("System reset error:", err);
    showToast("Error", "Could not connect to backend server.", "danger");
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPrivate = input.type === "password";
  input.type = isPrivate ? "text" : "password";
  
  if (isPrivate) {
    btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="eye-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  } else {
    btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
}

function initSetupWizard() {
  state.currentSetupStep = 1;
  state.otpVerified = false;
  state.generatedOTP = null;
  updateSetupWizardUI();
  
  const user = state.currentUser;
  
  // Set Assigned Unit / HQ and Appointment strings
  let targetUnit = user.scopeUnit || user.scopeBde || "Division HQ";
  if (["hq_55_inf_div", "dq_55_inf_div", "aq_55_inf_div"].includes(user.username) || targetUnit === "ALL") {
    targetUnit = "HQ 55 Inf Div";
  }
  document.getElementById("profile-lbl-unit-text").innerText = targetUnit;
  document.getElementById("profile-lbl-appt-text").innerText = normalizeAppointment(user.appointment);

  // Dynamic Ranks list compilation
  const isClerk = [1, 3, 5].includes(user.role);
  const ranks = isClerk ? ["Sgt", "Cpl", "Lcpl", "Snk"] : ["Lt Col", "Maj", "Capt", "Lt"];
  
  // Populate custom dropdown items menu list
  const rankMenu = document.getElementById("rank-dropdown-menu");
  if (rankMenu) {
    rankMenu.innerHTML = "";
    ranks.forEach(rank => {
      const item = document.createElement("div");
      item.className = "custom-dropdown-item";
      item.innerText = rank;
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        selectRank(rank);
      });
      rankMenu.appendChild(item);
    });
  }

  // Reset Rank trigger and options select values
  const hiddenInput = document.getElementById("setup-rank");
  const selectedValueSpan = document.querySelector("#rank-trigger .dropdown-selected-value");
  const trigger = document.getElementById("rank-trigger");
  if (hiddenInput && selectedValueSpan && trigger) {
    hiddenInput.value = "";
    selectedValueSpan.innerText = "";
    trigger.classList.remove("has-value");
    trigger.classList.remove("open");
  }

  // Pre-fill profile photo if any
  const previewImg = document.getElementById("profile-dropzone-preview");
  const placeholder = document.getElementById("profile-dropzone-preview-container");
  
  if (user.avatar && user.avatar.startsWith("data:image")) {
    previewImg.src = user.avatar;
    previewImg.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
    state.selectedAvatar = user.avatar;
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
    if (placeholder) placeholder.style.display = "flex";
    state.selectedAvatar = "";
  }

  // Reset steps 1 and 2 inputs
  document.getElementById("setup-new-password").value = "";
  document.getElementById("setup-confirm-password").value = "";
  document.getElementById("setup-mobile").value = "";
  document.getElementById("setup-ba-no").value = "";
  document.getElementById("setup-fullname").value = ""; // Empty on page load as requested

  // Set the dynamic label for Army No vs BA No based on user Role ID
  const labelBaNo = document.querySelector("label[for='setup-ba-no']");
  if (labelBaNo) {
    const roleId = Number(user.role);
    const isArmyNo = [1, 3, 5].includes(roleId);
    labelBaNo.innerText = isArmyNo ? (state.language === "en" ? "Army No" : "আর্মি নম্বর") : (state.language === "en" ? "BA No" : "বিএ নম্বর");
  }
  checkPasswordStrength("");
  const feedback = document.getElementById("setup-confirm-feedback");
  if (feedback) {
    feedback.style.display = "none";
    feedback.innerText = "";
    feedback.className = "password-feedback";
  }
  
  // Clean OTP states
  const otpGroup = document.getElementById("otp-verification-group");
  if (otpGroup) {
    otpGroup.style.display = "none";
    otpGroup.classList.remove("visible");
  }
  document.getElementById("otp-1").value = "";
  document.getElementById("otp-2").value = "";
  document.getElementById("otp-3").value = "";
  document.getElementById("otp-4").value = "";
}

function selectRank(rankValue) {
  const hiddenInput = document.getElementById("setup-rank");
  const selectedValueSpan = document.querySelector("#rank-trigger .dropdown-selected-value");
  const trigger = document.getElementById("rank-trigger");
  
  if (hiddenInput && selectedValueSpan && trigger) {
    hiddenInput.value = rankValue;
    selectedValueSpan.innerText = rankValue;
    trigger.classList.add("has-value");
    
    const menu = document.getElementById("rank-dropdown-menu");
    if (menu) {
      const items = menu.querySelectorAll(".custom-dropdown-item");
      items.forEach(item => {
        if (item.innerText === rankValue) {
          item.classList.add("selected");
        } else {
          item.classList.remove("selected");
        }
      });
      menu.classList.remove("open");
    }
    trigger.classList.remove("open");
  }
}

function updateSetupWizardUI() {
  for (let i = 1; i <= 3; i++) {
    const panel = document.getElementById(`wizard-panel-${i}`);
    const node = document.getElementById(`step-node-${i}`);
    if (i === state.currentSetupStep) {
      panel.classList.add("active");
      node.className = "step-node active";
    } else {
      panel.classList.remove("active");
      if (i < state.currentSetupStep) {
        node.className = "step-node completed";
      } else {
        node.className = "step-node";
      }
    }
  }

  const progressPercent = ((state.currentSetupStep - 1) / 2) * 66.6;
  document.getElementById("wizard-progress-bar").style.width = `${progressPercent}%`;

  const backBtn = document.getElementById("wizard-back-btn");
  backBtn.style.visibility = state.currentSetupStep === 1 ? "hidden" : "visible";

  const nextBtn = document.getElementById("wizard-next-btn");
  if (state.currentSetupStep === 2) {
    nextBtn.style.display = "none"; // Hide button for automated transition logic on Step 2
  } else {
    nextBtn.style.display = "block";
    if (state.currentSetupStep === 3) {
      nextBtn.innerText = state.language === "en" ? "Finish Setup" : "সম্পন্ন করুন";
    } else {
      nextBtn.innerText = TRANSLATIONS[state.language].btn_next;
    }
  }
}

function validateSetupStep() {
  const step = state.currentSetupStep;

  if (step === 1) {
    const newPwd = document.getElementById("setup-new-password").value;
    const confPwd = document.getElementById("setup-confirm-password").value;

    if (newPwd.length < 8) {
      showToast(
        TRANSLATIONS[state.language].toast_pwd_mismatch, 
        TRANSLATIONS[state.language].toast_pwd_short, 
        "warning"
      );
      return false;
    }
    if (newPwd !== confPwd) {
      showToast(
        TRANSLATIONS[state.language].toast_pwd_mismatch, 
        state.language === "en" ? "Confirmed password does not match." : "নিশ্চিতকরণ পাসওয়ার্ডটি মেলেনি।", 
        "warning"
      );
      return false;
    }
    return true;
  } else if (step === 2) {
    return state.otpVerified;
  } else if (step === 3) {
    const baNo = document.getElementById("setup-ba-no").value.trim();
    const rank = document.getElementById("setup-rank").value;
    const fullName = document.getElementById("setup-fullname").value.trim();
    
    if (!baNo || !rank || !fullName) {
      showToast(
        state.language === "en" ? "Fields Required" : "তথ্য পূরণ করুন", 
        state.language === "en" ? "All fields (BA/Army No, Rank, and Full Name) are required." : "সব তথ্য (বিএ/আর্মি নম্বর, পদবি এবং পূর্ণ নাম) প্রদান করা আবশ্যক।", 
        "warning"
      );
      return false;
    }
    return true;
  }
}

function sendMockOTP() {
  state.generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  
  const otpGroup = document.getElementById("otp-verification-group");
  if (otpGroup) {
    otpGroup.style.display = "block";
    otpGroup.offsetHeight; // force reflow
    otpGroup.classList.add("visible");
  }
  
  showToast(
    state.language === "en" ? "Teletalk Gateway SMS Alert" : "টেলিটক গেটওয়ে ওটিপি নোটিফিকেশন",
    `${TRANSLATIONS[state.language].toast_otp_sent} [ ${state.generatedOTP} ]`,
    "info"
  );

  setTimeout(() => document.getElementById("otp-1").focus(), 300);
}

function handleResendOTP() {
  state.generatedOTP = null;
  sendMockOTP();
}

async function handleSetupNext() {
  if (validateSetupStep()) {
    if (state.currentSetupStep < 3) {
      state.currentSetupStep++;
      updateSetupWizardUI();
    } else {
      const user = state.currentUser;
      const newPassword = document.getElementById("setup-new-password").value;
      const mobile = document.getElementById("setup-mobile").value.trim();
      const baNo = document.getElementById("setup-ba-no").value.trim();
      const rank = document.getElementById("setup-rank").value;
      const fullName = document.getElementById("setup-fullname").value.trim();
      const avatar = state.selectedAvatar;

      try {
        // 1. Update Profile details (including mobile)
        const profileRes = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            rank,
            baNo,
            fullName,
            avatar,
            mobile
          })
        });

        if (!profileRes.ok) {
          showToast("Error", "Failed to update profile details.", "danger");
          return;
        }

        // 2. Update Password and set is_first_login = false (which is 0 in SQLite)
        const pwdRes = await fetch("/api/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            newPassword,
            is_first_login: 0
          })
        });

        if (!pwdRes.ok) {
          showToast("Error", "Failed to finalize account setup.", "danger");
          return;
        }

        const data = await pwdRes.json();
        const updatedUser = data.user;
        state.currentUser = updatedUser;
        state.usersDB[updatedUser.username] = updatedUser;

        showToast(
          state.language === "en" ? "Wizard Completed" : "সেটআপ সম্পন্ন", 
          TRANSLATIONS[state.language].toast_setup_complete, 
          "success"
        );
        
        setTimeout(() => {
          const header = document.getElementById("portal-header");
          if (header) {
            header.style.setProperty("display", "flex", "important");
          }
          switchView("dashboard");
          initDashboard();
        }, 1000);

      } catch (error) {
        console.error("Wizard setup completion error:", error);
        showToast("Connection Error", "Could not save wizard details to the server.", "danger");
      }
    }
  }
}

function handleSetupBack() {
  if (state.currentSetupStep > 1) {
    state.currentSetupStep--;
    updateSetupWizardUI();
  }
}

function checkPasswordStrength(pwd) {
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength++;
  if (pwd.match(/\d/)) strength++;
  if (pwd.match(/[^a-zA-Z\d]/)) strength++;

  const bar = document.getElementById("pwd-strength-bar");
  const text = document.getElementById("pwd-strength-text");

  if (pwd.length === 0) {
    bar.style.width = "0%";
    text.innerText = "";
    return;
  }

  if (strength <= 1) {
    bar.style.width = "25%";
    bar.style.backgroundColor = "var(--danger)";
    text.innerText = TRANSLATIONS[state.language].pwd_weak;
    text.style.color = "var(--danger)";
  } else if (strength === 2 || strength === 3) {
    bar.style.width = "60%";
    bar.style.backgroundColor = "var(--warning)";
    text.innerText = TRANSLATIONS[state.language].pwd_medium;
    text.style.color = "var(--warning)";
  } else {
    bar.style.width = "100%";
    bar.style.backgroundColor = "var(--success)";
    text.innerText = TRANSLATIONS[state.language].pwd_strong;
    text.style.color = "var(--success)";
  }
}

function checkPasswordMatch() {
  const newPwd = document.getElementById("setup-new-password").value;
  const confPwd = document.getElementById("setup-confirm-password").value;
  const feedback = document.getElementById("setup-confirm-feedback");

  console.log("[checkPasswordMatch] newPwd:", newPwd, "confPwd:", confPwd, "feedback exists:", !!feedback);

  if (!feedback) return;

  if (confPwd.length === 0) {
    feedback.style.display = "none";
    feedback.innerText = "";
    feedback.className = "password-feedback";
    console.log("[checkPasswordMatch] Confirm field is empty. Feedback hidden.");
    return;
  }

  feedback.style.display = "block";
  if (newPwd === confPwd) {
    feedback.innerText = TRANSLATIONS[state.language].pwd_match;
    feedback.className = "password-feedback match-success";
    console.log("[checkPasswordMatch] Passwords match. Class set to match-success.");
  } else {
    feedback.innerText = TRANSLATIONS[state.language].pwd_mismatch;
    feedback.className = "password-feedback match-error";
    console.log("[checkPasswordMatch] Passwords mismatch. Class set to match-error.");
  }
}

export async function impersonateRole(username) {
  try {
    const res = await fetch("/api/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
    if (res.ok) {
      const data = await res.json();
      const user = data.user;
      state.currentUser = user;
      state.usersDB[user.username] = user;
      
      if (user.is_first_login) {
        switchView("setup");
        initSetupWizard();
      } else {
        switchView("dashboard");
        initDashboard();
      }
      
      showToast(
        state.language === "en" ? "Identity Swapped" : "আইডেন্টিটি সুইপড",
        `Active user: ${user.fullName} (${user.rank}) - Scope: ${user.scopeUnit || user.scopeBde || "Division HQ"}`,
        "success"
      );

      document.getElementById("simulator-panel-container").classList.remove("open");
    }
  } catch (err) {
    console.error("Impersonation error:", err);
  }
}

function openEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (!modal) return;

  const user = state.currentUser;
  if (!user) return;

  // Set current avatar preview
  const previewImg = document.getElementById("edit-dropzone-preview");
  const placeholder = document.getElementById("edit-dropzone-preview-container");
  if (user.avatar) {
    if (previewImg) {
      previewImg.src = user.avatar;
      previewImg.style.display = "block";
    }
    if (placeholder) placeholder.style.display = "none";
  } else {
    if (previewImg) previewImg.style.display = "none";
    if (placeholder) placeholder.style.display = "flex";
  }
  state.selectedEditAvatar = user.avatar; // Store temp selection

  // Populate inputs
  const baInput = document.getElementById("edit-ba-no");
  if (baInput) baInput.value = user.baNo || "";

  const labelEditBaNo = document.querySelector("label[for='edit-ba-no']");
  if (labelEditBaNo) {
    const isArmyNo = [1, 3, 5].includes(Number(user.role));
    labelEditBaNo.innerText = isArmyNo ? (state.language === "en" ? "Army No" : "আর্মি নম্বর") : (state.language === "en" ? "BA No" : "বিএ নম্বর");
  }

  const nameInput = document.getElementById("edit-fullname");
  if (nameInput) nameInput.value = user.fullName || "";

  // Populate ranks
  const isClerk = [1, 3, 5].includes(Number(user.role));
  const ranks = isClerk ? ["Sgt", "Cpl", "Lcpl", "Snk"] : ["Lt Col", "Maj", "Capt", "Lt"];

  const rankMenu = document.getElementById("edit-rank-dropdown-menu");
  const rankHidden = document.getElementById("edit-rank");
  const rankVal = document.getElementById("edit-rank-selected-value");
  const rankTrigger = document.getElementById("edit-rank-trigger");

  if (rankHidden) rankHidden.value = user.rank || "";
  if (rankVal) rankVal.innerText = user.rank || "";
  if (rankTrigger && user.rank) rankTrigger.classList.add("has-value");

  if (rankMenu) {
    rankMenu.innerHTML = "";
    ranks.forEach(rank => {
      const item = document.createElement("div");
      item.className = `custom-dropdown-item ${rank === user.rank ? "selected" : ""}`;
      item.innerText = rank;
      item.onclick = (e) => {
        e.stopPropagation();
        if (rankHidden) rankHidden.value = rank;
        if (rankVal) rankVal.innerText = rank;
        if (rankTrigger) {
          rankTrigger.classList.add("has-value");
          rankTrigger.classList.remove("open");
        }
        rankMenu.classList.remove("open");
        document.querySelectorAll("#edit-rank-dropdown-menu .custom-dropdown-item").forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
      };
      rankMenu.appendChild(item);
    });
  }

  // Open modal
  modal.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (modal) {
    modal.classList.remove("open");
  }
  document.body.classList.remove("modal-open");
}

async function saveEditProfile() {
  const baInput = document.getElementById("edit-ba-no");
  const nameInput = document.getElementById("edit-fullname");
  const rankHidden = document.getElementById("edit-rank");

  const baNo = baInput ? baInput.value.trim() : "";
  const fullName = nameInput ? nameInput.value.trim() : "";
  const rank = rankHidden ? rankHidden.value.trim() : "";

  if (!fullName) {
    showToast(
      state.language === "en" ? "Error" : "ত্রুটি",
      state.language === "en" ? "Full Name is required." : "পূর্ণ নাম আবশ্যক।",
      "error"
    );
    return;
  }
  if (!baNo) {
    showToast(
      state.language === "en" ? "Error" : "ত্রুটি",
      state.language === "en" ? "BA No / Army No is required." : "বিএ/আর্মি নম্বর আবশ্যক।",
      "error"
    );
    return;
  }

  const user = state.currentUser;
  if (!user) return;

  const avatar = state.selectedEditAvatar || user.avatar;

  try {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        rank,
        baNo,
        fullName,
        avatar
      })
    });
    
    if (res.ok) {
      const result = await res.json();
      state.currentUser = result.user;
      state.usersDB[user.username] = result.user;

      // Refresh Top Header widgets instantly without reloading
      initDashboard(true);
      
      // Re-render other components to propagate updates instantly
      renderHierarchyTree();
      renderDashboardContent();
      renderRoleImpersonatorList();

      // Close modal
      closeEditProfileModal();

      showToast(
        state.language === "en" ? "Profile Updated" : "প্রোফাইল সংরক্ষিত",
        state.language === "en" ? "Your profile details have been saved." : "আপনার প্রোফাইল তথ্য সংরক্ষণ করা হয়েছে।",
        "success"
      );
    } else {
      showToast("Error", "Failed to update profile on server.", "danger");
    }
  } catch (err) {
    console.error("Profile update error:", err);
    showToast("Error", "Could not connect to backend server.", "danger");
  }
}

function openChangePasswordModal() {
  const modal = document.getElementById("change-password-modal");
  if (!modal) return;

  // Reset views instantly
  const step1 = document.getElementById("password-step-container");
  const step2 = document.getElementById("otp-step-container");
  if (step1) {
    step1.classList.add("active");
    step1.classList.remove("hidden");
    step1.classList.remove("fade-out");
  }
  if (step2) {
    step2.classList.remove("active");
    step2.classList.add("hidden");
    step2.classList.remove("fade-out");
  }

  // Reset inputs
  const currentInp = document.getElementById("change-pwd-current");
  const newInp = document.getElementById("change-pwd-new");
  const confirmInp = document.getElementById("change-pwd-confirm");
  if (currentInp) currentInp.value = "";
  if (newInp) newInp.value = "";
  if (confirmInp) confirmInp.value = "";

  // Reset feedbacks
  const currentFeedback = document.getElementById("change-pwd-current-feedback");
  const strengthBar = document.getElementById("cp-pwd-strength-bar");
  const strengthText = document.getElementById("cp-pwd-strength-text");
  const confirmFeedback = document.getElementById("change-pwd-confirm-feedback");
  const otpErr = document.getElementById("otp-error-message");

  if (currentFeedback) { currentFeedback.style.display = "none"; currentFeedback.innerText = ""; }
  if (strengthBar) { 
    strengthBar.style.width = "0%"; 
    const barContainer = document.querySelector("#password-step-container .password-strength");
    if (barContainer) barContainer.style.display = "none";
  }
  if (strengthText) { 
    strengthText.innerText = ""; 
    strengthText.style.display = "none";
  }
  if (confirmFeedback) { confirmFeedback.style.display = "none"; confirmFeedback.innerText = ""; }
  if (otpErr) { 
    otpErr.style.display = "none"; 
    otpErr.innerText = ""; 
    otpErr.style.color = "var(--danger)"; // reset color to red default
  }

  // Button is left enabled for user validation feedback


  // Set initial title
  const title = document.getElementById("change-pwd-modal-title");
  if (title) {
    title.innerText = state.language === "en" ? "Change Password" : "পাসওয়ার্ড পরিবর্তন করুন";
  }

  // Clear timer and OTP state
  stopCpTimer();
  cpOtpCode = "";
  cpTempNewPassword = "";

  // Open modal
  modal.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeChangePasswordModal() {
  const modal = document.getElementById("change-password-modal");
  if (modal) {
    modal.classList.remove("open");
  }
  document.body.classList.remove("modal-open");
  stopCpTimer();
  cpOtpCode = "";
  cpTempNewPassword = "";
  
  // Clear inputs
  const currentInp = document.getElementById("change-pwd-current");
  const newInp = document.getElementById("change-pwd-new");
  const confirmInp = document.getElementById("change-pwd-confirm");
  if (currentInp) currentInp.value = "";
  if (newInp) newInp.value = "";
  if (confirmInp) confirmInp.value = "";

  // Reset feedbacks
  const currentFeedback = document.getElementById("change-pwd-current-feedback");
  const strengthBar = document.getElementById("cp-pwd-strength-bar");
  const strengthText = document.getElementById("cp-pwd-strength-text");
  const confirmFeedback = document.getElementById("change-pwd-confirm-feedback");
  const otpErr = document.getElementById("otp-error-message");
  
  if (currentFeedback) { currentFeedback.style.display = "none"; currentFeedback.innerText = ""; }
  if (strengthBar) { 
    strengthBar.style.width = "0%"; 
    const barContainer = document.querySelector("#password-step-container .password-strength");
    if (barContainer) barContainer.style.display = "none";
  }
  if (strengthText) { 
    strengthText.innerText = ""; 
    strengthText.style.display = "none";
  }
  if (confirmFeedback) { confirmFeedback.style.display = "none"; confirmFeedback.innerText = ""; }
  if (otpErr) { 
    otpErr.style.display = "none"; 
    otpErr.innerText = ""; 
    otpErr.style.color = "var(--danger)";
  }

  // Reset inputs in step 2
  document.querySelectorAll(".change-pwd-otp-input").forEach(inp => inp.value = "");
}

function handleUpdatePasswordStep1() {
  const currentInp = document.getElementById("change-pwd-current");
  const newInp = document.getElementById("change-pwd-new");
  const confirmInp = document.getElementById("change-pwd-confirm");

  const currentFeedback = document.getElementById("change-pwd-current-feedback");
  const confirmFeedback = document.getElementById("change-pwd-confirm-feedback");
  const strengthText = document.getElementById("cp-pwd-strength-text");

  const currentPass = currentInp ? currentInp.value : "";
  const newPass = newInp ? newInp.value : "";
  const confirmPass = confirmInp ? confirmInp.value : "";

  // Perform validation checks
  const isCurrentMatch = currentPass === state.currentUser.password;
  const strengthScore = checkCpPasswordStrength(newPass);
  
  // BYPASS STRENGTH BLOCK FOR MEDIUM & STRONG STATES: Qualification is strengthScore >= 2
  const isNewAcceptable = strengthScore >= 2;
  const isNewConfirmMatch = newPass === confirmPass;

  // Fallback console.log for debugging
  console.log("Change Password Step 1 Validation:", {
    isCurrentMatch,
    currentPassLength: currentPass.length,
    actualPasswordLength: state.currentUser.password ? state.currentUser.password.length : 0,
    strengthScore,
    isNewAcceptable,
    isNewConfirmMatch
  });

  let hasError = false;

  // 1. Current Password Validation
  if (!currentPass) {
    if (currentFeedback) {
      currentFeedback.innerText = state.language === "en" ? "Current password is required." : "বর্তমান পাসওয়ার্ড প্রয়োজন।";
      currentFeedback.style.color = "var(--danger)";
      currentFeedback.style.display = "block";
    }
    hasError = true;
  } else if (!isCurrentMatch) {
    if (currentFeedback) {
      currentFeedback.innerText = state.language === "en" ? "Incorrect current password." : "ভুল বর্তমান পাসওয়ার্ড।";
      currentFeedback.style.color = "var(--danger)";
      currentFeedback.style.display = "block";
    }
    hasError = true;
  }

  // 2. New Password Validation
  if (!newPass) {
    if (strengthText) {
      strengthText.innerText = state.language === "en" ? "New password is required." : "নতুন পাসওয়ার্ড প্রয়োজন।";
      strengthText.style.color = "var(--danger)";
    }
    hasError = true;
  } else if (!isNewAcceptable) { // Apply validation block ONLY when password strength is Weak
    if (strengthText) {
      strengthText.innerText = state.language === "en" ? "Password is too weak. Minimum 8 characters with numbers & symbols required." : "পাসওয়ার্ড অত্যন্ত দুর্বল। কমপক্ষে ৮টি অক্ষর, সংখ্যা ও প্রতীক প্রয়োজন।";
      strengthText.style.color = "var(--danger)";
    }
    hasError = true;
  }

  // 3. Confirm Password Validation
  if (!confirmPass) {
    if (confirmFeedback) {
      confirmFeedback.innerText = state.language === "en" ? "Please confirm your new password." : "অনুগ্রহ করে নতুন পাসওয়ার্ডটি নিশ্চিত করুন।";
      confirmFeedback.style.color = "var(--danger)";
      confirmFeedback.style.display = "block";
    }
    hasError = true;
  } else if (!isNewConfirmMatch) {
    if (confirmFeedback) {
      confirmFeedback.innerText = state.language === "en" ? "Passwords do not match." : "পাসওয়ার্ড দুটি মেলেনি।";
      confirmFeedback.style.color = "var(--danger)";
      confirmFeedback.style.display = "block";
    }
    hasError = true;
  }

  if (hasError) {
    showToast(
      state.language === "en" ? "Validation Error" : "যাচাইকরণ ত্রুটি",
      state.language === "en" ? "Please resolve the errors highlighted next to the input fields." : "অনুগ্রহ করে ইনপুট ফিল্ডের পাশে চিহ্নিত ত্রুটিগুলো সমাধান করুন।",
      "error"
    );
    return;
  }

  // Current password is correct, transition to Step 2
  cpTempNewPassword = newPass;
  
  // Transition views smoothly
  const step1 = document.getElementById("password-step-container");
  const step2 = document.getElementById("otp-step-container");
  const title = document.getElementById("change-pwd-modal-title");

  if (step1 && step2) {
    step1.classList.add("fade-out");

    setTimeout(() => {
      step1.classList.remove("active");
      step1.classList.add("hidden");
      step1.classList.remove("fade-out"); // reset

      step2.classList.remove("hidden");
      step2.classList.add("active");
      step2.classList.add("fade-out"); // keep transparent at first

      if (title) {
        title.innerText = state.language === "en" ? "Enter OTP" : "ওটিপি প্রদান করুন";
      }

      // Force a reflow
      step2.offsetHeight;

      step2.classList.remove("fade-out"); // fade in

      // Clear step 2 inputs & error message
      document.querySelectorAll(".change-pwd-otp-input").forEach(inp => inp.value = "");
      const otpErr = document.getElementById("otp-error-message");
      if (otpErr) { 
        otpErr.style.display = "none"; 
        otpErr.innerText = ""; 
        otpErr.style.color = "var(--danger)";
      }

      // Generate and send mock OTP
      sendCpOTP();
    }, 200);
  } else {
    // Fallback if elements not found
    if (title) {
      title.innerText = state.language === "en" ? "Enter OTP" : "ওটিপি প্রদান করুন";
    }
    sendCpOTP();
  }
}

function sendCpOTP() {
  // Generate 6-digit code
  cpOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Simulated Toast notification
  showToast(
    state.language === "en" ? "SMS Code Simulated" : "এসএমএস কোড সিমুলেট করা হয়েছে",
    state.language === "en" ? `Your 6-digit OTP code is: ${cpOtpCode}` : `আপনার ৬-সংখ্যার ওটিপি কোড হলো: ${cpOtpCode}`,
    "info"
  );

  // Focus on first input box
  setTimeout(() => {
    const firstOtp = document.getElementById("cp-otp-1");
    if (firstOtp) firstOtp.focus();
  }, 100);

  // Start timer
  startCpTimer();
}

function startCpTimer() {
  stopCpTimer();

  const timerDisplay = document.getElementById("otp-timer-display");
  const resendBtn = document.getElementById("cp-resend-btn");

  if (resendBtn) {
    resendBtn.style.pointerEvents = "none";
    resendBtn.style.opacity = "0.5";
  }

  let timeLeft = 60;

  const updateDisplay = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const padMin = minutes < 10 ? `0${minutes}` : minutes;
    const padSec = seconds < 10 ? `0${seconds}` : seconds;
    if (timerDisplay) {
      timerDisplay.innerText = `${padMin}:${padSec}`;
    }
  };

  updateDisplay(); // Instantly show 01:00

  cpTimerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(cpTimerInterval);
      cpTimerInterval = null;
      if (resendBtn) {
        resendBtn.style.pointerEvents = "auto";
        resendBtn.style.opacity = "1";
      }
    }
  }, 1000);
}

function stopCpTimer() {
  if (cpTimerInterval) {
    clearInterval(cpTimerInterval);
    cpTimerInterval = null;
  }
}

async function handleVerifyOTPStep2() {
  // Collect 6-digit code
  let code = "";
  for (let i = 1; i <= 6; i++) {
    const inp = document.getElementById(`cp-otp-${i}`);
    code += inp ? inp.value.trim() : "";
  }

  const otpErr = document.getElementById("otp-error-message");
  if (otpErr) { 
    otpErr.style.display = "none"; 
    otpErr.innerText = ""; 
    otpErr.style.color = "var(--danger)"; // Ensure minimalist red default
  }

  // Auto-pass ANY 6-digit numeric OTP for testing
  if (code.length < 6 || !/^\d+$/.test(code)) {
    if (otpErr) {
      otpErr.innerText = state.language === "en" ? "Please enter all 6 digits." : "অনুগ্রহ করে সব ৬টি সংখ্যা লিখুন।";
      otpErr.style.display = "block";
    }
    return;
  }

  // Correct OTP (Auto-passed)! Commit new password
  const user = state.currentUser;

  try {
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        newPassword: cpTempNewPassword,
        is_first_login: user.is_first_login ? 1 : 0
      })
    });

    if (res.ok) {
      const data = await res.json();
      state.currentUser = data.user;
      state.usersDB[user.username] = data.user;

      // Show success text in green directly underneath the OTP input box
      if (otpErr) {
        otpErr.innerText = state.language === "en" ? "Password updated successfully." : "পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে।";
        otpErr.style.color = "#10b981"; // Success Green
        otpErr.style.display = "block";
      }

      showToast(
        state.language === "en" ? "Success" : "সফল",
        state.language === "en" ? "Password changed successfully." : "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।",
        "success"
      );

      // Clear session/form data immediately on perfection
      stopCpTimer();
      cpOtpCode = "";
      cpTempNewPassword = "";

      // Auto close modal after exactly 1.5s
      setTimeout(() => {
        closeChangePasswordModal();
      }, 1500);
    } else {
      showToast("Error", "Failed to update password on server.", "danger");
    }
  } catch (err) {
    console.error("Change password verify error:", err);
    showToast("Error", "Could not connect to backend server.", "danger");
  }
}

function setupCpOtpInputs() {
  const inputs = document.querySelectorAll(".change-pwd-otp-input");
  inputs.forEach((inp, idx) => {
    // Only allow digits
    inp.addEventListener("input", (e) => {
      inp.value = inp.value.replace(/[^0-9]/g, "");
      if (inp.value.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }

      // Auto-submit listener: As soon as 6-digits are entered, automatically verify
      let code = "";
      inputs.forEach(item => {
        code += item.value.trim();
      });
      if (code.length === 6) {
        handleVerifyOTPStep2();
      }
    });

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        if (inp.value.length === 0 && idx > 0) {
          inputs[idx - 1].focus();
        } else {
          inp.value = "";
        }
      }
    });
  });
}

function checkCpPasswordStrength(pwd) {
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength++;
  if (pwd.match(/\d/)) strength++;
  if (pwd.match(/[^a-zA-Z\d]/)) strength++;

  const bar = document.getElementById("cp-pwd-strength-bar");
  const text = document.getElementById("cp-pwd-strength-text");
  const barContainer = document.querySelector("#password-step-container .password-strength");

  if (!bar || !text) return 0;

  if (pwd.length === 0) {
    bar.style.width = "0%";
    text.innerText = "";
    if (barContainer) barContainer.style.display = "none";
    text.style.display = "none";
    return 0;
  }

  // Make them visible since input is not empty
  if (barContainer) barContainer.style.display = "block";
  text.style.display = "block";

  if (strength <= 1) {
    bar.style.width = "25%";
    bar.style.backgroundColor = "var(--danger)";
    text.innerText = state.language === "en" ? "Weak - Minimum 8 characters with numbers & symbols required" : "দুর্বল - কমপক্ষে ৮টি অক্ষর, সংখ্যা ও স্পেশাল ক্যারেক্টার লাগবে";
    text.style.color = "var(--danger)";
  } else if (strength === 2 || strength === 3) {
    bar.style.width = "60%";
    bar.style.backgroundColor = "var(--warning)";
    text.innerText = state.language === "en" ? "Medium Strength" : "মাঝারি পাসওয়ার্ড";
    text.style.color = "var(--warning)";
  } else {
    bar.style.width = "100%";
    bar.style.backgroundColor = "var(--success)";
    text.innerText = state.language === "en" ? "Strong Password" : "শক্তিশালী পাসওয়ার্ড";
    text.style.color = "var(--success)";
  }
  return strength;
}

function setupCpRealtimeValidation() {
  const currentInp = document.getElementById("change-pwd-current");
  const newInp = document.getElementById("change-pwd-new");
  const confirmInp = document.getElementById("change-pwd-confirm");
  const currentFeedback = document.getElementById("change-pwd-current-feedback");
  const confirmFeedback = document.getElementById("change-pwd-confirm-feedback");
  const updateBtn = document.getElementById("change-pwd-update-btn");

  const validateForm = () => {
    const currentVal = currentInp ? currentInp.value : "";
    const newVal = newInp ? newInp.value : "";
    const confirmVal = confirmInp ? confirmInp.value : "";

    let isCurrentValid = false;
    let isNewValid = false;
    let isConfirmValid = false;

    // A. Current Password Real-Time Validation
    if (currentVal.length === 0) {
      if (currentFeedback) {
        currentFeedback.style.display = "none";
        currentFeedback.innerText = "";
      }
    } else {
      const isMatch = currentVal === state.currentUser.password;
      if (currentFeedback) {
        currentFeedback.style.display = "block";
        if (isMatch) {
          currentFeedback.innerText = state.language === "en" ? "Passwords match." : "পাসওয়ার্ড মিলেছে।";
          currentFeedback.style.color = "var(--success)";
          isCurrentValid = true;
        } else {
          currentFeedback.innerText = state.language === "en" ? "Passwords do not match." : "পাসওয়ার্ড দুটি মেলেনি।";
          currentFeedback.style.color = "var(--danger)";
        }
      }
    }

    // B. New Password Strength Check
    const strengthScore = checkCpPasswordStrength(newVal);
    isNewValid = strengthScore === 4;

    // C. Confirm Password Check
    if (confirmVal.length === 0) {
      if (confirmFeedback) {
        confirmFeedback.style.display = "none";
        confirmFeedback.innerText = "";
      }
    } else {
      const isMatch = newVal === confirmVal;
      if (confirmFeedback) {
        confirmFeedback.style.display = "block";
        if (isMatch) {
          confirmFeedback.innerText = state.language === "en" ? "Password match." : "পাসওয়ার্ড মিলেছে।";
          confirmFeedback.style.color = "var(--success)";
          isConfirmValid = true;
        } else {
          confirmFeedback.innerText = state.language === "en" ? "Passwords do not match." : "পাসওয়ার্ড দুটি মেলেনি।";
          confirmFeedback.style.color = "var(--danger)";
        }
      }
    }

    // Update button is kept enabled at all times

  };

  if (currentInp) {
    currentInp.addEventListener("input", validateForm);
    currentInp.addEventListener("keyup", validateForm);
  }
  if (newInp) {
    newInp.addEventListener("input", validateForm);
    newInp.addEventListener("keyup", validateForm);
  }
  if (confirmInp) {
    confirmInp.addEventListener("input", validateForm);
    confirmInp.addEventListener("keyup", validateForm);
  }
}

function openCropModal(imageUrl, onCropApply, fileInputElement) {
  const modal = document.getElementById("crop-modal");
  if (!modal) return;

  currentCropFileInput = fileInputElement;

  const cropImg = document.getElementById("crop-image-element");
  if (cropImg) {
    cropImg.src = imageUrl;
  }

  // If an active instance exists, destroy it
  if (activeCropperInstance) {
    activeCropperInstance.destroy();
    activeCropperInstance = null;
  }

  // Open Crop Modal
  modal.classList.add("open");

  const currentLang = state.language || "en";

  // Translate modal title
  const cropTitle = modal.querySelector("h3[data-translate='crop_modal_title']");
  if (cropTitle && TRANSLATIONS[currentLang]["crop_modal_title"]) {
    cropTitle.innerText = TRANSLATIONS[currentLang]["crop_modal_title"];
  }

  // Initialize Cropper.js after a brief delay for modal display transition
  setTimeout(() => {
    // Prevent initialization if the modal was closed before the timeout fires
    if (!modal.classList.contains("open")) return;

    if (activeCropperInstance) {
      activeCropperInstance.destroy();
    }

    activeCropperInstance = new Cropper(cropImg, {
      aspectRatio: 1,
      viewMode: 3, // Forces the minimum canvas size to completely fill the container
      dragMode: 'move', // Allows the user to grab and drag the image itself
      autoCropArea: 0.8, // Centers and initializes the crop box at 80% of the image size
      responsive: true,
      restore: true,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false
    });
  }, 100);

  // Bind Apply Button
  const applyBtn = document.getElementById("crop-apply-btn");
  const newApplyBtn = applyBtn.cloneNode(true);
  if (TRANSLATIONS[currentLang]["btn_crop_apply"]) {
    newApplyBtn.innerText = TRANSLATIONS[currentLang]["btn_crop_apply"];
  }
  applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);

  newApplyBtn.addEventListener("click", () => {
    if (activeCropperInstance) {
      const canvas = activeCropperInstance.getCroppedCanvas({
        width: 150,
        height: 150
      });
      if (canvas) {
        const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        onCropApply(croppedDataUrl);
      }
    }
    closeCropModal();
  });

  // Bind Cancel Button
  const cancelBtn = document.getElementById("crop-cancel-btn");
  const newCancelBtn = cancelBtn.cloneNode(true);
  if (TRANSLATIONS[currentLang]["btn_cancel"]) {
    newCancelBtn.innerText = TRANSLATIONS[currentLang]["btn_cancel"];
  }
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  newCancelBtn.addEventListener("click", () => {
    closeCropModal();
  });
}

function closeCropModal() {
  const modal = document.getElementById("crop-modal");
  if (modal) {
    modal.classList.remove("open");
  }
  if (activeCropperInstance) {
    activeCropperInstance.destroy();
    activeCropperInstance = null;
  }
  if (currentCropFileInput) {
    currentCropFileInput.value = "";
    currentCropFileInput = null;
  }
}

function bindBaNoPrefixBehavior(inputElement) {
  if (!inputElement) return;

  inputElement.addEventListener("focus", () => {
    const user = state.currentUser || {};
    const roleId = Number(user.role);

    if ([2, 4, 6].includes(roleId)) {
      if (!inputElement.value.startsWith("BA-")) {
        inputElement.value = "BA-";
      }
      setTimeout(() => {
        const len = inputElement.value.length;
        inputElement.setSelectionRange(len, len);
      }, 0);
    }
  });

  inputElement.addEventListener("blur", () => {
    const user = state.currentUser || {};
    const roleId = Number(user.role);

    if ([2, 4, 6].includes(roleId)) {
      if (inputElement.value === "BA-") {
        inputElement.value = "";
      }
    }
  });

  inputElement.addEventListener("keydown", (e) => {
    const user = state.currentUser || {};
    const roleId = Number(user.role);

    if ([2, 4, 6].includes(roleId)) {
      const prefix = "BA-";
      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      if (e.key === "Backspace") {
        if (start <= prefix.length && start === end) {
          e.preventDefault();
        }
      } else if (e.key === "Delete") {
        if (start < prefix.length) {
          e.preventDefault();
        }
      } else if (start < prefix.length) {
        e.preventDefault();
      }
    }
  });

  inputElement.addEventListener("input", () => {
    const user = state.currentUser || {};
    const roleId = Number(user.role);

    if ([2, 4, 6].includes(roleId)) {
      let val = inputElement.value;
      if (!val.startsWith("BA-")) {
        let clean = val.replace(/^BA-/i, "").replace(/[^a-zA-Z0-9]/g, "");
        val = "BA-" + clean;
      }
      let suffix = val.slice(3).replace(/[^a-zA-Z0-9]/g, "");
      inputElement.value = "BA-" + suffix;
    }
  });
}

// Expose public API to window for inline HTML event handlers
window.togglePasswordVisibility = togglePasswordVisibility;
window.selectUnitFromTree = selectUnitFromTree;
window.selectUnitForEditing = selectUnitForEditing;
window.simulateCall = simulateCall;
window.state = state;
window.setLanguage = setLanguage;
window.impersonateRole = impersonateRole;
window.showToast = showToast;


document.addEventListener("DOMContentLoaded", async () => {
  await initDatabases();

  // Bind Language Switchers
  const langToggleBtn = document.getElementById("lang-toggle-btn");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      const newLang = state.language === "en" ? "bn" : "en";
      setLanguage(newLang);
    });
  }

  // Login page pill lang-switch handlers
  const optEn = document.getElementById("login-lang-opt-en");
  const optBn = document.getElementById("login-lang-opt-bn");
  if (optEn && optBn) {
    optEn.addEventListener("click", () => setLanguage("en"));
    optBn.addEventListener("click", () => setLanguage("bn"));
  }

  // Dashboard page pill lang-switch handlers
  const dashOptEn = document.getElementById("dashboard-lang-opt-en");
  const dashOptBn = document.getElementById("dashboard-lang-opt-bn");
  if (dashOptEn && dashOptBn) {
    dashOptEn.addEventListener("click", () => setLanguage("en"));
    dashOptBn.addEventListener("click", () => setLanguage("bn"));
  }

  // Forgot password mock
  document.getElementById("btn-forgot-password").addEventListener("click", (e) => {
    e.preventDefault();
    showToast(
      state.language === "en" ? "SMS Code Sent" : "এসএমএস কোড পাঠানো হয়েছে",
      state.language === "en" ? "A secure login recovery verification code has been dispatched to your mobile." : "পাসওয়ার্ড পুনরুদ্ধারের একটি ওটিপি কোড আপনার মোবাইলে পাঠানো হয়েছে।",
      "info"
    );
  });

  // 3-Step Setup Wizard Event Listeners for Step 2 Mobile Input
  const mobileInput = document.getElementById("setup-mobile");
  if (mobileInput) {
    mobileInput.addEventListener("focus", () => {
      if (!mobileInput.value.startsWith("+880176955")) {
        mobileInput.value = "+880176955";
      }
      setTimeout(() => {
        const len = mobileInput.value.length;
        mobileInput.setSelectionRange(len, len);
      }, 0);
    });

    mobileInput.addEventListener("blur", () => {
      if (mobileInput.value === "+880176955") {
        mobileInput.value = "";
      }
    });

    mobileInput.addEventListener("keydown", (e) => {
      const prefix = "+880176955";
      const start = mobileInput.selectionStart;
      const end = mobileInput.selectionEnd;
      if (e.key === "Backspace") {
        if (start <= prefix.length && start === end) {
          e.preventDefault();
        }
      } else if (e.key === "Delete") {
        if (start < prefix.length) {
          e.preventDefault();
        }
      } else if (start < prefix.length) {
        e.preventDefault();
      }
    });

    mobileInput.addEventListener("input", () => {
      let val = mobileInput.value;
      if (!val.startsWith("+880176955")) {
        let digits = val.replace(/\D/g, "");
        if (digits.startsWith("880176955") && digits.length > 9) {
          val = "+880176955" + digits.slice(9);
        } else if (digits.startsWith("0176955") && digits.length > 7) {
          val = "+880176955" + digits.slice(7);
        } else if (digits.startsWith("176955") && digits.length > 6) {
          val = "+880176955" + digits.slice(6);
        } else {
          let lastDigits = digits.slice(-4);
          val = "+880176955" + lastDigits;
        }
      }
      
      let suffix = val.slice(10).replace(/\D/g, "").slice(0, 4);
      mobileInput.value = "+880176955" + suffix;
      
      if (suffix.length === 4) {
        if (!state.generatedOTP) {
          sendMockOTP();
        }
      } else {
        state.generatedOTP = null;
        state.otpVerified = false;
        const otpGroup = document.getElementById("otp-verification-group");
        if (otpGroup) {
          otpGroup.style.display = "none";
          otpGroup.classList.remove("visible");
        }
        document.getElementById("otp-1").value = "";
        document.getElementById("otp-2").value = "";
        document.getElementById("otp-3").value = "";
        document.getElementById("otp-4").value = "";
      }
    });
  }

  // Bind prefix behaviors for BA/Army number fields
  bindBaNoPrefixBehavior(document.getElementById("setup-ba-no"));
  bindBaNoPrefixBehavior(document.getElementById("edit-ba-no"));

  // Custom Dropdown Trigger Events
  const trigger = document.getElementById("rank-trigger");
  const menu = document.getElementById("rank-dropdown-menu");
  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      trigger.classList.toggle("open");
      menu.classList.toggle("open");
    });
  }

  window.addEventListener("click", () => {
    if (trigger && menu) {
      trigger.classList.remove("open");
      menu.classList.remove("open");
    }
  });


  // Reset system database state listener
  document.getElementById("btn-reset-db").addEventListener("click", (e) => {
    e.preventDefault();
    resetSystemState();
  });

  // 2. Auth Submissions
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  } else {
    const loginBtn = document.getElementById("btn-login-submit");
    if (loginBtn) {
      loginBtn.addEventListener("click", handleLogin);
    }
  }
  const logoutBtn = document.getElementById("header-logout-btn") || document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // 3. Wizard Handlers
  document.getElementById("wizard-next-btn").addEventListener("click", handleSetupNext);
  document.getElementById("wizard-back-btn").addEventListener("click", handleSetupBack);
  
  console.log("[Setup Listeners] Binding setup-new-password and setup-confirm-password event listeners");
  const newPwdField = document.getElementById("setup-new-password");
  const confirmPwdField = document.getElementById("setup-confirm-password");
  console.log("[Setup Listeners] newPwdField exists:", !!newPwdField, "confirmPwdField exists:", !!confirmPwdField);

  if (newPwdField) {
    newPwdField.addEventListener("input", (e) => {
      checkPasswordStrength(e.target.value);
      checkPasswordMatch();
    });
    newPwdField.addEventListener("keyup", () => {
      checkPasswordMatch();
    });
  }

  if (confirmPwdField) {
    confirmPwdField.addEventListener("input", () => {
      checkPasswordMatch();
    });
    confirmPwdField.addEventListener("keyup", () => {
      checkPasswordMatch();
    });
  }

  const otpInputs = document.querySelectorAll(".otp-input");
  otpInputs.forEach((inp, idx) => {
    inp.addEventListener("input", (e) => {
      const rawVal = e.target.value.replace(/\D/g, "");
      e.target.value = rawVal;
      
      if (rawVal.length === 1 && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }
      
      const enteredCode = Array.from(otpInputs).map(i => i.value).join("");
      if (enteredCode.length === 4) {
        // Accept any 4-digit code for easier simulation/testing
        state.otpVerified = true;
        showToast(
          state.language === "en" ? "OTP Verified" : "ওটিপি যাচাইকৃত",
          TRANSLATIONS[state.language].toast_otp_verified,
          "success"
        );
        setTimeout(() => {
          handleSetupNext();
        }, 600);
      }
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && e.target.value.length === 0 && idx > 0) {
        otpInputs[idx - 1].focus();
      }
    });
  });

  document.getElementById("resend-otp-btn").addEventListener("click", (e) => {
    e.preventDefault();
    handleResendOTP();
  });

  document.getElementById("profile-upload-trigger").addEventListener("click", () => {
    document.getElementById("setup-avatar-file").click();
  });

  document.getElementById("setup-avatar-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileInput = document.getElementById("setup-avatar-file");
        openCropModal(event.target.result, (croppedDataUrl) => {
          state.selectedAvatar = croppedDataUrl;
          const img = document.getElementById("profile-dropzone-preview");
          const placeholder = document.getElementById("profile-dropzone-preview-container");
          
          if (img) {
            img.src = croppedDataUrl;
            img.style.display = "block";
          }
          if (placeholder) placeholder.style.display = "none";
          
          showToast(
            state.language === "en" ? "Photo Cropped & Applied" : "ছবি ক্রপ ও প্রয়োগ সম্পন্ন", 
            state.language === "en" ? "Custom profile image has been cropped and updated." : "আপনার কাস্টম ছবি সফলভাবে ক্রপ এবং আপডেট করা হয়েছে।", 
            "success"
          );
        }, fileInput);
      };
      reader.readAsDataURL(file);
    }
  });

  // 4. Menu Switching (Safeguarded)
  const menuOverview = document.getElementById("menu-btn-overview");
  if (menuOverview) {
    menuOverview.addEventListener("click", (e) => {
      e.preventDefault();
      switchSubContent("overview");
    });
  }
  const menuUnits = document.getElementById("menu-btn-units");
  if (menuUnits) {
    menuUnits.addEventListener("click", (e) => {
      e.preventDefault();
      switchSubContent("units");
    });
  }
  const menuDir = document.getElementById("menu-btn-directory");
  if (menuDir) {
    menuDir.addEventListener("click", (e) => {
      e.preventDefault();
      switchSubContent("directory");
    });
  }

  // 5. Units Form Updates (Safeguarded)
  const unitsFilter = document.getElementById("units-brigade-filter");
  if (unitsFilter) {
    unitsFilter.addEventListener("change", renderUnitsManagementTable);
  }
  const saveUnitBtn = document.getElementById("btn-save-unit-data");
  if (saveUnitBtn) {
    saveUnitBtn.addEventListener("click", handleSaveUnitData);
  }

  // 6. Contact Directory inputs (Safeguarded)
  const dirSearch = document.getElementById("directory-search-input");
  if (dirSearch) {
    dirSearch.addEventListener("input", renderDirectoryCards);
  }
  const dirFilter = document.getElementById("directory-unit-filter");
  if (dirFilter) {
    dirFilter.addEventListener("change", renderDirectoryCards);
  }

  // 7. Simulator controls togglers
  document.getElementById("simulator-trigger-btn").addEventListener("click", () => {
    const panel = document.getElementById("simulator-panel-container");
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) {
      renderRoleImpersonatorList();
    }
  });

  // Clear login field errors on typing
  const userField = document.getElementById("username");
  const passField = document.getElementById("password");
  if (userField) {
    userField.addEventListener("input", () => {
      const err = document.getElementById("username-error-msg");
      if (err) {
        err.style.display = "none";
        err.innerText = "";
      }
    });
  }
  if (passField) {
    passField.addEventListener("input", () => {
      const err = document.getElementById("password-error-msg");
      if (err) {
        err.style.display = "none";
        err.innerText = "";
      }
    });
  }

  // --- Avatar Dropdown Trigger & Options ---
  const profileTrigger = document.getElementById("header-profile-trigger");
  if (profileTrigger) {
    profileTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.getElementById("profile-dropdown-menu");
      if (menu) {
        menu.classList.toggle("open");
      }
    });
  }

  // Global click to hide profile dropdown
  document.addEventListener("click", () => {
    const menu = document.getElementById("profile-dropdown-menu");
    if (menu) {
      menu.classList.remove("open");
    }
  });

  // Dropdown Edit Profile Click
  const dropdownBtnEdit = document.getElementById("dropdown-btn-edit");
  if (dropdownBtnEdit) {
    dropdownBtnEdit.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.getElementById("profile-dropdown-menu");
      if (menu) menu.classList.remove("open");
      openEditProfileModal();
    });
  }

  // Dropdown Logout Click
  const dropdownBtnLogout = document.getElementById("dropdown-btn-logout");
  if (dropdownBtnLogout) {
    dropdownBtnLogout.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.getElementById("profile-dropdown-menu");
      if (menu) menu.classList.remove("open");
      handleLogout();
    });
  }

  // Dropdown Change Password Click
  const dropdownBtnChangePwd = document.getElementById("dropdown-btn-change-pwd");
  if (dropdownBtnChangePwd) {
    dropdownBtnChangePwd.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.getElementById("profile-dropdown-menu");
      if (menu) menu.classList.remove("open");
      openChangePasswordModal();
    });
  }

  // Change Password Modal Controls
  const cpCancelBtn = document.getElementById("change-pwd-cancel-btn");
  if (cpCancelBtn) {
    cpCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeChangePasswordModal();
    });
  }

  const cpBackBtn = document.getElementById("change-pwd-back-btn");
  if (cpBackBtn) {
    cpBackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      const step1 = document.getElementById("password-step-container");
      const step2 = document.getElementById("otp-step-container");
      const title = document.getElementById("change-pwd-modal-title");

      if (step1 && step2) {
        step2.classList.add("fade-out");

        setTimeout(() => {
          step2.classList.remove("active");
          step2.classList.add("hidden");
          step2.classList.remove("fade-out");

          step1.classList.remove("hidden");
          step1.classList.add("active");
          step1.classList.add("fade-out");

          if (title) {
            title.innerText = state.language === "en" ? "Change Password" : "পাসওয়ার্ড পরিবর্তন করুন";
          }

          step1.offsetHeight;
          step1.classList.remove("fade-out");

          stopCpTimer();
          cpOtpCode = "";
        }, 200);
      } else {
        if (title) {
          title.innerText = state.language === "en" ? "Change Password" : "পাসওয়ার্ড পরিবর্তন করুন";
        }
        stopCpTimer();
        cpOtpCode = "";
      }
    });
  }

  const cpUpdateBtn = document.getElementById("change-pwd-update-btn");
  if (cpUpdateBtn) {
    cpUpdateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleUpdatePasswordStep1();
    });
  }

  const cpVerifyBtn = document.getElementById("change-pwd-verify-btn");
  if (cpVerifyBtn) {
    cpVerifyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleVerifyOTPStep2();
    });
  }

  const cpResendBtn = document.getElementById("cp-resend-btn");
  if (cpResendBtn) {
    cpResendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sendCpOTP();
    });
  }

  const pwdForm = document.getElementById("password-step-container");
  if (pwdForm) {
    pwdForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUpdatePasswordStep1();
    });
  }

  const otpForm = document.getElementById("otp-step-container");
  if (otpForm) {
    otpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleVerifyOTPStep2();
    });
  }

  // Set up inputs
  setupCpOtpInputs();
  setupCpRealtimeValidation();

  // Modal Cancel Click
  const editCancelBtn = document.getElementById("edit-cancel-btn");
  if (editCancelBtn) {
    editCancelBtn.addEventListener("click", () => {
      closeEditProfileModal();
    });
  }

  // Modal Save Click
  const editSaveBtn = document.getElementById("edit-save-btn");
  if (editSaveBtn) {
    editSaveBtn.addEventListener("click", () => {
      saveEditProfile();
    });
  }

  // Modal avatar dropzone click
  const editAvatarTrigger = document.getElementById("edit-avatar-trigger");
  const editAvatarFile = document.getElementById("edit-avatar-file");
  if (editAvatarTrigger && editAvatarFile) {
    editAvatarTrigger.addEventListener("click", () => {
      editAvatarFile.click();
    });

    editAvatarFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          openCropModal(evt.target.result, (croppedDataUrl) => {
            state.selectedEditAvatar = croppedDataUrl;
            const previewImg = document.getElementById("edit-dropzone-preview");
            const placeholder = document.getElementById("edit-dropzone-preview-container");
            if (previewImg) {
              previewImg.src = croppedDataUrl;
              previewImg.style.display = "block";
            }
            if (placeholder) placeholder.style.display = "none";
            
            showToast(
              state.language === "en" ? "Photo Cropped & Applied" : "ছবি ক্রপ ও প্রয়োগ সম্পন্ন", 
              state.language === "en" ? "Custom profile image has been cropped and updated." : "আপনার কাস্টম ছবি সফলভাবে ক্রপ এবং আপডেট করা হয়েছে।", 
              "success"
            );
          }, editAvatarFile);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Edit Rank custom dropdown toggle
  const editRankTrigger = document.getElementById("edit-rank-trigger");
  if (editRankTrigger) {
    editRankTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.getElementById("edit-rank-dropdown-menu");
      if (menu) {
        menu.classList.toggle("open");
        editRankTrigger.classList.toggle("open");
      }
    });
  }

  // Close edit rank dropdown on click outside
  document.addEventListener("click", () => {
    const menu = document.getElementById("edit-rank-dropdown-menu");
    const trigger = document.getElementById("edit-rank-trigger");
    if (menu && trigger) {
      menu.classList.remove("open");
      trigger.classList.remove("open");
    }
  });

  window.addEventListener("resize", () => updateNavIndicator(true));
  switchView(state.activeView);
  setLanguage(state.language);
});
