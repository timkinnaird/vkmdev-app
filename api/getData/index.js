const sql = require('mssql');

module.exports = async function (context, req) {
    context.log('Function started');
    
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

    context.log('Config:', {
        user: config.user,
        server: config.server,
        database: config.database,
        hasPassword: !!config.password
    });

    try {
        context.log('Attempting to connect to database...');
        const pool = await sql.connect(config);
        
        context.log('Connected! Running query...');
        const result = await pool.request().query('SELECT TOP 100 * FROM dbo.km_shopify_products_sold_unique');
        
        context.log('Query successful, returning results');
        context.res = {
            status: 200,
            body: result.recordset,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log.error('Database error:', err.message);
        context.log.error('Error details:', err);
        context.res = {
            status: 500,
            body: { error: err.message, details: err.toString() },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } finally {
        await sql.close();
    }
};