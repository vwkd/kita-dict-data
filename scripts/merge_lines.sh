#!/bin/zsh

# merges lines except trailing newline
# beware: always check that correctly transforms it!

# merge without whitespace if
# - line ends in `~-`
# - line ends in `zs.-`
# - line ends in `-` and next line starts with uppercase, e.g. `Trauben-\nArt`
# - line ends in `-` and next line starts with lowercase word, comma, whitespace, hyphen, lowercase word, e.g. `auf-\ngehen, -legen`
# - line ends in `-` and next line start with `ea.`, e.g. `hinter-\nea.`
# - line ends in `-` and preceeded by hyphen, comma, space and characters, and followed by characters, not hyphen (currently space / comma / semicolon / line-end), e.g. `Waschbär-, Schuppen-\npelz`, but not `Zusammen-, Gemein-\nschafts-leben`
# - line ends in `/`
# - line ends in `-)` preceeded by non-space
# - line ends in `)` preceeded by lowercase and next line starts with uppercase, e.g. `(Kegel)\nBahn`
# merge with whitespace if
# - line ends in `-` and next line starts with `u.`, e.g. `Ochsen-\nu. Büffelgespann`
# - line ends in `-` and next line starts with `od.`
# merge without whitespace and delete trailing hyphen otherwise
# merge with single whitespace otherwise
# replace trailing whitespace with newline

gsed -z -E \
  -e "s/(~-)\n(.)/\1\2/g" \
  -e "s/(zs\.-)\n(.)/\1\2/g" \
  -e "s/(-)\n([A-ZÄÖÜẞ])/\1\2/g" \
  -e "s/(-)\n([a-zäöüß]+, -[a-zäöüß])/\1\2/g" \
  -e "s/(-)\n(ea\.)/\1\2/g" \
  -e "s/([a-zäöüß]-, [A-ZÄÖÜẞ]?[a-zäöüß]+-)\n([a-zäöüß]+([ ,;\n]))/\1\2/g" \
  -e "s/(\/)\n(.)/\1\2/g" \
  -e "s/([^ ]-\))\n(.)/\1\2/g" \
  -e "s/([a-zäöüß]\))\n([A-ZÄÖÜẞ])/\1\2/g" \
  -e "s/(-)\n(u\.)/\1 \2/g" \
  -e "s/(-)\n(od\.)/\1 \2/g" \
  -e "s/-\n(.)/\1/g" \
  -e "s/\n/ /g" \
  -e "s/\s+$/\n/"