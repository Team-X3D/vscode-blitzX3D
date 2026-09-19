import * as vscode from 'vscode';
import { compilerVersion, isBlitzX3D } from '../context';
import * as bb from '../types';
import { BlitzLegacyParser } from './legacy_parser';
import { Blitz117Parser } from './v117_parser';
import { Blitz118Parser } from './v118_parser';

export interface Parser {
    parse(intext: string, uri: vscode.Uri): bb.ParseResult;
    getResults(): bb.ParseResult;
}

export function getParser(bbtext: string, bburi: vscode.Uri): Parser {
    console.debug('switching on', compilerVersion, isBlitzX3D ? '(BlitzX3D)' : '');
    if (isBlitzX3D) return new Blitz118Parser(bbtext, bburi);
    switch (compilerVersion) {
        case '11.8':
        case '2.0':
            return new BlitzLegacyParser(bbtext, bburi);
        case '11.17':
            return new Blitz117Parser(bbtext, bburi);
        case '11.18':
        default:
            return new Blitz118Parser(bbtext, bburi);
    }
}