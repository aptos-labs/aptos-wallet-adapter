"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[443],{62887:function(e,t,r){var n=r(95697).Buffer,o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.map=t.array=t.rustEnum=t.str=t.vecU8=t.tagged=t.vec=t.bool=t.option=t.publicKey=t.i256=t.u256=t.i128=t.u128=t.i64=t.u64=t.struct=t.f64=t.f32=t.i32=t.u32=t.i16=t.u16=t.i8=t.u8=void 0;let i=r(40121),s=r(8322),a=o(r(22852));var u=r(40121);Object.defineProperty(t,"u8",{enumerable:!0,get:function(){return u.u8}}),Object.defineProperty(t,"i8",{enumerable:!0,get:function(){return u.s8}}),Object.defineProperty(t,"u16",{enumerable:!0,get:function(){return u.u16}}),Object.defineProperty(t,"i16",{enumerable:!0,get:function(){return u.s16}}),Object.defineProperty(t,"u32",{enumerable:!0,get:function(){return u.u32}}),Object.defineProperty(t,"i32",{enumerable:!0,get:function(){return u.s32}}),Object.defineProperty(t,"f32",{enumerable:!0,get:function(){return u.f32}}),Object.defineProperty(t,"f64",{enumerable:!0,get:function(){return u.f64}}),Object.defineProperty(t,"struct",{enumerable:!0,get:function(){return u.struct}});class c extends i.Layout{constructor(e,t,r){super(e,r),this.blob=(0,i.blob)(e),this.signed=t}decode(e,t=0){let r=new a.default(this.blob.decode(e,t),10,"le");return this.signed?r.fromTwos(8*this.span).clone():r}encode(e,t,r=0){return this.signed&&(e=e.toTwos(8*this.span)),this.blob.encode(e.toArrayLike(n,"le",this.span),t,r)}}function d(e){return new c(8,!1,e)}t.u64=d,t.i64=function(e){return new c(8,!0,e)},t.u128=function(e){return new c(16,!1,e)},t.i128=function(e){return new c(16,!0,e)},t.u256=function(e){return new c(32,!1,e)},t.i256=function(e){return new c(32,!0,e)};class l extends i.Layout{constructor(e,t,r,n){super(e.span,n),this.layout=e,this.decoder=t,this.encoder=r}decode(e,t){return this.decoder(this.layout.decode(e,t))}encode(e,t,r){return this.layout.encode(this.encoder(e),t,r)}getSpan(e,t){return this.layout.getSpan(e,t)}}t.publicKey=function(e){return new l((0,i.blob)(32),e=>new s.PublicKey(e),e=>e.toBuffer(),e)};class p extends i.Layout{constructor(e,t){super(-1,t),this.layout=e,this.discriminator=(0,i.u8)()}encode(e,t,r=0){return null==e?this.discriminator.encode(0,t,r):(this.discriminator.encode(1,t,r),this.layout.encode(e,t,r+1)+1)}decode(e,t=0){let r=this.discriminator.decode(e,t);if(0===r)return null;if(1===r)return this.layout.decode(e,t+1);throw Error("Invalid option "+this.property)}getSpan(e,t=0){let r=this.discriminator.decode(e,t);if(0===r)return 1;if(1===r)return this.layout.getSpan(e,t+1)+1;throw Error("Invalid option "+this.property)}}function h(e){if(0===e)return!1;if(1===e)return!0;throw Error("Invalid bool: "+e)}function f(e){return e?1:0}function y(e){let t=(0,i.u32)("length");return new l((0,i.struct)([t,(0,i.blob)((0,i.offset)(t,-t.span),"data")]),({data:e})=>e,e=>({data:e}),e)}t.option=function(e,t){return new p(e,t)},t.bool=function(e){return new l((0,i.u8)(),h,f,e)},t.vec=function(e,t){let r=(0,i.u32)("length");return new l((0,i.struct)([r,(0,i.seq)(e,(0,i.offset)(r,-r.span),"values")]),({values:e})=>e,e=>({values:e}),t)},t.tagged=function(e,t,r){return new l((0,i.struct)([d("tag"),t.replicate("data")]),function({tag:t,data:r}){if(!t.eq(e))throw Error("Invalid tag, expected: "+e.toString("hex")+", got: "+t.toString("hex"));return r},t=>({tag:e,data:t}),r)},t.vecU8=y,t.str=function(e){return new l(y(),e=>e.toString("utf-8"),e=>n.from(e,"utf-8"),e)},t.rustEnum=function(e,t,r){let n=(0,i.union)(null!=r?r:(0,i.u8)(),t);return e.forEach((e,t)=>n.addVariant(t,e,e.property)),n},t.array=function(e,t,r){return new l((0,i.struct)([(0,i.seq)(e,t,"values")]),({values:e})=>e,e=>({values:e}),r)};class g extends i.Layout{constructor(e,t,r){super(e.span+t.span,r),this.keyLayout=e,this.valueLayout=t}decode(e,t){return t=t||0,[this.keyLayout.decode(e,t),this.valueLayout.decode(e,t+this.keyLayout.getSpan(e,t))]}encode(e,t,r){r=r||0;let n=this.keyLayout.encode(e[0],t,r),o=this.valueLayout.encode(e[1],t,r+n);return n+o}getSpan(e,t){return this.keyLayout.getSpan(e,t)+this.valueLayout.getSpan(e,t)}}t.map=function(e,t,r){let n=(0,i.u32)("length");return new l((0,i.struct)([n,(0,i.seq)(new g(e,t),(0,i.offset)(n,-n.span),"values")]),({values:e})=>new Map(e),e=>({values:Array.from(e.entries())}),r)}},40121:function(e,t,r){var n=r(95697).Buffer;class o{constructor(e,t){if(!Number.isInteger(e))throw TypeError("span must be an integer");this.span=e,this.property=t}makeDestinationObject(){return{}}decode(e,t){throw Error("Layout is abstract")}encode(e,t,r){throw Error("Layout is abstract")}getSpan(e,t){if(0>this.span)throw RangeError("indeterminate span");return this.span}replicate(e){let t=Object.create(this.constructor.prototype);return Object.assign(t,this),t.property=e,t}fromArray(e){}}function i(e,t){return t.property?e+"["+t.property+"]":e}t.Layout=o,t.nameWithProperty=i,t.bindConstructorLayout=function(e,t){if("function"!=typeof e)throw TypeError("Class must be constructor");if(e.hasOwnProperty("layout_"))throw Error("Class is already bound to a layout");if(!(t&&t instanceof o))throw TypeError("layout must be a Layout");if(t.hasOwnProperty("boundConstructor_"))throw Error("layout is already bound to a constructor");e.layout_=t,t.boundConstructor_=e,t.makeDestinationObject=()=>new e,Object.defineProperty(e.prototype,"encode",{value:function(e,r){return t.encode(this,e,r)},writable:!0}),Object.defineProperty(e,"decode",{value:function(e,r){return t.decode(e,r)},writable:!0})};class s extends o{isCount(){throw Error("ExternalLayout is abstract")}}class a extends s{constructor(e,t){if(void 0===e&&(e=1),!Number.isInteger(e)||0>=e)throw TypeError("elementSpan must be a (positive) integer");super(-1,t),this.elementSpan=e}isCount(){return!0}decode(e,t){return void 0===t&&(t=0),Math.floor((e.length-t)/this.elementSpan)}encode(e,t,r){return 0}}class u extends s{constructor(e,t,r){if(!(e instanceof o))throw TypeError("layout must be a Layout");if(void 0===t)t=0;else if(!Number.isInteger(t))throw TypeError("offset must be integer or undefined");super(e.span,r||e.property),this.layout=e,this.offset=t}isCount(){return this.layout instanceof c||this.layout instanceof d}decode(e,t){return void 0===t&&(t=0),this.layout.decode(e,t+this.offset)}encode(e,t,r){return void 0===r&&(r=0),this.layout.encode(e,t,r+this.offset)}}class c extends o{constructor(e,t){if(super(e,t),6<this.span)throw RangeError("span must not exceed 6 bytes")}decode(e,t){return void 0===t&&(t=0),e.readUIntLE(t,this.span)}encode(e,t,r){return void 0===r&&(r=0),t.writeUIntLE(e,r,this.span),this.span}}class d extends o{constructor(e,t){if(super(e,t),6<this.span)throw RangeError("span must not exceed 6 bytes")}decode(e,t){return void 0===t&&(t=0),e.readUIntBE(t,this.span)}encode(e,t,r){return void 0===r&&(r=0),t.writeUIntBE(e,r,this.span),this.span}}class l extends o{constructor(e,t){if(super(e,t),6<this.span)throw RangeError("span must not exceed 6 bytes")}decode(e,t){return void 0===t&&(t=0),e.readIntLE(t,this.span)}encode(e,t,r){return void 0===r&&(r=0),t.writeIntLE(e,r,this.span),this.span}}class p extends o{constructor(e,t){if(super(e,t),6<this.span)throw RangeError("span must not exceed 6 bytes")}decode(e,t){return void 0===t&&(t=0),e.readIntBE(t,this.span)}encode(e,t,r){return void 0===r&&(r=0),t.writeIntBE(e,r,this.span),this.span}}function h(e){let t=Math.floor(e/4294967296);return{hi32:t,lo32:e-4294967296*t}}function f(e,t){return 4294967296*e+t}class y extends o{constructor(e){super(8,e)}decode(e,t){void 0===t&&(t=0);let r=e.readUInt32LE(t);return f(e.readUInt32LE(t+4),r)}encode(e,t,r){void 0===r&&(r=0);let n=h(e);return t.writeUInt32LE(n.lo32,r),t.writeUInt32LE(n.hi32,r+4),8}}class g extends o{constructor(e){super(8,e)}decode(e,t){return void 0===t&&(t=0),f(e.readUInt32BE(t),e.readUInt32BE(t+4))}encode(e,t,r){void 0===r&&(r=0);let n=h(e);return t.writeUInt32BE(n.hi32,r),t.writeUInt32BE(n.lo32,r+4),8}}class w extends o{constructor(e){super(8,e)}decode(e,t){void 0===t&&(t=0);let r=e.readUInt32LE(t);return f(e.readInt32LE(t+4),r)}encode(e,t,r){void 0===r&&(r=0);let n=h(e);return t.writeUInt32LE(n.lo32,r),t.writeInt32LE(n.hi32,r+4),8}}class b extends o{constructor(e){super(8,e)}decode(e,t){return void 0===t&&(t=0),f(e.readInt32BE(t),e.readUInt32BE(t+4))}encode(e,t,r){void 0===r&&(r=0);let n=h(e);return t.writeInt32BE(n.hi32,r),t.writeUInt32BE(n.lo32,r+4),8}}class m extends o{constructor(e){super(4,e)}decode(e,t){return void 0===t&&(t=0),e.readFloatLE(t)}encode(e,t,r){return void 0===r&&(r=0),t.writeFloatLE(e,r),4}}class v extends o{constructor(e){super(4,e)}decode(e,t){return void 0===t&&(t=0),e.readFloatBE(t)}encode(e,t,r){return void 0===r&&(r=0),t.writeFloatBE(e,r),4}}class E extends o{constructor(e){super(8,e)}decode(e,t){return void 0===t&&(t=0),e.readDoubleLE(t)}encode(e,t,r){return void 0===r&&(r=0),t.writeDoubleLE(e,r),8}}class x extends o{constructor(e){super(8,e)}decode(e,t){return void 0===t&&(t=0),e.readDoubleBE(t)}encode(e,t,r){return void 0===r&&(r=0),t.writeDoubleBE(e,r),8}}class L extends o{constructor(e,t,r){if(!(e instanceof o))throw TypeError("elementLayout must be a Layout");if(!(t instanceof s&&t.isCount()||Number.isInteger(t)&&0<=t))throw TypeError("count must be non-negative integer or an unsigned integer ExternalLayout");let n=-1;t instanceof s||!(0<e.span)||(n=t*e.span),super(n,r),this.elementLayout=e,this.count=t}getSpan(e,t){if(0<=this.span)return this.span;void 0===t&&(t=0);let r=0,n=this.count;if(n instanceof s&&(n=n.decode(e,t)),0<this.elementLayout.span)r=n*this.elementLayout.span;else{let o=0;for(;o<n;)r+=this.elementLayout.getSpan(e,t+r),++o}return r}decode(e,t){void 0===t&&(t=0);let r=[],n=0,o=this.count;for(o instanceof s&&(o=o.decode(e,t));n<o;)r.push(this.elementLayout.decode(e,t)),t+=this.elementLayout.getSpan(e,t),n+=1;return r}encode(e,t,r){void 0===r&&(r=0);let n=this.elementLayout,o=e.reduce((e,o)=>e+n.encode(o,t,r+e),0);return this.count instanceof s&&this.count.encode(e.length,t,r),o}}class S extends o{constructor(e,t,r){if(!(Array.isArray(e)&&e.reduce((e,t)=>e&&t instanceof o,!0)))throw TypeError("fields must be array of Layout instances");for(let n of("boolean"==typeof t&&void 0===r&&(r=t,t=void 0),e))if(0>n.span&&void 0===n.property)throw Error("fields cannot contain unnamed variable-length layout");let n=-1;try{n=e.reduce((e,t)=>e+t.getSpan(),0)}catch(e){}super(n,t),this.fields=e,this.decodePrefixes=!!r}getSpan(e,t){if(0<=this.span)return this.span;void 0===t&&(t=0);let r=0;try{r=this.fields.reduce((r,n)=>{let o=n.getSpan(e,t);return t+=o,r+o},0)}catch(e){throw RangeError("indeterminate span")}return r}decode(e,t){void 0===t&&(t=0);let r=this.makeDestinationObject();for(let n of this.fields)if(void 0!==n.property&&(r[n.property]=n.decode(e,t)),t+=n.getSpan(e,t),this.decodePrefixes&&e.length===t)break;return r}encode(e,t,r){void 0===r&&(r=0);let n=r,o=0,i=0;for(let n of this.fields){let s=n.span;if(i=0<s?s:0,void 0!==n.property){let o=e[n.property];void 0!==o&&(i=n.encode(o,t,r),0>s&&(s=n.getSpan(t,r)))}o=r,r+=s}return o+i-n}fromArray(e){let t=this.makeDestinationObject();for(let r of this.fields)void 0!==r.property&&0<e.length&&(t[r.property]=e.shift());return t}layoutFor(e){if("string"!=typeof e)throw TypeError("property must be string");for(let t of this.fields)if(t.property===e)return t}offsetOf(e){if("string"!=typeof e)throw TypeError("property must be string");let t=0;for(let r of this.fields){if(r.property===e)return t;0>r.span?t=-1:0<=t&&(t+=r.span)}}}class I{constructor(e){this.property=e}decode(){throw Error("UnionDiscriminator is abstract")}encode(){throw Error("UnionDiscriminator is abstract")}}class B extends I{constructor(e,t){if(!(e instanceof s&&e.isCount()))throw TypeError("layout must be an unsigned integer ExternalLayout");super(t||e.property||"variant"),this.layout=e}decode(e,t){return this.layout.decode(e,t)}encode(e,t,r){return this.layout.encode(e,t,r)}}class k extends o{constructor(e,t,r){let n=e instanceof c||e instanceof d;if(n)e=new B(new u(e));else if(e instanceof s&&e.isCount())e=new B(e);else if(!(e instanceof I))throw TypeError("discr must be a UnionDiscriminator or an unsigned integer layout");if(void 0===t&&(t=null),!(null===t||t instanceof o))throw TypeError("defaultLayout must be null or a Layout");if(null!==t){if(0>t.span)throw Error("defaultLayout must have constant span");void 0===t.property&&(t=t.replicate("content"))}let i=-1;t&&0<=(i=t.span)&&n&&(i+=e.layout.span),super(i,r),this.discriminator=e,this.usesPrefixDiscriminator=n,this.defaultLayout=t,this.registry={};let a=this.defaultGetSourceVariant.bind(this);this.getSourceVariant=function(e){return a(e)},this.configGetSourceVariant=function(e){a=e.bind(this)}}getSpan(e,t){if(0<=this.span)return this.span;void 0===t&&(t=0);let r=this.getVariant(e,t);if(!r)throw Error("unable to determine span for unrecognized variant");return r.getSpan(e,t)}defaultGetSourceVariant(e){if(e.hasOwnProperty(this.discriminator.property)){if(this.defaultLayout&&e.hasOwnProperty(this.defaultLayout.property))return;let t=this.registry[e[this.discriminator.property]];if(t&&(!t.layout||e.hasOwnProperty(t.property)))return t}else for(let t in this.registry){let r=this.registry[t];if(e.hasOwnProperty(r.property))return r}throw Error("unable to infer src variant")}decode(e,t){let r;void 0===t&&(t=0);let n=this.discriminator,o=n.decode(e,t),i=this.registry[o];if(void 0===i){let s=0;i=this.defaultLayout,this.usesPrefixDiscriminator&&(s=n.layout.span),(r=this.makeDestinationObject())[n.property]=o,r[i.property]=this.defaultLayout.decode(e,t+s)}else r=i.decode(e,t);return r}encode(e,t,r){void 0===r&&(r=0);let n=this.getSourceVariant(e);if(void 0===n){let n=this.discriminator,o=this.defaultLayout,i=0;return this.usesPrefixDiscriminator&&(i=n.layout.span),n.encode(e[n.property],t,r),i+o.encode(e[o.property],t,r+i)}return n.encode(e,t,r)}addVariant(e,t,r){let n=new U(this,e,t,r);return this.registry[e]=n,n}getVariant(e,t){let r=e;return n.isBuffer(e)&&(void 0===t&&(t=0),r=this.discriminator.decode(e,t)),this.registry[r]}}class U extends o{constructor(e,t,r,n){if(!(e instanceof k))throw TypeError("union must be a Union");if(!Number.isInteger(t)||0>t)throw TypeError("variant must be a (non-negative) integer");if("string"==typeof r&&void 0===n&&(n=r,r=null),r){if(!(r instanceof o))throw TypeError("layout must be a Layout");if(null!==e.defaultLayout&&0<=r.span&&r.span>e.defaultLayout.span)throw Error("variant span exceeds span of containing union");if("string"!=typeof n)throw TypeError("variant must have a String property")}let i=e.span;0>e.span&&0<=(i=r?r.span:0)&&e.usesPrefixDiscriminator&&(i+=e.discriminator.layout.span),super(i,n),this.union=e,this.variant=t,this.layout=r||null}getSpan(e,t){if(0<=this.span)return this.span;void 0===t&&(t=0);let r=0;return this.union.usesPrefixDiscriminator&&(r=this.union.discriminator.layout.span),r+this.layout.getSpan(e,t+r)}decode(e,t){let r=this.makeDestinationObject();if(void 0===t&&(t=0),this!==this.union.getVariant(e,t))throw Error("variant mismatch");let n=0;return this.union.usesPrefixDiscriminator&&(n=this.union.discriminator.layout.span),this.layout?r[this.property]=this.layout.decode(e,t+n):this.property?r[this.property]=!0:this.union.usesPrefixDiscriminator&&(r[this.union.discriminator.property]=this.variant),r}encode(e,t,r){void 0===r&&(r=0);let n=0;if(this.union.usesPrefixDiscriminator&&(n=this.union.discriminator.layout.span),this.layout&&!e.hasOwnProperty(this.property))throw TypeError("variant lacks property "+this.property);this.union.discriminator.encode(this.variant,t,r);let o=n;if(this.layout&&(this.layout.encode(e[this.property],t,r+n),o+=this.layout.getSpan(t,r+n),0<=this.union.span&&o>this.union.span))throw Error("encoded variant overruns containing union");return o}fromArray(e){if(this.layout)return this.layout.fromArray(e)}}function T(e){return 0>e&&(e+=4294967296),e}class P extends o{constructor(e,t,r){if(!(e instanceof c||e instanceof d))throw TypeError("word must be a UInt or UIntBE layout");if("string"==typeof t&&void 0===r&&(r=t,t=void 0),4<e.span)throw RangeError("word cannot exceed 32 bits");super(e.span,r),this.word=e,this.msb=!!t,this.fields=[];let n=0;this._packedSetValue=function(e){return n=T(e),this},this._packedGetValue=function(){return n}}decode(e,t){let r=this.makeDestinationObject();void 0===t&&(t=0);let n=this.word.decode(e,t);for(let e of(this._packedSetValue(n),this.fields))void 0!==e.property&&(r[e.property]=e.decode(n));return r}encode(e,t,r){void 0===r&&(r=0);let n=this.word.decode(t,r);for(let t of(this._packedSetValue(n),this.fields))if(void 0!==t.property){let r=e[t.property];void 0!==r&&t.encode(r)}return this.word.encode(this._packedGetValue(),t,r)}addField(e,t){let r=new O(this,e,t);return this.fields.push(r),r}addBoolean(e){let t=new D(this,e);return this.fields.push(t),t}fieldFor(e){if("string"!=typeof e)throw TypeError("property must be string");for(let t of this.fields)if(t.property===e)return t}}class O{constructor(e,t,r){if(!(e instanceof P))throw TypeError("container must be a BitStructure");if(!Number.isInteger(t)||0>=t)throw TypeError("bits must be positive integer");let n=8*e.span,o=e.fields.reduce((e,t)=>e+t.bits,0);if(t+o>n)throw Error("bits too long for span remainder ("+(n-o)+" of "+n+" remain)");this.container=e,this.bits=t,this.valueMask=(1<<t)-1,32===t&&(this.valueMask=4294967295),this.start=o,this.container.msb&&(this.start=n-o-t),this.wordMask=T(this.valueMask<<this.start),this.property=r}decode(){return T(this.container._packedGetValue()&this.wordMask)>>>this.start}encode(e){if(!Number.isInteger(e)||e!==T(e&this.valueMask))throw TypeError(i("BitField.encode",this)+" value must be integer not exceeding "+this.valueMask);let t=this.container._packedGetValue(),r=T(e<<this.start);this.container._packedSetValue(T(t&~this.wordMask)|r)}}class D extends O{constructor(e,t){super(e,1,t)}decode(e,t){return!!O.prototype.decode.call(this,e,t)}encode(e){return"boolean"==typeof e&&(e=+e),O.prototype.encode.call(this,e)}}class C extends o{constructor(e,t){if(!(e instanceof s&&e.isCount()||Number.isInteger(e)&&0<=e))throw TypeError("length must be positive integer or an unsigned integer ExternalLayout");let r=-1;e instanceof s||(r=e),super(r,t),this.length=e}getSpan(e,t){let r=this.span;return 0>r&&(r=this.length.decode(e,t)),r}decode(e,t){void 0===t&&(t=0);let r=this.span;return 0>r&&(r=this.length.decode(e,t)),e.slice(t,t+r)}encode(e,t,r){let o=this.length;if(this.length instanceof s&&(o=e.length),!(n.isBuffer(e)&&o===e.length))throw TypeError(i("Blob.encode",this)+" requires (length "+o+") Buffer as src");if(r+o>t.length)throw RangeError("encoding overruns Buffer");return t.write(e.toString("hex"),r,o,"hex"),this.length instanceof s&&this.length.encode(o,t,r),o}}class _ extends o{constructor(e){super(-1,e)}getSpan(e,t){if(!n.isBuffer(e))throw TypeError("b must be a Buffer");void 0===t&&(t=0);let r=t;for(;r<e.length&&0!==e[r];)r+=1;return 1+r-t}decode(e,t,r){void 0===t&&(t=0);let n=this.getSpan(e,t);return e.slice(t,t+n-1).toString("utf-8")}encode(e,t,r){void 0===r&&(r=0),"string"!=typeof e&&(e=e.toString());let o=new n(e,"utf8"),i=o.length;if(r+i>t.length)throw RangeError("encoding overruns Buffer");return o.copy(t,r),t[r+i]=0,i+1}}class j extends o{constructor(e,t){if("string"==typeof e&&void 0===t&&(t=e,e=void 0),void 0===e)e=-1;else if(!Number.isInteger(e))throw TypeError("maxSpan must be an integer");super(-1,t),this.maxSpan=e}getSpan(e,t){if(!n.isBuffer(e))throw TypeError("b must be a Buffer");return void 0===t&&(t=0),e.length-t}decode(e,t,r){void 0===t&&(t=0);let n=this.getSpan(e,t);if(0<=this.maxSpan&&this.maxSpan<n)throw RangeError("text length exceeds maxSpan");return e.slice(t,t+n).toString("utf-8")}encode(e,t,r){void 0===r&&(r=0),"string"!=typeof e&&(e=e.toString());let o=new n(e,"utf8"),i=o.length;if(0<=this.maxSpan&&this.maxSpan<i)throw RangeError("text length exceeds maxSpan");if(r+i>t.length)throw RangeError("encoding overruns Buffer");return o.copy(t,r),i}}class V extends o{constructor(e,t){super(0,t),this.value=e}decode(e,t,r){return this.value}encode(e,t,r){return 0}}t.ExternalLayout=s,t.GreedyCount=a,t.OffsetLayout=u,t.UInt=c,t.UIntBE=d,t.Int=l,t.IntBE=p,t.Float=m,t.FloatBE=v,t.Double=E,t.DoubleBE=x,t.Sequence=L,t.Structure=S,t.UnionDiscriminator=I,t.UnionLayoutDiscriminator=B,t.Union=k,t.VariantLayout=U,t.BitStructure=P,t.BitField=O,t.Boolean=D,t.Blob=C,t.CString=_,t.UTF8=j,t.Constant=V,t.greedy=(e,t)=>new a(e,t),t.offset=(e,t,r)=>new u(e,t,r),t.u8=e=>new c(1,e),t.u16=e=>new c(2,e),t.u24=e=>new c(3,e),t.u32=e=>new c(4,e),t.u40=e=>new c(5,e),t.u48=e=>new c(6,e),t.nu64=e=>new y(e),t.u16be=e=>new d(2,e),t.u24be=e=>new d(3,e),t.u32be=e=>new d(4,e),t.u40be=e=>new d(5,e),t.u48be=e=>new d(6,e),t.nu64be=e=>new g(e),t.s8=e=>new l(1,e),t.s16=e=>new l(2,e),t.s24=e=>new l(3,e),t.s32=e=>new l(4,e),t.s40=e=>new l(5,e),t.s48=e=>new l(6,e),t.ns64=e=>new w(e),t.s16be=e=>new p(2,e),t.s24be=e=>new p(3,e),t.s32be=e=>new p(4,e),t.s40be=e=>new p(5,e),t.s48be=e=>new p(6,e),t.ns64be=e=>new b(e),t.f32=e=>new m(e),t.f32be=e=>new v(e),t.f64=e=>new E(e),t.f64be=e=>new x(e),t.struct=(e,t,r)=>new S(e,t,r),t.bits=(e,t,r)=>new P(e,t,r),t.seq=(e,t,r)=>new L(e,t,r),t.union=(e,t,r)=>new k(e,t,r),t.unionLayoutDiscriminator=(e,t)=>new B(e,t),t.blob=(e,t)=>new C(e,t),t.cstr=e=>new _(e),t.utf8=(e,t)=>new j(e,t),t.const=(e,t)=>new V(e,t)},9293:function(e){let t=/[\p{Lu}]/u,r=/[\p{Ll}]/u,n=/^[\p{Lu}](?![\p{Lu}])/gu,o=/([\p{Alpha}\p{N}_]|$)/u,i=/[_.\- ]+/,s=RegExp("^"+i.source),a=RegExp(i.source+o.source,"gu"),u=RegExp("\\d+"+o.source,"gu"),c=(e,n,o)=>{let i=!1,s=!1,a=!1;for(let u=0;u<e.length;u++){let c=e[u];i&&t.test(c)?(e=e.slice(0,u)+"-"+e.slice(u),i=!1,a=s,s=!0,u++):s&&a&&r.test(c)?(e=e.slice(0,u-1)+"-"+e.slice(u-1),a=s,s=!1,i=!0):(i=n(c)===c&&o(c)!==c,a=s,s=o(c)===c&&n(c)!==c)}return e},d=(e,t)=>(n.lastIndex=0,e.replace(n,e=>t(e))),l=(e,t)=>(a.lastIndex=0,u.lastIndex=0,e.replace(a,(e,r)=>t(r)).replace(u,e=>t(e))),p=(e,t)=>{if(!("string"==typeof e||Array.isArray(e)))throw TypeError("Expected the input to be `string | string[]`");if(t={pascalCase:!1,preserveConsecutiveUppercase:!1,...t},0===(e=Array.isArray(e)?e.map(e=>e.trim()).filter(e=>e.length).join("-"):e.trim()).length)return"";let r=!1===t.locale?e=>e.toLowerCase():e=>e.toLocaleLowerCase(t.locale),n=!1===t.locale?e=>e.toUpperCase():e=>e.toLocaleUpperCase(t.locale);return 1===e.length?t.pascalCase?n(e):r(e):(e!==r(e)&&(e=c(e,r,n)),e=e.replace(s,""),e=t.preserveConsecutiveUppercase?d(e,r):r(e),t.pascalCase&&(e=n(e.charAt(0))+e.slice(1)),l(e,n))};e.exports=p,e.exports.default=p},77238:function(e,t,r){r.d(t,{Km:function(){return n}});function n(e){if(void 0!==e)return{connection:e}}}}]);