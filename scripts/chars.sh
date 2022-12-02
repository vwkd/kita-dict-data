#!/bin/zsh

fold -w1 src/dict.txt \
| LC_ALL=C sort -u
