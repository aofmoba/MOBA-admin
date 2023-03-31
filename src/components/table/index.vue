<template>
  <div class="nftTable">
    <h3>{{ $t('dataquery.nft.t') }}</h3>
    <a-table :data="NFTdata" :row-key="NFTdata.id" :bordered="{ cell: true }" :pagination="false">
      <template #columns>
        <a-table-column
          :title="$t('assets.table.name')"
          data-index="name"
        />
        <a-table-column class="address" :title="$t('assets.table.address')">
          <template #cell="{ record }">
            <span style="font-size: 13px">{{ record.address[0] }}</span>
          </template>
        </a-table-column>
        <a-table-column
          :title="$t('assets.table.contractName')"
          data-index="contractName"
          :width="180"
        />
        <a-table-column :title="$t('assets.table.id')" data-index="id">
          <template #cell="{ record }">
            <div v-if="record.id != null" class="haveId">
              <a-button
                v-for="(item, index) in record.id"
                :key="index"
                >{{ item }}</a-button>
            </div>
            <div v-else class="noId" style="text-align: center">--</div>
          </template>
        </a-table-column>
        <a-table-column :title="$t('assets.table.circulation')">
          <template #cell="{ record }">
            <div v-if="record.circulation != null" class="haveId">
              <a-button
                v-for="(item, index) in record.circulation"
                :key="index"
                >{{ item }}</a-button>
            </div>
            <div v-else class="noId" style="text-align: center">--</div>
          </template>
        </a-table-column>
        <a-table-column :title="$t('assets.table.browser')">
          <template #cell="{ record }">
            <a :href="record.browser[1] + record.browser[0]" class="browser" target="view_window">
              link
            </a>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <div v-if="props.path == 'setting'" class="copyBtn"><a-button type="primary" size="medium" @click="showDialog(5)">{{ $t('dataset.pbtn') }}</a-button></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, watch, getCurrentInstance, onDeactivated,onActivated } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Web3J from '@/utils/web3';
import contracts from '@/utils/contracts'
// eslint-disable-next-line import/extensions
import Web3 from 'web3/dist/web3.min.js'
import { staticData } from '@/store';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['getNFTdata','showDialog']);
const { proxy } = getCurrentInstance() as any;
const comStore = staticData();
const { chainId } = storeToRefs(comStore);
const { t } = useI18n();
const comCard: any = ref([]);
const comGame: any = ref([]);
const comLootbox: any = ref([]);

const props: any = defineProps({
  path:{
    type: String,
    default: '',
  }
})

const showDialog = (type: any) => {
  emit('showDialog', type)
}

const cardAddr: any = ref([])
const gameAddr: any = ref([])
const boxAddr: any = ref([])
const NFT_INFO: any = {
  bsc: {
    card: '0x23b5384c6D426dc3B2794229774b3d20cac7baA5',
    game: '0x79B73BdEFCD3C8417b01a2Ba73702BD1a7a650E1',
    lootbox: '0x10fdE59432D1d6eE7aD25448e3D8B9b3D2c08b89',
    browser: 'https://bscscan.com/address/'
  },
  csc: {
    card: '0x3572100cAF31c8Cf404Edc9ba0557BA90993E510',
    game: '0xE9d02904D464C2aF8338b81A13ff2b25Aeac48f7',
    lootbox: '0x8764B2Dc98010d166f4cdD84046F20ff09177B4b',
    browser: 'https://www.coinex.net/address/'
  },
}
const NFTdata: any = reactive([
{
  name: 'ERC 721',
  address: cardAddr,
  contractName: 'Support Card',
  id: null,
  circulation: comCard,
  owner: '--',
  browser: cardAddr // NFT_INFO[cType.value].browser + NFT_INFO[cType.value].card
},
{
  name: 'ERC 1155',
  address: gameAddr,
  contractName: 'Game',
  id: [1, 2],
  circulation: comGame,
  owner: '--',
  browser: gameAddr
},
{
  name: 'LootBox',
  address: boxAddr,
  contractName: 'LootBox',
  id: [9, 10, 11, 12],
  circulation: comLootbox,
  owner: '--',
  browser: boxAddr
}
]);



