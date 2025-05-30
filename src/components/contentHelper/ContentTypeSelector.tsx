import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentType } from '@/types/contentHelper';

interface ContentTypeSelectorProps {
  contentTypes: ContentType[];
  selectedContentType: string;
  onContentTypeChange: (contentTypeId: string) => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentTypes,
  selectedContentType,
  onContentTypeChange
}) => {
  const selectedContentTypeData = contentTypes.find(ct => ct.id === selectedContentType);

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
        <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"></div>
        <span>Content type</span>
      </label>
      
      {/* Horizontal scrollable container */}
      <div className="relative">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {contentTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedContentType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => onContentTypeChange(type.id)}
              className={`flex-shrink-0 h-8 px-3 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedContentType === type.id
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl border-0'
                  : 'bg-white/60 hover:bg-violet-50 border-violet-200 text-slate-700 hover:border-violet-300'
              }`}
            >
              <type.icon className="h-3 w-3 mr-1.5" />
              <span>{type.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Fade effect for scroll indication */}
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none"></div>
      </div>
      
      {selectedContentTypeData && selectedContentTypeData.id !== 'general' && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <selectedContentTypeData.icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-900">
              {selectedContentTypeData.label}
            </span>
            {selectedContentTypeData.charLimit && (
              <Badge className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                Max {selectedContentTypeData.charLimit} chars
              </Badge>
            )}
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">
            {selectedContentTypeData.specificities}
          </p>
        </div>
      )}
    </div>
  );
}; 