#!/bin/zsh

# checks if entries are sorted alphabetically
# errors on first unsorted entry
# line number limit provided by first argument

# filters out:
# - header lines starting with two hashes
# - empty lines
# - verb lines starting with two spaces

# removes:
# - infinitive suffix on verb root (needs gnu-sed because of -z option)
# - rest of line after first space
# - hyphen
# - parentheses
# - vertical bar
# - bold markdown formatting

head -n $1 src/dict.txt \
| gsed -z -e "s/\*\*[^\*]*\n  /\n  /g" \
| grep -v -e "^##" -e "^$" -e "^  " \
| sed -e "s/ .*$//g" -e "s/-//g" -e "s/(//g" -e "s/)//g" -e "s/|//g" -e "s/\*\*//g" \
| LC_ALL=C sort -c
