import { useState, useEffect } from 'react';
import { HistoryItem, UseHistoryReturn } from '@/types/contentHelper';
import { HISTORY_LIMIT } from '@/constants/contentHelperConstants';

export const useHistory = (): UseHistoryReturn => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
    transformationLabel: string,
    contentType: string,
    contentTypeLabel: string
  ) => {
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalText,
      transformedText,
      transformationType,
      contentType,
      transformationLabel,
      contentTypeLabel
    };

    setHistory(prev => {
      const newHistory = [newHistoryItem, ...prev];
      // Limiter le nombre d'éléments dans l'historique
      return newHistory.slice(0, HISTORY_LIMIT);
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

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
}; 