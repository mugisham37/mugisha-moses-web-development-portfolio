# Implementation Plan: HTML to Next.js Migration System

## Overview

This implementation plan provides direct copy-paste operations for migrating 4 HTML files to Next.js components and pages. Each task creates actual project files (components, pages, CSS) rather than temporary files, ensuring a streamlined migration process.

**File Analysis:**
- **index.html**: 3,772 lines (CSS: 40-2878, Content: 2888-3772)
- **Grid.html**: 3,160 lines (CSS: 40-2852, Content: 2862-3160)  
- **work.html**: 3,379 lines (CSS: 40-2852, Content: 2862-3379)
- **inqueries.html**: 2,979 lines (CSS: 40-2852, Content: 2862-2979)

**Direct Migration Approach:**
- CSS blocks are extracted directly to `app/globals.css` using `Add-Content`
- HTML components are extracted and immediately wrapped in React components
- Pages are created directly in the Next.js app directory structure
- No temporary files - all content goes directly to final destinations

## Tasks

### Phase 1: CSS Migration - Direct to globals.css

- [x] 1. Extract Font Declarations from index.html to globals.css
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 39 -First 79 | Add-Content "app/globals.css"`
  - Extract @font-face declarations (lines 40-118) directly to globals.css
  - _Requirements: 3.1, 3.2_

- [x] 2. Extract Main CSS Block from index.html to globals.css  
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 118 -First 2451 | Add-Content "app/globals.css"`
  - Extract primary CSS styles (lines 119-2569) directly to globals.css
  - _Requirements: 3.1, 3.2_

- [x] 3. Extract Legacy CSS from index.html to globals.css
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2572 -First 165 | Add-Content "app/globals.css"`
  - Extract legacy headEnd CSS (lines 2573-2737) directly to globals.css
  - _Requirements: 3.1, 3.2_

- [x] 4. Extract Editor Bar CSS from index.html to globals.css
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2742 -First 110 | Add-Content "app/globals.css"`
  - Extract editor bar styles (lines 2743-2852) directly to globals.css
  - _Requirements: 3.1, 3.2_

- [x] 5. Extract Fade Animation CSS from index.html to globals.css
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2854 -First 24 | Add-Content "app/globals.css"`
  - Extract fade animation styles (lines 2855-2878) directly to globals.css
  - _Requirements: 3.1, 3.2_

- [x] 6. Extract Additional CSS from Grid.html to globals.css
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 118 -First 2451 | Add-Content "app/globals.css"`
  - Extract any unique CSS styles from Grid.html (lines 119-2569) directly to globals.css
  - _Requirements: 3.1, 3.2_

- [ ] 7. Extract Additional CSS from work.html to globals.css
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 118 -First 2451 | Add-Content "app/globals.css"`
  - Extract any unique CSS styles from work.html (lines 119-2569) directly to globals.css
  - _Requirements: 3.1, 3.2_

- [ ] 8. Extract Additional CSS from inqueries.html to globals.css
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 118 -First 2451 | Add-Content "app/globals.css"`
  - Extract any unique CSS styles from inqueries.html (lines 119-2569) directly to globals.css
  - _Requirements: 3.1, 3.2_

### Phase 2: Component Creation - Direct Component Files

- [ ] 9. Create Navigation Component
  - Create app/components/ directory if it doesn't exist
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2920 -First 50 > temp_nav.html`
  - Create app/components/Navigation.tsx with React component wrapper
  - Extract navigation HTML (lines 2921-2970) and wrap in TypeScript component
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 10. Create Hero Section Component
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2970 -First 200 > temp_hero.html`
  - Create app/components/HeroSection.tsx with React component wrapper
  - Extract hero section HTML (lines 2971-3170) and wrap in TypeScript component
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 11. Create Project Grid Component
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 3045 -First 115 > temp_grid.html`
  - Create app/components/ProjectGrid.tsx with React component wrapper
  - Extract project grid HTML (lines 3046-3160) and wrap in TypeScript component
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 12. Create Project Showcase Component
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 3045 -First 334 > temp_showcase.html`
  - Create app/components/ProjectShowcase.tsx with React component wrapper
  - Extract project showcase HTML (lines 3046-3379) and wrap in TypeScript component
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 13. Create Contact Form Component
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2945 -First 34 > temp_contact.html`
  - Create app/components/ContactForm.tsx with React component wrapper
  - Extract contact form HTML (lines 2946-2979) and wrap in TypeScript component
  - _Requirements: 4.1, 4.2, 4.3_

### Phase 3: Page Creation - Direct Next.js Pages

- [ ] 14. Create Home Page (app/page.tsx)
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2887 -First 885 > temp_home_content.html`
  - Create app/page.tsx with complete home page content
  - Extract main content (lines 2888-3772) and wrap in Next.js page structure
  - Import HeroSection component and other home-specific components
  - _Requirements: 6.1, 6.2_

