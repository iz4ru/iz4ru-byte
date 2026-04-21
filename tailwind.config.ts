import type { Config } from 'tailwindcss'

const config = {
  future: {
    compatConfig: true,
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
