/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  // plus de variables d'environnement si nécessaire...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 