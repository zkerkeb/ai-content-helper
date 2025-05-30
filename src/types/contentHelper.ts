export interface ContentHelperProps {
  currentText?: string;
  onTextUpdate?: (newText: string) => void;
  onClose?: () => void;
}

export interface ContentType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  charLimit?: number;
  specificities: string;
}

export interface TransformationOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  prompt: string;
  description: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  transformedText: string;
  transformationType: string;
  contentType: string;
  transformationLabel: string;
  contentTypeLabel: string;
}

export interface UseHistoryReturn {
  history: HistoryItem[];
  addToHistory: (
    originalText: string,
    transformedText: string,
    transformationType: string,
    transformationLabel: string,
    contentType: string,
    contentTypeLabel: string
  ) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export interface UseContentTransformationReturn {
  isLoading: boolean;
  error: string | null;
  suggestions: { [key: string]: string };
  handleTransform: (option: TransformationOption, text: string, contentType: string) => Promise<string | null>;
  handleCorrectText: (text: string) => Promise<string | null>;
  clearError: () => void;
} 