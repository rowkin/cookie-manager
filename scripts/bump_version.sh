#!/bin/bash

# 确保脚本在错误时退出
set -e

# 获取项目根目录的绝对路径
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 函数：检查文件是否存在
check_file() {
    if [ ! -f "$1" ]; then
        echo "Error: $1 not found"
        echo "Current directory: $(pwd)"
        echo "Root directory: $ROOT_DIR"
        exit 1
    fi
}

# 函数：更新manifest.json版本号
update_manifest_version() {
    local version="$1"
    local manifest_file="$ROOT_DIR/manifest.json"
    
    if [ ! -f "$manifest_file" ]; then
        echo "Error: manifest.json not found at $manifest_file"
        exit 1
    fi

    # 使用临时文件避免直接修改原文件可能造成的问题
    local tmp_file="$(mktemp)"
    jq ".version = \"$version\"" "$manifest_file" > "$tmp_file" && mv "$tmp_file" "$manifest_file"
    
    echo "Updated manifest.json version to $version"
}

# 函数：检查命令是否存在
check_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Error: $1 is required but not installed. Please install $1 first."
    exit 1
fi
}

# 检查必需的命令
check_command jq
check_command node

# 检查工作目录是否干净
if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Git working directory is not clean"
    git status
    exit 1
fi

echo "=== Starting version bump process ==="
echo "Using project root: $ROOT_DIR"

# 检查必需文件
check_file "$ROOT_DIR/package.json"
check_file "$ROOT_DIR/manifest.json"

# 检查并安装依赖
if [ ! -d "$ROOT_DIR/node_modules" ]; then
    echo "Installing dependencies..."
    cd "$ROOT_DIR" || exit 1
    pnpm install
fi

# 自增版本号
cd "$ROOT_DIR" || exit 1
echo "Incrementing version number..."
npm version patch

# 获取新版本号
new_version="$(node -p "require('./package.json').version")"
echo "New version: $new_version"

# 更新manifest.json中的版本号
update_manifest_version "$new_version"

# Git 操作
echo "Performing Git operations..."

# 添加manifest.json的更改
git add "$ROOT_DIR/manifest.json"

# 提交更新
git commit -m "chore: bump version to $new_version"

# 检查标签是否已存在
if git rev-parse "v$new_version" >/dev/null 2>&1; then
    echo "Warning: Tag v$new_version already exists, removing..."
    git tag -d "v$new_version"
    git push origin ":refs/tags/v$new_version" || true
fi

# 创建新标签
echo "Creating new tag v$new_version..."
git tag -a "v$new_version" -m "Release version $new_version"
git push origin "v$new_version"

# 同步主分支
main_branch="$(git branch --show-current)"
echo "Syncing main branch ($main_branch)..."
git push origin "$main_branch"

echo "=== Version bump completed successfully ==="
echo "Version updated to $new_version in both package.json and manifest.json"
