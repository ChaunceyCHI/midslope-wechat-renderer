import { marked } from "marked";
import juice from "juice";
import themeCss from "./theme.css?raw";

function preprocessMarkdown(markdown) {
  return markdown.replace(/<!-- figure -->\s*!\[(.*?)\]\((.*?)\)/g, (_match, alt, src) => {
    return `<figure><img src="${src}" alt="${alt}"><figcaption>${alt}</figcaption></figure>`;
  });
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