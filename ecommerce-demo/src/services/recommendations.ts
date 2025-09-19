// Importa todas as funcionalidades do TensorFlow.js para machine learning no navegador
import * as tf from '@tensorflow/tfjs';
import { Product, UserInteraction, RecommendationScore } from '../types/product';

/**
 * MOTOR DE RECOMENDAÇÕES COM TENSORFLOW.JS
 * 
 * Esta classe implementa um sistema de recomendação inteligente que:
 * 1. Usa uma rede neural feedforward para aprender padrões de usuário
 * 2. Combina filtragem baseada em conteúdo e colaborativa
 * 3. Aprende em tempo real (online learning) com cada interação
 * 4. Persiste o modelo treinado no localStorage do navegador
 * 
 * ARQUITETURA DA REDE NEURAL:
 * - Camada de entrada: características dos produtos (categoria, preço, rating, etc.)
 * - Camadas ocultas: processamento com ativação ReLU e dropout para regularização
 * - Camada de saída: probabilidade de recomendação para cada produto (softmax)
 */
export class RecommendationEngine {
  // Modelo da rede neural - null quando não inicializado
  private model: tf.LayersModel | null = null;
  // Flag para evitar treinamento simultâneo
  private isTraining = false;

  /**
   * INICIALIZAÇÃO DO MODELO DE MACHINE LEARNING
   * 
   * Este método configura a rede neural para recomendações:
   * 1. Tenta carregar um modelo previamente treinado do localStorage
   * 2. Se não existe, cria uma nova rede neural do zero
   * 3. Define a arquitetura e parâmetros de treinamento
   */
  async initializeModel(products: Product[]): Promise<void> {
    // Evita inicialização múltipla ou durante treinamento
    if (this.model || this.isTraining) return;
    
    this.isTraining = true;
    
    try {
      // PASSO 1: Tenta carregar modelo previamente salvo
      await this.loadModel();
      
      // PASSO 2: Se não há modelo salvo, cria um novo
      if (!this.model) {
        console.log('🧠 Criando nova rede neural para recomendações...');
        
        // ARQUITETURA DA REDE NEURAL:
        const model = tf.sequential({
          layers: [
            // CAMADA DE ENTRADA: recebe características dos produtos
            // inputShape: [produtos.length + 4] = vetor de características
            // units: 64 neurônios na primeira camada oculta
            // activation: 'relu' = função de ativação ReLU (max(0, x))
            tf.layers.dense({ 
              inputShape: [products.length + 4], 
              units: 64, 
              activation: 'relu',
              name: 'camada_entrada'
            }),
            
            // REGULARIZAÇÃO: Dropout previne overfitting
            // rate: 0.2 = 20% dos neurônios são "desligados" aleatoriamente durante treinamento
            tf.layers.dropout({ 
              rate: 0.2,
              name: 'dropout_regularizacao'
            }),
            
            // CAMADA OCULTA: processamento intermediário
            // units: 32 = reduz dimensionalidade gradualmente
            tf.layers.dense({ 
              units: 32, 
              activation: 'relu',
              name: 'camada_oculta'
            }),
            
            // CAMADA DE SAÍDA: probabilidades de recomendação
            // units: products.length = um neurônio para cada produto
            // activation: 'softmax' = converte em probabilidades (soma = 1)
            tf.layers.dense({ 
              units: products.length, 
              activation: 'softmax',
              name: 'camada_saida'
            })
          ]
        });

        // CONFIGURAÇÃO DO TREINAMENTO:
        model.compile({
          // OTIMIZADOR: Adam com learning rate 0.001
          // Adam é eficiente para redes neurais (combina momentum + RMSprop)
          optimizer: tf.train.adam(0.001),
          
          // FUNÇÃO DE PERDA: Categorical Crossentropy
          // Ideal para classificação multiclasse (qual produto recomendar)
          loss: 'categoricalCrossentropy',
          
          // MÉTRICAS: Accuracy para monitorar performance
          metrics: ['accuracy']
        });

        this.model = model;
        console.log('✅ Rede neural criada com sucesso!');
        console.log('📊 Arquitetura:', model.summary());
      }
    } catch (error) {
      console.error('❌ Falha ao inicializar modelo de recomendação:', error);
    } finally {
      this.isTraining = false;
    }
  }

