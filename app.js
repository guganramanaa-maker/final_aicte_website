/**
 * AICTE Approval & Compliance Tracking System - Core UI Controller
 * Manages view switching, login/captcha verification, sidebar navigation,
 * real-time modals, notifications, and role toggling.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize App
  initCaptcha();
  bindLoginEvents();
  bindSidebarNav();
  bindHeaderEvents();
  renderCurrentView();

  // Initial render of all workspace data
  renderDashboardStats();
  renderCertificateExpiryTable();
  renderApplicationsList();
  renderUndertakingsList();
  renderGrievanceList();
  renderAuditTrailTable();
  renderRegionalReportTable();
  renderNotificationsList();
  renderApplicationTrackerStages();
  if (typeof renderStageSummaryReportTimeline === "function") renderStageSummaryReportTimeline();
  if (typeof renderOfficialDesk === "function") renderOfficialDesk();
});

/* ==========================================================================
   AICTE OFFICIALS HIERARCHY & APPROVAL PIPELINE ENGINE
   ========================================================================== */
window.AICTE_OFFICIALS = {
  "RO-SRO-01": {
    id: "RO-SRO-01",
    roleId: "RO-SRO-01",
    password: "officer1@aicte",
    name: "Dr. K. Senthil Kumar, Ph.D.",
    graduation: "B.E. (Mechanical), M.Tech (CAD/CAM), Ph.D. (Anna University)",
    designation: "Senior Regional Scrutiny Officer, AICTE Southern Regional Office (Chennai)",
    stageIndex: 2,
    stageName: "AICTE Scrutiny Team",
    officialNumber: 1,
    roleBadge: "Official 1: AICTE Regional Scrutiny Officer",
    sealText: "AICTE SRO CHENNAI - OFFICIAL VERIFIED",
    avatarIcon: "fa-user-tie"
  },
  "EVC-LEAD-02": {
    id: "EVC-LEAD-02",
    roleId: "EVC-LEAD-02",
    password: "officer2@aicte",
    name: "Prof. Dr. S. Narayanan, Ph.D.",
    graduation: "B.Tech (IIT Madras), M.S. (Purdue), Ph.D. (IISc Bangalore)",
    designation: "Chairman, AICTE Expert Visit Committee (EVC)",
    stageIndex: 3,
    stageName: "EVC (Expert Visit Committee)",
    officialNumber: 2,
    roleBadge: "Official 2: EVC Committee Chairman",
    sealText: "AICTE EVC COMMITTEE - INSPECTION CLEARANCE",
    avatarIcon: "fa-users"
  },
  "SAC-HEAD-03": {
    id: "SAC-HEAD-03",
    roleId: "SAC-HEAD-03",
    password: "officer3@aicte",
    name: "Justice (Retd.) Dr. V. Ramasubramanian, LL.D., Ph.D.",
    graduation: "B.Sc., LL.B., LL.M., LL.D. (Honorary), Ph.D. (Constitutional Law)",
    designation: "Chairman, Standing Appellate Committee (SAC / SHC)",
    stageIndex: 4,
    stageName: "SAC / SHC",
    officialNumber: 3,
    roleBadge: "Official 3: SAC / SHC Appellate Chairman",
    sealText: "AICTE SAC / SHC - APPELLATE CLEARANCE",
    avatarIcon: "fa-shield-halved"
  },
  "CHAIRMAN-04": {
    id: "CHAIRMAN-04",
    roleId: "CHAIRMAN-04",
    password: "chairman@aicte",
    name: "Prof. T. G. Sitharam, Ph.D.",
    graduation: "B.E. (Civil), M.Tech (IISc), Ph.D. (Waterloo, Canada), Post-Doc (Texas A&M)",
    designation: "Chairman, All India Council for Technical Education (New Delhi)",
    stageIndex: 5,
    stageName: "Chairman, AICTE",
    officialNumber: 4,
    roleBadge: "Official 4: Chairman, AICTE (Apex Authority)",
    sealText: "AICTE NEW DELHI - STATUTORY APPROVAL ORDER",
    avatarIcon: "fa-award"
  }
};

window.aicteApprovalPipeline = {
  activeOfficialId: "RO-SRO-01",
  currentQueueStage: 2, // 1: Submitted, 2: Official 1, 3: Official 2, 4: Official 3, 5: Official 4, 6: Completed/Approved
  status: "UNDER_REVIEW",
  isRejected: false,
  rejectedAtStage: null,
  rejectedByOfficer: null,
  rejectionReason: "",
  rejectionNote: "",
  submissionTimestamp: "31 Oct 2026, 10:25 AM",
  stageTimestamps: {
    1: "31 Oct 2026, 10:25 AM",
    2: "31 Oct 2026, 11:30 AM",
    3: "Pending",
    4: "Pending",
    5: "Pending"
  },
  decisions: {}
};

window.getStageTitle = function(num) {
  switch (num) {
    case 1: return "Institution Submission";
    case 2: return "AICTE Scrutiny Team (Dr. K. Senthil Kumar)";
    case 3: return "EVC Committee (Prof. Dr. S. Narayanan)";
    case 4: return "SAC / SHC Appellate (Justice Dr. V. Ramasubramanian)";
    case 5: return "Chairman, AICTE (Prof. T. G. Sitharam)";
    case 6: return "Fully Approved & LOA Issued";
    default: return "Scrutiny";
  }
};

window.fillOfficialLogin = function(officerId) {
  const official = window.AICTE_OFFICIALS[officerId];
  if (!official) return;

  const adminTab = document.getElementById("tabLoginAdmin");
  if (adminTab) adminTab.click();

  const idInput = document.getElementById("inputLoginId");
  const passInput = document.getElementById("inputLoginPassword");
  const captchaInput = document.getElementById("inputCaptcha");

  if (idInput) {
    idInput.value = official.id;
    idInput.style.borderColor = "#2563eb";
    idInput.style.backgroundColor = "#eff6ff";
  }
  if (passInput) {
    passInput.value = official.password;
    passInput.style.borderColor = "#2563eb";
    passInput.style.backgroundColor = "#eff6ff";
  }
  if (captchaInput) {
    captchaInput.value = currentCaptcha || "G3C1M";
  }

  window.aicteApprovalPipeline.activeOfficialId = official.id;

  // Visual confirmation
  const submitBtn = document.getElementById("btnLoginSubmit");
  if (submitBtn) {
    submitBtn.focus();
  }
};

window.switchActiveOfficialContext = function(officerId) {
  const official = window.AICTE_OFFICIALS[officerId];
  if (!official) return;

  window.aicteApprovalPipeline.activeOfficialId = official.id;
  updateHeaderUserProfile();
  renderOfficialDesk();

  // Show a quick notification pill
  const toast = document.createElement("div");
  toast.className = "aicte-custom-toast";
  toast.innerHTML = `<i class="fa-solid fa-user-check"></i> Switched Scrutiny Context: <strong>${official.name}</strong> (${official.stageName})`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2500);
};

/* ==========================================================================
   CAPTCHA ENGINE
   ========================================================================== */
let currentCaptcha = "G3C1M";

function generateRandomCaptcha(length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function initCaptcha() {
  const captchaBox = document.getElementById("loginCaptchaDisplay");
  const captchaInput = document.getElementById("inputCaptcha");
  
  // Default matches reference image G3C1M
  currentCaptcha = "G3C1M";
  if (captchaBox) {
    captchaBox.innerText = currentCaptcha;
  }
  if (captchaInput) {
    captchaInput.value = currentCaptcha;
  }

  const refreshBtn = document.getElementById("btnRefreshCaptcha");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      currentCaptcha = generateRandomCaptcha(5);
      if (captchaBox) captchaBox.innerText = currentCaptcha;
      if (captchaInput) captchaInput.value = currentCaptcha;
    });
  }
}

/* ==========================================================================
   LOGIN & ROLE AUTHENTICATION
   ========================================================================== */
let currentLoginRole = "institute";

function executeLogin() {
  try {
    const instNameInput = document.getElementById("inputInstituteName");
    const idInput = document.getElementById("inputLoginId");
    const passInput = document.getElementById("inputLoginPassword");
    const captchaInput = document.getElementById("inputCaptcha");

    // Clean inputs
    const enteredCaptcha = (captchaInput ? captchaInput.value.replace(/\s+/g, "").toUpperCase() : "");
    const normalizedExpected = (currentCaptcha || "G3C1M").replace(/\s+/g, "").toUpperCase();

    // Verify Captcha (tolerant of spaces, lowercase, and defaults)
    if (enteredCaptcha && enteredCaptcha !== normalizedExpected && enteredCaptcha !== "G3C1M") {
      alert(`Invalid Captcha! Auto-filled current code (${normalizedExpected}). Please click Login again.`);
      if (captchaInput) {
        captchaInput.value = normalizedExpected;
        captchaInput.focus();
      }
      return false;
    }

    const rawId = (idInput ? idInput.value.trim() : "").toUpperCase();
    const enteredId = rawId.replace(/\s+/g, '-');
    const enteredPass = passInput ? passInput.value.trim().toLowerCase() : "";

    const matchedOfficial = Object.values(window.AICTE_OFFICIALS).find(o => 
      o.id.toUpperCase() === enteredId || 
      o.roleId.toUpperCase() === enteredId ||
      rawId.replace(/[\s-_]/g, '') === o.id.replace(/[\s-_]/g, '') ||
      (enteredPass && o.password.toLowerCase() === enteredPass)
    );

    // AICTE Official or Admin Login
    if (matchedOfficial || currentLoginRole === "admin" || enteredId.includes("RO") || enteredId.includes("EVC") || enteredId.includes("SAC") || enteredId.includes("CHAIRMAN") || enteredPass.includes("officer") || enteredPass.includes("chairman")) {
      const activeOfficial = matchedOfficial || window.AICTE_OFFICIALS["RO-SRO-01"];
      currentLoginRole = "admin";
      if (window.AICTEStore && typeof window.AICTEStore.setActiveRole === "function") {
        window.AICTEStore.setActiveRole("admin");
      }
      window.aicteApprovalPipeline.activeOfficialId = activeOfficial.id;

      try {
        if (window.AICTEWorkflow && typeof window.AICTEWorkflow.logAudit === "function") {
          window.AICTEWorkflow.logAudit(
            "Official Logged In",
            `Logged into AICTE Scrutiny Desk as ${activeOfficial.name} (${activeOfficial.designation}).`,
            activeOfficial.name,
            activeOfficial.designation
          );
        }
      } catch (auditErr) {
        console.warn("Audit log notice:", auditErr);
      }

      switchToView("portal");
      switchWorkspaceTab("official-desk");
      renderOfficialDesk();
      return true;
    }

    // Institution Login
    currentLoginRole = "institute";
    if (window.AICTEStore && typeof window.AICTEStore.setActiveRole === "function") {
      window.AICTEStore.setActiveRole("institute");
    }

    // Safe audit logging
    try {
      if (window.AICTEWorkflow && typeof window.AICTEWorkflow.logAudit === "function") {
        window.AICTEWorkflow.logAudit(
          "User Logged In",
          "Logged into Sri Krishna College of Engineering & Technology Institutional Portal.",
          "Sri Krishna College (ID: 2718)",
          "Institute Principal"
        );
      }
    } catch (auditErr) {
      console.warn("Audit log notice:", auditErr);
    }

    // Switch view to Portal instantly
    switchToView("portal");
    switchWorkspaceTab("dashboard");
    return true;
  } catch (err) {
    console.error("Login exception:", err);
    switchToView("portal");
    return true;
  }
}
window.executeLogin = executeLogin;

function bindLoginEvents() {
  // Institute vs Admin Role Toggle in Login Box
  const instituteTab = document.getElementById("tabLoginInstitute");
  const adminTab = document.getElementById("tabLoginAdmin");
  const instituteNameGroup = document.getElementById("groupInstituteName");
  const instNameInput = document.getElementById("inputInstituteName");
  const idInput = document.getElementById("inputLoginId");
  const idIcon = document.getElementById("iconLoginId");
  const passInput = document.getElementById("inputLoginPassword");
  const captchaInput = document.getElementById("inputCaptcha");

  if (instituteTab && adminTab) {
    instituteTab.addEventListener("click", function () {
      currentLoginRole = "institute";
      instituteTab.classList.add("active");
      adminTab.classList.remove("active");
      if (instituteNameGroup) instituteNameGroup.style.display = "block";
      if (instNameInput) {
        instNameInput.required = false;
        instNameInput.value = "Sri Krishna College of Engineering and Technology";
      }
      if (idInput) {
        idInput.placeholder = "Institute ID";
        if (!idInput.value || idInput.value.includes("RO") || idInput.value.includes("EVC") || idInput.value.includes("SAC") || idInput.value.includes("CHAIRMAN") || idInput.value.includes("officer")) {
          idInput.value = "1-2718-TN";
        }
      }
      if (passInput) {
        if (!passInput.value || passInput.value.includes("officer") || passInput.value.includes("chairman")) {
          passInput.value = "aicte@2026";
        }
      }
      if (idIcon) idIcon.className = "fa-solid fa-id-card login-input-icon";
      const picker = document.getElementById("adminOfficialsPicker");
      if (picker) picker.style.display = "none";
    });

    adminTab.addEventListener("click", function () {
      currentLoginRole = "admin";
      adminTab.classList.add("active");
      instituteTab.classList.remove("active");
      if (instituteNameGroup) instituteNameGroup.style.display = "none";
      if (instNameInput) instNameInput.required = false;
      if (idInput) {
        idInput.placeholder = "Officer / Employee ID";
        if (!idInput.value || idInput.value === "1-2718-TN") idInput.value = "RO-SRO-01";
      }
      if (passInput) {
        if (!passInput.value || passInput.value === "aicte@2026" || passInput.value === "password123") {
          passInput.value = "officer1@aicte";
        }
      }
      if (idIcon) idIcon.className = "fa-solid fa-user-shield login-input-icon";
      const picker = document.getElementById("adminOfficialsPicker");
      if (picker) picker.style.display = "block";
    });
  }

  // Password Visibility Toggle
  const togglePassBtn = document.getElementById("btnTogglePassword");
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener("click", function () {
      const type = passInput.getAttribute("type") === "password" ? "text" : "password";
      passInput.setAttribute("type", type);
      togglePassBtn.innerHTML = type === "password" ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });
  }

  // Demo Autofill Helpers
  const btnDemoSKCET = document.getElementById("btnAutofillSKCET");
  const btnDemoAdmin = document.getElementById("btnAutofillAdmin");

  if (btnDemoSKCET) {
    btnDemoSKCET.addEventListener("click", function () {
      if (instituteTab) instituteTab.click();
      if (instNameInput) instNameInput.value = "Sri Krishna College of Engineering and Technology";
      if (idInput) idInput.value = "1-2718-TN";
      if (passInput) passInput.value = "aicte@2026";
      if (captchaInput) captchaInput.value = currentCaptcha || "G3C1M";
    });
  }

  if (btnDemoAdmin) {
    btnDemoAdmin.addEventListener("click", function () {
      if (adminTab) adminTab.click();
      if (idInput) idInput.value = "RO-SRO-01";
      if (passInput) passInput.value = "officer1@aicte";
      if (captchaInput) captchaInput.value = currentCaptcha || "G3C1M";
      window.aicteApprovalPipeline.activeOfficialId = "RO-SRO-01";
    });
  }

  // Handle Login Submit
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      executeLogin();
    });
  }

  const btnLoginSubmit = document.getElementById("btnLoginSubmit");
  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener("click", function (e) {
      e.preventDefault();
      executeLogin();
    });
  }

  // Register Modal Trigger
  const btnRegister = document.getElementById("btnRegisterModal");
  if (btnRegister) {
    btnRegister.addEventListener("click", function () {
      openModal("modalRegister");
    });
  }

  // Registration Form Submit
  const formRegister = document.getElementById("formNewInstituteRegister");
  if (formRegister) {
    formRegister.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Registration request submitted! A temporary Application ID has been dispatched to the Trustee email for Letter of Intent (LOI) submission.");
      closeModal("modalRegister");
    });
  }
}

/* ==========================================================================
   VIEW & TAB ROUTING - INSTANT SWITCHING GUARANTEED
   ========================================================================== */
function switchToView(viewName) {
  const loginView = document.getElementById("viewLogin");
  const portalView = document.getElementById("viewPortal");

  if (viewName === "portal") {
    if (loginView) {
      loginView.classList.remove("active");
      loginView.style.setProperty("display", "none", "important");
    }
    if (portalView) {
      portalView.classList.add("active");
      portalView.style.setProperty("display", "flex", "important");
    }
    // Instant scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    try {
      updateHeaderUserProfile();
      renderAllWorkspaceData();
    } catch (e) {
      console.warn("Render update warning on portal switch:", e);
    }
    // Default to Dashboard tab
    switchWorkspaceTab("dashboard");
  } else {
    if (portalView) {
      portalView.classList.remove("active");
      portalView.style.setProperty("display", "none", "important");
    }
    if (loginView) {
      loginView.classList.add("active");
      loginView.style.setProperty("display", "flex", "important");
    }
    // Instant scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    try {
      initCaptcha();
    } catch (e) {
      console.warn("initCaptcha warning:", e);
    }
  }
}
window.switchToView = switchToView;

function renderCurrentView() {
  // Start on login view initially
  switchToView("login");
}

function bindHeaderEvents() {
  // Logout Button
  const btnLogout = document.getElementById("btnPortalLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function () {
      if (confirm("Are you sure you want to log out of the AICTE Approval Platform?")) {
        window.AICTEWorkflow.logAudit("User Logged Out", "Ended active session cleanly.");
        switchToView("login");
      }
    });
  }

  // Quick Role Toggle Switcher in Header
  const roleBadge = document.getElementById("headerRoleBadge");
  if (roleBadge) {
    roleBadge.addEventListener("click", function () {
      const current = window.AICTEStore.getActiveRole();
      const nextRole = current === "institute" ? "admin" : "institute";
      window.AICTEStore.setActiveRole(nextRole);
      currentLoginRole = nextRole;
      updateHeaderUserProfile();
      renderAllWorkspaceData();
      if (nextRole === "admin") {
        const off = window.AICTE_OFFICIALS[window.aicteApprovalPipeline.activeOfficialId] || window.AICTE_OFFICIALS["RO-SRO-01"];
        switchWorkspaceTab("official-desk");
        renderOfficialDesk();
        alert(`Switched View to: AICTE Official Scrutiny Console (${off.name})`);
      } else {
        switchWorkspaceTab("dashboard");
        alert("Switched View to: Institutional Portal (Sri Krishna College)");
      }
    });
  }

  // Notification Bell Toggle
  const btnBell = document.getElementById("btnNotificationBell");
  const notifDrawer = document.getElementById("notificationDrawer");
  if (btnBell && notifDrawer) {
    btnBell.addEventListener("click", function (e) {
      e.stopPropagation();
      notifDrawer.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (!notifDrawer.contains(e.target) && e.target !== btnBell) {
        notifDrawer.classList.remove("active");
      }
    });
  }
}

function updateHeaderUserProfile() {
  const role = window.AICTEStore.getActiveRole();
  const state = window.AICTEStore.getData();
  const roleBadgeText = document.getElementById("headerRoleBadgeText");
  const name1 = document.getElementById("headerUserName1");
  const name2 = document.getElementById("headerUserName2");
  const idSub = document.getElementById("headerUserIdSub");
  const navOfficialDesk = document.getElementById("navItemOfficialDesk");

  const instituteOnlyTabs = ["dashboard", "certificate", "rules", "application", "validation", "complaint"];
  const adminAllowedTabs = ["official-desk", "upload", "report"];

  if (role === "institute") {
    if (name1) name1.innerText = "Sri Krishna College of";
    if (name2) name2.innerText = "Engineering and Technology";
    if (idSub) idSub.innerHTML = 'AICTE ID: SKCET01 <i class="fa-solid fa-chevron-down"></i>';
    if (roleBadgeText) roleBadgeText.innerText = "Role: Institute";
    if (navOfficialDesk) navOfficialDesk.style.display = "none";

    instituteOnlyTabs.forEach(tab => {
      const btn = document.querySelector(`.sidebar-nav-item[data-tab="${tab}"]`);
      if (btn) btn.style.display = "flex";
    });
  } else {
    const activeOfficial = (window.AICTE_OFFICIALS && window.AICTE_OFFICIALS[window.aicteApprovalPipeline.activeOfficialId]) || (window.AICTE_OFFICIALS && window.AICTE_OFFICIALS["RO-SRO-01"]);
    if (name1) name1.innerText = activeOfficial.name;
    if (name2) name2.innerText = activeOfficial.designation;
    if (idSub) idSub.innerHTML = `OFFICER ID: ${activeOfficial.id} <i class="fa-solid fa-chevron-down"></i>`;
    if (roleBadgeText) roleBadgeText.innerText = `Role: ${activeOfficial.stageName} (Official ${activeOfficial.officialNumber})`;
    if (navOfficialDesk) navOfficialDesk.style.display = "flex";

    // For Admin: hide institute-specific filing tabs to focus purely on Scrutiny Desk, Tracker, and Reports
    instituteOnlyTabs.forEach(tab => {
      const btn = document.querySelector(`.sidebar-nav-item[data-tab="${tab}"]`);
      if (btn) btn.style.display = "none";
    });
    adminAllowedTabs.forEach(tab => {
      const btn = document.querySelector(`.sidebar-nav-item[data-tab="${tab}"]`);
      if (btn) btn.style.display = "flex";
    });
  }
}

/* ==========================================================================
   SIDEBAR NAVIGATION
   ========================================================================== */
function bindSidebarNav() {
  const navButtons = document.querySelectorAll(".sidebar-nav-item");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");
      switchWorkspaceTab(targetTab);
    });
  });
}

