(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{65449:function(e,t,r){Promise.resolve().then(r.t.bind(r,24468,23)),Promise.resolve().then(r.bind(r,89981)),Promise.resolve().then(r.bind(r,25588)),Promise.resolve().then(r.bind(r,75380)),Promise.resolve().then(r.bind(r,8111)),Promise.resolve().then(r.bind(r,83794)),Promise.resolve().then(r.t.bind(r,58179,23)),Promise.resolve().then(r.t.bind(r,18155,23))},25588:function(e,t,r){"use strict";r.d(t,{ReactQueryClientProvider:function(){return i}});var n=r(76887),o=r(11599),a=r(26318);let s=new o.S;function i(e){let{children:t}=e;return(0,n.jsx)(a.aH,{client:s,children:t})}},75380:function(e,t,r){"use strict";r.d(t,{ThemeProvider:function(){return a}});var n=r(76887);r(85316);var o=r(65017);function a(e){let{children:t,...r}=e;return(0,n.jsx)(o.f,{...r,children:t})}},83794:function(e,t,r){"use strict";let n;r.d(t,{WalletProvider:function(){return x}});var o=r(76887),a=r(56170),s=r(45649),i=r(2662),d=r(20803),c=r(46125),l=r(82876),u=r(85316);let f="@wallet-adapter-example-dapp/claimSecretKey",m=new d.ScN({network:d.ZcK.TESTNET}),p=new d.gZG(m);var v=r(89981),g=r(71680);(0,s.TZ)({defaultNetwork:d.ZcK.TESTNET}),(0,i.Si)({defaultNetwork:d.ZcK.TESTNET}),n="".concat(window.location.origin).concat(window.location.pathname,"favicon.ico");let x=e=>{let{children:t}=e,{autoConnect:r}=(0,v.v)(),{toast:s}=(0,g.pm)(),i=function(){let e=null!==new URL(window.location.href).searchParams.get("claim")?function(){var e;let t=null!==(e=window.localStorage.getItem(f))&&void 0!==e?e:void 0;if(t)return t;let r=d.qN7.generate().toString();return window.localStorage.setItem(f,r),r}():void 0,t=(0,u.useMemo)(()=>{if(!e)return;let t=new d.qN7(e);return d.mRj.fromPrivateKey({privateKey:t}).accountAddress},[e]),{data:r}=(0,c.a)({queryKey:["accounts",t,"aptBalance"],queryFn:async()=>p.getAccountCoinAmount({accountAddress:t,coinType:"0x1::aptos_coin::AptosCoin"}),enabled:void 0!==t}),{isPending:n,mutate:o,isSuccess:a}=(0,l.D)({mutationFn:async e=>p.fundAccount({accountAddress:e,amount:1e8-(null!=r?r:0)})});return(0,u.useEffect)(()=>{void 0!==t&&void 0!==r&&(!(r<1e4)||a||n||o(t))},[t,e,r,o,a,n]),e}();return(0,o.jsx)(a.Ay,{autoConnect:r,dappConfig:{network:d.ZcK.TESTNET,aptosApiKeys:{testnet:"aptoslabs_Aj4uBsNmY47_3C5v3RscUDnhw7Vtt55bqLdaMJVrJp8Gz",devnet:"aptoslabs_Nf7JBL6d1w4_BXJA8gDDXNM2q15XWkBh4Z8nBf7cTmhjH"},aptosConnect:{claimSecretKey:i,dappId:"57fa42a9-29c6-4f1e-939c-4eefa36d9ff5",dappImageURI:n},mizuwallet:{manifestURL:"https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json"}},onError:e=>{s({variant:"destructive",title:"Error",description:e||"Unknown wallet error"})},children:t})}},8111:function(e,t,r){"use strict";r.d(t,{Toaster:function(){return x}});var n=r(76887),o=r(85316),a=r(78932),s=r(76542),i=r(10341),d=r(192);let c=a.zt,l=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.l_,{ref:t,className:(0,d.cn)("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",r),...o})});l.displayName=a.l_.displayName;let u=(0,s.j)("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",{variants:{variant:{default:"border bg-background text-foreground",destructive:"destructive group border-destructive bg-destructive text-destructive-foreground"}},defaultVariants:{variant:"default"}}),f=o.forwardRef((e,t)=>{let{className:r,variant:o,...s}=e;return(0,n.jsx)(a.fC,{ref:t,className:(0,d.cn)(u({variant:o}),r),...s})});f.displayName=a.fC.displayName,o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.aU,{ref:t,className:(0,d.cn)("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",r),...o})}).displayName=a.aU.displayName;let m=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.x8,{ref:t,className:(0,d.cn)("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",r),"toast-close":"",...o,children:(0,n.jsx)(i.Z,{className:"h-4 w-4"})})});m.displayName=a.x8.displayName;let p=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.Dx,{ref:t,className:(0,d.cn)("text-sm font-semibold",r),...o})});p.displayName=a.Dx.displayName;let v=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.dk,{ref:t,className:(0,d.cn)("text-sm opacity-90 break-all",r),...o})});v.displayName=a.dk.displayName;var g=r(71680);function x(){let{toasts:e}=(0,g.pm)();return(0,n.jsxs)(c,{children:[e.map(function(e){let{id:t,title:r,description:o,action:a,...s}=e;return(0,n.jsxs)(f,{...s,children:[(0,n.jsxs)("div",{className:"grid gap-1",children:[r&&(0,n.jsx)(p,{children:r}),o&&(0,n.jsx)(v,{children:o})]}),a,(0,n.jsx)(m,{})]},t)}),(0,n.jsx)(l,{})]})}},24468:function(){},18155:function(){}},function(e){e.O(0,[939,855,658,603,495,674,2,792,463,744],function(){return e(e.s=65449)}),_N_E=e.O()}]);