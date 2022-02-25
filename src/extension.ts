import * as vscode from "vscode";
import * as App from "./app";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.infer.typesafe.value.generate", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const fullText = editor.document.getText();
    const filepath = editor.document.fileName;
    const lineNumber = editor.selection.active.line;
    const column = editor.selection.active.character;

    const OFFSET = 1;
    const { update, errorMessages } = App.completion({
      filename: filepath,
      code: fullText,
      columNumber: column + OFFSET,
      lineNumber: lineNumber + OFFSET,
    });
    if (errorMessages.length || !update) {
      const message = errorMessages.join("\n");
      vscode.window.setStatusBarMessage(`Infer: ${message}`);
      return;
    }
    const area = update.position;
    const newSelection = new vscode.Selection(
      new vscode.Position(area.startLineNumber - OFFSET, area.startColumn - OFFSET),
      new vscode.Position(area.endLineNumber - OFFSET, area.endColumn - OFFSET)
    );
    editor.selections = [newSelection];
    editor.edit((editBuilder) => {
      editBuilder.replace(newSelection, update.value.trim());
    });
    vscode.window.setStatusBarMessage(`Infer: Updated "${update.variableName}" variable.`);
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
