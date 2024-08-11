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

  # for every page
  for filepath in "${dirname}"/page-*[0-9].jpg; do
    dir=$(dirname "$filepath")
    filename=$(basename "$filepath")

    echo "$filename"

    filename_new=$(echo "$filename" | sed -E 's/^(page-[0-9]+)(\.jpg)$/\1_cropped\2/')
    filepath_new="${dir}/${filename_new}"

    # create trimmed page image
    trim2detail -p "$PADDING" "$filepath" "$filepath_new"
  done
done
