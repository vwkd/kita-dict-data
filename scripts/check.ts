#!/usr/bin/env -S deno run --ext=ts --allow-read

const NEWLINE = "\n";
const DICT_PATH = "src/dict.txt";

/**
 * Checks file until line number provided by first argument.
 */
if (import.meta.main) {
  let lineNumberArg = Deno.args[0];

  if (!lineNumberArg) {
    throw new Error("No line number argument provided.");
  }

  // note: stops parsing after first invalid character
  const lineNumber = parseInt(lineNumberArg);

  if (Number.isNaN(lineNumber)) {
    throw new Error("Line number argument must be an integer.");
  }

  if (lineNumber < 0) {
    throw new Error("Line number argument must be a non-negative integer.");
  }

  console.info(`Checking until line ${lineNumber}...`);

  const text = await Deno.readTextFile(DICT_PATH);
  const lines = text
    .split(NEWLINE)
    .slice(0, lineNumber);

  illegalCharacters(lines);
  misrecognizedCharacters(lines);
  mixedCharacters(lines);
  missingSuperscriptNumber(lines);
  mergedLines(lines);
  whitespace(lines);
  unbalancedDelimiters(lines);

  incorrectSort(lines);
}

/**
 * Checks illegal characters.
 * @param lines array of lines
 */
function illegalCharacters(lines: string[]): void {
  console.info("Illegal characters");

  const re_illegal_chars =
    /[^\]\[♦︎0-9¹²³⁴⁵⁶⁷⁸⁹½⅛⅝⁄₁₂₃₄₅₆₇₈₉ ()|.,:;~?!\/#"'*§=†Ωδέéàêëა-ჰa-zäöüßA-ZÄÖÜẞ-]/g;
  printMatches(lines, re_illegal_chars);
}

/**
 * Checks misrecognized characters.
 * @param lines array of lines
 */
function misrecognizedCharacters(lines: string[]): void {
  console.info("Misrecognized characters");

  const re_misrecognized_chars = /~[a-zäöüßA-ZÄÖÜ]/g;
  printMatches(lines, re_misrecognized_chars);

  const re_misrecognized_chars2 = /[a-zäöüßA-ZÄÖÜ]~/g;
  printMatches(lines, re_misrecognized_chars2);
}

/**
 * Checks mixed characters.
 * @param lines array of lines
 */
function mixedCharacters(lines: string[]): void {
  console.info("Mixed characters");

  // no separation
  const re_mixed_chars = /[a-zäöüßA-ZÄÖÜ][ა-ჰ]/g;
  printMatches(lines, re_mixed_chars);

  const re_mixed_chars2 = /[ა-ჰ][a-zäöüßA-ZÄÖÜ]/g;
  printMatches(lines, re_mixed_chars2);

  // separated by space
  const re_mixed_chars3 = /[a-zäöüßA-ZÄÖÜ]-[ა-ჰ]/g;
  printMatches(lines, re_mixed_chars3);

  const re_mixed_chars4 =
    /[ა-ჰ]-(?!Spiel|weise|Massen|Brot|Instruments|Sänger|Partei|Tänzer)[a-zäöüßA-ZÄÖÜ]/g;
  printMatches(lines, re_mixed_chars4);
}

/**
 * Checks missing superscript numbers.
 * @param lines array of lines
 */
function missingSuperscriptNumber(lines: string[]): void {
  console.info("Missing superscript number");

  const re_missing_superscript = /IV[^¹²³⁴\.]/g;
  printMatches(lines, re_missing_superscript);

  const re_missing_superscript2 = /(?<!R)P[^¹²³\.a-zäöüR]/g;
  printMatches(lines, re_missing_superscript2);

  const re_missing_superscript3 = /RM[^¹²³⁴]/g;
  printMatches(lines, re_missing_superscript3);

  const re_missing_superscript4 = /RP[^¹²³⁴⁵⁶⁷]/g;
  printMatches(lines, re_missing_superscript4);

  const re_missing_superscript5 = /(?<!K)T[^¹²³⁴⁵\.a-zäöü]/g;
  printMatches(lines, re_missing_superscript5);

  const re_missing_superscript6 = /ZP[^¹²³]/g;
  printMatches(lines, re_missing_superscript6);
}

/**
 * Checks merged lines.
 * @param lines array of lines
 */
function mergedLines(lines: string[]): void {
  console.info("Merged lines");

  // missing space after comma except if digit or newline
  const re_merged_lines = /,(?! |\d|$)/g;
  printMatches(lines, re_merged_lines);

  // missing space after semicolon except if newline
  const re_merged_lines2 = /;(?! |$)/g;
  printMatches(lines, re_merged_lines2);

  // `Inf.` in middle of line
  const re_merged_lines3 = /(?<!^ |  \d\.) Inf\./g;
  printMatches(lines, re_merged_lines3);

  // hyphen followed by space except if first word in line
  const re_merged_lines4 =
    /(?<= )\S+- (?!(u\. )|(od\. )|(und )|(oder )|(bzw\. )|(bis )|(usw\.\)))/g;
  printMatches(lines, re_merged_lines4);

  // hyphen followed by slash
  const re_merged_lines5 = /:\//g;
  printMatches(lines, re_merged_lines5);

  // slash followed by whitespace except if another slash with whitespace before, e.g. ` /s. unten/ `
  const re_merged_lines6 = /(?<! \/[^\/]+)\/ /g;
  printMatches(lines, re_merged_lines6);
}

