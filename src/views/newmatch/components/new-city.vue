<template>
    <div class="city-type">
        <a-form ref="formRef" :model="formCity" @submit="handleSubmit">
            <a-form-item field="radio" label="擂台类型：">
                <Mradio :radioarr="arenaTypeData" :defaultvalue="arenaTypeData[arenaTypeRadio]" @change-radio="changeRadio" />
            </a-form-item>
            <a-form-item field="challengeType" label="城市擂台：">
                <div class="city-select flex flex-col">
                    <a-space>
                        <a-select v-model="level1" :unmount-on-close="true" placeholder="国家" :style="{width:'168px',height: '40px'}">
                            <a-option v-for="value,i of Object.keys(cityName)" :key="i">{{value}}</a-option>
                        </a-select>
                        <div class="label ml-10 mr-30 white-nowrap">国家</div>
                        <a-select v-model="level2" :unmount-on-close="true" placeholder="省份/州" :style="{width:'168px',height: '40px'}">
                            <a-option v-for="value,i of cityName[level1] ? Object.keys(cityName[level1]) : []" :key="i">{{value}}</a-option>
                        </a-select>
                        <div class="label ml-10 mr-30 white-nowrap">省份/州</div>
                        <a-select v-model="level3" :unmount-on-close="true" placeholder="城市" :style="{width:'168px',height: '40px'}">
                            <a-option v-for="value,i of cityName[level1] ? cityName[level1][level2] : []" :key="i">{{value}}</a-option>
                        </a-select>
                        <div class="label ml-10 mr-20 white-nowrap">城市</div>
                        <div v-if="arenaTypeRadio == 0" class="setplace flex-center cursor-pointer" @click="getLocation(level3)"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/setplace.svg" alt=""></div>
                    </a-space>
                    <a-space v-if="arenaTypeRadio == 1" class="city-input">
                        <a-input v-model="formCity.arenaName" placeholder="请输入地标地址" />
                        <div class="setplace flex-center cursor-pointer" @click="getLocation(formCity.arenaName)"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/setplace.svg" alt=""></div>
                    </a-space>
                    <a-space v-if="arenaTypeRadio == 2" class="city-input">
                        <a-input v-model="formCity.arenaName" placeholder="请输入地点地址" />
                        <div class="setplace open1 flex-center cursor-pointer" @click="getLocation(formCity.arenaName)"><img src="https://moba-project.s3-accelerate.amazonaws.com/admin/icons/setplace.svg" alt=""></div>
                    </a-space>
                    <div id="map" class="mt-20" style="width: 269px;height: 151px;background: #eee;"></div>
                </div>
            </a-form-item>
            <a-form-item :key="formCity.startTime" field="viewTime" label="比赛时间：">
                <DatePicker :starttime="formCity.startTime" :finishtime="formCity.finishTime" @change-date="changeDate"/>
            </a-form-item>
            <a-form-item field="reward">
                <template #label>
                <div>赛事奖励 :</div>
                <div>（设置第0-0名为签到奖励）</div>
                </template>
                <RewardCard :backrew="backRewards" @change-reward="changeReward"/>
            </a-form-item>
            <a-form-item style="align-items: end;">
                <div class="flex-center" style="width: 758px;">
                    <a-button class="active large btn-loading" html-type="submit" :disabled="subLoading"><div><a-spin v-if="subLoading"></a-spin> 保存并确认</div></a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Message, ValidatedError } from '@arco-design/web-vue'
import { LoginData } from '@/api/user'
import { useRouter } from 'vue-router'
import { 
    createArena,
    createArenaData,
    ArenaLists,
    queryArenaInfo,
    singleReward
} from '@/api/challenge';
import cityData from '@/utils/cityData'
import mapboxgl from 'mapbox-gl'
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import axios from 'axios';
import type { dateType } from '@/types/global'
// import getCurrentPosition from '@/utils/map'

