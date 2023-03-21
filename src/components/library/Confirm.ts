import {createVNode, render} from "vue";
import XtxConfirm from "./xtx-confirm.vue";

const div = document.createElement("div");
div.setAttribute("class", "xtx-confirm-container");
document.body.appendChild(div);

export default ({title, text}: any) => {
  return new Promise((resolve, reject) => {
    const confirmCallback = () => {
      render(null, div);
      resolve("确认");
    };
    const cancelCallback = () => {
      render(null, div);
      //reject(new Error("点击取消"));
    };
    const vn = createVNode(XtxConfirm, {
      title,
      text,
      confirmCallback,
      cancelCallback,
    });
    render(vn, div);
  });
};
