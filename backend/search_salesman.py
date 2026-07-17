import openpyxl

wb = openpyxl.load_workbook(r"c:\Users\sriram\Downloads\erp-prd\Sales Invoice Register_sales-person.xlsx", data_only=True)
sheet = wb.active
found = False
for idx, row in enumerate(sheet.iter_rows(values_only=True)):
    row_str = [str(c) for c in row if c is not None]
    row_text = " ".join(row_str)
    if "Priya" in row_text or "Menon" in row_text:
        print(f"Row {idx} contains Priya Menon: {row_str}")
        found = True

if not found:
    print("No rows contain Priya Menon in the Sales Invoice Register Excel sheet.")
