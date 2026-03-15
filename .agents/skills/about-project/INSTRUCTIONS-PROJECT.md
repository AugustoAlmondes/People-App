# 🤖 Guia de Produção — People App
> Documento de instrução para IA auxiliar no desenvolvimento do desafio técnico C2S.

---

## 📋 Visão Geral do Projeto

Você irá me ajudar a construir o **People App**, um aplicativo mobile desenvolvido com **React Native + Expo** que consome a API pública [randomuser.me](https://randomuser.me/).

O app possui **3 telas principais**:
1. **Lista de Usuários** — listagem paginada com filtros
2. **Perfil do Usuário** — detalhes ricos do usuário selecionado
3. **Chat** — conversa simulada sem backend

O objetivo é entregar um app **visualmente polido, bem arquitetado e com código limpo**, que impressione o recrutador.

---

## 🏗️ Stack Tecnológica

Use **exatamente** estas tecnologias. Não substitua sem consultar:

| Categoria | Tecnologia | Motivo |
|---|---|---|
| Framework | React Native + Expo SDK 52+ | Requisito do desafio |
| Linguagem | TypeScript | Tipagem, profissionalismo |
| Navegação | Expo Router | Já incluso no Expo, file-based routing |
| Listas | FlatList nativo (RN) | Suficiente para 20 itens/página, zero dependência |
| Data fetching | TanStack Query (React Query v5) | Paginação infinita seria complexa sem ele |
| Estado global | Zustand | Leve, sem boilerplate, evita prop drilling |
| Persistência | AsyncStorage (`@react-native-async-storage/async-storage`) | Suportado pelo Expo Go, sem build nativo |
| Animações | Reanimated 3 | Já incluso no Expo SDK, custo zero |
| Filtros | Modal nativo (RN) | Substitui `@gorhom/bottom-sheet` sem dependência extra |
| Estilo | StyleSheet nativo + constantes de tema | Sem lib de UI externa |
| Feedback tátil | expo-haptics | Já faz parte do Expo |
| Gradientes | expo-linear-gradient | Já faz parte do Expo |
| Ícones | @expo/vector-icons | Já faz parte do Expo |

---

## 📁 Estrutura de Pastas

Siga **rigorosamente** esta estrutura feature-based:

```
people-app/
├── app/                        # Expo Router (rotas como arquivos)
│   ├── _layout.tsx             # Layout raiz, providers globais
│   ├── index.tsx               # Redireciona para (tabs)
│   └── (tabs)/
│       ├── _layout.tsx         # Tab navigator
│       ├── index.tsx           # Tela: Lista de Usuários
│       ├── favorites.tsx       # Tela: Favoritos
│       └── [userId]/
│           ├── profile.tsx     # Tela: Perfil do Usuário
│           └── chat.tsx        # Tela: Chat
│
├── src/
│   ├── features/
│   │   ├── users/
│   │   │   ├── components/     # UserCard, UserListItem, SkeletonCard
│   │   │   ├── hooks/          # useUsers, useUserProfile
│   │   │   └── types.ts        # User, UserFilters, etc.
│   │   ├── filters/
│   │   │   ├── components/     # FilterSheet, FilterChip
│   │   │   ├── hooks/          # useFilters
│   │   │   └── types.ts
│   │   └── chat/
│   │       ├── components/     # MessageBubble, TypingIndicator, ChatInput
│   │       ├── hooks/          # useChat
│   │       ├── store.ts        # Zustand store do chat
│   │       └── types.ts        # Message, ChatSession
│   │
│   ├── shared/
│   │   ├── components/         # Button, Avatar, Badge, EmptyState, ErrorState
│   │   ├── hooks/              # useDebounce, useColorScheme
│   │   ├── services/
│   │   │   └── api.ts          # Cliente da randomuser.me API
│   │   └── theme/
│   │       ├── colors.ts       # Paleta de cores dark/light
│   │       ├── typography.ts   # Fontes e tamanhos
│   │       ├── spacing.ts      # Espaçamentos
│   │       └── index.ts        # Export centralizado
│   │
│   └── providers/
│       ├── QueryProvider.tsx   # TanStack Query
│       └── ThemeProvider.tsx   # Contexto de tema
│
├── assets/
├── .env                        # Variáveis de ambiente (se necessário)
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🎨 Design System

### Tema Visual

Implemente **dark mode como padrão** com suporte a light mode. Estilo: **dark glassmorphism moderno**.

```typescript
// src/shared/theme/colors.ts
export const colors = {
  dark: {
    background: '#0A0A0F',
    surface: '#13131A',
    surfaceElevated: '#1C1C28',
    border: 'rgba(255,255,255,0.08)',
    primary: '#7C6BFF',         // Roxo vibrante
    primaryLight: '#9D8FFF',
    accent: '#FF6B9D',          // Rosa para destaques
    text: '#F0F0F5',
    textSecondary: '#8888A0',
    success: '#4ADE80',
    error: '#FF5C5C',
    online: '#4ADE80',
  },
  light: {
    background: '#F5F5FA',
    surface: '#FFFFFF',
    surfaceElevated: '#EFEFFA',
    border: 'rgba(0,0,0,0.08)',
    primary: '#6355E8',
    primaryLight: '#8475FF',
    accent: '#E8447A',
    text: '#0A0A0F',
    textSecondary: '#666680',
    success: '#16A34A',
    error: '#DC2626',
    online: '#16A34A',
  }
}
```

### Regras de Design

- Bordas arredondadas: `borderRadius: 16` (cards), `12` (botões), `999` (pills)
- Sombras suaves com `elevation` no Android e `shadowColor` no iOS
- Gradientes nos cards de usuário usando `expo-linear-gradient`
- Ícones: `@expo/vector-icons` (Ionicons ou Feather)
- Fonte: **Inter** via `expo-google-fonts`
- Espaçamento base: múltiplos de 4 (`4, 8, 12, 16, 20, 24, 32`)

---

## 📱 Tela 1 — Lista de Usuários

### Comportamento

- Carrega **20 usuários** por página via `randomuser.me`
- Ao chegar no fim da lista (FlatList `onEndReached`), carrega mais 20
- Pull-to-refresh reseta e recarrega a página 1
- Toque no usuário navega para `/[userId]/profile`

### Filtros (Modal Nativo)

Implemente **3 filtros** com `Modal` nativo do React Native (sem dependência extra):

1. **Gênero**: `male` | `female` | `todos`
2. **Nacionalidade**: lista com bandeiras (BR, US, GB, FR, DE, AU)
3. **Ordem**: por nome A→Z | Z→A

Use `animationType="slide"` no Modal para simular um bottom sheet visualmente. Os filtros ativos devem aparecer como **chips** abaixo da barra de busca.

### Hook de Paginação

```typescript
// src/features/users/hooks/useUsers.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchUsers } from '@/shared/services/api'

export function useUsers(filters: UserFilters) {
  return useInfiniteQuery({
    queryKey: ['users', filters],
    queryFn: ({ pageParam = 1 }) => fetchUsers({ page: pageParam, ...filters }),
    getNextPageParam: (lastPage, pages) => pages.length + 1,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })
}
```

### UserCard Component

Cada card deve mostrar:
- Avatar circular com borda colorida (baseada no gênero ou nacionalidade)
- Nome completo
- Cidade + País com emoji da bandeira
- Ícone de favorito (coração) no canto superior direito
- Ao pressionar o coração, feedback háptico + animação de scale com Reanimated

### Estados Visuais

- **Loading inicial**: 8 SkeletonCards animados com `shimmer effect`
- **Loading de mais**: spinner discreto no rodapé da lista
- **Erro**: componente `ErrorState` com botão "Tentar novamente"
- **Lista vazia**: componente `EmptyState` com ilustração e mensagem

---

## 📱 Tela 2 — Perfil do Usuário

### Layout

Estrutura em scroll com seções bem definidas:

```
┌─────────────────────────────────┐
│  [Header com gradiente + avatar]│
│  Nome + username + bandeira     │
├─────────────────────────────────┤
│  📞 Contato (tel, email)        │
├─────────────────────────────────┤
│  📍 Localização (cidade, país)  │
│     [Card com coordenadas]      │
├─────────────────────────────────┤
│  👤 Informações pessoais        │
│     (idade, aniversário, etc.)  │
├─────────────────────────────────┤
│  🕐 Fuso horário                │
├─────────────────────────────────┤
│  [Botão: Iniciar conversa]      │
└─────────────────────────────────┘
```

### Animações do Perfil

- Avatar entra com **spring animation** (Reanimated) ao montar a tela
- Header faz **parallax** ao rolar o scroll
- Seções entram com **fade + slide** escalonado (stagger de 100ms cada)

### Extras do Perfil

- Botão **"Favoritar"** que persiste no AsyncStorage
- Botão **"Iniciar conversa"** que navega para `/[userId]/chat`
- Badge de **status online** (aleatório, para efeito visual)

---

## 📱 Tela 3 — Chat

### Estrutura da Tela

```
┌─────────────────────────────────┐
│  [Header: avatar + nome + status]│
├─────────────────────────────────┤
│                                 │
│   [Histórico de mensagens]      │
│   (FlatList invertida)          │
│                                 │
├─────────────────────────────────┤
│  [Campo de input fixo]  [Enviar]│
└─────────────────────────────────┘
```

### Funcionalidades do Chat

1. **Persistência**: todo histórico salvo por `userId` no AsyncStorage
2. **Resposta simulada**: após 1–2 segundos, o usuário "responde" com frase aleatória
3. **Indicador de digitando**: animação de 3 pontos pulsando enquanto a resposta não chega
4. **Status da mensagem**: ✓ enviado → ✓✓ lido (após 1s)
5. **Horário**: exibido em cada mensagem (HH:mm)
6. **Teclado**: `KeyboardAvoidingView` para não cobrir o input

### Tipos de Dado

```typescript
// src/features/chat/types.ts
export interface Message {
  id: string
  text: string
  sentAt: Date
  isOwn: boolean
  status: 'sent' | 'delivered' | 'read'
}

export interface ChatSession {
  userId: string
  messages: Message[]
  lastMessageAt: Date
}
```

### Zustand Store do Chat

```typescript
// src/features/chat/store.ts
interface ChatStore {
  sessions: Record<string, ChatSession>
  sendMessage: (userId: string, text: string) => void
  receiveMessage: (userId: string, text: string) => void
  getSession: (userId: string) => ChatSession | undefined
}
```

---

## 🌐 Integração com a API

### Cliente Base

```typescript
// src/shared/services/api.ts
const BASE_URL = 'https://randomuser.me/api'

export interface FetchUsersParams {
  page: number
  results?: number
  gender?: 'male' | 'female'
  nat?: string
  seed?: string  // Mesmo seed = mesmos usuários (consistência na paginação)
}

export async function fetchUsers(params: FetchUsersParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    results: String(params.results ?? 20),
    seed: params.seed ?? 'c2s-challenge',
    ...(params.gender && { gender: params.gender }),
    ...(params.nat && { nat: params.nat }),
  })

  const response = await fetch(`${BASE_URL}?${query}`)
  if (!response.ok) throw new Error('Falha ao buscar usuários')
  return response.json()
}
```

> ⚠️ **Importante**: use sempre o mesmo `seed` para garantir que a paginação funcione corretamente e não repita usuários.

---

## ⚙️ Configuração do Projeto

### Instalação

```bash
npx create-expo-app people-app --template blank-typescript
cd people-app

