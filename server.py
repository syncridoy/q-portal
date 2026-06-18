import sqlite3
import os
import random
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__)
DB_FILE = 'database.db'

BRIGADES = {
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
}

IMMUTABLE_USER_REGISTRY = [
  { "username": "aq_55_inf_div", "assigned": "HQ 55 Inf Div", "role": 6, "appointment": "AAQMG", "access": "Viewer" },
  { "username": "dq_55_inf_div", "assigned": "HQ 55 Inf Div", "role": 6, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_55_inf_div", "assigned": "HQ 55 Inf Div", "role": 5, "appointment": "Q Clk", "access": "Editor" },
  { "username": "dq_55_arty_bde", "assigned": "HQ 55 Arty Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_55_arty_bde", "assigned": "HQ 55 Arty Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },
  { "username": "dq_21_inf_bde", "assigned": "HQ 21 Inf Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_21_inf_bde", "assigned": "HQ 21 Inf Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },
  { "username": "dq_88_inf_bde", "assigned": "HQ 88 Inf Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_88_inf_bde", "assigned": "HQ 88 Inf Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },
  { "username": "dq_105_inf_bde", "assigned": "HQ 105 Inf Bde", "role": 4, "appointment": "DAQMG", "access": "Viewer" },
  { "username": "hq_105_inf_bde", "assigned": "HQ 105 Inf Bde", "role": 3, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_rawshan_ara_regt", "assigned": "Rawshan Ara Regt Artly", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "rawshan_ara_regt", "assigned": "Rawshan Ara Regt Arty", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_8_fd_regt", "assigned": "8 Fd Regt Arty", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "8_fd_regt", "assigned": "8 Fd Regt Arty", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_27_fd_regt", "assigned": "27 Fd Regt Arty", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "27_fd_regt", "assigned": "27 Fd Regt Arty", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "oc_adhoc_med_bty", "assigned": "Adhoc Med Bty", "role": 2, "appointment": "OC", "access": "Viewer" },
  { "username": "adhoc_med_bty", "assigned": "Adhoc Med Bty", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_10_eb", "assigned": "10 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "10_eb", "assigned": "10 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_20_eb", "assigned": "20 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "20_eb", "assigned": "20 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_6_eb", "assigned": "6 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "6_eb", "assigned": "6 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_2_eb", "assigned": "2 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "2_eb", "assigned": "2 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_14_bir", "assigned": "14 BIR", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "14_bir", "assigned": "14 BIR", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_34_eb", "assigned": "Adhoc 34 E Bengal", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "34_eb", "assigned": "Adhoc 34 E Bengal", "role": 1, "appointment": "Q Clk", "access": "Editor" },
  { "username": "qm_37_bir", "assigned": "37 BIR", "role": 2, "appointment": "QM", "access": "Viewer" },
  { "username": "37_bir", "assigned": "37 BIR", "role": 1, "appointment": "Q Clk", "access": "Editor" },
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
]

INITIAL_LOGISTICS = {
  "Rawshan Ara Regt Arty": { "vAvail": 8, "vTotal": 12, "pol": 4500, "cook": 4, "waiter": 8, "strength": 245 },
  "8 Fd Regt Arty": { "vAvail": 6, "vTotal": 8, "pol": 3200, "cook": 3, "waiter": 6, "strength": 180 },
  "27 Fd Regt Arty": { "vAvail": 9, "vTotal": 10, "pol": 4100, "cook": 4, "waiter": 7, "strength": 215 },
  "Adhoc Med Bty": { "vAvail": 3, "vTotal": 4, "pol": 1500, "cook": 2, "waiter": 4, "strength": 90 },
  "10 E Bengal": { "vAvail": 14, "vTotal": 18, "pol": 6500, "cook": 5, "waiter": 10, "strength": 480 },
  "20 E Bengal": { "vAvail": 11, "vTotal": 15, "pol": 5800, "cook": 5, "waiter": 9, "strength": 460 },
  "2 E Bengal": { "vAvail": 12, "vTotal": 16, "pol": 6100, "cook": 5, "waiter": 10, "strength": 470 },
  "6 E Bengal": { "vAvail": 10, "vTotal": 14, "pol": 5200, "cook": 4, "waiter": 8, "strength": 430 },
  "14 BIR": { "vAvail": 15, "vTotal": 18, "pol": 6900, "cook": 6, "waiter": 11, "strength": 520 },
  "Adhoc 34 E Bengal": { "vAvail": 5, "vTotal": 8, "pol": 2800, "cook": 3, "waiter": 6, "strength": 150 },
  "37 BIR": { "vAvail": 11, "vTotal": 15, "pol": 5400, "cook": 5, "waiter": 9, "strength": 440 },
  "9 Bengal Lancers": { "vAvail": 16, "vTotal": 20, "pol": 8500, "cook": 6, "waiter": 12, "strength": 310 },
  "3 Engr Bn": { "vAvail": 22, "vTotal": 26, "pol": 9200, "cook": 5, "waiter": 10, "strength": 280 },
  "2 Sig Bn": { "vAvail": 18, "vTotal": 22, "pol": 7500, "cook": 4, "waiter": 8, "strength": 250 },
  "5 BIR (Div Sp Bn)": { "vAvail": 14, "vTotal": 16, "pol": 6200, "cook": 6, "waiter": 11, "strength": 490 },
  "31 ST Bn": { "vAvail": 45, "vTotal": 50, "pol": 24000, "cook": 8, "waiter": 15, "strength": 350 },
  "41 Fd Amb": { "vAvail": 12, "vTotal": 14, "pol": 3800, "cook": 3, "waiter": 6, "strength": 120 },
  "71 Fd Amb": { "vAvail": 10, "vTotal": 12, "pol": 3500, "cook": 3, "waiter": 6, "strength": 110 },
  "505 DOC": { "vAvail": 4, "vTotal": 6, "pol": 1800, "cook": 2, "waiter": 4, "strength": 60 },
  "117 Fd Wksp Coy EME": { "vAvail": 8, "vTotal": 10, "pol": 3900, "cook": 3, "waiter": 5, "strength": 140 },
  "119 Fd Wksp Coy EME": { "vAvail": 7, "vTotal": 9, "pol": 3600, "cook": 3, "waiter": 5, "strength": 130 },
  "145 Fd Wksp Coy EME": { "vAvail": 9, "vTotal": 11, "pol": 4200, "cook": 3, "waiter": 6, "strength": 150 },
  "55 MP Unit": { "vAvail": 8, "vTotal": 8, "pol": 2500, "cook": 2, "waiter": 4, "strength": 95 },
  "55 FIU": { "vAvail": 3, "vTotal": 4, "pol": 1200, "cook": 1, "waiter": 2, "strength": 45 },
  "HQ Coy 55 Inf Div": { "vAvail": 12, "vTotal": 15, "pol": 5500, "cook": 5, "waiter": 12, "strength": 220 }
}

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT,
            role INTEGER,
            roleName TEXT,
            appointment TEXT,
            assigned TEXT,
            assignedUnit TEXT,
            unitName TEXT,
            scopeUnit TEXT,
            scopeBde TEXT,
            is_first_login BOOLEAN,
            baNo TEXT,
            rank TEXT,
            fullName TEXT,
            mobile TEXT,
            avatar TEXT
        )
    ''')
    
    # Create logistics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logistics (
            unit_name TEXT PRIMARY KEY,
            vAvail INTEGER,
            vTotal INTEGER,
            pol INTEGER,
            cook INTEGER,
            waiter INTEGER,
            strength INTEGER
        )
    ''')
    
    conn.commit()
    
    # Seed users if empty
    cursor.execute("SELECT count(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_users(conn)
        
    # Seed logistics if empty
    cursor.execute("SELECT count(*) FROM logistics")
    if cursor.fetchone()[0] == 0:
        seed_logistics(conn)
        
    conn.close()

def seed_users(conn):
    cursor = conn.cursor()
    for u in IMMUTABLE_USER_REGISTRY:
        scopeUnit = None
        scopeBde = None
        roleName = ""
        defaultRank = ""
        
        assignedName = u["assigned"]
        if assignedName == "Rawshan Ara Regt Artly":
            assignedName = "Rawshan Ara Regt Arty"
            
        if u["role"] == 1 or u["role"] == 2:
            scopeUnit = assignedName
            scopeBde = next((b for b in BRIGADES if assignedName in BRIGADES[b]), None)
            roleName = "Unit Clerk" if u["role"] == 1 else "Unit QM / OC"
            defaultRank = "Warrant Officer" if u["role"] == 1 else "Major"
        elif u["role"] == 3 or u["role"] == 4:
            scopeBde = assignedName
            roleName = "Brigade Clerk" if u["role"] == 3 else "Brigade DAQMG"
            defaultRank = "Sergeant" if u["role"] == 3 else "Major"
        elif u["role"] == 5 or u["role"] == 6:
            scopeBde = "ALL"
            roleName = "Division Q Clerk" if u["role"] == 5 else ("Division AAQMG" if u["appointment"] == "AAQMG" else "Division DAQMG")
            defaultRank = "Senior Warrant Officer" if u["role"] == 5 else ("Lieutenant Colonel" if u["appointment"] == "AAQMG" else "Major")
            
        cursor.execute('''
            INSERT INTO users (username, password, role, roleName, appointment, assigned, assignedUnit, unitName, scopeUnit, scopeBde, is_first_login, baNo, rank, fullName, mobile, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            u["username"], "temp123", u["role"], roleName, u["appointment"], assignedName, assignedName, assignedName, scopeUnit, scopeBde,
            True, "", defaultRank, f"{u['appointment']} ({assignedName})", "", f"https://avatar.iran.liara.run/public/{random.randint(1, 70)}"
        ))
    conn.commit()

def seed_logistics(conn):
    cursor = conn.cursor()
    for unit, data in INITIAL_LOGISTICS.items():
        cursor.execute('''
            INSERT INTO logistics (unit_name, vAvail, vTotal, pol, cook, waiter, strength)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (unit, data["vAvail"], data["vTotal"], data["pol"], data["cook"], data["waiter"], data["strength"]))
    conn.commit()

# --- Flask Web Routes ---

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    res = send_from_directory('.', path)
    if path.endswith('.js'):
        res.headers['Content-Type'] = 'text/javascript'
    return res

# --- API Endpoints ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username_or_mobile = data.get("username", "").strip().lower()
    password = data.get("password", "")
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Try username lookup first
    cursor.execute("SELECT * FROM users WHERE LOWER(username) = ?", (username_or_mobile,))
    user_row = cursor.fetchone()
    
    if not user_row:
        # If not found, look up all users and check their mobile numbers
        cursor.execute("SELECT * FROM users")
        all_users = cursor.fetchall()
        for u in all_users:
            mobile = u["mobile"] or ""
            # Strip non-digits from both mobile and input
            clean_mobile = ''.join(c for c in mobile if c.isdigit())
            clean_input = ''.join(c for c in username_or_mobile if c.isdigit())
            if clean_input and (clean_mobile == clean_input or mobile == username_or_mobile or (len(mobile) >= 4 and mobile[-4:] == username_or_mobile)):
                user_row = u
                break
                
    conn.close()
    
    if user_row:
        if user_row["password"] == password:
            user_dict = dict(user_row)
            user_dict["is_first_login"] = bool(user_dict["is_first_login"])
            return jsonify({"success": True, "user": user_dict})
        else:
            is_first_login = bool(user_row["is_first_login"])
            if password == "temp123" and not is_first_login:
                return jsonify({"success": False, "message": "You entered an old password.", "old_password": True}), 401
            return jsonify({"success": False, "message": "Incorrect password."}), 401
            
    return jsonify({"success": False, "message": "Incorrect username or phone."}), 401

@app.route('/api/impersonate', methods=['POST'])
def impersonate():
    data = request.json
    username = data.get("username", "").strip().lower()
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user_row = cursor.fetchone()
    conn.close()
    
    if user_row:
        user_dict = dict(user_row)
        user_dict["is_first_login"] = bool(user_dict["is_first_login"])
        return jsonify({"success": True, "user": user_dict})
    
    return jsonify({"success": False, "message": "User not found"}), 404

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()
    
    users_data = {}
    for row in rows:
        user_dict = dict(row)
        user_dict["is_first_login"] = bool(user_dict["is_first_login"])
        users_data[row["username"]] = user_dict
    return jsonify(users_data)

@app.route('/api/logistics', methods=['GET'])
def get_logistics():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM logistics")
    rows = cursor.fetchall()
    conn.close()
    
    logistics_data = {}
    for row in rows:
        logistics_data[row["unit_name"]] = {
            "vAvail": row["vAvail"],
            "vTotal": row["vTotal"],
            "pol": row["pol"],
            "cook": row["cook"],
            "waiter": row["waiter"],
            "strength": row["strength"]
        }
    return jsonify(logistics_data)

@app.route('/api/logistics', methods=['POST'])
def update_logistics():
    data = request.json
    unit_name = data.get("unitName")
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE logistics 
        SET vAvail = ?, vTotal = ?, pol = ?, cook = ?, waiter = ?, strength = ?
        WHERE unit_name = ?
    ''', (data["vAvail"], data["vTotal"], data["pol"], data["cook"], data["waiter"], data["strength"], unit_name))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True})

@app.route('/api/profile', methods=['POST'])
def update_profile():
    data = request.json
    username = data.get("username")
    mobile = data.get("mobile")
    
    conn = get_db()
    cursor = conn.cursor()
    
    if mobile is not None:
        cursor.execute('''
            UPDATE users
            SET rank = ?, baNo = ?, fullName = ?, avatar = ?, mobile = ?
            WHERE username = ?
        ''', (data["rank"], data["baNo"], data["fullName"], data["avatar"], mobile, username))
    else:
        cursor.execute('''
            UPDATE users
            SET rank = ?, baNo = ?, fullName = ?, avatar = ?
            WHERE username = ?
        ''', (data["rank"], data["baNo"], data["fullName"], data["avatar"], username))
        
    conn.commit()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user_row = cursor.fetchone()
    conn.close()
    
    user_dict = dict(user_row)
    user_dict["is_first_login"] = bool(user_dict["is_first_login"])
    return jsonify({"success": True, "user": user_dict})

@app.route('/api/change-password', methods=['POST'])
def change_password():
    data = request.json
    username = data.get("username")
    new_password = data.get("newPassword")
    is_first_login = data.get("is_first_login", False)
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE users
        SET password = ?, is_first_login = ?
        WHERE username = ?
    ''', (new_password, is_first_login, username))
    conn.commit()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user_row = cursor.fetchone()
    conn.close()
    
    user_dict = dict(user_row)
    user_dict["is_first_login"] = bool(user_dict["is_first_login"])
    return jsonify({"success": True, "user": user_dict})

@app.route('/api/reset', methods=['POST'])
def reset_database():
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
    init_db()
    return jsonify({"success": True})

if __name__ == '__main__':
    init_db()
    # Server will run on port 3000 locally
    app.run(host='0.0.0.0', port=3000, debug=True)
