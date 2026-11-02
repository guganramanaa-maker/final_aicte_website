/**
 * AICTE Approval & Compliance Tracking System - Workflow Automation Engine
 * Automates stage transitions, pendency tracking, EVC scheduling, undertakings & SLA triggers
 */

class AICTEWorkflowEngine {
  constructor() {
    this.store = window.AICTEStore;
  }

  // Get current active state
  getState() {
    return this.store.getData();
  }

  // Record an action in the digital audit trail (Problem Statement Section B & F)
  logAudit(action, details, user, role) {
    const state = this.getState();
    const now = new Date();
    const formattedDate = now.toISOString().replace("T", " ").substring(0, 19) + " IST";
    const randomHex = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
    
    const auditEntry = {
      timestamp: formattedDate,
      user: user || (this.store.getActiveRole() === "institute" ? state.institute.name : state.admin.name),
      role: role || (this.store.getActiveRole() === "institute" ? "Institute Principal" : "AICTE Officer"),
      action: action,
      details: details,
      ip: this.store.getActiveRole() === "institute" ? "182.72.14.92" : "10.24.112.5",
      txHash: "0x" + randomHex
    };

    state.auditTrail.unshift(auditEntry);
    this.store.saveData(state);
    return auditEntry;
  }

  // Add system notification
  addNotification(type, title, desc, targetTab) {
    const state = this.getState();
    const notif = {
      id: "NOTIF-" + Date.now(),
      type: type, // 'critical', 'warning', 'danger', 'success'
      icon: type === 'critical' ? 'fa-triangle-exclamation' : (type === 'danger' ? 'fa-clock' : (type === 'warning' ? 'fa-bell' : 'fa-circle-check')),
      title: title,
      desc: desc,
      time: "Just now",
      targetTab: targetTab || "dashboard"
    };
    state.notifications.unshift(notif);
    this.store.saveData(state);
  }

  // File a new Application (Section A)
  fileApplication(formData) {
    const state = this.getState();
    const id = `AICTE-2024-${state.institute.region.substring(0, 2).toUpperCase()}-${state.institute.code}-${String(state.applications.length + 1).padStart(2, '0')}`;
    
    const newApp = {
      id: id,
      title: formData.title,
      institution: state.institute.name,
      instituteCode: state.institute.code,
      region: state.institute.region,
      workflowType: formData.workflowType, // 'Only Scrutiny', 'Scrutiny + EVC', 'EVC + SAC/SHC', 'Only EVC'
      academicYear: formData.academicYear || "2026-27",
      appliedDate: new Date().toISOString().split('T')[0],
      currentStage: "Scrutiny Pending",
      stageIndex: 1,
      status: "Submitted",
      slaDays: formData.workflowType === "Only Scrutiny" ? 15 : 21,
      elapsedDays: 0,
      slaStatus: "On Track",
      slaBadge: "success",
      assignedOfficer: "Southern Regional Scrutiny Cell",
      summary: formData.summary || `Application filed for ${formData.title}. Workflow routing: ${formData.workflowType}.`
    };

    state.applications.unshift(newApp);
    state.institute.stats.filed += 1;
    state.institute.stats.pending += 1;
    this.store.saveData(state);

    this.logAudit("Application Filed Online", `Filed ${newApp.id} for ${newApp.title}. Selected workflow: ${formData.workflowType}.`);
    this.addNotification("success", "New Application Filed Successfully", `Application ${newApp.id} submitted for AICTE Scrutiny.`, "application");
    return newApp;
  }

