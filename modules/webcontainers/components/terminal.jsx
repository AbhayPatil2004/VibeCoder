"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import "xterm/css/xterm.css";
import { cn } from "@/lib/utils";

const TerminalComponent = forwardRef(
  (
    {
      webcontainerUrl,
      className,
      theme = "dark",
      webContainerInstance,
    },
    ref
  ) => {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const fitAddon = useRef(null);
    const searchAddon = useRef(null);

    const currentLine = useRef("");
    const cursorPosition = useRef(0);
    const commandHistory = useRef([]);
    const historyIndex = useRef(-1);
    const currentProcess = useRef(null);
    const shellProcess = useRef(null);

    const terminalThemes = {
      dark: {
        background: "#09090B",
        foreground: "#FAFAFA",
        cursor: "#FAFAFA",
        selection: "#27272A",
      },
      light: {
        background: "#FFFFFF",
        foreground: "#18181B",
        cursor: "#18181B",
        selection: "#E4E4E7",
      },
    };

    const writePrompt = useCallback(() => {
      if (!term.current) return;
      term.current.write("\r\n$ ");
      currentLine.current = "";
      cursorPosition.current = 0;
    }, []);

    useImperativeHandle(ref, () => ({
      writeToTerminal(data) {
        term.current?.write(data);
      },
      clearTerminal() {
        clearTerminal();
      },
      focusTerminal() {
        term.current?.focus();
      },
    }));

    const executeCommand = useCallback(
      async (command) => {
        if (!webContainerInstance || !term.current) return;

        if (
          command.trim() &&
          commandHistory.current.at(-1) !== command
        ) {
          commandHistory.current.push(command);
        }
        historyIndex.current = -1;

        if (command.trim() === "clear") {
          term.current.clear();
          writePrompt();
          return;
        }

        if (!command.trim()) {
          writePrompt();
          return;
        }

        try {
          const [cmd, ...args] = command.trim().split(" ");

          term.current.writeln("");
          const process = await webContainerInstance.spawn(cmd, args, {
            terminal: {
              cols: term.current.cols,
              rows: term.current.rows,
            },
          });

          currentProcess.current = process;

          process.output.pipeTo(
            new WritableStream({
              write(data) {
                term.current?.write(data);
              },
            })
          );

          await process.exit;
          currentProcess.current = null;
          writePrompt();
        } catch {
          term.current.writeln(`\r\nCommand not found: ${command}`);
          writePrompt();
        }
      },
      [webContainerInstance, writePrompt]
    );

    const handleTerminalInput = useCallback(
      (data) => {
        if (!term.current) return;

        switch (data) {
          case "\r":
            executeCommand(currentLine.current);
            break;

          case "\u007F":
            if (cursorPosition.current > 0) {
              currentLine.current = currentLine.current.slice(0, -1);
              cursorPosition.current--;
              term.current.write("\b \b");
            }
            break;

          default:
            if (data >= " ") {
              currentLine.current += data;
              cursorPosition.current++;
              term.current.write(data);
            }
        }
      },
      [executeCommand]
    );

    const initializeTerminal = useCallback(async () => {
      if (!terminalRef.current || term.current) return;

      // 🔥 dynamic imports (SSR safe)
      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");
      const { WebLinksAddon } = await import("xterm-addon-web-links");
      const { SearchAddon } = await import("xterm-addon-search");

      const terminal = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        theme: terminalThemes[theme],
        scrollback: 1000,
      });

      const fit = new FitAddon();
      const links = new WebLinksAddon();
      const search = new SearchAddon();

      terminal.loadAddon(fit);
      terminal.loadAddon(links);
      terminal.loadAddon(search);

      terminal.open(terminalRef.current);
      terminal.onData(handleTerminalInput);

      fit.fit();

      term.current = terminal;
      fitAddon.current = fit;
      searchAddon.current = search;

      terminal.writeln("🚀 WebContainer Terminal");
      writePrompt();
    }, [theme, handleTerminalInput, writePrompt]);

    const clearTerminal = useCallback(() => {
      if (!term.current) return;
      term.current.clear();
      term.current.writeln("🚀 WebContainer Terminal");
      writePrompt();
    }, [writePrompt]);

    useEffect(() => {
      initializeTerminal();

      return () => {
        currentProcess.current?.kill();
        shellProcess.current?.kill();
        term.current?.dispose();
        term.current = null;
      };
    }, [initializeTerminal]);

    return (
      <div
        className={cn(
          "flex flex-col h-full border rounded-lg overflow-hidden",
          className
        )}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="text-sm font-medium">
            WebContainer Terminal
          </span>
        </div>

        <div className="flex-1 relative">
          <div
            ref={terminalRef}
            className="absolute inset-0 p-2"
            style={{
              background: terminalThemes[theme].background,
            }}
          />
        </div>
      </div>
    );
  }
);

TerminalComponent.displayName = "TerminalComponent";
export default TerminalComponent;
