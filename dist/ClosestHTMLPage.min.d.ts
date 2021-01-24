/**
 * Get the data of the HTML page of the nearest ancestor hierarchy.
 */
export default class {
    #private;
    /**
     * @param {string[]} mimeTypes - MIME of the HTML resource to retrieve.
     * @param {number} maxFetchCount - If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (0 = ∞).
     */
    constructor(mimeTypes?: DOMParserSupportedType[], maxFetchCount?: number);
    /**
     * Traverse the ancestor hierarchy in order from the base URL and retrieve the data of resources that match the specified condition (MIME).
     *
     * @param {string} baseUrl - Base URL
     */
    fetch(baseUrl?: string): Promise<void>;
    /**
     * Get the `Response` data resulting from the execution of `fetch()`.
     *
     * @returns {Set<Response>} `Response` datas
     */
    getFetchedResponses(): Set<Response>;
    /**
     * Get the URL of the HTML page of the nearest ancestor hierarchy.
     *
     * @returns {string | null} URL
     */
    getUrl(): string | null;
    /**
     * Get the title of the HTML page of the nearest ancestor hierarchy.
     *
     * @returns {string | null} Title
     */
    getTitle(): string | null;
    /**
     * 親ページの URL オブジェクトを取得する（e.g. https://example.com/foo/bar/ → https://example.com/foo/ ）
     *
     * @param {URL} url - URL
     *
     * @returns {URL} 親ページ（親ページが存在しない場合は自分自身）
     */
    private _getParentPage;
}
//# sourceMappingURL=ClosestHTMLPage.d.ts.map