// eslint-disable-next-line import/extensions
import Web3 from 'web3/dist/web3.min.js'

const isLogin = () => {
  return !!localStorage.getItem('TOKEN_KEY');
  // return true
};

const getToken = () => {
  return localStorage.getItem('TOKEN_KEY');
};

const setToken = (token: string) => {
  localStorage.setItem('TOKEN_KEY', token);
};

const clearToken = () => {
  localStorage.removeItem('TOKEN_KEY');
};

const clearAllLocal = () => {
  const apilocal = localStorage.getItem('mobaapiurl')
  localStorage.clear();
  localStorage.setItem('mobaapiurl',String(apilocal))
};

const setTimestamp = (date: number) => {
  localStorage.setItem('TIME_STAMP', String(date));
};
const getTimestamp = () => {
  return localStorage.getItem('TIME_STAMP');
};

const getAddress = () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' }).then(async (res: any) => {
      const web3obj = new Web3((Web3 as any).givenProvider);
      const res0 = await web3obj.utils.toChecksumAddress(res[0]);
      resolve(res0)
    }).catch((err: any) => {
      resolve(0)
    })
  })
};

export { isLogin, getToken, setToken, clearToken, clearAllLocal, setTimestamp, getTimestamp, getAddress };
