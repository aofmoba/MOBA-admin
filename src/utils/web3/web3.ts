import contracts from '@/utils/web3/contracts'
import { getAddress } from '@/utils/auth';

// eslint-disable-next-line import/extensions
import Web3 from 'web3/dist/web3.min.js'

// 登录钱包
const login = async () => {
  const { ethereum } = window as any; // 获取小狐狸实例
  // if (!ethereum) {
  //     return 'No install';
  // }
  return ethereum.request({ method: 'eth_requestAccounts' });
};

// 是否安装metamask
// eslint-disable-next-line consistent-return
const hasMetaMask = async () => {
  const { ethereum } = window as any; // 获取小狐狸实例
  if (!ethereum) {
    return 'No install';
  }
};

const totolsuppl = async (abi: any[], address: string, id?: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const web3 = new Web3((Web3 as any).givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    if (id === -1) {
      const res = await contract.methods.totalSupply().call();
      resolve(res);
    } else {
      const res = await contract.methods.totalSupply(id).call();
      resolve(res);
    }
  });
};


// Total pledge pools
const getTotalSupply = (abi: any[], address: string) => { // two staking CYTStakingRewards
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      const result = await contract.methods.getTotalSupply().call();
      resolve(result)
  })
}

// Total rewardSupply
const rewardSupply = (abi: any[], address: string) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      // eslint-disable-next-line no-underscore-dangle
      const result = await contract.methods._rewardSupply().call();
      resolve(result)
  })
}
// Total rewardSupply setting
const setNotifyRewardAmount = (abi: any[], address: string, amount: number) => {
  return new Promise((resolve, reject) => {
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      const accounts = localStorage.getItem('address')
      contract.methods.setNotifyRewardAmount(amount).send({ from: accounts }).then((receipt: any) =>{
        console.log(receipt);
        resolve(receipt)
      }).catch((err: any) => {
          resolve(0)
          console.log('error',err);
      })
  })
}


const addChain = (chainId: any) => {
  const { ethereum } = window as any; // 获取小狐狸实例
  const web3 = new Web3((window as any).ethereum); // 创建一个新的web3 对象
  // console.log(web3.utils.numberToHex(chainId), 'web3.utils.numberToHex(chainId)');
  let info: any;
  // eslint-disable-next-line eqeqeq
  if (chainId == 43113) {
    info = {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(43113),
          chainName: 'AVAX',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX', // 2-6 characters long
            decimals: 18,
          },
          rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://testnet.snowtrace.io/'],
        },
      ],
    };
  // eslint-disable-next-line eqeqeq
  } else if( chainId == 80001){
    info = {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(80001),
          chainName: 'Mumbai',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC', // 2-6 characters long
            decimals: 18,
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        },
      ],
    };
  // eslint-disable-next-line eqeqeq
  }else if(chainId == 56){
      info = {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: web3.utils.numberToHex(56),
                chainName: 'BSC',
                nativeCurrency: {
                    name: 'BSC',
                    symbol: 'BSC', // 2-6 characters long
                    decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed1.defibit.io'],
                blockExplorerUrls: ['https://bscscan.com/']
            }
        ]
    }
  }else{
    info = {
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: web3.utils.numberToHex(52),
                chainName: 'CoinEx Smart Chain Mainnet',
                nativeCurrency: {
                    name: 'CoinEx Smart Chain Mainnet',
                    symbol: 'CET', // 2-6 characters long
                    decimals: 18
                },
                rpcUrls: ['https://rpc1.coinex.net'],
                blockExplorerUrls: ['https://www.coinex.net/']
            }
        ]
    }
  }
  return new Promise((resolve, reject) => {
    ethereum
      .request({
        ...info,
      })
      .then((res: any) => {
        web3.eth.net.getId().then((realChainId: any) => {
          // eslint-disable-next-line eqeqeq
          if (realChainId == info.params[0].chainId) {
            resolve(1);
            return;
          }
          resolve(0);
        });
      });
  });
};

// 资产查询
const batchBalanceOf = (abi: any, address: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const accounts = localStorage.getItem('address');
    const web3 = new Web3((Web3 as any).givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    const res = await contract.methods.batchBalanceOf(accounts).call();
    resolve(res);
  });
};

// 余额查询
const getBalanceOf = (abi: any[], address: string, account: any) => { 
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      const result = await contract.methods.getBalanceOf(account).call();
      resolve(result)
  })
}

// 余额查询
const ERC20balanceOf = (abi: any[], address: string, account: any) => { 
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      const result = await contract.methods.balanceOf(account).call();
      resolve(result)
  })
} 


// Native 1155 query assets
const balanceOfBatch = (abi: any, address: any, ids: any, account: any) => {
  const tempAccounts: any = []
  // eslint-disable-next-line no-restricted-syntax
  for (const i of ids) { tempAccounts.push(account) }
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
      const web3 = new Web3((window as any ).ethereum)
      const contract = new web3.eth.Contract(abi, address)
      const res = await contract.methods.balanceOfBatch(tempAccounts, ids).call();
      resolve(res);
  })
}

const getPeroid = (abi: any[], address: string) => {
  return new Promise((resolve, reject) => {
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      const res = contract.methods.getLastPeroid().call()
      resolve(res)
  })
}


export default {
  login,
  hasMetaMask,
  totolsuppl,
  getTotalSupply,
  rewardSupply,
  setNotifyRewardAmount,
  addChain,
  batchBalanceOf,
  getBalanceOf,
  ERC20balanceOf,
  balanceOfBatch,
  getPeroid,
  contracts
};
