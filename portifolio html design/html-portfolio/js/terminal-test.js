/**
 * Terminal Interface Test Script
 * Verifies all terminal features are working correctly
 */

function testTerminalInterface() {
  console.log("🧪 Testing Terminal Interface...");

  const tests = [
    {
      name: "Terminal Elements Exist",
      test: () => {
        const terminal = document.querySelector(".terminal");
        const trafficLights = document.querySelectorAll(
          ".terminal__traffic-light"
        );
        const githubFeed = document.querySelector(".github-feed");
        const codeDisplay = document.querySelector(".code-display");
        const fileTree = document.querySelector(".file-tree__list");
        const heatmap = document.querySelector(".github-heatmap");

        return (
          terminal &&
          trafficLights.length === 3 &&
          githubFeed &&
          codeDisplay &&
          fileTree &&
          heatmap
        );
      },
    },
    {
      name: "Terminal Interface Instance Created",
      test: () => {
        return window.terminalInterface instanceof TerminalInterface;
      },
    },
    {
      name: "GitHub Feed Populated",
      test: () => {
        const commitEntries = document.querySelectorAll(".commit-entry");
        return commitEntries.length > 0;
      },
    },
    {
      name: "File Tree Rendered",
      test: () => {
        const fileTreeItems = document.querySelectorAll(".file-tree__item");
        return fileTreeItems.length > 0;
      },
    },
    {
      name: "GitHub Heatmap Generated",
      test: () => {
        const heatmapCells = document.querySelectorAll(".heatmap-cell");
        return heatmapCells.length > 0;
      },
    },
    {
      name: "Syntax Highlighting Available",
      test: () => {
        return typeof window.Prism !== "undefined";
      },
    },
    {
      name: "Traffic Lights Interactive",
      test: () => {
        const trafficLights = document.querySelectorAll(
          ".terminal__traffic-light"
        );
        return Array.from(trafficLights).every(
          (light) =>
            light.getAttribute("tabindex") === "0" &&
            light.getAttribute("aria-label")
        );
      },
    },
  ];

  const results = tests.map((test) => {
    try {
      const passed = test.test();
      console.log(
        `${passed ? "✅" : "❌"} ${test.name}: ${passed ? "PASS" : "FAIL"}`
      );
      return { name: test.name, passed };
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      return { name: test.name, passed: false, error: error.message };
    }
  });

  const passedTests = results.filter((r) => r.passed).length;
  const totalTests = results.length;

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log("🎉 All terminal interface tests passed!");
  } else {
    console.log("⚠️ Some tests failed. Check implementation.");
  }

  return results;
}

// Auto-run tests when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Wait for terminal to initialize
  setTimeout(() => {
    if (document.querySelector(".terminal")) {
      testTerminalInterface();
    } else {
      console.log("⚠️ Terminal not found on this page");
    }
  }, 2000);
});

// Export for manual testing
window.testTerminalInterface = testTerminalInterface;
