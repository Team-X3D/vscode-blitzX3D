import * as vscode from 'vscode';
import * as bb from '../types';
import { BlitzX3DParser } from './x3d_parser';

export interface Parser {
    parse(intext: string, uri: vscode.Uri): bb.ParseResult;
    getResults(): bb.ParseResult;
}

export function getParser(bbtext: string, bburi: vscode.Uri): Parser {
    return new BlitzX3DParser(bbtext, bburi);
}
