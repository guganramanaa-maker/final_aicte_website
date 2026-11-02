/**
 * AICTE Approval & Compliance Tracking System - Core Data Store
 * Aligned with AICTE Approval Process Handbook (APH)
 */

const AICTE_INITIAL_DATA = {
  // Current logged in institute profile (exact match to screenshot Image 5)
  institute: {
    name: "Sri Krishna College of Engineering and Technology",
    code: "2718",
    id: "1-2718-TN",
    nirfRank: 100,
    rating: "AAAAA+",
    location: "Kuniamuthur, Coimbatore, Tamil Nadu (641008)",
    phone: "9874464789",
    email: "principal@skcet.ac.in",
    region: "Southern",
    stats: {
      filed: 108,
      approved: 79,
      pending: 10,
      rejected: 19
    },
    courses: [
      "B.E - CSE",
      "B.E - ECE",
      "B.Tech - AIDS",
      "B.E - Cyber CYS",
      "B.E - EEE",
      "B.Tech - IT",
      "B.E - Mech",
      "B.E - Civil",
      "M.E - CSE",
      "M.E - ECE",
      "M.E - EEE"
    ]
  },

  // Admin / AICTE Official profile
  admin: {
    name: "Dr. K. Ravichandran",
    designation: "Regional Officer (Southern Region) & Scrutiny Convener",
    office: "AICTE Southern Regional Office (SRO), Shastri Bhawan, Chennai",
    email: "ro.sro@aicte-india.org",
    role: "AICTE Officer"
  },

  // AICTE Regional Offices & National Statistics
  regions: [
    { id: "SR", name: "Southern Region", hq: "Chennai", states: "Tamil Nadu, Puducherry", total: 2450, scrutiny: 210, evc: 65, sac: 18, approved: 2040, overdue: 12 },
    { id: "SWR", name: "South-Western Region", hq: "Bengaluru", states: "Karnataka, Kerala, Lakshadweep", total: 1980, scrutiny: 175, evc: 48, sac: 14, approved: 1680, overdue: 9 },
    { id: "WR", name: "Western Region", hq: "Mumbai", states: "Maharashtra, Goa", total: 2890, scrutiny: 290, evc: 82, sac: 25, approved: 2410, overdue: 18 },
    { id: "NR", name: "Northern Region", hq: "Kanpur", states: "Uttar Pradesh, Uttarakhand", total: 2150, scrutiny: 240, evc: 74, sac: 22, approved: 1760, overdue: 21 },
    { id: "NWR", name: "North-Western Region", hq: "Chandigarh", states: "Punjab, Haryana, HP, J&K, Chandigarh", total: 1620, scrutiny: 140, evc: 38, sac: 11, approved: 1390, overdue: 7 },
    { id: "CR", name: "Central Region", hq: "Bhopal", states: "Madhya Pradesh, Chhattisgarh, Gujarat", total: 1840, scrutiny: 165, evc: 44, sac: 15, approved: 1560, overdue: 11 },
    { id: "ER", name: "Eastern Region", hq: "Kolkata", states: "West Bengal, Odisha, Bihar, Jharkhand", total: 1410, scrutiny: 130, evc: 35, sac: 9, approved: 1210, overdue: 14 },
    { id: "NER", name: "North-Eastern Region", hq: "Guwahati", states: "Assam, Meghalaya, Manipur, etc.", total: 480, scrutiny: 42, evc: 12, sac: 4, approved: 410, overdue: 3 }
  ],

  // Applications with multi-stage workflow combinations
  applications: [
    {
      id: "AICTE-2024-SR-2718-01",
      title: "Addition of New Program: B.Tech Artificial Intelligence & Data Science (Intake: 60)",
      institution: "Sri Krishna College of Engineering and Technology",
      instituteCode: "2718",
      region: "Southern",
      workflowType: "Scrutiny + EVC",
      academicYear: "2026-27",
      appliedDate: "2026-09-12",
      currentStage: "EVC Scheduled",
      stageIndex: 3, // 0: Filed, 1: Scrutiny, 2: Deficiencies/Re-scrutiny, 3: EVC, 4: SAC/SHC, 5: Approval
      status: "In Progress",
      slaDays: 21,
      elapsedDays: 14,
      slaStatus: "On Track",
      slaBadge: "success",
      assignedOfficer: "Dr. K. Ravichandran (RO Southern)",
      evcDetails: {
        scheduledDate: "2026-11-15",
        status: "Confirmed",
        leadInspector: "Prof. S. Narayanan (IIT Madras - Computer Science)",
        expert2: "Dr. Preeti Verma (Industry Expert - Data Analytics)",
        nominee: "Er. R. Senthil (AICTE RO Nominee)",
        mode: "Physical On-Site with Geo-Tagging"
      },
      summary: "Institution applied for addition of emerging area course. Scrutiny cleared on 28-Sep-2026. Computing facilities and AI lab infrastructure queued for physical verification by Expert Visit Committee."
    },
    {
      id: "AICTE-2024-SR-2718-02",
      title: "Extension of Approval (EOA) for 11 Existing UG & PG Engineering Programs",
      institution: "Sri Krishna College of Engineering and Technology",
      instituteCode: "2718",
      region: "Southern",
      workflowType: "Only Scrutiny",
      academicYear: "2026-27",
      appliedDate: "2026-08-01",
      currentStage: "Approved (EOA Issued)",
      stageIndex: 5,
      status: "Approved",
      slaDays: 15,
      elapsedDays: 11,
      slaStatus: "Completed Ahead of Time",
      slaBadge: "success",
      assignedOfficer: "Dr. P. Swaminathan (Scrutiny Member)",
      approvalNo: "F.No. Southern/1-2718/2026/EOA",
      approvalDate: "2026-08-14",
      summary: "Automated scrutiny verified faculty Aadhaar seeding, student ratio (1:20), and fee declaration. Letter of Extension of Approval issued online."
    },
    {
      id: "AICTE-2024-SR-2718-03",
      title: "Increase in Intake: B.E Computer Science and Engineering (From 180 to 240 seats)",
      institution: "Sri Krishna College of Engineering and Technology",
      instituteCode: "2718",
      region: "Southern",
      workflowType: "Scrutiny + EVC",
      academicYear: "2026-27",
      appliedDate: "2026-10-05",
      currentStage: "Re-scrutiny in Progress",
      stageIndex: 2,
      status: "Under Review",
      slaDays: 7,
      elapsedDays: 5,
      slaStatus: "Attention Required (2 days left)",
      slaBadge: "warning",
      assignedOfficer: "Dr. K. Ravichandran (RO Southern)",
      deficiencies: [
        {
          date: "2026-10-18",
          officer: "Scrutiny Committee #4",
          observation: "Faculty cadre deficit: Additional 1 Professor and 2 Associate Professors required for 60-seat expansion under NBA accreditation norms.",
          rectificationUploaded: true,
          rectificationDate: "2026-10-25",
          rectificationNote: "Issued offer letters & appointment orders for 3 faculty members uploaded with joining report."
        }
      ],
      summary: "Application returned for faculty cadre discrepancy. Institute submitted compliance rectification; awaiting final sign-off before EVC routing."
    },
    {
      id: "AICTE-2024-SR-2718-04",
      title: "Introduction of Integrated 5-Year M.Tech in Cyber Security",
      institution: "Sri Krishna College of Engineering and Technology",
      instituteCode: "2718",
      region: "Southern",
      workflowType: "EVC + SAC/SHC",
      academicYear: "2026-27",
      appliedDate: "2026-07-20",
      currentStage: "SAC Hearing Scheduled",
      stageIndex: 4,
      status: "Appellate Stage",
      slaDays: 14,
      elapsedDays: 12,
      slaStatus: "Hearing on 20-Nov-2026",
      slaBadge: "warning",
      assignedOfficer: "Standing Appeal Committee (AICTE HQ)",
      sacDetails: {
        hearingDate: "2026-11-20",
        quorum: "Retired High Court Judge + 2 Senior Academicians",
        groundsOfAppeal: "Appeal filed by institution against EVC measurement of specialized Cyber Forensics lab area."
      },
      summary: "Case escalated to Standing Appeal Committee (SAC) following discrepancy in carpet area calculation during primary inspection."
    },
    {
      id: "AICTE-2024-SR-3410-01",
      title: "Establishment of New Diploma Polytechnic Wing (Green Hydrogen & Renewable Energy)",
      institution: "Coimbatore Institute of Engineering & Research",
      instituteCode: "3410",
      region: "Southern",
      workflowType: "Scrutiny + EVC",
      academicYear: "2026-27",
      appliedDate: "2026-09-20",
      currentStage: "Scrutiny Pending",
      stageIndex: 1,
      status: "Pending Action",
      slaDays: 15,
      elapsedDays: 24,
      slaStatus: "OVERDUE (Escalated to Bureau)",
      slaBadge: "danger",
      assignedOfficer: "Er. N. Karthik (Scrutiny Desk)",
      summary: "Scrutiny delayed due to missing local body approval of building layout plan. Auto-escalated to Bureau Head for administrative intervention."
    },
    {
      id: "AICTE-2024-WR-1102-09",
      title: "Establishment of Industry Sponsored AICTE-IDEA Lab",
      institution: "Government College of Engineering, Pune",
      instituteCode: "1102",
      region: "Western",
      workflowType: "Only EVC",
      academicYear: "2026-27",
      appliedDate: "2026-10-10",
      currentStage: "EVC Inspection Completed",
      stageIndex: 3,
      status: "Report Awaiting Sign-off",
      slaDays: 21,
      elapsedDays: 10,
      slaStatus: "On Track",
      slaBadge: "success",
      assignedOfficer: "Dr. S. Kulkarni (RO Western)",
      summary: "Physical inspection of 5,000 sq.ft innovation lab completed. Favorable recommendation submitted by expert team."
    }
  ],

  // Statutory Documents & Lease Validity Monitoring (Section E)
  documents: [
    {
      id: "DOC-2718-01",
      name: "Land Lease Agreement (Registered Deed - 30 Years)",
      category: "Land & Building",
      subCategory: "Registered Lease Deed",
      issueDate: "1997-12-15",
      expiryDate: "2026-12-14",
      daysRemaining: 43,
      status: "Critical Alert (< 45 Days)",
      severity: "danger",
      documentNo: "Doc No. 4821 / Book 1 / Vol 412",
      issuingAuthority: "Sub-Registrar Office, Kuniamuthur, Coimbatore",
      landArea: "25.4 Acres (Contiguous)",
      verifiedBy: "AICTE Legal Cell",
      notes: "Mandatory lease renewal or conversion to perpetual lease deed required before December 2026 to maintain APH compliance.",
      history: [
        { date: "1997-12-15", action: "Original 30-Year Registered Lease executed", user: "Managing Trustee" },
        { date: "2026-09-15", action: "System generated 90-day expiry alert to Institute", user: "AICTE Auto-Engine" },
        { date: "2026-10-15", action: "System generated 60-day expiry alert with warning", user: "AICTE Auto-Engine" }
      ]
    },
    {
      id: "DOC-2718-02",
      name: "Fire & Emergency Safety NOC",
      category: "Safety & Statutory",
      subCategory: "Fire Prevention & Life Safety",
      issueDate: "2025-11-20",
      expiryDate: "2026-11-19",
      daysRemaining: 18,
      status: "Expiring Soon (< 20 Days)",
      severity: "danger",
      documentNo: "NOC/FS/CBE/2025/1109",
      issuingAuthority: "Tamil Nadu Fire and Rescue Services Department",
      verifiedBy: "Regional Officer",
      notes: "Annual renewal inspection completed by Fire Officer; renewal certificate awaited from Joint Director.",
      history: [
        { date: "2025-11-20", action: "Annual Safety NOC issued", user: "TNFRS Dept" },
        { date: "2026-10-20", action: "30-day renewal reminder dispatched", user: "AICTE Auto-Engine" }
      ]
    },
    {
      id: "DOC-2718-03",
      name: "Building Safety & Structural Stability Certificate",
      category: "Infrastructure",
      subCategory: "Structural Soundness",
      issueDate: "2024-03-10",
      expiryDate: "2027-03-09",
      daysRemaining: 128,
      status: "Valid",
      severity: "success",
      documentNo: "STR/PWD-1/2024/774",
      issuingAuthority: "Chartered Engineer (PWD Grade 1 Empanelled)",
      verifiedBy: "AICTE Scrutiny Committee",
      notes: "Certified sound for earthquake zone III compliance. Valid for 3 years.",
      history: [
        { date: "2024-03-10", action: "Structural stability verified", user: "Er. K. Balasubramanian" }
      ]
    },
    {
      id: "DOC-2718-04",
      name: "Pollution Control Board Consent to Operate (CTO)",
      category: "Environmental",
      subCategory: "Water & Air Pollution Clearance",
      issueDate: "2024-01-15",
      expiryDate: "2027-01-14",
      daysRemaining: 74,
      status: "Valid",
      severity: "success",
      documentNo: "TNPCB/CBE/CTO/2024-98",
      issuingAuthority: "Tamil Nadu Pollution Control Board (TNPCB)",
      verifiedBy: "AICTE Scrutiny Committee",
      notes: "Sewage Treatment Plant (STP) of 250 KLD capacity compliant with zero discharge norms.",
      history: [
        { date: "2024-01-15", action: "3-year consent renewal granted", user: "TNPCB CBE" }
      ]
    },
    {
      id: "DOC-2718-05",
      name: "State University Affiliation Order",
      category: "Academic",
      subCategory: "Affiliating University Order",
      issueDate: "2026-06-01",
      expiryDate: "2027-05-31",
      daysRemaining: 211,
      status: "Valid",
      severity: "success",
      documentNo: "AU/AFFL/2026-27/2718",
      issuingAuthority: "Anna University, Chennai",
      verifiedBy: "AICTE Scrutiny Committee",
      notes: "Provisional affiliation granted for all 11 undergraduate and postgraduate programs.",
      history: [
        { date: "2026-06-01", action: "Annual affiliation order issued", user: "Registrar, Anna Univ" }
      ]
    },
    {
      id: "DOC-2718-06",
      name: "AICTE Joint Fixed Deposit Receipts (FDR) / Bank Guarantee",
      category: "Financial Security",
      subCategory: "Endowment Fund",
      issueDate: "2022-08-10",
      expiryDate: "2032-08-09",
      daysRemaining: 2108,
      status: "Valid (Long-Term)",
      severity: "success",
      documentNo: "SBI/FD/BG-2022-40192",
      issuingAuthority: "State Bank of India, Main Branch, Coimbatore",
      amount: "₹ 1,00,00,000 (Rupees One Crore)",
      verifiedBy: "AICTE Finance Bureau",
      notes: "Joint lien marked in favor of Regional Officer, AICTE Southern Region.",
      history: [
        { date: "2022-08-10", action: "10-Year joint FDR renewed with auto-lien", user: "SBI Bank Manager" }
      ]
    }
  ],

  // Time-Bound Undertakings and Institutional Compliance (Section D)
  undertakings: [
    {
      id: "UT-2024-081",
      title: "Barrier-Free Access for Divyangjan: Wheelchair Ramps & Accessible Lifts",
      prescribedCondition: "Construction of standard slope (1:12) wheelchair ramps, braille signage, and dedicated Divyangjan restrooms in Academic Block B & Library.",
      approvalRef: "F.No. Southern/1-2718/2026/EOA-Cond-1",
      sanctionDate: "2026-05-10",
      dueDate: "2026-11-10",
      daysRemaining: 9,
      status: "Pending Submission",
      severity: "danger",
      assignedTo: "Estate Officer / Civil Maintenance",
      penaltyWarning: "Show Cause Notice and 25% Reduction in Approved Intake for Academic Year 2027-28.",
      evidenceRequired: "Geotagged photos of completed ramps/lifts + Architect Completion Certificate."
    },
    {
      id: "UT-2024-094",
      title: "Establishment of Advanced AICTE IDEA Lab (5,000 sq.ft)",
      prescribedCondition: "Procurement and commissioning of high-end 3D rapid prototyping printers, CNC milling machines, Laser engravers, and IoT sensor workbench.",
      approvalRef: "F.No. Southern/1-2718/2026/IDEA-04",
      sanctionDate: "2026-07-20",
      dueDate: "2027-01-20",
      daysRemaining: 80,
      status: "Compliance Submitted (Under Review)",
      severity: "warning",
      assignedTo: "Dr. M. Senthil Kumar (IDEA Lab Coordinator)",
      submissionDetails: {
        submittedDate: "2026-10-26",
        documentsUploaded: ["Purchase_Invoices.pdf", "GeoTagged_Lab_Photos.zip", "Asset_Register.pdf"],
        officerRemarks: "Initial scrutiny completed. Lab layout verified. EVC spot check slated with upcoming inspection."
      }
    },
    {
      id: "UT-2024-112",
      title: "Faculty Cadre Normalization in Emerging Technologies",
      prescribedCondition: "Recruitment of 4 regular Ph.D. Associate Professors in CSE & AIDS to achieve prescribed Cadre Ratio (1:2:6).",
      approvalRef: "F.No. Southern/1-2718/2026/FSR-Norm",
      sanctionDate: "2026-08-01",
      dueDate: "2026-12-01",
      daysRemaining: 30,
      status: "Partially Fulfilled",
      severity: "warning",
      assignedTo: "Dean Academic Affairs & HR Cell",
      submissionDetails: {
        submittedDate: "2026-10-28",
        documentsUploaded: ["Appointment_Order_DrArun.pdf", "Appointment_Order_DrKavitha.pdf"],
        officerRemarks: "2 faculty members appointed and joined on 15-Oct. 2 remaining vacancies advertised; interviews scheduled for 12-Nov-2026."
      }
    },
    {
      id: "UT-2024-033",
      title: "Green Campus Initiative: 150 kW Grid-Tied Rooftop Solar Installation",
      prescribedCondition: "Commissioning of renewable solar power unit covering at least 20% of peak campus demand.",
      approvalRef: "F.No. Southern/1-2718/2025/GREEN-09",
      sanctionDate: "2025-10-15",
      dueDate: "2026-04-15",
      daysRemaining: 0,
      status: "Verified & Approved",
      severity: "success",
      assignedTo: "Electrical Maintenance Bureau",
      submissionDetails: {
        submittedDate: "2026-03-20",
        approvedDate: "2026-04-02",
        documentsUploaded: ["TANGEDCO_Net_Metering_Certificate.pdf", "Solar_Array_Inspection_Report.pdf"],
        officerRemarks: "Full compliance verified on site. Carbon offset credits logged."
      }
    }
  ],

  // Expert Visit Committee (EVC) Scheduling & Pool (Section C)
  evcPool: {
    pendingScheduling: [
      {
        appId: "AICTE-2024-SR-3410-01",
        institute: "Coimbatore Institute of Engineering & Research",
        purpose: "New Polytechnic Wing (Green Hydrogen)",
        recommendedDateRange: "2026-11-20 to 2026-11-28",
        status: "Awaiting Committee Formation"
      }
    ],
    scheduledInspections: [
      {
        appId: "AICTE-2024-SR-2718-01",
        institute: "Sri Krishna College of Engineering and Technology",
        date: "2026-11-15",
        time: "09:30 AM",
        experts: [
          { name: "Prof. S. Narayanan", role: "Chairman (Academic Expert)", org: "IIT Madras" },
          { name: "Dr. Preeti Verma", role: "Member (Industry Expert)", org: "TCS Innovation Labs" },
          { name: "Er. R. Senthil", role: "Member Convener", org: "AICTE SRO Chennai" }
        ],
        checklist: [
          { item: "Carpet area measurement of AI Laboratories (min 66 sq.m each)", status: "Pending Verification" },
          { item: "GPU Workstations & High Performance Computing setup (30 nodes)", status: "Pending Verification" },
          { item: "Licensed / Open Source AI tools & Cloud sandbox subscription", status: "Pending Verification" },
          { item: "Dedicated faculty qualification & physical attendance register", status: "Pending Verification" },
          { item: "Safety, Fire Sprinklers & Divyangjan accessibility in Lab Block", status: "Pending Verification" }
        ]
      }
    ]
  },

  // Grievance / Complaints & Escalation Matrix (Section F)
  grievances: [
    {
      id: "GRV-2026-901",
      appRef: "AICTE-2024-SR-2718-04",
      subject: "Discrepancy in Specialized Cyber Forensics Lab Carpet Area Measurement",
      category: "EVC Observation Appeal",
      filedDate: "2026-10-12",
      currentTier: "Tier 2: Bureau Head (AICTE HQ)",
      slaDeadline: "2026-11-05",
      status: "Referred to SAC",
      remarks: "Institutional architect demonstrated that wall partitions are movable acoustic partitions and net usable floor space complies with 75 sq.m norm. Hearing slated for 20-Nov-2026."
    },
    {
      id: "GRV-2026-902",
      appRef: "AICTE-2024-SR-2718-03",
      subject: "Clarification on Cadre Ratio calculation for autonomous institutions",
      category: "Scrutiny Clarification",
      filedDate: "2026-10-20",
      currentTier: "Tier 1: Regional Officer (SRO)",
      slaDeadline: "2026-11-02",
      status: "Resolved",
      remarks: "Clarification issued by RO in line with APH Appendix 7 Table 7.1. Institution permitted to count research professors against Professor cadre."
    }
  ],

  // Real-time Notifications & Alerts Feed
  notifications: [
    {
      id: "NOTIF-101",
      type: "critical",
      icon: "fa-triangle-exclamation",
      title: "Fire NOC Expiring in 18 Days!",
      desc: "NOC/FS/CBE/2025/1109 expires on 19-Nov-2026. Please upload renewed clearance to prevent automatic status freeze.",
      time: "2 hours ago",
      targetTab: "certificate"
    },
    {
      id: "NOTIF-102",
      type: "warning",
      icon: "fa-calendar-check",
      title: "EVC Physical Inspection Confirmed",
      desc: "Expert Visit Committee for AI & Data Science scheduled for 15-Nov-2026. Ensure geo-tagged portal readiness.",
      time: "5 hours ago",
      targetTab: "application"
    },
    {
      id: "NOTIF-103",
      type: "danger",
      icon: "fa-clock",
      title: "Undertaking Deadline Approaching (9 Days Left)",
      desc: "Barrier-Free Ramps & Divyangjan Accessibility submission due by 10-Nov-2026.",
      time: "1 day ago",
      targetTab: "upload"
    },
    {
      id: "NOTIF-104",
      type: "success",
      icon: "fa-circle-check",
      title: "EOA Approved for AY 2026-27",
      desc: "Extension of Approval formally ratified by Member Secretary. Download approved certificate.",
      time: "3 days ago",
      targetTab: "application"
    }
  ],

  // Immutable Digital Audit Trail (Problem Statement Section B & F)
  auditTrail: [
    {
      timestamp: "2026-10-28 16:42:10 IST",
      user: "Sri Krishna College (ID: 2718)",
      role: "Institute Principal",
      action: "Document Rectification Uploaded",
      details: "Uploaded Appointment Orders for 2 Ph.D. Associate Professors under App #AICTE-2024-SR-2718-03",
      ip: "182.72.14.92",
      txHash: "0x8f4c99e120d8"
    },
    {
      timestamp: "2026-10-26 11:15:30 IST",
      user: "Dr. K. Ravichandran",
      role: "AICTE Regional Officer",
      action: "EVC Schedule Finalized",
      details: "Allocated 3-member Expert Panel for App #AICTE-2024-SR-2718-01 for 15-Nov-2026 inspection",
      ip: "10.24.112.5",
      txHash: "0x3b17ac9811f0"
    },
    {
      timestamp: "2026-10-20 09:00:00 IST",
      user: "AICTE SLA Engine (Automated)",
      role: "System Engine",
      action: "Automated Advance Alert Triggered",
      details: "Dispatched 30-day Fire NOC expiry notification to Institute and Southern Regional Office",
      ip: "10.0.0.1",
      txHash: "0x9812ccf1001a"
    },
    {
      timestamp: "2026-10-18 14:22:45 IST",
      user: "Scrutiny Committee Desk #4",
      role: "Scrutiny Member",
      action: "Application Returned for Deficiency",
      details: "Issued deficiency notice for faculty cadre deficit under App #AICTE-2024-SR-2718-03 with 7-day cure window",
      ip: "10.24.112.18",
      txHash: "0x44ae1298bb31"
    },
    {
      timestamp: "2026-09-12 10:14:00 IST",
      user: "Sri Krishna College (ID: 2718)",
      role: "Institute Principal",
      action: "Application Filed Online",
      details: "Submitted new course addition request for B.Tech AI & Data Science with ₹ 3,00,000 scrutiny fee",
      ip: "182.72.14.92",
      txHash: "0x1102ff94a28c"
    }
  ]
};

// State store helpers
class AICTEStateStore {
  constructor() {
    this.STORAGE_KEY = "aicte_portal_data_v1";
    this.CURRENT_ROLE_KEY = "aicte_active_role";
    this.init();
  }

  init() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(AICTE_INITIAL_DATA));
    }
    if (!localStorage.getItem(this.CURRENT_ROLE_KEY)) {
      localStorage.setItem(this.CURRENT_ROLE_KEY, "institute");
    }
  }

  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : AICTE_INITIAL_DATA;
    } catch (e) {
      console.error("Error reading localStorage, falling back to initial data:", e);
      return AICTE_INITIAL_DATA;
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving data:", e);
    }
  }

  getActiveRole() {
    return localStorage.getItem(this.CURRENT_ROLE_KEY) || "institute";
  }

  setActiveRole(role) {
    localStorage.setItem(this.CURRENT_ROLE_KEY, role);
  }

  resetToDefault() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(AICTE_INITIAL_DATA));
    localStorage.setItem(this.CURRENT_ROLE_KEY, "institute");
  }
}

window.AICTEStore = new AICTEStateStore();

