# Errors

TMP Preverbs
(მი|მო|მიმო|წა|წამო|შე|შემო|გა|გამო|ა|ამო|ჩა|ჩამო|და|გადა|გადმო)
TMP Verb types
(IV|ZP|RP|RM|MV|KT|T|P)
TMP superscript
¹²³⁴⁵⁶⁷⁸⁹



## OCR Errors possibly left

- Umlaute, e.g.
  - `a` instead of `ä`
  - `ä` instead of `ö`
  - `i` instead of `ü`
- m and n, e.g.
  - `m` instead of `rn`
- space missing, e.g.
  - `wordword`
- space extra, e.g.
  - `wo rd`
- symbols, e.g.
  - `/` instead of `f`
- Georgian, e.g.
  - added characters
  - missing characters
- gender markers, e.g.
  - missing entirely, e.g. `f`
  - missing whitespace, e.g. `Gekritzeln`



## Own errors possibly left

### Missing whitespace after trailing slash

- all pages until 2/261
- due to bad merge lines script
- e.g. `vor der Fastenzeit /Butterwoche/\nerlaubte Speisen`
(?<!(## \d)|( )|([a-zäöüß]/[a-zäöüß]+))/(?!( )|([a-zäöüß]+/[a-zäöüß]))



## Print errors possibly left

### missing hyphen in second word

- ((?:und)|(?:oder)|(?:u\.)|(?:od\.))

### missing hyphen in first word

  ((und)|(oder)|(u\.)|(od\.)) -



## Do Later

### Simple

- `u. ä.` or `u.ä.`

### Remaining stuff

- misrecognized Umlaute
- misrecognized numbers for letters and vice versa
0 O
1 l
- missing superscript numbers
- wrong georgian
- misrecognized numbers and letters, e.g. 1 as i, l, I, etc.
- merged lines
  - has partly tagged with ♣︎ (600)
  - about 2000 too long lines without merge symbol
    (?!^.*♣︎)(?=^.{40,}).*
- print errors
- missing tilde, e.g.
  - ფლავქამიში, ჩი
  - ; ური
- misrecgonized hyphen, may be
  - tilde
  - empty space
  - missing letter

### Remaining checks after page correction

- misrecognized numbers and letters
TODO (ALSO OTHER WAY AROUND): (?<!\WT|\WRP|\WP|\Wzp)(?<=[abcdefghijklmnopqrstuvwxyzäöüßABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜẞ])\d


## Do Now

missing ~
  [;,][\s\n]ჯ[აეიოუ]

missing | if followed by ~ (not always, if suffixed to end)
  ავბედი, ~ობა FIXED INSTANCE
  ავდრიანი FIXED INSTANCE

missing second / in Georgian word
  გაავდ/არებულა FIXED INSTANCE

missing superscript
  (RM|RP|ZP|IV|T|P)

ჩა
  ho

მი
  do

მო
  am

გა
  8

~
  lone preverbs
  preverbs with -
  fut - GERMAN

DONE
უკა
ებო

ური
ოვანი
ოსანი
ისრიანი
ისარი
ულა
იანი
ანი
ობა
ლად
ად
ელს
ლივ
ივ
ავ
ლობა
ელი
ავი
არი
ველი
ნეული
ორი
ოსი
ება
ები
ული
ებული
ც
ის ONLY CHECKED HYPHEN

UNDONE

~ი
ი
ა

missing |
  ^[GEO]+, ~[GEO]
  EVEN WITHOUT TILDE WHEN BOTH MISSING!!!

(?<=[^აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ](მი|მო|მიმო|წა|წამო|შე|შემო|გა|გამო|ა|ამო|ჩა|ჩამო|და|გადა|გადმო))-(?=\n\()
