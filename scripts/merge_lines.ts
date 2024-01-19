#!/usr/bin/env -S deno run --ext=ts

import { toText } from "https://deno.land/std@0.203.0/streams/mod.ts";

const NEWLINE = "\n";

/**
 * Merges lines in standard input and prints to standard output.
 */
if (import.meta.main) {
  const text = await toText(Deno.stdin.readable);

  validate(text);

  const textNew = mergeLines(text);

  console.log(textNew);
}

/**
 * Validates text
 * @param text text string
 */
function validate(text: string): void {
  const lines = text.split(NEWLINE);

  const re_trailing_whitespace = / $/;
  const re_leading_whitespace = /^ /;
  const re_trailing_slash = /\/$/;
  const re_leading_slash = /^\//;

  // lines are not empty, except last
  if (lines.slice(0, -1).some((line) => line == "")) {
    console.error("Lines are empty");
    Deno.exit(1);
  }

  // lines have no trailing whitespace
  if (lines.some((line) => line.match(re_trailing_whitespace))) {
    console.error("Lines have trailing whitespace");
    Deno.exit(1);
  }

  // lines have no leading whitespace, except first
  if (
    lines.slice(1).some((line) => line.match(re_leading_whitespace))
  ) {
    console.error("Lines have leading whitespace");
    Deno.exit(1);
  }

  // lines have no trailing slash
  if (lines.some((line) => line.match(re_trailing_slash))) {
    console.error("Manually merge lines with trailing slash");
    Deno.exit(1);
  }

  // lines have no leading slash, except first
  if (
    lines.slice(1).some((line) => line.match(re_leading_slash))
  ) {
    console.error("Manually merge lines with leading slash");
    Deno.exit(1);
  }
}

/**
 * Merge lines in text except trailing newline.
 *
 * - beware: always check that correctly transforms it!
 * - note: don't add trailing newline since `console.log` already adds one
 * @param lines text string
 */
