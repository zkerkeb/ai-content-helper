import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, History } from 'lucide-react';
import { HistoryItem as HistoryItemType } from '@/types/contentHelper';
import { HistoryItem } from './HistoryItem';

interface HistorySectionProps {
  history: HistoryItemType[];
  onRemoveItem: (id: string) => void;
  onClearHistory: () => void;
  onUseText: (text: string) => void;
  onCopy: (text: string, id: string) => void;
  copied: string | null;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onRemoveItem,
  onClearHistory,
  onUseText,
  onCopy,
  copied
}) => {
  return (
    <Card className="mb-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg">Historique des transformations</span>
          </CardTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Vider
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <History className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">Aucune transformation dans l'historique</p>
            <p className="text-slate-400 text-xs mt-1">Vos transformations apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
            {history.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onRemove={onRemoveItem}
                onUseText={onUseText}
                onCopy={onCopy}
                copied={copied}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 