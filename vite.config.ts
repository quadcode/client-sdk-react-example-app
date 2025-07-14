import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: process.env.VITE_BRAND_TITLE,
                short_name: process.env.VITE_BRAND_TITLE,
                description: process.env.VITE_BRAND_TITLE,
                background_color: "#19202D",
                theme_color: "#19202D",
                icons: [
                    {
                        src: 'pwa-icon.svg',
                        type: 'image/svg+xml',
                        sizes: 'any',
                        purpose: 'any maskable',
                    }
                ],
            },
        }),
    ],
    server: {
        proxy: {
            '/api/login': {
                target: 'https://api.trade.yourbroker.trade',
                changeOrigin: true,
                rewrite: () => '/v2/login',
            },
            '/api/lang/route-translations': {
                target: 'https://trade.yourbroker.trade',
                changeOrigin: true,
            },
            '/proxy/api': {
                target: 'https://trade.yourbroker.trade',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/proxy/, ''),
            },
            '/proxy/ws': {
                target: 'wss://ws.trade.yourbroker.trade',
                ws: true,
                changeOrigin: true,
                rewriteWsOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy\/ws/, ''),
            },
        },
    },
});
