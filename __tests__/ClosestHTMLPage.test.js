import ClosestHTMLPage from '../dist/ClosestHTMLPage.js';

describe('_getParentPage()', () => {
	const closestHTMLPage = new ClosestHTMLPage();

	test('/foo/bar/', () => {
		expect(closestHTMLPage._getParentPage(new URL('https://example.com/foo/bar/')).toString()).toBe('https://example.com/foo/');
	});
	test('/foo/bar', () => {
		expect(closestHTMLPage._getParentPage(new URL('https://example.com/foo/bar')).toString()).toBe('https://example.com/foo/');
	});
	test('/foo/', () => {
		expect(closestHTMLPage._getParentPage(new URL('https://example.com/foo/')).toString()).toBe('https://example.com/');
	});
	test('/foo', () => {
		expect(closestHTMLPage._getParentPage(new URL('https://example.com/foo')).toString()).toBe('https://example.com/');
	});
	test('/', () => {
		expect(closestHTMLPage._getParentPage(new URL('https://example.com/')).toString()).toBe('https://example.com/');
	});
});
