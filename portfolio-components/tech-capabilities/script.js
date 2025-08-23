// Brutalist Tech Capabilities Component
class BrutalistTechCapabilities {
  constructor() {
    this.techSection = document.getElementById("techCapabilitiesSection");
    this.capabilityTabs = document.getElementById("capabilityTabs");
    this.tabContents = document.querySelectorAll(".tab-content");
    this.radarChart = document.getElementById("radarChart");
    this.radarData = document.getElementById("radarData");
    this.languageList = document.getElementById("languageList");
    this.certificationsGrid = document.getElementById("certificationsGrid");
    this.codeEditor = document.getElementById("codeEditor");
    this.binaryStreams = document.getElementById("binaryStreams");
    this.codeRainOverlay = document.getElementById("codeRainOverlay");

    this.currentTab = "skills";
    this.skillsData = {
      frontend: 90,
      backend: 85,
      database: 80,
      cloud: 88,
      devops: 82,
      mobile: 75,
    };

    this.codeExamples = {
      react: `// Clean Architecture - React Component with TypeScript
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => Promise<void>;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onUpdate 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = useCallback(async (data: UserData) => {
    setIsLoading(true);
    try {
      await onUpdate({ ...user, ...data });
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, onUpdate]);

  return (
    <ProfileForm 
      initialData={user}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};`,
      api: `// High-Performance API with Caching Strategy
const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient();

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = \`cache:\${req.originalUrl}\`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

app.get('/api/users', cacheMiddleware(600), async (req, res) => {
  const users = await User.findAll({
    include: ['profile', 'permissions'],
    order: [['createdAt', 'DESC']]
  });
  
  res.json({ users, total: users.length });
});`,
      algorithm: `// Optimized Search Algorithm with Memoization
class SearchOptimizer {
  constructor() {
    this.cache = new Map();
    this.searchHistory = [];
  }

  async fuzzySearch(query, dataset, threshold = 0.8) {
    const cacheKey = \`\${query}:\${threshold}\`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const results = dataset
      .map(item => ({
        item,
        score: this.calculateSimilarity(query, item.searchText)
      }))
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);

    this.cache.set(cacheKey, results);
    this.searchHistory.push({ query, timestamp: Date.now() });
    
    return results;
  }

  calculateSimilarity(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    const distance = matrix[str2.length][str1.length];
    return 1 - distance / Math.max(str1.length, str2.length);
  }
}`,
    };

    this.init();
  }

  init() {
    this.setupTabNavigation();
    this.setupRadarChart();
    this.setupLanguageStats();
    this.setupCertifications();
    this.setupCodeEditor();
    this.setupBackgroundEffects();
    this.setupScrollAnimations();
    this.startLiveUpdates();
  }

