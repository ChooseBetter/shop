// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器
import defaultImg from "@/assets/images/200.png";
import Message from "./Message";
import Confirm from "./Confirm";

//批量导入组件
const importFn = require.context("./", false, /\.vue$/);

export default {
  install(app: any) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    importFn.keys().forEach((path) => {
      const component = importFn(path).default;
      if (!component.name) {
        component.name = "";
        const name = component.__name;
        const arr = name.split("-");
        arr.forEach((item: any) => {
          component.name += item.slice(0, 1).toUpperCase() + item.slice(1);
        });
      }
      app.component(component.name, component);
    });
    //自定义指令
    defineDirective(app);

    //全局属性
    app.config.globalProperties.$message = Message;
    app.config.globalProperties.$confirm = Confirm;
  },
};

//定义指令
const defineDirective = (app: any) => {
  //图片懒加载
  //原理：先存储图片地址，但不存在src上，当图片进入可视区，将存储图片的地址设置给图片元素即可
  app.directive("lazy", {
    mounted(el: any, binding: any) {
      const observe = new IntersectionObserver(
        ([{isIntersecting}]) => {
          if (isIntersecting) {
            // 停止观察
            observe.unobserve(el);
            // 处理图片加载失败
            el.onerror = () => {
              el.src = defaultImg;
            };
            // 处理图片加载成功
            //el.load = () => {};
            // 把指令的值设置给el的src
            el.src = binding.value;
          }
        },
        {threshold: 0}
      );
      observe.observe(el);
    },
  });
};
