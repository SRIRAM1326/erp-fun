import openpyxl

wb = openpyxl.load_workbook(r"c:\Users\sriram\Downloads\erp-prd\Stock Summary.xlsx", data_only=True)
sheet = wb.active

# Let's find the header row index
excel_rows = list(sheet.iter_rows(values_only=True))
header_row_idx = -1
for idx, row in enumerate(excel_rows[:15]):
    row_str = [str(c).lower().strip() for c in row if c is not None]
    if 'item' in row_str and ('code' in row_str or 'unit' in row_str):
        header_row_idx = idx
        break

print(f"Header Row Index: {header_row_idx}")
headers = [str(cell).strip() if cell is not None else "" for cell in excel_rows[header_row_idx]]
print(f"Headers: {[h.replace('₹', 'Rs.') for h in headers]}")

# Let's print unique categories and first 20 products
categories = set()
for row in excel_rows[header_row_idx + 1:]:
    if all(c is None for c in row):
        continue
    # Let's find Category column
    cat_idx = None
    for i, h in enumerate(headers):
        if 'category' in h.lower():
            cat_idx = i
            break
            
    if cat_idx is not None and row[cat_idx] is not None:
        categories.add(row[cat_idx])

print(f"\nUnique Categories (Count {len(categories)}):")
print([str(c).replace('₹', 'Rs.') for c in list(categories)[:30]])

print("\nFirst 15 products with details:")
for row in excel_rows[header_row_idx + 1:header_row_idx + 16]:
    if all(c is None for c in row):
        continue
    name = row[headers.index("Item")] if "Item" in headers else ""
    code = row[headers.index("Code")] if "Code" in headers else ""
    cat = row[headers.index("Category")] if "Category" in headers else ""
    
    rate_idx = -1
    for i, h in enumerate(headers):
        if "rate" in h.lower():
            rate_idx = i
            break
    rate = row[rate_idx] if rate_idx != -1 else ""
    
    mrp_idx = -1
    for i, h in enumerate(headers):
        if "mrp" in h.lower():
            mrp_idx = i
            break
    mrp = row[mrp_idx] if mrp_idx != -1 else ""
    
    # Clean rupee from output strings
    name_clean = str(name).replace('₹', 'Rs.')
    cat_clean = str(cat).replace('₹', 'Rs.')
    
    print(f"Name: {name_clean} | Code: {code} | Category: {cat_clean} | Sales Rate: {rate} | MRP: {mrp}")