  setupTabNavigation() {
    const tabButtons = this.capabilityTabs?.querySelectorAll(".tab-btn");

    tabButtons?.forEach((button) => {
      button.addEventListener("click", () => {
        const tabName = button.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    if (this.currentTab === tabName) return;

    // Update button states
    const tabButtons = this.capabilityTabs?.querySelectorAll(".tab-btn");
    tabButtons?.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Update content visibility
    this.tabContents.forEach((content) => {
      content.classList.toggle("active", content.id === `${tabName}Tab`);
    });

    this.currentTab = tabName;

    // Trigger specific animations based on tab
    this.triggerTabAnimation(tabName);
  }

  triggerTabAnimation(tabName) {
    switch (tabName) {
      case "skills":
        this.animateRadarChart();
        this.animateLanguageStats();
        break;
      case "timeline":
        this.animateTimeline();
        break;
      case "certifications":
        this.animateCertifications();
        break;
      case "code":
        this.animateCodeEditor();
        break;
      case "learning":
        this.animateLearningProgress();
        break;
    }
  }

  setupRadarChart() {
    if (!this.radarData) return;

    this.createRadarChart();
  }

  createRadarChart() {
    const skills = Object.keys(this.skillsData);
    const values = Object.values(this.skillsData);
    const centerX = 250;
    const centerY = 250;
    const maxRadius = 200;

    // Create radar polygon
    const points = skills
      .map((skill, index) => {
        const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
        const value = values[index];
        const radius = (value / 100) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");

    // Create SVG elements
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", "rgba(0, 255, 255, 0.2)");
    polygon.setAttribute("stroke", "#00ffff");
    polygon.setAttribute("stroke-width", "2");
    polygon.classList.add("radar-polygon");

    // Create skill points
    skills.forEach((skill, index) => {
      const angle = (index * 2 * Math.PI) / skills.length - Math.PI / 2;
      const value = values[index];
      const radius = (value / 100) * maxRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", "6");
      circle.setAttribute("fill", "#ffff00");
      circle.setAttribute("stroke", "#00ffff");
      circle.setAttribute("stroke-width", "2");
      circle.classList.add("skill-point");
      circle.dataset.skill = skill;
      circle.dataset.value = value;

      // Add hover effects
      circle.addEventListener("mouseenter", () => {
        this.showSkillTooltip(circle, skill, value);
      });

      circle.addEventListener("mouseleave", () => {
        this.hideSkillTooltip();
      });

      this.radarData.appendChild(circle);
    });

    this.radarData.appendChild(polygon);
  }

  animateRadarChart() {
    const polygon = this.radarData?.querySelector(".radar-polygon");
    const points = this.radarData?.querySelectorAll(".skill-point");

    if (polygon) {
      polygon.style.opacity = "0";
      polygon.style.transform = "scale(0)";

      setTimeout(() => {
        polygon.style.transition = "all 1s ease-out";
        polygon.style.opacity = "1";
        polygon.style.transform = "scale(1)";
      }, 100);
    }

    points?.forEach((point, index) => {
      point.style.opacity = "0";
      point.style.transform = "scale(0)";

      setTimeout(() => {
        point.style.transition = "all 0.5s ease-out";
        point.style.opacity = "1";
        point.style.transform = "scale(1)";
      }, 200 + index * 100);
    });
  }

  showSkillTooltip(element, skill, value) {
    const tooltip = document.createElement("div");
    tooltip.className = "skill-tooltip";
    tooltip.innerHTML = `
      <div class="tooltip-skill">${skill.toUpperCase()}</div>
      <div class="tooltip-value">${value}%</div>
    `;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid #00ffff;
      padding: 0.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: white;
      pointer-events: none;
      z-index: 1000;
      transform: translate(-50%, -100%);
    `;

    const rect = element.getBoundingClientRect();
    const chartRect = this.radarChart.getBoundingClientRect();
    tooltip.style.left = `${rect.left - chartRect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - chartRect.top - 10}px`;

    this.radarChart.appendChild(tooltip);
  }

  hideSkillTooltip() {
    const tooltip = this.radarChart?.querySelector(".skill-tooltip");
    tooltip?.remove();
  }

  setupLanguageStats() {
    const languageItems = this.languageList?.querySelectorAll(".language-item");

    languageItems?.forEach((item) => {
      const progressBar = item.querySelector(".progress-bar");
      const percentage = progressBar?.dataset.percentage;

      if (progressBar && percentage) {
        progressBar.style.setProperty("--percentage", `${percentage}%`);
      }
    });
  }

  animateLanguageStats() {
    const languageItems = this.languageList?.querySelectorAll(".language-item");

    languageItems?.forEach((item, index) => {
      const progressBar = item.querySelector(".progress-bar");
      const percentageText = item.querySelector(".percentage-text");
      const targetPercentage = progressBar?.dataset.percentage || 0;

      // Reset animation
      if (progressBar) {
        progressBar.style.setProperty("--percentage", "0%");
      }
      if (percentageText) {
        percentageText.textContent = "0%";
      }

      // Animate with delay
      setTimeout(() => {
        if (progressBar) {
          progressBar.style.setProperty("--percentage", `${targetPercentage}%`);
        }

        // Animate counter
        this.animateCounter(
          percentageText,
          0,
          parseInt(targetPercentage),
          1000,
          "%"
        );
      }, index * 200);
    });

    // Animate summary values
    const summaryValues = document.querySelectorAll(
      ".summary-value[data-target]"
    );
    summaryValues.forEach((element, index) => {
      const target = parseInt(element.dataset.target);
      setTimeout(() => {
        this.animateCounter(element, 0, target, 2000);
      }, 500 + index * 300);
    });
  }

  setupCertifications() {
    const certCards = this.certificationsGrid?.querySelectorAll(".cert-card");

    certCards?.forEach((card) => {
      card.addEventListener("click", () => {
        this.flipCertification(card);
      });

      const verifyBtn = card.querySelector(".verify-btn");
      verifyBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.verifyCertification(verifyBtn);
      });
    });
  }

  flipCertification(card) {
    card.classList.toggle("flipped");

    // Add glitch effect
    card.style.animation = "certGlitch 0.3s ease-out";
    setTimeout(() => {
      card.style.animation = "";
    }, 300);
  }

  verifyCertification(button) {
    const originalText = button.textContent;
    const states = [
      { text: "VERIFYING...", bg: "#ffff00", color: "#000" },
      { text: "CONNECTING...", bg: "#ff9900", color: "#fff" },
      { text: "✓ VERIFIED", bg: "#00ff00", color: "#000" },
    ];

    let currentState = 0;

    const updateState = () => {
      if (currentState < states.length) {
        const state = states[currentState];
        button.textContent = state.text;
        button.style.background = state.bg;
        button.style.color = state.color;
        currentState++;

        setTimeout(updateState, currentState === 1 ? 1000 : 1500);
      } else {
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = "";
          button.style.color = "";
        }, 2000);
      }
    };

    updateState();
  }

  animateCertifications() {
    const certCards = this.certificationsGrid?.querySelectorAll(".cert-card");

    certCards?.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(50px) rotateY(-90deg)";

      setTimeout(() => {
        card.style.transition = "all 0.6s ease-out";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) rotateY(0deg)";
      }, index * 150);
    });
  }

  setupCodeEditor() {
    const editorTabs = this.codeEditor?.querySelectorAll(".editor-tab");
    const editorContent = this.codeEditor?.querySelector(
      ".editor-content .code-block code"
    );
    const copyBtn = this.codeEditor?.querySelector(".copy-btn");
    const githubBtn = this.codeEditor?.querySelector(".github-btn");

    editorTabs?.forEach((tab) => {
      tab.addEventListener("click", () => {
        const codeType = tab.dataset.code;
        this.switchCodeExample(codeType, editorTabs, editorContent);
      });
    });

    copyBtn?.addEventListener("click", () => {
      this.copyCode(editorContent);
    });

    githubBtn?.addEventListener("click", () => {
      this.openGitHub();
    });
  }

  switchCodeExample(codeType, tabs, content) {
    // Update tab states
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.code === codeType);
    });

    // Update content with typewriter effect
    if (content && this.codeExamples[codeType]) {
      this.typewriterCode(content, this.codeExamples[codeType]);
    }
  }

  typewriterCode(element, newCode) {
    element.style.opacity = "0.5";

    setTimeout(() => {
      element.textContent = "";
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < newCode.length) {
          element.textContent += newCode[index];
          index++;
        } else {
          clearInterval(typeInterval);
          element.style.opacity = "1";
        }
      }, 10);
    }, 200);
  }

  copyCode(content) {
    if (content) {
      navigator.clipboard.writeText(content.textContent).then(() => {
        this.showCopyFeedback();
      });
    }
  }

  showCopyFeedback() {
    const feedback = document.createElement("div");
    feedback.textContent = "CODE COPIED!";
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #00ff00;
      color: #000;
      padding: 1rem 2rem;
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      z-index: 10000;
      animation: copyFeedback 2s ease-out forwards;
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  openGitHub() {
    // Simulate GitHub redirect with terminal effect
    const terminal = document.createElement("div");
    terminal.innerHTML = `
      <div style="font-family: 'JetBrains Mono', monospace; color: #00ff00;">
        > git remote get-url origin<br>
        https://github.com/developer/portfolio<br>
        > opening repository...<br>
        <span style="color: #ffff00;">SUCCESS: Repository opened</span>
      </div>
    `;
    terminal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #00ff00;
      padding: 2rem;
      z-index: 10000;
      min-width: 400px;
    `;

    document.body.appendChild(terminal);

    setTimeout(() => {
      terminal.remove();
      // In real implementation, would open GitHub
      console.log("Opening GitHub repository...");
    }, 3000);
  }

  animateCodeEditor() {
    const editor = this.codeEditor;
    if (!editor) return;

    editor.style.opacity = "0";
    editor.style.transform = "translateY(30px)";

    setTimeout(() => {
      editor.style.transition = "all 0.8s ease-out";
      editor.style.opacity = "1";
      editor.style.transform = "translateY(0)";
    }, 100);
  }

  animateTimeline() {
    const timelineNodes = document.querySelectorAll(".timeline-node");

    timelineNodes.forEach((node, index) => {
      node.style.opacity = "0";
      node.style.transform = "translateX(-50px)";

      setTimeout(() => {
        node.style.transition = "all 0.6s ease-out";
        node.style.opacity = "1";
        node.style.transform = "translateX(0)";
      }, index * 200);
    });
  }

  animateLearningProgress() {
    const learningTracks = document.querySelectorAll(".learning-track");

    learningTracks.forEach((track, index) => {
      const progressBar = track.querySelector(".progress-bar");
      const progressValue = progressBar?.dataset.progress || 0;

      // Reset progress
      if (progressBar) {
        progressBar.style.setProperty("--progress", "0%");
      }

      // Animate track appearance
      track.style.opacity = "0";
      track.style.transform = "translateY(30px)";

      setTimeout(() => {
        track.style.transition = "all 0.6s ease-out";
        track.style.opacity = "1";
        track.style.transform = "translateY(0)";

        // Animate progress bar
        if (progressBar) {
          setTimeout(() => {
            progressBar.style.setProperty("--progress", `${progressValue}%`);
          }, 300);
        }
      }, index * 300);
    });
  }

  setupBackgroundEffects() {
    this.createBinaryStreams();
    this.createCodeRain();
  }

  createBinaryStreams() {
    if (!this.binaryStreams) return;

    // Create 20 binary streams
    for (let i = 0; i < 20; i++) {
      const stream = document.createElement("div");
      stream.className = "binary-stream";
      stream.style.left = `${Math.random() * 100}%`;
      stream.style.animationDelay = `${Math.random() * 8}s`;
      stream.style.animationDuration = `${6 + Math.random() * 4}s`;

      this.binaryStreams.appendChild(stream);
    }
  }

  createCodeRain() {
    if (!this.codeRainOverlay) return;

    const codeChars = "01{}[]();=><+-*/&|!@#$%^";

    // Create 50 falling code characters
    for (let i = 0; i < 50; i++) {
      const char = document.createElement("div");
      char.className = "code-char";
      char.textContent =
        codeChars[Math.floor(Math.random() * codeChars.length)];
      char.style.left = `${Math.random() * 100}%`;
      char.style.animationDelay = `${Math.random() * 6}s`;
      char.style.animationDuration = `${4 + Math.random() * 4}s`;

      this.codeRainOverlay.appendChild(char);
    }

    // Update characters periodically
    setInterval(() => {
      const chars = this.codeRainOverlay.querySelectorAll(".code-char");
      chars.forEach((char) => {
        if (Math.random() > 0.9) {
          char.textContent =
            codeChars[Math.floor(Math.random() * codeChars.length)];
        }
      });
    }, 2000);
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");

            // Trigger specific animations
            if (entry.target.classList.contains("tech-capabilities-section")) {
              this.triggerTabAnimation(this.currentTab);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (this.techSection) {
      observer.observe(this.techSection);
    }
  }

  startLiveUpdates() {
    // Simulate live language stats updates
    setInterval(() => {
      this.updateLanguageStats();
    }, 30000); // Every 30 seconds

    // Update learning progress
    setInterval(() => {
      this.updateLearningProgress();
    }, 60000); // Every minute
  }

  updateLanguageStats() {
    const languageItems = this.languageList?.querySelectorAll(".language-item");

    languageItems?.forEach((item) => {
      const progressBar = item.querySelector(".progress-bar");
      const percentageText = item.querySelector(".percentage-text");
      const currentPercentage = parseInt(progressBar?.dataset.percentage || 0);

      // Small random fluctuation
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const newPercentage = Math.max(
        0,
        Math.min(100, currentPercentage + change)
      );

      if (newPercentage !== currentPercentage) {
        progressBar?.style.setProperty("--percentage", `${newPercentage}%`);
        if (percentageText) {
          percentageText.textContent = `${newPercentage}%`;
        }
        progressBar?.setAttribute("data-percentage", newPercentage.toString());
      }
    });
  }

  updateLearningProgress() {
    const learningTracks = document.querySelectorAll(".learning-track");

    learningTracks.forEach((track) => {
      const progressBar = track.querySelector(".progress-bar");
      const progressText = track.querySelector(".track-progress");
      const currentProgress = parseInt(progressBar?.dataset.progress || 0);

      // Increment progress slightly
      const newProgress = Math.min(
        100,
        currentProgress + Math.floor(Math.random() * 2)
      );

      if (newProgress !== currentProgress) {
        progressBar?.style.setProperty("--progress", `${newProgress}%`);
        if (progressText) {
          progressText.textContent = `${newProgress}%`;
        }
        progressBar?.setAttribute("data-progress", newProgress.toString());
      }
    });
  }

  animateCounter(element, start, end, duration, suffix = "") {
    if (!element) return;

    const startTime = performance.now();
    const range = end - start;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = Math.floor(start + range * progress);
      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// Add required CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes certGlitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }
  
  @keyframes copyFeedback {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  }
  
  .animate-in {
    animation: slideInUp 0.8s ease-out forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize the component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistTechCapabilities();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistTechCapabilities;
}
