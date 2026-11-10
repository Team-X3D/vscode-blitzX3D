import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import { blitzCmd, compilerPath, getBlitzEnv, localPath } from '../context/context';
import { compilationErrors } from '../context/diagnostics';

export default function compile(document: vscode.TextDocument) {

    compilationErrors.clear();

    const compiletype = vscode.workspace.getConfiguration('blitz3d.compilation').get<string>('AutoCompilation');
    if (compiletype == 'None') return;

    if (compiletype == 'Open file' || compiletype == 'Both') {
        if (document.languageId != 'blitz3d') return;
        blitzcc(document.uri);
    }
    if (compiletype == 'Launch file' || compiletype == 'Both') {
        const folders = vscode.workspace.workspaceFolders;
        if (folders) {
            for (const folder of folders) {
                try {
                    const config = vscode.workspace.getConfiguration('launch', folder.uri);
                    const bbfile = config.get<any[]>("configurations")?.[0]?.bbfile ?? document.fileName;
                    const bbpath = path.isAbsolute(bbfile) ? bbfile : path.join(folder.uri.fsPath, bbfile);
                    const uri = vscode.Uri.file(bbpath);
                    if (compiletype == 'Launch file' || uri.path != document.uri.path) blitzcc(uri);
                } catch (e) {
                    vscode.window.showErrorMessage('Error occured during compilation', 'Show error')
                        .then(resp => { if (resp) vscode.window.showErrorMessage('Error: ' + e); });
                }
            }
        }
    }
}

function blitzcc(uri: vscode.Uri) {

    const blitzEnv = getBlitzEnv();
    cp.exec(`${blitzCmd} -c "${compilerPath(uri.fsPath)}"`, { env: blitzEnv }, (err, sout, serr) => {
        if (err && (serr.length > 0
            || sout.trim() == "Can't find blitzpath environment variable"
            || sout.trim() == "Unable to open linker.dll")) {
            let pathDiagnostics = compilationErrors.get(uri)?.filter(d => d.code !== "blitzcc") ?? [];
            pathDiagnostics.push({
                message: 'BlitzPath is configured incorrectly. Compilation is unavailable.',
                range: new vscode.Range(0, 0, 0, 0),
                severity: vscode.DiagnosticSeverity.Information,
                code: "blitzcc"
            });
            compilationErrors.set(uri, pathDiagnostics);
        }
        const diagnostics = new Map<vscode.Uri, vscode.Diagnostic[]>();
        for (const line of sout.split(/\r\n|\r|\n/)) {
            const match = line.match(/^"([^"]*)":(\d+):(\d+):(\d+):(\d+):(.*)$/);
            if (!match) continue;
            const erruri = vscode.Uri.file(localPath(match[1]));
            const warning = /^warning:\s*/i.test(match[6]);
            const entries = diagnostics.get(erruri) ?? [];
            entries.push({
                message: warning ? match[6].replace(/^warning:\s*/i, '') : match[6],
                range: new vscode.Range(parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]) - 1, parseInt(match[5])),
                severity: warning ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error,
                code: "blitzcc"
            });
            diagnostics.set(erruri, entries);
        }
        for (const [erruri, entries] of diagnostics) {
            compilationErrors.set(erruri, entries);
        }
    });
}


export function showErrorOnCompile(stdout: string, stderr: string) {
    if (stderr.length > 0) {
        vscode.window.showErrorMessage('Your path does not contain the blitzcc command. Please set BlitzPath in the extension settings correctly.', 'Go to settings', 'View error').then(val => {
            switch (val) {
                case 'View error':
                    vscode.window.showErrorMessage('Your path does not contain the blitzcc command. Please set BlitzPath in the extension settings correctly.', {
                        detail: 'Error: ' + stderr,
                        modal: true
                    });
                    break;
                case 'Go to settings':
                    vscode.commands.executeCommand('workbench.action.openSettings', 'blitz3d.installation.BlitzPath');
                    break;
            }
        });
    } else {
        let msg = '';
        switch (stdout.trim()) {
            case "Can't find blitzpath environment variable":
                msg = 'BlitzPath is missing from your environment variables. Please set BlitzPath in the extension settings correctly.';
                break;
            case "Unable to open linker.dll":
                msg = 'BlitzPath is configured incorrectly. Please set BlitzPath in the extension settings correctly.';
                break;
            default:
                vscode.window.showErrorMessage('Failed to compile file: ' + stdout.substring(stdout.lastIndexOf(':') + 1), 'View output').then(val => {
                    if (val) vscode.window.showErrorMessage('Failed to compile file', {
                        detail: 'Output: ' + stdout,
                        modal: true
                    });
                });
                return;
        }
        vscode.window.showErrorMessage(msg, 'Go to settings').then(val => {
            if (val) vscode.commands.executeCommand('workbench.action.openSettings', 'blitz3d.installation.BlitzPath');
        });
    }
}