(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[451],{54015:function(e){e.exports={style:{fontFamily:"'__Inter_439b13', '__Inter_Fallback_439b13'",fontStyle:"normal"},className:"__className_439b13",variable:"__variable_439b13"}},56415:function(e,t,r){"use strict";r.d(t,{aU:function(){return et},x8:function(){return er},dk:function(){return ee},zt:function(){return z},fC:function(){return J},Dx:function(){return $},l_:function(){return G}});var n=r(35959),s=r(97769),i=r(83224),a=r(90161),o=r(41093),u=r(20390),l=r(43504),c=r(82262),d=r(44885),h=r(3782),f=r(73362),p=r(85129),y=r(1903),m=r(17681),v=n.forwardRef((e,t)=>(0,m.jsx)(h.WV.span,{...e,ref:t,style:{position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal",...e.style}}));v.displayName="VisuallyHidden";var w="ToastProvider",[g,b,E]=(0,o.B)("Toast"),[x,C]=(0,u.b)("Toast",[E]),[T,P]=x(w),q=e=>{let{__scopeToast:t,label:r="Notification",duration:s=5e3,swipeDirection:i="right",swipeThreshold:a=50,children:o}=e,[u,l]=n.useState(null),[c,d]=n.useState(0),h=n.useRef(!1),f=n.useRef(!1);return r.trim()||console.error("Invalid prop `label` supplied to `".concat(w,"`. Expected non-empty `string`.")),(0,m.jsx)(g.Provider,{scope:t,children:(0,m.jsx)(T,{scope:t,label:r,duration:s,swipeDirection:i,swipeThreshold:a,toastCount:c,viewport:u,onViewportChange:l,onToastAdd:n.useCallback(()=>d(e=>e+1),[]),onToastRemove:n.useCallback(()=>d(e=>e-1),[]),isFocusedToastEscapeKeyDownRef:h,isClosePausedRef:f,children:o})})};q.displayName=w;var D="ToastViewport",O=["F8"],R="toast.viewportPause",M="toast.viewportResume",A=n.forwardRef((e,t)=>{let{__scopeToast:r,hotkey:s=O,label:i="Notifications ({hotkey})",...o}=e,u=P(D,r),c=b(r),d=n.useRef(null),f=n.useRef(null),p=n.useRef(null),y=n.useRef(null),v=(0,a.e)(t,y,u.onViewportChange),w=s.join("+").replace(/Key/g,"").replace(/Digit/g,""),E=u.toastCount>0;n.useEffect(()=>{let e=e=>{var t;0!==s.length&&s.every(t=>e[t]||e.code===t)&&(null===(t=y.current)||void 0===t||t.focus())};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[s]),n.useEffect(()=>{let e=d.current,t=y.current;if(E&&e&&t){let r=()=>{if(!u.isClosePausedRef.current){let e=new CustomEvent(R);t.dispatchEvent(e),u.isClosePausedRef.current=!0}},n=()=>{if(u.isClosePausedRef.current){let e=new CustomEvent(M);t.dispatchEvent(e),u.isClosePausedRef.current=!1}},s=t=>{e.contains(t.relatedTarget)||n()},i=()=>{e.contains(document.activeElement)||n()};return e.addEventListener("focusin",r),e.addEventListener("focusout",s),e.addEventListener("pointermove",r),e.addEventListener("pointerleave",i),window.addEventListener("blur",r),window.addEventListener("focus",n),()=>{e.removeEventListener("focusin",r),e.removeEventListener("focusout",s),e.removeEventListener("pointermove",r),e.removeEventListener("pointerleave",i),window.removeEventListener("blur",r),window.removeEventListener("focus",n)}}},[E,u.isClosePausedRef]);let x=n.useCallback(e=>{let{tabbingDirection:t}=e,r=c().map(e=>{let r=e.ref.current,n=[r,...function(e){let t=[],r=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>{let t="INPUT"===e.tagName&&"hidden"===e.type;return e.disabled||e.hidden||t?NodeFilter.FILTER_SKIP:e.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;r.nextNode();)t.push(r.currentNode);return t}(r)];return"forwards"===t?n:n.reverse()});return("forwards"===t?r.reverse():r).flat()},[c]);return n.useEffect(()=>{let e=y.current;if(e){let t=t=>{let r=t.altKey||t.ctrlKey||t.metaKey;if("Tab"===t.key&&!r){var n,s,i;let r=document.activeElement,a=t.shiftKey;if(t.target===e&&a){null===(n=f.current)||void 0===n||n.focus();return}let o=x({tabbingDirection:a?"backwards":"forwards"}),u=o.findIndex(e=>e===r);B(o.slice(u+1))?t.preventDefault():a?null===(s=f.current)||void 0===s||s.focus():null===(i=p.current)||void 0===i||i.focus()}};return e.addEventListener("keydown",t),()=>e.removeEventListener("keydown",t)}},[c,x]),(0,m.jsxs)(l.I0,{ref:d,role:"region","aria-label":i.replace("{hotkey}",w),tabIndex:-1,style:{pointerEvents:E?void 0:"none"},children:[E&&(0,m.jsx)(Q,{ref:f,onFocusFromOutsideViewport:()=>{B(x({tabbingDirection:"forwards"}))}}),(0,m.jsx)(g.Slot,{scope:r,children:(0,m.jsx)(h.WV.ol,{tabIndex:-1,...o,ref:v})}),E&&(0,m.jsx)(Q,{ref:p,onFocusFromOutsideViewport:()=>{B(x({tabbingDirection:"backwards"}))}})]})});A.displayName=D;var F="ToastFocusProxy",Q=n.forwardRef((e,t)=>{let{__scopeToast:r,onFocusFromOutsideViewport:n,...s}=e,i=P(F,r);return(0,m.jsx)(v,{"aria-hidden":!0,tabIndex:0,...s,ref:t,style:{position:"fixed"},onFocus:e=>{var t;let r=e.relatedTarget;(null===(t=i.viewport)||void 0===t?void 0:t.contains(r))||n()}})});Q.displayName=F;var j="Toast",N=n.forwardRef((e,t)=>{let{forceMount:r,open:n,defaultOpen:s,onOpenChange:a,...o}=e,[u=!0,l]=(0,p.T)({prop:n,defaultProp:s,onChange:a});return(0,m.jsx)(d.z,{present:r||u,children:(0,m.jsx)(_,{open:u,...o,ref:t,onClose:()=>l(!1),onPause:(0,f.W)(e.onPause),onResume:(0,f.W)(e.onResume),onSwipeStart:(0,i.M)(e.onSwipeStart,e=>{e.currentTarget.setAttribute("data-swipe","start")}),onSwipeMove:(0,i.M)(e.onSwipeMove,e=>{let{x:t,y:r}=e.detail.delta;e.currentTarget.setAttribute("data-swipe","move"),e.currentTarget.style.setProperty("--radix-toast-swipe-move-x","".concat(t,"px")),e.currentTarget.style.setProperty("--radix-toast-swipe-move-y","".concat(r,"px"))}),onSwipeCancel:(0,i.M)(e.onSwipeCancel,e=>{e.currentTarget.setAttribute("data-swipe","cancel"),e.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),e.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),e.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"),e.currentTarget.style.removeProperty("--radix-toast-swipe-end-y")}),onSwipeEnd:(0,i.M)(e.onSwipeEnd,e=>{let{x:t,y:r}=e.detail.delta;e.currentTarget.setAttribute("data-swipe","end"),e.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),e.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),e.currentTarget.style.setProperty("--radix-toast-swipe-end-x","".concat(t,"px")),e.currentTarget.style.setProperty("--radix-toast-swipe-end-y","".concat(r,"px")),l(!1)})})})});N.displayName=j;var[S,k]=x(j,{onClose(){}}),_=n.forwardRef((e,t)=>{let{__scopeToast:r,type:o="foreground",duration:u,open:c,onClose:d,onEscapeKeyDown:p,onPause:y,onResume:v,onSwipeStart:w,onSwipeMove:b,onSwipeCancel:E,onSwipeEnd:x,...C}=e,T=P(j,r),[q,D]=n.useState(null),O=(0,a.e)(t,e=>D(e)),A=n.useRef(null),F=n.useRef(null),Q=u||T.duration,N=n.useRef(0),k=n.useRef(Q),_=n.useRef(0),{onToastAdd:L,onToastRemove:V}=T,K=(0,f.W)(()=>{var e;(null==q?void 0:q.contains(document.activeElement))&&(null===(e=T.viewport)||void 0===e||e.focus()),d()}),H=n.useCallback(e=>{e&&e!==1/0&&(window.clearTimeout(_.current),N.current=new Date().getTime(),_.current=window.setTimeout(K,e))},[K]);n.useEffect(()=>{let e=T.viewport;if(e){let t=()=>{H(k.current),null==v||v()},r=()=>{let e=new Date().getTime()-N.current;k.current=k.current-e,window.clearTimeout(_.current),null==y||y()};return e.addEventListener(R,r),e.addEventListener(M,t),()=>{e.removeEventListener(R,r),e.removeEventListener(M,t)}}},[T.viewport,Q,y,v,H]),n.useEffect(()=>{c&&!T.isClosePausedRef.current&&H(Q)},[c,Q,T.isClosePausedRef,H]),n.useEffect(()=>(L(),()=>V()),[L,V]);let W=n.useMemo(()=>q?function e(t){let r=[];return Array.from(t.childNodes).forEach(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent&&r.push(t.textContent),t.nodeType===t.ELEMENT_NODE){let n=t.ariaHidden||t.hidden||"none"===t.style.display,s=""===t.dataset.radixToastAnnounceExclude;if(!n){if(s){let e=t.dataset.radixToastAnnounceAlt;e&&r.push(e)}else r.push(...e(t))}}}),r}(q):null,[q]);return T.viewport?(0,m.jsxs)(m.Fragment,{children:[W&&(0,m.jsx)(I,{__scopeToast:r,role:"status","aria-live":"foreground"===o?"assertive":"polite","aria-atomic":!0,children:W}),(0,m.jsx)(S,{scope:r,onClose:K,children:s.createPortal((0,m.jsx)(g.ItemSlot,{scope:r,children:(0,m.jsx)(l.fC,{asChild:!0,onEscapeKeyDown:(0,i.M)(p,()=>{T.isFocusedToastEscapeKeyDownRef.current||K(),T.isFocusedToastEscapeKeyDownRef.current=!1}),children:(0,m.jsx)(h.WV.li,{role:"status","aria-live":"off","aria-atomic":!0,tabIndex:0,"data-state":c?"open":"closed","data-swipe-direction":T.swipeDirection,...C,ref:O,style:{userSelect:"none",touchAction:"none",...e.style},onKeyDown:(0,i.M)(e.onKeyDown,e=>{"Escape"!==e.key||(null==p||p(e.nativeEvent),e.nativeEvent.defaultPrevented||(T.isFocusedToastEscapeKeyDownRef.current=!0,K()))}),onPointerDown:(0,i.M)(e.onPointerDown,e=>{0===e.button&&(A.current={x:e.clientX,y:e.clientY})}),onPointerMove:(0,i.M)(e.onPointerMove,e=>{if(!A.current)return;let t=e.clientX-A.current.x,r=e.clientY-A.current.y,n=!!F.current,s=["left","right"].includes(T.swipeDirection),i=["left","up"].includes(T.swipeDirection)?Math.min:Math.max,a=s?i(0,t):0,o=s?0:i(0,r),u="touch"===e.pointerType?10:2,l={x:a,y:o},c={originalEvent:e,delta:l};n?(F.current=l,U("toast.swipeMove",b,c,{discrete:!1})):Y(l,T.swipeDirection,u)?(F.current=l,U("toast.swipeStart",w,c,{discrete:!1}),e.target.setPointerCapture(e.pointerId)):(Math.abs(t)>u||Math.abs(r)>u)&&(A.current=null)}),onPointerUp:(0,i.M)(e.onPointerUp,e=>{let t=F.current,r=e.target;if(r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId),F.current=null,A.current=null,t){let r=e.currentTarget,n={originalEvent:e,delta:t};Y(t,T.swipeDirection,T.swipeThreshold)?U("toast.swipeEnd",x,n,{discrete:!0}):U("toast.swipeCancel",E,n,{discrete:!0}),r.addEventListener("click",e=>e.preventDefault(),{once:!0})}})})})}),T.viewport)})]}):null}),I=e=>{let{__scopeToast:t,children:r,...s}=e,i=P(j,t),[a,o]=n.useState(!1),[u,l]=n.useState(!1);return function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:()=>{},t=(0,f.W)(e);(0,y.b)(()=>{let e=0,r=0;return e=window.requestAnimationFrame(()=>r=window.requestAnimationFrame(t)),()=>{window.cancelAnimationFrame(e),window.cancelAnimationFrame(r)}},[t])}(()=>o(!0)),n.useEffect(()=>{let e=window.setTimeout(()=>l(!0),1e3);return()=>window.clearTimeout(e)},[]),u?null:(0,m.jsx)(c.h,{asChild:!0,children:(0,m.jsx)(v,{...s,children:a&&(0,m.jsxs)(m.Fragment,{children:[i.label," ",r]})})})},L=n.forwardRef((e,t)=>{let{__scopeToast:r,...n}=e;return(0,m.jsx)(h.WV.div,{...n,ref:t})});L.displayName="ToastTitle";var V=n.forwardRef((e,t)=>{let{__scopeToast:r,...n}=e;return(0,m.jsx)(h.WV.div,{...n,ref:t})});V.displayName="ToastDescription";var K="ToastAction",H=n.forwardRef((e,t)=>{let{altText:r,...n}=e;return r.trim()?(0,m.jsx)(X,{altText:r,asChild:!0,children:(0,m.jsx)(Z,{...n,ref:t})}):(console.error("Invalid prop `altText` supplied to `".concat(K,"`. Expected non-empty `string`.")),null)});H.displayName=K;var W="ToastClose",Z=n.forwardRef((e,t)=>{let{__scopeToast:r,...n}=e,s=k(W,r);return(0,m.jsx)(X,{asChild:!0,children:(0,m.jsx)(h.WV.button,{type:"button",...n,ref:t,onClick:(0,i.M)(e.onClick,s.onClose)})})});Z.displayName=W;var X=n.forwardRef((e,t)=>{let{__scopeToast:r,altText:n,...s}=e;return(0,m.jsx)(h.WV.div,{"data-radix-toast-announce-exclude":"","data-radix-toast-announce-alt":n||void 0,...s,ref:t})});function U(e,t,r,n){let{discrete:s}=n,i=r.originalEvent.currentTarget,a=new CustomEvent(e,{bubbles:!0,cancelable:!0,detail:r});t&&i.addEventListener(e,t,{once:!0}),s?(0,h.jH)(i,a):i.dispatchEvent(a)}var Y=function(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=Math.abs(e.x),s=Math.abs(e.y),i=n>s;return"left"===t||"right"===t?i&&n>r:!i&&s>r};function B(e){let t=document.activeElement;return e.some(e=>e===t||(e.focus(),document.activeElement!==t))}var z=q,G=A,J=N,$=L,ee=V,et=H,er=Z},6932:function(e,t,r){"use strict";r.d(t,{S:function(){return y}});var n=r(46070),s=r(26754),i=r(26404),a=r(11741),o=class extends a.l{constructor(e={}){super(),this.config=e,this.#e=new Map}#e;build(e,t,r){let i=t.queryKey,a=t.queryHash??(0,n.Rm)(i,t),o=this.get(a);return o||(o=new s.A({client:e,queryKey:i,queryHash:a,options:e.defaultQueryOptions(t),state:r,defaultOptions:e.getQueryDefaults(i)}),this.add(o)),o}add(e){this.#e.has(e.queryHash)||(this.#e.set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){let t=this.#e.get(e.queryHash);t&&(e.destroy(),t===e&&this.#e.delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){i.V.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return this.#e.get(e)}getAll(){return[...this.#e.values()]}find(e){let t={exact:!0,...e};return this.getAll().find(e=>(0,n._x)(t,e))}findAll(e={}){let t=this.getAll();return Object.keys(e).length>0?t.filter(t=>(0,n._x)(e,t)):t}notify(e){i.V.batch(()=>{this.listeners.forEach(t=>{t(e)})})}onFocus(){i.V.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){i.V.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},u=r(11983),l=class extends a.l{constructor(e={}){super(),this.config=e,this.#t=new Set,this.#r=new Map,this.#n=0}#t;#r;#n;build(e,t,r){let n=new u.m({mutationCache:this,mutationId:++this.#n,options:e.defaultMutationOptions(t),state:r});return this.add(n),n}add(e){this.#t.add(e);let t=c(e);if("string"==typeof t){let r=this.#r.get(t);r?r.push(e):this.#r.set(t,[e])}this.notify({type:"added",mutation:e})}remove(e){if(this.#t.delete(e)){let t=c(e);if("string"==typeof t){let r=this.#r.get(t);if(r){if(r.length>1){let t=r.indexOf(e);-1!==t&&r.splice(t,1)}else r[0]===e&&this.#r.delete(t)}}}this.notify({type:"removed",mutation:e})}canRun(e){let t=c(e);if("string"!=typeof t)return!0;{let r=this.#r.get(t),n=r?.find(e=>"pending"===e.state.status);return!n||n===e}}runNext(e){let t=c(e);if("string"!=typeof t)return Promise.resolve();{let r=this.#r.get(t)?.find(t=>t!==e&&t.state.isPaused);return r?.continue()??Promise.resolve()}}clear(){i.V.batch(()=>{this.#t.forEach(e=>{this.notify({type:"removed",mutation:e})}),this.#t.clear(),this.#r.clear()})}getAll(){return Array.from(this.#t)}find(e){let t={exact:!0,...e};return this.getAll().find(e=>(0,n.X7)(t,e))}findAll(e={}){return this.getAll().filter(t=>(0,n.X7)(e,t))}notify(e){i.V.batch(()=>{this.listeners.forEach(t=>{t(e)})})}resumePausedMutations(){let e=this.getAll().filter(e=>e.state.isPaused);return i.V.batch(()=>Promise.all(e.map(e=>e.continue().catch(n.ZT))))}};function c(e){return e.options.scope?.id}var d=r(61288),h=r(25890);function f(e){return{onFetch:(t,r)=>{let s=t.options,i=t.fetchOptions?.meta?.fetchMore?.direction,a=t.state.data?.pages||[],o=t.state.data?.pageParams||[],u={pages:[],pageParams:[]},l=0,c=async()=>{let r=!1,c=e=>{Object.defineProperty(e,"signal",{enumerable:!0,get:()=>(t.signal.aborted?r=!0:t.signal.addEventListener("abort",()=>{r=!0}),t.signal)})},d=(0,n.cG)(t.options,t.fetchOptions),h=async(e,s,i)=>{if(r)return Promise.reject();if(null==s&&e.pages.length)return Promise.resolve(e);let a={client:t.client,queryKey:t.queryKey,pageParam:s,direction:i?"backward":"forward",meta:t.options.meta};c(a);let o=await d(a),{maxPages:u}=t.options,l=i?n.Ht:n.VX;return{pages:l(e.pages,o,u),pageParams:l(e.pageParams,s,u)}};if(i&&a.length){let e="backward"===i,t={pages:a,pageParams:o},r=(e?function(e,{pages:t,pageParams:r}){return t.length>0?e.getPreviousPageParam?.(t[0],t,r[0],r):void 0}:p)(s,t);u=await h(t,r,e)}else{let t=e??a.length;do{let e=0===l?o[0]??s.initialPageParam:p(s,u);if(l>0&&null==e)break;u=await h(u,e),l++}while(l<t)}return u};t.options.persister?t.fetchFn=()=>t.options.persister?.(c,{client:t.client,queryKey:t.queryKey,meta:t.options.meta,signal:t.signal},r):t.fetchFn=c}}}function p(e,{pages:t,pageParams:r}){let n=t.length-1;return t.length>0?e.getNextPageParam(t[n],t,r[n],r):void 0}var y=class{#s;#i;#a;#o;#u;#l;#c;#d;constructor(e={}){this.#s=e.queryCache||new o,this.#i=e.mutationCache||new l,this.#a=e.defaultOptions||{},this.#o=new Map,this.#u=new Map,this.#l=0}mount(){this.#l++,1===this.#l&&(this.#c=d.j.subscribe(async e=>{e&&(await this.resumePausedMutations(),this.#s.onFocus())}),this.#d=h.N.subscribe(async e=>{e&&(await this.resumePausedMutations(),this.#s.onOnline())}))}unmount(){this.#l--,0===this.#l&&(this.#c?.(),this.#c=void 0,this.#d?.(),this.#d=void 0)}isFetching(e){return this.#s.findAll({...e,fetchStatus:"fetching"}).length}isMutating(e){return this.#i.findAll({...e,status:"pending"}).length}getQueryData(e){let t=this.defaultQueryOptions({queryKey:e});return this.#s.get(t.queryHash)?.state.data}ensureQueryData(e){let t=this.defaultQueryOptions(e),r=this.#s.build(this,t),s=r.state.data;return void 0===s?this.fetchQuery(e):(e.revalidateIfStale&&r.isStaleByTime((0,n.KC)(t.staleTime,r))&&this.prefetchQuery(t),Promise.resolve(s))}getQueriesData(e){return this.#s.findAll(e).map(({queryKey:e,state:t})=>[e,t.data])}setQueryData(e,t,r){let s=this.defaultQueryOptions({queryKey:e}),i=this.#s.get(s.queryHash),a=i?.state.data,o=(0,n.SE)(t,a);if(void 0!==o)return this.#s.build(this,s).setData(o,{...r,manual:!0})}setQueriesData(e,t,r){return i.V.batch(()=>this.#s.findAll(e).map(({queryKey:e})=>[e,this.setQueryData(e,t,r)]))}getQueryState(e){let t=this.defaultQueryOptions({queryKey:e});return this.#s.get(t.queryHash)?.state}removeQueries(e){let t=this.#s;i.V.batch(()=>{t.findAll(e).forEach(e=>{t.remove(e)})})}resetQueries(e,t){let r=this.#s;return i.V.batch(()=>(r.findAll(e).forEach(e=>{e.reset()}),this.refetchQueries({type:"active",...e},t)))}cancelQueries(e,t={}){let r={revert:!0,...t};return Promise.all(i.V.batch(()=>this.#s.findAll(e).map(e=>e.cancel(r)))).then(n.ZT).catch(n.ZT)}invalidateQueries(e,t={}){return i.V.batch(()=>(this.#s.findAll(e).forEach(e=>{e.invalidate()}),e?.refetchType==="none")?Promise.resolve():this.refetchQueries({...e,type:e?.refetchType??e?.type??"active"},t))}refetchQueries(e,t={}){let r={...t,cancelRefetch:t.cancelRefetch??!0};return Promise.all(i.V.batch(()=>this.#s.findAll(e).filter(e=>!e.isDisabled()).map(e=>{let t=e.fetch(void 0,r);return r.throwOnError||(t=t.catch(n.ZT)),"paused"===e.state.fetchStatus?Promise.resolve():t}))).then(n.ZT)}fetchQuery(e){let t=this.defaultQueryOptions(e);void 0===t.retry&&(t.retry=!1);let r=this.#s.build(this,t);return r.isStaleByTime((0,n.KC)(t.staleTime,r))?r.fetch(t):Promise.resolve(r.state.data)}prefetchQuery(e){return this.fetchQuery(e).then(n.ZT).catch(n.ZT)}fetchInfiniteQuery(e){return e.behavior=f(e.pages),this.fetchQuery(e)}prefetchInfiniteQuery(e){return this.fetchInfiniteQuery(e).then(n.ZT).catch(n.ZT)}ensureInfiniteQueryData(e){return e.behavior=f(e.pages),this.ensureQueryData(e)}resumePausedMutations(){return h.N.isOnline()?this.#i.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#s}getMutationCache(){return this.#i}getDefaultOptions(){return this.#a}setDefaultOptions(e){this.#a=e}setQueryDefaults(e,t){this.#o.set((0,n.Ym)(e),{queryKey:e,defaultOptions:t})}getQueryDefaults(e){let t=[...this.#o.values()],r={};return t.forEach(t=>{(0,n.to)(e,t.queryKey)&&Object.assign(r,t.defaultOptions)}),r}setMutationDefaults(e,t){this.#u.set((0,n.Ym)(e),{mutationKey:e,defaultOptions:t})}getMutationDefaults(e){let t=[...this.#u.values()],r={};return t.forEach(t=>{(0,n.to)(e,t.mutationKey)&&Object.assign(r,t.defaultOptions)}),r}defaultQueryOptions(e){if(e._defaulted)return e;let t={...this.#a.queries,...this.getQueryDefaults(e.queryKey),...e,_defaulted:!0};return t.queryHash||(t.queryHash=(0,n.Rm)(t.queryKey,t)),void 0===t.refetchOnReconnect&&(t.refetchOnReconnect="always"!==t.networkMode),void 0===t.throwOnError&&(t.throwOnError=!!t.suspense),!t.networkMode&&t.persister&&(t.networkMode="offlineFirst"),t.queryFn===n.CN&&(t.enabled=!1),t}defaultMutationOptions(e){return e?._defaulted?e:{...this.#a.mutations,...e?.mutationKey&&this.getMutationDefaults(e.mutationKey),...e,_defaulted:!0}}clear(){this.#s.clear(),this.#i.clear()}}}}]);