import MIMEParser from '@saekitominaga/mime-parser';

/**
 * Get the data of the HTML page of the nearest ancestor hierarchy.
 */
export default class {
	#mimeTypes: DOMParserSupportedType[]; // 取得するリソースの MIME
	#maxFetchCount: number; // fetch() の最大試行回数

	#fetchedResponses: Set<Response> = new Set(); // fetch() した Response 情報

	/* もっとも近い祖先階層の HTML ページのデータ */
	#url: string | null = null; // URL
	#title: string | null = null; // タイトル

	/**
	 * @param {string[]} mimeTypes - MIME of the HTML resource to retrieve.
	 * @param {number} maxFetchCount - If no HTML page matching the condition can be retrieved after this number of attempts to access the ancestor hierarchy, the process is rounded up (0 = ∞).
	 */
	constructor(mimeTypes: DOMParserSupportedType[] = ['text/html', 'application/xhtml+xml'], maxFetchCount = 0) {
		this.#mimeTypes = mimeTypes;

		if (!Number.isInteger(maxFetchCount)) {
			throw new TypeError('Argument `maxFetchCount` must be an integer.');
		}
		if (maxFetchCount < 0) {
			throw new RangeError('Argument `maxFetchCount` must be greater than or equal to 0.');
		}
		this.#maxFetchCount = maxFetchCount;
	}

	/**
	 * Traverse the ancestor hierarchy in order from the base URL and retrieve the data of resources that match the specified condition (MIME).
	 *
	 * @param {string} baseUrl - Base URL
	 */
	async fetch(baseUrl: string = location.toString()): Promise<void> {
		let url = new URL(baseUrl);

		while (url.pathname !== '/' && (this.#maxFetchCount === 0 || this.#maxFetchCount > this.#fetchedResponses.size)) {
			url = this._getParentPage(url);

			const response = await fetch(`${url.origin}${url.pathname}`);

			this.#fetchedResponses.add(response);
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

			if (!(<string[]>this.#mimeTypes).includes(mimeEssence)) {
				/* 指定された MIME にマッチしない場合 */
				continue;
			}

			/* 諸条件を満たした場合 */
			this.#url = response.url;

			const doc = new DOMParser().parseFromString(await response.text(), <DOMParserSupportedType>mimeEssence);

			const ogpTitleText = (<HTMLMetaElement>doc.querySelector('meta[property="og:title"]'))?.content;
			if (ogpTitleText !== undefined) {
				/* OGP でタイトルが指定されている場合はそこからタイトルを取得 */
				this.#title = ogpTitleText;
			} else {
				/* OGP でタイトルが指定されていない場合は <title> 要素からタイトルを取得 */
				const titleElementText = doc.querySelector('title')?.textContent;
				if (titleElementText !== null && titleElementText !== undefined) {
					this.#title = titleElementText;
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
	getFetchedResponses(): Set<Response> {
		return this.#fetchedResponses;
	}

	/**
	 * Get the URL of the HTML page of the nearest ancestor hierarchy.
	 *
	 * @returns {string | null} URL
	 */
	getUrl(): string | null {
		return this.#url;
	}

	/**
	 * Get the title of the HTML page of the nearest ancestor hierarchy.
	 *
	 * @returns {string | null} Title
	 */
	getTitle(): string | null {
		return this.#title;
	}

	/**
	 * 親ページの URL オブジェクトを取得する（e.g. https://example.com/foo/bar/ → https://example.com/foo/ ）
	 *
	 * @param {URL} url - URL
	 *
	 * @returns {URL} 親ページ（親ページが存在しない場合は自分自身）
	 */
	private _getParentPage(url: URL): URL {
		return new URL(url.pathname.endsWith('/') ? '../' : './', url);
	}
}
