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
          // target: 'http://192.168.0.109:5679/api/',
          // target: 'http://161.189.70.95:5679/api/', // main
          // target: 'http://42.193.248.146:5679/api/', // main2 api
          // target: 'http://81.70.56.152:5679/api/', // 北京
          target: 'http://192.168.130.13/api/', // 赛程测试 钱包登录
          // target: 'http://192.168.0.134/api/', // han   
          // target: 'http://192.168.130.13/api/', // han2  
          // target: 'http://192.168.119.1:81/api/',// han3
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/han': {
          target: 'http://192.168.130.13/api/', // han 赛程测试 钱包登录 81
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/han/, '')
        },
        '/main': {
          target: 'http://161.189.70.95:5679/api/', // main
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/main/, '')
        },
        '/localhost': {
          target: 'http://localhost:7001/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/localhost/, '')
        },
        '/testnode': {
          target: 'https://testnode.cyberpop.online/', 
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/testnode/, '')
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
