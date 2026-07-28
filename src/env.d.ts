/// <reference path="../.astro/types.d.ts" />

// Binary files imported with `?base64` are inlined as a base64 string at build
// time by the `base64Asset` Vite plugin in astro.config.mjs.
declare module '*?base64' {
  const content: string;
  export default content;
}
