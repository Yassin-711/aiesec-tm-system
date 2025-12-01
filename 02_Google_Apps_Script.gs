/**
 * AIESEC TM System - Google Apps Script
 * Full automation for attendance, pulse, alerts, and recognition
 */

// ============================================
// CONFIGURATION
// ============================================

const SHEET_NAME = 'TM Pulse System'; // Change to your sheet name
const PEOPLE_TAB = 'People';
const ATTENDANCE_TAB = 'Attendance';
const PULSE_TAB = 'Weekly Pulse';
const TASKS_TAB = 'Tasks';
const MEETINGS_TAB = 'Meetings';
const RECOGNITION_TAB = 'Recognition';
const VP_TM_EMAIL = 'vptm@aiesec.org'; // Change to your VP TM email

// ============================================
// QR ATTENDANCE LOGGER
// ============================================

/**
 * Web app endpoint - handles both HTML forms and API calls
 * Deploy as web app with execute as: Me, access: Anyone
 */
function doGet(e) {
  const page = e.parameter.page;
  const action = e.parameter.action;
  
  // Handle HTML pages
  if (page === 'attendance') {
    return HtmlService.createHtmlOutputFromFile('AttendanceForm')
      .setTitle('AIESEC Attendance Check-in');
  } else if (page === 'pulse') {
    return HtmlService.createHtmlOutputFromFile('PulseForm')
      .setTitle('AIESEC Weekly Pulse');
  }
  
  // Handle API calls
  if (action === 'getMember') {
    const memberId = e.parameter.memberId;
    const result = getMemberData(memberId);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'getTeam') {
    const teamLeader = e.parameter.teamLeader;
    const result = getTeamData(teamLeader);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'getVPTMDashboard') {
    const result = getVPTMDashboardData();
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'logAttendance') {
    const memberId = e.parameter.memberId;
    const meetingId = e.parameter.meetingId;
    const result = logAttendance(memberId, meetingId);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'submitPulse') {
    const memberId = e.parameter.memberId;
    const feeling = e.parameter.feeling;
    const workload = e.parameter.workload;
    const hours = e.parameter.hours;
    const thinkingLeaving = e.parameter.thinkingLeaving;
    const result = submitPulse(memberId, feeling, workload, hours, thinkingLeaving);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Default: return attendance form
  return HtmlService.createHtmlOutputFromFile('AttendanceForm')
    .setTitle('AIESEC TM System');
}

/**
 * Process attendance from QR scan
 * Called from web form
 */
function logAttendance(memberId, meetingId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
    const attendanceSheet = ss.getSheetByName(ATTENDANCE_TAB);
    const meetingsSheet = ss.getSheetByName(MEETINGS_TAB);
    
    // Get member info
    const peopleData = peopleSheet.getDataRange().getValues();
    const memberRow = peopleData.findIndex(row => row[0] === memberId);
    
    if (memberRow === -1) {
      return { success: false, message: 'Member ID not found' };
    }
    
    const memberInfo = peopleData[memberRow];
    const memberName = memberInfo[1];
    const memberFunction = memberInfo[3];
    const memberTL = memberInfo[4];
    const memberStatus = memberInfo[8];
    
    if (memberStatus !== 'Active') {
      return { success: false, message: 'Member is not active' };
    }
    
    // Get meeting info
    const meetingsData = meetingsSheet.getDataRange().getValues();
    const meetingRow = meetingsData.findIndex(row => row[0] === meetingId);
    
    if (meetingRow === -1) {
      return { success: false, message: 'Meeting not found' };
    }
    
    const meetingInfo = meetingsData[meetingRow];
    const meetingName = meetingInfo[1];
    const meetingDate = meetingInfo[4];
    const meetingTime = meetingInfo[5];
    
    // Check if already logged
    const attendanceData = attendanceSheet.getDataRange().getValues();
    const alreadyLogged = attendanceData.some(row => 
      row[1] === memberId && row[6] === meetingId
    );
    
    if (alreadyLogged) {
      return { success: false, message: 'Attendance already logged for this meeting' };
    }
    
    // Calculate if late (more than 10 minutes after meeting time)
    const now = new Date();
    const meetingDateTime = new Date(meetingDate);
    meetingDateTime.setHours(meetingTime.getHours(), meetingTime.getMinutes(), 0, 0);
    const lateThreshold = new Date(meetingDateTime.getTime() + 10 * 60 * 1000);
    const isLate = now > lateThreshold;
    
    // Log attendance
    const newRow = [
      now, // Timestamp
      memberId,
      memberName,
      memberFunction,
      memberTL,
      meetingName,
      meetingId,
      'Present',
      isLate ? 'Yes' : 'No'
    ];
    
    attendanceSheet.appendRow(newRow);
    
    // Trigger at-risk check
    checkAtRiskMember(memberId);
    
    return { success: true, message: 'Attendance logged successfully' };
    
  } catch (error) {
    Logger.log('Error logging attendance: ' + error.toString());
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

// ============================================
// WEEKLY PULSE REMINDER
// ============================================

/**
 * Trigger this function weekly (Sunday) via time-driven trigger
 */
function sendWeeklyPulseReminder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const peopleData = peopleSheet.getDataRange().getValues();
  
  // Skip header row
  const members = peopleData.slice(1);
  
  const webAppUrl = ScriptApp.getService().getUrl();
  const pulseFormUrl = webAppUrl + '?page=pulse';
  
  members.forEach((row, index) => {
    const memberId = row[0];
    const memberName = row[1];
    const memberEmail = row[5];
    const memberStatus = row[8];
    
    if (memberStatus === 'Active' && memberEmail) {
      const subject = 'AIESEC Weekly Pulse Check-in - ' + new Date().toLocaleDateString();
      const body = 'Hi ' + memberName + ',\n\n' +
        'This is your weekly pulse check-in reminder!\n\n' +
        'Please take 2 minutes to complete your pulse:\n' +
        pulseFormUrl + '?id=' + memberId + '\n\n' +
        'Your feedback helps us improve the experience for everyone.\n\n' +
        'Best regards,\n' +
        'AIESEC TM System';
      
      try {
        MailApp.sendEmail(memberEmail, subject, body);
        Logger.log('Sent pulse reminder to: ' + memberEmail);
      } catch (error) {
        Logger.log('Error sending email to ' + memberEmail + ': ' + error.toString());
      }
    }
  });
}

/**
 * Process pulse submission
 */
function submitPulse(memberId, feeling, workload, hours, thinkingLeaving) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
    const pulseSheet = ss.getSheetByName(PULSE_TAB);
    
    // Get member info
    const peopleData = peopleSheet.getDataRange().getValues();
    const memberRow = peopleData.findIndex(row => row[0] === memberId);
    
    if (memberRow === -1) {
      return { success: false, message: 'Member ID not found' };
    }
    
    const memberInfo = peopleData[memberRow];
    const memberName = memberInfo[1];
    const memberFunction = memberInfo[3];
    const memberTL = memberInfo[4];
    
    // Calculate pulse score
    const pulseScore = (parseFloat(feeling) + parseFloat(workload)) / 2;
    
    // Log pulse
    const newRow = [
      new Date(), // Timestamp
      memberId,
      memberName,
      memberFunction,
      memberTL,
      feeling,
      workload,
      hours,
      thinkingLeaving,
      pulseScore
    ];
    
    pulseSheet.appendRow(newRow);
    
    // Check at-risk if needed
    if (pulseScore < 2 || thinkingLeaving === 'Yes') {
      checkAtRiskMember(memberId);
    }
    
    return { success: true, message: 'Pulse submitted successfully' };
    
  } catch (error) {
    Logger.log('Error submitting pulse: ' + error.toString());
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

// ============================================
// AT-RISK ALERTS
// ============================================

/**
 * Check if member is at-risk and send alerts
 */
function checkAtRiskMember(memberId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const peopleData = peopleSheet.getDataRange().getValues();
  
  const memberRow = peopleData.findIndex(row => row[0] === memberId);
  if (memberRow === -1) return;
  
  const memberInfo = peopleData[memberRow];
  const memberName = memberInfo[1];
  const memberFunction = memberInfo[3];
  const memberTL = memberInfo[4];
  const memberEmail = memberInfo[5];
  const attendancePercent = memberInfo[9] || 0;
  const pulseScore = memberInfo[10] || 0;
  const engagementStatus = memberInfo[12];
  
  // Check recent pulse for "thinking about leaving"
  const pulseSheet = ss.getSheetByName(PULSE_TAB);
  const pulseData = pulseSheet.getDataRange().getValues();
  const recentPulses = pulseData.filter(row => 
    row[1] === memberId && 
    new Date(row[0]) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const thinkingLeaving = recentPulses.some(row => row[8] === 'Yes');
  
  // Determine if at-risk
  const isAtRisk = attendancePercent < 60 || 
                   pulseScore < 2 || 
                   thinkingLeaving ||
                   engagementStatus === 'RED';
  
  if (isAtRisk) {
    // Get TL email
    const tlRow = peopleData.findIndex(row => 
      row[1] === memberTL && row[2] === 'Team Leader'
    );
    const tlEmail = tlRow !== -1 ? peopleData[tlRow][5] : null;
    
    // Send alert to TL
    if (tlEmail) {
      const subject = '⚠️ At-Risk Member Alert: ' + memberName;
      const body = 'Dear Team Leader,\n\n' +
        'We have identified ' + memberName + ' (' + memberFunction + ') as at-risk.\n\n' +
        'Details:\n' +
        '- Attendance: ' + attendancePercent.toFixed(1) + '%\n' +
        '- Pulse Score: ' + pulseScore.toFixed(1) + '/5\n' +
        '- Thinking about leaving: ' + (thinkingLeaving ? 'Yes' : 'No') + '\n' +
        '- Engagement Status: ' + engagementStatus + '\n\n' +
        'Please reach out to support this member.\n\n' +
        'AIESEC TM System';
      
      try {
        MailApp.sendEmail(tlEmail, subject, body);
      } catch (error) {
        Logger.log('Error sending alert to TL: ' + error.toString());
      }
    }
    
    // Send alert to VP TM
    const vpSubject = '⚠️ At-Risk Member Alert: ' + memberName + ' (' + memberFunction + ')';
    const vpBody = 'Dear VP TM,\n\n' +
      'At-risk member identified:\n\n' +
      'Name: ' + memberName + '\n' +
      'Function: ' + memberFunction + '\n' +
      'Team Leader: ' + memberTL + '\n' +
      'Attendance: ' + attendancePercent.toFixed(1) + '%\n' +
      'Pulse Score: ' + pulseScore.toFixed(1) + '/5\n' +
      'Thinking about leaving: ' + (thinkingLeaving ? 'Yes' : 'No') + '\n' +
      'Email: ' + memberEmail + '\n\n' +
      'AIESEC TM System';
    
    try {
      MailApp.sendEmail(VP_TM_EMAIL, vpSubject, vpBody);
    } catch (error) {
      Logger.log('Error sending alert to VP TM: ' + error.toString());
    }
  }
}

/**
 * Daily check for all at-risk members
 * Set up time-driven trigger to run daily
 */
function dailyAtRiskCheck() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const peopleData = peopleSheet.getDataRange().getValues();
  
  // Skip header row
  const members = peopleData.slice(1);
  
  members.forEach(row => {
    const memberId = row[0];
    const memberStatus = row[8];
    
    if (memberStatus === 'Active') {
      checkAtRiskMember(memberId);
    }
  });
}

// ============================================
// RECOGNITION GENERATOR
// ============================================

/**
 * Generate monthly recognition
 * Run at end of month via time-driven trigger
 */
function generateMonthlyRecognition() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const tasksSheet = ss.getSheetByName(TASKS_TAB);
  const recognitionSheet = ss.getSheetByName(RECOGNITION_TAB);
  
  const currentMonth = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM yyyy');
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = Utilities.formatDate(lastMonth, Session.getScriptTimeZone(), 'MMMM yyyy');
  
  const peopleData = peopleSheet.getDataRange().getValues();
  const activeMembers = peopleData.slice(1).filter(row => row[8] === 'Active');
  
  // Highest Attendance
  const highestAttendance = activeMembers.reduce((max, member) => {
    return (member[9] || 0) > (max[9] || 0) ? member : max;
  }, activeMembers[0]);
  
  if (highestAttendance) {
    recognitionSheet.appendRow([
      lastMonthStr,
      'Highest Attendance',
      highestAttendance[1],
      highestAttendance[0],
      highestAttendance[3],
      highestAttendance[9],
      new Date()
    ]);
  }
  
  // Highest Performance (Task Score)
  const highestPerformance = activeMembers.reduce((max, member) => {
    return (member[11] || 0) > (max[11] || 0) ? member : max;
  }, activeMembers[0]);
  
  if (highestPerformance) {
    recognitionSheet.appendRow([
      lastMonthStr,
      'Highest Performance',
      highestPerformance[1],
      highestPerformance[0],
      highestPerformance[3],
      highestPerformance[11],
      new Date()
    ]);
  }
  
  // Best Pulse
  const bestPulse = activeMembers.reduce((max, member) => {
    return (member[10] || 0) > (max[10] || 0) ? member : max;
  }, activeMembers[0]);
  
  if (bestPulse) {
    recognitionSheet.appendRow([
      lastMonthStr,
      'Best Pulse',
      bestPulse[1],
      bestPulse[0],
      bestPulse[3],
      bestPulse[10],
      new Date()
    ]);
  }
  
  // Most Improved (compare last 2 months)
  // This would require historical tracking - simplified version
  const mostImproved = activeMembers[0]; // Placeholder - implement improvement calculation
  
  // Send recognition email to LC
  sendRecognitionEmail(lastMonthStr);
}

