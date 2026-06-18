// ==========================================
// Q-PORTAL - ADMINISTRATIVE CORE APP SCRIPT
// ==========================================

// --- Command Hierarchy and Units Map ---
const BRIGADES = {
  "HQ 55 Arty Bde": ["Rawshan Ara Regt Arty", "8 Fd Regt Arty", "27 Fd Regt Arty", "Adhoc Med Bty"],
  "HQ 21 Inf Bde": ["10 E Bengal", "20 E Bengal"],
  "HQ 88 Inf Bde": ["2 E Bengal", "6 E Bengal"],
  "HQ 105 Inf Bde": ["14 BIR", "Adhoc 34 E Bengal", "37 BIR"],
  "HQ 55 Inf Div (Direct)": [
    "9 Bengal Lancers", "3 Engr Bn", "2 Sig Bn", "5 BIR (Div Sp Bn)", 
    "31 ST Bn", "41 Fd Amb", "71 Fd Amb", "505 DOC", 
    "117 Fd Wksp Coy EME", "119 Fd Wksp Coy EME", "145 Fd Wksp Coy EME", 
    "55 MP Unit", "55 FIU", "HQ Coy 55 Inf Div"
  ]
};

// Flattened list of all units for directories
const ALL_UNITS_LIST = [];
Object.entries(BRIGADES).forEach(([bde, units]) => {
  units.forEach(unit => ALL_UNITS_LIST.push({ name: unit, bde: bde }));
});

