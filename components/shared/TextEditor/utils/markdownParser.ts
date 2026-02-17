import TurndownService from 'turndown'

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})

// Custom rules for better markdown conversion
turndownService.addRule('codeBlock', {
  filter: ['pre'],
  replacement: function (content, node) {
    const codeNode = (node as HTMLElement).querySelector('code')
    const classMatch =
      codeNode && codeNode.className
        ? codeNode.className.match(/language-(\w+)/)
        : null
    const language = (classMatch ? classMatch[1] : '') || ''
    return `\n\`\`\`${language}\n${content}\n\`\`\`\n`
  },
})

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html)
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''

  // Simple markdown to HTML conversion
  let html = markdown
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks (before other transformations)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escapedCode = code.trim()
    return `<pre><code class="language-${lang || 'plaintext'}">${escapedCode}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>')

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  // eslint-disable-next-line security/detect-unsafe-regex
  html = html.replace(/<li>[^<]*<\/li>(?:\n<li>[^<]*<\/li>)*/g, '<ul>$&</ul>')

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>')

  // Paragraphs (lines not already in tags)
  html = html
    .split('\n\n')
    .map(block => {
      if (block.startsWith('<')) return block
      if (block.trim() === '') return ''
      return `<p>${block.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')

  return html
}