/**
 * Send recognition email to LC
 */
function sendRecognitionEmail(month) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const recognitionSheet = ss.getSheetByName(RECOGNITION_TAB);
  const recognitionData = recognitionSheet.getDataRange().getValues();
  
  const monthRecognitions = recognitionData.filter(row => row[0] === month);
  
  if (monthRecognitions.length === 0) return;
  
  let emailBody = '🎉 Monthly Recognition - ' + month + '\n\n';
  emailBody += 'Congratulations to our outstanding members!\n\n';
  
  const categories = ['Highest Attendance', 'Highest Performance', 'Best Pulse', 'Most Improved'];
  
  categories.forEach(category => {
    const recognition = monthRecognitions.find(row => row[1] === category);
    if (recognition) {
      emailBody += category + ':\n';
      emailBody += '- ' + recognition[2] + ' (' + recognition[4] + ')\n';
      emailBody += '- Achievement: ' + recognition[5] + '\n\n';
    }
  });
  
  emailBody += 'Keep up the amazing work!\n\n';
  emailBody += 'AIESEC TM System';
  
  // Get all active member emails
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const peopleData = peopleSheet.getDataRange().getValues();
  const activeEmails = peopleData.slice(1)
    .filter(row => row[8] === 'Active' && row[5])
    .map(row => row[5]);
  
  if (activeEmails.length > 0) {
    try {
      MailApp.sendEmail({
        to: activeEmails.join(','),
        subject: '🎉 Monthly Recognition - ' + month,
        body: emailBody
      });
    } catch (error) {
      Logger.log('Error sending recognition email: ' + error.toString());
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get member data for dashboard
 */
function getMemberData(memberId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const peopleData = peopleSheet.getDataRange().getValues();
  
  const memberRow = peopleData.findIndex(row => row[0] === memberId);
  if (memberRow === -1) {
    return { success: false, message: 'Member not found' };
  }
  
  const member = peopleData[memberRow];
  return {
    success: true,
    data: {
      memberId: member[0],
      name: member[1],
      roleType: member[2],
      function: member[3],
      teamLeader: member[4],
      email: member[5],
      attendancePercent: member[9] || 0,
      pulseScore: member[10] || 0,
      taskScore: member[11] || 0,
      engagementStatus: member[12]
    }
  };
}

/**
 * Get team data for Team Leader dashboard
 */
function getTeamData(teamLeaderName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const tasksSheet = ss.getSheetByName(TASKS_TAB);
  
  const peopleData = peopleSheet.getDataRange().getValues();
  const teamMembers = peopleData.slice(1).filter(row => 
    row[4] === teamLeaderName && row[8] === 'Active'
  );
  
  const tasksData = tasksSheet.getDataRange().getValues();
  
  const teamData = teamMembers.map(member => {
    const memberTasks = tasksData.filter(row => row[1] === member[0]);
    return {
      memberId: member[0],
      name: member[1],
      function: member[3],
      attendancePercent: member[9] || 0,
      pulseScore: member[10] || 0,
      taskScore: member[11] || 0,
      engagementStatus: member[12],
      tasks: memberTasks.map(task => ({
        taskId: task[0],
        taskName: task[4],
        dueDate: task[5],
        status: task[6]
      }))
    };
  });
  
  return { success: true, data: teamData };
}

/**
 * Get VP TM dashboard data
 */
function getVPTMDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const peopleData = peopleSheet.getDataRange().getValues();
  const activeMembers = peopleData.slice(1).filter(row => row[8] === 'Active');
  
  const functions = ['iGV', 'oGV', 'OGT', 'IGT', 'BXP', 'B2B', 'TM'];
  
  const functionStats = functions.map(func => {
    const funcMembers = activeMembers.filter(row => row[3] === func);
    const memberCount = funcMembers.length;
    const avgAttendance = memberCount > 0 
      ? funcMembers.reduce((sum, m) => sum + (m[9] || 0), 0) / memberCount 
      : 0;
    const avgPulse = memberCount > 0
      ? funcMembers.reduce((sum, m) => sum + (m[10] || 0), 0) / memberCount
      : 0;
    const avgPerformance = memberCount > 0
      ? funcMembers.reduce((sum, m) => sum + (m[11] || 0), 0) / memberCount
      : 0;
    const atRiskCount = funcMembers.filter(m => m[12] === 'RED').length;
    
    return {
      function: func,
      memberCount: memberCount,
      avgAttendance: avgAttendance,
      avgPulse: avgPulse,
      avgPerformance: avgPerformance,
      atRiskCount: atRiskCount
    };
  });
  
  const atRiskMembers = activeMembers
    .filter(m => m[12] === 'RED')
    .map(m => ({
      memberId: m[0],
      name: m[1],
      function: m[3],
      teamLeader: m[4],
      attendancePercent: m[9] || 0,
      pulseScore: m[10] || 0
    }));
  
  return {
    success: true,
    data: {
      totalActiveMembers: activeMembers.length,
      totalTeamLeaders: activeMembers.filter(m => m[2] === 'Team Leader').length,
      overallAttendance: activeMembers.length > 0
        ? activeMembers.reduce((sum, m) => sum + (m[9] || 0), 0) / activeMembers.length
        : 0,
      overallPulse: activeMembers.length > 0
        ? activeMembers.reduce((sum, m) => sum + (m[10] || 0), 0) / activeMembers.length
        : 0,
      atRiskCount: atRiskMembers.length,
      functionStats: functionStats,
      atRiskMembers: atRiskMembers
    }
  };
}

/**
 * Create meeting with QR code
 */
function createMeeting(meetingName, functionName, teamLeader, date, time, location) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const meetingsSheet = ss.getSheetByName(MEETINGS_TAB);
  
  const meetingId = 'MTG' + String(meetingsSheet.getLastRow()).padStart(4, '0');
  const webAppUrl = ScriptApp.getService().getUrl();
  const qrCodeUrl = webAppUrl + '?page=attendance&meeting=' + meetingId;
  const formUrl = webAppUrl + '?page=pulse';
  
  meetingsSheet.appendRow([
    meetingId,
    meetingName,
    functionName,
    teamLeader,
    date,
    time,
    location,
    qrCodeUrl,
    formUrl
  ]);
  
  return { success: true, meetingId: meetingId, qrCodeUrl: qrCodeUrl };
}

