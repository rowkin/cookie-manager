/**
 * 自动化发布脚本：同步 Cookie Manager with Daily Quotes 的最新构建包、宣传官网及隐私政策至公开仓库，并自动完成 Git 提交与推送
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const publicRepoDir = path.resolve(rootDir, '../browser-plugins-public');

console.log('🚀 开始执行 79team Cookie Manager 自动化发布管线...');

// 1. 验证公开仓库目录是否存在
if (!fs.existsSync(publicRepoDir)) {
  console.error(`❌ 未找到公开仓库目录: ${publicRepoDir}`);
  console.error('💡 请确保已在 apps 目录下运行: git clone https://github.com/rowkin/browser-plugins.git 并将其重命名为 browser-plugins-public');
  process.exit(1);
}

// 2. 读取当前插件 manifest.json 获取版本号
const manifestPath = path.join(rootDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ 未找到 manifest.json，请确认是否在插件目录下运行！');
  process.exit(1);
}
let version = '1.2.5';
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  version = manifest.version || '1.2.5';
  console.log(`📌 当前插件版本号: v${version}`);
} catch (e) {
  console.error('⚠️ 读取 manifest.json 失败，将使用默认版本 v1.2.5:', e.message);
}

// 3. 检查打包 Zip 是否存在，若不存在则现场快速打包生成
const distDir = path.join(rootDir, 'dist');
const zipName = `cookie-manager-v${version}.zip`;
const sourceZip = path.join(distDir, zipName);

if (!fs.existsSync(sourceZip)) {
  console.log(`📦 未找到已有安装包 ${zipName}，正在执行本地轻量打包...`);
  const releaseDir = path.join(distDir, `cookie-manager-v${version}`);
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(releaseDir, { recursive: true });

  const filesToCopy = [
    'manifest.json',
    'popup.html',
    'md5.min.js',
    'popup.js',
    'style.css',
    'aurora.js',
    'weather.js',
    'background.js',
  ];
  for (const file of filesToCopy) {
    const src = path.join(rootDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(releaseDir, file));
    }
  }

  const dirsToCopy = ['_locales', 'images', 'icons'];
  for (const dir of dirsToCopy) {
    const srcDir = path.join(rootDir, dir);
    if (fs.existsSync(srcDir)) {
      copyFolderSync(srcDir, path.join(releaseDir, dir));
    }
  }

  execSync(`zip -r -q "${sourceZip}" . -x "*.DS_Store" -x "__MACOSX*" -x "*/.DS_Store"`, {
    cwd: releaseDir,
  });
  console.log(`   - 临时打包生成完毕: ${sourceZip}`);
} else {
  console.log(`✅ 已检测到现成编译包: ${sourceZip}`);
}

// 4. 定义公开仓库中的目标路径
const targetPluginDir = path.join(publicRepoDir, 'cookie-manager');
const targetSiteDir = path.join(targetPluginDir, 'site');

// 5. 清理并重建公开仓库的目标子目录
if (fs.existsSync(targetPluginDir)) {
  console.log('🧹 正在清理公开仓库旧的目标文件夹...');
  fs.rmSync(targetPluginDir, { recursive: true, force: true });
}
fs.mkdirSync(targetSiteDir, { recursive: true });

