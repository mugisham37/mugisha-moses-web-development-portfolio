# Implementation Plan: HTML to Next.js Migration System

## Overview

This implementation plan provides granular copy-paste operations for migrating 4 HTML files to Next.js. Each HTML file requires multiple individual copy-paste operations with specific PowerShell commands and exact line numbers. The plan covers every CSS block, component section, and content area that needs to be migrated.

**File Analysis:**
- **index.html**: 3,772 lines (CSS: 40-2878, Content: 2888-3772)
- **Grid.html**: 3,160 lines (CSS: 40-2852, Content: 2862-3160)  
- **work.html**: 3,379 lines (CSS: 40-2852, Content: 2862-3379)
- **inqueries.html**: 2,979 lines (CSS: 40-2852, Content: 2862-2979)

## Tasks

### Phase 1: CSS Migration - Extract All CSS Blocks

- [ ] 1. Extract Font Declarations from index.html
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 39 -First 79 | Set-Content "temp_fonts_index.css"`
  - Extract @font-face declarations (lines 40-118)
  - _Requirements: 3.1, 3.2_

- [ ] 2. Extract Main CSS Block from index.html  
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 118 -First 2451 | Set-Content "temp_main_css_index.css"`
  - Extract primary CSS styles (lines 119-2569)
  - _Requirements: 3.1, 3.2_

- [ ] 3. Extract Legacy CSS from index.html
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2572 -First 165 | Set-Content "temp_legacy_css_index.css"`
  - Extract legacy headEnd CSS (lines 2573-2737)
  - _Requirements: 3.1, 3.2_

- [ ] 4. Extract Editor Bar CSS from index.html
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2742 -First 110 | Set-Content "temp_editor_css_index.css"`
  - Extract editor bar styles (lines 2743-2852)
  - _Requirements: 3.1, 3.2_

- [ ] 5. Extract Fade Animation CSS from index.html
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2854 -First 24 | Set-Content "temp_fade_css_index.css"`
  - Extract fade animation styles (lines 2855-2878)
  - _Requirements: 3.1, 3.2_

- [ ] 6. Extract Font Declarations from Grid.html
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 39 -First 79 | Set-Content "temp_fonts_grid.css"`
  - Extract @font-face declarations (lines 40-118)
  - _Requirements: 3.1, 3.2_

- [ ] 7. Extract Main CSS Block from Grid.html
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 118 -First 2451 | Set-Content "temp_main_css_grid.css"`
  - Extract primary CSS styles (lines 119-2569)
  - _Requirements: 3.1, 3.2_

- [ ] 8. Extract Legacy CSS from Grid.html
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 2572 -First 165 | Set-Content "temp_legacy_css_grid.css"`
  - Extract legacy headEnd CSS (lines 2573-2737)
  - _Requirements: 3.1, 3.2_

- [ ] 9. Extract Editor Bar CSS from Grid.html
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 2742 -First 110 | Set-Content "temp_editor_css_grid.css"`
  - Extract editor bar styles (lines 2743-2852)
  - _Requirements: 3.1, 3.2_

- [ ] 10. Extract Font Declarations from work.html
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 39 -First 79 | Set-Content "temp_fonts_work.css"`
  - Extract @font-face declarations (lines 40-118)
  - _Requirements: 3.1, 3.2_

- [ ] 11. Extract Main CSS Block from work.html
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 118 -First 2451 | Set-Content "temp_main_css_work.css"`
  - Extract primary CSS styles (lines 119-2569)
  - _Requirements: 3.1, 3.2_

- [ ] 12. Extract Legacy CSS from work.html
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 2572 -First 165 | Set-Content "temp_legacy_css_work.css"`
  - Extract legacy headEnd CSS (lines 2573-2737)
  - _Requirements: 3.1, 3.2_

- [ ] 13. Extract Editor Bar CSS from work.html
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 2742 -First 110 | Set-Content "temp_editor_css_work.css"`
  - Extract editor bar styles (lines 2743-2852)
  - _Requirements: 3.1, 3.2_

- [ ] 14. Extract Font Declarations from inqueries.html
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 39 -First 79 | Set-Content "temp_fonts_inqueries.css"`
  - Extract @font-face declarations (lines 40-118)
  - _Requirements: 3.1, 3.2_

