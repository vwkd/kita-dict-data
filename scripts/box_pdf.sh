#!/usr/bin/env zsh

set -e -u -o pipefail

# beware: shell must be set to expand glob using numeric sort
# otherwise output PDF will merge pages in wrong order
setopt numeric_glob_sort

# for every part
for part_number in 1 2 3; do
  dirname="tmp/part${part_number}"

  # merge boxed page images into PDF
  img2pdf "${dirname}"/page-*_boxed.jpg -o "${dirname}/scan_boxed.pdf"
done
