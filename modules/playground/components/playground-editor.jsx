"use client"

import { useRef, useEffect, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { configureMonaco, defaultEditorOptions, getEditorLanguage } from "../lib/editor-config"

export const PlaygroundEditor = ({
  activeFile,
  content,
  onContentChange,
  suggestion,
  suggestionLoading,
  suggestionPosition,
  onAcceptSuggestion,
  onRejectSuggestion,
  onTriggerSuggestion,
}) => {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const inlineCompletionProviderRef = useRef(null)
  const currentSuggestionRef = useRef(null)
  const isAcceptingSuggestionRef = useRef(false)
  const suggestionAcceptedRef = useRef(false)
  const suggestionTimeoutRef = useRef(null)
  const tabCommandRef = useRef(null)

  const generateSuggestionId = () =>
    `suggestion-${Date.now()}-${Math.random()}`

  const createInlineCompletionProvider = useCallback(
    (monaco) => ({
      provideInlineCompletions: async (model, position) => {
        if (
          isAcceptingSuggestionRef.current ||
          suggestionAcceptedRef.current ||
          !suggestion ||
          !suggestionPosition
        ) {
          return { items: [] }
        }

        const isPositionMatch =
          position.lineNumber === suggestionPosition.line &&
          position.column >= suggestionPosition.column &&
          position.column <= suggestionPosition.column + 2

        if (!isPositionMatch) return { items: [] }

        const suggestionId = generateSuggestionId()
        currentSuggestionRef.current = {
          text: suggestion,
          position: suggestionPosition,
          id: suggestionId,
        }

        const cleanSuggestion = suggestion.replace(/\r/g, "")

        return {
          items: [
            {
              insertText: cleanSuggestion,
              range: new monaco.Range(
                suggestionPosition.line,
                suggestionPosition.column,
                suggestionPosition.line,
                suggestionPosition.column
              ),
              kind: monaco.languages.CompletionItemKind.Snippet,
              label: "AI Suggestion",
              detail: "AI-generated code suggestion",
              documentation: "Press Tab to accept",
              sortText: "0000",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            },
          ],
        }
      },
      freeInlineCompletions: () => {},
    }),
    [suggestion, suggestionPosition]
  )

  const clearCurrentSuggestion = useCallback(() => {
    currentSuggestionRef.current = null
    suggestionAcceptedRef.current = false
    editorRef.current?.trigger("ai", "editor.action.inlineSuggest.hide", null)
  }, [])

  const acceptCurrentSuggestion = useCallback(() => {
    if (
      !editorRef.current ||
      !monacoRef.current ||
      !currentSuggestionRef.current ||
      isAcceptingSuggestionRef.current ||
      suggestionAcceptedRef.current
    ) {
      return false
    }

    isAcceptingSuggestionRef.current = true
    suggestionAcceptedRef.current = true

    const editor = editorRef.current
    const monaco = monacoRef.current
    const { text, position } = currentSuggestionRef.current
    const cleanText = text.replace(/\r/g, "")

    try {
      editor.executeEdits("ai", [
        {
          range: new monaco.Range(
            position.line,
            position.column,
            position.line,
            position.column
          ),
          text: cleanText,
        },
      ])

      const lines = cleanText.split("\n")
      editor.setPosition({
        lineNumber: position.line + lines.length - 1,
        column:
          lines.length === 1
            ? position.column + cleanText.length
            : lines[lines.length - 1].length + 1,
      })

      clearCurrentSuggestion()
      onAcceptSuggestion(editor, monaco)
      return true
    } finally {
      isAcceptingSuggestionRef.current = false
      setTimeout(() => (suggestionAcceptedRef.current = false), 1000)
    }
  }, [clearCurrentSuggestion, onAcceptSuggestion])

  const hasActiveSuggestionAtPosition = useCallback(() => {
    if (!editorRef.current || !currentSuggestionRef.current) return false
    const pos = editorRef.current.getPosition()
    const sug = currentSuggestionRef.current.position
    return (
      pos.lineNumber === sug.line &&
      pos.column >= sug.column &&
      pos.column <= sug.column + 2
    )
  }, [])

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

    if (inlineCompletionProviderRef.current) {
      inlineCompletionProviderRef.current.dispose()
    }

    if (suggestion && suggestionPosition) {
      const provider = createInlineCompletionProvider(monacoRef.current)
      inlineCompletionProviderRef.current =
        monacoRef.current.languages.registerInlineCompletionsProvider(
          getEditorLanguage(activeFile?.fileExtension || ""),
          provider
        )

      setTimeout(() => {
        editorRef.current?.trigger(
          "ai",
          "editor.action.inlineSuggest.trigger",
          null
        )
      }, 50)
    }

    return () =>
      inlineCompletionProviderRef.current?.dispose()
  }, [suggestion, suggestionPosition, activeFile, createInlineCompletionProvider])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    editor.updateOptions(defaultEditorOptions)
    configureMonaco(monaco)

    editor.addCommand(monaco.KeyCode.Tab, () => {
      if (currentSuggestionRef.current && hasActiveSuggestionAtPosition()) {
        if (acceptCurrentSuggestion()) return
      }
      editor.trigger("keyboard", "tab", null)
    })

    editor.addCommand(monaco.KeyCode.Escape, () => {
      if (currentSuggestionRef.current) {
        onRejectSuggestion(editor)
        clearCurrentSuggestion()
      }
    })
  }

  return (
    <div className="h-full relative">
      {suggestionLoading && (
        <div className="absolute top-2 right-2 z-10 bg-red-100 px-2 py-1 rounded text-xs text-red-700">
          AI thinking...
        </div>
      )}

      <Editor
        height="100%"
        value={content}
        onChange={(v) => onContentChange(v || "")}
        onMount={handleEditorDidMount}
        language={
          activeFile
            ? getEditorLanguage(activeFile.fileExtension || "")
            : "plaintext"
        }
        options={defaultEditorOptions}
      />
    </div>
  )
}
