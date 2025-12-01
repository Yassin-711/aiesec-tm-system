# Setting Up Your Apps Script Web App URL

## ⚠️ Important: Configure Your Apps Script URL

The dashboards need to connect to your Google Apps Script Web App to fetch data. Follow these steps:

## 📋 Step-by-Step Instructions

### 1. Deploy Your Apps Script

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Make sure your code is saved (File > Save)
4. Click **Deploy > New deployment**
5. Click the gear icon ⚙️ next to "Select type"
6. Choose **Web app**
7. Configure:
   - **Description**: AIESEC TM System API
   - **Execute as**: Me
   - **Who has access**: Anyone (or "Anyone with Google account" for more security)
8. Click **Deploy**
9. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

### 2. Update Configuration File

1. Open `web/config.js` in your project
2. Replace `'YOUR_APPS_SCRIPT_WEB_APP_URL'` with your actual URL
3. Example:
   ```javascript
   window.APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby123456789/exec';
   ```

### 3. Test the Connection

1. Open your dashboard in a browser
2. Check the browser console (F12) for any errors
3. If you see "Apps Script URL not configured", make sure you updated `config.js`
4. Try logging in with a test Member ID

## 🔧 Troubleshooting

### Issue: "Error connecting to server"

**Solution:**
- Verify your Apps Script URL is correct
- Make sure the Apps Script is deployed (not just saved)
- Check that "Who has access" is set to "Anyone" or "Anyone with Google account"
- Try accessing the URL directly in a browser - you should see JSON or an HTML form

### Issue: "CORS error" or "Network error"

**Solution:**
- Make sure your Apps Script deployment is active
- Check that the URL doesn't have any extra characters
- Verify the Apps Script has the `doGet` function that handles API calls

### Issue: Dashboard shows "Loading..." forever

**Solution:**
- Open browser console (F12) and check for errors
- Verify the Apps Script URL is correct
- Test the API endpoint directly:
  ```
  https://your-apps-script-url?action=getVPTMDashboard
  ```
- You should see JSON data, not an HTML form

## 📝 Quick Checklist

- [ ] Apps Script is deployed as Web App
- [ ] Web App URL is copied
- [ ] `config.js` is updated with the URL
- [ ] URL is accessible (try in browser)
- [ ] API endpoint returns JSON (not HTML form)

## 🎯 Testing Your Setup

1. **Test API Endpoint:**
   Open in browser: `YOUR_APPS_SCRIPT_URL?action=getVPTMDashboard`
   - Should return JSON data
   - Should NOT show attendance form

2. **Test Login:**
   - Go to login page
   - Enter a valid Member ID
   - Should redirect to appropriate dashboard

3. **Test Dashboard:**
   - Dashboard should load data
   - Charts should display
   - No console errors

## 🔒 Security Note

If you set "Who has access" to "Anyone with Google account":
- Users need to be logged into Google
- More secure but requires Google authentication
- For public access, use "Anyone"

---

**Once configured, your dashboards will fetch real-time data from Google Sheets!** 🎉

