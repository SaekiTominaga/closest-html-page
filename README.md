# Get the data of the HTML page of the nearest ancestor hierarchy

[![npm version](https://badge.fury.io/js/%40saekitominaga%2Fclosest-html-page.svg)](https://badge.fury.io/js/%40saekitominaga%2Fclosest-html-page)

## Demo

- [Demo page](https://saekitominaga.github.io/closest-html-page/demo.html)

## Examples

```JavaScript
import ClosestHTMLPage from './dist/ClosestHTMLPage.js';

const closestHTMLPage = new ClosestHTMLPage(['text/html'], 3);

(async () => {
  await closestHTMLPage.fetch('https://example.com/path/to/file');

  const url = closestHTMLPage.getUrl();
  const title = closestHTMLPage.getTitle();
})();
```

## Constructor

```TypeScript
new ClosestHTMLPage(
  mimeTypes: DOMParserSupportedType[] = ['text/html', 'application/xhtml+xml'],
  maxFetchCount = 0
)
```

### Parameters

<dl>
<dt>mimeTypes [optional]</dt>
<dd>MIME of the HTML resource to retrieve. The values that can be specified are limited to 'text/html', 'text/xml', 'application/xml', 'application/xhtml+xml', and 'image/svg+xml'. The default value is ['text/html', 'application/xhtml+xml'].</dd>
<dt>maxFetchCount [optional]</dt>
<dd>If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (0 = ∞). The default value is 0.</dd>
</dl>

## Methods

| Name | Returns | Description |
|-|-|-|
| getFetchedResponses() | {Set<Response>} | Get the `Response` data resulting from the execution of `fetch()`. |
| getUrl() | {string \| null} | Get the URL of the HTML page of the nearest ancestor hierarchy. |
| getTitle() | {string \| null} | Get the title of the HTML page of the nearest ancestor hierarchy. |
