<template>
    <div class="form-group">
        <a-form :model="form" @submit="handleSubmit">
            <a-form-item
              field="name" label="赛事名称："
              :rules="[{ required: true, message:'name is required' },{maxLength:18,message:'最多可填写18个字'}]"
              :validate-trigger="['blur']"
            >
              <a-input v-model="form.name" placeholder="请输入您的赛事名称" />
            </a-form-item>
            <a-form-item
              field="banner" label="赛事banner："
            >
              <div class="flex-col">
                <Mupload ref="uploadComRef" :width="335" :height="120" :uwidth="670" :uheight="240" @change-banner="changeBanner" />
                <div class="mt-10 mtext-gray font-sm">尺寸（670*240px），仅限JPG和PNG格式</div>
              </div>
            </a-form-item>
            <a-form-item field="reward">
              <template #label>
                <div>赛事奖励 :</div>
                <div>（设置第0-0名为签到奖励）</div>
              </template>
              <RewardCard :backrew="backRewards" @change-reward="changeReward"/>
            </a-form-item>
            <a-form-item field="rules">
              <template #label>
                <div>赛事规则 :</div>
                <div>（支持图片和文字单独两种模式）</div>
              </template>
              <div class="flex-col">
                <div>
                    <Mupload ref="uploadComRef2" :width="335" :height="120" :uwidth="670" @change-banner="changeRules"/>
                    <div class="mt-10 mtext-gray font-sm">图片宽度尺寸仅限670px，仅限JPG和PNG格式</div>
                </div>
                <div class="text-rule mt-30">
                    <div class="font-md mb-14">填写规则</div>
                    <a-textarea v-model="form.rule" class="rounded" :max-length="{length:10000,errorOnly:true}" placeholder="请输入您的赛事规则" style="width: 758px;height: 120px;background-color: var(--color-bg-1);"/>
                </div>
              </div>
            </a-form-item>
            <a-form-item>
              <div class="flex-center" style="width: 758px;margin-bottom: 20px;">
                <a-button class="active " html-type="submit" :disabled="loading"><div><a-spin v-if="loading"/> 保存并确认</div></a-button>
                <a-button class="default" style="margin-left: 64px;" @click="toPoint"><div>添加赛点</div></a-button>
              </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue'
import { FileItem, Message, ValidatedError } from '@arco-design/web-vue';
import { LoginData } from '@/api/user';
import { useRouter } from 'vue-router';
import useLoading from '@/hooks/loading'
import { createCompetition } from '@/api/competition';
  
const router = useRouter();
const { loading, setLoading } = useLoading(false);
const props = defineProps({
    type: {
        type: String,
        default: '主题赛'
    }
})
const backRewards: any = $ref([])
let banneFile: FileItem | any = $ref()
let rulePicFile: FileItem | any = $ref()
const form:any = reactive({
    type: 0, // 0: 主题赛 1: 俱乐部
    name: '',
    banner: '',
    rule: '',
    rulePic: '',
    rewards: [],
});
watch(()=>props.type,(newV: any, oldV: any) => {
  if( newV === '主题赛' )form.type = 0
  if( newV === '俱乐部联赛(仅限俱乐部参与)' )form.type = 1
},{immediate: true})
const changeBanner = (ipfs: any) => {
  // eslint-disable-next-line no-multi-assign
  form.banner = banneFile = ipfs
}
const changeRules = (ipfs: any) => {
  // eslint-disable-next-line no-multi-assign
  form.rulePic = rulePicFile = ipfs
}
const changeReward = (data: any) => {
  form.rewards = data.map((item: any) =>({
    name: item.name,
    startRank: item.startRank,
    finishRank: item.endRank,
    itemList: item.props.map((list: any)=>({ itemId: list.id,itemCount: list.count }))
  }))
}

const getNameLeng = (str: string) => {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length;
}

let compId: string = $ref('')
const axiosCreate = () => {
  createCompetition(form).then(({data}) => {
      compId = data
      Message.success('success')
  }).finally(()=>setLoading(false))
}


const uploadComRef: any = $ref()
const uploadComRef2: any = $ref()
let countUpload: number = $ref(0)
const handleSubmit = ({errors, values}: {
    values: Record<string, LoginData>,
    errors: Record<string, ValidatedError> | undefined
  }) => {
    countUpload = 0
    // console.log('values:', values, '\nerrors:', errors)
    const nameLen = getNameLeng(form.name)
    const ruleLen = getNameLeng(form.rule)
    if( !errors && nameLen >= 4 && nameLen <= 18 && form.banner && form.rewards.length && ((form.rule && ruleLen >= 8) || form.rulePic) ){
      setLoading(true)
      try {
          uploadComRef.uploadRequest(banneFile.file).then((result: any) => { // banner图片上传之后
            form.banner = result;
            countUpload +=1
            if( !form.rulePic || (form.rulePic && countUpload === 2) ) {
              axiosCreate()
            }
          }).catch(()=>{ Message.error('图片上传失败,请重试');setLoading(false)})

          if( form.rulePic ) uploadComRef2.uploadRequest(rulePicFile.file).then((result: any) => { // 规则图片上传之后
            form.rulePic = result;
            countUpload +=1
            if( countUpload === 2 ){
              axiosCreate()
            }
          }).catch(()=>{ Message.error('图片上传失败,请重试');setLoading(false)})

        } catch (error) {
          setLoading(false)
        }
    }else{
      if( !form.name ) {Message.error('赛事名称不能为空'); return}
      if( nameLen < 4 || nameLen > 18 ) {Message.error('赛事名称最少填写2个字，最多可填写18个字');return}
      if( !form.banner ) {Message.error('赛事banner不能为空');return}
      if( !form.rewards.length ) {Message.error('赛事奖励不能为空');return}
      if( !form.rule && !form.rulePic ) {Message.error('赛事规则不能为空');return}
      if( form.rule && ruleLen < 8 ) Message.error('赛事规则文字过短')
    }
}


const toPoint = () => {
  if( compId ){
    router.push({ path: '/newpoint', query: { compId,name: form.name,url:form.banner } });
  }else{
    Message.info('请先创建赛事')
  }
}

onMounted(() => {
})
</script>

<style lang="less" scoped>
  .form-group {
    :deep(.arco-form){
      .arco-row:nth-child(2)>.arco-form-item-label-col{
        height: 40px;
        line-height: 40px;
      }
      .arco-row:nth-child(3)>.arco-form-item-label-col,
      .arco-row:nth-child(4)>.arco-form-item-label-col,
      .arco-row:nth-child(5)>.arco-form-item-label-col{
        margin-top: 9px;
      }
      .text-rule>div:last-child{
        &:hover{
          background-color: transparent;
        }
        .arco-textarea{
          padding: 9px 20px;
          color: #3A3F63;
          resize: none;
          border-radius: 4px;
          border: 1px solid #DAE0F2;
        }
      }
    }
  }
</style>
