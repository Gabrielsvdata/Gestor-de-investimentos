```markdown
# Simulador de Investimentos

Aplicativo criado com Expo + React Native para simular investimentos e planejar metas financeiras sem precisar instalar apps bancários ou visitar sites duvidosos. Usa fontes oficiais (Banco Central) para atualizar taxas e realiza os cálculos localmente.

---

## Estrutura do projeto (atualizada)

```
simulador-investimento/
├── api/
│   ├── bancocentral.js        # Busca séries e taxas oficiais (SELIC, CDI, IPCA)
│   ├── conversorMoedas.js     # Cotação / conversão entre moedas
│   └── finance.js             # Lógica e funções de simulação/comparação
├── componentes/
│   ├── BotaoPersonalizado/    # Botões estilizados do app
│   ├── CaixaDeTexto/          # Inputs com ícone (usados em formulários)
│   ├── ConfirmModal/          # Modal de confirmação animado
│   └── PopupAviso/            # Modal de aviso (substitui alert nativo)
├── contexto/
│   ├── CalculosContexto.js    # Provider com simulações e tipos de investimento
│   ├── ConfirmModalContext.js # API global para confirmar ações (Promise-based)
│   ├── ContextoMoeda.js       # Provider para taxa/convert moeda
│   └── UsuarioContexto.js     # Estado simples do usuário (login/logout)
├── navegacao/
│   └── MainNavigator.js       # Stack principal + menu superior (substitui Drawer)
├── telas/
│   ├── TelaLogin.js
│   ├── TelaSimulador.js       # Tela principal de simulação (BRL formatting)
│   └── TelaMetas.js           # Planejador de metas (formatos BRL aplicados)
├── scripts/
│   └── testApis.mjs           # Script Node para testar chamadas às APIs
├── App.js
├── index.js
├── package.json
├── babel.config.js
└── theme.js
```

## Sobre o projeto (em poucas palavras)

O app permite simular diferentes tipos de investimento usando taxas oficiais. A ideia é oferecer uma alternativa rápida e segura para testar cenários financeiros sem depender de apps bancários ou serviços não confiáveis.

Principais cuidados:
- Cálculos são feitos localmente no app.
- Taxas são obtidas de APIs públicas (Banco Central) quando disponíveis.
- Não há coleta de dados sensíveis nem integração com contas bancárias.

## Funcionalidades principais

- Simulação por tipo de investimento (comparação entre opções).
- Planejador de metas: calcula quanto tempo / quanto investir por mês para atingir um objetivo.
- Formatação de valores em BRL nas telas (`TelaSimulador` e `TelaMetas`).
- Modal de aviso (`PopupAviso`) substituindo chamadas nativas `alert()`.
- Confirmações globais via `ConfirmModalContext` (útil para logout).
- Substituição de pickers nativos por modal + `FlatList` cross-platform.

## Como rodar (rápido)

Pré-requisitos: `node`, `npm`/`yarn`, Expo CLI (opcional para mobile).

1) Instalar dependências:
# Simulador de Investimentos

Aplicativo criado com Expo + React Native para simular investimentos e planejar metas financeiras sem precisar instalar apps bancários ou visitar sites duvidosos. Usa fontes oficiais (Banco Central) para atualizar taxas e realiza os cálculos localmente.

---

## Estrutura do projeto (atualizada)

```
simulador-investimento/
├── api/
│   ├── bancocentral.js        # Busca séries e taxas oficiais (SELIC, CDI, IPCA)
│   ├── conversorMoedas.js     # Cotação / conversão entre moedas
│   └── finance.js             # Lógica e funções de simulação/comparação
├── componentes/
│   ├── BotaoPersonalizado/    # Botões estilizados do app
│   ├── CaixaDeTexto/          # Inputs com ícone (usados em formulários)
│   ├── ConfirmModal/          # Modal de confirmação animado
│   └── PopupAviso/            # Modal de aviso (substitui alert nativo)
├── contexto/
│   ├── CalculosContexto.js    # Provider com simulações e tipos de investimento
│   ├── ConfirmModalContext.js # API global para confirmar ações (Promise-based)
│   ├── ContextoMoeda.js       # Provider para taxa/convert moeda
│   └── UsuarioContexto.js     # Estado simples do usuário (login/logout)
├── navegacao/
│   └── MainNavigator.js       # Stack principal + menu superior (substitui Drawer)
├── telas/
│   ├── TelaLogin.js
│   ├── TelaSimulador.js       # Tela principal de simulação (BRL formatting)
│   └── TelaMetas.js           # Planejador de metas (formatos BRL aplicados)
├── scripts/
│   └── testApis.mjs           # Script Node para testar chamadas às APIs
├── App.js
├── index.js
├── package.json
├── babel.config.js
└── theme.js
```

## Sobre o projeto (em poucas palavras)

O app permite simular diferentes tipos de investimento usando taxas oficiais. A ideia é oferecer uma alternativa rápida e segura para testar cenários financeiros sem depender de apps bancários ou serviços não confiáveis.

Principais cuidados:
- Cálculos são feitos localmente no app.
- Taxas são obtidas de APIs públicas (Banco Central) quando disponíveis.
- Não há coleta de dados sensíveis nem integração com contas bancárias.

## Funcionalidades principais

- Simulação por tipo de investimento (comparação entre opções).
- Planejador de metas: calcula quanto tempo / quanto investir por mês para atingir um objetivo.
- Formatação de valores em BRL nas telas (`TelaSimulador` e `TelaMetas`).
- Modal de aviso (`PopupAviso`) substituindo chamadas nativas `alert()`.
- Confirmações globais via `ConfirmModalContext` (útil para logout).
- Substituição de pickers nativos por modal + `FlatList` cross-platform.

## Como rodar (rápido)

Pré-requisitos: `node`, `npm`/`yarn`, Expo CLI (opcional para mobile).

1) Instalar dependências:

```bash
npm install
# ou
yarn
```

2) Rodar em desenvolvimento com Expo:

```bash
npx expo start
```

3) Testar as chamadas de API diretamente (script incluido):

PowerShell (Windows):
```powershell
Set-Location 'C:\Users\gabri\Área de Trabalho\simulador-investimento'
node .\scripts\testApis.mjs
```

Bash / macOS / WSL:
```bash
cd ~/Área\ de\ Trabalho/simulador-investimento
node ./scripts/testApis.mjs
```

O script `scripts/testApis.mjs` executa chamadas a `api/bancocentral.js` e `api/conversorMoedas.js` e imprime as respostas no terminal.

## Componentes e Contextos (resumo)

- `BotaoPersonalizado`: botão estilizado usado nas telas.
- `CaixaDeTexto`: input com ícone; usado para valores e textos.
- `PopupAviso`: modal simples para mostrar mensagens de validação/erro.
- `ConfirmModal`: modal animado de confirmação (usado pelo `ConfirmModalContext`).
- `CalculosContexto`: provider que centraliza simulações e tipos de investimento.
- `ContextoMoeda`: provider para conversão/taxa de câmbio.

## Observações sobre dependências e decisões

- O Drawer foi removido da experiência principal e substituído por um `MainNavigator` com menu no header para simplificar a navegação e facilitar compatibilidade web/mobile.
- Substituímos pickers nativos por um modal customizado para evitar dependências adicionais e inconsistências entre plataformas.
- Algumas bibliotecas não usadas foram removidas do `package.json` para reduzir o tamanho.

## Contribuição

Contribuições são bem-vindas. Sugestões:
- Corrigir bugs / melhorar validações.
- Melhorar UX (máscaras de entrada, acessibilidade).
- Adicionar persistência (AsyncStorage) ou exportar relatórios.

Abra issues ou envie PRs direcionados ao branch `main`.

## Licença

Por padrão pode-se usar `MIT`. Se quiser, eu adiciono o arquivo `LICENSE` com o conteúdo MIT.

---

Se quiser, adapto esse README para uma versão mais curta (post para GitHub) ou adiciono seções técnicas extras (diagramas, sequências de chamadas de API, exemplos de payloads).
