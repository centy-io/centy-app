'use client'

import type { Editor } from '@tiptap/react'

interface ToolbarBlockButtonsProps {
  editor: Editor
}

interface HeadingButtonsProps {
  editor: Editor
}

function HeadingButtons({ editor }: HeadingButtonsProps) {
  return (
    <div className="toolbar-group">
      {([1, 2, 3] as const).map(level => (
        <button
          key={level}
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={editor.isActive('heading', { level }) ? 'active' : ''}
          title={`Heading ${level}`}
        >
          {`H${level}`}
        </button>
      ))}
    </div>
  )
}

interface BlockButtonConfig {
  label: string
  title: string
  activeKey: string
  onClick: () => void
  isActive: boolean
}

function buildBlockButtonConfigs(editor: Editor): BlockButtonConfig[] {
  return [
    {
      label: '\u2022',
      title: 'Bullet List',
      activeKey: 'bulletList',
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      label: '1.',
      title: 'Numbered List',
      activeKey: 'orderedList',
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      label: '"',
      title: 'Blockquote',
      activeKey: 'blockquote',
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      label: '{ }',
      title: 'Code Block',
      activeKey: 'codeBlock',
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
  ]
}

export function ToolbarBlockButtons({ editor }: ToolbarBlockButtonsProps) {
  const blockButtons = buildBlockButtonConfigs(editor)
  return (
    <>
      <HeadingButtons editor={editor} />
      <div className="toolbar-separator" />
      <div className="toolbar-group">
        {blockButtons.map(btn => (
          <button
            key={btn.activeKey}
            type="button"
            onClick={btn.onClick}
            className={btn.isActive ? 'active' : ''}
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </>
  )
}
