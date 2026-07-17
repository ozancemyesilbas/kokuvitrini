import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local']
  },
  plugins: [
    vinext({ prerender: { routes: '*' } }),
    cloudflare({
      viteEnvironment: {
        name: 'rsc',
        childEnvironments: ['ssr']
      }
    })
  ]
});
