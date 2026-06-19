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

# Test unit 2025-26 MS-74 for 10 E Bengal
res3 = client.get('/api/pol/summary?year=2025-26&grade=MS-74&scope=unit&assigned=10 E Bengal')
print("\n=== Test 3: Unit 2025-26 MS-74 ===")
print("altData length:", len(res3.json['altData']))
print("altData:", res3.json['altData'])
print("data (exp):", res3.json['data'])
print("total Alt:", res3.json['alt'])
print("total Exp:", res3.json['total'])

# Test mock fallback for 2023-24 Diesel
res4 = client.get('/api/pol/summary?year=2023-24&grade=Diesel&scope=division')
print("\n=== Test 4: Mock Fallback 2023-24 Diesel ===")
print("altData length:", len(res4.json['altData']))
print("total Alt:", res4.json['alt'])
print("total Exp:", res4.json['total'])