// eslint-disable-next-line consistent-return
const filterAddress = (type: any,index: number): any => {
  if( chainId.value === 56 ){
    if( type === 'card' ){
      if( index === 0 ) return contracts.bsc_card.abi
      return contracts.bsc_card.address
    }
    if( type === 'game' ){
      if( index === 0 ) return contracts.game_bsc.abi
      return contracts.game_bsc.address
    }
    if( type === 'box' ){
      if( index === 0 ) return contracts.lootBox_Bsc.abi
      return contracts.lootBox_Bsc.address
    }
  }else{
    if( type === 'card' ){
      if( index === 0 ) return contracts.csc_card.abi
      return contracts.csc_card.address
    }
    if( type === 'game' ){
      if( index === 0 ) return contracts.game_csc.abi
      return contracts.game_csc.address
    }
    if( type === 'box' ){
      if( index === 0 ) return contracts.lootBox_csc.abi
      return contracts.lootBox_csc.address
    }
  }

}


// 初次查询 fuji
const getTotalSupply: any = ref(0)
const getTotalSupplyCoin: any = ref('--')
const circInit = async () => {
  comCard.value = []
  comGame.value = []
  comLootbox.value = []
  comCard.value.push(
    await Web3J.totolsuppl(filterAddress('card',0),filterAddress('card',1),-1),
  );
  comGame.value.push(
    await Web3J.totolsuppl(filterAddress('game',0),filterAddress('game',1),1),
    await Web3J.totolsuppl(filterAddress('game',0),filterAddress('game',1),2),
  );
  comLootbox.value.push(
    await Web3J.totolsuppl(filterAddress('box',0),filterAddress('box',1),9),
    await Web3J.totolsuppl(filterAddress('box',0),filterAddress('box',1),10),
    await Web3J.totolsuppl(filterAddress('box',0),filterAddress('box',1),11),
    await Web3J.totolsuppl(filterAddress('box',0),filterAddress('box',1),12),
  );
  emit('getNFTdata', NFTdata)
};


const initAddress = (newVal: any) => {
  cardAddr.value = []
  gameAddr.value = []
  boxAddr.value = []
  if( newVal === 56 ) {
    cardAddr.value.push(NFT_INFO.bsc.card,NFT_INFO.bsc.browser)
    gameAddr.value.push(NFT_INFO.bsc.game,NFT_INFO.bsc.browser)
    boxAddr.value.push(NFT_INFO.bsc.lootbox,NFT_INFO.bsc.browser)
  }
  else {
    cardAddr.value.push(NFT_INFO.csc.card,NFT_INFO.csc.browser)
    gameAddr.value.push(NFT_INFO.csc.game,NFT_INFO.csc.browser)
    boxAddr.value.push(NFT_INFO.csc.lootbox,NFT_INFO.csc.browser)
  }
}


watch(chainId, async (newVal: any, oldVal: any) => { // first action
    console.log(newVal, oldVal, 'chainId');
    // eslint-disable-next-line eqeqeq
    if( ![56,52].includes(newVal) || props.path !== proxy.$route.name) return      
    console.log('one');
    initAddress(newVal)
    // eslint-disable-next-line no-use-before-define
    circInit();
}, {immediate:true,deep:true});



onMounted(async () => {
  initAddress(56)
  const web3obj = new Web3((Web3 as any).givenProvider);
  await web3obj.eth.net.getId().then(async (id: any) => {
      if (![56,52].includes(id) && props.path === 'query') {
        Message.info(t('settings.chain.msg'));
        const a: any = await Web3J.addChain(56);
        if (a) {
          Message.success(t('settings.chain.succ'));
        }else{
          Message.error(t('settings.chain.err'));
        }
      } 
  })
})

</script>

<style scoped lang="less">
:deep(.arco-table){
  flex: 1;
  .arco-table-cell{
    text-align: center;
    justify-content: center;
  }
  .arco-table-td:nth-child(1),.arco-table-td:nth-child(5){
    white-space: nowrap;
  }
  .arco-table-td:nth-child(4),.arco-table-td:nth-child(5){
    color: yellow;
  }
}
.nftTable{
  &>h3{
    padding: 0 20px 20px;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  :deep(.arco-table){
    margin: 0 20px;
    .haveId {
      display: flex; 
      flex-direction: column;
      align-items: center;
      button + button {
        margin-top: 4px;
      }
      button{
        width: 70px;
        color: yellow;
      }
    }

    .browser {
      color: rgb(var(--primary-6));
      text-decoration: none;
      cursor: pointer;

      &:hover {
        color: blue;
      }
    }
  }
}
.nftTable{
  padding: 20px 0;
  background-color: var(--color-menu-light-bg);
  border-radius: 4px;
  h3{
    margin-top: 0;
    padding: 0 20px 20px;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  ul{
    padding: 0 20px !important;
    margin: 0;
    list-style: none;
  }
}

</style>