  // Officer Action: Approve Scrutiny and Auto-Route to next stage (Section A)
  approveScrutiny(appId, officerRemarks) {
    const state = this.getState();
    const app = state.applications.find(a => a.id === appId);
    if (!app) return false;

    if (app.workflowType === "Only Scrutiny") {
      // Completed! Issue approval
      app.currentStage = "Approved (EOA/LOA Issued)";
      app.stageIndex = 5;
      app.status = "Approved";
      app.approvalNo = `F.No. ${app.region}/${app.instituteCode}/2026/LOA-${Math.floor(Math.random() * 9000 + 1000)}`;
      app.approvalDate = new Date().toISOString().split('T')[0];
      state.institute.stats.pending = Math.max(0, state.institute.stats.pending - 1);
      state.institute.stats.approved += 1;

      this.logAudit("Approval Granted (Scrutiny Cleared)", `Scrutiny cleared for ${app.id}. Approval Letter ${app.approvalNo} generated.`);
      this.addNotification("success", `Application Approved: ${app.id}`, `Letter of Approval generated after scrutiny completion.`, "application");
    } else if (app.workflowType === "Scrutiny + EVC" || app.workflowType === "EVC + SAC/SHC") {
      // Move to EVC Scheduling stage
      app.currentStage = "EVC Scheduled";
      app.stageIndex = 3;
      app.status = "In Progress";
      app.evcDetails = {
        scheduledDate: "Pending Scheduling",
        status: "Queued for Committee Allocation",
        leadInspector: "To be nominated by RO",
        expert2: "Industry Expert (To be assigned)",
        nominee: "AICTE Regional Officer Nominee",
        mode: "Physical On-Site"
      };

      this.logAudit("Scrutiny Passed -> Queued for EVC", `Scrutiny verified for ${app.id}. Automatically routed to EVC queue under APH norms.`);
      this.addNotification("warning", `EVC Queued: ${app.id}`, `Scrutiny passed. Application entered Expert Visit Committee queue.`, "application");
    }

    this.store.saveData(state);
    return true;
  }

  // Officer Action: Revert / Return Application with recorded deficiencies (Section A)
  revertWithDeficiencies(appId, deficiencyText, cureDays = 7) {
    const state = this.getState();
    const app = state.applications.find(a => a.id === appId);
    if (!app) return false;

    app.currentStage = "Deficiencies Issued (Revert)";
    app.stageIndex = 2;
    app.status = "Action Required by Institution";
    app.slaStatus = `Attention: Cure window ${cureDays} days`;
    app.slaBadge = "danger";

    if (!app.deficiencies) app.deficiencies = [];
    app.deficiencies.unshift({
      date: new Date().toISOString().split('T')[0],
      officer: state.admin.name,
      observation: deficiencyText,
      rectificationUploaded: false,
      cureDays: cureDays
    });

    this.logAudit("Application Returned for Deficiencies", `Reverted ${app.id}. Recorded deficiency: "${deficiencyText}". Cure window: ${cureDays} days.`);
    this.addNotification("critical", `Deficiency Notice Issued: ${app.id}`, `Application returned for clarification/rectification. Due within ${cureDays} days.`, "application");
    
    this.store.saveData(state);
    return true;
  }

  // Institute Action: Submit Rectification for Deficiencies (Section A)
  submitRectification(appId, rectificationNote, fileNames = ["Rectified_Documents.pdf"]) {
    const state = this.getState();
    const app = state.applications.find(a => a.id === appId);
    if (!app || !app.deficiencies || app.deficiencies.length === 0) return false;

    app.deficiencies[0].rectificationUploaded = true;
    app.deficiencies[0].rectificationDate = new Date().toISOString().split('T')[0];
    app.deficiencies[0].rectificationNote = rectificationNote;
    app.deficiencies[0].uploadedFiles = fileNames;

    app.currentStage = "Re-scrutiny in Progress";
    app.status = "Under Review";
    app.slaStatus = "Under Re-scrutiny";
    app.slaBadge = "warning";

    this.logAudit("Rectification Submitted by Institution", `Submitted compliance clarification for ${app.id}. Remarks: "${rectificationNote}".`);
    this.addNotification("warning", `Compliance Received: ${app.id}`, `Institution submitted deficiency rectification. Queued for Re-scrutiny.`, "application");

    this.store.saveData(state);
    return true;
  }