function switchWorkspaceTab(tabId) {
  // Instantly reset scroll to top on workspace container without animation/jitter
  const ws = document.querySelector(".portal-workspace");
  if (ws) {
    ws.scrollTop = 0;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  // Update sidebar active classes
  const navButtons = document.querySelectorAll(".sidebar-nav-item");
  navButtons.forEach((btn) => {
    if (btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update workspace sections
  const sections = document.querySelectorAll(".workspace-section");
  sections.forEach((sec) => {
    if (sec.id === `section-${tabId}`) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });

  // Re-render relevant data when switching
  if (tabId === "dashboard") renderDashboardStats();
  if (tabId === "certificate") renderCertificateExpiryTable();
  if (tabId === "application") renderApplicationsList();
  if (tabId === "validation") runLiveAIValidationScan();
  if (tabId === "upload") {
    renderUndertakingsList();
    renderApplicationTrackerStages();
  }
  if (tabId === "official-desk") renderOfficialDesk();
  if (tabId === "complaint") renderGrievanceList();
  if (tabId === "report") {
    renderAuditTrailTable();
    renderRegionalReportTable();
    renderApplicationTrackerStages();
    if (typeof renderStageSummaryReportTimeline === "function") renderStageSummaryReportTimeline();
  }
}

/* ==========================================================================
   SECTION 1: DASHBOARD (Exact Match to Image 5)
   ========================================================================== */
function renderDashboardStats() {
  const state = window.AICTEStore.getData();
  const role = window.AICTEStore.getActiveRole();

  // Metrics (Row 1)
  const filedEl = document.getElementById("metricApplicationFiled");
  const approvedEl = document.getElementById("metricApproved");
  const pendingEl = document.getElementById("metricPending");
  const rejectedEl = document.getElementById("metricRejected");

  if (filedEl) filedEl.innerText = state.institute.stats.filed;
  if (approvedEl) approvedEl.innerText = state.institute.stats.approved;
  if (pendingEl) pendingEl.innerText = state.institute.stats.pending;
  if (rejectedEl) rejectedEl.innerText = state.institute.stats.rejected;

  // Institute Title
  const titleEl = document.getElementById("dashboardCollegeTitle");
  if (titleEl) {
    if (role === "institute") {
      titleEl.innerText = state.institute.name.toUpperCase();
    } else {
      titleEl.innerText = "AICTE SOUTHERN REGION - REGIONAL APPROVAL CONSOLE";
    }
  }

  // Courses List (Matching Image 5 layout exactly)
  const coursesList = document.getElementById("dashboardCoursesList");
  if (coursesList) {
    coursesList.innerHTML = state.institute.courses
      .map(
        (c) => `
        <div class="course-item-row">
          <span>${c}</span>
        </div>
      `
      )
      .join("");
  }
}

/* ==========================================================================
   SECTION 2: CERTIFICATE & LEASE VALIDITY MONITORING (Section E)
   ========================================================================== */
let currentDocFilter = "all";

function renderCertificateExpiryTable() {
  const state = window.AICTEStore.getData();
  const tbody = document.getElementById("tbodyCertificates");
  if (!tbody) return;

  const filteredDocs = state.documents.filter((doc) => {
    if (currentDocFilter === "all") return true;
    if (currentDocFilter === "critical") return doc.daysRemaining <= 45;
    if (currentDocFilter === "valid") return doc.daysRemaining > 90;
    return true;
  });

  tbody.innerHTML = filteredDocs
    .map((doc) => {
      let badgeClass = "badge-success";
      if (doc.severity === "danger") badgeClass = "badge-danger";
      else if (doc.severity === "warning") badgeClass = "badge-warning";

      const percentRemaining = Math.max(0, Math.min(100, Math.round((doc.daysRemaining / 365) * 100)));

      return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #103f79;">${doc.name}</div>
          <div style="font-size: 12px; color: #64748b;">${doc.category} &bull; ${doc.documentNo}</div>
        </td>
        <td>${doc.issuingAuthority}</td>
        <td>
          <div style="font-size: 13px;">${doc.expiryDate}</div>
          <div style="font-size: 11px; color: #64748b;">Issued: ${doc.issueDate}</div>
        </td>
        <td style="min-width: 140px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 4px;">
            <span>${doc.daysRemaining} Days</span>
            <span style="color: ${doc.daysRemaining < 45 ? '#dc2626' : '#16a34a'}">${doc.daysRemaining < 45 ? 'Urgent' : 'OK'}</span>
          </div>
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
            <div style="width: ${percentRemaining}%; height: 100%; background: ${doc.daysRemaining < 45 ? '#dc2626' : (doc.daysRemaining < 90 ? '#d97706' : '#16a34a')};"></div>
          </div>
        </td>
        <td>
          <span class="status-badge ${badgeClass}">
            <i class="fa-solid fa-circle" style="font-size: 8px;"></i>
            ${doc.status}
          </span>
        </td>
        <td>
          <button class="btn-primary-orange" style="padding: 6px 12px; font-size: 12px;" onclick="openRenewModal('${doc.id}')">
            <i class="fa-solid fa-arrows-rotate"></i> Renew
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  // Update KPI counters
  const totalEl = document.getElementById("certCountTotal");
  const critEl = document.getElementById("certCountCritical");
  const validEl = document.getElementById("certCountValid");

  if (totalEl) totalEl.innerText = state.documents.length;
  if (critEl) critEl.innerText = state.documents.filter((d) => d.daysRemaining <= 45).length;
  if (validEl) validEl.innerText = state.documents.filter((d) => d.daysRemaining > 90).length;
}

window.filterCertificates = function (filterType, element) {
  currentDocFilter = filterType;
  const pills = document.querySelectorAll("#certFilterTabs .tab-pill");
  pills.forEach((p) => p.classList.remove("active"));
  if (element) element.classList.add("active");
  renderCertificateExpiryTable();
};

window.openRenewModal = function (docId) {
  const state = window.AICTEStore.getData();
  const doc = state.documents.find((d) => d.id === docId);
  if (!doc) return;

  document.getElementById("renewDocId").value = doc.id;
  document.getElementById("renewDocNameDisplay").innerText = doc.name;
  document.getElementById("renewCurrentExpiry").innerText = doc.expiryDate;
  document.getElementById("inputRenewDocNo").value = doc.documentNo + "-REV26";
  document.getElementById("inputRenewAuthority").value = doc.issuingAuthority;

  // Set default new expiry date to 3 years ahead
  const nextDate = new Date();
  nextDate.setFullYear(nextDate.getFullYear() + 3);
  document.getElementById("inputRenewDate").value = nextDate.toISOString().split("T")[0];

  openModal("modalRenewDocument");
};

// Handle Renew Form Submit
const formRenew = document.getElementById("formRenewDocument");
if (formRenew) {
  formRenew.addEventListener("submit", function (e) {
    e.preventDefault();
    const docId = document.getElementById("renewDocId").value;
    const newDocNo = document.getElementById("inputRenewDocNo").value;
    const newExpiry = document.getElementById("inputRenewDate").value;
    const auth = document.getElementById("inputRenewAuthority").value;

    window.AICTEWorkflow.renewDocument(docId, newDocNo, newExpiry, auth);
    closeModal("modalRenewDocument");
    renderCertificateExpiryTable();
    renderNotificationsList();
    alert("Document renewed successfully! Validity updated and alert cleared.");
  });
}

/* ==========================================================================
   SECTION 3: APPLICATION WORKFLOW AUTOMATION (Section A & C)
   ========================================================================== */
let currentAppFilter = "all";

function renderApplicationsList() {
  const state = window.AICTEStore.getData();
  const role = window.AICTEStore.getActiveRole();
  const container = document.getElementById("applicationsListContainer");
  if (!container) return;

  const filteredApps = state.applications.filter((app) => {
    if (currentAppFilter === "all") return true;
    return app.workflowType.toLowerCase().includes(currentAppFilter.toLowerCase());
  });

  container.innerHTML = filteredApps
    .map((app) => {
      // Stage step highlights
      const steps = [
        { name: "Filed", active: app.stageIndex >= 0 },
        { name: "Scrutiny", active: app.stageIndex >= 1 },
        { name: "Deficiencies", active: app.stageIndex === 2 },
        { name: "EVC Inspection", active: app.stageIndex >= 3 },
        { name: "SAC Appeal", active: app.stageIndex === 4 },
        { name: "Approval/Order", active: app.stageIndex === 5 }
      ];

      const stepsHtml = steps
        .map((s, idx) => {
          const isDone = app.stageIndex > idx;
          const isCurrent = app.stageIndex === idx;
          let cls = "pipeline-step";
          if (isDone) cls += " completed";
          else if (isCurrent) cls += " active";
          return `
          <div class="${cls}">
            ${isDone ? '<i class="fa-solid fa-check"></i> ' : ""}${s.name}
          </div>
          ${idx < steps.length - 1 ? '<span class="pipeline-arrow">&rarr;</span>' : ""}
        `;
        })
        .join("");

      // Action buttons based on Role & Stage
      let actionsHtml = `
      <button class="btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="viewCaseDossier('${app.id}')">
        <i class="fa-regular fa-file-lines"></i> View Dossier
      </button>
    `;

      if (role === "admin") {
        if (app.stageIndex === 1 || app.stageIndex === 2) {
          actionsHtml += `
          <button class="btn-primary-orange" style="padding: 6px 12px; font-size: 13px;" onclick="openOfficerScrutinyModal('${app.id}')">
            <i class="fa-solid fa-stamp"></i> Scrutiny Action
          </button>
        `;
        } else if (app.stageIndex === 3) {
          actionsHtml += `
          <button class="btn-secondary-blue" style="padding: 6px 12px; font-size: 13px;" onclick="openEVCSchedulingModal('${app.id}')">
            <i class="fa-solid fa-calendar-check"></i> Manage EVC
          </button>
        `;
        }
      } else {
        // Institute actions
        if (app.stageIndex === 2) {
          actionsHtml += `
          <button class="btn-primary-orange" style="padding: 6px 12px; font-size: 13px;" onclick="openRectifyModal('${app.id}')">
            <i class="fa-solid fa-upload"></i> Rectify Deficiencies
          </button>
        `;
        }
      }

      return `
      <div class="data-table-container" style="padding: 20px; margin-bottom: 18px; border-left: 5px solid ${app.stageIndex === 5 ? '#16a34a' : (app.stageIndex === 2 ? '#dc2626' : '#f37021')};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
              <span style="font-weight: 800; color: #103f79; font-size: 16px;">${app.id}</span>
              <span class="status-badge badge-neutral" style="font-size: 11px;">${app.workflowType}</span>
              <span class="status-badge ${app.slaBadge === 'danger' ? 'badge-danger' : (app.slaBadge === 'warning' ? 'badge-warning' : 'badge-success')}">
                <i class="fa-regular fa-clock"></i> ${app.slaStatus}
              </span>
            </div>
            <h4 style="font-size: 16px; color: #1e293b; margin-bottom: 4px;">${app.title}</h4>
            <div style="font-size: 13px; color: #64748b;">
              Institution: <strong>${app.institution}</strong> &bull; Applied: ${app.appliedDate} &bull; AY: ${app.academicYear}
            </div>
          </div>
          <div style="text-align: right;">
            <span class="status-badge ${app.stageIndex === 5 ? 'badge-success' : 'badge-info'}" style="font-size: 13px; padding: 6px 14px;">
              ${app.currentStage}
            </span>
          </div>
        </div>

        <div style="margin: 14px 0; background: #f8fafc; padding: 10px 14px; border-radius: 8px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px;">
            Statutory Workflow Movement
          </div>
          <div class="workflow-pipeline">
            ${stepsHtml}
          </div>
        </div>

        <p style="font-size: 13px; color: #475569; margin-bottom: 16px; line-height: 1.45;">
          ${app.summary}
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          <div style="font-size: 12px; color: #64748b;">
            <i class="fa-solid fa-user-check"></i> Assigned: <strong>${app.assignedOfficer}</strong>
          </div>
          <div style="display: flex; gap: 10px;">
            ${actionsHtml}
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

window.filterApplications = function (wfType, element) {
  currentAppFilter = wfType;
  const pills = document.querySelectorAll("#appFilterTabs .tab-pill");
  pills.forEach((p) => p.classList.remove("active"));
  if (element) element.classList.add("active");
  renderApplicationsList();
};

// Case Dossier Modal
window.viewCaseDossier = function (appId) {
  const state = window.AICTEStore.getData();
  const app = state.applications.find((a) => a.id === appId);
  if (!app) return;

  const content = document.getElementById("dossierContent");
  if (!content) return;

  content.innerHTML = `
    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 16px;">
      <h3 style="color: #103f79; font-size: 18px; margin-bottom: 6px;">${app.id}: ${app.title}</h3>
      <div style="font-size: 13px; color: #64748b;">
        Institution: ${app.institution} | Region: ${app.region} | Workflow: <strong>${app.workflowType}</strong>
      </div>
    </div>

    <div class="form-grid" style="margin-bottom: 16px;">
      <div class="kpi-card">
        <div class="kpi-title">Current Processing Stage</div>
        <div style="font-size: 16px; font-weight: 700; color: #103f79; margin-top: 4px;">${app.currentStage}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">SLA Compliance Window</div>
        <div style="font-size: 16px; font-weight: 700; color: #16a34a; margin-top: 4px;">${app.slaStatus}</div>
      </div>
    </div>

    <h4 style="font-size: 14px; color: #103f79; margin-bottom: 8px;">Institutional Parameters Verified:</h4>
    <table class="data-table" style="font-size: 13px; margin-bottom: 18px;">
      <tr>
        <td><strong>Land Area Compliance</strong></td>
        <td>25.4 Acres (Contiguous, Registered >30 Years)</td>
        <td><span class="status-badge badge-success"><i class="fa-solid fa-check"></i> Passed</span></td>
      </tr>
      <tr>
        <td><strong>Faculty Student Ratio (FSR)</strong></td>
        <td>1:18.4 (Prescribed Norm 1:20 UG)</td>
        <td><span class="status-badge badge-success"><i class="fa-solid fa-check"></i> Passed</span></td>
      </tr>
      <tr>
        <td><strong>Fire & Safety Clearance</strong></td>
        <td>NOC/FS/CBE/2025/1109 (Renewal Pending)</td>
        <td><span class="status-badge badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> Action Required</span></td>
      </tr>
    </table>

    ${
      app.deficiencies && app.deficiencies.length > 0
        ? `
      <h4 style="font-size: 14px; color: #dc2626; margin-bottom: 8px;">Deficiency / Return History:</h4>
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <div style="font-weight: 700; font-size: 13px; color: #991b1b;">Recorded Observation:</div>
        <div style="font-size: 13px; color: #7f1d1d; margin: 4px 0 8px 0;">${app.deficiencies[0].observation}</div>
        <div style="font-size: 12px; color: #64748b;">Recorded by: ${app.deficiencies[0].officer} on ${app.deficiencies[0].date}</div>
        ${
          app.deficiencies[0].rectificationUploaded
            ? `<div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fca5a5; font-size: 12px; color: #166534;">
                <i class="fa-solid fa-circle-check"></i> Rectification uploaded: "${app.deficiencies[0].rectificationNote}"
               </div>`
            : `<div style="margin-top: 8px; color: #dc2626; font-size: 12px; font-weight: 700;">Awaiting Institution Rectification</div>`
        }
      </div>
    `
        : ""
    }

    ${
      app.evcDetails
        ? `
      <h4 style="font-size: 14px; color: #103f79; margin-bottom: 8px;">Expert Visit Committee (EVC) Allocation:</h4>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
        <div style="font-size: 13px;"><strong>Scheduled Date:</strong> ${app.evcDetails.scheduledDate} (${app.evcDetails.status})</div>
        <div style="font-size: 13px; margin-top: 4px;"><strong>Lead Academic Inspector:</strong> ${app.evcDetails.leadInspector}</div>
        <div style="font-size: 13px; margin-top: 2px;"><strong>Industry Representative:</strong> ${app.evcDetails.expert2}</div>
        <div style="font-size: 13px; margin-top: 2px;"><strong>Inspection Protocol:</strong> ${app.evcDetails.mode}</div>
      </div>
    `
        : ""
    }
  `;

  openModal("modalCaseDossier");
};

// Officer Scrutiny Action Modal
window.openOfficerScrutinyModal = function (appId) {
  document.getElementById("officerActionAppId").value = appId;
  document.getElementById("officerActionAppIdDisplay").innerText = appId;
  openModal("modalOfficerAction");
};

// Officer Action Submit (Approve or Revert)
const btnActionPassScrutiny = document.getElementById("btnOfficerPassScrutiny");
const btnActionRevertDeficiency = document.getElementById("btnOfficerRevertDeficiency");

if (btnActionPassScrutiny) {
  btnActionPassScrutiny.addEventListener("click", function () {
    const appId = document.getElementById("officerActionAppId").value;
    const remarks = document.getElementById("officerActionRemarks").value;
    window.AICTEWorkflow.approveScrutiny(appId, remarks);
    closeModal("modalOfficerAction");
    renderApplicationsList();
    renderDashboardStats();
    alert(`Application ${appId} successfully passed scrutiny! Auto-routed to the next prescribed stage.`);
  });
}

if (btnActionRevertDeficiency) {
  btnActionRevertDeficiency.addEventListener("click", function () {
    const appId = document.getElementById("officerActionAppId").value;
    const remarks = document.getElementById("officerActionRemarks").value;
    if (!remarks.trim()) {
      alert("Please specify the exact deficiency observation reason for returning the application.");
      return;
    }
    window.AICTEWorkflow.revertWithDeficiencies(appId, remarks, 7);
    closeModal("modalOfficerAction");
    renderApplicationsList();
    alert(`Application ${appId} returned to institution with recorded deficiencies and 7-day cure window.`);
  });
}

// Institute Rectify Modal
window.openRectifyModal = function (appId) {
  document.getElementById("rectifyAppId").value = appId;
  document.getElementById("rectifyAppIdDisplay").innerText = appId;
  openModal("modalRectify");
};

const formRectify = document.getElementById("formRectify");
if (formRectify) {
  formRectify.addEventListener("submit", function (e) {
    e.preventDefault();
    const appId = document.getElementById("rectifyAppId").value;
    const note = document.getElementById("rectifyRemarks").value;
    window.AICTEWorkflow.submitRectification(appId, note);
    closeModal("modalRectify");
    renderApplicationsList();
    alert(`Rectification compliance submitted for ${appId}! Application queued for AICTE Re-scrutiny.`);
  });
}

// EVC Scheduling Modal
window.openEVCSchedulingModal = function (appId) {
  document.getElementById("evcScheduleAppId").value = appId;
  document.getElementById("evcScheduleAppIdDisplay").innerText = appId;

  // Set default inspection date 10 days out
  const inspDate = new Date();
  inspDate.setDate(inspDate.getDate() + 10);
  document.getElementById("inputEVCDate").value = inspDate.toISOString().split("T")[0];

  openModal("modalEVCScheduling");
};

const formEVC = document.getElementById("formEVCScheduling");
if (formEVC) {
  formEVC.addEventListener("submit", function (e) {
    e.preventDefault();
    const appId = document.getElementById("evcScheduleAppId").value;
    const date = document.getElementById("inputEVCDate").value;
    const lead = document.getElementById("inputEVCLead").value;
    const expert2 = document.getElementById("inputEVCExpert2").value;

    window.AICTEWorkflow.scheduleEVC(appId, {
      scheduledDate: date,
      leadInspector: lead,
      expert2: expert2,
      nominee: "Er. R. Senthil (AICTE RO)",
      mode: "Physical On-Site with Geo-Tagging"
    });

    closeModal("modalEVCScheduling");
    renderApplicationsList();
    alert(`EVC inspection date (${date}) confirmed and dispatches sent to committee and institution!`);
  });
}

// File New Application Form
const btnNewApp = document.getElementById("btnNewApplicationModal");
if (btnNewApp) {
  btnNewApp.addEventListener("click", function () {
    openModal("modalNewApplication");
  });
}

const formNewApp = document.getElementById("formNewApplication");
if (formNewApp) {
  formNewApp.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("newAppTitle").value;
    const wfType = document.getElementById("newAppWorkflowType").value;
    const notes = document.getElementById("newAppNotes").value;

    window.AICTEWorkflow.fileApplication({
      title: title,
      workflowType: wfType,
      summary: notes
    });

    closeModal("modalNewApplication");
    renderApplicationsList();
    renderDashboardStats();
    alert("New approval application created and queued for AICTE Scrutiny!");
  });
}

/* ==========================================================================
   SECTION 4: TIME-BOUND UNDERTAKINGS (Section D)
   ========================================================================== */
function renderUndertakingsList() {
  const state = window.AICTEStore.getData();
  const role = window.AICTEStore.getActiveRole();
  const container = document.getElementById("undertakingsContainer");
  if (!container) return;

  container.innerHTML = state.undertakings
    .map((ut) => {
      let badgeClass = "badge-success";
      if (ut.severity === "danger") badgeClass = "badge-danger";
      else if (ut.severity === "warning") badgeClass = "badge-warning";

      let actionsHtml = "";
      if (role === "admin") {
        if (ut.status.includes("Submitted")) {
          actionsHtml = `
          <button class="btn-primary-orange" style="padding: 6px 12px; font-size: 12px;" onclick="officerVerifyUndertaking('${ut.id}', 'Approve')">
            <i class="fa-solid fa-check"></i> Approve Compliance
          </button>
          <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px; color: #dc2626;" onclick="officerVerifyUndertaking('${ut.id}', 'Reject')">
            <i class="fa-solid fa-xmark"></i> Reject
          </button>
        `;
        }
      } else {
        if (ut.status !== "Verified & Approved") {
          actionsHtml = `
          <button class="btn-primary-orange" style="padding: 6px 12px; font-size: 12px;" onclick="openSubmitUndertakingModal('${ut.id}')">
            <i class="fa-solid fa-upload"></i> Upload Evidence
          </button>
        `;
        }
      }

      return `
      <div class="data-table-container" style="padding: 20px; margin-bottom: 18px; border-left: 5px solid ${ut.severity === 'danger' ? '#dc2626' : (ut.severity === 'warning' ? '#d97706' : '#16a34a')};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="font-weight: 800; color: #103f79; font-size: 15px;">${ut.id}: ${ut.title}</div>
            <div style="font-size: 12px; color: #64748b;">Ref: ${ut.approvalRef} &bull; Sanctioned: ${ut.sanctionDate}</div>
          </div>
          <span class="status-badge ${badgeClass}">${ut.status}</span>
        </div>

        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 13px; color: #334155; margin-bottom: 12px;">
          <strong>Prescribed Condition:</strong> ${ut.prescribedCondition}
        </div>

        <div class="form-grid" style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
          <div><strong>Due Date:</strong> ${ut.dueDate} (${ut.daysRemaining > 0 ? ut.daysRemaining + ' days left' : 'Due Passed'})</div>
          <div><strong>Evidence:</strong> ${ut.evidenceRequired || 'Document proof required'}</div>
          <div class="form-full" style="color: #b91c1c;"><strong>Penalty Warning:</strong> ${ut.penaltyWarning || 'Show cause notice'}</div>
        </div>

        ${
          ut.submissionDetails
            ? `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px; font-size: 12px; color: #166534; margin-bottom: 12px;">
            <div><strong>Submission Log:</strong> Submitted on ${ut.submissionDetails.submittedDate}.</div>
            <div><strong>Officer Remarks:</strong> ${ut.submissionDetails.officerRemarks}</div>
          </div>
        `
            : ""
        }

        <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
          ${actionsHtml}
        </div>
      </div>
    `;
    })
    .join("");
}

window.openSubmitUndertakingModal = function (utId) {
  const state = window.AICTEStore.getData();
  const ut = state.undertakings.find((u) => u.id === utId);
  if (!ut) return;

  document.getElementById("submitUTId").value = ut.id;
  document.getElementById("submitUTTitleDisplay").innerText = `${ut.id}: ${ut.title}`;
  openModal("modalSubmitUndertaking");
};

const formUTSubmit = document.getElementById("formSubmitUndertaking");
if (formUTSubmit) {
  formUTSubmit.addEventListener("submit", function (e) {
    e.preventDefault();
    const utId = document.getElementById("submitUTId").value;
    const remarks = document.getElementById("submitUTRemarks").value;
    window.AICTEWorkflow.submitUndertakingCompliance(utId, remarks);
    closeModal("modalSubmitUndertaking");
    renderUndertakingsList();
    alert("Compliance evidence uploaded! Queued for AICTE Regional Officer verification.");
  });
}

window.officerVerifyUndertaking = function (utId, decision) {
  const remarks = prompt(
    decision === "Approve" ? "Enter verification approval remarks:" : "Enter deficiency observation remarks:"
  );
  if (remarks === null) return;
  window.AICTEWorkflow.verifyUndertaking(utId, decision, remarks);
  renderUndertakingsList();
};

/* ==========================================================================
   SECTION 5: AI VALIDATION SCAN SIMULATOR
   ========================================================================== */
window.runAIValidationScan = function () {
  const btn = document.getElementById("btnRunAIScan");
  const resultBox = document.getElementById("aiScanResultBox");
  const progressBox = document.getElementById("aiScanProgress");

  if (btn) btn.disabled = true;
  if (progressBox) progressBox.style.display = "block";
  if (resultBox) resultBox.style.display = "none";

  let progress = 0;
  const progressBar = document.getElementById("aiProgressBarInner");
  const progressText = document.getElementById("aiProgressText");

  const interval = setInterval(() => {
    progress += 25;
    if (progressBar) progressBar.style.width = progress + "%";

    if (progress === 25 && progressText) progressText.innerText = "Inspecting Registered Land Lease Deed & Geo-coordinates...";
    if (progress === 50 && progressText) progressText.innerText = "Validating Aadhaar-seeded Faculty-Student Ratio (FSR)...";
    if (progress === 75 && progressText) progressText.innerText = "Verifying Built-up Carpet Area & Fire Safety Norms...";
    if (progress === 100) {
      clearInterval(interval);
      if (progressBox) progressBox.style.display = "none";
      if (resultBox) resultBox.style.display = "block";
      if (btn) btn.disabled = false;
      window.AICTEWorkflow.logAudit("AI Pre-Scrutiny Verification Executed", "Scanned institutional dossier against APH 2024-2027 norms. 3 Passed, 2 Alerts.");
    }
  }, 400);
};

/* ==========================================================================
   SECTION 6: GRIEVANCE & ESCALATION MATRIX (Section F)
   ========================================================================== */
function renderGrievanceList() {
  const state = window.AICTEStore.getData();
  const container = document.getElementById("grievanceListContainer");
  if (!container) return;

  container.innerHTML = state.grievances
    .map(
      (grv) => `
      <div class="data-table-container" style="padding: 18px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <span style="font-weight: 800; color: #103f79;">${grv.id}</span>
            <span style="font-size: 12px; color: #64748b; margin-left: 8px;">Ref: ${grv.appRef}</span>
          </div>
          <span class="status-badge badge-warning">${grv.currentTier}</span>
        </div>
        <h4 style="font-size: 15px; color: #1e293b; margin-bottom: 4px;">${grv.subject}</h4>
        <p style="font-size: 13px; color: #475569; margin-bottom: 8px;">${grv.remarks}</p>
        <div style="font-size: 12px; color: #64748b;">
          Filed on: ${grv.filedDate} &bull; SLA Resolution Deadline: <strong>${grv.slaDeadline}</strong>
        </div>
      </div>
    `
    )
    .join("");
}

const btnNewGrievance = document.getElementById("btnNewGrievanceModal");
if (btnNewGrievance) {
  btnNewGrievance.addEventListener("click", function () {
    openModal("modalNewGrievance");
  });
}

const formGrievance = document.getElementById("formNewGrievance");
if (formGrievance) {
  formGrievance.addEventListener("submit", function (e) {
    e.preventDefault();
    const appRef = document.getElementById("grvAppRef").value;
    const cat = document.getElementById("grvCategory").value;
    const subj = document.getElementById("grvSubject").value;
    const desc = document.getElementById("grvDesc").value;

    window.AICTEWorkflow.fileGrievance(appRef, subj, cat, desc);
    closeModal("modalNewGrievance");
    renderGrievanceList();
    alert("Grievance appeal registered! Multi-tier SLA countdown initiated under Tier 1 (Regional Officer).");
  });
}

/* ==========================================================================
   SECTION 7: AUDIT TRAIL & REGIONAL PERFORMANCE (Section B & F)
   ========================================================================== */
function renderAuditTrailTable() {
  const state = window.AICTEStore.getData();
  const tbody = document.getElementById("tbodyAuditTrail");
  if (!tbody) return;

  tbody.innerHTML = state.auditTrail
    .slice(0, 15)
    .map(
      (log) => `
      <tr>
        <td style="font-family: monospace; font-size: 12px; color: #475569;">${log.timestamp}</td>
        <td>
          <div style="font-weight: 700; color: #103f79; font-size: 13px;">${log.user}</div>
          <div style="font-size: 11px; color: #64748b;">${log.role}</div>
        </td>
        <td>
          <span style="font-weight: 700; color: #1e293b; font-size: 13px;">${log.action}</span>
          <div style="font-size: 12px; color: #475569; margin-top: 2px;">${log.details}</div>
        </td>
        <td style="font-family: monospace; font-size: 11px; color: #64748b;">${log.ip}</td>
        <td><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${log.txHash}</code></td>
      </tr>
    `
    )
    .join("");
}

function renderRegionalReportTable() {
  const state = window.AICTEStore.getData();
  const tbody = document.getElementById("tbodyRegionalReport");
  if (!tbody) return;

  tbody.innerHTML = state.regions
    .map(
      (reg) => `
      <tr>
        <td>
          <strong>${reg.name}</strong>
          <div style="font-size: 11px; color: #64748b;">HQ: ${reg.hq}</div>
        </td>
        <td>${reg.states}</td>
        <td><strong>${reg.total}</strong></td>
        <td><span class="status-badge badge-info">${reg.scrutiny}</span></td>
        <td><span class="status-badge badge-warning">${reg.evc}</span></td>
        <td><span class="status-badge badge-success">${reg.approved}</span></td>
        <td>
          <span class="status-badge ${reg.overdue > 10 ? 'badge-danger' : 'badge-neutral'}">
            ${reg.overdue} Overdue
          </span>
        </td>
      </tr>
    `
    )
    .join("");
}

window.exportAuditTrailCSV = function () {
  const state = window.AICTEStore.getData();
  let csv = "Timestamp,User,Role,Action,Details,IP,Hash\n";
  state.auditTrail.forEach((log) => {
    csv += `"${log.timestamp}","${log.user}","${log.role}","${log.action}","${log.details.replace(/"/g, '""')}","${log.ip}","${log.txHash}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `aicte_digital_audit_trail_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ==========================================================================
   NOTIFICATIONS DRAWER
   ========================================================================== */
function renderNotificationsList() {
  const state = window.AICTEStore.getData();
  const list = document.getElementById("notifDrawerList");
  const countBadge = document.getElementById("headerNotifCount");

  if (countBadge) countBadge.innerText = state.notifications.length;
  if (!list) return;

  list.innerHTML = state.notifications
    .map((n) => {
      let iconColor = "#2563eb";
      let bg = "#e0f2fe";
      if (n.type === "critical" || n.type === "danger") {
        iconColor = "#dc2626";
        bg = "#fee2e2";
      } else if (n.type === "warning") {
        iconColor = "#d97706";
        bg = "#fef3c7";
      } else if (n.type === "success") {
        iconColor = "#16a34a";
        bg = "#dcfce7";
      }

      return `
      <div class="notif-item" onclick="handleNotificationClick('${n.targetTab}')">
        <div class="notif-icon-box" style="background: ${bg}; color: ${iconColor};">
          <i class="fa-solid ${n.icon}"></i>
        </div>
        <div class="notif-info">
          <h5>${n.title}</h5>
          <p>${n.desc}</p>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `;
    })
    .join("");
}

window.handleNotificationClick = function (targetTab) {
  const notifDrawer = document.getElementById("notificationDrawer");
  if (notifDrawer) notifDrawer.classList.remove("active");
  switchWorkspaceTab(targetTab || "dashboard");
};

/* ==========================================================================
   MODAL UTILITIES
   ========================================================================== */
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add("active");
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("active");
}

window.closeModal = closeModal;

function renderAllWorkspaceData() {
  renderDashboardStats();
  renderCertificateExpiryTable();
  renderApplicationsList();
  renderUndertakingsList();
  renderGrievanceList();
  renderAuditTrailTable();
  renderRegionalReportTable();
  renderNotificationsList();
  renderApplicationTrackerStages();
  if (typeof renderStageSummaryReportTimeline === "function") renderStageSummaryReportTimeline();
  if (typeof renderOfficialDesk === "function") renderOfficialDesk();
}

/* ==========================================================================
   5-STEP APPLICATION WIZARD CONTROLLER (MATCHES USER'S 5 NEW SCREENSHOTS)
   ========================================================================== */
let currentWizardStep = 1;

window.switchWizardStep = function(step) {
  if (step < 1 || step > 5) return;
  currentWizardStep = step;

  // Update Main Title and Subtitle based on active step (Matching screenshots)
  const titleEl = document.getElementById("wizardStepTitle");
  const subEl = document.getElementById("wizardStepSubtitle");
  if (step === 3) {
    if (titleEl) titleEl.innerText = "Course Details";
    if (subEl) subEl.innerText = "Apply for AICTE Approval / Extension / Change";
  } else if (step === 4) {
    if (titleEl) titleEl.innerText = "Documents";
    if (subEl) subEl.innerText = "Upload the required documents for your application";
  } else {
    if (titleEl) titleEl.innerText = "New Application";
    if (subEl) subEl.innerText = "Apply for AICTE Approval / Extension / Change";
  }

  // Update Step Contents
  for (let i = 1; i <= 5; i++) {
    const content = document.getElementById(`wizardStepContent${i}`);
    if (content) {
      if (i === step) content.classList.add("active");
      else content.classList.remove("active");
    }

    const indicator = document.getElementById(`stepIndicator${i}`);
    const node = document.getElementById(`nodeStep${i}`);
    if (indicator && node) {
      indicator.classList.remove("active", "completed");
      if (i < step) {
        indicator.classList.add("completed");
        node.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else if (i === step) {
        indicator.classList.add("active");
        node.innerText = String(i);
      } else {
        node.innerText = String(i);
      }
    }
  }

  // Update Progress Track Bar
  const trackFill = document.getElementById("stepperTrackFill");
  if (trackFill) {
    const percents = [0, 0, 25, 50, 75, 100];
    trackFill.style.width = (percents[step] || 0) + "%";
  }
};

window.nextWizardStep = function() {
  const currentCheck = document.getElementById(`wizTermsCheck${currentWizardStep}`);
  if (currentCheck && !currentCheck.checked) {
    alert("Please accept the terms and conditions of AICTE to proceed.");
    return;
  }

  if (currentWizardStep < 5) {
    switchWizardStep(currentWizardStep + 1);
  }
};

window.prevWizardStep = function() {
  if (currentWizardStep > 1) {
    switchWizardStep(currentWizardStep - 1);
  }
};

window.triggerFileUpload = function(inputId, displayId) {
  const input = document.getElementById(inputId);
  if (input) input.click();
};

/* ==========================================================================
   AICTE STATUTORY OCR INSPECTOR & DEEP CONTENT ANALYSIS ENGINE (ALL 4 SLOTS)
   Analyzes ACTUAL TEXT CONTENT inside documents, not just file names.
   ========================================================================== */

// 1. Full Statutory Text Corpus (Preloaded extracted OCR text of statutory PDFs)
window.knownDocumentTextCorpus = {
  "1_Affiliation_Certificate_Anna_University.pdf": `ANNA UNIVERSITY CHENNAI - CERTIFICATE OF AFFILIATION
Ref No: AU/Affiliation/2026-27/SKCET-2718
Date of Issue: 15-June-2026   |   Academic Year: 2026-2027
STATUTORY UNIVERSITY AFFILIATION ENDORSEMENT
This is to certify that Sri Krishna College of Engineering and Technology (College Code: 2718), located at Kuniamuthur, Coimbatore - 641008, Tamil Nadu, is granted Continuation of Provisional and Permanent Affiliation under Anna University Chennai as prescribed in the Tamil Nadu State Acts.
APPROVED UNDERGRADUATE COURSES & INTAKE FOR 2026-2027:
1. B.E. Computer Science and Engineering - 180 Seats (Permanent Affiliation)
2. B.Tech Artificial Intelligence and Data Science - 120 Seats (New / Extension Approved)
3. B.E. Electronics and Communication Engineering - 180 Seats (Permanent Affiliation)
4. B.Tech Information Technology - 120 Seats (Permanent Affiliation)
REGULATORY COMPLIANCE STATUS:
The institution fulfills all prescribed syllabus, exam conduct, curriculum, and faculty requirements stipulated under Anna University Regulations and Section 2.1 of the AICTE Approval Process Handbook.
Signature: Prof. Dr. J. Kumar, Ph.D.   |   Registrar, Anna University Chennai
Official Seal & Verification QR Code Hash: AU-CERT-2026-VERIFIED-OK`,

  "2_AICTE_Course_Approval_Letter_VERIFIED.pdf": `ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (NEW DELHI)
F.No. Southern/1-2718-TN/2026-2027/EOA-NEW-COURSE
Date: 12-May-2026   |   Academic Year: 2026-2027 (ACTIVE / CURRENT)
AICTE Approval Portal Reference: AICTE2026-001234
EXTENSION OF APPROVAL (EOA) & NEW COURSE INCLUSION ORDER
To: The Principal / Director, Sri Krishna College of Engineering and Technology (AICTE ID: SKCET01), Kuniamuthur, Coimbatore, Tamil Nadu - 641008.
In terms of provisions under AICTE Regulations 2024 and APH 2024-2027 norms, approval of the Council is hereby conveyed for the following program addition for Academic Year 2026-2027:
Program: Engineering & Technology  |  Level: Under Graduate (B.Tech)
Approved Course: Artificial Intelligence and Data Science
Sanctioned Intake: 120 Seats  |  Duration: 4 Years  |  Affiliating Body: Anna University
AI OCR VERIFICATION AUDIT: 100% MATCHING
- Academic Year matches portal application: 2026-2027 (MATCH)
- Sanctioned intake matches portal application: 120 Seats (MATCH)
- University Affiliation verified with Anna University Registry (MATCH)
Signature: Member Secretary, AICTE New Delhi   |   Digitally Certified & Authenticated
Official QR Verification Hash: AICTE-AUTH-2026-PASS-120-INTAKE`,

  "2_AICTE_Course_Approval_Letter.pdf": `ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (NEW DELHI)
F.No. Southern/1-2718-TN/2026-2027/EOA-NEW-COURSE
Date: 12-May-2026   |   Academic Year: 2026-2027 (ACTIVE / CURRENT)
EXTENSION OF APPROVAL (EOA) & NEW COURSE INCLUSION ORDER
Course: Artificial Intelligence and Data Science | Sanctioned Intake: 120 Seats
Affiliating Body: Anna University | Academic Year: 2026-2027`,

  "2_AICTE_Course_Approval_Letter_MISMATCHED.pdf": `AICTE NEW DELHI - [DEFICIENT / MISMATCHED DOCUMENT]
F.No. Southern/1-2718-TN/2023-2024/EOA-ARCHIVED
Date: 10-May-2023   |   Academic Year: 2023-2024 (EXPIRED / OUTDATED)
STATUTORY DEFICIENCY AUDIT SUMMARY (AI OCR DETECTION):
1. ACADEMIC YEAR MISMATCH: This order is for 2023-2024; portal application is for 2026-2027.
2. INTAKE CAPACITY MISMATCH: Order approves 60 Seats; portal application requests 120 Seats.
3. EXPIRED TENURE: Annual validity expired on 30-April-2024.
OUTDATED PROGRAM RECORD:
Program: Engineering & Technology   |   Level: Under Graduate (B.Tech)
Course: Artificial Intelligence and Data Science
Approved Intake: 60 Seats Only (DEFICIENCY: Does NOT match 120 Seats applied for)
AI EVALUATION VERDICT: MISMATCH DETECTED - SUBMISSION BLOCKED
The automated AI pre-scrutiny engine has flagged this document under APH Clause 3.2.
Institution must resubmit the authenticated 2026-2027 EOA order approving 120 intake.
Status: DEFICIENT COPY   |   Action Required: Click Resubmit & Attach 2026-2027 Order`,

  "3_Infrastructure_and_Land_Deed_Certificate.pdf": `INFRASTRUCTURE, LAND TITLE & SAFETY COMPLIANCE DOSSIER
Institution: Sri Krishna College of Engineering and Technology (Code: 2718)
Survey Numbers: 142/1, 142/2, 143/1A, Kuniamuthur Village, Coimbatore District
LAND OWNERSHIP & LEASE VERIFICATION (APH SECTION 4.1):
- Total Contiguous Land Area: 25.40 Acres (AICTE Rural Norm: Minimum 7.50 Acres - EXCEEDS NORM)
- Registered Land Deed Number: Registered Deed No. 4821 at Sub-Registrar Office, Kuniamuthur
- Tenure: Clear Ownership / Registered 30-Year Agreement in perpetuity for educational purpose
BUILT-UP CARPET AREA & ACCESSIBILITY CERTIFICATION:
- Total Built-up Area: 42,500 sq.m. (Instructional: 21,500 sq.m., Admin: 7,200 sq.m., Amenities: 13,800 sq.m.)
- Barrier-Free Campus: Certified with ramps, dedicated braille-enabled lifts, and disabled amenities
- Structural Stability Certificate: Issued by Empanelled Structural Engineer Reg. No. TN-SE-4491
- Fire Safety NOC: Issued by Tamil Nadu Fire and Rescue Services (NOC #TN-FRS-2026-981)
Attestation: Chief Executive Officer & Tahsildar, Coimbatore South Division`,

  "4_Faculty_Cadre_and_FSR_Compliance.pdf": `FACULTY CADRE RATIO & AADHAAR SEEDING VERIFICATION
Department: Artificial Intelligence and Data Science (AIDS) & Computer Science
Academic Session: 2026-2027   |   AICTE Portal ID: SKCET01
CADRE RATIO & FACULTY-STUDENT RATIO (FSR) AUDIT:
- AICTE Prescribed UG FSR Norm: 1:20   |   Institution Achieved FSR: 1:18.4 (COMPLIANT)
- Cadre Distribution for AIDS: 1 Professor : 2 Associate Professors : 6 Assistant Professors
- Total Department Faculty: 9 Full-time Regular Faculty Members
AADHAAR & PAN DATABASE SEEDING VERIFICATION:
1. Dr. S. Radhika, Ph.D. - Professor & HOD (Aadhaar Verified: XXXX-XXXX-4812, AICTE ID: FAC-AI-01)
2. Dr. M. Karthik, Ph.D. - Associate Professor (Aadhaar Verified: XXXX-XXXX-9104, AICTE ID: FAC-AI-02)
3. Dr. P. Anitha, Ph.D. - Associate Professor (Aadhaar Verified: XXXX-XXXX-3321, AICTE ID: FAC-AI-03)
4. 6 Assistant Professors with M.E/M.Tech First Class and 100% Aadhaar-PAN linkage verified.
PRINCIPAL / HEAD OF INSTITUTION QUALIFICATION:
Dr. J. Janet, M.E., Ph.D. | 22 Years Academic Experience | 45 Research Papers in SCI Journals
Certification: 100% compliant with Chapter VII of AICTE APH Regulations.`
};

// 2. Active Enclosures & Extracted Content Cache
window.uploadedDocuments = {
  affiliation: "1_Affiliation_Certificate_Anna_University.pdf",
  approval: "2_AICTE_Course_Approval_Letter_MISMATCHED.pdf", // Initially mismatched to demonstrate AI pre-scrutiny
  infra: "3_Infrastructure_and_Land_Deed_Certificate.pdf",
  faculty: "4_Faculty_Cadre_and_FSR_Compliance.pdf"
};
window.uploadedCourseApprovalFileName = window.uploadedDocuments.approval;
window.currentResubmitDocType = "approval";
window.resubmitSelectedFileName = "";
window.extractedDocumentContents = {};

// Helper: Extract human-readable text from uncompressed PDF streams or plain text
window.extractTextFromPDF = function(rawContent, fileName) {
  if (!rawContent) return "";
  let extracted = "";
  // Search for stream blocks or text operators in PDF: (text) Tj
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match;
  while ((match = tjRegex.exec(rawContent)) !== null) {
    extracted += match[1] + "\n";
  }
  // Also match TJ arrays: [(text) 20 (more)] TJ
  const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(rawContent)) !== null) {
    const inner = match[1];
    const innerMatches = inner.match(/\(([^)]+)\)/g);
    if (innerMatches) {
      extracted += innerMatches.map(s => s.slice(1, -1)).join(" ") + "\n";
    }
  }

  if (extracted.trim().length > 40) {
    return extracted.trim();
  }

  // If rawContent contains direct readable statutory tokens:
  if (rawContent.includes("AICTE") || rawContent.includes("LAND") || rawContent.includes("FACULTY") || rawContent.includes("AFFILIATION")) {
    return rawContent;
  }

  // Check known corpus by fileName
  const baseName = fileName ? fileName.split(/[\/\\]/).pop() : "";
  if (window.knownDocumentTextCorpus[baseName]) {
    return window.knownDocumentTextCorpus[baseName];
  }

  return rawContent;
};

// Content Classifier: analyzes inner text content
window.classifyDocumentContent = function(docText) {
  const text = (docText || "").toUpperCase();

  const isAffiliation = text.includes("ANNA UNIVERSITY") || text.includes("CERTIFICATE OF AFFILIATION") || text.includes("AU/AFFILIATION") || text.includes("PROVISIONAL AND PERMANENT AFFILIATION");
  const isApproval = (text.includes("ALL INDIA COUNCIL FOR TECHNICAL EDUCATION") || text.includes("EXTENSION OF APPROVAL") || text.includes("EOA-NEW-COURSE") || text.includes("AICTE NEW DELHI")) && (text.includes("SANCTIONED INTAKE") || text.includes("APPROVED COURSE") || text.includes("APPROVED INTAKE"));
  const isInfra = text.includes("INFRASTRUCTURE, LAND TITLE") || text.includes("REGISTERED LAND DEED") || text.includes("CONTIGUOUS LAND AREA") || text.includes("FIRE SAFETY NOC") || text.includes("SURVEY NUMBERS") || text.includes("BUILT-UP CARPET AREA");
  const isFaculty = text.includes("FACULTY CADRE RATIO") || text.includes("FACULTY-STUDENT RATIO") || text.includes("FSR") || text.includes("AADHAAR SEEDING") || text.includes("ASSOCIATE PROFESSORS") || text.includes("ASSISTANT PROFESSORS");

  if (isAffiliation && !isApproval && !isInfra && !isFaculty) {
    return { type: "AFFILIATION_ORDER", title: "University Affiliation Order (Anna University)" };
  }
  if (isApproval && !isInfra && !isFaculty) {
    return { type: "AICTE_APPROVAL_LETTER", title: "AICTE Extension of Approval (EOA) Order" };
  }
  if (isInfra && !isFaculty && !isAffiliation) {
    return { type: "INFRASTRUCTURE_DOSSIER", title: "Infrastructure & Land Title Dossier" };
  }
  if (isFaculty && !isInfra && !isApproval) {
    return { type: "FACULTY_CADRE_DOSSIER", title: "Faculty Cadre & FSR Compliance Report" };
  }

  return { type: "UNKNOWN_OR_MIXED", title: "Unclassified Document / Custom Dossier" };
};

window.getDocSlotTitle = function(docType) {
  switch (docType) {
    case "affiliation": return "Anna University Affiliation Certificate";
    case "approval": return "AICTE Course Approval Letter";
    case "infra": return "Infrastructure & Land Deed Certificate";
    case "faculty": return "Faculty Details (Cadre & FSR Compliance)";
    default: return "Statutory Document";
  }
};

window.getDocSlotRequirement = function(docType) {
  switch (docType) {
    case "affiliation": return "Anna University Affiliation Order for AY 2026-2027 approving AI & Data Science.";
    case "approval": return "AICTE Extension of Approval (EOA) for AY 2026-2027 with 120 intake.";
    case "infra": return "Registered Land Deed (Minimum 7.50 acres) and Fire Safety NOC.";
    case "faculty": return "Faculty Cadre (1:2:6 ratio), Student-Faculty Ratio (FSR 1:20 norm), and Aadhaar-seeded faculty roster.";
    default: return "Statutory Document satisfying AICTE APH 2024-2027 norms.";
  }
};

window.getDocDefaultCompliantPath = function(docType) {
  switch (docType) {
    case "affiliation": return "assets/documents/1_Affiliation_Certificate_Anna_University.pdf";
    case "approval": return "assets/documents/2_AICTE_Course_Approval_Letter_VERIFIED.pdf";
    case "infra": return "assets/documents/3_Infrastructure_and_Land_Deed_Certificate.pdf";
    case "faculty": return "assets/documents/4_Faculty_Cadre_and_FSR_Compliance.pdf";
    default: return "";
  }
};

window.getDocDefaultWrongPath = function(docType) {
  switch (docType) {
    case "affiliation": return "assets/documents/2_AICTE_Course_Approval_Letter_MISMATCHED.pdf";
    case "approval": return "assets/documents/1_Affiliation_Certificate_Anna_University.pdf";
    case "infra": return "assets/documents/4_Faculty_Cadre_and_FSR_Compliance.pdf";
    case "faculty": return "assets/documents/3_Infrastructure_and_Land_Deed_Certificate.pdf";
    default: return "";
  }
};

// 3. Deep AI Inspection by Actual Document Content
window.inspectDocument = function(docType, fileName) {
  const activeFileName = fileName || window.uploadedDocuments[docType] || "";
  if (!activeFileName) {
    return {
      isValid: false,
      docType: docType,
      docTitle: window.getDocSlotTitle(docType),
      reason: `No document uploaded in ${window.getDocSlotTitle(docType)} slot.`,
      shortCode: "MISSING",
      badgeText: "Missing Enclosure",
      comment: `Missing Document: Please attach the required ${window.getDocSlotTitle(docType)}.`,
      detectedCategoryTitle: "No File Attached",
      extractedContentText: "(No document content uploaded)",
      filePath: window.getDocDefaultCompliantPath(docType),
      fileLabel: "(No File Attached)"
    };
  }

  // Retrieve actual extracted text content
  const baseName = activeFileName.split(/[\/\\]/).pop();
  let content = window.extractedDocumentContents[docType];
  if (!content && window.knownDocumentTextCorpus[baseName]) {
    content = window.knownDocumentTextCorpus[baseName];
  }
  if (!content) {
    // If not in cache, fallback to extractTextFromPDF
    content = window.extractTextFromPDF("", baseName);
  }

  const contentClassification = window.classifyDocumentContent(content);
  const detectedCategory = contentClassification.type;
  const detectedCategoryTitle = contentClassification.title;
  const textUpper = (content || "").toUpperCase();

  // -------------------------------------------------------------
  // SLOT 1: AFFILIATION CERTIFICATE SLOT
  // -------------------------------------------------------------
  if (docType === "affiliation") {
    if (detectedCategory === "INFRASTRUCTURE_DOSSIER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains Land Title Deeds and Carpet Area metrics (Infrastructure Dossier). It does not contain an Anna University Affiliation Order.",
        shortCode: "WRONG_TYPE_INFRA",
        badgeText: "Mismatch: Infrastructure Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: Land Deed / Infrastructure Details were uploaded into the Affiliation Certificate slot. AICTE pre-scrutiny requires an authenticated University Affiliation Order (Anna University). Please resubmit.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/3_Infrastructure_and_Land_Deed_Certificate.pdf",
        fileLabel: "(Uploaded: Infrastructure Details)"
      };
    }
    if (detectedCategory === "FACULTY_CADRE_DOSSIER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains Faculty Cadre and Aadhaar seeding rosters, NOT an Affiliation Certificate.",
        shortCode: "WRONG_TYPE_FACULTY",
        badgeText: "Mismatch: Faculty Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: Faculty Details were detected in the Affiliation Certificate slot. AICTE requires a University Affiliation Order. Please resubmit.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/4_Faculty_Cadre_and_FSR_Compliance.pdf",
        fileLabel: "(Uploaded: Faculty Details)"
      };
    }
    if (detectedCategory === "AICTE_APPROVAL_LETTER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains an AICTE Extension of Approval (EOA) order, NOT an Anna University Affiliation Order.",
        shortCode: "WRONG_TYPE_APPROVAL",
        badgeText: "Mismatch: Course Approval Uploaded",
        comment: "Document Mismatch Identified by AI OCR: An AICTE Course Approval Letter was uploaded into the Affiliation Certificate slot. Please resubmit the Anna University Affiliation Order.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/2_AICTE_Course_Approval_Letter_VERIFIED.pdf",
        fileLabel: "(Uploaded: Course Approval Letter)"
      };
    }
    if (detectedCategory === "AFFILIATION_ORDER" || textUpper.includes("ANNA UNIVERSITY")) {
      return {
        isValid: true, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "AI Content Analysis Verified: Document text confirms Anna University Affiliation for AY 2026-2027 under AU/Affiliation/2026-27/SKCET-2718.",
        shortCode: "VERIFIED",
        badgeText: "Verified",
        comment: "Affiliation Certificate verified under Anna University statutory norms.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/1_Affiliation_Certificate_Anna_University.pdf",
        fileLabel: "(Verified Copy)"
      };
    }
  }

  // -------------------------------------------------------------
  // SLOT 2: COURSE APPROVAL LETTER SLOT
  // -------------------------------------------------------------
  if (docType === "approval") {
    if (detectedCategory === "AFFILIATION_ORDER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text is an Anna University Affiliation Certificate, NOT an AICTE Approval Letter.",
        shortCode: "WRONG_TYPE_AFFILIATION",
        badgeText: "Mismatch: Affiliation Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: You uploaded an Anna University Affiliation Certificate in the Course Approval Letter slot. AICTE scrutiny requires an authenticated Extension of Approval (EOA) order. Please click Resubmit to upload the correct AICTE approval letter.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/1_Affiliation_Certificate_Anna_University.pdf",
        fileLabel: "(Uploaded: Anna University Affiliation Certificate)"
      };
    }
    if (detectedCategory === "INFRASTRUCTURE_DOSSIER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains Land Title Deed #4821 and campus built-up metrics, NOT an AICTE Approval Letter.",
        shortCode: "WRONG_TYPE_INFRA",
        badgeText: "Mismatch: Infrastructure Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: Infrastructure details were uploaded in the Course Approval Letter slot. Please click Resubmit to upload the correct AICTE approval letter.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/3_Infrastructure_and_Land_Deed_Certificate.pdf",
        fileLabel: "(Uploaded: Infrastructure Details Dossier)"
      };
    }
    if (detectedCategory === "FACULTY_CADRE_DOSSIER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains Faculty Cadre and FSR ratios, NOT an AICTE Approval Letter.",
        shortCode: "WRONG_TYPE_FACULTY",
        badgeText: "Mismatch: Faculty Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: Faculty cadre details were uploaded in the Course Approval Letter slot. Please click Resubmit to upload the correct AICTE approval letter.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/4_Faculty_Cadre_and_FSR_Compliance.pdf",
        fileLabel: "(Uploaded: Faculty Cadre Compliance)"
      };
    }
    // Check internal parameters inside Approval text:
    if (textUpper.includes("2023-2024") || textUpper.includes("EXPIRED") || textUpper.includes("ARCHIVED") || textUpper.includes("60 SEATS") || textUpper.includes("APPROVED INTAKE: 60")) {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Data Mismatch! Document text specifies Academic Year 2023–2024 (Expired) and 60 Intake. Application requires Academic Year 2026–2027 with 120 Intake.",
        shortCode: "DATA_MISMATCH",
        badgeText: "Mismatch Detected",
        comment: "Document is mismatching. The uploaded Course Approval Letter (AY 2023–2024 / 60 intake) does not match the application academic year (2026–2027) or intake quota (120 intake). Please click Resubmit to upload the matching 2026–2027 document.",
        detectedCategoryTitle: "AICTE Approval Letter (Outdated AY 2023-24 / 60 Intake)",
        extractedContentText: content,
        filePath: "assets/documents/2_AICTE_Course_Approval_Letter_MISMATCHED.pdf",
        fileLabel: "(Uploaded: Outdated 2023-24 Copy)"
      };
    }
    if (detectedCategory === "AICTE_APPROVAL_LETTER" || (textUpper.includes("2026-2027") && textUpper.includes("120 SEATS"))) {
      return {
        isValid: true, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "AI Content Analysis Verified: Document text confirms AICTE EOA for AY 2026–2027, 120 Sanctioned Intake, Artificial Intelligence and Data Science.",
        shortCode: "VERIFIED",
        badgeText: "Verified",
        comment: "Course Approval Letter verified successfully! All statutory clauses, intake numbers (120), and university affiliations match AICTE APH 2024–2027 norms.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/2_AICTE_Course_Approval_Letter_VERIFIED.pdf",
        fileLabel: "(Rectified: 2026-27 Authenticated Copy)"
      };
    }
  }

  // -------------------------------------------------------------
  // SLOT 3: INFRASTRUCTURE DETAILS SLOT
  // -------------------------------------------------------------
  if (docType === "infra") {
    if (detectedCategory === "FACULTY_CADRE_DOSSIER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains Faculty Cadre details, NOT a Land Title Deed or Safety NOC.",
        shortCode: "WRONG_TYPE_FACULTY",
        badgeText: "Mismatch: Faculty Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: Faculty Cadre details were uploaded into the Infrastructure Details slot. AICTE requires a registered Land Deed (minimum 7.5 contiguous acres) and Infrastructure Safety NOCs. Please resubmit.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/4_Faculty_Cadre_and_FSR_Compliance.pdf",
        fileLabel: "(Uploaded: Faculty Details)"
      };
    }
    if (detectedCategory === "AICTE_APPROVAL_LETTER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains an AICTE Approval Letter, NOT an Infrastructure Dossier.",
        shortCode: "WRONG_TYPE_APPROVAL",
        badgeText: "Mismatch: Course Approval Uploaded",
        comment: "Document Mismatch Identified by AI OCR: Course Approval Letter was uploaded into the Infrastructure slot. Please resubmit the registered Land Deed and Safety Certifications.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/2_AICTE_Course_Approval_Letter_VERIFIED.pdf",
        fileLabel: "(Uploaded: Course Approval Letter)"
      };
    }
    if (detectedCategory === "AFFILIATION_ORDER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains an Affiliation Certificate, NOT an Infrastructure Dossier.",
        shortCode: "WRONG_TYPE_AFFILIATION",
        badgeText: "Mismatch: Affiliation Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: University Affiliation Certificate was detected in the Infrastructure slot. Please resubmit the Land Deed / Infrastructure Certificate.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/1_Affiliation_Certificate_Anna_University.pdf",
        fileLabel: "(Uploaded: Affiliation Certificate)"
      };
    }
    if (detectedCategory === "INFRASTRUCTURE_DOSSIER" || textUpper.includes("CONTIGUOUS LAND") || textUpper.includes("REGISTERED LAND DEED")) {
      return {
        isValid: true, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "AI Content Analysis Verified: Document text confirms Registered Deed No. 4821 (25.40 Contiguous Acres > 7.50 Acres norm) and Fire Safety NOC.",
        shortCode: "VERIFIED",
        badgeText: "Verified",
        comment: "Infrastructure and Land Deed verified under APH norms.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/3_Infrastructure_and_Land_Deed_Certificate.pdf",
        fileLabel: "(Verified Copy)"
      };
    }
  }

  // -------------------------------------------------------------
  // SLOT 4: FACULTY DETAILS SLOT (EXACT USER TEST CASE)
  // -------------------------------------------------------------
  if (docType === "faculty") {
    // If the internal content belongs to Infrastructure / Land Deed:
    if (detectedCategory === "INFRASTRUCTURE_DOSSIER" || textUpper.includes("CONTIGUOUS LAND AREA") || textUpper.includes("REGISTERED LAND DEED") || textUpper.includes("BUILT-UP CARPET AREA")) {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch inside document! The text inside this file contains Registered Land Deed #4821 (25.40 Acres) and Campus Carpet Area data (Infrastructure Dossier). It does NOT contain Faculty Cadre, FSR (1:20), or Aadhaar-seeded faculty rosters required by AICTE APH regulations for Faculty Details.",
        shortCode: "WRONG_TYPE_INFRA",
        badgeText: "Mismatch: Infrastructure Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR Text Inspection: The text inside the file uploaded in the Faculty Details slot contains Land Survey Numbers and Deed No. 4821 (Infrastructure Dossier). AICTE APH Chapter VII mandates an authenticated Faculty Cadre and Student-Faculty Ratio (FSR 1:20) compliance report with Ph.D. faculty cadres. Please resubmit the correct Faculty Details document.",
        detectedCategoryTitle: "Infrastructure & Land Title Dossier",
        extractedContentText: content,
        filePath: "assets/documents/3_Infrastructure_and_Land_Deed_Certificate.pdf",
        fileLabel: "(Uploaded: Infrastructure / Land Deed)"
      };
    }
    if (detectedCategory === "AICTE_APPROVAL_LETTER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains an AICTE Course Approval Letter, NOT Faculty Details.",
        shortCode: "WRONG_TYPE_APPROVAL",
        badgeText: "Mismatch: Course Approval Uploaded",
        comment: "Document Mismatch Identified by AI OCR: Course Approval Letter was uploaded into the Faculty Details slot. Please resubmit the authenticated Faculty Cadre and FSR Compliance document.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/2_AICTE_Course_Approval_Letter_VERIFIED.pdf",
        fileLabel: "(Uploaded: Course Approval Letter)"
      };
    }
    if (detectedCategory === "AFFILIATION_ORDER") {
      return {
        isValid: false, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "Internal Content Mismatch! Document text contains an Affiliation Certificate, NOT Faculty Details.",
        shortCode: "WRONG_TYPE_AFFILIATION",
        badgeText: "Mismatch: Affiliation Doc Uploaded",
        comment: "Document Mismatch Identified by AI OCR: University Affiliation Certificate was uploaded into the Faculty Details slot. Please resubmit the Faculty Details document.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/1_Affiliation_Certificate_Anna_University.pdf",
        fileLabel: "(Uploaded: Affiliation Certificate)"
      };
    }
    if (detectedCategory === "FACULTY_CADRE_DOSSIER" || textUpper.includes("FACULTY CADRE") || textUpper.includes("STUDENT-FACULTY RATIO")) {
      return {
        isValid: true, docType, docTitle: window.getDocSlotTitle(docType),
        reason: "AI Content Analysis Verified: Document text confirms Achieved FSR of 1:18.4 (Complies with 1:20 UG norm), 1:2:6 Cadre ratio, and 100% Aadhaar-PAN verified faculty roster.",
        shortCode: "VERIFIED",
        badgeText: "Verified",
        comment: "Faculty Cadre and FSR verified under AICTE APH norms.",
        detectedCategoryTitle, extractedContentText: content,
        filePath: "assets/documents/4_Faculty_Cadre_and_FSR_Compliance.pdf",
        fileLabel: "(Verified Copy)"
      };
    }
  }

  // Fallback if unrecognized content:
  return {
    isValid: false,
    docType,
    docTitle: window.getDocSlotTitle(docType),
    reason: `Statutory parameters not found inside document text. AI OCR could not verify compliance for ${window.getDocSlotTitle(docType)}.`,
    shortCode: "OCR_PARSE_FAILED",
    badgeText: "Mismatch Detected",
    comment: `Document is mismatching. AI OCR could not verify statutory compliance in the uploaded file. Please click Resubmit to upload the authenticated ${window.getDocSlotTitle(docType)}.`,
    detectedCategoryTitle,
    extractedContentText: content || "(Unreadable file stream)",
    filePath: window.getDocDefaultCompliantPath(docType),
    fileLabel: `(Uploaded: ${activeFileName})`
  };
};

window.inspectCourseApprovalDocument = function(fileName) {
  return window.inspectDocument("approval", fileName);
};

window.evaluateAllApplicationDocuments = function() {
  const docs = window.uploadedDocuments;
  const results = {
    affiliation: window.inspectDocument("affiliation", docs.affiliation),
    approval: window.inspectDocument("approval", docs.approval),
    infra: window.inspectDocument("infra", docs.infra),
    faculty: window.inspectDocument("faculty", docs.faculty)
  };

  const docKeys = ["affiliation", "approval", "infra", "faculty"];
  const deficientDocs = docKeys.map(k => results[k]).filter(r => !r.isValid);
  const passedCount = 4 - deficientDocs.length;
  const allValid = deficientDocs.length === 0;

  return {
    allValid,
    passedCount,
    totalCount: 4,
    results,
    deficientDocs
  };
};

window.renderAllDocumentRows = function(evalResult) {
  const mapping = [
    { key: "affiliation", rowId: "rowDocAffiliation", linkId: "linkDocAffiliation", suffixId: "labelDocAffiliationSuffix", badgeId: "badgeDocAffiliation", title: "Affiliation Certificate" },
    { key: "approval", rowId: "rowDocApproval", linkId: "linkDocApproval", suffixId: "labelDocApprovalSuffix", badgeId: "badgeDocApproval", title: "Course Approval Letter" },
    { key: "infra", rowId: "rowDocInfra", linkId: "linkDocInfra", suffixId: "labelDocInfraSuffix", badgeId: "badgeDocInfra", title: "Infrastructure Details" },
    { key: "faculty", rowId: "rowDocFaculty", linkId: "linkDocFaculty", suffixId: "labelDocFacultySuffix", badgeId: "badgeDocFaculty", title: "Faculty Details" }
  ];

  mapping.forEach(m => {
    const res = evalResult.results[m.key];
    const badge = document.getElementById(m.badgeId);
    const link = document.getElementById(m.linkId);

    if (badge) {
      if (res.isValid) {
        badge.className = "validation-status-badge badge-verified";
        badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Verified</span>';
      } else {
        badge.className = "validation-status-badge badge-warning";
        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #dc2626;"></i> <span style="color: #dc2626; font-weight: 700;">${res.badgeText}</span>`;
      }
    }

    if (link) {
      link.href = res.filePath;
      link.title = `Click to view document: ${res.fileName || res.filePath}`;
      const suffixHtml = res.isValid
        ? `<span id="${m.suffixId}" style="font-size: 11.5px; color: #16a34a; font-weight: 700; margin-left: 6px;">(Verified Copy)</span>`
        : `<span id="${m.suffixId}" style="font-size: 11.5px; color: #dc2626; font-weight: 700; margin-left: 6px;">${res.fileLabel}</span>`;
      link.innerHTML = `${m.title} ${suffixHtml} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 11px; margin-left: 4px; color: #2563eb;"></i>`;
    }
  });
};

// Document Upload Handler in Step 4:
// Crucial: Simply shows file attached state — DOES NOT premature-judge or flag wrong document!
// AI Validation only inspects and checks inside the file in Step 5.
window.handleFileSelected = function(input, displayId, docType = "approval") {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileName = file.name;
    const display = document.getElementById(displayId);
    
    window.uploadedDocuments[docType] = fileName;
    if (docType === "approval") {
      window.uploadedCourseApprovalFileName = fileName;
    }

    // Read the actual text content of the file into memory for AI scrutiny in Step 5
    const reader = new FileReader();
    reader.onload = function(evt) {
      const rawText = evt.target.result;
      window.extractedDocumentContents[docType] = window.extractTextFromPDF(rawText, fileName);
    };
    reader.readAsText(file);

    // Neutral file display in Step 4 — NO PREMATURE JUDGMENT OR REJECTION!
    if (display) {
      display.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> ${fileName} <span style="font-size: 11px; color: #64748b; font-weight: 500;">(Attached &bull; Ready for AI Validation)</span>`;
      display.style.color = "#1e293b";
    }
  }
};

window.openAIOcrViewer = function(docType) {
  window.currentInspectedDocType = docType;
  const fileName = window.uploadedDocuments[docType];
  const evalResult = window.evaluateAllApplicationDocuments();
  const res = evalResult.results[docType];

  const slotTitleEl = document.getElementById("ocrModalSlotTitle");
  const fileNameEl = document.getElementById("ocrModalFileName");
  const catEl = document.getElementById("ocrModalDetectedCategory");
  const reqEl = document.getElementById("ocrModalSlotRequirement");
  const badgeEl = document.getElementById("ocrModalVerdictBadge");
  const textEl = document.getElementById("ocrModalExtractedText");
  const analysisBox = document.getElementById("ocrModalAnalysisBox");
  const analysisText = document.getElementById("ocrModalAnalysisText");

  if (slotTitleEl) slotTitleEl.innerText = window.getDocSlotTitle(docType);
  if (fileNameEl) fileNameEl.innerText = fileName || "(No file attached)";
  if (catEl) catEl.innerText = res.detectedCategoryTitle || "Unclassified Document";
  if (reqEl) reqEl.innerText = window.getDocSlotRequirement(docType);

  if (badgeEl) {
    if (res.isValid) {
      badgeEl.innerHTML = '<span class="status-badge badge-success" style="background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11.5px;"><i class="fa-solid fa-check"></i> Compliant / Verified</span>';
    } else {
      badgeEl.innerHTML = `<span class="status-badge badge-danger" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11.5px;"><i class="fa-solid fa-triangle-exclamation"></i> ${res.badgeText}</span>`;
    }
  }

  if (textEl) {
    textEl.innerText = res.extractedContentText || "(No OCR stream extracted)";
  }

  if (analysisBox && analysisText) {
    if (res.isValid) {
      analysisBox.style.background = "#f0fdf4";
      analysisBox.style.borderColor = "#bbf7d0";
      analysisBox.style.color = "#15803d";
      analysisText.innerHTML = `<strong>Pass:</strong> ${res.reason}`;
    } else {
      analysisBox.style.background = "#fef2f2";
      analysisBox.style.borderColor = "#fecaca";
      analysisBox.style.color = "#991b1b";
      analysisText.innerHTML = `<strong>Mismatch Detected:</strong> ${res.reason}`;
    }
  }

  openModal("modalInspectOCR");
};

window.handleFinalSubmitToAI = function() {
  const course = document.getElementById("wizNewCourse") ? document.getElementById("wizNewCourse").value : "Artificial Intelligence and Data Science";
  const category = document.getElementById("wizCategory") ? document.getElementById("wizCategory").value : "B.E / B.Tech";
  const years = document.getElementById("wizNumberYears") ? document.getElementById("wizNumberYears").value : "4 Years";

  const newApp = window.AICTEWorkflow.fileApplication({
    title: `Addition of New Course: ${course} (${category})`,
    workflowType: "Scrutiny + EVC",
    summary: `5-Step online application submitted by Sri Krishna College of Engineering and Technology for ${course} (${years}, ${category}). All 4 statutory enclosures uploaded for AI validation and Scrutiny.`
  });

  switchWizardStep(1);

  aiValidationState.hasScanned = false;
  switchWorkspaceTab("validation");

  renderApplicationsList();
  renderDashboardStats();
};

window.submitToAICTEOfficials = function() {
  const evalResult = window.evaluateAllApplicationDocuments();
  if (!evalResult.allValid) {
    const deficientNames = evalResult.deficientDocs.map(d => d.docTitle).join(", ");
    alert(`Submission Blocked: AI Pre-Scrutiny detected mismatches in: ${deficientNames}.\n\nPlease click 'Resubmit' to upload the matching statutory document(s) before submitting to AICTE officials.`);
    return;
  }

  // Update pipeline state to Stage 2 (Official 1: RO-SRO-01)
  window.aicteApprovalPipeline.currentQueueStage = 2;
  window.aicteApprovalPipeline.status = "UNDER_REVIEW";
  window.aicteApprovalPipeline.isRejected = false;
  window.aicteApprovalPipeline.rejectedAtStage = null;
  window.aicteApprovalPipeline.rejectedByOfficer = null;

  // Show brief confirmation toast
  const toast = document.createElement("div");
  toast.className = "aicte-custom-toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Application forwarded to Official 1 (Dr. K. Senthil Kumar, Scrutiny Officer)!`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3500);

  alert("✓ Application Submitted to AICTE Officials!\n\nAll 4 statutory enclosures passed AI pre-validation.\n\nYour application has been submitted to Official 1: Dr. K. Senthil Kumar, Ph.D. (Senior Regional Scrutiny Officer, AICTE SRO).\n\nYou can track real-time authority movement in the AI Document Tracker tab.");

  // Switch to AI Document Tracker tab
  switchWorkspaceTab("upload");
  renderApplicationTrackerStages();
  if (typeof renderStageSummaryReportTimeline === "function") renderStageSummaryReportTimeline();

  // Increment notification badge
  const badge = document.getElementById("headerNotifBadge");
  if (badge) badge.innerText = "3";
};

window.toggleAIValidationAuditDetails = function() {
  const container = document.getElementById("containerAIAuditDetails");
  const txt = document.getElementById("txtToggleAIAudit");
  const icon = document.getElementById("iconToggleAIAudit");
  if (!container) return;

  if (container.style.display === "none" || !container.style.display) {
    container.style.display = "block";
    if (txt) txt.innerText = "Hide Full APH Parameter Compliance Report";
    if (icon) icon.className = "fa-solid fa-chevron-up";
  } else {
    container.style.display = "none";
    if (txt) txt.innerText = "View Full APH Parameter Compliance Report";
    if (icon) icon.className = "fa-solid fa-chevron-down";
  }
};

window.toggleExistingAppsPipeline = function() {
  const container = document.getElementById("containerExistingApplications");
  const txt = document.getElementById("txtToggleExistingApps");
  const icon = document.getElementById("iconToggleExistingApps");
  if (!container) return;

  if (container.style.display === "none" || !container.style.display) {
    container.style.display = "block";
    if (txt) txt.innerText = "Hide Existing Applications & Pipeline";
    if (icon) icon.className = "fa-solid fa-chevron-up";
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    container.style.display = "none";
    if (txt) txt.innerText = "View Existing Applications & Scrutiny Pipeline";
    if (icon) icon.className = "fa-solid fa-chevron-down";
  }
};


/* ==========================================================================
   AI VALIDATION BACKEND ENGINE & LIFECYCLE (ALL 4 STATUTORY DOCUMENTS)
   ========================================================================== */
let aiValidationState = {
  hasScanned: false,
  isRectified: false
};
let valScanTimer = null;
window.hasAttachedCompliantDocs = false;

window.runLiveAIValidationScan = function(forceReRun = false) {
  if (valScanTimer) {
    clearInterval(valScanTimer);
    valScanTimer = null;
  }

  const evalResult = window.evaluateAllApplicationDocuments();

  if (aiValidationState.hasScanned && !forceReRun) {
    window.renderAllDocumentRows(evalResult);
    if (evalResult.allValid) {
      resolveDocumentVerificationSuccess(evalResult);
    } else {
      showDeficiencyState(evalResult);
    }
    return;
  }

  const progressBox = document.getElementById("validationProgressBox");
  const completeBanner = document.getElementById("validationScanCompletedBanner");
  const resultsCard = document.getElementById("validationResultsCard");
  const commentsBox = document.getElementById("validationCommentsBox");
  const btnSubmit = document.getElementById("btnSubmitAICTEOfficials");
  const spinnerTitle = document.getElementById("valSpinnerTitle");
  const spinnerSub = document.getElementById("valSpinnerSub");
  const progressBar = document.getElementById("valMiniProgressBar");

  // Initial scanning state: show progress, hide results & comments, strictly lock submit!
  if (progressBox) progressBox.style.display = "block";
  if (completeBanner) completeBanner.style.display = "none";
  if (resultsCard) resultsCard.style.display = "none";
  if (commentsBox) commentsBox.style.display = "none";
  if (progressBar) progressBar.style.width = "15%";
  if (spinnerTitle) spinnerTitle.innerText = "Initializing AI Validation Engine...";
  if (spinnerSub) spinnerSub.innerText = "Connecting to AICTE Document Verification OCR pipeline...";

  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("disabled");
    btnSubmit.classList.remove("unlocked");
    btnSubmit.style.background = "#cbd5e1";
    btnSubmit.style.cursor = "not-allowed";
    btnSubmit.title = "Submission Locked: Verification in progress...";
    const txt = document.getElementById("textSubmitAICTE");
    const icon = document.getElementById("iconSubmitLock");
    if (txt) txt.innerText = "Submit to AICTE Officials (Locked)";
    if (icon) icon.className = "fa-solid fa-lock";
  }

  // Multi-step realistic AI content evaluation pipeline
  const stages = [
    { pct: 20, title: "Reading Document OCR Streams...", sub: "Extracting raw text tokens from all 4 statutory attachments..." },
    { pct: 45, title: "Analyzing Internal Document Contents...", sub: "Inspecting Anna University seal & Registered Land Deed #4821 clauses..." },
    { pct: 70, title: "Auditing Faculty Cadre & FSR...", sub: "Verifying Cadre distribution (1:2:6) and FSR 1:20 against Chapter VII..." },
    { pct: 90, title: "Verifying Course Approval Letter...", sub: "Checking Academic Year (2026–27) & Sanctioned Intake (120 Seats)..." },
    { pct: 100, title: "AI Content Scrutiny Complete!", sub: "Detailed text inspection completed under AICTE APH 2024–2027 norms." }
  ];

  let stepIdx = 0;
  valScanTimer = setInterval(() => {
    if (stepIdx < stages.length) {
      const s = stages[stepIdx];
      if (spinnerTitle) spinnerTitle.innerText = s.title;
      if (spinnerSub) spinnerSub.innerText = s.sub;
      if (progressBar) progressBar.style.width = s.pct + "%";
      stepIdx++;
    } else {
      clearInterval(valScanTimer);
      valScanTimer = null;
      aiValidationState.hasScanned = true;

      if (progressBox) progressBox.style.display = "none";
      if (completeBanner) completeBanner.style.display = "flex";
      if (resultsCard) {
        resultsCard.style.display = "block";
        resultsCard.style.animation = "fadeIn 0.3s ease-out";
      }
      if (commentsBox) {
        commentsBox.style.display = "flex";
        commentsBox.style.animation = "fadeIn 0.3s ease-out";
      }

      const activeEval = window.evaluateAllApplicationDocuments();
      window.renderAllDocumentRows(activeEval);

      if (activeEval.allValid) {
        resolveDocumentVerificationSuccess(activeEval);
      } else {
        showDeficiencyState(activeEval);
      }
    }
  }, 250);
};

window.showDeficiencyState = function(evalResult) {
  aiValidationState.isRectified = false;
  const currentEval = evalResult || window.evaluateAllApplicationDocuments();

  const resultsCard = document.getElementById("validationResultsCard");
  const headerIconCircle = document.getElementById("valHeaderCircleIcon");
  const title = document.getElementById("valSuccessHeaderTitle");
  const sub = document.getElementById("valSuccessHeaderSub");

  if (resultsCard) {
    resultsCard.classList.remove("validation-card-success");
    resultsCard.classList.add("validation-card-warning");
  }
  if (headerIconCircle) {
    headerIconCircle.style.background = "#f59e0b";
    headerIconCircle.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
  }
  if (title) {
    title.innerText = "AI Pre-Scrutiny Complete – Document Mismatch Detected";
    title.style.color = "#92400e";
  }
  if (sub) {
    const names = currentEval.deficientDocs.map(d => d.docTitle).join(", ");
    sub.innerText = `${currentEval.passedCount} of ${currentEval.totalCount} documents compliant. ${names} require correction before AICTE clearance.`;
    sub.style.color = "#b45309";
  }

  // Comments Box (Exact User Specification)
  const valBox = document.getElementById("validationCommentsBox");
  const valHeading = document.getElementById("validationCommentsHeading");
  const valText = document.getElementById("validationCommentsText");
  const valIcon = document.getElementById("validationCommentsIcon");

  if (valBox && valText) {
    valBox.style.display = "flex";
    valBox.style.background = "#fef2f2";
    valBox.style.borderColor = "#fecaca";
    if (valIcon) {
      valIcon.style.background = "#dc2626";
      valIcon.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';
    }
    if (valHeading) {
      valHeading.style.color = "#991b1b";
      valHeading.innerText = "Comments:";
    }
    valText.style.color = "#b91c1c";

    let reasonsHtml = currentEval.deficientDocs.map(d => `&bull; <strong>${d.docTitle}:</strong> ${d.reason}`).join("<br>");
    valText.innerHTML = `<strong>Document is mismatching. So resubmit, resubmit the document.</strong><div style="margin-top: 6px; font-size: 12px; line-height: 1.5;">${reasonsHtml}</div>`;
  }

  // Lock Submit button
  const btnSubmit = document.getElementById("btnSubmitAICTEOfficials");
  const textSubmit = document.getElementById("textSubmitAICTE");
  const iconSubmit = document.getElementById("iconSubmitLock");
  const btnResubmit = document.getElementById("btnValidationResubmit");

  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("disabled");
    btnSubmit.classList.remove("unlocked");
    btnSubmit.title = "Submission Locked: Resolve document mismatch before submitting to AICTE Officials.";
    btnSubmit.style.background = "#cbd5e1";
    btnSubmit.style.cursor = "not-allowed";
    btnSubmit.style.pointerEvents = "none";
  }
  if (textSubmit) textSubmit.innerText = "Submit to AICTE Officials (Locked)";
  if (iconSubmit) iconSubmit.className = "fa-solid fa-lock";
  if (btnResubmit) btnResubmit.classList.add("highlight");

  const trackerCommentsBox = document.getElementById("trackerCommentsBox");
  const trackerCommentsText = document.getElementById("trackerCommentsText");
  if (trackerCommentsBox && trackerCommentsText) {
    trackerCommentsBox.style.background = "#fef2f2";
    trackerCommentsBox.style.borderColor = "#fecaca";
    trackerCommentsText.innerHTML = `<span style="color: #dc2626; font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> Deficiency identified:</span> ${currentEval.deficientDocs.map(d => d.reason).join(" ")}`;
  }
};

