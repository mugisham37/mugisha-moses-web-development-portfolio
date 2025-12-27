/**
 * HTML to Next.js Migration System
 * Main entry point for the migration system
 */

export * from './types';
export * from './migration';

// Main migration system class that orchestrates the entire process
import { 
  AnalysisEngine,
  MigrationPlanner,
  CopyPasteExecutor,
  ComponentMapper,
  CSSExtractor,
  AssetCataloger,
  ValidationSystem
} from './migration';

import { 
  HTMLAnalysis,
  MigrationPlan,
  ExecutionResult,
  ValidationResult,
  MigrationState
} from './types';

/**
 * Main Migration System orchestrator
 */
export class HTMLToNextJSMigrationSystem {
  private analysisEngine: AnalysisEngine;
  private migrationPlanner: MigrationPlanner;
  private copyPasteExecutor: CopyPasteExecutor;
  private componentMapper: ComponentMapper;
  private cssExtractor: CSSExtractor;
  private assetCataloger: AssetCataloger;
  private validationSystem: ValidationSystem;
  private migrationState: MigrationState;

  constructor() {
    this.analysisEngine = new AnalysisEngine();
    this.migrationPlanner = new MigrationPlanner();
    this.copyPasteExecutor = new CopyPasteExecutor();
    this.componentMapper = new ComponentMapper();
    this.cssExtractor = new CSSExtractor();
    this.assetCataloger = new AssetCataloger();
    this.validationSystem = new ValidationSystem();
    
    this.migrationState = {
      phase: 'analysis',
      progress: {
        analyzed: [],
        planned: [],
        executed: [],
        validated: []
      },
      errors: [],
      warnings: []
    };
  }

  /**
   * Executes the complete migration process
   * @param htmlFiles Array of HTML file paths to migrate
   * @returns Promise resolving to final migration results
   */
  async executeMigration(htmlFiles: string[]): Promise<{
    success: boolean;
    executionResult: ExecutionResult;
    validationResult: ValidationResult;
    migrationState: MigrationState;
  }> {
    // Implementation will be added in subsequent tasks
    throw new Error('Method not implemented yet - will be implemented in task 9.1');
  }

  /**
   * Gets the current migration state
   * @returns Current MigrationState object
   */
  getMigrationState(): MigrationState {
    return { ...this.migrationState };
  }

  /**
   * Resets the migration system to initial state
   */
  reset(): void {
    this.migrationState = {
      phase: 'analysis',
      progress: {
        analyzed: [],
        planned: [],
        executed: [],
        validated: []
      },
      errors: [],
      warnings: []
    };
  }
}