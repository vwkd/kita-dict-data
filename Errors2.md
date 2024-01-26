# Working Errors

## Prefixes

(მი|მო|მიმო|წა|წამო|შე|შემო|გა|გამო|ა|ამო|ჩა|ჩამო|და|გადა|გადმო)
// todo: repeat with missing
გარ(-\n)?და~
უკუ~

prefixes without tilde
  s. გადა
   მო 
   ჩა 
DONE (?<![აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ\)|~-])(მი|მო|წა|წამო|შემო|გა|ამო|ჩა|ჩამო|გადა|გადმო)(?![აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ~*¹²³⁴⁵⁶⁷⁸⁹/\(\)|,!-])
(?<![აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ\)|/~*¹²³⁴⁵⁶⁷⁸⁹-]|(~ ))(და)(?![აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ~*¹²³⁴⁵⁶⁷⁸⁹/\(\)|,!-]|( ~))
DONE გამო, და, შე, მიმო, ა (ALSO SUFFIX)
TODO: with line breaks, e.g. გა-\nდა
 ა-$

prefixes with hyphen instead of tilde
  და-

(?<![a-zäöüßA-ZÄÖÜẞ])PREFIX(?![a-zäöüßA-ZÄÖÜẞ])

### Done

ჩა
  ho
  ho~
  ho-
  ho,
  hs-
  hu~

ჩამო
  hoam
  ho-\nam
  hoam~
  hoam-
  hodm
  hodm~
  ham
  huam~

წა
  fo~
  fo
  for
  ³-
  or

წამო
  fuam~
  foam~
  fodm
  odm~
  odm-
  odm
  oam~
  Guam~

გა
  80
  80-
  go~
  30
  30-
  30~
  zu~
  85
  გა- --> გა~
  8~ // not always
  35~ // not always
  zu-
  20

გამო OR OFTEN გადმო
  80am
  800m
  300m~
  30am~
  godm~
  808m
  გამო- --> გამო~
  guam~ // not always
  zudm~
  3uam~
  quam
  adm // not always
  odm // not always
  asam // not always
  8am
  om~ // not always TODO AFTER (
  gudm-
  33m

გან
  806~
  305~
  306
  805

გა(ნ)
  8(5)~

გადა
  8o
  3000~
  800~
  go~
  38
  8~ // not always
  apu~
  ass
  zoo~
  80s~
  300~
  80o~

გად-
  8-

გადმო~
  30am~
  gumam
  guam~ // not always
  adm // not always
  asam // not always
  3oam // not always
  opam~


შე
  3
  39~
  3g~
  ag
  g~

შემო
  amag-
  agam
  gam // not always

მი
  do~
  3o~
  30~ // not always
  Jo
  // todo
  ao
  an~
  o // not always

მო SINGLE, ONLY AFTER ALL OTHER PREFIX-მო
  am~ -> მო~
  am // not always, can be გამო, ამო
  dm~
  3m
  3~ // not always

მიმო
  dodm
  dod

უკუ~
  3 // not always

ა
  o
  d~
  s~
  S~

აღ
  om
  om~
  (m)

ა(ღ)
  s(m)

აღმო
  (m)am // DONE ALREADY APPARENTLY

ამო
  sam
  sam~
  som

და
  od // not always
  os
  o
  co-
  cos
  eo

## Suffixes

~do
~omo

~ბა
  ~80
  ~ო-\ndo
  do ???

ო
  ~m-

???
  ~50
  do

## Other

მე
  ag

### Done

მას
  dob
  asb
