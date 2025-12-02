const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand('base64-encode-decode-easily.base64EncodeDecodeEasily', function () {
		const editor = vscode.window.activeTextEditor;
		
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found!');
			return;
		}

		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		if (!selectedText) {
			vscode.window.showWarningMessage('Please select text to encode or decode!');
			return;
		}

		try {
			let result;
			
			// Check if the text is Base64 encoded
			if (isBase64(selectedText)) {
				// Decode Base64 to plain text
				result = Buffer.from(selectedText, 'base64').toString('utf-8');
				vscode.window.showInformationMessage('Decoded from Base64!');
			} else {
				// Encode plain text to Base64
				result = Buffer.from(selectedText, 'utf-8').toString('base64');
				vscode.window.showInformationMessage('Encoded to Base64!');
			}

			// Replace the selected text with the result
			editor.edit(editBuilder => {
				editBuilder.replace(selection, result);
			});
		} catch (error) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}
	});

	const encodeSelectionDisposable = vscode.commands.registerCommand('base64-encode-decode-easily.encodeSelection', function () {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor found!');
				return;
			}
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);
			if (!selectedText) {
				vscode.window.showWarningMessage('Please select text to encode!');
				return;
			}
			try {
				if(isBase64(selectedText)){
					vscode.window.showWarningMessage('Selected text is already Base64 encoded!');
					return;	
				}
				const encodedText = Buffer.from(selectedText, 'utf-8').toString('base64');
				editor.edit(editBuilder => {
					editBuilder.replace(selection, encodedText);
				});
				vscode.window.showInformationMessage('Encoded to Base64!');
			} 
			catch (error) {
				vscode.window.showErrorMessage(`Error: ${error.message}`);
			}
	});
	 
	const decodeSelectionDisposable = vscode.commands.registerCommand('base64-encode-decode-easily.decodeSelection', function () {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found!');
			return;
		}
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);
		if (!selectedText) {
			vscode.window.showWarningMessage('Please select text to decode!');
			return;
		}
		try {
			if (!isBase64(selectedText)) {
				vscode.window.showWarningMessage('Selected text is not valid Base64!');
				return;
			}
			const decodedText = Buffer.from(selectedText, 'base64').toString('utf-8');
			editor.edit(editBuilder => {
				editBuilder.replace(selection, decodedText);
			});
			vscode.window.showInformationMessage('Decoded from Base64!');
		} 
		catch (error) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}
	});	

	context.subscriptions.push(disposable);
	context.subscriptions.push(encodeSelectionDisposable);
	context.subscriptions.push(decodeSelectionDisposable);
}

/**
 * Check if a string is valid Base64
 * @param {string} str - The string to check
 * @returns {boolean} - True if the string is Base64
 */
function isBase64(str) {
	// Base64 regex pattern
	const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
	
	// Check if string matches Base64 pattern and length is valid
	if (!base64Pattern.test(str) || str.length % 4 !== 0) {
		return false;
	}

	try {
		// Try to decode and re-encode to verify it's valid Base64
		const decoded = Buffer.from(str, 'base64').toString('utf-8');
		const reencoded = Buffer.from(decoded, 'utf-8').toString('base64');
		return reencoded === str;
	} catch {
		return false;
	}
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