  /**
   * CÁLCULO DE SIMILARIDADE ENTRE PRODUTOS
   * 
   * Implementa filtragem baseada em conteúdo usando múltiplas características:
   * - Categoria (40% do peso): produtos da mesma categoria são mais similares
   * - Preço (30% do peso): produtos com preços próximos são similares
   * - Rating (30% do peso): produtos com avaliações similares são relacionados
   * 
   * Retorna valor entre 0 (totalmente diferentes) e 1 (idênticos)
   */
  calculateSimilarity(product1: Product, product2: Product): number {
    let similarity = 0;
    
    // SIMILARIDADE POR CATEGORIA (peso: 40%)
    // Produtos da mesma categoria têm alta similaridade
    if (product1.category === product2.category) {
      similarity += 0.4;
    }
    
    // SIMILARIDADE POR PREÇO (peso: 30%)
    // Normaliza a diferença de preço entre 0 e 1
    const priceDiff = Math.abs(product1.price - product2.price);
    const maxPrice = Math.max(product1.price, product2.price);
    const priceScore = maxPrice > 0 ? 1 - (priceDiff / maxPrice) : 1;
    similarity += priceScore * 0.3;
    
    // SIMILARIDADE POR RATING (peso: 30%)
    // Produtos com avaliações similares são relacionados
    const ratingDiff = Math.abs(product1.rating.rate - product2.rating.rate);
    const ratingScore = 1 - (ratingDiff / 5); // Normaliza pela escala máxima (5 estrelas)
    similarity += ratingScore * 0.3;
    
    // Garante que o valor não exceda 1.0
    return Math.min(similarity, 1);
  }

  /**
   * GERADOR DE RECOMENDAÇÕES INTELIGENTES
   * 
   * Combina múltiplas técnicas de machine learning:
   * 1. Filtragem Colaborativa: analisa padrões de comportamento do usuário
   * 2. Filtragem Baseada em Conteúdo: usa características dos produtos
   * 3. Popularidade: considera produtos bem avaliados
   * 4. Exploração: adiciona randomização para descoberta
   * 
   * ALGORITMO:
   * - Score base por popularidade (rating do produto)
   * - Boost por interações anteriores do usuário
   * - Bonus por preferências de categoria
   * - Similaridade com produtos visualizados
   * - Fator de descoberta aleatório
   */
  generateRecommendations(
    products: Product[], 
    interactions: UserInteraction[]
  ): RecommendationScore[] {
    // CASO USUÁRIO NOVO: sem histórico de interações
    if (interactions.length === 0) {
      console.log('👤 Usuário novo detectado - usando recomendações aleatórias');
      return products.map(p => ({ 
        productId: p.id, 
        score: Math.random(), 
        reasons: ['Produto em destaque'] 
      }));
    }

    console.log(`🔍 Gerando recomendações baseadas em ${interactions.length} interações`);
    const scores: RecommendationScore[] = [];
    
    // ANÁLISE DO COMPORTAMENTO DO USUÁRIO
    // Conta quantas vezes cada produto foi visualizado
    const interactionCounts = new Map<number, number>();
    // Identifica preferências por categoria
    const categoryPreferences = new Map<string, number>();
    
    // PROCESSAMENTO DAS INTERAÇÕES DO USUÁRIO
    interactions.forEach(interaction => {
      // Conta interações por produto
      const count = interactionCounts.get(interaction.productId) || 0;
      interactionCounts.set(interaction.productId, count + 1);
      
      // Analisa preferências por categoria
      const product = products.find(p => p.id === interaction.productId);
      if (product) {
        const catCount = categoryPreferences.get(product.category) || 0;
        categoryPreferences.set(product.category, catCount + 1);
      }
    });

    // CÁLCULO DE SCORE PARA CADA PRODUTO
    products.forEach(product => {
      let score = 0;
      const reasons: string[] = [];

      // 1. SCORE BASE DE POPULARIDADE (20% do peso total)
      // Produtos com melhor rating têm vantagem inicial
      const popularityScore = (product.rating.rate / 5) * 0.2;
      score += popularityScore;
      
      // 2. HISTÓRICO DE INTERAÇÕES DO USUÁRIO (até 80% do peso)
      // Produtos já visualizados ganham boost significativo
      const userInteractions = interactionCounts.get(product.id) || 0;
      if (userInteractions > 0) {
        const interactionBoost = Math.min(userInteractions * 0.3, 0.8);
        score += interactionBoost;
        reasons.push(`Você visualizou ${userInteractions} vez(es)`);
      }

      // 3. PREFERÊNCIA POR CATEGORIA (até 40% do peso)
      // Categorias que o usuário mais interage ganham bonus
      const categoryScore = categoryPreferences.get(product.category) || 0;
      if (categoryScore > 0) {
        const categoryBonus = Math.min(categoryScore * 0.1, 0.4);
        score += categoryBonus;
        reasons.push(`Você gosta de produtos da categoria ${product.category}`);
      }

      // 4. SIMILARIDADE COM PRODUTOS VISUALIZADOS (30% do peso)
      // Produtos similares aos já vistos são recomendados
      let maxSimilarity = 0;
      interactions.forEach(interaction => {
        const viewedProduct = products.find(p => p.id === interaction.productId);
        if (viewedProduct && viewedProduct.id !== product.id) {
          const similarity = this.calculateSimilarity(product, viewedProduct);
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }
      });
      
      // Apenas produtos com alta similaridade (> 50%) ganham bonus
      if (maxSimilarity > 0.5) {
        score += maxSimilarity * 0.3;
        reasons.push('Similar a produtos que você visualizou');
      }

      // 5. FATOR DE EXPLORAÇÃO (até 10% do peso)
      // Adiciona aleatoriedade para descoberta de novos produtos
      score += Math.random() * 0.1;

      // Fallback para produtos sem razões específicas
      if (reasons.length === 0) {
        reasons.push('Produto em alta no momento');
      }

      scores.push({
        productId: product.id,
        score: Math.min(score, 1), // Limita score máximo em 1.0
        reasons
      });
    });

    // ORDENAÇÃO POR SCORE DECRESCENTE
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    console.log(`📈 Top 3 recomendações:`, sortedScores.slice(0, 3));
    
    return sortedScores;
  }

