// Brutalist Contact Hub System
class BrutalistContactHub {
  constructor() {
    this.contactSection = document.getElementById("contactHubSection");
    this.calendarContainer = document.getElementById("calendarContainer");
    this.inquiryForm = document.getElementById("inquiryForm");
    this.conversionParticles = document.getElementById("conversionParticles");
    this.engagementStreams = document.getElementById("engagementStreams");

    // Calendar state
    this.currentDate = new Date();
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedMeetingType = "discovery";

    // Form state
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {};

    // Animation state
    this.particles = [];
    this.isAnimating = false;

    this.init();
  }

  init() {
    this.setupCalendarWidget();
    this.setupInquiryForm();
    this.setupContactMethods();
    this.setupAvailabilityDisplay();
    this.setupBackgroundEffects();
    this.setupScrollAnimations();
    this.startLiveUpdates();
  }

  setupCalendarWidget() {
    // Meeting type selection
    const meetingTypes = document.querySelectorAll(".meeting-type");
    meetingTypes.forEach((type) => {
      type.addEventListener("click", () => {
        meetingTypes.forEach((t) => t.classList.remove("active"));
        type.classList.add("active");
        this.selectedMeetingType = type.dataset.type;
        this.updateCalendarDisplay();
      });
    });

    // Calendar navigation
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");

    prevMonth?.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.generateCalendar();
    });

    nextMonth?.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.generateCalendar();
    });

    // Book meeting button
    const bookMeetingBtn = document.getElementById("bookMeetingBtn");
    bookMeetingBtn?.addEventListener("click", () => {
      this.handleMeetingBooking();
    });

    // Generate initial calendar
    this.generateCalendar();
    this.setupTimeSlots();
  }

  generateCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    const calendarMonth = document.getElementById("calendarMonth");

    if (!calendarGrid || !calendarMonth) return;

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
    calendarMonth.textContent = `${
      monthNames[this.currentDate.getMonth()]
    } ${this.currentDate.getFullYear()}`;

    // Clear existing calendar
    calendarGrid.innerHTML = "";

    // Add day headers
    const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayHeaders.forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.className = "calendar-day-header";
      dayHeader.textContent = day;
      dayHeader.style.cssText = `
        font-family: "JetBrains Mono", monospace;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--accent-cyan);
        text-align: center;
        padding: 0.5rem;
      `;
      calendarGrid.appendChild(dayHeader);
    });

    // Get first day of month and number of days
    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );
    const startDate = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < startDate; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "calendar-day disabled";
      calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";
      dayElement.textContent = day;

      const dayDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
      const today = new Date();

      // Disable past dates
      if (dayDate < today) {
        dayElement.classList.add("disabled");
      } else {
        dayElement.addEventListener("click", () => {
          document
            .querySelectorAll(".calendar-day")
            .forEach((d) => d.classList.remove("selected"));
          dayElement.classList.add("selected");
          this.selectedDate = dayDate;
          this.updateTimeSlots();
        });
      }

      calendarGrid.appendChild(dayElement);
    }
  }

  setupTimeSlots() {
    const timeSlots = document.querySelectorAll(".time-slot");
    timeSlots.forEach((slot) => {
      if (slot.classList.contains("available")) {
        slot.addEventListener("click", () => {
          timeSlots.forEach((s) => s.classList.remove("selected"));
          slot.classList.add("selected");
          this.selectedTime = slot.dataset.time;
          this.updateBookingButton();
        });
      }
    });
  }

  updateTimeSlots() {
    // Simulate different availability based on selected date
    const timeSlots = document.querySelectorAll(".time-slot");
    timeSlots.forEach((slot) => {
      slot.classList.remove("booked", "available", "selected");

      // Random availability simulation
      if (Math.random() > 0.3) {
        slot.classList.add("available");
      } else {
        slot.classList.add("booked");
      }
    });

    this.setupTimeSlots();
  }

  updateBookingButton() {
    const bookMeetingBtn = document.getElementById("bookMeetingBtn");
    if (this.selectedDate && this.selectedTime) {
      bookMeetingBtn.disabled = false;
      bookMeetingBtn.style.opacity = "1";
    } else {
      bookMeetingBtn.disabled = true;
      bookMeetingBtn.style.opacity = "0.6";
    }
  }

  handleMeetingBooking() {
    if (!this.selectedDate || !this.selectedTime) {
      this.showNotification("Please select a date and time", "error");
      return;
    }

    const bookMeetingBtn = document.getElementById("bookMeetingBtn");
    const originalText = bookMeetingBtn.querySelector(".btn-text").textContent;

    // Show booking animation
    bookMeetingBtn.querySelector(".btn-text").textContent = "BOOKING...";
    bookMeetingBtn.disabled = true;

    // Simulate booking process
    setTimeout(() => {
      bookMeetingBtn.querySelector(".btn-text").textContent = "✓ BOOKED!";
      this.showNotification(
        "Meeting booked successfully! Calendar invite sent.",
        "success"
      );

      setTimeout(() => {
        bookMeetingBtn.querySelector(".btn-text").textContent = originalText;
        bookMeetingBtn.disabled = false;
        this.resetCalendarSelection();
      }, 2000);
    }, 1500);
  }

  resetCalendarSelection() {
    document
      .querySelectorAll(".calendar-day")
      .forEach((d) => d.classList.remove("selected"));
    document
      .querySelectorAll(".time-slot")
      .forEach((s) => s.classList.remove("selected"));
    this.selectedDate = null;
    this.selectedTime = null;
    this.updateBookingButton();
  }

  setupInquiryForm() {
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");
    const budgetSlider = document.getElementById("budgetSlider");
    const budgetAmount = document.getElementById("budgetAmount");

    // Form navigation
    nextBtn?.addEventListener("click", () => this.nextStep());
    prevBtn?.addEventListener("click", () => this.prevStep());
    submitBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.submitInquiry();
    });

    // Budget slider
    budgetSlider?.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      budgetAmount.textContent = `$${value.toLocaleString()}`;
    });

    // Project type selection
    const projectTypes = document.querySelectorAll(".project-type");
    projectTypes.forEach((type) => {
      type.addEventListener("click", () => {
        projectTypes.forEach((t) => t.classList.remove("selected"));
        type.classList.add("selected");
        this.formData.projectType = type.dataset.type;
      });
    });

    // Character counter for textarea
    const textarea = document.querySelector(
      'textarea[name="projectDescription"]'
    );
    const counter = document.querySelector(".character-counter");

    textarea?.addEventListener("input", (e) => {
      const length = e.target.value.length;
      counter.textContent = `${length}/500`;

      if (length > 450) {
        counter.style.color = "#ff4444";
      } else {
        counter.style.color = "rgba(255, 255, 255, 0.5)";
      }
    });

    // Form validation
    this.setupFormValidation();
  }

  setupFormValidation() {
    const form = this.inquiryForm;
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (field.type === "tel" && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
        isValid = false;
        errorMessage = "Please enter a valid phone number";
      }
    }

    this.showFieldValidation(field, isValid, errorMessage);
    return isValid;
  }

  showFieldValidation(field, isValid, errorMessage) {
    // Remove existing error
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    if (!isValid) {
      field.style.borderColor = "#ff4444";

      const errorElement = document.createElement("div");
      errorElement.className = "field-error";
      errorElement.textContent = errorMessage;
      errorElement.style.cssText = `
        font-family: "JetBrains Mono", monospace;
        font-size: 0.75rem;
        color: #ff4444;
        margin-top: 0.25rem;
      `;
      field.parentNode.appendChild(errorElement);
    } else {
      field.style.borderColor = "var(--accent-green)";
    }
  }

  clearFieldError(field) {
    field.style.borderColor = "rgba(255, 255, 255, 0.3)";
    const errorElement = field.parentNode.querySelector(".field-error");
    if (errorElement) {
      errorElement.remove();
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      // Validate current step
      if (this.validateCurrentStep()) {
        this.currentStep++;
        this.updateFormStep();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateFormStep();
    }
  }

  validateCurrentStep() {
    const currentStepElement = document.querySelector(
      `.form-step[data-step="${this.currentStep}"]`
    );
    const requiredFields = currentStepElement.querySelectorAll(
      "input[required], textarea[required]"
    );

    let isValid = true;
    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Step-specific validation
    if (this.currentStep === 1) {
      const selectedProjectType = document.querySelector(
        ".project-type.selected"
      );
      if (!selectedProjectType) {
        this.showNotification("Please select a project type", "error");
        isValid = false;
      }
    }

    return isValid;
  }

  updateFormStep() {
    // Hide all steps
    document.querySelectorAll(".form-step").forEach((step) => {
      step.classList.remove("active");
    });

    // Show current step
    const currentStepElement = document.querySelector(
      `.form-step[data-step="${this.currentStep}"]`
    );
    currentStepElement.classList.add("active");

    // Update progress
    this.updateFormProgress();

    // Update navigation buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    prevBtn.style.display = this.currentStep === 1 ? "none" : "block";

    if (this.currentStep === this.totalSteps) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "block";
    } else {
      nextBtn.style.display = "block";
      submitBtn.style.display = "none";
    }

    // Animate step transition
    this.animateStepTransition();
  }

  updateFormProgress() {
    const progressFill = document.getElementById("progressFill");
    const progressSteps = document.querySelectorAll(".progress-step");

    const progressPercentage = (this.currentStep / this.totalSteps) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    progressSteps.forEach((step, index) => {
      if (index < this.currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  animateStepTransition() {
    const currentStepElement = document.querySelector(
      `.form-step[data-step="${this.currentStep}"]`
    );
    currentStepElement.style.opacity = "0";
    currentStepElement.style.transform = "translateX(20px)";

    setTimeout(() => {
      currentStepElement.style.transition = "all 0.3s ease";
      currentStepElement.style.opacity = "1";
      currentStepElement.style.transform = "translateX(0)";
    }, 50);
  }

  submitInquiry() {
    if (!this.validateCurrentStep()) {
      return;
    }

    const submitBtn = document.getElementById("submitBtn");
    const originalText = submitBtn.querySelector(".btn-text").textContent;

    // Collect form data
    this.collectFormData();

    // Show submission animation
    submitBtn.querySelector(".btn-text").textContent = "SUBMITTING...";
    submitBtn.disabled = true;

    // Simulate submission process
    setTimeout(() => {
      submitBtn.querySelector(".btn-text").textContent = "✓ SUBMITTED!";
      this.showNotification(
        "Inquiry submitted successfully! We'll respond within 48 hours.",
        "success"
      );

      setTimeout(() => {
        this.resetForm();
        submitBtn.querySelector(".btn-text").textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }, 2000);
  }

  collectFormData() {
    const formElements = this.inquiryForm.querySelectorAll(
      "input, textarea, select"
    );
    formElements.forEach((element) => {
      if (element.type === "checkbox" || element.type === "radio") {
        if (element.checked) {
          if (!this.formData[element.name]) {
            this.formData[element.name] = [];
          }
          this.formData[element.name].push(element.value);
        }
      } else {
        this.formData[element.name] = element.value;
      }
    });

    console.log("Form Data Collected:", this.formData);
  }

  resetForm() {
    this.currentStep = 1;
    this.formData = {};
    this.updateFormStep();
    this.inquiryForm.reset();

    // Reset selections
    document
      .querySelectorAll(".project-type")
      .forEach((t) => t.classList.remove("selected"));
    document
      .querySelectorAll(".progress-step")
      .forEach((s) => s.classList.remove("active"));
    document
      .querySelector(".progress-step[data-step='1']")
      .classList.add("active");
  }

  setupContactMethods() {
    const contactMethods = document.querySelectorAll(".contact-method");

    contactMethods.forEach((method) => {
      const methodBtn = method.querySelector(".method-btn");

      methodBtn?.addEventListener("click", () => {
        const action = methodBtn.dataset.action;
        this.handleContactMethod(action, methodBtn);
      });

      // Hover effects
      method.addEventListener("mouseenter", () => {
        method.style.transform = "translateY(-5px) scale(1.02)";
      });

      method.addEventListener("mouseleave", () => {
        method.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  handleContactMethod(action, button) {
    const originalText = button.querySelector(".btn-text").textContent;

    switch (action) {
      case "whatsapp":
        button.querySelector(".btn-text").textContent = "OPENING WHATSAPP...";
        setTimeout(() => {
          window.open("https://wa.me/1234567890", "_blank");
          button.querySelector(".btn-text").textContent = originalText;
        }, 1000);
        break;

      case "email":
        button.querySelector(".btn-text").textContent = "OPENING EMAIL...";
        setTimeout(() => {
          window.location.href =
            "mailto:contact@example.com?subject=Project Inquiry";
          button.querySelector(".btn-text").textContent = originalText;
        }, 1000);
        break;

      case "linkedin":
        button.querySelector(".btn-text").textContent = "OPENING LINKEDIN...";
        setTimeout(() => {
          window.open("https://linkedin.com/in/example", "_blank");
          button.querySelector(".btn-text").textContent = originalText;
        }, 1000);
        break;

      case "telegram":
        button.querySelector(".btn-text").textContent = "OPENING TELEGRAM...";
        setTimeout(() => {
          window.open("https://t.me/example", "_blank");
          button.querySelector(".btn-text").textContent = originalText;
        }, 1000);
        break;

      case "phone":
        button.querySelector(".btn-text").textContent =
          "INITIATING CALLBACK...";
        setTimeout(() => {
          this.showNotification(
            "Callback scheduled! We'll call you within 30 minutes.",
            "success"
          );
          button.querySelector(".btn-text").textContent = originalText;
        }, 1500);
        break;

      case "emergency":
        button.querySelector(".btn-text").textContent =
          "PRIORITY ALERT SENT...";
        setTimeout(() => {
          this.showNotification(
            "Emergency support activated! Response within 1 hour.",
            "success"
          );
          button.querySelector(".btn-text").textContent = originalText;
        }, 1500);
        break;
    }
  }

  setupAvailabilityDisplay() {
    this.updateCurrentTime();
    this.updateWorkloadIndicator();

    // Update time every minute
    setInterval(() => {
      this.updateCurrentTime();
    }, 60000);
  }

  updateCurrentTime() {
    const currentTimeElement = document.querySelector(".current-time");
    if (!currentTimeElement) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

    currentTimeElement.textContent = `Currently ${timeString} in New York`;
  }

  updateWorkloadIndicator() {
    const workloadFill = document.querySelector(".workload-fill");
    const workloadText = document.querySelector(".workload-text");

    if (!workloadFill || !workloadText) return;

    // Simulate dynamic workload
    const workload = Math.floor(Math.random() * 30) + 60; // 60-90%
    workloadFill.style.width = `${workload}%`;

    let status = "Accepting new projects";
    if (workload > 85) {
      status = "Limited availability";
    } else if (workload > 95) {
      status = "Fully booked";
    }

    workloadText.textContent = `${workload}% capacity • ${status}`;
  }

  setupBackgroundEffects() {
    this.createConversionParticles();
    this.createEngagementStreams();
  }

  createConversionParticles() {
    if (!this.conversionParticles) return;

    // Create floating particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: ${
          Math.random() > 0.5 ? "var(--accent-cyan)" : "var(--accent-purple)"
        };
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.6 + 0.2};
        animation: particleFloat ${
          Math.random() * 10 + 8
        }s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;

      this.conversionParticles.appendChild(particle);
      this.particles.push(particle);
    }
  }

  createEngagementStreams() {
    if (!this.engagementStreams) return;

    // Create flowing data streams
    for (let i = 0; i < 5; i++) {
      const stream = document.createElement("div");
      stream.style.cssText = `
        position: absolute;
        width: 2px;
        height: 100px;
        background: linear-gradient(to bottom, transparent, var(--accent-cyan), transparent);
        left: ${Math.random() * 100}%;
        top: -100px;
        animation: streamFlow ${Math.random() * 8 + 6}s linear infinite;
        animation-delay: ${Math.random() * 3}s;
      `;

      this.engagementStreams.appendChild(stream);
    }
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");

            // Trigger specific animations
            if (entry.target.classList.contains("contact-methods")) {
              this.animateContactMethods();
            } else if (
              entry.target.classList.contains("availability-display")
            ) {
              this.animateAvailabilityDisplay();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe key elements
    const elementsToObserve = [
      ".calendar-widget",
      ".inquiry-form",
      ".contact-methods",
      ".availability-display",
    ];

    elementsToObserve.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });
  }

  animateContactMethods() {
    const methods = document.querySelectorAll(".contact-method");
    methods.forEach((method, index) => {
      setTimeout(() => {
        method.style.transform = "translateY(0)";
        method.style.opacity = "1";
      }, index * 100);
    });
  }

  animateAvailabilityDisplay() {
    const workloadFill = document.querySelector(".workload-fill");
    if (workloadFill) {
      const targetWidth = workloadFill.style.width;
      workloadFill.style.width = "0%";

      setTimeout(() => {
        workloadFill.style.transition = "width 2s ease-out";
        workloadFill.style.width = targetWidth;
      }, 500);
    }
  }

  startLiveUpdates() {
    // Simulate live availability updates
    setInterval(() => {
      this.updateWorkloadIndicator();
    }, 30000); // Every 30 seconds

    // Update particle positions
    setInterval(() => {
      this.updateParticlePositions();
    }, 100);
  }

  updateParticlePositions() {
    this.particles.forEach((particle) => {
      if (Math.random() > 0.98) {
        particle.style.background =
          Math.random() > 0.5 ? "var(--accent-cyan)" : "var(--accent-purple)";
      }
    });
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${
        type === "error"
          ? "#ff4444"
          : type === "success"
          ? "#00ff00"
          : "var(--accent-cyan)"
      };
      color: ${
        type === "success" ? "var(--primary-black)" : "var(--primary-white)"
      };
      padding: 1rem 2rem;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.875rem;
      font-weight: 700;
      z-index: 10000;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
}

// Add required CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes particleFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(180deg); }
  }
  
  @keyframes streamFlow {
    0% { top: -100px; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100vh; opacity: 0; }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .animate-in {
    animation: slideInUp 0.8s ease-out forwards;
  }
  
  @keyframes slideInUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Initialize the contact hub when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistContactHub();
});
