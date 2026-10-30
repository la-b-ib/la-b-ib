const fs = require('fs');
const path = require('path');

function updateFile(filePath, transformations) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  for (const { name, pattern, replacement } of transformations) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (before !== content) {
      console.log(`[${path.basename(filePath)}] Applied: ${name}`);
    } else {
      console.warn(`[${path.basename(filePath)}] Pattern NOT matched: ${name}`);
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Successfully saved ${filePath}\n`);
  } else {
    console.log(`No changes made to ${filePath}\n`);
  }
}

// 1. HeroSection.tsx
updateFile('src/components/HeroSection.tsx', [
  {
    name: 'Card 1 Bug Icon',
    pattern: /(<i className="ri-bug-2-line flex items-center justify-center)([^"]*)(" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '$1 site-icon-30$3 style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'Card 2 RAM Icon',
    pattern: /(<i className="ri-ram-line flex items-center justify-center)([^"]*)(" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '$1 site-icon-30$3 style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'Card 3 Swap Icon',
    pattern: /(<i className="ri-swap-3-line flex items-center justify-center)([^"]*)(" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '$1 site-icon-30$3 style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'Card 4 Certificate Icon',
    pattern: /(<i className="ri-certificate-line flex items-center justify-center)([^"]*)(" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '$1 site-icon-30$3 style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'Close Detail Drawer Icon',
    pattern: /(<i className="ri-close-circle-line flex items-center justify-center" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '<i className="ri-close-circle-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  }
]);

// 2. AboutSection.tsx
updateFile('src/components/AboutSection.tsx', [
  {
    name: 'CGPA Trophy Icon',
    pattern: /(<i className="ri-trophy-line flex items-center justify-center" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '<i className="ri-trophy-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'LANG Java Icon',
    pattern: /(<i className="ri-java-line flex items-center justify-center" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '<i className="ri-java-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'DFIR Repository Icon',
    pattern: /(<i className="ri-git-repository-private-line flex items-center justify-center" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '<i className="ri-git-repository-private-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'ARCH Pass Icon',
    pattern: /(<i className="ri-pass-expired-line flex items-center justify-center" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '<i className="ri-pass-expired-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'ORGS Team Icon',
    pattern: /(<i className="ri-team-line flex items-center justify-center" style={{ width: "30px", height: "30px" }}>)/,
    replacement: '<i className="ri-team-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'Publications Card Header Icon Wrapper',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#042e60\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}/g,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#042e60] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Publications View Paper Link Icon',
    pattern: /<i className="ri-link-unlink-m flex items-center justify-center text-lg" style={{\s*width:\s*"30px",\s*height:\s*"30px"\s*}}>/g,
    replacement: '<i className="ri-link-unlink-m flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'Academic Portals Card Header Icon',
    pattern: /<i className={`\${portal\.icon \|\| 'ri-external-link-line'} flex items-center justify-center` style={{\s*width:\s*"30px",\s*height:\s*"30px"\s*}}>/g,
    replacement: '<i className={`${portal.icon || \'ri-external-link-line\'} flex items-center justify-center site-icon-30`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}>'
  },
  {
    name: 'Academic Portals Action Button Wrapper',
    pattern: /className="flex items-center justify-center text-\[#a8c7fa\] cursor-pointer p-0\.5"/g,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center text-[#a8c7fa] cursor-pointer site-icon-btn-30"'
  },
  {
    name: 'Academic Portals Action Button Icon',
    pattern: /<i className="ri-link-unlink text-base text-\[#a8c7fa\]"><\/i>/g,
    replacement: '<i className="ri-link-unlink site-icon-30 text-[#a8c7fa]" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 3. CredentialsSection.tsx
updateFile('src/components/CredentialsSection.tsx', [
  {
    name: 'CERTS Badge 32.9948px -> 30px',
    pattern: /className="w-\[32\.9948px\] h-\[32\.9948px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm" style={{\s*width:\s*"32\.9948px",\s*height:\s*"32\.9948px"\s*}} title="Certifications">\s*<i className="ri-shield-star-line"[^>]*><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }} title="Certifications">\n                    <i className="ri-shield-star-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'BADGES Badge 32.9948px -> 30px',
    pattern: /className="w-\[32\.9948px\] h-\[32\.9948px\] shrink-0 rounded-lg bg-\[#fdd663\] text-\[#3b2f00\] flex items-center justify-center text-base font-bold shadow-sm" style={{\s*width:\s*"32\.9948px",\s*height:\s*"32\.9948px"\s*}} title="Digital Badges">\s*<i className="ri-medal-line"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }} title="Digital Badges">\n                    <i className="ri-medal-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Cert item card header badge 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#042e60\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#042e60] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Verify Certificate button 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-lg bg-\[#a8c7fa\] hover:bg-\[#c2e7ff\] text-\[#00325b\] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}>\s*<i className="ri-link-unlink-m text-\[27px\]" style={{\s*fontSize:\s*"27px"\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer site-icon-btn-30" style={{ width: "30px", height: "30px" }}>\n                            <i className="ri-link-unlink-m site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Badge item card header icon 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#fdd663\] text-\[#3b2f00\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Badge copy ID button 33px -> 30px',
    pattern: /className={`w-\[33px\] h-\[33px\] rounded-lg flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer \${/,
    replacement: 'className={`w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer site-icon-btn-30 ${'
  },
  {
    name: 'Badge view credly button 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-lg bg-\[#fdd663\] hover:bg-\[#ffe088\] text-\[#3b2f00\] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}>\s*<i className="ri-link-unlink-m text-\[27px\]" style={{\s*fontSize:\s*"27px"\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg bg-[#fdd663] hover:bg-[#ffe088] text-[#3b2f00] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer site-icon-btn-30" style={{ width: "30px", height: "30px" }}>\n                              <i className="ri-link-unlink-m site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Profiles tab card header icon 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Profile visit link action button wrapper',
    pattern: /className="flex items-center justify-center text-\[#a8c7fa\] cursor-pointer p-0\.5"/g,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center text-[#a8c7fa] cursor-pointer site-icon-btn-30"'
  },
  {
    name: 'Profile visit link action button icon',
    pattern: /<i className="ri-link-unlink text-base text-\[#a8c7fa\]"><\/i>/g,
    replacement: '<i className="ri-link-unlink site-icon-30 text-[#a8c7fa]" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 4. ArsenalSection.tsx
updateFile('src/components/ArsenalSection.tsx', [
  {
    name: 'Profiles tab card header icon 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Profile visit link action button wrapper',
    pattern: /className="flex items-center justify-center text-\[#a8c7fa\] cursor-pointer p-0\.5"/g,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center text-[#a8c7fa] cursor-pointer site-icon-btn-30"'
  },
  {
    name: 'Profile visit link action button icon',
    pattern: /<i className="ri-link-unlink text-base text-\[#a8c7fa\]"><\/i>/g,
    replacement: '<i className="ri-link-unlink site-icon-30 text-[#a8c7fa]" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Skill item icon wrapper 32.9948px -> 30px',
    pattern: /className="w-\[32\.9948px\] h-\[32\.9948px\] rounded-lg flex items-center justify-center text-base font-bold transition-colors shrink-0 shadow-sm"\s*style={{[\s\S]*?width:\s*'32\.9948px',\s*height:\s*'32\.9948px',/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg flex items-center justify-center font-bold transition-colors shrink-0 shadow-sm site-card-icon-30"\n                        style={{\n                          width: \'30px\',\n                          height: \'30px\','
  },
  {
    name: 'Skill item icon i tag',
    pattern: /<i className={skill\.icon}><\/i>/g,
    replacement: '<i className={`${skill.icon} site-icon-30`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 5. CasefilesSection.tsx
updateFile('src/components/CasefilesSection.tsx', [
  {
    name: 'Profile visit link action button wrapper',
    pattern: /className="flex items-center justify-center text-\[#a8c7fa\] cursor-pointer p-0\.5"/g,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center text-[#a8c7fa] cursor-pointer site-icon-btn-30"'
  },
  {
    name: 'Profile visit link action button icon',
    pattern: /<i className="ri-link-unlink text-base text-\[#a8c7fa\]"><\/i>/g,
    replacement: '<i className="ri-link-unlink site-icon-30 text-[#a8c7fa]" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Special Threat Repo Icon Button',
    pattern: /className="shrink-0 rounded-lg bg-\[#ffb4ab\] text-\[#60000e\] flex items-center justify-center text-base font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"\s*style={{\s*width:\s*"32\.9948px",\s*height:\s*"32\.9948px",\s*backgroundColor:\s*"#ffb4ab"\s*}}/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all site-card-icon-30" style={{ width: "30px", height: "30px", backgroundColor: "#ffb4ab" }}'
  },
  {
    name: 'Special Extension Repo Icon Button',
    pattern: /className="shrink-0 rounded-lg bg-\[#fdd663\] text-\[#3b2f00\] flex items-center justify-center text-base font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"\s*style={{\s*width:\s*"32\.9948px",\s*height:\s*"32\.9948px",\s*backgroundColor:\s*"#fdd663"\s*}}/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all site-card-icon-30" style={{ width: "30px", height: "30px", backgroundColor: "#fdd663" }}'
  },
  {
    name: 'Special Fullstack Repo Icon Button',
    pattern: /className="shrink-0 rounded-lg bg-\[#d0bcff\] text-\[#381e72\] flex items-center justify-center text-base font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"\s*style={{\s*width:\s*"32\.9948px",\s*height:\s*"32\.9948px",\s*backgroundColor:\s*"#d0bcff"\s*}}/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all site-card-icon-30" style={{ width: "30px", height: "30px", backgroundColor: "#d0bcff" }}'
  },
  {
    name: 'Default GitHub Repo Icon Button',
    pattern: /className="w-8 h-8 rounded-lg bg-\[#000000\] text-white flex items-center justify-center text-base font-bold shadow-sm shrink-0 border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg bg-[#000000] text-white flex items-center justify-center font-bold shadow-sm shrink-0 border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all site-card-icon-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Casefile Readme Info Icon Wrapper',
    pattern: /className="flex items-center justify-center w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-transform active:scale-90 text-\[#a8c7fa\] hover:text-\[#a8c7fa\] visited:text-\[#a8c7fa\] focus:text-\[#a8c7fa\] active:text-\[#a8c7fa\] no-underline"/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer transition-transform active:scale-90 text-[#a8c7fa] site-icon-btn-30"'
  },
  {
    name: 'Casefile Readme Info Icon',
    pattern: /<i\s*className="ri-information-2-line text-lg"\s*style={{ color: '#a8c7fa' }}\s*\/>/,
    replacement: '<i className="ri-information-2-line site-icon-30" style={{ color: "#a8c7fa", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }} />'
  },
  {
    name: 'Extension Zip Download Icon Button Wrapper',
    pattern: /className="flex items-center justify-center w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-all duration-300 active:scale-90"/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer transition-all duration-300 active:scale-90 site-icon-btn-30"'
  },
  {
    name: 'Extension Zip Download Icon',
    pattern: /<i\s*className="ri-archive-stack-line text-lg"\s*style={{\s*color: downloadedIds\[file\.id\] \? '#a8e6cf' : '#a8c7fa',\s*}}\s*\/>/,
    replacement: '<i className="ri-archive-stack-line site-icon-30" style={{ color: downloadedIds[file.id] ? "#a8e6cf" : "#a8c7fa", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }} />'
  },
  {
    name: 'Repository Direct Link Button Wrapper',
    pattern: /className="flex items-center justify-center w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-transform active:scale-90 text-\[#a8c7fa\] hover:text-\[#a8c7fa\] visited:text-\[#a8c7fa\] focus:text-\[#a8c7fa\] active:text-\[#a8c7fa\] no-underline"/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer transition-transform active:scale-90 text-[#a8c7fa] site-icon-btn-30"'
  },
  {
    name: 'Repository Direct Link Icon',
    pattern: /<i\s*className="ri-link-unlink text-lg"\s*style={{ color: '#a8c7fa' }}\s*\/>/,
    replacement: '<i className="ri-link-unlink site-icon-30" style={{ color: "#a8c7fa", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }} />'
  }
]);

// 6. DispatchSection.tsx
updateFile('src/components/DispatchSection.tsx', [
  {
    name: 'Bulletins Metric Card Icon Box w-8 h-8 -> 30px',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-shake-hands-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-shake-hands-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'Critical Metric Card Icon Box w-8 h-8 -> 30px',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#ffb4ab\] text-\[#60000e\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-bug-2-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-bug-2-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'Visit Profile Link Button Wrapper',
    pattern: /className="flex items-center justify-center text-\[#a8c7fa\] cursor-pointer p-0\.5"/g,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center text-[#a8c7fa] cursor-pointer site-icon-btn-30"'
  },
  {
    name: 'Visit Profile Link Icon',
    pattern: /<i className="ri-link-unlink text-base text-\[#a8c7fa\]"><\/i>/g,
    replacement: '<i className="ri-link-unlink site-icon-30 text-[#a8c7fa]" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'MITRE badge icon box',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-secure-payment-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-secure-payment-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'Plain English breakdown badge icon box',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-lightbulb-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-lightbulb-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'Risk impact badge icon box',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#ffb4ab\] text-\[#60000e\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-alert-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-alert-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'Technical mechanics badge icon box',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-ram-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-ram-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'Endpoint hardening badge icon box',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-safe-3-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-safe-3-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'IoC badge icon box',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-virus-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-virus-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  },
  {
    name: 'Detection signature badge icon box',
    pattern: /<div className="w-8 h-8 shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm">\s*<i className="ri-shake-hands-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                    <i className="ri-shake-hands-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n                  </div>'
  }
]);

// 7. MissionsSection.tsx
updateFile('src/components/MissionsSection.tsx', [
  {
    name: 'Work experience badge 32.9948px -> 30px',
    pattern: /className="rounded-lg flex items-center justify-center text-base font-bold bg-\[#a8c7fa\] text-\[#00325b\] shrink-0 mt-0\.5 shadow-sm"\s*style={{\s*width:\s*'32\.9948px',\s*height:\s*'32\.9948px'\s*}}>\s*<i className={job\.icon \|\| 'ri-suitcase-3-line'}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg flex items-center justify-center font-bold bg-[#a8c7fa] text-[#00325b] shrink-0 mt-0.5 shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                              <i className={`${job.icon || "ri-suitcase-3-line"} site-icon-30`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Volunteer experience badge 32.9948px -> 30px',
    pattern: /className="rounded-lg flex items-center justify-center text-base font-bold bg-\[#a8c7fa\] text-\[#00325b\] shrink-0 mt-0\.5 shadow-sm"\s*style={{\s*width:\s*'32\.9948px',\s*height:\s*'32\.9948px'\s*}}>\s*<i className={mission\.icon \|\| 'ri-bank-line'}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg flex items-center justify-center font-bold bg-[#a8c7fa] text-[#00325b] shrink-0 mt-0.5 shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                              <i className={`${mission.icon || "ri-bank-line"} site-icon-30`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Endorsement LinkedIn Link Wrapper',
    pattern: /className="p-1 text-\[#a8c7fa\] cursor-pointer focus:outline-none shrink-0"\s*title="LinkedIn Profile">\s*<i className="ri-linkedin-box-line text-lg"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center text-[#a8c7fa] cursor-pointer focus:outline-none shrink-0 site-icon-btn-30" title="LinkedIn Profile">\n                              <i className="ri-linkedin-box-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 8. CvSection.tsx
updateFile('src/components/CvSection.tsx', [
  {
    name: 'Resume Header Badge 32.9948px -> 30px',
    pattern: /className="rounded-\[8px\] bg-\[#a8c7fa\] text-\[#00325b\] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0"\s*style={{\s*width:\s*'32\.9948px',\s*height:\s*'32\.9948px'\s*}}>\s*<i className="ri-file-text-line"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#a8c7fa] text-[#00325b] border-0 shadow-md flex items-center justify-center font-bold shrink-0 site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n            <i className="ri-file-text-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Download Resume button 32px -> 30px',
    pattern: /className={`w-\[32px\] h-\[32px\] rounded-\[8px\] border-0 shadow-sm flex items-center justify-center text-base font-bold shrink-0 cursor-pointer focus:outline-none transition-colors \${[\s\S]*?`}\s*title="Download Resume"\s*aria-label="Download Resume">\s*<i className="text-lg ri-archive-stack-line"><\/i>/,
    replacement: 'className={`w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] border-0 shadow-sm flex items-center justify-center font-bold shrink-0 cursor-pointer focus:outline-none transition-colors site-icon-btn-30 ${\n              isPressed\n                ? "bg-[#a8e6cf] text-[#003923]"\n                : "bg-[#a8c7fa] text-[#00325b]"\n            }`} style={{ width: "30px", height: "30px" }} title="Download Resume" aria-label="Download Resume">\n            <i className="ri-archive-stack-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 9. ContactSection.tsx
updateFile('src/components/ContactSection.tsx', [
  {
    name: 'PGP Base Station Icon',
    pattern: /<i className="ri-base-station-line flex items-center justify-center" style={{\s*width:\s*'30px',\s*height:\s*'30px'\s*}}><\/i>/,
    replacement: '<i className="ri-base-station-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'GitHub Social Icon',
    pattern: /<i className="ri-github-line flex items-center justify-center" style={{\s*width:\s*'30px',\s*height:\s*'30px'\s*}}><\/i>/,
    replacement: '<i className="ri-github-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'LinkedIn Social Icon',
    pattern: /<i className="ri-linkedin-box-line flex items-center justify-center" style={{\s*width:\s*'30px',\s*height:\s*'30px'\s*}}><\/i>/,
    replacement: '<i className="ri-linkedin-box-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Reddit Social Icon',
    pattern: /<i className="ri-reddit-line flex items-center justify-center" style={{\s*width:\s*'30px',\s*height:\s*'30px'\s*}}><\/i>/,
    replacement: '<i className="ri-reddit-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Twitter Social Icon',
    pattern: /<i className="ri-twitter-line flex items-center justify-center" style={{\s*width:\s*'30px',\s*height:\s*'30px'\s*}}><\/i>/,
    replacement: '<i className="ri-twitter-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'WhatsApp Social Icon',
    pattern: /<i className="ri-whatsapp-line flex items-center justify-center" style={{\s*width:\s*'30px',\s*height:\s*'30px'\s*}}><\/i>/,
    replacement: '<i className="ri-whatsapp-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Encrypted Mail Send Icon',
    pattern: /<i className="ri-mail-send-line flex items-center justify-center" style={{\s*width:\s*'30px',\s*height:\s*'30px'\s*}}><\/i>/,
    replacement: '<i className="ri-mail-send-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 10. DesktopRequestScreen.tsx
updateFile('src/components/DesktopRequestScreen.tsx', [
  {
    name: 'Social Icons 35px -> 30px with 30px font-size',
    pattern: /style={{\s*width:\s*'35px',\s*height:\s*'35px'\s*}}\s*title="GitHub"\s*aria-label="GitHub">\s*<i className="ri-github-line text-lg"><\/i>/,
    replacement: 'className="rounded-lg bg-[#000000] text-white flex items-center justify-center hover:opacity-80 transition-opacity site-icon-btn-30" style={{ width: "30px", height: "30px" }} title="GitHub" aria-label="GitHub">\n                    <i className="ri-github-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'LinkedIn Icon 35px -> 30px',
    pattern: /style={{\s*width:\s*'35px',\s*height:\s*'35px'\s*}}\s*title="LinkedIn"\s*aria-label="LinkedIn">\s*<i className="ri-linkedin-box-line text-lg"><\/i>/,
    replacement: 'className="rounded-lg bg-[#0a66c2] text-white flex items-center justify-center hover:opacity-80 transition-opacity site-icon-btn-30" style={{ width: "30px", height: "30px" }} title="LinkedIn" aria-label="LinkedIn">\n                    <i className="ri-linkedin-box-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Twitter Icon 35px -> 30px',
    pattern: /style={{\s*width:\s*'35px',\s*height:\s*'35px'\s*}}\s*title="Twitter"\s*aria-label="Twitter">\s*<i className="ri-twitter-line text-lg"><\/i>/,
    replacement: 'className="rounded-lg bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-80 transition-opacity site-icon-btn-30" style={{ width: "30px", height: "30px" }} title="Twitter" aria-label="Twitter">\n                    <i className="ri-twitter-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Reddit Icon 35px -> 30px',
    pattern: /style={{\s*width:\s*'35px',\s*height:\s*'35px'\s*}}\s*title="Reddit"\s*aria-label="Reddit">\s*<i className="ri-reddit-line text-lg"><\/i>/,
    replacement: 'className="rounded-lg bg-[#ff4500] text-white flex items-center justify-center hover:opacity-80 transition-opacity site-icon-btn-30" style={{ width: "30px", height: "30px" }} title="Reddit" aria-label="Reddit">\n                    <i className="ri-reddit-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 11. OrientationLock.tsx
updateFile('src/components/OrientationLock.tsx', [
  {
    name: 'Card 1 Gyro Sensor Icon 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#003258\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*'33px',\s*height:\s*'33px'\s*}} title="Device Sensor">\s*<i\s*className="ri-rotate-lock-line text-\[24px\] flex items-center justify-center"\s*style={{\s*width:\s*'24px',\s*height:\s*'24px',\s*fontSize:\s*'24px'\s*}}\s*><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }} title="Device Sensor">\n                    <i className="ri-rotate-lock-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Card 2 Rotate Icon 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#003258\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*'33px',\s*height:\s*'33px'\s*}}>\s*<i\s*className="ri-loop-left-ai-line text-\[24px\] flex items-center justify-center"\s*style={{\s*width:\s*'24px',\s*height:\s*'24px',\s*fontSize:\s*'24px'\s*}}\s*><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                  <i className="ri-loop-left-ai-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Override Button w-7 h-7 -> 30px',
    pattern: /className="w-7 h-7 rounded-lg bg-\[#21232b\] border border-\[#44474f\]\/30 text-\[#a8c7fa\] flex items-center justify-center cursor-pointer text-base shadow-sm"/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg bg-[#21232b] border border-[#44474f]/30 text-[#a8c7fa] flex items-center justify-center cursor-pointer shadow-sm site-icon-btn-30"'
  },
  {
    name: 'Override Button Eye Icon',
    pattern: /<i className="ri-eye-2-line" style={{ color: '#a8c7fa' }}><\/i>/,
    replacement: '<i className="ri-eye-2-line site-icon-30" style={{ color: "#a8c7fa", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 12. CloudflareGate.tsx
updateFile('src/components/CloudflareGate.tsx', [
  {
    name: 'Cloudflare Edge-Defense Badge 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#003258\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}} title="Cloudflare Edge Protocol">\s*<i className="ri-secure-payment-line text-\[27px\] flex items-center justify-center" style={{\s*width:\s*"27px",\s*height:\s*"27px",\s*fontSize:\s*"27px"\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }} title="Cloudflare Edge Protocol">\n                <i className="ri-secure-payment-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Turnstile Badge 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] shrink-0 rounded-lg bg-\[#a8c7fa\] text-\[#003258\] flex items-center justify-center font-bold shadow-sm"\s*style={{\s*width:\s*"33px",\s*height:\s*"33px"\s*}}>\s*<i className="ri-lock-password-line text-\[27px\] flex items-center justify-center" style={{\s*width:\s*"27px",\s*height:\s*"27px",\s*fontSize:\s*"27px"\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                <i className="ri-lock-password-line flex items-center justify-center site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 13. TerminalModal.tsx
updateFile('src/components/TerminalModal.tsx', [
  {
    name: 'Execute button wrapper & icon',
    pattern: /className="text-\[#a8c7fa\] active:scale-90 transition-all p-0\.5 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none rounded-full"/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] text-[#a8c7fa] active:scale-90 transition-all flex items-center justify-center shrink-0 cursor-pointer focus:outline-none rounded-full site-icon-btn-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Execute button icon',
    pattern: /className={`\${[\s\S]*?}\s*text-\[16px\] text-\[#a8c7fa\] transition-colors`}/,
    replacement: 'className={`${isExecuted && !inputVal.trim() ? "ri-play-circle-line" : "ri-pause-circle-line"} site-icon-30 text-[#a8c7fa] transition-colors`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}'
  },
  {
    name: 'Exit Terminal Button 32px -> 30px',
    pattern: /className="bg-\[#ffb4ab\] text-\[#690005\] shadow-md border-0 w-\[32px\] h-\[32px\] rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0"/,
    replacement: 'className="bg-[#ffb4ab] text-[#690005] shadow-md border-0 w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0 site-icon-btn-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Exit Terminal Button Icon',
    pattern: /<i className="ri-close-circle-line text-base font-bold"><\/i>/,
    replacement: '<i className="ri-close-circle-line font-bold site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 14. CtfModal.tsx
updateFile('src/components/CtfModal.tsx', [
  {
    name: 'CTF Header Flag Button 32px -> 30px',
    pattern: /className="w-\[32px\] h-\[32px\] rounded-lg flex items-center justify-center text-base font-bold transition-colors shrink-0 bg-\[#fdd663\] text-\[#3b2f00\] cursor-default">\s*<i className="ri-flag-line"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg flex items-center justify-center font-bold transition-colors shrink-0 bg-[#fdd663] text-[#3b2f00] cursor-default site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n  <i className="ri-flag-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Exit CTF Button 32px -> 30px',
    pattern: /className="w-\[32px\] h-\[32px\] rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 bg-\[#ffb4ab\] text-\[#690005\] shadow-md hover:opacity-90 shrink-0">\s*<i className="ri-close-circle-line text-base font-bold leading-none"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 bg-[#ffb4ab] text-[#690005] shadow-md hover:opacity-90 shrink-0 site-icon-btn-30" style={{ width: "30px", height: "30px" }}>\n  <i className="ri-close-circle-line font-bold site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 15. CvssCalculatorModal.tsx
updateFile('src/components/CvssCalculatorModal.tsx', [
  {
    name: 'Calculator Header Badge -> 30px',
    pattern: /<div className="p-2 bg-\[#004a77\]\/30 border border-\[#a8c7fa\]\/30 rounded-xl text-\[#a8c7fa\]">\s*<i className="ri-\[#a8c7fa\] ri-calculator-line text-lg"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-[#004a77]/30 border border-[#a8c7fa]/30 rounded-lg text-[#a8c7fa] flex items-center justify-center shrink-0 site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n  <i className="ri-calculator-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n  </div>'
  },
  {
    name: 'Close Button w-8 h-8 -> 30px',
    pattern: /className="w-8 h-8 rounded-full bg-\[#21232b\] border border-\[#44474f\] text-\[#c4c6d0\] hover:text-white flex items-center justify-center transition-colors cursor-pointer">\s*<i className="ri-close-line text-lg"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-[#21232b] border border-[#44474f] text-[#c4c6d0] hover:text-white flex items-center justify-center transition-colors cursor-pointer site-icon-btn-30" style={{ width: "30px", height: "30px" }}>\n  <i className="ri-close-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 16. OfflineStatusModal.tsx
updateFile('src/components/OfflineStatusModal.tsx', [
  {
    name: 'Offline Header Badge 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-\[8px\] bg-\[#ffb4ab\] flex items-center justify-center text-lg shrink-0 border border-\[#ffb4ab\]\/30"\s*style={{\s*backgroundColor:\s*'#ffb4ab',\s*width:\s*'32\.9948px',\s*height:\s*'32\.9948px',\s*borderRadius:\s*'8px',\s*}}>\s*<i className="ri-global-off-line text-\[#690005\]" style={{\s*color:\s*'#690005'\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#ffb4ab] flex items-center justify-center shrink-0 border border-[#ffb4ab]/30 site-card-icon-30" style={{ backgroundColor: "#ffb4ab", width: "30px", height: "30px", borderRadius: "8px" }}>\n              <i className="ri-global-off-line site-icon-30" style={{ color: "#690005", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Check Connection Button 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-full bg-\[#a8c7fa\] hover:bg-\[#96bef8\] text-\[#001d35\] flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95 disabled:opacity-60"/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-[#a8c7fa] hover:bg-[#96bef8] text-[#001d35] flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95 disabled:opacity-60 site-icon-btn-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Check Connection Icon',
    pattern: /<i className={`ri-loop-left-ai-line text-base \${isChecking \? 'animate-spin' : ''}`}><\/i>/,
    replacement: '<i className={`ri-loop-left-ai-line site-icon-30 ${isChecking ? "animate-spin" : ""}`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Dismiss Button 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-full bg-\[#ffb4ab\] hover:opacity-90 flex items-center justify-center cursor-pointer transition-opacity active:scale-95"\s*style={{\s*backgroundColor:\s*'#ffb4ab'\s*}}>\s*<i className="ri-close-circle-line text-base text-\[#690005\]" style={{\s*color:\s*'#690005'\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-[#ffb4ab] hover:opacity-90 flex items-center justify-center cursor-pointer transition-opacity active:scale-95 site-icon-btn-30" style={{ backgroundColor: "#ffb4ab", width: "30px", height: "30px" }}>\n              <i className="ri-close-circle-line site-icon-30" style={{ color: "#690005", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 17. CookieConsentModal.tsx
updateFile('src/components/CookieConsentModal.tsx', [
  {
    name: 'Cookie Header Badge 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-\[8px\] bg-\[#a8c7fa\] flex items-center justify-center text-lg shrink-0 border border-\[#a8c7fa\]\/30"\s*style={{\s*backgroundColor:\s*'#a8c7fa',\s*width:\s*'32\.9948px',\s*height:\s*'32\.9948px',\s*borderRadius:\s*'8px',\s*}}>\s*<i className="ri-cookie-line text-\[#003258\]" style={{\s*color:\s*'#003258'\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#a8c7fa] flex items-center justify-center shrink-0 border border-[#a8c7fa]/30 site-card-icon-30" style={{ backgroundColor: "#a8c7fa", width: "30px", height: "30px", borderRadius: "8px" }}>\n              <i className="ri-cookie-line site-icon-30" style={{ color: "#003258", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Accept Cookie Button 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-full bg-\[#a8c7fa\] hover:bg-\[#96bef8\] text-\[#001d35\] flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95">\s*<i className="ri-beer-line text-base"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-[#a8c7fa] hover:bg-[#96bef8] text-[#001d35] flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95 site-icon-btn-30" style={{ width: "30px", height: "30px" }}>\n              <i className="ri-beer-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Decline Cookie Button 33px -> 30px',
    pattern: /className="w-\[33px\] h-\[33px\] rounded-full bg-\[#ffb4ab\] hover:opacity-90 flex items-center justify-center cursor-pointer transition-opacity active:scale-95"\s*style={{\s*backgroundColor:\s*'#ffb4ab'\s*}}>\s*<i className="ri-delete-bin-5-line text-base text-\[#690005\]" style={{\s*color:\s*'#690005'\s*}}><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-[#ffb4ab] hover:opacity-90 flex items-center justify-center cursor-pointer transition-opacity active:scale-95 site-icon-btn-30" style={{ backgroundColor: "#ffb4ab", width: "30px", height: "30px" }}>\n              <i className="ri-delete-bin-5-line site-icon-30" style={{ color: "#690005", width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 18. PgpCryptoSandbox.tsx
updateFile('src/components/PgpCryptoSandbox.tsx', [
  {
    name: 'Payload Text Button 32.9948px -> 30px',
    pattern: /className="w-\[32\.9948px\] h-\[32\.9948px\] rounded-lg bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-base font-bold shadow-sm shrink-0 border-0"\s*style={{\s*width:\s*'32\.9948px',\s*height:\s*'32\.9948px'\s*}} title="Payload Text" aria-label="Payload Text">\s*<i className="ri-pencil-ruler-line"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm shrink-0 border-0 site-card-icon-30" style={{ width: "30px", height: "30px" }} title="Payload Text" aria-label="Payload Text">\n                <i className="ri-pencil-ruler-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'GPG Master Key Badge 32.9948px -> 30px',
    pattern: /className="w-\[32\.9948px\] h-\[32\.9948px\] rounded-\[8px\] bg-\[#a8c7fa\] text-\[#00325b\] flex items-center justify-center text-lg font-bold shadow-sm shrink-0"\s*style={{\s*width:\s*'32\.9948px',\s*height:\s*'32\.9948px'\s*}}>\s*<i className="ri-git-repository-private-line"><\/i>/,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm shrink-0 site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n                  <i className="ri-git-repository-private-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Download Asc Button 35px -> 30px',
    pattern: /className={`w-\[35px\] h-\[35px\] rounded-full text-\[13px\] leading-\[16px\] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 shrink-0 \${/,
    replacement: 'className={`w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 shrink-0 site-icon-btn-30 ${\n                    copiedId === "download-asc"\n                      ? "bg-[#a8e6cf] text-[#003923]"\n                      : "bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]"\n                  }`}'
  },
  {
    name: 'Download Asc Button Icon',
    pattern: /<i className={`\${copiedId === 'download-asc' \? 'ri-survey-line text-\[#003923\]' : 'ri-archive-stack-line'} text-\[13px\] leading-\[16px\]`}><\/i>/,
    replacement: '<i className={`${copiedId === "download-asc" ? "ri-survey-line text-[#003923]" : "ri-archive-stack-line"} site-icon-30`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Copy Fingerprint Button 35px -> 30px',
    pattern: /className={`w-\[35px\] h-\[35px\] rounded-full text-\[13px\] leading-\[16px\] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 shrink-0 \${/,
    replacement: 'className={`w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 shrink-0 site-icon-btn-30 ${\n                    copiedId === "fpr-btn"\n                      ? "bg-[#a8e6cf] text-[#003923]"\n                      : "bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]"\n                  }`}'
  },
  {
    name: 'Copy Fingerprint Button Icon',
    pattern: /<i className={`\${copiedId === 'fpr-btn' \? 'ri-survey-line text-\[#003923\]' : 'ri-file-copy-2-line'} text-\[13px\] leading-\[16px\]`}><\/i>/,
    replacement: '<i className={`${copiedId === "fpr-btn" ? "ri-survey-line text-[#003923]" : "ri-file-copy-2-line"} site-icon-30`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 19. CyberAttackMapSection.tsx
updateFile('src/components/CyberAttackMapSection.tsx', [
  {
    name: 'Clear Logs Button 35px -> 30px',
    pattern: /className={`w-\[35px\] h-\[35px\] rounded-full text-\[13px\] leading-\[16px\] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 \${[\s\S]*?`}\s*title="Clear Incident Feed Log">\s*<i className="ri-delete-bin-5-line text-\[13px\] leading-\[16px\]"><\/i>/,
    replacement: 'className={`w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 site-icon-btn-30 ${\n  isDeleting\n  ? "bg-[#ffb4ab] text-[#690005]"\n  : "bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#ffb4ab] active:text-[#690005]"\n  }`} style={{ width: "30px", height: "30px" }} title="Clear Incident Feed Log">\n  <i className="ri-delete-bin-5-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Export Log Button 35px -> 30px',
    pattern: /className={`w-\[35px\] h-\[35px\] rounded-full text-\[13px\] leading-\[16px\] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 \${[\s\S]*?`}\s*title="Export Live Incident Stream as JSON">\s*<i className={`\${isExporting \? 'ri-file-check-line text-\[#003923\]' : 'ri-survey-line'} text-\[13px\] leading-\[16px\]`}><\/i>/,
    replacement: 'className={`w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 site-icon-btn-30 ${\n  isExporting\n  ? "bg-[#a8e6cf] text-[#003923]"\n  : "bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]"\n  }`} style={{ width: "30px", height: "30px" }} title="Export Live Incident Stream as JSON">\n  <i className={`${isExporting ? "ri-file-check-line text-[#003923]" : "ri-survey-line"} site-icon-30`} style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  },
  {
    name: 'Threat Matrix Badge 32px -> 30px',
    pattern: /<div className="w-\[32px\] h-\[32px\] rounded-\[8px\] bg-\[#fdd663\] text-\[#3b2f00\] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">\s*<i className="ri-bar-chart-2-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#fdd663] text-[#3b2f00] border-0 shadow-md flex items-center justify-center font-bold shrink-0 site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n  <i className="ri-bar-chart-2-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n  </div>'
  },
  {
    name: 'Incident Card Header Badge 32px -> 30px',
    pattern: /<div className="w-\[32px\] h-\[32px\] rounded-\[8px\] bg-\[#a8c7fa\] text-\[#001d35\] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">\s*<i className="ri-rfid-line"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#a8c7fa] text-[#001d35] border-0 shadow-md flex items-center justify-center font-bold shrink-0 site-card-icon-30" style={{ width: "30px", height: "30px" }}>\n      <i className="ri-rfid-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n    </div>'
  },
  {
    name: 'Origin Item Badge 32px -> 30px',
    pattern: /<div className="w-\[32px\] h-\[32px\] rounded-\[8px\] bg-\[#13141a\] flex items-center justify-center shrink-0 border border-\[#44474f\]\/30" style={{\s*height:\s*"32px",\s*width:\s*"32px",\s*borderRadius:\s*"8px"\s*}}>\s*<i className="ri-global-line text-\[#a8c7fa\] text-\[13px\] leading-\[16px\]"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#13141a] flex items-center justify-center shrink-0 border border-[#44474f]/30 site-card-icon-30" style={{ height: "30px", width: "30px", borderRadius: "8px" }}>\n  <i className="ri-global-line text-[#a8c7fa] site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n  </div>'
  },
  {
    name: 'Target Item Badge 32px -> 30px',
    pattern: /<div className="w-\[32px\] h-\[32px\] rounded-\[8px\] bg-\[#13141a\] flex items-center justify-center shrink-0 border border-\[#44474f\]\/30" style={{\s*height:\s*"32px",\s*width:\s*"32px",\s*borderRadius:\s*"8px"\s*}}>\s*<i className="ri-database-line text-\[#a8c7fa\] text-\[13px\] leading-\[16px\]"><\/i>\s*<\/div>/,
    replacement: '<div className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-[8px] bg-[#13141a] flex items-center justify-center shrink-0 border border-[#44474f]/30 site-card-icon-30" style={{ height: "30px", width: "30px", borderRadius: "8px" }}>\n  <i className="ri-database-line text-[#a8c7fa] site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>\n  </div>'
  },
  {
    name: 'Fly Camera Button Wrapper (Origin & Target)',
    pattern: /className="text-\[#a8c7fa\] hover:text-white transition-all cursor-pointer shrink-0 p-1"/g,
    replacement: 'className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center text-[#a8c7fa] hover:text-white transition-all cursor-pointer shrink-0 site-icon-btn-30"'
  },
  {
    name: 'Fly Camera Button Icon (Origin & Target)',
    pattern: /<i className="ri-crosshair-2-line text-sm"><\/i>/g,
    replacement: '<i className="ri-crosshair-2-line site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

// 20. HeaderSearch.tsx
updateFile('src/components/HeaderSearch.tsx', [
  {
    name: 'Clear Search Button w-6 h-6 -> 30px',
    pattern: /className="search-result-item bg-\[#21232b\] hover:bg-\[#2b2d36\] text-\[#c4c6d0\] hover:text-white rounded-full border-0 flex items-center justify-center shrink-0 cursor-pointer w-6 h-6 transition-colors"/,
    replacement: 'className="search-result-item bg-[#21232b] hover:bg-[#2b2d36] text-[#c4c6d0] hover:text-white rounded-full border-0 flex items-center justify-center shrink-0 cursor-pointer w-[30px] h-[30px] min-w-[30px] min-h-[30px] transition-colors site-icon-btn-30" style={{ width: "30px", height: "30px" }}'
  },
  {
    name: 'Clear Search Icon text-sm -> 30px',
    pattern: /<i className="ri-close-line text-sm text-\[#c4c6d0\]"><\/i>/,
    replacement: '<i className="ri-close-line text-[#c4c6d0] site-icon-30" style={{ width: "30px", height: "30px", fontSize: "30px", lineHeight: "30px" }}></i>'
  }
]);

console.log('Finished icon standardization pass.');
