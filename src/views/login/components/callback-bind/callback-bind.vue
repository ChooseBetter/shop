<template>
  <Form
    ref="formRef"
    :validation-schema="schema"
    v-slot="{errors}"
    autocomplete="off"
    class="xtx-form"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="绑定的手机号"
        />
      </div>
      <div v-if="errors.mobile" :class="{err: errors.mobile}" class="error">
        {{ errors.mobile }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span @click="send" class="code">
          {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
        </span>
      </div>
      <div v-if="errors.code" :class="{err: errors.code}" class="error">
        {{ errors.code }}
      </div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script setup lang="ts">
import {defineProps, reactive, ref, onUnmounted} from "vue";
import {Form, Field} from "vee-validate";
import QC from "qc";
import veeSchema from "@/utils/vee-validate-schema";
import {userQQBindCode, userQQBindLogin} from "@/api/user";
import {useIntervalFn} from "@vueuse/core";
import Message from "@/components/library/Message";
import useStore from "@/store";
import {useRouter} from "vue-router";
const props = defineProps({
  unionId: {
    type: String,
    default: "",
  },
});

const nickname = ref(null);
const avatar = ref(null);
const formRef: any = ref(null);
//获取用户信息
if (QC.Login.check()) {
  QC.api("get_user_info").success((res: any) => {
    avatar.value = res.data.figureurl_1;
    nickname.value = res.data.nickname;
  });
}
const form: any = reactive({
  mobile: null,
  code: null,
});
const schema = {
  mobile: veeSchema.mobile,
  code: veeSchema.code,
};

// pause暂停, resume销毁 useIntervalFn(回调函数，执行间隔，是否立即开启)
const time = ref(0);
const {pause, resume} = useIntervalFn(
  () => {
    time.value--;
    if (time.value <= 0) {
      pause();
    }
  },
  1000,
  false
);
onUnmounted(() => {
  pause();
});
//发送验证码
const send = async () => {
  const valid = veeSchema.mobile(form.mobile);
  const {mobile}: any = form;
  if (valid === true) {
    if (time.value === 0) {
      await userQQBindCode(mobile);
      Message({type: "success", text: "发送成功"});
      time.value = 60;
      resume();
    }
  } else {
    //失败，使用vee的错误函数显示错误信息 setFieldError(字段，错误信息)
    formRef.value.setFieldError("mobile", valid);
  }
};

//立即绑定
const {userStore, cartStore} = useStore();
const router = useRouter();
const submit = () => {
  const valid = formRef.value.validate();
  if (valid) {
    userQQBindLogin({unionId: props.unionId, ...form})
      .then((data) => {
        // 存储信息
        const {id, account, avatar, mobile, nickname, token} = data.result;
        userStore.setUser({id, account, avatar, mobile, nickname, token});
        //跳转
        cartStore.mergeCart().then(() => {
          router.push(userStore.redirectUrl || "/");
          Message({type: "success", text: "QQ绑定成功"});
        });
      })
      .catch((err) => {
        Message({type: "error", text: err.response.data.message});
      });
  }
};
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
