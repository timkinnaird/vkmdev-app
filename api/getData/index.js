const sql = require('mssql');

module.exports = async function (context, req) {
    const config = {
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        server: process.env.SQL_SERVER,
        database: process.env.SQL_DATABASE,
        options: {
            encrypt: true,
            trustServerCertificate: false
        }
    };

    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT TOP 100 * FROM dbo.km_shopify_products_sold_unique');
        
        context.res = {
            status: 200,
            body: result.recordset,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log.error('Database error:', err);
        context.res = {
            status: 500,
            body: { error: err.message },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } finally {
        await sql.close();
    }
};
```

**Create `.gitignore`:**
1. Back in the root folder (click `vkmdev-app` at the top of sidebar)
2. New File → `.gitignore`
3. Paste:
```
node_modules/
.DS_Store
*.log
.env