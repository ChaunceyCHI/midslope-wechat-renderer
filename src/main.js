import { renderMidslopeHtml } from "./renderer.js";
import { copyHtmlToClipboard } from "./clipboard.js";

const markdownInput = document.getElementById("markdownInput");
const preview = document.getElementById("preview");
const renderBtn = document.getElementById("renderBtn");
const copyBtn = document.getElementById("copyBtn");

let currentHtml = "";

renderBtn.addEventListener("click", () => {
  currentHtml = renderMidslopeHtml(markdownInput.value);
  preview.innerHTML = currentHtml;
});

copyBtn.addEventListener("click", async () => {
  if (!currentHtml) {
    currentHtml = renderMidslopeHtml(markdownInput.value);
    preview.innerHTML = currentHtml;
  }

  try {
    await copyHtmlToClipboard(currentHtml);
    alert("已复制为富文本，可以粘贴到微信公众号编辑器。");
  } catch (error) {
    console.error(error);
    alert("复制失败。请检查浏览器权限，或先点击生成预览后手动复制。");
  }
});