export async function copyHtmlToClipboard(html) {
  if (navigator.clipboard && window.ClipboardItem) {
    const htmlBlob = new Blob([html], { type: "text/html" });
    const textBlob = new Blob([html], { type: "text/plain" });

    const item = new ClipboardItem({
      "text/html": htmlBlob,
      "text/plain": textBlob,
    });

    await navigator.clipboard.write([item]);
    return;
  }

  fallbackCopyHtml(html);
}

function fallbackCopyHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  temp.contentEditable = "true";
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  temp.style.top = "-9999px";

  document.body.appendChild(temp);

  const range = document.createRange();
  range.selectNodeContents(temp);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand("copy");

  selection.removeAllRanges();
  document.body.removeChild(temp);
}