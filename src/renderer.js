import { marked } from "marked";
import juice from "juice";
import themeCss from "./theme.css?raw";

function preprocessMarkdown(markdown) {
  return markdown.replace(/<!-- figure -->\s*!\[(.*?)\]\((.*?)\)/g, (_match, alt, src) => {
    return `<figure><img src="${src}" alt="${alt}"><figcaption>${alt}</figcaption></figure>`;
  });
}

function postprocessHtml(html) {
  return html
    .replace(
      /<h2>(.*?)<\/h2>/g,
      '<h2><span class="midslope-title-mark"></span><span class="midslope-title-text">$1</span></h2>'
    )
    .replace(
      /<h3>(.*?)<\/h3>/g,
      '<h3><span class="midslope-subtitle-text">$1</span></h3>'
    )
    .replace(
      /<h4>(.*?)<\/h4>/g,
      '<h4><span class="midslope-minor-dot">•</span><span class="midslope-minor-title-text">$1</span></h4>'
    );
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