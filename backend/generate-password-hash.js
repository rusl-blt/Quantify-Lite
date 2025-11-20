const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  console.log('Password:', password);
  console.log('Hash:', hash);

  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verification test:', isValid ? '✓ PASS' : '✗ FAIL');

  console.log('\n--- SQL UPDATE STATEMENT ---');
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'manager1';`);
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'cashier1';`);
}

generateHash().then(() => process.exit(0));
