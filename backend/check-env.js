require('dotenv').config();

console.log('Environment Variables Check:');
console.log('============================');
console.log('PORT:', process.env.PORT || '❌ NOT SET');
console.log('DB_HOST:', process.env.DB_HOST || '❌ NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || '❌ NOT SET');
console.log('DB_NAME:', process.env.DB_NAME || '❌ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ SET (length: ' + process.env.JWT_SECRET.length + ')' : '❌ NOT SET');
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '❌ NOT SET');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN || '❌ NOT SET');
console.log('============================');

if (!process.env.JWT_SECRET) {
  console.error('\n❌ ERROR: JWT_SECRET is not set!');
  console.log('Make sure backend/.env file exists and contains:');
  console.log('JWT_SECRET=your-secret-key-change-this-in-production');
} else {
  console.log('\n✓ All required environment variables are set');
}
