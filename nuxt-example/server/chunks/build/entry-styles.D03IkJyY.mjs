import { a as buildAssetsURL } from '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'devalue';
import 'vue/server-renderer';
import '@unhead/ssr';
import 'unhead';
import 'vue';
import '@unhead/shared';

const main = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/*! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com*/*,:after,:before{border:0 solid #e5e7eb;box-sizing:border-box}:after,:before{--tw-content:""}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{color:inherit;font-family:inherit;font-feature-settings:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{color:#9ca3af;opacity:1}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:root{--background:0 0% 100%;--foreground:240 10% 3.9%;--card:0 0% 100%;--card-foreground:240 10% 3.9%;--popover:0 0% 100%;--popover-foreground:240 10% 3.9%;--primary:240 5.9% 10%;--primary-foreground:0 0% 98%;--secondary:240 4.8% 95.9%;--secondary-foreground:240 5.9% 10%;--muted:240 4.8% 95.9%;--muted-foreground:240 3.8% 46.1%;--accent:240 4.8% 95.9%;--accent-foreground:240 5.9% 10%;--destructive:0 84.2% 60.2%;--destructive-foreground:0 0% 98%;--border:240 5.9% 90%;--input:240 5.9% 90%;--ring:240 10% 3.9%;--radius:.5rem}.dark{--background:240 10% 3.9%;--foreground:0 0% 98%;--card:240 10% 3.9%;--card-foreground:0 0% 98%;--popover:240 10% 3.9%;--popover-foreground:0 0% 98%;--primary:0 0% 98%;--primary-foreground:240 5.9% 10%;--secondary:240 3.7% 15.9%;--secondary-foreground:0 0% 98%;--muted:240 3.7% 15.9%;--muted-foreground:240 5% 64.9%;--accent:240 3.7% 15.9%;--accent-foreground:0 0% 98%;--destructive:0 62.8% 30.6%;--destructive-foreground:0 0% 98%;--border:240 3.7% 15.9%;--input:240 3.7% 15.9%;--ring:240 4.9% 83.9%}*{border-color:hsl(var(--border))}body{background-color:hsl(var(--background));color:hsl(var(--foreground))}.sr-only{height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;clip:rect(0,0,0,0);border-width:0;white-space:nowrap}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{top:0;right:0;bottom:0;left:0}.left-1\\/2{left:50%}.left-2{left:.5rem}.right-2{right:.5rem}.right-3{right:.75rem}.right-4{right:1rem}.top-0{top:0}.top-1\\/2{top:50%}.top-2{top:.5rem}.top-3{top:.75rem}.top-4{top:1rem}.z-50{z-index:50}.z-\\[100\\]{z-index:100}.-mx-1{margin-left:-.25rem;margin-right:-.25rem}.my-1{margin-bottom:.25rem;margin-top:.25rem}.my-8{margin-bottom:2rem;margin-top:2rem}.mb-1{margin-bottom:.25rem}.ml-auto{margin-left:auto}.mr-2{margin-right:.5rem}.mr-auto{margin-right:auto}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.aspect-square{aspect-ratio:1/1}.h-10{height:2.5rem}.h-11{height:2.75rem}.h-2{height:.5rem}.h-2\\.5{height:.625rem}.h-3\\.5{height:.875rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-7{height:1.75rem}.h-8{height:2rem}.h-9{height:2.25rem}.h-\\[1\\.2rem\\]{height:1.2rem}.h-px{height:1px}.max-h-screen{max-height:100vh}.min-h-screen{min-height:100vh}.w-10{width:2.5rem}.w-11{width:2.75rem}.w-2{width:.5rem}.w-2\\.5{width:.625rem}.w-3\\.5{width:.875rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-96{width:24rem}.w-\\[1\\.2rem\\]{width:1.2rem}.w-full{width:100%}.min-w-32{min-width:8rem}.max-w-\\[1000px\\]{max-width:1000px}.max-w-lg{max-width:32rem}.shrink-0{flex-shrink:0}.-translate-x-1\\/2{--tw-translate-x:-50%}.-translate-x-1\\/2,.-translate-y-1\\/2{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y:-50%}.rotate-0{--tw-rotate:0deg}.rotate-0,.rotate-90{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-90{--tw-rotate:90deg}.scale-0{--tw-scale-x:0;--tw-scale-y:0}.scale-0,.scale-100{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-100{--tw-scale-x:1;--tw-scale-y:1}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.grid-cols-\\[auto_minmax\\(0\\,1fr\\)\\]{grid-template-columns:auto minmax(0,1fr)}.flex-col{flex-direction:column}.flex-col-reverse{flex-direction:column-reverse}.flex-wrap{flex-wrap:wrap}.place-items-center{place-items:center}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-10{gap:2.5rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.gap-x-6{-moz-column-gap:1.5rem;column-gap:1.5rem}.gap-y-1\\.5{row-gap:.375rem}.gap-y-2{row-gap:.5rem}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(.5rem*var(--tw-space-x-reverse))}.space-x-4>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(1rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(1rem*var(--tw-space-x-reverse))}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.whitespace-nowrap{white-space:nowrap}.break-words{overflow-wrap:break-word}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:var(--radius)}.rounded-md{border-radius:calc(var(--radius) - 2px)}.rounded-sm{border-radius:calc(var(--radius) - 4px)}.border{border-width:1px}.border-2{border-width:2px}.border-amber-600\\/50{border-color:#d9770680}.border-border{border-color:hsl(var(--border))}.border-destructive{border-color:hsl(var(--destructive))}.border-destructive\\/50{border-color:hsl(var(--destructive)/.5)}.border-input{border-color:hsl(var(--input))}.border-primary{border-color:hsl(var(--primary))}.border-transparent{border-color:transparent}.bg-background{background-color:hsl(var(--background))}.bg-black\\/80{background-color:#000c}.bg-card{background-color:hsl(var(--card))}.bg-destructive{background-color:hsl(var(--destructive))}.bg-muted{background-color:hsl(var(--muted))}.bg-popover{background-color:hsl(var(--popover))}.bg-primary{background-color:hsl(var(--primary))}.bg-secondary{background-color:hsl(var(--secondary))}.bg-transparent{background-color:transparent}.fill-current{fill:currentColor}.p-0\\.5{padding:.125rem}.p-1{padding:.25rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-8{padding-left:2rem;padding-right:2rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.py-3{padding-bottom:.75rem;padding-top:.75rem}.pb-10{padding-bottom:2.5rem}.pb-12{padding-bottom:3rem}.pl-8{padding-left:2rem}.pr-2{padding-right:.5rem}.pr-8{padding-right:2rem}.pt-0{padding-top:0}.pt-3{padding-top:.75rem}.pt-4{padding-top:1rem}.pt-6{padding-top:1.5rem}.text-center{text-align:center}.font-sans{font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.text-2xl{font-size:1.5rem;line-height:2rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.font-normal{font-weight:400}.font-semibold{font-weight:600}.leading-none{line-height:1}.leading-snug{line-height:1.375}.tracking-tight{letter-spacing:-.025em}.tracking-widest{letter-spacing:.1em}.text-amber-600{--tw-text-opacity:1;color:rgb(217 119 6/var(--tw-text-opacity,1))}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235/var(--tw-text-opacity,1))}.text-card-foreground{color:hsl(var(--card-foreground))}.text-current{color:currentColor}.text-destructive{color:hsl(var(--destructive))}.text-destructive-foreground{color:hsl(var(--destructive-foreground))}.text-foreground{color:hsl(var(--foreground))}.text-foreground\\/50{color:hsl(var(--foreground)/.5)}.text-green-700{--tw-text-opacity:1;color:rgb(21 128 61/var(--tw-text-opacity,1))}.text-muted-foreground{color:hsl(var(--muted-foreground))}.text-popover-foreground{color:hsl(var(--popover-foreground))}.text-primary{color:hsl(var(--primary))}.text-primary-foreground{color:hsl(var(--primary-foreground))}.text-red-600{--tw-text-opacity:1;color:rgb(220 38 38/var(--tw-text-opacity,1))}.text-secondary-foreground{color:hsl(var(--secondary-foreground))}.underline{text-decoration-line:underline}.underline-offset-2{text-underline-offset:2px}.underline-offset-4{text-underline-offset:4px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.opacity-0{opacity:0}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.opacity-90{opacity:.9}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.shadow-lg,.shadow-md{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgba(0,0,0,.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.outline{outline-style:solid}.ring-0{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-offset-background{--tw-ring-offset-color:hsl(var(--background))}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-opacity{transition-duration:.15s;transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-transform{transition-duration:.15s;transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1)}.duration-200{transition-duration:.2s}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.duration-200{animation-duration:.2s}.hover\\:bg-accent:hover{background-color:hsl(var(--accent))}.hover\\:bg-destructive\\/90:hover{background-color:hsl(var(--destructive)/.9)}.hover\\:bg-primary\\/90:hover{background-color:hsl(var(--primary)/.9)}.hover\\:bg-secondary:hover{background-color:hsl(var(--secondary))}.hover\\:bg-secondary\\/80:hover{background-color:hsl(var(--secondary)/.8)}.hover\\:text-accent-foreground:hover{color:hsl(var(--accent-foreground))}.hover\\:text-foreground:hover{color:hsl(var(--foreground))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-100:hover{opacity:1}.focus\\:bg-accent:focus{background-color:hsl(var(--accent))}.focus\\:text-accent-foreground:focus{color:hsl(var(--accent-foreground))}.focus\\:opacity-100:focus{opacity:1}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-2:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus\\:ring-ring:focus{--tw-ring-color:hsl(var(--ring))}.focus\\:ring-offset-2:focus{--tw-ring-offset-width:2px}.focus-visible\\:outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:ring-2:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus-visible\\:ring-ring:focus-visible{--tw-ring-color:hsl(var(--ring))}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px}.focus-visible\\:ring-offset-background:focus-visible{--tw-ring-offset-color:hsl(var(--background))}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.group:hover .group-hover\\:opacity-100{opacity:1}.group.destructive .group-\\[\\.destructive\\]\\:border-muted\\/40{border-color:hsl(var(--muted)/.4)}.group.destructive .group-\\[\\.destructive\\]\\:text-red-300{--tw-text-opacity:1;color:rgb(252 165 165/var(--tw-text-opacity,1))}.group.destructive .group-\\[\\.destructive\\]\\:hover\\:border-destructive\\/30:hover{border-color:hsl(var(--destructive)/.3)}.group.destructive .group-\\[\\.destructive\\]\\:hover\\:bg-destructive:hover{background-color:hsl(var(--destructive))}.group.destructive .group-\\[\\.destructive\\]\\:hover\\:text-destructive-foreground:hover{color:hsl(var(--destructive-foreground))}.group.destructive .group-\\[\\.destructive\\]\\:hover\\:text-red-50:hover{--tw-text-opacity:1;color:rgb(254 242 242/var(--tw-text-opacity,1))}.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-destructive:focus{--tw-ring-color:hsl(var(--destructive))}.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-red-400:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(248 113 113/var(--tw-ring-opacity,1))}.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-offset-red-600:focus{--tw-ring-offset-color:#dc2626}.peer:disabled~.peer-disabled\\:cursor-not-allowed{cursor:not-allowed}.peer:disabled~.peer-disabled\\:opacity-70{opacity:.7}.data-\\[disabled\\]\\:pointer-events-none[data-disabled]{pointer-events:none}.data-\\[state\\=checked\\]\\:translate-x-5[data-state=checked]{--tw-translate-x:1.25rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state=unchecked],.data-\\[swipe\\=cancel\\]\\:translate-x-0[data-swipe=cancel]{--tw-translate-x:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.data-\\[swipe\\=end\\]\\:translate-x-\\[--radix-toast-swipe-end-x\\][data-swipe=end]{--tw-translate-x:var(--radix-toast-swipe-end-x)}.data-\\[swipe\\=end\\]\\:translate-x-\\[--radix-toast-swipe-end-x\\][data-swipe=end],.data-\\[swipe\\=move\\]\\:translate-x-\\[--radix-toast-swipe-move-x\\][data-swipe=move]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.data-\\[swipe\\=move\\]\\:translate-x-\\[--radix-toast-swipe-move-x\\][data-swipe=move]{--tw-translate-x:var(--radix-toast-swipe-move-x)}@keyframes collapsible-up{0%{height:var(--radix-collapsible-content-height)}to{height:0}}.data-\\[state\\=closed\\]\\:animate-collapsible-up[data-state=closed]{animation:collapsible-up .2s ease-in-out}@keyframes collapsible-down{0%{height:0}to{height:var(--radix-collapsible-content-height)}}.data-\\[state\\=open\\]\\:animate-collapsible-down[data-state=open]{animation:collapsible-down .2s ease-in-out}.data-\\[state\\=checked\\]\\:bg-primary[data-state=checked]{background-color:hsl(var(--primary))}.data-\\[state\\=open\\]\\:bg-accent[data-state=open]{background-color:hsl(var(--accent))}.data-\\[state\\=unchecked\\]\\:bg-input[data-state=unchecked]{background-color:hsl(var(--input))}.data-\\[state\\=open\\]\\:text-muted-foreground[data-state=open]{color:hsl(var(--muted-foreground))}.data-\\[disabled\\]\\:opacity-50[data-disabled]{opacity:.5}.data-\\[swipe\\=move\\]\\:transition-none[data-swipe=move]{transition-property:none}.data-\\[state\\=open\\]\\:animate-in[data-state=open]{animation-duration:.15s;animation-name:enter;--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial}.data-\\[state\\=closed\\]\\:animate-out[data-state=closed],.data-\\[swipe\\=end\\]\\:animate-out[data-swipe=end]{animation-duration:.15s;animation-name:exit;--tw-exit-opacity:initial;--tw-exit-scale:initial;--tw-exit-rotate:initial;--tw-exit-translate-x:initial;--tw-exit-translate-y:initial}.data-\\[state\\=closed\\]\\:fade-out-0[data-state=closed]{--tw-exit-opacity:0}.data-\\[state\\=closed\\]\\:fade-out-80[data-state=closed]{--tw-exit-opacity:.8}.data-\\[state\\=open\\]\\:fade-in-0[data-state=open]{--tw-enter-opacity:0}.data-\\[state\\=closed\\]\\:zoom-out-95[data-state=closed]{--tw-exit-scale:.95}.data-\\[state\\=open\\]\\:zoom-in-95[data-state=open]{--tw-enter-scale:.95}.data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side=bottom]{--tw-enter-translate-y:-.5rem}.data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side=left]{--tw-enter-translate-x:.5rem}.data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side=right]{--tw-enter-translate-x:-.5rem}.data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side=top]{--tw-enter-translate-y:.5rem}.data-\\[state\\=closed\\]\\:slide-out-to-left-1\\/2[data-state=closed]{--tw-exit-translate-x:-50%}.data-\\[state\\=closed\\]\\:slide-out-to-right-full[data-state=closed]{--tw-exit-translate-x:100%}.data-\\[state\\=closed\\]\\:slide-out-to-top-\\[48\\%\\][data-state=closed]{--tw-exit-translate-y:-48%}.data-\\[state\\=open\\]\\:slide-in-from-left-1\\/2[data-state=open]{--tw-enter-translate-x:-50%}.data-\\[state\\=open\\]\\:slide-in-from-top-\\[48\\%\\][data-state=open]{--tw-enter-translate-y:-48%}.data-\\[state\\=open\\]\\:slide-in-from-top-full[data-state=open]{--tw-enter-translate-y:-100%}.dark\\:-rotate-90:is(.dark *){--tw-rotate:-90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.dark\\:rotate-0:is(.dark *){--tw-rotate:0deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.dark\\:scale-0:is(.dark *){--tw-scale-x:0;--tw-scale-y:0;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.dark\\:scale-100:is(.dark *){--tw-scale-x:1;--tw-scale-y:1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.dark\\:border-amber-300:is(.dark *){--tw-border-opacity:1;border-color:rgb(252 211 77/var(--tw-border-opacity,1))}.dark\\:border-destructive:is(.dark *){border-color:hsl(var(--destructive))}.dark\\:text-amber-300:is(.dark *){--tw-text-opacity:1;color:rgb(252 211 77/var(--tw-text-opacity,1))}.dark\\:text-blue-300:is(.dark *){--tw-text-opacity:1;color:rgb(147 197 253/var(--tw-text-opacity,1))}.dark\\:text-green-300:is(.dark *){--tw-text-opacity:1;color:rgb(134 239 172/var(--tw-text-opacity,1))}.dark\\:text-red-400:is(.dark *){--tw-text-opacity:1;color:rgb(248 113 113/var(--tw-text-opacity,1))}@media (min-width:640px){.sm\\:bottom-0{bottom:0}.sm\\:right-0{right:0}.sm\\:top-auto{top:auto}.sm\\:flex-row{flex-direction:row}.sm\\:flex-col{flex-direction:column}.sm\\:justify-end{justify-content:flex-end}.sm\\:gap-x-2{-moz-column-gap:.5rem;column-gap:.5rem}.sm\\:rounded-lg{border-radius:var(--radius)}.sm\\:text-left{text-align:left}.sm\\:text-3xl{font-size:1.875rem;line-height:2.25rem}.data-\\[state\\=open\\]\\:sm\\:slide-in-from-bottom-full[data-state=open]{--tw-enter-translate-y:100%}}@media (min-width:768px){.md\\:w-full{width:100%}.md\\:max-w-\\[420px\\]{max-width:420px}.md\\:gap-3{gap:.75rem}.md\\:px-8{padding-left:2rem;padding-right:2rem}}.\\[\\&\\>svg\\+div\\]\\:translate-y-\\[-3px\\]>svg+div{--tw-translate-y:-3px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.\\[\\&\\>svg\\]\\:absolute>svg{position:absolute}.\\[\\&\\>svg\\]\\:left-4>svg{left:1rem}.\\[\\&\\>svg\\]\\:top-4>svg{top:1rem}.\\[\\&\\>svg\\]\\:text-amber-600>svg{--tw-text-opacity:1;color:rgb(217 119 6/var(--tw-text-opacity,1))}.\\[\\&\\>svg\\]\\:text-destructive>svg{color:hsl(var(--destructive))}.\\[\\&\\>svg\\]\\:text-foreground>svg{color:hsl(var(--foreground))}.dark\\:\\[\\&\\>svg\\]\\:text-amber-300>svg:is(.dark *){--tw-text-opacity:1;color:rgb(252 211 77/var(--tw-text-opacity,1))}.\\[\\&\\>svg\\~\\*\\]\\:pl-7>svg~*{padding-left:1.75rem}.\\[\\&_p\\]\\:leading-relaxed p{line-height:1.625}';

const nuxtGoogleFonts = "@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:400;src:url(" + buildAssetsURL("Inter-400-1.B2xhLi22.woff2") + ') format("woff2");unicode-range:u+0460-052f,u+1c80-1c88,u+20b4,u+2de0-2dff,u+a640-a69f,u+fe2e-fe2f}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:400;src:url(' + buildAssetsURL("Inter-400-2.CMZtQduZ.woff2") + ') format("woff2");unicode-range:u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:400;src:url(' + buildAssetsURL("Inter-400-3.CGAr0uHJ.woff2") + ') format("woff2");unicode-range:u+1f??}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:400;src:url(' + buildAssetsURL("Inter-400-4.CaVNZxsx.woff2") + ') format("woff2");unicode-range:u+0370-0377,u+037a-037f,u+0384-038a,u+038c,u+038e-03a1,u+03a3-03ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:400;src:url(' + buildAssetsURL("Inter-400-5.CBcvBZtf.woff2") + ') format("woff2");unicode-range:u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:400;src:url(' + buildAssetsURL("Inter-400-6.CFHvXkgd.woff2") + ') format("woff2");unicode-range:u+0100-02af,u+0304,u+0308,u+0329,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c0,u+2113,u+2c60-2c7f,u+a720-a7ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:400;src:url(' + buildAssetsURL("Inter-400-7.C2S99t-D.woff2") + ') format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:500;src:url(' + buildAssetsURL("Inter-400-1.B2xhLi22.woff2") + ') format("woff2");unicode-range:u+0460-052f,u+1c80-1c88,u+20b4,u+2de0-2dff,u+a640-a69f,u+fe2e-fe2f}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:500;src:url(' + buildAssetsURL("Inter-400-2.CMZtQduZ.woff2") + ') format("woff2");unicode-range:u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:500;src:url(' + buildAssetsURL("Inter-400-3.CGAr0uHJ.woff2") + ') format("woff2");unicode-range:u+1f??}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:500;src:url(' + buildAssetsURL("Inter-400-4.CaVNZxsx.woff2") + ') format("woff2");unicode-range:u+0370-0377,u+037a-037f,u+0384-038a,u+038c,u+038e-03a1,u+03a3-03ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:500;src:url(' + buildAssetsURL("Inter-400-5.CBcvBZtf.woff2") + ') format("woff2");unicode-range:u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:500;src:url(' + buildAssetsURL("Inter-400-6.CFHvXkgd.woff2") + ') format("woff2");unicode-range:u+0100-02af,u+0304,u+0308,u+0329,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c0,u+2113,u+2c60-2c7f,u+a720-a7ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:500;src:url(' + buildAssetsURL("Inter-400-7.C2S99t-D.woff2") + ') format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:600;src:url(' + buildAssetsURL("Inter-400-1.B2xhLi22.woff2") + ') format("woff2");unicode-range:u+0460-052f,u+1c80-1c88,u+20b4,u+2de0-2dff,u+a640-a69f,u+fe2e-fe2f}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:600;src:url(' + buildAssetsURL("Inter-400-2.CMZtQduZ.woff2") + ') format("woff2");unicode-range:u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:600;src:url(' + buildAssetsURL("Inter-400-3.CGAr0uHJ.woff2") + ') format("woff2");unicode-range:u+1f??}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:600;src:url(' + buildAssetsURL("Inter-400-4.CaVNZxsx.woff2") + ') format("woff2");unicode-range:u+0370-0377,u+037a-037f,u+0384-038a,u+038c,u+038e-03a1,u+03a3-03ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:600;src:url(' + buildAssetsURL("Inter-400-5.CBcvBZtf.woff2") + ') format("woff2");unicode-range:u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:600;src:url(' + buildAssetsURL("Inter-400-6.CFHvXkgd.woff2") + ') format("woff2");unicode-range:u+0100-02af,u+0304,u+0308,u+0329,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c0,u+2113,u+2c60-2c7f,u+a720-a7ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:600;src:url(' + buildAssetsURL("Inter-400-7.C2S99t-D.woff2") + ') format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:700;src:url(' + buildAssetsURL("Inter-400-1.B2xhLi22.woff2") + ') format("woff2");unicode-range:u+0460-052f,u+1c80-1c88,u+20b4,u+2de0-2dff,u+a640-a69f,u+fe2e-fe2f}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:700;src:url(' + buildAssetsURL("Inter-400-2.CMZtQduZ.woff2") + ') format("woff2");unicode-range:u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:700;src:url(' + buildAssetsURL("Inter-400-3.CGAr0uHJ.woff2") + ') format("woff2");unicode-range:u+1f??}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:700;src:url(' + buildAssetsURL("Inter-400-4.CaVNZxsx.woff2") + ') format("woff2");unicode-range:u+0370-0377,u+037a-037f,u+0384-038a,u+038c,u+038e-03a1,u+03a3-03ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:700;src:url(' + buildAssetsURL("Inter-400-5.CBcvBZtf.woff2") + ') format("woff2");unicode-range:u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:700;src:url(' + buildAssetsURL("Inter-400-6.CFHvXkgd.woff2") + ') format("woff2");unicode-range:u+0100-02af,u+0304,u+0308,u+0329,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c0,u+2113,u+2c60-2c7f,u+a720-a7ff}@font-face{font-display:swap;font-family:Inter;font-style:normal;font-weight:700;src:url(' + buildAssetsURL("Inter-400-7.C2S99t-D.woff2") + ') format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+2074,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}';

const entryStyles_D03IkJyY = [main, nuxtGoogleFonts];

export { entryStyles_D03IkJyY as default };
//# sourceMappingURL=entry-styles.D03IkJyY.mjs.map