/**
 * Checks whitespace.
 * @param lines array of lines
 */
function whitespace(lines: string[]): void {
  console.info("Whitespace");

  // multiple spaces except if at start of line
  const re_multiple_space = /(?<!^) {2,}/g;
  printMatches(lines, re_multiple_space);

  // trailing space
  const re_trailing_space = / $/g;
  printMatches(lines, re_trailing_space);
}

/**
 * Checks unbalanced delimiters.
 *
 * - beware: can fail if line number is between two merged lines!
 * @param lines array of lines
 */
function unbalancedDelimiters(lines: string[]): void {
  console.info("Unbalanced delimiters");

  const re_enumeration_markers_alphabetic =
    /(?<!(Pkt\.)|(§( \d+,)+)|(ca\. \d+)) [abcde]\)/g;
  const re_enumeration_markers_numeric =
    /(?<!(Pkt\.(( \d+,)? \d+ (u\.|und))?)|(§( \d+,)*)|(§ \d+ u\.)|(§ \d+, \d+ u\.)) \d+\)/g;

  for (const [index, line] of lines.entries()) {
    let lineClean = line
      .replaceAll(re_enumeration_markers_alphabetic, "")
      .replaceAll(re_enumeration_markers_numeric, "");

    if (!isBalanced(lineClean, "(", ")")) {
      console.error(`${index + 1}:${line}`);
    }
  }

  for (const [index, line] of lines.entries()) {
    if (!isBalanced(line, "[", "]")) {
      console.error(`${index + 1}:${line}`);
    }
  }
}

/**
 * Checks if entries are sorted alphabetically.
 * Errors on first unsorted entry.
 *
 * defines: first hyphen, then letters, then numbers
 *
 * filters out:
 * - header lines starting with two hashes
 * - empty lines
 * - verb lines starting with two spaces
 * - first line on page if continued from previous page
 *
 * removes:
 * - rest of line after last star if next line start with two spaces (infinitive suffix on verb root)
 * - rest of line after first space
 * - hyphen, except
 *   - if at end keep
 *   - if at start add placeholder `@` to sort last
 * - parentheses
 * - vertical bar
 * - bold markdown formatting
 * - dot
 *
 * replaces:
 * - superscript numbers with numbers (because `sort` puts superscript numbers in wrong order)
 * @param lines array of lines
 */