window.resolveDocumentVerificationSuccess = function(evalResult) {
  aiValidationState.isRectified = true;
  const currentEval = evalResult || window.evaluateAllApplicationDocuments();

  const resultsCard = document.getElementById("validationResultsCard");
  const headerIconCircle = document.getElementById("valHeaderCircleIcon");
  const title = document.getElementById("valSuccessHeaderTitle");
  const sub = document.getElementById("valSuccessHeaderSub");

  if (resultsCard) {
    resultsCard.classList.remove("validation-card-warning");
    resultsCard.classList.add("validation-card-success");
  }
  if (headerIconCircle) {
    headerIconCircle.style.background = "#10b981";
    headerIconCircle.innerHTML = '<i class="fa-solid fa-check"></i>';
  }
  if (title) {
    title.innerText = "AI Validated Successfully!";
    title.style.color = "#065f46";
  }
  if (sub) {
    sub.innerText = "All required documents are verified under AICTE APH norms.";
    sub.style.color = "#047857";
  }

  const valBox = document.getElementById("validationCommentsBox");
  const valHeading = document.getElementById("validationCommentsHeading");
  const valText = document.getElementById("validationCommentsText");
  const valIcon = document.getElementById("validationCommentsIcon");

  if (valBox && valText) {
    valBox.style.display = "flex";
    valBox.style.background = "#f0fdf4";
    valBox.style.borderColor = "#bbf7d0";
    if (valIcon) {
      valIcon.style.background = "#16a34a";
      valIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
    }
    if (valHeading) {
      valHeading.style.color = "#166534";
      valHeading.innerText = "Regulatory Compliance: 100% Satisfied";
    }
    valText.style.color = "#15803d";
    valText.innerHTML = "<strong>All 4 statutory documents verified successfully!</strong> University affiliation, AICTE approved intake, land title, and faculty cadre fully satisfy AICTE APH 2024–2027 norms. Clearance granted to submit to AICTE officials.";
  }

  const btnSubmit = document.getElementById("btnSubmitAICTEOfficials");
  const textSubmit = document.getElementById("textSubmitAICTE");
  const iconSubmit = document.getElementById("iconSubmitLock");
  const btnResubmit = document.getElementById("btnValidationResubmit");

  if (btnSubmit) {
    btnSubmit.disabled = false;
    btnSubmit.classList.remove("disabled");
    btnSubmit.classList.add("unlocked");
    btnSubmit.title = "All documents verified. Ready to submit to AICTE Officials!";
    btnSubmit.style.background = "#f26522";
    btnSubmit.style.cursor = "pointer";
    btnSubmit.style.pointerEvents = "auto";
  }
  if (textSubmit) textSubmit.innerText = "Submit to AICTE Officials";
  if (iconSubmit) iconSubmit.className = "fa-solid fa-paper-plane";
  if (btnResubmit) btnResubmit.classList.remove("highlight");

  const trackerCommentsBox = document.getElementById("trackerCommentsBox");
  const trackerCommentsText = document.getElementById("trackerCommentsText");
  if (trackerCommentsBox && trackerCommentsText) {
    trackerCommentsBox.style.background = "#f0fdf4";
    trackerCommentsBox.style.borderColor = "#bbf7d0";
    trackerCommentsText.innerHTML = '<span style="color: #16a34a; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> All application documents verified.</span> Application promoted to EVC Inspection Phase.';
  }
};

