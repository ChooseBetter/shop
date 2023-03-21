// 通过该函数调用xtx-message组件
import {createVNode, render} from "vue";
import XtxMessage from "./xtx-message.vue";

const div = document.createElement("div");
div.setAttribute("class", "xtx-message-container");
document.body.appendChild(div);

// 定时器
let timer: any = null;

export default ({type, text}: any) => {
  // createVNode(组件，属性对象(props))
  const vnode = createVNode(XtxMessage, {type, text});
  // render(虚拟节点,DOM容器)
  render(vnode, div);
  // 销毁组件
  clearTimeout(timer);
  timer = setTimeout(() => {
    render(null, div);
  }, 3000);
};
