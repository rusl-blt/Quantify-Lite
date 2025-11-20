const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const BACKUP_DIR = path.join(__dirname, '../../backups');

// Ensure backup directory exists
const ensureBackupDir = async () => {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
};

exports.createBackup = async (req, res) => {
  try {
    await ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);

    const dbName = process.env.DB_NAME || 'quantify_lite';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';

    // Create mysqldump command
    const passwordPart = dbPassword ? `-p${dbPassword}` : '';
    const command = `mysqldump -h ${dbHost} -u ${dbUser} ${passwordPart} ${dbName} > ${filepath}`;

    try {
      await execPromise(command);
      res.json({
        message: 'Backup created successfully',
        filename: filename
      });
    } catch (execError) {
      // If mysqldump fails, create a note file explaining the limitation
      const noteContent = `Database backup feature requires mysqldump to be installed.
On Windows with WAMP, you can use phpMyAdmin to export the database manually.
Backup timestamp: ${new Date().toISOString()}
Database: ${dbName}
`;
      await fs.writeFile(filepath.replace('.sql', '.txt'), noteContent);

      res.json({
        message: 'Backup placeholder created. Please use phpMyAdmin for actual backup.',
        filename: filename.replace('.sql', '.txt'),
        note: 'mysqldump not available - use phpMyAdmin instead'
      });
    }
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ message: 'Backup failed: ' + error.message });
  }
};

exports.getBackups = async (req, res) => {
  try {
    await ensureBackupDir();

    const files = await fs.readdir(BACKUP_DIR);
    const backups = await Promise.all(
      files.map(async (filename) => {
        const filepath = path.join(BACKUP_DIR, filename);
        const stats = await fs.stat(filepath);
        return {
          filename: filename,
          created_at: stats.mtime,
          size: stats.size
        };
      })
    );

    backups.sort((a, b) => b.created_at - a.created_at);

    res.json(backups);
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    const { filename } = req.body;
    const filepath = path.join(BACKUP_DIR, filename);

    // Check if file exists
    await fs.access(filepath);

    const dbName = process.env.DB_NAME || 'quantify_lite';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';

    const passwordPart = dbPassword ? `-p${dbPassword}` : '';
    const command = `mysql -h ${dbHost} -u ${dbUser} ${passwordPart} ${dbName} < ${filepath}`;

    try {
      await execPromise(command);
      res.json({ message: 'Backup restored successfully' });
    } catch (execError) {
      res.status(400).json({
        message: 'Restore requires mysql command line tool. Please use phpMyAdmin to import the SQL file.',
        filepath: filepath
      });
    }
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({ message: 'Restore failed: ' + error.message });
  }
};
