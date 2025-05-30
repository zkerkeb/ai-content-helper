import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Copy,
  Check,
  Loader2,
  AlertCircle,
  MessageSquare,
  Zap,
  Target,
  Brain,
  Stars,
  BookOpen,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Globe,
  Video,
  Hash,
  Users,
  FileText,
  CheckCircle,
  History,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowRight
} from 'lucide-react';

interface ContentHelperProps {
  currentText?: string;
  onTextUpdate?: (newText: string) => void;
  onClose?: () => void;
}

interface ContentType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  charLimit?: number;
  specificities: string;
}

interface TransformationOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  prompt: string;
  description: string;
}

interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  transformedText: string;
  transformationType: string;
  contentType: string;
  transformationLabel: string;
  contentTypeLabel: string;
}

const ContentHelper: React.FC<ContentHelperProps> = ({
  currentText: initialText = '',
  onTextUpdate = () => {},
  onClose = () => {}
}) => {
  const [currentText, setCurrentText] = useState(initialText);
  const [selectedContentType, setSelectedContentType] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLimit] = useState(20); // Limite d'éléments dans l'historique
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Charger l'historique depuis localStorage au montage
  useEffect(() => {
    const savedHistory = localStorage.getItem('contenthelper-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Sauvegarder l'historique dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('contenthelper-history', JSON.stringify(history));
  }, [history]);

  // Fonction pour ajouter un élément à l'historique
  const addToHistory = (
    originalText: string,
    transformedText: string,
    transformationType: string,
    transformationLabel: string
  ) => {
    const contentType = contentTypes.find(ct => ct.id === selectedContentType);
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalText,
      transformedText,
      transformationType,
      contentType: selectedContentType,
      transformationLabel,
      contentTypeLabel: contentType?.label || 'General'
    };

    setHistory(prev => {
      const newHistory = [newHistoryItem, ...prev];
      // Limiter le nombre d'éléments dans l'historique
      return newHistory.slice(0, historyLimit);
    });
  };

  // Fonction pour supprimer un élément de l'historique
  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Fonction pour vider tout l'historique
  const clearHistory = () => {
    setHistory([]);
  };

  // Fonction pour formater la date
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

  // Content types/platforms
  const contentTypes: ContentType[] = [
    {
      id: 'general',
      label: 'General',
      icon: FileText,
      description: 'General content',
      specificities: 'Neutral and adaptive style'
    },
    {
      id: 'twitter',
      label: 'Twitter/X',
      icon: Twitter,
      description: 'Twitter post',
      charLimit: 280,
      specificities: 'Concise, punchy, relevant hashtags, engages conversation'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      description: 'LinkedIn post',
      charLimit: 3000,
      specificities: 'Professional, inspiring, storytelling, networking, personal development'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      description: 'Instagram post',
      charLimit: 2200,
      specificities: 'Visual, emojis, strategic hashtags, lifestyle, inspiring'
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      icon: Video,
      description: 'TikTok description',
      charLimit: 150,
      specificities: 'Young, trendy, challenges, music, viral, creative'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Users,
      description: 'Facebook post',
      charLimit: 2000,
      specificities: 'Community-focused, family-friendly, experience sharing, emotional'
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Professional email',
      specificities: 'Clear structure, catchy subject, CTA, polite and direct'
    },
    {
      id: 'blog',
      label: 'Blog/Article',
      icon: Globe,
      description: 'Blog article',
      specificities: 'SEO optimized, narrative structure, informative, engaging'
    },
    {
      id: 'chat',
      label: 'Chat/Message',
      icon: MessageSquare,
      description: 'Informal message',
      specificities: 'Casual, friendly, conversational, occasional emojis'
    },
    {
      id: 'youtube',
      label: 'YouTube',
      icon: Video,
      description: 'YouTube description',
      charLimit: 1000,
      specificities: 'Keywords, call to action, timestamps, links, community engagement'
    }
  ];

  // Specialized transformation options
  const transformationOptions: TransformationOption[] = [
    {
      id: 'improve',
      label: 'Improve',
      icon: Wand2,
      prompt: 'Improve this text by making it more engaging, professional and fluid while keeping the same main message',
      description: 'More professional and engaging style'
    },
    {
      id: 'reformulate',
      label: 'Reformulate',
      icon: RefreshCw,
      prompt: 'Reformulate this text using different words but keeping exactly the same meaning and intention',
      description: 'Same ideas, new words'
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: Target,
      prompt: 'Create a concise summary of this text keeping only the most important points',
      description: 'Condensed version of key points'
    },
    {
      id: 'expand',
      label: 'Expand',
      icon: Zap,
      prompt: 'Expand this text by adding more details, examples and explanations to make it more complete',
      description: 'More detailed and complete version'
    },
    {
      id: 'creative',
      label: 'Creative',
      icon: Stars,
      prompt: 'Rewrite this text in a more creative and original way, with a more captivating and innovative style',
      description: 'Creative and original approach'
    },
    {
      id: 'professional',
      label: 'Professional',
      icon: Brain,
      prompt: 'Adapt this text for a professional context with a formal tone appropriate for business',
      description: 'Formal and business tone'
    },
    {
      id: 'accessible',
      label: 'Simplify',
      icon: BookOpen,
      prompt: 'Simplify this text to make it more accessible and easy to understand for a wide audience',
      description: 'Simpler and more accessible'
    },
    {
      id: 'engaging',
      label: 'Engaging',
      icon: Sparkles,
      prompt: 'Make this text more captivating and engaging to maintain the reader\'s attention',
      description: 'More captivating and engaging'
    }
  ];

  const getContentTypePromptModifier = (contentTypeId: string): string => {
    const contentType = contentTypes.find(ct => ct.id === contentTypeId);
    if (!contentType || contentTypeId === 'general') return '';

    let modifier = `\n\nSPECIFIC CONTEXT - ${contentType.label.toUpperCase()}:\n`;
    modifier += `- ${contentType.specificities}\n`;
    
    if (contentType.charLimit) {
      modifier += `- STRICT LIMIT: Maximum ${contentType.charLimit} characters\n`;
    }

    // Platform-specific additional requirements
    switch (contentTypeId) {
      case 'twitter':
        modifier += `- Use 1-3 relevant hashtags\n- Encourage engagement (questions, opinions)\n- Direct and punchy style\n`;
        break;
      case 'linkedin':
        modifier += `- Start with a catchy hook\n- Include a professional lesson or insight\n- End with a question for engagement\n- Use emojis moderately\n`;
        break;
      case 'instagram':
        modifier += `- Integrate 3-5 relevant emojis\n- Use 5-10 strategic hashtags\n- Tell a visual story\n- Encourage sharing\n`;
        break;
      case 'tiktok':
        modifier += `- Young and dynamic language\n- Reference current trends\n- Call to action (like, share, follow)\n- Use expressive emojis\n`;
        break;
      case 'facebook':
        modifier += `- Friendly and personal tone\n- Encourage comments and shares\n- Evoke common experiences\n- Use emojis for emotion\n`;
        break;
      case 'email':
        modifier += `- Clear and catchy subject\n- Structure: intro, body, conclusion with CTA\n- Professional but human tone\n- Clear call to action\n`;
        break;
      case 'blog':
        modifier += `- SEO-optimized catchy title\n- Introduction that poses the problem\n- Structure in short paragraphs\n- Conclusion with summary\n`;
        break;
      case 'chat':
        modifier += `- Casual and friendly tone\n- Short and natural sentences\n- Occasional emojis\n- Conversational language\n`;
        break;
      case 'youtube':
        modifier += `- Include SEO keywords\n- Encourage like, comment, subscribe\n- Mention timestamps if relevant\n- Community engagement call\n`;
        break;
    }

    return modifier;
  };

  const callOpenAI = async (prompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file');
    }

    const contentTypeModifier = getContentTypePromptModifier(selectedContentType);
    const fullPrompt = prompt + contentTypeModifier;

    const systemPrompt = `You are an expert in writing and content transformation. Your task is to transform texts according to the given instructions.

Important rules:
- Always keep the main message and intention of the original text
- Adapt the style according to the request while remaining coherent
- Ensure the transformed text is of professional quality
- STRICTLY respect character limits if specified
- Return ONLY the transformed text, without explanations, without prefixes, without quotes
- Never start with "Improved message:", "Here is", "Transformed text:" or any other prefix
- Return directly the final content
- ALWAYS respond in the same language as the input text`;

    const userMessage = `Original text: "${currentText}"\n\nTask: ${fullPrompt}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('No transformation generated');
    }

    // Advanced content cleaning
    let cleanedContent = content;
    
    // Remove quotes at beginning and end
    cleanedContent = cleanedContent.replace(/^["']|["']$/g, '');
    
    // Remove common prefixes
    const prefixes = [
      /^Improved message:\s*/i,
      /^Improved text:\s*/i,
      /^Here is the improved text:\s*/i,
      /^Transformed text:\s*/i,
      /^Result:\s*/i,
      /^Here is:\s*/i,
      /^Improved version:\s*/i,
      /^New version:\s*/i
    ];
    
    prefixes.forEach(prefix => {
      cleanedContent = cleanedContent.replace(prefix, '');
    });
    
    // Remove internal quotes if entire text is wrapped in quotes
    if (cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) {
      cleanedContent = cleanedContent.slice(1, -1);
    }
    
    // Clean extra spaces
    cleanedContent = cleanedContent.trim();

    return cleanedContent;
  };

  const handleTransform = async (option: TransformationOption) => {
    if (!currentText.trim()) {
      setError('No text to transform');
      return;
    }

    // Check character limit for selected content type
    const contentType = contentTypes.find(ct => ct.id === selectedContentType);
    if (contentType?.charLimit && currentText.length > contentType.charLimit * 1.5) {
      setError(`Text is too long for ${contentType.label}. Recommended limit: ${contentType.charLimit} characters.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const transformed = await callOpenAI(option.prompt);
      setSuggestions(prev => ({
        ...prev,
        [option.id]: transformed
      }));
      
      // Ajouter à l'historique
      addToHistory(currentText, transformed, option.id, option.label);
    } catch (err: any) {
      console.error('Transformation Error:', err);
      setError(err.message || 'Error during transformation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrectText = async () => {
    if (!currentText.trim()) {
      setError('No text to correct');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const correctedText = await callOpenAI('Fix ONLY spelling errors, typos, and basic grammar mistakes in this text. Do NOT change any words, do NOT rephrase anything, do NOT change the meaning or style. Keep the exact same vocabulary and sentence structure. Only correct obvious spelling mistakes and punctuation errors. If a word is spelled correctly but you think there might be a "better" word, do NOT change it.');
      setCurrentText(correctedText);
      onTextUpdate(correctedText);
      
      // Ajouter à l'historique si le texte a été modifié
      if (correctedText !== currentText) {
        addToHistory(currentText, correctedText, 'correction', 'Correction');
      }
    } catch (err: any) {
      console.error('Correction Error:', err);
      setError(err.message || 'Error during correction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, optionId: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(optionId);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyMainText = async () => {
    if (!currentText.trim()) return;
    
    await navigator.clipboard.writeText(currentText);
    setCopied('main-text');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUseText = (text: string) => {
    setCurrentText(text);
    onTextUpdate(text);
  };

  const clearAll = () => {
    setCurrentText('');
    setSuggestions({});
    setError(null);
  };

  const selectedContentTypeData = contentTypes.find(ct => ct.id === selectedContentType);

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
            
            {/* Bouton d'historique */}
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

        {/* Section Historique */}
        {showHistory && (
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
                    onClick={clearHistory}
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
                    <div 
                      key={item.id} 
                      className="border border-slate-200 rounded-xl p-4 bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                    >
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
                          onClick={() => removeFromHistory(item.id)}
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
                                  onClick={() => handleUseText(item.transformedText)}
                                  size="sm"
                                  className="flex-1 h-7 px-3 text-xs bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 rounded-lg"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Utiliser
                                </Button>
                                <Button
                                  onClick={() => handleCopy(item.transformedText, `history-${item.id}`)}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                      onClick={() => setSelectedContentType(type.id)}
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

            {/* Error messages */}
            {error && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100">
                <div className="p-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Input area */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  <span>Your text</span>
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={!currentText}
                  className="h-7 px-3 text-xs text-slate-500 hover:text-slate-700 hover:bg-violet-50 rounded-lg"
                >
                  Clear all
                </Button>
              </div>
              
              <Textarea
                value={currentText}
                onChange={(e) => {
                  setCurrentText(e.target.value);
                  setTimeout(adjustTextareaHeight, 0);
                }}
                placeholder="✍️ Write or paste your text here..."
                className="min-h-[140px] text-sm resize-none border-violet-200 focus:border-violet-400 focus:ring-violet-400 rounded-xl bg-white/60 backdrop-blur-sm overflow-hidden"
                ref={textareaRef}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs border-violet-200 text-violet-700 bg-violet-50">
                    {currentText.length} characters
                  </Badge>
                  {selectedContentTypeData?.charLimit && (
                    <Badge 
                      className={`text-xs border-0 ${
                        currentText.length > selectedContentTypeData.charLimit 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      }`}
                    >
                      {selectedContentTypeData.charLimit - currentText.length} remaining
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyMainText()}
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
                    onClick={() => handleCorrectText()}
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

            {/* Transformation options */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                <span>Choose a transformation</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {transformationOptions.map((option) => {
                  const suggestion = suggestions[option.id];
                  
                  return (
                    <div key={option.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                            <option.icon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="font-semibold text-sm text-slate-800">{option.label}</span>
                        </div>
                        <Button
                          onClick={() => handleTransform(option)}
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
                                {selectedContentTypeData?.charLimit && (
                                  <Badge 
                                    className={`text-xs border-0 ${
                                      suggestion.length > selectedContentTypeData.charLimit 
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                    }`}
                                  >
                                    {suggestion.length <= selectedContentTypeData.charLimit ? '✓' : '⚠️'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex space-x-2 w-full">
                                <Button
                                  onClick={() => handleUseText(suggestion)}
                                  size="sm"
                                  className="flex-1 h-7 px-3 text-xs bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 rounded-lg shadow-sm"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Use
                                </Button>
                                <Button
                                  onClick={() => handleCopy(suggestion, option.id)}
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
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            💜 Open Source by <a href="https://github.com/zkerkeb" className="text-violet-600 hover:text-violet-700">Zakaria K.</a> • Powered by AI
          </p>
        </div>

      </div>
    </div>
  );
};

export default ContentHelper; 