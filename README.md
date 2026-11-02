# AICTE Approval & Compliance Tracking System
### अखिल भारतीय तकनीकी शिक्षा परिषद (All India Council for Technical Education)

An integrated, secure, and configurable digital platform engineered for end-to-end automation and monitoring of AICTE approval workflows, institutional undertakings, statutory document validity, and multi-tier SLA escalations.

Built in exact alignment with the reference model layouts and the AICTE Approval Process Handbook (APH 2024–2027).

---

## 📸 Visual Layout Fidelity

1. **Login Interface**
   - **Background**: Full-bleed AICTE Headquarters New Delhi building (`assets/aicte-building.jpg`).
   - **Header**: AICTE Official Emblem (`assets/aicte-logo.png`) with bilingual English and Hindi typography in royal blue (`#103f79`).
   - **Login Card**: Floating white card with rounded geometry and soft drop-shadow.
   - **Role Switcher**: Segmented toggle between **Institute** (warm orange active state) and **Admin** (AICTE Regional / Bureau Officer).
   - **Fields**: Institute Name (with building icon), Institute ID (with ID card icon), Password (with eye toggle visibility), and Captcha with refresh generator and textured verification box.
   - **Buttons**: Full-width bright orange **Login** button, **OR** divider, and outline **New User? Register** button.
   - **Quick Demo Helpers**: One-click demo autofill pills for *Sri Krishna College (Institute)* and *AICTE Officer (RO)*.

2. **Dashboard & Portal Layout**
   - **Top Header Bar**: Solid warm orange banner (`#f37021`), official emblem, bilingual council title, role switcher pill, real-time notification bell with live counter, user avatar, and institute profile.
   - **Sidebar Navigation**: Cream/warm ivory background (`#fff5eb`) with all 8 exact menu items:
     1. 🏠 **Dashboard**
     2. ⏳ **Certificate Expiry**
     3. 📋 **Application**
     4. 🔨 **Rules**
     5. 📥 **Upload**
     6. 🤖 **Validation**
     7. 💬 **Complaint**
     8. 📊 **Report**
   - **Campus Overview (Dashboard Tab)**:
     - College campus aerial background (`assets/college-campus.jpg`).
     - Deep blue uppercase heading: **SRI KRISHNA COLLEGE OF ENGINEERING AND TECHNOLOGY** with underline.
     - **4 Summary KPI Cards**:
       * *Application Filed*: **108** (Mortarboard icon in blue circle)
       * *Approved*: **79** (Green checkmark circle)
       * *Pending*: **10** (Purple document circle)
       * *Rejected*: **19** (Red cross circle)
     - **Ranking & Accreditation Card**:
       * NIRF Rank **100** encircled by 12 geometric stars.
       * Grade: **AAAAA+**.
       * Accreditations: College code `2718`, Location `Kuniamuthur, Coimbatore, Tamil Nadu (641008)`, `Ph: 9874464789`.
     - **Courses Card**:
       * Clean list of 11 approved degree programs: B.E - CSE, B.E - ECE, B.Tech - AIDS, B.E - Cyber CYS, B.E - EEE, B.Tech - IT, B.E - Mech, B.E - Civil, M.E - CSE, M.E - ECE, M.E - EEE.

---

## 🏛️ Comprehensive Problem Statement Coverage

| Section | Domain Requirement | Implemented Capability |
|---|---|---|
| **A** | **End-to-End Approval Workflow Automation** | Configurable routing engines for `Only Scrutiny`, `Scrutiny + EVC`, `EVC + SAC/SHC`, and `Only EVC`. Automatic stage transition, electronic case summaries, and authorized return/revert with recorded deficiency observations and 7-day cure window. |
| **B** | **Integrated Dashboard & Pendency Monitoring** | Consolidated real-time tracking across 8 AICTE Regions (Southern, Western, Northern, etc.). Application ageing, SLA countdowns, bottleneck detection, and role-based view switching. |
| **C** | **EVC Scheduling & Alerts** | Automated queue for applications reaching EVC stage. 3-member Expert Panel builder (Academic Chairman, Industry Expert, Regional Nominee), date picker, on-site geo-tagged verification checklist, and delay alerts. |
| **D** | **Time-Bound Undertakings & Compliance** | Digital ledger of approvals granted subject to undertakings (e.g. Divyangjan accessibility ramps, AICTE IDEA Labs, faculty cadre normalization). Proof upload portal, officer verification, and overdue penalty flags. |
| **E** | **Lease & Document Validity Monitoring** | Dedicated tracking of registered 30-year Land Lease Deeds, Fire Safety NOCs, Structural Stability, Affiliation Orders, and Joint Bank Guarantees. Advance alert milestones (90-day, 60-day, 30-day critical) with online renewal workflows. |
| **F** | **Notifications, Escalations & Reporting** | Live notification drawer, automated 3-tier escalation framework (Tier 1 RO: 48h → Tier 2 Bureau: 5d → Tier 3 Member Secretary: 7d), CSV audit export, and immutable SHA-256 digital audit trail. |
| **Safeguard** | **Regulatory Safeguard** | Embedded statutory clause ensuring automated workflows support the approval process without replacing Competent Authority decisions. |

---

## 🚀 How to Run the Website

### Method 1: Direct Browser Launch (Recommended)
Double-click `open_portal.bat` or open `index.html` directly in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Method 2: Local Web Server via PowerShell
In PowerShell, execute:
```powershell
.\serve.ps1
```
The portal will launch automatically at `http://localhost:8080/`.

---

## 🔑 Demo Access Credentials

| Role | Name / Identifier | Password | Access Rights |
|---|---|---|---|
| **Institute** | Sri Krishna College (ID: `1-2718-TN`) | `aicte@2026` | File applications, upload compliance, renew documents, view rankings |
| **AICTE Admin** | Dr. K. Ravichandran (ID: `RO-SRO-CHENNAI`) | `admin@aicte` | Approve scrutiny, issue deficiencies, schedule EVCs, verify undertakings |

*Tip: Click the **Quick Fill** buttons on the login screen for 1-click credential population!*

