import requests
import json

BASE = "http://localhost:8000"

# 1. Login
print("=" * 50)
print("1. LOGIN")
r = requests.post(f"{BASE}/auth/login", json={"email": "test@test.com", "password": "test123"})
print(f"   Status: {r.status_code}")
token = r.json().get("access_token", "")
headers = {"Authorization": f"Bearer {token}"}
print(f"   Token: {token[:40]}...")

# 2. MIS Status
print("\n" + "=" * 50)
print("2. MIS STATUS")
r = requests.get(f"{BASE}/mis/status", headers=headers)
print(f"   Status: {r.status_code}")
print(f"   Response: {json.dumps(r.json(), indent=2)}")

# 3. MIS History
print("\n" + "=" * 50)
print("3. MIS HISTORY")
r = requests.get(f"{BASE}/mis/history", headers=headers)
print(f"   Status: {r.status_code}")
print(f"   Response: {json.dumps(r.json(), indent=2)}")

# 4. Excel Sync
print("\n" + "=" * 50)
print("4. EXCEL SYNC")
r = requests.post(f"{BASE}/excel/sync", headers=headers)
print(f"   Status: {r.status_code}")
print(f"   Response: {json.dumps(r.json(), indent=2)}")

# 5. Add Transaction
print("\n" + "=" * 50)
print("5. ADD TRANSACTION")
tx = {
    "amount": 500,
    "category": "Food",
    "note": "Test lunch from API",
    "date": "2026-03-07",
    "type": "expense",
    "account": "wallet"
}
r = requests.post(f"{BASE}/transactions/", json=tx, headers=headers)
print(f"   Status: {r.status_code}")
print(f"   Response: {json.dumps(r.json(), indent=2)}")

# 6. Get Transactions
print("\n" + "=" * 50)
print("6. GET TRANSACTIONS (last 5)")
r = requests.get(f"{BASE}/transactions/?limit=5", headers=headers)
print(f"   Status: {r.status_code}")
txs = r.json()
for t in txs:
    print(f"   - {t.get('date')} | {t.get('category')} | Rs.{t.get('amount')} | {t.get('note')}")

print("\n" + "=" * 50)
print("ALL TESTS COMPLETE!")