- [ ] 15. Extract Main CSS Block from inqueries.html
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 118 -First 2451 | Set-Content "temp_main_css_inqueries.css"`
  - Extract primary CSS styles (lines 119-2569)
  - _Requirements: 3.1, 3.2_

- [ ] 16. Extract Legacy CSS from inqueries.html
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2572 -First 165 | Set-Content "temp_legacy_css_inqueries.css"`
  - Extract legacy headEnd CSS (lines 2573-2737)
  - _Requirements: 3.1, 3.2_

- [ ] 17. Extract Editor Bar CSS from inqueries.html
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2742 -First 110 | Set-Content "temp_editor_css_inqueries.css"`
  - Extract editor bar styles (lines 2743-2852)
  - _Requirements: 3.1, 3.2_

- [ ] 18. Consolidate All CSS into globals.css
  - Use PowerShell: `Get-Content temp_fonts_*.css, temp_main_css_*.css, temp_legacy_css_*.css, temp_editor_css_*.css, temp_fade_css_*.css | Set-Content "app/globals.css"`
  - Combine all CSS files maintaining proper cascade order
  - _Requirements: 3.3, 3.4_

- [ ] 19. Clean Up Temporary CSS Files
  - Use PowerShell: `Remove-Item temp_*.css`
  - Remove all temporary CSS files
  - _Requirements: 7.4_

### Phase 2: HTML Head Section Migration

- [ ] 20. Extract Head Section from index.html
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2 -First 37 | Set-Content "temp_head_index.html"`
  - Extract meta tags, title, and head content (lines 3-39)
  - _Requirements: 6.4, 6.5_

- [ ] 21. Extract Head Section from Grid.html
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 2 -First 37 | Set-Content "temp_head_grid.html"`
  - Extract meta tags, title, and head content (lines 3-39)
  - _Requirements: 6.4, 6.5_

- [ ] 22. Extract Head Section from work.html
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 2 -First 37 | Set-Content "temp_head_work.html"`
  - Extract meta tags, title, and head content (lines 3-39)
  - _Requirements: 6.4, 6.5_

- [ ] 23. Extract Head Section from inqueries.html
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2 -First 37 | Set-Content "temp_head_inqueries.html"`
  - Extract meta tags, title, and head content (lines 3-39)
  - _Requirements: 6.4, 6.5_

### Phase 3: Navigation Component Migration

- [ ] 24. Extract Navigation HTML from index.html
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2920 -First 50 | Set-Content "temp_nav_index.html"`
  - Extract sticky navigation component (lines 2921-2970)
  - _Requirements: 4.1, 4.2_

- [ ] 25. Extract Navigation HTML from Grid.html
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 2894 -First 50 | Set-Content "temp_nav_grid.html"`
  - Extract sticky navigation component (lines 2895-2945)
  - _Requirements: 4.1, 4.2_

- [ ] 26. Extract Navigation HTML from work.html
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 2894 -First 50 | Set-Content "temp_nav_work.html"`
  - Extract sticky navigation component (lines 2895-2945)
  - _Requirements: 4.1, 4.2_

- [ ] 27. Extract Navigation HTML from inqueries.html
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2894 -First 50 | Set-Content "temp_nav_inqueries.html"`
  - Extract sticky navigation component (lines 2895-2945)
  - _Requirements: 4.1, 4.2_

- [ ] 28. Create Navigation Component
  - Create app/components/Navigation.tsx
  - Wrap extracted navigation HTML in React component structure
  - Preserve all data-framer-* attributes exactly
  - _Requirements: 4.2, 4.3, 4.4_

### Phase 4: Home Page Content Migration (index.html)

- [ ] 29. Extract Home Page Main Container
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2887 -First 50 | Set-Content "temp_home_main_container.html"`
  - Extract main div container and initial structure (lines 2888-2937)
  - _Requirements: 6.2_

- [ ] 30. Extract Home Page Hero Section
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 2970 -First 200 | Set-Content "temp_home_hero.html"`
  - Extract hero section with animations (lines 2971-3170)
  - _Requirements: 4.1, 4.2_

- [ ] 31. Extract Home Page Project Gallery Section
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 3170 -First 300 | Set-Content "temp_home_gallery.html"`
  - Extract project gallery with images (lines 3171-3470)
  - _Requirements: 4.1, 4.2_

