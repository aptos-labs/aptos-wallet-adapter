(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{930:function(e,t,l){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return l(1856)}])},1856:function(e,t,l){"use strict";l.r(t),l.d(t,{DEVNET_NODE_URL:function(){return u},default:function(){return j}});var s=l(7458),n=l(234),r=l(1253),a=l(2983);function o(e){let{text:t}=e;return(0,s.jsxs)("div",{className:"bg-teal-100 border border-teal-400 text-teal-900 px-4 py-3 rounded relative",role:"alert",children:[(0,s.jsx)("span",{className:"block sm:inline break-all right-3",children:t}),(0,s.jsx)("span",{className:"absolute top-0 bottom-0 right-0 px-4 py-3",children:(0,s.jsxs)("svg",{className:"fill-current h-6 w-6 text-teal-500",role:"button",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",children:[(0,s.jsx)("title",{children:"Close"}),(0,s.jsx)("path",{d:"M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"})]})})]})}function c(e){let{text:t}=e;return(0,s.jsxs)("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",role:"alert",children:[(0,s.jsx)("span",{className:"block sm:inline break-all",children:t}),(0,s.jsx)("span",{className:"absolute top-0 bottom-0 right-0 px-4 py-3",children:(0,s.jsxs)("svg",{className:"fill-current h-6 w-6 text-red-500",role:"button",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",children:[(0,s.jsx)("title",{children:"Close"}),(0,s.jsx)("path",{d:"M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"})]})})]})}var d=l(4648),i=l.n(d),x=l(4407),h=l.n(x);let p=i()(()=>l.e(556).then(l.bind(l,9556)),{loadableGenerated:{webpack:()=>[9556]},suspense:!1,ssr:!1}),u="https://fullnode.devnet.aptoslabs.com/v1",b=new n.gK(u,{WITH_CREDENTIALS:!1});function j(){let{connected:e,disconnect:t,account:l,network:n,wallet:d,signAndSubmitTransaction:i,signTransaction:x,signMessage:u}=(0,r.O)(),[j,m]=(0,a.useState)(""),[g,w]=(0,a.useState)(""),y=async()=>{let e={type:"entry_function_payload",function:"0x1::coin::transfer",type_arguments:["0x1::aptos_coin::AptosCoin"],arguments:[null==l?void 0:l.address,1]};try{let t=await i(e);await b.waitForTransaction((null==t?void 0:t.hash)||""),m("https://explorer.devnet.aptos.dev/txn/".concat(null==t?void 0:t.hash))}catch(s){console.log("error",s),w(s)}},N=async()=>{let e={type:"entry_function_payload",function:"0x1::coin::transfer",type_arguments:["0x1::aptos_coin::AptosCoin"],arguments:[null==l?void 0:l.address,1]};try{let t=await x(e);console.log("response",t)}catch(s){console.log("error",s),w(s)}},f=async()=>{try{let e=await u({message:"Hello from Aptos Wallet Adapter",nonce:"random_string"});m(JSON.stringify(e)),console.log("response",e)}catch(t){console.log("error",t),w(t)}};return(0,s.jsxs)("div",{children:[j.length>0&&(0,s.jsx)(o,{text:j}),g.length>0&&(0,s.jsx)(c,{text:g}),(0,s.jsx)("table",{className:"table-auto w-full border-separate border-spacing-y-8 shadow-lg bg-white border-separate",children:(0,s.jsxs)("tbody",{children:[(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{className:"px-8 py-4 w-1/4",children:(0,s.jsx)("h3",{children:"Connect a Wallet"})}),(0,s.jsx)("td",{className:"px-8 py-4 w-3/4",children:(0,s.jsx)(p,{})})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{className:"px-8 py-4 border-t w-1/4",children:(0,s.jsx)("h3",{children:"Actions"})}),(0,s.jsx)("td",{className:"px-8 py-4 border-t break-all w-3/4",children:(0,s.jsxs)("div",{children:[(0,s.jsx)("button",{className:"bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ".concat(e?"hover:bg-blue-700":"opacity-50 cursor-not-allowed"),onClick:t,disabled:!e,children:"Disconnect"}),(0,s.jsx)("button",{className:"bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ".concat(e?"hover:bg-blue-700":"opacity-50 cursor-not-allowed"),onClick:y,disabled:!e,children:"Sign and submit transaction"}),(0,s.jsx)("button",{className:"bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 ".concat(e?"hover:bg-blue-700":"opacity-50 cursor-not-allowed"),onClick:N,disabled:!e,children:"Sign transaction"}),(0,s.jsx)("button",{className:"bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 ".concat(e?"hover:bg-blue-700":"opacity-50 cursor-not-allowed"),onClick:f,disabled:!e,children:"Sign Message"})]})})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{className:"px-8 py-4 border-t w-1/4",children:(0,s.jsx)("h3",{children:"Wallet Name"})}),(0,s.jsxs)("td",{className:"px-8 py-4 border-t w-3/4",children:[(0,s.jsxs)("div",{style:{display:"flex"},children:[d&&(0,s.jsx)(h(),{src:d.icon,alt:d.name,width:25,height:25}),null==d?void 0:d.name]}),(0,s.jsx)("div",{children:(0,s.jsx)("a",{target:"_blank",className:"text-sky-600",rel:"noreferrer",href:null==d?void 0:d.url,children:null==d?void 0:d.url})})]})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{className:"px-8 py-4 border-t",children:(0,s.jsx)("h3",{children:"Account"})}),(0,s.jsx)("td",{className:"px-8 py-4 border-t break-all",children:(0,s.jsx)("div",{children:l?JSON.stringify(l):""})})]}),(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{className:"px-8 py-4 border-t",children:(0,s.jsx)("h3",{children:"Network"})}),(0,s.jsx)("td",{className:"px-8 py-4 border-t",children:(0,s.jsx)("div",{children:n?JSON.stringify(n):""})})]})]})})]})}},3938:function(){}},function(e){e.O(0,[680,112,774,888,179],function(){return e(e.s=930)}),_N_E=e.O()}]);