const router = useRouter();
const formRef: HTMLFormElement = $ref()
let subLoading: boolean = $ref(false)
const level1 = ref();
const level2 = ref();
const level3 = ref();
let arenaTypeRadio: number = $ref(0) // 0:城市擂台 1:地标擂台 2:地点擂台 show
const arenaTypeData = ['城市擂台','地标擂台','地点擂台']
const cityName: any = cityData.cityNames
let backRewards: any = $ref([])
let formCity: createArenaData = $ref({
    arenaType: 1, // 0:坐标擂台 1:城市擂台 2:地标擂台 real
    startTime: 0,
    finishTime: 0,
    latitude: 1000000,
    longitude: 1000000,
    rule: '暂无',
    arenaName: '',
    rewards: [],
    cityName: ''
});
watch(level1, (newV,oldV) => {level2.value = null;})
watch(level2, (newV,oldV) => {level3.value = null;})
watch(level3, (newV,oldV) => { 
    // eslint-disable-next-line no-multi-assign
    formCity.latitude = formCity.longitude = 1000000
    if( formCity.arenaType === 1 ){
        if(newV) {formCity.arenaName = newV}
        else formCity.arenaName = ''
    }else if( formCity.arenaType !== 1){
        formCity.arenaName = ''
    }
})
const changeRadio = (file: any) => {
    if( !router.currentRoute.value.query.arenaId ) formCity.arenaName = ''
    arenaTypeRadio = arenaTypeData.findIndex(item => item === file)
    if( arenaTypeRadio === 0 ) formCity.arenaType = 1
    else if( arenaTypeRadio === 1 ) formCity.arenaType = 2
    else formCity.arenaType = 0
}
const changeReward = (data: any) => {
    formCity.rewards = data
}

const changeDate = (date: dateType) => {
    formCity.startTime = Math.floor(Number(date.start) / 1000)
    formCity.finishTime = Math.floor(Number(date.end) / 1000)
}

const getINfo = async (id: number) => {
    if(!id) return
    const { data } = await queryArenaInfo(id)
    const tempRewards: singleReward[] = data.rewards.map((item)=>({
        startRank: item.startRank,
        endRank: item.endRank,
        name: item.name,
        props: item.propList
    }))
    formCity = {
        arenaType: data.arenaType,
        startTime: data.startTime,
        finishTime: data.finTime,
        latitude: data.latitude,
        longitude: data.longitude,
        rule: data.rules,
        arenaName: data.arenaName,
        rewards: tempRewards,
        arenaId: data.arenaId,
        cityName: '',
    }
    backRewards = tempRewards
    // eslint-disable-next-line no-use-before-define
    getLocation(formCity.arenaName)
}

const getFilters = (value: any) => {
    if( value === '中国' && level2.value === '香港') return 'hk'
    if( value === '中国' && level2.value === '台湾省') return 'tw'
    if( value === '中国' && level2.value === '澳门') return 'mo'
    if( value === '中国' ) return 'cn'
    if( value === '巴西' ) return 'br'
    return ''
}

const getTypesFilters = () => {
    if( formCity.arenaType === 1 ) {return 'region,place'}
    return ''
}

const getCityName = (features: object | any, countrystr = 'country',placestr = 'place') => {
    const { context = [] } = features
    if( !context.length ) return features.text
    let cityNameRes = ''
    const countryObj: any = context.filter((item: any)=> (item.id).includes(countrystr) )
    const placeObj: any = context.filter((item: any)=> (item.id).includes(placestr) )
    if( countryObj[0]?.text === '中华人民共和国' ) countryObj[0].text = '中国'
    if( !placeObj.length ) placeObj[0] = {text:features.text}
    cityNameRes = (countryObj[0].text || '' ) + ( placeObj[0].text || '')
    return cityNameRes
}

let center = $ref([104.07275,30.57899])
let map: any = $ref({})
let targetMarker: any = $ref(null)
const baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places"
mapboxgl.accessToken = 'pk.eyJ1IjoicG9ueW1lbmciLCJhIjoiY2xmajJwZW90MDQ5YzN2bXExOThuNDBsNiJ9.edbPo5ZLBI0BGFV0NZkLUQ';
const innitMap = () => {
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center,
        zoom: 8, // starting zoom
    });
    map.addControl(new MapboxLanguage({
        defaultLanguage: 'zh-Hans' // en
    }));
}

