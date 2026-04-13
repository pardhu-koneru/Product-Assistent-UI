import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode — localStorage is used for auth tokens, no SSR needed
  ssr: false,
} satisfies Config;
