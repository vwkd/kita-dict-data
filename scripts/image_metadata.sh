#!/usr/bin/env bash

set -e -u -o pipefail

output_file="tmp/images.csv"

echo "Create image metadata..."

echo "partNumber,pageNumber,width,height" > "$output_file"

identify -format "%d,%f,%w,%h\n" tmp/part*[0-9]/page-*[0-9]_cropped.jpg \
  | sed -E 's|tmp/part([0-9]+),page-([0-9]+)_cropped\.jpg,|\1,\2,|' \
  | sort -t',' -k1,1 -k2,2n >> "$output_file"
