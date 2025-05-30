import {
  FileText,
  Twitter,
  Linkedin,
  Instagram,
  Video,
  Users,
  Mail,
  Globe,
  MessageSquare,
  Wand2,
  RefreshCw,
  Target,
  Zap,
  Stars,
  Brain,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { ContentType, TransformationOption } from '@/types/contentHelper';

export const CONTENT_TYPES: ContentType[] = [
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

export const TRANSFORMATION_OPTIONS: TransformationOption[] = [
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

export const HISTORY_LIMIT = 20; 