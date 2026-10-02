const fs = require('fs');
const content = fs.readFileSync('src/components/TerminalModal.tsx', 'utf-8');
const match = content.match(/case 'overwatch': \{[\s\S]*?text: '(.*?)',/);
if (match) {
  console.log("Found in code:");
  console.log(match[1]);
  console.log("Length:", match[1].length);
  const user = `█▀█ █░█ █▀▀ █▀█ █░█░█ ▄▀█ ▀█▀ █▀▀ █░█\\n█▄█ ▀▄▀ ██▄ █▀▄ ▀▄▀▄▀ █▀█ ░█░ █▄▄ █▀█`;
  console.log("User length:", user.length);
  console.log("Are they equal?", match[1] === user);
}
