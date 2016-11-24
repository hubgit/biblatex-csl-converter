(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _src = require('../src');

window.BibLatexParser = _src.BibLatexParser;
window.BibLatexExporter = _src.BibLatexExporter;
window.CSLExporter = _src.CSLExporter;

var printObject = function printObject(object) {
    var html = '';
    switch (typeof object === 'undefined' ? 'undefined' : _typeof(object)) {
        case 'object':
            if (object instanceof Array) {
                html += '[';
                object.forEach(function (item, index) {
                    html += printObject(item);
                    if (index + 1 < object.length) {
                        html += ', ';
                    }
                });
                html += ']';
            } else {
                html += '<table>';
                Object.keys(object).forEach(function (key) {
                    var valueHtml = printObject(object[key]);
                    html += '<tr><td>' + key + ': </td><td>' + valueHtml + '</td></tr>';
                });
                html += '</table>';
            }
            break;
        case 'number':
            html += String(object);
            break;
        case 'string':
            html += object.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            break;
    }
    return html;
};

var readBibPaste = function readBibPaste(event) {
    document.getElementById('bib-db').innerHTML = '<div class="spinner"></div>';
    document.getElementById('csl-db').innerHTML = '<div class="spinner"></div>';
    document.getElementById('biblatex').innerHTML = '<div class="spinner"></div>';
    var clipBoardText = event.clipboardData.getData('text');
    setTimeout(function () {
        importBiblatex(clipBoardText);
    }, 500);
};

var readBibFile = function readBibFile() {
    document.getElementById('bib-db').innerHTML = '<div class="spinner"></div>';
    document.getElementById('csl-db').innerHTML = '<div class="spinner"></div>';
    document.getElementById('biblatex').innerHTML = '<div class="spinner"></div>';
    // Add timeout so that spinners are shown before processing of file starts.
    setTimeout(function () {
        var fileUpload = document.getElementById('file-upload');
        if (fileUpload.files.length) {
            var fr = new FileReader();
            fr.onload = function (event) {
                importBiblatex(event.target.result);
            };
            fr.readAsText(fileUpload.files[0]);
        }
    }, 500);
};

var importBiblatex = function importBiblatex(bibString) {
    var t0 = performance.now();
    var parser = new _src.BibLatexParser(bibString, {
        processUnexpected: true,
        processUnknown: {
            collaborator: 'l_name'
        }
    });
    var bibDB = parser.output;
    if (parser.errors.length) {
        console.log(parser.errors);
    }
    document.getElementById('bib-db').innerHTML = printObject(bibDB);
    window.bibDB = bibDB;
    exportCSL(bibDB);
    exportBibLatex(bibDB);
    var t1 = performance.now();
    console.log('Total: ' + (t1 - t0) + ' milliseconds');
};

var exportCSL = function exportCSL(bibDB) {
    var exporter = new _src.CSLExporter(bibDB);
    var cslDB = exporter.output;
    document.getElementById('csl-db').innerHTML = printObject(cslDB);
};

var exportBibLatex = function exportBibLatex(bibDB) {
    var exporter = new _src.BibLatexExporter(bibDB);
    var biblatex = exporter.output.split('\n').join('<br>');
    document.getElementById('biblatex').innerHTML = biblatex;
};

document.getElementById('file-upload').addEventListener('change', readBibFile);
document.getElementById('paste-input').addEventListener('paste', readBibPaste, false);

},{"../src":11}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/** A list of field types of Bibligraphy DB with lookup by field name. */
var BibFieldTypes = exports.BibFieldTypes = {
    'abstract': {
        type: 'f_literal',
        biblatex: 'abstract',
        csl: 'abstract'
    },
    'addendum': {
        type: 'f_literal',
        biblatex: 'addendum'
    },
    'afterword': {
        type: 'l_name',
        biblatex: 'afterword'
    },
    'annotation': {
        type: 'f_literal',
        biblatex: 'annotation'
    },
    'annotator': {
        type: 'l_name',
        biblatex: 'annotator'
    },
    'author': {
        type: 'l_name',
        biblatex: 'author',
        csl: 'author'
    },
    'authortype': {
        type: 'f_key',
        biblatex: 'authortype'
    },
    'bookauthor': {
        type: 'l_name',
        biblatex: 'bookauthor',
        csl: 'container-author'
    },
    'bookpagination': {
        type: 'f_key',
        biblatex: 'bookpagination',
        localization: 'pagination'
    },
    'booksubtitle': {
        type: 'f_literal',
        biblatex: 'booksubtitle'
    },
    'booktitle': {
        type: 'f_literal',
        biblatex: 'booktitle',
        csl: 'container-title'
    },
    'booktitleaddon': {
        type: 'f_literal',
        biblatex: 'booktitleaddon'
    },
    'chapter': {
        type: 'f_literal',
        biblatex: 'chapter',
        csl: 'chapter-number'
    },
    'commentator': {
        type: 'l_name',
        biblatex: 'commentator'
    },
    'date': {
        type: 'f_date',
        biblatex: 'date',
        csl: 'issued'
    },
    'doi': {
        type: 'f_verbatim',
        biblatex: 'doi',
        csl: 'DOI'
    },
    'edition': {
        type: 'f_integer',
        biblatex: 'edition',
        csl: 'edition'
    },
    'editor': {
        type: 'l_name',
        biblatex: 'editor',
        csl: 'editor'
    },
    'editora': {
        type: 'l_name',
        biblatex: 'editora'
    },
    'editorb': {
        type: 'l_name',
        biblatex: 'editorb'
    },
    'editorc': {
        type: 'l_name',
        biblatex: 'editorc'
    },
    'editortype': {
        type: 'f_key',
        biblatex: 'editortype'
    },
    'editoratype': {
        type: 'f_key',
        biblatex: 'editoratype'
    },
    'editorbtype': {
        type: 'f_key',
        biblatex: 'editorbtype'
    },
    'editorctype': {
        type: 'f_key',
        biblatex: 'editorctype'
    },
    'eid': {
        type: 'f_literal',
        biblatex: 'eid'
    },
    'entrysubtype': {
        type: 'f_literal',
        biblatex: 'entrysubtype'
    },
    'eprint': {
        type: 'f_verbatim',
        biblatex: 'eprint'
    },
    'eprintclass': {
        type: 'l_literal',
        biblatex: 'eprintclass'
    },
    'eprinttype': {
        type: 'f_literal',
        biblatex: 'eprinttype'
    },
    'eventdate': {
        type: 'f_date',
        biblatex: 'eventdate',
        csl: 'event-date'
    },
    'eventtitle': {
        type: 'f_literal',
        biblatex: 'eventtitle',
        csl: 'event'
    },
    'file': {
        type: 'f_verbatim',
        biblatex: 'file'
    },
    'foreword': {
        type: 'l_name',
        biblatex: 'foreword'
    },
    'holder': {
        type: 'l_name',
        biblatex: 'holder'
    },
    'howpublished': {
        type: 'f_literal',
        biblatex: 'howpublished',
        csl: 'medium'
    },
    'indextitle': {
        type: 'f_literal',
        biblatex: 'indextitle'
    },
    'institution': {
        type: 'l_literal',
        biblatex: 'institution'
    },
    'introduction': {
        type: 'l_name',
        biblatex: 'introduction'
    },
    'isan': {
        type: 'f_literal',
        biblatex: 'isan'
    },
    'isbn': {
        type: 'f_literal',
        biblatex: 'isbn',
        csl: 'ISBN'
    },
    'ismn': {
        type: 'f_literal',
        biblatex: 'ismn'
    },
    'isrn': {
        type: 'f_literal',
        biblatex: 'isrn'
    },
    'issn': {
        type: 'f_literal',
        biblatex: 'issn',
        csl: 'ISSN'
    },
    'issue': {
        type: 'f_literal',
        biblatex: 'issue',
        csl: 'issue'
    },
    'issuesubtitle': {
        type: 'f_literal',
        biblatex: 'issuesubtitle'
    },
    'issuetitle': {
        type: 'f_literal',
        biblatex: 'issuetitle'
    },
    'iswc': {
        type: 'f_literal',
        biblatex: 'iswc'
    },
    'journalsubtitle': {
        type: 'f_literal',
        biblatex: 'journalsubtitle'
    },
    'journaltitle': {
        type: 'f_literal',
        biblatex: 'journaltitle',
        csl: 'container-title'
    },
    'keywords': {
        type: 'l_tag',
        biblatex: 'keywords'
    },
    'label': {
        type: 'f_literal',
        biblatex: 'label'
    },
    'language': {
        type: 'l_key',
        biblatex: 'language',
        csl: 'language'
    },
    'library': {
        type: 'f_literal',
        biblatex: 'library'
    },
    'location': {
        type: 'l_literal',
        biblatex: 'location',
        csl: 'publisher-place'
    },
    'mainsubtitle': {
        type: 'f_literal',
        biblatex: 'mainsubtitle'
    },
    'maintitle': {
        type: 'f_literal',
        biblatex: 'maintitle'
    },
    'maintitleaddon': {
        type: 'f_literal',
        biblatex: 'maintitleaddon'
    },
    'nameaddon': {
        type: 'f_literal',
        biblatex: 'nameaddon'
    },
    'note': {
        type: 'f_literal',
        biblatex: 'note',
        csl: 'note'
    },
    'number': {
        type: 'f_literal',
        biblatex: 'number',
        csl: 'number'
    },
    'organization': {
        type: 'l_literal',
        biblatex: 'organization'
    },
    'origdate': {
        type: 'f_date',
        biblatex: 'origdate',
        csl: 'original-date'
    },
    'origlanguage': {
        type: 'f_key',
        biblatex: 'origlanguage'
    },
    'origlocation': {
        type: 'l_literal',
        biblatex: 'origlocation',
        csl: 'original-publisher-place'
    },
    'origpublisher': {
        type: 'l_literal',
        biblatex: 'origpublisher',
        csl: 'original-publisher'
    },
    'origtitle': {
        type: 'f_literal',
        biblatex: 'origtitle',
        csl: 'original-title'
    },
    'pages': {
        type: 'f_range',
        biblatex: 'pages',
        csl: 'page'
    },
    'pagetotal': {
        type: 'f_literal',
        biblatex: 'pagetotal',
        csl: 'number-of-pages'
    },
    'pagination': {
        type: 'f_key',
        biblatex: 'pagination',
        localization: 'pagination'
    },
    'part': {
        type: 'f_literal',
        biblatex: 'part'
    },
    'publisher': {
        type: 'l_literal',
        biblatex: 'publisher',
        csl: 'publisher'
    },
    'pubstate': {
        type: 'f_key',
        biblatex: 'pubstate',
        csl: 'status',
        localization: 'publication_state'
    },
    'reprinttitle': {
        type: 'f_literal',
        biblatex: 'reprinttitle'
    },
    'series': {
        type: 'f_literal',
        biblatex: 'series',
        csl: 'collection-title'
    },
    'shortauthor': {
        type: 'l_name',
        biblatex: 'shortauthor'
    },
    'shorteditor': {
        type: 'l_name',
        biblatex: 'shorteditor'
    },
    'shorthand': {
        type: 'f_literal',
        biblatex: 'shorthand'
    },
    'shorthandintro': {
        type: 'f_literal',
        biblatex: 'shorthandintro'
    },
    'shortjournal': {
        type: 'f_literal',
        biblatex: 'shortjournal',
        csl: 'container-title-short'
    },
    'shortseries': {
        type: 'f_literal',
        biblatex: 'shortseries'
    },
    'shorttitle': {
        type: 'f_literal',
        biblatex: 'shorttitle',
        csl: 'title-short'
    },
    'subtitle': {
        type: 'f_literal',
        biblatex: 'subtitle'
    },
    'title': {
        type: 'f_literal',
        biblatex: 'title',
        csl: 'title'
    },
    'titleaddon': {
        type: 'f_literal',
        biblatex: 'titleaddon'
    },
    'translator': {
        type: 'l_name',
        biblatex: 'translator',
        csl: 'translator'
    },
    'type': {
        type: 'f_key',
        biblatex: 'type',
        localization: 'types'
    },
    'url': {
        type: 'f_uri',
        biblatex: 'url',
        csl: 'URL'
    },
    'urldate': {
        type: 'f_date',
        biblatex: 'urldate',
        csl: 'accessed'
    },
    'venue': {
        type: 'f_literal',
        biblatex: 'venue',
        csl: 'event-place'
    },
    'version': {
        type: 'f_literal',
        biblatex: 'version',
        csl: 'version'
    },
    'volume': {
        type: 'f_literal',
        biblatex: 'volume',
        csl: 'volume'
    },
    'volumes': {
        type: 'f_literal',
        biblatex: 'volumes',
        csl: 'number-of-volumes'
    }
};

