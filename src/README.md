# HTML to Next.js Migration System

This directory contains the core implementation of the HTML to Next.js migration system that uses a copy-paste methodology to preserve pixel-perfect visual fidelity while converting static HTML files to a modern React-based Next.js architecture.

## Project Structure

```
src/
├── types/
│   └── index.ts              # Core TypeScript interfaces and types
├── migration/
│   ├── index.ts              # Migration system exports
│   ├── AnalysisEngine.ts     # HTML file parsing and structure analysis
│   ├── MigrationPlanner.ts   # Migration plan generation with PowerShell commands
│   ├── CopyPasteExecutor.ts  # Command execution with precision and error handling
│   ├── ComponentMapper.ts    # Component identification and extraction planning
│   ├── CSSExtractor.ts       # CSS consolidation and preservation
│   ├── AssetCataloger.ts     # Asset and dependency inventory
│   └── ValidationSystem.ts   # Migration result validation and reporting
├── __tests__/
│   ├── setup.test.ts         # Basic project structure and interface tests
│   └── property-based.test.ts # Property-based testing setup verification
├── index.ts                  # Main entry point and orchestrator class
└── README.md                 # This documentation file
```

## Core Components

### Analysis Engine
Parses HTML files to identify:
- CSS blocks with exact line numbers
- JavaScript/Framer Motion blocks
- Semantic HTML sections and component boundaries
- External dependencies and assets

### Migration Planner
Generates precise execution plans with:
- PowerShell Get-Content commands with exact line parameters
- Component extraction plans
- CSS consolidation strategies
- Next.js route structure mapping

### Copy-Paste Executor
Executes migration commands with:
- PowerShell command execution
- Content integrity verification
- Error tolerance for React syntax incompatibilities
- Backup and rollback capabilities

### Component Mapper
Identifies and extracts:
- Navigation components
- Layout components (containers, grids, sections)
- Content components (project cards, info sections)
- Interactive components with Framer Motion animations

### CSS Extractor
Consolidates styling by:
- Extracting all CSS blocks from HTML files
- Preserving CSS order and cascade specificity
- Maintaining custom properties and Framer-specific styles
- Creating a single globals.css file

### Asset Cataloger
Inventories all external dependencies:
- Image references for Next.js optimization
- Font loading and CSS imports
- External script references and CDN links
- SVG definitions and icon references
- Meta tags and SEO configurations

### Validation System
Validates migration results through:
- Structural integrity checks
- Content preservation verification
- Functional testing of routes and components
- Comprehensive cleanup report generation

## Testing Framework

The system uses Jest with fast-check for property-based testing:

- **Unit Tests**: Verify specific examples and edge cases
- **Property Tests**: Verify universal properties across all inputs
- **Integration Tests**: Test end-to-end migration flows

### Property-Based Testing

Each correctness property from the design document will be implemented as a property-based test with minimum 100 iterations to ensure comprehensive input coverage.

## Usage

```typescript
import { HTMLToNextJSMigrationSystem } from './src';

const migrationSystem = new HTMLToNextJSMigrationSystem();

// Execute migration for HTML files
const result = await migrationSystem.executeMigration([
  'html/index.html',
  'html/Grid.html', 
  'html/inqueries.html',
  'html/work.html'
]);

console.log('Migration completed:', result.success);
console.log('Validation result:', result.validationResult);
```

## Implementation Status

✅ **Task 1 Complete**: Project structure and core interfaces established
- TypeScript configuration with Next.js integration
- Jest setup with fast-check for property-based testing
- All core interfaces defined with comprehensive type safety
- Main system classes created with method signatures
- Basic test suite verifying project structure

🔄 **Next Tasks**: Implementation of individual components starting with HTML Analysis Engine

## Requirements Traceability

This implementation addresses:
- **Requirement 2.1**: Next.js project structure creation
- **Requirement 2.3**: Component directory and globals.css setup

The project structure provides the foundation for implementing all remaining requirements through the subsequent tasks in the implementation plan.