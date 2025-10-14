# Database Migration Instructions

## Adding Category Column to Food Inventory

To fix the error 500 when adding food items, you need to apply the database migration that adds the `category` column to the `food_inventory` table.

### Steps to Apply the Migration:

1. **Connect to your PostgreSQL database**:
   ```bash
   psql -U your_username -d your_database_name
   ```

2. **Run the migration SQL**:
   ```bash
   psql -U your_username -d your_database_name < postgresql/add_category_column.sql
   ```

   Or if you're already connected to psql:
   ```sql
   \i postgresql/add_category_column.sql
   ```

3. **Verify the migration**:
   ```sql
   \d food_inventory
   ```
   
   You should see the new `category` column in the table structure.

### What This Migration Does:

- Adds a `category` column (VARCHAR(100)) to the existing `food_inventory` table
- The column is nullable, so existing records won't be affected
- New installations will automatically have this column from `init.sql`

### After Migration:

- Restart your backend server to ensure it picks up the database changes
- You can now add food items with categories without getting error 500
- Existing food items can be edited to add categories

### Optional: Set Default Categories

If you want to set a default category for existing items:
```sql
UPDATE food_inventory SET category = 'Uncategorized' WHERE category IS NULL;
```