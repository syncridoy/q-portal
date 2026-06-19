// --- Command Hierarchy and Units Map ---
export const BRIGADES = {
  "HQ 55 Arty Bde": ["Rawshan Ara Regt Arty", "8 Fd Regt Arty", "27 Fd Regt Arty", "Adhoc Med Bty"],
  "HQ 21 Inf Bde": ["10 E Bengal", "20 E Bengal"],
  "HQ 88 Inf Bde": ["2 E Bengal", "6 E Bengal"],
  "HQ 105 Inf Bde": ["14 BIR", "Adhoc 34 E Bengal", "37 BIR"],
  "HQ 55 Inf Div (Direct)": [
    "9 Bengal Lancers", "3 Engr Bn", "2 Sig Bn", "5 BIR (Sp Bn)", 
    "31 ST Bn", "41 Fd Amb", "71 Fd Amb", "505 DOC", 
    "117 Fd Wksp Coy EME", "119 Fd Wksp Coy EME", "145 Fd Wksp Coy EME", 
    "55 MP Unit", "55 FIU", "HQ Coy 55 Inf Div"
  ]
};

// Flattened list of all units for directories
export const ALL_UNITS_LIST = [];
Object.entries(BRIGADES).forEach(([bde, units]) => {
  units.forEach(unit => ALL_UNITS_LIST.push({ name: unit, bde: bde }));
});

