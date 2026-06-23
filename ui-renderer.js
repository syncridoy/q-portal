// UI Rendering and View Controllers Module for Q-Portal

import { state, BRIGADES, ALL_UNITS_LIST, ROLE_TABS, getRoleCategory, toTitleCase, normalizeAppointment, LINE_MOCK_DATA } from './state.js';
import { TRANSLATIONS, t, formatDisplayNumber, setLanguage, convertDigitsToBengali } from './translations.js';
import { initMainDashboardCharts, initDonutChart, initLineChart } from './charts.js';

// Reference app.js functions through window object to avoid circular dependencies
function showToast(...args) {
  if (window.showToast) {
    window.showToast(...args);
  } else {
    console.warn("showToast called before window.showToast was initialized", args);
  }
}

function impersonateRole(...args) {
  if (window.impersonateRole) {
    window.impersonateRole(...args);
  } else {
    console.warn("impersonateRole called before window.impersonateRole was initialized", args);
  }
}

export function getDisplayNameForUnit(unitName, year) {
  const activeYear = year || (state.dashboard ? state.dashboard.lineYear : "2025-26");
  const isBn = state.language === "bn";
  
  if (isBn) {
    if (unitName === "5 BIR (Sp Bn)" || unitName === "19 E Bengal (Sp Bn)") {
      if (activeYear === "2024-25") {
        return "১৯ ই বেঙ্গল (ডিঃ সাপোঃ)";
      } else {
        return "৫ বীর (ডিঃ সাপোঃ)";
      }
    }
    
    const unitMap = {
      "Rawshan Ara Regt Arty": "রওশন আরা রেজিঃ আর্টিঃ",
      "8 Fd Regt Arty": "৮ ফিল্ড রেজিঃ আর্টিঃ",
      "27 Fd Regt Arty": "২৭ ফিল্ড  রেজিঃ আর্টিঃ",
      "Adhoc Med Bty": "এডহক মিডিঃ ব্যাটারি",
      "10 E Bengal": "১০ ই বেংগল",
      "20 E Bengal": "২০ ই বেংগল",
      "2 E Bengal": "২ ই বেংগল",
      "6 E Bengal": "৬ ই বেংগল",
      "14 BIR": "১৪ বীর",
      "Adhoc 34 E Bengal": "এড‌হক ৩৪ ই বেংগল",
      "37 BIR": "৩৭ বীর",
      "9 Bengal Lancers": "৯ বেঙ্গল ল্যান্সার",
      "9 Bengal Lancer": "৯ বেঙ্গল ল্যান্সার",
      "3 Engr Bn": "৩ ইঞ্জিনিয়ার ব্যাটালিয়ন",
      "2 Sig Bn": "২ সিগনাল ব্যাটালিয়ন",
      "31 ST Bn": "৩১  এসটি ব্যাটালিয়ন",
      "41 Fd Amb": "৪১ ফিল্ড এ্যাম্বুলেন্স",
      "71 Fd Amb": "৭১ ফিল্ড এ্যাম্বুলেন্স",
      "505 DOC": "৫০৫ ডিওসি",
      "117 Fd Wksp Coy EME": "১১৭ ফিল্ড ওয়ার্কশপ কোঃ ইএম‌ই",
      "119 Fd Wksp Coy EME": "১১৯ ফিল্ড ওয়ার্কশপ কোঃ ইএম‌ই",
      "145 Fd Wksp Coy EME": "১৪৫ ফিল্ড ওয়ার্কশপ কোঃ ইএম‌ই",
      "55 MP Unit": "৫৫ এমপি ইউনিট",
      "55 FIU": "৫৫ এফআইইউ",
      "HQ Coy 55 Inf Div": "সদর দপ্তর কোঃ ৫৫ পদাঃ ডিভঃ",
      "Division HQ": "ডিভঃ সদর দপ্তর"
    };
    
    if (unitMap[unitName]) return unitMap[unitName];
  }
  
  if (unitName === "5 BIR (Sp Bn)" || unitName === "19 E Bengal (Sp Bn)") {
    if (activeYear === "2024-25") {
      return "19 E Bengal (Sp Bn)";
    } else {
      return "5 BIR (Sp Bn)";
    }
  }
  if (unitName === "9 Bengal Lancers" || unitName === "9 Bengal Lancer") {
    return "9 Bengal Lancer";
  }
  return unitName;
}

export function translateFullName(fullName) {
  if (!fullName) return "";
  
  const activeYear = state.dashboard ? state.dashboard.lineYear : "2025-26";
  
  if (state.language !== "bn") {
    let formatted = fullName;
    if (activeYear === "2024-25") {
      formatted = formatted
        .replace("5 BIR (Sp Bn)", "19 E Bengal (Sp Bn)")
        .replace("5 BIR", "19 E Bengal");
    } else {
      formatted = formatted
        .replace("19 E Bengal (Sp Bn)", "5 BIR (Sp Bn)")
        .replace("19 E Bengal", "5 BIR");
    }
    return formatted;
  }
  
  if (TRANSLATIONS.bn[fullName]) {
    return TRANSLATIONS.bn[fullName];
  }
  
  const match = fullName.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (match) {
    const appt = match[1].trim();
    const unit = match[2].trim();
    const translatedAppt = t(appt);
    const translatedUnit = getDisplayNameForUnit(unit, activeYear);
    return `${translatedAppt} (${translatedUnit})`;
  }
  
  let formatted = fullName;
  if (activeYear === "2024-25") {
    formatted = formatted
      .replace("5 BIR (Sp Bn)", "19 E Bengal (Sp Bn)")
      .replace("5 BIR", "19 E Bengal");
  } else {
    formatted = formatted
      .replace("19 E Bengal (Sp Bn)", "5 BIR (Sp Bn)")
      .replace("19 E Bengal", "5 BIR");
  }
  
  const englishUnits = Object.keys(TRANSLATIONS.en).filter(k => 
    k !== "HQ" && k !== "ALL" && k !== "OC" && k !== "QM" && k !== "Q Clk"
  ).sort((a, b) => b.length - a.length);
  
  englishUnits.forEach(unit => {
    if (formatted.includes(unit)) {
      formatted = formatted.replace(new RegExp(unit, 'g'), getDisplayNameForUnit(unit, activeYear));
    }
  });
  
  const appts = ["OC", "QM", "Q Clk", "AAQMG", "DAQMG"];
  appts.forEach(appt => {
    if (formatted.includes(appt)) {
      formatted = formatted.replace(new RegExp(appt, 'g'), t(appt));
    }
  });
  
  return formatted;
}

