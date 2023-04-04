import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      host: '0.0.0.0',
      proxy: {
        '/api': {
          // target: 'https://gamepool.cyberpop.online:5679/api/', 
          // target: 'http://192.168.0.109:5679/api/',
          // target: 'http://161.189.70.95:5679/api/', // main
          // target: 'http://192.168.0.134/api/', // han  
          target: 'http://192.168.130.13/api/', // han2  
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/localhost': {
          target: 'http://localhost:7001/', 
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/localhost/, '')
        },
        '/test': {
          target: 'https://testnode.cyberpop.online/', 
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/test/, '')
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConig
);