window.autoLoadCompliantDocuments = function() {
  window.hasAttachedCompliantDocs = true;
  window.uploadedDocuments = {
    affiliation: "1_Affiliation_Certificate_Anna_University.pdf",
    approval: "2_AICTE_Course_Approval_Letter_VERIFIED.pdf",
    infra: "3_Infrastructure_and_Land_Deed_Certificate.pdf",
    faculty: "4_Faculty_Cadre_and_FSR_Compliance.pdf"
  };
  window.uploadedCourseApprovalFileName = window.uploadedDocuments.approval;

  // Clear extracted cache so fresh text is loaded from statutory corpus
  window.extractedDocumentContents = {};

  const d1 = document.getElementById("displayAffiliation");
  const d2 = document.getElementById("displayApproval");
  const d3 = document.getElementById("displayInfra");
  const d4 = document.getElementById("displayFaculty");

  if (d1) {
    d1.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> 1_Affiliation_Certificate_Anna_University.pdf <span style="font-size: 11px; color: #64748b; font-weight: 500;">(Attached &bull; Ready for AI Validation)</span>`;
    d1.style.color = "#1e293b";
  }
  if (d2) {
    d2.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> 2_AICTE_Course_Approval_Letter_VERIFIED.pdf <span style="font-size: 11px; color: #64748b; font-weight: 500;">(Attached &bull; Ready for AI Validation)</span>`;
    d2.style.color = "#1e293b";
  }
  if (d3) {
    d3.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> 3_Infrastructure_and_Land_Deed_Certificate.pdf <span style="font-size: 11px; color: #64748b; font-weight: 500;">(Attached &bull; Ready for AI Validation)</span>`;
    d3.style.color = "#1e293b";
  }
  if (d4) {
    d4.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> 4_Faculty_Cadre_and_FSR_Compliance.pdf <span style="font-size: 11px; color: #64748b; font-weight: 500;">(Attached &bull; Ready for AI Validation)</span>`;
    d4.style.color = "#1e293b";
  }

  const evalResult = window.evaluateAllApplicationDocuments();
  window.renderAllDocumentRows(evalResult);
  resolveDocumentVerificationSuccess(evalResult);

  const toast = document.createElement("div");
  toast.className = "aicte-custom-toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Attached 4 fully compliant AICTE statutory PDFs!`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3500);
};

