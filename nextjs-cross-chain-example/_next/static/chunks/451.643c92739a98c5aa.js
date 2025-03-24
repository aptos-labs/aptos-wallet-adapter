"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[451],{44983:function(t,n,e){e.d(n,{r:function(){return i}});var a=e(87981);class i extends a.py{}},56178:function(t,n,e){e.d(n,{O:function(){return f}});var a=e(87981),i=e(12975),r=e(8224),s=e(52131),c=e(63014),o=e(38032),h=e(20803),u=e(44983),l=e(7487),d=e(18870),g=e(68720);class f extends a.X2{static _platform=l.c0;constructor(t,n){super(t,n??(0,i.X5)(t,f._platform))}getRpc(t){if(t in this.config){let n="Mainnet"===this.network?h.ZcK.MAINNET:h.ZcK.TESTNET,e=new h.ScN({fullnode:this.config[t].rpc,network:n});return new h.gZG(e)}throw Error("No configuration available for chain: "+t)}getChain(t,n){if(t in this.config)return new u.r(t,this);throw Error("No configuration available for chain: "+t)}static nativeTokenId(t,n){if(!this.isSupportedChain(n))throw Error(`invalid chain: ${n}`);return r.D.tokenId(n,g.E)}static isNativeTokenId(t,n,e){return!!this.isSupportedChain(n)&&e.chain===n&&this.nativeTokenId(t,n)==e}static isSupportedChain(t){return(0,s.fm)(t)===f._platform}static async getDecimals(t,n,e){if((0,a.tY)(e)||e===g.E)return c.K(f._platform);let i=e.toString();return(await n.getFungibleAssetMetadataByAssetType({assetType:i})).decimals}static async getBalance(t,n,e,i){let r=(0,a.tY)(i)?g.E:i.toString();try{let t=await n.getCurrentFungibleAssetBalances({options:{where:{owner_address:{_eq:e},asset_type:{_eq:r}}}});return t[0]?.amount??null}catch(t){if(404===t.status)return null;throw t}}static async getBalances(t,n,e,i){return(await Promise.all(i.map(async i=>{let r=await this.getBalance(t,n,e,i);return{[(0,a.tY)(i)?"native":new d.fy(i).toString()]:r}}))).reduce((t,n)=>Object.assign(t,n),{})}static async sendWait(t,n,e){let a=[];for(let t of e){let e=await n.transaction.submit.simple(t.transaction),i=await n.waitForTransaction({transactionHash:e.hash});a.push(i.hash)}return a}static async getLatestBlock(t){return Number((await t.getLedgerInfo()).block_height)}static async getLatestFinalizedBlock(t){return Number((await t.getLedgerInfo()).block_height)}static chainFromChainId(t){let n=o.I(f._platform,BigInt(t));if(!n)throw Error(`No matching chainId to determine network and chain: ${t}`);let[e,a]=n;return[e,a]}static async chainFromRpc(t){let n=await t.getLedgerInfo();return this.chainFromChainId(n.chain_id.toString())}}},9451:function(t,n,e){e.r(n),e.d(n,{default:function(){return d}});var a=e(18870),i=e(56178),r=e(82568),s=e(20803);async function c(t,n){let[e,a]=await i.O.chainFromRpc(t);return new o(a,s.mRj.fromPrivateKey({privateKey:new s.qN7(r.$v.decode(n))}),t)}class o{_chain;_account;_rpc;_debug;constructor(t,n,e,a){this._chain=t,this._account=n,this._rpc=e,this._debug=a}chain(){return this._chain}address(){return this._account.accountAddress.toString()}async signAndSend(t){let n=[];for(let e of t){let{description:t,transaction:a}=e;this._debug&&console.log(`Signing: ${t} for ${this.address()}`);let i=await this._rpc.transaction.build.simple({sender:this._account.accountAddress,data:a}),{hash:r}=await this._simSignSend(i);n.push(r)}return n}async _simSignSend(t){return await this._rpc.transaction.simulate.simple({signerPublicKey:this._account.publicKey,transaction:t}).then(t=>t.forEach(t=>{if(!t.success)throw Error(`Transaction failed: ${t.vm_status}
${JSON.stringify(t,null,2)}`)})),this._rpc.signAndSubmitTransaction({signer:this._account,transaction:t}).then(t=>this._rpc.waitForTransaction({transactionHash:t.hash}))}}var h=e(44983),u=e(7487),l=e(12975),d={Address:a.fy,Platform:i.O,getSigner:c,protocols:{WormholeCore:()=>e.e(87).then(e.bind(e,79087)),TokenBridge:()=>e.e(296).then(e.bind(e,94296)),CircleBridge:()=>e.e(873).then(e.bind(e,19873))},getChain:(t,n,e)=>new h.r(n,new i.O(t,(0,l.C_)(t,u.c0,{[n]:e})))}}}]);