// --- Pre-registered Users Database (Immutable User Registry) ---
const IMMUTABLE_USER_REGISTRY = [
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
  { "username": "qm_5_bir", "assigned": "5 BIR (Div Sp Bn)", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "5_bir", "assigned": "5 BIR (Div Sp Bn)", "role": 1, "appointment": "Q Clk", "access": "Editor" },
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

function compileInitialUsers() {
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

const INITIAL_USERS = compileInitialUsers();

// --- Initial Unit Logistics Values ---
const INITIAL_LOGISTICS = {
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
  "5 BIR (Div Sp Bn)": { vAvail: 14, vTotal: 16, pol: 6200, cook: 6, waiter: 11, strength: 490 },
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

// --- Translation Dictionary (Bilingual support) ---
const TRANSLATIONS = {
  en: {
    app_title: "Q-portal",
    app_subtitle: "AQ Branch, 55 Inf Div",
    live_status: "Live Aggregator Active",
    login_welcome: "As-salamu alaykum",
    login_subtext: "Welcome to Q-portal",
    div_title: "55 Inf Div",
    div_subtitle: "Excellence Everywhere",
    forgot_password: "Forgot Password",
    btn_reset_state: "🔄 Reset System Data",
    login_caps: "LOGIN",
    label_username: "Username or phone number",
    label_password: "Password",
    btn_login: "Access System",
    test_credentials_title: "DEMO ACCOUNTS (Use Password: temp123)",
    setup_step_1: "Security",
    setup_step_2: "Verification",
    setup_step_3: "User Info",
    pwd_heading: "Define Secure Password",
    pwd_desc: "Update your password to secure your account.",
    label_new_pwd: "New Password",
    label_confirm_pwd: "Confirm New Password",
    pwd_weak: "Weak - Minimum 8 characters with numbers & symbols required",
    pwd_medium: "Medium Strength",
    pwd_strong: "Strong Password",
    pwd_match: "Passwords match.",
    pwd_mismatch: "Passwords do not match.",
    otp_heading: "Mobile Verification",
    otp_desc: "Please provide your official mobile number to receive a simulated verification OTP.",
    label_mobile: "Official Mobile Number",
    otp_sent_msg: "An OTP has been simulated. Check notifications below and input it here:",
    otp_not_received: "Didn't receive code?",
    otp_resend: "Resend OTP",
    profile_heading: "Update User Info",
    profile_desc: "Provide your rank and official credentials. Select an avatar to complete your entry in the automated directory.",
    label_rank: "Rank",
    label_ba_no: "Army / BA Number",
    label_fullname: "Full Name",
    label_profile_pic: "Choose Profile Avatar",
    btn_upload: "Or upload custom photo",
    btn_back: "Previous",
    btn_next: "Next Step",
    menu_header: "Portal Scope Nav",
    menu_overview: "Divisional aggregates",
    menu_units: "Unit Logistics",
    menu_directory: "Contact Directory",
    tree_header: "Command Hierarchy",
    card_vehicles: "Total Vehicles",
    card_pol: "Total Fuel (POL)",
    card_mess: "Mess Staff",
    card_personnel: "Active Personnel",
    chart_agg_title: "Comparative Brigade Logistics Index",
    chart_breakdown_title: "Divisional Allocation Matrix",
    chart_breakdown_desc: "Overall percentage shares across the division",
    table_agg_title: "55 Infantry Division Logistics Overview",
    th_hq: "Brigade / Headquarters Group",
    th_vehicles: "Vehicles (Active/Total)",
    th_pol: "Fuel (POL - L)",
    th_mess: "Mess Staff Count",
    th_strength: "Personnel Present",
    th_unit: "Subordinate Unit",
    th_action: "Action",
    units_title: "Subordinate Logistics Sheets",
    editor_heading: "Resource Data Entry Console",
    read_only_alert: "Your current account is strictly Read-Only. Editing is disabled.",
    lbl_vehicles_avail: "Available Vehicles (Count)",
    lbl_vehicles_total: "Total Authorized Vehicles (Count)",
    lbl_pol: "POL Fuel On-hand (Liters)",
    lbl_mess_cook: "Assigned Cooks (Count)",
    lbl_mess_waiter: "Assigned Service Waiters (Count)",
    lbl_strength: "Present Personnel Strength (Count)",
    btn_save: "Publish & Stream Data",
    directory_title: "Divisional Automated Contact Directory",
    directory_search_placeholder: "Search by BA number, rank, or name...",
    opt_all_units: "All Brigades & Units",
    sim_heading: "Administrative Role Impersonator",
    sim_desc: "Select a profile below to instantly switch sessions. Clerks can edit matching units; officers have dynamic read-only overview dashboards.",
    // Toast notifications
    toast_login_success: "Sign-in successful. Welcome back!",
    toast_setup_complete: "Account setup finalized. Directing to dashboard.",
    toast_otp_sent: "Simulated SMS Gateway: Your OTP is ",
    toast_otp_error: "Verification failed. The OTP typed was invalid.",
    toast_otp_verified: "Mobile phone verified successfully.",
    toast_pwd_mismatch: "Password entries do not match.",
    toast_pwd_short: "New password must be at least 8 characters long.",
    toast_data_saved: "Logistics database updated and broadcasted in real time!",
    toast_incoming_call: "Dialing phone number of ",
    tab_dashboard: "Dashboard",
    tab_veh: "Veh",
    tab_mess_staff: "Mess-staff",
    tab_pol: "POL",
    tab_manpower: "Manpower",
    tab_contact: "Contact",
    tab_admin_hub: "Admin Hub",
    menu_edit_profile: "Edit User Info",
    menu_logout: "Logout",
    modal_edit_title: "Edit User Info",
    modal_edit_desc: "Modify your administrative profile details below.",
    btn_cancel: "Cancel",
    btn_save_changes: "Save Changes",
    crop_modal_title: "Crop Profile Picture",
    btn_crop_apply: "Crop & Apply",
    menu_change_password: "Change Password",
    modal_change_pwd_title: "Change Password",
    label_current_pwd: "Current Password",
    btn_update_password: "Update Password",
    btn_verify_update: "Verify & Update",
    change_pwd_otp_desc: "A 6-digit verification code has been sent to your official number.",
    welcome_title: "Welcome to Div Dashboard",
    card_title_veh_state: "Veh State Summary",
    card_title_held: "Held",
    card_title_pol_state: "State of POL FY-2025-26",
    card_title_total_exp: "Total Exp",
    card_title_mess_summary: "Mess-staff & NC (E) Summary",
    card_title_bugler_summary: "Bugler Summary",
    TH_POL_GRADE: "POL Grade",
    th_type_of_veh: "Type of Veh",
    th_auth: "Auth",
    th_held: "Held",
    th_or: "OR",
    th_ur: "UR",
    th_long_rd: "Long Rd",
    th_of_rd: "Of Rd",
    th_att: "Att",
    th_sur: "Sur",
    th_pol_grade: "POL Grade",
    th_alt_from_area: "Alt from Area",
    th_alt_to_bde: "Alt to Bde/Unit",
    th_bal: "Bal",
    th_type_of_mess: "Type of Mess-Staff",
    th_posted: "Posted",
    th_present: "Present",
    th_absent: "Absent",
    th_lve: "Lve",
    th_course: "Course",
    th_total: "Total",
    row_jeep: "Jeep",
    row_pickup: "Pickup",
    row_3ton: "3 Ton",
    row_diesel: "Diesel",
    row_ms74: "MS-74",
    row_100octane: "100 Octane",
    row_messwaiter: "Messwaiter",
    row_masalchi: "Masalchi",
    row_cook_m: "Cook (M)",
    row_cook_u: "Cook (U)",
    row_nce: "NC (E)",
    lbl_total_exp: "Total Exp",
    lbl_last_month_exp: "Last Month Exp"
  },
  bn: {
    app_title: "কিউ-পোর্টাল",
    app_subtitle: "একিউ ব্রাঞ্চ, ৫৫ পদাতিক ডিভিশন",
    live_status: "লাইভ ডাটা এগ্রিগেশন সচল",
    login_welcome: "আস-সালামু আলাইকুম",
    login_subtext: "কিউ-পোর্টালে স্বাগতম",
    div_title: "৫৫ পদাতিক ডিভিশন",
    div_subtitle: "সর্বত্র শ্রেষ্ঠত্ব",
    forgot_password: "পাসওয়ার্ড ভুলে গেছেন?",
    btn_reset_state: "🔄 সিস্টেম ডাটা রিসেট করুন",
    login_caps: "লগইন",
    label_username: "ইউজারনেম অথবা ফোন নম্বর",
    label_password: "পাসওয়ার্ড",
    btn_login: "প্রবেশ করুন",
    test_credentials_title: "টেস্ট অ্যাকাউন্টস (পাসওয়ার্ড: temp123)",
    setup_step_1: "নিরাপত্তা",
    setup_step_2: "ভেরিফিকেশন",
    setup_step_3: "ইউজার তথ্য",
    pwd_heading: "নতুন পাসওয়ার্ড নির্ধারণ করুন",
    pwd_desc: "আপনার অ্যাকাউন্ট সুরক্ষিত করতে পাসওয়ার্ড আপডেট করুন।",
    label_new_pwd: "নতুন পাসওয়ার্ড",
    label_confirm_pwd: "পাসওয়ার্ড নিশ্চিত করুন",
    pwd_weak: "দুর্বল - কমপক্ষে ৮টি অক্ষর, সংখ্যা ও স্পেশাল ক্যারেক্টার লাগবে",
    pwd_medium: "মাঝারি পাসওয়ার্ড",
    pwd_strong: "শক্তিশালী পাসওয়ার্ড",
    pwd_match: "পাসওয়ার্ড দুটি মিলেছে।",
    pwd_mismatch: "পাসওয়ার্ড দুটি মেলেনি।",
    otp_heading: "মোবাইল ভেরিফিকেশন",
    otp_desc: "আপনার অফিসিয়াল মোবাইল নম্বর প্রদান করুন। নম্বরে একটি ওটিপি (OTP) পাঠানো হবে।",
    label_mobile: "অফিসিয়াল মোবাইল নম্বর",
    otp_sent_msg: "একটি ওটিপি পাঠানো হয়েছে। নিচের নোটিফিকেশন চেক করে এখানে লিখুন:",
    otp_not_received: "ওটিপি পাননি?",
    otp_resend: "পুনরায় ওটিপি পাঠান",
    profile_heading: "ইউজার তথ্য আপডেট করুন",
    profile_desc: "আপনার প্রাতিষ্ঠানিক তথ্য প্রদান করুন এবং ডিরেক্টরির জন্য একটি প্রোফাইল ছবি নির্বাচন করুন।",
    label_rank: "পদবি (Rank)",
    label_ba_no: "আর্মি/বিএ নম্বর",
    label_fullname: "পূর্ণ নাম",
    label_profile_pic: "প্রোফাইল ছবি নির্বাচন করুন",
    btn_upload: "অথবা নিজের ছবি আপলোড করুন",
    btn_back: "ফিরে যান",
    btn_next: "পরবর্তী ধাপ",
    menu_header: "মেনু নেভিগেশন",
    menu_overview: "ডিভিশনাল সামগ্রিক চিত্র",
    menu_units: "ইউনিট লজিস্টিকস",
    menu_directory: "যোগাযোগ ডিরেক্টরি",
    tree_header: "কমান্ড কাঠামো",
    card_vehicles: "মোট যানবাহন",
    card_pol: "মোট জ্বালানি (POL)",
    card_mess: "মেস স্টাফ",
    card_personnel: "সেনা সদস্য সংখ্যা",
    chart_agg_title: "ব্রিগেডগুলোর তুলনামূলক সম্পদ ইনডেক্স",
    chart_breakdown_title: "সম্পদ বণ্টন ম্যাট্রিক্স",
    chart_breakdown_desc: "সমগ্র ডিভিশনের মোট সম্পদের বণ্টন শতকরা হার",
    table_agg_title: "৫৫ পদাতিক ডিভিশনের লজিস্টিকস সামারি",
    th_hq: "ব্রিগেড / সদর দপ্তর",
    th_vehicles: "যানবাহন (চলতি/মোট)",
    th_pol: "জ্বালানি (POL - লিটার)",
    th_mess: "মেস স্টাফ সংখ্যা",
    th_strength: "উপস্থিত সেনা সদস্য",
    th_unit: "অধীনস্থ ইউনিট",
    th_action: "অ্যাকশন",
    units_title: "অধীনস্থ ইউনিট লজিস্টিক শিট",
    editor_heading: "ডাটা এন্ট্রি এবং এডিট প্যানেল",
    read_only_alert: "আপনার রোলটি রিড-ওনলি (Read-Only)। ডাটা এডিট লক করা আছে।",
    lbl_vehicles_avail: "উপলব্ধ যানবাহন (সংখ্যা)",
    lbl_vehicles_total: "মোট যানবাহন সংখ্যা (অনুমোদিত)",
    lbl_pol: "জ্বালানি মজুদ (POL - লিটার)",
    lbl_mess_cook: "নিযুক্ত কুক (সংখ্যা)",
    lbl_mess_waiter: "নিযুক্ত ওয়েটার (সংখ্যা)",
    lbl_strength: "উপস্থিত সেনা সদস্য সংখ্যা (Present)",
    btn_save: "ডাটা সংরক্ষণ ও লাইভ আপডেট",
    directory_title: "ডিভিশনাল স্বয়ংক্রিয় যোগাযোগ ডিরেক্টরি",
    directory_search_placeholder: "বিএ নম্বর, পদবি বা নাম দিয়ে খুঁজুন...",
    opt_all_units: "সকল ব্রিগেড ও ইউনিট",
    sim_heading: "রোল সিমুলেটর প্যানেল",
    sim_desc: "যেকোনো আইডেন্টিটি নির্বাচন করে সুইচ করুন। ক্লার্ক নিজ আওতাভুক্ত ইউনিটের ডাটা এডিট করতে পারবেন, কর্মকর্তারা রিড-ওনলি ভিউ পাবেন।",
    // Toast notifications
    toast_login_success: "লগইন সফল হয়েছে। স্বাগতম!",
    toast_setup_complete: "প্রোফাইল সেটআপ সম্পন্ন হয়েছে। ড্যাশবোর্ডে প্রবেশ করা হচ্ছে।",
    toast_otp_sent: "মোবাইল গেটওয়ে: আপনার ওটিপি কোড হলো ",
    toast_otp_error: "ভেরিফিকেশন ব্যর্থ হয়েছে। সঠিক ওটিপি প্রবেশ করান।",
    toast_otp_verified: "মোবাইল নম্বর সফলভাবে ভেরিফাই করা হয়েছে।",
    toast_pwd_mismatch: "পাসওয়ার্ড দুটির মিল পাওয়া যায়নি।",
    toast_pwd_short: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    toast_data_saved: "ডাটাবেজ সফলভাবে সংরক্ষিত এবং রিয়েল-টাইমে আপডেট করা হয়েছে!",
    toast_incoming_call: "কল করা হচ্ছে: ",
    tab_dashboard: "ড্যাশবোর্ড",
    tab_veh: "যানবাহন",
    tab_mess_staff: "মেসস্টাফ",
    tab_pol: "পিওএল",
    tab_manpower: "জনবল",
    tab_contact: "যোগাযোগ",
    tab_admin_hub: "এডমিন হাব",
    menu_edit_profile: "ইউজার তথ্য সংশোধন",
    menu_logout: "লগআউট",
    modal_edit_title: "ইউজার তথ্য সংশোধন",
    modal_edit_desc: "আপনার প্রশাসনিক প্রোফাইল বিবরণ নিচে পরিবর্তন করুন।",
    btn_cancel: "বাতিল",
    btn_save_changes: "পরিবর্তন সংরক্ষণ করুন",
    crop_modal_title: "প্রোফাইল ছবি ক্রপ করুন",
    btn_crop_apply: "ক্রপ ও প্রয়োগ করুন",
    menu_change_password: "পাসওয়ার্ড পরিবর্তন",
    modal_change_pwd_title: "পাসওয়ার্ড পরিবর্তন করুন",
    label_current_pwd: "বর্তমান পাসওয়ার্ড",
    btn_update_password: "পাসওয়ার্ড আপডেট করুন",
    btn_verify_update: "যাচাই ও আপডেট",
    change_pwd_otp_desc: "আপনার অফিসিয়াল নম্বরে একটি ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।",
    welcome_title: "ডিভ ড্যাশবোর্ডে স্বাগতম",
    card_title_veh_state: "যানবাহনের অবস্থা সংক্ষেপ",
    card_title_held: "বিদ্যমান",
    card_title_pol_state: "পিওএল স্টেট অর্থবছর-২০২৫-২৬",
    card_title_total_exp: "মোট খরচ",
    card_title_mess_summary: "মেসস্টাফ এবং এনসি (ই) এর পরিসংখ্যান",
    card_title_bugler_summary: "বিউগলার সংক্ষেপ",
    TH_POL_GRADE: "পিওএল গ্রেড",
    th_type_of_veh: "যানবাহনের ধরন",
    th_auth: "অনুমোদিত",
    th_held: "বিদ্যমান",
    th_or: "ওআর",
    th_ur: "ইউআর",
    th_long_rd: "লং আরডি",
    th_of_rd: "অফ আরডি",
    th_att: "সংযুক্ত",
    th_sur: "উদ্বৃত্ত",
    th_pol_grade: "পিওএল গ্রেড",
    th_alt_from_area: "এলাকা হতে বরাদ্দ",
    th_alt_to_bde: "ব্রিগেড/ইউনিটে বরাদ্দ",
    th_bal: "অবশিষ্ট",
    th_type_of_mess: "মেসস্টাফের ধরন",
    th_posted: "পোস্টেড",
    th_present: "উপস্থিত",
    th_absent: "অনুপস্থিত",
    th_lve: "ছুটি",
    th_course: "কোর্স",
    th_total: "মোট",
    row_jeep: "জিপ",
    row_pickup: "পিকআপ",
    row_3ton: "৩ টন",
    row_diesel: "ডিজেল",
    row_ms74: "এমএস-৭৪",
    row_100octane: "১০০ অকটেন",
    row_messwaiter: "মেসওয়েটার",
    row_masalchi: "মশালচি",
    row_cook_m: "কুক (মেস)",
    row_cook_u: "কুক (ইউনিট)",
    row_nce: "এনসি (ই)",
    lbl_total_exp: "মোট ব্যয়",
    lbl_last_month_exp: "গত মাসের ব্যয়"
  }
};

// --- Core Application State ---
let state = {
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
const ROLE_TABS = {
  units: ["Dashboard", "Veh", "Mess-staff", "POL", "Manpower"],
  brigades: ["Dashboard", "Veh", "Mess-staff", "POL", "Manpower", "Contact"],
  division: ["Dashboard", "Veh", "Mess-staff", "POL", "Manpower", "Contact", "Admin Hub"]
};

function getRoleCategory(roleId) {
  const role = Number(roleId);
  if (role === 1 || role === 2) return "units";
  if (role === 3 || role === 4) return "brigades";
  if (role === 5 || role === 6) return "division";
  return "units";
}

function updateNavIndicator(noTransition = false) {
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

function renderNavigationTabs() {
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

function syncLanguageSwitchers() {
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


// ==========================================
// DB INITIALIZATION & LOCALSTORAGE STORAGE
// ==========================================
function initDatabases() {
  // Self-healing database check to automatically migrate to the new 61-user config and clear legacy spellings
  let storedUsers = localStorage.getItem("q_portal_users");
  if (storedUsers) {
    try {
      const parsed = JSON.parse(storedUsers);
      let needsReset = Object.keys(parsed).length !== IMMUTABLE_USER_REGISTRY.length;
      if (!needsReset) {
        // Completely eradicate any old clrk instances in stored database values
        needsReset = Object.values(parsed).some(u => u.appointment && u.appointment.includes("Clrk"));
      }
      if (needsReset) {
        localStorage.removeItem("q_portal_users");
        localStorage.removeItem("q_portal_logistics");
      }
    } catch(err) {
      localStorage.removeItem("q_portal_users");
    }
  }

  if (!localStorage.getItem("q_portal_users")) {
    localStorage.setItem("q_portal_users", JSON.stringify(INITIAL_USERS));
  }
  state.usersDB = JSON.parse(localStorage.getItem("q_portal_users"));

  // Self-healing migration to ensure 'assigned', 'assignedUnit', and 'unitName' are populated for all users in DB
  let updatedUsers = false;
  Object.keys(state.usersDB).forEach(username => {
    const user = state.usersDB[username];
    const regUser = IMMUTABLE_USER_REGISTRY.find(ru => ru.username === username);
    if (regUser) {
      const canonicalAssigned = regUser.assigned === "Rawshan Ara Regt Artly" ? "Rawshan Ara Regt Arty" : regUser.assigned;
      if (!user.assigned || user.assigned !== canonicalAssigned) {
        user.assigned = canonicalAssigned;
        updatedUsers = true;
      }
      if (!user.assignedUnit || user.assignedUnit !== canonicalAssigned) {
        user.assignedUnit = canonicalAssigned;
        updatedUsers = true;
      }
      if (!user.unitName || user.unitName !== canonicalAssigned) {
        user.unitName = canonicalAssigned;
        updatedUsers = true;
      }
    }
  });
  if (updatedUsers) {
    saveUsersDB();
  }

  if (!localStorage.getItem("q_portal_logistics")) {
    localStorage.setItem("q_portal_logistics", JSON.stringify(INITIAL_LOGISTICS));
  }
  state.logisticsDB = JSON.parse(localStorage.getItem("q_portal_logistics"));
}

function saveUsersDB() {
  localStorage.setItem("q_portal_users", JSON.stringify(state.usersDB));
}

function saveLogisticsDB() {
  localStorage.setItem("q_portal_logistics", JSON.stringify(state.logisticsDB));
  localStorage.setItem("q_portal_last_update", Date.now().toString());
}

window.addEventListener("storage", (e) => {
  if (e.key === "q_portal_logistics" || e.key === "q_portal_last_update") {
    state.logisticsDB = JSON.parse(localStorage.getItem("q_portal_logistics"));
    if (state.activeView === "dashboard") {
      showToast("Live Update Broadcast Received", "System dynamically synced resource sheets in real time.", "success");
      renderDashboardContent();
    }
  }
});

// ==========================================
// TOAST NOTIFICATIONS HELPER
// ==========================================
function showToast(title, body, type = "info") {
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

// ==========================================
// BILINGUAL TRANSLATION HANDLER
// ==========================================
function setLanguage(lang) {
  state.language = lang;
  
  // Navbar toggle update (Safeguarded)
  const langLabel = document.getElementById("lang-label");
  if (langLabel) {
    langLabel.innerText = lang === "en" ? "বাংলা" : "English";
  }
  
  // Sync all switchers
  syncLanguageSwitchers();

  const translationsMap = TRANSLATIONS[lang];
  
  // Translate nodes with data-translate attribute
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translationsMap[key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", translationsMap[key]);
      } else {
        el.innerText = translationsMap[key];
      }
    }
  });

  // Re-render layout aspects that contain text variables
  if (state.activeView === "dashboard") {
    renderNavigationTabs();
    
    // Update dashboard header identification number if user exists
    if (state.currentUser) {
      const baEl = document.getElementById("header-user-ba");
      if (baEl) baEl.innerText = state.currentUser.baNo || "";
      const rankEl = document.getElementById("header-user-rank");
      if (rankEl) rankEl.innerText = toTitleCase(state.currentUser.rank);
    }
    
    renderHierarchyTree();
    renderDashboardContent();
    renderRoleImpersonatorList();
    renderPortalMainContent();
  }

  // Dynamically translate Army No vs BA No label in Step 3 and Edit Profile Modal
  const labelBaNo = document.querySelector("label[for='setup-ba-no']");
  const labelEditBaNo = document.querySelector("label[for='edit-ba-no']");
  if (state.currentUser) {
    const user = state.currentUser;
    const roleId = Number(user.role);
    const isArmyNo = [1, 3, 5].includes(roleId);

    if (labelBaNo) {
      labelBaNo.innerText = isArmyNo ? (lang === "en" ? "Army No" : "আর্মি নম্বর") : (lang === "en" ? "BA No" : "বিএ নম্বর");
    }
    if (labelEditBaNo) {
      labelEditBaNo.innerText = isArmyNo ? (lang === "en" ? "Army No" : "আর্মি নম্বর") : (lang === "en" ? "BA No" : "বিএ নম্বর");
    }
  }

  // Re-run setup password feedback translation
  const newPwdField = document.getElementById("setup-new-password");
  if (newPwdField) {
    checkPasswordStrength(newPwdField.value);
    checkPasswordMatch();
  }
}

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================
function handleLogin() {
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

  // Lookup user by Username OR Mobile Number (Exact, stripped digits, or last 4 digits)
  let user = state.usersDB[userInp];
  if (!user) {
    user = Object.values(state.usersDB).find(u => {
      if (!u.mobile) return false;
      const cleanMobile = u.mobile.replace(/\D/g, "");
      const cleanInput = userInp.replace(/\D/g, "");
      return cleanMobile === cleanInput || u.mobile === userInp || u.mobile.slice(-4) === userInp;
    });
  }

  if (!user) {
    if (usernameError) {
      usernameError.innerText = state.language === "en" ? "Incorrect username or phone." : "ইউজারনেম বা ফোন নম্বর সঠিক নয়।";
      usernameError.style.display = "block";
    }
    return;
  }

  if (user.password === passInp) {
    state.currentUser = user;
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
    if (passwordError) {
      if (passInp === "temp123" && !user.is_first_login) {
        passwordError.innerText = state.language === "en" 
          ? "You entered an old password." 
          : "আপনি একটি পুরাতন পাসওয়ার্ড লিখেছেন।";
      } else {
        passwordError.innerText = state.language === "en" 
          ? "Incorrect password." 
          : "পাসওয়ার্ড সঠিক নয়।";
      }
      passwordError.style.display = "block";
    }
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

function resetSystemState() {
  localStorage.removeItem("q_portal_users");
  localStorage.removeItem("q_portal_logistics");
  initDatabases();
  showToast(
    state.language === "en" ? "System Reset" : "সিস্টেম রিসেট",
    state.language === "en" ? "Demo accounts and setup states have been reset." : "ডেমো অ্যাকাউন্ট এবং সেটআপ স্টেট রিসেট করা হয়েছে।",
    "success"
  );
  handleLogout();
}

// Router switcher with unified morph container support
function switchView(viewName) {
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

// ==========================================
// 3-STEP SETUP WIZARD LOGIC
// ==========================================
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

function handleSetupNext() {
  if (validateSetupStep()) {
    if (state.currentSetupStep < 3) {
      state.currentSetupStep++;
      updateSetupWizardUI();
    } else {
      const user = state.currentUser;
      const userObj = state.usersDB[user.username];
      
      userObj.password = document.getElementById("setup-new-password").value;
      userObj.mobile = document.getElementById("setup-mobile").value.trim();
      userObj.baNo = document.getElementById("setup-ba-no").value.trim();
      userObj.rank = document.getElementById("setup-rank").value;
      userObj.fullName = document.getElementById("setup-fullname").value.trim();
      userObj.avatar = state.selectedAvatar;
      userObj.is_first_login = false;
      
      saveUsersDB();
      state.currentUser = userObj;
      
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

function toTitleCase(str) {
  if (!str) return "";
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function normalizeAppointment(appt) {
  if (!appt) return "";
  const clean = appt.trim().toLowerCase();
  if (clean === "q clk" || clean === "q clq") return "Q Clk";
  if (clean === "aaqmg") return "AAQMG";
  if (clean === "daqmg") return "DAQMG";
  if (clean === "qm") return "QM";
  if (clean === "oc") return "OC";
  return appt;
}

// ==========================================
// MAIN DASHBOARD LOGIC
// ==========================================
function initDashboard(preserveTab = false) {
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

function switchSubContent(subId) {
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

function renderDashboardContent() {
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
        <td><strong>${bdeName}</strong></td>
        <td>${stats.vAvail} / ${stats.vTotal} <span class="badge ${stats.vAvail/stats.vTotal > 0.75 ? "badge-success" : "badge-warning"}">${Math.round(stats.vAvail/stats.vTotal*100)}%</span></td>
        <td>${stats.pol.toLocaleString()} L</td>
        <td>${stats.cook + stats.waiter}</td>
        <td><strong>${stats.strength.toLocaleString()}</strong></td>
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

function computeAggregates() {
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

// ==========================================
// MINIMALIST GRAPH DESIGN Sync
// ==========================================
function updateDashboardCharts(aggregates) {
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

// ==========================================
// COLLAPSIBLE HIERARCHY TREE LOGIC
// ==========================================
function renderHierarchyTree() {
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
            📄 ${u}
          </li>
        `).join("")}
      </ul>
    `;
    treeTarget.appendChild(bdeLi);
  });
}

function selectUnitFromTree(unitName) {
  switchSubContent("units");
  const bdeName = Object.keys(BRIGADES).find(b => BRIGADES[b].includes(unitName));
  const filterSelect = document.getElementById("units-brigade-filter");
  filterSelect.value = bdeName;
  
  renderUnitsManagementTable();
  selectUnitForEditing(unitName);
}

// ==========================================
// UNITS MANAGEMENT & SECURITY ROLES LOCK
// ==========================================
function populateUnitsDropdown() {
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

function renderUnitsManagementTable() {
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
      <td><strong>${unit}</strong></td>
      <td>${stats.vAvail} / ${stats.vTotal}</td>
      <td>${stats.pol} L</td>
      <td>${stats.cook + stats.waiter}</td>
      <td>${stats.strength}</td>
      <td>
        <button class="btn-toggle" style="padding: 4px 8px; font-size:11px;" onclick="selectUnitForEditing('${unit}')">
          ${hasEditPermission ? (state.language === "en" ? "Update" : "আপডেট") : (state.language === "en" ? "View" : "বিস্তারিত")}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function checkWriteAccess(unitName) {
  const role = state.currentUser.role;
  
  if (role === 5) return true;
  if (role === 3) {
    const userBde = state.currentUser.scopeBde;
    return BRIGADES[userBde] && BRIGADES[userBde].includes(unitName);
  }
  if (role === 1) {
    return state.currentUser.scopeUnit === unitName;
  }
  return false;
}

function selectUnitForEditing(unitName) {
  state.activeEditorUnit = unitName;
  
  const stats = state.logisticsDB[unitName];
  if (!stats) return;

  document.getElementById("editor-active-unit-label").innerText = `${state.language === "en" ? "Target Unit: " : "টার্গেট ইউনিট: "} ${unitName}`;

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

function handleSaveUnitData() {
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

  state.logisticsDB[unit] = { vAvail, vTotal, pol, cook, waiter, strength };
  saveLogisticsDB();

  showToast(
    state.language === "en" ? "Data Aggregated" : "ডাটা সংগৃহীত", 
    TRANSLATIONS[state.language].toast_data_saved, 
    "success"
  );

  renderUnitsManagementTable();
  renderDashboardContent();
}

// ==========================================
// CONTACT DIRECTORY LOGIC
// ==========================================
function renderDirectoryCards() {
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
        <div class="contact-unit">🏢 ${targetUnit}</div>
        <div style="font-size:11px; margin-top:2px; font-weight:600; color:var(--primary);">📞 ${u.mobile}</div>
      </div>
      <button class="contact-call-btn" onclick="simulateCall('${u.fullName}', '${u.mobile}')" title="Call Contact">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </button>
    `;
    gridContainer.appendChild(card);
  });
}

function populateDirectoryUnitFilters() {
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
    opt.innerText = sc;
    select.appendChild(opt);
  });

  select.value = currentVal || "ALL";
}

function simulateCall(name, number) {
  showToast(
    TRANSLATIONS[state.language].toast_incoming_call + name,
    `Simulating official SECURE dial: ${number}...`,
    "info"
  );
}

// ==========================================
// ROLE SIMULATOR & IMPOSTER CONTROLS
// ==========================================
function renderRoleImpersonatorList() {
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
        <span style="font-size:10px; color: var(--text-muted)">Scope: ${scopeText}</span>
      </div>
      <span class="role-badge">Role-${u.role}</span>
    `;
    
    btn.onclick = () => impersonateRole(u.username);
    list.appendChild(btn);
  });
}

function impersonateRole(username) {
  const user = state.usersDB[username];
  if (!user) return;

  state.currentUser = user;
  
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

// ==========================================
// EDIT USER PROFILE MODAL & DROPDOWN LOGIC
// ==========================================
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

function saveEditProfile() {
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

  // Update state
  user.baNo = baNo;
  user.fullName = fullName;
  user.rank = rank;
  if (state.selectedEditAvatar) {
    user.avatar = state.selectedEditAvatar;
  }

  // Save back to databases
  state.usersDB[user.username] = user;
  saveUsersDB();

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
}

// ==========================================
// CHANGE PASSWORD MODAL & VERIFICATION LOGIC
// ==========================================
let cpTimerInterval = null;
let cpOtpCode = "";
let cpTempNewPassword = "";

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

function handleVerifyOTPStep2() {
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
  user.password = cpTempNewPassword;
  state.usersDB[user.username] = user;
  saveUsersDB();

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

// ==========================================
// CLIENT-SIDE IMAGE CROPPING HELPERS
// ==========================================
let activeCropperInstance = null;
let currentCropFileInput = null;

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


// ==========================================
// INDIAN NUMBER FORMATTING & BENGALI DIGITS
// ==========================================
function formatIndianNumber(num) {
  let parts = Number(num).toFixed(3).split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  let otherParts = parts[0].substring(0, parts[0].length - 3);
  if (otherParts !== '') {
    lastThree = ',' + lastThree;
  }
  let res = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return res + (parts[1] ? '.' + parts[1] : '');
}

function convertDigitsToBengali(numberStr) {
  const bnDigits = {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'};
  return numberStr.toString().replace(/[0-9]/g, digit => bnDigits[digit]);
}

function formatDisplayNumber(num) {
  const formatted = formatIndianNumber(num);
  if (state.language === 'bn') {
    return convertDigitsToBengali(formatted);
  }
  return formatted;
}

// ==========================================
// MOCK DATA FOR NEW WIDGETS & DROPDOWN CONFIGS
// ==========================================
const DONUT_MOCK_DATA = {
  "Jeep": { held: 180, ur: 40, att: 80, sur: 60 },
  "pickup": { held: 140, ur: 30, att: 60, sur: 50 },
  "3 Ton": { held: 220, ur: 50, att: 110, sur: 60 }
};

const LINE_MOCK_DATA = {
  "2023-24": {
    "Diesel": { total: 1050000, last: 85000, data: [78000, 75000, 85000, 82000, 80000, 83000, 88000, 92000, 86000, 84000, 82000, 90000] },
    "MS-74": { total: 420000, last: 35000, data: [32000, 30000, 34000, 33000, 31000, 32000, 35000, 37000, 34000, 33000, 32000, 36000] },
    "100 Octane": { total: 180000, last: 15000, data: [14000, 13000, 15000, 14000, 13000, 14000, 16000, 17000, 15000, 14000, 13000, 16000] }
  },
  "2024-25": {
    "Diesel": { total: 1100000, last: 88000, data: [80000, 78000, 88000, 85000, 83000, 86000, 91000, 95000, 89000, 87000, 85000, 93000] },
    "MS-74": { total: 450000, last: 38000, data: [34000, 32000, 36000, 35000, 33000, 34000, 37000, 39000, 36000, 35000, 34000, 38000] },
    "100 Octane": { total: 195000, last: 16500, data: [15000, 14000, 16000, 15000, 14000, 15000, 17000, 18000, 16000, 15000, 14000, 17000] }
  },
  "2025-26": {
    "Diesel": { total: 1140560, last: 90560, data: [82000, 81000, 91000, 89000, 87000, 90000, 94000, 98000, 92000, 90000, 88000, 95000] },
    "MS-74": { total: 480000, last: 40000, data: [35000, 34000, 39000, 38000, 36000, 37000, 41000, 43000, 39000, 38000, 37000, 42000] },
    "100 Octane": { total: 210000, last: 18000, data: [16000, 15000, 17000, 16000, 15000, 16000, 18000, 19000, 17000, 16000, 15000, 18000] }
  },
  "2026-27": {
    "Diesel": { total: 1200000, last: 95000, data: [85000, 83000, 94000, 92000, 90000, 93000, 98000, 102000, 96000, 94000, 92000, 99000] },
    "MS-74": { total: 500000, last: 42000, data: [36000, 35000, 40000, 39000, 37000, 38000, 42000, 44000, 40000, 39000, 38000, 43000] },
    "100 Octane": { total: 220000, last: 19000, data: [17000, 16000, 18000, 17000, 16000, 17000, 19000, 20000, 18000, 17000, 16000, 19000] }
  }
};

// ==========================================
// RENDER DISPATCHER & PORTAL CONTENT VIEWS
// ==========================================
function renderPortalMainContent() {
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

function renderMainDashboard(container) {
  if (!state.dashboard) {
    state.dashboard = {
      donutVehicle: "Jeep",
      lineYear: "2025-26",
      lineGrade: "Diesel"
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

  const initialLineVal = LINE_MOCK_DATA[state.dashboard.lineYear][state.dashboard.lineGrade];

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
                    <th rowspan="2">${t("th_type_of_veh")}</th>
                    <th rowspan="2">${t("th_auth")}</th>
                    <th rowspan="2">${t("th_held")}</th>
                    <th rowspan="2">${t("th_or")}</th>
                    <th rowspan="2">${t("th_ur")}</th>
                    <th rowspan="2">${t("th_long_rd")}</th>
                    <th rowspan="2">${t("th_of_rd")}</th>
                    <th colspan="2">${t("th_att")}</th>
                    <th colspan="2">${t("th_sur")}</th>
                  </tr>
                  <tr>
                    <th>${t("th_long_rd")}</th>
                    <th>${t("th_of_rd")}</th>
                    <th>${t("th_long_rd")}</th>
                    <th>${t("th_of_rd")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${t("row_jeep")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_pickup")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_3ton")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
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
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>${t("th_pol_grade")}</th>
                    <th>${t("th_alt_from_area")}</th>
                    <th>${t("th_alt_to_bde")}</th>
                    <th>${t("th_bal")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${t("row_diesel")}</strong></td>
                    <td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_ms74")}</strong></td>
                    <td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_100octane")}</strong></td>
                    <td></td><td></td><td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Card 4: Total Exp Line Chart -->
          <div class="dashboard-card">
            <div class="card-header-row">
              <h4 class="card-header-title">${t("card_title_total_exp")}</h4>
              <div style="display: flex; gap: 8px;">
                <select id="line-year-select" class="mini-dropdown">
                  <option value="2023-24" ${state.dashboard.lineYear === "2023-24" ? "selected" : ""}>2023-24</option>
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
            </div>
            <div style="display: flex; width: 100%; align-items: center; gap: 20px; flex: 1;">
              <!-- Left side stats -->
              <div style="flex: 0 0 160px; display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; gap: 6px; align-items: center;">
                  <span id="badge-year" class="chart-badge">${currentYearDisplay}</span>
                  <span id="badge-grade" class="chart-badge">${currentGradeDisplay}</span>
                </div>
                <div>
                  <span style="font-size: 11px; font-weight: 600; color: #64748b; display: block;">${t("lbl_total_exp")}</span>
                  <span id="total-exp-value" style="font-size: 18px; font-weight: 800; color: #1e293b; display: block; font-family: 'Inter', sans-serif;">${formatDisplayNumber(initialLineVal.total)}</span>
                </div>
                <div>
                  <span style="font-size: 11px; font-weight: 600; color: #64748b; display: block;">${t("lbl_last_month_exp")}</span>
                  <span id="last-month-value" style="font-size: 15px; font-weight: 700; color: #475569; display: block; font-family: 'Inter', sans-serif;">${formatDisplayNumber(initialLineVal.last)}</span>
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
                    <th rowspan="2">${t("th_type_of_mess")}</th>
                    <th rowspan="2">${t("th_auth")}</th>
                    <th rowspan="2">${t("th_posted")}</th>
                    <th rowspan="2">${t("th_present")}</th>
                    <th colspan="4">${t("th_absent")}</th>
                  </tr>
                  <tr>
                    <th>${t("th_lve")}</th>
                    <th>${t("th_course")}</th>
                    <th>${t("th_att")}</th>
                    <th>${t("th_total")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${t("row_messwaiter")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_masalchi")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_cook_m")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_cook_u")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td><strong>${t("row_nce")}</strong></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
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
                    <th rowspan="2">${state.language === "bn" ? "মোট (Tottal)" : "Tottal"}</th>
                    <th rowspan="2">${t("th_present")}</th>
                    <th colspan="4">${t("th_absent")}</th>
                  </tr>
                  <tr>
                    <th>${t("th_lve")}</th>
                    <th>${t("th_course")}</th>
                    <th>${t("th_att")}</th>
                    <th>${t("th_total")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td><td></td><td></td><td></td><td></td><td></td>
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
      initMainDashboardCharts();
    };
  }

  const lineYearSelect = document.getElementById("line-year-select");
  if (lineYearSelect) {
    lineYearSelect.onchange = (e) => {
      state.dashboard.lineYear = e.target.value;
      // Update year label & stats
      const currentYearText = state.language === "bn" ? convertDigitsToBengali(state.dashboard.lineYear) : state.dashboard.lineYear;
      document.getElementById("badge-year").innerText = currentYearText;
      const dataVal = LINE_MOCK_DATA[state.dashboard.lineYear][state.dashboard.lineGrade];
      document.getElementById("total-exp-value").innerText = formatDisplayNumber(dataVal.total);
      document.getElementById("last-month-value").innerText = formatDisplayNumber(dataVal.last);
      initMainDashboardCharts();
    };
  }

  const lineGradeSelect = document.getElementById("line-grade-select");
  if (lineGradeSelect) {
    lineGradeSelect.onchange = (e) => {
      state.dashboard.lineGrade = e.target.value;
      // Update grade label & stats
      document.getElementById("badge-grade").innerText = getGradeLabel(state.dashboard.lineGrade);
      const dataVal = LINE_MOCK_DATA[state.dashboard.lineYear][state.dashboard.lineGrade];
      document.getElementById("total-exp-value").innerText = formatDisplayNumber(dataVal.total);
      document.getElementById("last-month-value").innerText = formatDisplayNumber(dataVal.last);
      initMainDashboardCharts();
    };
  }

  // Initialize charts after markup injects
  initMainDashboardCharts();
}

function initMainDashboardCharts() {
  // --- Donut Chart Rendering ---
  const donutCanvas = document.getElementById("held-donut-chart");
  if (donutCanvas) {
    if (state.charts.donut) {
      state.charts.donut.destroy();
    }
    
    const donutCtx = donutCanvas.getContext("2d");
    const donutVal = DONUT_MOCK_DATA[state.dashboard.donutVehicle || "Jeep"];

    // Update centered text overlay values
    const centerValEl = document.getElementById("donut-center-val");
    if (centerValEl) {
      centerValEl.innerText = state.language === 'bn' ? convertDigitsToBengali(donutVal.held) : donutVal.held;
    }
    const centerLblEl = document.getElementById("donut-center-label");
    if (centerLblEl) {
      centerLblEl.innerText = TRANSLATIONS[state.language]["card_title_held"] || "Held";
    }

    state.charts.donut = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['UR', 'Att', 'Sur'],
        datasets: [{
          data: [donutVal.ur, donutVal.att, donutVal.sur],
          backgroundColor: [
            'rgba(186, 230, 253, 0.85)', // UR: soft blue
            'rgba(254, 215, 170, 0.85)', // Att: soft orange
            'rgba(233, 213, 255, 0.85)'  // Sur: soft lavender
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'left',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: {
                family: "'Inter', sans-serif",
                size: 11,
                weight: '600'
              },
              color: '#475569'
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                let val = context.raw || 0;
                if (state.language === 'bn') {
                  label = label === 'UR' ? 'ইউআর' : (label === 'Att' ? 'সংযুক্ত' : 'উদ্বৃত্ত');
                  return label + ': ' + convertDigitsToBengali(val);
                }
                return label + ': ' + val;
              }
            }
          }
        }
      }
    });
  }

  // --- Line Chart Rendering ---
  const lineCanvas = document.getElementById("total-exp-line-chart");
  if (lineCanvas) {
    if (state.charts.line) {
      state.charts.line.destroy();
    }

    const lineCtx = lineCanvas.getContext("2d");
    const lineVal = LINE_MOCK_DATA[state.dashboard.lineYear || "2025-26"][state.dashboard.lineGrade || "Diesel"];

    const gradient = lineCtx.createLinearGradient(0, 0, 0, 140);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    const monthsEn = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthsBn = ['জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];
    const labels = state.language === 'bn' ? monthsBn : monthsEn;

    state.charts.line = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: lineVal.data,
          borderColor: '#3b82f6',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          backgroundColor: gradient,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const val = context.raw;
                return (state.language === 'bn' ? 'ব্যয়: ' : 'Exp: ') + formatDisplayNumber(val);
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 9,
                weight: '600'
              },
              color: '#64748b'
            }
          },
          y: {
            grid: {
              color: 'rgba(226, 232, 240, 0.4)',
              drawBorder: false
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 8,
                weight: '600'
              },
              color: '#64748b',
              callback: function(value) {
                return formatDisplayNumber(value);
              }
            }
          }
        }
      }
    });
  }
}


// ==========================================
// REGISTER EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initDatabases();

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
  document.getElementById("btn-login-submit").addEventListener("click", handleLogin);
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
