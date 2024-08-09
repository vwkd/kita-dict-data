#!/usr/bin/env bash

set -e -u -o pipefail

# note: read out common resolution for largest image per page in `x-ppi` and `y-ppi`, e.g. 600
# pdfimages -q -list tmp/part1/scan.pdf
# pdfimages -q -list tmp/part2/scan.pdf
# pdfimages -q -list tmp/part3/scan.pdf
RESOLUTION=600

# for every part
for part_number in 1 2 3; do
  dirname="tmp/part${part_number}"

  # convert pages from PDF to image
  # note: not lossless?
  pdftoppm -q -progress -jpeg -r "$RESOLUTION" "$dirname/scan.pdf" "$dirname/page"

  # remove zero padding from filename
  rename 's/^(page-)0+(\d+)/$1$2/' "$dirname"/*.jpg

  # remove non-entry pages
  ./scripts/remove_pages.ts "$part_number" '^page-(\d+)\.jpg$'
done
