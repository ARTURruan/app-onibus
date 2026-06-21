# App Ônibus

App administrativo interno (mobile) para uma empresa de ônibus: gestão de frota, motoristas, manutenção e escalas.

## Stack

- [Expo](https://expo.dev/) + React Native + TypeScript
- [React Navigation](https://reactnavigation.org/)
- [Firebase](https://firebase.google.com/) (Authentication + Firestore)

## Setup

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Firebase Console](https://console.firebase.google.com/), ative **Authentication** (e-mail/senha) e **Firestore**.

3. Copie `.env.example` para `.env` e preencha com as credenciais do seu projeto Firebase:

   ```bash
   cp .env.example .env
   ```

4. Rode o app:

   ```bash
   npx expo start
   ```

   Escaneie o QR code com o app **Expo Go** no celular, ou pressione `a`/`w` para abrir no emulador Android/web.

## Estrutura

```
src/
  config/firebase.ts   # inicialização do Firebase
  navigation/           # navegação do app
  screens/               # telas, organizadas por módulo
  types/                 # tipos compartilhados (Onibus, Motorista, etc.)
```

## Roadmap

- [x] Setup do projeto e Firebase
- [x] Autenticação (login do admin)
- [x] Módulo Frota
- [x] Módulo Motoristas
- [x] Módulo Manutenção
- [x] Módulo Escalas
