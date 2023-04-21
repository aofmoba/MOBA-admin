import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getToken, clearToken, getTimestamp, setTimestamp } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import useUser from '@/hooks/user';
import { refreshToken } from '@/api/user';
import router from '../router'

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

// 是否正在刷新的标志
(window as any).isRefreshing = false;
// 存储请求的数组
let cacheRequestArr: any = [];

// 将所有的请求都push到数组中,其实数组是[function(token){}, function(token){},...]
const cacheRequestArrHandle = (cb: any) => {
    cacheRequestArr.push(cb);
}
// 数组中的请求得到新的token之后自执行，用新的token去重新发起请求
const afreshRequest = () => {
    cacheRequestArr.map((cb: any) => cb());
    cacheRequestArr = [];
}
// 判断token是否即将过期
const computedTime = () => {
    const oData = getTimestamp(); // 登陆时的时间戳
    const curTime = new Date().getTime();
    const expiresTime = curTime - Number(oData);
    // eslint-disable-next-line radix
    const seconds = parseInt( String((expiresTime % (1000 * 60 )) / 1000) );
    return seconds >= 30
}


axios.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    // const token = getToken();
    // if (token) {
    //   if (!config.headers) {
    //     config.headers = {};
    //   }
    //   config.headers = { accessToken: token }
    // }
    (window as any).mobaapiurl = localStorage.getItem('mobaapiurl') || ''
    if( !config.url.includes('https://') ){
      if( (window as any).mobaapiurl === 'main' ){
        config.url = config.url.replace('/api/', '/main/')
      }else if( (window as any).mobaapiurl === 'api' ){
        config.url = config.url.replace('/main/', '/api/')
      }
    }
    
    const token = getToken();
    if (token && !config.url.includes('https://api.mapbox.com')) {
      if (!config.headers) { config.headers = {} }
      config.headers.accessToken = token
      if (computedTime() && config.url !== '/api/user/refresh_token') {
        if (!(window as any).isRefreshing) {
          (window as any).isRefreshing = true
          refreshToken().then((res: any) => {
            if (res.error_code === 0) {
              afreshRequest()
              setTimestamp(new Date().getTime())
            }
          }).catch((err: any) => {
            console.log(err);
            const { logout } = useUser();
            logout();
          }).finally(() => {(window as any).isRefreshing = false;})
        }
        /* 把请求(token)=>{....}都push到一个数组中 */
        const retry = new Promise((resolve, reject) => {
          cacheRequestArrHandle(() => {
            /* 将请求挂起 */
            resolve(config)
          })
        })
        return retry
      }
      return config
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res: any = response.data;
    // const router = useRouter();
    // if the custom code is not 20000, it is judged as an error.
    if (res.error_code !== 0 && res?.type !== 'FeatureCollection') {
      if( res.error_code === 1001 ){
        if( response.config.url !== '/api/user/logout' ){
          Message.error({
            content: '登录已过期，需要重新登录',
            duration: 5 * 1000,
          });
        }
        clearToken();
        removeRouteListener();
        router.push({name: 'login'})
      }else{
        switch (res.error_code) {
          case 1003: 
            Message.error({
              content: '无权限操作',
              duration: 5 * 1000,
            })
            break;
          case 1004: 
            Message.error({
              content: '参数格式不对',
              duration: 5 * 1000,
            })
            break;
          case 1005: 
            Message.error({
              content: '数据不存在',
              duration: 5 * 1000,
            })
            break;
          case 1006: 
            Message.error({
              content: '用户名密码不匹配',
              duration: 5 * 1000,
            })
            break;
          case 1012: Message.error({
            content: '账号锁定',
            duration: 5 * 1000,
          })
            break;
          default: Message.error({
              content: res.msg || 'Error',
              duration: 5 * 1000,
            });
        }
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    if( error.message === 'Request failed with status code 422' ){
      Message.error({
        content: '地址查询参数过长',
        duration: 5 * 1000,
      })
    }else{
      Message.error({
        content: error.message,
        duration: 5* 1000,
      });
    }
    return Promise.reject(error);
  }
);
