import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cutePink: "#fce4ec", // สีพื้นหลังหลักที่ต้องการ
        deepPink: "#f8bbd0",
        textPink: "#d81b60",
      },
    },
  },
  plugins: [],
};
export default config;