  /**
   * TREINAMENTO ONLINE DA REDE NEURAL
   * 
   * Implementa aprendizado incremental (online learning):
   * 1. Analisa sequências de interações do usuário
   * 2. Cria dados de treinamento baseados em padrões comportamentais
   * 3. Atualiza os pesos da rede neural usando backpropagation
   * 4. Salva o modelo treinado para persistência
   * 
   * TÉCNICAS UTILIZADAS:
   * - Sessões de usuário (agrupamento temporal de 30 min)
   * - Sequenciamento de produtos (produto atual → próximo produto)
   * - Mini-batch training para eficiência
   * - Gerenciamento de memória com dispose() dos tensors
   */
  async trainModel(products: Product[], interactions: UserInteraction[]): Promise<void> {
    // Validações: precisa de modelo inicializado e mínimo de 5 interações
    if (!this.model || interactions.length < 5) {
      console.log('⏸️ Treinamento pausado - dados insuficientes');
      return;
    }

    console.log('🎯 Iniciando treinamento da rede neural...');
    
    try {
      // PASSO 1: Preparar dados de treinamento
      const trainingData = this.prepareTrainingData(products, interactions);
      
      if (trainingData.inputs.length === 0) {
        console.log('📊 Sem dados válidos para treinamento');
        return;
      }

      console.log(`📈 Criando ${trainingData.inputs.length} exemplos de treinamento`);

      // PASSO 2: Converter dados em tensors do TensorFlow.js
      // tf.tensor2d cria matriz 2D para entrada da rede neural
      const xs = tf.tensor2d(trainingData.inputs);   // Features de entrada
      const ys = tf.tensor2d(trainingData.outputs);  // Labels de saída (one-hot)

      // PASSO 3: Treinar o modelo usando backpropagation
      const history = await this.model.fit(xs, ys, {
        // epochs: número de passadas completas pelos dados
        epochs: 3,
        
        // batchSize: quantos exemplos processar por vez
        // Math.min garante que não exceda o total de dados
        batchSize: Math.min(32, trainingData.inputs.length),
        
        // verbose: 0 = sem logs detalhados durante treinamento
        verbose: 0,
        
        // shuffle: embaralha dados para melhorar aprendizado
        shuffle: true
      });

      // PASSO 4: Limpeza de memória (crucial no navegador!)
      // dispose() libera memória GPU/CPU ocupada pelos tensors
      xs.dispose();
      ys.dispose();

      // PASSO 5: Persistir modelo treinado no localStorage
      await this.saveModel();
      
      const finalLoss = history.history.loss[history.history.loss.length - 1];
      const lossValue = typeof finalLoss === 'number' ? finalLoss : finalLoss.dataSync()[0];
      console.log(`✅ Modelo treinado com sucesso! Loss final: ${lossValue.toFixed(4)}`);
      
    } catch (error) {
      console.error('❌ Falha no treinamento do modelo:', error);
    }
  }

