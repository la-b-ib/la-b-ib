const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// We just need to remove the onOpenCtf prop passed to TerminalModal
content = content.replace(/onOpenCtf=\{\(\) => \{\s*setTerminalOpen\(false\);\s*setCtfOpen\(true\);\s*\}\}/g, '');

fs.writeFileSync('src/App.tsx', content);
