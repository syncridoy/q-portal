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
  if (unitName === "5 BIR (Sp Bn)" || unitName === "19 E Bengal (Sp Bn)") {
    if (activeYear === "2024-25") {
      return isBn ? "১৯ ই বেঙ্গল (সাপোর্ট ব্যাটেলিয়ন)" : "19 E Bengal (Sp Bn)";
    } else {
      return isBn ? "৫ বীর (সাপোর্ট ব্যাটেলিয়ন)" : "5 BIR (Sp Bn)";
    }
  }
  if (unitName === "9 Bengal Lancers" || unitName === "9 Bengal Lancer") {
    return isBn ? "৯ বেঙ্গল ল্যান্সার" : "9 Bengal Lancer";
  }
  return unitName;
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
    
    let allLabel = bde;
    if (isBn) {
      allLabel = bde.replace("HQ", "সদর").replace("Arty Bde", "আর্টিলারি").replace("Inf Bde", "পদাতিক").replace("Inf Div (Direct)", " পদাতিক ডিভিশন (সরাসরি)");
    }
    const hqLabel = isBn ? `ব্রিগেড সদর দপ্তর (${bde})` : `Brigade HQ (${bde})`;
    
    html += `<option value="ALL" ${selectedEntity === "ALL" ? "selected" : ""}>${allLabel}</option>`;
    html += `<option value="HQ" ${selectedEntity === "HQ" ? "selected" : ""}>${hqLabel}</option>`;
    
    units.forEach(u => {
      html += `<option value="unit:${u}" ${selectedEntity === `unit:${u}` ? "selected" : ""}>${getDisplayNameForUnit(u)}</option>`;
    });
  } else if (role === 5 || role === 6) {
    const allLabel = isBn ? "HQ 55 Inf Div" : "HQ 55 Inf Div";
    html += `<option value="ALL" ${selectedEntity === "ALL" ? "selected" : ""}>${allLabel}</option>`;
    
    Object.keys(BRIGADES).forEach(bde => {
      if (bde === "HQ 55 Inf Div (Direct)") return;
      let bdeLabel = bde;
      if (isBn) {
        bdeLabel = bde.replace("HQ", "সদর").replace("Arty Bde", "আর্টিলারি").replace("Inf Bde", "পদাতিক");
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
      <h2 class="dashboard-title">${t("welcome_title")}</h2>
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
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(130)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(120)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(100)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(20)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(80)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(20)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(30)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(10)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(20)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(10)}</span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_pickup")}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(110)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(101)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(81)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(20)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(65)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(16)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(25)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(15)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(15)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(10)}</span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_3ton")}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(160)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(140)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(111)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(29)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(85)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(26)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(45)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(25)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(25)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(10)}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Card 2: Held Donut Chart -->
          <div class="dashboard-card">
            <div class="card-header-row">
              <h4 class="card-header-title">${t("card_title_held")}</h4>
              <select id="donut-vehicle-select" class="mini-dropdown">
                <option value="Jeep" ${state.dashboard.donutVehicle === "Jeep" ? "selected" : ""}>Jeep</option>
                <option value="pickup" ${state.dashboard.donutVehicle === "pickup" ? "selected" : ""}>pickup</option>
                <option value="3 Ton" ${state.dashboard.donutVehicle === "3 Ton" ? "selected" : ""}>3 Ton</option>
              </select>
            </div>
            <div style="position: relative; width: 100%; height: 160px; display: flex; align-items: center; justify-content: center; margin-top: 10px;">
              <canvas id="held-donut-chart"></canvas>
              <div style="position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center; z-index: 10;">
                <span id="donut-center-label" style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">${t("card_title_held")}</span>
                <span id="donut-center-val" style="font-size: 24px; font-weight: 800; color: #1e293b; line-height: 1.1;">180</span>
              </div>
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
                    <th><span class="cell-text-wrapper">${t("th_alt_from_area")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_alt_to_bde")}</span></th>
                    <th><span class="cell-text-wrapper">${t("th_bal")}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_diesel")}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(1292544)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(1292544)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(0)}</span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_ms74")}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(4737)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(4737)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(0)}</span></td>
                  </tr>
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_100octane")}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(26685)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(26685)}</span></td>
                    <td><span class="cell-text-wrapper">${formatDisplayNumber(0)}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Card 4: Total Exp Line Chart -->
          <div class="dashboard-card">
            <div class="card-header-row" style="margin-bottom: 6px;">
              <select id="line-year-select" class="mini-dropdown">
                <option value="2024-25" ${state.dashboard.lineYear === "2024-25" ? "selected" : ""}>2024-25</option>
                <option value="2025-26" ${state.dashboard.lineYear === "2025-26" ? "selected" : ""}>2025-26</option>
                <option value="2026-27" ${state.dashboard.lineYear === "2026-27" ? "selected" : ""}>2026-27</option>
              </select>
              <select id="line-grade-select" class="mini-dropdown">
                <option value="Diesel" ${state.dashboard.lineGrade === "Diesel" ? "selected" : ""}>Diesel</option>
                <option value="MS-74" ${state.dashboard.lineGrade === "MS-74" ? "selected" : ""}>MS-74</option>
                <option value="100 Octane" ${state.dashboard.lineGrade === "100 Octane" ? "selected" : ""}>100 Octane</option>
              </select>
            </div>
            ${[3, 4, 5, 6].includes(Number(role)) ? `
            <div class="card-header-row" style="margin-bottom: 12px; justify-content: flex-start;">
              <select id="line-entity-select" class="mini-dropdown" style="width: auto; max-width: 150px;">
                ${populateEntitySelectOptions(role)}
              </select>
            </div>
            ` : ''}
            <div style="display: flex; width: 100%; align-items: center; gap: 20px; flex: 1;">
              <!-- Left side stats -->
              <div style="flex: 0 0 170px; display: flex; flex-direction: column; gap: 8px;">
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
              <!-- Right side canvas -->
              <div style="flex: 1; height: 140px; position: relative;">
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
                  <tr>
                    <td><span class="cell-text-wrapper">${t("row_nce")}</span></td>
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

          <!-- Card 6: Bugler Summary -->
          <div class="dashboard-card">
            <div class="card-header-row">
              <h4 class="card-header-title">${t("card_title_bugler_summary")}</h4>
            </div>
            <div class="dashboard-table-container">
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th rowspan="2"><span class="cell-text-wrapper">${state.language === "bn" ? "মোট (Tottal)" : "Tottal"}</span></th>
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
  `;

  // Bind dropdown action events
  const donutSelect = document.getElementById("donut-vehicle-select");
  if (donutSelect) {
    donutSelect.onchange = (e) => {
      state.dashboard.donutVehicle = e.target.value;
      initDonutChart();
    };
  }

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

  // Initialize charts and load data asynchronously
  updateLineChartData();
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
        <span class="contact-rank">${u.rank}</span>
        <h4>${u.fullName}</h4>
        <span class="contact-ba">${u.baNo}</span>
        <div class="contact-unit">🏢 ${getDisplayNameForUnit(targetUnit)}</div>
        <div style="font-size:11px; margin-top:2px; font-weight:600; color:var(--primary);">📞 ${u.mobile}</div>
      </div>
      <button class="contact-call-btn" onclick="simulateCall('${u.fullName}', '${u.mobile}')" title="Call Contact">
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
    const labelRoleName = state.language === "en" ? u.roleName : u.roleName.replace("Unit Clerk", "ইউনিট ক্লার্ক").replace("Unit QM / OC", "ইউনিট কিউএম").replace("Brigade Clerk", "ব্রিগেড ক্লার্ক").replace("Brigade DAQMG", "ব্রিগেড ডিএকিউএমজি").replace("Division Q Clerk", "ডিভিশন কিউ ক্লার্ক").replace("Division AAQMG", "ডিভিশন এএকিউএমজি");

    btn.innerHTML = `
      <div>
        <strong>${u.fullName}</strong><br>
        <span style="font-size:10px; color: var(--text-muted)">Scope: ${getDisplayNameForUnit(scopeText)}</span>
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
});