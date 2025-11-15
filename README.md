## Simulador de Investimentos

Projeto React Native com Expo para simular diferentes tipos de investimentos e planejar metas financeiras.

### Estrutura do Projeto

```
simulador-investimento/
├── api/
│   ├── conversorMoedas.js      # API para conversão de moedas
│   └── finance.js              # Cálculos de investimentos
├── componentes/
│   ├── BotaoPersonalizado/     # Botão customizado
│   └── CaixaDeTexto/           # Input customizado
├── contexto/
│   ├── CalculosContexto.js     # Context para cálculos de investimentos
│   └── ContextoMoeda.js        # Context para cotação de moedas
├── telas/
│   ├── TelaLogin.js            # Tela de login
│   ├── TelaSimulador.js        # Tela de simulação de investimentos
│   └── TelaMetas.js            # Tela de planejamento de metas
├── App.js                       # Componente raiz
├── index.js                     # Ponto de entrada
├── package.json                 # Dependências
└── theme.js                     # Tema da aplicação
```

### Funcionalidades Implementadas

#### 1. **Tela de Login** (TelaLogin.js)
- Campo para usuário e senha
- Validações básicas
- Acesso ao menu principal

#### 2. **Tela de Simulador** (TelaSimulador.js)
- Simula investimentos com os seguintes tipos:
  - **SELIC**: Tesouro Selic (0.56% a.m)
  - **CDB**: CDB (0.54% a.m)
  - **LCI_LCA**: LCI/LCA (0.52% a.m)
  - **FUNDO**: Fundo Multimercado (0.48% a.m)
- Permite definir valor inicial, tipo de investimento e período
- Compara retornos de todos os investimentos
- Exibe comparação com rentabilidade em %

#### 3. **Tela de Metas** (TelaMetas.js)
- Criar metas financeiras
- Definir valor da meta e montante disponível
- Sistema recomenda o **melhor investimento** para atingir a meta
- Exibe:
  - Taxa de juros mensal
  - Tempo necessário para atingir a meta
  - Ganho esperado
- Gerenciar (adicionar/remover) metas

### Contextos

#### CalculosContexto.js
Gerencia:
- Simulações de investimentos
- Metas financeiras
- Cálculos de juros compostos
- Recomendação de melhor investimento

**Funções principais:**
- `simularInvestimento()` - Simula um investimento
- `adicionarMeta()` - Adiciona nova meta
- `removerMeta()` - Remove uma meta
- `calcularMetaInvestimento()` - Calcula investimento mínimo

#### ContextoMoeda.js
- Busca taxa de conversão USD/BRL
- Fornece contexto de câmbio para toda aplicação

### API Finance (api/finance.js)

**Tipos de investimento:**
```javascript
{
  SELIC: { nome: 'Tesouro Selic', taxa: 0.56 },
  CDB: { nome: 'CDB', taxa: 0.54 },
  LCI_LCA: { nome: 'LCI/LCA', taxa: 0.52 },
  FUNDO: { nome: 'Fundo Multimercado', taxa: 0.48 }
}
```

**Funções:**
- `calcularTempo()` - Calcula tempo para atingir valor com juros compostos
- `calcularInvestimentoMinimo()` - Calcula investimento mínimo para meta
- `encontrarMelhorInvestimento()` - Encontra melhor opção de investimento
- `calcularValorFuturo()` - Calcula valor futuro
- `compararInvestimentos()` - Compara todos os investimentos

### Componentes Reutilizáveis

#### BotaoPersonalizado
Botão customizado com tema aplicado
```javascript
<BotaoPersonalizado
  title="Simular"
  onPress={handleSimular}
  disabled={false}
/>
```

#### CaixaDeTexto
Input customizado com ícone
```javascript
<CaixaDeTexto
  placeholder="Valor inicial"
  value={valor}
  onChangeText={setValor}
  keyboardType="decimal-pad"
  icon="money"
/>
```

### Como Executar

```bash
# Instalar dependências (já feito)
npm install

# Iniciar o servidor
npm start

# Ou diretamente com Expo
npx expo start
```

### Requisitos
- Node.js
- Expo CLI
- Telefone com Expo Go ou emulador

### Tecnologias
- React Native
- Expo
- React Navigation (Drawer e Stack)
- Contexto API (React)
- MaterialIcons

### Próximas Melhorias Sugeridas
- Integração com APIs reais de cotações
- Persistência de dados (AsyncStorage)
- Gráficos de crescimento do investimento
- Notificações de metas atingidas
- Histórico de simulações
- Autenticação real
