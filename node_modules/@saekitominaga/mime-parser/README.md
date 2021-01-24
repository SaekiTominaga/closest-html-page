# Parsing a MIME type

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fmime-parser.svg)](https://badge.fury.io/js/%40saekitominaga%2Fmime-parser)

## Examples

```JavaScript
import MIMEParser from '@saekitominaga/mime-parser';

const mimeParser = new MIMEParser('Text/HTML; Charset=utf-8');
mimeParser.toString(); // 'text/html;charset=utf-8'
mimeParser.getType(); // 'text'
mimeParser.getSubtype(); // 'html'
mimeParser.getEssence(); // 'text/html'
mimeParser.getParameters(); // Map(1) { 'charset' => 'utf-8' }
```

## Constructor

```TypeScript
new MIMEParser(inputMime: string)
```

### Parameters

<dl>
<dt>inputMime</dt>
<dd>MIME type value</dd>
</dl>

## Methods

| Name | Returns | Description |
|-|-|-|
| toString() | {string} MIME type | Get the entire serialized [MIME type](https://mimesniff.spec.whatwg.org/#mime-type) string. |
| getType() | {string} type | Get the [type](https://mimesniff.spec.whatwg.org/#type) part of MIME |
| getSubtype() | {string} subtype | Get the [subtype](https://mimesniff.spec.whatwg.org/#subtype) part of MIME |
| getEssence() | {string} essence | Get the [essence](https://mimesniff.spec.whatwg.org/#mime-type-essence) part (type/subtype) of MIME |
| getParameters() | {Map<string, string>} parameters | Get the [parameters](https://mimesniff.spec.whatwg.org/#parameters) part of MIME |
