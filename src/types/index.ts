/**
 * Core interfaces for the HTML to Next.js Migration System
 * These interfaces define the data structures used throughout the migration process
 */

/**
 * Represents the analysis result of an HTML file
 */
export interface HTMLAnalysis {
  fileName: string;
  totalLines: number;
  cssBlocks: CSSBlock[];
  jsBlocks: JSBlock[];
  components: ComponentBoundary[];
  assets: AssetReference[];
}

/**
 * Represents a CSS block found in HTML with exact line boundaries
 */
export interface CSSBlock {
  startLine: number;
  endLine: number;
  type: 'inline' | 'framer' | 'custom';
  content: string;
}

/**
 * Represents a JavaScript block found in HTML with exact line boundaries
 */
export interface JSBlock {
  startLine: number;
  endLine: number;
  type: 'framer-motion' | 'inline' | 'external';
  content: string;
}

/**
 * Represents the boundaries of a component within HTML
 */
export interface ComponentBoundary {
  name: string;
  startLine: number;
  endLine: number;
  startTag: string;
  endTag: string;
  isReusable: boolean;
}

/**
 * Represents an asset reference found in HTML
 */
export interface AssetReference {
  type: 'image' | 'font' | 'script' | 'svg' | 'css' | 'meta';
  path: string;
  line: number;
  attributes: Record<string, string>;
}

/**
 * Represents a complete migration plan for the HTML to Next.js conversion
 */
export interface MigrationPlan {
  sourceFiles: string[];
  targetStructure: NextJSProjectStructure;
  commands: PowerShellCommand[];
  componentExtractions: ComponentExtractionPlan[];
  cssConsolidation: CSSConsolidationPlan;
  routeMapping: RouteMapping[];
}

/**
 * Represents a PowerShell command to be executed during migration
 */
export interface PowerShellCommand {
  operation: 'extract' | 'create' | 'append' | 'cleanup';
  sourceFile: string;
  targetFile: string;
  startLine: number;
  lineCount: number;
  command: string;
}

/**
 * Represents the target Next.js project structure
 */
export interface NextJSProjectStructure {
  app: {
    layout: ComponentFile;
    page: ComponentFile;
    globals: CSSFile;
    routes: {
      [routeName: string]: {
        page: ComponentFile;
        components?: ComponentFile[];
      };
    };
  };
  components: {
    [componentName: string]: ComponentFile;
  };
  public: AssetDirectory;
}

/**
 * Represents a component file in the Next.js project
 */
export interface ComponentFile {
  path: string;
  content: string;
  dependencies: string[];
  sourceMapping: {
    originalFile: string;
    startLine: number;
    endLine: number;
  };
}

/**
 * Represents a CSS file in the Next.js project
 */
export interface CSSFile {
  path: string;
  content: string;
  sourceBlocks: {
    originalFile: string;
    startLine: number;
    endLine: number;
  }[];
}

/**
 * Represents an asset directory structure
 */
export interface AssetDirectory {
  path: string;
  files: string[];
}

/**
 * Represents a plan for extracting a component from HTML
 */
export interface ComponentExtractionPlan {
  name: string;
  sourceFile: string;
  boundaries: ComponentBoundary;
  dependencies: string[];
  wrapperTemplate: string;
}

/**
 * Represents a plan for consolidating CSS from multiple sources
 */
export interface CSSConsolidationPlan {
  targetFile: string;
  sourceBlocks: CSSBlock[];
  preserveOrder: boolean;
}

/**
 * Represents the mapping between HTML files and Next.js routes
 */
export interface RouteMapping {
  htmlFile: string;
  nextjsRoute: string;
  pagePath: string;
}

/**
 * Represents the current state of the migration process
 */
export interface MigrationState {
  phase: 'analysis' | 'planning' | 'execution' | 'validation' | 'complete';
  progress: {
    analyzed: string[];
    planned: string[];
    executed: PowerShellCommand[];
    validated: string[];
  };
  errors: MigrationError[];
  warnings: MigrationWarning[];
}

/**
 * Represents an error that occurred during migration
 */
export interface MigrationError {
  type: 'copy_failed' | 'syntax_error' | 'missing_dependency';
  file: string;
  line?: number;
  message: string;
  command?: string;
}

/**
 * Represents a warning generated during migration
 */
export interface MigrationWarning {
  type: 'syntax_compatibility' | 'manual_fix_required' | 'optimization_opportunity';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

/**
 * Represents the result of executing migration commands
 */
export interface ExecutionResult {
  success: boolean;
  completedCommands: PowerShellCommand[];
  failedCommands: PowerShellCommand[];
  errors: MigrationError[];
  warnings: MigrationWarning[];
}

/**
 * Represents the result of validating migration results
 */
export interface ValidationResult {
  passed: boolean;
  message: string;
  details?: any;
}

/**
 * Represents a structural validation test
 */
export interface StructuralTest {
  name: string;
  validate: (projectStructure: NextJSProjectStructure) => ValidationResult;
}

/**
 * Represents a content validation test
 */
export interface ContentTest {
  name: string;
  sourceFile: string;
  targetFiles: string[];
  validate: (source: string, targets: string[]) => ValidationResult;
}

/**
 * Represents a functional validation test
 */
export interface FunctionalTest {
  name: string;
  validate: () => Promise<ValidationResult>;
}

/**
 * Represents a complete validation suite
 */
export interface ValidationSuite {
  structuralTests: StructuralTest[];
  contentTests: ContentTest[];
  functionalTests: FunctionalTest[];
}

/**
 * Represents a cleanup report for manual fixes
 */
export interface CleanupReport {
  syntaxFixes: {
    file: string;
    issues: string[];
    suggestions: string[];
  }[];
  importStatements: {
    file: string;
    requiredImports: string[];
  }[];
  typeScriptFixes: {
    file: string;
    typeErrors: string[];
    suggestions: string[];
  }[];
  nextjsOptimizations: {
    file: string;
    optimizations: string[];
  }[];
}