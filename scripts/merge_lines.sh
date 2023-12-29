#!/bin/zsh

input=$(cat)

# validate lines have no trailing whitespace
if echo "$input" | grep -q '[[:space:]]$' ; then
  echo "Lines have trailing whitespace" >&2
  exit 1
fi

# validate lines have no leading whitespace, except first
if echo "$input" | tail -n +2 | grep -q '^[[:space:]]' ; then
  echo "Lines have leading whitespace" >&2
  exit 1
fi

# merges lines except trailing newline
# beware: always check that correctly transforms it!

substitutions=(
  # merge without whitespace if
  # line ends in `~-`
  -e "s/(~-)\n(.)/\1\2/g"
  # line ends in `zs.-`
  -e "s/(zs\.-)\n(.)/\1\2/g"
  # line ends in `-` and next line starts with uppercase, e.g. `Trauben-\nArt`
  -e "s/(-)\n([A-ZÄÖÜẞ])/\1\2/g"
  # line ends in `-` and preceeded by not hyphen (currently space), lowercase word, next line starts with lowercase word, comma, whitespace, hyphen, lowercase word, e.g. `auf-\ngehen, -legen`
  -e "s/([ ][a-zäöüß]+-)\n([a-zäöüß]+, -[a-zäöüß])/\1\2/g"
  # line ends in `-` and next line start with `ea.`, e.g. `hinter-\nea.`
  -e "s/(-)\n(ea\.)/\1\2/g"
  # line ends in `-` and preceeded by hyphen, comma, space and characters, and followed by characters, not hyphen (currently space / comma / semicolon / slash / line-end), e.g. `Waschbär-, Schuppen-\npelz`, `an-, hin-\nzulehnen(d)`, but not `Zusammen-, Gemein-\nschafts-leben`
  -e "s/([a-zäöüß]-, [A-ZÄÖÜẞ]?[a-zäöüß]+-)\n([a-zäöüß\(\)]+([ ,;\/\n]))/\1\2/g"
  # line ends in `/`
  # todo: not always correct, e.g. when uses slashes to enclose explanation
  -e "s/(\/)\n(.)/\1\2/g"
  # next line starts with `/`
  # todo: not always correct, e.g. when uses slashes to enclose explanation
  -e "s/\n(\/)/\1/g"
  # line ends in `-)` preceeded by non-space
  -e "s/([^ ]-\))\n(.)/\1\2/g"
  # line ends in `)` preceeded by `(`, uppercase, and lowercase and next line starts with uppercase, e.g. `(Kegel)\nBahn`, but not `(in Zusammensetzungen) Schüler`
  -e "s/(\([A-ZÄÖÜẞ][a-zäöüß]+\))\n([A-ZÄÖÜẞ])/\1\2/g"
  # line ends in `u-` or `o-`, and next line starts with `imer\.` or `ratsch\.`
  -e "s/((u-)|(o-))\n((imer\.)|(ratsch\.))/\1\4/g"
  # line ends in abbreviation `ad.` and next line starts with `dem.`
  -e "s/(ad\.)\n(dem\.)/\1\2/g"
  # line ends in abbreviation `ad.` and next line starts with `int.`
  -e "s/(ad\.)\n(int\.)/\1\2/g"
  # line ends in abbreviation `ad.` and next line starts with `rel.`
  -e "s/(ad\.)\n(rel\.)/\1\2/g"
  # line ends in abbreviation `cj.` and next line starts with `pr.`
  -e "s/(cj\.)\n(pr\.)/\1\2/g"
  # line ends in abbreviation `cj.` and next line starts with `f.`
  -e "s/(cj\.)\n(f\.)/\1\2/g"
  # line ends in abbreviation `cj.` and next line starts with `pt.`
  -e "s/(cj\.)\n(pt\.)/\1\2/g"
  # line ends in abbreviation `d.` and next line starts with `O.`
  -e "s/(d\.)\n(O\.)/\1\2/g"
  # line ends in abbreviation `e-` and next line starts with `e`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(e[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `e-` and next line starts with `m`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(m[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `e-` and next line starts with `n`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(n[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `e-` and next line starts with `r`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(r[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `e-` and next line starts with `s`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(s[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `f/` and next line starts with `pl`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]f\/)\n(pl[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `3.` and next line starts with `Gr.`
  -e "s/(3\.)\n(Gr\.)/\1\2/g"
  # line ends in abbreviation `i.` and next line starts with `O.`
  -e "s/(i\.)\n(O\.)/\1\2/g"
  # line ends in abbreviation `j-` and next line starts with `d`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(d[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `j-` and next line starts with `m`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(m[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `j-` and next line starts with `n`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(n[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `j-` and next line starts with `s`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(s[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `m-` and next line starts with `e`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(e[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `m-` and next line starts with `m`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(m[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `m-` and next line starts with `n`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(n[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `m/` and next line starts with `pl`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]m\/)\n(pl[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `m-` and next line starts with `r`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(r[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `m-` and next line starts with `s`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(s[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `n/` and next line starts with `pl`
  -e "s/([^a-zäöüßA-ZÄÖÜẞ]n\/)\n(pl[^a-zäöüßA-ZÄÖÜẞ])/\1\2/g"
  # line ends in abbreviation `p.` and next line starts with `a.`
  -e "s/(p\.)\n(a\.)/\1\2/g"
  # line ends in abbreviation `p.` and next line starts with `f.`
  -e "s/(p\.)\n(f\.)/\1\2/g"
  # line ends in abbreviation `pl-` and next line starts with `pf`
  -e "s/(pl-)\n(pf)/\1\2/g"
  # line ends in abbreviation `p.` and next line starts with `n.`
  -e "s/(p\.)\n(n\.)/\1\2/g"
  # line ends in abbreviation `p.` and next line starts with `p.`
  -e "s/(p\.)\n(p\.)/\1\2/g"
  # line ends in abbreviation `pr.` and next line starts with `dem.`
  -e "s/(pr\.)\n(dem\.)/\1\2/g"
  # line ends in abbreviation `pr.` and next line starts with `int.`
  -e "s/(pr\.)\n(int\.)/\1\2/g"
  # line ends in abbreviation `pr.` and next line starts with `pers.`
  -e "s/(pr\.)\n(pers\.)/\1\2/g"
  # line ends in abbreviation `pr.` and next line starts with `poss.`
  -e "s/(pr\.)\n(poss\.)/\1\2/g"
  # line ends in abbreviation `pr.` and next line starts with `rel.`
  -e "s/(pr\.)\n(rel\.)/\1\2/g"

  # merge with whitespace if
  # line ends in `-` and next line starts with `u.`, e.g. `Ochsen-\nu. Büffelgespann`
  -e "s/(-)\n(u\.)/\1 \2/g"
  # line ends in `-` and next line starts with `od.`
  -e "s/(-)\n(od\.)/\1 \2/g"

  # merge without whitespace and delete trailing hyphen otherwise
  -e "s/-\n(.)/\1/g"

  # merge with single whitespace otherwise
  -e "s/\n/ /g"

  # replace trailing whitespace with newline
  -e "s/\s+$/\n/"
)

echo "$input" | gsed -z -E "${substitutions[@]}"
