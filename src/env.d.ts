interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_URL: string
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
    readonly VITE_RAILS_API_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }