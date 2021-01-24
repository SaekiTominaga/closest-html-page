var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _SEPARATOR_TYPE_SUBTYPE, _SEPARATOR_PARAMETERS, _SEPARATOR_PARAMETERS_KEY_VALUE, _type, _subtype, _parameters;
/**
 * MIME Parser
 */
export default class {
    /**
     * @param {string} inputMime - MIME type value
     */
    constructor(inputMime) {
        _SEPARATOR_TYPE_SUBTYPE.set(this, '/'); // `type` と `subtype` の区切り子
        _SEPARATOR_PARAMETERS.set(this, ';'); // パラメーラーの区切り子
        _SEPARATOR_PARAMETERS_KEY_VALUE.set(this, '='); // パラメーラーのキーと値の区切り子
        _type.set(this, void 0);
        _subtype.set(this, void 0);
        _parameters.set(this, void 0);
        const inputMimeTrim = inputMime.trim();
        const typeEndPosition = inputMimeTrim.indexOf(__classPrivateFieldGet(this, _SEPARATOR_TYPE_SUBTYPE));
        if (typeEndPosition === -1) {
            throw new Error('The specified string does not contain a slash.');
        }
        const type = inputMimeTrim.substring(0, typeEndPosition);
        if (type === '') {
            throw new Error('The `type` is the empty string.');
        }
        else if (!this._solelyContainHTTPTokenCodePoints(type)) {
            throw new Error('The `type` contains an invalid string.');
        }
        const subtypeStartPosition = typeEndPosition + 1;
        const subtypeEndPosition = inputMimeTrim.indexOf(__classPrivateFieldGet(this, _SEPARATOR_PARAMETERS));
        const existParameters = subtypeEndPosition !== -1;
        const subtype = existParameters ? inputMimeTrim.substring(subtypeStartPosition, subtypeEndPosition).trimEnd() : inputMimeTrim.substring(subtypeStartPosition);
        if (subtype === '') {
            throw new Error('The `subtype` is the empty string.');
        }
        else if (!this._solelyContainHTTPTokenCodePoints(subtype)) {
            throw new Error('The `subtype` contains an invalid string.');
        }
        const parametersMap = new Map();
        if (existParameters) {
            const parametersStartPosition = subtypeEndPosition + 1;
            const parameters = inputMimeTrim.substring(parametersStartPosition);
            for (const parameter of parameters.split(__classPrivateFieldGet(this, _SEPARATOR_PARAMETERS)).map((parameter) => parameter.trim())) {
                const parameterNameEndPosition = parameter.indexOf(__classPrivateFieldGet(this, _SEPARATOR_PARAMETERS_KEY_VALUE));
                if (parameterNameEndPosition === -1) {
                    /* パラメーターにキーと値の区切り文字がない場合 */
                    continue;
                }
                const parameterValueStartPosition = parameterNameEndPosition + 1;
                const parameterName = parameter.substring(0, parameterNameEndPosition).toLowerCase();
                let parameterValue = parameter.substring(parameterValueStartPosition);
                if (parameterValue.startsWith('"')) {
                    parameterValue = this._collectHTTPQuotedString(parameterValue);
                }
                else {
                    if (parameterValue === '') {
                        continue;
                    }
                }
                if (parameterName !== '' &&
                    this._solelyContainHTTPTokenCodePoints(parameterName) &&
                    this._solelyContainHTTPQuotedStringTokenCodePoints(parameterValue) &&
                    !parametersMap.has(parameterName)) {
                    parametersMap.set(parameterName, parameterValue);
                }
            }
        }
        __classPrivateFieldSet(this, _type, type.toLowerCase());
        __classPrivateFieldSet(this, _subtype, subtype.toLowerCase());
        __classPrivateFieldSet(this, _parameters, parametersMap);
    }
    /**
     * Get the entire serialized MIME type string. <https://mimesniff.spec.whatwg.org/#serializing-a-mime-type>
     *
     * @returns {string} MIME type (e.g. 'text/html;charset=utf-8')
     */
    toString() {
        let serialization = this.getEssence();
        for (const [parameterName, parameterValue] of __classPrivateFieldGet(this, _parameters)) {
            serialization += `;${parameterName}=`;
            if (parameterValue === '' || !this._solelyContainHTTPTokenCodePoints(parameterValue)) {
                serialization += `"${parameterValue.replace(/(["\\])/g, '\\$&')}"`;
            }
            else {
                serialization += parameterValue;
            }
        }
        return serialization;
    }
    /**
     * Get the `type` part of MIME
     *
     * @returns {string} type (e.g. 'text')
     */
    getType() {
        return __classPrivateFieldGet(this, _type);
    }
    /**
     * Get the `subtype` part of MIME
     *
     * @returns {string} subtype (e.g. 'html')
     */
    getSubtype() {
        return __classPrivateFieldGet(this, _subtype);
    }
    /**
     * Get the `essence` part (`type`/`subtype`) of MIME
     *
     * @returns {string} essence (e.g. 'text/html')
     */
    getEssence() {
        return `${__classPrivateFieldGet(this, _type)}${__classPrivateFieldGet(this, _SEPARATOR_TYPE_SUBTYPE)}${__classPrivateFieldGet(this, _subtype)}`;
    }
    /**
     * Get the `parameters` part of MIME
     *
     * @returns {Map} parameters (e.g. Map(1) { 'charset' => 'utf-8' })
     */
    getParameters() {
        return __classPrivateFieldGet(this, _parameters);
    }
    /**
     * 文字列が HTTP token code point <https://mimesniff.spec.whatwg.org/#http-token-code-point> のみで構成されているか
     *
     * @param {string} value - 調査する文字列
     *
     * @returns {boolean} HTTP token code point のみで構成されていれば true
     */
    _solelyContainHTTPTokenCodePoints(value) {
        return /^[!#$%&'*+\-.^_`|~0-9A-Za-z]*$/.test(value);
    }
    /**
     * 文字列が HTTP quoted-string token code point <https://mimesniff.spec.whatwg.org/#http-quoted-string-token-code-point> のみで構成されているか
     *
     * @param {string} value - 調査する文字列
     *
     * @returns {boolean} HTTP quoted-string token code point のみで構成されていれば true
     */
    _solelyContainHTTPQuotedStringTokenCodePoints(value) {
        return /^[\t\u0020-\u007E\u0080-\u00FF]*$/.test(value);
    }
    /**
     * HTTP quoted string <https://fetch.spec.whatwg.org/#collect-an-http-quoted-string> を収集する
     *
     * @param {string} input - 調査する文字列
     *
     * @returns {string} HTTP quoted string
     */
    _collectHTTPQuotedString(input) {
        const inputLength = input.length;
        let position = 1;
        let output = '';
        while (position < inputLength) {
            while (position < inputLength && input[position] !== '"' && input[position] !== '\\') {
                output += input[position];
                position++;
            }
            const quoteOrBackslash = input[position];
            position++;
            if (quoteOrBackslash === '\\') {
                if (position >= inputLength) {
                    output += '\\';
                    break;
                }
                output += input[position];
                position++;
            }
            else {
                break;
            }
        }
        return output;
    }
}
_SEPARATOR_TYPE_SUBTYPE = new WeakMap(), _SEPARATOR_PARAMETERS = new WeakMap(), _SEPARATOR_PARAMETERS_KEY_VALUE = new WeakMap(), _type = new WeakMap(), _subtype = new WeakMap(), _parameters = new WeakMap();
//# sourceMappingURL=MIMEParser.js.map