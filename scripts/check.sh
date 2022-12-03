#!/bin/zsh

# checks if entries are sorted alphabetically
# errors on first unsorted entry
# line number limit provided by first argument

# filters out:
# - header lines starting with two hashes
# - empty lines
# - verb lines starting with two spaces

# removes:
# - hyphen
# - parentheses
# - vertical bar
# - bold markdown formatting

head -n $1 src/dict.txt \
| grep -v -e "^##" -e "^$" -e "^  " \
| sed -e "s/-//g" -e "s/(//g" -e "s/)//g" -e "s/|//g" -e "s/\*\*//g" \
| sort -c -s -k 1,1