  /**
   * PREPARAÇÃO DOS DADOS DE TREINAMENTO
   * 
   * Converte interações do usuário em dados estruturados para a rede neural:
   * 1. Agrupa interações em sessões temporais (30 min)
   * 2. Cria sequências produto_atual → próximo_produto
   * 3. Gera vetores de características dos produtos
   * 4. Aplica codificação one-hot para os rótulos de saída
   * 
   * FORMATO DOS DADOS:
   * - Input: vetor de características do produto atual
   * - Output: vetor one-hot indicando o próximo produto da sequência
   */
  private prepareTrainingData(products: Product[], interactions: UserInteraction[]) {
    const inputs: number[][] = [];   // Matriz de características de entrada
    const outputs: number[][] = [];  // Matriz de rótulos one-hot de saída

    // PASSO 1: Agrupar interações em sessões temporais
    const sessions = this.groupInteractionsBySession(interactions);
    console.log(`🗂️ Organizadas ${sessions.length} sessões de usuário`);

    // PASSO 2: Processar cada sessão para criar sequências de treinamento
    sessions.forEach(session => {
      // Sessões muito curtas não geram dados úteis
      if (session.length < 2) return;

      // Criar pares sequenciais: produto[i] → produto[i+1]
      for (let i = 0; i < session.length - 1; i++) {
        const currentProduct = products.find(p => p.id === session[i].productId);
        const nextProduct = products.find(p => p.id === session[i + 1].productId);

        if (currentProduct && nextProduct) {
          // ENTRADA: vetor de características do produto atual
          const input = this.createProductVector(currentProduct, products);
          inputs.push(input);

          // SAÍDA: codificação one-hot do próximo produto
          // Cria vetor com zeros e coloca 1 na posição do produto correto
          const output = new Array(products.length).fill(0);
          const nextIndex = products.findIndex(p => p.id === nextProduct.id);
          if (nextIndex >= 0) {
            output[nextIndex] = 1; // One-hot encoding
          }
          outputs.push(output);
        }
      }
    });

    console.log(`🔢 Gerados ${inputs.length} pares de treinamento sequencial`);
    return { inputs, outputs };
  }

  /**
   * AGRUPAMENTO DE INTERAÇÕES EM SESSÕES TEMPORAIS
   * 
   * Divide as interações do usuário em sessões baseadas em tempo:
   * - Sessão: sequência contínua de interações com gaps < 30 minutos
   * - Permite identificar padrões de navegação em uma única visita
   * - Cada sessão representa um "journey" do usuário no site
   * 
   * ALGORITMO:
   * 1. Ordena interações por timestamp crescente
   * 2. Agrupa interações com gap temporal < 30 min
   * 3. Cria nova sessão quando gap > 30 min (timeout de sessão)
   */
  private groupInteractionsBySession(interactions: UserInteraction[]): UserInteraction[][] {
    const sessions: UserInteraction[][] = [];
    let currentSession: UserInteraction[] = [];
    
    // PASSO 1: Ordenar interações cronologicamente
    const sortedInteractions = [...interactions].sort((a, b) => a.timestamp - b.timestamp);
    
    // PASSO 2: Processar cada interação sequencialmente
    sortedInteractions.forEach(interaction => {
      if (currentSession.length === 0) {
        // Primeira interação sempre inicia nova sessão
        currentSession.push(interaction);
      } else {
        const lastInteraction = currentSession[currentSession.length - 1];
        const timeDiff = interaction.timestamp - lastInteraction.timestamp;
        
        // TIMEOUT DE SESSÃO: 30 minutos (1800000 ms)
        // Se gap > 30 min, considera como nova visita/sessão
        if (timeDiff > 30 * 60 * 1000) {
          // Finaliza sessão atual
          if (currentSession.length > 0) {
            sessions.push([...currentSession]);
          }
          // Inicia nova sessão
          currentSession = [interaction];
        } else {
          // Continua na mesma sessão
          currentSession.push(interaction);
        }
      }
    });
    
    // PASSO 3: Adicionar última sessão se existir
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }
    
