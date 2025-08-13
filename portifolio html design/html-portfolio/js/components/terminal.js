/**
 * Live Code Terminal Interface Component
 * Implements GitHub API integration, syntax highlighting, and typing animations
 */

class TerminalInterface {
  constructor() {
    this.config = {
      githubUsername: "brutalistdev", // Replace with actual username
      typingSpeed: 150, // 150ms per character as specified
      maxCommits: 10,
      refreshInterval: 30000, // 30 seconds
      animationFrameRate: 60, // 60fps for active, 30fps for idle
    };

    this.state = {
      isActive: true,
      currentCodeIndex: 0,
      isTyping: false,
      githubData: null,
      lastUpdate: null,
    };

    this.codeExamples = [
      {
        language: "javascript",
        code: `// React Component with TypeScript
interface Props {
  title: string;
  isActive: boolean;
}

const BrutalistButton: React.FC<Props> = ({ title, isActive }) => {
  return (
    <button 
      className={\`btn \${isActive ? 'btn--active' : ''}\`}
      onClick={handleClick}
    >
      {title.toUpperCase()}
    </button>
  );
};`,
      },
      {
        language: "css",
        code: `/* Industrial Design System */
.btn {
  background: var(--color-black);
  border: 4px solid var(--color-white);
  color: var(--color-white);
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--color-accent);
  color: var(--color-black);
  transform: translateY(-2px);
}`,
      },
      {
        language: "javascript",
        code: `// GitHub API Integration
const fetchGitHubData = async (username) => {
  try {
    const response = await fetch(
      \`https://api.github.com/users/\${username}/events\`
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    
    const events = await response.json();
    return events.filter(event => 
      event.type === 'PushEvent'
    ).slice(0, 10);
  } catch (error) {
    console.warn('GitHub API failed:', error);
    return mockCommitData;
  }
};`,
      },
    ];

    this.mockCommitData = [
      {
        id: "1a2b3c4",
        message: "feat: implement brutalist terminal interface",
        repo: "portfolio-redesign",
        time: "2 minutes ago",
        author: "brutalistdev",
      },
      {
        id: "5d6e7f8",
        message: "fix: optimize ASCII portrait animation performance",
        repo: "portfolio-redesign",
        time: "15 minutes ago",
        author: "brutalistdev",
      },
      {
        id: "9g0h1i2",
        message: "style: enhance capabilities matrix hover effects",
        repo: "portfolio-redesign",
        time: "1 hour ago",
        author: "brutalistdev",
      },
      {
        id: "3j4k5l6",
        message: "docs: update README with deployment instructions",
        repo: "client-project-alpha",
        time: "3 hours ago",
        author: "brutalistdev",
      },
      {
        id: "7m8n9o0",
        message: "feat: add real-time GitHub integration",
        repo: "portfolio-redesign",
        time: "5 hours ago",
        author: "brutalistdev",
      },
    ];

    // Command simulation data
    this.commandSequences = [
      {
        commands: [
          {
            cmd: "git status",
            output:
              "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  modified:   src/components/Terminal.js\n  modified:   src/styles/terminal.css",
          },
          { cmd: "git add .", output: "" },
          {
            cmd: 'git commit -m "feat: enhance terminal statistics display"',
            output:
              "[main 1a2b3c4] feat: enhance terminal statistics display\n 2 files changed, 47 insertions(+), 12 deletions(-)",
          },
          {
            cmd: "git push origin main",
            output:
              "Enumerating objects: 8, done.\nCounting objects: 100% (8/8), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (4/4), done.\nWriting objects: 100% (4/4), 1.2 KiB | 1.2 MiB/s, done.\nTotal 4 (delta 2), reused 0 (delta 0)\nTo github.com:brutalistdev/portfolio-redesign.git\n   5d6e7f8..1a2b3c4  main -> main",
          },
        ],
      },
      {
        commands: [
          {
            cmd: "npm run test",
            output:
              "> portfolio-redesign@1.0.0 test\n> jest --coverage\n\n PASS  src/components/Terminal.test.js\n PASS  src/utils/github.test.js\n\nTest Suites: 2 passed, 2 total\nTests:       12 passed, 12 total\nSnapshots:   0 total\nTime:        2.847s\nRan all test suites.",
          },
          {
            cmd: "npm run build",
            output:
              "> portfolio-redesign@1.0.0 build\n> webpack --mode=production\n\nHash: 4f2a8b9c1d3e5f6g\nVersion: webpack 5.74.0\nTime: 3247ms\nBuilt at: 2024-01-15 14:32:18\n    Asset      Size  Chunks             Chunk Names\n bundle.js  89.2 KiB       0  [emitted]  main\nindex.html  1.23 KiB          [emitted]",
          },
          {
            cmd: "npm run deploy",
            output:
              "Deploying to production...\n✓ Build completed successfully\n✓ Assets uploaded to CDN\n✓ DNS updated\n🚀 Deployment successful!\nLive at: https://brutalistdev.com",
          },
        ],
      },
      {
        commands: [
          {
            cmd: "docker build -t portfolio .",
            output:
              'Sending build context to Docker daemon  2.048MB\nStep 1/8 : FROM node:18-alpine\n ---> 4b8b8b8b8b8b\nStep 2/8 : WORKDIR /app\n ---> Using cache\n ---> 9c9c9c9c9c9c\nStep 3/8 : COPY package*.json ./\n ---> Using cache\n ---> 1d1d1d1d1d1d\nStep 4/8 : RUN npm ci --only=production\n ---> Using cache\n ---> 2e2e2e2e2e2e\nStep 5/8 : COPY . .\n ---> 3f3f3f3f3f3f\nStep 6/8 : EXPOSE 3000\n ---> Running in 4g4g4g4g4g4g\n ---> 5h5h5h5h5h5h\nStep 7/8 : CMD ["npm", "start"]\n ---> Running in 6i6i6i6i6i6i\n ---> 7j7j7j7j7j7j\nSuccessfully built 7j7j7j7j7j7j\nSuccessfully tagged portfolio:latest',
          },
          {
            cmd: "docker run -p 3000:3000 portfolio",
            output:
              "Starting development server...\nServer running on http://localhost:3000\nWebpack compiled successfully!",
          },
        ],
      },
    ];

    this.fileTreeData = [
      {
        name: "portfolio-redesign",
        type: "folder",
        expanded: true,
        modified: true,
        children: [
          {
            name: "src",
            type: "folder",
            expanded: true,
            children: [
              { name: "components", type: "folder", expanded: false },
              { name: "styles", type: "folder", expanded: false },
              { name: "utils", type: "folder", expanded: false },
              { name: "index.js", type: "file", modified: true },
              { name: "App.js", type: "file" },
            ],
          },
          {
            name: "public",
            type: "folder",
            expanded: false,
          },
          { name: "package.json", type: "file" },
          { name: "README.md", type: "file", modified: true },
        ],
      },
      {
        name: "client-project-alpha",
        type: "folder",
        expanded: false,
      },
      {
        name: "experiments",
        type: "folder",
        expanded: false,
      },
    ];

    this.init();
  }

