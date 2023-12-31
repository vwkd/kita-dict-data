#!/usr/bin/env -S deno run --ext=ts --allow-read

const NEWLINE = "\n";
const DICT_PATH = "src/dict.txt";

/**
 * A line with index
 */
interface Line {
  index: number;
  value: string;
}

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
  const lines = getLines(text, lineNumber);

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
 * Get lines
 *
 * - removes header lines
 * - removes empty lines
 * - merges first line on page into last line of previous page if continued
 *
 * - note: error in continued line gives index of previous line, needs to manually check if is in continued line
 * @param text text string
 * @returns array of lines
 */
function getLines(text: string, lineNumber: number): Line[] {
  const re_header_line = /^## [123]\/\d+$/;

  return text
    .split(NEWLINE)
    .slice(0, lineNumber)
    .map((value, index) => ({ value, index }))
    .filter((line) => !line.value.match(re_header_line))
    .filter((line) => line.value !== "")
    .filter((line, index, array) => {
      if (line.value.startsWith("♦︎")) {
        const previous_line_value = array[index - 1];

        // beware: Unicode character "♦︎" has length 2!
        const merged_line_value = previous_line_value.value +
          line.value.slice(2);

        array[index - 1].value = merged_line_value;

        return false;
      } else {
        return true;
      }
    });
}

/**
 * Checks illegal characters.
 * @param lines array of lines
 */
function illegalCharacters(lines: Line[]): void {
  console.info("Illegal characters");

  const re_illegal_chars =
    /[^\]\[0-9¹²³⁴⁵⁶⁷⁸⁹½⅛⅝⁄₁₂₃₄₅₆₇₈₉ ()|.,:;~?!\/"'*§=†Ωδέéàêëა-ჰa-zäöüßA-ZÄÖÜẞ-]/g;
  printMatches(lines, re_illegal_chars);
}

/**
 * Checks misrecognized characters.
 * @param lines array of lines
 */
function misrecognizedCharacters(lines: Line[]): void {
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
function mixedCharacters(lines: Line[]): void {
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
function missingSuperscriptNumber(lines: Line[]): void {
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
function mergedLines(lines: Line[]): void {
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
function whitespace(lines: Line[]): void {
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
function unbalancedDelimiters(lines: Line[]): void {
  console.info("Unbalanced delimiters");

  const re_enumeration_markers_alphabetic =
    /(?<!(Pkt\.)|(§( \d+,)+)|(ca\. \d+)) [abcde]\)/g;
  const re_enumeration_markers_numeric =
    /(?<!(Pkt\.(( \d+,)? \d+ (u\.|und))?)|(§( \d+,)*)|(§ \d+ u\.)|(§ \d+, \d+ u\.)) \d+\)/g;

  for (const { index, value } of lines) {
    let valueClean = value
      .replaceAll(re_enumeration_markers_alphabetic, "")
      .replaceAll(re_enumeration_markers_numeric, "");

    if (!isBalanced(valueClean, "(", ")")) {
      console.error(`${index + 1}:${value}`);
    }
  }

  for (const { index, value } of lines) {
    if (!isBalanced(value, "[", "]")) {
      console.error(`${index + 1}:${value}`);
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
 * - verb lines starting with two spaces
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
function incorrectSort(lines: Line[]): void {
  console.info("Incorrect sort");

  const re_infinitive_suffix = /([^ ]*\*[¹²³⁴⁵⁶⁷⁸⁹]?).*/g;
  const sub_infinitive_suffix = "$1";

  const re_verb_line = /^  /;

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

  const headwords: Line[] = lines
    .map((line, index, array) => {
      const next_line = array.at(index + 1);

      // beware: won't match for last line, but can't know since next page isn't fixed yet
      if (next_line?.value.match(re_verb_line)) {
        const value = line.value
          .replace(re_infinitive_suffix, sub_infinitive_suffix);

        return {
          ...line,
          value,
        };
      } else {
        return line;
      }
    })
    .filter((line) => !line.value.match(re_verb_line))
    .map((line) => {
      const value = line.value.replace(re_rest, sub_empty)
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

      return {
        ...line,
        value,
      };
    });

  validateSorted(headwords);
}

/**
 * Print all lines that match regex
 * @param lines array of lines
 * @param regex regex to match for each line
 */
function printMatches(lines: Line[], regex: RegExp): void {
  for (const { index, value } of lines) {
    const match = value.match(regex);

    if (match) {
      console.error(`${index + 1}:${value}`);
    }
  }
}

/**
 * Validate lines are sorted.
 * Errors on first unsorted line.
 *
 * @param headwords array of headwords
 * @returns void
 */
function validateSorted(headwords: Line[]): void {
  const sorted = headwords.toSorted((a, b) => {
    if (a.value < b.value) {
      return -1;
    } else if (a.value > b.value) {
      return 1;
    } else {
      return 0;
    }
  });

  for (const [i, { index, value }] of headwords.entries()) {
    if (value !== sorted[i].value) {
      throw new Error(`${index + 1}:${value}`);
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
