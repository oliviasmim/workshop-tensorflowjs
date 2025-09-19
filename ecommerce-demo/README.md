# 🛍️ SmartShop - Demo Educativo de E-commerce com TensorFlow.js

Uma demonstração educativa de e-commerce inteligente que utiliza **TensorFlow.js** para fornecer recomendações personalizadas em tempo real. Construído com React, TypeScript e Vite para performance otimizada.

![SmartShop Demo](https://via.placeholder.com/800x400/667eea/FFFFFF?text=SmartShop+Demo)

## 🎯 Objetivo Educativo

Este projeto é uma **demonstração educativa** focada em ensinar conceitos de Machine Learning no navegador usando TensorFlow.js. Ideal para estudantes e desenvolvedores que querem entender como implementar IA em aplicações web modernas.

## ✨ Funcionalidades

### 🧠 Inteligência Artificial Integrada
- **Rede Neural Feedforward**: Implementa uma rede neural personalizada para aprendizado de padrões
- **Aprendizado Online**: Modelo atualiza em tempo real com cada interação do usuário
- **Sistema de Recomendações**: Combina filtragem baseada em conteúdo e colaborativa
- **Detecção de Toxicidade**: Moderação automática de comentários usando modelo pré-treinado
- **Persistência Local**: Pesos do modelo salvos no localStorage do navegador

### 🎨 Interface Moderna
- **Design Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis
- **React Router**: Navegação entre páginas com URLs amigáveis
- **Animações Suaves**: Transições elegantes e estados de carregamento
- **Comentários Interativos**: Sistema de comentários com moderação por IA
- **Feedback Visual**: Indicadores de carregamento e status dos modelos ML

### ⚡ Performance e Arquitetura
- **React Query**: Gerenciamento inteligente de cache e estado do servidor
- **Zustand**: Store global simples e eficiente para estado da aplicação
- **TensorFlow.js**: Execução de modelos ML diretamente no navegador
- **Vite**: Build system moderno para desenvolvimento rápido
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Cache Inteligente**: Dados de produtos e pesos de modelos em cache para melhor performance

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ (compatível com Node.js 20.9.0)
- npm ou yarn
- Navegador moderno com suporte a WebGL (para TensorFlow.js)

### Instalação e Execução

1. **Clone o repositório e instale as dependências:**
```bash
git clone <repository-url>
cd ecommerce-demo
npm install
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Abra seu navegador:**
Acesse `http://localhost:5173`

## 🔧 Como Funciona

### Arquitetura de Machine Learning

A aplicação utiliza uma **rede neural feedforward** construída com TensorFlow.js:

```
Camada de Entrada (Características do Produto) → Camadas Ocultas → Saída (Score de Recomendação)
```

**Características de Entrada:**
- Codificação de categoria (one-hot encoding)
- Normalização de preço (0-1)
- Scores de avaliação
- Ranking de popularidade

**Processo de Treinamento:**
- **Aprendizado Online**: Modelo atualiza após cada interação do usuário
- **Amostragem Positiva/Negativa**: Produtos clicados = positivo, não clicados = negativo
- **Filtragem Colaborativa**: Padrões de preferência de usuários similares

### Fluxo de Interação do Usuário

1. **Estado Inicial**: Produtos exibidos em ordem padrão (por avaliação)
2. **Cliques do Usuário**: Clique no produto aciona atualização do modelo ML
3. **Geração de Recomendações**: TensorFlow.js processa preferências do usuário
4. **Reordenação Dinâmica**: Produtos da homepage se reordenam baseado nas previsões
5. **Aprendizado Contínuo**: Cada interação melhora recomendações futuras

### Sistema de Detecção de Toxicidade

- **Modelo Pré-treinado**: Utiliza `@tensorflow-models/toxicity` 
- **Classificação Multiclasse**: Detecta múltiplas categorias de toxicidade
- **Moderação Automática**: Comentários tóxicos são bloqueados automaticamente
- **Inferência em Tempo Real**: Análise instantânea durante o envio de comentários

## 📁 Estrutura do Projeto

```
src/
├── components/              # Componentes React
│   ├── ProductCard.tsx      # Exibição individual de produto
│   ├── ProductDetail.tsx    # Modal com detalhes do produto
│   ├── ProductGrid.tsx      # Grid principal de produtos
│   ├── CommentSection.tsx   # Sistema de comentários com IA
│   ├── Layout.tsx           # Layout principal da aplicação
│   └── Header.tsx           # Navegação e estatísticas
├── services/                # Serviços de dados e utilitários
│   ├── api.ts               # Integração com Fake Store API
│   └── recommendations.ts   # Lógica principal de ML
├── hooks/                   # React hooks customizados
│   ├── useGetProducts.ts    # Hook para buscar produtos
│   ├── useGetProduct.ts     # Hook para produto individual
│   └── useToxicityDetection.ts # Hook para detecção de toxicidade
├── store/                   # Gerenciamento de estado
│   └── useStore.ts          # Store Zustand para estado global
├── types/                   # Definições TypeScript
│   └── product.ts           # Interfaces de tipos
└── App.tsx                  # Componente principal da aplicação
```

## 🎯 Tecnologias Principais

- **Frontend**: React 18, TypeScript, Vite
- **Machine Learning**: TensorFlow.js, @tensorflow-models/toxicity  
- **Fonte de Dados**: Fake Store API
- **Estilização**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand + React Query
- **Roteamento**: React Router
- **Cache**: React Query para cache inteligente

## 🧪 Teste a Demonstração

### Testando o Sistema de Recomendações:

1. **Navegue pelos Produtos**: Observe a ordem inicial dos produtos
2. **Clique nos Produtos**: Abra detalhes do produto para ver informações
3. **Observe as Mudanças**: Retorne à homepage - produtos se reordenaram!
4. **Continue Clicando**: Mais interações = melhores recomendações
5. **Sistema Inteligente**: IA aprende suas preferências em tempo real

### Testando a Detecção de Toxicidade:

1. **Acesse um Produto**: Clique em qualquer produto
2. **Role para Baixo**: Encontre a seção de comentários
3. **Teste Comentários Limpos**: "Este produto é incrível!" ✅
4. **Teste Comentários Tóxicos**: "Este produto é terrível!" ❌
5. **Observe a IA**: Modelo TensorFlow.js analisa automaticamente

### Comportamento Esperado:
- Produtos similares aos clicados sobem no ranking
- Categorias preferidas aparecem mais frequentemente  
- Produtos visualizados recentemente ganham prioridade
- Modelo ML aprende suas preferências ao longo do tempo
- Comentários tóxicos são automaticamente bloqueados

## 🎨 Personalização

### Adicionando Novas Características do Produto:
```typescript
// Em services/recommendations.ts
createProductVector(product: Product, allProducts: Product[]): number[] {
  const vector: number[] = [];
  
  // Adicione sua lógica personalizada de extração de características
  // Exemplo: detectar produtos premium, sem fio, etc.
  
  return vector;
}
```

### Modificando o Modelo ML:
```typescript
// Em services/recommendations.ts
private createModel(inputSize: number, outputSize: number) {
  // Customize a arquitetura da rede neural
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [inputSize], units: 64, activation: 'relu' }),
      // Adicione/modifique camadas aqui
      tf.layers.dense({ units: outputSize, activation: 'softmax' })
    ]
  });
  return model;
}
```

## 🐛 Solução de Problemas

### Problemas Comuns:

1. **Erro de Versão do Node.js**: Certifique-se de usar Node.js 18+ 
2. **Carregamento do TensorFlow.js**: Verifique suporte a WebGL no console do navegador
3. **Timeouts da API**: Fake Store API às vezes é lenta - atualize se necessário
4. **LocalStorage Cheio**: Limpe dados do navegador se o modelo não conseguir salvar
5. **Modelo de Toxicidade Não Carrega**: Aguarde o download inicial (~25MB)

### Comandos de Desenvolvimento:
```bash
npm run dev     # Iniciar servidor de desenvolvimento
npm run build   # Build para produção
npm run preview # Preview do build de produção
```

## 🎓 Conceitos Educativos Demonstrados

### Machine Learning:
- **Redes Neurais Feedforward** com TensorFlow.js
- **Aprendizado Online** (Online Learning)
- **Feature Engineering** e normalização de dados
- **Classificação Multiclasse** para detecção de toxicidade
- **Persistência de Modelos** no navegador

### Desenvolvimento Web:
- **React Hooks** customizados
- **State Management** com Zustand
- **Cache Inteligente** com React Query
- **Roteamento** com React Router
- **TypeScript** para tipagem estática

## 🌟 Melhorias Futuras

- **Autenticação de Usuário**: Salvar preferências entre dispositivos
- **Filtros de Produto**: Filtros por categoria e preço
- **Carrinho de Compras**: Funcionalidade completa de e-commerce
- **Testes A/B**: Comparar algoritmos de recomendação
- **Dashboard de Analytics**: Métricas detalhadas de performance dos modelos ML
- **Recursos Sociais**: Avaliações e comentários de usuários
- **PWA**: Transformar em Progressive Web App
- **Modelos Avançados**: Implementar transformers ou embeddings

## 📚 Recursos de Aprendizado

- **TensorFlow.js**: https://js.tensorflow.org/
- **React Query**: https://tanstack.com/query
- **Zustand**: https://zustand-demo.pmnd.rs/
- **Toxicity Model**: https://github.com/tensorflow/tfjs-models/tree/master/toxicity

## 📝 Licença

Este projeto é open source e está disponível sob a Licença MIT.

---

**Construído com ❤️ usando React, TensorFlow.js e tecnologias web modernas para fins educativos.**

## 📋 Visão Geral

Este documento explica cada API do TensorFlow.js utilizada no projeto de recomendações, com justificativas educativas e exemplos práticos.

## 🔧 APIs do TensorFlow.js Utilizadas

### 1. **tf.sequential()** - Criação de Modelo Sequencial

```typescript
const model = tf.sequential({
  layers: [...]
});
```

**Por que usar:**
- Modelo sequencial é ideal para redes feedforward simples
- Camadas são empilhadas em ordem linear
- Perfeito para iniciantes em deep learning
- Arquitetura clara e fácil de entender

**Alternativas:**
- `tf.model()` para arquiteturas mais complexas (não usado aqui por simplicidade)

### 2. **tf.layers.dense()** - Camadas Densas (Fully Connected)

```typescript
tf.layers.dense({ 
  inputShape: [products.length + 4], 
  units: 64, 
  activation: 'relu',
  name: 'camada_entrada'
})
```

**Parâmetros explicados:**
- `inputShape`: dimensão da entrada [número_de_características]
- `units`: número de neurônios na camada (64 = boa capacidade sem overfitting)
- `activation: 'relu'`: função ReLU = max(0, x), previne gradiente negativo
- `name`: identificação para debug e visualização

**Por que Dense:**
- Conecta todos os neurônios de entrada com todos de saída
- Ideal para aprender relações complexas entre características
- Padrão para sistemas de recomendação

### 3. **tf.layers.dropout()** - Regularização

```typescript
tf.layers.dropout({ 
  rate: 0.2,
  name: 'dropout_regularizacao'
})
```

**Por que usar:**
- **Previne overfitting**: "desliga" 20% dos neurônios aleatoriamente
- **Generalização**: força o modelo a não depender de neurônios específicos
- **Robustez**: melhora performance em dados não vistos
- **Padrão da indústria**: rate 0.2-0.5 é comum

### 4. **Funções de Ativação**

#### **ReLU (Rectified Linear Unit)**
```typescript
activation: 'relu' // max(0, x)
```
- **Vantagens**: resolve problema do gradiente que desaparece
- **Quando usar**: camadas ocultas, padrão moderno
- **Características**: simples, eficiente, não-linear

#### **Softmax**
```typescript
activation: 'softmax'
```
- **Propósito**: converte logits em probabilidades (soma = 1)
- **Uso**: camada de saída para classificação multiclasse
- **Output**: distribuição de probabilidade sobre produtos

### 5. **model.compile()** - Configuração de Treinamento

```typescript
model.compile({
  optimizer: tf.train.adam(0.001),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});
```

#### **Otimizador Adam**
- **Por que Adam**: combina momentum + RMSprop
- **Learning Rate 0.001**: balanço entre velocidade e estabilidade
- **Adaptativo**: ajusta taxa de aprendizado automaticamente
- **Padrão da indústria**: funciona bem na maioria dos casos

#### **Categorical Crossentropy**
- **Para que**: classificação multiclasse (qual produto recomendar)
- **Como funciona**: penaliza previsões incorretas logaritmicamente
- **Adequado**: quando temos rótulos one-hot encoding

### 6. **tf.tensor2d()** - Criação de Tensors

```typescript
const xs = tf.tensor2d(trainingData.inputs);   // Features
const ys = tf.tensor2d(trainingData.outputs);  // Labels
```

**Por que 2D:**
- Primeira dimensão: número de exemplos (batch size)
- Segunda dimensão: número de características
- Formato padrão para dados tabulares
- Compatível com camadas Dense

### 7. **model.fit()** - Treinamento

```typescript
await this.model.fit(xs, ys, {
  epochs: 3,
  batchSize: Math.min(32, trainingData.inputs.length),
  verbose: 0,
  shuffle: true
});
```

**Parâmetros otimizados:**
- `epochs: 3`: poucas épocas para aprendizado incremental
- `batchSize: 32`: balanço entre eficiência e atualização frequente
- `shuffle: true`: evita viés de ordem dos dados
- `verbose: 0`: sem logs (performance no navegador)

### 8. **Gerenciamento de Memória**

```typescript
xs.dispose();
ys.dispose();
```

**Crítico no navegador:**
- **dispose()**: libera memória GPU/CPU imediatamente
- **Sem dispose()**: vazamentos de memória graves
- **Boa prática**: dispose após cada uso de tensor
- **Performance**: mantém aplicação responsiva

### 9. **model.save() / tf.loadLayersModel()** - Persistência

```typescript
// Salvar
await this.model.save('localstorage://recommendation-model');

// Carregar
const model = await tf.loadLayersModel('localstorage://recommendation-model');
```

**Benefícios:**
- **Persistência local**: dados não saem do navegador
- **Continuidade**: modelo aprende entre sessões
- **Performance**: evita retreinamento do zero
- **URL especial**: 'localstorage://' é específica do TensorFlow.js

### 10. **tf.ready()** - Inicialização

```typescript
tf.ready().then(() => {
  console.log('TensorFlow.js is ready!');
});
```

**Por que usar:**
- **Inicialização**: garante que backend está pronto (WebGL, CPU, etc.)
- **Detecção de suporte**: verifica capacidades do navegador
- **Boa prática**: aguardar antes de criar modelos

## 🎯 Fluxo Completo do Machine Learning

### 1. **Preparação dos Dados**
```typescript
// One-hot encoding para categorias
const categories = [...new Set(allProducts.map(p => p.category))];
categories.forEach(cat => {
  vector.push(product.category === cat ? 1 : 0);
});

// Normalização de valores numéricos (0-1)
const normalizedPrice = product.price / maxPrice;
```

### 2. **Arquitetura da Rede**
```
Entrada (produtos + contexto) → Dense(64, ReLU) → Dropout(0.2) → Dense(32, ReLU) → Saída(softmax)
```

### 3. **Treinamento Online**
- Sessões temporais (30 min timeout)
- Sequências produto_atual → próximo_produto
- Mini-batches para eficiência
- Salvamento automático

### 4. **Inferência**
- Combinação de ML + regras heurísticas
- Score base + boosts por comportamento
- Ranking final por score decrescente

## 🏗️ Decisões Arquiteturais

### **Por que Rede Neural Simples?**
- **Educativo**: fácil de entender e explicar
- **Eficiente**: roda no navegador sem problemas
- **Suficiente**: dados limitados não justificam modelos complexos
- **Rápido**: inferência < 100ms

### **Por que Online Learning?**
- **Tempo real**: adaptação imediata ao comportamento
- **Personalização**: cada usuário tem modelo único
- **Prático**: funciona com poucos dados iniciais
- **Engajamento**: usuário vê melhorias imediatas

### **Por que localStorage?**
- **Privacidade**: dados não saem do dispositivo
- **Performance**: sem latência de rede
- **Simplicidade**: sem necessidade de backend
- **Demonstração**: ideal para POC educativo

## 🔍 Conceitos de Machine Learning Aplicados

### **1. Feature Engineering**
- Normalização de escalas diferentes
- One-hot encoding para categóricas
- Ranking relativo para ordenação

### **2. Regularização**
- Dropout para prevenir overfitting
- Learning rate baixo para estabilidade
- Poucas épocas para não memorizar

### **3. Avaliação**
- Loss como métrica de otimização
- Scores combinados (ML + heurísticas)
- Feedback implícito (cliques)

## 📚 Recursos para Aprofundamento

1. **Documentação Oficial**: https://js.tensorflow.org/
2. **Tutoriais**: https://js.tensorflow.org/tutorials/
3. **Exemplos**: https://github.com/tensorflow/tfjs-examples
4. **Conceitos ML**: https://developers.google.com/machine-learning/crash-course

---

*Este projeto demonstra como implementar ML no navegador de forma educativa e prática. Cada escolha técnica foi feita pensando na clareza conceitual e facilidade de aprendizado.*
