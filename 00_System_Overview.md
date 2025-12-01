# AIESEC TM System - Complete Overview

## 🎯 System Purpose

A comprehensive Talent Management system for AIESEC Local Committees that tracks member engagement, attendance, performance, and provides actionable insights through automated dashboards and alerts.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS (Backend)                  │
├─────────────────────────────────────────────────────────────┤
│  People │ Team Leaders │ Meetings │ Attendance │ Pulse │   │
│  Tasks  │ Dashboards   │ Recognition                        │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│              GOOGLE APPS SCRIPT (Automation)                │
├─────────────────────────────────────────────────────────────┤
│  • QR Attendance Logger                                     │
│  • Weekly Pulse Reminder                                    │
│  • At-Risk Alerts                                           │
│  • Recognition Generator                                    │
│  • API Endpoints                                            │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│              WEB INTERFACE (Frontend)                       │
├─────────────────────────────────────────────────────────────┤
│  • Login Page                                               │
│  • Member Dashboard                                         │
│  • Team Leader Dashboard                                    │
│  • VP TM Dashboard                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Hierarchy

```
                    VP TM
                     │
        ┌────────────┼────────────┐
        │            │            │
    Team Leaders (7 Functions)
        │
    ┌───┼───┐
    │       │
  Members  Members
```

### Functions Structure

**Functions with TLs + Members:**
- iGV → TL + Members
- oGV → TL + Members
- OGT → TL + Members
- IGT → TL + Members
- BXP → TL + Members
- B2B → TL + Members

**Function with TLs Only:**
- TM → TLs only (no members)

---

## 📊 Data Flow

### Attendance Flow
```
Meeting Created → QR Code Generated → Member Scans QR
    → Form Submission → Apps Script → Attendance Tab
    → Auto-calculate Attendance % → Update People Tab
    → Check if At-Risk → Send Alert if needed
```

### Pulse Flow
```
Weekly Trigger (Sunday) → Email Reminder → Member Opens Form
    → Submits Pulse → Apps Script → Weekly Pulse Tab
    → Calculate Pulse Score → Update People Tab
    → Check if At-Risk → Send Alert if needed
```

### Task Flow
```
TL Assigns Task → Tasks Tab → Member Completes
    → Update Status → Calculate Performance Score
    → Update People Tab → Update Dashboards
```

### Alert Flow
```
Daily Check → Analyze Member Data → Identify At-Risk
    → Send Email to TL → Send Email to VP TM
    → Update Dashboard → Track Follow-up
```

---

## 🔄 Automation Timeline

### Daily (8:00 AM)
- **At-Risk Check**: Scans all active members
- **Sends Alerts**: To TLs and VP TM if needed

### Weekly (Sunday, 9:00 AM)
- **Pulse Reminder**: Sends email to all active members
- **Includes**: Personalized link to pulse form

### Monthly (1st, 10:00 AM)
- **Recognition Generation**: Analyzes performance
- **Categories**: Highest Attendance, Performance, Pulse, Most Improved
- **Email**: Sends recognition to all LC members

---

## 📱 Access Points

### For Members
1. **Web Dashboard**: Login with Member ID
2. **QR Attendance**: Scan QR code at meetings
3. **Pulse Form**: Click link in weekly email
4. **View**: Personal stats, tasks, attendance

### For Team Leaders
1. **Web Dashboard**: Login with Member ID (auto-detects TL role)
2. **Create Meetings**: Via dashboard interface
3. **Assign Tasks**: Via dashboard interface
4. **View**: Team performance, at-risk members, trends

### For VP TM
1. **Web Dashboard**: Login with Member ID (auto-detects VP TM role)
2. **Full Access**: All functions, all members
3. **Reports**: Generate monthly reports
4. **View**: LC-wide overview, function comparison, at-risk list

---

## 🎯 Key Metrics Tracked

### Per Member
- **Attendance %**: Based on meetings attended
- **Pulse Score**: Average of feeling + workload (last 4 weeks)
- **Task Score**: Performance on assigned tasks
- **Engagement Status**: Green / Yellow / Red

### Per Team
- **Team Size**: Number of active members
- **Avg Attendance**: Team average attendance %
- **Avg Pulse**: Team average pulse score
- **At-Risk Count**: Number of at-risk members

### LC-Wide
- **Total Active Members**: All active members
- **Total Team Leaders**: All TLs
- **Overall Attendance**: LC average
- **Overall Pulse**: LC average
- **Function Breakdown**: Per-function statistics

---

## 🔐 Security Layers

### Layer 1: Access Control
- Google Sheets permissions (Viewer/Editor)
- Role-based access in web interface
- Member ID authentication

### Layer 2: Data Validation
- Data validation rules in Sheets
- Input sanitization in Apps Script
- Formula protection

### Layer 3: Privacy
- Email addresses protected
- Phone numbers limited access
- Compliance with data protection laws

---

## 📈 Reporting Capabilities

### Real-Time Dashboards
- **VP TM Dashboard**: LC-wide overview
- **Team Leader Dashboards**: Function-specific
- **Member Dashboards**: Personal stats