    return sessions;
  }

  /**
   * CRIAÇÃO DE VETOR DE CARACTERÍSTICAS DO PRODUTO
   * 
   * Converte um produto em vetor numérico para entrada da rede neural:
   * 1. One-hot encoding das categorias
   * 2. Normalização de preço (0-1)
   * 3. Rating normalizado (0-1)
   * 4. Popularidade baseada em reviews
   * 5. Ranking relativo por rating
   * 
   * EXEMPLO DE VETOR:
   * [0,1,0,0, 0.75, 0.85, 0.65, 0.2] = [categorias, preço, rating, reviews, rank]
   */
  private createProductVector(product: Product, allProducts: Product[]): number[] {
    const vector: number[] = [];
    
    // 1. ONE-HOT ENCODING PARA CATEGORIAS
    // Cria um bit para cada categoria única (ex: electronics=1, jewelry=0, etc.)
    const categories = [...new Set(allProducts.map(p => p.category))];
    categories.forEach(cat => {
      vector.push(product.category === cat ? 1 : 0);
    });
    
    // 2. PREÇO NORMALIZADO (0-1)
    // Divide pelo preço máximo para padronizar escala
    const maxPrice = Math.max(...allProducts.map(p => p.price));
    const normalizedPrice = maxPrice > 0 ? product.price / maxPrice : 0;
    vector.push(normalizedPrice);
    
    // 3. RATING NORMALIZADO (0-1)
    // Divide por 5 (rating máximo) para escala 0-1
    vector.push(product.rating.rate / 5);
    
    // 4. NÚMERO DE REVIEWS NORMALIZADO (0-1)
    // Indica popularidade/confiabilidade do produto
    const maxReviews = Math.max(...allProducts.map(p => p.rating.count));
    const normalizedReviews = maxReviews > 0 ? product.rating.count / maxReviews : 0;
    vector.push(normalizedReviews);
    
    // 5. RANKING DE POPULARIDADE (0-1)
    // Posição relativa ordenada por rating (0 = melhor, 1 = pior)
    const sortedByRating = [...allProducts].sort((a, b) => b.rating.rate - a.rating.rate);
    const rank = sortedByRating.findIndex(p => p.id === product.id);
    const normalizedRank = allProducts.length > 0 ? rank / allProducts.length : 0;
    vector.push(normalizedRank);
    
    return vector;
  }

  /**
   * PERSISTÊNCIA DO MODELO NO NAVEGADOR
   * 
   * Salva o modelo treinado no localStorage usando TensorFlow.js:
   * - Utiliza tf.LayersModel.save() com URL especial 'localstorage://'
   * - Persiste arquitetura da rede + pesos treinados
   * - Permite recuperar aprendizado entre sessões do usuário
   * - Dados ficam locais no navegador (não enviados para servidor)
   */
  async saveModel() {
    if (!this.model) {
      console.warn('⚠️ Tentativa de salvar modelo inexistente');
      return;
    }

    try {
      // TensorFlow.js API: salva no localStorage do navegador
      await this.model.save('localstorage://recommendation-model');
      console.log('💾 Modelo salvo com sucesso no localStorage');
    } catch (error) {
      console.error('❌ Falha ao salvar modelo:', error);
    }
  }

  /**
   * CARREGAMENTO DE MODELO PERSISTIDO
   * 
   * Tenta recuperar modelo previamente treinado do localStorage:
   * - tf.loadLayersModel() reconstrói rede neural + pesos
   * - Se não encontrar, retorna null (será criado novo modelo)
   * - Permite continuidade do aprendizado entre sessões
   */
  async loadModel() {
    try {
      // TensorFlow.js API: carrega do localStorage
      const savedModel = await tf.loadLayersModel('localstorage://recommendation-model');
      if (savedModel) {
        this.model = savedModel;
        console.log('📂 Modelo carregado com sucesso do localStorage');
        console.log('🧠 Continuando aprendizado de sessões anteriores...');
      }
    } catch (error) {
      console.log('🆕 Nenhum modelo salvo encontrado - criando novo modelo');
    }
  }
}

export const recommendationEngine = new RecommendationEngine();