// --- Pre-registered Users Database (Immutable User Registry) ---
export const IMMUTABLE_USER_REGISTRY = [
  // === 1. Division Level ===
  { "username": "aq_55_inf_div", "assigned": "HQ 55 Inf Div", "role": 6, "appointment": "AAQMG", "access": "Viewer" },
  { "username": "dq_55_inf_div", "assigned": "HQ 55 Inf Div", "role": 6, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_55_inf_div", "assigned": "HQ 55 Inf Div", "role": 5, "appointment": "Q Clk", "access": "Editor" },

  // === 2. Brigade Level ===
  { "username": "dq_55_arty_bde", "assigned": "HQ 55 Arty Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_55_arty_bde", "assigned": "HQ 55 Arty Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },
  { "username": "dq_21_inf_bde", "assigned": "HQ 21 Inf Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_21_inf_bde", "assigned": "HQ 21 Inf Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },
  { "username": "dq_88_inf_bde", "assigned": "HQ 88 Inf Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_88_inf_bde", "assigned": "HQ 88 Inf Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },
  { "username": "dq_105_inf_bde", "assigned": "HQ 105 Inf Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_105_inf_bde", "assigned": "HQ 105 Inf Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },

  // === 3. Unit Level ===
  // (a) HQ 55 Arty Bde
  { "username": "qm_rawshan_ara_regt", "assigned": "Rawshan Ara Regt Artly", "role": 2, "appointment": "QM", "access": "Viewer" }, // Note: we sync with our unit list "Rawshan Ara Regt Arty"
  { "username": "rawshan_ara_regt", "assigned": "Rawshan Ara Regt Arty", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_8_fd_regt", "assigned": "8 Fd Regt Arty", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "8_fd_regt", "assigned": "8 Fd Regt Arty", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_27_fd_regt", "assigned": "27 Fd Regt Arty", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "27_fd_regt", "assigned": "27 Fd Regt Arty", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_adhoc_med_bty", "assigned": "Adhoc Med Bty", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "adhoc_med_bty", "assigned": "Adhoc Med Bty", "role": 1, "appointment": "Q Clk", "access": "Editor" },

  // (b) HQ 21 Inf Bde
  { "username": "qm_10_eb", "assigned": "10 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "10_eb", "assigned": "10 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_20_eb", "assigned": "20 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "20_eb", "assigned": "20 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },

  // (c) HQ 88 Inf Bde
  { "username": "qm_6_eb", "assigned": "6 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "6_eb", "assigned": "6 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_2_eb", "assigned": "2 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "2_eb", "assigned": "2 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },

  // (d) HQ 105 Inf Bde
  { "username": "qm_14_bir", "assigned": "14 BIR", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "14_bir", "assigned": "14 BIR", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_34_eb", "assigned": "Adhoc 34 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "34_eb", "assigned": "Adhoc 34 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_37_bir", "assigned": "37 BIR", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "37_bir", "assigned": "37 BIR", "role": 1, "appointment": "Q Clk", "access": "Editor" },

  // (e) Div Units
  { "username": "qm_9_bl", "assigned": "9 Bengal Lancers", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "9_bl", "assigned": "9 Bengal Lancers", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_3_engr_bn", "assigned": "3 Engr Bn", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "3_engr_bn", "assigned": "3 Engr Bn", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_2_sig_bn", "assigned": "2 Sig Bn", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "2_sig_bn", "assigned": "2 Sig Bn", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_5_bir", "assigned": "5 BIR (Sp Bn)", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "5_bir", "assigned": "5 BIR (Sp Bn)", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_31_st_bn", "assigned": "31 ST Bn", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "31_st_bn", "assigned": "31 ST Bn", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_41_fd_amb", "assigned": "41 Fd Amb", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "41_fd_amb", "assigned": "41 Fd Amb", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_71_fd_amb", "assigned": "71 Fd Amb", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "71_fd_amb", "assigned": "71 Fd Amb", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_505_doc", "assigned": "505 DOC", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "505_doc", "assigned": "505 DOC", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_117_fd_wksp", "assigned": "117 Fd Wksp Coy EME", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "117_fd_wksp", "assigned": "117 Fd Wksp Coy EME", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_119_fd_wksp", "assigned": "119 Fd Wksp Coy EME", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "119_fd_wksp", "assigned": "119 Fd Wksp Coy EME", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_145_fd_wksp", "assigned": "145 Fd Wksp Coy EME", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "145_fd_wksp", "assigned": "145 Fd Wksp Coy EME", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_55_mp", "assigned": "55 MP Unit", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "55_mp", "assigned": "55 MP Unit", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_55_fiu", "assigned": "55 FIU", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "55_fiu", "assigned": "55 FIU", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_hq_coy_55_div", "assigned": "HQ Coy 55 Inf Div", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "hq_coy_55_div", "assigned": "HQ Coy 55 Inf Div", "role": 1, "appointment": "Q Clk", "access": "Editor" }
];

export function compileInitialUsers() {
  const users = {};
  IMMUTABLE_USER_REGISTRY.forEach(u => {
    let scopeUnit = null;
    let scopeBde = null;
    let roleName = "";
    let defaultRank = "";

    // Sync unit name anomalies if any
    let assignedName = u.assigned;
    if (assignedName === "Rawshan Ara Regt Artly") assignedName = "Rawshan Ara Regt Arty";

    if (u.role === 1 || u.role === 2) {
      scopeUnit = assignedName;
      scopeBde = Object.keys(BRIGADES).find(b => BRIGADES[b].includes(assignedName)) || null;
      roleName = u.role === 1 ? "Unit Clerk" : "Unit QM / OC";
      defaultRank = u.role === 1 ? "Warrant Officer" : "Major";
    } else if (u.role === 3 || u.role === 4) {
      scopeBde = assignedName;
      roleName = u.role === 3 ? "Brigade Clerk" : "Brigade DAQMG";
      defaultRank = u.role === 3 ? "Sergeant" : "Major";
    } else if (u.role === 5 || u.role === 6) {
      scopeBde = "ALL";
      roleName = u.role === 5 ? "Division Q Clerk" : (u.appointment === "AAQMG" ? "Division AAQMG" : "Division DAQMG");
      defaultRank = u.role === 5 ? "Senior Warrant Officer" : (u.appointment === "AAQMG" ? "Lieutenant Colonel" : "Major");
    }

    users[u.username] = {
      username: u.username,
      password: "temp123",
      role: u.role,
      roleName: roleName,
      appointment: u.appointment, // Exact database literal representation
      assigned: assignedName,
      assignedUnit: assignedName, // Mapped configuration string
      unitName: assignedName,     // Mapped configuration string
      scopeUnit: scopeUnit,
      scopeBde: scopeBde,
      is_first_login: true, // all accounts start as first login!
      baNo: "",
      rank: defaultRank,
      fullName: u.appointment + " (" + assignedName + ")",
      mobile: "",
      avatar: "https://avatar.iran.liara.run/public/" + (Math.floor(Math.random() * 70) + 1)
    };
  });
  return users;
}

export const INITIAL_USERS = compileInitialUsers();

// --- Initial Unit Logistics Values ---
export const INITIAL_LOGISTICS = {
  // Arty Bde
  "Rawshan Ara Regt Arty": { vAvail: 8, vTotal: 12, pol: 4500, cook: 4, waiter: 8, strength: 245 },
  "8 Fd Regt Arty": { vAvail: 6, vTotal: 8, pol: 3200, cook: 3, waiter: 6, strength: 180 },
  "27 Fd Regt Arty": { vAvail: 9, vTotal: 10, pol: 4100, cook: 4, waiter: 7, strength: 215 },
  "Adhoc Med Bty": { vAvail: 3, vTotal: 4, pol: 1500, cook: 2, waiter: 4, strength: 90 },
  // 21 Inf Bde
  "10 E Bengal": { vAvail: 14, vTotal: 18, pol: 6500, cook: 5, waiter: 10, strength: 480 },
  "20 E Bengal": { vAvail: 11, vTotal: 15, pol: 5800, cook: 5, waiter: 9, strength: 460 },
  // 88 Inf Bde
  "2 E Bengal": { vAvail: 12, vTotal: 16, pol: 6100, cook: 5, waiter: 10, strength: 470 },
  "6 E Bengal": { vAvail: 10, vTotal: 14, pol: 5200, cook: 4, waiter: 8, strength: 430 },
  // 105 Inf Bde
  "14 BIR": { vAvail: 15, vTotal: 18, pol: 6900, cook: 6, waiter: 11, strength: 520 },
  "Adhoc 34 E Bengal": { vAvail: 5, vTotal: 8, pol: 2800, cook: 3, waiter: 6, strength: 150 },
  "37 BIR": { vAvail: 11, vTotal: 15, pol: 5400, cook: 5, waiter: 9, strength: 440 },
  // Div Direct
  "9 Bengal Lancers": { vAvail: 16, vTotal: 20, pol: 8500, cook: 6, waiter: 12, strength: 310 },
  "3 Engr Bn": { vAvail: 22, vTotal: 26, pol: 9200, cook: 5, waiter: 10, strength: 280 },
  "2 Sig Bn": { vAvail: 18, vTotal: 22, pol: 7500, cook: 4, waiter: 8, strength: 250 },
  "5 BIR (Sp Bn)": { vAvail: 14, vTotal: 16, pol: 6200, cook: 6, waiter: 11, strength: 490 },
  "31 ST Bn": { vAvail: 45, vTotal: 50, pol: 24000, cook: 8, waiter: 15, strength: 350 },
  "41 Fd Amb": { vAvail: 12, vTotal: 14, pol: 3800, cook: 3, waiter: 6, strength: 120 },
  "71 Fd Amb": { vAvail: 10, vTotal: 12, pol: 3500, cook: 3, waiter: 6, strength: 110 },
  "505 DOC": { vAvail: 4, vTotal: 6, pol: 1800, cook: 2, waiter: 4, strength: 60 },
  "117 Fd Wksp Coy EME": { vAvail: 8, vTotal: 10, pol: 3900, cook: 3, waiter: 5, strength: 140 },
  "119 Fd Wksp Coy EME": { vAvail: 7, vTotal: 9, pol: 3600, cook: 3, waiter: 5, strength: 130 },
  "145 Fd Wksp Coy EME": { vAvail: 9, vTotal: 11, pol: 4200, cook: 3, waiter: 6, strength: 150 },
  "55 MP Unit": { vAvail: 8, vTotal: 8, pol: 2500, cook: 2, waiter: 4, strength: 95 },
  "55 FIU": { vAvail: 3, vTotal: 4, pol: 1200, cook: 1, waiter: 2, strength: 45 },
  "HQ Coy 55 Inf Div": { vAvail: 12, vTotal: 15, pol: 5500, cook: 5, waiter: 12, strength: 220 }
};

// --- Core Application State ---
export let state = {
  currentUser: null,
  activeView: "login", // login, setup, dashboard
  activeSubContent: "overview", // overview, units, directory
  language: "en", // Default startup language is strictly English (EN)
  usersDB: {},
  logisticsDB: {},
  currentSetupStep: 1,
  generatedOTP: null,
  otpVerified: false,
  selectedAvatar: "https://avatar.iran.liara.run/public/31",
  activeEditorUnit: null,
  activeTabKey: null,
  charts: {
    bar: null,
    pie: null
  }
};

// --- Role-Based Tab Configuration ---
export const ROLE_TABS = {
  units: ["Dashboard", "Veh", "Mess-staff", "POL", "Manpower"],
  brigades: ["Dashboard", "Veh", "Mess-staff", "POL", "Manpower", "Contact"],
  division: ["Dashboard", "Veh", "Mess-staff", "POL", "Manpower", "Contact", "Admin Hub"]
};

export function getRoleCategory(roleId) {
  const role = Number(roleId);
  if (role === 1 || role === 2) return "units";
  if (role === 3 || role === 4) return "brigades";
  if (role === 5 || role === 6) return "division";
  return "units";
}

export function normalizeAppointment(appt) {
  if (!appt) return "";
  const clean = appt.trim().toLowerCase();
  if (clean === "q clk" || clean === "q clq") return "Q Clk";
  if (clean === "aaqmg") return "AAQMG";
  if (clean === "daqmg") return "DAQMG";
  if (clean === "qm") return "QM";
  if (clean === "oc") return "OC";
  return appt;
}

export function toTitleCase(str) {
  if (!str) return "";
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

// --- Mock Data ---
export const DONUT_MOCK_DATA = {
  "Jeep": { held: 180, ur: 40, att: 80, sur: 60 },
  "pickup": { held: 140, ur: 30, att: 60, sur: 50 },
  "3 Ton": { held: 220, ur: 50, att: 110, sur: 60 }
};

export const LINE_MOCK_DATA = {
  "2023-24": {
    "Diesel": { total: 1029000, last: 85000, alt: 1060000, data: [85000, 80000, 88000, 85000, 82000, 85000, 90000, 94000, 88000, 86000, 84000, 92000], altData: [90000, 82000, 84000, 89000, 85000, 82000, 93000, 90000, 91000, 84000, 88000, 102000] },
    "MS-74": { total: 399000, last: 35000, alt: 413000, data: [32000, 30000, 34000, 33000, 31000, 32000, 35000, 37000, 34000, 33000, 32000, 36000], altData: [34000, 30000, 32000, 35000, 33000, 31000, 38000, 35000, 36000, 31000, 34000, 44000] },
    "100 Octane": { total: 174000, last: 15000, alt: 180000, data: [14000, 13000, 15000, 14000, 13000, 14000, 16000, 17000, 15000, 14000, 13000, 16000], altData: [15000, 12000, 14000, 16000, 15000, 13000, 17000, 15000, 16000, 13000, 15000, 19000] }
  },
  "2024-25": {
    "Diesel": { total: 1046000, last: 88000, alt: 1071000, data: [84000, 80000, 88000, 85000, 83000, 86000, 91000, 95000, 89000, 87000, 85000, 93000], altData: [88000, 82000, 85000, 88000, 86000, 83000, 94000, 91000, 92000, 85000, 89000, 108000] },
    "MS-74": { total: 422000, last: 38000, alt: 430000, data: [34000, 32000, 36000, 35000, 33000, 34000, 37000, 39000, 36000, 35000, 34000, 38000], altData: [36000, 30000, 34000, 37000, 35000, 32000, 40000, 37000, 38000, 33000, 36000, 42000] },
    "100 Octane": { total: 186000, last: 16500, alt: 190000, data: [15000, 14000, 16000, 15000, 14000, 15000, 17000, 18000, 16000, 15000, 14000, 17000], altData: [16000, 13000, 15000, 17000, 15000, 14000, 18000, 16000, 17000, 14000, 15000, 20000] }
  },
  "2025-26": {
    "Diesel": { total: 1140560, last: 90560, alt: 1150000, data: [82000, 81000, 91000, 89000, 87000, 90000, 94000, 98000, 92000, 90000, 88000, 95000], altData: [102000, 92000, 88000, 93000, 85000, 94000, 96000, 94000, 95000, 93000, 92000, 126000] },
    "MS-74": { total: 480000, last: 40000, alt: 490000, data: [35000, 34000, 39000, 38000, 36000, 37000, 41000, 43000, 39000, 38000, 37000, 42000], altData: [38000, 33000, 36000, 40000, 35000, 39000, 42000, 40000, 41000, 37000, 39000, 70000] },
    "100 Octane": { total: 210000, last: 18000, alt: 220000, data: [16000, 15000, 17000, 16000, 15000, 16000, 18000, 19000, 17000, 16000, 15000, 18000], altData: [18000, 14000, 16000, 18000, 14000, 17000, 19000, 17000, 18000, 15000, 16000, 38000] }
  },
  "2026-27": {
    "Diesel": { total: 1200000, last: 95000, alt: 1220000, data: [85000, 83000, 94000, 92000, 90000, 93000, 98000, 102000, 96000, 94000, 92000, 99000], altData: [90000, 80000, 90000, 95000, 92000, 89000, 100000, 98000, 99000, 90000, 95000, 112000] },
    "MS-74": { total: 500000, last: 42000, alt: 510000, data: [36000, 35000, 40000, 39000, 37000, 38000, 42000, 44000, 40000, 39000, 38000, 43000], altData: [40000, 33000, 38000, 41000, 36000, 40000, 44000, 42000, 43000, 38000, 40000, 75000] },
    "100 Octane": { total: 220000, last: 19000, alt: 230000, data: [17000, 16000, 18000, 17000, 16000, 17000, 19000, 20000, 18000, 17000, 16000, 19000], altData: [19000, 15000, 17000, 19000, 15000, 18000, 20000, 18000, 19000, 16000, 17000, 27000] }
  }
};