/** A list of all bib types and their fields. */
var BibTypes = exports.BibTypes = {
    'article': {
        order: 1,
        biblatex: 'article',
        csl: 'article',
        required: ['journaltitle', 'title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'annotator', 'commentator', 'doi', 'editor', 'editora', 'editorb', 'editorc', 'eid', 'eprint', 'eprintclass', 'eprinttype', 'issn', 'issue', 'issuesubtitle', 'issuetitle', 'journalsubtitle', 'language', 'note', 'number', 'origlanguage', 'pages', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'version', 'volume']
    },
    'article-magazine': {
        order: 2,
        biblatex: 'article',
        csl: 'article-magazine',
        required: ['journaltitle', 'title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'annotator', 'commentator', 'doi', 'editor', 'editora', 'editorb', 'editorc', 'eid', 'eprint', 'eprintclass', 'eprinttype', 'issn', 'issue', 'issuesubtitle', 'issuetitle', 'journalsubtitle', 'language', 'note', 'number', 'origlanguage', 'pages', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'version', 'volume']
    },
    'article-newspaper': {
        order: 3,
        biblatex: 'article',
        csl: 'article-newspaper',
        required: ['journaltitle', 'title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'annotator', 'commentator', 'doi', 'editor', 'editora', 'editorb', 'editorc', 'eid', 'eprint', 'eprintclass', 'eprinttype', 'issn', 'issue', 'issuesubtitle', 'issuetitle', 'journalsubtitle', 'language', 'note', 'number', 'origlanguage', 'pages', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'version', 'volume']
    },
    'article-journal': {
        order: 4,
        biblatex: 'article',
        csl: 'article-journal',
        required: ['journaltitle', 'title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'annotator', 'commentator', 'doi', 'editor', 'editora', 'editorb', 'editorc', 'eid', 'eprint', 'eprintclass', 'eprinttype', 'issn', 'issue', 'issuesubtitle', 'issuetitle', 'journalsubtitle', 'language', 'note', 'number', 'origlanguage', 'pages', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'version', 'volume']
    },
    'post-weblog': {
        order: 5,
        biblatex: 'online',
        csl: 'post-weblog',
        required: ['date', 'title', 'url'],
        eitheror: ['editor', 'author'],
        optional: ['keywords', 'addendum', 'pubstate', 'subtitle', 'language', 'urldate', 'titleaddon', 'version', 'note', 'organization']
    },
    'book': {
        order: 10,
        biblatex: 'book',
        csl: 'book',
        required: ['title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'chapter', 'commentator', 'doi', 'edition', 'editor', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'pagetotal', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'mvbook': {
        order: 11,
        biblatex: 'mvbook',
        csl: 'book',
        required: ['title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'commentator', 'doi', 'edition', 'editor', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'note', 'number', 'origlanguage', 'pagetotal', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volumes']
    },
    'inbook': {
        order: 12,
        biblatex: 'inbook',
        csl: 'chapter',
        required: ['title', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'bookauthor', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editor', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'bookinbook': {
        order: 13,
        biblatex: 'bookinbook',
        csl: 'chapter',
        required: ['title', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'bookauthor', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editor', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'suppbook': {
        order: 14,
        biblatex: 'suppbook',
        csl: 'chapter',
        required: ['title', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'bookauthor', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editor', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'booklet': {
        order: 15,
        biblatex: 'booklet',
        csl: 'pamphlet',
        required: ['title', 'date'],
        eitheror: ['editor', 'author'],
        optional: ['keywords', 'titleaddon', 'addendum', 'pages', 'howpublished', 'type', 'pubstate', 'chapter', 'doi', 'subtitle', 'language', 'location', 'url', 'urldate', 'pagetotal', 'note', 'eprint', 'eprintclass', 'eprinttype']
    },
    'collection': {
        order: 20,
        biblatex: 'collection',
        csl: 'dataset',
        required: ['editor', 'title', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'chapter', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'pagetotal', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'mvcollection': {
        order: 21,
        biblatex: 'mvcollection',
        csl: 'dataset',
        required: ['editor', 'title', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'note', 'number', 'origlanguage', 'pagetotal', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volumes']
    },
    'incollection': {
        order: 22,
        biblatex: 'incollection',
        csl: 'entry',
        required: ['title', 'editor', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'suppcollection': {
        order: 23,
        biblatex: 'suppcollection',
        csl: 'entry',
        required: ['title', 'editor', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'post': {
        order: 30,
        biblatex: 'online',
        csl: 'post',
        required: ['date', 'title', 'url'],
        eitheror: ['editor', 'author'],
        optional: ['keywords', 'addendum', 'pubstate', 'subtitle', 'language', 'urldate', 'titleaddon', 'version', 'note', 'organization']
    },
    'manual': {
        order: 40,
        biblatex: 'manual',
        csl: 'book',
        required: ['title', 'date'],
        eitheror: ['editor', 'author'],
        optional: ['keywords', 'addendum', 'chapter', 'doi', 'edition', 'eprint', 'eprintclass', 'eprinttype', 'isbn', 'language', 'location', 'note', 'number', 'organization', 'pages', 'pagetotal', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'type', 'url', 'urldate', 'version']
    },
    'misc': {
        order: 41,
        biblatex: 'misc',
        csl: 'entry',
        required: ['title', 'date'],
        eitheror: ['editor', 'author'],
        optional: ['keywords', 'addendum', 'howpublished', 'type', 'pubstate', 'organization', 'doi', 'subtitle', 'language', 'location', 'url', 'urldate', 'titleaddon', 'version', 'note', 'eprint', 'eprintclass', 'eprinttype']
    },
    'online': {
        order: 42,
        biblatex: 'online',
        csl: 'webpage',
        required: ['date', 'title', 'url'],
        eitheror: ['editor', 'author'],
        optional: ['keywords', 'addendum', 'pubstate', 'subtitle', 'language', 'urldate', 'titleaddon', 'version', 'note', 'organization']
    },
    'patent': {
        order: 43,
        biblatex: 'patent',
        csl: 'patent',
        required: ['title', 'number', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'holder', 'location', 'pubstate', 'doi', 'subtitle', 'titleaddon', 'type', 'url', 'urldate', 'version', 'note', 'eprint', 'eprintclass', 'eprinttype']
    },
    'periodical': {
        order: 50,
        biblatex: 'periodical',
        csl: 'book',
        required: ['editor', 'title', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'volume', 'pubstate', 'number', 'series', 'issn', 'issue', 'issuesubtitle', 'issuetitle', 'doi', 'subtitle', 'editora', 'editorb', 'editorc', 'url', 'urldate', 'language', 'note', 'eprint', 'eprintclass', 'eprinttype']
    },
    'suppperiodical': {
        order: 51,
        biblatex: 'suppperiodical',
        csl: 'entry',
        required: ['journaltitle', 'title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'annotator', 'commentator', 'doi', 'editor', 'editora', 'editorb', 'editorc', 'eid', 'eprint', 'eprintclass', 'eprinttype', 'issn', 'issue', 'issuesubtitle', 'issuetitle', 'journalsubtitle', 'language', 'note', 'number', 'origlanguage', 'pages', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'version', 'volume']
    },
    'proceedings': {
        order: 60,
        biblatex: 'proceedings',
        csl: 'entry',
        required: ['editor', 'title', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'chapter', 'doi', 'eprint', 'eprintclass', 'eprinttype', 'eventdate', 'eventtitle', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'organization', 'pages', 'pagetotal', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'url', 'urldate', 'venue', 'volume', 'volumes']
    },
    'mvproceedings': {
        order: 61,
        biblatex: 'mvproceedings',
        csl: 'entry',
        required: ['editor', 'title', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'doi', 'eprint', 'eprintclass', 'eprinttype', 'eventdate', 'eventtitle', 'isbn', 'language', 'location', 'note', 'number', 'organization', 'pagetotal', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'url', 'urldate', 'venue', 'volumes']
    },
    'inproceedings': {
        order: 62,
        biblatex: 'inproceedings',
        csl: 'paper-conference',
        required: ['title', 'editor', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'booksubtitle', 'booktitleaddon', 'chapter', 'doi', 'eprint', 'eprintclass', 'eprinttype', 'eventdate', 'eventtitle', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'organization', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'url', 'urldate', 'venue', 'volume', 'volumes']
    },
    'reference': {
        order: 70,
        biblatex: 'book',
        csl: 'reference',
        required: ['editor', 'title', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'chapter', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'pagetotal', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'mvreference': {
        order: 71,
        biblatex: 'mvreference',
        csl: 'book',
        required: ['editor', 'title', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'note', 'number', 'origlanguage', 'pagetotal', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volumes']
    },
    'inreference': {
        order: 72,
        biblatex: 'inreference',
        csl: 'entry',
        required: ['title', 'editor', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'entry-encyclopedia': {
        order: 73,
        biblatex: 'inreference',
        csl: 'entry-encyclopedia',
        required: ['title', 'editor', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'entry-dictionary': {
        order: 74,
        biblatex: 'inreference',
        csl: 'entry-dictionary',
        required: ['title', 'editor', 'booktitle', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'afterword', 'annotator', 'booksubtitle', 'booktitleaddon', 'chapter', 'commentator', 'doi', 'edition', 'editora', 'editorb', 'editorc', 'eprint', 'eprintclass', 'eprinttype', 'foreword', 'introduction', 'isbn', 'language', 'location', 'mainsubtitle', 'maintitle', 'maintitleaddon', 'note', 'number', 'origlanguage', 'pages', 'part', 'publisher', 'pubstate', 'series', 'subtitle', 'titleaddon', 'translator', 'url', 'urldate', 'volume', 'volumes']
    },
    'report': {
        order: 80,
        biblatex: 'report',
        csl: 'report',
        required: ['author', 'title', 'type', 'institution', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'pages', 'pagetotal', 'pubstate', 'number', 'isrn', 'chapter', 'doi', 'subtitle', 'language', 'location', 'url', 'urldate', 'titleaddon', 'version', 'note', 'eprint', 'eprintclass', 'eprinttype']
    },
    'thesis': {
        order: 81,
        biblatex: 'thesis',
        csl: 'thesis',
        required: ['author', 'title', 'type', 'institution', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'pages', 'pagetotal', 'pubstate', 'isbn', 'chapter', 'doi', 'subtitle', 'language', 'location', 'url', 'urldate', 'titleaddon', 'note', 'eprint', 'eprintclass', 'eprinttype']
    },
    'unpublished': {
        order: 90,
        biblatex: 'unpublished',
        csl: 'manuscript',
        required: ['title', 'author', 'date'],
        eitheror: [],
        optional: ['keywords', 'addendum', 'howpublished', 'pubstate', 'isbn', 'date', 'subtitle', 'language', 'location', 'url', 'urldate', 'titleaddon', 'note']
    }
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BibLatexExporter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require("./const");

var _const2 = require("../const");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Export a list of bibliography items to bibLateX and serve the file to the user as a ZIP-file.
 * @class BibLatexExporter
 * @param pks A list of pks of the bibliography items that are to be exported.
 */

var TAGS = {
    'strong': { open: '\\mkbibbold{', close: '}' },
    'em': { open: '\\mkbibitalic{', close: '}' },
    'smallcaps': { open: '\\textsc{', close: '}' },
    'enquote': { open: '\\enquote{', close: '}' },
    'nocase': { open: '{{', close: '}}' },
    'sub': { open: '_{', close: '}' },
    'sup': { open: '^{', close: '}' },
    'math': { open: '$', close: '$' }
};

var BibLatexExporter = exports.BibLatexExporter = function () {
    function BibLatexExporter(bibDB, pks) {
        _classCallCheck(this, BibLatexExporter);

        this.bibDB = bibDB; // The bibliography database to export from.
        if (pks) {
            this.pks = pks; // A list of pk values of the bibliography items to be exported.
        } else {
            this.pks = Object.keys(bibDB); // If none are selected, all keys are exporter
        }
    }

    _createClass(BibLatexExporter, [{
        key: "_reformDate",
        value: function _reformDate(theValue) {
            // reform date-field

            var dateParts = theValue.slice();
            if (_typeof(dateParts[0]) === 'object') {
                // We have a range of dates
                return this._reformDate(dateParts[0]) + "/" + this._reformDate(dateParts[1]);
            } else {
                var dateStringParts = [];
                dateStringParts.push(String(dateParts.shift())); // year
                while (dateParts.length > 0) {
                    var datePart = dateParts.shift();
                    dateStringParts.push(('0' + datePart).slice(-2)); // month + day with two characters
                }
                return dateStringParts.join('-');
            }
        }
    }, {
        key: "_reformInteger",
        value: function _reformInteger(theValue) {
            return String(theValue);
        }
    }, {
        key: "_reformName",
        value: function _reformName(theValue) {
            var names = [],
                that = this;
            theValue.forEach(function (name) {
                if (name.literal) {
                    var literal = that._reformText(name.literal);
                    names.push("{" + literal + "}");
                } else {
                    var family = that._reformText(name.family);
                    var given = that._reformText(name.given);
                    names.push("{" + family + "} {" + given + "}");
                }
            });
            return names.join(' and ');
        }
    }, {
        key: "_escapeTeX",
        value: function _escapeTeX(theValue) {
            if ('string' != typeof theValue) {
                return false;
            }
            var len = _const.TexSpecialChars.length;
            for (var i = 0; i < len; i++) {
                theValue = theValue.replace(_const.TexSpecialChars[i][0], _const.TexSpecialChars[i][1]);
            }
            return theValue;
        }
    }, {
        key: "_reformText",
        value: function _reformText(theValue) {
            var that = this,
                latex = '',
                lastMarks = [];
            theValue.forEach(function (textNode) {
                var newMarks = [];
                if (textNode.marks) {
                    (function () {
                        var mathMode = false;
                        textNode.marks.forEach(function (mark) {
                            // We need to activate mathmode for the lowest level sub/sup node.
                            if ((mark.type === 'sup' || mark.type === 'sub') && !mathMode) {
                                newMarks.push('math');
                                newMarks.push(mark.type);
                                mathMode = true;
                            } else if (mark.type === 'nocase') {
                                // No case has to be applied at the top level to be effective.
                                newMarks.unshift(mark.type);
                            } else {
                                newMarks.push(mark.type);
                            }
                        });
                    })();
                }
                // close all tags that are not present in current text node.
                // Go through last marksd in revrse order to close innermost tags first.
                var closing = false;
                lastMarks.slice().reverse().forEach(function (mark, rIndex) {
                    var index = lastMarks.length - rIndex;
                    if (mark != newMarks[index]) {
                        closing = true;
                    }
                    if (closing) {
                        latex += TAGS[mark].close;
                        // If not inside of a nocase, add a protective brace around tag.
                        if (lastMarks[0] !== 'nocase' && TAGS[mark].open[0] === '\\') {
                            latex += '}';
                        }
                    }
                });
                // open all new tags that were not present in the last text node.
                var opening = false;
                newMarks.forEach(function (mark, index) {
                    if (mark != lastMarks[index]) {
                        opening = true;
                    }
                    if (opening) {
                        // If not inside of a nocase, add a protective brace around tag.
                        if (newMarks[0] !== 'nocase' && TAGS[mark].open[0] === '\\') {
                            latex += '{';
                        }
                        latex += TAGS[mark].open;
                    }
                });
                latex += that._escapeTeX(textNode.text);
                lastMarks = newMarks;
            });
            // Close all still open tags
            lastMarks.slice().reverse().forEach(function (mark) {
                latex += TAGS[mark].close;
            });
            return latex;
        }
    }, {
        key: "_getBibtexString",
        value: function _getBibtexString(biblist) {
            var len = biblist.length,
                str = '';
            for (var i = 0; i < len; i++) {
                if (0 < i) {
                    str += '\r\n\r\n';
                }
                var data = biblist[i];
                str += '@' + data.type + '{' + data.key;
                for (var vKey in data.values) {
                    str += ',\r\n' + vKey + ' = {' + data.values[vKey] + '}';
                }
                str += "\r\n}";
            }
            return str;
        }
    }, {
        key: "output",
        get: function get() {
            var that = this;
            this.bibtexArray = [];
            this.bibtexStr = '';

            var len = this.pks.length;

            for (var i = 0; i < len; i++) {
                var pk = this.pks[i];
                var bib = this.bibDB[pk];
                var bibEntry = {
                    'type': _const2.BibTypes[bib['bib_type']]['biblatex'],
                    'key': bib['entry_key']
                };
                var fValues = {};
                for (var fKey in bib.fields) {
                    if (!_const2.BibFieldTypes[fKey]) {
                        continue;
                    }
                    var fValue = bib.fields[fKey];
                    var fType = _const2.BibFieldTypes[fKey]['type'];
                    var key = _const2.BibFieldTypes[fKey]['biblatex'];
                    switch (fType) {
                        case 'f_date':
                            fValues[key] = this._reformDate(fValue);
                            break;
                        case 'f_integer':
                            fValues[key] = this._reformInteger(fValue);
                            break;
                        case 'f_key':
                            fValues[key] = this._escapeTeX(fValue);
                            break;
                        case 'f_literal':
                            fValues[key] = this._reformText(fValue);
                            break;
                        case 'f_range':
                            fValues[key] = this._escapeTeX(fValue);
                            break;
                        case 'f_uri':
                        case 'f_verbatim':
                            fValues[key] = this._escapeTeX(fValue);
                            break;
                        case 'l_key':
                            fValues[key] = this._escapeTeX(fValue.join(' and '));
                            break;
                        case 'l_literal':
                            fValues[key] = fValue.map(function (text) {
                                return that._reformText(text);
                            }).join(' and ');
                            break;
                        case 'l_name':
                            fValues[key] = this._reformName(fValue);
                            break;
                        case 'l_tag':
                            fValues[key] = this._escapeTeX(fValue.join(', '));
                            break;
                        default:
                            console.warn("Unrecognized type: " + fType + "!");
                    }
                }
                bibEntry.values = fValues;
                this.bibtexArray[this.bibtexArray.length] = bibEntry;
            }
            this.bibtexStr = this._getBibtexString(this.bibtexArray);
            return this.bibtexStr;
        }
    }]);

    return BibLatexExporter;
}();

},{"../const":2,"./const":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// A much smaller list for export than for import, as biblatex does understand utf8
var TexSpecialChars = exports.TexSpecialChars = [[/\\/g, '\\textbackslash '], [/\{/g, '\\{ '], [/\}/g, '\\} '], [/&/g, '{\\&}'], [/%/g, '{\\%}'], [/\$/g, '{\\$}'], [/#/g, '{\\#}'], [/_/g, '{\\_}'], [/~/g, '{\\textasciitilde}'], [/\^/g, '{\\textasciicircum}'], [/ and /g, ' {and} ']];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CSLExporter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require('../const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Converts a BibDB to a DB of the CSL type.
 * @param bibDB The bibliography database to convert.
 */

var TAGS = {
    'strong': { open: '<b>', close: '</b>' },
    'em': { open: '<i>', close: '</i>' },
    'sub': { open: '<sub>', close: '</sub>' },
    'sup': { open: '<sup>', close: '</sup>' },
    'smallcaps': { open: '<span style="font-variant: small-caps;">', close: '</span>' },
    'nocase': { open: '<span class="nocase">', close: '</span>' },
    'enquote': { open: '&ldquo;', close: '&rdquo;' }
};

var CSLExporter = exports.CSLExporter = function () {
    function CSLExporter(bibDB, pks) {
        _classCallCheck(this, CSLExporter);

        this.bibDB = bibDB;
        if (pks) {
            this.pks = pks; // A list of pk values of the bibliography items to be exported.
        } else {
            this.pks = Object.keys(bibDB); // If none are selected, all keys are exporter
        }
        this.cslDB = {};
    }

    _createClass(CSLExporter, [{
        key: 'getCSLEntry',

        /** Converts one BibDB entry to CSL format.
         * @function getCSLEntry
         * @param id The id identifying the bibliography entry.
         */
        value: function getCSLEntry(id) {
            var _this = this;

            var that = this,
                bib = this.bibDB[id],
                fValues = {};
            for (var fKey in bib.fields) {
                if (bib.fields[fKey] !== '' && fKey in _const.BibFieldTypes && 'csl' in _const.BibFieldTypes[fKey]) {
                    var fValue = bib.fields[fKey];
                    var fType = _const.BibFieldTypes[fKey]['type'];
                    var key = _const.BibFieldTypes[fKey]['csl'];

                    (function () {
                        switch (fType) {
                            case 'f_date':
                                fValues[key] = { 'date-parts': fValue };
                                break;
                            case 'f_integer':
                                fValues[key] = _this._reformInteger(fValue);
                                break;
                            case 'f_key':
                                fValues[key] = _this._escapeHtml(fValue);
                                break;
                            case 'f_literal':
                                fValues[key] = _this._reformText(fValue);
                                break;
                            case 'f_range':
                                fValues[key] = _this._escapeHtml(fValue);
                                break;
                            case 'f_uri':
                            case 'f_verbatim':
                                fValues[key] = _this._escapeHtml(fValue);
                                break;
                            case 'l_key':
                                fValues[key] = _this._escapeHtml(fValue.join(' and '));
                                break;
                            case 'l_literal':
                                var reformedTexts = [];
                                fValue.forEach(function (text) {
                                    reformedTexts.push(that._reformText(text));
                                });
                                fValues[key] = reformedTexts.join(', ');
                                break;
                            case 'l_name':
                                fValues[key] = _this._reformName(fValue);
                                break;
                            case 'l_tag':
                                fValues[key] = _this._escapeHtml(fValue.join(', '));
                                break;
                            default:
                                console.warn('Unrecognized type: ' + fType + '!');
                        }
                    })();
                }
            }
            fValues['type'] = _const.BibTypes[bib.bib_type].csl;
            return fValues;
        }
    }, {
        key: '_escapeHtml',
        value: function _escapeHtml(string) {
            return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        }
    }, {
        key: '_reformInteger',
        value: function _reformInteger(theValue) {
            return String(theValue);
        }
    }, {
        key: '_reformText',
        value: function _reformText(theValue) {
            var that = this,
                html = '',
                lastMarks = [];
            theValue.forEach(function (textNode) {
                var newMarks = [];
                if (textNode.marks) {
                    textNode.marks.forEach(function (mark) {
                        newMarks.push(mark.type);
                    });
                }
                // close all tags that are not present in current text node.
                // Go through last marksd in reverse order to close innermost tags first.
                var closing = false;
                lastMarks.slice().reverse().forEach(function (mark, rIndex) {
                    var index = lastMarks.length - rIndex;
                    if (mark != newMarks[index]) {
                        closing = true;
                    }
                    if (closing) {
                        html += TAGS[mark].close;
                    }
                });
                // open all new tags that were not present in the last text node.
                var opening = false;
                newMarks.forEach(function (mark, index) {
                    if (mark != lastMarks[index]) {
                        opening = true;
                    }
                    if (opening) {
                        html += TAGS[mark].open;
                    }
                });
                html += that._escapeHtml(textNode.text);
                lastMarks = newMarks;
            });
            // Close all still open tags
            lastMarks.slice().reverse().forEach(function (mark) {
                html += TAGS[mark].close;
            });
            return html;
        }
    }, {
        key: '_reformName',
        value: function _reformName(theNames) {
            var reformedNames = [],
                that = this;
            theNames.forEach(function (name) {
                var reformedName = {};
                if (name['literal']) {
                    reformedName['literal'] = that._reformText(name['literal']);
                } else {
                    reformedName['given'] = that._reformText(name['given']);
                    reformedName['family'] = that._reformText(name['family']);
                }
                reformedNames.push(reformedName);
            });
            return reformedNames;
        }
    }, {
        key: '_reformDate',
        value: function _reformDate(theValue) {
            //reform date-field
            var dates = theValue.split('/'),
                datesValue = [],
                len = dates.length;
            for (var i = 0; i < len; i++) {
                var eachDate = dates[i];
                var dateParts = eachDate.split('-');
                var dateValue = [];
                var len2 = dateParts.length;
                for (var j = 0; j < len2; j++) {
                    var datePart = dateParts[j];
                    if (datePart != parseInt(datePart)) break;
                    dateValue[dateValue.length] = datePart;
                }
                datesValue[datesValue.length] = dateValue;
            }

            return {
                'date-parts': datesValue
            };
        }
    }, {
        key: 'output',
        get: function get() {
            for (var bibId in this.bibDB) {
                if (this.pks.indexOf(bibId) !== -1) {
                    this.cslDB[bibId] = this.getCSLEntry(bibId);
                    this.cslDB[bibId].id = bibId;
                }
            }
            return this.cslDB;
        }
    }]);

    return CSLExporter;
}();

},{"../const":2}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BibLatexParser = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require("../const");

var _const2 = require("./const");

var _nameParser = require("./name-parser");

var _literalParser = require("./literal-parser");

var _tools = require("./tools");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// These variables are expected to be defined by some bibtex sources.
var VARIABLES = {
    JAN: "January",
    FEB: "February",
    MAR: "March",
    APR: "April",
    MAY: "May",
    JUN: "June",
    JUL: "July",
    AUG: "August",
    SEP: "September",
    OCT: "October",
    NOV: "November",
    DEC: "December"
};

/** Parses files in BibTeX/BibLaTeX format
 */

/* Based on original work by Henrik Muehe (c) 2010,
 * licensed under the MIT license,
 * https://code.google.com/archive/p/bibtex-js/
 */

var BibLatexParser = exports.BibLatexParser = function () {
    function BibLatexParser(input) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, BibLatexParser);

        this.input = input;
        this.config = config;
        this.pos = 0;
        this.entries = [];
        this.bibDB = {};
        this.currentKey = "";
        this.currentEntry = false;
        this.currentType = "";
        this.errors = [];
    }

    _createClass(BibLatexParser, [{
        key: "isWhitespace",
        value: function isWhitespace(s) {
            return s == ' ' || s == '\r' || s == '\t' || s == '\n';
        }
    }, {
        key: "match",
        value: function match(s) {
            this.skipWhitespace();
            if (this.input.substring(this.pos, this.pos + s.length) == s) {
                this.pos += s.length;
            } else {
                this.errors.push({
                    type: 'token_mismatch',
                    expected: s,
                    found: this.input.substring(this.pos)
                });
            }
            this.skipWhitespace();
        }
    }, {
        key: "tryMatch",
        value: function tryMatch(s) {
            this.skipWhitespace();
            if (this.input.substring(this.pos, this.pos + s.length) == s) {
                return true;
            } else {
                return false;
            }
            this.skipWhitespace();
        }
    }, {
        key: "skipWhitespace",
        value: function skipWhitespace() {
            while (this.isWhitespace(this.input[this.pos])) {
                this.pos++;
            }
            if (this.input[this.pos] == "%") {
                while (this.input[this.pos] != "\n") {
                    this.pos++;
                }
                this.skipWhitespace();
            }
        }
    }, {
        key: "skipToNext",
        value: function skipToNext() {
            while (this.input.length > this.pos && this.input[this.pos] != "@") {
                this.pos++;
            }
            if (this.input.length == this.pos) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        key: "valueBraces",
        value: function valueBraces() {
            var bracecount = 0;
            this.match("{");
            var start = this.pos;
            while (true) {
                if (this.input[this.pos] == '}' && this.input[this.pos - 1] != '\\') {
                    if (bracecount > 0) {
                        bracecount--;
                    } else {
                        var end = this.pos;
                        this.match("}");
                        return this.input.substring(start, end);
                    }
                } else if (this.input[this.pos] == '{' && this.input[this.pos - 1] != '\\') {
                    bracecount++;
                } else if (this.pos == this.input.length - 1) {
                    this.errors.push({ type: 'unexpected_eof' });
                }
                this.pos++;
            }
        }
    }, {
        key: "valueQuotes",
        value: function valueQuotes() {
            this.match('"');
            var start = this.pos;
            while (true) {
                if (this.input[this.pos] == '"' && this.input[this.pos - 1] != '\\') {
                    var end = this.pos;
                    this.match('"');
                    return this.input.substring(start, end);
                } else if (this.pos == this.input.length - 1) {
                    this.errors.push({
                        type: 'unterminated_value',
                        value: this.input.substring(start)
                    });
                }
                this.pos++;
            }
        }
    }, {
        key: "singleValue",
        value: function singleValue() {
            var start = this.pos;
            if (this.tryMatch("{")) {
                return this.valueBraces();
            } else if (this.tryMatch('"')) {
                return this.valueQuotes();
            } else {
                var k = this.key().toLowerCase();
                if (VARIABLES[k.toUpperCase()]) {
                    return VARIABLES[k.toUpperCase()];
                } else if (k.match("^[0-9]+$")) {
                    return k;
                } else {
                    this.errors.push({
                        type: 'value_unexpected',
                        value: this.input.substring(start)
                    });
                }
            }
        }
    }, {
        key: "value",
        value: function value() {
            var values = [];
            values.push(this.singleValue());
            while (this.tryMatch("#")) {
                this.match("#");
                values.push(this.singleValue());
            }
            return values.join("");
        }
    }, {
        key: "key",
        value: function key() {
            var start = this.pos;
            while (true) {
                if (this.pos == this.input.length) {
                    this.errors.push({ type: 'runaway_key' });
                    return;
                }
                if (this.input[this.pos].match("[a-zA-Z0-9\xC0-\xD6\xD8-\xF6\xF8-\u017F_:;`\\.\\?+/-]")) {
                    this.pos++;
                } else {
                    return this.input.substring(start, this.pos);
                }
            }
        }
    }, {
        key: "keyEqualsValue",
        value: function keyEqualsValue() {
            var key = this.key().toLowerCase();
            if (this.tryMatch("=")) {
                this.match("=");
                var val = this.value();
                return [key, val];
            } else {
                this.errors.push({
                    type: 'missing_equal_sign',
                    key: this.input.substring(this.pos)
                });
            }
        }
    }, {
        key: "keyValueList",
        value: function keyValueList() {
            var kv = this.keyEqualsValue();
            if (typeof kv === 'undefined') {
                // Entry has no fields, so we delete it.
                // It was the last one pushed, so we remove the last one
                this.entries.pop();
                return;
            }
            var rawFields = this.currentEntry['raw_fields'];
            rawFields[kv[0]] = kv[1];
            while (this.tryMatch(",")) {
                this.match(",");
                //fixes problems with commas at the end of a list
                if (this.tryMatch("}")) {
                    break;
                }
                kv = this.keyEqualsValue();
                if (typeof kv === 'undefined') {
                    this.errors.push({ type: 'variable_error' });
                    break;
                }
                rawFields[kv[0]] = kv[1];
            }
        }
    }, {
        key: "processFields",
        value: function processFields() {
            var _this = this;

            var rawFields = this.currentEntry['raw_fields'];
            var fields = this.currentEntry['fields'];

            // date may come either as year, year + month or as date field.
            // We therefore need to catch these hear and transform it to the
            // date field after evaluating all the fields.
            // All other date fields only come in the form of a date string.

            var date = void 0;
            if (rawFields.date) {
                // date string has precedence.
                date = rawFields.date;
            } else if (rawFields.year && rawFields.month) {
                date = rawFields.year + "-" + rawFields.month;
            } else if (rawFields.year) {
                date = "" + rawFields.year;
            }
            if (date) {
                var dateParts = this._reformDate(date);
                if (dateParts) {
                    fields['date'] = dateParts;
                } else {
                    var field_name = void 0,
                        value = void 0;
                    if (rawFields.date) {
                        field_name = 'date';
                        value = rawFields.date;
                    } else if (rawFields.year && rawFields.month) {
                        field_name = 'year,month';
                        value = [rawFields.year, rawFields.month];
                    } else {
                        field_name = 'year';
                        value = rawFields.year;
                    }
                    this.errors.push({
                        type: 'unknown_date',
                        entry: this.currentEntry['entry_key'],
                        field_name: field_name,
                        value: value
                    });
                }
            }

            var _loop = function _loop(bKey) {

                if (bKey === 'date' || ['year', 'month'].includes(bKey) && !_this.config.parseUnknown) {
                    // Handled above
                    return "continue|iterateFields";
                }

                // Replace alias fields with their main term.
                var aliasKey = _const2.BiblatexFieldAliasTypes[bKey],
                    fKey = void 0;
                if (aliasKey) {
                    if (rawFields[aliasKey]) {
                        _this.errors.push({
                            type: 'alias_creates_duplicate_field',
                            entry: _this.currentEntry['entry_key'],
                            field: bKey,
                            alias_of: aliasKey,
                            value: rawFields[bKey],
                            alias_of_value: rawFields[aliasKey]
                        });
                        return "continue|iterateFields";
                    }

                    fKey = Object.keys(_const.BibFieldTypes).find(function (ft) {
                        return _const.BibFieldTypes[ft].biblatex === aliasKey;
                    });
                } else {
                    fKey = Object.keys(_const.BibFieldTypes).find(function (ft) {
                        return _const.BibFieldTypes[ft].biblatex === bKey;
                    });
                }

                var oFields = void 0,
                    fType = void 0;
                var bType = _const.BibTypes[_this.currentEntry['bib_type']];

                if ('undefined' == typeof fKey) {
                    _this.errors.push({
                        type: 'unknown_field',
                        entry: _this.currentEntry['entry_key'],
                        field_name: bKey
                    });
                    if (!_this.config.processUnknown) {
                        return "continue|iterateFields";
                    }
                    if (!_this.currentEntry['unknown_fields']) {
                        _this.currentEntry['unknown_fields'] = {};
                    }
                    oFields = _this.currentEntry['unknown_fields'];
                    fType = _this.config.processUnknown[bKey] ? _this.config.processUnknown[bKey] : 'f_literal';
                    fKey = bKey;
                } else if (bType['required'].includes(fKey) || bType['optional'].includes(fKey) || bType['eitheror'].includes(fKey)) {
                    oFields = fields;
                    fType = _const.BibFieldTypes[fKey]['type'];
                } else {
                    _this.errors.push({
                        type: 'unexpected_field',
                        entry: _this.currentEntry['entry_key'],
                        field_name: bKey
                    });
                    if (!_this.config.processUnexpected) {
                        return "continue|iterateFields";
                    }
                    if (!_this.currentEntry['unexpected_fields']) {
                        _this.currentEntry['unexpected_fields'] = {};
                    }
                    oFields = _this.currentEntry['unexpected_fields'];
                    fType = _const.BibFieldTypes[fKey]['type'];
                }

                var fValue = rawFields[bKey];
                switch (fType) {
                    case 'f_date':
                        var _dateParts = _this._reformDate(fValue);
                        if (_dateParts) {
                            oFields[fKey] = _dateParts;
                        } else {
                            _this.errors.push({
                                type: 'unknown_date',
                                entry: _this.currentEntry['entry_key'],
                                field_name: fKey,
                                value: fValue
                            });
                        }
                        break;
                    case 'f_integer':
                        oFields[fKey] = _this._reformInteger(fValue);
                        break;
                    case 'f_key':
                        break;
                    case 'f_literal':
                        oFields[fKey] = _this._reformLiteral(fValue);
                        break;
                    case 'f_range':
                    case 'f_uri':
                    case 'f_verbatim':
                        break;
                    case 'l_key':
                        oFields[fKey] = (0, _tools.splitTeXString)(fValue);
                        break;
                    case 'l_tag':
                        oFields[fKey] = fValue.split(',').map(function (string) {
                            return string.trim();
                        });
                        break;
                    case 'l_literal':
                        var items = (0, _tools.splitTeXString)(fValue);
                        oFields[fKey] = [];
                        items.forEach(function (item) {
                            oFields[fKey].push(_this._reformLiteral(item));
                        });
                        break;
                    case 'l_name':
                        oFields[fKey] = _this._reformNameList(fValue);
                        break;
                    default:
                        console.warn("Unrecognized type: " + fType + "!");
                }
            };

            iterateFields: for (var bKey in rawFields) {
                var _ret = _loop(bKey);

                if (_ret === "continue|iterateFields") continue iterateFields;
            }
        }
    }, {
        key: "_reformNameList",
        value: function _reformNameList(nameString) {
            var people = (0, _tools.splitTeXString)(nameString);
            return people.map(function (person) {
                var nameParser = new _nameParser.BibLatexNameParser(person);
                return nameParser.output;
            });
        }
    }, {
        key: "_reformDate",
        value: function _reformDate(dateStr) {
            var that = this;
            if (dateStr.includes('/')) {
                var _ret2 = function () {
                    var dateRangeParts = dateStr.split('/');
                    var dateRangeArray = [];
                    dateRangeParts.forEach(function (dateRangePart) {
                        var reformedDate = that._reformDate(dateRangePart);
                        if (reformedDate) {
                            dateRangeArray.push(reformedDate);
                        }
                    });
                    if (dateRangeArray.length > 2) {
                        dateRangeArray = dateRangeArray.splice(0, 2);
                    } else if (dateRangeArray.length === 1) {
                        dateRangeArray = dateRangeArray[0];
                    } else if (dateRangeArray.length === 0) {
                        dateRangeArray = null;
                    }
                    return {
                        v: dateRangeArray
                    };
                }();

                if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
            }
            var month = true,
                day = true;
            var dateLen = dateStr.split(/[\s,\./\-]/g).length;
            if (dateLen === 1) {
                month = false;
                day = false;
            } else if (dateLen === 2) {
                day = false;
            }
            var theDate = new Date(dateStr);
            if ('Invalid Date' == theDate) {
                return null;
            }

            var dateArray = [];
            dateArray.push(theDate.getFullYear());

            if (month) {
                dateArray.push(theDate.getMonth() + 1);
            }

            if (day) {
                dateArray.push(theDate.getDate());
            }

            return dateArray;
        }
    }, {
        key: "_reformLiteral",
        value: function _reformLiteral(theValue) {
            var parser = new _literalParser.BibLatexLiteralParser(theValue);
            return parser.output;
        }
    }, {
        key: "_reformInteger",
        value: function _reformInteger(theValue) {
            var theInt = parseInt(theValue);
            if (isNaN(theInt)) {
                theInt = 0;
            }
            return theInt;
        }
    }, {
        key: "bibType",
        value: function bibType() {
            var biblatexType = this.currentType;
            if (_const2.BiblatexAliasTypes[biblatexType]) {
                biblatexType = _const2.BiblatexAliasTypes[biblatexType];
            }

            var bibType = Object.keys(_const.BibTypes).find(function (bType) {
                return _const.BibTypes[bType]['biblatex'] === biblatexType;
            });

            if (typeof bibType === 'undefined') {
                this.errors.push({
                    type: 'unknown_type',
                    type_name: biblatexType
                });
                bibType = 'misc';
            }

            return bibType;
        }
    }, {
        key: "newEntry",
        value: function newEntry() {
            this.currentEntry = {
                'bib_type': this.bibType(),
                'entry_key': this.key(),
                'raw_fields': {},
                'fields': {}
            };
            this.entries.push(this.currentEntry);
            this.match(",");
            this.keyValueList();
            this.processFields();
        }
    }, {
        key: "directive",
        value: function directive() {
            this.match("@");
            this.currentType = this.key().toLowerCase();
            return "@" + this.currentType;
        }
    }, {
        key: "string",
        value: function string() {
            var kv = this.keyEqualsValue();
            VARIABLES[kv[0].toUpperCase()] = kv[1];
        }
    }, {
        key: "preamble",
        value: function preamble() {
            this.value();
        }
    }, {
        key: "replaceTeXChars",
        value: function replaceTeXChars() {
            var value = this.input;
            var len = _const2.TeXSpecialChars.length;
            for (var i = 0; i < len; i++) {
                var texChar = _const2.TeXSpecialChars[i];
                var texCharRe = new RegExp("{" + texChar[0] + "}|" + texChar[0], 'g');
                value = value.replace(texCharRe, texChar[1]);
            }
            // Delete multiple spaces
            this.input = value.replace(/ +(?= )/g, '');
            return;
        }
    }, {
        key: "bibtex",
        value: function bibtex() {
            while (this.skipToNext()) {
                var d = this.directive();
                this.match("{");
                if (d == "@string") {
                    this.string();
                } else if (d == "@preamble") {
                    this.preamble();
                } else if (d == "@comment") {
                    continue;
                } else {
                    this.newEntry();
                }
                this.match("}");
            }
        }
    }, {
        key: "createBibDB",
        value: function createBibDB() {
            var that = this;
            this.entries.forEach(function (entry, index) {
                that.bibDB[index] = entry;
            });
        }
    }, {
        key: "output",
        get: function get() {
            this.replaceTeXChars();
            this.bibtex();
            this.createBibDB();
            return this.bibDB;
        }
    }]);

    return BibLatexParser;
}();

},{"../const":2,"./const":7,"./literal-parser":8,"./name-parser":9,"./tools":10}],7:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});/** A list of all field aliases and what they refer to. */var BiblatexFieldAliasTypes=exports.BiblatexFieldAliasTypes={'address':'location','annote':'annotation','archiveprefix':'eprinttype','journal':'journaltitle','pdf':'file','primaryclass':'eprintclass','school':'institution'};/** A list of all bibentry aliases and what they refer to. */var BiblatexAliasTypes=exports.BiblatexAliasTypes={'conference':'inproceedings','electronic':'online','mastersthesis':'thesis','phdthesis':'thesis','techreport':'thesis','www':'online'};/** A list of special chars in Tex and their unicode equivalent. */var TeXSpecialChars=exports.TeXSpecialChars=[["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char220\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char220",'\u033C'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char225\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char225",'\u0361'],["\\{\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char201\\}|\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char201",'\u013F'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char218\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char218",'\u033A'],["\\{\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char202\\}|\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char202",'\u0140'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char207\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char207",'\u032F'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char203\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char203",'\u032B'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char185\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char185",'\u0319'],["\\{\\\\fontencoding\\{LEIP\\}\\\\selectfont\\\\char202\\}|\\\\fontencoding\\{LEIP\\}\\\\selectfont\\\\char202",'\u027F'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char184\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char184",'\u0318'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char177\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char177",'\u0311'],["\\{\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char195\\}|\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char195",'\u01BA'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char215\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char215",'\u0337'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char216\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char216",'\u0338'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char219\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char219",'\u033B'],["\\{\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char221\\}|\\\\fontencoding\\{LECO\\}\\\\selectfont\\\\char221",'\u033D'],["\\{\\\\fontencoding\\{LEIP\\}\\\\selectfont\\\\char61\\}|\\\\fontencoding\\{LEIP\\}\\\\selectfont\\\\char61",'\u0258'],["\\{\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char63\\}|\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char63",'\u0167'],["\\{\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char91\\}|\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char91",'\u0138'],["\\{\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char40\\}|\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char40",'\u0126'],["\\{\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char47\\}|\\\\fontencoding\\{LELA\\}\\\\selectfont\\\\char47",'\u0166'],["\\\\mathbin\\{\\{:\\}\\\\!\\\\!\\{\\-\\}\\\\!\\\\!\\{:\\}\\}",'\u223A'],["\\\\cyrchar\\\\cyrhundredthousands",'\u0488'],['\\\\acute\\{\\\\ddot\\{\\\\upsilon\\}\\}','\u03B0'],["\\\\Pisymbol\\{ppi020\\}\\{105\\}",'\u2A9E'],["\\\\acute\\{\\\\ddot\\{\\\\iota\\}\\}",'\u0390'],["\\\\Pisymbol\\{ppi020\\}\\{117\\}",'\u2A9D'],["\\\\mathsfbfsl\\{\\\\varkappa\\}",'\uD835\uDFC6'],["\\\\barleftarrowrightarrowba",'\u21B9'],["\\\\mathsfbfsl\\{\\\\vartheta\\}",'\uD835\uDF97'],["\\\\not\\\\kern\\-0\\.3em\\\\times",'\u226D'],["\\\\leftarrowshortrightarrow",'\u2943'],["\\\\mathsfbfsl\\{\\\\varsigma\\}",'\uD835\uDFBB'],["\\\\Pisymbol\\{ppi022\\}\\{87\\}",'\u03D0'],["\\\\concavediamondtickright",'\u27E3'],["\\\\invwhiteupperhalfcircle",'\u25DA'],['\\\\mathsfbfsl\\{\\\\Upsilon\\}','\uD835\uDFA4'],["\\\\nvtwoheadrightarrowtail",'\u2917'],["\\\\nVtwoheadrightarrowtail",'\u2918'],["\\\\invwhitelowerhalfcircle",'\u25DB'],["\\\\leftrightarrowtriangle",'\u21FF'],["\\\\partialmeetcontraction",'\u2AA3'],['\\\\updownharpoonleftright','\u294D'],["\\\\ensuremath\\{\\\\Elzpes\\}",'\u20A7'],["\\\\texteuro|\\{\\\\mbox\\{\\\\texteuro\\}\\}|\\\\mbox\\{\\\\texteuro\\}",'\u20AC'],["\\\\cyrchar\\\\CYROMEGATITLO",'\u047C'],["\\\\mathsfbfsl\\{\\\\varrho\\}",'\uD835\uDFC8'],["\\\\cyrchar\\\\cyromegatitlo",'\u047D'],["\\\\nVtwoheadleftarrowtail",'\u2B3D'],["\\\\concavediamondtickleft",'\u27E2'],['\\\\updownharpoonrightleft','\u294C'],["\\\\blackcircleulquadwhite",'\u25D5'],["\\\\mathsfbfsl\\{\\\\Lambda\\}",'\uD835\uDF9A'],["\\\\mathsfbf\\{\\\\varsigma\\}",'\uD835\uDF81'],["\\\\mathsfbf\\{\\\\varkappa\\}",'\uD835\uDF8C'],["\\\\nvtwoheadleftarrowtail",'\u2B3C'],["\\\\mathsfbf\\{\\\\vartheta\\}",'\uD835\uDF67'],["\\\\downtrianglerightblack",'\u29E9'],["\\\\ElsevierGlyph\\{E838\\}",'\u233D'],["\\\\ElsevierGlyph\\{2129\\}",'\u2129'],["\\\\ElsevierGlyph\\{E219\\}",'\u2937'],["\\\\rangledownzigzagarrow",'\u237C'],["\\\\mathsfbfsl\\{\\\\Omega\\}",'\uD835\uDFA8'],["\\\\mathrm\\{\\\\ddot\\{Y\\}\\}",'\u03AB'],["\\\\mathsfbfsl\\{\\\\nabla\\}",'\uD835\uDFA9'],["\\\\mathrm\\{\\\\ddot\\{I\\}\\}",'\u03AA'],["\\\\mathsfbfsl\\{\\\\Gamma\\}",'\uD835\uDF92'],["\\\\ElsevierGlyph\\{2275\\}",'\u2275'],["\\\\ElsevierGlyph\\{E21A\\}",'\u2936'],["\\\\ElsevierGlyph\\{E214\\}",'\u297C'],["\\\\ElsevierGlyph\\{E215\\}",'\u297D'],["\\\\ElsevierGlyph\\{2274\\}",'\u2274'],["\\\\ElsevierGlyph\\{2232\\}",'\u2232'],["\\\\ElsevierGlyph\\{E212\\}",'\u2905'],["\\\\ElsevierGlyph\\{2233\\}",'\u2233'],["\\\\ElsevierGlyph\\{3018\\}",'\u2985'],["\\\\sim\\\\joinrel\\\\leadsto",'\u27FF'],["\\\\ElsevierGlyph\\{2238\\}",'\u2238'],["\\\\ElsevierGlyph\\{E291\\}",'\u2994'],["\\\\ElsevierGlyph\\{E21C\\}",'\u2933'],['\\\\underrightharpoondown','\u20EC'],["\\\\ElsevierGlyph\\{2242\\}",'\u2242'],["\\\\ElsevierGlyph\\{E260\\}",'\u29B5'],["\\\\ElsevierGlyph\\{E61B\\}",'\u29B6'],["\\\\cyrchar\\\\cyrsemisftsn",'\u048D'],["\\\\cyrchar\\\\CYRSEMISFTSN",'\u048C'],["\\\\cyrchar\\\\cyrthousands",'\u0482'],["\\\\ElsevierGlyph\\{3019\\}",'\u3019'],["\\\\ElsevierGlyph\\{300B\\}",'\u300B'],["\\\\leftrightharpoonsdown",'\u2967'],["\\\\rightleftharpoonsdown",'\u2969'],["\\\\ElsevierGlyph\\{E210\\}",'\u292A'],["\\\\ElsevierGlyph\\{300A\\}",'\u300A'],["\\\\ElsevierGlyph\\{E372\\}",'\u29DC'],["\\\\ElsevierGlyph\\{22C0\\}",'\u22C0'],["\\\\downtriangleleftblack",'\u29E8'],["\\\\blackdiamonddownarrow",'\u29EA'],["\\\\ElsevierGlyph\\{E20F\\}",'\u2929'],["\\\\ElsevierGlyph\\{E20E\\}",'\u2928'],["\\\\ElsevierGlyph\\{E211\\}",'\u2927'],["\\\\ElsevierGlyph\\{E20A\\}",'\u2926'],["\\\\ElsevierGlyph\\{225A\\}",'\u225A'],["\\\\ElsevierGlyph\\{225F\\}",'\u225F'],["\\\\ElsevierGlyph\\{E20B\\}",'\u2925'],["\\\\ElsevierGlyph\\{E20D\\}",'\u2924'],['\\\\mathsfbf\\{\\\\Upsilon\\}','\uD835\uDF6A'],["\\\\ElsevierGlyph\\{22C1\\}",'\u22C1'],["\\\\mathbit\\{\\\\varkappa\\}",'\uD835\uDF52'],["\\\\mathbit\\{\\\\vartheta\\}",'\uD835\uDF51'],["\\\\mathbit\\{\\\\varsigma\\}",'\uD835\uDF47'],["\\\\ElsevierGlyph\\{E20C\\}",'\u2923'],["\\\\ElsevierGlyph\\{E395\\}",'\u2A10'],["\\\\ElsevierGlyph\\{E25A\\}",'\u2A25'],["\\\\ElsevierGlyph\\{21B3\\}",'\u21B3'],["\\\\ElsevierGlyph\\{E25B\\}",'\u2A2A'],["\\\\ElsevierGlyph\\{E25C\\}",'\u2A2D'],["\\\\ElsevierGlyph\\{E25D\\}",'\u2A2E'],["\\\\ElsevierGlyph\\{E25E\\}",'\u2A34'],["\\\\ElsevierGlyph\\{E259\\}",'\u2A3C'],["\\\\ElsevierGlyph\\{E381\\}",'\u25B1'],["\\\\closedvarcupsmashprod",'\u2A50'],["\\\\ElsevierGlyph\\{E36E\\}",'\u2A55'],["\\\\barovernorthwestarrow",'\u21B8'],["\\\\mathsfbfsl\\{\\\\Delta\\}",'\uD835\uDF93'],["\\\\ElsevierGlyph\\{E30D\\}",'\u2AEB'],["\\\\mathsfbfsl\\{\\\\Sigma\\}",'\uD835\uDFA2'],["\\\\mathsfbfsl\\{\\\\varpi\\}",'\uD835\uDFC9'],['\\\\mathbit\\{\\\\Upsilon\\}','\uD835\uDF30'],["\\\\whiteinwhitetriangle",'\u27C1'],["\\\\cyrchar\\\\cyromegarnd",'\u047B'],["\\\\cyrchar\\\\CYRABHCHDSC",'\u04BE'],["\\\\cyrchar\\\\CYROMEGARND",'\u047A'],["\\\\twoheadleftarrowtail",'\u2B3B'],["\\\\mathsl\\{\\\\varkappa\\}",'\uD835\uDF18'],["\\\\mathsl\\{\\\\varsigma\\}",'\uD835\uDF0D'],["\\\\cyrchar\\\\cyrabhchdsc",'\u04BF'],["\\\\cyrchar\\\\CYRpalochka",'\u04C0'],["\\\\mathbf\\{\\\\varkappa\\}",'\uD835\uDEDE'],["\\\\CapitalDifferentialD",'\u2145'],["\\\\mathbf\\{\\\\varsigma\\}",'\uD835\uDED3'],["\\\\mathsfbf\\{\\\\varrho\\}",'\uD835\uDF8E'],["\\\\twoheaduparrowcircle",'\u2949'],["\\\\rightarrowbackapprox",'\u2B48'],["\\\\curvearrowrightminus",'\u293C'],["\\\\barrightarrowdiamond",'\u2920'],["\\\\leftrightarrowcircle",'\u2948'],["\\\\downrightcurvedarrow",'\u2935'],["\\\\NestedGreaterGreater",'\u2AA2'],["\\\\cyrchar\\{\\\\'\\\\CYRK\\}",'\u040C'],["\\\\mathsl\\{\\\\vartheta\\}",'\uD835\uDEF3'],["\\\\mathsfbf\\{\\\\Lambda\\}",'\uD835\uDF60'],['\\\\underleftharpoondown','\u20ED'],["\\\\mathbf\\{\\\\vartheta\\}",'\uD835\uDEB9'],["\\\\cyrchar\\{\\\\'\\\\cyrk\\}",'\u045C'],["\\\\blackcircledrightdot",'\u2688'],["\\\\whitesquaretickright",'\u27E5'],["\\\\cyrchar\\{\\\\'\\\\cyrg\\}",'\u0453'],["\\\\cyrchar\\{\\\\'\\\\CYRG\\}",'\u0403'],["\\\\cyrchar\\\\cyrmillions",'\u0489'],["\\\\ReverseUpEquilibrium",'\u296F'],["\\\\blackcircledownarrow",'\u29ED'],["\\\\int\\\\!\\\\int\\\\!\\\\int",'\u222D'],["\\\\leftrightsquigarrow",'\u21AD'],["\\\\leftarrowbackapprox",'\u2B42'],["\\\\mathbit\\{\\\\Lambda\\}",'\uD835\uDF26'],["\\\\mathsfbfsl\\{\\\\phi\\}",'\uD835\uDFC7'],["\\\\blockthreeqtrshaded",'\u2593'],["\\\\whitesquaretickleft",'\u27E4'],["\\\\blackcircledtwodots",'\u2689'],["\\\\stackrel\\{\\*\\}\\{=\\}",'\u2A6E'],["\\\\whitearrowupfrombar",'\u21EA'],["\\\\mathsfbfsl\\{\\\\Phi\\}",'\uD835\uDFA5'],["\\\\mathsfbf\\{\\\\Theta\\}",'\uD835\uDF5D'],["\\\\leftrightharpoonsup",'\u2966'],["\\\\mathsfbf\\{\\\\varpi\\}",'\uD835\uDF8F'],["\\\\blackinwhitediamond",'\u25C8'],["\\\\cyrchar\\\\cyriotbyus",'\u046D'],["\\\\mathsfbf\\{\\\\Omega\\}",'\uD835\uDF6E'],["\\\\cyrchar\\\\CYRIOTBYUS",'\u046C'],['\\\\mathbf\\{\\\\Upsilon\\}','\uD835\uDEBC'],["\\\\mathsfbf\\{\\\\Delta\\}",'\uD835\uDF59'],["\\\\mathsfbfsl\\{\\\\Psi\\}",'\uD835\uDFA7'],["\\\\DownLeftRightVector",'\u2950'],["\\\\cyrchar\\\\textnumero",'\u2116'],["\\\\twoheadleftdbkarrow",'\u2B37'],["\\\\mathsfbf\\{\\\\Gamma\\}",'\uD835\uDF58'],["\\\\rightleftharpoonsup",'\u2968'],['\\\\mathsl\\{\\\\Upsilon\\}','\uD835\uDEF6'],["\\\\cyrchar\\\\cyriotlyus",'\u0469'],["\\\\nVtwoheadrightarrow",'\u2901'],["\\\\mathbit\\{\\\\varrho\\}",'\uD835\uDF54'],["\\\\mathsfbf\\{\\\\nabla\\}",'\uD835\uDF6F'],["\\\\mathsfbf\\{\\\\Sigma\\}",'\uD835\uDF68'],["\\\\cyrchar\\\\CYRIOTLYUS",'\u0468'],["\\\\diamondleftarrowbar",'\u291F'],["\\\\cyrchar\\\\CYRCHLDSC",'\u04CB'],["\\\\longleftsquigarrow",'\u2B33'],["\\\\textfrac\\{2\\}\\{5\\}",'\u2156'],["\\\\RightDownTeeVector",'\u295D'],["\\\\textfrac\\{7\\}\\{8\\}",'\u215E'],["\\\\DownRightVectorBar",'\u2957'],["\\\\mathrm\\{'\\\\Omega\\}",'\u038F'],["\\\\textfrac\\{5\\}\\{8\\}",'\u215D'],["\\\\rightpentagonblack",'\u2B53'],["\\\\rightarrowbsimilar",'\u2B4C'],["\\\\textfrac\\{3\\}\\{8\\}",'\u215C'],["\\\\blackinwhitesquare",'\u25A3'],["\\\\bsimilarrightarrow",'\u2B47'],["\\\\textfrac\\{1\\}\\{8\\}",'\u215B'],["\\\\textfrac\\{5\\}\\{6\\}",'\u215A'],["\\\\errbarblackdiamond",'\u29F1'],["\\\\mathbf\\{\\\\varrho\\}",'\uD835\uDEE0'],["\\\\textfrac\\{1\\}\\{6\\}",'\u2159'],["\\\\parallelogramblack",'\u25B0'],["\\\\precedesnotsimilar",'\u22E8'],["\\\\ccwundercurvearrow",'\u293F'],["\\\\textfrac\\{4\\}\\{5\\}",'\u2158'],["\\\\inversewhitecircle",'\u25D9'],["\\\\textfrac\\{3\\}\\{5\\}",'\u2157'],["\\\\textfrac\\{1\\}\\{5\\}",'\u2155'],["\\\\mathbit\\{\\\\varpi\\}",'\uD835\uDF55'],["\\\\DownRightTeeVector",'\u295F'],["\\{\\{/\\}\\\\!\\\\!\\{/\\}\\}",'\u2AFD'],["\\\\textfrac\\{1\\}\\{3\\}",'\u2153'],["\\\\mathbit\\{\\\\nabla\\}",'\uD835\uDF35'],["\\\\mathbit\\{\\\\Omega\\}",'\uD835\uDF34'],["\\\\overleftrightarrow",'\u20E1'],["\\\\acute\\{\\\\epsilon\\}",'\u03AD'],["\\\\mathbit\\{\\\\Sigma\\}",'\uD835\uDF2E'],["\\\\mathbf\\{\\\\Lambda\\}",'\uD835\uDEB2'],['\\\\acute\\{\\\\upsilon\\}','\u03CD'],["\\\\mathbit\\{\\\\Theta\\}",'\uD835\uDF23'],["\\\\mathbit\\{\\\\Delta\\}",'\uD835\uDF1F'],["\\\\mathbit\\{\\\\Gamma\\}",'\uD835\uDF1E'],["\\\\mathsfbfsl\\{\\\\Xi\\}",'\uD835\uDF9D'],["\\\\mathsl\\{\\\\varrho\\}",'\uD835\uDF1A'],["\\\\RightDownVectorBar",'\u2955'],["\\\\textperiodcentered",'\u02D9'],["\\\\textfrac\\{2\\}\\{3\\}",'\u2154'],["\\\\hspace\\{0\\.166em\\}",'\u2006'],["\\\\,|\\\\hspace\\{0\\.167em\\}",'\u2009'],["\\\\circletophalfblack",'\u25D3'],["\\\\rule\\{1em\\}\\{1pt\\}",'\u2015'],["\\\\curvearrowleftplus",'\u293D'],["\\\\rightarrowtriangle",'\u21FE'],["\\\\Longleftrightarrow",'\u27FA'],["\\\\cyrchar\\\\cyrabhdze",'\u04E1'],["\\\\longleftrightarrow",'\u27F7'],["\\\\blacktriangleright",'\u25B8'],["\\\\circleonrightarrow",'\u21F4'],["\\\\cyrchar\\\\CYRABHDZE",'\u04E0'],["\\\\nVtwoheadleftarrow",'\u2B35'],["\\\\rightrightharpoons",'\u2964'],["\\\\cyrchar\\\\CYRCHRDSC",'\u04B6'],["\\\\trianglerightblack",'\u25EE'],["\\\\cyrchar\\\\cyrchldsc",'\u04CC'],["\\\\cyrchar\\\\cyrchrdsc",'\u04B7'],["\\\\mathsfbfsl\\{\\\\Pi\\}",'\uD835\uDF9F'],["\\\\nvtwoheadleftarrow",'\u2B34'],["\\\\textpertenthousand",'\u2031'],["\\\\circledwhitebullet",'\u29BE'],["\\\\cyrchar\\\\CYRCHVCRS",'\u04B8'],["\\\\cyrchar\\\\cyrchvcrs",'\u04B9'],["\\\\mathsl\\{\\\\Lambda\\}",'\uD835\uDEEC'],["\\\\blacktriangleleft",'\u25C2'],["\\\\mathsl\\{\\\\Theta\\}",'\uD835\uDEE9'],["\\\\blacktriangledown",'\u25BE'],["\\\\mathsl\\{\\\\Delta\\}",'\uD835\uDEE5'],["\\\\whitepointerright",'\u25BB'],["\\\\blackpointerright",'\u25BA'],["\\\\mathsl\\{\\\\Gamma\\}",'\uD835\uDEE4'],["\\\\mathbf\\{\\\\Gamma\\}",'\uD835\uDEAA'],["\\\\mathbf\\{\\\\varpi\\}",'\uD835\uDEE1'],["\\\\mathbf\\{\\\\Delta\\}",'\uD835\uDEAB'],["\\\\mathbf\\{\\\\Theta\\}",'\uD835\uDEAF'],["\\\\mathbf\\{\\\\theta\\}",'\uD835\uDEC9'],["\\\\mathbf\\{\\\\nabla\\}",'\uD835\uDEC1'],["\\\\mathbf\\{\\\\Omega\\}",'\uD835\uDEC0'],['\\\\uprightcurvearrow','\u2934'],["\\\\mathbf\\{\\\\Sigma\\}",'\uD835\uDEBA'],["\\\\similarrightarrow",'\u2972'],["\\\\rightarrowdiamond",'\u291E'],["\\\\rightarrowsimilar",'\u2974'],["\\\\cyrchar\\\\CYRKBEAK",'\u04A0'],["\\\\LeftDownVectorBar",'\u2959'],["\\\\cyrchar\\\\CYRABHHA",'\u04A8'],["\\\\cyrchar\\\\cyrabhha",'\u04A9'],["\\\\cyrchar\\\\cyrkhcrs",'\u049F'],["\\\\cyrchar\\\\CYRKHCRS",'\u049E'],["\\\\cyrchar\\\\cyrkvcrs",'\u049D'],["\\\\downslopeellipsis",'\u22F1'],["\\\\cyrchar\\\\CYRKVCRS",'\u049C'],["\\\\cyrchar\\\\cyrzhdsc",'\u0497'],["\\\\cyrchar\\\\CYRZHDSC",'\u0496'],["\\\\cyrchar\\\\cyrghcrs",'\u0493'],["\\\\cyrchar\\\\CYRGHCRS",'\u0492'],["\\\\rightarrowonoplus",'\u27F4'],["\\\\acwgapcirclearrow",'\u27F2'],["\\\\measuredangleleft",'\u299B'],["\\\\cyrchar\\\\CYRYHCRS",'\u04B0'],["\\\\cyrchar\\\\cyryhcrs",'\u04B1'],["\\\\cyrchar\\\\CYRTETSE",'\u04B4'],["\\\\cyrchar\\\\cyrtetse",'\u04B5'],["\\\\cyrchar\\\\cyrrtick",'\u048F'],["\\\\cyrchar\\\\CYRRTICK",'\u048E'],["\\\\cyrchar\\\\CYRABHCH",'\u04BC'],["\\\\cyrchar\\\\cyrabhch",'\u04BD'],["\\\\cyrchar\\\\cyrkoppa",'\u0481'],["\\\\cyrchar\\\\CYRKOPPA",'\u0480'],["\\\\RightUpDownVector",'\u294F'],["\\\\errbarblacksquare",'\u29EF'],["\\\\errbarblackcircle",'\u29F3'],["\\\\cyrchar\\\\cyromega",'\u0461'],["\\\\cyrchar\\\\CYROMEGA",'\u0460'],["\\\\mathsfbf\\{\\\\Psi\\}",'\uD835\uDF6D'],["\\\\mathsfbf\\{\\\\Phi\\}",'\uD835\uDF6B'],["\\\\mathsl\\{\\\\varpi\\}",'\uD835\uDF1B'],["\\\\mathsl\\{\\\\nabla\\}",'\uD835\uDEFB'],["\\\\mathsl\\{\\\\Omega\\}",'\uD835\uDEFA'],["\\\\mathsl\\{\\\\Sigma\\}",'\uD835\uDEF4'],["\\\\cyrchar\\\\cyrkbeak",'\u04A1'],["\\\\cyrchar\\\\cyrushrt",'\u045E'],["\\\\cyrchar\\\\cyrsftsn",'\u044C'],["\\\\cyrchar\\\\cyrhrdsn",'\u044A'],["\\\\cyrchar\\\\cyrishrt",'\u0439'],["\\\\cyrchar\\\\CYRSFTSN",'\u042C'],["\\\\cyrchar\\\\CYRHRDSN",'\u042A'],["\\\\twoheadrightarrow",'\u21A0'],["\\\\cyrchar\\\\CYRISHRT",'\u0419'],["\\\\cyrchar\\\\CYRUSHRT",'\u040E'],["\\\\varhexagonlrbonds",'\u232C'],["\\\\DownLeftTeeVector",'\u295E'],["\\\\mathbb\\{\\\\Gamma\\}",'\u213E'],["\\\\mathbb\\{\\\\gamma\\}",'\u213D'],['\\\\ddot\\{\\\\upsilon\\}','\u03CB'],["\\\\varcarriagereturn",'\u23CE'],["\\\\cyrchar\\\\CYRSCHWA",'\u04D8'],["\\\\cyrchar\\\\cyrschwa",'\u04D9'],["\\\\;|\\\\hspace\\{0\\.33em\\}",'\u2004'],["\\\\hspace\\{0\\.25em\\}",'\u2005'],["\\\\textquotedblright",'\u201D'],["\\\\textthreequarters",'\xBE'],["\\\\textasciidieresis",'\xA8'],["\\\\diamondrightblack",'\u2B17'],["\\\\circleonleftarrow",'\u2B30'],["\\\\bsimilarleftarrow",'\u2B41'],["\\\\LeftDownTeeVector",'\u2961'],["\\\\leftarrowbsimilar",'\u2B4B'],["\\\\triangleleftblack",'\u25ED'],["\\\\leftrightharpoons",'\u21CB'],["\\\\cwundercurvearrow",'\u293E'],["\\\\DownLeftVectorBar",'\u2956'],["\\\\rightleftharpoons",'\u21CC'],["\\\\circleurquadblack",'\u25D4'],["\\\\mathsfbf\\{\\\\phi\\}",'\uD835\uDF8D'],["\\\\leftarrowtriangle",'\u21FD'],["\\\\mathbb\\{\\\\Sigma\\}",'\u2140'],["\\\\textordmasculine",'\xBA'],["\\\\nvleftrightarrow",'\u21F9'],["\\\\twoheadleftarrow",'\u219E'],["\\\\diamondleftblack",'\u2B16'],["\\\\cyrchar\\\\CYRSHCH",'\u0429'],["\\\\leftarrowsimilar",'\u2973'],["\\\\cyrchar\\\\CYREREV",'\u042D'],["\\\\downdownharpoons",'\u2965'],["\\\\leftarrowonoplus",'\u2B32'],["\\\\cyrchar\\\\cyrshch",'\u0449'],["\\\\cyrchar\\\\cyrerev",'\u044D'],["\\\\cyrchar\\\\cyrtshe",'\u045B'],["\\\\leftrightharpoon",'\u294A'],["\\\\rightleftharpoon",'\u294B'],["\\\\mathbit\\{\\\\Phi\\}",'\uD835\uDF31'],["\\\\mathbit\\{\\\\Psi\\}",'\uD835\uDF33'],["\\\\mathbit\\{\\\\phi\\}",'\uD835\uDF53'],["\\\\cyrchar\\\\cyrdzhe",'\u045F'],["\\\\mathsfbf\\{\\\\Xi\\}",'\uD835\uDF63'],["\\\\leftleftharpoons",'\u2962'],["\\\\RightUpVectorBar",'\u2954'],["\\\\mathsfbf\\{\\\\Pi\\}",'\uD835\uDF65'],["\\\\rightrightarrows",'\u21C9'],["\\\\cyrchar\\\\CYRIOTE",'\u0464'],["\\\\rightarrowsupset",'\u2B44'],["\\\\cyrchar\\\\cyriote",'\u0465'],["\\\\cyrchar\\\\CYRLYUS",'\u0466'],["\\\\cyrchar\\\\cyrlyus",'\u0467'],["\\\\cyrchar\\\\CYRBYUS",'\u046A'],["\\\\similarleftarrow",'\u2B49'],["\\\\DownArrowUpArrow",'\u21F5'],["\\\\cyrchar\\\\CYRFITA",'\u0472'],["\\\\RightTriangleBar",'\u29D0'],["\\\\twoheaddownarrow",'\u21A1'],["\\\\cyrchar\\\\cyrshha",'\u04BB'],["\\\\cyrchar\\\\CYRSHHA",'\u04BA'],["\\\\openbracketright",'\u301B'],["\\\\sphericalangleup",'\u29A1'],["\\\\whitepointerleft",'\u25C5'],["\\\\cyrchar\\\\cyrhdsc",'\u04B3'],["\\\\cyrchar\\\\CYRHDSC",'\u04B2'],["\\\\cwgapcirclearrow",'\u27F3'],["\\\\blackpointerleft",'\u25C4'],["<\\\\kern\\-0\\.58em\\(",'\u2993'],["\\\\rightthreearrows",'\u21F6'],["\\\\ntrianglerighteq",'\u22ED'],["\\\\cyrchar\\\\CYRZDSC",'\u0498'],["\\\\cyrchar\\\\cyrzdsc",'\u0499'],["\\\\acwunderarcarrow",'\u293B'],["\\\\nVleftrightarrow",'\u21FC'],["\\\\cyrchar\\\\CYRKDSC",'\u049A'],["\\\\nvLeftrightarrow",'\u2904'],["\\\\cyrchar\\\\cyrkdsc",'\u049B'],["\\\\cyrchar\\\\cyrtdsc",'\u04AD'],["\\\\cyrchar\\\\CYRTDSC",'\u04AC'],["\\\\cyrchar\\\\cyrsdsc",'\u04AB'],["\\\\cyrchar\\\\CYRSDSC",'\u04AA'],["\\\\LeftUpDownVector",'\u2951'],["\\\\RightUpTeeVector",'\u295C'],["\\\\rightarrowapprox",'\u2975'],["\\\\hermitconjmatrix",'\u22B9'],["\\\\downharpoonright",'\u21C2'],["\\\\rightharpoondown",'\u21C1'],["\\\\hspace\\{0\\.6em\\}",'\u2002'],["\\\\cyrchar\\\\cyrotld",'\u04E9'],["\\\\cyrchar\\\\CYROTLD",'\u04E8'],["\\\\circlearrowright",'\u21BB'],["\\\\textquotedblleft",'\u201C'],["\\\\vartriangleright",'\u22B3'],["\\\\cyrchar\\\\CYRNDSC",'\u04A2'],["\\\\acute\\{\\\\omega\\}",'\u03CE'],["\\\\textvisiblespace",'\u2423'],["\\\\cyrchar\\\\cyrndsc",'\u04A3'],["\\\\APLrightarrowbox",'\u2348'],["\\\\cyrchar\\\\CYRTSHE",'\u040B'],["\\\\textquestiondown",'\xBF'],["\\\\diamondleftarrow",'\u291D'],["\\\\cyrchar\\\\CYRDZHE",'\u040F'],["\\\\LeftRightVector",'\u294E'],["\\\\acwoverarcarrow",'\u293A'],["\\\\acwleftarcarrow",'\u2939'],["\\\\cwrightarcarrow",'\u2938'],["\\\\cyrchar\\\\CYRPHK",'\u04A6'],["\\\\cyrchar\\\\cyrphk",'\u04A7'],['\\\\upslopeellipsis','\u22F0'],["\\\\downarrowbarred",'\u2908'],["\\\\cyrchar\\\\CYRKHK",'\u04C3'],["\\\\cyrchar\\\\cyrkhk",'\u04C4'],["\\\\mathbit\\{\\\\Pi\\}",'\uD835\uDF2B'],["\\\\mathbit\\{\\\\Xi\\}",'\uD835\uDF29'],["\\\\mathsl\\{\\\\phi\\}",'\uD835\uDF19'],["\\\\mathsl\\{\\\\Psi\\}",'\uD835\uDEF9'],["\\\\mathsl\\{\\\\Phi\\}",'\uD835\uDEF7'],["\\\\cyrchar\\\\CYRNHK",'\u04C7'],["\\\\cyrchar\\\\cyrnhk",'\u04C8'],["\\\\perspcorrespond",'\u2306'],["\\\\APLleftarrowbox",'\u2347'],["\\\\APLdownarrowbox",'\u2357'],["\\\\circledrightdot",'\u2686'],["\\\\textperthousand",'\u2030'],["\\\\enclosetriangle",'\u20E4'],["\\\\widebridgeabove",'\u20E9'],["\\\\blockhalfshaded",'\u2592'],['\\\\underrightarrow','\u20EF'],['\\\\urblacktriangle','\u25E5'],['\\\\ulblacktriangle','\u25E4'],["\\\\llblacktriangle",'\u25E3'],["\\\\lrblacktriangle",'\u25E2'],["\\\\bigtriangledown",'\u25BD'],["\\\\mathbf\\{\\\\phi\\}",'\uD835\uDEDF'],["\\\\vrectangleblack",'\u25AE'],["\\\\hrectangleblack",'\u25AC'],["\\\\squarecrossfill",'\u25A9'],["\\\\mathbf\\{\\\\Psi\\}",'\uD835\uDEBF'],["\\\\mathbf\\{\\\\Phi\\}",'\uD835\uDEBD'],["\\\\rightsquigarrow",'\u21DD'],["\\\\vartriangleleft",'\u22B2'],["\\\\trianglerighteq",'\u22B5'],["\\\\nLeftrightarrow",'\u21CE'],["\\\\greaterequivlnt",'\u2273'],["\\\\rightwhitearrow",'\u21E8'],["\\\\mathsfbfsl\\{z\\}",'\uD835\uDE6F'],["\\\\mathsfbfsl\\{y\\}",'\uD835\uDE6E'],["\\\\mathsfbfsl\\{x\\}",'\uD835\uDE6D'],["\\\\mathsfbfsl\\{w\\}",'\uD835\uDE6C'],["\\\\mathsfbfsl\\{v\\}",'\uD835\uDE6B'],["\\\\mathsfbfsl\\{u\\}",'\uD835\uDE6A'],["\\\\mathsfbfsl\\{t\\}",'\uD835\uDE69'],["\\\\mathsfbfsl\\{s\\}",'\uD835\uDE68'],["\\\\mathsfbfsl\\{r\\}",'\uD835\uDE67'],["\\\\mathsfbfsl\\{q\\}",'\uD835\uDE66'],["\\\\mathsfbfsl\\{p\\}",'\uD835\uDE65'],["\\\\mathsfbfsl\\{o\\}",'\uD835\uDE64'],["\\\\mathsfbfsl\\{n\\}",'\uD835\uDE63'],["\\\\mathsfbfsl\\{m\\}",'\uD835\uDE62'],["\\\\mathsfbfsl\\{l\\}",'\uD835\uDE61'],["\\\\mathsfbfsl\\{k\\}",'\uD835\uDE60'],["\\\\mathsfbfsl\\{j\\}",'\uD835\uDE5F'],["\\\\mathsfbfsl\\{i\\}",'\uD835\uDE5E'],["\\\\mathsfbfsl\\{h\\}",'\uD835\uDE5D'],["\\\\mathsfbfsl\\{g\\}",'\uD835\uDE5C'],["\\\\mathsfbfsl\\{f\\}",'\uD835\uDE5B'],["\\\\mathsfbfsl\\{e\\}",'\uD835\uDE5A'],["\\\\mathsfbfsl\\{d\\}",'\uD835\uDE59'],["\\\\mathsfbfsl\\{c\\}",'\uD835\uDE58'],["\\\\mathsfbfsl\\{b\\}",'\uD835\uDE57'],["\\\\mathsfbfsl\\{a\\}",'\uD835\uDE56'],["\\\\mathsfbfsl\\{Z\\}",'\uD835\uDE55'],["\\\\mathsfbfsl\\{Y\\}",'\uD835\uDE54'],["\\\\mathsfbfsl\\{X\\}",'\uD835\uDE53'],["\\\\mathsfbfsl\\{W\\}",'\uD835\uDE52'],["\\\\mathsfbfsl\\{V\\}",'\uD835\uDE51'],["\\\\mathsfbfsl\\{U\\}",'\uD835\uDE50'],["\\\\mathsfbfsl\\{T\\}",'\uD835\uDE4F'],["\\\\mathsfbfsl\\{S\\}",'\uD835\uDE4E'],["\\\\mathsfbfsl\\{R\\}",'\uD835\uDE4D'],["\\\\mathsfbfsl\\{Q\\}",'\uD835\uDE4C'],["\\\\mathsfbfsl\\{P\\}",'\uD835\uDE4B'],["\\\\mathsfbfsl\\{O\\}",'\uD835\uDE4A'],["\\\\mathsfbfsl\\{N\\}",'\uD835\uDE49'],["\\\\mathsfbfsl\\{M\\}",'\uD835\uDE48'],["\\\\mathsfbfsl\\{L\\}",'\uD835\uDE47'],["\\\\mathsfbfsl\\{K\\}",'\uD835\uDE46'],["\\\\mathsfbfsl\\{J\\}",'\uD835\uDE45'],["\\\\mathsfbfsl\\{I\\}",'\uD835\uDE44'],["\\\\mathsfbfsl\\{H\\}",'\uD835\uDE43'],["\\\\mathsfbfsl\\{G\\}",'\uD835\uDE42'],["\\\\mathsfbfsl\\{F\\}",'\uD835\uDE41'],["\\\\mathsfbfsl\\{E\\}",'\uD835\uDE40'],["\\\\mathsfbfsl\\{D\\}",'\uD835\uDE3F'],["\\\\mathsfbfsl\\{C\\}",'\uD835\uDE3E'],["\\\\mathsfbfsl\\{B\\}",'\uD835\uDE3D'],["\\\\mathsfbfsl\\{A\\}",'\uD835\uDE3C'],["\\\\textquotesingle","'"],["\\\\openbracketleft",'\u301A'],["\\\\leftarrowapprox",'\u2B4A'],["\\\\leftcurvedarrow",'\u2B3F'],["\\\\nVleftarrowtail",'\u2B3A'],["\\\\nvleftarrowtail",'\u2B39'],["\\\\twoheadmapsfrom",'\u2B36'],["\\\\leftthreearrows",'\u2B31'],["\\\\varhexagonblack",'\u2B22'],["\\\\diamondbotblack",'\u2B19'],["\\\\diamondtopblack",'\u2B18'],["\\\\leftrightarrows",'\u21C6'],["\\\\textordfeminine",'\xAA'],["\\\\textasciimacron",'\xAF'],["\\\\rightleftarrows",'\u21C4'],["\\\\downharpoonleft",'\u21C3'],["\\\\rightthreetimes",'\u22CC'],["\\\\leftharpoondown",'\u21BD'],["\\\\acute\\{\\\\iota\\}",'\u03AF'],["\\\\circlearrowleft",'\u21BA'],["\\\\cyrchar\\\\CYRDJE",'\u0402'],["\\\\cyrchar\\\\CYRDZE",'\u0405'],["\\\\verymuchgreater",'\u22D9'],["\\\\cyrchar\\\\CYRLJE",'\u0409'],["\\\\cyrchar\\\\CYRNJE",'\u040A'],["\\\\cyrchar\\\\CYRERY",'\u042B'],["\\\\curvearrowright",'\u21B7'],["\\\\not\\\\sqsubseteq",'\u22E2'],["\\\\not\\\\sqsupseteq",'\u22E3'],["\\\\bigtriangleleft",'\u2A1E'],["\\\\cyrchar\\\\cyrery",'\u044B'],["\\\\cyrchar\\\\cyrdje",'\u0452'],["\\\\cyrchar\\\\cyrdze",'\u0455'],["\\\\cyrchar\\\\cyrlje",'\u0459'],["\\\\cyrchar\\\\cyrnje",'\u045A'],["\\\\nleftrightarrow",'\u21AE'],["\\\\cyrchar\\\\CYRYAT",'\u0462'],["\\\\circledownarrow",'\u29EC'],["\\\\cyrchar\\\\CYRKSI",'\u046E'],["\\\\cyrchar\\\\cyrksi",'\u046F'],["\\\\cyrchar\\\\CYRPSI",'\u0470'],["\\\\cyrchar\\\\cyrpsi",'\u0471'],["\\\\cyrchar\\\\CYRIZH",'\u0474'],["\\\\LeftTriangleBar",'\u29CF'],['\\\\uparrowoncircle','\u29BD'],["\\\\circledparallel",'\u29B7'],["\\\\measangledltosw",'\u29AF'],["\\\\measangledrtose",'\u29AE'],["\\\\measangleultonw",'\u29AD'],["\\\\measangleurtone",'\u29AC'],["\\\\measangleldtosw",'\u29AB'],["\\\\measanglerdtose",'\u29AA'],["\\\\measanglelutonw",'\u29A9'],["\\\\measanglerutone",'\u29A8'],["\\\\cyrchar\\\\CYRGUP",'\u0490'],["\\\\cyrchar\\\\cyrgup",'\u0491'],["\\\\ntrianglelefteq",'\u22EC'],["\\\\cyrchar\\\\CYRGHK",'\u0494'],["\\\\cyrchar\\\\cyrghk",'\u0495'],["\\\\leftarrowsubset",'\u297A'],["\\\\equalrightarrow",'\u2971'],["\\\\barrightharpoon",'\u296D'],["\\\\rightbarharpoon",'\u296C'],["\\\\LeftUpTeeVector",'\u2960'],["\\\\LeftUpVectorBar",'\u2958'],["\\\\notgreaterless",'\u2279'],["\\\\rightouterjoin",'\u27D6'],["\\\\mathbf\\{\\\\Pi\\}",'\uD835\uDEB7'],["\\\\rightarrowtail",'\u21A3'],["\\\\cyrchar\\\\cyrot",'\u047F'],["\\\\cyrchar\\\\CYRUK",'\u0478'],["\\\\cyrchar\\\\CYROT",'\u047E'],['\\\\underleftarrow','\u20EE'],["\\\\triangleserifs",'\u29CD'],["\\\\blackhourglass",'\u29D7'],["\\\\downdownarrows",'\u21CA'],["\\\\approxnotequal",'\u2246'],["\\\\leftsquigarrow",'\u21DC'],["\\\\mathsl\\{\\\\Pi\\}",'\uD835\uDEF1'],["\\\\mathsl\\{\\\\Xi\\}",'\uD835\uDEEF'],["\\\\cyrchar\\\\cyrje",'\u0458'],["\\\\cyrchar\\\\cyryi",'\u0457'],["\\\\cyrchar\\\\cyrii",'\u0456'],["\\\\cyrchar\\\\cyrie",'\u0454'],["\\\\cyrchar\\\\cyryo",'\u0451'],["\\\\cyrchar\\\\cyrya",'\u044F'],["\\\\cyrchar\\\\cyryu",'\u044E'],["\\\\cyrchar\\\\cyrsh",'\u0448'],["\\\\cyrchar\\\\cyrch",'\u0447'],["\\\\carriagereturn",'\u21B5'],["\\\\cyrchar\\\\cyrzh",'\u0436'],["\\\\cyrchar\\\\CYRYA",'\u042F'],["\\\\cyrchar\\\\CYRYU",'\u042E'],["\\\\curvearrowleft",'\u21B6'],["\\\\cyrchar\\\\CYRSH",'\u0428'],["\\\\cyrchar\\\\CYRCH",'\u0427'],["\\\\bigslopedwedge",'\u2A58'],["\\\\wedgedoublebar",'\u2A60'],["\\\\twoheaduparrow",'\u219F'],["\\\\arrowwaveleft|\\\\arrowwaveright",'\u219C'],["\\\\cyrchar\\\\CYRZH",'\u0416'],["\\\\leftrightarrow",'\u2194'],["\\\\cyrchar\\\\CYRJE",'\u0408'],["\\\\cyrchar\\\\CYRYI",'\u0407'],["\\\\cyrchar\\\\CYRII",'\u0406'],["\\\\cyrchar\\\\CYRIE",'\u0404'],["\\\\mathbb\\{\\\\Pi\\}",'\u213F'],["\\\\cyrchar\\\\CYRYO",'\u0401'],["\\\\APLboxquestion",'\u2370'],["\\\\ddot\\{\\\\iota\\}",'\u03CA'],["\\\\mathbb\\{\\\\pi\\}",'\u213C'],["\\\\hookrightarrow",'\u21AA'],["\\\\lparenextender",'\u239C'],["\\\\rparenextender",'\u239F'],["\\\\acute\\{\\\\eta\\}",'\u03AE'],["\\\\lbrackextender",'\u23A2'],["\\\\NestedLessLess",'\u2AA1'],["\\\\rbrackextender",'\u23A5'],["\\\\vbraceextender",'\u23AA'],["\\\\harrowextender",'\u23AF'],["\\\\cyrchar\\\\CYRAE",'\u04D4'],["\\\\cyrchar\\\\cyrae",'\u04D5'],["\\\\circledtwodots",'\u2687'],['\\\\upharpoonright','\u21BE'],["\\\\ocommatopright",'\u0315'],["\\\\rightharpoonup",'\u21C0'],["\\\\leftthreetimes",'\u22CB'],["\\\\rightarrowplus",'\u2945'],["\\\\textasciibreve",'\u02D8'],["\\\\textasciicaron",'\u02C7'],["\\\\textdoublepipe",'\u01C2'],["\\\\textonequarter",'\xBC'],["\\\\guillemotright",'\xBB'],["\\\\mathrm\\{\\\\mu\\}",'\xB5'],["\\\\textasciiacute",'\xB4'],["\\\\guilsinglright",'\u203A'],["\\\\cyrchar\\\\CYRNG",'\u04A4'],["\\\\looparrowright",'\u21AC'],["\\\\textregistered",'\xAE'],["\\\\dblarrowupdown",'\u21C5'],["\\\\textexclamdown",'\xA1'],["\\\\textasciitilde",'~'],["\\\\squaretopblack",'\u2B12'],["\\\\squarebotblack",'\u2B13'],["\\\\textasciigrave",'`'],["\\\\leftleftarrows",'\u21C7'],["\\\\enclosediamond",'\u20DF'],["\\\\Longrightarrow",'\u27F9'],["\\\\equalleftarrow",'\u2B40'],["\\\\blockrighthalf",'\u2590'],["\\\\blockqtrshaded",'\u2591'],["\\\\RightVectorBar",'\u2953'],["\\\\ntriangleright",'\u22EB'],["\\\\longrightarrow",'\u27F6'],['\\\\updownarrowbar','\u21A8'],["\\\\cyrchar\\\\cyrng",'\u04A5'],["\\\\rightanglemdot",'\u299D'],["\\\\concavediamond",'\u27E1'],["\\\\rdiagovsearrow",'\u2930'],["\\\\fdiagovnearrow",'\u292F'],["\\\\leftbarharpoon",'\u296A'],["\\\\trianglelefteq",'\u22B4'],["\\\\circlevertfill",'\u25CD'],["\\\\barleftharpoon",'\u296B'],["\\\\dashrightarrow",'\u21E2'],["\\\\RightTeeVector",'\u295B'],["\\\\cyrchar\\\\cyruk",'\u0479'],["\\\\downwhitearrow",'\u21E9'],["\\\\squarenwsefill",'\u25A7'],["\\\\Leftrightarrow",'\u21D4'],["\\\\squareneswfill",'\u25A8'],["\\\\leftwhitearrow",'\u21E6'],["\\\\mathbf\\{\\\\Xi\\}",'\uD835\uDEB5'],["\\\\sphericalangle",'\u2222'],["\\\\notlessgreater",'\u2278'],["\\\\downdasharrow",'\u21E3'],["\\\\mathsfbf\\{R\\}",'\uD835\uDDE5'],["\\\\mathslbb\\{D\\}",'\uD835\uDD6F'],["\\\\mathfrak\\{H\\}",'\u210C'],["\\\\mathslbb\\{E\\}",'\uD835\uDD70'],["\\\\RightArrowBar",'\u21E5'],["\\\\measuredangle",'\u2221'],["\\\\mathslbb\\{F\\}",'\uD835\uDD71'],["\\\\mathsfbf\\{S\\}",'\uD835\uDDE6'],["\\\\mathslbb\\{O\\}",'\uD835\uDD7A'],["\\\\biginterleave",'\u2AFC'],["\\\\mathsfsl\\{Y\\}",'\uD835\uDE20'],["\\\\mathsfsl\\{X\\}",'\uD835\uDE1F'],["\\\\textbrokenbar",'\xA6'],["\\\\mathsfsl\\{W\\}",'\uD835\uDE1E'],["\\\\textcopyright",'\xA9'],["\\\\guillemotleft",'\xAB'],["\\\\textparagraph",'\xB6'],["\\\\guilsinglleft",'\u2039'],["\\\\mathsfsl\\{V\\}",'\uD835\uDE1D'],["\\\\mathslbb\\{P\\}",'\uD835\uDD7B'],["\\\\mathslbb\\{Q\\}",'\uD835\uDD7C'],["\\\\mathfrak\\{Z\\}",'\u2128'],["\\\\mathsfsl\\{U\\}",'\uD835\uDE1C'],["\\\\shortdowntack",'\u2ADF'],["\\\\shortlefttack",'\u2ADE'],["\\\\textdaggerdbl",'\u2021'],["\\\\mathfrak\\{C\\}",'\u212D'],["\\\\mathslbb\\{R\\}",'\uD835\uDD7D'],["\\\\mathslbb\\{S\\}",'\uD835\uDD7E'],["\\\\mathslbb\\{T\\}",'\uD835\uDD7F'],["\\\\divideontimes",'\u22C7'],["\\\\mathslbb\\{U\\}",'\uD835\uDD80'],["\\\\mathslbb\\{V\\}",'\uD835\uDD81'],["\\\\mathslbb\\{W\\}",'\uD835\uDD82'],["\\\\hookleftarrow",'\u21A9'],["\\\\mathslbb\\{X\\}",'\uD835\uDD83'],["\\\\mathsfsl\\{T\\}",'\uD835\uDE1B'],["\\\\mathsfsl\\{S\\}",'\uD835\uDE1A'],['\\\\upharpoonleft','\u21BF'],["\\\\mathslbb\\{Y\\}",'\uD835\uDD84'],["\\\\mathsfsl\\{R\\}",'\uD835\uDE19'],["\\\\mathsfsl\\{Q\\}",'\uD835\uDE18'],["\\\\mathslbb\\{Z\\}",'\uD835\uDD85'],["\\\\hphantom\\{,\\}",'\u2008'],["\\\\mathsfsl\\{P\\}",'\uD835\uDE17'],["\\\\mathsfsl\\{O\\}",'\uD835\uDE16'],["\\\\sixteenthnote",'\u266C'],["\\\\hphantom\\{0\\}",'\u2007'],["\\\\hspace\\{1em\\}",'\u2003'],["\\\\Hermaphrodite",'\u26A5'],["\\\\mathslbb\\{a\\}",'\uD835\uDD86'],["\\\\mdsmwhtcircle",'\u26AC'],["\\\\leftharpoonup",'\u21BC'],["\\\\mathsfsl\\{N\\}",'\uD835\uDE15'],["\\\\mathsfsl\\{M\\}",'\uD835\uDE14'],["\\\\cyrchar\\\\cyry",'\u04AF'],["\\\\mathsfsl\\{L\\}",'\uD835\uDE13'],["\\\\APLboxupcaret",'\u2353'],["\\\\APLuparrowbox",'\u2350'],["\\\\mathsfsl\\{K\\}",'\uD835\uDE12'],["\\\\mathsfbf\\{b\\}",'\uD835\uDDEF'],["\\\\sansLmirrored",'\u2143'],["\\\\mathsfsl\\{J\\}",'\uD835\uDE11'],["\\\\mathsfbf\\{l\\}",'\uD835\uDDF9'],["\\\\cyrchar\\\\CYRY",'\u04AE'],['\\\\uparrowbarred','\u2909'],["\\\\DifferentialD",'\u2146'],["\\\\mathchar\"2208",'\u2316'],["\\\\cyrchar\\\\CYRA",'\u0410'],["\\\\cyrchar\\\\CYRB",'\u0411'],["\\\\cyrchar\\\\CYRV",'\u0412'],["\\\\cyrchar\\\\CYRG",'\u0413'],["\\\\cyrchar\\\\CYRD",'\u0414'],["\\\\cyrchar\\\\CYRE",'\u0415'],["\\\\cyrchar\\\\CYRZ",'\u0417'],["\\\\cyrchar\\\\CYRI",'\u0418'],["\\\\cyrchar\\\\CYRK",'\u041A'],["\\\\cyrchar\\\\CYRL",'\u041B'],["\\\\cyrchar\\\\CYRM",'\u041C'],["\\\\mathsfsl\\{I\\}",'\uD835\uDE10'],["\\\\mathsfsl\\{H\\}",'\uD835\uDE0F'],["\\\\cyrchar\\\\CYRN",'\u041D'],["\\\\mathsfsl\\{G\\}",'\uD835\uDE0E'],["\\\\cyrchar\\\\CYRO",'\u041E'],["\\\\cyrchar\\\\CYRP",'\u041F'],["\\\\mathslbb\\{b\\}",'\uD835\uDD87'],["\\\\mathsfbf\\{9\\}",'\uD835\uDFF5'],["\\\\cyrchar\\\\CYRR",'\u0420'],["\\\\cyrchar\\\\CYRS",'\u0421'],["\\\\cyrchar\\\\CYRT",'\u0422'],["\\\\cyrchar\\\\CYRU",'\u0423'],["\\\\mathsfbf\\{8\\}",'\uD835\uDFF4'],["\\\\mathsfbf\\{7\\}",'\uD835\uDFF3'],["\\\\mathsfbf\\{6\\}",'\uD835\uDFF2'],["\\\\mathslbb\\{c\\}",'\uD835\uDD88'],["\\\\mathslbb\\{d\\}",'\uD835\uDD89'],["\\\\cyrchar\\\\CYRF",'\u0424'],["\\\\mathslbb\\{e\\}",'\uD835\uDD8A'],["\\\\cyrchar\\\\CYRH",'\u0425'],["\\\\cyrchar\\\\CYRC",'\u0426'],["\\\\mathsfbf\\{5\\}",'\uD835\uDFF1'],["\\\\mathslbb\\{f\\}",'\uD835\uDD8B'],["\\\\mathslbb\\{g\\}",'\uD835\uDD8C'],["\\\\mathslbb\\{h\\}",'\uD835\uDD8D'],["\\\\mathsfbf\\{4\\}",'\uD835\uDFF0'],["\\\\mathsfbf\\{3\\}",'\uD835\uDFEF'],["\\\\looparrowleft",'\u21AB'],["\\\\mathslbb\\{i\\}",'\uD835\uDD8E'],["\\\\mathslbb\\{j\\}",'\uD835\uDD8F'],["\\\\cyrchar\\\\cyra",'\u0430'],["\\\\cyrchar\\\\cyrb",'\u0431'],["\\\\cyrchar\\\\cyrv",'\u0432'],["\\\\cyrchar\\\\cyrg",'\u0433'],["\\\\cyrchar\\\\cyrd",'\u0434'],["\\\\mathslbb\\{k\\}",'\uD835\uDD90'],["\\\\triangletimes",'\u2A3B'],["\\\\triangleminus",'\u2A3A'],["\\\\cyrchar\\\\cyre",'\u0435'],["\\\\mathsfbf\\{2\\}",'\uD835\uDFEE'],["\\\\mathslbb\\{l\\}",'\uD835\uDD91'],["\\\\cyrchar\\\\cyrz",'\u0437'],["\\\\cyrchar\\\\cyri",'\u0438'],["\\\\mathslbb\\{m\\}",'\uD835\uDD92'],["\\\\cyrchar\\\\cyrk",'\u043A'],["\\\\mathslbb\\{n\\}",'\uD835\uDD93'],["\\\\mathslbb\\{o\\}",'\uD835\uDD94'],["\\\\mathsfbf\\{c\\}",'\uD835\uDDF0'],["\\\\mathslbb\\{p\\}",'\uD835\uDD95'],["\\\\mathslbb\\{q\\}",'\uD835\uDD96'],["\\\\cyrchar\\\\cyrl",'\u043B'],["\\\\mathslbb\\{r\\}",'\uD835\uDD97'],["\\\\cyrchar\\\\cyrm",'\u043C'],["\\\\mathslbb\\{s\\}",'\uD835\uDD98'],["\\\\cyrchar\\\\cyrn",'\u043D'],["\\\\cyrchar\\\\cyro",'\u043E'],["\\\\cyrchar\\\\cyrp",'\u043F'],["\\\\cyrchar\\\\cyrr",'\u0440'],["\\\\cyrchar\\\\cyrs",'\u0441'],["\\\\cyrchar\\\\cyrt",'\u0442'],["\\\\cyrchar\\\\cyru",'\u0443'],["\\\\cyrchar\\\\cyrf",'\u0444'],["\\\\cyrchar\\\\cyrh",'\u0445'],["\\\\cyrchar\\\\cyrc",'\u0446'],["\\\\mathslbb\\{t\\}",'\uD835\uDD99'],["\\\\mathslbb\\{u\\}",'\uD835\uDD9A'],["\\\\leftarrowplus",'\u2946'],["\\\\mathslbb\\{v\\}",'\uD835\uDD9B'],["\\\\mathslbb\\{w\\}",'\uD835\uDD9C'],["\\\\mathslbb\\{x\\}",'\uD835\uDD9D'],["\\\\mathsfbf\\{1\\}",'\uD835\uDFED'],["\\\\rightdotarrow",'\u2911'],["\\\\mathslbb\\{y\\}",'\uD835\uDD9E'],["\\\\mathsfbf\\{0\\}",'\uD835\uDFEC'],["\\\\leftarrowless",'\u2977'],["\\\\mathsfbf\\{d\\}",'\uD835\uDDF1'],["\\\\mathsfsl\\{E\\}",'\uD835\uDE0C'],["\\\\mathsfsl\\{D\\}",'\uD835\uDE0B'],["\\\\mathslbb\\{z\\}",'\uD835\uDD9F'],["\\\\mathsfsl\\{C\\}",'\uD835\uDE0A'],["\\\\mathsfsl\\{B\\}",'\uD835\uDE09'],["\\\\mathsfbf\\{e\\}",'\uD835\uDDF2'],["\\\\fallingdotseq",'\u2252'],["\\\\mathsfsl\\{A\\}",'\uD835\uDE08'],["\\\\mathsfbf\\{A\\}",'\uD835\uDDD4'],["\\\\errbardiamond",'\u29F0'],["\\\\mathsfbf\\{B\\}",'\uD835\uDDD5'],["\\\\mathsfbf\\{C\\}",'\uD835\uDDD6'],["\\\\mathsfbf\\{f\\}",'\uD835\uDDF3'],["\\\\mathsfbf\\{D\\}",'\uD835\uDDD7'],["\\\\mathsfbf\\{E\\}",'\uD835\uDDD8'],["\\\\mathsfbf\\{F\\}",'\uD835\uDDD9'],["\\\\mathsfbf\\{G\\}",'\uD835\uDDDA'],["\\\\mathsfbf\\{z\\}",'\uD835\uDE07'],["\\\\mathsfbf\\{H\\}",'\uD835\uDDDB'],["\\\\mathsfbf\\{I\\}",'\uD835\uDDDC'],["\\\\mathsfbf\\{J\\}",'\uD835\uDDDD'],["\\\\mathsfbf\\{K\\}",'\uD835\uDDDE'],["\\\\mathsfbf\\{L\\}",'\uD835\uDDDF'],["\\\\mathsfbf\\{M\\}",'\uD835\uDDE0'],["\\\\mathsfbf\\{N\\}",'\uD835\uDDE1'],["\\\\mathsfbf\\{O\\}",'\uD835\uDDE2'],["\\\\mathsfbf\\{g\\}",'\uD835\uDDF4'],["\\\\LeftVectorBar",'\u2952'],["\\\\mathsfbf\\{y\\}",'\uD835\uDE06'],["\\\\mathsfbf\\{P\\}",'\uD835\uDDE3'],['\\\\UpEquilibrium','\u296E'],["\\\\bigtriangleup",'\u25B3'],["\\\\blacktriangle",'\u25B4'],["\\\\rightanglearc",'\u22BE'],["\\\\dashleftarrow",'\u21E0'],["\\\\triangleright",'\u25B9'],["\\\\mathslbb\\{A\\}",'\uD835\uDD6C'],["\\\\mathsfbf\\{Q\\}",'\uD835\uDDE4'],["\\\\mathfrak\\{I\\}",'\u2111'],["\\\\mathslbb\\{B\\}",'\uD835\uDD6D'],["\\\\not\\\\supseteq",'\u2289'],["\\\\not\\\\subseteq",'\u2288'],["\\\\mathslbb\\{C\\}",'\uD835\uDD6E'],["\\\\mathfrak\\{z\\}",'\uD835\uDD37'],["\\\\mathfrak\\{y\\}",'\uD835\uDD36'],["\\\\mathfrak\\{x\\}",'\uD835\uDD35'],["\\\\mathfrak\\{w\\}",'\uD835\uDD34'],["\\\\mathfrak\\{v\\}",'\uD835\uDD33'],["\\\\mathfrak\\{u\\}",'\uD835\uDD32'],["\\\\mathfrak\\{t\\}",'\uD835\uDD31'],["\\\\mathfrak\\{s\\}",'\uD835\uDD30'],["\\\\mathfrak\\{r\\}",'\uD835\uDD2F'],["\\\\mathfrak\\{q\\}",'\uD835\uDD2E'],["\\\\mathfrak\\{p\\}",'\uD835\uDD2D'],["\\\\mathfrak\\{o\\}",'\uD835\uDD2C'],["\\\\mathfrak\\{n\\}",'\uD835\uDD2B'],["\\\\mathfrak\\{m\\}",'\uD835\uDD2A'],["\\\\mathfrak\\{l\\}",'\uD835\uDD29'],["\\\\mathfrak\\{k\\}",'\uD835\uDD28'],["\\\\mathfrak\\{j\\}",'\uD835\uDD27'],["\\\\mathfrak\\{i\\}",'\uD835\uDD26'],["\\\\mathfrak\\{h\\}",'\uD835\uDD25'],["\\\\mathfrak\\{g\\}",'\uD835\uDD24'],["\\\\mathfrak\\{f\\}",'\uD835\uDD23'],["\\\\mathfrak\\{e\\}",'\uD835\uDD22'],["\\\\mathfrak\\{d\\}",'\uD835\uDD21'],["\\\\mathfrak\\{c\\}",'\uD835\uDD20'],["\\\\mathfrak\\{b\\}",'\uD835\uDD1F'],["\\\\mathfrak\\{a\\}",'\uD835\uDD1E'],["\\\\mathfrak\\{Y\\}",'\uD835\uDD1C'],["\\\\mathfrak\\{X\\}",'\uD835\uDD1B'],["\\\\mathfrak\\{W\\}",'\uD835\uDD1A'],["\\\\mathfrak\\{V\\}",'\uD835\uDD19'],["\\\\mathfrak\\{U\\}",'\uD835\uDD18'],["\\\\mathfrak\\{T\\}",'\uD835\uDD17'],["\\\\mathfrak\\{S\\}",'\uD835\uDD16'],["\\\\mathfrak\\{Q\\}",'\uD835\uDD14'],["\\\\mathfrak\\{P\\}",'\uD835\uDD13'],["\\\\mathfrak\\{O\\}",'\uD835\uDD12'],["\\\\mathfrak\\{N\\}",'\uD835\uDD11'],["\\\\mathfrak\\{M\\}",'\uD835\uDD10'],["\\\\mathfrak\\{L\\}",'\uD835\uDD0F'],["\\\\mathfrak\\{K\\}",'\uD835\uDD0E'],["\\\\mathfrak\\{J\\}",'\uD835\uDD0D'],["\\\\mathfrak\\{G\\}",'\uD835\uDD0A'],["\\\\mathfrak\\{F\\}",'\uD835\uDD09'],["\\\\mathfrak\\{E\\}",'\uD835\uDD08'],["\\\\mathfrak\\{D\\}",'\uD835\uDD07'],["\\\\mathfrak\\{B\\}",'\uD835\uDD05'],["\\\\mathfrak\\{A\\}",'\uD835\uDD04'],["\\\\mathsfsl\\{F\\}",'\uD835\uDE0D'],["\\\\mathslbb\\{G\\}",'\uD835\uDD72'],["\\\\mathslbb\\{H\\}",'\uD835\uDD73'],["\\\\topsemicircle",'\u25E0'],["\\\\botsemicircle",'\u25E1'],["\\\\mathslbb\\{I\\}",'\uD835\uDD74'],["\\\\squareulblack",'\u25E9'],["\\\\mathsfbf\\{x\\}",'\uD835\uDE05'],["\\\\mathsfbf\\{T\\}",'\uD835\uDDE7'],["\\\\leftarrowtail",'\u21A2'],["\\\\mathsfbf\\{w\\}",'\uD835\uDE04'],["\\\\mathsfbf\\{v\\}",'\uD835\uDE03'],["\\\\leftouterjoin",'\u27D5'],["\\\\fullouterjoin",'\u27D7'],["\\\\mathsfbf\\{u\\}",'\uD835\uDE02'],["\\\\circledbullet",'\u29BF'],["\\\\mathsfbf\\{U\\}",'\uD835\uDDE8'],["\\\\LeftTeeVector",'\u295A'],["\\\\mathsfbf\\{V\\}",'\uD835\uDDE9'],["\\\\mathsfbf\\{W\\}",'\uD835\uDDEA'],["\\\\mathsfbf\\{X\\}",'\uD835\uDDEB'],["\\\\circledbslash",'\u29B8'],["\\\\mathsfbf\\{Y\\}",'\uD835\uDDEC'],["\\\\emptysetoarrl",'\u29B4'],["\\\\emptysetocirc",'\u29B2'],["\\\\mathsfbf\\{t\\}",'\uD835\uDE01'],["\\\\mathsfbf\\{h\\}",'\uD835\uDDF5'],["\\\\mathsfbf\\{i\\}",'\uD835\uDDF6'],["\\\\mathsfbf\\{j\\}",'\uD835\uDDF7'],["\\\\mathsfbf\\{s\\}",'\uD835\uDE00'],["\\\\wideangledown",'\u29A6'],["\\\\mathsfbf\\{r\\}",'\uD835\uDDFF'],["\\\\mathsfbf\\{q\\}",'\uD835\uDDFE'],["\\\\mathsfbf\\{Z\\}",'\uD835\uDDED'],["\\\\mathsfbf\\{p\\}",'\uD835\uDDFD'],["\\\\mathsfbf\\{a\\}",'\uD835\uDDEE'],["\\\\mathsfbf\\{k\\}",'\uD835\uDDF8'],["\\\\longleftarrow",'\u27F5'],["\\\\mathsfsl\\{z\\}",'\uD835\uDE3B'],["\\\\mathsfsl\\{y\\}",'\uD835\uDE3A'],["\\\\mathsfsl\\{x\\}",'\uD835\uDE39'],["\\\\mathsfsl\\{w\\}",'\uD835\uDE38'],["\\\\mathsfsl\\{v\\}",'\uD835\uDE37'],["\\\\mathsfsl\\{u\\}",'\uD835\uDE36'],["\\\\mathsfsl\\{t\\}",'\uD835\uDE35'],["\\\\mathsfsl\\{s\\}",'\uD835\uDE34'],["\\\\mathsfsl\\{r\\}",'\uD835\uDE33'],["\\\\mathsfsl\\{q\\}",'\uD835\uDE32'],["\\\\mathsfsl\\{p\\}",'\uD835\uDE31'],["\\\\mathsfsl\\{o\\}",'\uD835\uDE30'],["\\\\mathsfsl\\{n\\}",'\uD835\uDE2F'],["\\\\mathsfsl\\{m\\}",'\uD835\uDE2E'],["\\\\mathsfsl\\{l\\}",'\uD835\uDE2D'],["\\\\mathsfsl\\{k\\}",'\uD835\uDE2C'],["\\\\mathsfsl\\{j\\}",'\uD835\uDE2B'],["\\\\mathsfsl\\{i\\}",'\uD835\uDE2A'],["\\\\mathsfsl\\{h\\}",'\uD835\uDE29'],["\\\\mathsfsl\\{g\\}",'\uD835\uDE28'],["\\\\ntriangleleft",'\u22EA'],["\\\\backslash|\\\\textbackslash",'\\'],["\\\\varlrtriangle",'\u22BF'],["\\\\rightpentagon",'\u2B54'],["\\\\mathsfsl\\{f\\}",'\uD835\uDE27'],["\\\\mathfrak\\{R\\}",'\u211C'],["\\\\mathsfsl\\{e\\}",'\uD835\uDE26'],["\\\\mdsmwhtsquare",'\u25FD'],["\\\\mdsmblksquare",'\u25FE'],["\\\\rightarrowgtr",'\u2B43'],["\\\\mathsfbf\\{o\\}",'\uD835\uDDFC'],["\\\\threeunderdot",'\u20E8'],["\\\\blocklefthalf",'\u258C'],["\\\\texttrademark",'\u2122'],["\\\\Longleftarrow",'\u27F8'],["\\\\mathsfbf\\{n\\}",'\uD835\uDDFB'],["\\\\enclosesquare",'\u20DE'],["\\\\mathslbb\\{J\\}",'\uD835\uDD75'],["\\\\mathslbb\\{K\\}",'\uD835\uDD76'],["\\\\enclosecircle",'\u20DD'],["\\\\mathsfbf\\{m\\}",'\uD835\uDDFA'],["\\\\mathslbb\\{L\\}",'\uD835\uDD77'],["\\\\mathsfsl\\{d\\}",'\uD835\uDE25'],["\\\\mathsfsl\\{c\\}",'\uD835\uDE24'],["\\\\mathsfsl\\{b\\}",'\uD835\uDE23'],["\\\\mathsfsl\\{a\\}",'\uD835\uDE22'],["\\\\mathsfsl\\{Z\\}",'\uD835\uDE21'],["\\\\pentagonblack",'\u2B1F'],["\\\\vysmwhtsquare",'\u2B1E'],["\\\\vysmblksquare",'\u2B1D'],["\\\\mathslbb\\{M\\}",'\uD835\uDD78'],["\\\\mathslbb\\{N\\}",'\uD835\uDD79'],["\\\\squarellblack",'\u2B15'],["\\\\squareurblack",'\u2B14'],["\\\\bigtalloblong",'\u2AFF'],["\\\\mathscr\\{c\\}",'\uD835\uDCB8'],["\\\\'\\$\\\\alpha\\$",'\u03AC'],["\\\\mathbit\\{q\\}",'\uD835\uDC92'],["\\\\mathbit\\{r\\}",'\uD835\uDC93'],["\\\\mathbit\\{s\\}",'\uD835\uDC94'],["\\\\surfintegral",'\u222F'],["\\\\mathbit\\{t\\}",'\uD835\uDC95'],["\\\\trianglecdot",'\u25EC'],["\\\\mathbit\\{u\\}",'\uD835\uDC96'],["\\\\mathbit\\{v\\}",'\uD835\uDC97'],["\\\\mathbit\\{w\\}",'\uD835\uDC98'],["\\\\lessequivlnt",'\u2272'],["\\\\mathscr\\{g\\}",'\u210A'],["\\\\mathscr\\{d\\}",'\uD835\uDCB9'],["\\\\longdivision",'\u27CC'],["\\\\eqqslantless",'\u2A9B'],["\\\\mathscr\\{H\\}",'\u210B'],["\\\\mathbit\\{x\\}",'\uD835\uDC99'],['\\\\upwhitearrow','\u21E7'],["\\\\mathbit\\{y\\}",'\uD835\uDC9A'],["\\\\mathbit\\{z\\}",'\uD835\uDC9B'],["\\\\mathscr\\{A\\}",'\uD835\uDC9C'],["\\\\dottedcircle",'\u25CC'],["\\\\mathmit\\{D\\}",'\uD835\uDCD3'],["\\\\odotslashdot",'\u29BC'],["\\\\cupleftarrow",'\u228C'],["\\\\mathscr\\{I\\}",'\u2110'],["\\\\notbackslash",'\u2340'],["\\\\textvartheta",'\u03D1'],["\\\\LeftArrowBar",'\u21E4'],["\\\\mathmit\\{I\\}",'\uD835\uDCD8'],["\\\\lozengeminus",'\u27E0'],["\\\\mathscr\\{C\\}",'\uD835\uDC9E'],["\\\\emptysetoarr",'\u29B3'],["\\\\mathscr\\{f\\}",'\uD835\uDCBB'],["\\\\emptysetobar",'\u29B1'],["\\\\mathscr\\{D\\}",'\uD835\uDC9F'],["\\\\mathbit\\{A\\}",'\uD835\uDC68'],["\\\\fdiagovrdiag",'\u292C'],["\\\\mathscr\\{h\\}",'\uD835\uDCBD'],["\\\\verymuchless",'\u22D8'],["\\\\mathbit\\{B\\}",'\uD835\uDC69'],["\\\\mathbit\\{C\\}",'\uD835\uDC6A'],["\\\\mathscr\\{G\\}",'\uD835\uDCA2'],['\\\\upupharpoons','\u2963'],["\\\\nvRightarrow",'\u2903'],["\\\\mathscr\\{J\\}",'\uD835\uDCA5'],["\\\\revangleubar",'\u29A5'],["\\\\mathscr\\{K\\}",'\uD835\uDCA6'],["\\\\mathbit\\{D\\}",'\uD835\uDC6B'],["\\\\mathmit\\{H\\}",'\uD835\uDCD7'],["\\\\mathmit\\{G\\}",'\uD835\uDCD6'],["\\\\mathscr\\{N\\}",'\uD835\uDCA9'],["\\\\mathscr\\{i\\}",'\uD835\uDCBE'],["\\\\mathmit\\{F\\}",'\uD835\uDCD5'],["\\\\mathbit\\{E\\}",'\uD835\uDC6C'],["\\\\mathbit\\{F\\}",'\uD835\uDC6D'],["\\\\mathbit\\{G\\}",'\uD835\uDC6E'],["\\\\mathmit\\{z\\}",'\uD835\uDD03'],["\\\\mathbit\\{H\\}",'\uD835\uDC6F'],["\\\\PropertyLine",'\u214A'],["\\\\mathscr\\{j\\}",'\uD835\uDCBF'],["\\\\mathscr\\{O\\}",'\uD835\uDCAA'],["\\\\mathmit\\{y\\}",'\uD835\uDD02'],["\\\\DownArrowBar",'\u2913'],["\\\\mathscr\\{k\\}",'\uD835\uDCC0'],["\\\\mathscr\\{m\\}",'\uD835\uDCC2'],["\\\\mathscr\\{n\\}",'\uD835\uDCC3'],["\\\\mathmit\\{x\\}",'\uD835\uDD01'],["\\\\mathscr\\{P\\}",'\uD835\uDCAB'],["\\\\mathmit\\{w\\}",'\uD835\uDD00'],["\\\\mathmit\\{v\\}",'\uD835\uDCFF'],["\\\\mathscr\\{Q\\}",'\uD835\uDCAC'],["\\\\mathmit\\{u\\}",'\uD835\uDCFE'],["\\\\mathmit\\{t\\}",'\uD835\uDCFD'],["\\\\mathscr\\{p\\}",'\uD835\uDCC5'],["\\\\mathscr\\{q\\}",'\uD835\uDCC6'],["\\\\mathscr\\{r\\}",'\uD835\uDCC7'],["\\\\mathscr\\{S\\}",'\uD835\uDCAE'],["\\\\mathmit\\{s\\}",'\uD835\uDCFC'],["\\\\mathmit\\{r\\}",'\uD835\uDCFB'],["\\\\mathmit\\{q\\}",'\uD835\uDCFA'],["\\\\squareulquad",'\u25F0'],["\\\\mathbit\\{I\\}",'\uD835\uDC70'],["\\\\squarellquad",'\u25F1'],["\\\\risingdotseq",'\u2253'],["\\\\squarelrquad",'\u25F2'],["\\\\squareurquad",'\u25F3'],["\\\\mathmit\\{p\\}",'\uD835\uDCF9'],["\\\\circleulquad",'\u25F4'],["\\\\circledequal",'\u229C'],["\\\\medblackstar",'\u2B51'],["\\\\medwhitestar",'\u2B50'],["\\\\circlellquad",'\u25F5'],["\\\\circlelrquad",'\u25F6'],["\\\\mathbit\\{J\\}",'\uD835\uDC71'],["\\\\circleurquad",'\u25F7'],["\\\\squarehvfill",'\u25A6'],["\\\\rightdbltail",'\u291C'],["\\\\mathscr\\{s\\}",'\uD835\uDCC8'],["\\\\mathmit\\{o\\}",'\uD835\uDCF8'],["\\\\mathscr\\{t\\}",'\uD835\uDCC9'],["\\\\doublebarvee",'\u2A62'],["\\\\mathbit\\{K\\}",'\uD835\uDC72'],["\\\\mathbit\\{L\\}",'\uD835\uDC73'],["\\\\mathbit\\{M\\}",'\uD835\uDC74'],["\\\\errbarcircle",'\u29F2'],["\\\\mathscr\\{T\\}",'\uD835\uDCAF'],["\\\\mathmit\\{n\\}",'\uD835\uDCF7'],["\\\\blocklowhalf",'\u2584'],["\\\\mathmit\\{m\\}",'\uD835\uDCF6'],["\\\\mathmit\\{E\\}",'\uD835\uDCD4'],["\\\\mathbit\\{N\\}",'\uD835\uDC75'],["\\\\leftdotarrow",'\u2B38'],["\\\\mathbit\\{O\\}",'\uD835\uDC76'],["\\\\mathmit\\{l\\}",'\uD835\uDCF5'],["\\\\wedgemidvert",'\u2A5A'],["\\\\errbarsquare",'\u29EE'],["\\\\mathscr\\{U\\}",'\uD835\uDCB0'],["\\\\bigslopedvee",'\u2A57'],["\\\\mathmit\\{k\\}",'\uD835\uDCF4'],["\\\\mathmit\\{j\\}",'\uD835\uDCF3'],["\\\\blacklozenge",'\u29EB'],["\\\\mathmit\\{i\\}",'\uD835\uDCF2'],["\\\\mathscr\\{V\\}",'\uD835\uDCB1'],["\\\\mathmit\\{h\\}",'\uD835\uDCF1'],["\\\\smwhtlozenge",'\u2B2B'],["\\\\smblklozenge",'\u2B2A'],["\\\\smblkdiamond",'\u2B29'],["\\\\mdwhtlozenge",'\u2B28'],["\\\\mdblklozenge",'\u2B27'],["\\\\mdwhtdiamond",'\u2B26'],["\\\\mdblkdiamond",'\u2B25'],["\\\\mathmit\\{g\\}",'\uD835\uDCF0'],["\\\\hexagonblack",'\u2B23'],["\\\\rbrackurtick",'\u2990'],["\\\\mathbit\\{P\\}",'\uD835\uDC77'],["\\\\mathbit\\{Q\\}",'\uD835\uDC78'],["\\\\mathscr\\{W\\}",'\uD835\uDCB2'],["\\\\mathmit\\{f\\}",'\uD835\uDCEF'],["\\\\closedvarcap",'\u2A4D'],["\\\\dottedsquare",'\u2B1A'],["\\\\lbracklltick",'\u298F'],["\\\\rbracklrtick",'\u298E'],["\\\\closedvarcup",'\u2A4C'],["\\\\mathmit\\{e\\}",'\uD835\uDCEE'],["\\\\downfishtail",'\u297F'],["\\\\mathmit\\{d\\}",'\uD835\uDCED'],["\\\\mathbit\\{R\\}",'\uD835\uDC79'],["\\\\mathbit\\{S\\}",'\uD835\uDC7A'],["\\\\mathmit\\{c\\}",'\uD835\uDCEC'],["\\\\lbrackultick",'\u298D'],["\\\\mathmit\\{b\\}",'\uD835\uDCEB'],["\\\\mathscr\\{X\\}",'\uD835\uDCB3'],["\\\\mathbit\\{T\\}",'\uD835\uDC7B'],["\\\\mathmit\\{a\\}",'\uD835\uDCEA'],["\\\\lrtriangleeq",'\u29E1'],["\\\\mathbit\\{U\\}",'\uD835\uDC7C'],["\\\\textsterling",'\xA3'],["\\\\textcurrency",'\xA4'],["\\\\mathscr\\{Y\\}",'\uD835\uDCB4'],["\\\\mathbit\\{V\\}",'\uD835\uDC7D'],["\\\\mathscr\\{Z\\}",'\uD835\uDCB5'],["\\\\hyphenbullet",'\u2043'],["\\\\mathmit\\{Z\\}",'\uD835\uDCE9'],["\\\\longmapsfrom",'\u27FB'],["\\\\multimapboth",'\u29DF'],["\\\\mathbit\\{W\\}",'\uD835\uDC7E'],["\\\\mathbit\\{X\\}",'\uD835\uDC7F'],["\\\\mathbit\\{Y\\}",'\uD835\uDC80'],["\\\\mathbit\\{Z\\}",'\uD835\uDC81'],["\\\\mathbit\\{a\\}",'\uD835\uDC82'],["\\\\mathbit\\{b\\}",'\uD835\uDC83'],["\\\\mathmit\\{Y\\}",'\uD835\uDCE8'],["\\\\mathmit\\{X\\}",'\uD835\uDCE7'],["\\\\mathbit\\{c\\}",'\uD835\uDC84'],["\\\\mathbit\\{d\\}",'\uD835\uDC85'],["\\\\mathmit\\{W\\}",'\uD835\uDCE6'],["\\\\mathmit\\{V\\}",'\uD835\uDCE5'],["\\\\mathmit\\{U\\}",'\uD835\uDCE4'],["\\\\RoundImplies",'\u2970'],["\\\\triangleplus",'\u2A39'],["\\\\rdiagovfdiag",'\u292B'],["\\\\mathscr\\{a\\}",'\uD835\uDCB6'],["\\\\mathscr\\{u\\}",'\uD835\uDCCA'],["\\\\mathscr\\{B\\}",'\u212C'],["\\\\mathmit\\{T\\}",'\uD835\uDCE3'],["\\\\mathscr\\{b\\}",'\uD835\uDCB7'],["\\\\mathmit\\{S\\}",'\uD835\uDCE2'],["\\\\mathscr\\{e\\}",'\u212F'],["\\\\mathbit\\{e\\}",'\uD835\uDC86'],["\\\\mathmit\\{R\\}",'\uD835\uDCE1'],["\\\\mathscr\\{v\\}",'\uD835\uDCCB'],["\\\\mathscr\\{w\\}",'\uD835\uDCCC'],["\\\\mathbit\\{f\\}",'\uD835\uDC87'],["\\\\mathbit\\{g\\}",'\uD835\uDC88'],["\\\\mathscr\\{x\\}",'\uD835\uDCCD'],["\\\\texttildelow",'\u02DC'],["\\\\mathbit\\{h\\}",'\uD835\uDC89'],["\\\\varspadesuit",'\u2664'],["\\\\mathscr\\{y\\}",'\uD835\uDCCE'],["\\\\mathbit\\{i\\}",'\uD835\uDC8A'],["\\\\mathmit\\{Q\\}",'\uD835\uDCE0'],["\\\\supsetapprox",'\u2ACA'],["\\\\subsetapprox",'\u2AC9'],["\\\\rightbkarrow",'\u290D'],["\\\\mathbit\\{j\\}",'\uD835\uDC8B'],["\\\\mathmit\\{P\\}",'\uD835\uDCDF'],["\\\\mathscr\\{R\\}",'\u211B'],["\\\\mathmit\\{O\\}",'\uD835\uDCDE'],["\\\\mathscr\\{z\\}",'\uD835\uDCCF'],["\\\\oturnedcomma",'\u0312'],["\\\\mathbit\\{k\\}",'\uD835\uDC8C'],["\\\\mathbit\\{l\\}",'\uD835\uDC8D'],["\\\\Longmapsfrom",'\u27FD'],["\\\\mathmit\\{N\\}",'\uD835\uDCDD'],["\\\\mathmit\\{A\\}",'\uD835\uDCD0'],["\\\\mathmit\\{M\\}",'\uD835\uDCDC'],["\\\\triangledown",'\u25BF'],["\\\\triangleleft",'\u25C3'],["\\\\mathmit\\{L\\}",'\uD835\uDCDB'],["\\\\mathmit\\{B\\}",'\uD835\uDCD1'],["\\\\mathscr\\{l\\}",'\u2113'],["\\\\leftdbkarrow",'\u290E'],["\\\\mathbit\\{m\\}",'\uD835\uDC8E'],["\\\\mathbit\\{n\\}",'\uD835\uDC8F'],["\\\\mathbit\\{o\\}",'\uD835\uDC90'],["\\\\mathmit\\{K\\}",'\uD835\uDCDA'],["\\\\mathscr\\{L\\}",'\u2112'],["\\\\mathmit\\{C\\}",'\uD835\uDCD2'],["\\\\mathmit\\{J\\}",'\uD835\uDCD9'],["\\\\mathscr\\{E\\}",'\u2130'],["\\\\mathrm\\{'Y\\}",'\u038E'],["\\\\mathscr\\{F\\}",'\u2131'],["\\\\mathscr\\{M\\}",'\u2133'],['\\\\underbracket','\u23B5'],["\\\\mathscr\\{o\\}",'\u2134'],["\\\\mathbit\\{p\\}",'\uD835\uDC91'],["\\\\nHdownarrow",'\u21DF'],["\\\\forcesextra",'\u22A8'],['\\\\updasharrow','\u21E1'],["\\\\circleddash",'\u229D'],["\\\\circledcirc",'\u229A'],["\\\\nvleftarrow",'\u21F7'],["\\\\nVleftarrow",'\u21FA'],["\\\\not\\\\supset",'\u2285'],["\\\\not\\\\subset",'\u2284'],["\\\\succcurlyeq",'\u227D'],["\\\\preccurlyeq",'\u227C'],["\\\\int\\\\!\\\\int",'\u222C'],["\\\\volintegral",'\u2230'],["\\\\clwintegral",'\u2231'],["\\\\not\\\\approx",'\u2249'],["\\\\mathtt\\{z\\}",'\uD835\uDEA3'],["\\\\mathtt\\{y\\}",'\uD835\uDEA2'],["\\\\mathtt\\{x\\}",'\uD835\uDEA1'],["\\\\mathtt\\{w\\}",'\uD835\uDEA0'],["\\\\mathtt\\{v\\}",'\uD835\uDE9F'],["\\\\mathtt\\{u\\}",'\uD835\uDE9E'],["\\\\mathtt\\{t\\}",'\uD835\uDE9D'],["\\\\mathtt\\{s\\}",'\uD835\uDE9C'],["\\\\mathtt\\{r\\}",'\uD835\uDE9B'],["\\\\mathtt\\{q\\}",'\uD835\uDE9A'],["\\\\mathtt\\{p\\}",'\uD835\uDE99'],["\\\\mathtt\\{o\\}",'\uD835\uDE98'],["\\\\mathtt\\{n\\}",'\uD835\uDE97'],["\\\\mathtt\\{m\\}",'\uD835\uDE96'],["\\\\mathtt\\{l\\}",'\uD835\uDE95'],["\\\\mathtt\\{k\\}",'\uD835\uDE94'],["\\\\mathtt\\{j\\}",'\uD835\uDE93'],["\\\\mathtt\\{i\\}",'\uD835\uDE92'],["\\\\mathtt\\{h\\}",'\uD835\uDE91'],["\\\\mathtt\\{g\\}",'\uD835\uDE90'],["\\\\mathtt\\{f\\}",'\uD835\uDE8F'],["\\\\mathtt\\{e\\}",'\uD835\uDE8E'],["\\\\mathtt\\{d\\}",'\uD835\uDE8D'],["\\\\mathtt\\{c\\}",'\uD835\uDE8C'],["\\\\mathtt\\{b\\}",'\uD835\uDE8B'],["\\\\mathtt\\{a\\}",'\uD835\uDE8A'],["\\\\mathtt\\{Z\\}",'\uD835\uDE89'],["\\\\mathtt\\{Y\\}",'\uD835\uDE88'],["\\\\mathtt\\{X\\}",'\uD835\uDE87'],["\\\\mathtt\\{W\\}",'\uD835\uDE86'],["\\\\mathtt\\{V\\}",'\uD835\uDE85'],["\\\\mathtt\\{U\\}",'\uD835\uDE84'],["\\\\mathtt\\{T\\}",'\uD835\uDE83'],["\\\\mathtt\\{S\\}",'\uD835\uDE82'],["\\\\mathtt\\{R\\}",'\uD835\uDE81'],["\\\\mathtt\\{Q\\}",'\uD835\uDE80'],["\\\\mathtt\\{P\\}",'\uD835\uDE7F'],["\\\\mathtt\\{O\\}",'\uD835\uDE7E'],["\\\\mathtt\\{N\\}",'\uD835\uDE7D'],["\\\\mathtt\\{M\\}",'\uD835\uDE7C'],["\\\\mathtt\\{L\\}",'\uD835\uDE7B'],["\\\\mathtt\\{K\\}",'\uD835\uDE7A'],["\\\\mathtt\\{J\\}",'\uD835\uDE79'],["\\\\mathtt\\{I\\}",'\uD835\uDE78'],["\\\\mathtt\\{H\\}",'\uD835\uDE77'],["\\\\mathtt\\{G\\}",'\uD835\uDE76'],["\\\\mathtt\\{F\\}",'\uD835\uDE75'],["\\\\mathtt\\{E\\}",'\uD835\uDE74'],["\\\\mathtt\\{D\\}",'\uD835\uDE73'],["\\\\mathtt\\{C\\}",'\uD835\uDE72'],["\\\\mathtt\\{B\\}",'\uD835\uDE71'],["\\\\mathtt\\{A\\}",'\uD835\uDE70'],["\\\\mathsf\\{z\\}",'\uD835\uDDD3'],["\\\\mathsf\\{y\\}",'\uD835\uDDD2'],["\\\\mathsf\\{x\\}",'\uD835\uDDD1'],["\\\\mathsf\\{w\\}",'\uD835\uDDD0'],["\\\\mathsf\\{v\\}",'\uD835\uDDCF'],["\\\\mathsf\\{u\\}",'\uD835\uDDCE'],["\\\\mathsf\\{t\\}",'\uD835\uDDCD'],["\\\\mathsf\\{s\\}",'\uD835\uDDCC'],["\\\\mathsf\\{r\\}",'\uD835\uDDCB'],["\\\\mathsf\\{q\\}",'\uD835\uDDCA'],["\\\\mathsf\\{p\\}",'\uD835\uDDC9'],["\\\\mathsf\\{o\\}",'\uD835\uDDC8'],["\\\\mathsf\\{n\\}",'\uD835\uDDC7'],["\\\\mathsf\\{m\\}",'\uD835\uDDC6'],["\\\\mathsf\\{l\\}",'\uD835\uDDC5'],["\\\\mathsf\\{k\\}",'\uD835\uDDC4'],["\\\\mathsf\\{j\\}",'\uD835\uDDC3'],["\\\\mathsf\\{i\\}",'\uD835\uDDC2'],["\\\\mathsf\\{h\\}",'\uD835\uDDC1'],["\\\\mathsf\\{g\\}",'\uD835\uDDC0'],["\\\\mathsf\\{f\\}",'\uD835\uDDBF'],["\\\\mathsf\\{e\\}",'\uD835\uDDBE'],["\\\\mathsf\\{d\\}",'\uD835\uDDBD'],["\\\\mathsf\\{c\\}",'\uD835\uDDBC'],["\\\\mathsf\\{b\\}",'\uD835\uDDBB'],["\\\\mathsf\\{a\\}",'\uD835\uDDBA'],["\\\\mathsf\\{Z\\}",'\uD835\uDDB9'],["\\\\mathsf\\{Y\\}",'\uD835\uDDB8'],["\\\\mathsf\\{X\\}",'\uD835\uDDB7'],["\\\\mathsf\\{W\\}",'\uD835\uDDB6'],["\\\\mathsf\\{V\\}",'\uD835\uDDB5'],["\\\\mathsf\\{U\\}",'\uD835\uDDB4'],["\\\\mathsf\\{T\\}",'\uD835\uDDB3'],["\\\\mathsf\\{S\\}",'\uD835\uDDB2'],["\\\\mathsf\\{R\\}",'\uD835\uDDB1'],["\\\\mathsf\\{Q\\}",'\uD835\uDDB0'],["\\\\mathsf\\{P\\}",'\uD835\uDDAF'],["\\\\mathsf\\{O\\}",'\uD835\uDDAE'],["\\\\mathsf\\{N\\}",'\uD835\uDDAD'],["\\\\mathsf\\{M\\}",'\uD835\uDDAC'],["\\\\mathsf\\{L\\}",'\uD835\uDDAB'],["\\\\mathsf\\{K\\}",'\uD835\uDDAA'],["\\\\mathsf\\{J\\}",'\uD835\uDDA9'],["\\\\mathsf\\{I\\}",'\uD835\uDDA8'],["\\\\mathsf\\{H\\}",'\uD835\uDDA7'],["\\\\mathsf\\{G\\}",'\uD835\uDDA6'],["\\\\mathsf\\{F\\}",'\uD835\uDDA5'],["\\\\mathsf\\{E\\}",'\uD835\uDDA4'],["\\\\mathsf\\{D\\}",'\uD835\uDDA3'],["\\\\mathsf\\{C\\}",'\uD835\uDDA2'],["\\\\mathsf\\{B\\}",'\uD835\uDDA1'],["\\\\mathsf\\{A\\}",'\uD835\uDDA0'],["\\\\mathbb\\{z\\}",'\uD835\uDD6B'],["\\\\mathbb\\{y\\}",'\uD835\uDD6A'],["\\\\mathbb\\{x\\}",'\uD835\uDD69'],["\\\\mathbb\\{w\\}",'\uD835\uDD68'],["\\\\mathbb\\{v\\}",'\uD835\uDD67'],["\\\\mathbb\\{u\\}",'\uD835\uDD66'],["\\\\mathbb\\{t\\}",'\uD835\uDD65'],["\\\\mathbb\\{s\\}",'\uD835\uDD64'],["\\\\mathbb\\{r\\}",'\uD835\uDD63'],["\\\\mathbb\\{q\\}",'\uD835\uDD62'],["\\\\mathbb\\{p\\}",'\uD835\uDD61'],["\\\\mathbb\\{o\\}",'\uD835\uDD60'],["\\\\mathbb\\{n\\}",'\uD835\uDD5F'],["\\\\mathbb\\{m\\}",'\uD835\uDD5E'],["\\\\mathbb\\{l\\}",'\uD835\uDD5D'],["\\\\mathbb\\{k\\}",'\uD835\uDD5C'],["\\\\mathbb\\{j\\}",'\uD835\uDD5B'],["\\\\mathbb\\{i\\}",'\uD835\uDD5A'],["\\\\mathbb\\{h\\}",'\uD835\uDD59'],["\\\\mathbb\\{g\\}",'\uD835\uDD58'],["\\\\mathbb\\{f\\}",'\uD835\uDD57'],["\\\\mathbb\\{e\\}",'\uD835\uDD56'],["\\\\mathbb\\{d\\}",'\uD835\uDD55'],["\\\\mathbb\\{c\\}",'\uD835\uDD54'],["\\\\mathbb\\{b\\}",'\uD835\uDD53'],["\\\\mathbb\\{a\\}",'\uD835\uDD52'],["\\\\mathbb\\{Y\\}",'\uD835\uDD50'],["\\\\mathbb\\{X\\}",'\uD835\uDD4F'],["\\\\mathbb\\{W\\}",'\uD835\uDD4E'],["\\\\mathbb\\{V\\}",'\uD835\uDD4D'],["\\\\mathbb\\{U\\}",'\uD835\uDD4C'],["\\\\mathbb\\{T\\}",'\uD835\uDD4B'],["\\\\mathbb\\{S\\}",'\uD835\uDD4A'],["\\\\mathbb\\{O\\}",'\uD835\uDD46'],["\\\\mathbb\\{M\\}",'\uD835\uDD44'],["\\\\mathbb\\{L\\}",'\uD835\uDD43'],["\\\\mathbb\\{K\\}",'\uD835\uDD42'],["\\\\mathbb\\{J\\}",'\uD835\uDD41'],["\\\\mathbb\\{I\\}",'\uD835\uDD40'],["\\\\mathbb\\{G\\}",'\uD835\uDD3E'],["\\\\mathbb\\{F\\}",'\uD835\uDD3D'],["\\\\mathbb\\{E\\}",'\uD835\uDD3C'],["\\\\mathbb\\{D\\}",'\uD835\uDD3B'],["\\\\mathbb\\{B\\}",'\uD835\uDD39'],["\\\\mathbb\\{A\\}",'\uD835\uDD38'],["\\\\mathsl\\{z\\}",'\uD835\uDC67'],["\\\\mathsl\\{y\\}",'\uD835\uDC66'],["\\\\mathsl\\{x\\}",'\uD835\uDC65'],["\\\\mathsl\\{w\\}",'\uD835\uDC64'],["\\\\mathsl\\{v\\}",'\uD835\uDC63'],["\\\\mathsl\\{u\\}",'\uD835\uDC62'],["\\\\mathsl\\{t\\}",'\uD835\uDC61'],["\\\\mathsl\\{s\\}",'\uD835\uDC60'],["\\\\mathsl\\{r\\}",'\uD835\uDC5F'],["\\\\mathsl\\{q\\}",'\uD835\uDC5E'],["\\\\mathsl\\{p\\}",'\uD835\uDC5D'],["\\\\mathsl\\{o\\}",'\uD835\uDC5C'],["\\\\mathsl\\{n\\}",'\uD835\uDC5B'],["\\\\mathsl\\{m\\}",'\uD835\uDC5A'],["\\\\mathsl\\{l\\}",'\uD835\uDC59'],["\\\\mathsl\\{k\\}",'\uD835\uDC58'],["\\\\mathsl\\{j\\}",'\uD835\uDC57'],["\\\\mathsl\\{i\\}",'\uD835\uDC56'],["\\\\mathsl\\{g\\}",'\uD835\uDC54'],["\\\\mathsl\\{f\\}",'\uD835\uDC53'],["\\\\mathsl\\{e\\}",'\uD835\uDC52'],["\\\\mathsl\\{d\\}",'\uD835\uDC51'],["\\\\mathsl\\{c\\}",'\uD835\uDC50'],["\\\\mathsl\\{b\\}",'\uD835\uDC4F'],["\\\\mathsl\\{a\\}",'\uD835\uDC4E'],["\\\\mathsl\\{Z\\}",'\uD835\uDC4D'],["\\\\mathsl\\{Y\\}",'\uD835\uDC4C'],["\\\\mathsl\\{X\\}",'\uD835\uDC4B'],["\\\\mathsl\\{W\\}",'\uD835\uDC4A'],["\\\\mathsl\\{V\\}",'\uD835\uDC49'],["\\\\mathsl\\{U\\}",'\uD835\uDC48'],["\\\\mathsl\\{T\\}",'\uD835\uDC47'],["\\\\mathsl\\{S\\}",'\uD835\uDC46'],["\\\\mathsl\\{R\\}",'\uD835\uDC45'],["\\\\mathsl\\{Q\\}",'\uD835\uDC44'],["\\\\mathsl\\{P\\}",'\uD835\uDC43'],["\\\\mathsl\\{O\\}",'\uD835\uDC42'],["\\\\mathsl\\{N\\}",'\uD835\uDC41'],["\\\\mathsl\\{M\\}",'\uD835\uDC40'],["\\\\mathsl\\{L\\}",'\uD835\uDC3F'],["\\\\mathsl\\{K\\}",'\uD835\uDC3E'],["\\\\mathsl\\{J\\}",'\uD835\uDC3D'],["\\\\mathsl\\{I\\}",'\uD835\uDC3C'],["\\\\mathsl\\{H\\}",'\uD835\uDC3B'],["\\\\mathsl\\{G\\}",'\uD835\uDC3A'],["\\\\mathsl\\{F\\}",'\uD835\uDC39'],["\\\\mathsl\\{E\\}",'\uD835\uDC38'],["\\\\mathsl\\{D\\}",'\uD835\uDC37'],["\\\\mathsl\\{C\\}",'\uD835\uDC36'],["\\\\mathsl\\{B\\}",'\uD835\uDC35'],["\\\\mathsl\\{A\\}",'\uD835\uDC34'],["\\\\mathbf\\{z\\}",'\uD835\uDC33'],["\\\\mathbf\\{y\\}",'\uD835\uDC32'],["\\\\mathbf\\{x\\}",'\uD835\uDC31'],["\\\\mathbf\\{w\\}",'\uD835\uDC30'],["\\\\mathbf\\{v\\}",'\uD835\uDC2F'],["\\\\mathbf\\{u\\}",'\uD835\uDC2E'],["\\\\mathbf\\{t\\}",'\uD835\uDC2D'],["\\\\mathbf\\{s\\}",'\uD835\uDC2C'],["\\\\mathbf\\{r\\}",'\uD835\uDC2B'],["\\\\mathbf\\{q\\}",'\uD835\uDC2A'],["\\\\mathbf\\{p\\}",'\uD835\uDC29'],["\\\\mathbf\\{o\\}",'\uD835\uDC28'],["\\\\mathbf\\{n\\}",'\uD835\uDC27'],["\\\\mathbf\\{m\\}",'\uD835\uDC26'],["\\\\mathbf\\{l\\}",'\uD835\uDC25'],["\\\\mathbf\\{k\\}",'\uD835\uDC24'],["\\\\mathbf\\{j\\}",'\uD835\uDC23'],["\\\\mathbf\\{i\\}",'\uD835\uDC22'],["\\\\mathbf\\{h\\}",'\uD835\uDC21'],["\\\\mathbf\\{g\\}",'\uD835\uDC20'],["\\\\mathbf\\{f\\}",'\uD835\uDC1F'],["\\\\mathbf\\{e\\}",'\uD835\uDC1E'],["\\\\mathbf\\{d\\}",'\uD835\uDC1D'],["\\\\mathbf\\{c\\}",'\uD835\uDC1C'],["\\\\mathbf\\{b\\}",'\uD835\uDC1B'],["\\\\mathbf\\{a\\}",'\uD835\uDC1A'],["\\\\mathbf\\{Z\\}",'\uD835\uDC19'],["\\\\mathbf\\{Y\\}",'\uD835\uDC18'],["\\\\mathbf\\{X\\}",'\uD835\uDC17'],["\\\\mathbf\\{W\\}",'\uD835\uDC16'],["\\\\mathbf\\{V\\}",'\uD835\uDC15'],["\\\\mathbf\\{U\\}",'\uD835\uDC14'],["\\\\mathbf\\{T\\}",'\uD835\uDC13'],["\\\\mathbf\\{S\\}",'\uD835\uDC12'],["\\\\mathbf\\{R\\}",'\uD835\uDC11'],["\\\\mathbf\\{Q\\}",'\uD835\uDC10'],["\\\\mathbf\\{P\\}",'\uD835\uDC0F'],["\\\\mathbf\\{O\\}",'\uD835\uDC0E'],["\\\\mathbf\\{N\\}",'\uD835\uDC0D'],["\\\\mathbf\\{M\\}",'\uD835\uDC0C'],["\\\\mathbf\\{L\\}",'\uD835\uDC0B'],["\\\\mathbf\\{K\\}",'\uD835\uDC0A'],["\\\\mathbf\\{J\\}",'\uD835\uDC09'],["\\\\mathbf\\{I\\}",'\uD835\uDC08'],["\\\\mathbf\\{H\\}",'\uD835\uDC07'],["\\\\mathbf\\{G\\}",'\uD835\uDC06'],["\\\\mathbf\\{F\\}",'\uD835\uDC05'],["\\\\mathbf\\{E\\}",'\uD835\uDC04'],["\\\\mathbf\\{D\\}",'\uD835\uDC03'],["\\\\mathbf\\{C\\}",'\uD835\uDC02'],["\\\\mathbf\\{B\\}",'\uD835\uDC01'],["\\\\mathbf\\{A\\}",'\uD835\uDC00'],["\\\\smwhitestar",'\u2B52'],["\\\\RRightarrow",'\u2B46'],["\\\\whtvertoval",'\u2B2F'],["\\\\blkvertoval",'\u2B2E'],["\\\\whthorzoval",'\u2B2D'],["\\\\blkhorzoval",'\u2B2C'],["\\\\lgblkcircle",'\u2B24'],["\\\\mathtt\\{9\\}",'\uD835\uDFFF'],["\\\\mathtt\\{8\\}",'\uD835\uDFFE'],["\\\\textsection",'\xA7'],["\\\\textonehalf",'\xBD'],["\\\\shortuptack",'\u2AE0'],["\\\\mathtt\\{7\\}",'\uD835\uDFFD'],["\\\\mathtt\\{6\\}",'\uD835\uDFFC'],["\\\\mathtt\\{5\\}",'\uD835\uDFFB'],["\\\\mathtt\\{4\\}",'\uD835\uDFFA'],["\\\\succnapprox",'\u2ABA'],["\\\\precnapprox",'\u2AB9'],["\\\\mathtt\\{3\\}",'\uD835\uDFF9'],["\\\\eqqslantgtr",'\u2A9C'],["\\\\eqslantless",'\u2A95'],["\\\\backepsilon",'\u03F6'],["\\\\mathtt\\{2\\}",'\uD835\uDFF8'],["\\\\mathtt\\{1\\}",'\uD835\uDFF7'],["\\\\mathtt\\{0\\}",'\uD835\uDFF6'],["\\\\simminussim",'\u2A6C'],["\\\\midbarwedge",'\u2A5C'],["\\\\mathsf\\{9\\}",'\uD835\uDFEB'],["\\\\mathsf\\{8\\}",'\uD835\uDFEA'],["\\\\rcurvyangle",'\u29FD'],["\\\\lcurvyangle",'\u29FC'],["\\\\RuleDelayed",'\u29F4'],["\\\\gleichstark",'\u29E6'],["\\\\mathsf\\{7\\}",'\uD835\uDFE9'],["\\\\mathsf\\{6\\}",'\uD835\uDFE8'],["\\\\mathsf\\{5\\}",'\uD835\uDFE7'],["\\\\mathsf\\{4\\}",'\uD835\uDFE6'],["\\\\circledless",'\u29C0'],["\\\\revemptyset",'\u29B0'],["\\\\wideangleup",'\u29A7'],["\\\\mathsf\\{3\\}",'\uD835\uDFE5'],["\\\\mathsf\\{2\\}",'\uD835\uDFE4'],["\\\\mathsf\\{1\\}",'\uD835\uDFE3'],["\\\\mathsf\\{0\\}",'\uD835\uDFE2'],["\\\\mathbb\\{9\\}",'\uD835\uDFE1'],["\\\\mathbb\\{8\\}",'\uD835\uDFE0'],["\\\\mathbb\\{7\\}",'\uD835\uDFDF'],["\\\\nwovnearrow",'\u2932'],["\\\\neovnwarrow",'\u2931'],["\\\\neovsearrow",'\u292E'],["\\\\seovnearrow",'\u292D'],["\\\\mathbb\\{6\\}",'\uD835\uDFDE'],["\\\\mathbb\\{5\\}",'\uD835\uDFDD'],["\\\\leftdbltail",'\u291B'],["\\\\mathbb\\{4\\}",'\uD835\uDFDC'],["\\\\leftbkarrow",'\u290C'],["\\\\nvLeftarrow",'\u2902'],["\\\\mathbb\\{3\\}",'\uD835\uDFDB'],["\\\\mathbb\\{2\\}",'\uD835\uDFDA'],["\\\\mathbb\\{1\\}",'\uD835\uDFD9'],["\\\\mathbb\\{0\\}",'\uD835\uDFD8'],["\\\\multimapinv",'\u27DC'],["\\\\mathbf\\{9\\}",'\uD835\uDFD7'],["\\\\mathbf\\{8\\}",'\uD835\uDFD6'],["\\\\threedangle",'\u27C0'],["\\\\ding\\{254\\}",'\u27BE'],["\\\\ding\\{253\\}",'\u27BD'],["\\\\ding\\{252\\}",'\u27BC'],["\\\\ding\\{251\\}",'\u27BB'],["\\\\ding\\{250\\}",'\u27BA'],["\\\\ding\\{249\\}",'\u27B9'],["\\\\ding\\{248\\}",'\u27B8'],["\\\\ding\\{247\\}",'\u27B7'],["\\\\ding\\{246\\}",'\u27B6'],["\\\\ding\\{245\\}",'\u27B5'],["\\\\ding\\{244\\}",'\u27B4'],["\\\\ding\\{243\\}",'\u27B3'],["\\\\ding\\{242\\}",'\u27B2'],["\\\\ding\\{241\\}",'\u27B1'],["\\\\ding\\{239\\}",'\u27AF'],["\\\\ding\\{238\\}",'\u27AE'],["\\\\ding\\{237\\}",'\u27AD'],["\\\\ding\\{236\\}",'\u27AC'],["\\\\ding\\{235\\}",'\u27AB'],["\\\\ding\\{234\\}",'\u27AA'],["\\\\ding\\{233\\}",'\u27A9'],["\\\\ding\\{232\\}",'\u27A8'],["\\\\ding\\{231\\}",'\u27A7'],["\\\\ding\\{230\\}",'\u27A6'],["\\\\ding\\{229\\}",'\u27A5'],["\\\\ding\\{228\\}",'\u27A4'],["\\\\ding\\{227\\}",'\u27A3'],["\\\\ding\\{226\\}",'\u27A2'],["\\\\ding\\{225\\}",'\u27A1'],["\\\\ding\\{224\\}",'\u27A0'],["\\\\ding\\{223\\}",'\u279F'],["\\\\ding\\{222\\}",'\u279E'],["\\\\ding\\{221\\}",'\u279D'],["\\\\ding\\{220\\}",'\u279C'],["\\\\ding\\{219\\}",'\u279B'],["\\\\ding\\{218\\}",'\u279A'],["\\\\ding\\{216\\}",'\u2798'],["\\\\ding\\{212\\}",'\u2794'],["\\\\ding\\{211\\}",'\u2793'],["\\\\ding\\{210\\}",'\u2792'],["\\\\ding\\{209\\}",'\u2791'],["\\\\ding\\{208\\}",'\u2790'],["\\\\ding\\{207\\}",'\u278F'],["\\\\ding\\{206\\}",'\u278E'],["\\\\ding\\{205\\}",'\u278D'],["\\\\ding\\{204\\}",'\u278C'],["\\\\ding\\{203\\}",'\u278B'],["\\\\ding\\{202\\}",'\u278A'],["\\\\ding\\{201\\}",'\u2789'],["\\\\ding\\{200\\}",'\u2788'],["\\\\ding\\{199\\}",'\u2787'],["\\\\ding\\{198\\}",'\u2786'],["\\\\ding\\{197\\}",'\u2785'],["\\\\ding\\{196\\}",'\u2784'],["\\\\ding\\{195\\}",'\u2783'],["\\\\ding\\{194\\}",'\u2782'],["\\\\ding\\{193\\}",'\u2781'],["\\\\ding\\{192\\}",'\u2780'],["\\\\ding\\{191\\}",'\u277F'],["\\\\ding\\{190\\}",'\u277E'],["\\\\ding\\{189\\}",'\u277D'],["\\\\ding\\{188\\}",'\u277C'],["\\\\ding\\{187\\}",'\u277B'],["\\\\ding\\{186\\}",'\u277A'],["\\\\ding\\{185\\}",'\u2779'],["\\\\ding\\{184\\}",'\u2778'],["\\\\ding\\{183\\}",'\u2777'],["\\\\ding\\{182\\}",'\u2776'],["\\\\ding\\{167\\}",'\u2767'],["\\\\ding\\{166\\}",'\u2766'],["\\\\ding\\{165\\}",'\u2765'],["\\\\ding\\{164\\}",'\u2764'],["\\\\ding\\{163\\}",'\u2763'],["\\\\ding\\{162\\}",'\u2762'],["\\\\ding\\{161\\}",'\u2761'],["\\\\ding\\{126\\}",'\u275E'],["\\\\ding\\{125\\}",'\u275D'],["\\\\ding\\{124\\}",'\u275C'],["\\\\ding\\{123\\}",'\u275B'],["\\\\ding\\{122\\}",'\u275A'],["\\\\ding\\{121\\}",'\u2759'],["\\\\ding\\{120\\}",'\u2758'],["\\\\ding\\{118\\}",'\u2756'],["\\\\ding\\{114\\}",'\u2752'],["\\\\ding\\{113\\}",'\u2751'],["\\\\ding\\{112\\}",'\u2750'],["\\\\ding\\{111\\}",'\u274F'],["\\\\ding\\{109\\}",'\u274D'],["\\\\ding\\{107\\}",'\u274B'],["\\\\ding\\{106\\}",'\u274A'],["\\\\ding\\{105\\}",'\u2749'],["\\\\ding\\{104\\}",'\u2748'],["\\\\ding\\{103\\}",'\u2747'],["\\\\ding\\{102\\}",'\u2746'],["\\\\ding\\{101\\}",'\u2745'],["\\\\ding\\{100\\}",'\u2744'],["\\\\mathbf\\{7\\}",'\uD835\uDFD5'],["\\\\quarternote",'\u2669'],["\\\\varclubsuit",'\u2667'],["\\\\ding\\{169\\}",'\u2666'],["\\\\ding\\{170\\}",'\u2665'],["\\\\ding\\{168\\}",'\u2663'],["\\\\mathbf\\{6\\}",'\uD835\uDFD4'],["\\\\ding\\{171\\}",'\u2660'],["\\\\capricornus",'\u2651'],["\\\\sagittarius",'\u2650'],["\\\\backtrprime",'\u2037'],["\\\\caretinsert",'\u2038'],["\\\\nolinebreak",'\u2060'],["\\\\mathbf\\{5\\}",'\uD835\uDFD3'],["\\\\blacksmiley",'\u263B'],["\\\\vertoverlay",'\u20D2'],["\\\\mathbf\\{4\\}",'\uD835\uDFD2'],["\\\\mathbf\\{3\\}",'\uD835\uDFD1'],["\\\\smwhtcircle",'\u25E6'],["\\\\asteraccent",'\u20F0'],["\\\\mathbb\\{C\\}",'\u2102'],["\\\\mathbf\\{2\\}",'\uD835\uDFD0'],["\\\\ding\\{119\\}",'\u25D7'],["\\\\mathbb\\{H\\}",'\u210D'],["\\\\Planckconst",'\u210E'],["\\\\ding\\{108\\}",'\u25CF'],["\\\\mathbb\\{N\\}",'\u2115'],["\\\\ding\\{117\\}",'\u25C6'],["\\\\mathbb\\{P\\}",'\u2119'],["\\\\ding\\{116\\}",'\u25BC'],["\\\\mathbb\\{Q\\}",'\u211A'],["\\\\vartriangle",'\u25B5'],["\\\\ding\\{115\\}",'\u25B2'],["\\\\mathbf\\{1\\}",'\uD835\uDFCF'],["\\\\smwhtsquare",'\u25AB'],["\\\\blacksquare",'\u25AA'],["\\\\squarevfill",'\u25A5'],["\\\\squarehfill",'\u25A4'],["\\\\mathbb\\{R\\}",'\u211D'],["\\\\ding\\{110\\}",'\u25A0'],["\\\\mathbf\\{0\\}",'\uD835\uDFCE'],["\\\\blockuphalf",'\u2580'],["\\\\mathbb\\{Z\\}",'\u2124'],["\\\\ding\\{181\\}",'\u2469'],["\\\\ding\\{180\\}",'\u2468'],["\\\\ding\\{179\\}",'\u2467'],["\\\\ding\\{178\\}",'\u2466'],["\\\\ding\\{177\\}",'\u2465'],["\\\\ding\\{176\\}",'\u2464'],["\\\\ding\\{175\\}",'\u2463'],["\\\\ding\\{174\\}",'\u2462'],["\\\\ding\\{173\\}",'\u2461'],["\\\\ding\\{172\\}",'\u2460'],["\\\\overbracket",'\u23B4'],["\\\\intextender",'\u23AE'],["\\\\sansLturned",'\u2142'],["\\\\ExponetialE",'\u2147'],["\\\\wasylozenge",'\u2311'],['\\\\updownarrow','\u2195'],["\\\\nrightarrow",'\u219B'],["\\\\sqsubsetneq",'\u22E4'],["\\\\curlyeqsucc",'\u22DF'],["\\\\curlyeqprec",'\u22DE'],["\\\\nRightarrow",'\u21CF'],['\\\\Updownarrow','\u21D5'],["\\\\Rrightarrow",'\u21DB'],["\\\\ding\\{217\\}",'\u2799'],["\\\\precapprox",'\u227E'],["\\\\textdagger",'\u2020'],["\\\\mbfDigamma",'\uD835\uDFCA'],["\\\\twolowline",'\u2017'],["\\\\textemdash",'\u2014'],["\\\\textendash",'\u2013'],["\\\\eighthnote",'\u266A'],["\\\\ding\\{33\\}",'\u2701'],["\\\\ding\\{34\\}",'\u2702'],['\\\\underbrace','\u23DF'],["\\\\ding\\{35\\}",'\u2703'],['\\\\underparen','\u23DD'],["\\\\ding\\{36\\}",'\u2704'],["\\\\ding\\{38\\}",'\u2706'],["\\\\ding\\{39\\}",'\u2707'],["\\\\ding\\{40\\}",'\u2708'],["\\\\sqrtbottom",'\u23B7'],["\\\\ding\\{41\\}",'\u2709'],["\\\\ding\\{44\\}",'\u270C'],["\\\\succapprox",'\u227F'],["\\\\ding\\{45\\}",'\u270D'],["\\\\ding\\{46\\}",'\u270E'],["\\\\rmoustache",'\u23B1'],["\\\\lmoustache",'\u23B0'],["\\\\ding\\{47\\}",'\u270F'],["\\\\nLeftarrow",'\u21CD'],["\\\\rbracelend",'\u23AD'],["\\\\ding\\{48\\}",'\u2710'],["\\\\rbraceuend",'\u23AB'],["\\\\ding\\{49\\}",'\u2711'],["\\\\lbracelend",'\u23A9'],["\\\\ding\\{50\\}",'\u2712'],["\\\\lbraceuend",'\u23A7'],["\\\\rbracklend",'\u23A6'],["\\\\ding\\{51\\}",'\u2713'],["\\\\rbrackuend",'\u23A4'],["\\\\ding\\{52\\}",'\u2714'],["\\\\ding\\{53\\}",'\u2715'],["\\\\lbrackuend",'\u23A1'],["\\\\rparenlend",'\u23A0'],["\\\\ding\\{54\\}",'\u2716'],["\\\\rparenuend",'\u239E'],["\\\\lparenlend",'\u239D'],["\\\\ding\\{55\\}",'\u2717'],["\\\\lparenuend",'\u239B'],["\\\\ding\\{56\\}",'\u2718'],["\\\\ding\\{57\\}",'\u2719'],["\\\\ding\\{58\\}",'\u271A'],["\\\\ding\\{59\\}",'\u271B'],["\\\\ding\\{60\\}",'\u271C'],["\\\\APLcomment",'\u235D'],["\\\\ding\\{61\\}",'\u271D'],["\\\\ding\\{62\\}",'\u271E'],["\\\\ding\\{63\\}",'\u271F'],["\\\\ding\\{64\\}",'\u2720'],["\\\\ding\\{65\\}",'\u2721'],["\\\\ding\\{66\\}",'\u2722'],["\\\\ding\\{67\\}",'\u2723'],["\\\\ding\\{68\\}",'\u2724'],["\\\\ding\\{69\\}",'\u2725'],["\\\\rightangle",'\u221F'],["\\\\conictaper",'\u2332'],["\\\\ding\\{70\\}",'\u2726'],["\\\\ding\\{71\\}",'\u2727'],["\\\\ding\\{74\\}",'\u272A'],["\\\\ding\\{75\\}",'\u272B'],["\\\\varnothing",'\u2205'],["\\\\ding\\{76\\}",'\u272C'],["\\\\ding\\{77\\}",'\u272D'],["\\\\ding\\{78\\}",'\u272E'],["\\\\ding\\{79\\}",'\u272F'],["\\\\ding\\{80\\}",'\u2730'],["\\\\ding\\{81\\}",'\u2731'],["\\\\ding\\{82\\}",'\u2732'],["\\\\ding\\{83\\}",'\u2733'],["\\\\ding\\{84\\}",'\u2734'],["\\\\ding\\{85\\}",'\u2735'],["\\\\ding\\{86\\}",'\u2736'],["\\\\ding\\{87\\}",'\u2737'],["\\\\complement",'\u2201'],["\\\\ding\\{88\\}",'\u2738'],["\\\\ding\\{89\\}",'\u2739'],["\\\\ding\\{90\\}",'\u273A'],["\\\\ding\\{91\\}",'\u273B'],["\\\\rightarrow",'\u2192'],["\\\\ding\\{92\\}",'\u273C'],["\\\\ding\\{93\\}",'\u273D'],["\\\\sqsubseteq",'\u2291'],["\\\\ding\\{94\\}",'\u273E'],["\\\\nleftarrow",'\u219A'],["\\\\ding\\{95\\}",'\u273F'],["\\\\sqsupseteq",'\u2292'],["\\\\ding\\{96\\}",'\u2740'],["\\\\ding\\{97\\}",'\u2741'],["\\\\ding\\{98\\}",'\u2742'],["\\\\ding\\{99\\}",'\u2743'],["\\\\subsetcirc",'\u27C3'],["\\\\supsetcirc",'\u27C4'],["\\\\Diamonddot",'\u27D0'],["\\\\DDownarrow",'\u27F1'],["\\\\longmapsto",'\u27FC'],["\\\\Longmapsto",'\u27FE'],["\\\\Ddownarrow",'\u290B'],['\\\\UpArrowBar','\u2912'],['\\\\upfishtail','\u297E'],["\\\\lbrackubar",'\u298B'],["\\\\rbrackubar",'\u298C'],["\\\\Rparenless",'\u2996'],["\\\\lblkbrbrak",'\u2997'],["\\\\rblkbrbrak",'\u2998'],["\\\\circledgtr",'\u29C1'],["\\\\doubleplus",'\u29FA'],["\\\\tripleplus",'\u29FB'],["\\\\plussubtwo",'\u2A27'],["\\\\commaminus",'\u2A29'],["\\\\Lleftarrow",'\u21DA'],["\\\\minusfdots",'\u2A2B'],["\\\\minusrdots",'\u2A2C'],["\\\\smashtimes",'\u2A33'],["\\\\cupovercap",'\u2A46'],["\\\\Rightarrow",'\u21D2'],["\\\\circledast",'\u229B'],["\\\\capovercup",'\u2A47'],["\\\\veeonwedge",'\u2A59'],["\\\\veemidvert",'\u2A5B'],["\\\\equivVvert",'\u2A69'],["\\\\lessapprox",'\u2A85'],["\\\\lesseqqgtr",'\u2A8B'],["\\\\gtreqqless",'\u2A8C'],["\\\\eqslantgtr",'\u2A96'],["\\\\rightslice",'\u2AA7'],["\\{\\\\'\\{\\}O\\}|\\\\'\\{\\}O",'\u038C'],["\\\\'\\{\\}\\{I\\}",'\u038A'],["\\\\subsetplus",'\u2ABF'],["\\\\supsetplus",'\u2AC0'],["\\\\cyrchar\\\\C",'\u030F'],["\\\\curlywedge",'\u22CF'],["\\\\tone\\{11\\}",'\u02E9'],["\\\\tone\\{22\\}",'\u02E8'],["\\\\subsetneqq",'\u2ACB'],["\\\\supsetneqq",'\u2ACC'],["\\\\fbox\\{~~\\}",'\u25AD'],["\\\\LEFTCIRCLE",'\u25D6'],['\\\\ultriangle','\u25F8'],["\\\\tone\\{33\\}",'\u02E7'],["\\\\tone\\{44\\}",'\u02E6'],['\\\\urtriangle','\u25F9'],["\\\\lltriangle",'\u25FA'],["\\\\tone\\{55\\}",'\u02E5'],["\\\\varepsilon",'\u025B'],["\\\\lrtriangle",'\u25FF'],["\\\\ding\\{72\\}",'\u2605'],["\\\\ding\\{73\\}",'\u2606'],["\\\\ding\\{37\\}",'\u260E'],["\\\\CheckedBox",'\u2611'],["\\^\\\\circ|\\\\textdegree",'\xB0'],["\\\\ding\\{42\\}",'\u261B'],["\\\\interleave",'\u2AF4'],["\\\\ding\\{43\\}",'\u261E'],["\\\\talloblong",'\u2AFE'],["\\\\mbfdigamma",'\uD835\uDFCB'],["\\\\backdprime",'\u2036'],["\\\\varhexagon",'\u2B21'],["\\\\leftarrowx",'\u2B3E'],["\\\\LLeftarrow",'\u2B45'],["\\\\postalmark",'\u3012'],["\\\\\\$|\\\\textdollar",'$'],['\\\\upuparrows','\u21C8'],["\\\\not\\\\equiv",'\u2262'],["\\\\not\\\\simeq",'\u2244'],["\\\\homothetic",'\u223B'],["\\\\textbullet",'\u2022'],["\\\\geqqslant",'\u2AFA'],["\\\\leqqslant",'\u2AF9'],["\\\\supseteqq",'\u2AC6'],["\\\\subseteqq",'\u2AC5'],["\\\\supsetdot",'\u2ABE'],["\\\\subsetdot",'\u2ABD'],["\\\\leftslice",'\u2AA6'],["\\\\gtrapprox",'\u2A86'],["\\\\approxeqq",'\u2A70'],["\\\\hatapprox",'\u2A6F'],["\\\\equivVert",'\u2A68'],["\\\\varveebar",'\u2A61'],["\\\\Elzminhat",'\u2A5F'],["\\\\midbarvee",'\u2A5D'],["\\\\wedgeodot",'\u2A51'],["\\\\capbarcup",'\u2A49'],["\\\\cupbarcap",'\u2A48'],["\\\\otimeshat",'\u2A36'],["\\\\clockoint",'\u2A0F'],["\\\\modtwosum",'\u2A0A'],["\\\\bigcupdot",'\u2A03'],["\\\\bigotimes",'\u2A02'],["\\\\hourglass",'\u29D6'],["\\\\triangles",'\u29CC'],["\\\\boxcircle",'\u29C7'],["\\\\boxbslash",'\u29C5'],["\\\\angleubar",'\u29A4'],["\\\\turnangle",'\u29A2'],["\\\\Elzlpargt",'\u29A0'],["\\\\Lparengtr",'\u2995'],["\\\\rangledot",'\u2992'],["\\\\langledot",'\u2991'],["\\\\typecolon",'\u2982'],["\\\\neswarrow",'\u2922'],["\\\\nwsearrow",'\u2921'],["\\\\righttail",'\u291A'],["\\\\rrbracket",'\u27E7'],["\\\\llbracket",'\u27E6'],["\\\\longdashv",'\u27DE'],["\\\\vlongdash",'\u27DD'],["\\\\dashVdash",'\u27DB'],["\\\\DashVDash",'\u27DA'],["\\\\medbullet",'\u26AB'],["\\\\heartsuit",'\u2661'],["\\\\rightmoon",'\u263D'],["\\\\biohazard",'\u2623'],["\\\\radiation",'\u2622'],["\\\\Elzrvbull",'\u25D8'],["\\\\Elzvrecto",'\u25AF'],["\\\\blockfull",'\u2588'],["\\\\Elzdshfnc",'\u2506'],["\\\\accurrent",'\u23E6'],["\\\\trapezium",'\u23E2'],["\\\\overbrace",'\u23DE'],["\\\\overparen",'\u23DC'],["\\\\rvboxline",'\u23B9'],["\\\\lvboxline",'\u23B8'],["\\\\sumbottom",'\u23B3'],["\\\\rbracemid",'\u23AC'],["\\\\lbracemid",'\u23A8'],["\\\\Elzdlcorn",'\u23A3'],["\\\\intbottom",'\u2321'],["\\\\turnednot",'\u2319'],["\\\\bagmember",'\u22FF'],["\\\\varniobar",'\u22FD'],["\\\\Elzsqspne",'\u22E5'],["\\\\gtreqless",'\u22DB'],["\\\\lesseqgtr",'\u22DA'],["\\\\pitchfork",'\u22D4'],["\\\\backsimeq",'\u22CD'],["\\\\truestate",'\u22A7'],["\\\\supsetneq",'\u228B'],["\\\\subsetneq",'\u228A'],["\\\\not\\\\succ",'\u2281'],["\\\\not\\\\prec",'\u2280'],["\\\\triangleq",'\u225C'],["\\\\starequal",'\u225B'],["\\\\estimates",'\u2259'],["\\\\tildetrpl",'\u224B'],["\\\\not\\\\cong",'\u2247'],["\\\\therefore",'\u2234'],["\\\\nparallel",'\u2226'],["\\\\sqrt\\[4\\]",'\u221C'],["\\\\sqrt\\[3\\]",'\u221B'],["\\\\increment",'\u2206'],["\\\\nHuparrow",'\u21DE'],["\\\\Downarrow",'\u21D3'],["\\\\Leftarrow",'\u21D0'],["\\\\lightning",'\u21AF'],["\\\\downarrow",'\u2193'],["\\\\leftarrow",'\u2190'],["\\\\fracslash",'\u2044'],["\\\\backprime",'\u2035'],["\\\\Elzreapos",'\u201B'],["\\\\textTheta",'\u03F4'],['\\\\underline','\u0332'],["\\\\textturnk",'\u029E'],["\\\\Elzinglst",'\u0296'],["\\\\Elzreglst",'\u0295'],["\\\\Elzpupsil",'\u028A'],["\\\\Elzrttrnr",'\u027B'],["\\\\Elzclomeg",'\u0277'],["\\\\Elztrnmlr",'\u0270'],["\\\\Elzpgamma",'\u0263'],["\\\\textnrleg",'\u019E'],["\\\\texthvlig",'\u0195'],["\\\\texttimes",'\xD7'],["\\\\texttheta",'\u03B8'],["\\\\Elzpscrv",'\u028B'],["\\\\succnsim",'\u22E9'],["\\\\Elzsqfnw",'\u2519'],["\\\\circledS",'\u24C8'],["\\\\elinters",'\u23E7'],["\\\\varisins",'\u22F3'],["\\\\bbrktbrk",'\u23B6'],["\\\\MapsDown",'\u21A7'],["\\\\APLinput",'\u235E'],["\\\\notslash",'\u233F'],["\\\\mapsfrom",'\u21A4'],["\\\\pentagon",'\u2B20'],["\\\\ComplexI",'\u2148'],["\\\\isinobar",'\u22F7'],["\\\\ComplexJ",'\u2149'],["\\\\lrcorner",'\u231F'],["\\\\llcorner",'\u231E'],['\\\\urcorner','\u231D'],['\\\\ulcorner','\u231C'],["\\\\viewdata",'\u2317'],["\\\\Elzdyogh",'\u02A4'],["\\\\Elzverts",'\u02C8'],["\\\\Elzverti",'\u02CC'],["\\\\Elzhlmrk",'\u02D1'],["\\\\diameter",'\u2300'],["\\\\recorder",'\u2315'],["\\\\Elzsbrhr",'\u02D2'],["\\\\profsurf",'\u2313'],["\\\\Elzsblhr",'\u02D3'],["\\\\Elztdcol",'\u2AF6'],["\\\\profline",'\u2312'],["\\\\overline",'\u0305'],["\\\\Elzsbbrg",'\u032A'],["\\\\succneqq",'\u2AB6'],["\\\\precneqq",'\u2AB5'],['\\\\underbar','\u0331'],["\\\\varsigma",'\u03C2'],["\\\\setminus",'\u2216'],["\\\\varkappa",'\u03F0'],["\\\\not\\\\sim",'\u2241'],["\\\\gnapprox",'\u2A8A'],["\\\\lnapprox",'\u2A89'],["\\\\gesdotol",'\u2A84'],["\\\\lesdotor",'\u2A83'],["\\\\geqslant",'\u2A7E'],["\\\\approxeq",'\u224A'],["\\\\lazysinv",'\u223E'],["\\\\leqslant",'\u2A7D'],["\\\\varVdash",'\u2AE6'],["\\\\=\\{\\\\i\\}",'\u012B'],["\\\\Coloneqq",'\u2A74'],["\\\\simrdots",'\u2A6B'],["\\\\dotequiv",'\u2A67'],["\\\\capwedge",'\u2A44'],["\\\\not\\\\leq",'\u2270'],["\\\\intprodr",'\u2A3D'],["\\\\not\\\\geq",'\u2271'],["\\\\subseteq",'\u2286'],["\\\\timesbar",'\u2A31'],["\\\\supseteq",'\u2287'],["\\\\dottimes",'\u2A30'],["\\\\ElzTimes",'\u2A2F'],["\\\\sqsubset",'\u228F'],["\\\\plustrif",'\u2A28'],["\\\\sqsupset",'\u2290'],["\\\\ringplus",'\u2A22'],["\\\\zproject",'\u2A21'],["\\\\intlarhk",'\u2A17'],["\\\\pointint",'\u2A15'],["\\\\scpolint",'\u2A13'],["\\\\rppolint",'\u2A12'],["\\\\Elxsqcup",'\u2A06'],["\\\\Elxuplus",'\u2A04'],["\\\\forksnot",'\u2ADD'],["\\\\boxminus",'\u229F'],["\\\\boxtimes",'\u22A0'],["\\\\bigoplus",'\u2A01'],["\\\\eqvparsl",'\u29E5'],["\\\\smeparsl",'\u29E4'],["\\\\tieinfty",'\u29DD'],["\\\\Rvzigzag",'\u29DB'],["\\\\Lvzigzag",'\u29DA'],["\\\\rvzigzag",'\u29D9'],["\\\\lvzigzag",'\u29D8'],["\\\\rfbowtie",'\u29D2'],["\\\\lfbowtie",'\u29D1'],["\\\\rtriltri",'\u29CE'],["\\\\Elzdefas",'\u29CB'],["\\\\allequal",'\u224C'],["\\\\doteqdot",'\u2251'],["\\\\Elztrnsa",'\u0252'],["\\\\Elzopeno",'\u0254'],["\\\\boxonbox",'\u29C9'],["\\\\boxslash",'\u29C4'],["\\\\revangle",'\u29A3'],["\\\\Elzddfnc",'\u2999'],["\\\\Elzschwa",'\u0259'],["\\\\Elzrarrx",'\u2947'],["\\\\ElzrLarr",'\u2944'],["\\\\original",'\u22B6'],["\\\\ElzRlarr",'\u2942'],["\\\\multimap",'\u22B8'],["\\\\intercal",'\u22BA'],["\\\\lefttail",'\u2919'],["\\\\barwedge",'\u22BC'],["\\\\drbkarow",'\u2910'],['\\\\Uuparrow','\u290A'],["\\\\Mapsfrom",'\u2906'],["\\\\Elzpbgam",'\u0264'],['\\\\UUparrow','\u27F0'],["\\\\pullback",'\u27D3'],["\\\\wedgedot",'\u27D1'],["\\\\bsolhsub",'\u27C8'],["\\\\curlyvee",'\u22CE'],["\\\\acidfree",'\u267E'],["\\\\twonotes",'\u266B'],["\\\\mkern1mu",'\u200A'],["\\\\aquarius",'\u2652'],["\\\\textcent",'\xA2'],["\\\\Elzltlmr",'\u0271'],["\\\\Question",'\u2047'],["\\\\:|\\\\mkern4mu",'\u205F'],["\\\\steaming",'\u2615'],["\\\\Elztrnrl",'\u027A'],["\\\\parallel",'\u2225'],["\\\\linefeed",'\u21B4'],["\\\\Elzsqfse",'\u25EA'],["\\\\Elzcirfb",'\u25D2'],["\\\\Elzcirfr",'\u25D1'],["\\\\Elzcirfl",'\u25D0'],["\\\\bullseye",'\u25CE'],["\\\\eqcolon",'\u2239'],["\\\\because",'\u2235'],["\\\\revnmid",'\u2AEE'],["\\\\between",'\u226C'],["\\\\lessgtr",'\u2276'],["\\\\gtrless",'\u2277'],["\\\\dotplus",'\u2214'],["\\\\smallni",'\u220D'],["\\\\not\\\\ni",'\u220C'],["\\\\smallin",'\u220A'],["\\\\not\\\\in",'\u2209'],["\\\\nexists",'\u2204'],["\\\\partial",'\u2202'],["\\\\boxplus",'\u229E'],["\\\\Swarrow",'\u21D9'],["\\\\Searrow",'\u21D8'],["\\\\Nearrow",'\u21D7'],["\\\\Nwarrow",'\u21D6'],['\\\\Uparrow','\u21D1'],["\\\\diamond",'\u22C4'],["\\\\lessdot",'\u22D6'],["\\\\npreceq",'\u22E0'],["\\\\nsucceq",'\u22E1'],["\\\\nhVvert",'\u2AF5'],["\\\\isindot",'\u22F5'],["\\\\swarrow",'\u2199'],["\\\\searrow",'\u2198'],["\\\\nearrow",'\u2197'],["\\\\nwarrow",'\u2196'],["\\\\textyen",'\xA5'],['\\\\uparrow','\u2191'],["\\\\hexagon",'\u2394'],["\\\\obrbrak",'\u23E0'],['\\\\ubrbrak','\u23E1'],["\\\\benzenr",'\u23E3'],["\\\\Elzxrat",'\u211E'],["\\\\squoval",'\u25A2'],["\\\\Diamond",'\u25C7'],["\\\\fisheye",'\u25C9'],["\\\\lozenge",'\u25CA'],["\\\\bigcirc",'\u25CB'],["\\\\Elzsqfl",'\u25E7'],["\\\\Elzsqfr",'\u25E8'],["\\\\annuity",'\u20E7'],["\\\\yinyang",'\u262F'],["\\\\frownie",'\u2639'],["\\\\mercury",'\u263F'],["\\\\closure",'\u2050'],["\\\\lllnest",'\u2AF7'],["\\\\jupiter",'\u2643'],["\\\\neptune",'\u2646'],["\\\\gggnest",'\u2AF8'],["\\\\scorpio",'\u264F'],["\\\\natural",'\u266E'],["\\\\recycle",'\u267B'],["\\\\diceiii",'\u2682'],["\\\\warning",'\u26A0'],["\\\\medcirc",'\u26AA'],["\\\\lbrbrak",'\u2772'],["\\\\rbrbrak",'\u2773'],["\\\\suphsol",'\u27C9'],["\\\\pushout",'\u27D4'],["\\\\Lbrbrak",'\u27EC'],["\\\\Rbrbrak",'\u27ED'],["\\\\dbkarow",'\u290F'],["\\\\Elolarr",'\u2940'],["\\\\Elorarr",'\u2941'],["\\\\subrarr",'\u2979'],["\\\\suplarr",'\u297B'],["\\\\Elztfnc",'\u2980'],["\\\\Elroang",'\u2986'],["\\\\vzigzag",'\u299A'],["\\\\olcross",'\u29BB'],["\\\\cirscir",'\u29C2'],["\\\\fbowtie",'\u29D3'],["\\\\lftimes",'\u29D4'],["\\\\rftimes",'\u29D5'],["\\\\nvinfty",'\u29DE'],["\\\\shuffle",'\u29E2'],["\\\\thermod",'\u29E7'],["\\\\rsolbar",'\u29F7'],["\\\\bigodot",'\u2A00'],["\\\\varprod",'\u2A09'],["\\\\ElzCint",'\u2A0D'],["\\\\npolint",'\u2A14'],["\\\\plushat",'\u2A23'],["\\\\simplus",'\u2A24'],["\\\\plussim",'\u2A26'],["\\\\twocups",'\u2A4A'],["\\\\twocaps",'\u2A4B'],["\\\\veeodot",'\u2A52'],["\\\\congdot",'\u2A6D'],["\\\\eqqplus",'\u2A71'],["\\\\pluseqq",'\u2A72'],["\\\\ddotseq",'\u2A77'],["\\\\equivDD",'\u2A78'],["\\\\ltquest",'\u2A7B'],["\\\\gtquest",'\u2A7C'],["\\\\lesdoto",'\u2A81'],["\\\\gesdoto",'\u2A82'],["\\\\digamma",'\u03DD'],["\\\\Digamma",'\u03DC'],['\\\\upsilon','\u03C5'],["\\\\epsilon",'\u03B5'],["\\\\eqqless",'\u2A99'],['\\\\Upsilon','\u03A5'],["\\\\bumpeqq",'\u2AAE'],["\\\\backsim",'\u223D'],["\\\\succneq",'\u2AB2'],["\\\\preceqq",'\u2AB3'],["\\\\succeqq",'\u2AB4'],["\\\\trslash",'\u2AFB'],["\\\\Elzpalh",'\u0321'],["\\\\llcurly",'\u2ABB'],["\\\\ggcurly",'\u2ABC'],["\\\\submult",'\u2AC1'],["\\\\supmult",'\u2AC2'],["\\\\subedot",'\u2AC3'],["\\\\supedot",'\u2AC4'],["\\\\lsqhook",'\u2ACD'],["\\\\rsqhook",'\u2ACE'],["\\\\Elzrais",'\u02D4'],["\\\\Elzlmrk",'\u02D0'],["\\\\Elztesh",'\u02A7'],["\\\\Elzglst",'\u0294'],["\\\\Elzyogh",'\u0292'],["\\\\Elzrtlz",'\u0290'],["\\\\Elztrny",'\u028E'],["\\\\Elzinvw",'\u028D'],["\\\\Elzinvv",'\u028C'],["\\\\Elzrtlt",'\u0288'],["\\\\Elztrnt",'\u0287'],["\\\\Elzrtls",'\u0282'],["\\\\Elzrtlr",'\u027D'],["\\\\Elztrnr",'\u0279'],["\\\\textphi",'\u0278'],["\\\\hzigzag",'\u3030'],["\\\\Elzrtln",'\u0273'],["\\\\Elzltln",'\u0272'],["\\\\Elztrnm",'\u026F'],["\\\\Elzrtll",'\u026D'],["\\\\Elzbtdl",'\u026C'],["\\\\Elztrnh",'\u0265'],["\\\\Elzrtld",'\u0256'],["\\\\Elztrna",'\u0250'],["\\\\suphsub",'\u2AD7'],["\\\\supdsub",'\u2AD8'],["\\\\\\.z|\\\\\\.\\{z\\}",'\u017C'],["\\\\\\.Z|\\\\\\.\\{Z\\}",'\u017B'],["\\\\\\^y|\\\\\\^\\{y\\}",'\u0177'],["\\\\\\^Y|\\\\\\^\\{Y\\}",'\u0176'],["\\\\\\^w|\\\\\\^\\{w\\}",'\u0175'],["\\\\\\^W|\\\\\\^\\{W\\}",'\u0174'],["\\\\topfork",'\u2ADA'],["\\\\\\^s|\\\\\\^\\{s\\}",'\u015D'],["\\\\\\^S|\\\\\\^\\{S\\}",'\u015C'],["\\\\\\^J|\\\\\\^\\{J\\}",'\u0134'],["\\\\\\.I|\\\\\\.\\{I\\}",'\u0130'],["\\\\\\^h|\\\\\\^\\{h\\}",'\u0125'],["\\\\\\^H|\\\\\\^\\{H\\}",'\u0124'],["\\\\\\.g|\\\\\\.\\{g\\}",'\u0121'],["\\\\\\.G|\\\\\\.\\{G\\}",'\u0120'],["\\\\\\^g|\\\\\\^\\{g\\}",'\u011D'],["\\\\\\^G|\\\\\\^\\{G\\}",'\u011C'],["\\\\\\.e|\\\\\\.\\{e\\}",'\u0117'],["\\\\\\.E|\\\\\\.\\{E\\}",'\u0116'],["\\\\\\.c|\\\\\\.\\{c\\}",'\u010B'],["\\\\\\.C|\\\\\\.\\{C\\}",'\u010A'],["\\\\\\^c|\\\\\\^\\{c\\}",'\u0109'],["\\\\\\^C|\\\\\\^\\{C\\}",'\u0108'],["\\\\\\^u|\\\\\\^\\{u\\}",'\xFB'],["\\\\\\^o|\\\\\\^\\{o\\}",'\xF4'],["\\\\\\^e|\\\\\\^\\{e\\}",'\xEA'],["\\\\\\^a|\\\\\\^\\{a\\}",'\xE2'],["\\\\\\^U|\\\\\\^\\{U\\}",'\xDB'],["\\\\\\^O|\\\\\\^\\{O\\}",'\xD4'],["\\\\\\^I|\\\\\\^\\{I\\}",'\xCE'],["\\\\\\^E|\\\\\\^\\{E\\}",'\xCA'],["\\\\\\^A|\\\\\\^\\{A\\}",'\xC2'],["\\\\precneq",'\u2AB1'],["\\\\bigtop",'\u27D9'],["\\\\lgroup",'\u27EE'],["\\\\rgroup",'\u27EF'],["\\\\bigcup",'\u22C3'],["\\\\Mapsto",'\u2907'],["\\\\bigcap",'\u22C2'],["\\\\approx",'\u2248'],["\\\\barvee",'\u22BD'],["\\\\veebar",'\u22BB'],["\\\\'c|\\\\'\\{c\\}",'\u0107'],["\\\\scurel",'\u22B1'],["\\\\parsim",'\u2AF3'],["\\\\ltlarr",'\u2976'],["\\\\gtrarr",'\u2978'],["\\\\'C|\\\\'\\{C\\}",'\u0106'],["\\\\k\\{a\\}",'\u0105'],["\\\\k\\{A\\}",'\u0104'],["\\\\lBrace",'\u2983'],["\\\\rBrace",'\u2984'],["\\\\prurel",'\u22B0'],["\\\\angles",'\u299E'],["\\\\angdnr",'\u299F'],["\\\\=a|\\\\=\\{a\\}",'\u0101'],["\\\\=A|\\\\=\\{A\\}",'\u0100'],["\\\\nVDash",'\u22AF'],["\\\\boxast",'\u29C6'],["\\\\boxbox",'\u29C8'],["\\\\nVdash",'\u22AE'],["\\\\ElzLap",'\u29CA'],["\\\\nvDash",'\u22AD'],["\\\\nvdash",'\u22AC'],["\\\\Vvdash",'\u22AA'],["\\\\\"y|\\\\\"\\{y\\}",'\xFF'],["\\\\'y|\\\\'\\{y\\}",'\xFD'],["\\\\topcir",'\u2AF1'],["\\\\assert",'\u22A6'],["\\\\\"u|\\\\\"\\{u\\}",'\xFC'],["\\\\laplac",'\u29E0'],["\\\\eparsl",'\u29E3'],["\\\\'u|\\\\'\\{u\\}",'\xFA'],["\\\\`u|\\\\`\\{u\\}",'\xF9'],["\\\\tminus",'\u29FF'],["\\\\boxdot",'\u22A1'],["\\\\ElzThr",'\u2A05'],["\\\\oslash",'\u2298'],["\\\\ElzInf",'\u2A07'],["\\\\ElzSup",'\u2A08'],["\\\\sumint",'\u2A0B'],["\\\\iiiint",'\u2A0C'],["\\\\\"o|\\\\\"\\{o\\}",'\xF6'],["\\\\intBar",'\u2A0E'],["\\\\otimes",'\u2297'],["\\\\ominus",'\u2296'],["\\\\~o|\\\\~\\{o\\}",'\xF5'],["\\\\sqrint",'\u2A16'],["\\\\intcap",'\u2A19'],["\\\\intcup",'\u2A1A'],["\\\\lowint",'\u2A1C'],["\\\\'o|\\\\'\\{o\\}",'\xF3'],["\\\\`o|\\\\`\\{o\\}",'\xF2'],["\\\\cupdot",'\u228D'],["\\\\forall",'\u2200'],["\\\\btimes",'\u2A32'],["\\\\Otimes",'\u2A37'],["\\\\exists",'\u2203'],["\\\\capdot",'\u2A40'],['\\\\uminus','\u2A41'],["\\\\barcup",'\u2A42'],["\\\\barcap",'\u2A43'],["\\\\supset",'\u2283'],["\\\\cupvee",'\u2A45'],["\\\\~n|\\\\~\\{n\\}",'\xF1'],["\\\\ElzAnd",'\u2A53'],["\\\\midcir",'\u2AF0'],["\\\\dotsim",'\u2A6A'],["\\\\eqqsim",'\u2A73'],["\\\\\"e|\\\\\"\\{e\\}",'\xEB'],["\\\\'e|\\\\'\\{e\\}",'\xE9'],["\\\\`e|\\\\`\\{e\\}",'\xE8'],["\\\\lesdot",'\u2A7F'],["\\\\gesdot",'\u2A80'],["\\\\coprod",'\u2210'],["\\\\varrho",'\u03F1'],["\\\\\"a|\\\\\"\\{a\\}",'\xE4'],["\\\\stigma",'\u03DB'],["\\\\Stigma",'\u03DA'],["\\\\lesges",'\u2A93'],["\\\\gesles",'\u2A94'],["\\\\elsdot",'\u2A97'],["\\\\egsdot",'\u2A98'],["\\\\varphi",'\u03C6'],["\\\\~a|\\\\~\\{a\\}",'\xE3'],["\\\\lambda",'\u03BB'],["\\\\'a|\\\\'\\{a\\}",'\xE1'],["\\\\eqqgtr",'\u2A9A'],["\\\\`a|\\\\`\\{a\\}",'\xE0'],["\\\\Pi|\\\\P\\{i\\}",'\u03A0'],["\\\\Xi|\\\\X\\{i\\}",'\u039E'],["\\\\Lambda",'\u039B'],["\\\\'H|\\\\'\\{H\\}",'\u0389'],["\\\\preceq",'\u2AAF'],["\\\\succeq",'\u2AB0'],["\\\\TH|\\\\T\\{H\\}",'\xDE'],["\\\\'Y|\\\\'\\{Y\\}",'\xDD'],["\\\\\"U|\\\\\"\\{U\\}",'\xDC'],["\\\\Elzbar",'\u0336'],["\\\\'U|\\\\'\\{U\\}",'\xDA'],['\\\\utilde','\u0330'],["\\\\bullet",'\u2219'],["\\\\cirmid",'\u2AEF'],["\\\\`U|\\\\`\\{U\\}",'\xD9'],["\\\\droang",'\u031A'],["\\\\\"O|\\\\\"\\{O\\}",'\xD6'],["\\\\~O|\\\\~\\{O\\}",'\xD5'],["\\\\candra",'\u0310'],["\\\\'O|\\\\'\\{O\\}",'\xD3'],["\\\\ovhook",'\u0309'],["\\\\subsim",'\u2AC7'],["\\\\supsim",'\u2AC8'],["\\\\`O|\\\\`\\{O\\}",'\xD2'],["\\\\~N|\\\\~\\{N\\}",'\xD1'],["\\\\Elzlow",'\u02D5'],["\\\\DH|\\\\D\\{H\\}",'\xD0'],["\\\\propto",'\u221D'],["\\\\subset",'\u2282'],["\\\\\"I|\\\\\"\\{I\\}",'\xCF'],["\\\\subsup",'\u2AD3'],["\\\\\\}|\\\\rbrace",'}'],["\\\\\\{|\\\\lbrace",'{'],["\\\\'I|\\\\'\\{I\\}",'\xCD'],["\\\\`I|\\\\`\\{I\\}",'\xCC'],["\\\\\"E|\\\\\"\\{E\\}",'\xCB'],["\\\\AC|\\\\A\\{C\\}",'\u223F'],["\\\\'E|\\\\'\\{E\\}",'\xC9'],["\\\\`E|\\\\`\\{E\\}",'\xC8'],["\\\\AE|\\\\A\\{E\\}",'\xC6'],["\\\\Elzesh",'\u0283'],["\\\\AA|\\\\A\\{A\\}",'\xC5'],["\\\\supsub",'\u2AD4'],["\\\\Elzfhr",'\u027E'],["\\\\\"A|\\\\\"\\{A\\}",'\xC4'],["\\\\~A|\\\\~\\{A\\}",'\xC3'],["\\\\'A|\\\\'\\{A\\}",'\xC1'],["\\\\`A|\\\\`\\{A\\}",'\xC0'],["\\\\vDdash",'\u2AE2'],["\\\\subsub",'\u2AD5'],["\\\\supsup",'\u2AD6'],["\\\\'g|\\\\'\\{g\\}",'\u01F5'],["\\\\not\\ =",'\u2260'],["\\\\measeq",'\u225E'],["\\\\'z|\\\\'\\{z\\}",'\u017A'],["\\\\'Z|\\\\'\\{Z\\}",'\u0179'],["\\\\\"Y|\\\\\"\\{Y\\}",'\u0178'],["\\\\k\\{u\\}",'\u0173'],["\\\\k\\{U\\}",'\u0172'],["\\\\r\\{u\\}",'\u016F'],["\\\\r\\{U\\}",'\u016E'],["\\\\=u|\\\\=\\{u\\}",'\u016B'],["\\\\=U|\\\\=\\{U\\}",'\u016A'],["\\\\~u|\\\\~\\{u\\}",'\u0169'],["\\\\~U|\\\\~\\{U\\}",'\u0168'],["\\\\circeq",'\u2257'],["\\\\'s|\\\\'\\{s\\}",'\u015B'],["\\\\'S|\\\\'\\{S\\}",'\u015A'],["\\\\'r|\\\\'\\{r\\}",'\u0155'],["\\\\'R|\\\\'\\{R\\}",'\u0154'],["\\\\OE|\\\\O\\{E\\}",'\u0152'],["\\\\=o|\\\\=\\{o\\}",'\u014D'],["\\\\=O|\\\\=\\{O\\}",'\u014C'],["\\\\NG|\\\\N\\{G\\}",'\u014A'],["\\\\'n|\\\\'\\{n\\}",'\u0144'],["\\\\'N|\\\\'\\{N\\}",'\u0143'],["\\\\'l|\\\\'\\{l\\}",'\u013A'],["\\\\'L|\\\\'\\{L\\}",'\u0139'],["\\\\eqcirc",'\u2256'],["\\\\k\\{i\\}",'\u012F'],["\\\\k\\{I\\}",'\u012E'],['\\\\u\\ \\\\i','\u012D'],["\\\\lfloor",'\u230A'],["\\\\rfloor",'\u230B'],["\\\\invneg",'\u2310'],["\\\\niobar",'\u22FE'],["\\\\varnis",'\u22FB'],["\\\\invamp",'\u214B'],["\\\\inttop",'\u2320'],["\\\\isinvb",'\u22F8'],["\\\\langle",'\u2329'],["\\\\rangle",'\u232A'],["\\\\topbot",'\u2336'],["\\\\APLinv",'\u2339'],["\\\\MapsUp",'\u21A5'],["\\\\mapsto",'\u21A6'],["\\\\APLlog",'\u235F'],["\\\\=I|\\\\=\\{I\\}",'\u012A'],["\\\\daleth",'\u2138'],["\\\\sumtop",'\u23B2'],["\\\\~I|\\\\~\\{I\\}",'\u0128'],["\\\\diagup",'\u2571'],["\\\\square",'\u25A1'],["\\\\hslash",'\u210F'],["\\\\bumpeq",'\u224F'],["\\\\boxbar",'\u25EB'],["\\\\Square",'\u2610'],["\\\\danger",'\u2621'],["\\\\Bumpeq",'\u224E'],["\\\\ddddot",'\u20DC'],["\\\\smiley",'\u263A'],["\\\\eqless",'\u22DC'],["\\\\gtrdot",'\u22D7'],["\\\\k\\{e\\}",'\u0119'],["\\\\Exclam",'\u203C'],["\\\\k\\{E\\}",'\u0118'],["\\\\saturn",'\u2644'],['\\\\uranus','\u2645'],["\\\\taurus",'\u2649'],["\\\\gemini",'\u264A'],["\\\\cancer",'\u264B'],["\\\\pisces",'\u2653'],["\\\\Supset",'\u22D1'],["\\\\=e|\\\\=\\{e\\}",'\u0113'],["\\\\Subset",'\u22D0'],["\\\\diceii",'\u2681'],["\\\\=E|\\\\=\\{E\\}",'\u0112'],["\\\\diceiv",'\u2683'],["\\\\dicevi",'\u2685'],["\\\\anchor",'\u2693'],["\\\\swords",'\u2694'],["\\\\DJ|\\\\D\\{J\\}",'\u0110'],["\\\\neuter",'\u26B2'],["\\\\veedot",'\u27C7'],["\\\\rtimes",'\u22CA'],["\\\\ltimes",'\u22C9'],["\\\\bowtie",'\u22C8'],["\\\\bigbot",'\u27D8'],["\\\\cirbot",'\u27DF'],["\\\\delta",'\u03B4'],["\\\\image",'\u22B7'],["\\\\llarc",'\u25DF'],["\\\\simeq",'\u2243'],["\\\\eqdef",'\u225D'],["\\\\vBarv",'\u2AE9'],["\\\\ElzOr",'\u2A54'],["\\\\equiv",'\u2261'],["\\\\space",' '],["\\\\isins",'\u22F4'],["\\\\lnsim",'\u22E6'],["\\\\Elzxl",'\u0335'],["\\\\Theta",'\u0398'],["\\\\barin",'\u22F6'],["\\\\kappa",'\u03BA'],["\\\\lblot",'\u2989'],["\\\\rblot",'\u298A'],["\\\\frown",'\u2322'],["\\\\earth",'\u2641'],["\\\\Angle",'\u299C'],["\\\\Sqcup",'\u2A4F'],["\\\\Sqcap",'\u2A4E'],["\\\\nhpar",'\u2AF2'],["\\\\operp",'\u29B9'],["\\\\sigma",'\u03C3'],["\\\\csube",'\u2AD1'],["\\\\csupe",'\u2AD2'],["\\\\house",'\u2302'],["\\\\forks",'\u2ADC'],["\\\\Elzxh",'\u0127'],["\\\\strns",'\u23E4'],["\\\\eqgtr",'\u22DD'],["\\\\forkv",'\u2AD9'],["\\\\amalg",'\u2A3F'],["\\\\infty",'\u221E'],["\\\\VDash",'\u22AB'],["\\\\fltns",'\u23E5'],["\\\\disin",'\u22F2'],['\\\\uplus','\u228E'],["\\\\angle",'\u2220'],["\\\\pluto",'\u2647'],["\\\\Vdash",'\u22A9'],["\\\\cdots",'\u22EF'],["\\\\lceil",'\u2308'],["\\\\sqcap",'\u2293'],["\\\\smile",'\u2323'],["\\\\omega",'\u03C9'],["\\\\vdots",'\u22EE'],["\\\\arceq",'\u2258'],["\\\\dashv",'\u22A3'],["\\\\vdash",'\u22A2'],["\\\\skull",'\u2620'],["\\\\rceil",'\u2309'],["\\\\virgo",'\u264D'],["\\\\perps",'\u2AE1'],["\\\\zhide",'\u29F9'],["\\\\tplus",'\u29FE'],["\\\\ldots",'\u2026'],["\\\\zpipe",'\u2A20'],["\\\\dicei",'\u2680'],["\\\\venus",'\u2640'],["\\\\varpi",'\u03D6'],["\\\\Elzrh",'\u0322'],["\\\\Qoppa",'\u03D8'],["\\\\aries",'\u2648'],['\\\\upint','\u2A1B'],["\\\\dddot",'\u20DB'],["\\\\sqcup",'\u2294'],["\\\\qoppa",'\u03D9'],["\\\\Koppa",'\u03DE'],["\\\\awint",'\u2A11'],["\\\\koppa",'\u03DF'],["\\\\Colon",'\u2237'],["\\\\gescc",'\u2AA9'],["\\\\oplus",'\u2295'],["\\\\asymp",'\u224D'],["\\\\isinE",'\u22F9'],["\\\\Elzrl",'\u027C'],["\\\\Sampi",'\u03E0'],["\\\\sampi",'\u03E1'],["\\\\doteq",'\u2250'],["\\\\slash",'\u2215'],["\\\\gnsim",'\u22E7'],["\\\\libra",'\u264E'],["\\\\gsiml",'\u2A90'],["\\\\wedge",'\u2227'],["\\\\dbend",'\uFFFD'],["\\\\dashV",'\u2AE3'],["\\\\Dashv",'\u2AE4'],["\\\\DashV",'\u2AE5'],["\\\\Sigma",'\u03A3'],["\\\\lsimg",'\u2A8F'],["\\\\gsime",'\u2A8E'],["\\\\lsime",'\u2A8D'],["\\\\Equiv",'\u2263'],["\\\\dicev",'\u2684'],["\\\\Gamma",'\u0393'],["\\\\\\^\\\\j",'\u0135'],["\\\\gtcir",'\u2A7A'],["\\\\ltcir",'\u2A79'],["\\\\jmath",'\u0237'],['\\\\ularc','\u25DC'],["\\\\gneqq",'\u2269'],["\\\\gimel",'\u2137'],["\\\\lneqq",'\u2268'],["\\\\Omega",'\u03A9'],["\\\\Equal",'\u2A75'],["\\\\\\^\\\\i",'\xEE'],["\\\\aleph",'\u2135'],["\\\\nabla",'\u2207'],["\\\\lescc",'\u2AA8'],["\\\\simgE",'\u2AA0'],["\\\\sharp",'\u266F'],["\\\\imath",'\uD835\uDEA4'],["\\\\simlE",'\u2A9F'],["\\\\Delta",'\u0394'],['\\\\urarc','\u25DD'],["\\\\alpha",'\u03B1'],["\\\\gamma",'\u03B3'],["\\\\eqdot",'\u2A66'],["\\\\Euler",'\u2107'],["\\\\lrarc",'\u25DE'],["\\\\late",'\u2AAD'],["\\\\v\\ d",'\u010F'],["\\\\hash",'\u22D5'],["\\\\circ",'\u2218'],["\\\\Game",'\u2141'],["\\\\surd",'\u221A'],["\\\\v\\ D",'\u010E'],["\\\\Lbag",'\u27C5'],["\\\\beth",'\u2136'],["\\\\lnot",'\xAC'],["\\\\Finv",'\u2132'],["\\\\~\\\\i",'\u0129'],["\\\\csub",'\u2ACF'],["\\\\csup",'\u2AD0'],["\\\\succ",'\u227B'],["\\\\prec",'\u227A'],["\\\\Vert",'\u2016'],["\\\\nmid",'\u2224'],["\\\\c\\ C",'\xC7'],["\\\\c\\ g",'\u0123'],["\\\\c\\ G",'\u0122'],["\\\\not<",'\u226E'],["\\\\dlsh",'\u21B2'],["\\\\Barv",'\u2AE7'],["\\\\cdot",'\xB7'],["\\\\vBar",'\u2AE8'],["\\\\lang",'\u27EA'],["\\\\rang",'\u27EB'],["\\\\Zbar",'\u01B5'],["\\\\star",'\u22C6'],["\\\\psur",'\u2900'],["\\\\v\\ z",'\u017E'],["\\\\v\\ Z",'\u017D'],["\\\\pinj",'\u2914'],["\\\\finj",'\u2915'],["\\\\bNot",'\u2AED'],['\\\\u\\ e','\u0115'],['\\\\u\\ g','\u011F'],["\\\\spot",'\u2981'],["\\\\H\\ u",'\u0171'],['\\\\u\\ a','\u0103'],["\\\\limg",'\u2987'],["\\\\rimg",'\u2988'],["\\\\H\\ U",'\u0170'],['\\\\u\\ A','\u0102'],["\\\\obot",'\u29BA'],['\\\\u\\ u','\u016D'],['\\\\u\\ U','\u016C'],["\\\\cirE",'\u29C3'],['\\\\u\\ G','\u011E'],["\\\\XBox",'\u2612'],["\\\\v\\ t",'\u0165'],["\\\\v\\ T",'\u0164'],["\\\\c\\ t",'\u0163'],["\\\\c\\ T",'\u0162'],["\\\\v\\ s",'\u0161'],["\\\\v\\ S",'\u0160'],["\\\\perp",'\u22A5'],["\\\\c\\ s",'\u015F'],["\\\\c\\ S",'\u015E'],["\\\\leqq",'\u2266'],["\\\\dsol",'\u29F6'],["\\\\Rbag",'\u27C6'],["\\\\xsol",'\u29F8'],["\\\\v\\ C",'\u010C'],["\\\\v\\ r",'\u0159'],["\\\\odot",'\u2299'],["\\\\v\\ R",'\u0158'],["\\\\c\\ r",'\u0157'],["\\\\c\\ R",'\u0156'],["\\\\flat",'\u266D'],["\\\\LVec",'\u20D6'],["\\\\H\\ o",'\u0151'],["\\\\H\\ O",'\u0150'],['\\\\u\\ o','\u014F'],['\\\\u\\ O','\u014E'],["\\\\intx",'\u2A18'],["\\\\lvec",'\u20D0'],["\\\\Join",'\u2A1D'],["\\\\zcmp",'\u2A1F'],["\\\\pfun",'\u21F8'],["\\\\cong",'\u2245'],["\\\\smte",'\u2AAC'],["\\\\v\\ N",'\u0147'],["\\\\ffun",'\u21FB'],["\\\\c\\ n",'\u0146'],["\\\\c\\ N",'\u0145'],['\\\\u\\ E','\u0114'],["\\\\odiv",'\u2A38'],["\\\\fcmp",'\u2A3E'],["\\\\mlcp",'\u2ADB'],["\\\\v\\ l",'\u013E'],["\\\\v\\ L",'\u013D'],["\\\\c\\ l",'\u013C'],["\\\\c\\ L",'\u013B'],["\\\\\"\\\\i",'\xEF'],["\\\\v\\ e",'\u011B'],["\\\\ElOr",'\u2A56'],["\\\\dsub",'\u2A64'],["\\\\rsub",'\u2A65'],["\\\\oint",'\u222E'],["\\\\'\\\\i",'\xED'],["\\\\`\\\\i",'\xEC'],["\\\\c\\ k",'\u0137'],["\\\\Same",'\u2A76'],["\\\\c\\ K",'\u0136'],["\\\\geqq",'\u2267'],["\\\\c\\ c",'\xE7'],["\\\\prod",'\u220F'],["\\\\v\\ E",'\u011A'],["\\\\lneq",'\u2A87'],["\\\\gneq",'\u2A88'],['\\\\upin','\u27D2'],['\\\\u\\ I','\u012C'],["\\\\not>",'\u226F'],["_\\\\ast",'\u2217'],["\\\\iota",'\u03B9'],["\\\\zeta",'\u03B6'],["\\\\beta",'\u03B2'],["\\\\male",'\u2642'],["\\\\nisd",'\u22FA'],["\\\\quad",'\u2001'],["\\\\v\\ c",'\u010D'],["\\\\v\\ n",'\u0148'],["\\\\glj",'\u2AA4'],["\\\\int",'\u222B'],["\\\\cup",'\u222A'],["\\\\QED",'\u220E'],["\\\\cap",'\u2229'],["\\\\gla",'\u2AA5'],["\\\\Psi",'\u03A8'],["\\\\Phi",'\u03A6'],["\\\\sum",'\u2211'],["\\\\Rsh",'\u21B1'],["\\\\vee",'\u2228'],["\\\\Lsh",'\u21B0'],["\\\\sim",'\u223C'],["\\\\lhd",'\u25C1'],["\\\\LHD",'\u25C0'],["\\\\rhd",'\u25B7'],["\\\\phi",'\u03D5'],["\\\\lgE",'\u2A91'],["\\\\glE",'\u2A92'],["\\\\RHD",'\u25B6'],["\\\\cat",'\u2040'],["\\\\Yup",'\u2144'],["\\\\vec",'\u20D1'],["\\\\div",'\xF7'],["\\\\mid",'\u2223'],["\\\\mho",'\u2127'],["\\\\psi",'\u03C8'],["\\\\chi",'\u03C7'],["\\\\top",'\u22A4'],["\\\\Not",'\u2AEC'],["\\\\tau",'\u03C4'],["\\\\smt",'\u2AAA'],["\\\\rho",'\u03C1'],["\\\\sun",'\u263C'],["\\\\Cap",'\u22D2'],["\\\\lat",'\u2AAB'],["\\\\leo",'\u264C'],["\\\\Sun",'\u2609'],["\\\\Cup",'\u22D3'],["\\\\eta",'\u03B7'],["\\\\Top",'\u2AEA'],["\\\\bij",'\u2916'],["\\\\eth",'\u01AA'],["\\\\geq",'\u2265'],["\\\\nis",'\u22FC'],["\\\\leq",'\u2264'],["\\\\ll",'\u226A'],["\\\\dj",'\u0111'],["\\\\in",'\u2208'],["\\\\\\-",'\xAD'],["\\\\\\^",'^'],["\\\\th",'\xFE'],["\\\\wp",'\u2118'],["\\\\aa",'\xE5'],["\\\\ss",'\xDF'],["\\\\\\#",'#'],["\\\\ae",'\xE6'],["\\\\ng",'\u014B'],["\\\\mu",'\u03BC'],["''''",'\u2057'],["\\\\pi",'\u03C0'],["\\\\gg",'\u226B'],["\\\\xi",'\u03BE'],["\\\\ni",'\u220B'],["\\\\nu",'\u03BD'],["\\\\pm",'\xB1'],["\\\\mp",'\u2213'],["\\\\wr",'\u2240'],["\\\\\\.",'\u0307'],["\\\\dh",'\xF0'],["\\\\oe",'\u0153'],['\\\\u','\u0306'],["\\\\L",'\u0141'],["\\\\c",'\xB8'],["\\\\i",'\u0131'],["\\\\k",'\u02DB'],["\\\\H",'\u02DD'],["\\\\\"",'\u0308'],["\\\\v",'\u030C'],["\\\\o",'\xF8'],["\\\\`",'\u0300'],["\\\\'",'\u0301'],["\\\\&",'&'],["\\\\~",'\u0303'],["\\\\r",'\u02DA'],["\\\\O",'\xD8'],["\\\\=",'\u0304'],["\\\\_",'_'],["\\\\%",'%'],["\\\\l",'\u0142'],["'''",'\u2034'],["~",'\xA0']];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LATEX_COMMANDS = [['\\textbf{', 'strong'], ['\\mkbibbold{', 'strong'], ['\\mkbibitalic{', 'em'], ['\\mkbibemph{', 'em'], ['\\textit{', 'em'], ['\\emph{', 'em'], ['\\textsc{', 'smallcaps'], ['\\enquote{', 'enquote'], ['\\textsubscript{', 'sub'], ['\\textsuperscript{', 'sup']];

var LATEX_SPECIAL_CHARS = ['&', '%', '$', '#', '_', '{', '}', ',', '~', '^', '\''];

var BibLatexLiteralParser = exports.BibLatexLiteralParser = function () {
    function BibLatexLiteralParser(string) {
        _classCallCheck(this, BibLatexLiteralParser);

        this.string = string;
        this.braceLevel = 0;
        this.slen = string.length;
        this.si = 0; // string index
        this.json = [];
        this.braceClosings = [];
        this.currentMarks = [];
        this.inCasePreserve = false;
        this.textNode = false;
    }

    _createClass(BibLatexLiteralParser, [{
        key: 'checkAndAddNewTextNode',
        value: function checkAndAddNewTextNode() {
            if (this.textNode.text.length > 0) {
                // We have text in the last node already,
                // so we need to start a new text node.
                this.addNewTextNode();
            }
        }
    }, {
        key: 'addNewTextNode',
        value: function addNewTextNode() {
            this.textNode = { type: 'text', text: '' };
            this.json.push(this.textNode);
        }
    }, {
        key: 'stringParser',
        value: function stringParser() {
            this.addNewTextNode();

            parseString: while (this.si < this.slen) {
                switch (this.string[this.si]) {
                    case '\\':
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = LATEX_COMMANDS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var command = _step.value;

                                if (this.string.substring(this.si, this.si + command[0].length) === command[0]) {
                                    this.braceLevel++;
                                    this.si += command[0].length;
                                    this.checkAndAddNewTextNode();
                                    // If immediately inside a brace that added case protection, remove case protection. See
                                    // http://tex.stackexchange.com/questions/276943/biblatex-how-to-emphasize-but-not-caps-protect
                                    if (this.inCasePreserve === this.braceLevel - 1 && this.string[this.si - 1] === '{' && this.currentMarks[this.currentMarks.length - 1].type === 'nocase') {
                                        this.currentMarks.pop();
                                        this.inCasePreserve = false;
                                    } else {
                                        // Of not immediately inside a brace, any styling also
                                        // adds case protection.
                                        this.currentMarks.push({ type: 'nocase' });
                                        this.inCasePreserve = this.braceLevel;
                                    }
                                    this.currentMarks.push({ type: command[1] });
                                    this.textNode.marks = this.currentMarks.slice();
                                    this.braceClosings.push(true);
                                    continue parseString;
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        if (LATEX_SPECIAL_CHARS.includes(this.string[this.si + 1])) {
                            this.textNode.text += this.string[this.si + 1];
                            this.si += 2;
                        } else {
                            // We don't know the command and skip it.
                            this.si++;
                            while (this.si < this.slen && this.string[this.si].match("[a-zA-Z0-9]")) {
                                this.si++;
                            }
                            // If there is a brace at the end of the command,
                            // increase brace level but ignore brace.
                            if (this.string[this.si] === "{") {
                                this.braceLevel++;
                                this.braceClosings.push(false);
                                this.si++;
                            }
                        }
                        break;
                    case '_':
                        switch (this.string[this.si + 1]) {
                            case '{':
                                this.checkAndAddNewTextNode();
                                this.braceLevel++;
                                this.si += 2;
                                this.currentMarks.push({ type: 'sub' });
                                this.textNode.marks = this.currentMarks.slice();
                                this.braceClosings.push(true);
                                break;
                            case '\\':
                                // There is a command following directly. Ignore the sub symbol.
                                this.si++;
                                break;
                            default:
                                // We only add the next character to a sub node.
                                this.checkAndAddNewTextNode();
                                this.textNode.marks = this.currentMarks.slice();
                                this.textNode.marks.push({ type: 'sub' });
                                this.textNode.text = this.string[this.si + 1];
                                this.addNewTextNode();
                                this.si += 2;
                        }
                        break;
                    case '^':
                        switch (this.string[this.si + 1]) {
                            case '{':
                                this.checkAndAddNewTextNode();
                                this.braceLevel++;
                                this.si += 2;
                                this.currentMarks.push({ type: 'sup' });
                                this.textNode.marks = this.currentMarks.slice();
                                this.braceClosings.push(true);
                                break;
                            case '\\':
                                // There is a command following directly. Ignore the sup symbol.
                                this.si++;
                                break;
                            default:
                                // We only add the next character to a sup node.
                                this.checkAndAddNewTextNode();
                                this.textNode.marks = this.currentMarks.slice();
                                this.textNode.marks.push({ type: 'sup' });
                                this.textNode.text = this.string[this.si + 1];
                                this.addNewTextNode();
                                this.si += 2;
                        }
                        break;
                    case '{':
                        this.braceLevel++;
                        if (this.inCasePreserve) {
                            // If already inside case preservation, do not add a second
                            this.braceClosings.push(false);
                        } else {
                            this.inCasePreserve = this.braceLevel;
                            this.checkAndAddNewTextNode();
                            this.currentMarks.push({ type: 'nocase' });
                            this.textNode.marks = this.currentMarks.slice();
                            this.braceClosings.push(true);
                        }
                        this.si++;
                        break;
                    case '}':
                        this.braceLevel--;
                        if (this.braceLevel > -1) {
                            var closeBrace = this.braceClosings.pop();
                            if (closeBrace) {
                                this.checkAndAddNewTextNode();
                                var lastMark = this.currentMarks.pop();
                                if (this.inCasePreserve === this.braceLevel + 1) {
                                    this.inCasePreserve = false;
                                    // The last tag may have added more tags. The
                                    // lowest level will be the case preserving one.
                                    while (lastMark.type !== 'nocase' && this.currentMarks.length) {
                                        lastMark = this.currentMarks.pop();
                                    }
                                }
                                if (this.currentMarks.length) {
                                    this.textNode.marks = this.currentMarks.slice();
                                }
                            }
                            this.si++;
                            continue parseString;
                        } else {
                            // A brace was closed before it was opened. Abort and return the original string.
                            return [{ type: 'text', text: this.string }];
                        }
                        break;
                    case '$':
                        // math env, just remove
                        this.si++;
                        break;
                    default:
                        this.textNode.text += this.string[this.si];
                        this.si++;
                }
            }

            if (this.braceLevel > 0) {
                // Too many opening braces, we return the original string.
                return [{ type: 'text', text: this.string }];
            }

            // If the very last text node has no content, remove it.
            if (this.json[this.json.length - 1].text.length === 0) {
                this.json.pop();
            }
            // Braces were accurate.
            return this.json;
        }
    }, {
        key: 'output',
        get: function get() {
            var openBraces = (this.string.match(/\{/g) || []).length,
                closeBraces = (this.string.match(/\}/g) || []).length;
            if (openBraces != closeBraces) {
                // There are different amount of open and close braces, so we return the original string.
                return [{ type: 'text', text: this.string }];
            } else {
                // There are the same amount of open and close braces, but we don't
                // know if they are in the right order.
                return this.stringParser();
            }
        }
    }]);

    return BibLatexLiteralParser;
}();

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BibLatexNameParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _literalParser = require('./literal-parser');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BibLatexNameParser = exports.BibLatexNameParser = function () {
    function BibLatexNameParser(nameString) {
        _classCallCheck(this, BibLatexNameParser);

        this.nameString = nameString;
        this.nameDict = {};
        this._first = [];
        this._last = [];
    }

    _createClass(BibLatexNameParser, [{
        key: 'splitTexString',
        value: function splitTexString(string) {
            var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (sep === null) {
                sep = '[\\s~]+';
            }
            var braceLevel = 0;
            var nameStart = 0;
            var result = [];
            var stringLen = string.length;
            var pos = 0;
            while (pos < stringLen) {
                var char = string.charAt(pos);
                if (char === '{') {
                    braceLevel += 1;
                } else if (char === '}') {
                    braceLevel -= 1;
                } else if (braceLevel === 0 && pos > 0) {
                    var match = string.slice(pos).match(RegExp('^' + sep));
                    if (match) {
                        var sepLen = match[0].length;
                        if (pos + sepLen < stringLen) {
                            result.push(string.slice(nameStart, pos));
                            nameStart = pos + sepLen;
                        }
                    }
                }
                pos++;
            }
            if (nameStart < stringLen) {
                result.push(string.slice(nameStart));
            }
            return result;
        }
    }, {
        key: 'processFirstMiddle',
        value: function processFirstMiddle(parts) {
            this._first = this._first.concat(parts);
            this.nameDict['given'] = this._reformLiteral(this._first.join(' '));
        }
    }, {
        key: 'processVonLast',
        value: function processVonLast(parts) {
            var lineage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var rSplit = this.rsplitAt(parts);
            var von = rSplit[0];
            var last = rSplit[1];
            if (von && !last) {
                last.push(von.pop());
            }
            this._last = this._last.concat(von);
            this._last = this._last.concat(last);
            this._last = this._last.concat(lineage);
            this.nameDict['family'] = this._reformLiteral(this._last.join(' '));
        }
    }, {
        key: 'findFirstLowerCaseWord',
        value: function findFirstLowerCaseWord(lst) {
            // return index of first lowercase word in lst. Else return length of lst.
            for (var i = 0; i < lst.length; i++) {
                var word = lst[i];
                if (word === word.toLowerCase()) {
                    return i;
                }
            }
            return lst.length;
        }
    }, {
        key: 'splitAt',
        value: function splitAt(lst) {
            // Split the given list into two parts.
            // The second part starts with the first lowercase word.
            var pos = this.findFirstLowerCaseWord(lst);
            return [lst.slice(0, pos), lst.slice(pos)];
        }
    }, {
        key: 'rsplitAt',
        value: function rsplitAt(lst) {
            var rpos = this.findFirstLowerCaseWord(lst.slice().reverse());
            var pos = lst.length - rpos;
            return [lst.slice(0, pos), lst.slice(pos)];
        }
    }, {
        key: '_reformLiteral',
        value: function _reformLiteral(litString) {
            var parser = new _literalParser.BibLatexLiteralParser(litString);
            return parser.output;
        }
    }, {
        key: 'output',
        get: function get() {
            var parts = this.splitTexString(this.nameString, ',');
            if (parts.length === 3) {
                // von Last, Jr, First
                this.processVonLast(this.splitTexString(parts[0]), this.splitTexString(parts[1]));
                this.processFirstMiddle(this.splitTexString(parts[2]));
            } else if (parts.length === 2) {
                // von Last, First
                this.processVonLast(this.splitTexString(parts[0]));
                this.processFirstMiddle(this.splitTexString(parts[1]));
            } else if (parts.length === 1) {
                // First von Last
                var spacedParts = this.splitTexString(this.nameString);
                if (spacedParts.length === 1) {
                    this.nameDict['literal'] = this._reformLiteral(spacedParts[0]);
                } else {
                    var split = this.splitAt(spacedParts);
                    var firstMiddle = split[0];
                    var vonLast = split[1];
                    if (vonLast.length === 0 && firstMiddle.length > 1) {
                        var last = firstMiddle.pop();
                        vonLast.push(last);
                    }
                    this.processFirstMiddle(firstMiddle);
                    this.processVonLast(vonLast);
                }
            } else {
                this.nameDict['literal'] = this._reformLiteral(this.nameString);
            }
            return this.nameDict;
        }
    }]);

    return BibLatexNameParser;
}();

},{"./literal-parser":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.splitTeXString = splitTeXString;
// split at each occurence of splitToken, but only if no braces are currently open.
function splitTeXString(texString) {
    var splitToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'and';

    var output = [];
    var tokenRe = /([^\s{}]+|\s|{|})/g;
    var j = 0;
    var k = 0;
    var item = void 0;
    while ((item = tokenRe.exec(texString)) !== null) {
        var token = item[0];
        if (k === output.length) {
            output.push('');
        }
        if ('{' === token) {
            j += 1;
        }
        if ('}' === token) {
            j -= 1;
        }
        if (splitToken === token && 0 === j) {
            k += 1;
        } else {
            output[k] += token;
        }
    }
    return output;
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _biblatex = require("./import/biblatex");

Object.defineProperty(exports, "BibLatexParser", {
  enumerable: true,
  get: function get() {
    return _biblatex.BibLatexParser;
  }
});

var _biblatex2 = require("./export/biblatex");

Object.defineProperty(exports, "BibLatexExporter", {
  enumerable: true,
  get: function get() {
    return _biblatex2.BibLatexExporter;
  }
});

var _csl = require("./export/csl");

Object.defineProperty(exports, "CSLExporter", {
  enumerable: true,
  get: function get() {
    return _csl.CSLExporter;
  }
});

var _const = require("./const");

Object.defineProperty(exports, "BibFieldTypes", {
  enumerable: true,
  get: function get() {
    return _const.BibFieldTypes;
  }
});
Object.defineProperty(exports, "BibTypes", {
  enumerable: true,
  get: function get() {
    return _const.BibTypes;
  }
});

},{"./const":2,"./export/biblatex":3,"./export/csl":5,"./import/biblatex":6}]},{},[1]);
