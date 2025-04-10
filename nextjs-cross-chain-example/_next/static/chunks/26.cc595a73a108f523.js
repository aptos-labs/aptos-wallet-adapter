"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[26],{97026:function(e,t,b){b.r(t),b.d(t,{EvmWormholeCore:function(){return p},ethers_contracts:function(){return f}});var f={};b.r(f),b.d(f,{Implementation__factory:function(){return g}});var n=b(18447),a=b(80769),i=b(29443),c=b(15383),s=b(81434),d=b(9905),r=b(53863);class p{network;chain;provider;contracts;chainId;coreAddress;core;coreIface;constructor(e,t,b,f){this.network=e,this.chain=t,this.provider=b,this.contracts=f,this.chainId=i.X.get(e,t),this.coreIface=g.createInterface();let n=this.contracts.coreBridge;if(!n)throw Error("Core bridge address not found");this.coreAddress=n,this.core=g.connect(n,b)}async getMessageFee(){return await this.core.messageFee.staticCall()}async getGuardianSetIndex(){return Number(await this.core.getCurrentGuardianSetIndex.staticCall())}async getGuardianSet(e){let t=await this.core.getGuardianSet(e);return{index:e,keys:t[0],expiry:t[1]}}static async fromRpc(e,t){let[b,f]=await s.W.chainFromRpc(e),n=t[f];if(n.network!==b)throw Error(`Network mismatch: ${n.network} != ${b}`);return new p(b,f,e,n.contracts)}async *publishMessage(e,t,b,f){let n=new d.V(e).toString(),i=await this.core.publishMessage.populateTransaction(b,t,f);yield this.createUnsignedTx((0,a.Dt)(i,n),"WormholeCore.publishMessage")}async *verifyMessage(e,t){let b=new d.V(e).toString(),f=await this.core.parseAndVerifyVM.populateTransaction((0,n.qC)(t));yield this.createUnsignedTx((0,a.Dt)(f,b),"WormholeCore.verifyMessage")}async parseTransaction(e){let t=await this.provider.getTransactionReceipt(e);return null===t?[]:t.logs.filter(e=>e.address===this.coreAddress).map(e=>{let{topics:t,data:b}=e,f=this.coreIface.parseLog({topics:t.slice(),data:b});if(null===f)return;let n=new d.V(f.args.sender);return{chain:this.chain,emitter:n.toUniversalAddress(),sequence:f.args.sequence}}).filter(n.d6)}async parseMessages(e){let t=await this.provider.getTransactionReceipt(e);if(null===t)throw Error("Could not get transaction receipt");let b=await this.getGuardianSetIndex();return t.logs.filter(e=>e.address===this.coreAddress).map(e=>{let{topics:t,data:f}=e,a=this.coreIface.parseLog({topics:t.slice(),data:f});if(null===a)return null;let i=new d.V(a.args.sender);return(0,n.oN)("Uint8Array",{guardianSet:b,timestamp:0,emitterChain:this.chain,emitterAddress:i.toUniversalAddress(),consistencyLevel:Number(a.args.consistencyLevel),sequence:BigInt(a.args.sequence),nonce:Number(a.args.nonce),signatures:[],payload:c.$v.decode(a.args.payload)})}).filter(e=>!!e)}createUnsignedTx(e,t,b=!1){return new r.z((0,a.rQ)(e,this.chainId),this.network,this.chain,t,b)}}var y=b(92235),u=b(57175),o=b(55340);let l=[{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"previousAdmin",type:"address"},{indexed:!1,internalType:"address",name:"newAdmin",type:"address"}],name:"AdminChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"beacon",type:"address"}],name:"BeaconUpgraded",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"oldContract",type:"address"},{indexed:!0,internalType:"address",name:"newContract",type:"address"}],name:"ContractUpgraded",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint32",name:"index",type:"uint32"}],name:"GuardianSetAdded",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"sender",type:"address"},{indexed:!1,internalType:"uint64",name:"sequence",type:"uint64"},{indexed:!1,internalType:"uint32",name:"nonce",type:"uint32"},{indexed:!1,internalType:"bytes",name:"payload",type:"bytes"},{indexed:!1,internalType:"uint8",name:"consistencyLevel",type:"uint8"}],name:"LogMessagePublished",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"implementation",type:"address"}],name:"Upgraded",type:"event"},{stateMutability:"payable",type:"fallback"},{inputs:[],name:"chainId",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[],name:"evmChainId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getCurrentGuardianSetIndex",outputs:[{internalType:"uint32",name:"",type:"uint32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint32",name:"index",type:"uint32"}],name:"getGuardianSet",outputs:[{components:[{internalType:"address[]",name:"keys",type:"address[]"},{internalType:"uint32",name:"expirationTime",type:"uint32"}],internalType:"struct Structs.GuardianSet",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[],name:"getGuardianSetExpiry",outputs:[{internalType:"uint32",name:"",type:"uint32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"hash",type:"bytes32"}],name:"governanceActionIsConsumed",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"governanceChainId",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[],name:"governanceContract",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[],name:"initialize",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"isFork",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"impl",type:"address"}],name:"isInitialized",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"messageFee",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"emitter",type:"address"}],name:"nextSequence",outputs:[{internalType:"uint64",name:"",type:"uint64"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes",name:"encodedVM",type:"bytes"}],name:"parseAndVerifyVM",outputs:[{components:[{internalType:"uint8",name:"version",type:"uint8"},{internalType:"uint32",name:"timestamp",type:"uint32"},{internalType:"uint32",name:"nonce",type:"uint32"},{internalType:"uint16",name:"emitterChainId",type:"uint16"},{internalType:"bytes32",name:"emitterAddress",type:"bytes32"},{internalType:"uint64",name:"sequence",type:"uint64"},{internalType:"uint8",name:"consistencyLevel",type:"uint8"},{internalType:"bytes",name:"payload",type:"bytes"},{internalType:"uint32",name:"guardianSetIndex",type:"uint32"},{components:[{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"uint8",name:"guardianIndex",type:"uint8"}],internalType:"struct Structs.Signature[]",name:"signatures",type:"tuple[]"},{internalType:"bytes32",name:"hash",type:"bytes32"}],internalType:"struct Structs.VM",name:"vm",type:"tuple"},{internalType:"bool",name:"valid",type:"bool"},{internalType:"string",name:"reason",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes",name:"encodedUpgrade",type:"bytes"}],name:"parseContractUpgrade",outputs:[{components:[{internalType:"bytes32",name:"module",type:"bytes32"},{internalType:"uint8",name:"action",type:"uint8"},{internalType:"uint16",name:"chain",type:"uint16"},{internalType:"address",name:"newContract",type:"address"}],internalType:"struct GovernanceStructs.ContractUpgrade",name:"cu",type:"tuple"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"bytes",name:"encodedUpgrade",type:"bytes"}],name:"parseGuardianSetUpgrade",outputs:[{components:[{internalType:"bytes32",name:"module",type:"bytes32"},{internalType:"uint8",name:"action",type:"uint8"},{internalType:"uint16",name:"chain",type:"uint16"},{components:[{internalType:"address[]",name:"keys",type:"address[]"},{internalType:"uint32",name:"expirationTime",type:"uint32"}],internalType:"struct Structs.GuardianSet",name:"newGuardianSet",type:"tuple"},{internalType:"uint32",name:"newGuardianSetIndex",type:"uint32"}],internalType:"struct GovernanceStructs.GuardianSetUpgrade",name:"gsu",type:"tuple"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"bytes",name:"encodedRecoverChainId",type:"bytes"}],name:"parseRecoverChainId",outputs:[{components:[{internalType:"bytes32",name:"module",type:"bytes32"},{internalType:"uint8",name:"action",type:"uint8"},{internalType:"uint256",name:"evmChainId",type:"uint256"},{internalType:"uint16",name:"newChainId",type:"uint16"}],internalType:"struct GovernanceStructs.RecoverChainId",name:"rci",type:"tuple"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"bytes",name:"encodedSetMessageFee",type:"bytes"}],name:"parseSetMessageFee",outputs:[{components:[{internalType:"bytes32",name:"module",type:"bytes32"},{internalType:"uint8",name:"action",type:"uint8"},{internalType:"uint16",name:"chain",type:"uint16"},{internalType:"uint256",name:"messageFee",type:"uint256"}],internalType:"struct GovernanceStructs.SetMessageFee",name:"smf",type:"tuple"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"bytes",name:"encodedTransferFees",type:"bytes"}],name:"parseTransferFees",outputs:[{components:[{internalType:"bytes32",name:"module",type:"bytes32"},{internalType:"uint8",name:"action",type:"uint8"},{internalType:"uint16",name:"chain",type:"uint16"},{internalType:"uint256",name:"amount",type:"uint256"},{internalType:"bytes32",name:"recipient",type:"bytes32"}],internalType:"struct GovernanceStructs.TransferFees",name:"tf",type:"tuple"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"bytes",name:"encodedVM",type:"bytes"}],name:"parseVM",outputs:[{components:[{internalType:"uint8",name:"version",type:"uint8"},{internalType:"uint32",name:"timestamp",type:"uint32"},{internalType:"uint32",name:"nonce",type:"uint32"},{internalType:"uint16",name:"emitterChainId",type:"uint16"},{internalType:"bytes32",name:"emitterAddress",type:"bytes32"},{internalType:"uint64",name:"sequence",type:"uint64"},{internalType:"uint8",name:"consistencyLevel",type:"uint8"},{internalType:"bytes",name:"payload",type:"bytes"},{internalType:"uint32",name:"guardianSetIndex",type:"uint32"},{components:[{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"uint8",name:"guardianIndex",type:"uint8"}],internalType:"struct Structs.Signature[]",name:"signatures",type:"tuple[]"},{internalType:"bytes32",name:"hash",type:"bytes32"}],internalType:"struct Structs.VM",name:"vm",type:"tuple"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"uint32",name:"nonce",type:"uint32"},{internalType:"bytes",name:"payload",type:"bytes"},{internalType:"uint8",name:"consistencyLevel",type:"uint8"}],name:"publishMessage",outputs:[{internalType:"uint64",name:"sequence",type:"uint64"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256",name:"numGuardians",type:"uint256"}],name:"quorum",outputs:[{internalType:"uint256",name:"numSignaturesRequiredForQuorum",type:"uint256"}],stateMutability:"pure",type:"function"},{inputs:[{internalType:"bytes",name:"_vm",type:"bytes"}],name:"submitContractUpgrade",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes",name:"_vm",type:"bytes"}],name:"submitNewGuardianSet",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes",name:"_vm",type:"bytes"}],name:"submitRecoverChainId",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes",name:"_vm",type:"bytes"}],name:"submitSetMessageFee",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes",name:"_vm",type:"bytes"}],name:"submitTransferFees",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"hash",type:"bytes32"},{components:[{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"uint8",name:"guardianIndex",type:"uint8"}],internalType:"struct Structs.Signature[]",name:"signatures",type:"tuple[]"},{components:[{internalType:"address[]",name:"keys",type:"address[]"},{internalType:"uint32",name:"expirationTime",type:"uint32"}],internalType:"struct Structs.GuardianSet",name:"guardianSet",type:"tuple"}],name:"verifySignatures",outputs:[{internalType:"bool",name:"valid",type:"bool"},{internalType:"string",name:"reason",type:"string"}],stateMutability:"pure",type:"function"},{inputs:[{components:[{internalType:"uint8",name:"version",type:"uint8"},{internalType:"uint32",name:"timestamp",type:"uint32"},{internalType:"uint32",name:"nonce",type:"uint32"},{internalType:"uint16",name:"emitterChainId",type:"uint16"},{internalType:"bytes32",name:"emitterAddress",type:"bytes32"},{internalType:"uint64",name:"sequence",type:"uint64"},{internalType:"uint8",name:"consistencyLevel",type:"uint8"},{internalType:"bytes",name:"payload",type:"bytes"},{internalType:"uint32",name:"guardianSetIndex",type:"uint32"},{components:[{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"uint8",name:"guardianIndex",type:"uint8"}],internalType:"struct Structs.Signature[]",name:"signatures",type:"tuple[]"},{internalType:"bytes32",name:"hash",type:"bytes32"}],internalType:"struct Structs.VM",name:"vm",type:"tuple"}],name:"verifyVM",outputs:[{internalType:"bool",name:"valid",type:"bool"},{internalType:"string",name:"reason",type:"string"}],stateMutability:"view",type:"function"},{stateMutability:"payable",type:"receive"}],m="0x60808060405234610016576130a2908161001c8239f35b600080fdfe60806040526004361015610018575b366120d257612105565b60003560e01c80630319e59c146101e857806304ca84cf146101e3578063178149e7146101de5780631a90a219146101d95780631cfe7951146101d45780632c3c02a4146101cf5780634cf842b5146101ca5780634fdc60fa146101c5578063515f3247146101c05780635cb8cae2146101bb57806364d42b17146101b65780636606b4e0146101b15780638129fc1c146101ac578063875be02a146101a757806393df337e146101a25780639a8a05921461019d578063a0cce1b314610198578063a9e1189314610193578063b172b2221461018e578063b19a437e14610189578063c0fd8bde14610184578063cb4cfea81461017f578063d60b347f1461017a578063e039f22414610175578063eb8d3f1214610170578063f42bc6411461016b578063f8ce560a14610166578063f951975a146101615763fbe3c2cd0361000e576112d5565b61129d565b611277565b611203565b6111dd565b6111bc565b61117d565b611137565b6110d2565b610f96565b610f78565b610f50565b610d51565b610d2f565b610c78565b610b50565b610913565b6107c5565b6107a7565b6106d4565b61068e565b61063f565b6105fc565b61059b565b610577565b610559565b610476565b610409565b610363565b634e487b7160e01b600052604160045260246000fd5b608081019081106001600160401b0382111761021e57604052565b6101ed565b604081019081106001600160401b0382111761021e57604052565b60a081019081106001600160401b0382111761021e57604052565b606081019081106001600160401b0382111761021e57604052565b90601f801991011681019081106001600160401b0382111761021e57604052565b6040519061016082018281106001600160401b0382111761021e57604052565b604051906102c282610223565b565b6001600160401b03811161021e57601f01601f191660200190565b9291926102eb826102c4565b916102f96040519384610274565b829481845281830111610316578281602093846000960137010152565b600080fd5b9080601f8301121561031657816020610336933591016102df565b90565b602060031982011261031657600435906001600160401b038211610316576103369160040161031b565b346103165760a061037b61037636610339565b611dc4565b6080604051918051835260ff602082015116602084015261ffff60408201511660408401526060810151606084015201516080820152f35b906040810191805190604083528151809452606083019360208093019060005b8181106103ec5750505081015163ffffffff1691015290565b82516001600160a01b0316875295840195918401916001016103d3565b346103165761041f61041a36610339565b611b9f565b6040518091602082528051602083015260ff602082015116604083015261ffff604082015116606083015263ffffffff6080610469606084015160a08387015260c08601906103b3565b9201511660a08301520390f35b346103165761048436610339565b600854461461052757610513606061049e6105259361287e565b6104b06104aa8261185b565b906113b0565b61050a6104c060e0830151611e9d565b916104d163436f7265845114611459565b61050461014060408501926104e8468551146115ab565b015160005260056020526040600020600160ff19825416179055565b51612ca6565b015161ffff1690565b61ffff1661ffff196000541617600055565b005b60405162461bcd60e51b815260206004820152600a6024820152696e6f74206120666f726b60b01b6044820152606490fd5b34610316576000366003190112610316576020600754604051908152f35b3461031657600036600319011261031657602063ffffffff60035416604051908152f35b346103165760203660031901126103165760206105c8600435600052600560205260ff6040600020541690565b6040519015158152f35b600435906001600160a01b038216820361031657565b35906001600160a01b038216820361031657565b34610316576020366003190112610316576001600160a01b0361061d6105d2565b16600052600460205260206001600160401b0360406000205416604051908152f35b3461031657608061065761065236610339565b611a0c565b604051908051825260ff602082015116602083015261ffff6040820151166040830152606060018060a01b03910151166060820152f35b346103165760806106a66106a136610339565b611ce1565b6060604051918051835260ff602082015116602084015261ffff604082015116604084015201516060820152f35b34610316576106e236610339565b60085446036107735761076e60606106fc6105259361287e565b6107086104aa8261185b565b61076061014061071b60e0840151611a0c565b9261072c63436f72658551146113e0565b6104e861073e604086015161ffff1690565b61ffff61075861075160005461ffff1690565b61ffff1690565b91161461141d565b01516001600160a01b031690565b61163e565b60405162461bcd60e51b815260206004820152600c60248201526b696e76616c696420666f726b60a01b6044820152606490fd5b34610316576000366003190112610316576020600854604051908152f35b34610316576105256108d96107e16107dc36610339565b61287e565b6107ed6104aa8261185b565b6108cf6107fd60e0830151611b9f565b61080d63436f7265825114611459565b61084b61081f604083015161ffff1690565b61ffff61083261075160005461ffff1690565b911690811490816108f8575b81156108ef575b50611496565b6108a9610140608060608401936108668551515115156114d2565b01946104e8610879875163ffffffff1690565b63ffffffff6108a161089861089360035463ffffffff1690565b611534565b63ffffffff1690565b911614611549565b6108c06108bb60035463ffffffff1690565b612b24565b51825163ffffffff1690612c1b565b5163ffffffff1690565b63ffffffff1663ffffffff196003541617600355565b90501538610845565b905061090d61090960085446141590565b1590565b9061083e565b34610316576000806003193601126109cc577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b03168082526006602052604082205460ff16610991576001600160a01b03166000908152600660205260409020805460ff1916600117905561098e611f42565b80f35b60405162461bcd60e51b8152602060048201526013602482015272185b1c9958591e481a5b9a5d1a585b1a5e9959606a1b6044820152606490fd5b80fd5b6044359060ff8216820361031657565b359060ff8216820361031657565b6004359063ffffffff8216820361031657565b359063ffffffff8216820361031657565b359061ffff8216820361031657565b35906001600160401b038216820361031657565b6001600160401b03811161021e5760051b60200190565b81601f8201121561031657803590610a6282610a34565b92604092610a7284519586610274565b808552602091828087019260071b85010193818511610316578301915b848310610a9f5750505050505090565b60808383031261031657836080918751610ab881610203565b853581528286013583820152610acf8987016109df565b898201526060610ae08188016109df565b90820152815201920191610a8f565b60005b838110610b025750506000910152565b8181015183820152602001610af2565b90602091610b2b81518092818552858086019101610aef565b601f01601f1916010190565b6040906103369392151581528160208201520190610b12565b346103165760031960203682011261031657600435906001600160401b03908183116103165761016090833603011261031657610b8b610295565b90610b98836004016109df565b8252610ba660248401610a00565b6020830152610bb760448401610a00565b6040830152610bc860648401610a11565b606083015260848301356080830152610be360a48401610a20565b60a0830152610bf460c484016109df565b60c083015260e483013581811161031657610c15906004369186010161031b565b60e0830152610c276101048401610a00565b61010083015261012483013590811161031657610c6492610c516101449260043691840101610a4b565b61012084015201356101408201526123f9565b90610c7460405192839283610b37565b0390f35b3461031657610ce2610140610c8f6107dc36610339565b610c9b6104aa8261185b565b6104e8610cab60e0830151611dc4565b610cbb63436f7265825114611459565b604081015161ffff1690600095869586958695869561ffff610832610751895461ffff1690565b6080810151606090610d0c90610d009081906001600160a01b031681565b6001600160a01b031690565b91015190828215610d26575bf115610d215780f35b61159f565b506108fc610d18565b3461031657600036600319011261031657602061ffff60005416604051908152f35b3461031657600319606036820112610316576001600160401b0360243581811161031657610d83903690600401610a4b565b604435928284116103165760409084360301126103165760405191610da783610223565b8360040135908111610316578301923660238501121561031657600484013593610dd085610a34565b90610dde6040519283610274565b85825260209560248784019160051b8301019136831161031657602401905b828210610e26575050506024610c649592610e1a92865201610a00565b9083015260043561268d565b878091610e32846105e8565b815201910190610dfd565b90815180825260208080930193019160005b828110610e5d575050505090565b835180518652808301518684015260408082015160ff90811691880191909152606091820151169086015260809094019392810192600101610e4f565b805160ff1682529060208281015163ffffffff169082015260408281015163ffffffff169082015260608281015161ffff169082015260808201516080820152610ef460a083015160a08301906001600160401b03169052565b60c08281015160ff1690820152610f42610f1d60e08401516101608060e0860152840190610b12565b6101008481015163ffffffff1690840152610120808501519084830390850152610e3d565b916101408091015191015290565b3461031657610c74610f646107dc36610339565b604051918291602083526020830190610e9a565b34610316576000366003190112610316576020600154604051908152f35b606036600319011261031657610faa6109ed565b6001600160401b0360243581811161031657610fca90369060040161031b565b91610fd36109cf565b91600754340361107457336000526004602052806040600020541692600184019482861161106f57610c74957f6eb224fb001ed210e379b335e35efe88672a8ce935d981a6896b27ffdf52a3b293336000526004602052604060002091166001600160401b031982541617905561105260405192839233968885611f06565b0390a26040516001600160401b0390911681529081906020820190565b61151e565b60405162461bcd60e51b815260206004820152600b60248201526a696e76616c69642066656560a81b6044820152606490fd5b6110bd6103369492606083526060830190610e9a565b92151560208201526040818403910152610b12565b34610316576020366003190112610316576001600160401b03600435818111610316573660238201121561031657806004013591821161031657366024838301011161031657610c7491602461112892016121c5565b604093919351938493846110a7565b3461031657608061114f61114a36610339565b611e9d565b61ffff6060604051928051845260ff6020820151166020850152604081015160408501520151166060820152f35b34610316576020366003190112610316576001600160a01b0361119e6105d2565b166000526006602052602060ff604060002054166040519015158152f35b34610316576000366003190112610316576020600854604051904614158152f35b3461031657600036600319011261031657602060035463ffffffff60405191831c168152f35b346103165760606112166107dc36610339565b6112226104aa8261185b565b61126561014061123560e0840151611ce1565b9261124663436f72658551146113e0565b61ffff806040860151169060005416148061126c575b6104e89061141d565b0151600755005b50600854461461125c565b34610316576020366003190112610316576020611295600435612ac1565b604051908152f35b3461031657602036600319011261031657610c746112c16112bc6109ed565b611314565b6040519182916020835260208301906103b3565b3461031657600036600319011261031657602061ffff60005460101c16604051908152f35b6040519061130782610223565b6000602083606081520152565b63ffffffff906113226112fa565b50166000526020600281526040600020906040519161134083610223565b6040518083835491828152019083600052846000209060005b8181106113935750505061033693928261137a611387946001940382610274565b8652015463ffffffff1690565b63ffffffff1690830152565b82546001600160a01b031684529286019260019283019201611359565b156113b85750565b60405162461bcd60e51b8152602060048201529081906113dc906024830190610b12565b0390fd5b156113e757565b60405162461bcd60e51b815260206004820152600e60248201526d496e76616c6964204d6f64756c6560901b6044820152606490fd5b1561142457565b60405162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b21021b430b4b760991b6044820152606490fd5b1561146057565b60405162461bcd60e51b815260206004820152600e60248201526d696e76616c6964204d6f64756c6560901b6044820152606490fd5b1561149d57565b60405162461bcd60e51b815260206004820152600d60248201526c34b73b30b634b21021b430b4b760991b6044820152606490fd5b156114d957565b60405162461bcd60e51b815260206004820152601960248201527f6e657720677561726469616e2073657420697320656d707479000000000000006044820152606490fd5b634e487b7160e01b600052601160045260246000fd5b90600163ffffffff8093160191821161106f57565b1561155057565b60405162461bcd60e51b815260206004820152602160248201527f696e646578206d75737420696e63726561736520696e207374657073206f66206044820152603160f81b6064820152608490fd5b6040513d6000823e3d90fd5b156115b257565b60405162461bcd60e51b815260206004820152601160248201527034b73b30b634b21022ab269021b430b4b760791b6044820152606490fd5b60405190602082018281106001600160401b0382111761021e5760405260008252565b3d15611639573d9061161f826102c4565b9161162d6040519384610274565b82523d6000602084013e565b606090565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc908154813b1561170d577f2e4cc16c100f0b55e2df82ab0b1a7e294aa9cbd01b48fbaf622683fbc0507a499060018060a01b039081841694856bffffffffffffffffffffffff60a01b8316179055611707604051600080968192897fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8480a263204a7f0760e21b6020820190815260048252906116fb81610223565b51915af46104aa61160e565b169180a3565b60405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b6040519061177582610259565b6022825261195d60f21b6040837f6e6f74207369676e65642062792063757272656e7420677561726469616e207360208201520152565b604051906117b982610223565b60168252753bb937b7339033b7bb32b93730b731b29031b430b4b760511b6020830152565b604051906117eb82610223565b601982527f77726f6e6720676f7665726e616e636520636f6e7472616374000000000000006020830152565b6040519061182482610259565b6022825261195960f21b6040837f676f7665726e616e636520616374696f6e20616c726561647920636f6e73756d60208201520152565b611864816123f9565b9015611924575061010081015163ffffffff1663ffffffff61188e61089860035463ffffffff1690565b91160361191857606081015161ffff1661ffff6118b561075160005461ffff9060101c1690565b91160361190c57608081015160015403611900576101406118e6910151600052600560205260ff6040600020541690565b6118f5576001906103366115eb565b600090610336611817565b506000906103366117de565b506000906103366117ac565b50600090610336611768565b600092909150565b6040519061193982610203565b60006060838281528260208201528260408201520152565b906020820180921161106f57565b906001820180921161106f57565b906002820180921161106f57565b906004820180921161106f57565b906014820180921161106f57565b906008820180921161106f57565b90601f820180921161106f57565b9190820180921161106f57565b156119c757565b60405162461bcd60e51b815260206004820152601760248201527f696e76616c696420436f6e7472616374557067726164650000000000000000006044820152606490fd5b90611a1561192c565b91611a1f81613030565b8352611a3e600160ff611a3184612e51565b16806020870152146119c0565b61ffff611a4a82612ee8565b1660408401526043815110611a79576043818101516001600160a01b0316606085015290516102c291146119c0565b60405162461bcd60e51b8152602060048201526015602482015274746f427974657333325f6f75744f66426f756e647360581b6044820152606490fd5b60405190611ac38261023e565b6000608083828152826020820152826040820152611adf6112fa565b60608201520152565b15611aef57565b60405162461bcd60e51b815260206004820152601a60248201527f696e76616c696420477561726469616e536574557067726164650000000000006044820152606490fd5b90611b3e82610a34565b611b4b6040519182610274565b8281528092611b5c601f1991610a34565b0190602036910137565b600019811461106f5760010190565b8051821015611b895760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b90611ba8611ab6565b91611bb281613030565b8352611bdb600260ff611bd4611bc785612e51565b60ff166020880181905290565b1614611ae8565b611bf2611be782612ee8565b61ffff166040850152565b611c0b611bfe82612fac565b63ffffffff166080850152565b611c1481612ebc565b60ff6028911691611c2483611b34565b92611c2d6102b5565b93845260006020850152606086019384526000935b818510611c575750506102c292505114611ae8565b909192611c8e81611c89611c6e611c949488612df5565b611c7a89875151611b75565b6001600160a01b039091169052565b611989565b94611b66565b93929190611c42565b15611ca457565b60405162461bcd60e51b8152602060048201526015602482015274696e76616c6964205365744d65737361676546656560581b6044820152606490fd5b90611cea61192c565b91611cf481613030565b8352611d13600360ff611d0684612e51565b1680602087015214611c9d565b61ffff611d1f82612ee8565b1660408401526043815110611d4457604381816102c293015160608601525114611c9d565b60405162461bcd60e51b8152602060048201526015602482015274746f55696e743235365f6f75744f66426f756e647360581b6044820152606490fd5b15611d8857565b60405162461bcd60e51b8152602060048201526014602482015273696e76616c6964205472616e736665724665657360601b6044820152606490fd5b9060405191611dd28361023e565b60008352602083019060008252604084019060008252606085019160008352611e20600460808801956000875288611e0986613030565b905260ff611e1686612e51565b1680915214611d81565b61ffff611e2c83612ee8565b1690526043815110611d44576102c29260639260438301519052611e4f82613040565b90525114611d81565b15611e5f57565b60405162461bcd60e51b81526020600482015260166024820152751a5b9d985b1a5908149958dbdd995c90da185a5b925960521b6044820152606490fd5b90611ea661192c565b91611eb081613030565b8352611ecf600560ff611ec284612e51565b1680602087015214611e58565b6041815110611d445760438160416102c29301516040860152611eff611ef482612f34565b61ffff166060870152565b5114611e58565b92611f3b9063ffffffff6060946001600160401b0360ff95999899168752166020860152608060408601526080850190610b12565b9416910152565b60085415611f4c57565b61ffff611f5c60005461ffff1690565b1660028103611f7057506102c26001612ca6565b60048103611f8357506102c26038612ca6565b60058103611f9657506102c26089612ca6565b60068103611faa57506102c261a86a612ca6565b60078103611fbe57506102c261a516612ca6565b60098103611fd457506102c2634e454152612ca6565b600a8103611fe757506102c260fa612ca6565b600b8103611ffb57506102c26102ae612ca6565b600c810361200f57506102c2610313612ca6565b600d810361202357506102c2612019612ca6565b600e810361203757506102c261a4ec612ca6565b6010810361204b57506102c2610504612ca6565b6011810361206157506102c2630e9ac0d6612ca6565b6017810361207557506102c261a4b1612ca6565b6018810361208857506102c2600a612ca6565b601903612099576102c26064612ca6565b60405162461bcd60e51b81526020600482015260116024820152702ab735b737bbb71031b430b4b71034b21760791b6044820152606490fd5b60405162461bcd60e51b815260206004820152600b60248201526a1d5b9cdd5c1c1bdc9d195960aa1b6044820152606490fd5b60405162461bcd60e51b815260206004820152602c60248201527f74686520576f726d686f6c6520636f6e747261637420646f6573206e6f74206160448201526b63636570742061737365747360a01b6064820152608490fd5b6040519061016082018281106001600160401b0382111761021e57604052816101406000918281528260208201528260408201528260608201528260808201528260a08201528260c0820152606060e08201528261010082015260606101208201520152565b6107dc906121dd926121d561215f565b5036916102df565b906121e782612325565b9091565b94929060339796949263ffffffff60e01b809260e01b16875260e01b16600486015261ffff60f01b9060f01b166008850152600a8401526001600160401b0360c01b9060c01b16602a83015260ff60f81b9060f81b1660328201526122598251809360208685019101610aef565b010190565b6040519061226b82610223565b601a82527f766d2e6861736820646f65736e2774206d6174636820626f64790000000000006020830152565b604051906122a482610223565b60148252731a5b9d985b1a590819dd585c991a585b881cd95d60621b6020830152565b604051906122d482610223565b601882527f677561726469616e2073657420686173206578706972656400000000000000006020830152565b6040519061230d82610223565b60098252686e6f2071756f72756d60b81b6020830152565b610100810161233b6112bc825163ffffffff1690565b90815151156123eb575163ffffffff1661235d61089860035463ffffffff1690565b63ffffffff809216141590816123ce575b506123c1576101208201805151612386835151612ac1565b116123b35761014061239c93015190519061268d565b90156123ae57506001906103366115eb565b600091565b505050600090610336612300565b50506000906103366122c7565b90506123e1602083015163ffffffff1690565b429116103861236e565b505050600090610336612297565b6101008101906124106112bc835163ffffffff1690565b90612422602082015163ffffffff1690565b604082015163ffffffff169061243d606084015161ffff1690565b9161247a608085015161245a60a08701516001600160401b031690565b60c087015160ff169060e0880151926040519788966020880198896121eb565b039161248e601f1993848101835282610274565b519020906124b860405191826124ac60208201958660209181520190565b03908101835282610274565b5190209261014082019384510361255e578251511561254f575163ffffffff166124ea61089860035463ffffffff1690565b63ffffffff80921614159081612532575b506125245761012001805151612512835151612ac1565b116123b35761239c925190519061268d565b5050506000906103366122c7565b9050612545602084015163ffffffff1690565b42911610386124fb565b50505050600090610336612297565b5050505060009061033661225e565b1561257457565b60405162461bcd60e51b815260206004820152601f60248201527f65637265636f766572206661696c65642077697468207369676e6174757265006044820152606490fd5b156125c057565b60405162461bcd60e51b815260206004820152602360248201527f7369676e617475726520696e6469636573206d75737420626520617363656e64604482015262696e6760e81b6064820152608490fd5b1561261857565b60405162461bcd60e51b815260206004820152601c60248201527f677561726469616e20696e646578206f7574206f6620626f756e6473000000006044820152606490fd5b6040519061266a82610223565b60148252731593481cda59db985d1d5c99481a5b9d985b1a5960621b6020830152565b825151919260009291835b85518110156127b2576126ab8187611b75565b51604060006126bd8284015160ff1690565b8351602080860151945188815260ff93909316838201526040830191909152606082019390935281805260809060015afa15610d215760005160609190612723906001600160a01b03169761271389151561256d565b8415908115612795575b506125b9565b0194612771610d00612764612739895160ff1690565b986127488960ff8c1610612611565b61275e6127588951925160ff1690565b60ff1690565b90611b75565b516001600160a01b031690565b036127845761277f90611b66565b612698565b50505050505060009061033661265d565b90506127a48484015160ff1690565b60ff9182169116113861271d565b5050505050506001906103366115eb565b156127ca57565b60405162461bcd60e51b815260206004820152601760248201527f564d2076657273696f6e20696e636f6d70617469626c650000000000000000006044820152606490fd5b9061281982610a34565b6128266040519182610274565b8281528092612837601f1991610a34565b019060005b82811061284857505050565b60209061285361192c565b8282850101520161283c565b60ff601b9116019060ff821161106f57565b9190820391821161106f57565b9061288761215f565b9161289b61289482612e9c565b60ff168452565b6128b4600160ff6128ad865160ff1690565b16146127c3565b6128ce6128c082612f60565b63ffffffff16610100850152565b6128da61275882612eac565b6006906128e68161280f565b9061012086019182526000915b818310612a205750505090612a086129ec6129ca6129b661299961297f87612929612922612a199a8a51612871565b828a612d69565b602081519101206040516129578161294960208201948560209181520190565b03601f198101835282610274565b5190206101408c015261297a61296d828a612fbc565b63ffffffff1660208d0152565b61197b565b61297a61298c8289612fbc565b63ffffffff1660408c0152565b6129b16129a68288612f44565b61ffff1660608b0152565b61196d565b6129c08186613050565b6080890152611951565b6129e76129d78286612fd8565b6001600160401b031660a0890152565b611997565b612a036129f98285612ecc565b60ff1660c0880152565b61195f565b612a13818351612871565b91612d69565b60e0830152565b909192612ab4612a92612a73612a5784612a03612a40612aba978c612ecc565b6060612a4d8c8b51611b75565b51019060ff169052565b612a61818a613050565b612a6c898851611b75565b5152611951565b612a7d8189613050565b6020612a8a898851611b75565b510152611951565b612a03612aa7612aa2838a612ecc565b61285f565b6040612a4d898851611b75565b93611b66565b91906128f3565b610100811015612aea578060011b908082046002149015171561106f576003610336910461195f565b60405162461bcd60e51b8152602060048201526012602482015271746f6f206d616e7920677561726469616e7360701b6044820152606490fd5b63ffffffff62015180814216019080821161106f576102c29216600052600260205260016040600020019063ffffffff1663ffffffff19825416179055565b9080519081516001600160401b03811161021e5768010000000000000000811161021e578354818555808210612bf2575b506020809301612ba985600052602060002090565b60005b838110612bd7575050505001516001909101805463ffffffff191663ffffffff909216919091179055565b82516001600160a01b03168282015591850191600101612bac565b6000858152826020822092830192015b828110612c10575050612b94565b818155600101612c02565b9081515160005b818110612c485750509063ffffffff6102c2921660005260026020526040600020612b63565b83516001600160a01b0390612c5e908390611b75565b511615612c7357612c6e90611b66565b612c22565b60405162461bcd60e51b815260206004820152600b60248201526a496e76616c6964206b657960a81b6044820152606490fd5b468103612cb257600855565b60405162461bcd60e51b81526020600482015260126024820152711a5b9d985b1a5908195d9b50da185a5b925960721b6044820152606490fd5b15612cf357565b60405162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b6044820152606490fd5b15612d3057565b60405162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b6044820152606490fd5b91612d7e81612d77816119a5565b1015612cec565b612d948351612d8d83856119b3565b1115612d29565b80612dad57505050604051600081526020810160405290565b60405192601f821692831560051b80858701019484860193010101905b808410612de25750508252601f01601f191660405290565b9092835181526020809101930190612dca565b908151601482019081831161106f5710612e1457016020015160601c90565b60405162461bcd60e51b8152602060048201526015602482015274746f416464726573735f6f75744f66426f756e647360581b6044820152606490fd5b6021815110612e61576021015190565b60405162461bcd60e51b8152602060048201526013602482015272746f55696e74385f6f75744f66426f756e647360681b6044820152606490fd5b6001815110612e61576001015190565b6006815110612e61576006015190565b6028815110612e61576028015190565b908151600182019081831161106f5710612e6157016001015190565b6023815110612ef8576023015190565b60405162461bcd60e51b8152602060048201526014602482015273746f55696e7431365f6f75744f66426f756e647360601b6044820152606490fd5b6043815110612ef8576043015190565b908151600282019081831161106f5710612ef857016002015190565b6005815110612f70576005015190565b60405162461bcd60e51b8152602060048201526014602482015273746f55696e7433325f6f75744f66426f756e647360601b6044820152606490fd5b6027815110612f70576027015190565b908151600482019081831161106f5710612f7057016004015190565b908151600882019081831161106f5710612ff457016008015190565b60405162461bcd60e51b8152602060048201526014602482015273746f55696e7436345f6f75744f66426f756e647360601b6044820152606490fd5b6020815110611a79576020015190565b6063815110611a79576063015190565b908151602082019081831161106f5710611a795701602001519056fea2646970667358221220e01f3fc19a7b6f650a08aafb55409b8aa16f0ebf4a5804ec4ce7df76358d349364736f6c63430008130033",T=e=>e.length>1;class g extends y.l{constructor(...e){T(e)?super(...e):super(l,m,e[0])}getDeployTransaction(e){return super.getDeployTransaction(e||{})}deploy(e){return super.deploy(e||{})}connect(e){return super.connect(e)}static bytecode=m;static abi=l;static createInterface(){return new u.vU(l)}static connect(e,t){return new o.CH(e,l,t)}}(0,n.sW)(a.c0,"WormholeCore",p)},53863:function(e,t,b){b.d(t,{z:function(){return f}});class f{transaction;network;chain;description;parallelizable;constructor(e,t,b,f,n=!1){this.transaction=e,this.network=t,this.chain=b,this.description=f,this.parallelizable=n}}}}]);