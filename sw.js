if(!self.define){let e,i={};const c=(c,s)=>(c=new URL(c+".js",s).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(s,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(i[n])return;let o={};const d=e=>c(e,n),f={module:{uri:n},exports:o,require:d};i[n]=Promise.all(s.map((e=>f[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-72b3af16"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"captura-calculadora.webp",revision:"4dc892dcfdd6db85f55867b72ca7b7c9"},{url:"css/general.css",revision:"f44fa3dced48a1a2ae7614d1c072ea39"},{url:"css/img/bg00.webp",revision:"e87d8f2b7aea9f78104852664a0d8755"},{url:"css/img/history-icon.svg",revision:"94bf0cb3e1c1c44e7a0e0f885f4ed5a8"},{url:"css/img/information-icon.svg",revision:"48805e98434b972951feb984b8c91874"},{url:"icon.svg",revision:"6e189fbd3150436e10318dbbd7190506"},{url:"icon512.png",revision:"0838cb5f64e59d2b1c064dec7ad50e5f"},{url:"index.html",revision:"3d30c6ca62e0f46cccc705330fe50a73"},{url:"js/basic-functions.js",revision:"f6863fab313e0f371c5ce8b84bf095da"},{url:"manifest.json",revision:"508519584f235c065b8ab9a90e1b424a"},{url:"README.md",revision:"3dee6ce08cdce3ad7c417538e92e5bab"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
