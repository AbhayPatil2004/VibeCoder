// ❌ removed: import type { Monaco } from "@monaco-editor/react";

export const getEditorLanguage = (fileExtension) => {
  const extension = fileExtension.toLowerCase();

  const languageMap = {
    // JavaScript/TypeScript
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",

    // Web
    json: "json",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",

    // Docs
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",

    // Languages
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
      { token: "entity.name.class", foreground: "4EC9B0" },
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
    },
  });

  monaco.editor.setTheme("modern-dark");

  // JS diagnostics
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  // Compiler options
  const compilerOptions = {
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution:
      monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  };

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    compilerOptions
  );

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...compilerOptions,
    allowSyntheticDefaultImports: true,
  });
};

export const defaultEditorOptions = {
  fontSize: 14,
  fontFamily:
    "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
  fontLigatures: true,

  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  automaticLayout: true,

  lineNumbers: "on",
  lineHeight: 20,

  tabSize: 2,
  insertSpaces: true,

  wordWrap: "on",
  folding: true,

  smoothScrolling: true,
  mouseWheelZoom: true,

  cursorBlinking: "smooth",
  cursorStyle: "line",

  matchBrackets: "always",

  hover: {
    enabled: true,
    delay: 300,
  },

  "semanticHighlighting.enabled": true,
};
