import { useState } from 'react';
import { TransformationOption, UseContentTransformationReturn } from '@/types/contentHelper';
import { CONTENT_TYPES } from '@/constants/contentHelperConstants';

export const useContentTransformation = (): UseContentTransformationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);

  const getContentTypePromptModifier = (contentTypeId: string): string => {
    const contentType = CONTENT_TYPES.find(ct => ct.id === contentTypeId);
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

  const callOpenAI = async (prompt: string, text: string, contentType: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file');
    }

    const contentTypeModifier = getContentTypePromptModifier(contentType);
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

    const userMessage = `Original text: "${text}"\n\nTask: ${fullPrompt}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

  const handleTransform = async (
    option: TransformationOption, 
    text: string, 
    contentType: string
  ): Promise<string | null> => {
    if (!text.trim()) {
      setError('No text to transform');
      return null;
    }

    // Check character limit for selected content type
    const contentTypeData = CONTENT_TYPES.find(ct => ct.id === contentType);
    if (contentTypeData?.charLimit && text.length > contentTypeData.charLimit * 1.5) {
      setError(`Text is too long for ${contentTypeData.label}. Recommended limit: ${contentTypeData.charLimit} characters.`);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const transformed = await callOpenAI(option.prompt, text, contentType);
      setSuggestions(prev => ({
        ...prev,
        [option.id]: transformed
      }));
      return transformed;
    } catch (err: any) {
      console.error('Transformation Error:', err);
      setError(err.message || 'Error during transformation');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrectText = async (text: string): Promise<string | null> => {
    if (!text.trim()) {
      setError('No text to correct');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const correctedText = await callOpenAI(
        'Fix ONLY spelling errors, typos, and basic grammar mistakes in this text. Do NOT change any words, do NOT rephrase anything, do NOT change the meaning or style. Keep the exact same vocabulary and sentence structure. Only correct obvious spelling mistakes and punctuation errors. If a word is spelled correctly but you think there might be a "better" word, do NOT change it.',
        text,
        'general'
      );
      return correctedText;
    } catch (err: any) {
      console.error('Correction Error:', err);
      setError(err.message || 'Error during correction');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    suggestions,
    handleTransform,
    handleCorrectText,
    clearError
  };
}; 