  // Officer Action: Schedule EVC (Section C)
  scheduleEVC(appId, evcData) {
    const state = this.getState();
    const app = state.applications.find(a => a.id === appId);
    if (!app) return false;

    app.currentStage = "EVC Scheduled";
    app.stageIndex = 3;
    app.evcDetails = {
      scheduledDate: evcData.scheduledDate,
      status: "Confirmed",
      leadInspector: evcData.leadInspector || "Prof. S. Narayanan (IIT Madras)",
      expert2: evcData.expert2 || "Dr. Preeti Verma (Industry Expert)",
      nominee: evcData.nominee || "Er. R. Senthil (AICTE RO Nominee)",
      mode: evcData.mode || "Physical On-Site with Geo-Tagging"
    };

    this.logAudit("EVC Inspection Scheduled", `Scheduled EVC for ${app.id} on ${evcData.scheduledDate}. Committee: ${evcData.leadInspector}, ${evcData.expert2}, ${evcData.nominee}.`);
    this.addNotification("warning", `EVC Scheduled for ${app.id}`, `Inspection confirmed on ${evcData.scheduledDate}. Ensure infrastructure and lab readiness.`, "application");

    this.store.saveData(state);
    return true;
  }

  // Finalize EVC and Issue Decision (Section C & A)
  submitEVCReport(appId, recommendation, remarks) {
    const state = this.getState();
    const app = state.applications.find(a => a.id === appId);
    if (!app) return false;

    if (recommendation === "Recommended") {
      app.currentStage = "Approved (LOA Issued)";
      app.stageIndex = 5;
      app.status = "Approved";
      app.approvalNo = `F.No. ${app.region}/${app.instituteCode}/2026/LOA-EVC-${Math.floor(Math.random() * 9000 + 1000)}`;
      app.approvalDate = new Date().toISOString().split('T')[0];
      state.institute.stats.pending = Math.max(0, state.institute.stats.pending - 1);
      state.institute.stats.approved += 1;

      this.logAudit("EVC Report Favorable - LOA Issued", `EVC recommended approval for ${app.id}. Executive approval generated: ${app.approvalNo}.`);
      this.addNotification("success", `LOA Issued: ${app.id}`, `EVC recommendation favorable. Formal Letter of Approval generated!`, "application");
    } else if (recommendation === "Refer to SAC") {
      app.currentStage = "SAC Hearing Scheduled";
      app.stageIndex = 4;
      app.status = "Referred to Appellate Committee";
      app.sacDetails = {
        hearingDate: "2026-11-28",
        quorum: "Appellate Standing Committee",
        groundsOfAppeal: remarks || "Referred following contested observations during physical EVC inspection."
      };

      this.logAudit("EVC Discrepancy -> Referred to SAC", `Application ${app.id} escalated to Standing Appeal Committee (SAC). Remarks: ${remarks}`);
      this.addNotification("critical", `Referred to SAC Hearing: ${app.id}`, `Discrepancy noted during EVC inspection. Case referred to Standing Appeal Committee.`, "application");
    } else {
      app.currentStage = "Rejected by Competent Authority";
      app.stageIndex = 5;
      app.status = "Rejected";
      state.institute.stats.pending = Math.max(0, state.institute.stats.pending - 1);
      state.institute.stats.rejected += 1;

      this.logAudit("Application Rejected", `Application ${app.id} rejected based on adverse EVC report. Formal rejection order passed.`);
      this.addNotification("danger", `Application Rejected: ${app.id}`, `Application rejected due to unfulfilled critical APH norms.`, "application");
    }

    this.store.saveData(state);
    return true;
  }

  // Submit Undertaking Compliance (Section D)
  submitUndertakingCompliance(undertakingId, notes, files = ["Compliance_Report.pdf"]) {
    const state = this.getState();
    const ut = state.undertakings.find(u => u.id === undertakingId);
    if (!ut) return false;

    ut.status = "Compliance Submitted (Under Review)";
    ut.severity = "warning";
    ut.submissionDetails = {
      submittedDate: new Date().toISOString().split('T')[0],
      documentsUploaded: files,
      officerRemarks: notes || "Submitted by institution; queued for verification by Regional Officer."
    };

    this.logAudit("Undertaking Compliance Submitted", `Institution submitted compliance evidence for ${ut.id} (${ut.title}).`);
    this.addNotification("warning", `Compliance Submitted: ${ut.id}`, `Evidence uploaded for time-bound undertaking. Awaiting RO verification.`, "upload");

    this.store.saveData(state);
    return true;
  }