  async init() {
    this.createTerminalElements();
    this.bindEvents();
    await this.loadGitHubData();
    this.startTypingAnimation();
    this.startCommandSimulation();
    this.generateGitHubHeatmap();
    this.renderFileTree();
    this.updateGitHubStatistics();
    this.startPerformanceOptimization();
  }

  createTerminalElements() {
    // Terminal elements are created in HTML, this method initializes them
    this.elements = {
      terminal: document.querySelector(".terminal"),
      githubFeed: document.querySelector(".github-feed"),
      liveCode: document.querySelector(".code-display"),
      fileTree: document.querySelector(".file-tree__list"),
      heatmap: document.querySelector(".github-heatmap"),
      trafficLights: document.querySelectorAll(".terminal__traffic-light"),
      statsContainer: document.querySelector(".github-stats__summary"),
    };

    // Verify elements exist
    if (!this.elements.terminal) {
      console.warn("Terminal elements not found. Make sure HTML is loaded.");
      return;
    }

    // Initialize tooltip container
    this.tooltipContainer = null;
  }

  bindEvents() {
    // Traffic light interactions
    this.elements.trafficLights?.forEach((light, index) => {
      light.addEventListener("click", () =>
        this.handleTrafficLightClick(index)
      );
    });

    // File tree interactions
    document.addEventListener("click", (e) => {
      if (e.target.closest(".file-tree__item--folder")) {
        this.toggleFolder(e.target.closest(".file-tree__item--folder"));
      }
    });

    // Intersection Observer for performance optimization
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.state.isActive = entry.isIntersecting;
            this.adjustPerformance();
          });
        },
        { threshold: 0.1 }
      );

      if (this.elements.terminal) {
        observer.observe(this.elements.terminal);
      }
    }
  }

  async loadGitHubData() {
    try {
      // Try to fetch real GitHub data
      const response = await fetch(
        `https://api.github.com/users/${this.config.githubUsername}/events?per_page=20`
      );

      if (response.ok) {
        const events = await response.json();
        const pushEvents = events
          .filter((event) => event.type === "PushEvent")
          .slice(0, this.config.maxCommits);

        this.state.githubData = pushEvents.map((event) => ({
          id: event.id.substring(0, 7),
          message: event.payload.commits[0]?.message || "No commit message",
          repo: event.repo.name.split("/")[1],
          time: this.formatTimeAgo(new Date(event.created_at)),
          author: event.actor.login,
        }));
      } else {
        throw new Error("GitHub API request failed");
      }
    } catch (error) {
      console.warn("Using mock GitHub data:", error.message);
      this.state.githubData = this.mockCommitData;
    }

    this.renderGitHubFeed();
    this.state.lastUpdate = Date.now();
  }

  renderGitHubFeed() {
    if (!this.elements.githubFeed || !this.state.githubData) return;

    const feedHTML = this.state.githubData
      .map(
        (commit) => `
        <div class="commit-entry">
          <div class="commit-entry__hash">${commit.id}</div>
          <div class="commit-entry__message">${commit.message}</div>
          <div class="commit-entry__meta">
            <span class="commit-entry__repo">${commit.repo}</span> • 
            <span class="commit-entry__time">${commit.time}</span>
          </div>
        </div>
      `
      )
      .join("");

    this.elements.githubFeed.innerHTML = `
      <div class="github-feed__header">→ Recent Commits</div>
      ${feedHTML}
    `;
  }

  async startTypingAnimation() {
    if (!this.elements.liveCode || this.state.isTyping) return;

    this.state.isTyping = true;
    const currentExample = this.codeExamples[this.state.currentCodeIndex];

    // Clear previous content
    this.elements.liveCode.innerHTML = `
      <div class="live-coding__header">→ Live Coding: ${currentExample.language}</div>
      <pre><code class="language-${currentExample.language}"></code></pre>
    `;

    const codeElement = this.elements.liveCode.querySelector("code");
    const code = currentExample.code;

    // Type out the code character by character
    for (let i = 0; i <= code.length; i++) {
      if (!this.state.isActive) {
        // Skip animation if not visible
        codeElement.textContent = code;
        break;
      }

      const currentText = code.substring(0, i);
      codeElement.textContent = currentText;

      // Add typing cursor
      if (i < code.length) {
        codeElement.innerHTML =
          currentText + '<span class="typing-cursor"></span>';
      }

      // Apply syntax highlighting after typing is complete
      if (i === code.length && window.Prism) {
        window.Prism.highlightElement(codeElement);
      }

      await this.sleep(this.config.typingSpeed);
    }

    // Move to next example after a pause
    await this.sleep(3000);
    this.state.currentCodeIndex =
      (this.state.currentCodeIndex + 1) % this.codeExamples.length;
    this.state.isTyping = false;

    // Continue the cycle
    setTimeout(() => this.startTypingAnimation(), 2000);
  }

  async startCommandSimulation() {
    if (!this.elements.liveCode) return;

    // Alternate between code examples and command simulations
    const runCommandSequence = async () => {
      if (!this.state.isActive || this.state.isTyping) return;

      this.state.isTyping = true;
      const sequence =
        this.commandSequences[
          Math.floor(Math.random() * this.commandSequences.length)
        ];

      // Clear previous content
      this.elements.liveCode.innerHTML = `
        <div class="live-coding__header">→ Terminal Session</div>
        <pre><code class="language-bash terminal-output"></code></pre>
      `;

      const codeElement = this.elements.liveCode.querySelector("code");
      let fullOutput = "";

      for (const { cmd, output } of sequence.commands) {
        // Add command prompt and command
        const promptLine = `brutalist-dev@terminal:~$ ${cmd}`;
        fullOutput += promptLine;

        // Type out command
        for (let i = 0; i <= promptLine.length; i++) {
          if (!this.state.isActive) break;

          codeElement.textContent = fullOutput.substring(
            0,
            fullOutput.length - promptLine.length + i
          );
          codeElement.innerHTML =
            codeElement.textContent + '<span class="typing-cursor"></span>';
          await this.sleep(80); // Faster typing for commands
        }

        // Add newline and output
        fullOutput += "\n" + output + "\n\n";
        codeElement.textContent = fullOutput;

        // Pause between commands
        await this.sleep(1500);
      }

      this.state.isTyping = false;
    };

    // Run command simulation every 15 seconds when active
    setInterval(() => {
      if (this.state.isActive && !this.state.isTyping && Math.random() > 0.7) {
        runCommandSequence();
      }
    }, 15000);
  }

  generateGitHubHeatmap() {
    if (!this.elements.heatmap) return;

    // Generate realistic contribution data for the last 8 weeks (56 days)
    const today = new Date();
    const cells = [];

    for (let i = 55; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic contribution levels based on weekday patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Lower activity on weekends, higher on weekdays
      const baseLevel = isWeekend ? 0.3 : 0.8;
      const randomFactor = Math.random();
      const level = Math.floor((baseLevel + randomFactor * 0.5) * 4);

      const cellClass = level > 0 ? `heatmap-cell--level-${level}` : "";
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const contributions = level === 0 ? "No" : level;
      const contributionText = level === 1 ? "contribution" : "contributions";

      cells.push(`
        <div class="heatmap-cell ${cellClass}" 
             data-date="${date.toISOString().split("T")[0]}"
             data-level="${level}"
             data-contributions="${level}"
             tabindex="0"
             role="button"
             aria-label="${contributions} ${contributionText} on ${formattedDate}">
        </div>
      `);
    }

    this.elements.heatmap.innerHTML = cells.join("");

    // Add enhanced hover tooltips with positioning
    this.addHeatmapTooltips();
  }

  addHeatmapTooltips() {
    // Create tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "heatmap-tooltip";
    tooltip.style.cssText = `
      position: absolute;
      background: var(--color-black);
      border: 2px solid var(--color-accent);
      color: var(--color-white);
      padding: 0.5rem;
      font-size: 11px;
      font-family: var(--font-mono);
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s ease;
      white-space: nowrap;
    `;
    document.body.appendChild(tooltip);

    this.elements.heatmap.querySelectorAll(".heatmap-cell").forEach((cell) => {
      cell.addEventListener("mouseenter", (e) => {
        const level = parseInt(e.target.dataset.level);
        const date = new Date(e.target.dataset.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const contributions = level === 0 ? "No" : level;
        const contributionText = level === 1 ? "contribution" : "contributions";

        tooltip.innerHTML = `
          <div style="font-weight: 700; color: var(--color-accent);">
            ${contributions} ${contributionText}
          </div>
          <div style="color: #ccc; font-size: 10px;">
            ${formattedDate}
          </div>
        `;

        // Position tooltip
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${
          rect.left + rect.width / 2 - tooltip.offsetWidth / 2
        }px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        tooltip.style.opacity = "1";
      });

      cell.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
      });

      // Keyboard support
      cell.addEventListener("focus", (e) => {
        e.target.dispatchEvent(new Event("mouseenter"));
      });

      cell.addEventListener("blur", () => {
        tooltip.style.opacity = "0";
      });
    });
  }

  renderFileTree() {
    if (!this.elements.fileTree) return;

    const renderTreeItems = (items, level = 0) => {
      return items
        .map((item) => {
          const icon =
            item.type === "folder"
              ? item.expanded
                ? "📂"
                : "📁"
              : this.getFileIcon(item.name);

          const modifiedIndicator = item.modified
            ? '<span class="activity-indicator"></span>'
            : "";
          const nestedClass = level > 0 ? "file-tree__item--nested" : "";
          const typeClass = `file-tree__item--${item.type}`;
          const modifiedClass = item.modified
            ? "file-tree__item--modified"
            : "";

          let html = `
            <li class="file-tree__item ${typeClass} ${nestedClass} ${modifiedClass}" 
                data-name="${item.name}" 
                data-type="${item.type}">
              <span class="file-tree__icon">${icon}</span>
              <span class="file-tree__name">${item.name}</span>
              ${modifiedIndicator}
            </li>
          `;

          if (item.children && item.expanded) {
            html += `<ul class="file-tree__list">${renderTreeItems(
              item.children,
              level + 1
            )}</ul>`;
          }

          return html;
        })
        .join("");
    };

    this.elements.fileTree.innerHTML = renderTreeItems(this.fileTreeData);

    // Simulate file modifications over time
    this.simulateFileActivity();
  }

  simulateFileActivity() {
    setInterval(() => {
      if (!this.state.isActive) return;

      // Randomly modify files to show activity
      const modifyFile = (items) => {
        for (const item of items) {
          if (item.type === "file" && Math.random() > 0.95) {
            item.modified = !item.modified;
            this.renderFileTree();
            return true;
          }
          if (item.children && modifyFile(item.children)) {
            return true;
          }
        }
        return false;
      };

      modifyFile(this.fileTreeData);
    }, 5000); // Check every 5 seconds
  }

  updateGitHubStatistics() {
    if (!this.elements.statsContainer) return;

    // Enhanced statistics with real-time updates
    const stats = {
      commits: 1250 + Math.floor(Math.random() * 10),
      repos: 45,
      stars: 128 + Math.floor(Math.random() * 5),
      forks: 32 + Math.floor(Math.random() * 3),
      issues: 15,
      prs: 89,
      followers: 234,
      following: 156,
    };

    this.elements.statsContainer.innerHTML = `
      <div class="stat-item">
        <span class="stat-item__value">${stats.commits.toLocaleString()}+</span> Commits
      </div>
      <div class="stat-item">
        <span class="stat-item__value">${stats.repos}</span> Repos
      </div>
      <div class="stat-item">
        <span class="stat-item__value">${stats.stars}</span> Stars
      </div>
      <div class="stat-item">
        <span class="stat-item__value">${stats.forks}</span> Forks
      </div>
      <div class="stat-item">
        <span class="stat-item__value">${stats.issues}</span> Issues
      </div>
      <div class="stat-item">
        <span class="stat-item__value">${stats.prs}</span> PRs
      </div>
      <div class="stat-item">
        <span class="stat-item__value">${stats.followers}</span> Followers
      </div>
      <div class="stat-item">
        <span class="stat-item__value">${stats.following}</span> Following
      </div>
    `;

    // Add live update indicators
    const indicators =
      this.elements.statsContainer.querySelectorAll(".stat-item__value");
    indicators.forEach((indicator) => {
      indicator.style.transition = "color 0.3s ease";

      // Occasionally flash to show live updates
      if (Math.random() > 0.8) {
        indicator.style.color = "var(--color-accent)";
        setTimeout(() => {
          indicator.style.color = "";
        }, 1000);
      }
    });
  }

  getFileIcon(filename) {
    const extension = filename.split(".").pop()?.toLowerCase();
    const iconMap = {
      js: "📄",
      jsx: "⚛️",
      ts: "📘",
      tsx: "⚛️",
      css: "🎨",
      scss: "🎨",
      html: "🌐",
      json: "📋",
      md: "📝",
      py: "🐍",
      php: "🐘",
      java: "☕",
      cpp: "⚙️",
      c: "⚙️",
      go: "🐹",
      rs: "🦀",
      default: "📄",
    };

    return iconMap[extension] || iconMap.default;
  }

  toggleFolder(folderElement) {
    const folderName = folderElement.dataset.name;
    const folderData = this.findFolderInTree(this.fileTreeData, folderName);

    if (folderData) {
      folderData.expanded = !folderData.expanded;
      this.renderFileTree();
    }
  }

  findFolderInTree(items, name) {
    for (const item of items) {
      if (item.name === name && item.type === "folder") {
        return item;
      }
      if (item.children) {
        const found = this.findFolderInTree(item.children, name);
        if (found) return found;
      }
    }
    return null;
  }

  handleTrafficLightClick(index) {
    const actions = ["minimize", "maximize", "close"];
    const action = actions[index];

    console.log(`Terminal ${action} clicked`);

    // Add visual feedback
    const light = this.elements.trafficLights[index];
    light.style.transform = "scale(0.8)";
    setTimeout(() => {
      light.style.transform = "scale(1)";
    }, 150);

    // Could implement actual minimize/maximize/close functionality
    if (action === "close") {
      // Example: fade out terminal
      this.elements.terminal.style.opacity = "0.5";
      setTimeout(() => {
        this.elements.terminal.style.opacity = "1";
      }, 1000);
    }
  }

  startPerformanceOptimization() {
    // Initialize performance monitoring
    this.performanceMonitor = {
      frameCount: 0,
      lastTime: performance.now(),
      fps: 60,
      targetFPS: 60,
    };

    // Adjust animation frame rate based on visibility
    this.adjustPerformance();
    this.startFPSMonitoring();

    // Refresh GitHub data periodically
    setInterval(() => {
      if (this.state.isActive) {
        this.loadGitHubData();
        this.updateGitHubStatistics();
      }
    }, this.config.refreshInterval);

    // Update time stamps
    setInterval(() => {
      this.updateTimeStamps();
    }, 60000); // Update every minute

    // Optimize animations based on performance
    this.optimizeAnimations();
  }

  startFPSMonitoring() {
    const measureFPS = (currentTime) => {
      this.performanceMonitor.frameCount++;

      if (currentTime - this.performanceMonitor.lastTime >= 1000) {
        this.performanceMonitor.fps = this.performanceMonitor.frameCount;
        this.performanceMonitor.frameCount = 0;
        this.performanceMonitor.lastTime = currentTime;

        // Adjust performance if FPS drops significantly
        if (
          this.performanceMonitor.fps <
          this.performanceMonitor.targetFPS * 0.8
        ) {
          this.degradePerformance();
        }
      }

      if (this.state.isActive) {
        requestAnimationFrame(measureFPS);
      }
    };

    requestAnimationFrame(measureFPS);
  }

  adjustPerformance() {
    const targetFPS = this.state.isActive ? 60 : 30;
    this.performanceMonitor.targetFPS = targetFPS;

    // Adjust animation speeds and intervals based on performance target
    const animationMultiplier = this.state.isActive ? 1 : 0.5;

    document.documentElement.style.setProperty(
      "--animation-duration",
      this.state.isActive ? "0.3s" : "0.6s"
    );

    // Adjust typing speed based on activity
    this.config.typingSpeed = this.state.isActive ? 150 : 300;

    // Throttle updates when inactive
    if (!this.state.isActive) {
      this.throttleUpdates();
    }
  }

  optimizeAnimations() {
    // Use CSS transforms for better performance
    const animatedElements = document.querySelectorAll(
      ".activity-indicator, .heatmap-cell, .typing-cursor"
    );

    animatedElements.forEach((element) => {
      element.style.willChange = "transform, opacity";
      element.style.transform = "translateZ(0)"; // Force GPU acceleration
    });

    // Optimize scroll performance
    const scrollableElements = document.querySelectorAll(
      ".terminal__body, .terminal-stats__body"
    );
    scrollableElements.forEach((element) => {
      element.style.willChange = "scroll-position";
    });
  }

  degradePerformance() {
    // Reduce animation complexity when performance drops
    console.warn(
      "Performance degradation detected, reducing animation complexity"
    );

    // Disable some animations
    const heavyAnimations = document.querySelectorAll(".activity-indicator");
    heavyAnimations.forEach((element) => {
      element.style.animation = "none";
    });

    // Reduce update frequency
    this.config.refreshInterval = 60000; // Increase to 1 minute
  }

  throttleUpdates() {
    // Reduce update frequency when terminal is not active
    clearInterval(this.updateInterval);

    this.updateInterval = setInterval(() => {
      if (!this.state.isActive) {
        this.updateTimeStamps();
        this.updateGitHubStatistics();
      }
    }, 120000); // Update every 2 minutes when inactive
  }

  updateTimeStamps() {
    if (!this.state.githubData) return;

    // Update relative time stamps
    this.state.githubData.forEach((commit, index) => {
      // This would update based on actual timestamps in real implementation
      const timeOptions = [
        "just now",
        "2 minutes ago",
        "15 minutes ago",
        "1 hour ago",
        "3 hours ago",
      ];
      commit.time = timeOptions[index] || `${index + 1} hours ago`;
    });

    this.renderGitHubFeed();
  }

  formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Public API for external control
  pause() {
    this.state.isActive = false;
  }

  resume() {
    this.state.isActive = true;
  }

  refresh() {
    this.loadGitHubData();
  }

  destroy() {
    // Clean up tooltip
    if (this.tooltipContainer && this.tooltipContainer.parentNode) {
      this.tooltipContainer.parentNode.removeChild(this.tooltipContainer);
    }

    // Clear intervals
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Remove event listeners
    this.elements.trafficLights?.forEach((light, index) => {
      light.removeEventListener("click", () =>
        this.handleTrafficLightClick(index)
      );
    });
  }
}

// Initialize terminal when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait for Prism.js to load if it's being loaded asynchronously
  const initTerminal = () => {
    if (document.querySelector(".terminal")) {
      window.terminalInterface = new TerminalInterface();
    }
  };

  // Check if Prism is already loaded
  if (window.Prism) {
    initTerminal();
  } else {
    // Wait a bit for Prism to load
    setTimeout(initTerminal, 500);
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = TerminalInterface;
}
