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

export { isLogin, getToken, setToken, clearToken, clearAllLocal, setTimestamp, getTimestamp  };
