#!/bin/zsh

# merges lines except trailing newline
# beware: always check that correctly transforms it!
# beware: doesn't handle abbreviations, needs to fix manually, e.g. `pr.\ndem.` becomes `pr. dem.`

substitutions=(
  # merge without whitespace if
  # line ends in `~-`
  -e "s/(~-)\n(.)/\1\2/g"
  # line ends in `zs.-`
  -e "s/(zs\.-)\n(.)/\1\2/g"
  # line ends in `-` and next line starts with uppercase, e.g. `Trauben-\nArt`
  -e "s/(-)\n([A-ZÄÖÜẞ])/\1\2/g"
  # line ends in `-` and preceeded by not hyphen (currently space), lowercase word, next line starts with lowercase word, comma, whitespace, hyphen, lowercase word, e.g. `auf-\ngehen, -legen`
  -e "s/([ ][a-zäöüß]+-)\n([a-zäöüß]+, -[a-zäöüß])/\1\2/g"
  # line ends in `-` and next line start with `ea.`, e.g. `hinter-\nea.`
  -e "s/(-)\n(ea\.)/\1\2/g"
  # line ends in `-` and preceeded by hyphen, comma, space and characters, and followed by characters, not hyphen (currently space / comma / semicolon / slash / line-end), e.g. `Waschbär-, Schuppen-\npelz`, `an-, hin-\nzulehnen(d)`, but not `Zusammen-, Gemein-\nschafts-leben`
  -e "s/([a-zäöüß]-, [A-ZÄÖÜẞ]?[a-zäöüß]+-)\n([a-zäöüß\(\)]+([ ,;\/\n]))/\1\2/g"
  # line ends in `/`
  -e "s/(\/)\n(.)/\1\2/g"
  # next line starts with `/`
  -e "s/\n(\/)/\1/g"
  # line ends in `-)` preceeded by non-space
  -e "s/([^ ]-\))\n(.)/\1\2/g"
  # line ends in `)` preceeded by `(`, uppercase, and lowercase and next line starts with uppercase, e.g. `(Kegel)\nBahn`, but not `(in Zusammensetzungen) Schüler`
  -e "s/(\([A-ZÄÖÜẞ][a-zäöüß]+\))\n([A-ZÄÖÜẞ])/\1\2/g"

  # merge with whitespace if
  # line ends in `-` and next line starts with `u.`, e.g. `Ochsen-\nu. Büffelgespann`
  -e "s/(-)\n(u\.)/\1 \2/g"
  # line ends in `-` and next line starts with `od.`
  -e "s/(-)\n(od\.)/\1 \2/g"

  # merge without whitespace and delete trailing hyphen otherwise
  -e "s/-\n(.)/\1/g"

  # merge with single whitespace otherwise
  -e "s/\n/ /g"

  # replace trailing whitespace with newline
  -e "s/\s+$/\n/"
)

gsed -z -E "${substitutions[@]}"