- [ ] 15. Create Grid Page (app/grid/page.tsx)
  - Create app/grid/ directory if it doesn't exist
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 2861 -First 299 > temp_grid_content.html`
  - Create app/grid/page.tsx with complete grid page content
  - Extract main content (lines 2862-3160) and wrap in Next.js page structure
  - Import ProjectGrid component
  - _Requirements: 6.1, 6.2_

- [ ] 16. Create Work Page (app/work/page.tsx)
  - Create app/work/ directory if it doesn't exist
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 2861 -First 518 > temp_work_content.html`
  - Create app/work/page.tsx with complete work page content
  - Extract main content (lines 2862-3379) and wrap in Next.js page structure
  - Import ProjectShowcase component
  - _Requirements: 6.1, 6.2_

- [ ] 17. Create Contact Page (app/contact/page.tsx)
  - Create app/contact/ directory if it doesn't exist
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2861 -First 118 > temp_contact_content.html`
  - Create app/contact/page.tsx with complete contact page content
  - Extract main content (lines 2862-2979) and wrap in Next.js page structure
  - Import ContactForm component
  - _Requirements: 6.1, 6.2, 2.6_

### Phase 4: Layout and Metadata Setup

- [ ] 18. Update Root Layout (app/layout.tsx)
  - Extract head section metadata from HTML files (lines 3-39)
  - Update app/layout.tsx with proper metadata, fonts, and Navigation component
  - Import Navigation component and include in layout
  - Set up Inter Display font loading and Google Analytics
  - _Requirements: 2.1, 2.3, 6.4, 6.5_

- [ ] 19. Configure Next.js Metadata API
  - Extract meta tags, titles, and SEO content from all HTML files
  - Create metadata objects for each page (home, grid, work, contact)
  - Preserve all Open Graph and Twitter card data
  - Set up proper favicon and icon references
  - _Requirements: 6.4, 6.5_

### Phase 5: Framer Motion and Animation Migration

- [ ] 20. Extract and Preserve Framer Motion Scripts
  - Identify all data-framer-* attributes in extracted HTML
  - Preserve all Framer Motion configurations and animation triggers
  - Ensure all animation CSS and keyframes are included in globals.css
  - Document any JavaScript blocks that need manual integration
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

### Phase 6: Final Integration and Cleanup

- [ ] 21. Clean Up Temporary HTML Files
  - Use PowerShell: `Remove-Item temp_*.html`
  - Remove all temporary HTML extraction files
  - Verify all content has been integrated into actual components
  - _Requirements: 7.4_

- [ ] 22. Validate Project Structure
  - Verify all page.tsx files exist in correct directories
  - Check component files are properly structured in app/components/
  - Ensure globals.css contains all consolidated styles
  - Confirm all imports and exports are correct
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 23. Test Copy-Paste Fidelity
  - Compare extracted content with original HTML files
  - Verify no content has been lost or modified during extraction
  - Check that all Framer attributes are preserved exactly
  - Validate all external asset URLs are maintained
  - _Requirements: 4.3, 4.4, 8.4, 9.4_

- [ ] 24. Create Migration Report
  - Document all completed copy-paste operations
  - List expected HTML-to-JSX syntax errors for manual cleanup
  - Provide summary of migrated components and pages
  - Create checklist for final manual cleanup tasks
  - _Requirements: 9.1, 9.2, 9.3_

## Notes

- Each task creates actual project files directly (no temporary files)
- CSS is consolidated directly into app/globals.css using Add-Content commands
- Components are created directly in app/components/ with proper React wrappers
- Pages are created directly in app/ directory structure with Next.js conventions
- Line numbers are based on actual file analysis: index.html (3,772 lines), Grid.html (3,160 lines), work.html (3,379 lines), inqueries.html (2,979 lines)
- All PowerShell commands use exact Skip and First parameters for precise extraction
- Expected HTML-to-JSX syntax errors (class vs className) will be fixed manually after migration
- All data-framer-* attributes must be preserved exactly to maintain animations
- The direct copy-paste methodology ensures pixel-perfect fidelity with original HTML files
- No cleanup of temporary files needed since all content goes directly to final destinations