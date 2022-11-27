#!/usr/bin/env zsh

# beware: shell must be set to expand glob using numeric sort
# otherwise output PDF will merge pages in wrong order
setopt numeric_glob_sort

img2pdf box1/*.jpg -o out1.pdf
img2pdf box2/*.jpg -o out2.pdf
img2pdf box3/*.jpg -o out3.pdf
