import * as vscode from "vscode";
import * as App from "./app";

const OUTPUT_CHANNEL_NAME = "Inferred Value Generator";
const COMMAND_NAME = "extension.infer.typesafe.value.generate";

export const activate = (context: vscode.ExtensionContext) => {
  const channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);

  let disposable = vscode.commands.registerCommand(COMMAND_NAME, () => {
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
      errorMessages.forEach((errorMessage) => {
        channel.appendLine(`Infer: ${errorMessage}`);
      });
      channel.show();
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
    channel.appendLine(`Infer: Updated "${update.variableName}" variable.`);
  });

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export function deactivate() {}
