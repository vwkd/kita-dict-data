#!/bin/zsh

# beware: shell must be set to expand glob using numeric sort
# otherwise output PDF will merge pages in wrong order
setopt numeric_glob_sort

mkdir p{1..3}
pdftoppm part1.pdf p1/p -jpeg -scale-to 2000 -progress
pdftoppm part2.pdf p2/p -jpeg -scale-to 2000 -progress
pdftoppm part3.pdf p3/p -jpeg -scale-to 2000 -progress

mkdir box{1..3}
python3 annotate.py

img2pdf box1/*.jpg -o out1.pdf
img2pdf box2/*.jpg -o out2.pdf
img2pdf box3/*.jpg -o out3.pdf