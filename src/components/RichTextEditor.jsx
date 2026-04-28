import { useState, useRef } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = "Enter text..." }) {
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtonStyle = {
    padding: '8px 12px',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    transition: 'all 0.2s'
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'];
  const fontSizes = ['1', '2', '3', '4', '5', '6', '7'];

  return (
    <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        background: '#f8fafc',
        padding: '12px',
        borderBottom: '2px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Text Formatting */}
        <button
          onClick={() => execCommand('bold')}
          style={toolbarButtonStyle}
          title="Bold (Ctrl+B)"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => execCommand('italic')}
          style={toolbarButtonStyle}
          title="Italic (Ctrl+I)"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          <em>I</em>
        </button>

        <button
          onClick={() => execCommand('underline')}
          style={toolbarButtonStyle}
          title="Underline (Ctrl+U)"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          <u>U</u>
        </button>

        <button
          onClick={() => execCommand('strikeThrough')}
          style={toolbarButtonStyle}
          title="Strikethrough"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          <s>S</s>
        </button>

        <div style={{ width: '1px', background: '#cbd5e1', margin: '0 4px' }}></div>

        {/* Font Size */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowFontSize(!showFontSize)}
            style={toolbarButtonStyle}
            title="Font Size"
            onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
          >
            Size ▼
          </button>
          {showFontSize && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#fff',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 10,
              padding: '8px'
            }}>
              {fontSizes.map(size => (
                <button
                  key={size}
                  onClick={() => {
                    execCommand('fontSize', size);
                    setShowFontSize(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Size {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Color */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={toolbarButtonStyle}
            title="Text Color"
            onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
          >
            🎨 Color
          </button>
          {showColorPicker && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#fff',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 10,
              padding: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px'
            }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    execCommand('foreColor', color);
                    setShowColorPicker(false);
                  }}
                  style={{
                    width: '30px',
                    height: '30px',
                    background: color,
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => execCommand('hiliteColor', '#FFFF00')}
          style={toolbarButtonStyle}
          title="Highlight"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          🖍️ Highlight
        </button>

        <div style={{ width: '1px', background: '#cbd5e1', margin: '0 4px' }}></div>

        {/* Alignment */}
        <button
          onClick={() => execCommand('justifyLeft')}
          style={toolbarButtonStyle}
          title="Align Left"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          ⬅️
        </button>

        <button
          onClick={() => execCommand('justifyCenter')}
          style={toolbarButtonStyle}
          title="Align Center"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          ↔️
        </button>

        <button
          onClick={() => execCommand('justifyRight')}
          style={toolbarButtonStyle}
          title="Align Right"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          ➡️
        </button>

        <button
          onClick={() => execCommand('justifyFull')}
          style={toolbarButtonStyle}
          title="Justify"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          ⬌
        </button>

        <div style={{ width: '1px', background: '#cbd5e1', margin: '0 4px' }}></div>

        {/* Lists */}
        <button
          onClick={() => execCommand('insertUnorderedList')}
          style={toolbarButtonStyle}
          title="Bullet List"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          • List
        </button>

        <button
          onClick={() => execCommand('insertOrderedList')}
          style={toolbarButtonStyle}
          title="Numbered List"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          1. List
        </button>

        <div style={{ width: '1px', background: '#cbd5e1', margin: '0 4px' }}></div>

        {/* Insert */}
        <button
          onClick={insertLink}
          style={toolbarButtonStyle}
          title="Insert Link"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          🔗 Link
        </button>

        <button
          onClick={insertImage}
          style={toolbarButtonStyle}
          title="Insert Image"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          🖼️ Image
        </button>

        <div style={{ width: '1px', background: '#cbd5e1', margin: '0 4px' }}></div>

        {/* Format */}
        <button
          onClick={() => execCommand('removeFormat')}
          style={toolbarButtonStyle}
          title="Clear Formatting"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          🧹 Clear
        </button>

        <button
          onClick={() => execCommand('undo')}
          style={toolbarButtonStyle}
          title="Undo (Ctrl+Z)"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          ↶ Undo
        </button>

        <button
          onClick={() => execCommand('redo')}
          style={toolbarButtonStyle}
          title="Redo (Ctrl+Y)"
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        style={{
          minHeight: '200px',
          padding: '16px',
          outline: 'none',
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#1e293b',
          background: '#fff'
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
