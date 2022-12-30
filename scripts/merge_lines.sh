#!/bin/zsh

# merges lines except trailing newline
# beware: always check that correctly transforms it!

# merge without whitespace if
# - line ends in `~-`
# - line ends in `zs.-`
# - line ends in `-` and next line starts with uppercase, e.g. `Trauben-\nArt`
# - line ends in `-` and next line starts with lowercase word, comma, whitespace, hyphen, lowercase word, e.g. `auf-\ngehen, -legen`
# - line ends in `/`
# - line ends in `-)` preceeded by non-space
# - line ends in `)` and next line starts with uppercase, e.g. `(Kegel)\nBahn`
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
  -e "s/(\/)\n(.)/\1\2/g" \
  -e "s/([^ ]-\))\n(.)/\1\2/g" \
  -e "s/(\))\n([A-ZÄÖÜẞ])/\1\2/g" \
  -e "s/(-)\n(u\.)/\1 \2/g" \
  -e "s/(-)\n(od\.)/\1 \2/g" \
  -e "s/-\n(.)/\1/g" \
  -e "s/\n/ /g" \
  -e "s/\s+$/\n/"