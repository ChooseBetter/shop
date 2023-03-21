<template>
  <Form
    ref="formRef"
    :validation-schema="schema"
    v-slot="{errors}"
    class="xtx-form"
    autocomplete="false"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          v-model="form.account"
          name="account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div v-if="errors.account" class="error">
        {{ errors.account }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">
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
          placeholder="请输入验证码"
        />
        <span @click="send()" class="code">
          {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
        </span>
      </div>
      <div v-if="errors.code" class="error">
        {{ errors.code }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          v-model="form.password"
          name="password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div v-if="errors.password" class="error">
        {{ errors.password }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          v-model="form.rePassword"
          name="rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div v-if="errors.rePassword" class="error">
        {{ errors.rePassword }}
      </div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script setup lang="ts">
import {defineProps, reactive, ref, onUnmounted} from "vue";
import {Form, Field} from "vee-validate";
import veeSchema from "@/utils/vee-validate-schema";
import {useIntervalFn} from "@vueuse/core";
import {userQQPatchCode, userQQPatchLogin} from "@/api/user";
import Message from "@/components/library/Message";
import useStore from "@/store";
import {useRouter} from "vue-router";

const props = defineProps({
  unionId: {
    type: String,
    default: "",
  },
});

const form: any = reactive({
  account: null,
  mobile: null,
  code: null,
  password: null,
  rePassword: null,
});

const schema = {
  account: veeSchema.accountApi,
  mobile: veeSchema.mobile,
  code: veeSchema.code,
  password: veeSchema.password,
  rePassword: veeSchema.rePassword,
};

const formRef: any = ref(null);

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
      await userQQPatchCode(mobile);
      Message({type: "success", text: "发送成功"});
      time.value = 60;
      resume();
    }
  } else {
    formRef.value.setFieldError("mobile", valid);
  }
};

//立即提交
const {userStore, cartStore} = useStore();
const router = useRouter();
const submit = () => {
  const valid = formRef.value.validate();
  if (valid) {
    userQQPatchLogin({unionId: props.unionId, ...form})
      .then((data) => {
        // 存储信息
        const {id, account, avatar, mobile, nickname, token} = data.result;
        userStore.setUser({id, account, avatar, mobile, nickname, token});
        //跳转
        cartStore.mergeCart().then(() => {
          router.push(userStore.redirectUrl || "/");
          Message({type: "success", text: "QQ完善信息成功"});
        });
      })
      .catch((err) => {
        Message({type: "error", text: err.response.data.message});
      });
  }
};
</script>

<style scoped lang="less">
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
