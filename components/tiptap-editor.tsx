'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Highlighter, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Code2, Minus,
  Link as LinkIcon, Image as ImageIcon, Eraser,
  Undo2, Redo2, Heading1, Heading2, Heading3,
  Link2Off,
} from 'lucide-react'
import { useState, useCallback, useRef } from 'react'

interface TiptapEditorProps {
  content?: string | object
  onChange?: (content: object) => void
  editable?: boolean
}

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 flex items-center justify-center rounded-md text-sm transition-all duration-100
        disabled:opacity-30 disabled:cursor-not-allowed
        ${active
          ? 'bg-foreground text-background shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-0.5 shrink-0" />
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>
}

// Inline link popover
function LinkPopover({ onSubmit, onClose }: { onSubmit: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2 bg-background border border-border rounded-lg shadow-lg px-3 py-2">
      <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <input
        ref={inputRef}
        autoFocus
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://..."
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); onSubmit(url) }
          if (e.key === 'Escape') onClose()
        }}
        className="text-sm bg-transparent outline-none w-48 text-foreground placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={() => onSubmit(url)}
        className="text-xs font-medium text-foreground bg-secondary hover:bg-secondary/80 px-2 py-1 rounded-md transition-colors"
      >
        Terapkan
      </button>
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ✕
      </button>
    </div>
  )
}

export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
  const [showLinkPopover, setShowLinkPopover] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: false }),
      Typography,
      ImageExtension.configure({ allowBase64: true }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
      Placeholder.configure({
        placeholder: 'Mulai menulis artikel...',
      }),
    ],
    content: content
      ? Array.isArray(content)
        ? { type: 'doc', content: content as object[] }
        : content
      : '',
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getJSON())
      const text = editor.getText()
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount(words)
    },
  })

  const handleAddLink = useCallback((url: string) => {
    if (!url || !editor) return
    const href = url.startsWith('http') ? url : `https://${url}`
    editor.chain().focus().setLink({ href }).run()
    setShowLinkPopover(false)
  }, [editor])

  const handleAddImage = useCallback(() => {
    const url = window.prompt('Masukkan URL gambar:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  if (!editable) {
    return (
      <EditorContent
        editor={editor}
        className="
          prose prose-neutral dark:prose-invert max-w-none
          prose-p:leading-7 prose-p:text-foreground/80 prose-p:text-base
          prose-headings:font-lora prose-headings:text-foreground prose-headings:font-bold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-h2:mt-10 prose-h3:mt-8
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic
          prose-code:text-sm prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
          prose-pre:bg-secondary prose-pre:rounded-xl prose-pre:text-sm
          prose-img:rounded-xl prose-img:shadow-md
          prose-li:leading-7 prose-hr:border-border/40
        "
      />
    )
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background shadow-sm focus-within:ring-1 focus-within:ring-foreground/20 transition-shadow">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-secondary/30 border-b border-border">
        {/* History */}
        <ToolbarGroup>
          <ToolbarButton title="Undo (⌘Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Redo (⌘⇧Z)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="w-3.5 h-3.5" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Headings */}
        <ToolbarGroup>
          <ToolbarButton title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="w-3.5 h-3.5" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Inline formatting */}
        <ToolbarGroup>
          <ToolbarButton title="Bold (⌘B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Italic (⌘I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Underline (⌘U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}>
            <Highlighter className="w-3.5 h-3.5" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Alignment */}
        <ToolbarGroup>
          <ToolbarButton title="Align Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <AlignLeft className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Align Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <AlignCenter className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Align Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <AlignRight className="w-3.5 h-3.5" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Lists */}
        <ToolbarGroup>
          <ToolbarButton title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Blocks */}
        <ToolbarGroup>
          <ToolbarButton title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Inline Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Code Block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="w-3.5 h-3.5" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Media & Link */}
        <ToolbarGroup>
          <div className="relative">
            <ToolbarButton title="Insert Link (⌘K)" active={editor.isActive('link') || showLinkPopover} onClick={() => setShowLinkPopover(v => !v)}>
              <LinkIcon className="w-3.5 h-3.5" />
            </ToolbarButton>
            {showLinkPopover && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <LinkPopover onSubmit={handleAddLink} onClose={() => setShowLinkPopover(false)} />
              </div>
            )}
          </div>
          {editor.isActive('link') && (
            <ToolbarButton title="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()}>
              <Link2Off className="w-3.5 h-3.5" />
            </ToolbarButton>
          )}
          <ToolbarButton title="Insert Image" onClick={handleAddImage}>
            <ImageIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        {/* Clear */}
        <ToolbarButton title="Clear Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <Eraser className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose-dark p-5 min-h-96 focus-within:outline-none"
      />

      {/* Footer — word count */}
      <div className="flex items-center justify-end px-4 py-1.5 border-t border-border bg-secondary/20">
        <span className="text-xs text-muted-foreground">{wordCount} kata</span>
      </div>
    </div>
  )
}