- [ ] 32. Extract Home Page About Section
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 3470 -First 200 | Set-Content "temp_home_about.html"`
  - Extract about section content (lines 3471-3670)
  - _Requirements: 4.1, 4.2_

- [ ] 33. Extract Home Page Footer Section
  - Use PowerShell: `Get-Content "html/index.html" | Select-Object -Skip 3670 -First 102 | Set-Content "temp_home_footer.html"`
  - Extract footer and closing elements (lines 3671-3772)
  - _Requirements: 4.1, 4.2_

- [ ] 34. Create Home Page Component
  - Create app/page.tsx
  - Combine all home page sections into Next.js page structure
  - Add proper TypeScript exports and metadata
  - _Requirements: 6.1, 6.5_

### Phase 5: Grid Page Content Migration (Grid.html)

- [ ] 35. Extract Grid Page Main Container
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 2861 -First 50 | Set-Content "temp_grid_main_container.html"`
  - Extract main div container and initial structure (lines 2862-2911)
  - _Requirements: 6.2_

- [ ] 36. Extract Grid Page Header Section
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 2945 -First 100 | Set-Content "temp_grid_header.html"`
  - Extract grid page header and title (lines 2946-3045)
  - _Requirements: 4.1, 4.2_

- [ ] 37. Extract Grid Page Project Grid
  - Use PowerShell: `Get-Content "html/Grid.html" | Select-Object -Skip 3045 -First 115 | Set-Content "temp_grid_projects.html"`
  - Extract project grid layout and items (lines 3046-3160)
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 38. Create Grid Page Component
  - Create app/grid/page.tsx
  - Combine all grid page sections into Next.js page structure
  - Add proper metadata for Grid page
  - _Requirements: 6.1, 6.5_

### Phase 6: Work Page Content Migration (work.html)

- [ ] 39. Extract Work Page Main Container
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 2861 -First 50 | Set-Content "temp_work_main_container.html"`
  - Extract main div container and initial structure (lines 2862-2911)
  - _Requirements: 6.2_

- [ ] 40. Extract Work Page Header Section
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 2945 -First 100 | Set-Content "temp_work_header.html"`
  - Extract work page header and navigation (lines 2946-3045)
  - _Requirements: 4.1, 4.2_

- [ ] 41. Extract Work Page Project Showcase 1
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 3045 -First 100 | Set-Content "temp_work_project1.html"`
  - Extract first project showcase section (lines 3046-3145)
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 42. Extract Work Page Project Showcase 2
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 3145 -First 100 | Set-Content "temp_work_project2.html"`
  - Extract second project showcase section (lines 3146-3245)
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 43. Extract Work Page Project Showcase 3
  - Use PowerShell: `Get-Content "html/work.html" | Select-Object -Skip 3245 -First 134 | Set-Content "temp_work_project3.html"`
  - Extract third project showcase section (lines 3246-3379)
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 44. Create Work Page Component
  - Create app/work/page.tsx
  - Combine all work page sections into Next.js page structure
  - Add proper metadata for Work page
  - _Requirements: 6.1, 6.5_

### Phase 7: Contact Page Content Migration (inqueries.html)

- [ ] 45. Extract Contact Page Main Container
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2861 -First 50 | Set-Content "temp_contact_main_container.html"`
  - Extract main div container and initial structure (lines 2862-2911)
  - _Requirements: 6.2_

- [ ] 46. Extract Contact Page Header Section
  - Use PowerShell: `Get-Content "html/inqueries.html" | Select-Object -Skip 2945 -First 34 | Set-Content "temp_contact_header.html"`
  - Extract contact page header and form (lines 2946-2979)
  - _Requirements: 4.1, 4.2_

- [ ] 47. Create Contact Page Component
  - Create app/contact/page.tsx (note: inqueries.html → /contact route)
  - Combine all contact page sections into Next.js page structure
  - Add proper metadata for Contact page
  - _Requirements: 6.1, 6.5, 2.6_

### Phase 8: Component Creation and Optimization

- [ ] 48. Create Hero Section Component
  - Create app/components/HeroSection.tsx
  - Use temp_home_hero.html content
  - Preserve all Framer Motion animations and data attributes
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 49. Create Project Grid Component
  - Create app/components/ProjectGrid.tsx
  - Use temp_grid_projects.html content
  - Preserve all image references and hover animations
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 50. Create Project Showcase Component
  - Create app/components/ProjectShowcase.tsx
  - Use temp_work_project*.html content
  - Create reusable component for work showcases
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 51. Create Contact Form Component
  - Create app/components/ContactForm.tsx
  - Use temp_contact_header.html content
  - Preserve form validation and interactive elements
  - _Requirements: 4.1, 4.2, 4.3_

