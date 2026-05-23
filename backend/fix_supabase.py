from pathlib import Path

replacements = {
    "app/routers/transactions.py": [
        (
            '    result = await transactions_collection.delete_one({"_id": tx_id, "user_id": str(current_user["_id"])})\n'
            '    if result.deleted_count == 0:\n'
            '        raise HTTPException(status_code=404, detail="Transaction not found")\n'
            '    \n'
            '    # Sync to Excel\n'
            '    await sync_on_write("transactions")\n'
            '    \n'
            '    return {"message": "Deleted successfully"}\n',
            '    result = await transactions_collection.delete_one({"id": tx_id, "user_id": str(current_user["id"])})\n'
            '    if result.deleted_count == 0:\n'
            '        raise HTTPException(status_code=404, detail="Transaction not found")\n'
            '    return {"message": "Deleted successfully"}\n'
        ),
    ],
}

for rel_path, file_replacements in replacements.items():
    path = Path(rel_path)
    text = path.read_text(encoding='utf-8')
    for old, new in file_replacements:
        if old not in text:
            print(f'Pattern not found in {path}:')
            print(old)
            raise SystemExit(1)
        text = text.replace(old, new)
    path.write_text(text, encoding='utf-8')
print('patch script applied successfully')
