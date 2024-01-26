# TODO

- correct as many errors as possible through bulk find/replace
- check for only legal symbols

```
ა-ჰ
a-zäöüßA-ZÄÖÜẞ
[^a-zäöüßA-ZÄÖÜẞẞა-ჰ\d¹²³⁴⁵⁶⁷⁸⁹ \(\)\[\]\|\-\.,:;~?!/#"§†]
```
TODO: include vulgar fractions
      include greek Ω δέ
      include french é à ê ë
      exclude uppercase Georgian characters
  
- go through each, fix lines, remaining typos
  - make root bold using `*`
- (maybe?) make shorthands cursive
- check
  - duplicate entries, maybe missing superscript number
  - in alphabetical order, including superscript numbers, filter out any `**` and parentheses, filter out lines starting with double space
  - no digits next to characters `[a-zäöüßA-ZÄÖÜẞ]\d` and vice versa

## Detailed Checks

- no missing spaces after comma or semicolon (introduced by merging lines)
- no missing Georgian verb prefix after comma before parentheses, e.g. `GEO, (GEO`
- no missing vertical line `|` if entry contains `~GEO`
- no missing hyphens (introduced by merging lines), e.g. WORD-, WORD.
- trailing hyphen after page only if word is hyphenated, not line break
- no uppercase in middle of word due to incorrectly deleting hyphen when merging line, e.g. `TraubenArt` instead of `Trauben-Art`

## Final

- remove headers and empty lines, merge lines where `♦︎`, check that doesn't add whitespace when shouldn't or forgets whitespace when should

## Modern grammar

- "kk" -> "ck" from merging lines
- "ss" -> "ß"
- "wissenschafter" -> "wissenschaftler"

## Remaining mistakes only found after parsing

- missing delimiter or out-of-order, e.g. `,`, `;`, `3.`
- missing superscript number on referenced word
- missing linebreak before `fut`, e.g. rough regex with false positives

```
(?<=^  ).{30,}(?<!s\. )fut
```

- missing linebreak before `Merke:`, e.g. rough regex with false positives

```
(?<=^  ).{30,}Merke:
```

## Checks after database

- get gender markers for duplicate word entries, check if they are different

## Georgian Checks

- grammar mistakes
- missing or wrong Georgian words, e.g. missing `fut ა~` in verb list
- missing ancient sign
- ~~missing gender sign~~
- missing tilde or wrong char, e.g. hyphen
- missing bold (verb root) or at wrong place
- missing vertical bar for tilde, or after wrong character
- missing hyphen due to incorrectly merged line
- missing corrected words, e.g. `askdfja`
- no missing Georgian verb prefix after comma before parentheses, e.g. `GEO, (GEO`
- wrong superscript numbers
- missing hyphen after tilde, e.g. `~-აბგ`