# Pacotes do ecossistema Expo (já integrados, sem build nativo extra)
npx expo install expo-router expo-haptics expo-linear-gradient expo-font

# Únicas dependências externas necessárias
npm install @tanstack/react-query
npm install zustand
npm install @react-native-async-storage/async-storage
```

### app.json — Plugins necessários

```json
{
  "expo": {
    "scheme": "people-app",
    "plugins": [
      "expo-router",
      "react-native-reanimated"
    ]
  }
}
```

---

## 🧩 Componentes Compartilhados Essenciais

Crie estes componentes antes de qualquer tela:

| Componente | Descrição |
|---|---|
| `<Avatar />` | Imagem circular com fallback e borda colorida |
| `<SkeletonBox />` | Retângulo animado para skeleton loading |
| `<Badge />` | Pill colorida para status/filtro |
| `<EmptyState />` | Tela vazia com ícone e mensagem |
| `<ErrorState />` | Erro com botão de retry |
| `<FilterChip />` | Chip de filtro ativo com X para remover |
| `<ThemedText />` | Texto que respeita o tema dark/light |
| `<ThemedView />` | View que respeita o tema dark/light |

---

## ✅ Checklist de Qualidade

Antes de considerar qualquer tarefa concluída, verifique:

- [ ] TypeScript sem erros (`tsc --noEmit`)
- [ ] Sem `any` explícito no código
- [ ] Todos os estados de loading/erro tratados
- [ ] Funciona em iOS e Android (testar no Expo Go)
- [ ] Sem warnings no console
- [ ] Animações com `useNativeDriver: true` onde possível
- [ ] Acessibilidade: `accessibilityLabel` nos elementos interativos
- [ ] Componentes com PropTypes ou interfaces TypeScript

---

## 📝 Padrões de Código

### Nomenclatura

- Componentes: `PascalCase` → `UserCard.tsx`
- Hooks: `camelCase` com prefixo `use` → `useUsers.ts`
- Tipos/Interfaces: `PascalCase` com sufixo descritivo → `UserFilters`
- Constantes: `UPPER_SNAKE_CASE` → `MAX_RESULTS`
- Funções utilitárias: `camelCase` → `formatDate.ts`

### Commits

Faça commits **pequenos e frequentes** com mensagens descritivas:

```
feat: add UserCard component with favorite toggle
feat: implement infinite scroll pagination with TanStack Query
feat: add filters bottom sheet with gender and nationality
fix: keyboard avoiding view on chat screen
style: apply dark glassmorphism theme to profile screen
```

---

## 🚀 Funcionalidades Extras (se der tempo)

Em ordem de prioridade/impacto:

1. **Tela de Favoritos** — lista dos usuários favoritados persistidos no AsyncStorage
2. **Busca local** — filtra por nome dentro da lista já carregada
3. **Modo offline** — exibe dados do cache quando sem internet
4. **Notificação local** — simula "nova mensagem" com `expo-notifications`
5. **Compartilhar perfil** — botão de share com `expo-sharing`

---

## 📄 README Final do Projeto

O README deve conter:

1. **GIF animado** do app funcionando (gravar com simulador)
2. **Como rodar localmente** (passo a passo)
3. **Decisões técnicas** explicadas com o *porquê* de cada escolha
4. **O que foi implementado** vs **o que ficaria para v2**
5. **Desafios enfrentados** e como foram resolvidos

---

## ⚠️ Regras Gerais para a IA

1. **Sempre pergunte antes de usar uma lib não listada**
2. **Nunca pule tratamento de erro** — loading, erro e vazio são obrigatórios
3. **Prefira composição a herança** nos componentes React
4. **Separe responsabilidades**: lógica de negócio nos hooks, UI nos componentes
5. **Escreva código que um júnior entenda**, mas com padrões de sênior
6. **Comente decisões não óbvias**, não o que o código faz
7. **Um componente = um arquivo** — sem misturar múltiplos componentes grandes
8. **Teste no Expo Go** a cada feature nova antes de continuar

---

*Última atualização: gerado para o desafio técnico C2S — Desenvolvedor Frontend Júnior*