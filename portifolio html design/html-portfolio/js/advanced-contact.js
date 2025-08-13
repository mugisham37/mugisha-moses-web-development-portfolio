/**
 * Advanced Contact System
 * Multi-step form with validation, auto-save, pricing calculator, and calendar
 */

class AdvancedContactSystem {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {};
    this.validationRules = {};
    this.debounceTimers = {};
    this.autoSaveKey = "advanced-contact-form-data";

    this.init();
  }

  init() {
    this.setupElements();
    this.setupValidationRules();
    this.setupEventListeners();
    this.loadSavedData();
    this.initializeCalendar();
    this.initializeTimezoneClocks();
    this.initializeContactMethods();
    this.updatePricingEstimate();
  }

  setupElements() {
    this.form = document.getElementById("advanced-contact-form");
    this.progressBar = document.querySelector(".form-progress__fill");
    this.progressSteps = document.querySelectorAll(".form-progress__step");
    this.formSteps = document.querySelectorAll(".form-step");
    this.nextButtons = document.querySelectorAll(".form-step__next");
    this.prevButtons = document.querySelectorAll(".form-step__prev");
    this.autoSaveIndicator = document.getElementById("auto-save-indicator");
    this.pricingEstimate = document.getElementById("estimated-cost");
    this.calendarGrid = document.getElementById("calendar-grid");
    this.calendarMonth = document.getElementById("calendar-month");
    this.calendarPrev = document.getElementById("calendar-prev");
    this.calendarNext = document.getElementById("calendar-next");
  }

  setupValidationRules() {
    this.validationRules = {
      project_type: { required: true },
      budget: { required: true },
      timeline: { required: true },
      description: { required: true, minLength: 20 },
      name: { required: true, minLength: 2 },
      email: { required: true, email: true },
    };
  }

  setupEventListeners() {
    // Step navigation
    this.nextButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleNextStep(e));
    });

    this.prevButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handlePrevStep(e));
    });

    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Real-time validation and auto-save
    this.form.addEventListener("input", (e) => this.handleInput(e));
    this.form.addEventListener("change", (e) => this.handleChange(e));

    // Project type selection
    const projectTypeInputs = document.querySelectorAll(
      'input[name="project_type"]'
    );
    projectTypeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.updatePricingEstimate();
        this.validateStep(1);
      });
    });

    // Calendar navigation
    this.calendarPrev.addEventListener("click", () =>
      this.navigateCalendar(-1)
    );
    this.calendarNext.addEventListener("click", () => this.navigateCalendar(1));
  }

  handleInput(e) {
    const field = e.target;
    const fieldName = field.name;

    // Debounced validation
    if (this.debounceTimers[fieldName]) {
      clearTimeout(this.debounceTimers[fieldName]);
    }

    this.debounceTimers[fieldName] = setTimeout(() => {
      this.validateField(field);
      this.autoSave();
    }, 300);
  }

  handleChange(e) {
    const field = e.target;
    this.validateField(field);
    this.autoSave();
  }

  handleNextStep(e) {
    e.preventDefault();

    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateStepDisplay();
        this.updateProgressBar();
      }
    }
  }

  handlePrevStep(e) {
    e.preventDefault();

    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
      this.updateProgressBar();
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateStep(this.currentStep)) {
      this.submitForm();
    }
  }

  validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = this.validationRules[fieldName];
    const errorElement = field.parentNode.querySelector(".form-error");

    if (!rules) return true;

    let isValid = true;
    let errorMessage = "";

    // Required validation
    if (rules.required && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }

    // Email validation
    if (rules.email && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }

    // Minimum length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `Minimum ${rules.minLength} characters required`;
    }

    // Update field appearance
    field.classList.toggle("error", !isValid);
    field.classList.toggle("success", isValid && value);
    field.setAttribute("aria-invalid", !isValid);

    // Update error message
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  validateStep(stepNumber) {
    const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    const fields = stepElement.querySelectorAll("input, select, textarea");
    let isStepValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isStepValid = false;
      }
    });

    // Update next button state
    const nextButton = stepElement.querySelector(".form-step__next");
    if (nextButton) {
      nextButton.disabled = !isStepValid;
    }

    return isStepValid;
  }

  updateStepDisplay() {
    // Update form steps
    this.formSteps.forEach((step, index) => {
      step.classList.toggle(
        "form-step--active",
        index + 1 === this.currentStep
      );
    });

    // Update progress steps
    this.progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.toggle(
        "form-progress__step--active",
        stepNumber === this.currentStep
      );
      step.classList.toggle(
        "form-progress__step--completed",
        stepNumber < this.currentStep
      );
    });

    // Update progress bar aria-valuenow
    const progressBar = document.querySelector(".form-progress");
    progressBar.setAttribute("aria-valuenow", this.currentStep);
  }

  updateProgressBar() {
    const percentage = (this.currentStep / this.totalSteps) * 100;
    this.progressBar.style.width = `${percentage}%`;
  }

  autoSave() {
    // Collect form data
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Save to sessionStorage
    sessionStorage.setItem(
      this.autoSaveKey,
      JSON.stringify({
        data,
        currentStep: this.currentStep,
        timestamp: Date.now(),
      })
    );

    // Show auto-save indicator
    this.showAutoSaveIndicator();
  }

  loadSavedData() {
    const savedData = sessionStorage.getItem(this.autoSaveKey);

    if (savedData) {
      try {
        const { data, currentStep, timestamp } = JSON.parse(savedData);

        // Check if data is not too old (24 hours)
        const maxAge = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < maxAge) {
          // Restore form data
          Object.keys(data).forEach((key) => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
              if (field.type === "radio") {
                const radioField = this.form.querySelector(
                  `[name="${key}"][value="${data[key]}"]`
                );
                if (radioField) radioField.checked = true;
              } else {
                field.value = data[key];
              }
            }
          });

          // Restore current step
          this.currentStep = currentStep || 1;
          this.updateStepDisplay();
          this.updateProgressBar();
          this.updatePricingEstimate();
        }
      } catch (error) {
        console.warn("Failed to load saved form data:", error);
      }
    }
  }

  showAutoSaveIndicator() {
    this.autoSaveIndicator.classList.add("auto-save-indicator--visible");

    setTimeout(() => {
      this.autoSaveIndicator.classList.remove("auto-save-indicator--visible");
    }, 2000);
  }

  updatePricingEstimate() {
    const selectedProjectType = document.querySelector(
      'input[name="project_type"]:checked'
    );
    const budgetSelect = document.querySelector('select[name="budget"]');

    if (!selectedProjectType) {
      this.pricingEstimate.textContent = "Select project type to see estimate";
      return;
    }

    const projectType = selectedProjectType.value;
    const budget = budgetSelect ? budgetSelect.value : "";

    // Base pricing by project type
    const basePricing = {
      website: { min: 5000, max: 15000, label: "$5,000 - $15,000" },
      "web-app": { min: 15000, max: 50000, label: "$15,000 - $50,000" },
      ecommerce: { min: 20000, max: 60000, label: "$20,000 - $60,000" },
      "mobile-app": { min: 25000, max: 80000, label: "$25,000 - $80,000" },
      api: { min: 10000, max: 30000, label: "$10,000 - $30,000" },
      consulting: { min: 200, max: 300, label: "$200 - $300/hour" },
    };

    const pricing = basePricing[projectType];
    if (pricing) {
      this.pricingEstimate.textContent = pricing.label;
    } else {
      this.pricingEstimate.textContent = "Contact for custom quote";
    }
  }

  initializeCalendar() {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.renderCalendar();
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Update month display
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.calendarMonth.textContent = `${monthNames[month]} ${year}`;

    // Clear calendar grid
    this.calendarGrid.innerHTML = "";

    // Add day headers
    const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayHeaders.forEach((day) => {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day calendar-day--header";
      dayElement.textContent = day;
      this.calendarGrid.appendChild(dayElement);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day calendar-day--other-month";
      this.calendarGrid.appendChild(dayElement);
    }

    // Enhanced availability logic with more realistic patterns
    const availabilityPattern = this.generateAvailabilityPattern(
      year,
      month,
      daysInMonth
    );

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";
      dayElement.textContent = day;

      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);

      const isToday = currentDate.getTime() === today.getTime();
      const isPast = currentDate < today;
      const isWeekend =
        currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const isAvailable = availabilityPattern[day - 1] && !isPast;

      // Add appropriate classes and event listeners
      if (isPast) {
        dayElement.classList.add("calendar-day--past");
      } else if (isAvailable) {
        dayElement.classList.add("calendar-day--available");
        dayElement.setAttribute("title", "Available for consultation");
        dayElement.addEventListener("click", () =>
          this.selectDate(currentDate)
        );
      } else {
        dayElement.classList.add("calendar-day--busy");
        dayElement.setAttribute("title", "Not available");
      }

      if (isToday) {
        dayElement.classList.add("calendar-day--today");
      }

      if (isWeekend && !isPast) {
        dayElement.classList.add("calendar-day--weekend");
      }

      this.calendarGrid.appendChild(dayElement);
    }
  }

  generateAvailabilityPattern(year, month, daysInMonth) {
    // Generate a more realistic availability pattern
    const pattern = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      // Base availability: weekdays more likely to be available
      let baseAvailability = dayOfWeek >= 1 && dayOfWeek <= 5 ? 0.8 : 0.3;

      // Reduce availability for certain patterns (meetings, etc.)
      if (day % 7 === 0) baseAvailability *= 0.5; // Every 7th day less available
      if (dayOfWeek === 1) baseAvailability *= 0.7; // Mondays slightly less available
      if (dayOfWeek === 5) baseAvailability *= 0.9; // Fridays slightly less available

      pattern.push(Math.random() < baseAvailability);
    }

    return pattern;
  }

  navigateCalendar(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendar();
  }

  selectDate(date) {
    // Remove previous selection
    document.querySelectorAll(".calendar-day--selected").forEach((day) => {
      day.classList.remove("calendar-day--selected");
    });

    // Add selection to clicked date
    event.target.classList.add("calendar-day--selected");
    this.selectedDate = date;

    // Show selected date feedback
    this.showDateSelection(date);

    console.log("Selected date:", date.toDateString());
  }

  showDateSelection(date) {
    const selectedDateDisplay = document.getElementById(
      "selected-date-display"
    );
    if (selectedDateDisplay) {
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      selectedDateDisplay.innerHTML = `
        <div class="selected-date-info">
          <span class="selected-date-label">SELECTED DATE:</span>
          <span class="selected-date-value">${formattedDate}</span>
          <button class="btn btn--sm btn--secondary clear-date-btn" onclick="advancedContactSystem.clearDateSelection()">
            CLEAR
          </button>
        </div>
      `;
      selectedDateDisplay.style.display = "block";
    }
  }

  clearDateSelection() {
    document.querySelectorAll(".calendar-day--selected").forEach((day) => {
      day.classList.remove("calendar-day--selected");
    });

    this.selectedDate = null;

    const selectedDateDisplay = document.getElementById(
      "selected-date-display"
    );
    if (selectedDateDisplay) {
      selectedDateDisplay.style.display = "none";
    }
  }

  initializeTimezoneClocks() {
    this.updateTimezoneClocks();
    // Update every second for real-time display
    setInterval(() => this.updateTimezoneClocks(), 1000);

    // Initialize response time status indicator
    this.initializeResponseTimeStatus();
  }

  updateTimezoneClocks() {
    const now = new Date();

    // San Francisco (PST/PDT)
    const sfTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );
    document.getElementById("sf-time").textContent = this.formatTime(sfTime);

    // New York (EST/EDT)
    const nyTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    document.getElementById("ny-time").textContent = this.formatTime(nyTime);

    // London (GMT/BST)
    const londonTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/London" })
    );
    document.getElementById("london-time").textContent =
      this.formatTime(londonTime);

    // Tokyo (JST)
    const tokyoTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
    );
    document.getElementById("tokyo-time").textContent =
      this.formatTime(tokyoTime);

    // Sydney (AEST/AEDT)
    const sydneyTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Australia/Sydney" })
    );
    document.getElementById("sydney-time").textContent =
      this.formatTime(sydneyTime);
  }

  initializeResponseTimeStatus() {
    this.updateResponseTimeStatus();
    // Update response time status every 30 seconds
    setInterval(() => this.updateResponseTimeStatus(), 30000);
  }

  updateResponseTimeStatus() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Business hours: Monday-Friday, 9 AM - 6 PM PST
    const isBusinessHours = day >= 1 && day <= 5 && hour >= 9 && hour <= 18;

    const statusIndicator = document.getElementById(
      "response-status-indicator"
    );
    const statusText = document.getElementById("response-status-text");

    if (statusIndicator && statusText) {
      if (isBusinessHours) {
        statusIndicator.className =
          "response-status-indicator response-status-indicator--online";
        statusText.textContent = "ONLINE - Typically respond within 2 hours";
      } else {
        statusIndicator.className =
          "response-status-indicator response-status-indicator--away";
        statusText.textContent = "AWAY - Will respond within 24 hours";
      }
    }
  }

  formatTime(date) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  submitForm() {
    // Show loading state
    this.showSubmissionFeedback("loading");

    // Collect all form data
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Add selected date if any
    if (this.selectedDate) {
      data.preferred_date = this.selectedDate.toISOString();
    }

    // Add submission timestamp
    data.submitted_at = new Date().toISOString();

    // Simulate form submission with realistic delay
    setTimeout(() => {
      console.log("Form submitted with data:", data);

      // Show success feedback
      this.showSubmissionFeedback("success", data);

      // Clear saved data
      sessionStorage.removeItem(this.autoSaveKey);

      // Reset form after delay
      setTimeout(() => {
        this.resetForm();
      }, 5000);
    }, 2000); // Simulate network delay
  }

  showSubmissionFeedback(type, data = null) {
    const feedbackContainer = document.getElementById("submission-feedback");
    if (!feedbackContainer) return;

    feedbackContainer.style.display = "block";
    feedbackContainer.scrollIntoView({ behavior: "smooth" });

    switch (type) {
      case "loading":
        feedbackContainer.innerHTML = `
          <div class="submission-feedback submission-feedback--loading">
            <div class="submission-feedback__icon">⏳</div>
            <h3 class="submission-feedback__title">SENDING YOUR INQUIRY...</h3>
            <p class="submission-feedback__message">Please wait while we process your request.</p>
            <div class="submission-feedback__loader">
              <div class="loader-bar"></div>
            </div>
          </div>
        `;
        break;

      case "success":
        const responseTime = this.getEstimatedResponseTime();
        feedbackContainer.innerHTML = `
          <div class="submission-feedback submission-feedback--success">
            <div class="submission-feedback__icon">✅</div>
            <h3 class="submission-feedback__title">INQUIRY SENT SUCCESSFULLY!</h3>
            <div class="submission-feedback__details">
              <p class="submission-feedback__message">
                Thank you for your project inquiry! I've received your request and will respond within <strong>${responseTime}</strong>.
              </p>
              <div class="submission-feedback__next-steps">
                <h4>WHAT HAPPENS NEXT:</h4>
                <ul>
                  <li>I'll review your project requirements</li>
                  <li>Prepare a detailed proposal with timeline and pricing</li>
                  <li>Schedule a consultation call if needed</li>
                  <li>Send you a comprehensive project plan</li>
                </ul>
              </div>
              ${
                this.selectedDate
                  ? `
                <div class="submission-feedback__selected-date">
                  <strong>PREFERRED CONSULTATION DATE:</strong><br>
                  ${this.selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              `
                  : ""
              }
              <div class="submission-feedback__contact-info">
                <p><strong>CONFIRMATION ID:</strong> #${this.generateConfirmationId()}</p>
                <p><strong>EMERGENCY CONTACT:</strong> Available for existing clients only</p>
              </div>
            </div>
            <button class="btn btn--accent btn--lg" onclick="advancedContactSystem.resetForm()">
              START NEW INQUIRY
            </button>
          </div>
        `;
        break;

      case "error":
        feedbackContainer.innerHTML = `
          <div class="submission-feedback submission-feedback--error">
            <div class="submission-feedback__icon">❌</div>
            <h3 class="submission-feedback__title">SUBMISSION FAILED</h3>
            <p class="submission-feedback__message">
              There was an error sending your inquiry. Please try again or contact me directly.
            </p>
            <div class="submission-feedback__actions">
              <button class="btn btn--accent" onclick="advancedContactSystem.submitForm()">
                TRY AGAIN
              </button>
              <a href="mailto:hello@brutalistdev.com" class="btn btn--secondary">
                EMAIL DIRECTLY
              </a>
            </div>
          </div>
        `;
        break;
    }
  }

  getEstimatedResponseTime() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Business hours: Monday-Friday, 9 AM - 6 PM PST
    const isBusinessHours = day >= 1 && day <= 5 && hour >= 9 && hour <= 18;

    return isBusinessHours ? "2 hours" : "24 hours";
  }

  generateConfirmationId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return (timestamp + random).toUpperCase();
  }

  resetForm() {
    // Reset form
    this.form.reset();
    this.currentStep = 1;
    this.updateStepDisplay();
    this.updateProgressBar();
    this.clearDateSelection();

    // Hide feedback
    const feedbackContainer = document.getElementById("submission-feedback");
    if (feedbackContainer) {
      feedbackContainer.style.display = "none";
    }

    // Scroll to top of form
    this.form.scrollIntoView({ behavior: "smooth" });
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Enhanced contact method interactions
  initializeContactMethods() {
    const emergencyContact = document.querySelector(
      ".contact-method--emergency"
    );
    if (emergencyContact) {
      emergencyContact.addEventListener(
        "click",
        this.handleEmergencyContact.bind(this)
      );
    }

    // Add click tracking for contact methods
    const contactMethods = document.querySelectorAll(
      ".contact-method:not(.contact-method--emergency)"
    );
    contactMethods.forEach((method) => {
      method.addEventListener("click", (e) => {
        const methodType = this.getContactMethodType(e.currentTarget);
        console.log(`Contact method clicked: ${methodType}`);

        // Add visual feedback
        e.currentTarget.style.transform = "scale(0.98)";
        setTimeout(() => {
          e.currentTarget.style.transform = "";
        }, 150);
      });
    });
  }

  handleEmergencyContact(e) {
    e.preventDefault();

    // Show emergency contact modal/info
    const modal = document.createElement("div");
    modal.className = "emergency-contact-modal";
    modal.innerHTML = `
      <div class="emergency-contact-content">
        <h3>EMERGENCY CONTACT</h3>
        <p>Emergency support is available exclusively for existing clients with active projects.</p>
        <div class="emergency-contact-info">
          <p><strong>EMERGENCY HOTLINE:</strong> +1 (234) 567-8911</p>
          <p><strong>AVAILABLE:</strong> 24/7 for critical issues</p>
          <p><strong>RESPONSE TIME:</strong> Within 30 minutes</p>
        </div>
        <div class="emergency-contact-note">
          <p><strong>WHAT QUALIFIES AS EMERGENCY:</strong></p>
          <ul>
            <li>Production website down</li>
            <li>Security breach or vulnerability</li>
            <li>Critical functionality failure</li>
            <li>Data loss or corruption</li>
          </ul>
        </div>
        <div class="emergency-contact-actions">
          <button class="btn btn--accent" onclick="this.closest('.emergency-contact-modal').remove()">
            UNDERSTOOD
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 10000);
  }

  getContactMethodType(element) {
    const href = element.getAttribute("href");
    if (href) {
      if (href.startsWith("mailto:")) return "email";
      if (href.startsWith("tel:")) return "phone";
      if (href.includes("calendly")) return "calendar";
      if (href.includes("linkedin")) return "linkedin";
    }
    return "unknown";
  }
}

// Initialize when DOM is loaded
let advancedContactSystem;
document.addEventListener("DOMContentLoaded", () => {
  advancedContactSystem = new AdvancedContactSystem();
});
