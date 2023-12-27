# README

A Georgian German dictionary



## Format

The dictionary uses an ad-hoc pseudo-markdown format intended to be as similar as possible to the source for ease of visual comparison. Pages are preserved to make locating and navigating for incremental work possible. The header `## X/Y` identifies book `X` and page `Y`. When a page break splits a line into two, the symbol `♦︎` at the start of the first line of a page indicates it should be concatenated to the end of the last line of the previous page, and the symbol `♠︎` at the end of the last line of the previous page indicates the preceeding hyphen should be deleted. Bold formatting is preserved since the verb roots can't be reconstructed, but cursive formatting isn't preserved since it's only used for unambiguous grammatical markers.



## Usage

- show corrected print errors

```sh
git log --grep "print error"
```



## History

The source is Kita Tschenkeli's Georgisch-Deutsches Wörterbuch. The OCR scan was heavily manually error corrected which may have overlooked some errors or introduced new ones. Printing errors found in the process were corrected but there might be more not yet found.



## Credits

Tschenkéli, K., Marchev, Y., Flury, L., Neukomm, R. and Nosadzé, V. (1974). Georgisch-Deutsches Wörterbuch. Zürich: Amirani Verlag.
