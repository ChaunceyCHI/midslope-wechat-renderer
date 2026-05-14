import { marked } from "marked";
import juice from "juice";
import themeCss from "./theme.css?raw";

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function preprocessMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  let figurePending = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "<!-- figure -->") {
      figurePending = true;
      continue;
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)\s*$/);

    if (figurePending && imageMatch) {
      const alt = imageMatch[1];
      const src = imageMatch[2];

      output.push(
        `<figure><img src="${escapeHtmlAttr(src)}" alt="${escapeHtmlAttr(alt)}"><figcaption>${alt}</figcaption></figure>`
      );

      output.push("");
      figurePending = false;
      continue;
    }

    if (figurePending) {
      output.push("<!-- figure -->");
      figurePending = false;
    }

    output.push(line);
  }

  if (figurePending) {
    output.push("<!-- figure -->");
  }

  return output.join("\n");
}

function postprocessHtml(html) {
  let result = html
    .replace(
      /<h1>([\s\S]*?)<\/h1>/g,
      '<h1><span class="midslope-h1-text">$1</span></h1>'
    )
    .replace(
      /<h2>([\s\S]*?)<\/h2>/g,
      '<h2><span class="midslope-title-mark"></span><span class="midslope-title-text">$1</span></h2>'
    )
    .replace(
      /<h3>([\s\S]*?)<\/h3>/g,
      '<h3><span class="midslope-subtitle-text">$1</span></h3>'
    )
    .replace(
      /<h4>([\s\S]*?)<\/h4>/g,
      '<h4><span class="midslope-minor-dot">•</span><span class="midslope-minor-title-text">$1</span></h4>'
    )
    .replace(
      /<h5>([\s\S]*?)<\/h5>/g,
      '<h5><span class="midslope-soft-title-text">$1</span></h5>'
    )
    .replace(
      /<h6>([\s\S]*?)<\/h6>/g,
      '<h6><span class="midslope-muted-title-text">$1</span></h6>'
    );

  result = result
    .replace(
      /<input\b(?=[^>]*type=["']checkbox["'])(?=[^>]*checked)[^>]*>/gi,
      '<span class="midslope-task-box midslope-task-box-checked">☑</span>'
    )
    .replace(
      /<input\b(?=[^>]*type=["']checkbox["'])(?![^>]*checked)[^>]*>/gi,
      '<span class="midslope-task-box midslope-task-box-unchecked">☐</span>'
    )
    .replace(
      /<li>\s*(<span class="midslope-task-box [^"]+">[☑☐]<\/span>)/g,
      '<li class="midslope-task-list-item">$1'
    );

  return result;
}

export function renderMidslopeHtml(markdown) {
  const preprocessed = preprocessMarkdown(markdown);

  const rawBody = marked.parse(preprocessed, {
    breaks: false,
    gfm: true,
  });

  const body = postprocessHtml(rawBody);

  const fullHtml = `
    <style>
      ${themeCss}
    </style>
    <section class="midslope-root" data-brand="MidSlope" data-platform="wechat">
      ${body}
    </section>
  `;

  return juice(fullHtml, {
    removeStyleTags: true,
    preserveMediaQueries: false,
  });
}