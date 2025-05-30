import React from 'react';
import { TransformationOption, ContentType } from '@/types/contentHelper';
import { TransformationCard } from './TransformationCard';

interface TransformationGridProps {
  transformationOptions: TransformationOption[];
  suggestions: { [key: string]: string };
  isLoading: boolean;
  selectedContentType?: ContentType;
  currentText: string;
  onTransform: (option: TransformationOption) => void;
  onUseText: (text: string) => void;
  onCopy: (text: string, optionId: string) => void;
  copied: string | null;
}

export const TransformationGrid: React.FC<TransformationGridProps> = ({
  transformationOptions,
  suggestions,
  isLoading,
  selectedContentType,
  currentText,
  onTransform,
  onUseText,
  onCopy,
  copied
}) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
        <span>Choose a transformation</span>
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {transformationOptions.map((option) => (
          <TransformationCard
            key={option.id}
            option={option}
            suggestion={suggestions[option.id]}
            isLoading={isLoading}
            selectedContentType={selectedContentType}
            currentText={currentText}
            onTransform={() => onTransform(option)}
            onUseText={onUseText}
            onCopy={onCopy}
            copied={copied}
          />
        ))}
      </div>
    </div>
  );
}; 