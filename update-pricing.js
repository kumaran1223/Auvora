const fs = require('fs');
let file = fs.readFileSync('src/components/landing/pricing-section.tsx', 'utf8');

// Title section
file = file.replace(/<div className="max-w-2xl space-y-3">/, '<div className="max-w-2xl space-y-3 animate-fade-in-up" style={{ animationDelay: String.fromCharCode(39) + "0ms" + String.fromCharCode(39) }}>');

// Cards
file = file.replace(/<div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900\/50 p-6 space-y-6">/, '<div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/50 hover:border-zinc-700 motion-reduce:transition-none motion-reduce:transform-none" style={{ animationDelay: String.fromCharCode(39) + "60ms" + String.fromCharCode(39) }}>');

file = file.replace(/<div className="flex flex-col justify-between rounded-2xl border-2 border-amber-500\/50 bg-zinc-900 p-6 shadow-2xl relative space-y-6">/, '<div className="flex flex-col justify-between rounded-2xl border-2 border-amber-500/50 bg-zinc-900 p-6 shadow-2xl relative space-y-6 animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/20 motion-reduce:transition-none motion-reduce:transform-none" style={{ animationDelay: String.fromCharCode(39) + "120ms" + String.fromCharCode(39) }}>');

file = file.replace(/<div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900\/50 p-6 space-y-6">/, '<div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6 animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/50 hover:border-zinc-700 motion-reduce:transition-none motion-reduce:transform-none" style={{ animationDelay: String.fromCharCode(39) + "180ms" + String.fromCharCode(39) }}>');

// Buttons inside cards
const btn1 = 'className="block w-full rounded-md border border-zinc-700 bg-zinc-800 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-700"';
const btn1New = 'className="block w-full rounded-md border border-zinc-700 bg-zinc-800 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
file = file.replace(new RegExp(btn1, 'g'), btn1New);

const btn2 = 'className="block w-full rounded-md bg-amber-500 py-2.5 text-center text-sm font-bold text-zinc-950 transition hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"';
const btn2New = 'className="block w-full rounded-md bg-amber-500 py-2.5 text-center text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-amber-400 hover:scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"';
file = file.replace(new RegExp(btn2, 'g'), btn2New);

fs.writeFileSync('src/components/landing/pricing-section.tsx', file);
console.log('Updated pricing-section.tsx');