  // Verify and Approve Undertaking Compliance (Section D)
  verifyUndertaking(undertakingId, decision, remarks) {
    const state = this.getState();
    const ut = state.undertakings.find(u => u.id === undertakingId);
    if (!ut) return false;

    if (decision === "Approve") {
      ut.status = "Verified & Approved";
      ut.severity = "success";
      if (!ut.submissionDetails) ut.submissionDetails = {};
      ut.submissionDetails.approvedDate = new Date().toISOString().split('T')[0];
      ut.submissionDetails.officerRemarks = remarks || "Fulfilled condition verified as per APH norms.";

      this.logAudit("Undertaking Fulfilled & Approved", `Regional Officer verified and approved compliance for ${ut.id}.`);
      this.addNotification("success", `Undertaking Cleared: ${ut.id}`, `Compliance approved by Regional Officer. Condition discharged.`, "upload");
    } else {
      ut.status = "Deficient Compliance (Re-submission Required)";
      ut.severity = "danger";
      if (!ut.submissionDetails) ut.submissionDetails = {};
      ut.submissionDetails.officerRemarks = remarks || "Uploaded evidence does not meet prescribed requirements.";

      this.logAudit("Undertaking Rejected/Deficient", `RO rejected compliance for ${ut.id}. Reason: ${remarks}`);
      this.addNotification("danger", `Compliance Rejected: ${ut.id}`, `Evidence insufficient for undertaking condition. Re-submission required immediately.`, "upload");
    }

    this.store.saveData(state);
    return true;
  }

  // Renew Lease or Statutory Document (Section E)
  renewDocument(docId, newDocNo, newExpiryDate, issuingAuth) {
    const state = this.getState();
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) return false;

    const oldExpiry = doc.expiryDate;
    doc.documentNo = newDocNo;
    doc.expiryDate = newExpiryDate;
    doc.issuingAuthority = issuingAuth || doc.issuingAuthority;

    // Calculate days remaining
    const expDate = new Date(newExpiryDate);
    const today = new Date();
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    doc.daysRemaining = diffDays;

    if (diffDays > 90) {
      doc.status = "Valid";
      doc.severity = "success";
    } else if (diffDays > 30) {
      doc.status = `Expiring Soon (${diffDays} Days)`;
      doc.severity = "warning";
    } else {
      doc.status = `Critical Alert (${diffDays} Days)`;
      doc.severity = "danger";
    }

    if (!doc.history) doc.history = [];
    doc.history.unshift({
      date: new Date().toISOString().split('T')[0],
      action: `Renewed certificate submitted. Valid until ${newExpiryDate}.`,
      user: state.institute.name
    });

    this.logAudit("Document Renewal Submitted", `Renewed ${doc.name} (Doc #${newDocNo}). Valid until ${newExpiryDate}.`);
    this.addNotification("success", `Document Renewed: ${doc.name}`, `Renewal verified and logged. Validity extended to ${newExpiryDate}.`, "certificate");

    this.store.saveData(state);
    return true;
  }

  // Submit Grievance / Escalation (Section F)
  fileGrievance(appRef, subject, category, description) {
    const state = this.getState();
    const grvId = `GRV-2026-${Math.floor(Math.random() * 900 + 100)}`;
    
    const newGrv = {
      id: grvId,
      appRef: appRef,
      subject: subject,
      category: category,
      filedDate: new Date().toISOString().split('T')[0],
      currentTier: "Tier 1: Regional Officer (SRO)",
      slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Submitted (Under 48hr SLA)",
      remarks: description
    };

    state.grievances.unshift(newGrv);
    this.store.saveData(state);

    this.logAudit("Grievance/Clarification Filed", `Filed ${grvId} regarding ${appRef}. Subject: "${subject}". Routed to Tier 1.`);
    this.addNotification("warning", `Grievance Logged: ${grvId}`, `Query logged under 48-hr Regional Officer SLA queue.`, "complaint");
    return newGrv;
  }
}

window.AICTEWorkflow = new AICTEWorkflowEngine();

