import * as vscode from 'vscode';
import * as bb from '../types';
import { BlitzX3DAnalyzer } from './x3d_analyzer';

export interface Analyzer {
    analyze(intext: string, uri: vscode.Uri, parsed: bb.ParseResult): bb.AnalyzeResult;
    getResults(): bb.AnalyzeResult;
}

export function getAnalyzer(bbtext: string, bburi: vscode.Uri, parsed: bb.ParseResult): Analyzer {
    return new BlitzX3DAnalyzer(bbtext, bburi, parsed);
}