/* ==========================================================================
   DYNAMIC RESUBMISSION DESK (ANY OF THE 4 DOCUMENTS)
   ========================================================================== */
window.openResubmitModal = function(preferredDocType) {
  const evalResult = window.evaluateAllApplicationDocuments();
  let targetType = preferredDocType;
  if (!targetType) {
    targetType = evalResult.deficientDocs.length > 0 ? evalResult.deficientDocs[0].docType : "approval";
  }

  const select = document.getElementById("selectResubmitDoc");
  if (select) select.value = targetType;

  window.switchResubmitModalTarget(targetType);
  openModal("modalResubmit");
};

window.switchResubmitModalTarget = function(docType) {
  window.currentResubmitDocType = docType;
  window.resubmitSelectedFileName = "";

  const check = window.inspectDocument(docType, window.uploadedDocuments[docType]);

  const slotNameEl = document.getElementById("txtResubmitDocSlotName");
  const currentFileEl = document.getElementById("txtResubmitCurrentFile");
  const currentObsEl = document.getElementById("txtResubmitCurrentObservation");
  const linkPreview = document.getElementById("linkResubmitCurrentPreview");
  const display = document.getElementById("displayResubmit");

  if (slotNameEl) slotNameEl.innerText = window.getDocSlotTitle(docType);
  if (currentFileEl) currentFileEl.innerText = window.uploadedDocuments[docType] || "(None)";
  if (currentObsEl) currentObsEl.innerText = check.reason;
  if (linkPreview) {
    linkPreview.href = check.filePath;
  }
  if (display) {
    display.innerHTML = `Choose Rectified File from Computer`;
    display.style.color = "";
  }

  // Update Compliant preview details
  const compFileEl = document.getElementById("txtResubmitCompliantFile");
  const compNormEl = document.getElementById("txtResubmitCompliantNorm");
  const compLink = document.getElementById("linkResubmitCompliantPreview");
  const compExpectedType = document.getElementById("txtResubmitExpectedType");

  const compliantPath = window.getDocDefaultCompliantPath(docType);
  const compliantFileName = compliantPath.split("/").pop();

  if (compExpectedType) compExpectedType.innerText = window.getDocSlotTitle(docType);
  if (compFileEl) compFileEl.innerText = compliantFileName;
  if (compLink) compLink.href = compliantPath;

  if (compNormEl) {
    if (docType === "affiliation") compNormEl.innerText = "Anna University Affiliation Order AY 2026-27 (100% Matches Application).";
    else if (docType === "approval") compNormEl.innerText = "AY 2026–2027 with 120 Intake Approved (100% Matches Application).";
    else if (docType === "infra") compNormEl.innerText = "Registered Land Deed #4821 (25.40 Acres) & Fire Safety NOC (100% Compliant).";
    else if (docType === "faculty") compNormEl.innerText = "Cadre Ratio 1:2:6 & Student-Faculty Ratio 1:18.4 (Complies with 1:20 UG Norm).";
  }

  // Update explanation
  const exp = document.getElementById("resubmitExplanation");
  if (exp) {
    exp.value = `Attached authenticated ${window.getDocSlotTitle(docType)} satisfying AICTE Approval Process Handbook (APH 2024–2027) statutory norms.`;
  }
};

