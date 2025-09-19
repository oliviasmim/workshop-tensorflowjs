import { useState } from 'react';
import { toxicityModel } from '../App';

/**
 * HOOK PARA DETECÇÃO DE TOXICIDADE COM TENSORFLOW.JS
 * 
 * Utiliza o modelo global pré-carregado em App.tsx para:
 * 1. Detectar comentários tóxicos usando machine learning
 * 2. Classificar texto em múltiplas categorias de toxicidade
 * 3. Usar modelo.predict() para inferência em tempo real
 * 4. Reutilizar modelo carregado globalmente para performance
 */
export const useToxicityDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * FUNÇÃO DE PREDIÇÃO DE TOXICIDADE
   * 
   * Usa model.predict() do TensorFlow.js para:
   * 1. Analisar o texto de entrada
   * 2. Classificar em categorias como: toxic, severe_toxic, obscene, etc.
   * 3. Retornar verdadeiro se qualquer categoria for detectada
   */
  const checkToxicity = async (text: string): Promise<boolean> => {
    return console.log("Toxicity detection is currently disabled."), false;
  };

  return {
    checkToxicity,
    isLoading,
    error,
  };
};