export function updateNavIndicator(noTransition = false) {
  const container = document.getElementById("header-nav-tabs");
  if (!container) return;
  const activeTab = container.querySelector(".nav-tab.active");
  const indicator = container.querySelector(".nav-indicator");
  if (activeTab && indicator) {
    if (noTransition) {
      indicator.classList.add("no-transition");
    }
    indicator.style.width = `${activeTab.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
    if (noTransition) {
      // Force reflow
      indicator.offsetHeight;
      setTimeout(() => {
        indicator.classList.remove("no-transition");
      }, 50);
    }
  }
}

export function renderNavigationTabs() {
  const container = document.getElementById("header-nav-tabs");
  if (!container) return;

  const role = state.currentUser ? state.currentUser.role : 1;
  const category = getRoleCategory(role);
  const tabs = ROLE_TABS[category];

  // Save currently active tab key or default to first one
  const currentActiveKey = state.activeTabKey || tabs[0];
  state.activeTabKey = currentActiveKey;

  container.innerHTML = "";

  // Append sliding indicator element with no-transition class initially
  const indicator = document.createElement("div");
  indicator.className = "nav-indicator no-transition";
  container.appendChild(indicator);

  tabs.forEach(tabKey => {
    const btn = document.createElement("button");
    btn.className = `nav-tab ${tabKey === currentActiveKey ? "active" : ""}`;

    // Get translation key and set as label text dynamically based on current language
    const transKey = "tab_" + tabKey.toLowerCase().replace("-", "_").replace(" ", "_");
    btn.innerText = TRANSLATIONS[state.language][transKey] || tabKey;

    btn.onclick = () => {
      document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      state.activeTabKey = tabKey;
      updateNavIndicator(false);
      renderPortalMainContent();
    };

    container.appendChild(btn);
  });

  // Calculate indicator position after rendering synchronously to prevent layout flashes
  updateNavIndicator(true);
}

export function syncLanguageSwitchers() {
  const lang = state.language;
  // Login switcher
  const optEn = document.getElementById("login-lang-opt-en");
  const optBn = document.getElementById("login-lang-opt-bn");
  if (optEn && optBn) {
    if (lang === "en") {
      optEn.classList.add("active");
      optBn.classList.remove("active");
    } else {
      optBn.classList.add("active");
      optEn.classList.remove("active");
    }
  }

  // Dashboard switcher
  const dashOptEn = document.getElementById("dashboard-lang-opt-en");
  const dashOptBn = document.getElementById("dashboard-lang-opt-bn");
  if (dashOptEn && dashOptBn) {
    if (lang === "en") {
      dashOptEn.classList.add("active");
      dashOptBn.classList.remove("active");
    } else {
      dashOptBn.classList.add("active");
      dashOptEn.classList.remove("active");
    }
  }
}

export function switchView(viewName) {
  state.activeView = viewName;
  
  const loginView = document.getElementById("view-login");
  const dashboardView = document.getElementById("view-dashboard");
  const splitCard = document.querySelector(".login-split-card");
  const blurOverlay = document.getElementById("global-blur-overlay");
  const loginWrapper = document.getElementById("login-form-wrapper");
  const wizardWrapper = document.getElementById("setup-wizard-wrapper");
  const header = document.getElementById("portal-header");

  if (viewName === "login" || viewName === "setup") {
    document.body.classList.add("auth-active");
    document.documentElement.classList.add("auth-active");
  } else {
    document.body.classList.remove("auth-active");
    document.documentElement.classList.remove("auth-active");
  }

  if (viewName === "login") {
    if (loginView) {
      loginView.classList.add("active");
      loginView.style.setProperty("display", "flex", "important");
    }
    if (dashboardView) {
      dashboardView.classList.remove("active");
      dashboardView.style.setProperty("display", "none", "important");
    }
    if (header) {
      header.classList.remove("active");
      header.style.setProperty("display", "none", "important");
    }
    
    // Reset morph styling states
    if (splitCard) splitCard.classList.remove("morph-to-setup");
    if (blurOverlay) blurOverlay.classList.remove("active");
    if (loginWrapper) {
      loginWrapper.style.display = "block";
      loginWrapper.offsetHeight; // force reflow
      loginWrapper.style.opacity = "1";
      loginWrapper.style.pointerEvents = "auto";
    }
    if (wizardWrapper) {
      wizardWrapper.style.display = "none";
      wizardWrapper.style.opacity = "0";
    }

    // Reset login form fields and clean error targets
    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.reset();
    const uErr = document.getElementById("username-error-msg");
    const pErr = document.getElementById("password-error-msg");
    if (uErr) { uErr.style.display = "none"; uErr.innerText = ""; }
    if (pErr) { pErr.style.display = "none"; pErr.innerText = ""; }
  } else if (viewName === "setup") {
    if (loginView) {
      loginView.classList.add("active");
      loginView.style.setProperty("display", "flex", "important");
    }
    if (dashboardView) {
      dashboardView.classList.remove("active");
      dashboardView.style.setProperty("display", "none", "important");
    }
    if (header) {
      header.classList.remove("active");
      header.style.setProperty("display", "none", "important");
    }
    
    // Force morph styling states active
    if (splitCard) splitCard.classList.add("morph-to-setup");
    if (blurOverlay) blurOverlay.classList.add("active");
    if (loginWrapper) {
      loginWrapper.style.display = "none";
      loginWrapper.style.opacity = "0";
      loginWrapper.style.pointerEvents = "none";
    }
    if (wizardWrapper) {
      wizardWrapper.style.display = "flex";
      wizardWrapper.offsetHeight; // force reflow
      wizardWrapper.style.opacity = "1";
    }
  } else if (viewName === "dashboard") {
    if (loginView) {
      loginView.classList.remove("active");
      loginView.style.setProperty("display", "none", "important");
    }
    if (dashboardView) {
      dashboardView.classList.add("active");
      dashboardView.style.setProperty("display", "flex", "important");
    }
    if (header) {
      header.classList.add("active");
      header.style.setProperty("display", "flex", "important");
    }
    
    // Clean up login morph states
    if (splitCard) splitCard.classList.remove("morph-to-setup");
    if (blurOverlay) blurOverlay.classList.remove("active");
  }
}

export function switchSubContent(subId) {
  state.activeSubContent = subId;
  
  const menuOverview = document.getElementById("menu-btn-overview");
  if (menuOverview) menuOverview.className = `menu-item ${subId === "overview" ? "active" : ""}`;
  const menuUnits = document.getElementById("menu-btn-units");
  if (menuUnits) menuUnits.className = `menu-item ${subId === "units" ? "active" : ""}`;
  const menuDir = document.getElementById("menu-btn-directory");
  if (menuDir) menuDir.className = `menu-item ${subId === "directory" ? "active" : ""}`;
  
  const contentOverview = document.getElementById("content-overview");
  if (contentOverview) contentOverview.style.display = subId === "overview" ? "block" : "none";
  const contentUnits = document.getElementById("content-units");
  if (contentUnits) contentUnits.style.display = subId === "units" ? "block" : "none";
  const contentDir = document.getElementById("content-directory");
  if (contentDir) contentDir.style.display = subId === "directory" ? "block" : "none";
  
  renderDashboardContent();
}

export function renderPortalMainContent() {
  const mainContent = document.getElementById("portal-main-content");
  if (!mainContent) return;

  mainContent.innerHTML = "";

  const activeTab = state.activeTabKey || "Dashboard";

  if (activeTab === "Dashboard") {
    renderMainDashboard(mainContent);
  } else if (activeTab === "POL") {
    renderPolManagementView(mainContent);
  } else {
    const transKey = "tab_" + activeTab.toLowerCase().replace("-", "_").replace(" ", "_");
    const tabName = TRANSLATIONS[state.language][transKey] || activeTab;
    mainContent.innerHTML = `
      <div id="main-dashboard-content">
        <h2 class="dashboard-title">${tabName}</h2>
        <div class="dashboard-card" style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 13px; font-weight: 500;">
          <p>${state.language === "en" ? "This section is currently under construction." : "এই বিভাগটি বর্তমানে নির্মাণাধীন রয়েছে।"}</p>
        </div>
      </div>
    `;
  }
}

function populateEntitySelectOptions(role) {
  const isBn = state.language === "bn";
  const selectedEntity = state.dashboard.lineEntity || "ALL";
  let html = "";

  if (role === 3 || role === 4) {
    const bde = state.currentUser.assigned || state.currentUser.scopeBde;
    const units = BRIGADES[bde] || [];
    
    let allLabel = isBn ? "সব" : bde;
    const hqLabel = isBn ? "ব্রিগেড সদর দপ্তর" : `Brigade HQ (${bde})`;
    
    html += `<option value="ALL" ${selectedEntity === "ALL" ? "selected" : ""}>${allLabel}</option>`;
    html += `<option value="HQ" ${selectedEntity === "HQ" ? "selected" : ""}>${hqLabel}</option>`;
    
    units.forEach(u => {
      html += `<option value="unit:${u}" ${selectedEntity === `unit:${u}` ? "selected" : ""}>${getDisplayNameForUnit(u)}</option>`;
    });
  } else if (role === 5 || role === 6) {
    const allLabel = isBn ? "সব" : "ALL";
    html += `<option value="ALL" ${selectedEntity === "ALL" ? "selected" : ""}>${allLabel}</option>`;
    
    Object.keys(BRIGADES).forEach(bde => {
      if (bde === "HQ 55 Inf Div (Direct)") return;
      let bdeLabel = bde;
      if (isBn) {
        if (bde === "HQ 55 Arty Bde") bdeLabel = "সদর দপ্তর ৫৫ আর্টিলারি ব্রিগেড";
        else if (bde === "HQ 21 Inf Bde") bdeLabel = "সদর দপ্তর ২১ পদাতিক ব্রিগেড";
        else if (bde === "HQ 88 Inf Bde") bdeLabel = "সদর দপ্তর ৮৮ পদাতিক ব্রিগেড";
        else if (bde === "HQ 105 Inf Bde") bdeLabel = "সদর দপ্তর ১০৫ পদাতিক ব্রিগেড";
      }
      html += `<option value="brigade:${bde}" ${selectedEntity === `brigade:${bde}` ? "selected" : ""}>${bdeLabel}</option>`;
    });
    
    const directUnits = BRIGADES["HQ 55 Inf Div (Direct)"] || [];
    directUnits.forEach(u => {
      html += `<option value="unit:${u}" ${selectedEntity === `unit:${u}` ? "selected" : ""}>${getDisplayNameForUnit(u)}</option>`;
    });
  }
  
  return html;
}

export function renderMainDashboard(container) {
  const role = state.currentUser ? state.currentUser.role : 6;
  if (!state.dashboard) {
    state.dashboard = {
      donutVehicle: "Jeep",
      lineYear: "2025-26",
      lineGrade: "Diesel",
      lineEntity: "ALL"
    };
  }

  const t = (key) => TRANSLATIONS[state.language][key] || key;

  let dashboardTitleKey = "title_div_overview";
  if (role === 1 || role === 2) {
    dashboardTitleKey = "title_unit_overview";
  } else if (role === 3 || role === 4) {
    dashboardTitleKey = "title_bde_overview";
  }

  // Grade translated label helper
  const getGradeLabel = (g) => {
    const gradeMap = {
      "Diesel": state.language === "bn" ? "ডিজেল" : "Diesel",
      "MS-74": state.language === "bn" ? "এমএস-৭৪" : "MS-74",
      "100 Octane": state.language === "bn" ? "১০০ অকটেন" : "100 Octane"
    };
    return gradeMap[g] || g;
  };

  const currentYearDisplay = state.language === "bn" ? convertDigitsToBengali(state.dashboard.lineYear) : state.dashboard.lineYear;
  const currentGradeDisplay = getGradeLabel(state.dashboard.lineGrade);

  const initialLineVal = state.dashboard.lineChartData || { alt: 0, total: 0, altData: [], data: [] };

  container.innerHTML = `
    <div id="main-dashboard-content">
      <h2 class="dashboard-title">${t(dashboardTitleKey)}</h2>
      <div class="dashboard-grid">
        
        <!-- ROW 1: 70% Veh State Summary Card | 30% Held Donut Chart Card -->
        <div class="dashboard-row-1">
          <!-- Card 1: Veh State Summary -->
          <div class="dashboard-card">
            <div class="card-header-row">
              <h4 class="card-header-title">${t("card_title_veh_state")}</h4>
            </div>
            <div class="dashboard-table-container">
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_type_of_veh")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_auth")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_held")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_or")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_ur")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_long_rd")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_of_rd")}</span></th>
                    <th colspan="2"><span class="cell-text-wrapper">${t("th_att")}</span></th>
                    <th colspan="2"><span class="cell-text-wrapper">${t("th_sur")}</span></th>
                  </tr>
                  <tr>
                    <th><span class="cell-text-wrapper">${t("th_long_rd")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_of_rd")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_long_rd")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_of_rd")}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_jeep")}</span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_pickup")}</span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_3ton")}</span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Card 2: Held Donut Chart -->
          <div class="dashboard-card">
            <div class="card-header-row" style="align-items: flex-start; margin-bottom: 0;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <h4 class="card-header-title">${t("card_title_held")}</h4>
                <span id="donut-header-held-val" style="font-size: 20px; font-weight: 800; color: #1e293b; line-height: 1.1;"></span>
              </div>
              <select id="donut-vehicle-select" class="mini-dropdown">
                <option value="Jeep" ${state.dashboard.donutVehicle === "Jeep" ? "selected" : ""}>${t("Jeep")}</option>
                <option value="pickup" ${state.dashboard.donutVehicle === "pickup" ? "selected" : ""}>${t("pickup")}</option>
                <option value="3 Ton" ${state.dashboard.donutVehicle === "3 Ton" ? "selected" : ""}>${t("3 Ton")}</option>
              </select>
            </div>
            <div style="position: relative; width: 100%; height: 160px; display: flex; align-items: center; justify-content: center; margin-top: 10px;">
              <canvas id="held-donut-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- ROW 2: 40% State of POL Card | 60% Total Exp Line Chart Card -->
        <div class="dashboard-row-2">
          <!-- Card 3: State of POL -->
          <div class="dashboard-card">
            <div class="card-header-row">
              <h4 class="card-header-title">${t("card_title_pol_state")}</h4>
            </div>
            <div class="dashboard-table-container">
              <table class="dashboard-table pol-state-table">
                <thead>
                  <tr>
                    <th><span class="cell-text-wrapper">${t("th_pol_grade")}</span></th>
                    <th><span class="cell-text-wrapper">${[5, 6].includes(Number(role)) ? t("th_alt_from_area") : t("Total Alt")}</span></th>
                    <th><span class="cell-text-wrapper">${[5, 6].includes(Number(role)) ? t("th_alt_to_bde") : t("Total Exp")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_bal")}</span></th>
                  </tr>
                </thead>
                <tbody id="pol-state-table-body">
                  <tr>
                    <td colspan="4" style="text-align: center; color: var(--text-muted);">Loading...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Card 4: Total Exp Line Chart -->
          <div class="dashboard-card" style="justify-content: stretch;">
            <div style="display: flex; width: 100%; gap: 20px; flex: 1; align-items: stretch;">
              <!-- Left Column: Dropdowns & Stats -->
              <div style="flex: 0 0 180px; display: flex; flex-direction: column; gap: 8px; justify-content: flex-start;">
                <!-- Dropdown Row 1: Year and Grade -->
                <div style="display: flex; gap: 8px; margin-bottom: 2px;">
                  <select id="line-year-select" class="mini-dropdown">
                    <option value="2024-25" ${state.dashboard.lineYear === "2024-25" ? "selected" : ""}>${t("2024-25")}</option>
                    <option value="2025-26" ${state.dashboard.lineYear === "2025-26" ? "selected" : ""}>${t("2025-26")}</option>
                    <option value="2026-27" ${state.dashboard.lineYear === "2026-27" ? "selected" : ""}>${t("2026-27")}</option>
                  </select>
                  <select id="line-grade-select" class="mini-dropdown">
                    <option value="Diesel" ${state.dashboard.lineGrade === "Diesel" ? "selected" : ""}>${t("Diesel")}</option>
                    <option value="MS-74" ${state.dashboard.lineGrade === "MS-74" ? "selected" : ""}>${t("MS-74")}</option>
                    <option value="100 Octane" ${state.dashboard.lineGrade === "100 Octane" ? "selected" : ""}>${t("100 Octane")}</option>
                  </select>
                </div>
                <!-- Dropdown Row 2: Brigade/Unit (Entity) -->
                ${[3, 4, 5, 6].includes(Number(role)) ? `
                <div style="margin-bottom: 4px; display: flex; justify-content: flex-start;">
                  <select id="line-entity-select" class="mini-dropdown" style="width: 100%; max-width: 180px;">
                    ${populateEntitySelectOptions(role)}
                  </select>
                </div>
                ` : ''}
                <!-- Metric Card: Allocation -->
                <div class="metric-card-box allocation-card">
                  <span style="font-size: 11px; font-weight: 700; color: #4b7fcc; display: block; text-transform: uppercase; letter-spacing: 0.5px;" data-translate="lbl_alloc_heading">${t("lbl_alloc_heading")}</span>
                  <div style="display: flex; align-items: center; margin-top: 3px; font-size: 12px; font-weight: 600; color: #4b7fcc;">
                    <span style="display: inline-block; width: 45px;" data-translate="lbl_total_label">${t("lbl_total_label")}</span>
                    <span style="margin-right: 4px;">:</span>
                    <span id="total-alt-value" class="metric-value">${formatDisplayNumber(initialLineVal.alt)}</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 1px; font-size: 11px; font-weight: 500; color: #4b7fcc;">
                    <span style="display: inline-block; width: 45px;" data-translate="lbl_avg_label">${t("lbl_avg_label")}</span>
                    <span style="margin-right: 4px;">:</span>
                    <span id="avg-alt-value" class="metric-value">${formatDisplayNumber((initialLineVal.alt || 0) / ((initialLineVal.altData && initialLineVal.altData.length > 0) ? initialLineVal.altData.length : 12))}</span>
                  </div>
                </div>
                <!-- Metric Card: Expenditure -->
                <div class="metric-card-box expenditure-card">
                  <span style="font-size: 11px; font-weight: 700; color: #f87171; display: block; text-transform: uppercase; letter-spacing: 0.5px;" data-translate="lbl_exp_heading">${t("lbl_exp_heading")}</span>
                  <div style="display: flex; align-items: center; margin-top: 3px; font-size: 12px; font-weight: 600; color: #f87171;">
                    <span style="display: inline-block; width: 45px;" data-translate="lbl_total_label">${t("lbl_total_label")}</span>
                    <span style="margin-right: 4px;">:</span>
                    <span id="total-exp-value" class="metric-value">${formatDisplayNumber(initialLineVal.total)}</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-top: 1px; font-size: 11px; font-weight: 500; color: #f87171;">
                    <span style="display: inline-block; width: 45px;" data-translate="lbl_avg_label">${t("lbl_avg_label")}</span>
                    <span style="margin-right: 4px;">:</span>
                    <span id="avg-exp-value" class="metric-value">${formatDisplayNumber((initialLineVal.total || 0) / ((initialLineVal.altData && initialLineVal.altData.length > 0) ? initialLineVal.altData.length : 12))}</span>
                  </div>
                </div>
              </div>
              <!-- Right Column: Graph -->
              <div style="flex: 1; height: 230px; position: relative;">
                <canvas id="total-exp-line-chart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 3: 65% Mess-staff Summary Card | 35% Bugler Summary Card -->
        <div class="dashboard-row-3">
          <!-- Card 5: Mess-staff Summary -->
          <div class="dashboard-card">
            <div class="card-header-row">
              <h4 class="card-header-title">${t("card_title_mess_summary")}</h4>
            </div>
            <div class="dashboard-table-container">
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_type_of_mess")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_auth")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_posted")}</span></th>
                    <th rowspan="2"><span class="cell-text-wrapper">${t("th_present")}</span></th>
                    <th colspan="4"><span class="cell-text-wrapper">${t("th_absent")}</span></th>
                  </tr>
                  <tr>
                    <th><span class="cell-text-wrapper">${t("th_lve")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_course")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_att")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_total")}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_messwaiter")}</span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_masalchi")}</span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_cook_m")}</span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_cook_u")}</span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                    <td><span class="cell-text-wrapper"></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right column stack: NC (E) Summary & Bugler Summary -->
          <div class="dashboard-row-3-right">
            <!-- Card 5.5: NC (E) Summary -->
            <div class="dashboard-card">
              <div class="card-header-row">
                <h4 class="card-header-title">${t("card_title_nce_summary")}</h4>
              </div>
              <div class="dashboard-table-container">
                <table class="dashboard-table">
                  <thead>
                    <tr>
                      <th rowspan="2"><span class="cell-text-wrapper">${t("th_auth")}</span></th>
                      <th rowspan="2"><span class="cell-text-wrapper">${t("th_posted")}</span></th>
                      <th rowspan="2"><span class="cell-text-wrapper">${t("th_present")}</span></th>
                      <th colspan="3"><span class="cell-text-wrapper">${t("th_absent")}</span></th>
                    </tr>
                    <tr>
                      <th><span class="cell-text-wrapper">${t("th_lve")}</span></th>
                      <th><span class="cell-text-wrapper">${t("th_att")}</span></th>
                      <th><span class="cell-text-wrapper">${t("th_total")}</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Card 6: Bugler Summary -->
            <div class="dashboard-card">
              <div class="card-header-row">
                <h4 class="card-header-title">${t("card_title_bugler_summary")}</h4>
              </div>
              <div class="dashboard-table-container">
                <table class="dashboard-table">
                  <thead>
                    <tr>
                      <th rowspan="2"><span class="cell-text-wrapper">${state.language === "bn" ? "মোট (Total)" : "Total"}</span></th>
                      <th rowspan="2"><span class="cell-text-wrapper">${t("th_present")}</span></th>
                      <th colspan="4"><span class="cell-text-wrapper">${t("th_absent")}</span></th>
                    </tr>
                    <tr>
                      <th><span class="cell-text-wrapper">${t("th_lve")}</span></th>
                      <th><span class="cell-text-wrapper">${t("th_course")}</span></th>
                      <th><span class="cell-text-wrapper">${t("th_att")}</span></th>
                      <th><span class="cell-text-wrapper">${t("th_total")}</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                      <td><span class="cell-text-wrapper"></span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Bind dropdown action events
  const donutSelect = document.getElementById("donut-vehicle-select");
  if (donutSelect) {
    donutSelect.onchange = (e) => {
      state.dashboard.donutVehicle = e.target.value;
      initDonutChart();
    };
  }

  bindLineChartEvents(role);

  // Initialize charts and load data asynchronously
  updateLineChartData();
  initDonutChart();
}

