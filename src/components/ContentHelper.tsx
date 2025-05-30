import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  MessageSquare,
  AlertCircle,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Types and constants
import { ContentHelperProps } from '@/types/contentHelper';
import { CONTENT_TYPES, TRANSFORMATION_OPTIONS } from '@/constants/contentHelperConstants';

// Hooks
import { useHistory } from '@/hooks/useHistory';
import { useContentTransformation } from '@/hooks/useContentTransformation';

// Components
import { HistorySection } from '@/components/contentHelper/HistorySection';
import { ContentTypeSelector } from '@/components/contentHelper/ContentTypeSelector';
import { TextEditor } from '@/components/contentHelper/TextEditor';
import { TransformationGrid } from '@/components/contentHelper/TransformationGrid';

const ContentHelper: React.FC<ContentHelperProps> = ({
  currentText: initialText = '',
  onTextUpdate = () => {},
  onClose = () => {}
}) => {
  // Local state
  const [currentText, setCurrentText] = useState(initialText);
  const [selectedContentType, setSelectedContentType] = useState<string>('general');
  const [copied, setCopied] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Custom hooks
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();
  const { 
    isLoading, 
    error, 
    suggestions, 
    handleTransform, 
    handleCorrectText, 
    clearError 
  } = useContentTransformation();

  // Handlers
  const handleTextChange = (newText: string) => {
    setCurrentText(newText);
    onTextUpdate(newText);
    if (error) clearError();
  };

  const handleTransformClick = async (option: any) => {
    const transformed = await handleTransform(option, currentText, selectedContentType);
    if (transformed) {
      const contentType = CONTENT_TYPES.find(ct => ct.id === selectedContentType);
      addToHistory(
        currentText,
        transformed,
        option.id,
        option.label,
        selectedContentType,
        contentType?.label || 'General'
      );
    }
  };

  const handleCorrectClick = async () => {
    const corrected = await handleCorrectText(currentText);
    if (corrected && corrected !== currentText) {
      setCurrentText(corrected);
      onTextUpdate(corrected);
      
      const contentType = CONTENT_TYPES.find(ct => ct.id === selectedContentType);
      addToHistory(
        currentText,
        corrected,
        'correction',
        'Correction',
        selectedContentType,
        contentType?.label || 'General'
      );
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyMainText = async () => {
    if (!currentText.trim()) return;
    await handleCopy(currentText, 'main-text');
  };

  const handleUseText = (text: string) => {
    setCurrentText(text);
    onTextUpdate(text);
  };

  const clearAll = () => {
    setCurrentText('');
    onTextUpdate('');
    if (error) clearError();
  };

  const selectedContentTypeData = CONTENT_TYPES.find(ct => ct.id === selectedContentType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `
      }} />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  AI Content Creation Helper
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  ✨ Transform your content with artificial intelligence
                </p>
              </div>
            </div>
            
            {/* History Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="h-10 px-4 bg-white/60 border-violet-200 hover:bg-violet-50 hover:border-violet-300 rounded-xl transition-all duration-200"
            >
              <History className="h-4 w-4 mr-2 text-violet-600" />
              <span className="text-violet-700 font-medium">Historique</span>
              {history.length > 0 && (
                <Badge className="ml-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 text-xs">
                  {history.length}
                </Badge>
              )}
              {showHistory ? (
                <ChevronUp className="h-4 w-4 ml-2 text-violet-600" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2 text-violet-600" />
              )}
            </Button>
          </div>
        </div>

        {/* History Section */}
        {showHistory && (
          <HistorySection
            history={history}
            onRemoveItem={removeFromHistory}
            onClearHistory={clearHistory}
            onUseText={handleUseText}
            onCopy={handleCopy}
            copied={copied}
          />
        )}

        {/* Main Content Card */}
        <Card className="mb-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">Your text</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Content Type Selector */}
            <ContentTypeSelector
              contentTypes={CONTENT_TYPES}
              selectedContentType={selectedContentType}
              onContentTypeChange={setSelectedContentType}
            />

            {/* Error Display */}
            {error && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100">
                <div className="p-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Text Editor */}
            <TextEditor
              currentText={currentText}
              onTextChange={handleTextChange}
              onCorrectText={handleCorrectClick}
              onCopyText={handleCopyMainText}
              onClearAll={clearAll}
              selectedContentType={selectedContentTypeData}
              isLoading={isLoading}
              copied={copied}
            />

            {/* Transformation Grid */}
            <TransformationGrid
              transformationOptions={TRANSFORMATION_OPTIONS}
              suggestions={suggestions}
              isLoading={isLoading}
              selectedContentType={selectedContentTypeData}
              currentText={currentText}
              onTransform={handleTransformClick}
              onUseText={handleUseText}
              onCopy={handleCopy}
              copied={copied}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            💜 Open Source • Powered by AI
          </p>
        </div>

      </div>
    </div>
  );
};

export default ContentHelper; 