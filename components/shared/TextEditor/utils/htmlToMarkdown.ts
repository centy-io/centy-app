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
    const codeNode =
      node instanceof HTMLElement ? node.querySelector('code') : null
    const classMatch =
      codeNode && codeNode.className
        ? /language-(\w+)/.exec(codeNode.className)
        : null
    const language = (classMatch ? classMatch[1] : '') || ''
    return `\n\`\`\`${language}\n${content}\n\`\`\`\n`
  },
})

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html)
}
