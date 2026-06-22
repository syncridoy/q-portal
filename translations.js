import { state } from './state.js';

// --- Translation Dictionary (Bilingual support) ---
export const TRANSLATIONS = {
  en: {
    "10 E Bengal": "10 E Bengal",
    "100 Octane": "100 Octane",
    "100 Octane (Dropdown)": "100 Octane (Dropdown)",
    "117 Fd Wksp Coy EME": "117 Fd Wksp Coy EME",
    "119 Fd Wksp Coy EME": "119 Fd Wksp Coy EME",
    "14 BIR": "14 BIR",
    "145 Fd Wksp Coy EME": "145 Fd Wksp Coy EME",
    "19 E Bengal (Sp Bn)": "19 E Bengal (Sp Bn)",
    "2 E Bengal": "2 E Bengal",
    "2 Sig Bn": "2 Sig Bn",
    "20 E Bengal": "20 E Bengal",
    "2024-25": "2024-25",
    "2025-26": "2025-26",
    "2026-27": "2026-27",
    "27 Fd Regt Arty": "27 Fd Regt Arty",
    "3 Engr Bn": "3 Engr Bn",
    "3 Ton": "3 Ton",
    "31 ST Bn": "31 ST Bn",
    "37 BIR": "37 BIR",
    "41 Fd Amb": "41 Fd Amb",
    "5 BIR (Sp Bn)": "5 BIR (Sp Bn)",
    "505 DOC": "505 DOC",
    "55 FIU": "55 FIU",
    "55 MP Unit": "55 MP Unit",
    "6 E Bengal": "6 E Bengal",
    "71 Fd Amb": "71 Fd Amb",
    "8 Fd Regt Arty": "8 Fd Regt Arty",
    "9 Bengal Lancers": "9 Bengal Lancers",
    "AAQMG": "AAQMG",
    "ALL": "ALL",
    "Adhoc 34 E Bengal": "Adhoc 34 E Bengal",
    "Adhoc Med Bty": "Adhoc Med Bty",
    "Att (Tooltip)": "Att (Tooltip)",
    "Brigade Clerk": "Brigade Clerk",
    "Brigade DAQMG": "Brigade DAQMG",
    "Brigade HQ": "Brigade HQ",
    "DAQMG": "DAQMG",
    "Diesel": "Diesel",
    "Diesel (Dropdown)": "Diesel (Dropdown)",
    "Division AAQMG": "Division AAQMG",
    "Division DAQMG": "Division DAQMG",
    "Division HQ": "Division HQ",
    "Division Q Clerk": "Division Q Clerk",
    "HQ": "HQ",
    "HQ Coy 55 Inf Div": "HQ Coy 55 Inf Div",
    "Jeep": "Jeep",
    "Jul / Aug / Sep / Oct / Nov / Dec / Jan / Feb / Mar / Apr / May / Jun": "Jul / Aug / Sep / Oct / Nov / Dec / Jan / Feb / Mar / Apr / May / Jun",
    "Lieutenant Colonel": "Lieutenant Colonel",
    "MS-74": "MS-74",
    "MS-74 (Dropdown)": "MS-74 (Dropdown)",
    "Major": "Major",
    "OC": "OC",
    "Q Clk": "Q Clk",
    "QM": "QM",
    "Rawshan Ara Regt Arty": "Rawshan Ara Regt Arty",
    "Scope:": "Scope:",
    "Senior Warrant Officer": "Senior Warrant Officer",
    "Sergeant": "Sergeant",
    "Sidebar Brigade label": "HQ 55 Arty Bde",
    "Sur (Tooltip)": "Sur (Tooltip)",
    "TH_POL_GRADE": "POL Grade",
    "Total (Bugler)": "Total (Bugler)",
    "Total Alt": "Total Alt",
    "Total Exp": "Total Exp",
    "UR (Tooltip)": "UR (Tooltip)",
    "Unit Clerk": "Unit Clerk",
    "Unit QM / OC": "Unit QM / OC",
    "Warrant Officer": "Warrant Officer",
    "app_subtitle": "AQ Branch, 55 Inf Div",
    "app_title": "Q-portal",
    "btn_back": "Previous",
    "btn_cancel": "Cancel",
    "btn_crop_apply": "Crop & Apply",
    "btn_login": "Access System",
    "btn_next": "Next Step",
    "btn_reset_state": "🔄 Reset System Data",
    "btn_save": "Publish & Stream Data",
    "btn_save_changes": "Save Changes",
    "btn_update_password": "Update Password",
    "btn_upload": "Or upload custom photo",
    "btn_verify_update": "Verify & Update",
    "card_mess": "Mess Staff",
    "card_personnel": "Active Personnel",
    "card_pol": "Total Fuel (POL)",
    "card_title_bugler_summary": "Bugler Summary",
    "card_title_held": "Held",
    "card_title_mess_summary": "Mess-staff Summary",
    "card_title_nce_summary": "NC (E) Summary",
    "card_title_pol_state": "State of POL FY 2025-26",
    "card_title_total_exp": "Total Exp",
    "card_title_veh_state": "Veh State Summary",
    "card_vehicles": "Total Vehicles",
    "change_pwd_otp_desc": "A 6-digit verification code has been sent to your official number.",
    "chart_agg_title": "Comparative Brigade Logistics Index",
    "chart_breakdown_desc": "Overall percentage shares across the division",
    "chart_breakdown_title": "Divisional Allocation Matrix",
    "crop_modal_title": "Crop Profile Picture",
    "directory_search_placeholder": "Search by BA number, rank, or name...",
    "directory_title": "Divisional Automated Contact Directory",
    "div_subtitle": "Excellence Everywhere",
    "div_title": "55 Inf Div",
    "editor_heading": "Resource Data Entry Console",
    "forgot_password": "Forgot Password",
    "index.html - BA No input": "BA No / Army No",
    "label_ba_no": "Army / BA Number",
    "label_confirm_pwd": "Confirm New Password",
    "label_current_pwd": "Current Password",
    "label_fullname": "Full Name",
    "label_mobile": "Official Mobile Number",
    "label_new_pwd": "New Password",
    "label_password": "Password",
    "label_profile_pic": "Choose Profile Avatar",
    "label_rank": "Rank",
    "label_username": "Username or phone number",
    "lbl_alloc_heading": "Allocation",
    "lbl_avg_label": "avg",
    "lbl_exp_heading": "Expenditure",
    "lbl_last_month_exp": "Last Month Exp",
    "lbl_mess_cook": "Assigned Cooks (Count)",
    "lbl_mess_waiter": "Assigned Service Waiters (Count)",
    "lbl_pol": "POL Fuel On-hand (Liters)",
    "lbl_strength": "Present Personnel Strength (Count)",
    "lbl_total_alt": "Allocation\nTotal\navg",
    "lbl_total_exp": "Expenditure\nTotal\navg",
    "lbl_total_label": "Total",
    "lbl_vehicles_avail": "Available Vehicles (Count)",
    "lbl_vehicles_total": "Total Authorized Vehicles (Count)",
    "live_status": "Live Aggregator Active",
    "login_caps": "LOGIN",
    "login_subtext": "Welcome to Q-portal",
    "login_welcome": "As-salamu alaykum",
    "menu_change_password": "Change Password",
    "menu_directory": "Contact Directory",
    "menu_edit_profile": "Edit User Info",
    "menu_header": "Portal Scope Nav",
    "menu_logout": "Logout",
    "menu_overview": "Divisional aggregates",
    "menu_units": "Unit Logistics",
    "modal_change_pwd_title": "Change Password",
    "modal_edit_desc": "Modify your administrative profile details below.",
    "modal_edit_title": "Edit User Info",
    "opt_all_units": "All Brigades & Units",
    "otp_desc": "Please provide your official mobile number to receive a simulated verification OTP.",
    "otp_heading": "Mobile Verification",
    "otp_not_received": "Didn",
    "otp_resend": "Resend OTP",
    "otp_sent_msg": "An OTP has been simulated. Check notifications below and input it here:",
    "pickup": "pickup",
    "profile_desc": "Provide your rank and official credentials. Select an avatar to complete your entry in the automated directory.",
    "profile_heading": "Update User Info",
    "pwd_desc": "Update your password to secure your account.",
    "pwd_heading": "Define Secure Password",
    "pwd_match": "Passwords match.",
    "pwd_medium": "Medium Strength",
    "pwd_mismatch": "Passwords do not match.",
    "pwd_strong": "Strong Password",
    "pwd_weak": "Weak - Minimum 8 characters with numbers & symbols required",
    "read_only_alert": "Your current account is strictly Read-Only. Editing is disabled.",
    "row_100octane": "100 Octane",
    "row_3ton": "3 Ton",
    "row_cook_m": "Cook (M)",
    "row_cook_u": "Cook (U)",
    "row_diesel": "Diesel",
    "row_jeep": "Jeep",
    "row_masalchi": "Masalchi",
    "row_messwaiter": "Messwaiter",
    "row_ms74": "MS-74",
    "row_nce": "NC (E)",
    "row_pickup": "Pickup",
    "setup_step_1": "Security",
    "setup_step_2": "Verification",
    "setup_step_3": "User Info",
    "sim_desc": "Select a profile below to instantly switch sessions. Clerks can edit matching units; officers have dynamic read-only overview dashboards.",
    "sim_heading": "Administrative Role Impersonator",
    "tab_admin_hub": "Admin Hub",
    "tab_contact": "Contact",
    "tab_dashboard": "Dashboard",
    "tab_manpower": "Manpower",
    "tab_mess_staff": "Mess-staff",
    "tab_pol": "POL",
    "title_pol_management": "POL Management",
    "btn_dmd": "DMD",
    "btn_alt": "Alt",
    "btn_exp": "Exp",
    "label_demand": "Submit Fuel Demand",
    "label_allocate": "Record Fuel Allocation",
    "label_expenditure": "Record Fuel Expenditure",
    "lbl_pol_grade": "POL Grade",
    "lbl_month": "Month",
    "lbl_amount": "Amount (Liters)",
    "lbl_select_unit": "Target Unit/Brigade",
    "lbl_from_entity": "Source Pool",
    "pol_log_title": "POL Transaction Log & Demands",
    "lbl_status": "Status",
    "tab_veh": "Veh",
    "table_agg_title": "55 Infantry Division Logistics Overview",
    "test_credentials_title": "DEMO ACCOUNTS (Use Password: temp123)",
    "th_absent": "Absent",
    "th_action": "Action",
    "th_alt_from_area": "Alt from Area",
    "th_alt_to_bde": "Alt to<br>Bde/Unit",
    "th_att": "Att",
    "th_auth": "Auth",
    "th_bal": "Bal",
    "th_course": "Course",
    "th_held": "Held",
    "th_hq": "Brigade / Headquarters Group",
    "th_long_rd": "Long Rd",
    "th_lve": "Lve",
    "th_mess": "Mess Staff Count",
    "th_of_rd": "Short Rd",
    "th_or": "OR",
    "th_pol": "Fuel (POL - L)",
    "th_pol_grade": "POL Grade",
    "th_posted": "Posted",
    "th_present": "Present",
    "th_strength": "Personnel Present",
    "th_sur": "Sur",
    "th_total": "Total",
    "th_type_of_mess": "Type of<br>Mess-Staff",
    "th_type_of_veh": "Type of Veh",
    "th_unit": "Subordinate Unit",
    "th_ur": "UR",
    "th_vehicles": "Vehicles (Active/Total)",
    "title_bde_overview": "Bde Overview",
    "title_div_overview": "Div Overview",
    "title_unit_overview": "Unit Overview",
    "toast_data_saved": "Logistics database updated and broadcasted in real time!",
    "toast_incoming_call": "Dialing phone number of ",
    "toast_login_success": "Sign-in successful. Welcome back!",
    "toast_otp_error": "Verification failed. The OTP typed was invalid.",
    "toast_otp_sent": "Simulated SMS Gateway: Your OTP is ",
    "toast_otp_verified": "Mobile phone verified successfully.",
    "toast_pwd_mismatch": "Password entries do not match.",
    "toast_pwd_short": "New password must be at least 8 characters long.",
    "toast_setup_complete": "Account setup finalized. Directing to dashboard.",
    "tree_header": "Command Hierarchy",
    "units_title": "Subordinate Logistics Sheets",
    "welcome_title": "Welcome to Div Dashboard"
  },
  bn: {
    "10 E Bengal": "১০ ই বেংগল",
    "100 Octane": "১০০ অকটেন",
    "100 Octane (Dropdown)": "১০০ অকটেন",
    "117 Fd Wksp Coy EME": "১১৭ ফিল্ড ওয়ার্কশপ কোঃ ইএম‌ই",
    "119 Fd Wksp Coy EME": "১১৯ ফিল্ড ওয়ার্কশপ কোঃ ইএম‌ই",
    "14 BIR": "১৪ বীর",
    "145 Fd Wksp Coy EME": "১৪৫ ফিল্ড ওয়ার্কশপ কোঃ ইএম‌ই",
    "19 E Bengal (Sp Bn)": "১৯ ই বেঙ্গল (ডিঃ সাপোঃ)",
    "2 E Bengal": "২ ই বেংগল",
    "2 Sig Bn": "২ সিগনাল ব্যাটালিয়ন",
    "20 E Bengal": "২০ ই বেংগল",
    "2024-25": "২০২৪-২৫",
    "2025-26": "২০২৫-২৬",
    "2026-27": "২০২৬-২৭",
    "27 Fd Regt Arty": "২৭ ফিল্ড  রেজিঃ আর্টিঃ",
    "3 Engr Bn": "৩ ইঞ্জিনিয়ার ব্যাটালিয়ন",
    "3 Ton": "৩ টন",
    "31 ST Bn": "৩১  এসটি ব্যাটালিয়ন",
    "37 BIR": "৩৭ বীর",
    "41 Fd Amb": "৪১ ফিল্ড এ্যাম্বুলেন্স",
    "5 BIR (Sp Bn)": "৫ বীর (ডিঃ সাপোঃ)",
    "505 DOC": "৫০৫ ডিওসি",
    "55 FIU": "৫৫ এফআইইউ",
    "55 MP Unit": "৫৫ এমপি ইউনিট",
    "6 E Bengal": "৬ ই বেংগল",
    "71 Fd Amb": "৭১ ফিল্ড এ্যাম্বুলেন্স",
    "8 Fd Regt Arty": "৮ ফিল্ড রেজিঃ আর্টিঃ",
    "9 Bengal Lancers": "৯ বেঙ্গল ল্যান্সার",
    "AAQMG": "এএকিউএমজি",
    "ALL": "সব",
    "Adhoc 34 E Bengal": "এড‌হক ৩৪ ই বেংগল",
    "Adhoc Med Bty": "এডহক মিডিঃ ব্যাটারি",
    "Att (Tooltip)": "সংযুক্ত",
    "Brigade Clerk": "ব্রিগেড করণিক",
    "Brigade DAQMG": "ব্রিগেড ডিএকিউএমজি",
    "Brigade HQ": "ব্রিগেড সদর দপ্তর",
    "DAQMG": "ডিএকিউএমজি",
    "Diesel": "ডিজেল",
    "Diesel (Dropdown)": "ডিজেল",
    "Division AAQMG": "ডিভিশন এএকিউএমজি",
    "Division DAQMG": "ডিভিশন ডিএকিউএমজি",
    "Division HQ": "ডিভঃ সদর দপ্তর",
    "Division Q Clerk": "ডিভিশন কিউ করণিক",
    "HQ": "সদর দপ্তর",
    "HQ Coy 55 Inf Div": "সদর দপ্তর কোঃ ৫৫ পদাঃ ডিভঃ",
    "Jeep": "জীপ",
    "Jul / Aug / Sep / Oct / Nov / Dec / Jan / Feb / Mar / Apr / May / Jun": "জুলাই / আগস্ট / সেপ্টেম্বর / অক্টোবর / নভেম্বর / ডিসেম্বর / জানুয়ারি / ফেব্রুয়ারি / মার্চ / এপ্রিল / মে / জুন",
    "Lieutenant Colonel": "লেঃ কর্নেল",
    "MS-74": "এমএস-৭৪",
    "MS-74 (Dropdown)": "এমএস-৭৪",
    "Major": "মেজর",
    "OC": "ওসি",
    "Q Clk": "কিউ করণিক",
    "QM": "কিউএম",
    "Rawshan Ara Regt Arty": "রওশন আরা রেজিঃ আর্টিঃ",
    "Scope:": "কর্মপরিসর",
    "Senior Warrant Officer": "সিনিঃ ওয়াঃ অফিঃ",
    "Sergeant": "সার্জেন্ট",
    "Sidebar Brigade label": "পদাতিক ডিভিশন (সরাসরি)",
    "Sur (Tooltip)": "উদ্বৃত্ত",
    "TH_POL_GRADE": "পিওএল গ্রেড",
    "Total (Bugler)": "মোট",
    "Total Alt": "মোট বরাদ্দ",
    "Total Exp": "মোট খরচ",
    "UR (Tooltip)": "অচল",
    "Unit Clerk": "ইউনিট করণিক",
    "Unit QM / OC": "ইউনিট কিউএম",
    "Warrant Officer": "ওয়াঃ অফিঃ",
    "app_subtitle": "একিউ ব্রাঞ্চ, ৫৫ পদাতিক ডিভিশন",
    "app_title": "কিউ-পোর্টাল",
    "btn_back": "ফিরে যান",
    "btn_cancel": "বাতিল",
    "btn_crop_apply": "ক্রপ ও প্রয়োগ করুন",
    "btn_login": "প্রবেশ করুন",
    "btn_next": "পরবর্তী ধাপ",
    "btn_reset_state": "🔄 সিস্টেম ডাটা রিসেট করুন",
    "btn_save": "ডাটা সংরক্ষণ ও লাইভ আপডেট",
    "btn_save_changes": "পরিবর্তন সংরক্ষণ করুন",
    "btn_update_password": "পাসওয়ার্ড আপডেট করুন",
    "btn_upload": "অথবা নিজের ছবি আপলোড করুন",
    "btn_verify_update": "যাচাই ও আপডেট",
    "card_mess": "মেস স্টাফ",
    "card_personnel": "সেনা সদস্য সংখ্যা",
    "card_pol": "মোট জ্বালানি (POL)",
    "card_title_bugler_summary": "বিউগলার পরিসংখ্যান",
    "card_title_held": "প্রাপ্ত",
    "card_title_mess_summary": "মেসস্টাফ পরিসংখ্যান",
    "card_title_nce_summary": "এনসি (ই) পরিসংখ্যান",
    "card_title_pol_state": "পিওএল স্টেট অর্থবছর ২০২৫-২৬",
    "card_title_total_exp": "মোট খরচ",
    "card_title_veh_state": "যানবাহন এর পরিসংখ্যান",
    "card_vehicles": "মোট যানবাহন",
    "change_pwd_otp_desc": "আপনার অফিসিয়াল নম্বরে একটি ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।",
    "chart_agg_title": "ব্রিগেডগুলোর তুলনামূলক সম্পদ ইনডেক্স",
    "chart_breakdown_desc": "সমগ্র ডিভিশনের মোট সম্পদের বণ্টন শতকরা হার",
    "chart_breakdown_title": "সম্পদ বণ্টন ম্যাট্রিক্স",
    "crop_modal_title": "প্রোফাইল ছবি ক্রপ করুন",
    "directory_search_placeholder": "বিএ নম্বর, পদবি বা নাম দিয়ে খুঁজুন...",
    "directory_title": "ডিভিশনাল স্বয়ংক্রিয় যোগাযোগ ডিরেক্টরি",
    "div_subtitle": "সর্বত্র শ্রেষ্ঠত্ব",
    "div_title": "৫৫ পদাতিক ডিভিশন",
    "editor_heading": "ডাটা এন্ট্রি এবং এডিট প্যানেল",
    "forgot_password": "পাসওয়ার্ড ভুলে গেছেন?",
    "index.html - BA No input": "আর্মি/বিএ নং",
    "label_ba_no": "আর্মি/বিএ নম্বর",
    "label_confirm_pwd": "পাসওয়ার্ড নিশ্চিত করুন",
    "label_current_pwd": "বর্তমান পাসওয়ার্ড",
    "label_fullname": "পূর্ণ নাম",
    "label_mobile": "অফিসিয়াল মোবাইল নম্বর",
    "label_new_pwd": "নতুন পাসওয়ার্ড",
    "label_password": "পাসওয়ার্ড",
    "label_profile_pic": "প্রোফাইল ছবি নির্বাচন করুন",
    "label_rank": "পদবি",
    "label_username": "ইউজারনেম অথবা ফোন নম্বর",
    "lbl_alloc_heading": "বরাদ্দ",
    "lbl_avg_label": "গড়",
    "lbl_exp_heading": "খরচ",
    "lbl_last_month_exp": "গত মাসের ব্যয়",
    "lbl_mess_cook": "নিযুক্ত কুক (সংখ্যা)",
    "lbl_mess_waiter": "নিযুক্ত ওয়েটার (সংখ্যা)",
    "lbl_pol": "জ্বালানি মজুদ (POL - লিটার)",
    "lbl_strength": "উপস্থিত সেনা সদস্য সংখ্যা (Present)",
    "lbl_total_alt": "বরাদ্দ\nমোট\nগড়",
    "lbl_total_exp": "ব্যয়\nমোট\nগড়",
    "lbl_total_label": "মোট",
    "lbl_vehicles_avail": "উপলব্ধ যানবাহন (সংখ্যা)",
    "lbl_vehicles_total": "মোট যানবাহন সংখ্যা (অনুমোদিত)",
    "live_status": "লাইভ ডাটা এগ্রিগেশন সচল",
    "login_caps": "লগইন",
    "login_subtext": "কিউ-পোর্টালে স্বাগতম",
    "login_welcome": "আস-সালামু আলাইকুম",
    "menu_change_password": "পাসওয়ার্ড পরিবর্তন",
    "menu_directory": "যোগাযোগ ডিরেক্টরি",
    "menu_edit_profile": "ইউজার তথ্য সংশোধন",
    "menu_header": "মেনু নেভিগেশন",
    "menu_logout": "লগআউট",
    "menu_overview": "ডিভিশনাল সামগ্রিক চিত্র",
    "menu_units": "ইউনিট লজিস্টিকস",
    "modal_change_pwd_title": "পাসওয়ার্ড পরিবর্তন করুন",
    "modal_edit_desc": "আপনার প্রশাসনিক প্রোফাইল বিবরণ নিচে পরিবর্তন করুন।",
    "modal_edit_title": "ইউজার তথ্য সংশোধন",
    "opt_all_units": "সকল ব্রিগেড ও ইউনিট",
    "otp_desc": "আপনার অফিসিয়াল মোবাইল নম্বর প্রদান করুন। নম্বরে একটি ওটিপি (OTP) পাঠানো হবে।",
    "otp_heading": "মোবাইল ভেরিফিকেশন",
    "otp_not_received": "ওটিপি পাননি?",
    "otp_resend": "পুনরায় ওটিপি পাঠান",
    "otp_sent_msg": "একটি ওটিপি পাঠানো হয়েছে। নিচের নোটিফিকেশন চেক করে এখানে লিখুন:",
    "pickup": "পিকআপ",
    "profile_desc": "আপনার প্রাতিষ্ঠানিক তথ্য প্রদান করুন এবং ডিরেক্টরির জন্য একটি প্রোফাইল ছবি নির্বাচন করুন।",
    "profile_heading": "ইউজার তথ্য আপডেট করুন",
    "pwd_desc": "আপনার অ্যাকাউন্ট সুরক্ষিত করতে পাসওয়ার্ড আপডেট করুন।",
    "pwd_heading": "নতুন পাসওয়ার্ড নির্ধারণ করুন",
    "pwd_match": "পাসওয়ার্ড দুটি মিলেছে।",
    "pwd_medium": "মাঝারি পাসওয়ার্ড",
    "pwd_mismatch": "পাসওয়ার্ড দুটি মেলেনি।",
    "pwd_strong": "শক্তিশালী পাসওয়ার্ড",
    "pwd_weak": "দুর্বল - কমপক্ষে ৮টি অক্ষর, সংখ্যা ও স্পেশাল ক্যারেক্টার লাগবে",
    "read_only_alert": "আপনার রোলটি রিড-ওনলি (Read-Only)। ডাটা এডিট লক করা আছে।",
    "row_100octane": "১০০ অকটেন",
    "row_3ton": "৩ টন",
    "row_cook_m": "কুক (এম)",
    "row_cook_u": "কুক (ইউ)",
    "row_diesel": "ডিজেল",
    "row_jeep": "জীপ",
    "row_masalchi": "মশালচি",
    "row_messwaiter": "মেসওয়েটার",
    "row_ms74": "এমএস-৭৪",
    "row_nce": "এনসি (ই)",
    "row_pickup": "পিকআপ",
    "setup_step_1": "নিরাপত্তা",
    "setup_step_2": "ভেরিফিকেশন",
    "setup_step_3": "ইউজার তথ্য",
    "sim_desc": "যেকোনো আইডেন্টিটি নির্বাচন করে সুইচ করুন। ক্লার্ক নিজ আওতাভুক্ত ইউনিটের ডাটা এডিট করতে পারবেন, কর্মকর্তারা রিড-ওনলি ভিউ পাবেন।",
    "sim_heading": "রোল সিমুলেটর প্যানেল",
    "tab_admin_hub": "এডমিন হাব",
    "tab_contact": "যোগাযোগ",
    "tab_dashboard": "ড্যাশবোর্ড",
    "tab_manpower": "জনবল",
    "tab_mess_staff": "মেসস্টাফ",
    "tab_pol": "পিওএল",
    "title_pol_management": "পিওএল ম্যানেজমেন্ট",
    "btn_dmd": "চাহিদা (DMD)",
    "btn_alt": "বরাদ্দ (Alt)",
    "btn_exp": "খরচ (Exp)",
    "label_demand": "জ্বালানি চাহিদা সাবমিট করুন",
    "label_allocate": "জ্বালানি বরাদ্দ এন্ট্রি করুন",
    "label_expenditure": "জ্বালানি খরচ এন্ট্রি করুন",
    "lbl_pol_grade": "পিওএল গ্রেড",
    "lbl_month": "মাস",
    "lbl_amount": "পরিমাণ (লিটার)",
    "lbl_select_unit": "লক্ষ্য ইউনিট/ব্রিগেড",
    "lbl_from_entity": "উৎস পুল",
    "pol_log_title": "পিওএল লেনদেন লগ ও চাহিদাসমূহ",
    "lbl_status": "অবস্থা",
    "tab_veh": "যানবাহন",
    "table_agg_title": "৫৫ পদাতিক ডিভিশনের লজিস্টিকস সামারি",
    "test_credentials_title": "টেস্ট অ্যাকাউন্টস (পাসওয়ার্ড: temp123)",
    "th_absent": "অনুপস্থিত",
    "th_action": "অ্যাকশন",
    "th_alt_from_area": "এরিয়া হতে বরাদ্দ",
    "th_alt_to_bde": "ব্রিগেড/<br>ইউনিট",
    "th_att": "সংযুক্ত",
    "th_auth": "প্রাপ্য",
    "th_bal": "মজুদ",
    "th_course": "কোর্স",
    "th_held": "প্রাপ্ত",
    "th_hq": "ব্রিগেড / সদর দপ্তর",
    "th_long_rd": "লং রোড",
    "th_lve": "ছুটি",
    "th_mess": "মেস স্টাফ সংখ্যা",
    "th_of_rd": "শর্ট রোড",
    "th_or": "সচল",
    "th_pol": "জ্বালানি (POL - লিটার)",
    "th_pol_grade": "পিওএল গ্রেড",
    "th_posted": "প্রাপ্ত",
    "th_present": "উপস্থিত",
    "th_strength": "উপস্থিত সেনা সদস্য",
    "th_sur": "উদ্বৃত্ত",
    "th_total": "মোট",
    "th_type_of_mess": "মেসস্টাফের প্রকার",
    "th_type_of_veh": "যানবাহনের প্রকার",
    "th_unit": "অধীনস্থ ইউনিট",
    "th_ur": "অচল",
    "th_vehicles": "যানবাহন (চলতি/মোট)",
    "title_bde_overview": "ব্রিগেড ওভারভিউ",
    "title_div_overview": "ডিভিশন ওভারভিউ",
    "title_unit_overview": "ইউনিট ওভারভিউ",
    "toast_data_saved": "ডাটাবেজ সফলভাবে সংরক্ষিত এবং রিয়েল-টাইমে আপডেট করা হয়েছে!",
    "toast_incoming_call": "কল করা হচ্ছে: ",
    "toast_login_success": "লগইন সফল হয়েছে। স্বাগতম!",
    "toast_otp_error": "ভেরিফিকেশন ব্যর্থ হয়েছে। সঠিক ওটিপি প্রবেশ করান।",
    "toast_otp_sent": "মোবাইল গেটওয়ে: আপনার ওটিপি কোড হলো ",
    "toast_otp_verified": "মোবাইল নম্বর সফলভাবে ভেরিফাই করা হয়েছে।",
    "toast_pwd_mismatch": "পাসওয়ার্ড দুটির মিল পাওয়া যায়নি।",
    "toast_pwd_short": "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    "toast_setup_complete": "প্রোফাইল সেটআপ সম্পন্ন হয়েছে। ড্যাশবোর্ডে প্রবেশ করা হচ্ছে।",
    "tree_header": "কমান্ড কাঠামো",
    "units_title": "অধীনস্থ ইউনিট লজিস্টিক শিট",
    "welcome_title": "ডিভ ড্যাশবোর্ডে স্বাগতম"
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
