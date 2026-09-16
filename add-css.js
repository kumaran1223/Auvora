const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

if (!css.includes('animate-fade-in-up')) {
  css += \n
@layer utilities {
  .animate-fade-in-up {
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in-up, .motion-reduce\\:animate-none {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
}
;
  fs.writeFileSync('src/app/globals.css', css);
  console.log('Added animation classes to globals.css');
}
