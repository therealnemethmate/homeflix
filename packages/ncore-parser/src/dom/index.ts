import { JSDOM } from 'jsdom';

export function getDocument(documentHtml: string) {
    const dom = new JSDOM(documentHtml);
    return dom.window.document;
}

