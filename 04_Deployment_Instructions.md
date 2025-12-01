# AIESEC TM System - Complete Deployment Guide

## 📋 Prerequisites

1. Google Account with access to Google Sheets
2. Google Drive access
3. (Optional) GitHub account for GitHub Pages hosting
4. Basic understanding of Google Apps Script

---

## 🚀 STEP 1: SET UP GOOGLE SHEETS

### 1.1 Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"AIESEC TM Pulse System"** (or your preferred name)
4. Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

### 1.2 Create All Tabs

Create the following tabs in order:
1. **People**
2. **Team Leaders**
3. **Meetings**
4. **Attendance**
5. **Weekly Pulse**
6. **Tasks**
7. **VP TM Dashboard**
8. **iGV TL Dashboard**
9. **oGV TL Dashboard**
10. **OGT TL Dashboard**
11. **IGT TL Dashboard**
12. **BXP TL Dashboard**
13. **B2B TL Dashboard**
14. **Recognition**

### 1.3 Set Up Column Headers

For each tab, add the column headers as specified in `01_Google_Sheets_Structure.md`.

**Quick Reference:**

**People Tab (A-M):**
- A: Member ID
- B: Name
- C: Role Type
- D: Function
- E: Team Leader
- F: Email
- G: Phone
- H: Start Date
- I: Status
- J: Attendance %
- K: Pulse Score (Last 4 Weeks)
- L: Task Score
- M: Engagement Status

### 1.4 Add Formulas

**In People Tab:**

- **Column A (Member ID)** - Row 2:
  ```
  ="TM"&TEXT(ROW()-1,"0000")
  ```

- **Column E (Team Leader)** - Row 2:
  ```
  =IF(C2="Team Leader","N/A",IF(C2="VP TM","N/A",IF(D2="TM","N/A",FILTER(People!B:B,People!C:C="Team Leader",People!D:D=D2))))
  ```

- **Column J (Attendance %)** - Row 2:
  ```
  =IFERROR(COUNTIF(Attendance!B:B,A2)/COUNTIF(Meetings!A:A,"<>")*100,0)
  ```

- **Column K (Pulse Score)** - Row 2:
  ```
  =IFERROR(AVERAGE(FILTER(Weekly Pulse!J:J,Weekly Pulse!B:B=A2,Weekly Pulse!A:A>=TODAY()-28)),0)
  ```

- **Column L (Task Score)** - Row 2:
  ```
  =IFERROR(SUMIF(Tasks!B:B,A2,Tasks!H:H)/MAX(COUNTIF(Tasks!B:B,A2),1),0)
  ```

- **Column M (Engagement Status)** - Row 2:
  ```
  =IF(OR(J2<60,K2<2),"RED",IF(OR(J2<80,K2<3),"YELLOW","GREEN"))
  ```

**Copy formulas down** for all rows (or use array formulas if preferred).

### 1.5 Set Up Data Validation

1. **Column C (Role Type)** - Select column C, Data > Data validation:
   - Criteria: List of items
   - Values: `VP TM,EB,Team Leader,Member`

2. **Column D (Function)** - Select column D, Data > Data validation:
   - Criteria: List of items
   - Values: `iGV,oGV,OGT,IGT,BXP,B2B,TM`

3. **Column I (Status)** - Select column I, Data > Data validation:
   - Criteria: List of items
   - Values: `Active,On Hold,Left`

4. **Column E (Team Leader)** - This will use a formula, but you can add dropdown validation:
   - Criteria: List from range
   - Range: `People!B:B` (filtered by Team Leaders)

### 1.6 Protect Formulas

1. Select columns J, K, L, M (formula columns)
2. Right-click > Protect range
3. Name: "Formula Protection"
4. Set permissions: Only you can edit

---

## 🔧 STEP 2: SET UP GOOGLE APPS SCRIPT

### 2.1 Open Apps Script Editor

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete the default `myFunction` code
3. Copy the entire content from `02_Google_Apps_Script.gs`
4. Paste it into the Apps Script editor

### 2.2 Update Configuration

In the Apps Script file, update these constants:

```javascript
const SHEET_NAME = 'AIESEC TM Pulse System'; // Your sheet name
const VP_TM_EMAIL = 'vptm@yourlc.aiesec.org'; // Your VP TM email
```

### 2.3 Create HTML Files in Apps Script

