#!/bin/zsh

# checks if entries are sorted alphabetically
# errors on first unsorted entry
# line number limit provided by first argument

# filters out:
# - header lines starting with two hashes
# - empty lines
# - verb lines starting with two spaces
# - first line on page if continued from previous page

# removes:
# - rest of line after last star if next line start with two spaces (infinitive suffix on verb root)
#   uses gnu-sed because of -z option
# - rest of line after first space
# - hyphen
# - parentheses
# - vertical bar
# - bold markdown formatting

# replaces:
# - superscript numbers with numbers (because `LC_ALL=C sort` puts superscript numbers in wrong order)

head -n $1 src/dict.txt \
| gsed -z -E "s/([^ ]*\*)([^\n]*)(\n  )/\1\3/g" \
| grep -v -e "^##" -e "^$" -e "^  " -e "^♦︎" \
| sed -e "s/ .*$//g" -e "s/-//g" -e "s/(//g" -e "s/)//g" -e "s/|//g" -e "s/\*\*//g" -e "s/¹/1/g" -e "s/²/2/g" -e "s/³/3/g" -e "s/⁴/4/g" -e "s/⁵/5/g" -e "s/⁶/6/g" -e "s/⁷/7/g" -e "s/⁸/8/g" -e "s/⁹/9/g" \
| LC_ALL=C sort -c
