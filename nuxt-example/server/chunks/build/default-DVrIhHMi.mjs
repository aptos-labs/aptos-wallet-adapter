import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderSlot } from 'vue/server-renderer';
import { a as useHead } from './server.mjs';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'buffer';
import 'class-variance-authority';
import 'radix-vue';
import 'clsx';
import 'tailwind-merge';
import 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Aptos Wallet Adapter Example",
      meta: [
        {
          name: "description",
          content: "An example of how to use Aptos Wallet Adapter with Vue and Nuxt.js."
        }
      ],
      bodyAttrs: {
        class: "flex justify-center min-h-screen bg-background font-sans antialiased text-card-foreground",
        style: "font-family: 'Inter', sans-serif;"
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DVrIhHMi.mjs.map
