const fs = require('fs');
const path = require('path');

function restoreManifest() {
  const manifestPath = path.resolve(__dirname, '../manifest.json');
  const backupPath = manifestPath + '.backup';
  
  try {
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, manifestPath);
      fs.unlinkSync(backupPath);
      console.log('✅ Restored manifest.json from backup');
    } else {
      console.log('ℹ️ No backup file found to restore');
    }
  } catch (error) {
    console.error('❌ Error restoring manifest.json:', error);
    process.exit(1);
  }
}

restoreManifest();