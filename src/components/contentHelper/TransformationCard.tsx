import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Check, Copy, Loader2 } from 'lucide-react';
import { TransformationOption, ContentType } from '@/types/contentHelper';

interface TransformationCardProps {
  option: TransformationOption;
  suggestion?: string;
  isLoading: boolean;
  selectedContentType?: ContentType;
  currentText: string;
  onTransform: () => void;
  onUseText: (text: string) => void;
  onCopy: (text: string, optionId: string) => void;
  copied: string | null;
}

export const TransformationCard: React.FC<TransformationCardProps> = ({
  option,
  suggestion,
  isLoading,
  selectedContentType,
  currentText,
  onTransform,
  onUseText,
  onCopy,
  copied
}) => {
  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
            <option.icon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-slate-800">{option.label}</span>
        </div>
        <Button
          onClick={onTransform}
          disabled={isLoading || !currentText.trim()}
          size="sm"
          className="h-7 w-7 p-0 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin text-white" />
          ) : (
            <RefreshCw className="h-3 w-3 text-white" />
          )}
        </Button>
      </div>
      
      <p className="text-xs text-slate-600 leading-relaxed">{option.description}</p>
      
      {suggestion && (
        <div className="space-y-3">
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <p className="text-sm mb-3 text-slate-700 leading-relaxed">{suggestion}</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-700 bg-indigo-50">
                  {suggestion.length} characters
                </Badge>
                {selectedContentType?.charLimit && (
                  <Badge 
                    className={`text-xs border-0 ${
                      suggestion.length > selectedContentType.charLimit 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    }`}
                  >
                    {suggestion.length <= selectedContentType.charLimit ? '✓' : '⚠️'}
                  </Badge>
                )}
              </div>
              <div className="flex space-x-2 w-full">
                <Button
                  onClick={() => onUseText(suggestion)}
                  size="sm"
                  className="flex-1 h-7 px-3 text-xs bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 rounded-lg shadow-sm"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Use
                </Button>
                <Button
                  onClick={() => onCopy(suggestion, option.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-7 px-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 rounded-lg"
                >
                  {copied === option.id ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 