/**
 * Assign task
 */
function assignTask(assignedTo, assignedBy, taskName, dueDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tasksSheet = ss.getSheetByName(TASKS_TAB);
  
  const taskId = 'TASK' + String(tasksSheet.getLastRow()).padStart(4, '0');
  
  // Get function from member
  const peopleSheet = ss.getSheetByName(PEOPLE_TAB);
  const peopleData = peopleSheet.getDataRange().getValues();
  const memberRow = peopleData.findIndex(row => row[0] === assignedTo);
  const memberFunction = memberRow !== -1 ? peopleData[memberRow][3] : '';
  
  tasksSheet.appendRow([
    taskId,
    assignedTo,
    assignedBy,
    memberFunction,
    taskName,
    dueDate,
    'Not Started',
    0
  ]);
  
  return { success: true, taskId: taskId };
}

// ============================================
// SETUP TRIGGERS
// ============================================

/**
 * Set up all time-driven triggers
 * Run this once after deploying
 */
function setupTriggers() {
  // Delete existing triggers
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  // Weekly pulse reminder (every Sunday at 9 AM)
  ScriptApp.newTrigger('sendWeeklyPulseReminder')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(9)
    .create();
  
  // Daily at-risk check (every day at 8 AM)
  ScriptApp.newTrigger('dailyAtRiskCheck')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  
  // Monthly recognition (1st of month at 10 AM)
  ScriptApp.newTrigger('generateMonthlyRecognition')
    .timeBased()
    .onMonthDay(1)
    .atHour(10)
    .create();
  
  Logger.log('All triggers set up successfully!');
}

