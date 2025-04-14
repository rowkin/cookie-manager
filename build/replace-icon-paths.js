const fs = require('fs');
const path = require('path');

// 配置项
const config = {
  manifestPath: path.resolve(__dirname, '../manifest.json'),
  oldPath: 'icons/',
  newPath: 'images/',
  backupSuffix: '.backup'
};

function replaceIconPaths() {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(config.manifestPath)) {
      throw new Error(`Manifest file not found at: ${config.manifestPath}`);
    }

    console.log('📖 Reading manifest from:', config.manifestPath);
    const manifestContent = fs.readFileSync(config.manifestPath, 'utf8');
    
    // 创建备份
    const backupPath = config.manifestPath + config.backupSuffix;
    fs.writeFileSync(backupPath, manifestContent);
    console.log('💾 Created backup at:', backupPath);
    
    // 解析 JSON
    let manifest;
    try {
      manifest = JSON.parse(manifestContent);
    } catch (parseError) {
      throw new Error(`Failed to parse manifest.json: ${parseError.message}`);
    }
    
    // 替换路径
    let modified = false;
    const changes = [];
    
    // 替换 action.default_icon 中的路径
    if (manifest.action && manifest.action.default_icon) {
      console.log('🔍 Checking action.default_icon paths...');
      Object.entries(manifest.action.default_icon).forEach(([size, path]) => {
        if (path.startsWith(config.oldPath)) {
          const newPath = path.replace(config.oldPath, config.newPath);
          manifest.action.default_icon[size] = newPath;
          changes.push(`action.default_icon[${size}]: ${path} -> ${newPath}`);
          modified = true;
        }
      });
    }
    
    // 替换 icons 中的路径
    if (manifest.icons) {
      console.log('🔍 Checking icons paths...');
      Object.entries(manifest.icons).forEach(([size, path]) => {
        if (path.startsWith(config.oldPath)) {
          const newPath = path.replace(config.oldPath, config.newPath);
          manifest.icons[size] = newPath;
          changes.push(`icons[${size}]: ${path} -> ${newPath}`);
          modified = true;
        }
      });
    }
    
    if (modified) {
      console.log('📝 Changes to be made:');
      changes.forEach(change => console.log(`  - ${change}`));
      
      // 写入修改后的文件
      fs.writeFileSync(
        config.manifestPath,
        JSON.stringify(manifest, null, 2),
        'utf8'
      );
      console.log('✅ Successfully replaced icon paths in manifest.json');
    } else {
      console.log('ℹ️ Current paths in manifest:');
      if (manifest.action?.default_icon) {
        console.log('  action.default_icon:', manifest.action.default_icon);
      }
      if (manifest.icons) {
        console.log('  icons:', manifest.icons);
      }
      console.log(`❗ No paths starting with "${config.oldPath}" found to replace`);
      
      // 删除不必要的备份
      fs.unlinkSync(backupPath);
      console.log('🗑️ Removed unnecessary backup file');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    // 尝试恢复备份
    try {
      const backupPath = config.manifestPath + config.backupSuffix;
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, config.manifestPath);
        console.log('✅ Restored from backup');
        fs.unlinkSync(backupPath);
      }
    } catch (restoreError) {
      console.error('❌ Failed to restore from backup:', restoreError.message);
    }
    process.exit(1);
  }
}

// 执行替换
replaceIconPaths();