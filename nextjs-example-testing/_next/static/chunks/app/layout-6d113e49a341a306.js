(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{58216:function(e,t,r){Promise.resolve().then(r.t.bind(r,99781,23)),Promise.resolve().then(r.bind(r,70992)),Promise.resolve().then(r.bind(r,78394)),Promise.resolve().then(r.bind(r,72159)),Promise.resolve().then(r.bind(r,88480)),Promise.resolve().then(r.bind(r,58912)),Promise.resolve().then(r.t.bind(r,30145,23)),Promise.resolve().then(r.t.bind(r,85240,23))},78394:function(e,t,r){"use strict";r.d(t,{ReactQueryClientProvider:function(){return i}});var n=r(3894),o=r(43917),a=r(72061);let s=new o.S;function i(e){let{children:t}=e;return(0,n.jsx)(a.aH,{client:s,children:t})}},72159:function(e,t,r){"use strict";r.d(t,{ThemeProvider:function(){return a}});var n=r(3894);r(73473);var o=r(46130);function a(e){let{children:t,...r}=e;return(0,n.jsx)(o.f,{...r,children:t})}},58912:function(e,t,r){"use strict";r.d(t,{WalletProvider:function(){return v}});var n=r(3894),o=r(14563),a=r(78182),s=r(96514),i=r(30509),d=r(73473);let u="@wallet-adapter-example-dapp/claimSecretKey",c=new a.ScN({network:a.ZcK.TESTNET}),l=new a.gZG(c);var f=r(70992),m=r(6523),p=r(32608);let v=e=>{let{children:t}=e,{autoConnect:r}=(0,f.v)(),{toast:c}=(0,m.pm)(),v=function(){let e=null!==new URL(window.location.href).searchParams.get("claim")?function(){var e;let t=null!==(e=window.localStorage.getItem(u))&&void 0!==e?e:void 0;if(t)return t;let r=a.qN7.generate().toString();return window.localStorage.setItem(u,r),r}():void 0,t=(0,d.useMemo)(()=>{if(!e)return;let t=new a.qN7(e);return a.mRj.fromPrivateKey({privateKey:t}).accountAddress},[e]),{data:r}=(0,s.a)({queryKey:["accounts",t,"aptBalance"],queryFn:async()=>l.getAccountCoinAmount({accountAddress:t,coinType:"0x1::aptos_coin::AptosCoin"}),enabled:void 0!==t}),{isPending:n,mutate:o,isSuccess:c}=(0,i.D)({mutationFn:async e=>l.fundAccount({accountAddress:e,amount:1e8-(null!=r?r:0)})});return(0,d.useEffect)(()=>{void 0!==t&&void 0!==r&&(!(r<1e4)||c||n||o(t))},[t,e,r,o,c,n]),e}();return(0,n.jsx)(o.Ay,{autoConnect:r,dappConfig:{network:a.ZcK.TESTNET,aptosApiKeys:{testnet:p.env.NEXT_PUBLIC_APTOS_API_KEY_TESNET,devnet:p.env.NEXT_PUBLIC_APTOS_API_KEY_DEVNET},aptosConnect:{claimSecretKey:v,dappId:"57fa42a9-29c6-4f1e-939c-4eefa36d9ff5"},mizuwallet:{manifestURL:"https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json"}},onError:e=>{c({variant:"destructive",title:"Error",description:e||"Unknown wallet error"})},children:t})}},88480:function(e,t,r){"use strict";r.d(t,{Toaster:function(){return g}});var n=r(3894),o=r(73473),a=r(89664),s=r(5343),i=r(71405),d=r(2129);let u=a.zt,c=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.l_,{ref:t,className:(0,d.cn)("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",r),...o})});c.displayName=a.l_.displayName;let l=(0,s.j)("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",{variants:{variant:{default:"border bg-background text-foreground",destructive:"destructive group border-destructive bg-destructive text-destructive-foreground"}},defaultVariants:{variant:"default"}}),f=o.forwardRef((e,t)=>{let{className:r,variant:o,...s}=e;return(0,n.jsx)(a.fC,{ref:t,className:(0,d.cn)(l({variant:o}),r),...s})});f.displayName=a.fC.displayName,o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.aU,{ref:t,className:(0,d.cn)("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",r),...o})}).displayName=a.aU.displayName;let m=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.x8,{ref:t,className:(0,d.cn)("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",r),"toast-close":"",...o,children:(0,n.jsx)(i.Z,{className:"h-4 w-4"})})});m.displayName=a.x8.displayName;let p=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.Dx,{ref:t,className:(0,d.cn)("text-sm font-semibold",r),...o})});p.displayName=a.Dx.displayName;let v=o.forwardRef((e,t)=>{let{className:r,...o}=e;return(0,n.jsx)(a.dk,{ref:t,className:(0,d.cn)("text-sm opacity-90 break-all",r),...o})});v.displayName=a.dk.displayName;var x=r(6523);function g(){let{toasts:e}=(0,x.pm)();return(0,n.jsxs)(u,{children:[e.map(function(e){let{id:t,title:r,description:o,action:a,...s}=e;return(0,n.jsxs)(f,{...s,children:[(0,n.jsxs)("div",{className:"grid gap-1",children:[r&&(0,n.jsx)(p,{children:r}),o&&(0,n.jsx)(v,{children:o})]}),a,(0,n.jsx)(m,{})]},t)}),(0,n.jsx)(c,{})]})}},99781:function(){},85240:function(){}},function(e){e.O(0,[978,855,603,508,920,860,891,381,744],function(){return e(e.s=58216)}),_N_E=e.O()}]);