export function bindLineChartEvents(role) {
  const lineYearSelect = document.getElementById("line-year-select");
  if (lineYearSelect) {
    lineYearSelect.onchange = (e) => {
      state.dashboard.lineYear = e.target.value;
      const lineEntitySelect = document.getElementById("line-entity-select");
      if (lineEntitySelect) {
        lineEntitySelect.innerHTML = populateEntitySelectOptions(role);
      }
      updateLineChartData();
    };
  }

  const lineGradeSelect = document.getElementById("line-grade-select");
  if (lineGradeSelect) {
    lineGradeSelect.onchange = (e) => {
      state.dashboard.lineGrade = e.target.value;
      updateLineChartData();
    };
  }

  const lineEntitySelect = document.getElementById("line-entity-select");
  if (lineEntitySelect) {
    lineEntitySelect.onchange = (e) => {
      state.dashboard.lineEntity = e.target.value;
      updateLineChartData();
    };
  }
}

export function renderDashboardContent() {
  const statVeh = document.getElementById("stat-val-vehicles");
  if (!statVeh) return;
  const aggregates = computeAggregates();
  
  if (state.activeSubContent === "overview") {
    document.getElementById("stat-val-vehicles").innerText = `${aggregates.global.vAvail} / ${aggregates.global.vTotal}`;
    document.getElementById("stat-val-pol").innerText = `${aggregates.global.pol.toLocaleString()} L`;
    document.getElementById("stat-val-mess").innerText = aggregates.global.messTotal;
    document.getElementById("stat-val-personnel").innerText = aggregates.global.strength.toLocaleString();

    document.getElementById("stat-desc-vehicles").innerText = `${aggregates.global.vAvail} available for tasking`;
    document.getElementById("stat-desc-pol").innerText = "Division global POL pool";
    document.getElementById("stat-desc-mess").innerText = "Aggregate cooks & waiters";
    document.getElementById("stat-desc-personnel").innerText = "Troops accounted present";

    const tableBody = document.getElementById("agg-table-body");
    tableBody.innerHTML = "";
    
    Object.entries(aggregates.brigades).forEach(([bdeName, stats]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="cell-text-wrapper"><strong>${bdeName}</strong></span></td>
        <td><span class="cell-text-wrapper">${formatDisplayNumber(stats.vAvail, 'qty')} / ${formatDisplayNumber(stats.vTotal, 'qty')} <span class="badge ${stats.vAvail/stats.vTotal > 0.75 ? "badge-success" : "badge-warning"}">${Math.round(stats.vAvail/stats.vTotal*100)}%</span></span></td>
        <td><span class="cell-text-wrapper">${formatDisplayNumber(stats.pol)} L</span></td>
        <td><span class="cell-text-wrapper">${formatDisplayNumber(stats.cook + stats.waiter, 'qty')}</span></td>
        <td><span class="cell-text-wrapper"><strong>${formatDisplayNumber(stats.strength, 'qty')}</strong></span></td>
      `;
      tableBody.appendChild(row);
    });

    updateDashboardCharts(aggregates);

  } else if (state.activeSubContent === "units") {
    renderUnitsManagementTable();

  } else if (state.activeSubContent === "directory") {
    renderDirectoryCards();
  }
}

export function computeAggregates() {
  let global = { vAvail: 0, vTotal: 0, pol: 0, messTotal: 0, strength: 0 };
  let brigades = {};

  Object.keys(BRIGADES).forEach(bde => {
    brigades[bde] = { vAvail: 0, vTotal: 0, pol: 0, cook: 0, waiter: 0, strength: 0 };
  });

  Object.entries(state.logisticsDB).forEach(([unitName, stats]) => {
    const bdeName = Object.keys(BRIGADES).find(b => BRIGADES[b].includes(unitName));
    if (bdeName) {
      brigades[bdeName].vAvail += stats.vAvail;
      brigades[bdeName].vTotal += stats.vTotal;
      brigades[bdeName].pol += stats.pol;
      brigades[bdeName].cook += stats.cook;
      brigades[bdeName].waiter += stats.waiter;
      brigades[bdeName].strength += stats.strength;
    }
  });

  Object.values(brigades).forEach(bStats => {
    global.vAvail += bStats.vAvail;
    global.vTotal += bStats.vTotal;
    global.pol += bStats.pol;
    global.messTotal += (bStats.cook + bStats.waiter);
    global.strength += bStats.strength;
  });

  return { global, brigades };
}

export function updateDashboardCharts(aggregates) {
  const barCanvas = document.getElementById("aggregate-bar-chart");
  const pieCanvas = document.getElementById("breakdown-pie-chart");
  if (!barCanvas || !pieCanvas) return;

  const bdeLabels = Object.keys(aggregates.brigades);
  const vAvailData = bdeLabels.map(b => aggregates.brigades[b].vAvail);
  const strengthData = bdeLabels.map(b => aggregates.brigades[b].strength / 10);
  
  const datasetLabels = {
    vehicles: state.language === "en" ? "Available Vehicles" : "উপলব্ধ যানবাহন",
    personnel: state.language === "en" ? "Troops Present (x10)" : "উপস্থিত সেনা সদস্য (x১০)",
    bdeLabelsLoc: bdeLabels.map(b => {
      if (state.language === "bn") {
        return b.replace("HQ", "সদর").replace("Arty Bde", "আর্টিলারি ব্রিগেড").replace("Inf Bde", "পদাতিক ব্রিগেড").replace("Inf Div (Direct)", "পদাতিক ডিভিশন (সরাসরি)");
      }
      return b;
    })
  };

  const barCtx = barCanvas.getContext("2d");
  if (state.charts.bar) {
    state.charts.bar.data.labels = datasetLabels.bdeLabelsLoc;
    state.charts.bar.data.datasets[0].label = datasetLabels.vehicles;
    state.charts.bar.data.datasets[0].data = vAvailData;
    state.charts.bar.data.datasets[1].label = datasetLabels.personnel;
    state.charts.bar.data.datasets[1].data = strengthData;
    state.charts.bar.update();
  } else {
    state.charts.bar = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: datasetLabels.bdeLabelsLoc,
        datasets: [
          {
            label: datasetLabels.vehicles,
            data: vAvailData,
            backgroundColor: 'rgba(75, 85, 99, 0.75)', /* Slate Grey */
            borderColor: '#4b5563',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: datasetLabels.personnel,
            data: strengthData,
            backgroundColor: 'rgba(17, 24, 39, 0.75)', /* Charcoal Black */
            borderColor: '#111827',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Inter', weight: 600 } }
          }
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.03)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const polData = bdeLabels.map(b => aggregates.brigades[b].pol);
  const pieCtx = pieCanvas.getContext("2d");

  if (state.charts.pie) {
    state.charts.pie.data.labels = datasetLabels.bdeLabelsLoc;
    state.charts.pie.data.datasets[0].data = polData;
    state.charts.pie.update();
  } else {
    state.charts.pie = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: datasetLabels.bdeLabelsLoc,
        datasets: [{
          data: polData,
          backgroundColor: [
            'rgba(17, 24, 39, 0.8)', /* Charcoal */
            'rgba(55, 65, 81, 0.8)', /* Dark Grey */
            'rgba(75, 85, 99, 0.8)', /* Grey */
            'rgba(156, 163, 175, 0.8)', /* Light Grey */
            'rgba(209, 213, 219, 0.8)'  /* Silver Grey */
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '70%'
      }
    });
  }
}

export function renderHierarchyTree() {
  const treeTarget = document.getElementById("sidebar-hierarchy-tree");
  if (!treeTarget) return;
  treeTarget.innerHTML = "";

  Object.entries(BRIGADES).forEach(([bdeName, units]) => {
    const bdeLi = document.createElement("li");
    bdeLi.className = "tree-item";
    
    let label = bdeName;
    if (state.language === "bn") {
      label = bdeName.replace("HQ", "সদর").replace("Arty Bde", "আর্টিলারি ব্রিগেড").replace("Inf Bde", "পদাতিক ব্রিগেড").replace("Inf Div (Direct)", "পদাতিক ডিভিশন (সরাসরি)");
    }
    
    bdeLi.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--primary); font-size:12px; margin-top:8px;">
        <span>📁</span>
        <span>${label}</span>
      </div>
      <ul class="tree-list" style="margin-left: 12px; display: block;">
        ${units.map(u => `
          <li class="tree-item-leaf" style="padding: 2px 0; color: var(--text-muted); cursor: pointer;" onclick="selectUnitFromTree('${u}')">
            📄 ${getDisplayNameForUnit(u)}
          </li>
        `).join("")}
      </ul>
    `;
    treeTarget.appendChild(bdeLi);
  });
}

export function selectUnitFromTree(unitName) {
  switchSubContent("units");
  const bdeName = Object.keys(BRIGADES).find(b => BRIGADES[b].includes(unitName));
  const filterSelect = document.getElementById("units-brigade-filter");
  filterSelect.value = bdeName;
  
  renderUnitsManagementTable();
  selectUnitForEditing(unitName);
}

export function populateUnitsDropdown() {
  const select = document.getElementById("units-brigade-filter");
  if (!select) return;
  select.innerHTML = "";
  
  Object.keys(BRIGADES).forEach(bde => {
    const opt = document.createElement("option");
    opt.value = bde;
    opt.innerText = state.language === "en" ? bde : bde.replace("HQ", "সদর").replace("Arty Bde", "আর্টিলারি ব্রিগেড").replace("Inf Bde", "পদাতিক ব্রিগেড").replace("Inf Div (Direct)", "পদাতিক ডিভিশন (সরাসরি)");
    select.appendChild(opt);
  });
  
  if (state.currentUser.scopeBde && state.currentUser.scopeBde !== "ALL") {
    select.value = state.currentUser.scopeBde;
  }
}

export function renderUnitsManagementTable() {
  const filter = document.getElementById("units-brigade-filter");
  const tableBody = document.getElementById("units-table-body");
  if (!filter || !tableBody) return;
  const selectedBde = filter.value;
  tableBody.innerHTML = "";

  const units = BRIGADES[selectedBde] || [];
  
  units.forEach(unit => {
    const stats = state.logisticsDB[unit];
    if (!stats) return;

    const row = document.createElement("tr");
    const hasEditPermission = checkWriteAccess(unit);

    row.innerHTML = `
      <td><span class="cell-text-wrapper"><strong>${getDisplayNameForUnit(unit)}</strong></span></td>
      <td><span class="cell-text-wrapper">${formatDisplayNumber(stats.vAvail, 'qty')} / ${formatDisplayNumber(stats.vTotal, 'qty')}</span></td>
      <td><span class="cell-text-wrapper">${formatDisplayNumber(stats.pol, 'pol')} L</span></td>
      <td><span class="cell-text-wrapper">${formatDisplayNumber(stats.cook + stats.waiter, 'qty')}</span></td>
      <td><span class="cell-text-wrapper">${formatDisplayNumber(stats.strength, 'qty')}</span></td>
      <td>
        <span class="cell-text-wrapper">
          <button class="btn-toggle" style="padding: 4px 8px; font-size:11px;" onclick="selectUnitForEditing('${unit}')">
            ${hasEditPermission ? (state.language === "en" ? "Update" : "আপডেট") : (state.language === "en" ? "View" : "বিস্তারিত")}
          </button>
        </span>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

export function checkWriteAccess(unitName) {
  const role = state.currentUser.role;
  
  if (role === 5) return true;
  if (role === 3) {
    const userBde = state.currentUser.scopeBde;
    return unitName === userBde || (BRIGADES[userBde] && BRIGADES[userBde].includes(unitName));
  }
  if (role === 1) {
    return state.currentUser.scopeUnit === unitName;
  }
  return false;
}

export function selectUnitForEditing(unitName) {
  state.activeEditorUnit = unitName;
  
  const stats = state.logisticsDB[unitName];
  if (!stats) return;

  document.getElementById("editor-active-unit-label").innerText = `${state.language === "en" ? "Target Unit: " : "টার্গেট ইউনিট: "} ${getDisplayNameForUnit(unitName)}`;

  document.getElementById("form-vehicles-avail").value = stats.vAvail;
  document.getElementById("form-vehicles-total").value = stats.vTotal;
  document.getElementById("form-pol").value = stats.pol;
  document.getElementById("form-mess-cook").value = stats.cook;
  document.getElementById("form-mess-waiter").value = stats.waiter;
  document.getElementById("form-strength").value = stats.strength;

  const hasAccess = checkWriteAccess(unitName);
  const badge = document.getElementById("editor-permission-badge");
  const readonlyNotice = document.getElementById("editor-readonly-notice");
  const saveBtn = document.getElementById("btn-save-unit-data");
  
  const inputs = document.querySelectorAll("#unit-data-form input");

  if (hasAccess) {
    badge.innerText = state.language === "en" ? "EDIT ACCESS" : "এডিট অনুমতি";
    badge.className = "badge badge-success";
    readonlyNotice.style.display = "none";
    saveBtn.style.display = "block";
    inputs.forEach(inp => inp.removeAttribute("readonly"));
  } else {
    badge.innerText = state.language === "en" ? "READ ONLY" : "রিড ওনলি";
    badge.className = "badge badge-danger";
    readonlyNotice.style.display = "block";
    saveBtn.style.display = "none";
    inputs.forEach(inp => inp.setAttribute("readonly", "true"));
  }
}

export async function handleSaveUnitData() {
  const unit = state.activeEditorUnit;
  if (!unit) return;

  if (!checkWriteAccess(unit)) {
    showToast(
      state.language === "en" ? "Permission Denied" : "অনুমতি নেই", 
      TRANSLATIONS[state.language].read_only_alert, 
      "danger"
    );
    return;
  }

  const vAvail = parseInt(document.getElementById("form-vehicles-avail").value);
  const vTotal = parseInt(document.getElementById("form-vehicles-total").value);
  const pol = parseInt(document.getElementById("form-pol").value);
  const cook = parseInt(document.getElementById("form-mess-cook").value);
  const waiter = parseInt(document.getElementById("form-mess-waiter").value);
  const strength = parseInt(document.getElementById("form-strength").value);

  if (vAvail > vTotal) {
    showToast(
      state.language === "en" ? "Data Conflict" : "ভুল এন্ট্রি", 
      state.language === "en" ? "Available vehicles cannot exceed total authorized count." : "উপলব্ধ যানবাহন মোট যানবাহনের সংখ্যা অতিক্রম করতে পারে না।", 
      "warning"
    );
    return;
  }

  try {
    const res = await fetch("/api/logistics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unitName: unit,
        vAvail,
        vTotal,
        pol,
        cook,
        waiter,
        strength
      })
    });

    if (res.ok) {
      state.logisticsDB[unit] = { vAvail, vTotal, pol, cook, waiter, strength };

      showToast(
        state.language === "en" ? "Data Aggregated" : "ডাটা সংগৃহীত", 
        TRANSLATIONS[state.language].toast_data_saved, 
        "success"
      );

      renderUnitsManagementTable();
      renderDashboardContent();
    } else {
      showToast("Error", "Failed to update logistics data on server.", "danger");
    }
  } catch (error) {
    console.error("Save logistics error:", error);
    showToast("Error", "Could not connect to backend server.", "danger");
  }
}

export function renderDirectoryCards() {
  const gridContainer = document.getElementById("directory-grid-container");
  const searchInput = document.getElementById("directory-search-input");
  const unitFilterSelect = document.getElementById("directory-unit-filter");
  if (!gridContainer || !searchInput || !unitFilterSelect) return;
  gridContainer.innerHTML = "";

  const searchVal = searchInput.value.trim().toLowerCase();
  const unitFilter = unitFilterSelect.value;

  populateDirectoryUnitFilters();

  Object.values(state.usersDB).forEach(u => {
    const targetUnit = u.scopeUnit || u.scopeBde || "Division HQ";
    if (unitFilter !== "ALL" && unitFilter !== targetUnit) {
      return;
    }

    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchVal) ||
      u.rank.toLowerCase().includes(searchVal) ||
      u.baNo.toLowerCase().includes(searchVal);

    if (!matchesSearch) return;

    const card = document.createElement("div");
    card.className = "contact-card glass-panel glass-panel-hover animate-fade";
    card.innerHTML = `
      <img src="${u.avatar}" alt="Avatar" class="contact-avatar">
      <div class="contact-info">
        <span class="contact-rank">${t(u.rank)}</span>
        <h4>${translateFullName(u.fullName)}</h4>
        <span class="contact-ba">${u.baNo}</span>
        <div class="contact-unit">🏢 ${getDisplayNameForUnit(targetUnit)}</div>
        <div style="font-size:11px; margin-top:2px; font-weight:600; color:var(--primary);">📞 ${u.mobile}</div>
      </div>
      <button class="contact-call-btn" onclick="simulateCall('${translateFullName(u.fullName)}', '${u.mobile}')" title="Call Contact">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </button>
    `;
    gridContainer.appendChild(card);
  });
}

export function populateDirectoryUnitFilters() {
  const select = document.getElementById("directory-unit-filter");
  if (!select) return;
  const currentVal = select.value;
  
  select.innerHTML = `<option value="ALL">${TRANSLATIONS[state.language].opt_all_units}</option>`;

  const uniqueScopes = new Set();
  Object.values(state.usersDB).forEach(u => {
    const scope = u.scopeUnit || u.scopeBde || "Division HQ";
    uniqueScopes.add(scope);
  });

  uniqueScopes.forEach(sc => {
    const opt = document.createElement("option");
    opt.value = sc;
    opt.innerText = getDisplayNameForUnit(sc);
    select.appendChild(opt);
  });

  select.value = currentVal || "ALL";
}

export function simulateCall(name, number) {
  showToast(
    TRANSLATIONS[state.language].toast_incoming_call + name,
    `Simulating official SECURE dial: ${number}...`,
    "info"
  );
}

export function renderRoleImpersonatorList() {
  const list = document.getElementById("simulator-role-list-target");
  list.innerHTML = "";

  Object.values(state.usersDB).forEach(u => {
    const btn = document.createElement("button");
    btn.className = `sim-role-btn ${state.currentUser && state.currentUser.username === u.username ? "active" : ""}`;
    
    const scopeText = u.scopeUnit || u.scopeBde || "Division HQ";
    const labelRoleName = state.language === "en" ? u.roleName : u.roleName.replace("Unit Clerk", "ইউনিট করণিক").replace("Unit QM / OC", "ইউনিট কিউএম").replace("Brigade Clerk", "ব্রিগেড করণিক").replace("Brigade DAQMG", "ব্রিগেড ডিএকিউএমজি").replace("Division Q Clerk", "ডিভিশন কিউ করণিক").replace("Division AAQMG", "ডিভিশন এএকিউএমজি").replace("Division DAQMG", "ডিভিশন ডিএকিউএমজি");

    btn.innerHTML = `
      <div>
        <strong>${translateFullName(u.fullName)}</strong><br>
        <span style="font-size:10px; color: var(--text-muted)">${t("Scope:")} ${getDisplayNameForUnit(scopeText)}</span>
      </div>
      <span class="role-badge">Role-${u.role}</span>
    `;
    
    btn.onclick = () => impersonateRole(u.username);
    list.appendChild(btn);
  });
}

export async function updateLineChartData() {
  const year = state.dashboard.lineYear || "2025-26";
  const grade = state.dashboard.lineGrade || "Diesel";
  
  let scope = "division";
  let assigned = "";
  
  const role = state.currentUser ? state.currentUser.role : 6;
  const entityVal = state.dashboard.lineEntity || "ALL";

  if (role === 1 || role === 2) {
    scope = "unit";
    assigned = state.currentUser.unitName;
  } else if (role === 3 || role === 4) {
    const userBde = state.currentUser.assigned || state.currentUser.scopeBde;
    if (entityVal === "ALL") {
      scope = "brigade";
      assigned = userBde;
    } else if (entityVal === "HQ") {
      scope = "unit";
      assigned = userBde;
    } else if (entityVal.startsWith("unit:")) {
      scope = "unit";
      assigned = entityVal.substring(5);
    } else {
      scope = "brigade";
      assigned = userBde;
    }
  } else {
    if (entityVal === "ALL") {
      scope = "division";
      assigned = "";
    } else if (entityVal.startsWith("brigade:")) {
      scope = "brigade";
      assigned = entityVal.substring(8);
    } else if (entityVal.startsWith("unit:")) {
      scope = "unit";
      assigned = entityVal.substring(5);
    } else {
      scope = "division";
      assigned = "";
    }
  }
  
  try {
    const url = `/api/pol/summary?year=${encodeURIComponent(year)}&grade=${encodeURIComponent(grade)}&scope=${scope}&assigned=${encodeURIComponent(assigned)}`;
    const res = await fetch(url);
    const data = await res.json();
    state.dashboard.lineChartData = data;
    
    updateMetricDisplayValues();
    initLineChart();
    await fetchPolStateData();
  } catch (err) {
    console.error("Failed to load line chart data:", err);
  }
}

export function updateMetricDisplayValues() {
  const data = (state.dashboard && state.dashboard.lineChartData) || { alt: 0, total: 0, altData: [], data: [] };
  
  const altValEl = document.getElementById("total-alt-value");
  const avgAltValEl = document.getElementById("avg-alt-value");
  const expValEl = document.getElementById("total-exp-value");
  const avgExpValEl = document.getElementById("avg-exp-value");
  
  const numMonths = (data.altData && data.altData.length > 0) ? data.altData.length : 12;
  
  const totalAlt = data.alt || 0;
  const avgAlt = numMonths > 0 ? (totalAlt / numMonths) : 0;
  
  const totalExp = data.total || 0;
  const avgExp = numMonths > 0 ? (totalExp / numMonths) : 0;
  
  if (altValEl) altValEl.innerText = formatDisplayNumber(totalAlt);
  if (avgAltValEl) avgAltValEl.innerText = formatDisplayNumber(avgAlt);
  if (expValEl) expValEl.innerText = formatDisplayNumber(totalExp);
  if (avgExpValEl) avgExpValEl.innerText = formatDisplayNumber(avgExp);
}

window.addEventListener("languagechange", () => {
  updateMetricDisplayValues();
  if (state.activeTabKey === "POL") {
    const mainContent = document.getElementById("portal-main-content");
    renderPolManagementView(mainContent);
  }
});

export async function fetchPolStateData() {
  const tableBody = document.getElementById("pol-state-table-body");
  if (!tableBody) return;
  
  const role = state.currentUser ? state.currentUser.role : 6;
  const assigned = state.currentUser ? state.currentUser.assigned : "";
  const bde = state.currentUser ? state.currentUser.scopeBde : "";
  const isBn = state.language === "bn";
  const t = (key) => TRANSLATIONS[state.language][key] || key;
  
  try {
    const url = `/api/pol/state?role=${role}&assigned=${encodeURIComponent(assigned)}&bde=${encodeURIComponent(bde)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    tableBody.innerHTML = "";
    data.forEach(row => {
      const tr = document.createElement("tr");
      const gradeKey = "row_" + row.grade.toLowerCase().replace("-", "").replace(" ", "");
      tr.innerHTML = `
        <td><span class="cell-text-wrapper">${t(gradeKey)}</span></td>
        <td><span class="cell-text-wrapper">${formatDisplayNumber(row.col1)}</span></td>
        <td><span class="cell-text-wrapper">${formatDisplayNumber(row.col2)}</span></td>
        <td><span class="cell-text-wrapper">${formatDisplayNumber(row.bal)}</span></td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load POL state table data:", err);
  }
}


export function renderPolManagementView(container) {
  const role = state.currentUser ? state.currentUser.role : 6;
  const isBn = state.language === "bn";
  const t = (key) => TRANSLATIONS[state.language][key] || key;
  const initialLineVal = state.dashboard.lineChartData || { alt: 0, total: 0, altData: [], data: [] };
  
  let buttonsHtml = "";
  if ([5, 6].includes(Number(role))) {
    buttonsHtml = `
      <button class="pol-action-btn btn-dmd" onclick="openPolModal('DMD')"><span style="margin-right: 4px;">📋</span>${t("btn_dmd")}</button>
      <button class="pol-action-btn btn-alt" onclick="openPolModal('ALT')"><span style="margin-right: 4px;">💸</span>${t("btn_alt")}</button>
    `;
  } else if ([3, 4].includes(Number(role))) {
    buttonsHtml = `
      <button class="pol-action-btn btn-dmd" onclick="openPolModal('DMD')"><span style="margin-right: 4px;">📋</span>${t("btn_dmd")}</button>
      <button class="pol-action-btn btn-alt" onclick="openPolModal('ALT')"><span style="margin-right: 4px;">💸</span>${t("btn_alt")}</button>
      <button class="pol-action-btn btn-exp" onclick="openPolModal('EXP')"><span style="margin-right: 4px;">📉</span>${t("btn_exp")}</button>
    `;
  } else {
    buttonsHtml = `
      <button class="pol-action-btn btn-dmd" onclick="openPolModal('DMD')"><span style="margin-right: 4px;">📋</span>${t("btn_dmd")}</button>
      <button class="pol-action-btn btn-exp" onclick="openPolModal('EXP')"><span style="margin-right: 4px;">📉</span>${t("btn_exp")}</button>
    `;
  }
  
  const isDivision = [5, 6].includes(Number(role));
  const col1Header = isDivision ? t("th_alt_from_area") : t("Total Alt");
  const col2Header = isDivision ? t("th_alt_to_bde") : t("Total Exp");
  
  container.innerHTML = `
    <div id="main-dashboard-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 class="dashboard-title" style="margin-bottom: 0;">${t("title_pol_management")}</h2>
        <div style="display: flex; gap: 8px;">
          ${buttonsHtml}
        </div>
      </div>
      
      <div class="dashboard-row-2">
        <!-- Left: State of POL Card -->
        <div class="dashboard-card" style="margin-bottom: 0;">
          <div class="card-header-row">
            <h4 class="card-header-title">${t("card_title_pol_state")}</h4>
          </div>
          <div class="dashboard-table-container">
            <table class="dashboard-table pol-state-table">
              <thead>
                <tr>
                  <th><span class="cell-text-wrapper">${t("th_pol_grade")}</span></th>
                  <th><span class="cell-text-wrapper">${col1Header}</span></th>
                  <th><span class="cell-text-wrapper">${col2Header}</span></th>
                  <th><span class="cell-text-wrapper">${t("th_bal")}</span></th>
                </tr>
              </thead>
              <tbody id="pol-state-table-body">
                <tr>
                  <td colspan="4" style="text-align: center; color: var(--text-muted);">Loading...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Right: POL Line Chart -->
        <div class="dashboard-card" style="margin-bottom: 0; justify-content: stretch;">
          <div style="display: flex; width: 100%; gap: 20px; flex: 1; align-items: stretch;">
            <!-- Left Column: Dropdowns & Stats -->
            <div style="flex: 0 0 180px; display: flex; flex-direction: column; gap: 8px; justify-content: flex-start;">
              <!-- Dropdown Row 1: Year and Grade -->
              <div style="display: flex; gap: 8px; margin-bottom: 2px;">
                <select id="line-year-select" class="mini-dropdown">
                  <option value="2024-25" ${state.dashboard.lineYear === "2024-25" ? "selected" : ""}>${t("2024-25")}</option>
                  <option value="2025-26" ${state.dashboard.lineYear === "2025-26" ? "selected" : ""}>${t("2025-26")}</option>
                  <option value="2026-27" ${state.dashboard.lineYear === "2026-27" ? "selected" : ""}>${t("2026-27")}</option>
                </select>
                <select id="line-grade-select" class="mini-dropdown">
                  <option value="Diesel" ${state.dashboard.lineGrade === "Diesel" ? "selected" : ""}>${t("Diesel")}</option>
                  <option value="MS-74" ${state.dashboard.lineGrade === "MS-74" ? "selected" : ""}>${t("MS-74")}</option>
                  <option value="100 Octane" ${state.dashboard.lineGrade === "100 Octane" ? "selected" : ""}>${t("100 Octane")}</option>
                </select>
              </div>
              <!-- Dropdown Row 2: Brigade/Unit (Entity) -->
              ${[3, 4, 5, 6].includes(Number(role)) ? `
              <div style="margin-bottom: 4px; display: flex; justify-content: flex-start;">
                <select id="line-entity-select" class="mini-dropdown" style="width: 100%; max-width: 180px;">
                  ${populateEntitySelectOptions(role)}
                </select>
              </div>
              ` : ''}
              <!-- Metric Card: Allocation -->
              <div class="metric-card-box allocation-card">
                <span style="font-size: 11px; font-weight: 700; color: #4b7fcc; display: block; text-transform: uppercase; letter-spacing: 0.5px;" data-translate="lbl_alloc_heading">${t("lbl_alloc_heading")}</span>
                <div style="display: flex; align-items: center; margin-top: 3px; font-size: 12px; font-weight: 600; color: #4b7fcc;">
                  <span style="display: inline-block; width: 45px;" data-translate="lbl_total_label">${t("lbl_total_label")}</span>
                  <span style="margin-right: 4px;">:</span>
                  <span id="total-alt-value" class="metric-value">${formatDisplayNumber(initialLineVal.alt)}</span>
                </div>
                <div style="display: flex; align-items: center; margin-top: 1px; font-size: 11px; font-weight: 500; color: #4b7fcc;">
                  <span style="display: inline-block; width: 45px;" data-translate="lbl_avg_label">${t("lbl_avg_label")}</span>
                  <span style="margin-right: 4px;">:</span>
                  <span id="avg-alt-value" class="metric-value">${formatDisplayNumber((initialLineVal.alt || 0) / ((initialLineVal.altData && initialLineVal.altData.length > 0) ? initialLineVal.altData.length : 12))}</span>
                </div>
              </div>
              <!-- Metric Card: Expenditure -->
              <div class="metric-card-box expenditure-card">
                <span style="font-size: 11px; font-weight: 700; color: #f87171; display: block; text-transform: uppercase; letter-spacing: 0.5px;" data-translate="lbl_exp_heading">${t("lbl_exp_heading")}</span>
                <div style="display: flex; align-items: center; margin-top: 3px; font-size: 12px; font-weight: 600; color: #f87171;">
                  <span style="display: inline-block; width: 45px;" data-translate="lbl_total_label">${t("lbl_total_label")}</span>
                  <span style="margin-right: 4px;">:</span>
                  <span id="total-exp-value" class="metric-value">${formatDisplayNumber(initialLineVal.total)}</span>
                </div>
                <div style="display: flex; align-items: center; margin-top: 1px; font-size: 11px; font-weight: 500; color: #f87171;">
                  <span style="display: inline-block; width: 45px;" data-translate="lbl_avg_label">${t("lbl_avg_label")}</span>
                  <span style="margin-right: 4px;">:</span>
                  <span id="avg-exp-value" class="metric-value">${formatDisplayNumber((initialLineVal.total || 0) / ((initialLineVal.altData && initialLineVal.altData.length > 0) ? initialLineVal.altData.length : 12))}</span>
                </div>
              </div>
            </div>
            <!-- Right Column: Graph -->
            <div style="flex: 1; height: 230px; position: relative;">
              <canvas id="total-exp-line-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  bindLineChartEvents(role);
  updateLineChartData();
  fetchPolStateData();
}

export function switchDmdView(viewName) {
  state.dashboard.dmdActiveView = viewName;
  const fieldsContainer = document.getElementById("pol-modal-form-fields");
  if (fieldsContainer) {
    renderDmdModalContent(fieldsContainer);
  }
}
window.switchDmdView = switchDmdView;

export function handleRefLetterFileChange() {
  const fileInput = document.getElementById("pol-modal-file");
  const labelEl = document.getElementById("pol-file-selected-name");
  if (fileInput && fileInput.files && fileInput.files[0] && labelEl) {
    labelEl.innerText = fileInput.files[0].name;
  }
}
window.handleRefLetterFileChange = handleRefLetterFileChange;

export async function updateLiveMetrics() {
  const gradeSelect = document.getElementById("pol-modal-grade");
  if (!gradeSelect) return;
  
  const grade = gradeSelect.value;
  const isBn = state.language === "bn";
  const t = (key) => TRANSLATIONS[state.language][key] || key;
  
  const avgExpSpan = document.getElementById("pol-dmd-avg-exp");
  const balSpan = document.getElementById("pol-dmd-bal");
  const daysLastSpan = document.getElementById("pol-dmd-days-last");
  
  if (avgExpSpan) avgExpSpan.innerText = isBn ? "লোড হচ্ছে..." : "Loading...";
  if (balSpan) balSpan.innerText = isBn ? "লোড হচ্ছে..." : "Loading...";
  if (daysLastSpan) daysLastSpan.innerText = isBn ? "লোড হচ্ছে..." : "Loading...";
  
  try {
    const unitName = state.currentUser.assigned || "HQ 55 Inf Div";
    const res = await fetch(`/api/pol/unit_metrics?unitName=${encodeURIComponent(unitName)}&polGrade=${grade}&fiscalYear=2025-26`);
    const data = await res.json();
    
    if (avgExpSpan) avgExpSpan.innerText = formatDisplayNumber(data.avgExp);
    if (balSpan) balSpan.innerText = formatDisplayNumber(data.bal);
    if (daysLastSpan) {
      const daysVal = isBn ? convertDigitsToBengali(data.daysLast) : data.daysLast;
      daysLastSpan.innerText = `${daysVal} ${isBn ? 'দিন' : 'Day'}`;
    }
  } catch (err) {
    console.error("Failed to load live unit metrics:", err);
    if (avgExpSpan) avgExpSpan.innerText = "-";
    if (balSpan) balSpan.innerText = "-";
    if (daysLastSpan) daysLastSpan.innerText = "-";
  }
}
window.updateLiveMetrics = updateLiveMetrics;

export async function submitDemandFromForm() {
  const gradeSelect = document.getElementById("pol-modal-grade");
  const amountInput = document.getElementById("pol-modal-amount");
  const fileInput = document.getElementById("pol-modal-file");
  
  if (!gradeSelect || !amountInput) return;
  
  const grade = gradeSelect.value;
  const amount = parseFloat(amountInput.value);
  const isBn = state.language === "bn";
  
  if (isNaN(amount) || amount <= 0) {
    alert(isBn ? "অনুগ্রহ করে একটি বৈধ চাহিদার পরিমাণ দিন।" : "Please enter a valid demand quantity.");
    return;
  }
  
  let refLetter = "";
  if (fileInput && fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.png', '.jpg', '.jpeg'].includes(ext)) {
      alert(isBn ? "অসমর্থিত ফাইল ফরম্যাট! শুধুমাত্র PDF, PNG, JPEG সমর্থন করে।" : "Unsupported file format! Only PDF, PNG, JPEG allowed.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const uploadRes = await fetch("/api/pol/upload_ref", {
        method: "POST",
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        alert((isBn ? "ফাইল আপলোড ব্যর্থ হয়েছে: " : "File upload failed: ") + (uploadData.error || "Unknown error"));
        return;
      }
      refLetter = uploadData.filename;
    } catch (err) {
      console.error("Error uploading file:", err);
      alert(isBn ? "সার্ভারে ফাইল আপলোড করতে সমস্যা হয়েছে।" : "Connection error while uploading file.");
      return;
    }
  }
  
  const now = new Date();
  const dateNum = now.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthIndex = now.getMonth();
  if (dateNum >= 27) {
    monthIndex = (monthIndex + 1) % 12;
  }
  const currentMonth = months[monthIndex];
  
  let year = now.getFullYear();
  let fyMonthIndex = now.getMonth();
  if (dateNum >= 27) {
    fyMonthIndex = (fyMonthIndex + 1) % 12;
    if (fyMonthIndex === 0) {
      year += 1;
    }
  }
  let currentFY = "2025-26";
  if (fyMonthIndex >= 6) {
    currentFY = `${year}-${(year + 1) % 100}`;
  } else {
    currentFY = `${year - 1}-${year % 100}`;
  }
  
  try {
    const res = await fetch("/api/pol/demand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unitName: state.currentUser.assigned || "HQ 55 Inf Div",
        month: currentMonth,
        fiscalYear: currentFY,
        polGrade: grade,
        amount: amount,
        refLetter: refLetter
      })
    });
    const data = await res.json();
    if (data.success) {
      amountInput.value = "";
      if (fileInput) fileInput.value = "";
      const labelEl = document.getElementById("pol-file-selected-name");
      if (labelEl) labelEl.innerText = "";
      
      updateLiveMetrics();
      fetchPolDemandsLog();
      alert(isBn ? "জ্বালানি চাহিদা সফলভাবে পাঠানো হয়েছে।" : "Fuel demand submitted successfully.");
    }
  } catch (err) {
    console.error("Failed to submit fuel demand:", err);
    alert(isBn ? "জ্বালানি চাহিদা পাঠাতে ব্যর্থ হয়েছে।" : "Failed to submit fuel demand.");
  }
}
window.submitDemandFromForm = submitDemandFromForm;

export async function allocateFromDemandRow(demandId) {
  const isBn = state.language === "bn";
  const inputEl = document.querySelector(`.alt-qty-input[data-demand-id="${demandId}"]`);
  if (!inputEl) return;
  
  const amount = parseFloat(inputEl.value);
  if (isNaN(amount) || amount <= 0) {
    alert(isBn ? "অনুগ্রহ করে একটি বৈধ বরাদ্দের পরিমাণ দিন।" : "Please enter a valid allocation amount.");
    return;
  }
  
  const confirmMsg = isBn 
    ? `আপনি কি নিশ্চিত যে এই চাহিদার বিপরীতে ${convertDigitsToBengali(amount)} লিটার বরাদ্দ দিতে চান?` 
    : `Are you sure you want to allocate ${amount} Liters for this demand?`;
    
  if (!confirm(confirmMsg)) return;
  
  try {
    const res = await fetch("/api/pol/allocate_demand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        demandId: demandId,
        amount: amount,
        fromEntity: state.currentUser.assigned || "HQ 55 Inf Div"
      })
    });
    const data = await res.json();
    if (data.success) {
      inputEl.value = "";
      fetchPolDemandsLog();
      
      if (window.fetchPolStateData) {
        window.fetchPolStateData();
      } else if (typeof fetchPolStateData === 'function') {
        fetchPolStateData();
      }
      
      if (window.updateLineChartData) {
        window.updateLineChartData();
      }
      
      alert(isBn ? "বরাদ্দ সফলভাবে সম্পন্ন হয়েছে।" : "Allocation recorded successfully.");
    } else {
      alert((isBn ? "বরাদ্দ ব্যর্থ হয়েছে: " : "Allocation failed: ") + (data.error || ""));
    }
  } catch (err) {
    console.error("Failed to record allocation from demand row:", err);
    alert(isBn ? "বরাদ্দ রেকর্ড করতে ত্রুটি ঘটেছে।" : "Error recording allocation.");
  }
}
window.allocateFromDemandRow = allocateFromDemandRow;

