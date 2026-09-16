const fs = require('fs');
let file = fs.readFileSync('src/app/pricing/page.tsx', 'utf8');

const btn1 = 'className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700 text-center"';
const btn1New = 'className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none text-center"';
file = file.replace(btn1, btn1New);

const btn2 = 'className="block w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 text-center"';
const btn2New = 'className="block w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none text-center"';
file = file.replace(btn2, btn2New);

fs.writeFileSync('src/app/pricing/page.tsx', file);
console.log('Updated buttons');
