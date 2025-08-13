/* ==========================================================================
   HOVER ORCHESTRATION SYSTEM
   Coordinated element interactions and hover choreography
   ========================================================================== */

class HoverOrchestrationSystem {
  constructor() {
    this.orchestrations = new Map();
    this.activeHovers = new Set();
    this.hoverTimelines = new Map();
    this.coordinatedGroups = new Map();
    this.isInitialized = false;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Performance settings
    this.maxConcurrentHovers = 5;
    this.hoverThrottleDelay = 50;
    
    this.init();
  }

  /**
   * Initialize hover orchestration system
   */
  init() {
    if (this.isInitialized) return;
    
    if (this.prefersReducedMotion) {
      this.setupReducedMotionFallbacks();
      return;
    }
    
    this.setupCapabilityBlockOrchestration();
    this.setupProjectCardOrchestration();
    this.setupNavigationOrchestration();
    this.setupButtonOrchestration();
    this.setupMetricCardOrchestration();
    this.setupSkillCardOrchestration();
    this.setupTestimonialOrchestration();
    this.setupCoordinatedGroupEffects();
    
    this.isInitialized = true;
  }

  /**
   * Setup capability block hover orchestration
   */
  setupCapabilityBlockOrchestration() {
    const capabilityBlocks = document.querySelectorAll('.capability-block');
    
    capabilityBlocks.forEach((block, index) => {
      const orchestration = this.createCapabilityBlockTimeline(block, index);
      this.orchestrations.set(`capability-${index}`, orchestration);
      
      this.attachHoverListeners(block, orchestration, {
        enterDelay: 0,
        leaveDelay: 0,
        coordinatedGroup: 'capabilities'
 