let loading = $ref(false)
// 定位： 地理位置解析到文字
const getLocation = async (address: string) => {
    if( loading || (!address && !level3.value )) return
    // eslint-disable-next-line no-multi-assign
    formCity.longitude = formCity.latitude = 1000000
    if( !level1.value ) level1.value = ''
    if( !level2.value ) level2.value = ''
    if( !level3.value ) level3.value = ''
    let apiAddress = level1.value + level2.value + level3.value + address
    if( formCity.arenaType === 1 ) {apiAddress = address}
    try {
        loading = true;
        const response: any = await axios.get(`${baseUrl}/${apiAddress}.json?country=${getFilters(level1.value)}&types=${getTypesFilters()}&fuzzyMatch=false&limit=1&access_token=${mapboxgl.accessToken}`);
        console.log(response);
        if( response.features.length ){
            formCity.arenaName = response.features[0].matching_text || response.features[0].text
            formCity.arenaName = formCity.arenaName.replace(/[^\u4e00-\u9fa5]/gi, "") || formCity.arenaName
            formCity.cityName = getCityName(response.features[0]) || ''
            center = response.features[0].center
            formCity.latitude = Math.floor(Number(center[1])*1000000)
            formCity.longitude = Math.floor(Number(center[0])*1000000)
            map.setZoom(8)
            map.setCenter(center);
            targetMarker?.remove();
            // map.flyTo({ center, zoom: 8, essential: true })
            targetMarker = new mapboxgl.Marker({color: "#4F8AFF"})
            .setLngLat(center)
            .addTo(map);
        } else {
            // eslint-disable-next-line no-lonely-if
            if(formCity.arenaType === 0 && !formCity.arenaName){
                Message.error('请输入地点地址')
            }else{
                Message.error('位置匹配错误，注意检查国家/省份/州/城市')
            }
        }
        loading = false;
    } catch (err) {
        loading = false;
        console.log(err);
    }
}


const handleSubmit = async ({errors, values,}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
}) => {
    if( formCity.latitude === 1000000 && formCity.longitude === 1000000 ) await getLocation(level3.value || formCity.arenaName) // 已选择但未定位：自动获取经纬度
    if( !formCity.arenaName && level3.value ) formCity.arenaName = level3.value
    if( !errors && formCity.rewards.length && formCity.startTime && formCity.finishTime && formCity.arenaName ){
        if( formCity.startTime > Math.floor(new Date().getTime()/1000) ){
            subLoading = true
            try {
                await createArena( formCity ).then((res: any) => {
                    Message.success('success')
                }).finally(()=>{subLoading = false})
            } catch (error) {
                subLoading = false
            }
        }else{ Message.error('擂台已开始！') }
    }else{
        let message = ''
        if( !formCity.rewards.length ) message = '赛事奖励'
        if( !formCity.finishTime ) message = '比赛结束时间'
        if( !formCity.startTime ) message = '比赛开始时间'
        if( !formCity.arenaName ) message = '擂台位置'
        Message.error(`${message}不能为空`)
    }
}


watch(() => router.currentRoute.value.query,(newQ) => {
    getINfo(Number(newQ.arenaId))
},{immediate: true,deep: true})

onMounted(() => {
    // const res: any = await getCurrentPosition()
    // if( res.length ) center = res
    innitMap()
})
</script>

<style lang="less" scoped>

.city-type {
    :deep(.arco-form){
        .arco-row:nth-child(4)>.arco-form-item-label-col{
            margin-top: 9px;
        }
        .city-select{
            .label{
                font-size: 16px;
                color: #3A3F63;
            }
            .setplace{
                width: 40px;
                height: 40px;
                border-radius: 4px;
                border: 1px solid #DAE0F2;
                img{
                    width: 24px;
                    height: 24px;
                }
                &.open{
                    background: #4458FE;
                    border: none;
                    img{
                        filter: invert(98%) sepia(4%) saturate(486%) hue-rotate(248deg) brightness(114%) contrast(600%);
                    }
                }
            }
            .city-input{
                .arco-space-item{margin-top: 14px; margin-right: 20px !important;}
            }
            .arco-select{
                padding: 0 18px 0 20px;
                background: #fff;
                border-radius: 4px;
                border: 1px solid #DAE0F2;
                .arco-select-view-value{
                    font-size: 16px;
                    color: #3A3F63;
                }
                .arco-select-view-suffix{
                    svg{
                    font-size: 17px;
                    color: #9AA1C8;
                    }
                }
            }
        }
    }
}
</style>

<style lang="less">
.mapboxgl-ctrl-logo,.mapboxgl-ctrl-attrib{
    display: none !important;
}
</style>
