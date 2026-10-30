cat src/components/TerminalModal.tsx | awk '
BEGIN { in_kv = 0 }
/if \(kvMatch && !rest\.includes\('\''http'\''\)\) \{/ {
  print $0
  print "                     return ("
  print "                       <div key={idx} className=\"flex\">"
  print "                         <div className=\"shrink-0 whitespace-pre\">"
  print "                           {prefix}"
  print "                           <span className=\"opacity-75\">{kvMatch[1]}</span>"
  print "                           <span className=\"opacity-40\">:</span>"
  print "                         </div>"
  print "                         <div className=\"font-semibold text-white/90 whitespace-pre-wrap break-words pl-1\">{kvMatch[2].trimStart()}</div>"
  print "                       </div>"
  print "                     );"
  in_kv = 1
  next
}
in_kv == 1 && /\}\);/ {
  in_kv = 0
}
in_kv == 1 && /<\/div>/ {
  in_kv = 0
  next
}
in_kv == 1 && /return \(/ {
  next
}
in_kv == 1 && /\{prefix\}/ {
  next
}
in_kv == 1 && /<span className="opacity-75">\{kvMatch\[1\]\}<\/span>/ {
  next
}
in_kv == 1 && /<span className="opacity-40">\:<\/span>/ {
  next
}
in_kv == 1 && /<span className="font-semibold text-white\/90">\{kvMatch\[2\]\}<\/span>/ {
  next
}
in_kv == 1 && /<div key=\{idx\} className="whitespace-pre-wrap">/ {
  next
}
in_kv == 1 && /;/ {
  # For the end );
  in_kv = 0
  next
}
in_kv == 0 {
  print $0
}
' > temp.tsx && mv temp.tsx src/components/TerminalModal.tsx
