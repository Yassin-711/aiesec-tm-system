# 🚀 Quick Start: Deploy to GitHub Pages

## Method 1: Using GitHub Web Interface (Easiest)

### Step 1: Create Repository
1. Go to https://github.com/new
2. Repository name: `aiesec-tm-system`
3. Make it **Public** ✅
4. **DO NOT** check "Add a README file"
5. Click **Create repository**

### Step 2: Upload Files
1. On the new repository page, click **"uploading an existing file"**
2. Open your `web` folder in File Explorer
3. **Select ALL files** from the `web` folder:
   - index.html
   - vptm-dashboard.html
   - tl-dashboard.html
   - member-dashboard.html
   - styles.css
   - app.js
   - config.js
   - README.md
4. Drag and drop them into GitHub
5. Scroll down, enter commit message: "Initial commit"
6. Click **Commit changes**

### Step 3: Enable GitHub Pages
1. Click **Settings** (top menu)
2. Click **Pages** (left sidebar)
3. Under **Source**:
   - Select **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**

### Step 4: Access Your Site
Wait 1-2 minutes, then visit:
```
https://YOUR_USERNAME.github.io/aiesec-tm-system/
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## Method 2: Using Git Command Line

### Prerequisites
- Install Git: https://git-scm.com/downloads
- Have a GitHub account

### Commands

```bash
# Navigate to your project folder
cd "D:\TM pulse"

# Initialize git (if not already done)
git init

# Add all web files
git add web/*

# Create initial commit
git commit -m "Initial commit: AIESEC TM System"

# Rename branch to main
git branch -M main

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/aiesec-tm-system.git

# Push to GitHub
git push -u origin main
```

Then follow **Step 3** and **Step 4** from Method 1 above.

---

## ✅ Verification Checklist

Before deploying, make sure:
- [ ] `config.js` has your Apps Script URL (not the placeholder)
- [ ] All files are in the `web/` folder
- [ ] Repository is set to **Public**
- [ ] GitHub Pages is enabled

---

## 🎉 You're Done!

Your site will be live at:
```
https://YOUR_USERNAME.github.io/aiesec-tm-system/
```

Share this URL with your LC members!

---

## 🔄 Updating Your Site

To update your site after making changes:

**Using Web Interface:**
1. Edit files directly on GitHub
2. Commit changes
3. Site updates automatically (1-2 minutes)

**Using Git:**
```bash
git add .
git commit -m "Update dashboard"
git push
```

---

## 🆘 Troubleshooting

**Site shows 404:**
- Wait a few more minutes
- Check Settings > Pages for errors
- Verify files are in root directory

**CORS errors:**
- Make sure Apps Script URL is correct in config.js
- Check Apps Script deployment settings

**Login not working:**
- Verify Apps Script URL in config.js
- Test Apps Script URL directly in browser
- Check browser console (F12) for errors

---

**Need more help?** See `10_GitHub_Pages_Deployment.md` for detailed instructions.

