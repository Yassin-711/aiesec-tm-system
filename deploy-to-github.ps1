# AIESEC TM System - GitHub Deployment Helper Script
# This script helps you prepare files for GitHub Pages deployment

Write-Host "🚀 AIESEC TM System - GitHub Pages Deployment" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit
}

# Check if we're in a git repository
if (Test-Path .git) {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
} else {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

# Check if config.js has the Apps Script URL configured
$configContent = Get-Content "web\config.js" -Raw
if ($configContent -match "YOUR_APPS_SCRIPT_WEB_APP_URL") {
    Write-Host "⚠️  WARNING: config.js still has placeholder URL!" -ForegroundColor Yellow
    Write-Host "   Please update web\config.js with your Apps Script URL before deploying." -ForegroundColor Yellow
} else {
    Write-Host "✅ config.js appears to be configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a GitHub repository:" -ForegroundColor White
Write-Host "   - Go to https://github.com/new" -ForegroundColor Gray
Write-Host "   - Name it: aiesec-tm-system" -ForegroundColor Gray
Write-Host "   - Make it PUBLIC" -ForegroundColor Gray
Write-Host "   - DO NOT initialize with README" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Copy files from web/ folder to repository root" -ForegroundColor White
Write-Host "   OR use these commands:" -ForegroundColor Gray
Write-Host ""
Write-Host "   git add web/*" -ForegroundColor Yellow
Write-Host "   git commit -m 'Initial commit: AIESEC TM System'" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/aiesec-tm-system.git" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Enable GitHub Pages:" -ForegroundColor White
Write-Host "   - Go to repository Settings > Pages" -ForegroundColor Gray
Write-Host "   - Source: Deploy from a branch" -ForegroundColor Gray
Write-Host "   - Branch: main" -ForegroundColor Gray
Write-Host "   - Folder: / (root)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Your site will be at:" -ForegroundColor White
Write-Host "   https://YOUR_USERNAME.github.io/aiesec-tm-system/" -ForegroundColor Green
Write-Host ""
Write-Host "📖 For detailed instructions, see: 10_GitHub_Pages_Deployment.md" -ForegroundColor Cyan
Write-Host ""

