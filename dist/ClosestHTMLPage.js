var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _mimeTypes, _maxFetchCount, _fetchedResponses, _url, _title;
import MIMEParser from '../../mime-parser/dist/MIMEParser.js';
/**
 * Get the data of the HTML page of the nearest ancestor hierarchy.
 */
export default class {
    /**
     * @param {string[]} mimeTypes - MIME of the HTML resource to retrieve.
     * @param {number} maxFetchCount - If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (0 = ∞).
     */
    constructor(mimeTypes = ['text/html', 'application/xhtml+xml'], maxFetchCount = 0) {
        _mimeTypes.set(this, void 0); // 取得するリソースの MIME
        _maxFetchCount.set(this, void 0); // fetch() の最大試行回数
        _fetchedResponses.set(this, new Set()); // fetch() した Response 情報
        /* もっとも近い祖先階層の HTML ページのデータ */
        _url.set(this, null); // URL
        _title.set(this, null); // タイトル
        __classPrivateFieldSet(this, _mimeTypes, mimeTypes);
        if (!Number.isInteger(maxFetchCount)) {
            throw new TypeError('Argument `maxFetchCount` must be an integer.');
        }
        if (maxFetchCount < 0) {
            throw new RangeError('Argument `maxFetchCount` must be greater than or equal to 0.');
        }
        __classPrivateFieldSet(this, _maxFetchCount, maxFetchCount);
    }
    /**
     * Traverse the ancestor hierarchy in order from the base URL and retrieve the data of resources that match the specified condition (MIME).
     *
     * @param {string} baseUrl - Base URL
     */
    async fetch(baseUrl = location.toString()) {
        let url = new URL(baseUrl);
        while (url.pathname !== '/' && (__classPrivateFieldGet(this, _maxFetchCount) === 0 || __classPrivateFieldGet(this, _maxFetchCount) > __classPrivateFieldGet(this, _fetchedResponses).size)) {
            url = this._getParentPage(url);
            const response = await fetch(`${url.origin}${url.pathname}`);
            __classPrivateFieldGet(this, _fetchedResponses).add(response);
            console.info(`【Fetch API】${response.url} [${response.status} ${response.statusText}]`);
            if (!response.ok) {
                continue;
            }
            const mimeType = response.headers.get('content-type');
            if (mimeType === null) {
                throw new Error(`Missing "Content-Type" in response header for URL <${response.url}>`);
            }
            /* MIME からパラメーターを除去（e.g 'text/html; charset=utf-8' → 'text/html'） */
            const mimeEssence = new MIMEParser(mimeType).getEssence();
            if (!__classPrivateFieldGet(this, _mimeTypes).includes(mimeEssence)) {
                /* 指定された MIME にマッチしない場合 */
                continue;
            }
            /* 諸条件を満たした場合 */
            __classPrivateFieldSet(this, _url, response.url);
            const doc = new DOMParser().parseFromString(await response.text(), mimeEssence);
            const ogpTitleText = doc.querySelector('meta[property="og:title"]')?.content;
            if (ogpTitleText !== undefined) {
                /* OGP でタイトルが指定されている場合はそこからタイトルを取得 */
                __classPrivateFieldSet(this, _title, ogpTitleText);
            }
            else {
                /* OGP でタイトルが指定されていない場合は <title> 要素からタイトルを取得 */
                const titleElementText = doc.querySelector('title')?.textContent;
                if (titleElementText !== null && titleElementText !== undefined) {
                    __classPrivateFieldSet(this, _title, titleElementText);
                }
            }
            break;
        }
    }
    /**
     * Get the `Response` data resulting from the execution of `fetch()`.
     *
     * @returns {Set<Response>} `Response` datas
     */
    getFetchedResponses() {
        return __classPrivateFieldGet(this, _fetchedResponses);
    }
    /**
     * Get the URL of the HTML page of the nearest ancestor hierarchy.
     *
     * @returns {string | null} URL
     */
    getUrl() {
        return __classPrivateFieldGet(this, _url);
    }
    /**
     * Get the title of the HTML page of the nearest ancestor hierarchy.
     *
     * @returns {string | null} Title
     */
    getTitle() {
        return __classPrivateFieldGet(this, _title);
    }
    /**
     * 親ページの URL オブジェクトを取得する（e.g. https://example.com/foo/bar/ → https://example.com/foo/ ）
     *
     * @param {URL} url - URL
     *
     * @returns {URL} 親ページ（親ページが存在しない場合は自分自身）
     */
    _getParentPage(url) {
        return new URL(url.pathname.endsWith('/') ? '../' : './', url);
    }
}
_mimeTypes = new WeakMap(), _maxFetchCount = new WeakMap(), _fetchedResponses = new WeakMap(), _url = new WeakMap(), _title = new WeakMap();
//# sourceMappingURL=ClosestHTMLPage.js.map