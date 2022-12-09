#!/bin/zsh

# checks file until line number provided by first argument
echo "Running checks until line $1..."

# TODO: include vulgar fractions
echo "Checking illegal characters..."
head -n $1 src/dict.txt \
| grep -n -o -E "[^][♦︎0-9¹²³⁴⁵⁶⁷⁸⁹½⅝ \(\)\|\.,:;~?!\/#\"'\*§=†Ωδέéàêëაბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰa-zäöüßA-ZÄÖÜẞ-]"

echo "Checking missing superscript number..."
head -n $1 src/dict.txt \
| grep -n -E "^\s\s((IV[^¹²³⁴])|(P[^¹²³])|(RM[^¹²³⁴])|(RP[^¹²³⁴⁵⁶⁷])|(T[^¹²³⁴⁵])|(ZP[^¹²³]))"

echo "Checking merged lines..."
# `Inf.` or `3. Inf.` in middle of line
head -n $1 src/dict.txt \
| ggrep -n -P "(?<!(^ )|(^  \d\.)) Inf\."
# `aor` in middle of line
# head -n $1 src/dict.txt \
# | ggrep -n -P "(?<!(^ )) aor"
# hyphen followed by space except if first word in line
# second inverse to work around non-fixed length negative lookbehind limitation
# needs to include line numbers from first
head -n $1 src/dict.txt \
| ggrep -nP "[^ ]- (?!(u\. )|(od\. )|(und )|(oder ))" \
| grep -vE -e "^(\d+:)[აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ]+- "

# slash followed by whitespace except if another slash with whitespace before, e.g. ` /s. unten/ `
# second inverse to work around non-fixed length negative lookbehind limitation
head -n $1 src/dict.txt \
| grep -n -E "[^ ]\/ " \
| grep -v -E " \/[\.!? აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰabcdefghijklmnopqrstuvwxyzäöüßABCD EFGHIJKLMNOPQRSTUVWXYZÄÖÜẞ]*\/ "

# checks if entries are sorted alphabetically
# errors on first unsorted entry

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

echo "Checking incorrect sort..."
head -n $1 src/dict.txt \
| gsed -z -E "s/([^ ]*\*)([^\n]*)(\n  )/\1\3/g" \
| grep -v -e "^##" -e "^$" -e "^  " -e "^♦︎" \
| sed -e "s/ .*$//g" -e "s/-//g" -e "s/(//g" -e "s/)//g" -e "s/|//g" -e "s/\*\*//g" -e "s/¹/1/g" -e "s/²/2/g" -e "s/³/3/g" -e "s/⁴/4/g" -e "s/⁵/5/g" -e "s/⁶/6/g" -e "s/⁷/7/g" -e "s/⁸/8/g" -e "s/⁹/9/g" \
| LC_ALL=C sort -c