### Automated Reports
- **Weekly**: Pulse summaries
- **Monthly**: Recognition reports
- **On-Demand**: At-risk member lists

### Historical Tracking
- Attendance trends over time
- Pulse score trends
- Performance improvements
- Cycle comparisons

---

## 🚀 Deployment Options

### Option 1: Google Sites (Easiest)
- **Pros**: Free, easy setup, integrated with Google
- **Cons**: Limited customization
- **Best For**: Quick deployment, minimal technical knowledge

### Option 2: GitHub Pages (More Control)
- **Pros**: Full control, custom domain, version control
- **Cons**: Requires GitHub account, basic Git knowledge
- **Best For**: Customization needs, technical users

---

## 🔧 Maintenance Requirements

### Daily
- Monitor at-risk alerts
- Check for system errors
- Review new data entries

### Weekly
- Review attendance trends
- Check pulse scores
- Update task statuses
- Follow up on at-risk members

### Monthly
- Generate recognition
- Review function performance
- Archive old data
- Update member statuses
- Generate reports for EB

### Quarterly
- System performance review
- User feedback collection
- Plan improvements
- Update documentation
- Train new users

---

## 📚 Documentation Structure

1. **00_System_Overview.md** (This file) - High-level overview
2. **01_Google_Sheets_Structure.md** - Detailed sheet structure
3. **02_Google_Apps_Script.gs** - Complete automation code
4. **03_Apps_Script_HTML_Forms.html** - HTML forms
5. **04_Deployment_Instructions.md** - Step-by-step setup
6. **05_Sample_Data.md** - Sample data for testing
7. **06_Security_and_Best_Practices.md** - Security guidelines
8. **07_Quick_Reference_Guide.md** - Quick reference
9. **README.md** - Project overview and quick start

---

## ✅ System Capabilities

### ✅ Implemented Features
- [x] Hierarchical structure (VP TM → TLs → Members)
- [x] QR code attendance tracking
- [x] Weekly pulse check-ins
- [x] Performance scoring
- [x] Multi-level dashboards
- [x] Automated alerts
- [x] Recognition system
- [x] Free hosting options
- [x] Mobile-friendly interface
- [x] Email notifications
- [x] Data validation
- [x] Formula automation

### 🔄 Future Enhancements (Optional)
- [ ] Password authentication
- [ ] Two-factor authentication
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integration with other systems
- [ ] Custom reporting
- [ ] Multi-language support

---

## 🎓 Getting Started Path

### For VP TM (System Admin)
1. Read `04_Deployment_Instructions.md`
2. Set up Google Sheets
3. Deploy Apps Script
4. Deploy web interface
5. Add sample data
6. Test system
7. Add real data
8. Train Team Leaders

### For Team Leaders
1. Receive login credentials
2. Access Team Leader dashboard
3. Learn to create meetings
4. Learn to assign tasks
5. Understand at-risk alerts
6. Review team performance

### For Members
1. Receive Member ID
2. Access member dashboard
3. Learn to check in via QR
4. Submit weekly pulse
5. View personal stats

---

## 📞 Support Structure

### Level 1: Self-Service
- Documentation files
- Quick reference guide
- Troubleshooting section

### Level 2: VP TM Support
- System administration
- Data questions
- Access issues
- Feature requests

### Level 3: Technical Support
- Apps Script issues
- Formula problems
- Deployment issues
- Custom modifications

---

## 🎯 Success Metrics

### System Adoption
- % of members using dashboard
- Pulse submission rate
- Attendance tracking accuracy

### Member Engagement
- Average pulse scores
- Attendance rates
- Task completion rates
- Retention rates

### Team Performance
- Function-level metrics
- Team Leader effectiveness
- At-risk member reduction

### LC Impact
- Overall engagement improvement
- Retention improvement
- Recognition participation
- System satisfaction

---

## 🌟 Key Benefits

### For VP TM
- **Visibility**: Full LC overview
- **Automation**: Less manual work
- **Data-Driven**: Evidence-based decisions
- **Efficiency**: Streamlined processes

### For Team Leaders
- **Team Insights**: Clear team performance
- **Early Alerts**: Catch issues early
- **Easy Management**: Simple task assignment
- **Time Savings**: Automated tracking

### For Members
- **Transparency**: See own performance
- **Recognition**: Monthly recognition
- **Support**: Early intervention
- **Engagement**: Pulse feedback loop

### For LC
- **Retention**: Better member retention
- **Engagement**: Higher engagement rates
- **Data**: Rich data for decision-making
- **Culture**: Recognition culture

---

## 🚀 Ready to Deploy?

1. **Start Here**: `04_Deployment_Instructions.md`
2. **Reference**: `07_Quick_Reference_Guide.md`
3. **Security**: `06_Security_and_Best_Practices.md`
4. **Support**: All documentation files

---

**Welcome to your AIESEC TM System!** 🎉

This system is designed to make Talent Management easier, more data-driven, and more effective for your Local Committee.

Good luck with your deployment! 🌟