### Phase 9: Layout and Root Structure

- [ ] 52. Create Root Layout Component
  - Create app/layout.tsx
  - Include Navigation component in layout
  - Set up global CSS import and font loading
  - _Requirements: 2.1, 2.3_

- [ ] 53. Set Up Next.js Metadata API
  - Convert extracted head sections to Next.js metadata
  - Consolidate meta tags, titles, and SEO content
  - Preserve all Open Graph and Twitter card data
  - _Requirements: 6.4, 6.5_

- [ ] 54. Configure Font Loading
  - Extract font declarations from CSS
  - Set up proper Next.js font loading with Inter Display
  - Verify all font URLs and unicode ranges
  - _Requirements: 1.4, 3.7_

### Phase 10: Framer Motion and Animation Migration

- [ ] 55. Extract Framer Motion Scripts from index.html
  - Use PowerShell to identify and extract JavaScript blocks
  - Preserve all data-framer-* attributes and animation triggers
  - Create temp_animations_index.js file
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 56. Extract Framer Motion Scripts from Grid.html
  - Use PowerShell to identify and extract JavaScript blocks
  - Preserve animation configurations and interactions
  - Create temp_animations_grid.js file
  - _Requirements: 5.1, 5.2_

- [ ] 57. Extract Framer Motion Scripts from work.html
  - Use PowerShell to identify and extract JavaScript blocks
  - Preserve project showcase animations
  - Create temp_animations_work.js file
  - _Requirements: 5.1, 5.2_

- [ ] 58. Extract Framer Motion Scripts from inqueries.html
  - Use PowerShell to identify and extract JavaScript blocks
  - Preserve form animations and interactions
  - Create temp_animations_inqueries.js file
  - _Requirements: 5.1, 5.2_

- [ ] 59. Create Animation Utilities File
  - Create app/animations.ts
  - Consolidate all extracted Framer Motion code
  - Convert to proper TypeScript exports and imports
  - _Requirements: 5.4, 5.5_

### Phase 11: Asset Migration and Verification

- [ ] 60. Identify All Image References
  - Scan all extracted HTML files for image URLs
  - Create list of all Framer CDN image references
  - Document image dimensions and usage contexts
  - _Requirements: 9.4_

- [ ] 61. Verify External CDN References
  - Check all Framer CDN links are preserved in components
  - Verify Google Analytics and external script references
  - Ensure all font URLs are working correctly
  - _Requirements: 1.4, 9.4_

- [ ] 62. Update Asset Paths for Next.js
  - Review all asset references in components
  - Ensure proper Next.js Image component usage where needed
  - Verify all external URLs are preserved exactly
  - _Requirements: 9.4_

### Phase 12: Final Cleanup and Validation

- [ ] 63. Clean Up All Temporary Files
  - Use PowerShell: `Remove-Item temp_*.html, temp_*.js`
  - Remove all temporary extraction files
  - Verify no temporary files remain in project
  - _Requirements: 7.4_

- [ ] 64. Validate Next.js Project Structure
  - Verify all page.tsx files exist in correct directories
  - Check component files are properly structured
  - Ensure globals.css contains all consolidated styles
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 65. Test Copy-Paste Fidelity
  - Compare extracted content with original HTML files
  - Verify no content has been lost or modified during extraction
  - Check that all Framer attributes are preserved exactly
  - _Requirements: 4.3, 4.4, 8.4_

- [ ] 66. Create Migration Report
  - Document all completed copy-paste operations
  - List any expected HTML-to-JSX syntax errors for manual cleanup
  - Provide summary of migrated components and pages
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 67. Final Migration Verification
  - Ensure all 4 HTML files have been completely processed
  - Verify all CSS has been consolidated into globals.css
  - Confirm all components and pages are created and functional
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

## Notes

- Each task represents a specific copy-paste operation with exact PowerShell commands
- Line numbers are based on actual file analysis: index.html (3,772 lines), Grid.html (3,160 lines), work.html (3,379 lines), inqueries.html (2,979 lines)
- All PowerShell commands use exact Skip and First parameters for precise extraction
- Expected HTML-to-JSX syntax errors (class vs className) will be fixed manually after migration
- All data-framer-* attributes must be preserved exactly to maintain animations
- The copy-paste methodology ensures pixel-perfect fidelity with original HTML files