const mysql = require('mysql2/promise');

async function testConnection() {
  const ports = [3306, 3307, 3308];

  for (const port of ports) {
    try {
      console.log(`\nTrying MySQL on port ${port}...`);
      const pool = mysql.createPool({
        host: 'localhost',
        port: port,
        user: 'root',
        password: '',
        database: 'quantify_lite',
        waitForConnections: true,
        connectionLimit: 1
      });

      const connection = await pool.getConnection();
      console.log(`✓ SUCCESS! MySQL is running on port ${port}`);

      const [users] = await connection.query('SELECT username, role FROM users');
      console.log('\n✓ Users found in database:');
      users.forEach(u => console.log(`  - ${u.username} (${u.role})`));

      connection.release();
      await pool.end();

      console.log(`\n✓ YOUR MYSQL PORT IS: ${port}`);
      console.log(`\nUpdate backend/.env file:`);
      console.log(`DB_HOST=localhost`);
      console.log(`DB_PORT=${port}`);
      console.log(`DB_USER=root`);
      console.log(`DB_PASSWORD=`);
      console.log(`DB_NAME=quantify_lite`);

      return;
    } catch (error) {
      console.log(`✗ Port ${port} failed: ${error.message}`);
    }
  }

  console.log('\n✗ Could not connect to MySQL on any common port!');
  console.log('\nPossible solutions:');
  console.log('1. Start MySQL service in WAMP');
  console.log('2. Check WAMP icon is GREEN (not orange/red)');
  console.log('3. Restart all WAMP services');
  console.log('4. Check phpMyAdmin works: http://localhost/phpmyadmin');
}

testConnection().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
