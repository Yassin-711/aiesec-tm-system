# GitHub Pages Deployment Guide

## 🎯 Step-by-Step Instructions

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Repository name: `aiesec-tm-system` (or your preferred name)
4. Description: "AIESEC Talent Management System"
5. **Make it Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

### Step 2: Initialize Git (If Not Already Done)

Open terminal/command prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AIESEC TM System"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/aiesec-tm-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 3: Upload Web Files

Make sure all files in the `web/` folder are ready:

- ✅ `index.html`
- ✅ `vptm-dashboard.html`
- ✅ `tl-dashboard.html`
- ✅ `member-dashboard.html`
- ✅ `styles.css`
- ✅ `app.js`
- ✅ `config.js` (with your Apps Script URL configured)

### Step 4: Organize Files for GitHub Pages

**Option A: Deploy web folder as root (Recommended)**

1. Copy all files from `web/` folder to the root of your repository
2. Or create a `docs/` folder and put files there, then use `/docs` as source

**Option B: Use web folder as subdirectory**

1. Keep files in `web/` folder
2. Set GitHub Pages source to `/web` folder (if supported)

**Recommended Structure:**
```
aiesec-tm-system/
├── index.html
├── vptm-dashboard.html
├── tl-dashboard.html
├── member-dashboard.html
├── member-dashboard.html
├── styles.css
├── app.js
├── config.js
└── README.md
```

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Deploy from a branch**
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)` or `/docs` (if you used docs folder)
5. Click **Save**

### Step 6: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/aiesec-tm-system/
```

**Note:** It may take a few minutes for the site to be live. GitHub will show you the URL once it's ready.

### Step 7: Update Apps Script CORS (If Needed)

If you encounter CORS errors, update your Apps Script `doGet` function to include CORS headers:

```javascript
function doGet(e) {
  // ... your existing code ...
  
  // For API responses, add CORS headers
  if (action === 'getMember' || action === 'getTeam' || action === 'getVPTMDashboard') {
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}
```

## 🔧 Troubleshooting

### Issue: Site shows 404

**Solution:**
- Make sure files are in the root directory (or folder you specified)
- Check that GitHub Pages is enabled
- Wait a few minutes for GitHub to build the site
- Check the repository Settings > Pages for any error messages

### Issue: CORS Errors

**Solution:**
- Update Apps Script with CORS headers (see Step 7)
- Or use a CORS proxy (not recommended for production)
- Make sure Apps Script deployment allows "Anyone" access

### Issue: Pages not loading correctly

**Solution:**
- Check browser console (F12) for errors
- Verify `config.js` has the correct Apps Script URL
- Make sure all file paths are relative (not absolute)
- Check that all HTML files reference CSS/JS correctly

### Issue: Login not working

**Solution:**
- Verify Apps Script URL in `config.js`
- Test the Apps Script URL directly in browser
- Check browser console for API errors
- Make sure Apps Script is deployed and active

## 📝 Quick Checklist

- [ ] GitHub repository created (public)
- [ ] Files uploaded to repository
- [ ] `config.js` updated with Apps Script URL
- [ ] GitHub Pages enabled
- [ ] Site URL confirmed
- [ ] Tested login functionality
- [ ] Tested dashboard loading

## 🎉 You're Live!

Once deployed, share your GitHub Pages URL with your LC members:
```
https://YOUR_USERNAME.github.io/aiesec-tm-system/
```

## 🔄 Updating Your Site

To update your site:

```bash
# Make changes to files
git add .
git commit -m "Update dashboard"
git push
```

GitHub Pages will automatically rebuild your site (usually within 1-2 minutes).

## 🔒 Security Notes

- Your Apps Script URL will be visible in the code
- Consider using environment variables for sensitive data (advanced)
- Make sure Apps Script has proper access controls
- Review GitHub repository settings for security

---

**Need Help?** Check the main deployment instructions or GitHub Pages documentation.