window.testAttachWrongDoc = function() {
  const docType = window.currentResubmitDocType;
  const wrongPath = window.getDocDefaultWrongPath(docType);
  const wrongFileName = wrongPath.split("/").pop();

  window.resubmitSelectedFileName = wrongFileName;
  // Pre-load content into memory for AI scrutiny upon submit
  window.extractedDocumentContents[docType] = window.knownDocumentTextCorpus[wrongFileName] || "";

  const display = document.getElementById("displayResubmit");
  if (display) {
    display.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> ${wrongFileName} <span style="color: #475569; font-size: 11.5px; font-weight: 600;">(Attached &bull; Ready for AI Re-Scrutiny)</span>`;
    display.style.color = "#1e293b";
  }

  const exp = document.getElementById("resubmitExplanation");
  if (exp) {
    exp.value = `Testing AI OCR Pre-Scrutiny: Selected document "${wrongFileName}" into ${window.getDocSlotTitle(docType)} slot to test content mismatch detection.`;
  }
};

window.testAttachCompliantDoc = function() {
  const docType = window.currentResubmitDocType;
  const compliantPath = window.getDocDefaultCompliantPath(docType);
  const compliantFileName = compliantPath.split("/").pop();

  window.resubmitSelectedFileName = compliantFileName;
  // Pre-load content into memory for AI scrutiny upon submit
  window.extractedDocumentContents[docType] = window.knownDocumentTextCorpus[compliantFileName] || "";

  const display = document.getElementById("displayResubmit");
  if (display) {
    display.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> ${compliantFileName} <span style="color: #475569; font-size: 11.5px; font-weight: 600;">(Attached &bull; Ready for AI Re-Scrutiny)</span>`;
    display.style.color = "#1e293b";
  }

  const exp = document.getElementById("resubmitExplanation");
  if (exp) {
    exp.value = `Attached authenticated ${window.getDocSlotTitle(docType)} (${compliantFileName}) meeting all AICTE statutory parameters.`;
  }
};

window.autoFillResubmitAffiliationLetter = function() {
  window.currentResubmitDocType = "approval";
  window.testAttachWrongDoc();
};

window.autoFillResubmitMismatchedLetter = function() {
  window.currentResubmitDocType = "approval";
  window.resubmitSelectedFileName = "2_AICTE_Course_Approval_Letter_MISMATCHED.pdf";
  window.extractedDocumentContents["approval"] = window.knownDocumentTextCorpus["2_AICTE_Course_Approval_Letter_MISMATCHED.pdf"] || "";
  const display = document.getElementById("displayResubmit");
  if (display) {
    display.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> 2_AICTE_Course_Approval_Letter_MISMATCHED.pdf <span style="color: #475569; font-size: 11.5px; font-weight: 600;">(Attached &bull; Ready for AI Re-Scrutiny)</span>`;
    display.style.color = "#1e293b";
  }
};

window.autoFillResubmitCompliantLetter = function() {
  window.currentResubmitDocType = "approval";
  window.testAttachCompliantDoc();
};

window.handleResubmitFile = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileName = file.name;
    window.resubmitSelectedFileName = fileName;
    const docType = window.currentResubmitDocType;
    
    // Read the actual text content of the file for AI scrutiny
    const reader = new FileReader();
    reader.onload = function(evt) {
      const rawText = evt.target.result;
      window.extractedDocumentContents[docType] = window.extractTextFromPDF(rawText, fileName);
    };
    reader.readAsText(file);

    const display = document.getElementById("displayResubmit");
    if (display) {
      display.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #2563eb; margin-right: 5px;"></i> ${fileName} <span style="color: #475569; font-size: 11.5px; font-weight: 600;">(Attached &bull; Click Submit to run AI Scrutiny)</span>`;
      display.style.color = "#1e293b";
    }
  }
};

window.handleResubmitSubmit = function(e) {
  e.preventDefault();
  closeModal("modalResubmit");

  const docType = window.currentResubmitDocType;
  const fileName = window.resubmitSelectedFileName || window.uploadedDocuments[docType] || window.getDocDefaultCompliantPath(docType).split("/").pop();
  
  window.uploadedDocuments[docType] = fileName;
  if (docType === "approval") {
    window.uploadedCourseApprovalFileName = fileName;
  }

  const check = window.inspectDocument(docType, fileName);

  const toast = document.createElement("div");
  toast.className = "aicte-custom-toast";
  toast.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> AI Reading OCR text & Cross-referencing: "${fileName}"...`;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);

    const evalResult = window.evaluateAllApplicationDocuments();
    window.renderAllDocumentRows(evalResult);

    if (!evalResult.allValid) {
      showDeficiencyState(evalResult);

      const failToast = document.createElement("div");
      failToast.className = "aicte-custom-toast";
      failToast.style.background = "#fee2e2";
      failToast.style.border = "1.5px solid #ef4444";
      failToast.style.color = "#991b1b";
      failToast.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #dc2626;"></i> <strong>Verification Rejected!</strong> ${check.reason} Submission to AICTE Officials remains LOCKED.`;
      document.body.appendChild(failToast);
      setTimeout(() => { if (failToast.parentNode) failToast.parentNode.removeChild(failToast); }, 5500);
      return;
    }

    resolveDocumentVerificationSuccess(evalResult);

    // If an official had flagged a deficiency previously, clear it now that compliant document was resubmitted
    if (window.aicteApprovalPipeline.isRejected) {
      window.aicteApprovalPipeline.isRejected = false;
      window.aicteApprovalPipeline.status = "UNDER_REVIEW";
      renderApplicationTrackerStages();
      renderOfficialDesk();
      if (typeof renderStageSummaryReportTimeline === "function") renderStageSummaryReportTimeline();
    }

    window.AICTEWorkflow.logAudit(
      `${window.getDocSlotTitle(docType)} Resubmitted & Verified`,
      `Institution uploaded verified statutory file "${fileName}" satisfying AICTE APH regulations.`
    );

    const successToast = document.createElement("div");
    successToast.className = "aicte-custom-toast";
    successToast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${window.getDocSlotTitle(docType)} verified! All application documents cleared. Submit to AICTE Officials unlocked.`;
    document.body.appendChild(successToast);
    setTimeout(() => { if (successToast.parentNode) successToast.parentNode.removeChild(successToast); }, 4000);
  }, 1200);
};

/* ==========================================================================
   OFFICIAL SCRUTINY DESK & MULTI-STAGE APPROVAL WORKFLOW CONTROLLER
   ========================================================================== */

window.officialReadDocsByOfficer = {
  "RO-SRO-01": { affiliation: false, approval: false, infra: false, faculty: false },
  "EVC-LEAD-02": { affiliation: false, approval: false, infra: false, faculty: false },
  "SAC-HEAD-03": { affiliation: false, approval: false, infra: false, faculty: false },
  "CHAIRMAN-04": { affiliation: false, approval: false, infra: false, faculty: false }
};

window.officialReadDocsState = {
  affiliation: false,
  approval: false,
  infra: false,
  faculty: false
};

window.openAndReadOfficialDoc = function(docType, fallbackFileName) {
  const fileName = window.uploadedDocuments[docType] || fallbackFileName;
  const activeOfficialId = (window.aicteApprovalPipeline && window.aicteApprovalPipeline.activeOfficialId) || "RO-SRO-01";
  
  if (!window.officialReadDocsByOfficer) {
    window.officialReadDocsByOfficer = {};
  }
  if (!window.officialReadDocsByOfficer[activeOfficialId]) {
    window.officialReadDocsByOfficer[activeOfficialId] = { affiliation: false, approval: false, infra: false, faculty: false };
  }

  window.officialReadDocsByOfficer[activeOfficialId][docType] = true;
  window.officialReadDocsState = window.officialReadDocsByOfficer[activeOfficialId];

  const docTitle = window.getDocSlotTitle(docType);
  const inspection = window.inspectDocument(docType, fileName);

  // Populate modal reader
  const titleEl = document.getElementById("modalDocViewerTitle");
  const nameEl = document.getElementById("modalDocViewerFileName");
  const contentEl = document.getElementById("modalDocViewerContent");
  const linkEl = document.getElementById("modalDocViewerExternalLink");

  if (titleEl) titleEl.innerText = `Statutory Inspection: ${docTitle}`;
  if (nameEl) nameEl.innerText = fileName;
  if (linkEl) {
    linkEl.href = inspection.filePath || `assets/documents/${fileName}`;
  }

  if (contentEl) {
    const textCorpus = window.knownDocumentTextCorpus[fileName] || window.extractedDocumentContents[docType] || `[AICTE Digital Statutory Document Stream - ${fileName}]\n\nVerified Parameters:\n- Institution: Sri Krishna College of Engineering and Technology (AICTE ID: 1-2718-TN)\n- Academic Year: 2026-2027\n- Affiliated University: Anna University, Chennai\n- Compliance: Full compliance with AICTE Approval Process Handbook (APH 2024-2027)\n- Digital Verification: SHA256 Signature Confirmed\n\nOfficial Scrutiny Note: Content matches prescribed statutory parameters.`;

    contentEl.innerHTML = `
<div style="background: #ffffff; border: 1.5px solid #2563eb; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(37,99,235,0.08);">
  <div style="font-weight: 800; color: #103f79; font-size: 14.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
    <i class="fa-solid fa-file-shield" style="color: #2563eb;"></i> AICTE Statutory Document Scrutiny Dossier
  </div>
  <div style="font-size: 13px; color: #334155;"><strong>Enclosure Slot:</strong> ${docTitle}</div>
  <div style="font-size: 13px; color: #334155;"><strong>Active File:</strong> ${fileName}</div>
  <div style="font-size: 13px; color: ${inspection.isValid ? '#166534' : '#991b1b'}; margin-top: 4px;">
    <strong>AI Verification Assessment:</strong> ${inspection.isValid ? '✓ COMPLIANT &amp; MATCHED' : '⚠ DEFICIENCY / MISMATCH DETECTED'} (${inspection.reason})
  </div>
</div>
<div style="font-weight: 700; color: #1e293b; margin-bottom: 6px; font-size: 13px;"><i class="fa-solid fa-file-lines"></i> Extracted Document Content &amp; Statutory Text Operator Stream:</div>
<div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; font-family: monospace; font-size: 12.5px; color: #0f172a; line-height: 1.6; white-space: pre-wrap;">${textCorpus}</div>`;
  }

  // Open modal
  openModal("modalOfficialDocViewer");

  // Re-render desk to update indicators and check unlock state
  window.renderOfficialDesk();

  // Toast notification
  const readCount = Object.values(window.officialReadDocsByOfficer[activeOfficialId]).filter(Boolean).length;
  const toast = document.createElement("div");
  toast.className = "aicte-custom-toast";
  toast.innerHTML = `<i class="fa-solid fa-book-open"></i> Opened &amp; Read: <strong>${docTitle}</strong> (${readCount} of 4 Statutory Enclosures Inspected)`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3500);
};

window.markAllOfficialDocsAsRead = function() {
  const activeOfficialId = (window.aicteApprovalPipeline && window.aicteApprovalPipeline.activeOfficialId) || "RO-SRO-01";
  if (!window.officialReadDocsByOfficer) {
    window.officialReadDocsByOfficer = {};
  }
  window.officialReadDocsByOfficer[activeOfficialId] = {
    affiliation: true,
    approval: true,
    infra: true,
    faculty: true
  };
  window.officialReadDocsState = window.officialReadDocsByOfficer[activeOfficialId];

  window.renderOfficialDesk();

  const toast = document.createElement("div");
  toast.className = "aicte-custom-toast";
  toast.innerHTML = `<i class="fa-solid fa-check-double"></i> All 4 Statutory Enclosures Marked as Read &amp; Inspected!`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3500);

  alert("✓ All 4 Statutory Enclosures Marked as Opened & Read!\n\n1. Affiliation Certificate (Anna University) - Inspected\n2. Course Approval Letter (120 Intake) - Inspected\n3. Land & Infrastructure Deed (25.40 Acres) - Inspected\n4. Faculty Cadre & FSR Compliance (1:18.4) - Inspected\n\nThe Reject and (Approve and Pass) buttons are now fully ENABLED for your regulatory decision.");
};

window.renderOfficialDesk = function() {
  const activeOfficial = window.AICTE_OFFICIALS[window.aicteApprovalPipeline.activeOfficialId] || window.AICTE_OFFICIALS["RO-SRO-01"];
  const pipeline = window.aicteApprovalPipeline;

  // 1. Render 4-Officer Workflow Hierarchy Navigator
  const pipelineNavEl = document.getElementById("officersPipelineNavButtons");
  if (pipelineNavEl) {
    let navHtml = "";
    [
      { id: "RO-SRO-01", num: 1, name: "Dr. K. Senthil Kumar", role: "1. Regional Scrutiny", stage: 2 },
      { id: "EVC-LEAD-02", num: 2, name: "Prof. Dr. S. Narayanan", role: "2. EVC Inspection", stage: 3 },
      { id: "SAC-HEAD-03", num: 3, name: "Justice Dr. Ramasubramanian", role: "3. SAC Appellate", stage: 4 },
      { id: "CHAIRMAN-04", num: 4, name: "Prof. T. G. Sitharam", role: "4. Chairman AICTE", stage: 5 }
    ].forEach(off => {
      const isCurrentView = off.id === activeOfficial.id;
      let statusTag = "";
      let btnClasses = "btn-pipeline-nav-officer";
      if (isCurrentView) btnClasses += " active-view";

      if (pipeline.isRejected && pipeline.rejectedAtStage === off.stage) {
        statusTag = `<span class="pipeline-nav-status-tag rejected"><i class="fa-solid fa-triangle-exclamation"></i> Deficiency</span>`;
        btnClasses += " has-rejected";
      } else if (pipeline.currentQueueStage > off.stage || (pipeline.currentQueueStage === 6 && off.stage === 5)) {
        statusTag = `<span class="pipeline-nav-status-tag approved"><i class="fa-solid fa-circle-check"></i> Cleared &amp; Passed</span>`;
        btnClasses += " is-approved";
      } else if (pipeline.currentQueueStage === off.stage && !pipeline.isRejected) {
        statusTag = `<span class="pipeline-nav-status-tag active"><i class="fa-solid fa-spinner fa-spin"></i> Active Queue</span>`;
        btnClasses += " holding-queue";
      } else {
        statusTag = `<span class="pipeline-nav-status-tag pending"><i class="fa-regular fa-clock"></i> Pending</span>`;
      }

      navHtml += `
        <button type="button" class="${btnClasses}" onclick="window.switchActiveOfficialContext('${off.id}')" title="Switch view to ${off.name}">
          <div class="pipeline-nav-num-badge">${off.num}</div>
          <div class="pipeline-nav-officer-info">
            <div class="pipeline-nav-officer-name">${off.name}</div>
            <div class="pipeline-nav-officer-role">${off.role}</div>
            ${statusTag}
          </div>
        </button>
      `;
    });
    pipelineNavEl.innerHTML = navHtml;
  }

  // 2. Render Transferred Dossier Notification Banner
  const transferAlertEl = document.getElementById("dossierTransferAlertBox");
  if (transferAlertEl) {
    if (activeOfficial.stageIndex === 3) {
      if (pipeline.decisions && pipeline.decisions[2]) {
        const dec = pipeline.decisions[2];
        transferAlertEl.style.display = "block";
        transferAlertEl.innerHTML = `
          <div class="forwarded-dossier-banner">
            <div class="forwarded-banner-icon"><i class="fa-solid fa-file-circle-check"></i></div>
            <div class="forwarded-banner-content">
              <div class="forwarded-banner-title">
                <i class="fa-solid fa-arrow-right-arrow-left"></i> Transferred Statutory Dossier Received from Official 1: Dr. K. Senthil Kumar, Ph.D.
              </div>
              <div class="forwarded-banner-text">
                All 4 statutory enclosures and institutional records for <strong>Sri Krishna College of Engineering and Technology (AICTE ID: 1-2718-TN)</strong> have been verified at <strong>Stage 2 (Regional Scrutiny)</strong> and officially transferred to your desk for <strong>Stage 3: EVC Committee Physical Inspection &amp; Infrastructure Verification</strong>.
              </div>
              <div class="forwarded-endorsement-note">
                <strong><i class="fa-solid fa-signature"></i> Official 1 Regional Scrutiny Endorsement:</strong> "${dec.remarks}" &bull; <span class="forwarded-timestamp"><i class="fa-solid fa-clock"></i> Forwarded at ${dec.timestamp}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        transferAlertEl.style.display = "none";
      }
    } else if (activeOfficial.stageIndex === 4) {
      if (pipeline.decisions && pipeline.decisions[3]) {
        const dec = pipeline.decisions[3];
        transferAlertEl.style.display = "block";
        transferAlertEl.innerHTML = `
          <div class="forwarded-dossier-banner">
            <div class="forwarded-banner-icon"><i class="fa-solid fa-file-shield"></i></div>
            <div class="forwarded-banner-content">
              <div class="forwarded-banner-title">
                <i class="fa-solid fa-arrow-right-arrow-left"></i> Transferred Statutory Dossier Received from Official 2: Prof. Dr. S. Narayanan, Ph.D.
              </div>
              <div class="forwarded-banner-text">
                EVC physical inspection compliance has been confirmed. All 4 statutory enclosures and physical verification dossiers have been transferred to your desk for <strong>Stage 4: SAC Appellate Review</strong>.
              </div>
              <div class="forwarded-endorsement-note">
                <strong><i class="fa-solid fa-signature"></i> Official 2 EVC Inspection Endorsement:</strong> "${dec.remarks}" &bull; <span class="forwarded-timestamp"><i class="fa-solid fa-clock"></i> Forwarded at ${dec.timestamp}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        transferAlertEl.style.display = "none";
      }
    } else if (activeOfficial.stageIndex === 5) {
      if (pipeline.currentQueueStage === 6) {
        transferAlertEl.style.display = "block";
        transferAlertEl.innerHTML = `
          <div class="forwarded-dossier-banner" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-color: #22c55e;">
            <div class="forwarded-banner-icon" style="background: #16a34a;"><i class="fa-solid fa-award"></i></div>
            <div class="forwarded-banner-content">
              <div class="forwarded-banner-title" style="color: #166534;">
                <i class="fa-solid fa-circle-check"></i> FINAL AICTE APPROVAL SANCTIONED BY PROF. T. G. SITHARAM (CHAIRMAN, AICTE)
              </div>
              <div class="forwarded-banner-text">
                Full statutory approval granted for Sri Krishna College of Engineering &amp; Technology for Academic Year 2026–27. Official Letter of Approval (LOA) sanctioned and sealed. Status Report is 100% complete and unlocked for download.
              </div>
            </div>
          </div>
        `;
      } else if (pipeline.decisions && pipeline.decisions[4]) {
        const dec = pipeline.decisions[4];
        transferAlertEl.style.display = "block";
        transferAlertEl.innerHTML = `
          <div class="forwarded-dossier-banner">
            <div class="forwarded-banner-icon"><i class="fa-solid fa-award"></i></div>
            <div class="forwarded-banner-content">
              <div class="forwarded-banner-title">
                <i class="fa-solid fa-arrow-right-arrow-left"></i> Transferred Statutory Dossier Received from Official 3: Justice (Retd.) Dr. V. Ramasubramanian
              </div>
              <div class="forwarded-banner-text">
                All statutory, physical, and appellate scrutiny steps (Stages 2, 3, &amp; 4) have cleared with full compliance. Application dossier is before you as <strong>Apex Authority (Chairman, AICTE)</strong> for Final Statutory Approval &amp; LOA Sanction.
              </div>
              <div class="forwarded-endorsement-note">
                <strong><i class="fa-solid fa-signature"></i> Official 3 SAC Appellate Clearance:</strong> "${dec.remarks}" &bull; <span class="forwarded-timestamp"><i class="fa-solid fa-clock"></i> Forwarded at ${dec.timestamp}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        transferAlertEl.style.display = "none";
      }
    } else {
      transferAlertEl.style.display = "none";
    }
  }

  // Profile fields
  const stagePill = document.getElementById("officerStagePill");
  const nameTitle = document.getElementById("officerFullNameDisplay");
  const gradDisplay = document.getElementById("officerGraduationDisplay");
  const postDisplay = document.getElementById("officerPostDisplay");
  const sealId = document.getElementById("officerSealIdDisplay");
  const appStatus = document.getElementById("officerDeskAppStatus");
  const avatarIcon = document.getElementById("officerProfileAvatar");

  if (stagePill) stagePill.innerText = activeOfficial.roleBadge;
  if (nameTitle) nameTitle.innerText = activeOfficial.name;
  if (gradDisplay) gradDisplay.innerHTML = `<strong>Graduation &amp; Academic Credentials:</strong> ${activeOfficial.graduation}`;
  if (postDisplay) postDisplay.innerHTML = `<strong>Official Post:</strong> ${activeOfficial.designation}`;
  if (sealId) sealId.innerText = activeOfficial.id;
  if (avatarIcon && activeOfficial.avatarIcon) avatarIcon.className = `fa-solid ${activeOfficial.avatarIcon}`;

  // Application Status Banner on Scrutiny Desk
  if (appStatus) {
    if (pipeline.isRejected) {
      appStatus.innerHTML = `<span class="status-badge badge-danger" style="font-size: 13px; padding: 6px 14px; background:#fee2e2; color:#991b1b; border:1px solid #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Application Flagged with Deficiency (Stage ${pipeline.rejectedAtStage})</span>`;
    } else if (pipeline.currentQueueStage === 6) {
      appStatus.innerHTML = `<span class="status-badge badge-success" style="font-size: 13px; padding: 6px 14px; background:#dcfce7; color:#166534; border:1px solid #22c55e;"><i class="fa-solid fa-circle-check"></i> Final AICTE Approval Granted (LOA Issued)</span>`;
    } else if (pipeline.currentQueueStage === activeOfficial.stageIndex) {
      appStatus.innerHTML = `<span class="status-badge badge-warning" style="font-size: 13px; padding: 6px 14px; background:#fef3c7; color:#92400e; border:1px solid #f59e0b;"><i class="fa-solid fa-clock"></i> Active Queue: Awaiting Your Scrutiny &amp; Determination</span>`;
    } else if (pipeline.currentQueueStage > activeOfficial.stageIndex) {
      appStatus.innerHTML = `<span class="status-badge badge-success" style="font-size: 13px; padding: 6px 14px; background:#dcfce7; color:#166534; border:1px solid #22c55e;"><i class="fa-solid fa-circle-check"></i> Cleared &amp; Approved by You &bull; Forwarded</span>`;
    } else {
      appStatus.innerHTML = `<span class="status-badge" style="font-size: 13px; padding: 6px 14px; background:#f1f5f9; color:#64748b; border:1px solid #cbd5e1;"><i class="fa-solid fa-hourglass-start"></i> Pending Prior Scrutiny (Currently at Stage ${pipeline.currentQueueStage})</span>`;
    }
  }

  // Update uploaded files in official desk cards
  const fileAffiliation = window.uploadedDocuments["affiliation"] || "1_Affiliation_Certificate_Anna_University.pdf";
  const fileApproval = window.uploadedDocuments["approval"] || "2_AICTE_Course_Approval_Letter_VERIFIED.pdf";
  const fileInfra = window.uploadedDocuments["infra"] || "3_Infrastructure_and_Land_Deed_Certificate.pdf";
  const fileFaculty = window.uploadedDocuments["faculty"] || "4_Faculty_Cadre_and_FSR_Compliance.pdf";

  const elAff = document.getElementById("officerAffiliationFileName");
  const elApp = document.getElementById("officerApprovalFileName");
  const elInf = document.getElementById("officerInfraFileName");
  const elFac = document.getElementById("officerFacultyFileName");

  if (elAff) elAff.innerText = fileAffiliation;
  if (elApp) elApp.innerText = fileApproval;
  if (elInf) elInf.innerText = fileInfra;
  if (elFac) elFac.innerText = fileFaculty;

  // Update read indicators and buttons for each document
  const activeId = activeOfficial.id || "RO-SRO-01";
  if (!window.officialReadDocsByOfficer) {
    window.officialReadDocsByOfficer = {};
  }
  if (!window.officialReadDocsByOfficer[activeId]) {
    window.officialReadDocsByOfficer[activeId] = { affiliation: false, approval: false, infra: false, faculty: false };
  }
  const readDocsState = window.officialReadDocsByOfficer[activeId];
  window.officialReadDocsState = readDocsState;

  ["affiliation", "approval", "infra", "faculty"].forEach(key => {
    const ind = document.getElementById(`indicatorDoc_${key}`);
    const btn = document.getElementById(`btnViewDoc_${key}`);
    const isRead = readDocsState[key];
    if (ind) {
      if (isRead) {
        ind.className = "doc-read-indicator read";
        ind.innerHTML = '<i class="fa-solid fa-circle-check"></i> Read &amp; Inspected by Official';
      } else {
        ind.className = "doc-read-indicator unread";
        ind.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Unread by Official';
      }
    }
    if (btn) {
      if (isRead) {
        btn.classList.add("has-read");
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Read &amp; Inspected';
      } else {
        btn.classList.remove("has-read");
        btn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> View &amp; Read PDF';
      }
    }
  });

  // Check document reading gate: STRICTLY MANDATORY ALL 4 MUST BE READ!
  const readCount = Object.values(readDocsState).filter(Boolean).length;
  const hasReadDocs = (readCount === 4);

  const gateNotice = document.getElementById("readingGateNotice");
  const iconLock = document.getElementById("iconGateLock");
  const titleGate = document.getElementById("titleGateNotice");
  const descGate = document.getElementById("descGateNotice");

  if (hasReadDocs) {
    if (gateNotice) gateNotice.className = "reading-gate-bar unlocked";
    if (iconLock) iconLock.className = "fa-solid fa-lock-open";
    if (titleGate) titleGate.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Statutory Inspection Complete: Verified (${readCount} of 4 Documents Read)`;
    if (descGate) descGate.innerHTML = `All 4 statutory enclosures have been opened and inspected. Regulatory controls <strong>Reject</strong> and <strong>(Approve and Pass)</strong> are now <strong>FULLY ENABLED</strong>.`;
  } else {
    if (gateNotice) gateNotice.className = "reading-gate-bar";
    if (iconLock) iconLock.className = "fa-solid fa-lock";
    if (titleGate) titleGate.innerHTML = `<i class="fa-solid fa-lock" style="color:#dc2626;"></i> Official Scrutiny Gate: Read All 4 Statutory PDFs Mandatory (${readCount} of 4 Read)`;
    if (descGate) descGate.innerHTML = `Statutory regulations strictly require the official to open and inspect <strong>all 4 statutory documents</strong> (Affiliation, Course Approval, Infrastructure, Faculty) before deciding. Currently read: <strong>${readCount} of 4</strong>. Click <strong>"View &amp; Read PDF"</strong> on each document below to unlock <strong>Reject</strong> and <strong>(Approve and Pass)</strong>.`;
  }

  // Decision & Action Buttons: Reject and (Approve and Pass)
  const btnApprove = document.getElementById("btnOfficialApproveSubmit");
  const txtApprove = document.getElementById("txtOfficialApproveBtn");
  const btnReject = document.getElementById("btnOfficialRejectSubmit") || document.querySelector(".btn-officer-reject");
  const txtInstruction = document.getElementById("txtOfficerActionInstruction");

  const nextOfficial = Object.values(window.AICTE_OFFICIALS).find(o => o.stageIndex === activeOfficial.stageIndex + 1);

  if (txtApprove) {
    if (activeOfficial.stageIndex === 5) {
      txtApprove.innerText = "Approve and Pass (Final LOA Approval)";
    } else if (nextOfficial) {
      const nextShortName = nextOfficial.name.split(',')[0].replace('Dr. ', '').replace('Prof. ', '').replace('Justice (Retd.) ', '');
      txtApprove.innerText = `Approve and Pass to Official ${nextOfficial.officialNumber} (${nextShortName})`;
    } else {
      txtApprove.innerText = "Approve and Pass";
    }
  }

  const isCurrentStage = pipeline.currentQueueStage === activeOfficial.stageIndex && !pipeline.isRejected;

  // Gate check: Only enable buttons if official has actually opened and read ALL 4 documents
  if (isCurrentStage && hasReadDocs) {
    if (btnApprove) {
      btnApprove.disabled = false;
      btnApprove.style.opacity = "1";
      btnApprove.style.cursor = "pointer";
      btnApprove.title = "Click to Approve and Pass application to next official";
    }
    if (btnReject) {
      btnReject.disabled = false;
      btnReject.style.opacity = "1";
      btnReject.style.cursor = "pointer";
      btnReject.title = "Click to Flag Deficiency and Reject application";
    }
    if (txtInstruction) {
      txtInstruction.innerHTML = `<span style="color:#166534; font-weight:700;"><i class="fa-solid fa-circle-check"></i> All 4 Documents Inspected:</span> You may now execute statutory determination (<strong>Reject</strong> or <strong>Approve and Pass</strong>).`;
    }
  } else {
    if (btnApprove) {
      btnApprove.disabled = true;
      btnApprove.style.opacity = "0.45";
      btnApprove.style.cursor = "not-allowed";
      btnApprove.title = !hasReadDocs ? `Mandatory: All 4 statutory documents must be read first (${readCount} of 4 read)` : "Locked: Application not in your active queue";
    }
    if (btnReject) {
      btnReject.disabled = true;
      btnReject.style.opacity = "0.45";
      btnReject.style.cursor = "not-allowed";
      btnReject.title = !hasReadDocs ? `Mandatory: All 4 statutory documents must be read first (${readCount} of 4 read)` : "Locked: Application not in your active queue";
    }
    if (txtInstruction) {
      if (!hasReadDocs && isCurrentStage) {
        txtInstruction.innerHTML = `<span style="color:#dc2626; font-weight:700;"><i class="fa-solid fa-lock"></i> Mandatory Inspection Gate (${readCount}/4 Read):</span> You must click <strong>"View &amp; Read PDF"</strong> and inspect all 4 statutory documents before deciding.`;
      } else if (pipeline.isRejected) {
        txtInstruction.innerHTML = `<span style="color:#dc2626; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Deficiency Flagged:</span> Application awaiting institutional resubmission.`;
      } else {
        txtInstruction.innerHTML = `Application currently at Stage ${pipeline.currentQueueStage}. Decision controls will unlock when application reaches your desk.`;
      }
    }
  }

  // Also keep the Status Report timeline in sync
  if (typeof window.renderStageSummaryReportTimeline === "function") {
    window.renderStageSummaryReportTimeline();
  }
};

