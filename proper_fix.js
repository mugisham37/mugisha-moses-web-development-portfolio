const fs = require('fs');

// Read the backup file
let content = fs.readFileSync('src/components/main.tsx.backup', 'utf8');

// 1. Replace class with className
content = content.replace(/\bclass=/g, 'className=');

// 2. Replace tabindex with tabIndex  
content = content.replace(/\btabindex=/g, 'tabIndex=');

// 3. Fix self-closing img tags
content = content.replace(/<img\s+([^>]*)>/g, '<img $1 />');

// 4. Convert style attributes properly for React
content = content.replace(/style="([^"]*)"/g, (match, cssString) => {
  const styles = [];
  const declarations = cssString.split(';').filter(d => d.trim());
  
  for (const decl of declarations) {
    const colonIndex = decl.indexOf(':');
    if (colonIndex === -1) continue;
    
    let prop = decl.substring(0, colonIndex).trim();
    let value = decl.substring(colonIndex + 1).trim();
    
    // Escape quotes and backslashes in value
    value = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    
    // CSS custom properties need to be quoted as keys
    if (prop.startsWith('--')) {
      styles.push(`"${prop}": "${value}"`);
    } else {
      // Convert kebab-case to camelCase
      const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles.push(`${camelProp}: "${value}"`);
    }
  }
  
  if (styles.length === 0) return 'style={{}}';
  
  return `style={{${styles.join(', ')}}}`;
});

// Write the fixed content
fs.writeFileSync('src/components/main.tsx', content, 'utf8');
console.log('All fixes applied successfully!');
