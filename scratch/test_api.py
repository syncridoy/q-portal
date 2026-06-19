import sys
sys.path.append('.')
import server

app = server.app
client = app.test_client()

# Test division 2025-26 Diesel
res1 = client.get('/api/pol/summary?year=2025-26&grade=Diesel&scope=division')
print("\n=== Test 1: Division 2025-26 Diesel ===")
print("altData length:", len(res1.json['altData']))
print("altData:", res1.json['altData'])
print("data (exp):", res1.json['data'])
print("total Alt:", res1.json['alt'])
print("total Exp:", res1.json['total'])

# Test brigade 2024-25 Diesel for HQ 55 Arty Bde
res2 = client.get('/api/pol/summary?year=2024-25&grade=Diesel&scope=brigade&assigned=HQ 55 Arty Bde')
print("\n=== Test 2: Brigade 2024-25 Diesel ===")
print("altData length:", len(res2.json['altData']))
print("total Alt:", res2.json['alt'])
print("total Exp:", res2.json['total'])

# Test support battalion mapping 2024-25 Diesel for 5 BIR (Sp Bn)
res_bir_2024 = client.get('/api/pol/summary?year=2024-25&grade=Diesel&scope=unit&assigned=5 BIR (Sp Bn)')
print("\n=== Test 3: Unit 2024-25 Diesel (5 BIR -> 19 E Bengal) ===")
print("altData:", res_bir_2024.json['altData'])
print("data (exp):", res_bir_2024.json['data'])
print("total Alt:", res_bir_2024.json['alt'])
print("total Exp:", res_bir_2024.json['total'])

# Test support battalion mapping 2025-26 Diesel for 5 BIR (Sp Bn)
res_bir_2025 = client.get('/api/pol/summary?year=2025-26&grade=Diesel&scope=unit&assigned=5 BIR (Sp Bn)')
print("\n=== Test 4: Unit 2025-26 Diesel (5 BIR -> 19 E Bengal) ===")
print("altData:", res_bir_2025.json['altData'])
print("data (exp):", res_bir_2025.json['data'])
print("total Alt:", res_bir_2025.json['alt'])
print("total Exp:", res_bir_2025.json['total'])
