#!/usr/bin/env bash

set -e -u -o pipefail

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
    trimbox=$(magick "$filepath" -fuzz 5% -format "%@" info:)
    IFS="x+" read width height x_offset y_offset <<< "$trimbox"
    padded_trimbox="$((width + 2 * PADDING))x$((height + 2 * PADDING))+$((x_offset - PADDING))+$((y_offset - PADDING))"
    magick "$filepath" -crop "$padded_trimbox" +repage "$filepath_new"
  done
done
