
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

export interface EditorMarker {
  line: number;
  message: string;
  severity?: 'error' | 'warning' | 'info';
}

interface EditorProps {
  value: string;
  language: string;
  themeName?: string;
  onChange: (value: string) => void;
  markers?: EditorMarker[];
}

const Editor: React.FC<EditorProps> = ({ value, language, themeName = 'vs-dark', onChange, markers = [] }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    // إعداد بيئة Monaco
    (window as any).MonacoEnvironment = {
      getWorkerUrl: function (_moduleId: any, label: string) {
        const base = 'https://esm.sh/monaco-editor@0.55.1/esm/vs';
        if (label === 'json') return `${base}/language/json/json.worker?worker`;
        if (label === 'css' || label === 'scss' || label === 'less') return `${base}/language/css/css.worker?worker`;
        if (label === 'html' || label === 'handlebars' || label === 'razor') return `${base}/language/html/html.worker?worker`;
        if (label === 'typescript' || label === 'javascript') return `${base}/language/typescript/ts.worker?worker`;
        return `${base}/editor/editor.worker?worker`;
      }
    };

    // تعريف الثيم الذهبي الفاخر لـ CODE BATELL
    monaco.editor.defineTheme('golden-batell', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FFD700', fontStyle: 'bold' },
        { token: 'comment', foreground: '856404', fontStyle: 'italic' },
        { token: 'string', foreground: 'FFFACD' },
        { token: 'number', foreground: 'FFEC8B' },
        { token: 'type', foreground: 'DAA520' },
        { token: 'delimiter', foreground: 'B8860B' },
        { token: 'identifier', foreground: 'FFFFFF' },
      ],
      colors: {
        'editor.background': '#0d0c00',
        'editor.lineHighlightBackground': '#1a1600',
        'editorCursor.foreground': '#FFD700',
        'editor.selectionBackground': '#4d3d00',
        'editorLineNumber.foreground': '#856404',
        'editorLineNumber.activeForeground': '#FFD700',
        'editor.inactiveSelectionBackground': '#221d00',
        'editorIndentGuide.background': '#1a1600',
        'editorIndentGuide.activeBackground': '#332a00',
      }
    });

    if (editorRef.current) {
      monacoInstance.current = monaco.editor.create(editorRef.current, {
        value,
        language: language === 'cpp' ? 'cpp' : language,
        theme: themeName,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 16,
        fontFamily: "'Fira Code', 'Courier New', monospace",
        padding: { top: 20 },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        roundedSelection: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: 'off',
        cursorStyle: 'line',
        unicodeHighlight: { ambiguousCharacters: false },
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          useShadows: false
        }
      });

      // التعامل مع تغيير المحتوى داخلياً
      monacoInstance.current.onDidChangeModelContent(() => {
        const newValue = monacoInstance.current?.getValue() || '';
        if (!isInternalChange.current) {
          isInternalChange.current = true;
          onChange(newValue);
          // نستخدم setTimeout بسيط لإعادة العلم للحالة الأصلية بعد انتهاء دورة React
          setTimeout(() => { isInternalChange.current = false; }, 0);
        }
      });

      return () => {
        monacoInstance.current?.dispose();
      };
    }
  }, []);

  // تحديث الثيم ديناميكياً
  useEffect(() => {
    if (monacoInstance.current) {
      monaco.editor.setTheme(themeName);
    }
  }, [themeName]);

  // تحديث الـ Markers (تسليط الضوء على الأخطاء)
  useEffect(() => {
    if (monacoInstance.current) {
      const model = monacoInstance.current.getModel();
      if (model) {
        const monacoMarkers: monaco.editor.IMarkerData[] = markers.map(m => ({
          startLineNumber: m.line,
          startColumn: 1,
          endLineNumber: m.line,
          endColumn: 1000,
          message: m.message,
          severity: m.severity === 'warning' ? monaco.MarkerSeverity.Warning : 
                    m.severity === 'info' ? monaco.MarkerSeverity.Info : 
                    monaco.MarkerSeverity.Error
        }));
        monaco.editor.setModelMarkers(model, 'owner', monacoMarkers);
      }
    }
  }, [markers]);

  // تحديث القيمة من الخارج مع الحفاظ على مكان المؤشر
  useEffect(() => {
    if (monacoInstance.current && !isInternalChange.current) {
      const editor = monacoInstance.current;
      const currentValue = editor.getValue();
      
      if (value !== currentValue) {
        const selection = editor.getSelection();
        const scrollPosition = editor.getScrollTop();
        
        isInternalChange.current = true;
        editor.setValue(value);
        isInternalChange.current = false;
        
        if (selection) {
          editor.setSelection(selection);
          editor.setScrollTop(scrollPosition);
        }
      }
    }
  }, [value]);

  return (
    <div 
      ref={editorRef} 
      className="h-full w-full overflow-hidden" 
      style={{ direction: 'ltr', textAlign: 'left' }} 
    />
  );
};

export default Editor;
