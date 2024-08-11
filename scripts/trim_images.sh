#!/usr/bin/env bash

set -e -u -o pipefail

# REQUIREMENTS:
# - [trim2detail](http://www.fmwconcepts.com/imagemagick/trim2detail/index.php)
# curl 'http://www.fmwconcepts.com/imagemagick/downloadcounter.php?scriptname=trim2detail&dirname=trim2detail' -o ~/.local/bin/trim2detail && chmod +x ~/.local/bin/trim2detail

# pixels of padding on each side
PADDING=30

echo "Create trimmed images..."

# for every part
for part_number in 1 2 3; do
  echo "Part ${part_number}"

  dirname="tmp/part${part_number}"

  # create trimmed page image
  parallel --bar -j+0 trim2detail -p "$PADDING" {} {.}_cropped.jpg ::: "${dirname}"/page-*.jpg
done
