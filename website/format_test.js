const babel = require('@babel/core');
const code = `
                     return (
                       <div key={idx} className="whitespace-pre-wrap">
                         {prefix}
                         <span className="opacity-75">{kvMatch[1]}</span>
                         <span className="opacity-40">:</span>
                         <span className="font-semibold text-white/90">{kvMatch[2]}</span>
                       </div>
                     );
`;
const result = babel.transform(code, { presets: ['@babel/preset-react'] });
console.log(result.code);
