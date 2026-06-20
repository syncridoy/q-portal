import { state } from './state.js';

// --- Translation Dictionary (Bilingual support) ---
export const TRANSLATIONS = {
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
    th_of_rd: "Short Rd",
    th_att: "Att",
    th_sur: "Sur",
    th_pol_grade: "POL Grade",
    th_alt_from_area: "Alt from Area",
    th_alt_to_bde: "Alt to<br>Bde/Unite",
    th_bal: "Bal",
    th_type_of_mess: "Type of<br>Mess-Staff",
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
    lbl_total_alt: "Allocation\nTotal\navg",
    lbl_total_exp: "Expenditure\nTotal\navg",
    lbl_alloc_heading: "Allocation",
    lbl_exp_heading: "Expenditure",
    lbl_total_label: "Total",
    lbl_avg_label: "avg",
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
    th_of_rd: "শর্ট আরডি",
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
    lbl_total_alt: "বরাদ্দ\nমোট\nগড়",
    lbl_total_exp: "ব্যয়\nমোট\nগড়",
    lbl_alloc_heading: "বরাদ্দ",
    lbl_exp_heading: "ব্যয়",
    lbl_total_label: "মোট",
    lbl_avg_label: "গড়",
    lbl_last_month_exp: "গত মাসের ব্যয়"
  }
};

export function t(key) {
  return TRANSLATIONS[state.language][key] || key;
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

export function setLanguage(lang) {
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

  // Dispatch custom languagechange event to decuople rendering from translation engine
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
}

export function convertDigitsToBengali(numberStr) {
  const bnDigits = {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'};
  return numberStr.toString().replace(/[0-9]/g, digit => bnDigits[digit]);
}

export function formatPOLNumber(num) {
  if (num === null || num === undefined || num === '') return '';
  let parts = Number(num).toFixed(3).split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  let otherParts = parts[0].substring(0, parts[0].length - 3);
  if (otherParts !== '') {
    lastThree = ',' + lastThree;
  }
  let res = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  const formatted = res + (parts[1] ? '.' + parts[1] : '');
  if (state.language === 'bn') {
    return convertDigitsToBengali(formatted);
  }
  return formatted;
}

export function formatQtyNumber(num) {
  if (num === null || num === undefined || num === '') return '';
  let val = Math.round(Number(num));
  let str = val.toString();
  
  if (val >= 0 && val <= 9) {
    str = '0' + str;
  }
  
  if (val >= 1000) {
    let lastThree = str.substring(str.length - 3);
    let otherParts = str.substring(0, str.length - 3);
    if (otherParts !== '') {
      lastThree = ',' + lastThree;
    }
    str = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  }
  
  if (state.language === 'bn') {
    return convertDigitsToBengali(str);
  }
  return str;
}

export function formatDisplayNumber(num, type = 'pol') {
  if (type === 'qty') {
    return formatQtyNumber(num);
  }
  return formatPOLNumber(num);
}
