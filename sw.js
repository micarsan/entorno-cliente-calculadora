if(!self.define){let e,c={};const i=(i,s)=>(i=new URL(i+".js",s).href,c[i]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=c,document.head.appendChild(e)}else e=i,importScripts(i),c()})).then((()=>{let e=c[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(c[n])return;let o={};const d=e=>i(e,n),t={module:{uri:n},exports:o,require:d};c[n]=Promise.all(s.map((e=>t[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-72b3af16"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"captura-calculadora.webp",revision:"4dc892dcfdd6db85f55867b72ca7b7c9"},{url:"css/general.css",revision:"3532eac4f4959c1ca717d9cdc20b472b"},{url:"css/img/bg00.webp",revision:"fddb56a897dda49bd6e304c6b4ba1420"},{url:"css/img/history-icon.svg",revision:"94bf0cb3e1c1c44e7a0e0f885f4ed5a8"},{url:"css/img/information-icon.svg",revision:"48805e98434b972951feb984b8c91874"},{url:"icon.svg",revision:"6e189fbd3150436e10318dbbd7190506"},{url:"icon512.png",revision:"0838cb5f64e59d2b1c064dec7ad50e5f"},{url:"index.html",revision:"3d30c6ca62e0f46cccc705330fe50a73"},{url:"js/basic-functions.js",revision:"2624231c5fa58553fcac2fb4e89dbd71"},{url:"manifest.json",revision:"508519584f235c065b8ab9a90e1b424a"},{url:"README.md",revision:"3dee6ce08cdce3ad7c417538e92e5bab"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
