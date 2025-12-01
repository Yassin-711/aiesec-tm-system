# System Architecture Explanation

## 🏗️ How the Two "Websites" Work Together

You have **one integrated system** with two components that work together:

### 1. **Main Web Dashboards** (GitHub Pages / Your Web Server)
- **Location**: `index.html`, `vptm-dashboard.html`, `tl-dashboard.html`, `member-dashboard.html`
- **Purpose**: Main interface for viewing data, stats, and dashboards
- **Hosted on**: GitHub Pages or your web server
- **Features**:
  - Login system
  - Dashboard views (VP TM, Team Leader, Member)
  - Data visualization
  - Navigation between dashboards

### 2. **Forms** (Standalone HTML Pages)
- **Location**: `attendance-form.html`, `pulse-form.html`
- **Purpose**: Submit attendance and pulse data
- **Hosted on**: Same location as dashboards (GitHub Pages)
- **Features**:
  - Attendance check-in form
  - Weekly pulse submission form
  - Direct API calls to Google Apps Script

### 3. **Google Apps Script** (Backend API)
- **Location**: Your Google Sheet → Apps Script
- **Purpose**: Backend API that connects everything
- **Functions**:
  - Provides data to dashboards (API endpoints)
  - Processes form submissions
  - Manages Google Sheets data
  - Sends automated emails

## 🔄 How They Work Together

```
User → Main Dashboard (GitHub Pages)
  ↓
Clicks "Check In" button
  ↓
Opens attendance-form.html (same domain)
  ↓
Form submits to Apps Script API
  ↓
Apps Script updates Google Sheets
  ↓
Dashboard refreshes to show updated data
```

## 📱 User Flow

### For Members:
1. **Login** → `index.html` (main dashboard site)
2. **View Dashboard** → `member-dashboard.html` (shows their stats)
3. **Click "Check In"** → Opens `attendance-form.html` (form page)
4. **Submit Attendance** → Data goes to Apps Script → Google Sheets
5. **Return to Dashboard** → See updated attendance percentage

### For Team Leaders:
1. **Login** → `index.html`
2. **View Dashboard** → `tl-dashboard.html` (shows team stats)
3. **View Team Members** → See their attendance, pulse, tasks
4. **Create Meetings** → Via dashboard interface

### For VP TM:
1. **Login** → `index.html`
2. **View Dashboard** → `vptm-dashboard.html` (LC-wide overview)
3. **See All Functions** → Compare performance across functions
4. **Monitor At-Risk Members** → Get alerts and insights

## 🎯 Why Two Separate Pages?

### Benefits:
1. **Better UX**: Forms open in focused windows/modals
2. **Mobile Friendly**: Forms work well on phones
3. **Separation of Concerns**: Dashboards for viewing, forms for input
4. **Flexibility**: Forms can be accessed directly via QR codes

### Alternative (If You Want One Page):
You could embed forms in modals within the dashboards, but separate pages are:
- Easier to maintain
- Better for mobile
- Can be bookmarked/shared directly

## 🔧 Current Setup

### What You Have:
✅ **Main Dashboards** - Beautiful, modern interface
✅ **Standalone Forms** - Clean, focused forms
✅ **Apps Script API** - Backend that connects everything
✅ **Google Sheets** - Data storage

### How to Use:

1. **Deploy Everything to GitHub Pages**:
   - All HTML files (dashboards + forms)
   - CSS and JavaScript files
   - Config file

2. **Access Your Site**:
   ```
   https://YOUR_USERNAME.github.io/aiesec-tm-system/
   ```

3. **Users Flow**:
   - Login → See dashboard
   - Click buttons → Forms open
   - Submit data → Updates in real-time

## 🚀 Integration Options

### Option 1: Current Setup (Recommended)
- Dashboards and forms are separate pages
- Forms open in new windows
- Clean separation, easy to maintain

### Option 2: Embedded Modals
- Forms open as modals within dashboards
- Everything on one page
- More complex but feels more integrated

### Option 3: Single Page Application
- Everything in one HTML file
- JavaScript handles routing
- Most complex but most integrated

## 📝 File Structure

```
web/
├── index.html              # Login page (main entry)
├── vptm-dashboard.html     # VP TM dashboard
├── tl-dashboard.html       # Team Leader dashboard
├── member-dashboard.html   # Member dashboard
├── attendance-form.html    # Attendance form (standalone)
├── pulse-form.html        # Pulse form (standalone)
├── styles.css             # All styling
├── app.js                 # Main JavaScript
└── config.js              # Apps Script URL config
```

## ✅ Summary

**You don't have "two websites"** - you have **one integrated system** with:
- **Main interface** (dashboards) for viewing data
- **Forms** for submitting data
- **Backend API** (Apps Script) connecting everything

Everything works together seamlessly! 🎉

---

**Next Steps:**
1. Deploy all files to GitHub Pages
2. Test the complete flow
3. Share the URL with your LC members