export function renderDmdModalContent(fieldsContainer) {
  const role = state.currentUser ? state.currentUser.role : 1;
  const isBn = state.language === "bn";
  const t = (key) => TRANSLATIONS[state.language][key] || key;
  
  if (!state.dashboard.dmdActiveView) {
    if ([3, 4].includes(Number(role))) {
      state.dashboard.dmdActiveView = 'unit_demands';
    } else if ([5, 6].includes(Number(role))) {
      state.dashboard.dmdActiveView = 'unit_demands';
    } else {
      state.dashboard.dmdActiveView = 'bde_hq_demands';
    }
  }
  
  const currentView = state.dashboard.dmdActiveView;
  
  let headerHtml = "";
  if ([3, 4].includes(Number(role))) {
    const isUnitActive = currentView === 'unit_demands';
    const isBdeActive = currentView === 'bde_hq_demands';
    headerHtml = `
      <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid var(--accent-border); padding-bottom: 12px; justify-content: flex-start;">
        <button class="pol-action-btn ${isUnitActive ? 'btn-dmd' : ''}" style="padding: 6px 12px; font-size:12px; height:auto; width:auto; background: ${isUnitActive ? 'var(--primary)' : 'rgba(0,0,0,0.05)'}; color: ${isUnitActive ? 'white' : 'var(--text-muted)'};" onclick="switchDmdView('unit_demands')">
          ${t("btn_unit_demands")}
        </button>
        <button class="pol-action-btn ${isBdeActive ? 'btn-dmd' : ''}" style="padding: 6px 12px; font-size:12px; height:auto; width:auto; background: ${isBdeActive ? 'var(--primary)' : 'rgba(0,0,0,0.05)'}; color: ${isBdeActive ? 'white' : 'var(--text-muted)'};" onclick="switchDmdView('bde_hq_demands')">
          ${t("btn_dmd_bde_hq")}
        </button>
      </div>
    `;
  }
  
  let contentHtml = "";
  
  if (currentView === 'unit_demands') {
    contentHtml = `
      ${headerHtml}
      <div class="dashboard-card" style="margin-bottom: 0; padding: 0; border: none; background: transparent; box-shadow: none;">
        <h5 style="margin-top: 0; margin-bottom: 10px; color: var(--primary); font-weight: 600;">${t("pol_log_title")}</h5>
        <div class="dashboard-table-container" style="max-height: 350px; overflow-y: auto; border: 1px solid var(--accent-border); border-radius: 8px;">
          <table class="dashboard-table" style="width: 100%; font-size:11px;">
            <thead>
              <tr style="height:36px;">
                <th style="padding: 0 4px; text-align:center; width: 5%;"><span class="cell-text-wrapper">${t("th_ser")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 16%;"><span class="cell-text-wrapper">${t("th_ser") === 'Ser' ? 'Bde/Unit' : 'ব্রিগেড/ইউনিট'}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 10%;"><span class="cell-text-wrapper">${t("lbl_pol_grade")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 12%;"><span class="cell-text-wrapper">${t("th_avg_exp_monthly")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 10%;"><span class="cell-text-wrapper">${t("th_bal")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 13%;"><span class="cell-text-wrapper">${t("th_days_last")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 10%;"><span class="cell-text-wrapper">${t("th_dmd_qty")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 10%;"><span class="cell-text-wrapper">${t("th_view_ref_ltr")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 11%;"><span class="cell-text-wrapper">${t("th_bal_aq_br")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 18%;"><span class="cell-text-wrapper">${t("th_alt_qty")}</span></th>
              </tr>
            </thead>
            <tbody id="pol-demands-log-body">
              <tr>
                <td colspan="10" style="text-align: center; color: var(--text-muted);">Loading...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    const gradeOptions = `
      <option value="Diesel">Diesel / ডিজেল</option>
      <option value="MS-74">MS-74 / এমএস-৭৪</option>
      <option value="100 Octane">100 Octane / ১০০ অকটেন</option>
    `;
    
    contentHtml = `
      ${headerHtml}
      
      <div style="border: 1px solid var(--accent-border); padding: 12px; border-radius: 8px; background: rgba(255,255,255,0.4); margin-bottom: 20px;">
        <h5 style="margin-top: 0; margin-bottom: 8px; color: var(--primary); font-weight: 600;">${isBn ? "নতুন চাহিদা তৈরি করুন" : "Create New Demand"}</h5>
        
        <div class="dashboard-table-container" style="overflow-x: auto; border: 1px solid rgba(0,0,0,0.05); margin-bottom: 12px;">
          <table class="dashboard-table" style="width: 100%; min-width: 600px; font-size:11px; margin-bottom:0;">
            <thead>
              <tr style="height:30px;">
                <th style="text-align:center; padding: 4px; width: 18%;">${t("lbl_pol_grade")}</th>
                <th style="text-align:center; padding: 4px; width: 18%;">${t("th_avg_exp_monthly")}</th>
                <th style="text-align:center; padding: 4px; width: 15%;">${t("th_bal")}</th>
                <th style="text-align:center; padding: 4px; width: 18%;">${t("th_days_last")}</th>
                <th style="text-align:center; padding: 4px; width: 15%;">${t("th_dmd_qty")}</th>
                <th style="text-align:center; padding: 4px; width: 16%;">${t("th_att_ref_ltr")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 4px; text-align: center;">
                  <select id="pol-modal-grade" class="mini-dropdown" style="width: 100%;" onchange="updateLiveMetrics()">
                    ${gradeOptions}
                  </select>
                </td>
                <td style="padding: 4px; text-align: center;">
                  <span id="pol-dmd-avg-exp" style="font-weight:600;">Loading...</span>
                </td>
                <td style="padding: 4px; text-align: center;">
                  <span id="pol-dmd-bal" style="font-weight:600;">Loading...</span>
                </td>
                <td style="padding: 4px; text-align: center;">
                  <span id="pol-dmd-days-last" style="font-weight:600;">Loading...</span>
                </td>
                <td style="padding: 4px; text-align: center;">
                  <input type="number" id="pol-modal-amount" class="form-input" style="width: 100%; height:26px; font-size:11px; margin:0; padding:2px 6px;" placeholder="Liters" required min="1">
                </td>
                <td style="padding: 4px; text-align: center;">
                  <input type="file" id="pol-modal-file" style="display: none;" accept=".pdf,.png,.jpg,.jpeg" onchange="handleRefLetterFileChange()" />
                  <button class="btn-toggle" style="padding: 4px 8px; font-size:10px; width:100%;" onclick="document.getElementById('pol-modal-file').click()">
                    <span style="margin-right: 4px;">📎</span>${t("th_att_ref_ltr") === 'Att Ref Ltr' ? 'Attach' : 'সংযুক্ত'}
                  </button>
                  <div id="pol-file-selected-name" style="font-size:9px; color:var(--success); margin-top:2px; word-break:break-all;"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="display:flex; justify-content:flex-end;">
          <button class="pol-action-btn btn-dmd" style="height:32px; width:auto; padding: 0 16px; font-size:11px; display:flex; align-items:center; justify-content:center;" onclick="submitDemandFromForm()">
            ${isBn ? "জ্বালানি চাহিদা পাঠান" : "Submit Demand"}
          </button>
        </div>
      </div>
      
      <div class="dashboard-card" style="margin-bottom: 0; padding: 0; border: none; background: transparent; box-shadow: none;">
        <h5 style="margin-top: 0; margin-bottom: 10px; color: var(--primary); font-weight: 600;">${t("pol_log_title")}</h5>
        <div class="dashboard-table-container" style="max-height: 250px; overflow-y: auto; border: 1px solid var(--accent-border); border-radius: 8px;">
          <table class="dashboard-table" style="width: 100%; font-size:11px;">
            <thead>
              <tr style="height:36px;">
                <th style="padding: 0 6px; text-align:center; width: 18%;"><span class="cell-text-wrapper">${t("lbl_pol_grade")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 18%;"><span class="cell-text-wrapper">${t("th_avg_exp_monthly")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 14%;"><span class="cell-text-wrapper">${t("th_bal")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 18%;"><span class="cell-text-wrapper">${t("th_days_last")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 14%;"><span class="cell-text-wrapper">${t("th_dmd_qty")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 12%;"><span class="cell-text-wrapper">${t("th_view_ref_ltr")}</span></th>
                <th style="padding: 0 6px; text-align:center; width: 10%;"><span class="cell-text-wrapper">${t("lbl_status")}</span></th>
              </tr>
            </thead>
            <tbody id="pol-demands-log-body">
              <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted);">Loading...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  fieldsContainer.innerHTML = contentHtml;
  fetchPolDemandsLog();
  
  if (currentView !== 'unit_demands') {
    updateLiveMetrics();
  }
}
window.renderDmdModalContent = renderDmdModalContent;

export async function fetchPolDemandsLog() {
  const logBody = document.getElementById("pol-demands-log-body");
  if (!logBody) return;
  
  const role = state.currentUser ? state.currentUser.role : 6;
  const assigned = state.currentUser ? state.currentUser.assigned : "";
  const isBn = state.language === "bn";
  const t = (key) => TRANSLATIONS[state.language][key] || key;
  
  try {
    const url = `/api/pol/demands?role=${role}&assigned=${encodeURIComponent(assigned)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    logBody.innerHTML = "";
    
    const currentView = state.dashboard.dmdActiveView;
    let filteredData = [];
    
    if (currentView === 'unit_demands') {
      filteredData = data.filter(r => r.unitName !== assigned);
      filteredData.sort((a, b) => a.daysLast - b.daysLast);
    } else {
      filteredData = data.filter(r => r.unitName === assigned);
    }
    
    if (filteredData.length === 0) {
      const colspan = currentView === 'unit_demands' ? 10 : 7;
      logBody.innerHTML = `
        <tr>
          <td colspan="${colspan}" style="text-align: center; color: var(--text-muted);">${isBn ? "কোনো চাহিদা পাওয়া যায়নি।" : "No demands found."}</td>
        </tr>
      `;
      return;
    }
    
    filteredData.forEach((r, idx) => {
      const tr = document.createElement("tr");
      const serNo = isBn ? convertDigitsToBengali(idx + 1) + "." : (idx + 1) + ".";
      const gradeLabel = r.polGrade === "Diesel" ? (isBn ? "ডিজেল" : "Diesel") : (r.polGrade === "MS-74" ? (isBn ? "এমএস-৭৪" : "MS-74") : (isBn ? "১০০ অকটেন" : "100 Octane"));
      
      const avgExpVal = formatDisplayNumber(r.avgExp);
      const balVal = formatDisplayNumber(r.bal);
      
      const daysVal = isBn ? convertDigitsToBengali(r.daysLast) : r.daysLast;
      const daysLabel = `${daysVal} ${isBn ? 'দিন' : 'Day'}`;
      
      const amountVal = formatDisplayNumber(r.amount);
      const aqBalVal = formatDisplayNumber(r.aqBal);
      
      let refLtrHtml = "-";
      if (r.refLetter) {
        refLtrHtml = `<a href="/uploads/${r.refLetter}" target="_blank" style="color: #4b7fcc; font-weight:700; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">📄 <span style="text-decoration: underline;">${isBn ? 'চিঠি' : 'Letter'}</span></a>`;
      }
      
      if (currentView === 'unit_demands') {
        let altActionHtml = "";
        if (r.status === 'Pending') {
          altActionHtml = `
            <div style="display: flex; gap: 6px; align-items: center; justify-content: center; width: 100%;">
              <input type="number" class="form-input alt-qty-input" data-demand-id="${r.id}" style="width: 80px; height: 26px; padding: 2px 6px; font-size: 11px; margin: 0;" placeholder="${isBn ? 'পরিমাণ' : 'Amount'}" min="1" />
              <button class="btn-toggle" style="padding: 4px 8px; font-size: 10px; background: var(--success); color: white;" onclick="allocateFromDemandRow(${r.id})">
                ${isBn ? 'বরাদ্দ' : 'Alt'}
              </button>
            </div>
          `;
        } else {
          altActionHtml = `<span style="font-weight:700; color:#10b981;">${isBn ? 'অনুমোদিত' : 'Approved'}</span>`;
        }
        
        tr.innerHTML = `
          <td style="padding: 6px 4px; text-align: center;"><span class="cell-text-wrapper">${serNo}</span></td>
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper">${getDisplayNameForUnit(r.unitName)}</span></td>
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper">${gradeLabel}</span></td>
          <td style="padding: 6px; text-align: right;"><span class="cell-text-wrapper">${avgExpVal}</span></td>
          <td style="padding: 6px; text-align: right;"><span class="cell-text-wrapper">${balVal}</span></td>
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper" style="font-weight:600; color: ${r.daysLast <= 7 ? '#ef4444' : 'inherit'};">${daysLabel}</span></td>
          <td style="padding: 6px; text-align: right;"><span class="cell-text-wrapper" style="font-weight:600;">${amountVal}</span></td>
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper">${refLtrHtml}</span></td>
          <td style="padding: 6px; text-align: right;"><span class="cell-text-wrapper">${aqBalVal}</span></td>
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper" style="width: 100%;">${altActionHtml}</span></td>
        `;
      } else {
        const statusLabel = r.status === 'Pending' ? (isBn ? "পেন্ডিং" : "Pending") : (isBn ? "অনুমোদিত" : "Approved");
        
        tr.innerHTML = `
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper">${gradeLabel}</span></td>
          <td style="padding: 6px; text-align: right;"><span class="cell-text-wrapper">${avgExpVal}</span></td>
          <td style="padding: 6px; text-align: right;"><span class="cell-text-wrapper">${balVal}</span></td>
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper" style="font-weight:600;">${daysLabel}</span></td>
          <td style="padding: 6px; text-align: right;"><span class="cell-text-wrapper" style="font-weight:600;">${amountVal}</span></td>
          <td style="padding: 6px; text-align: center;"><span class="cell-text-wrapper">${refLtrHtml}</span></td>
          <td style="padding: 6px; text-align: center;">
            <span class="cell-text-wrapper" style="font-weight:700; color:${r.status === 'Pending' ? '#eab308' : '#10b981'};">${statusLabel}</span>
          </td>
        `;
      }
      
      logBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load POL demands log data:", err);
  }
}
window.fetchPolDemandsLog = fetchPolDemandsLog;

export function openPolModal(action) {
  const modal = document.getElementById("pol-management-modal");
  const titleEl = document.getElementById("pol-modal-title");
  const descEl = document.getElementById("pol-modal-desc");
  const fieldsContainer = document.getElementById("pol-modal-form-fields");
  
  if (!modal || !titleEl || !descEl || !fieldsContainer) return;
  
  const role = state.currentUser ? state.currentUser.role : 1;
  const isBn = state.language === "bn";
  const t = (key) => TRANSLATIONS[state.language][key] || key;
  
  modal.dataset.action = action;
  fieldsContainer.innerHTML = "";
  
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthNames = {
    'Jul': 'July / জুলাই', 'Aug': 'August / আগস্ট', 'Sep': 'September / সেপ্টেম্বর', 'Oct': 'October / অক্টোবর', 'Nov': 'November / নভেম্বর', 'Dec': 'December / ডিসেম্বর',
    'Jan': 'January / জানুয়ারি', 'Feb': 'February / ফেব্রুয়ারি', 'Mar': 'March / মার্চ', 'Apr': 'April / এপ্রিল', 'May': 'May / মে', 'Jun': 'June / জুন'
  };
  const monthsOptions = months.map(m => `<option value="${m}">${monthNames[m]}</option>`).join('');
  
  const gradeOptions = `
    <option value="Diesel">Diesel / ডিজেল</option>
    <option value="MS-74">MS-74 / এমএস-৭৪</option>
    <option value="100 Octane">100 Octane / ১০০ অকটেন</option>
  `;

  const modalCard = modal.querySelector(".modal-card");
  if (modalCard) {
    if (action === "DMD") {
      modalCard.style.maxWidth = "950px";
    } else {
      modalCard.style.maxWidth = "500px";
    }
  }

  const submitBtn = document.getElementById("pol-modal-submit-btn");
  if (submitBtn) {
    if (action === "DMD") {
      submitBtn.style.display = "none";
    } else {
      submitBtn.style.display = "block";
    }
  }

  const cancelBtn = document.getElementById("pol-modal-cancel-btn");
  if (cancelBtn) {
    cancelBtn.innerText = action === "DMD" ? (isBn ? "বন্ধ করুন" : "Close") : (isBn ? "বাতিল" : "Cancel");
  }
  
  if (action === "DMD") {
    titleEl.innerText = isBn ? "জ্বালানি চাহিদা ও লগ" : "Fuel Demands & Log";
    descEl.innerText = isBn ? "জ্বালানি চাহিদার তালিকা এবং নতুন চাহিদা সাবমিট প্যানেল" : "View fuel demands and submit new demand request.";
    
    if ([3, 4].includes(Number(role))) {
      state.dashboard.dmdActiveView = 'unit_demands';
    } else if ([5, 6].includes(Number(role))) {
      state.dashboard.dmdActiveView = 'unit_demands';
    } else {
      state.dashboard.dmdActiveView = 'bde_hq_demands';
    }
    
    renderDmdModalContent(fieldsContainer);
  } 
  else if (action === "ALT") {
    titleEl.innerText = t("label_allocate");
    descEl.innerText = isBn ? "জ্বালানি বরাদ্দ এন্ট্রি করুন" : "Record a fuel allocation entry.";
    
    if ([5, 6].includes(Number(role))) {
      const directUnits = BRIGADES["HQ 55 Inf Div (Direct)"] || [];
      const brigadesList = Object.keys(BRIGADES).filter(b => b !== "HQ 55 Inf Div (Direct)");
      
      let unitsOptions = `<option value="HQ 55 Inf Div">Division HQ (Self Pool)</option>`;
      brigadesList.forEach(bde => {
        unitsOptions += `<option value="${bde}">${getDisplayNameForUnit(bde)}</option>`;
      });
      directUnits.forEach(unit => {
        unitsOptions += `<option value="${unit}">${getDisplayNameForUnit(unit)}</option>`;
      });
      
      fieldsContainer.innerHTML = `
        <div class="floating-label-group">
          <label style="position:static; font-size:11px; font-weight:600; color:var(--primary); margin-bottom:4px; display:block;">${isBn ? "উৎস পুল (Source)" : "Source Pool"}</label>
          <select id="pol-modal-source" class="form-input" style="padding-top: 8px;">
            <option value="Area HQ">Area HQ (এরিয়া সদর দপ্তর)</option>
            <option value="HQ 55 Inf Div">Division HQ Pool (ডিভ সদর দপ্তর পুল)</option>
          </select>
        </div>
        <div class="floating-label-group">
          <label style="position:static; font-size:11px; font-weight:600; color:var(--primary); margin-bottom:4px; display:block;">${isBn ? "বরাদ্দ গ্রহীতা (Recipient)" : "Allocation Recipient"}</label>
          <select id="pol-modal-target" class="form-input" style="padding-top: 8px;">
            ${unitsOptions}
          </select>
        </div>
        <div class="floating-label-group">
          <select id="pol-modal-grade" class="form-input" style="padding-top: 8px;">
            ${gradeOptions}
          </select>
        </div>
        <div class="floating-label-group">
          <select id="pol-modal-month" class="form-input" style="padding-top: 8px;">
            ${monthsOptions}
          </select>
        </div>
        <div class="floating-label-group">
          <input type="number" id="pol-modal-amount" class="form-input" placeholder=" " required min="1">
          <label for="pol-modal-amount">${t("lbl_amount")}</label>
        </div>
      `;
    } 
    else if ([3, 4].includes(Number(role))) {
      const bde = state.currentUser.assigned || state.currentUser.scopeBde;
      const subUnits = BRIGADES[bde] || [];
      
      let unitsOptions = "";
      subUnits.forEach(unit => {
        unitsOptions += `<option value="${unit}">${getDisplayNameForUnit(unit)}</option>`;
      });
      
      fieldsContainer.innerHTML = `
        <div class="floating-label-group">
          <label style="position:static; font-size:11px; font-weight:600; color:var(--primary); margin-bottom:4px; display:block;">${isBn ? "বরাদ্দ গ্রহীতা (Recipient)" : "Allocation Recipient"}</label>
          <select id="pol-modal-target" class="form-input" style="padding-top: 8px;">
            ${unitsOptions}
          </select>
        </div>
        <div class="floating-label-group">
          <select id="pol-modal-grade" class="form-input" style="padding-top: 8px;">
            ${gradeOptions}
          </select>
        </div>
        <div class="floating-label-group">
          <select id="pol-modal-month" class="form-input" style="padding-top: 8px;">
            ${monthsOptions}
          </select>
        </div>
        <div class="floating-label-group">
          <input type="number" id="pol-modal-amount" class="form-input" placeholder=" " required min="1">
          <label for="pol-modal-amount">${t("lbl_amount")}</label>
        </div>
      `;
    }
  } 
  else if (action === "EXP") {
    titleEl.innerText = t("label_expenditure");
    descEl.innerText = isBn ? "জ্বালানি খরচ/ব্যয় এন্ট্রি করুন" : "Record fuel consumption/expenditure.";
    
    fieldsContainer.innerHTML = `
      <div class="floating-label-group">
        <select id="pol-modal-grade" class="form-input" style="padding-top: 8px;">
          ${gradeOptions}
        </select>
      </div>
      <div class="floating-label-group">
        <select id="pol-modal-month" class="form-input" style="padding-top: 8px;">
          ${monthsOptions}
        </select>
      </div>
      <div class="floating-label-group">
        <input type="number" id="pol-modal-amount" class="form-input" placeholder=" " required min="1">
        <label for="pol-modal-amount">${t("lbl_amount")}</label>
      </div>
    `;
  }
  
  modal.style.display = "flex";
  modal.offsetHeight; // Force reflow
  modal.classList.add("open");
  document.body.classList.add("modal-open");
}

export function closePolModal() {
  const modal = document.getElementById("pol-management-modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    setTimeout(() => {
      if (!modal.classList.contains("open")) {
        modal.style.display = "none";
      }
    }, 300);
  }
}

window.addEventListener("languagechange", () => {
  updateMetricDisplayValues();
  if (state.activeTabKey === "POL") {
    const mainContent = document.getElementById("portal-main-content");
    renderPolManagementView(mainContent);
  }
});