1. In Apps Script editor, click **+** next to Files
2. Select **HTML**
3. Name it: **AttendanceForm**
4. Copy the first HTML block from `03_Apps_Script_HTML_Forms.html` (AttendanceForm section)
5. Repeat for **PulseForm** (second HTML block)

### 2.4 Update doGet Function

The `doGet` function in Apps Script should handle different pages:

```javascript
function doGet(e) {
  const page = e.parameter.page;
  
  if (page === 'attendance') {
    return HtmlService.createHtmlOutputFromFile('AttendanceForm')
      .setTitle('AIESEC Attendance Check-in');
  } else if (page === 'pulse') {
    return HtmlService.createHtmlOutputFromFile('PulseForm')
      .setTitle('AIESEC Weekly Pulse');
  } else {
    // Default or API endpoint
    const action = e.parameter.action;
    if (action === 'getMember') {
      return ContentService.createTextOutput(
        JSON.stringify(getMemberData(e.parameter.memberId))
      ).setMimeType(ContentService.MimeType.JSON);
    }
    // Add other API endpoints...
  }
}
```

### 2.5 Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Set:
   - **Description**: AIESEC TM System API
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web App URL** - you'll need this!

### 2.6 Set Up Triggers

1. In Apps Script editor, click the clock icon ⏰ (Triggers)
2. Click **+ Add Trigger**
3. Set up:
   - **Function**: `sendWeeklyPulseReminder`
   - **Event source**: Time-driven
   - **Type**: Week timer
   - **Day of week**: Sunday
   - **Time**: 9:00 AM
4. Repeat for:
   - `dailyAtRiskCheck` - Daily, 8:00 AM
   - `generateMonthlyRecognition` - Monthly, 1st day, 10:00 AM

**OR** run `setupTriggers()` function once manually.

### 2.7 Authorize Permissions

1. When you first run a function, Google will ask for permissions
2. Click **Review Permissions**
3. Choose your Google account
4. Click **Advanced > Go to [Project Name] (unsafe)**
5. Click **Allow**

---

## 🌐 STEP 3: SET UP WEB INTERFACE

### Option A: Google Sites (Easiest)

#### 3.1 Create Google Site

