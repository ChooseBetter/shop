import {useIntersectionObserver} from "@vueuse/core";
import {onUnmounted, ref} from "vue";
import dayjs from "dayjs";
import {useIntervalFn} from "@vueuse/core";

export const useLazyData = (apiFn: any) => {
  const target = ref(null);
  const result = ref([]);
  //stop 停止观察
  const {stop} = useIntersectionObserver(
    // 监听的目标元素
    target,
    ([{isIntersecting}], observerElement) => {
      // isIntersecting是否进入可视区
      if (isIntersecting) {
        stop();
        // 调用API获取数据
        apiFn().then((data: any) => {
          result.value = data.result;
        });
      }
    },
    //配置选项：设置门槛，容器和可视区交叉的占比，相交比例大于0就触发
    {threshold: 0}
  );
  return {result, target};
};

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时
  const time = ref(0);
  const timeText = ref("");
  const {pause, resume} = useIntervalFn(
    () => {
      time.value--;
      timeText.value = dayjs.unix(time.value).format("mm分ss秒");
      if (time.value <= 0) {
        pause;
      }
    },
    1000,
    false
  );
  onUnmounted(() => {
    pause();
  });

  // 开启定时器 countdown 倒计时时间
  const start = (countDown: number) => {
    time.value = countDown;
    timeText.value = dayjs.unix(time.value).format("mm分ss秒");
    resume();
  };
  return {start, timeText};
};
