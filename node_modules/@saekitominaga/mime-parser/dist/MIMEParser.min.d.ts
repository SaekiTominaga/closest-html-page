/**
 * MIME Parser
 */
export default class {
    #private;
    /**
     * @param {string} inputMime - MIME type value
     */
    constructor(inputMime: string);
    /**
     * Get the entire serialized MIME type string. <https://mimesniff.spec.whatwg.org/#serializing-a-mime-type>
     *
     * @returns {string} MIME type (e.g. 'text/html;charset=utf-8')
     */
    toString(): string;
    /**
     * Get the `type` part of MIME
     *
     * @returns {string} type (e.g. 'text')
     */
    getType(): string;
    /**
     * Get the `subtype` part of MIME
     *
     * @returns {string} subtype (e.g. 'html')
     */
    getSubtype(): string;
    /**
     * Get the `essence` part (`type`/`subtype`) of MIME
     *
     * @returns {string} essence (e.g. 'text/html')
     */
    getEssence(): string;
    /**
     * Get the `parameters` part of MIME
     *
     * @returns {Map} parameters (e.g. Map(1) { 'charset' => 'utf-8' })
     */
    getParameters(): Map<string, string>;
    /**
     * 文字列が HTTP token code point <https://mimesniff.spec.whatwg.org/#http-token-code-point> のみで構成されているか
     *
     * @param {string} value - 調査する文字列
     *
     * @returns {boolean} HTTP token code point のみで構成されていれば true
     */
    private _solelyContainHTTPTokenCodePoints;
    /**
     * 文字列が HTTP quoted-string token code point <https://mimesniff.spec.whatwg.org/#http-quoted-string-token-code-point> のみで構成されているか
     *
     * @param {string} value - 調査する文字列
     *
     * @returns {boolean} HTTP quoted-string token code point のみで構成されていれば true
     */
    private _solelyContainHTTPQuotedStringTokenCodePoints;
    /**
     * HTTP quoted string <https://fetch.spec.whatwg.org/#collect-an-http-quoted-string> を収集する
     *
     * @param {string} input - 調査する文字列
     *
     * @returns {string} HTTP quoted string
     */
    private _collectHTTPQuotedString;
}
//# sourceMappingURL=MIMEParser.d.ts.map