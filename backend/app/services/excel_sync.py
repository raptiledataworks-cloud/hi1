from pathlib import Path
from openpyxl import Workbook
from app.database import transactions_collection

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
EXCEL_FILE_PATH = DATA_DIR / "transactions.xlsx"

async def sync_on_write(collection_name: str):
    """Sync transaction collection writes into a single Excel workbook."""
    if collection_name != "transactions":
        return {"message": "No sync configured for this collection."}

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    workbook = Workbook()
    worksheet = workbook.active
    worksheet.title = "Transactions"

    headers = ["id", "user_id", "date", "amount", "category", "note", "type", "account"]
    worksheet.append(headers)

    cursor = transactions_collection.find({})
    async for doc in cursor:
        row = [
            str(doc.get("_id", "")),
            doc.get("user_id", ""),
            doc.get("date", ""),
            doc.get("amount", ""),
            doc.get("category", ""),
            doc.get("note", ""),
            doc.get("type", ""),
            doc.get("account", ""),
        ]
        worksheet.append(row)

    workbook.save(EXCEL_FILE_PATH)
    return {"message": "Transactions synced to Excel.", "file_path": str(EXCEL_FILE_PATH)}

async def sync_all_to_excel():
    return await sync_on_write("transactions")
