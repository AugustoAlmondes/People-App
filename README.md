# People-App 👥

Uma aplicação mobile moderna desenvolvida com React Native e Expo para visualização e interação com perfis de usuários, integrando inteligência artificial para uma experiência de conversa personalizada.

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (v18+)
- Gerenciador de pacotes: `pnpm` (recomendado) ou `npm`
- Expo Go instalado no seu dispositivo móvel ou um emulador configurado.

### Passo a Passo

1. **Clonar o Repositório**
   ```bash
   git clone https://github.com/AugustoAlmondes/People-App.git
   cd People-App
   ```

2. **Instalar Dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configurar Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto e adicione seu token do HuggingFace:
   ```env
   EXPO_PUBLIC_HUGGING_FACE_TOKEN=seu_token_aqui
   ```
   A ausência do token não irá interferir no restante da aplicação. A integração com a IA será desabilitada, mas o restante da funcionalidade será operacional.

4. **Iniciar o Servidor de Desenvolvimento**
   ```bash
   pnpm start
   # ou
   npx expo start
   ```

---

## 🛠 Decisões Técnicas

- **Framework**: [Expo](https://expo.dev/) com o novo **Expo Router (v3+)**. Utilizamos roteamento baseado em arquivos para uma estrutura mais limpa e intuitiva, semelhante ao Next.js.
- **Gerenciamento de Estado**: [Zustand](https://github.com/pmndrs/zustand). Escolhido por ser leve, performático e menos verboso que o Redux. Utilizamos o middleware `persist` com `AsyncStorage` para manter o histórico de chat gravado no dispositivo.
- **Consumo de API**: [TanStack Query (React Query)](https://tanstack.com/query/latest). Gerencia o cacheamento, estados de loading e erro das requisições à API RandomUser.
- **IA**: Integração direta com a API do **HuggingFace** utilizando o modelo `Llama-3.1-8B-Instruct`.
- **Estilização**: Componentes tematizados (`ThemedView`, `ThemedText`) que suportam Dark Mode nativamente através do `useColorScheme`.

---

## ✅ O que foi Implementado

- [x] **Lista de Usuários**: Listagem dinâmica consumindo a API RandomUser.
- [x] **Filtros**: Busca por nome/sobrenome e filtragem por gênero.
- [x] **Perfil Detalhado**: Visualização completa dos dados do usuário selecionado.
- [x] **Edição de Perfil**: Tela de edição simulada (UI completa).
- [x] **Chat com IA**: Sistema de chat onde cada usuário tem uma "personalidade" baseada em seus dados reais (nome, localização, gênero).
- [x] **Persistência**: Histórico de mensagens e estado do chat salvos localmente.

---

## 🔮 O que ficaria para a Próxima Versão

- **Backend Real**: Substituir a API RandomUser por um backend próprio com persistência no banco de dados.
- **Autenticação**: Fluxo de Login/Cadastro (Firebase ou Authjs).
- **Mídia no Chat**: Possibilidade de enviar imagens e áudios.
- **Notificações Push**: Alertas de novas mensagens recebidas.
- **Otimização de Imagens**: Implementação de cache de imagens mais avançado.

---

## ⚠️ Problemas Documentados

### 1. Roteamento de Telas
Durante o desenvolvimento, foram encontrados desafios com o **Expo Router** ao lidar com parâmetros complexos ou objetos via URL (`userId` e `userStr`). Em algumas transições rápidas entre o Perfil e o Chat, o sistema de navegação pode apresentar comportamentos inesperados se o parâmetro não estiver devidamente serializado ou se a stack não for limpa corretamente.

### 2. Posicionamento do Input de Chat (Teclado)
Existe um comportamento visual intermitente na tela de Chat:
- **O Problema**: O input está localizado corretamente na base da tela. No entanto, ao abrir o teclado e fechá-lo logo em seguida, o input "salta" e fica posicionado um pouco mais acima de onde estava originalmente, criando um espaço indesejado abaixo dele.
- **O que foi tentado**: Ajustes no `KeyboardAvoidingView` (behavior: padding vs height) e uso do `SafeAreaView`. O problema parece estar relacionado à forma como o Android/iOS notifica o layout sobre a dissipação da altura do teclado em tempo real dentro de contêineres com `flex: 1`.

---

## 🤖 Integração com IA (HuggingFace)

A experiência de conversa é impulsionada pelo modelo **Llama 3.1 8B**. 
- **Contextualização**: No momento em que o usuário inicia um chat, é construído um `System Prompt` dinâmico que injeta as informações daquele usuário (ex: "Você é o João, mora em São Paulo...").
- **Histórico**: A cada mensagem enviada, é enviado o histórico de conversas anterior para a API (limitado via Zustand) para garantir que a IA mantenha o fio da conversa.
- **Simulação de Realismo**: Foram implementados indicadores de digitação (`typing indicator`) e delay artificial para tornar a conversa mais humanizada.

---
*Projeto desenvolvido como parte de um Teste Técnico.*
