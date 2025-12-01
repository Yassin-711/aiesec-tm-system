# Quick GitHub Pages Deployment

## 🚀 Fast Setup (5 minutes)

### 1. Create Repository
- Go to https://github.com/new
- Name: `aiesec-tm-system`
- Make it **Public**
- Click "Create repository"

### 2. Upload Files

**Option A: Using GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop ALL files from the `web/` folder
3. Click "Commit changes"

**Option B: Using Git (Command Line)**
```bash
cd "D:\TM pulse"
git init
git add web/*
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aiesec-tm-system.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to repository **Settings**
2. Click **Pages** (left sidebar)
3. Source: **Deploy from a branch**
4. Branch: **main**
5. Folder: **/ (root)**
6. Click **Save**

### 4. Access Your Site
Wait 1-2 minutes, then visit:
```
https://YOUR_USERNAME.github.io/aiesec-tm-system/
```

## ✅ Done!

Your AIESEC TM System is now live on GitHub Pages!

---

**Note:** Make sure `config.js` has your Apps Script URL configured before deploying.

