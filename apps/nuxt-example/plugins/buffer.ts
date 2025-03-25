import { Buffer } from "buffer";

export default defineNuxtPlugin(() => {
  if (!globalThis.Buffer) {
    globalThis.Buffer = Buffer;
  }
});