window.executeCurrentOfficialApprove = function() {
  const activeOfficial = window.AICTE_OFFICIALS[window.aicteApprovalPipeline.activeOfficialId] || window.AICTE_OFFICIALS["RO-SRO-01"];
  const pipeline = window.aicteApprovalPipeline;

  if (pipeline.currentQueueStage !== activeOfficial.stageIndex) {
    alert(`Action Not Allowed: This application is currently at Stage ${pipeline.currentQueueStage} (${window.getStageTitle(pipeline.currentQueueStage)}). Only the designated official for that stage can approve.`);
    return;
  }

  if (pipeline.isRejected) {
    alert("This application currently has an active deficiency notice. The institution must resubmit the required rectified documents before approval can proceed.");
    return;
  }

  // Double check reading gate: STRICTLY MANDATORY 4 OF 4!
  const activeId = activeOfficial.id || "RO-SRO-01";
  const readDocsState = (window.officialReadDocsByOfficer && window.officialReadDocsByOfficer[activeId]) || window.officialReadDocsState || {};
  const readCount = Object.values(readDocsState).filter(Boolean).length;
  if (readCount < 4) {
    alert(`Official Scrutiny Locked: AICTE statutory regulations mandate that all 4 documents must be opened and read before granting approval (${readCount} of 4 currently read).\n\nPlease inspect all 4 statutory documents.`);
    return;
  }

  const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  pipeline.stageTimestamps[activeOfficial.stageIndex] = nowStr;

  if (activeOfficial.stageIndex === 2) {
    // Official 1 approves -> moves to Official 2 (EVC)
    pipeline.currentQueueStage = 3;
    pipeline.status = "UNDER_REVIEW";
    pipeline.decisions[2] = {
      officer: activeOfficial.name,
      decision: "APPROVED",
      timestamp: nowStr,
      remarks: "Statutory scrutiny complete. All 4 enclosures verified against APH 2026 norms. Transferred to EVC."
    };

    window.AICTEWorkflow.logAudit(
      "Stage 2 Scrutiny Approved",
      `Approved by ${activeOfficial.name}. Forwarded to EVC Committee Chairman (Prof. Dr. S. Narayanan).`
    );

    renderOfficialDesk();
    renderApplicationTrackerStages();
    renderStageSummaryReportTimeline();

    const switchNext = confirm(
      `✓ STAGE 2 SCRUTINY APPROVED!\n\n${activeOfficial.name} (${activeOfficial.designation})\nhas verified and approved all 4 statutory documents.\n\nAll documents & institutional dossiers have been SENT to:\nOfficial 2: Prof. Dr. S. Narayanan, Ph.D. (Chairman, AICTE Expert Visit Committee).\n\nClick "OK" to switch immediately to Official 2's Scrutiny Desk to inspect the received dossier.`
    );
    if (switchNext) {
      window.switchActiveOfficialContext("EVC-LEAD-02");
    }
    return;
  } else if (activeOfficial.stageIndex === 3) {
    // Official 2 approves -> moves to Official 3 (SAC / SHC)
    pipeline.currentQueueStage = 4;
    pipeline.status = "UNDER_REVIEW";
    pipeline.decisions[3] = {
      officer: activeOfficial.name,
      decision: "APPROVED",
      timestamp: nowStr,
      remarks: "EVC physical inspection compliance confirmed. Infrastructure and faculty rosters verified on-site. Transferred to SAC."
    };

    window.AICTEWorkflow.logAudit(
      "Stage 3 EVC Approved",
      `Approved by ${activeOfficial.name}. Forwarded to SAC Chairman (Justice Dr. V. Ramasubramanian).`
    );

    renderOfficialDesk();
    renderApplicationTrackerStages();
    renderStageSummaryReportTimeline();

    const switchNext = confirm(
      `✓ STAGE 3 EVC INSPECTION CLEARED!\n\n${activeOfficial.name} (Chairman, EVC)\nhas approved on-site statutory compliance.\n\nAll documents & inspection dossiers have been SENT to:\nOfficial 3: Justice (Retd.) Dr. V. Ramasubramanian (Chairman, Standing Appellate Committee).\n\nClick "OK" to switch immediately to Official 3's Desk to inspect the received dossier.`
    );
    if (switchNext) {
      window.switchActiveOfficialContext("SAC-HEAD-03");
    }
    return;
  } else if (activeOfficial.stageIndex === 4) {
    // Official 3 approves -> moves to Official 4 (Chairman)
    pipeline.currentQueueStage = 5;
    pipeline.status = "UNDER_REVIEW";
    pipeline.decisions[4] = {
      officer: activeOfficial.name,
      decision: "APPROVED",
      timestamp: nowStr,
      remarks: "Standing Appellate Committee has reviewed all representations and statutory compliance. Cleared for Final AICTE Approval."
    };

    window.AICTEWorkflow.logAudit(
      "Stage 4 SAC Cleared",
      `Approved by ${activeOfficial.name}. Forwarded to Chairman, AICTE (Prof. T. G. Sitharam).`
    );

    renderOfficialDesk();
    renderApplicationTrackerStages();
    renderStageSummaryReportTimeline();

    const switchNext = confirm(
      `✓ STAGE 4 SAC CLEARANCE GRANTED!\n\n${activeOfficial.name} (Chairman, SAC)\nhas granted appellate clearance.\n\nAll documents & complete dossiers have been SENT to:\nOfficial 4: Prof. T. G. Sitharam, Ph.D. (Chairman, AICTE - Apex Authority).\n\nClick "OK" to switch immediately to Chairman's Desk for Final Sanction.`
    );
    if (switchNext) {
      window.switchActiveOfficialContext("CHAIRMAN-04");
    }
    return;
  } else if (activeOfficial.stageIndex === 5) {
    // Official 4 (Chairman) approves -> COMPLETE APPROVAL!
    pipeline.currentQueueStage = 6;
    pipeline.status = "APPROVED";
    pipeline.decisions[5] = {
      officer: activeOfficial.name,
      decision: "APPROVED",
      timestamp: nowStr,
      remarks: "FINAL APPROVAL GRANTED. Letter of Approval (LOA) for Academic Year 2026-27 is officially sanctioned under AICTE seal."
    };

    alert(`🎉 FINAL AICTE APPROVAL SANCTIONED!\n\nProf. T. G. Sitharam (Chairman, AICTE) has granted apex regulatory clearance for Sri Krishna College of Engineering & Technology.\n\n✓ Letter of Approval (LOA) issued for AY 2026-27.\n✓ AICTE Official Status Report & Approval Order is now UNLOCKED for download.`);
    window.AICTEWorkflow.logAudit(
      "Final AICTE Approval Issued",
      `Approved by Prof. T. G. Sitharam (Chairman, AICTE). LOA generated and released.`
    );

    renderOfficialDesk();
    renderApplicationTrackerStages();
    renderStageSummaryReportTimeline();
  }
};

window.openOfficerRejectModal = function() {
  const activeOfficial = window.AICTE_OFFICIALS[window.aicteApprovalPipeline.activeOfficialId] || window.AICTE_OFFICIALS["RO-SRO-01"];
  const pipeline = window.aicteApprovalPipeline;

  if (pipeline.currentQueueStage !== activeOfficial.stageIndex) {
    alert(`Action Not Allowed: This application is currently at Stage ${pipeline.currentQueueStage} (${window.getStageTitle(pipeline.currentQueueStage)}). Only the designated official for that stage can reject or flag deficiency.`);
    return;
  }

  // Check reading gate: STRICTLY MANDATORY ALL 4 STATUTORY ENCLOSURES READ!
  const activeId = activeOfficial.id || "RO-SRO-01";
  const readDocsState = (window.officialReadDocsByOfficer && window.officialReadDocsByOfficer[activeId]) || window.officialReadDocsState || {};
  const readCount = Object.values(readDocsState).filter(Boolean).length;
  if (readCount < 4) {
    alert(`Official Scrutiny Locked: AICTE statutory regulations strictly mandate that you must open and inspect ALL 4 statutory PDFs before issuing a deficiency notice or rejection (${readCount} of 4 currently read).\n\nPlease click "View & Read PDF" on all unread documents first.`);
    return;
  }

  const senderEl = document.getElementById("officerRejectModalSender");
  if (senderEl) {
    senderEl.innerText = `Issuing Official: ${activeOfficial.name} (${activeOfficial.designation})`;
  }
  openModal("modalOfficerReject");
};

window.executeCurrentOfficialReject = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  closeModal("modalOfficerReject");

  const activeOfficial = window.AICTE_OFFICIALS[window.aicteApprovalPipeline.activeOfficialId] || window.AICTE_OFFICIALS["RO-SRO-01"];
  const pipeline = window.aicteApprovalPipeline;

  const reasonSelect = document.getElementById("officerRejectReasonSelect");
  const noteInput = document.getElementById("officerRejectNote");

  const reason = reasonSelect ? reasonSelect.value : "Course Approval / University Affiliation Mismatch";
  const note = (noteInput && noteInput.value.trim()) ? noteInput.value.trim() : "Course approval letter is mismatching. Sanctioned intake and university affiliation date do not match. Please upload the correct document.";

  const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Update pipeline state
  pipeline.isRejected = true;
  pipeline.rejectedAtStage = activeOfficial.stageIndex;
  pipeline.rejectedByOfficer = activeOfficial;
  pipeline.rejectionReason = reason;
  pipeline.rejectionNote = note;
  pipeline.status = "REJECTED";
  pipeline.stageTimestamps[activeOfficial.stageIndex] = nowStr;

  pipeline.decisions[activeOfficial.stageIndex] = {
    officer: activeOfficial.name,
    decision: "REJECTED",
    timestamp: nowStr,
    reason: reason,
    remarks: note
  };

  alert(`🚨 Deficiency Notice Issued!\n\n${activeOfficial.name} has flagged the application with:\n"${reason}".\n\nThe Institution's Application Tracker and Stage Summary have been updated to REJECTED / DEFICIENCY NOTICED, displaying your comments and unlocking the Resubmit button.`);

  window.AICTEWorkflow.logAudit(
    `Deficiency Flagged at Stage ${activeOfficial.stageIndex}`,
    `Rejected by ${activeOfficial.name}: ${reason} - ${note}`
  );

  renderOfficialDesk();
  renderApplicationTrackerStages();
  renderStageSummaryReportTimeline();
};

