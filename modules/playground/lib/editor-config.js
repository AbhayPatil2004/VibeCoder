// utils/monacoConfig.js

export const getEditorLanguage = (fileExtension) => {
  const extension = fileExtension.toLowerCase();

  const languageMap = {
    // JavaScript / TypeScript
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",

    // Web languages
    json: "json",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",

    // Markup / Docs
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",

    // Programming languages
    py: "python",
    python: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    sh: "shell",
    bash: "shell",
    sql: "sql",

    // Config
    toml: "ini",
    ini: "ini",
    conf: "ini",
    dockerfile: "dockerfile",
  };

  return languageMap[extension] || "plaintext";
};

export const configureMonaco = (monaco) => {
  monaco.editor.defineTheme("modern-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "7C7C7C", fontStyle: "italic" },
      { token: "keyword", foreground: "C586C0", fontStyle: "bold" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "entity.name.function", foreground: "DCDCAA" },
      { token: "variable", foreground: "9CDCFE" },
      { token: "entity.name.type", foreground: "4EC9B0" },
      { token: "constant", foreground: "4FC1FF" },
      { token: "invalid", foreground: "F44747", fontStyle: "underline" },
    ],
    colors: {
      "editor.background": "#0D1117",
      "editor.foreground": "#E6EDF3",
      "editorLineNumber.foreground": "#7D8590",
      "editorLineNumber.activeForeground": "#F0F6FC",
      "editorCursor.foreground": "#F0F6FC",
      "editor.selectionBackground": "#264F78",
      "editor.lineHighlightBackground": "#21262D",
      "editorWhitespace.foreground": "#6E7681",
      "editorError.foreground": "#F85149",
      "editorWarning.foreground": "#D29922",
      "editorInfo.foreground": "#75BEFF",
    },
  });

  monaco.editor.setTheme("modern-dark");

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution:
      monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution:
      monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
  });
};

export const defaultEditorOptions = {
  fontSize: 14,
  fontFamily:
    "'JetBrains Mono','Fira Code','SF Mono',Consolas,monospace",
  fontLigatures: true,

  minimap: {
    enabled: true,
    size: "proportional",
    showSlider: "mouseover",
  },

  automaticLayout: true,
  scrollBeyondLastLine: false,
  padding: { top: 16, bottom: 16 },

  lineNumbers: "on",
  lineHeight: 20,
  renderLineHighlight: "all",

  tabSize: 2,
  insertSpaces: true,

  wordWrap: "on",
  folding: true,

  cursorBlinking: "smooth",
  cursorStyle: "line",
  cursorWidth: 2,

  formatOnPaste: true,
  formatOnType: true,

  matchBrackets: "always",
  bracketPairColorization: { enabled: true },

  hover: {
    enabled: true,
    delay: 300,
  },

  stickyScroll: { enabled: true },
};
