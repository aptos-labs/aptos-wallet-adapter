"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[870],{55658:function(e,t,n){n.d(t,{Gd:function(){return s},H_:function(){return r},_u:function(){return o},nA:function(){return a}});var i=n(8322);let r=new i.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),a=new i.PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),o=new i.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),s=new i.PublicKey("So11111111111111111111111111111111111111112");new i.PublicKey("9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP")},82322:function(e,t,n){n.d(t,{O:function(){return a}});var i=n(87981),r=n(24921);class a extends i.py{async getTokenAccount(e,t){let{getAssociatedTokenAddress:i}=await Promise.all([n.e(666),n.e(470)]).then(n.bind(n,61443)),a=new r.W(t).unwrap(),o=new r.W(e).unwrap(),s=await i(a,o);return{chain:this.chain,address:new r.W(s.toString())}}}},39682:function(e,t,n){n.d(t,{d:function(){return p}});var i=n(87981),r=n(12975),a=n(8224),o=n(52131),s=n(63014),c=n(38032),l=n(82322),u=n(55658),h=n(8322),d=n(24921),m=n(29377);class p extends i.X2{static _platform=m.c0;constructor(e,t){super(e,t??(0,r.X5)(e,p._platform))}getRpc(e,t={commitment:"confirmed",disableRetryOnRateLimit:!0}){if(e in this.config)return new h.Connection(this.config[e].rpc,t);throw Error("No configuration available for chain: "+e)}getChain(e,t){if(e in this.config)return new l.O(e,this,t);throw Error("No configuration available for chain: "+e)}static nativeTokenId(e,t){if(!p.isSupportedChain(t))throw Error(`invalid chain: ${t}`);return a.D.chainAddress(t,d.B)}static isNativeTokenId(e,t,n){return!!this.isSupportedChain(t)&&n.chain===t&&this.nativeTokenId(e,t)==n}static isSupportedChain(e){return(0,o.fm)(e)===p._platform}static async getDecimals(e,t,n){if((0,i.tY)(n))return s.K(p._platform);let r=await t.getParsedAccountInfo(new d.W(n).unwrap());if(!r||!r.value)throw Error("could not fetch token details");let{decimals:a}=r.value.data.parsed.info;return a}static async getBalance(e,t,n,r){let a=new h.PublicKey(n);if((0,i.tY)(r))return BigInt(await t.getBalance(a));let o=await t.getTokenAccountsByOwner(a,{mint:new d.W(r).unwrap()}),s=o.value.length>0?o.value[0].pubkey:a;return BigInt((await t.getTokenAccountBalance(s)).value.amount)}static async getBalances(e,t,n,r){let a;r.includes("native")&&(a=BigInt(await t.getBalance(new h.PublicKey(n))));let o=(await Promise.all([u.H_,u.nA].map(e=>new h.PublicKey(e)).map(e=>t.getParsedTokenAccountsByOwner(new h.PublicKey(n),{programId:e})))).reduce((e,t)=>e.concat(t.value),[]);return r.map(e=>{if((0,i.tY)(e))return{native:a};let t=new d.W(e).toString(),n=o.find(t=>t?.account.data.parsed?.info?.mint===e.toString())?.account.data.parsed?.info?.tokenAmount?.amount;return n?{[t]:BigInt(n)}:{[t]:null}}).reduce((e,t)=>Object.assign(e,t),{})}static async sendWait(e,t,n,i){let r=await Promise.all(n.map(e=>this.sendTxWithRetry(t,e,i))),a=r.map(e=>e.signature),o=r.filter(e=>e.response.value.err).map(e=>e.response.value.err);if(o.length>0)throw Error(`Failed to confirm transaction: ${o}`);return a}static async sendTxWithRetry(e,t,n={},i=5e3){let r=n.preflightCommitment??e.commitment,a=await e.sendRawTransaction(t,{...n,skipPreflight:!1,maxRetries:0,preflightCommitment:r}),{blockhash:o,lastValidBlockHeight:s}=await e.getLatestBlockhash(),c=e.confirmTransaction({signature:a,blockhash:o,lastValidBlockHeight:s},r),l=null;for(;!l&&!(l=await Promise.race([c,new Promise(e=>setTimeout(()=>{e(null)},i))]));)await e.sendRawTransaction(t,{...n,skipPreflight:!0,maxRetries:0,preflightCommitment:r});return{signature:a,response:l}}static async latestBlock(e,t){return e.getLatestBlockhash(t??e.commitment)}static async getLatestBlock(e){return await e.getSlot()}static async getLatestFinalizedBlock(e){let{lastValidBlockHeight:t}=await this.latestBlock(e,"finalized");return t}static chainFromChainId(e){let t=c.I(p._platform,e);if(!t)throw Error(`No matching genesis hash to determine network and chain: ${e}`);let[n,i]=t;return[n,i]}static async chainFromRpc(e){try{let t=await e.getGenesisHash();return p.chainFromChainId(t)}catch(t){if(e.rpcEndpoint.includes("http://127")||e.rpcEndpoint.includes("http://localhost")||"http://solana-devnet:8899"===e.rpcEndpoint)return["Devnet","Solana"];throw t}}}},34706:function(e,t,n){n.d(t,{D:function(){return i},W:function(){return r}});class i{transaction;network;chain;description;parallelizable;constructor(e,t,n,i,r=!1){this.transaction=e,this.network=t,this.chain=n,this.description=i,this.parallelizable=r}}function r(e){return void 0!==e.signatures&&void 0!==e.message}},69870:function(e,t,n){n.r(t),n.d(t,{default:function(){return y}});var i=n(12975),r=n(24921),a=n(39682),o=n(8322),s=n(82568),c=n(34706);async function l(e,t,n){let[i,r]=await a.d.chainFromRpc(e),c="string"==typeof t?o.Keypair.fromSecretKey(s.O.decode(t)):t;if(n?.priorityFee&&n.priorityFee.percentile&&n.priorityFee.percentile>1)throw Error("priorityFeePercentile must be a number between 0 and 1");return new u(e,r,c,n?.debug??!1,n?.priorityFee??{},n?.retries??5,n?.sendOpts)}n(95697).Buffer;class u{_rpc;_chain;_keypair;_debug;_priorityFee;_maxResubmits;_sendOpts;constructor(e,t,n,i=!1,r,a=5,o){this._rpc=e,this._chain=t,this._keypair=n,this._debug=i,this._priorityFee=r,this._maxResubmits=a,this._sendOpts=o,this._sendOpts=this._sendOpts??{preflightCommitment:this._rpc.commitment}}chain(){return this._chain}address(){return this._keypair.publicKey.toBase58()}retryable(e){if(e instanceof o.TransactionExpiredBlockheightExceededError)return!0;if(!(e instanceof o.SendTransactionError)||!e.message.includes("Transaction simulation failed"))return!1;if(e.message.includes("Blockhash not found"))return!0;let t=e.logs?.find(e=>e.startsWith("Program log: Error: "));return!!t&&!!(t.includes("Not enough bytes")||t.includes("Unexpected length of input"))}async signAndSend(e){let{blockhash:t,lastValidBlockHeight:n}=await a.d.latestBlock(this._rpc),i=[];for(let r of e){let e;let{description:l,transaction:{transaction:u,signers:d}}=r;this._debug&&console.log(`Signing: ${l} for ${this.address()}`),this._priorityFee?.percentile&&this._priorityFee.percentile>0&&(e=await h(this._rpc,u,this._priorityFee.percentile,this._priorityFee.percentileMultiple,this._priorityFee.min,this._priorityFee.max)),this._debug&&function(e){if((0,c.W)(e)){console.log(e.signatures);let t=e.message,n=t.getAccountKeys();t.compiledInstructions.forEach(e=>{console.log("Program",n.get(e.programIdIndex).toBase58()),console.log("Data: ",s.$v.encode(e.data)),console.log("Keys: ",e.accountKeyIndexes.map(e=>[e,n.get(e).toBase58()]))})}else console.log(e.signatures),console.log(e.feePayer),e.instructions.forEach(e=>{console.log("Program",e.programId.toBase58()),console.log("Data: ",e.data.toString("hex")),console.log("Keys: ",e.keys.map(e=>[e,e.pubkey.toBase58()]))})}(u);for(let r=0;r<this._maxResubmits;r++)try{if((0,c.W)(u)){if(e&&0===r){let t=o.TransactionMessage.decompile(u.message);t.instructions.push(...e),u.message=t.compileToV0Message()}u.message.recentBlockhash=t,u.sign([this._keypair,...d??[]])}else e&&0===r&&u.add(...e),u.recentBlockhash=t,u.lastValidBlockHeight=n,u.partialSign(this._keypair,...d??[]);this._debug&&console.log("Submitting transactions ");let{signature:s}=await a.d.sendTxWithRetry(this._rpc,u.serialize(),this._sendOpts);i.push(s);break}catch(o){if(r===this._maxResubmits-1||!this.retryable(o))throw o;this._debug&&console.log(`Failed to send transaction on attempt ${r}, retrying: `,o);let{blockhash:e,lastValidBlockHeight:i}=await a.d.latestBlock(this._rpc);n=i,t=e}}this._debug&&console.log("Waiting for confirmation for: ",i);let r=(await Promise.all(i.map(async e=>{try{return await this._rpc.confirmTransaction({signature:e,blockhash:t,lastValidBlockHeight:n},this._rpc.commitment)}catch(e){throw console.error("Failed to confirm transaction: ",e),e}}))).filter(e=>e.value.err).map(e=>e.value.err);if(r.length>0)throw Error(`Failed to confirm transaction: ${r}`);return i}}async function h(e,t,n=.5,i=1,r=1,a=1e8){let[s,c]=await Promise.all([d(e,t),p(e,t,n,i,r,a)]);return[o.ComputeBudgetProgram.setComputeUnitLimit({units:s}),o.ComputeBudgetProgram.setComputeUnitPrice({microLamports:c})]}async function d(e,t){let n=25e4;try{let i=await ((0,c.W)(t),e.simulateTransaction(t));i.value.err&&console.error(`Error simulating Solana transaction: ${i.value.err}`),i?.value?.unitsConsumed&&(n=Math.round(1.2*i.value.unitsConsumed))}catch(e){console.error(`Failed to calculate compute unit limit for Solana transaction: ${e}`)}return n}async function m(e,t){if(!(0,c.W)(t))return t.instructions.flatMap(e=>e.keys).map(e=>e.isWritable?e.pubkey:null).filter(Boolean);{let n=(await Promise.all(t.message.addressTableLookups.map(t=>e.getAddressLookupTable(t.accountKey)))).map(e=>e.value).filter(e=>null!==e),i=t.message,r=i.getAccountKeys({addressLookupTableAccounts:n??void 0});return i.compiledInstructions.flatMap(e=>e.accountKeyIndexes).map(e=>i.isAccountWritable(e)?r.get(e):null).filter(Boolean)}}async function p(e,t,n=.5,i=1,r=1,a=1e8){let o=r,s=await m(e,t);try{let t=await e.getRecentPrioritizationFees({lockedWritableAccounts:s});if(t){let e=t.map(e=>e.prioritizationFee).sort((e,t)=>e-t),r=Math.ceil(e.length*n);if(e.length>r){let t=e[r];i>0&&(t*=i),o=Math.max(o,t)}}}catch(e){console.error("Error fetching Solana recent fees",e)}return Math.min(Math.max(o,r),a)}var g=n(82322),f=n(29377),y={Address:r.W,Platform:a.d,getSigner:l,protocols:{WormholeCore:()=>Promise.all([n.e(34),n.e(573),n.e(443),n.e(219)]).then(n.bind(n,51219)),TokenBridge:()=>Promise.all([n.e(34),n.e(573),n.e(666),n.e(443),n.e(219),n.e(20)]).then(n.bind(n,73020)),CircleBridge:()=>Promise.all([n.e(34),n.e(573),n.e(666),n.e(443),n.e(715)]).then(n.bind(n,99715))},getChain:(e,t,n)=>new g.O(t,new a.d(e,(0,i.C_)(e,f.c0,{[t]:n})))}}}]);