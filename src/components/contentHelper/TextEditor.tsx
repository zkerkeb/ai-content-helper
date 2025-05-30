import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, CheckCircle, Loader2 } from 'lucide-react';
import { ContentType } from '@/types/contentHelper';

interface TextEditorProps {
  currentText: string;
  onTextChange: (text: string) => void;
  onCorrectText: () => void;
  onCopyText: () => void;
  onClearAll: () => void;
  selectedContentType?: ContentType;
  isLoading: boolean;
  copied: string | null;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  currentText,
  onTextChange,
  onCorrectText,
  onCopyText,
  onClearAll,
  selectedContentType,
  isLoading,
  copied
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(140, textarea.scrollHeight) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [currentText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
    setTimeout(adjustTextareaHeight, 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
          <span>Your text</span>
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          disabled={!currentText}
          className="h-7 px-3 text-xs text-slate-500 hover:text-slate-700 hover:bg-violet-50 rounded-lg"
        >
          Clear all
        </Button>
      </div>
      
      <Textarea
        value={currentText}
        onChange={handleTextChange}
        placeholder="✍️ Write or paste your text here..."
        className="min-h-[140px] text-sm resize-none border-violet-200 focus:border-violet-400 focus:ring-violet-400 rounded-xl bg-white/60 backdrop-blur-sm overflow-hidden"
        ref={textareaRef}
      />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs border-violet-200 text-violet-700 bg-violet-50">
            {currentText.length} characters
          </Badge>
          {selectedContentType?.charLimit && (
            <Badge 
              className={`text-xs border-0 ${
                currentText.length > selectedContentType.charLimit 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              }`}
            >
              {selectedContentType.charLimit - currentText.length} remaining
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyText}
            disabled={!currentText.trim()}
            className="h-7 px-2 text-xs text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg"
          >
            {copied === 'main-text' ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCorrectText}
            disabled={isLoading || !currentText.trim()}
            className="h-7 px-3 text-xs text-violet-600 border-violet-200 hover:bg-violet-50 hover:border-violet-300 rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            Correct
          </Button>
        </div>
      </div>
    </div>
  );
}; 