1. Go to [Google Sites](https://sites.google.com)
2. Create a new site
3. Name it: "AIESEC TM System"

#### 3.2 Embed Web App

1. Click **Insert > Embed**
2. Paste your Apps Script Web App URL
3. Adjust size: 1000px width, 800px height
4. Publish the site

#### 3.3 Add Pages

1. Create pages:
   - Login (home)
   - Member Dashboard
   - Team Leader Dashboard
   - VP TM Dashboard

2. For each dashboard page, embed the Apps Script URL with appropriate parameters

### Option B: GitHub Pages (More Control)

#### 3.1 Set Up GitHub Repository

1. Create a new GitHub repository
2. Name it: `aiesec-tm-system`
3. Make it public (required for free GitHub Pages)

#### 3.2 Upload Files

1. Upload all files from the `web/` folder:
   - `index.html`
   - `member-dashboard.html`
   - `tl-dashboard.html`
   - `vptm-dashboard.html`
   - `styles.css`
   - `app.js`

#### 3.3 Update API URL

In `app.js`, replace:
```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
```
With your actual Apps Script Web App URL.

#### 3.4 Enable GitHub Pages

1. Go to repository **Settings > Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** (or master)
4. Folder: **/ (root)**
5. Click **Save**
6. Your site will be at: `https://[username].github.io/aiesec-tm-system/`

#### 3.5 Handle CORS (If Needed)

If you encounter CORS issues, you may need to:
1. Add CORS headers in Apps Script
2. Or use a proxy service
3. Or deploy Apps Script with proper CORS settings

---

## 📝 STEP 4: ADD SAMPLE DATA

### 4.1 Add Team Leaders First

In the **People** tab, add Team Leaders:

| Member ID | Name | Role Type | Function | Team Leader | Email | Phone | Start Date | Status |
|-----------|------|-----------|----------|------------|-------|-------|------------|--------|
| TM0001 | John Doe | Team Leader | iGV | N/A | john@example.com | +1234567890 | 2024-01-01 | Active |
| TM0002 | Jane Smith | Team Leader | oGV | N/A | jane@example.com | +1234567891 | 2024-01-01 | Active |
| TM0003 | Bob Wilson | Team Leader | OGT | N/A | bob@example.com | +1234567892 | 2024-01-01 | Active |
| TM0004 | Alice Brown | Team Leader | IGT | N/A | alice@example.com | +1234567893 | 2024-01-01 | Active |
| TM0005 | Charlie Davis | Team Leader | BXP | N/A | charlie@example.com | +1234567894 | 2024-01-01 | Active |
| TM0006 | Diana Lee | Team Leader | B2B | N/A | diana@example.com | +1234567895 | 2024-01-01 | Active |
| TM0007 | Frank Miller | Team Leader | TM | N/A | frank@example.com | +1234567896 | 2024-01-01 | Active |
| TM0008 | Grace Taylor | VP TM | TM | N/A | grace@example.com | +1234567897 | 2024-01-01 | Active |

### 4.2 Add Members

Add members with their Team Leaders:

| Member ID | Name | Role Type | Function | Team Leader | Email | ... |
|-----------|------|-----------|----------|------------|-------|-----|
| TM0009 | Member 1 | Member | iGV | John Doe | member1@example.com | ... |
| TM0010 | Member 2 | Member | iGV | John Doe | member2@example.com | ... |
| TM0011 | Member 3 | Member | oGV | Jane Smith | member3@example.com | ... |

### 4.3 Create Sample Meetings

In **Meetings** tab:

| Meeting ID | Meeting Name | Function | Team Leader | Date | Time | Location |
|------------|--------------|----------|-------------|------|------|----------|
| MTG0001 | iGV Weekly Meeting | iGV | John Doe | 2024-01-15 | 18:00 | Room A |
| MTG0002 | oGV Team Sync | oGV | Jane Smith | 2024-01-16 | 19:00 | Room B |

---

## 🔒 STEP 5: SECURITY SETUP

### 5.1 Sheet Permissions

1. Click **Share** button in Google Sheet
2. Set permissions:
   - **VP TM**: Editor access
   - **Team Leaders**: Viewer access (or limited editor for their function)
   - **Members**: Viewer access (or no access, use web interface only)

### 5.2 Apps Script Security

1. In Apps Script deployment settings:
   - **Execute as**: Me (your account)
   - **Who has access**: Anyone (for web app) OR Specific users

### 5.3 Web Interface Security

- Member IDs are the primary authentication
- Consider adding password/email verification
- Implement session timeouts
- Use HTTPS (automatic with Google Sites/GitHub Pages)

### 5.4 Data Privacy

- Ensure compliance with local data protection laws
- Don't share sensitive information publicly
- Use email addresses responsibly
- Consider anonymizing data for reports

---

## ✅ STEP 6: TESTING

### 6.1 Test Attendance

1. Create a meeting in the Meetings tab
2. Get the QR code link
3. Open the link in a browser
4. Enter a member ID and meeting ID
5. Check if attendance is logged

### 6.2 Test Pulse

1. Open pulse form URL
2. Submit a pulse entry
3. Verify it appears in Weekly Pulse tab

### 6.3 Test Dashboards

1. Login with different member IDs
2. Verify correct dashboard loads based on role
3. Check data accuracy

### 6.4 Test Alerts

1. Manually set a member's attendance < 60%
2. Run `checkAtRiskMember()` function
3. Verify emails are sent

---

## 🎯 STEP 7: GO LIVE

1. **Share the web interface URL** with your LC
2. **Train Team Leaders** on how to use the system
3. **Send initial pulse reminders** manually if needed
4. **Monitor the first week** for any issues
5. **Gather feedback** and iterate

---

## 🔄 MAINTENANCE

### Weekly Tasks
- Review at-risk members
- Check attendance trends
- Follow up on low pulse scores

### Monthly Tasks
- Generate recognition report
- Review function performance
- Update member statuses (Active/On Hold/Left)

### Cycle Management
- Add "Cycle" column to People tab
- Archive old cycle data
- Reset metrics for new cycle

---

## 🆘 TROUBLESHOOTING

### Formulas Not Updating
- Check if cells are protected
- Verify formula syntax
- Refresh the sheet

### Apps Script Errors
- Check execution logs (View > Execution log)
- Verify permissions
- Test functions individually

### Web Interface Not Loading
- Verify Apps Script Web App URL is correct
- Check CORS settings
- Verify deployment is active

### Emails Not Sending
- Check spam folder
- Verify email addresses are correct
- Check Apps Script quotas

---

## 📞 SUPPORT

For issues or questions:
1. Check Apps Script execution logs
2. Review Google Sheets formula errors
3. Test individual functions
4. Consult Google Apps Script documentation

---

## 🎉 YOU'RE READY!

Your AIESEC TM System is now set up and ready to use. Good luck with your talent management! 🌟