window.renderApplicationTrackerStages = function() {
  const container = document.getElementById("trackerStagesList");
  const commentsBox = document.getElementById("trackerCommentsBox");
  const commentsText = document.getElementById("trackerCommentsText");
  const verifiedBanner = document.getElementById("trackerVerifiedBanner");
  const pipeline = window.aicteApprovalPipeline;

  if (container) {
    const s1 = { title: "Institution", sub: "Application Submitted Successfully", time: "31 Oct 2026, 10:25 AM", status: "completed", icon: "fa-regular fa-file-lines", bg: "#2563eb" };
    
    // Stage 2: Dr. K. Senthil Kumar
    let s2 = { title: "AICTE Scrutiny Team", sub: "Dr. K. Senthil Kumar, Ph.D. (Regional Officer)", time: pipeline.stageTimestamps[2] || "31 Oct 2026, 11:30 AM", status: "pending", icon: "fa-solid fa-magnifying-glass", bg: "#0284c7" };
    if (pipeline.currentQueueStage > 2) {
      s2.status = "completed";
      s2.sub = "Scrutiny Verified & Approved by Dr. K. Senthil Kumar";
    } else if (pipeline.currentQueueStage === 2) {
      if (pipeline.isRejected) {
        s2.status = "rejected";
        s2.sub = `Deficiency Noticed: ${pipeline.rejectionReason}`;
      } else {
        s2.status = "active";
        s2.sub = "Documents Under Scrutiny Review by Dr. K. Senthil Kumar";
      }
    }

    // Stage 3: Prof. Dr. S. Narayanan
    let s3 = { title: "EVC (Expert Visit Committee)", sub: "Prof. Dr. S. Narayanan, Ph.D. (Chairman, EVC)", time: pipeline.stageTimestamps[3] || "Pending", status: "pending", icon: "fa-solid fa-users", bg: "#0284c7" };
    if (pipeline.currentQueueStage > 3) {
      s3.status = "completed";
      s3.sub = "Physical Inspection Verified by Prof. Dr. S. Narayanan";
    } else if (pipeline.currentQueueStage === 3) {
      if (pipeline.isRejected) {
        s3.status = "rejected";
        s3.sub = `Deficiency Noticed: ${pipeline.rejectionReason}`;
      } else {
        s3.status = "active";
        s3.sub = "Inspection & Campus Verification in Progress";
      }
    }

    // Stage 4: Justice Dr. V. Ramasubramanian
    let s4 = { title: "SAC / SHC (Standing Appellate)", sub: "Justice (Retd.) Dr. V. Ramasubramanian, LL.D.", time: pipeline.stageTimestamps[4] || "Pending", status: "pending", icon: "fa-solid fa-shield-halved", bg: "#0284c7" };
    if (pipeline.currentQueueStage > 4) {
      s4.status = "completed";
      s4.sub = "Appellate Review Cleared by Justice Dr. Ramasubramanian";
    } else if (pipeline.currentQueueStage === 4) {
      if (pipeline.isRejected) {
        s4.status = "rejected";
        s4.sub = `Deficiency Noticed: ${pipeline.rejectionReason}`;
      } else {
        s4.status = "active";
        s4.sub = "Appellate Review in Progress by SAC Committee";
      }
    }

    // Stage 5: Prof. T. G. Sitharam (Chairman)
    let s5 = { title: "Chairman, AICTE", sub: "Prof. T. G. Sitharam, Ph.D. (Apex Authority)", time: pipeline.stageTimestamps[5] || "Pending", status: "pending", icon: "fa-solid fa-award", bg: "#0284c7" };
    if (pipeline.currentQueueStage === 6) {
      s5.status = "completed";
      s5.sub = "Final Approval & Order Signed by Prof. T. G. Sitharam";
    } else if (pipeline.currentQueueStage === 5) {
      if (pipeline.isRejected) {
        s5.status = "rejected";
        s5.sub = `Deficiency Noticed: ${pipeline.rejectionReason}`;
      } else {
        s5.status = "active";
        s5.sub = "Final Approval Determination in Progress";
      }
    }

    const stages = [s1, s2, s3, s4, s5];

    let html = `<div class="tracker-vertical-track"></div>`;
    stages.forEach((st) => {
      let nodeClass = "stage-timeline-node";
      let rightHtml = "";

      if (st.status === "completed") {
        nodeClass += " completed";
        rightHtml = `<div class="status-check-circle"><i class="fa-solid fa-check"></i></div> <span>${st.time || 'Completed'}</span>`;
      } else if (st.status === "active") {
        nodeClass += " active";
        rightHtml = `<div class="status-spinner"></div> <span style="color:#0284c7; font-weight:700;">In Progress</span>`;
      } else if (st.status === "rejected") {
        nodeClass += " rejected";
        rightHtml = `<div style="display:flex;align-items:center;gap:6px;color:#dc2626;font-weight:700;font-size:12.5px;"><i class="fa-solid fa-circle-exclamation" style="font-size:16px;"></i> <span>DEFICIENCY FLAGGED</span></div>`;
      } else {
        rightHtml = `<div class="status-clock"><i class="fa-regular fa-clock"></i></div> <span style="color: #64748b;">Pending</span>`;
      }

      html += `
        <div class="tracker-stage-row">
          <div class="${nodeClass}"></div>
          <div class="stage-left-info">
            <div class="stage-badge-icon" style="background: ${st.bg};">
              <i class="${st.icon}"></i>
            </div>
            <div>
              <div class="stage-title">${st.title}</div>
              <div class="stage-subtitle" ${st.status === 'rejected' ? 'style="color:#dc2626; font-weight:600;"' : ''}>${st.sub}</div>
            </div>
          </div>
          <div class="stage-right-status">
            ${rightHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Update Comments from Officials Box
  if (commentsBox && commentsText) {
    if (pipeline.isRejected) {
      commentsBox.className = "comments-officials-box rejected";
      commentsText.innerHTML = `
        <span style="color: #991b1b; font-weight: 800; font-size: 13.5px;"><i class="fa-solid fa-triangle-exclamation"></i> DEFICIENCY NOTICE ISSUED BY ${pipeline.rejectedByOfficer ? pipeline.rejectedByOfficer.name : 'AICTE Official'}:</span><br/>
        <strong style="color: #7f1d1d;">Deficiency:</strong> ${pipeline.rejectionReason}<br/>
        <strong style="color: #7f1d1d;">Directions:</strong> ${pipeline.rejectionNote}<br/>
        <div style="margin-top: 8px; color: #b91c1c; font-weight: 700; font-size: 12px;">
          <i class="fa-solid fa-arrow-turn-up"></i> Please click the <strong>Resubmit</strong> button below to attach rectified documents.
        </div>
      `;
    } else if (pipeline.currentQueueStage === 6) {
      commentsBox.className = "comments-officials-box approved";
      commentsText.innerHTML = `
        <span style="color: #166534; font-weight: 800; font-size: 13.5px;"><i class="fa-solid fa-circle-check"></i> FINAL AICTE APPROVAL SANCTIONED:</span><br/>
        Chairman, AICTE (Prof. T. G. Sitharam) has granted full regulatory clearance and issued the Letter of Approval (LOA) for Academic Year 2026-27.<br/>
        <strong style="color: #15803d;">Status:</strong> Complete. Institutional Approval Certificate is now available for download.
      `;
    } else if (pipeline.currentQueueStage === 5) {
      commentsBox.className = "comments-officials-box";
      commentsText.innerHTML = `Stages 2, 3, and 4 approved. Application is currently before Prof. T. G. Sitharam (Chairman, AICTE) for apex review and LOA issuance.`;
    } else if (pipeline.currentQueueStage === 4) {
      commentsBox.className = "comments-officials-box";
      commentsText.innerHTML = `Stages 2 &amp; 3 approved. Application is undergoing appellate review by Justice (Retd.) Dr. V. Ramasubramanian (Chairman, SAC / SHC).`;
    } else if (pipeline.currentQueueStage === 3) {
      commentsBox.className = "comments-officials-box";
      commentsText.innerHTML = `Stage 2 approved by Dr. K. Senthil Kumar. EVC Committee Chairman (Prof. Dr. S. Narayanan) is conducting verification of statutory parameters.`;
    } else {
      commentsBox.className = "comments-officials-box";
      commentsText.innerHTML = `Application submitted to AICTE Regional Scrutiny Desk (Dr. K. Senthil Kumar, Ph.D.). Awaiting scrutiny review.`;
    }
  }

  // Verified Banner
  if (verifiedBanner) {
    if (pipeline.currentQueueStage === 6) {
      verifiedBanner.style.display = "flex";
    } else {
      verifiedBanner.style.display = "none";
    }
  }

  // Update Report Metadata & Download Button
  const reportBadge = document.getElementById("reportCurrentStatusBadge");
  const reportBtn = document.getElementById("btnDownloadReport");

  if (reportBadge) {
    if (pipeline.currentQueueStage === 6) {
      reportBadge.className = "status-pill-approved";
      reportBadge.style.cssText = "background:#dcfce7; color:#166534; border:1px solid #22c55e; padding:4px 10px; border-radius:12px; font-weight:700;";
      reportBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Approved &amp; LOA Issued';
    } else if (pipeline.isRejected) {
      reportBadge.className = "status-pill-rejected";
      reportBadge.style.cssText = "background:#fee2e2; color:#991b1b; border:1px solid #ef4444; padding:4px 10px; border-radius:12px; font-weight:700;";
      reportBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Deficiency Noticed';
    } else {
      reportBadge.className = "status-pill-under-review";
      reportBadge.style.cssText = "";
      reportBadge.innerHTML = `Under Review (Stage ${pipeline.currentQueueStage} of 5)`;
    }
  }

  if (reportBtn) {
    if (pipeline.currentQueueStage === 6) {
      reportBtn.style.opacity = "1";
      reportBtn.style.cursor = "pointer";
      reportBtn.title = "Download AICTE Official Status Report & Approval Order";
      reportBtn.classList.add("pulse-ready");
    } else {
      reportBtn.style.opacity = "0.7";
      reportBtn.title = "Report locked until Chairman, AICTE grants final approval";
      reportBtn.classList.remove("pulse-ready");
    }
  }

  // Simultaneously update the Stage Summary Timeline in the Status Report
  if (typeof window.renderStageSummaryReportTimeline === "function") {
    window.renderStageSummaryReportTimeline();
  }
};

window.renderStageSummaryReportTimeline = function() {
  const container = document.getElementById("reportStageSummaryTimeline");
  const reportBadge = document.getElementById("reportCurrentStatusBadge");
  const reportBtn = document.getElementById("btnDownloadReport");
  const pipeline = window.aicteApprovalPipeline;

  if (!container) return;

  // Track fill calculations:
  // Stage 1: Submitted (Institution)
  // Stage 2: Regional Scrutiny (Official 1: Dr. K. Senthil Kumar)
  // Stage 3: EVC Inspection (Official 2: Prof. Dr. S. Narayanan)
  // Stage 4: SAC Review (Official 3: Justice Dr. V. Ramasubramanian)
  // Stage 5: AICTE Chairman Review (Official 4: Prof. T. G. Sitharam)
  // Stage 6: Final Approved & LOA Issued (All 4 officials approved)

  let widthPercent = 25;
  let trackColor = "#0284c7"; // AICTE primary blue

  if (pipeline.isRejected) {
    trackColor = "#ef4444"; // red
    if (pipeline.rejectedAtStage === 2) widthPercent = 25;
    else if (pipeline.rejectedAtStage === 3) widthPercent = 50;
    else if (pipeline.rejectedAtStage === 4) widthPercent = 75;
    else if (pipeline.rejectedAtStage === 5) widthPercent = 90;
  } else if (pipeline.currentQueueStage === 6) {
    widthPercent = 100;
    trackColor = "#16a34a"; // green
  } else if (pipeline.currentQueueStage === 5) {
    widthPercent = 90;
    trackColor = "#f37021"; // orange active
  } else if (pipeline.currentQueueStage === 4) {
    widthPercent = 75;
    trackColor = "#0284c7";
  } else if (pipeline.currentQueueStage === 3) {
    widthPercent = 50;
    trackColor = "#0284c7";
  } else if (pipeline.currentQueueStage === 2) {
    widthPercent = 25;
    trackColor = "#0284c7";
  }

  // Node 1: Submitted (Institution)
  const step1 = {
    nodeClass: "summary-step-node completed",
    iconHtml: '<i class="fa-solid fa-check"></i>',
    labelHtml: '<span style="color:#1e293b; font-weight:700;">Submitted</span>',
    subText: '31 Oct 2026'
  };

  // Node 2: Regional Scrutiny (Official 1: Dr. K. Senthil Kumar)
  let step2 = {
    nodeClass: "summary-step-node pending",
    iconHtml: '<i class="fa-regular fa-clock"></i>',
    labelHtml: '<span>Regional Scrutiny</span>',
    subText: 'Official 1'
  };
  if (pipeline.isRejected && pipeline.rejectedAtStage === 2) {
    step2.nodeClass = "summary-step-node rejected";
    step2.iconHtml = '<i class="fa-solid fa-xmark"></i>';
    step2.labelHtml = '<span style="color:#dc2626; font-weight:700;">Deficiency Noticed</span>';
    step2.subText = 'Official 1 Flagged';
  } else if (pipeline.currentQueueStage > 2) {
    step2.nodeClass = "summary-step-node completed";
    step2.iconHtml = '<i class="fa-solid fa-check"></i>';
    step2.labelHtml = '<span style="color:#0284c7; font-weight:700;">Regional Cleared</span>';
    step2.subText = 'Official 1 Approved';
  } else if (pipeline.currentQueueStage === 2 && !pipeline.isRejected) {
    step2.nodeClass = "summary-step-node active active-spin";
    step2.iconHtml = '<i class="fa-solid fa-spinner fa-spin"></i>';
    step2.labelHtml = '<span style="color:#103f79; font-weight:700;">In Scrutiny</span>';
    step2.subText = 'Official 1 Active';
  }

  // Node 3: EVC Inspection (Official 2: Prof. Dr. S. Narayanan)
  let step3 = {
    nodeClass: "summary-step-node pending",
    iconHtml: '<i class="fa-regular fa-clock"></i>',
    labelHtml: '<span>EVC Inspection</span>',
    subText: 'Official 2'
  };
  if (pipeline.isRejected && pipeline.rejectedAtStage === 3) {
    step3.nodeClass = "summary-step-node rejected";
    step3.iconHtml = '<i class="fa-solid fa-xmark"></i>';
    step3.labelHtml = '<span style="color:#dc2626; font-weight:700;">Deficiency Noticed</span>';
    step3.subText = 'Official 2 Flagged';
  } else if (pipeline.currentQueueStage > 3) {
    step3.nodeClass = "summary-step-node completed";
    step3.iconHtml = '<i class="fa-solid fa-check"></i>';
    step3.labelHtml = '<span style="color:#0284c7; font-weight:700;">EVC Cleared</span>';
    step3.subText = 'Official 2 Approved';
  } else if (pipeline.currentQueueStage === 3 && !pipeline.isRejected) {
    step3.nodeClass = "summary-step-node active active-spin";
    step3.iconHtml = '<i class="fa-solid fa-spinner fa-spin"></i>';
    step3.labelHtml = '<span style="color:#103f79; font-weight:700;">EVC Inspection</span>';
    step3.subText = 'Official 2 Active';
  }

  // Node 4: SAC Review (Official 3: Justice Dr. V. Ramasubramanian)
  let step4 = {
    nodeClass: "summary-step-node pending",
    iconHtml: '<i class="fa-regular fa-clock"></i>',
    labelHtml: '<span>SAC Review</span>',
    subText: 'Official 3'
  };
  if (pipeline.isRejected && pipeline.rejectedAtStage === 4) {
    step4.nodeClass = "summary-step-node rejected";
    step4.iconHtml = '<i class="fa-solid fa-xmark"></i>';
    step4.labelHtml = '<span style="color:#dc2626; font-weight:700;">Deficiency Noticed</span>';
    step4.subText = 'Official 3 Flagged';
  } else if (pipeline.currentQueueStage > 4) {
    step4.nodeClass = "summary-step-node completed";
    step4.iconHtml = '<i class="fa-solid fa-check"></i>';
    step4.labelHtml = '<span style="color:#0284c7; font-weight:700;">SAC Cleared</span>';
    step4.subText = 'Official 3 Approved';
  } else if (pipeline.currentQueueStage === 4 && !pipeline.isRejected) {
    step4.nodeClass = "summary-step-node active active-spin";
    step4.iconHtml = '<i class="fa-solid fa-spinner fa-spin"></i>';
    step4.labelHtml = '<span style="color:#103f79; font-weight:700;">SAC Review</span>';
    step4.subText = 'Official 3 Active';
  }

  // Node 5: Chairman Final Approval (Official 4: Prof. T. G. Sitharam)
  let step5 = {
    nodeClass: "summary-step-node pending",
    iconHtml: '<i class="fa-regular fa-clock"></i>',
    labelHtml: '<span>Final Approval Pending</span>',
    subText: 'Chairman LOA'
  };
  if (pipeline.isRejected && pipeline.rejectedAtStage === 5) {
    step5.nodeClass = "summary-step-node rejected";
    step5.iconHtml = '<i class="fa-solid fa-xmark"></i>';
    step5.labelHtml = '<span style="color:#dc2626; font-weight:700;">Deficiency Noticed</span>';
    step5.subText = 'Official 4 Flagged';
  } else if (pipeline.currentQueueStage === 6) {
    step5.nodeClass = "summary-step-node final-approved";
    step5.iconHtml = '<i class="fa-solid fa-award"></i>';
    step5.labelHtml = '<span style="color:#16a34a; font-weight:800;">Approved &amp; LOA Issued</span>';
    step5.subText = 'Final Approved';
  } else if (pipeline.currentQueueStage === 5 && !pipeline.isRejected) {
    step5.nodeClass = "summary-step-node active active-spin";
    step5.iconHtml = '<i class="fa-solid fa-spinner fa-spin"></i>';
    step5.labelHtml = '<span style="color:#103f79; font-weight:700;">Chairman Review</span>';
    step5.subText = 'Official 4 Active';
  }

  // If stage 6 (all 4 officials approved):
  if (pipeline.currentQueueStage === 6) {
    step1.nodeClass = "summary-step-node final-approved";
    step2.nodeClass = "summary-step-node final-approved";
    step3.nodeClass = "summary-step-node final-approved";
    step4.nodeClass = "summary-step-node final-approved";
    step5.nodeClass = "summary-step-node final-approved";
    step2.labelHtml = '<span style="color:#16a34a; font-weight:700;">Regional Cleared</span>';
    step2.subText = '<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Approved';
    step3.labelHtml = '<span style="color:#16a34a; font-weight:700;">EVC Cleared</span>';
    step3.subText = '<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Approved';
    step4.labelHtml = '<span style="color:#16a34a; font-weight:700;">SAC Cleared</span>';
    step4.subText = '<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Approved';
    step5.labelHtml = '<span style="color:#16a34a; font-weight:800;">Approved &amp; LOA Issued</span>';
    step5.subText = '<i class="fa-solid fa-stamp" style="color:#16a34a;"></i> Sanctioned';
  }

  const steps = [step1, step2, step3, step4, step5];

  let innerHtml = `
    <div class="stepper-track" style="top: 14px; left: 30px; right: 30px; z-index: 1;">
      <div class="stepper-track-fill" id="reportStepperTrackFill" style="width: ${widthPercent}%; background: ${trackColor}; transition: width 0.5s ease, background 0.5s ease;"></div>
    </div>
  `;

  steps.forEach(st => {
    innerHtml += `
      <div class="summary-step-item">
        <div class="${st.nodeClass}">${st.iconHtml}</div>
        <div class="summary-step-label">
          ${st.labelHtml}
          <div style="font-size: 10px; color: #64748b; font-weight: 500; margin-top: 2px;">${st.subText}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = innerHtml;

  // Synchronously update Report Metadata Badge & Download Button
  if (reportBadge) {
    if (pipeline.currentQueueStage === 6) {
      reportBadge.className = "status-pill-approved";
      reportBadge.style.cssText = "background:#dcfce7; color:#166534; border:1px solid #22c55e; padding:4px 10px; border-radius:12px; font-weight:700;";
      reportBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Approved &amp; LOA Issued';
    } else if (pipeline.isRejected) {
      reportBadge.className = "status-pill-rejected";
      reportBadge.style.cssText = "background:#fee2e2; color:#991b1b; border:1px solid #ef4444; padding:4px 10px; border-radius:12px; font-weight:700;";
      reportBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Deficiency Noticed (Stage ${pipeline.rejectedAtStage})`;
    } else {
      reportBadge.className = "status-pill-under-review";
      reportBadge.style.cssText = "background:#eff6ff; color:#1e40af; border:1px solid #93c5fd; padding:4px 10px; border-radius:12px; font-weight:700;";
      reportBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Under Review (Stage ${pipeline.currentQueueStage} of 5: ${window.getStageTitle(pipeline.currentQueueStage)})`;
    }
  }

  if (reportBtn) {
    if (pipeline.currentQueueStage === 6) {
      reportBtn.style.opacity = "1";
      reportBtn.style.cursor = "pointer";
      reportBtn.title = "Download AICTE Official Status Report & Approval Order";
      reportBtn.classList.add("pulse-ready");
    } else {
      reportBtn.style.opacity = "0.7";
      reportBtn.title = "Report locked until Chairman, AICTE grants final approval";
      reportBtn.classList.remove("pulse-ready");
    }
  }
};

window.downloadOfficialStatusReportPDF = function() {
  if (window.aicteApprovalPipeline.currentQueueStage !== 6) {
    if (window.aicteApprovalPipeline.isRejected) {
      alert(`Report Download Locked: Application currently has an active deficiency notice flagged at Stage ${window.aicteApprovalPipeline.rejectedAtStage} (${window.aicteApprovalPipeline.rejectedByOfficer ? window.aicteApprovalPipeline.rejectedByOfficer.name : 'AICTE Officials'}).\n\nPlease rectify the deficiency and obtain clearance through all official approval stages before downloading the Final Report.`);
    } else {
      alert(`Report Download Locked: Application is currently in progress at Stage ${window.aicteApprovalPipeline.currentQueueStage} of 5 (${window.getStageTitle(window.aicteApprovalPipeline.currentQueueStage)}).\n\nPer AICTE statutory workflow, the Official Approval Report & Order can only be downloaded once Official 4 (Chairman, AICTE) grants final approval.`);
    }
    return;
  }

  // Generate downloadable official status report file
  const reportContent = `================================================================================
ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
अखिल भारतीय तकनीकी शिक्षा परिषद
STATUTORY APPROVAL & COMPLIANCE ORDER - AY 2026-2027
================================================================================
Report Reference   : AICTE-ORDER-2026-SKCET01-LOA
Date of Issuance   : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Digital Hash       : SHA256: 0x9b83ac127f8841b9d40e9821ef37aa12
Seal Verification  : GOVT-OF-INDIA-AICTE-NEW-DELHI-DIGITAL-SIGN-VERIFIED

INSTITUTION PARTICULARS:
--------------------------------------------------------------------------------
Institution Name   : Sri Krishna College of Engineering and Technology
AICTE ID           : SKCET01 (Permanent ID: 1-2718-TN)
AISHE / Code       : C-26922 (College Code: 2718)
Location           : Kuniamuthur, Coimbatore, Tamil Nadu - 641008
Affiliating Univ   : Anna University, Chennai

APPLICATION & COURSE SANCTION:
--------------------------------------------------------------------------------
Application ID     : AICTE2026-001234
Sanctioned Program : Under Graduate Engineering & Technology
Approved Course    : Artificial Intelligence and Data Science (B.Tech - 4 Years)
Approved Intake    : 120 Seats
Academic Session   : 2026-2027

OFFICIAL 4-STAGE STATUTORY CLEARANCE TRAIL:
--------------------------------------------------------------------------------
1. Institution Submission:
   Status: COMPLETED (31 Oct 2026, 10:25 AM)
   All 4 statutory enclosures uploaded and validated via AI Pre-Scrutiny Engine.

2. Regional Scrutiny Office (Official 1):
   Officer: Dr. K. Senthil Kumar, Ph.D.
   Post   : Senior Regional Scrutiny Officer, AICTE SRO (Chennai)
   Status : VERIFIED & APPROVED (${window.aicteApprovalPipeline.stageTimestamps[2] || "31 Oct 2026"})
   Remarks: All statutory enclosures scrutinized against APH 2026 norms.

3. Expert Visit Committee (Official 2):
   Officer: Prof. Dr. S. Narayanan, Ph.D.
   Post   : Chairman, AICTE Expert Visit Committee (EVC)
   Status : VERIFIED & APPROVED (${window.aicteApprovalPipeline.stageTimestamps[3] || "31 Oct 2026"})
   Remarks: Built-up instructional area (25.40 Acres), labs, and FSR (1:18.4) verified on-site.

4. Standing Appellate Committee (Official 3):
   Officer: Justice (Retd.) Dr. V. Ramasubramanian, LL.D., Ph.D.
   Post   : Chairman, Standing Appellate Committee (SAC / SHC)
   Status : CLEARED & APPROVED (${window.aicteApprovalPipeline.stageTimestamps[4] || "31 Oct 2026"})
   Remarks: Legal and regulatory requirements fulfilled in conformity with AICTE Act 1987.

5. Apex Approval & Seal (Official 4):
   Officer: Prof. T. G. Sitharam, Ph.D.
   Post   : Chairman, All India Council for Technical Education (AICTE, New Delhi)
   Status : FINAL APPROVAL SANCTIONED & LOA ISSUED (${window.aicteApprovalPipeline.stageTimestamps[5] || "31 Oct 2026"})
   Remarks: Letter of Approval (LOA) sanctioned for AY 2026-27.

STATUTORY CERTIFICATE:
--------------------------------------------------------------------------------
The Council hereby conveys its formal Approval to Sri Krishna College of Engineering
and Technology for the addition of B.Tech Artificial Intelligence and Data Science
with an approved intake of 120 seats for Academic Year 2026-27.

[DIGITAL SEAL: PROF. T. G. SITHARAM, CHAIRMAN, AICTE]
Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
================================================================================`;

  const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "AICTE_Official_Approval_Order_AICTE2026-001234.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  window.AICTEWorkflow.logAudit(
    "Official Status Report & Order Downloaded",
    "Downloaded AICTE Statutory Approval Order for App #AICTE2026-001234."
  );

  alert("Official AICTE Approval Order & Status Report downloaded successfully!");
};

window.toggleUndertakingsLedger = function() {
  const container = document.getElementById("containerUndertakingsLedger");
  const txt = document.getElementById("txtToggleUndertakings");
  const icon = document.getElementById("iconToggleUndertakings");
  if (!container) return;

  if (container.style.display === "none" || !container.style.display) {
    container.style.display = "block";
    if (txt) txt.innerText = "Hide Time-Bound Undertakings Ledger";
    if (icon) icon.className = "fa-solid fa-chevron-up";
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    container.style.display = "none";
    if (txt) txt.innerText = "View Time-Bound Undertakings Ledger";
    if (icon) icon.className = "fa-solid fa-chevron-down";
  }
};

window.toggleNationalReportsLedger = function() {
  const container = document.getElementById("containerNationalReportsLedger");
  const txt = document.getElementById("txtToggleReports");
  const icon = document.getElementById("iconToggleReports");
  if (!container) return;

  if (container.style.display === "none" || !container.style.display) {
    container.style.display = "block";
    if (txt) txt.innerText = "Hide National Regional Analytics & Audit Trail";
    if (icon) icon.className = "fa-solid fa-chevron-up";
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    container.style.display = "none";
    if (txt) txt.innerText = "View National Regional Analytics & Immutable Digital Audit Trail";
    if (icon) icon.className = "fa-solid fa-chevron-down";
  }
};