// 复制文件与文件夹的辅助工具
function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((element) => {
    if (element === '.DS_Store') return;
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

// 6. 同步资源至公开仓库
console.log('🚚 正在向公开仓库同步最新资产...');

// 同步官网 site/ 目录
const sourceSiteDir = path.join(rootDir, 'site');
if (fs.existsSync(sourceSiteDir)) {
  copyFolderSync(sourceSiteDir, targetSiteDir);

  // 自动校准 site/index.html 中的版本号与当前 manifest.json 保持同步
  const siteIndexPath = path.join(targetSiteDir, 'index.html');
  if (fs.existsSync(siteIndexPath)) {
    let htmlContent = fs.readFileSync(siteIndexPath, 'utf-8');
    htmlContent = htmlContent.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
    fs.writeFileSync(siteIndexPath, htmlContent, 'utf-8');
  }
  console.log(`   - 同步官网页面成功 (自适应版本标识为 v${version})`);
}

// 同步隐私政策说明
const sourcePrivacy = path.join(rootDir, 'PRIVACY_POLICY.md');
if (fs.existsSync(sourcePrivacy)) {
  fs.copyFileSync(sourcePrivacy, path.join(targetPluginDir, 'PRIVACY_POLICY.md'));
  console.log('   - 同步隐私权政策成功');
}

// 同步 Zip 安装包
if (fs.existsSync(sourceZip)) {
  fs.copyFileSync(sourceZip, path.join(targetPluginDir, `cookie-manager-v${version}.zip`));
  fs.copyFileSync(sourceZip, path.join(targetPluginDir, 'cookie-manager-latest.zip'));
  console.log(`   - 同步 Zip 压缩包成功: cookie-manager-v${version}.zip & cookie-manager-latest.zip`);
} else {
  console.error(`⚠️ 未找到 Zip 文件: ${sourceZip}`);
}

// 7. 检查并生成公开仓库根目录的统一 README.md，将三个插件全部汇总展示
const publicReadmePath = path.join(publicRepoDir, 'README.md');
const readmeContent = `# 79team 浏览器插件公开分发中心 (Browser Plugins)

本仓库是七九在线科技有限公司（79team）旗下所有浏览器扩展程序的**官方公开分发与社区反馈中心**。我们所有的插件核心代码在私有仓库中进行封闭开发，通过本仓库进行免商店安装包分发、精美产品官网托管与社区 Issues 收集。

---

## 📦 现有浏览器插件列表

### 1. 🍪 Cookie 管理器与每日格言 (Cookie Manager with Daily Quotes)

一款集实时 Cookie 高级管理、一键固定智能同步与每日多语励志格言、实时天气于一体的美学级 Chrome 扩展。

*   **官方演示官网**：[https://cookie.rowkin.xyz](https://cookie.rowkin.xyz)
*   **Chrome 网上应用店**：[前往商店安装](https://chromewebstore.google.com/detail/jbddngoogmpocbdmoengcehnobapodpf)
*   **最新安装包下载**：
    *   [最新正式版 (cookie-manager-latest.zip)](./cookie-manager/cookie-manager-latest.zip)
    *   [版本归档目录](./cookie-manager/)
*   **隐私政策说明**：请参阅 [PRIVACY_POLICY.md](./cookie-manager/PRIVACY_POLICY.md)。
*   **安装步骤**：下载 \`.zip\` 压缩包解压后，在 Chrome 浏览器访问 \`chrome://extensions/\` 并开启右上角“开发者模式”，选择“加载已解压的扩展程序”选择解压出来的目录即可。

---

### 2. 🧮 万能计算器 (Universal Calculator)

一款轻量、精美、无广告的浏览器多功能计算与换算工具箱。

*   **官方演示官网**：[https://ucalc.rowkin.xyz](https://ucalc.rowkin.xyz)
*   **最新安装包下载**：
    *   [最新正式版 (universal-calculator-latest.zip)](./universal-calculator/universal-calculator-latest.zip)
    *   [版本归档目录](./universal-calculator/)
*   **隐私政策说明**：请参阅 [PRIVACY_POLICY.md](./universal-calculator/PRIVACY_POLICY.md)。
*   **安装步骤**：下载 \`.zip\` 压缩包解压后，在 Chrome 浏览器访问 \`chrome://extensions/\` 并开启右上角“开发者模式”，选择“加载已解压的扩展程序”选择解压出来的目录即可。

---

### 3. 🛠️ 开发者助理 (DevHelper)

专为研发、设计、测试人员打造的高效浏览器侧边栏开发辅助工具箱。

*   **官方演示官网**：[https://devhelper.rowkin.xyz](https://devhelper.rowkin.xyz)
*   **最新安装包下载**：
    *   [最新正式版 (dev-helper-latest.zip)](./dev-helper/dev-helper-latest.zip)
    *   [版本归档目录](./dev-helper/)
*   **隐私政策说明**：请参阅 [PRIVACY_POLICY.md](./dev-helper/PRIVACY_POLICY.md)。
*   **安装步骤**：下载 \`.zip\` 压缩包解压后，在 Chrome 浏览器访问 \`chrome://extensions/\` 并开启右上角“开发者模式”，选择“加载已解压的扩展程序”选择解压出来的目录即可。

---

## 💬 社区交流与反馈

如果您在体验过程中遇到了任何 Bug，或者有新的功能提案，请直接在本仓库的 [Issues](https://github.com/rowkin/browser-plugins/issues) 页面进行反馈，我们将第一时间予以诊断和解答。

---

*版权所有 © 2026 七九在线科技*
`;

fs.writeFileSync(publicReadmePath, readmeContent, 'utf8');
console.log('   - 刷新公开仓库根目录 README.md 成功');

// 8. 在公开仓库中自动执行 git 提交并推送
console.log('📤 正在将公开仓库变更推送至远程 GitHub...');
try {
  // 设置公开仓库的 Git 提交者身份，确保公开提交合规，防止泄露个人账号
  console.log('👤 正在校准公开仓库的 Git 提交者身份...');
  execSync('git config user.name "79team"', { cwd: publicRepoDir });
  execSync('git config user.email "79team@users.noreply.github.com"', { cwd: publicRepoDir });
  console.log('   - Git 提交身份已校准为: 79team <79team@users.noreply.github.com>');

  // 检查是否有修改
  const status = execSync('git status --porcelain', { cwd: publicRepoDir, encoding: 'utf8' }).trim();
  if (!status) {
    console.log('💡 公开仓库没有检测到任何文件变动，无需推送。');
  } else {
    execSync('git add .', { stdio: 'inherit', cwd: publicRepoDir });
    execSync(`git commit -m "release: cookie-manager v${version}"`, { stdio: 'inherit', cwd: publicRepoDir });
    execSync('git push origin main', { stdio: 'inherit', cwd: publicRepoDir });
    console.log(`\n🎉 资产推送大功告成！cookie-manager v${version} 已成功推送至远程公开仓库！`);
  }
} catch (e) {
  console.error('❌ Git 推送失败:', e.message);
  process.exit(1);
}

// 9. 使用 gh 工具在统一的开源公开仓库上自动创建/更新 GitHub Release 并关联 ZIP 资产
try {
  console.log('\n🔮 正在检测本地 gh (GitHub CLI) 认证状态...');
  execSync('gh auth status', { stdio: 'ignore' });
  
  const releaseTag = `cookie-manager-v${version}`;
  const zipPath = path.join(targetPluginDir, `cookie-manager-v${version}.zip`);
  
  console.log(`🏷️ 正在开源公开仓库中自动创建/更新 GitHub Release ${releaseTag}...`);
  
  let releaseExists = false;
  try {
    execSync(`gh release view "${releaseTag}" --repo rowkin/browser-plugins`, { stdio: 'ignore' });
    releaseExists = true;
  } catch (e) {
    // 不存在该 release
  }
  
  if (releaseExists) {
    console.log(`   - 检测到 GitHub Release ${releaseTag} 已经存在，正在更新资产文件...`);
    execSync(`gh release upload "${releaseTag}" "${zipPath}" --clobber --repo rowkin/browser-plugins`, { stdio: 'inherit' });
    console.log(`   - 成功更新 GitHub Release ${releaseTag} 资产包！`);
  } else {
    console.log(`   - 正在创建新 Release ${releaseTag}...`);
    const ghCmd = `gh release create "${releaseTag}" "${zipPath}" --title "${releaseTag}" --notes "Release cookie-manager v${version} browser plugin" --repo rowkin/browser-plugins`;
    execSync(ghCmd, { stdio: 'inherit' });
    console.log(`   - 成功在 GitHub 创建 Release ${releaseTag} 并上传 ZIP 附件！`);
  }
} catch (err) {
  console.warn('⚠️ 警告: 创建/更新 GitHub Release 失败。请检查 GitHub CLI (gh) 是否已登录，或者是否对 rowkin/browser-plugins 拥有写权限。');
  console.warn('详细错误原因: ' + err.message);
}
