import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import { HistoryItem as HistoryItemType } from '@/types/contentHelper';

interface HistoryItemProps {
  item: HistoryItemType;
  onRemove: (id: string) => void;
  onUseText: (text: string) => void;
  onCopy: (text: string, id: string) => void;
  copied: string | null;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  onRemove,
  onUseText,
  onCopy,
  copied
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'À l\'instant' : `Il y a ${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Badge className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
              {item.transformationLabel}
            </Badge>
            <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
              {item.contentTypeLabel}
            </Badge>
          </div>
          <span className="text-xs text-slate-500">
            {formatDate(item.timestamp)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="h-6 w-6 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {/* Texte original */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <span>Texte original</span>
          </label>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
              {item.originalText}
            </p>
          </div>
        </div>
        
        {/* Flèche de transformation */}
        <div className="flex justify-center">
          <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
            <ArrowRight className="h-3 w-3 text-white" />
          </div>
        </div>
        
        {/* Texte transformé */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <span>Résultat</span>
          </label>
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 mb-3">
              {item.transformedText}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                {item.transformedText.length} caractères
              </Badge>
              <div className="flex space-x-2 ml-auto">
                <Button
                  onClick={() => onUseText(item.transformedText)}
                  size="sm"
                  className="flex-1 h-7 px-3 text-xs bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 rounded-lg"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Utiliser
                </Button>
                <Button
                  onClick={() => onCopy(item.transformedText, `history-${item.id}`)}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-7 px-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg"
                >
                  {copied === `history-${item.id}` ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 