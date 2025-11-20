const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPasswords() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quantify_lite'
    });

    const connection = await pool.getConnection();
    console.log('✓ Connected to database');

    // Generate correct hash for "admin123"
    const correctHash = await bcrypt.hash('admin123', 10);
    console.log('\n✓ Generated new password hash for: admin123');

    // Update all users with the correct hash
    const [result] = await connection.query(
      `UPDATE users SET password = ? WHERE username IN ('admin', 'manager1', 'cashier1')`,
      [correctHash]
    );

    console.log(`✓ Updated ${result.affectedRows} users`);

    // Verify the update
    const [users] = await connection.query('SELECT username FROM users WHERE username IN (?, ?, ?)',
      ['admin', 'manager1', 'cashier1']);

    console.log('\n✓ Users updated:');
    users.forEach(u => console.log('  -', u.username));

    // Test password verification
    const [testUser] = await connection.query('SELECT username, password FROM users WHERE username = ?', ['admin']);
    const isValid = await bcrypt.compare('admin123', testUser[0].password);

    console.log('\n✓ Password verification test:', isValid ? 'PASS ✓' : 'FAIL ✗');
    console.log('\n✓ All users can now login with password: admin123');

    connection.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

fixPasswords();
