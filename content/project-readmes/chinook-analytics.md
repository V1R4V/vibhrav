# SQL Analytics on the Chinook Database

Thirty analytical SQL queries over [Chinook](https://github.com/lerocha/chinook-database), a sample database that models a digital media store: artists, albums, tracks, genres, playlists, customers, employees, and invoices. The queries run against MySQL from Python via SQLAlchemy and pandas.

## What's here

| File | Contents |
| --- | --- |
| [`chinook_queries.sql`](chinook_queries.sql) | All 30 queries as plain SQL, grouped by technique |
| [`chinook_sql_analysis.html`](chinook_sql_analysis.html) | The rendered notebook with every query's result table |

## Techniques covered

**Filtering & subqueries**: nested `IN` subqueries (artist → album → track), `IS NULL` checks, `LIKE` pattern matching, top-N with `ORDER BY … LIMIT`.

**Joins**: five-table join chains (`Customer → Invoice → InvoiceLine → Track → Album → Artist`), `LEFT JOIN` to keep customers with no purchases, `RIGHT JOIN` to keep artists with no albums, and joins mixed with subqueries.

**Grouping**: `GROUP BY` with `HAVING` filters, such as albums that span multiple genres, genres averaging over 20 minutes per track, and artist revenue.

**Window functions & CTEs**:
- `RANK()` for track duration and customer spend rankings
- `ROW_NUMBER()` with `PARTITION BY` for the top-3 invoices per country
- A 3-month moving average of monthly sales using `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`
- A correlated-subquery ranking, written as an alternative to window functions

Example: top 3 invoices per country.

```sql
WITH RankedInvoices AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY BillingCountry ORDER BY Total DESC) AS CountryRank
    FROM Invoice
)
SELECT InvoiceId, CustomerId, InvoiceDate, BillingCountry, Total
FROM RankedInvoices
WHERE CountryRank <= 3
ORDER BY BillingCountry, Total DESC;
```

## Running locally

```bash
# MySQL 8 in Docker
docker run --name chinook-mysql -e MYSQL_ROOT_PASSWORD=<password> -p 127.0.0.1:3306:3306 -d mysql:8

# Load the Chinook schema + data (MySQL script from the Chinook project releases)
mysql -h 127.0.0.1 -u root -p < Chinook_MySql.sql

# Run any query
mysql -h 127.0.0.1 -u root -p Chinook < chinook_queries.sql
```

From Python:

```python
from sqlalchemy import create_engine
import pandas as pd

engine = create_engine("mysql+mysqlconnector://root:<password>@127.0.0.1:3306/Chinook")
pd.read_sql("SELECT * FROM Invoice WHERE Total > 20", engine)
```

---

*Date finished: February 16, 2026*
