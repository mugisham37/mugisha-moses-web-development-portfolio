// Brutalist Social Proof Component
class BrutalistSocialProof {
  constructor() {
    this.socialProofSection = document.getElementById("socialProofSection");
    this.networkParticles = document.getElementById("networkParticles");
    this.connectionStreams = document.getElementById("connectionStreams");
    this.recommendationsGrid = document.getElementById("recommendationsGrid");
    this.logoTracks = {
      enterprise: document.getElementById("enterpriseTrack"),
      growth: document.getElementById("growthTrack"),
      startup: document.getElementById("startupTrack"),
    };

    this.particles = [];
    this.connections = [];
    this.isVisible = false;

    this.init();
  }

  init() {
    this.createNetworkParticles();
    this.createConnectionStreams();
    this.setupRecommendationInteractions();
    this.setupLogoCarouselInteractions();
    this.setupContributionCardAnimations();
    this.setupAwardAnimations();
    this.setupScrollAnimations();
    this.startBackgroundAnimations();
    this.setupVerificationEffects();
  }

  createNetworkParticles() {
    if (!this.networkParticles) return;

    // Create 30 network particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "network-particle";
      particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--accent-cyan);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.6 + 0.2};
                animation: networkPulse ${
                  Math.random() * 3 + 2
                }s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;

      this.networkParticles.appendChild(particle);
      this.particles.push({
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  createConnectionStreams() {
    if (!this.connectionStreams) return;

    // Create flowing connection lines
    setInterval(() => {
      if (this.isVisible && Math.random() > 0.7) {
        const stream = document.createElement("div");
        stream.className = "connection-stream";
        stream.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 100px;
                    background: linear-gradient(to bottom, transparent, var(--accent-cyan), transparent);
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: connectionFlow 4s linear forwards;
                    opacity: 0.6;
                `;

        this.connectionStreams.appendChild(stream);

        // Remove after animation
        setTimeout(() => {
          if (stream.parentNode) {
            stream.parentNode.removeChild(stream);
          }
        }, 4000);
      }
    }, 2000);
  }

  setupRecommendationInteractions() {
    const recommendationCards = document.querySelectorAll(
      ".recommendation-card"
    );

    recommendationCards.forEach((card, index) => {
      // Add entrance animation delay
      card.style.animationDelay = `${index * 0.1}s`;

      // Add hover effects
      card.addEventListener("mouseenter", () => {
        this.triggerRecommendationHover(card);
      });

      card.addEventListener("mouseleave", () => {
        this.resetRecommendationHover(card);
      });

      // Add click interaction for LinkedIn links
      const linkedinLink = card.querySelector(".view-linkedin");
      if (linkedinLink) {
        linkedinLink.addEventListener("click", (e) => {
          e.preventDefault();
          this.triggerLinkedInEffect(card);
        });
      }
    });
  }

  triggerRecommendationHover(card) {
    // Add glitch effect to quote marks
    const quoteMark = card.querySelector(".quote-marks");
    if (quoteMark) {
      quoteMark.style.animation = "textGlitch 0.3s ease-out";
    }

    // Animate profile photo
    const profilePhoto = card.querySelector(".profile-photo");
    if (profilePhoto) {
      profilePhoto.style.transform = "scale(1.1) rotate(5deg)";
      profilePhoto.style.filter = "brightness(1.2)";
    }

    // Add typing effect to recommendation text
    const recommendationText = card.querySelector(".recommendation-text");
    if (recommendationText && !card.dataset.animated) {
      card.dataset.animated = "true";
      this.addTypingCursor(recommendationText);
    }
  }

  resetRecommendationHover(card) {
    const profilePhoto = card.querySelector(".profile-photo");
    if (profilePhoto) {
      profilePhoto.style.transform = "scale(1) rotate(0deg)";
      profilePhoto.style.filter = "brightness(1)";
    }

    this.removeTypingCursor(card);
  }

  addTypingCursor(textElement) {
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.textContent = "|";
    cursor.style.cssText = `
            color: var(--accent-cyan);
            animation: blink 1s step-end infinite;
            margin-left: 2px;
        `;
    textElement.appendChild(cursor);
  }

  removeTypingCursor(card) {
    const cursor = card.querySelector(".typing-cursor");
    if (cursor) {
      cursor.remove();
    }
  }

  triggerLinkedInEffect(card) {
    // Create LinkedIn verification animation
    const verification = document.createElement("div");
    verification.className = "linkedin-verification";
    verification.innerHTML = `
            <div class="verification-popup">
                <div class="verification-icon">✓</div>
                <div class="verification-text">LinkedIn Profile Verified</div>
            </div>
        `;
    verification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            pointer-events: none;
        `;

    card.style.position = "relative";
    card.appendChild(verification);

    // Animate verification popup
    const popup = verification.querySelector(".verification-popup");
    popup.style.cssText = `
            background: var(--accent-green);
            color: var(--primary-black);
            padding: 1rem 2rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            transform: scale(0);
            animation: popupScale 0.5s ease-out forwards;
        `;

    // Remove after 2 seconds
    setTimeout(() => {
      verification.remove();
    }, 2000);
  }

  setupLogoCarouselInteractions() {
    Object.entries(this.logoTracks).forEach(([tier, track]) => {
      if (!track) return;

      const logos = track.querySelectorAll(".client-logo");

      logos.forEach((logo) => {
        logo.addEventListener("mouseenter", () => {
          // Pause carousel animation on hover
          track.style.animationPlayState = "paused";

          // Add glow effect
          logo.style.boxShadow = "0 0 20px var(--accent-cyan)";
        });

        logo.addEventListener("mouseleave", () => {
          // Resume carousel animation
          track.style.animationPlayState = "running";

          // Remove glow effect
          logo.style.boxShadow = "none";
        });

        // Add click effect
        logo.addEventListener("click", () => {
          this.triggerClientLogoClick(logo);
        });
      });
    });
  }

  triggerClientLogoClick(logo) {
    // Create success notification
    const notification = document.createElement("div");
    notification.className = "client-notification";
    notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🤝</div>
                <div class="notification-text">Partnership Verified</div>
            </div>
        `;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            pointer-events: none;
        `;

    const content = notification.querySelector(".notification-content");
    content.style.cssText = `
            background: var(--accent-yellow);
            color: var(--primary-black);
            padding: 1rem 2rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            transform: translateX(100%);
            animation: slideInRight 0.5s ease-out forwards;
        `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      content.style.animation = "slideOutRight 0.5s ease-out forwards";
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  setupContributionCardAnimations() {
    const contributionCards = document.querySelectorAll(".contribution-card");

    contributionCards.forEach((card, index) => {
      card.addEventListener("mouseenter", () => {
        // Add code streaming effect
        this.addCodeStreamEffect(card);
      });

      card.addEventListener("mouseleave", () => {
        this.removeCodeStreamEffect(card);
      });

      // Add click interaction for GitHub links
      card.addEventListener("click", () => {
        this.triggerContributionEffect(card);
      });
    });
  }

  addCodeStreamEffect(card) {
    const codeStream = document.createElement("div");
    codeStream.className = "code-stream";
    codeStream.innerHTML = `
            <div class="stream-line">git commit -m "feat: enhanced performance"</div>
            <div class="stream-line">git push origin main</div>
            <div class="stream-line">✓ Build successful</div>
        `;
    codeStream.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: var(--accent-green);
            opacity: 0.7;
            pointer-events: none;
        `;

    card.style.position = "relative";
    card.appendChild(codeStream);

    // Animate stream lines
    const lines = codeStream.querySelectorAll(".stream-line");
    lines.forEach((line, index) => {
      line.style.opacity = "0";
      line.style.transform = "translateY(10px)";
      line.style.transition = "all 0.3s ease";

      setTimeout(() => {
        line.style.opacity = "1";
        line.style.transform = "translateY(0)";
      }, index * 200);
    });
  }

  removeCodeStreamEffect(card) {
    const codeStream = card.querySelector(".code-stream");
    if (codeStream) {
      codeStream.remove();
    }
  }

  triggerContributionEffect(card) {
    // Add commit animation
    const commitEffect = document.createElement("div");
    commitEffect.className = "commit-effect";
    commitEffect.innerHTML = `
            <div class="commit-message">
                <div class="commit-icon">📝</div>
                <div class="commit-text">Contribution Recorded</div>
            </div>
        `;
    commitEffect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            pointer-events: none;
        `;

    const message = commitEffect.querySelector(".commit-message");
    message.style.cssText = `
            background: var(--accent-green);
            color: var(--primary-black);
            padding: 1rem 2rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            transform: scale(0);
            animation: popupScale 0.5s ease-out forwards;
        `;

    card.appendChild(commitEffect);

    setTimeout(() => {
      commitEffect.remove();
    }, 2000);
  }

  setupAwardAnimations() {
    const awardItems = document.querySelectorAll(".award-item");

    awardItems.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        // Add medal shine effect
        const icon = item.querySelector(".award-icon");
        if (icon) {
          icon.style.animation = "medallionGlow 1s ease-in-out infinite";
        }
      });

      item.addEventListener("mouseleave", () => {
        const icon = item.querySelector(".award-icon");
        if (icon) {
          icon.style.animation = "none";
        }
      });
    });
  }

  setupVerificationEffects() {
    const verificationLinks = document.querySelectorAll(".verification-link");

    verificationLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.triggerVerificationEffect(link);
      });
    });
  }

  triggerVerificationEffect(link) {
    const originalText = link.textContent;

    // Change text and style
    link.textContent = "VERIFYING...";
    link.style.color = "var(--accent-yellow)";
    link.style.animation = "pulse 0.5s ease-in-out infinite";

    setTimeout(() => {
      link.textContent = "✓ VERIFIED";
      link.style.color = "var(--accent-green)";
      link.style.animation = "none";

      setTimeout(() => {
        link.textContent = originalText;
        link.style.color = "";
      }, 2000);
    }, 1500);
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            entry.target.classList.add("animate-in");

            // Trigger specific animations based on element
            if (entry.target.classList.contains("linkedin-recommendations")) {
              this.animateRecommendations();
            } else if (
              entry.target.classList.contains("community-contributions")
            ) {
              this.animateContributions();
            } else if (
              entry.target.classList.contains("industry-recognition")
            ) {
              this.animateAwards();
            }
          } else {
            this.isVisible = false;
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe key sections
    const sectionsToObserve = [
      ".linkedin-recommendations",
      ".community-contributions",
      ".speaking-publications",
      ".industry-recognition",
    ];

    sectionsToObserve.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });
  }

  animateRecommendations() {
    const cards = document.querySelectorAll(".recommendation-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = "translateY(0) scale(1)";
        card.style.opacity = "1";
      }, index * 100);
    });
  }

  animateContributions() {
    const cards = document.querySelectorAll(".contribution-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = "slideInUp 0.6s ease-out forwards";
      }, index * 150);
    });
  }

  animateAwards() {
    const categories = document.querySelectorAll(".award-category");
    categories.forEach((category, index) => {
      setTimeout(() => {
        category.style.transform = "scale(1) rotate(0deg)";
        category.style.opacity = "1";

        // Animate individual awards
        const awards = category.querySelectorAll(".award-item");
        awards.forEach((award, awardIndex) => {
          setTimeout(() => {
            award.style.transform = "translateX(0)";
            award.style.opacity = "1";
          }, awardIndex * 100);
        });
      }, index * 200);
    });
  }

  startBackgroundAnimations() {
    // Add CSS animations
    const style = document.createElement("style");
    style.textContent = `
            @keyframes textGlitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }
            
            @keyframes popupScale {
                0% { transform: scale(0); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes slideInRight {
                0% { transform: translateX(100%); }
                100% { transform: translateX(0); }
            }
            
            @keyframes slideOutRight {
                0% { transform: translateX(0); }
                100% { transform: translateX(100%); }
            }
            
            @keyframes slideInUp {
                0% { 
                    transform: translateY(50px);
                    opacity: 0;
                }
                100% { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .animate-in {
                animation: slideInUp 0.8s ease-out forwards;
            }
            
            .recommendation-card {
                transform: translateY(30px);
                opacity: 0;
                transition: all 0.6s ease;
            }
            
            .award-category {
                transform: scale(0.9) rotate(-2deg);
                opacity: 0;
                transition: all 0.6s ease;
            }
            
            .award-item {
                transform: translateX(-20px);
                opacity: 0;
                transition: all 0.4s ease;
            }
        `;
    document.head.appendChild(style);

    // Animate particles
    this.animateParticles();
  }

  animateParticles() {
    setInterval(() => {
      this.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= 100) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= 100) particle.vy *= -1;

        // Update position
        particle.element.style.left = `${particle.x}%`;
        particle.element.style.top = `${particle.y}%`;

        // Random color changes
        if (Math.random() > 0.99) {
          const colors = [
            "var(--accent-cyan)",
            "var(--accent-purple)",
            "var(--accent-yellow)",
          ];
          particle.element.style.background =
            colors[Math.floor(Math.random() * colors.length)];
        }
      });
    }, 100);
  }
}

// Initialize the social proof component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistSocialProof();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistSocialProof;
}
