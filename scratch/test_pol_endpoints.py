import sys
sys.path.append('.')
import server
import unittest
import json

class TestPolEndpoints(unittest.TestCase):
    def setUp(self):
        self.app = server.app
        self.client = self.app.test_client()
        # Ensure we have a clean test connection/state if needed,
        # but since database is SQLite, we can just test the transactions.
        
    def test_1_get_state_division(self):
        # Division HQ (role 6)
        res = self.client.get('/api/pol/state?role=6&assigned=HQ 55 Inf Div')
        self.assertEqual(res.status_code, 200)
        data = res.json
        self.assertTrue(len(data) >= 3)
        # Verify keys
        for row in data:
            self.assertIn("grade", row)
            self.assertIn("col1", row)
            self.assertIn("col2", row)
            self.assertIn("bal", row)
            self.assertEqual(row["bal"], row["col1"] - row["col2"])
        print("Division State Check passed:", data)

    def test_2_get_state_unit(self):
        # Unit (role 1)
        res = self.client.get('/api/pol/state?role=1&assigned=9 Bengal Lancers')
        self.assertEqual(res.status_code, 200)
        data = res.json
        self.assertTrue(len(data) >= 3)
        for row in data:
            self.assertEqual(row["bal"], row["col1"] - row["col2"])
        print("Unit State Check passed:", data)

    def test_3_demand_flow(self):
        # 1. Post demand
        payload = {
            "unitName": "9 Bengal Lancers",
            "month": "Jul",
            "fiscalYear": "2025-26",
            "polGrade": "Diesel",
            "amount": 5000.0
        }
        res_post = self.client.post('/api/pol/demand', json=payload)
        self.assertEqual(res_post.status_code, 200)
        self.assertTrue(res_post.json["success"])

        # 2. Get demands
        res_get = self.client.get('/api/pol/demands?role=1&assigned=9 Bengal Lancers')
        self.assertEqual(res_get.status_code, 200)
        demands = res_get.json
        self.assertTrue(len(demands) >= 1)
        # Find our demand
        my_demand = [d for d in demands if d["unitName"] == "9 Bengal Lancers" and d["polGrade"] == "Diesel" and d["month"] == "Jul"]
        self.assertTrue(len(my_demand) > 0)
        self.assertEqual(my_demand[0]["amount"], 5000.0)
        self.assertEqual(my_demand[0]["status"], "Pending")
        print("Demand flow check passed:", my_demand[0])

    def test_4_allocate_flow(self):
        # Get initial state of target unit
        res_state_before = self.client.get('/api/pol/state?role=1&assigned=2 Sig Bn')
        before_diesel = [r for r in res_state_before.json if r["grade"] == "Diesel"][0]
        initial_alt = before_diesel["col1"]

        # Allocate 1000 Liters from Division HQ to 2 Sig Bn
        payload = {
            "fromEntity": "HQ 55 Inf Div",
            "toEntity": "2 Sig Bn",
            "month": "Jul",
            "fiscalYear": "2025-26",
            "polGrade": "Diesel",
            "amount": 1000.0
        }
        res_alloc = self.client.post('/api/pol/allocate', json=payload)
        self.assertEqual(res_alloc.status_code, 200)
        self.assertTrue(res_alloc.json["success"])

        # Verify allocation added to 2 Sig Bn
        res_state_after = self.client.get('/api/pol/state?role=1&assigned=2 Sig Bn')
        after_diesel = [r for r in res_state_after.json if r["grade"] == "Diesel"][0]
        self.assertEqual(after_diesel["col1"], initial_alt + 1000.0)
        print("Allocation flow check passed! Initial Alt:", initial_alt, "After Alt:", after_diesel["col1"])

    def test_5_expenditure_flow(self):
        # Get initial state
        res_state_before = self.client.get('/api/pol/state?role=1&assigned=2 Sig Bn')
        before_diesel = [r for r in res_state_before.json if r["grade"] == "Diesel"][0]
        initial_exp = before_diesel["col2"]

        # Record expenditure of 350 Liters
        payload = {
            "unitName": "2 Sig Bn",
            "month": "Jul",
            "fiscalYear": "2025-26",
            "polGrade": "Diesel",
            "amount": 350.0
        }
        res_exp = self.client.post('/api/pol/expenditure', json=payload)
        self.assertEqual(res_exp.status_code, 200)
        self.assertTrue(res_exp.json["success"])

        # Verify expenditure updated
        res_state_after = self.client.get('/api/pol/state?role=1&assigned=2 Sig Bn')
        after_diesel = [r for r in res_state_after.json if r["grade"] == "Diesel"][0]
        self.assertEqual(after_diesel["col2"], initial_exp + 350.0)
        print("Expenditure flow check passed! Initial Exp:", initial_exp, "After Exp:", after_diesel["col2"])

if __name__ == '__main__':
    unittest.main()