function mergeLines(text: string): string {
  return text
    // -------- merge without whitespace if
    // line ends in `~-`
    .replaceAll(/(~-)\n(.)/g, "$1$2")
    // line ends in `zs.-`
    .replaceAll(/(zs\.-)\n(.)/g, "$1$2")
    // line ends in `-` and next line starts with uppercase, e.g. `Trauben-\nArt`
    .replaceAll(/(-)\n([A-ZÄÖÜẞ])/g, "$1$2")
    // line ends in `-` and preceeded by not hyphen (currently space), lowercase word, next line starts with lowercase word, comma, whitespace, hyphen, lowercase word, e.g. `auf-\ngehen, -legen`
    .replaceAll(/([ ][a-zäöüß]+-)\n([a-zäöüß]+, -[a-zäöüß])/g, "$1$2")
    // line ends in `-` and next line start with `ea.`, e.g. `hinter-\nea.`
    .replaceAll(/(-)\n(ea\.)/g, "$1$2")
    // line ends in `-` and preceeded by hyphen, comma, space and characters, and followed by characters, not hyphen (currently space / comma / semicolon / slash / line-end), e.g. `Waschbär-, Schuppen-\npelz`, `an-, hin-\nzulehnen(d)`, but not `Zusammen-, Gemein-\nschafts-leben`
    .replaceAll(
      /([a-zäöüß]-, [A-ZÄÖÜẞ]?[a-zäöüß]+-)\n([a-zäöüß\(\)]+([ ,;\/\n]))/g,
      "$1$2",
    )
    // line ends in `-` preceeded word and hyphen and `u.` or `od.` or `und` or `oder` or `bzw.` and word
    // e.g. `Faust- od. Box-\nkampf`, `hinaus- od. (hin)durch-\nschauen`, `hinaus- od. (an et.) vorbei-\nschleppen`
    // but not `West- u. Ost-geor-\ngien`, `Uniform- od. Solda-\nten-mantel`
    // beware: wrong if print error, e.g. `West- u. Ostgeor-\ngien`!
    .replaceAll(
      /(- \(?(?:und|oder|u\.|od\.|bzw\.) (?:\([A-ZÄÖÜẞa-zäöüß .]+\) )?[A-ZÄÖÜẞa-zäöüß()]+-)\n([A-ZÄÖÜa-zäöüß()]+(?:$|[^A-ZÄÖÜẞa-zäöüß()-]))/gm,
      "$1$2",
    )
    // line ends in `-` and next line starts with word and `u.` or `od.` or `und` or `oder` or `bzw.` and hyphen and word
    // e.g. `hinunter-\nreichen od. -werfen`, `auf-\nnehmen (od. -heben)`, `Geburts-\nhaus n od. -ort`,
    // but not `Rela-\ntiv-pronomina u. -adverbien`, `Speiseeis-berei-\ntung od. -verkauf`
    // beware: wrong if print error, e.g. `Rela-\ntivpronomina u. -adverbien`!
    .replaceAll(
      /((?:^|[^A-ZÄÖÜẞa-zäöüß()-])[A-ZÄÖÜa-zäöüß()]+-)\n([A-ZÄÖÜẞa-zäöüß()]+ (?:(?:m|f|n) )?\(?(?:und|oder|u\.|od\.|bzw\.) -)/gm,
      "$1$2",
    )
    // line ends in `-)` preceeded by non-space
    .replaceAll(/([^ ]-\))\n(.)/g, "$1$2")
    // line ends in `)` preceeded by `(`, uppercase, and lowercase and next line starts with uppercase, e.g. `(Kegel)\nBahn`, but not `(in Zusammensetzungen) Schüler`
    .replaceAll(/(\([A-ZÄÖÜẞ][a-zäöüß]+\))\n([A-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `d.` and next line starts with `h.`
    .replaceAll(/(d\.)\n(h\.)/g, "$1$2")
    // line ends in `u-` or `o-`, and next line starts with `imer\.` or `ratsch\.`
    .replaceAll(/((u-)|(o-))\n((imer\.)|(ratsch\.))/g, "$1$4")
    // line ends in abbreviation `u.` and next line starts with `a.`
    .replaceAll(/(u\.)\n(a\.)/g, "$1$2")
    // line ends in abbreviation `u.` and next line starts with `ä.`
    .replaceAll(/(u\.)\n(ä\.)/g, "$1$2")
    // line ends in abbreviation `z.` and next line starts with `B.`
    .replaceAll(/(z\.)\n(B\.)/g, "$1$2")
    // line ends in abbreviation `ad.` and next line starts with `dem.`
    .replaceAll(/(ad\.)\n(dem\.)/g, "$1$2")
    // line ends in abbreviation `ad.` and next line starts with `int.`
    .replaceAll(/(ad\.)\n(int\.)/g, "$1$2")
    // line ends in abbreviation `ad.` and next line starts with `rel.`
    .replaceAll(/(ad\.)\n(rel\.)/g, "$1$2")
    // line ends in abbreviation `cj.` and next line starts with `pr.`
    .replaceAll(/(cj\.)\n(pr\.)/g, "$1$2")
    // line ends in abbreviation `cj.` and next line starts with `f.`
    .replaceAll(/(cj\.)\n(f\.)/g, "$1$2")
    // line ends in abbreviation `cj.` and next line starts with `pt.`
    .replaceAll(/(cj\.)\n(pt\.)/g, "$1$2")
    // line ends in abbreviation `d.` and next line starts with `O.`
    .replaceAll(/(d\.)\n(O\.)/g, "$1$2")
    // line ends in abbreviation `e-` and next line starts with `e`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(e[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `e-` and next line starts with `m`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(m[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `e-` and next line starts with `n`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(n[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `e-` and next line starts with `r`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(r[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `e-` and next line starts with `s`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]e-)\n(s[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `f/` and next line starts with `pl`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]f\/)\n(pl[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `3.` and next line starts with `Gr.`
    .replaceAll(/(3\.)\n(Gr\.)/g, "$1$2")
    // line ends in abbreviation `3.` and next line starts with `sg`
    .replaceAll(/([123]\.)\n(sg)/g, "$1$2")
    // line ends in abbreviation `3.` and next line starts with `pl`
    .replaceAll(/([123]\.)\n(pl)/g, "$1$2")
    // line ends in abbreviation `i.` and next line starts with `O.`
    .replaceAll(/(i\.)\n(O\.)/g, "$1$2")
    // line ends in abbreviation `j-` and next line starts with `d`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(d[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `j-` and next line starts with `m`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(m[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `j-` and next line starts with `n`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(n[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `j-` and next line starts with `s`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]j-)\n(s[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `m-` and next line starts with `e`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(e[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `m-` and next line starts with `m`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(m[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `m-` and next line starts with `n`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(n[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `m/` and next line starts with `pl`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]m\/)\n(pl[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `m-` and next line starts with `r`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(r[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `m-` and next line starts with `s`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]m-)\n(s[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `n/` and next line starts with `pl`
    .replaceAll(/([^a-zäöüßA-ZÄÖÜẞ]n\/)\n(pl[^a-zäöüßA-ZÄÖÜẞ])/g, "$1$2")
    // line ends in abbreviation `opt.` and next line starts with `fut`
    .replaceAll(/(opt\.)\n(fut)/g, "$1$2")
    // line ends in abbreviation `opt.` and next line starts with `pr`
    .replaceAll(/(opt\.)\n(pr)/g, "$1$2")
    // line ends in abbreviation `p.` and next line starts with `a.`
    .replaceAll(/(p\.)\n(a\.)/g, "$1$2")
    // line ends in abbreviation `p.` and next line starts with `f.`
    .replaceAll(/(p\.)\n(f\.)/g, "$1$2")
    // line ends in abbreviation `pl-` and next line starts with `pf`
    .replaceAll(/(pl-)\n(pf)/g, "$1$2")
    // line ends in abbreviation `p.` and next line starts with `n.`
    .replaceAll(/(p\.)\n(n\.)/g, "$1$2")
    // line ends in abbreviation `p.` and next line starts with `p.`
    .replaceAll(/(p\.)\n(p\.)/g, "$1$2")
    // line ends in abbreviation `pr.` and next line starts with `dem.`
    .replaceAll(/(pr\.)\n(dem\.)/g, "$1$2")
    // line ends in abbreviation `pr.` and next line starts with `int.`
    .replaceAll(/(pr\.)\n(int\.)/g, "$1$2")
    // line ends in abbreviation `pr.` and next line starts with `pers.`
    .replaceAll(/(pr\.)\n(pers\.)/g, "$1$2")
    // line ends in abbreviation `pr.` and next line starts with `poss.`
    .replaceAll(/(pr\.)\n(poss\.)/g, "$1$2")
    // line ends in abbreviation `pr.` and next line starts with `rel.`
    .replaceAll(/(pr\.)\n(rel\.)/g, "$1$2")
    // -------- merge with whitespace if
    // line ends in `-` and next line starts with `u.` or `od.` or `und` or `oder` or `bzw.`
    // e.g. `Ochsen-\nu. Büffel-gespann`
    .replaceAll(/(-)\n((?:und|oder|u\.|od\.|bzw\.)[^a-zäöüßA-ZÄÖÜẞ])/g, "$1 $2")
    // -------- merge without whitespace and delete trailing hyphen otherwise
    .replaceAll(/([^ ])-\n(.)/g, "$1$2")
    // -------- merge with single whitespace otherwise
    .replaceAll(/\n/g, " ")
    // -------- remove trailing whitespace
    .replace(/\s+$/, "");
}