function incorrectSort(lines: string[]): void {
  console.info("Incorrect sort");

  const re_infinitive_suffix = /([^ ]*\*[¹²³⁴⁵⁶⁷⁸⁹]?).*/g;
  const sub_infinitive_suffix = "$1";

  const re_header_line = /^##/;
  const re_verb_line = /^  /;
  const re_continued_line = /^♦︎/;

  const sub_empty = "";

  const re_rest = /(,)? .*$/;
  const re_hyphen_start = /^-(.+)/;
  const sub_hyphen_start = "$1@";

  const re_hyphen = /(.)-(.)/g;
  const sub_hyphen = "$1$2";

  const re_parenthesis_left = /\(/g;
  const re_parenthesis_right = /\)/g;
  const re_vertical_bar = /\|/g;
  const re_bold = /\*\*/g;
  const re_dot = /\./g;
  const re_superscript_1 = /¹/g;
  const sub_superscript_1 = "1";
  const re_superscript_2 = /²/g;
  const sub_superscript_2 = "2";
  const re_superscript_3 = /³/g;
  const sub_superscript_3 = "3";
  const re_superscript_4 = /⁴/g;
  const sub_superscript_4 = "4";
  const re_superscript_5 = /⁵/g;
  const sub_superscript_5 = "5";
  const re_superscript_6 = /⁶/g;
  const sub_superscript_6 = "6";
  const re_superscript_7 = /⁷/g;
  const sub_superscript_7 = "7";
  const re_superscript_8 = /⁸/g;
  const sub_superscript_8 = "8";
  const re_superscript_9 = /⁹/g;
  const sub_superscript_9 = "9";

  const linesClean: (string | undefined)[] = lines
    .map((line, index, array) => {
      const next_line = array.at(index + 1);

      // beware: won't match for last line, but can't know since next page isn't fixed yet
      if (next_line?.match(re_verb_line)) {
        return line
          .replace(re_infinitive_suffix, sub_infinitive_suffix);
      } else {
        return line;
      }
    })
    .map((line) => {
      if (
        line.match(re_header_line) || line.match(re_verb_line) ||
        line.match(re_continued_line) || line == ""
      ) {
        return undefined;
      } else {
        return line;
      }
    })
    .map((line) => {
      return line?.replace(re_rest, sub_empty)
        .replace(re_hyphen_start, sub_hyphen_start)
        .replaceAll(re_hyphen, sub_hyphen)
        .replaceAll(re_parenthesis_left, sub_empty)
        .replaceAll(re_parenthesis_right, sub_empty)
        .replaceAll(re_vertical_bar, sub_empty)
        .replaceAll(re_bold, sub_empty)
        .replaceAll(re_dot, sub_empty)
        .replaceAll(re_superscript_1, sub_superscript_1)
        .replaceAll(re_superscript_2, sub_superscript_2)
        .replaceAll(re_superscript_3, sub_superscript_3)
        .replaceAll(re_superscript_4, sub_superscript_4)
        .replaceAll(re_superscript_5, sub_superscript_5)
        .replaceAll(re_superscript_6, sub_superscript_6)
        .replaceAll(re_superscript_7, sub_superscript_7)
        .replaceAll(re_superscript_8, sub_superscript_8)
        .replaceAll(re_superscript_9, sub_superscript_9);
    });

  validateSorted(linesClean);
}

/**
 * Print all lines that match regex
 * @param lines array of lines
 * @param regex regex to match for each line
 */
function printMatches(lines: string[], regex: RegExp): void {
  for (const [index, line] of lines.entries()) {
    const match = line.match(regex);

    if (match) {
      console.error(`${index + 1}:${line}`);
    }
  }
}

/**
 * Validate lines are sorted.
 * Errors on first unsorted line.
 *
 * - note: needs to keep "deleted" lines to get correct index
 * @param lines array of lines, "deleted" lines are `undefined`
 * @returns void
 */
function validateSorted(lines: (string | undefined)[]): void {
  const sorted = lines.filter((s) => s !== undefined).toSorted() as string[];

  const lines_with_index = lines
    .map((line, index) => ({ index, line }))
    .filter((item) => item.line !== undefined);

  for (const [i, { index, line }] of lines_with_index.entries()) {
    if (line !== sorted[i]) {
      throw new Error(`${index + 1}:${line}`);
    }
  }
}

/**
 * Checks if delimiters are balanced
 * @param str string to check
 * @param delimiterOpen open delimiter, e.g. `(`, `[`, etc.
 * @param delimiterClose close delimiter, e.g. `)`, `]`, etc.
 * @returns true if all delimiters are balanced, false otherwise
 */
function isBalanced(
  str: string,
  delimiterOpen: string,
  delimiterClose: string,
): boolean {
  let count = 0;

  for (let i = 0; i < str.length; i += 1) {
    // closing delimiter without matching opening delimiter
    if (count < 0) {
      return false;
    }

    if (str[i] === delimiterOpen) {
      count += 1;
    } else if (str[i] === delimiterClose) {
      count -= 1;
    }
  }

  return count == 0;
}
