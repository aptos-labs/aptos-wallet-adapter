(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{6761:function(e,n,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(5402)}])},5402:function(e,n,r){"use strict";r.r(n),r.d(n,{default:function(){return ea}});var t=r(7458),s=r(1541),a=r(2983),l=r(9087),i=r(9552),o=r(9468),c=r(2208),d=r(8951),u=r(74),h=r(7639),x=r(1858),m=r(9998),j=r(5191),g=r(8106),b=r(6622),f=r(3260),p=r(2964),w=r(408),y=r(252),v=r(6740),N=r(4843),k=r(4948);function S(e){let{popoverAnchor:n,handlePopoverClose:r,handleNavigate:l}=e,{account:i,disconnect:o}=(0,s.Os)(),j=Boolean(n),g=()=>{l&&l(),r()},b=()=>{o(),r()},[f,p]=(0,a.useState)(!1),w=async e=>{await navigator.clipboard.writeText(null==i?void 0:i.address),p(!0),setTimeout(()=>{p(!1)},2e3)};return(0,t.jsx)(c.ZP,{id:j?"wallet-popover":void 0,open:j,anchorEl:n,onClose:r,anchorOrigin:{vertical:"bottom",horizontal:"left"},children:(0,t.jsxs)(d.Z,{children:[(0,t.jsx)(u.Z,{title:"Copied",placement:"bottom-end",open:f,disableFocusListener:!0,disableHoverListener:!0,disableTouchListener:!0,children:(0,t.jsx)(h.ZP,{disablePadding:!0,children:(0,t.jsx)(x.Z,{onClick:w,children:(0,t.jsx)(m.Z,{primary:"Copy Address"})})})}),(0,t.jsx)(h.ZP,{disablePadding:!0,children:(0,t.jsx)(x.Z,{onClick:g,children:(0,t.jsx)(m.Z,{primary:"Account"})})}),(0,t.jsx)(h.ZP,{disablePadding:!0,children:(0,t.jsx)(x.Z,{onClick:b,children:(0,t.jsx)(m.Z,{primary:"Logout"})})})]})})}function Z(e){let{handleModalOpen:n,handleNavigate:r}=e,{connected:c,account:d,wallet:u}=(0,s.Os)(),[h,x]=(0,a.useState)(null),m=e=>{x(e.currentTarget)},g=()=>{x(null)},b=()=>{g(),n()};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.Z,{size:"large",variant:"contained",onClick:c?m:b,className:"wallet-button",sx:{borderRadius:"10px"},children:c?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.Z,{alt:null==u?void 0:u.name,src:null==u?void 0:u.icon,sx:{width:24,height:24}}),(0,t.jsx)(o.Z,{noWrap:!0,ml:2,children:(null==d?void 0:d.ansName)?null==d?void 0:d.ansName:function(e,n,r,t){if(!e)return"";if(!Number.isInteger(n)||!Number.isInteger(r))throw"".concat(n," and ").concat(r," should be an Integer");var s=e.length;return(t=t||"…",0===n&&0===r||n>=s||r>=s||n+r>=s)?e:0===r?e.slice(0,n)+t:e.slice(0,n)+t+e.slice(s-r)}(null==d?void 0:d.address,6,4,"…")})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(j.Z,{sx:{marginRight:1}}),(0,t.jsx)(o.Z,{noWrap:!0,children:"Connect Wallet"})]})}),(0,t.jsx)(S,{popoverAnchor:h,handlePopoverClose:g,handleNavigate:r})]})}var A={50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",450:"#909099",500:"#4f5352",600:"#363a39",700:"#272b2a",800:"#1b1f1e",900:"#121615"},C=e=>{let{wallet:n,onClick:r}=e,s=(0,g.Z)();return(0,t.jsx)(h.ZP,{disablePadding:!0,children:(0,t.jsxs)(x.Z,{alignItems:"center",disableGutters:!0,onClick:()=>r(),sx:{background:"dark"===s.palette.mode?A[700]:A[200],padding:"1rem 1rem",borderRadius:"".concat(s.shape.borderRadius,"px"),display:"flex",gap:"1rem"},children:[(0,t.jsx)(b.Z,{sx:{display:"flex",alignItems:"center",width:"2rem",height:"2rem",minWidth:"0",color:"".concat(s.palette.text.primary)},children:(0,t.jsx)(f.Z,{component:"img",src:n.icon,sx:{width:"100%",height:"100%"}})}),(0,t.jsx)(m.Z,{primary:n.name,primaryTypographyProps:{fontSize:18}}),(0,t.jsx)(l.Z,{variant:"contained",size:"small",className:"wallet-connect-button",children:"Connect"})]})})},T=e=>{let{wallet:n}=e,r=(0,g.Z)();return(0,t.jsxs)(h.ZP,{alignItems:"center",sx:{borderRadius:"".concat(r.shape.borderRadius,"px"),background:"dark"===r.palette.mode?A[700]:A[200],padding:"1rem 1rem",gap:"1rem"},children:[(0,t.jsx)(b.Z,{sx:{display:"flex",alignItems:"center",width:"2rem",height:"2rem",minWidth:"0",opacity:"0.25"},children:(0,t.jsx)(f.Z,{component:"img",src:n.icon,sx:{width:"100%",height:"100%"}})}),(0,t.jsx)(m.Z,{sx:{opacity:"0.25"},primary:n.name,primaryTypographyProps:{fontSize:18}}),(0,t.jsx)(l.Z,{LinkComponent:"a",href:n.url,target:"_blank",size:"small",className:"wallet-connect-install",children:"Install"})]})};function E(e){let{handleClose:n,modalOpen:r,networkSupport:a}=e,{wallets:l,connect:i}=(0,s.Os)(),c=(0,g.Z)(),d=e=>{i(e),n()};return(0,t.jsx)(w.Z,{open:r,onClose:n,"aria-labelledby":"wallet selector modal","aria-describedby":"select a wallet to connect",sx:{borderRadius:"".concat(c.shape.borderRadius,"px")},maxWidth:"xs",fullWidth:!0,children:(0,t.jsxs)(y.Z,{sx:{display:"flex",flexDirection:"column",top:"50%",left:"50%",bgcolor:"background.paper",boxShadow:24,p:3},children:[(0,t.jsx)(v.Z,{onClick:n,sx:{position:"absolute",right:12,top:12,color:A[450]},children:(0,t.jsx)(k.Z,{})}),(0,t.jsx)(o.Z,{align:"center",variant:"h5",pt:2,children:"Connect Wallet"}),(0,t.jsx)(f.Z,{sx:{display:"flex",gap:.5,alignItems:"center",justifyContent:"center",mb:4},children:a&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(N.Z,{sx:{fontSize:"0.9rem",color:A[400]}}),(0,t.jsxs)(o.Z,{sx:{display:"inline-flex",fontSize:"0.9rem",color:A[400]},align:"center",children:[a," only"]})]})}),(0,t.jsx)(f.Z,{children:null==l?void 0:l.map(e=>{let n=e.readyState===s.i1.Installed||e.readyState===s.i1.Loadable,r=e=>{let{children:n}=e;return(0,t.jsx)(p.ZP,{xs:12,paddingY:.5,item:!0,children:n})};if(!n&&(0,s.cX)()){let a=Boolean(e.deeplinkProvider);return a?(0,t.jsx)(r,{children:(0,t.jsx)(C,{wallet:e,onClick:()=>i(e.name)})},e.name):null}return(0,t.jsx)(r,{children:n?(0,t.jsx)(C,{wallet:e,onClick:()=>d(e.name)}):(0,t.jsx)(T,{wallet:e})},e.name)})})]})})}function _(e){let{networkSupport:n,handleNavigate:r}=e,[s,l]=(0,a.useState)(!1),i=()=>l(!0),o=()=>l(!1);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(Z,{handleModalOpen:i,handleNavigate:r}),(0,t.jsx)(E,{handleClose:o,modalOpen:s,networkSupport:n})]})}var K=r(2272),P=r.n(K),F=r(5258),I=r.n(F),O=r(4628),W=r(1761);let M=e=>{if((null==e?void 0:e.name)===W.ZcK.DEVNET)return V;if((null==e?void 0:e.name)===W.ZcK.TESTNET)return D;if((null==e?void 0:e.name)===W.ZcK.MAINNET)throw Error("Please use devnet or testnet for testing");{let n=new W.ScN({network:W.ZcK.CUSTOM,fullnode:null==e?void 0:e.url});return new W.gZG(n)}},R=new W.ScN({network:W.ZcK.DEVNET}),V=new W.gZG(R),L=new W.ScN({network:W.ZcK.TESTNET}),D=new W.gZG(L);var G=r(589);function z(e){let{color:n,onClick:r,disabled:s,message:a}=e;return(0,t.jsx)("button",{className:"bg-".concat(n,"-500 text-white font-bold py-2 px-4 rounded mr-4 ").concat(s?"opacity-50 cursor-not-allowed":"hover:bg-".concat(n,"-700")),onClick:r,disabled:s,children:a})}function H(e){return(0,t.jsx)("td",{className:"px-8 py-4 ".concat(e.border?"border-t":""," w-").concat(e.title?"1/4":"3/4"),children:e.children})}function Y(e){return(0,t.jsx)("tr",{children:e.children})}let J="0x1::aptos_coin::AptosCoin";function U(e){let{isSendableNetwork:n}=e,{setSuccessAlertMessage:r,setSuccessAlertHash:a}=(0,G.VY)(),{connected:l,account:i,network:o,signAndSubmitTransaction:c,signMessageAndVerify:d,signMessage:u,signTransaction:h}=(0,s.Os)(),x=n(l,null==o?void 0:o.name),m=async()=>{let e={message:"Hello from Aptos Wallet Adapter",nonce:Math.random().toString(16)},n=await d(e);r(JSON.stringify({onSignMessageAndVerify:n}))},j=async()=>{let e={message:"Hello from Aptos Wallet Adapter",nonce:Math.random().toString(16)},n=await u(e);r(JSON.stringify({onSignMessage:n}))},g=async()=>{if(!i)return;let e={data:{function:"0x1::coin::transfer",typeArguments:[J],functionArguments:[i.address,1]}};try{let n=await c(e);await M(o).waitForTransaction({transactionHash:n.hash}),a(n.hash,o)}catch(r){console.error(r)}},b=async()=>{if(i)try{let e=await c({data:{function:"0x1::coin::transfer",typeArguments:[(0,W._LL)(J)],functionArguments:[W.kxK.from(i.address),new W.G90(1)]}});await M(o).waitForTransaction({transactionHash:e.hash}),a(e.hash,o)}catch(n){console.error(n)}},f=async()=>{try{let e={type:"entry_function_payload",function:"0x1::coin::transfer",type_arguments:["0x1::aptos_coin::AptosCoin"],arguments:[null==i?void 0:i.address,1]},n=await h(e);r(JSON.stringify(n))}catch(t){console.error(t)}},p=async()=>{if(i)try{let e=await M(o).transaction.build.simple({sender:i.address,data:{function:"0x1::coin::transfer",typeArguments:[J],functionArguments:[i.address,1]}}),n=await h(e);r(JSON.stringify(n))}catch(t){console.error(t)}};return(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,border:!0,children:(0,t.jsx)("h3",{children:"Single Signer Flow"})}),(0,t.jsxs)(H,{border:!0,children:[(0,t.jsx)(z,{color:"blue",onClick:g,disabled:!x,message:"Sign and submit transaction"}),(0,t.jsx)(z,{color:"blue",onClick:b,disabled:!x,message:"Sign and submit BCS transaction"}),(0,t.jsx)(z,{color:"blue",onClick:f,disabled:!x,message:"Sign transaction"}),(0,t.jsx)(z,{color:"blue",onClick:p,disabled:!x,message:"Sign transaction V2"}),(0,t.jsx)(z,{color:"blue",onClick:j,disabled:!x,message:"Sign message"}),(0,t.jsx)(z,{color:"blue",onClick:m,disabled:!x,message:"Sign message and verify"})]})]})}function B(e){let{isSendableNetwork:n}=e,{connected:r,account:l,network:i,signTransaction:o,submitTransaction:c}=(0,s.Os)(),[d,u]=(0,a.useState)(null),{setSuccessAlertHash:h}=(0,G.VY)(),[x,m]=(0,a.useState)(),[j,g]=(0,a.useState)(),[b,f]=(0,a.useState)(),p=n(r,null==i?void 0:i.name),w=async()=>{if(!l)throw Error("no account");let e=await M(i).transaction.build.simple({sender:l.address,withFeePayer:!0,data:{function:"0x1::coin::transfer",typeArguments:["0x1::aptos_coin::AptosCoin"],functionArguments:[l.address,1]}});return e},y=async()=>{let e=await w();u(e);try{let n=await o(e);m(n)}catch(r){console.error(r)}},v=async()=>{if(!d)throw Error("No Transaction to sign");try{let e=await o(d,!0);g(e),f(W.kxK.from(l.address))}catch(n){console.error(n)}},N=async()=>{if(!d)throw Error("No Transaction to sign");if(!x)throw Error("No senderAuthenticator");if(!j)throw Error("No feepayerAuthenticator");d.feePayerAddress=b;try{let e=await c({transaction:d,senderAuthenticator:x,feePayerAuthenticator:j});h(e.hash,i)}catch(n){console.error(n)}};return(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,border:!0,children:(0,t.jsx)("h3",{children:"Sponsor Transaction Flow"})}),(0,t.jsxs)(H,{border:!0,children:[(0,t.jsx)(z,{color:"blue",onClick:()=>y(),disabled:!p,message:"Sign as Sender"}),(0,t.jsx)(z,{color:"blue",onClick:()=>v(),disabled:!p||!x,message:"Sign as Sponsor"}),(0,t.jsx)(z,{color:"blue",onClick:N,disabled:!p||!j,message:"Submit transaction"})]})]})}function X(e){let{isSendableNetwork:n}=e,{connected:r,account:l,network:i,signTransaction:o,submitTransaction:c}=(0,s.Os)(),[d,u]=(0,a.useState)(),[h,x]=(0,a.useState)(null),{setSuccessAlertHash:m}=(0,G.VY)(),[j,g]=(0,a.useState)(),[b,f]=(0,a.useState)(),p=n(r,null==i?void 0:i.name),w=async()=>{if(!l)throw Error("no account");if(!i)throw Error("no network");let e=W.mRj.generate();await M(i).fundAccount({accountAddress:e.accountAddress.toString(),amount:1e8}),u(e);let n=await M(i).transaction.build.multiAgent({sender:l.address,secondarySignerAddresses:[e.accountAddress],data:{function:"0x1::coin::transfer",typeArguments:["0x1::aptos_coin::AptosCoin"],functionArguments:[l.address,1]}});return n},y=async()=>{let e=await w();x(e);try{let n=await o(e);g(n)}catch(r){console.error(r)}},v=async()=>{if(!h)throw Error("No Transaction to sign");try{let e=await o(h);f(e)}catch(n){console.error(n)}},N=async()=>{if(!h)throw Error("No Transaction to sign");if(!j)throw Error("No senderAuthenticator");if(!b)throw Error("No secondarySignerAuthenticator");try{let e=await c({transaction:h,senderAuthenticator:j,additionalSignersAuthenticators:[b]});m(e.hash,i)}catch(n){console.error(n)}};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,border:!0,children:(0,t.jsx)("h3",{children:"Multi Agent Transaction Flow"})}),(0,t.jsxs)(H,{border:!0,children:[(0,t.jsx)(z,{color:"blue",onClick:y,disabled:!p,message:"Sign as sender"}),(0,t.jsx)(z,{color:"blue",onClick:v,disabled:!p||!j,message:"Sign as secondary signer"}),(0,t.jsx)(z,{color:"blue",onClick:N,disabled:!p||!b,message:"Submit transaction"})]})]}),d&&j&&(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"Secondary Signer details"})}),(0,t.jsxs)(H,{children:[(0,t.jsxs)("p",{children:["Private Key: ",d.privateKey.toString()]}),(0,t.jsxs)("p",{children:["Public Key: ",d.publicKey.toString()]}),(0,t.jsxs)("p",{children:["Address: ",d.accountAddress.toString()]})]})]})]})}var q=r(8980),Q=r(6210);function $(e){let{isSendableNetwork:n}=e,{setSuccessAlertMessage:r,setErrorAlertMessage:a}=(0,G.VY)(),{connected:l,account:i,network:o,signAndSubmitTransaction:c,wallet:d}=(0,s.Os)(),u=n(l,null==o?void 0:o.name),h=async()=>{if(!i)return;let e={data:{function:"0x1::coin::transfer",typeArguments:["0x1::aptos_coin::AptosCoin"],functionArguments:[i.address,1]},options:{maxGasAmount:1e4}};try{let n=await c(e),t=await M(o).waitForTransaction({transactionHash:n.hash});1e4==t.max_gas_amount?r("".concat(null==d?void 0:d.name," transaction ").concat(t.hash," executed with a max gas amount of ").concat(1e4)):a("".concat(null==d?void 0:d.name," transaction ").concat(t.hash," executed with a max gas amount of ").concat(t.max_gas_amount))}catch(s){console.error(s)}};return(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,border:!0,children:(0,t.jsx)("h3",{children:"Validate Transaction Parameters"})}),(0,t.jsx)(H,{border:!0,children:(0,t.jsx)(z,{color:"blue",onClick:h,disabled:!u,message:"With MaxGasAmount"})})]})}let{Link:ee}=q.Z,en=P()(()=>r.e(579).then(r.bind(r,3579)),{loadableGenerated:{webpack:()=>[3579]},suspense:!1,ssr:!1}),er=P()(()=>Promise.all([r.e(505),r.e(250)]).then(r.bind(r,8250)),{loadableGenerated:{webpack:()=>[8250]},suspense:!1,ssr:!1}),et=e=>e&&!es(e),es=(e,n)=>e&&n===W.ZcK.MAINNET;function ea(){var e;let{account:n,connected:r,network:a,wallet:l,changeNetwork:i}=(0,s.Os)();return(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"flex justify-center mt-2 mb-4 text-4xl font-extrabold tracking-tight leading-none text-black",children:["Aptos Wallet Adapter Tester (",null!==(e=null==a?void 0:a.name)&&void 0!==e?e:"",")"]}),(0,t.jsx)(ee,{href:"https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-example",target:"_blank",className:"flex justify-center tracking-tight leading-none text-black",children:"Demo app source code"}),(0,t.jsx)("table",{className:"table-auto w-full border-separate border-spacing-y-8 shadow-lg bg-white border-separate",children:(0,t.jsxs)("tbody",{children:[(0,t.jsx)(el,{}),(0,t.jsx)(ed,{}),r&&(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,border:!0,children:(0,t.jsx)("h3",{children:(0,t.jsx)("b",{children:"Wallet Information"})})}),(0,t.jsx)(H,{border:!0})]}),r&&(0,t.jsx)(ei,{wallet:l,network:a,account:n,changeNetwork:i}),r&&es(r,null==a?void 0:a.name)&&(0,t.jsxs)("tr",{children:[(0,t.jsx)(H,{title:!0}),(0,t.jsx)(H,{children:(0,t.jsx)("p",{style:{color:"red"},children:"Transactions dont work with Mainnet network"})})]}),r&&(0,t.jsx)($,{isSendableNetwork:et}),r&&(0,t.jsx)(U,{isSendableNetwork:et}),r&&(0,t.jsx)(B,{isSendableNetwork:et}),r&&(0,t.jsx)(X,{isSendableNetwork:et})]})})]})}function el(){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,border:!0,children:(0,t.jsx)("h2",{children:(0,t.jsx)("b",{children:"Wallet Select"})})}),(0,t.jsx)(H,{border:!0})]}),(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"Connect a Wallet"})}),(0,t.jsx)(H,{children:(0,t.jsx)(en,{})})]}),(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"Ant Design"})}),(0,t.jsx)(H,{children:(0,t.jsx)(er,{})})]}),(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"MUI Design"})}),(0,t.jsx)(H,{children:(0,t.jsx)(_,{})})]})]})}function ei(e){var n,r,s,a;let{account:l,network:i,wallet:o,changeNetwork:c}=e,d=async e=>{console.log("selected ".concat(e)),await c(e)};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("tr",{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"Wallet Name"})}),(0,t.jsxs)(H,{children:[(0,t.jsx)("b",{children:"Icon: "}),e.wallet&&(0,t.jsx)(I(),{src:null!==(s=null==o?void 0:o.icon)&&void 0!==s?s:"",alt:null!==(a=null==o?void 0:o.name)&&void 0!==a?a:"",width:25,height:25}),(0,t.jsx)("b",{children:" Name: "}),null==o?void 0:o.name,(0,t.jsx)("b",{children:" URL: "}),(0,t.jsx)("a",{target:"_blank",className:"text-sky-600",rel:"noreferrer",href:null==o?void 0:o.url,children:null==o?void 0:o.url})]})]}),(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"Account Info"})}),(0,t.jsxs)(H,{children:[(0,t.jsx)(eo,{name:"Address",isCorrect:!!(null==l?void 0:l.address),value:null==l?void 0:l.address}),(0,t.jsx)(eo,{name:"Public key",isCorrect:!!(null==l?void 0:l.publicKey),value:null==l?void 0:null===(n=l.publicKey)||void 0===n?void 0:n.toString()}),(0,t.jsx)(ec,{name:"ANS Name (only if attached)",value:null==l?void 0:l.ansName}),(0,t.jsx)(ec,{name:"Min keys required (only for multisig)",value:null==l?void 0:null===(r=l.minKeysRequired)||void 0===r?void 0:r.toString()})]})]}),(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"Network Info"})}),(0,t.jsxs)(H,{children:[(0,t.jsx)(eo,{name:"Network Name",isCorrect:(()=>{if((0,Q.Tt)(i)){var n;return Object.values(W.ZcK).includes(null===(n=e.network)||void 0===n?void 0:n.name)}return!0})(),value:null==i?void 0:i.name,expected:"one of: "+Object.values(W.ZcK).join(", ")}),(0,t.jsx)(ec,{name:"URL",value:null==i?void 0:i.url}),(0,t.jsx)(ec,{name:"ChainId",value:null==i?void 0:i.chainId})]})]}),(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,children:(0,t.jsx)("h3",{children:"Change Network"})}),(0,t.jsxs)(H,{children:[(0,t.jsx)("button",{className:"bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 hover:bg-blue-700 ".concat((null==i?void 0:i.name)===W.ZcK.DEVNET?"opacity-50 cursor-not-allowed":"hover:bg-blue-700"),onClick:()=>d(W.ZcK.DEVNET),disabled:(null==i?void 0:i.name)==="devnet",children:(0,t.jsx)(t.Fragment,{children:"Devnet"})}),(0,t.jsx)("button",{className:"bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 hover:bg-blue-700 ".concat((null==i?void 0:i.name)===W.ZcK.TESTNET?"opacity-50 cursor-not-allowed":"hover:bg-blue-700"),onClick:()=>d(W.ZcK.TESTNET),disabled:(null==i?void 0:i.name)===W.ZcK.TESTNET,children:(0,t.jsx)(t.Fragment,{children:"Testnet"})}),(0,t.jsx)("button",{className:"bg-blue-500  text-white font-bold py-2 px-4 rounded mr-4 hover:bg-blue-700 ".concat((null==i?void 0:i.name)===W.ZcK.MAINNET?"opacity-50 cursor-not-allowed":"hover:bg-blue-700"),onClick:()=>d(W.ZcK.MAINNET),disabled:(null==i?void 0:i.name)==="mainnet",children:(0,t.jsx)(t.Fragment,{children:"Mainnet"})})]})]})]})}function eo(e){let{name:n,isCorrect:r,value:s,expected:a}=e;return(0,t.jsx)("div",{style:r?{color:"green"}:{color:"black",border:"2px solid red"},children:(0,t.jsxs)("p",{children:[(0,t.jsxs)("b",{children:[n,":"]})," ",null!=s?s:"Not present"," ",!r&&a&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("b",{children:"Expected:"})," ",a]})]})})}function ec(e){var n;return(0,t.jsx)("div",{children:(0,t.jsxs)("p",{children:[(0,t.jsxs)("b",{children:[e.name,":"]})," ",null!==(n=e.value)&&void 0!==n?n:"Not present"]})})}function ed(){let{autoConnect:e,setAutoConnect:n}=(0,O.vl)();return(0,t.jsx)(t.Fragment,{children:(0,t.jsxs)(Y,{children:[(0,t.jsx)(H,{title:!0,border:!0,children:(0,t.jsx)("h3",{children:"Auto reconnect on page open"})}),(0,t.jsx)(H,{border:!0,children:(0,t.jsx)("div",{className:"relative flex flex-col overflow-hidden",children:(0,t.jsx)("div",{className:"flex",children:(0,t.jsxs)("label",{className:"inline-flex relative items-center mr-5 cursor-pointer",children:[(0,t.jsx)("input",{type:"checkbox",className:"sr-only peer",checked:e,readOnly:!0}),(0,t.jsx)("div",{onClick(){n(!e)},className:"w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"})]})})})})]})})}}},function(e){e.O(0,[712,774,888,179],function(){return e(e.s=6761)}),_N_E=e.O()}]);