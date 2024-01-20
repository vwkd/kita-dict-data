#!/usr/bin/env -S deno run --ext=ts --allow-read

import { PAGES } from "https://raw.githubusercontent.com/vwkd/kita-utils/main/src/dict.ts";

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
 * A match with index
 */
interface Match {
  index: number;
  index_column: number;
  match: string;
}

/**
 * Checks dict up to and including last page provided by first argument.
 */
if (import.meta.main) {
  let lastPageArg = Deno.args[0];

  if (!lastPageArg) {
    console.error("No page number argument provided.");
    Deno.exit(1);
  }

  const lastPageIndex = PAGES.findIndex((page) => page == lastPageArg);

  if (lastPageIndex < 0) {
    console.error(`Last page '${lastPageArg}' not found`);
    Deno.exit(1);
  }

  const nextPage = PAGES.at(lastPageIndex + 1);

  console.info(`Checking until page ${nextPage}...`);

  const text = await Deno.readTextFile(DICT_PATH);
  const lines = getLines(text, nextPage);

  let hasErrors = false;

  hasErrors = illegalCharacters(lines) || hasErrors;
  hasErrors = misrecognizedCharacters(lines) || hasErrors;
  hasErrors = mixedCharacters(lines) || hasErrors;
  hasErrors = missingSuperscriptNumber(lines) || hasErrors;
  hasErrors = boldFormatting(lines) || hasErrors;
  hasErrors = mergedLines(lines) || hasErrors;
  hasErrors = whitespace(lines) || hasErrors;
  hasErrors = unbalancedDelimiters(lines) || hasErrors;

  hasErrors = incorrectSort(lines) || hasErrors;

  if (hasErrors) {
    Deno.exit(1);
  }
}

/**
 * Get lines
 *
 * - removes header lines
 * - removes empty lines
 * - merges first line on page into last line of previous page if continued
 *
 * - note: error in continued line gives index of previous line, needs to manually check if is in continued line
 * @param text text
 * @param nextPage next page
 * @returns array of lines
 */
function getLines(text: string, nextPage: string): Line[] {
  const re_header_line = /^## [123]\/\d+$/;

  const lines = text.split(NEWLINE);

  const nextPageIndex = lines.findIndex((line) => line == `## ${nextPage}`);

  return lines
    .slice(0, nextPageIndex)
    .map((value, index) => ({ value, index: index + 1 }))
    .filter((line, index, array) => {
      // filter out header lines only if previous and next lines are empty or if at start of string
      if (line.value.match(re_header_line)) {
        const previous_line = array.at(index - 1);

        if (previous_line == undefined) {
          return false;
        }

        const next_line = array.at(index + 1);

        if (previous_line?.value == "" && next_line?.value == "") {
          return false;
        }
      }

      // filter out empty lines only if previous or next line is header line, or at end of string
      if (line.value == "") {
        const next_line = array.at(index + 1);

        if (next_line == undefined || next_line?.value.match(re_header_line)) {
          return false;
        }

        const previous_line = array.at(index - 1);

        if (previous_line?.value.match(re_header_line)) {
          return false;
        }
      }

      return true;
    })
    .filter((line, index, array) => {
      if (line.value.startsWith("♦︎")) {
        // note: can't just use previous line since might mistakenly be empty
        const previous_line_index = array.findLastIndex((line, i) =>
          i < index && line.value !== ""
        );
        const previous_line = array[previous_line_index];

        // beware: Unicode character "♠︎" has length 2 plus hyphen has length 1!
        let previous_line_value = previous_line.value.endsWith("♠︎")
          ? previous_line.value.slice(0, -3)
          : previous_line.value;

        // beware: Unicode character "♦︎" has length 2!
        const merged_line_value = previous_line_value +
          line.value.slice(2);
        array[previous_line_index].value = merged_line_value;

        return false;
      } else if (line.value.endsWith("♠︎") && index + 1 == array.length) {
        // remove "♠︎" if last line of last page
        // beware: Unicode character "♠︎" has length 2!
        line.value = line.value.slice(0, -2);
      }

      return true;
    });
}

/**
 * Checks illegal characters.
 * @param lines array of lines
 */
function illegalCharacters(lines: Line[]): boolean {
  const matches: Match[] = [];

  const re_empty_line = /^$/;
  matches.push(...getMatches(lines, re_empty_line));

  const re_illegal_chars =
    /[^\]\[0-9¹²³⁴⁵⁶⁷⁸⁹½⅛⅝⁄₁₂₃₄₅₆₇₈₉ ()|.,:;~?!\/"'*§=†Ωδέéàêëა-ჰa-zäöüßA-ZÄÖÜẞ-]/;
  matches.push(...getMatches(lines, re_illegal_chars));

  return printMatches(matches, "Illegal characters");
}

/**
 * Checks misrecognized characters.
 * @param lines array of lines
 */
function misrecognizedCharacters(lines: Line[]): boolean {
  const matches: Match[] = [];

  const re_misrecognized_chars = /~[a-zäöüßA-ZÄÖÜ]/;
  matches.push(...getMatches(lines, re_misrecognized_chars));

  const re_misrecognized_chars2 = /[a-zäöüßA-ZÄÖÜ]~/;
  matches.push(...getMatches(lines, re_misrecognized_chars2));

  return printMatches(matches, "Misrecognized characters");
}

/**
 * Checks mixed characters.
 * @param lines array of lines
 */
function mixedCharacters(lines: Line[]): boolean {
  const matches: Match[] = [];

  // no separation
  const re_mixed_chars = /[a-zäöüßA-ZÄÖÜ][ა-ჰ]/;
  matches.push(...getMatches(lines, re_mixed_chars));

  const re_mixed_chars2 = /[ა-ჰ][a-zäöüßA-ZÄÖÜ]/;
  matches.push(...getMatches(lines, re_mixed_chars2));

  // separated by space
  const re_mixed_chars3 = /[a-zäöüßA-ZÄÖÜ]-[ა-ჰ]/;
  matches.push(...getMatches(lines, re_mixed_chars3));

  const re_mixed_chars4 =
    /[ა-ჰ]-(?!Spiel|weise|Massen|Brot|Instruments|Sänger|Partei|Tänzer)[a-zäöüßA-ZÄÖÜ]/;
  matches.push(...getMatches(lines, re_mixed_chars4));

  return printMatches(matches, "Mixed characters");
}

/**
 * Checks missing superscript numbers.
 * @param lines array of lines
 */
function missingSuperscriptNumber(lines: Line[]): boolean {
  const matches: Match[] = [];

  const re_missing_superscript = /IV[^¹²³⁴\.]/;
  matches.push(...getMatches(lines, re_missing_superscript));

  const re_missing_superscript2 = /(?<!R)P[^¹²³\.a-zäöüR]/;
  matches.push(...getMatches(lines, re_missing_superscript2));

  const re_missing_superscript3 = /RM[^¹²³⁴]/;
  matches.push(...getMatches(lines, re_missing_superscript3));

  const re_missing_superscript4 = /RP[^¹²³⁴⁵⁶⁷]/;
  matches.push(...getMatches(lines, re_missing_superscript4));

  const re_missing_superscript5 = /(?<!K)T(?!ASS)[^¹²³⁴⁵\.a-zäöü]/;
  matches.push(...getMatches(lines, re_missing_superscript5));

  const re_missing_superscript6 = /ZP[^¹²³]/;
  matches.push(...getMatches(lines, re_missing_superscript6));

  return printMatches(matches, "Missing superscript number");
}

/**
 * Checks bold formatting
 * @param lines array of lines
 */
function boldFormatting(lines: Line[]): boolean {
  const matches: Match[] = [];

  const re_superscript_inside_bold = /[¹²³⁴⁵⁶⁷⁸⁹]\*/;
  matches.push(...getMatches(lines, re_superscript_inside_bold));

  const re_too_many_bold = /\*{3,}/;
  matches.push(...getMatches(lines, re_too_many_bold));

  const re_too_few_bold = /(?<!\*)\*(?!\*)/;
  matches.push(...getMatches(lines, re_too_few_bold));

  return printMatches(matches, "Bold formatting");
}

/**
 * Checks merged lines.
 * @param lines array of lines
 */
function mergedLines(lines: Line[]): boolean {
  const matches: Match[] = [];

  // missing space after comma except if digit or newline
  const re_merged_lines = /,(?! |\d|$)/;
  matches.push(...getMatches(lines, re_merged_lines));

  // missing space after semicolon except if newline
  const re_merged_lines2 = /;(?! |$)/;
  matches.push(...getMatches(lines, re_merged_lines2));

  // `Inf.` in middle of line
  const re_merged_lines3 = /(?<!^ |  \d\.) Inf\./;
  matches.push(...getMatches(lines, re_merged_lines3));

  // hyphen followed by space except if first word in line
  const re_merged_lines4 =
    /(?<= )\S+- (?!(u\. )|(od\. )|(und )|(oder )|(bzw\. )|(bis )|(usw\.\)))/;
  matches.push(...getMatches(lines, re_merged_lines4));

  // hyphen followed by slash
  const re_merged_lines5 = /:\//;
  matches.push(...getMatches(lines, re_merged_lines5));

  // slash followed by whitespace except if another slash with whitespace before or slash in same word, e.g. ` /s. unten/ `, `დავენდე/ვი/`
  const re_merged_lines6 = /(?<!( \/[^\/]+)|(\/[^ ]+))\/ /;
  matches.push(...getMatches(lines, re_merged_lines6));

  // lowercase, hyphen, uppercase
  const re_merged_lines7 =
    /(?<![a-zäöüßA-ZÄÖÜ-])(?!(irgendwann-Woche))[a-zäöüß-]+-[A-ZÄÖÜ]/;
  matches.push(...getMatches(lines, re_merged_lines7));

  return printMatches(matches, "Merged lines");
}

/**
 * Checks whitespace.
 * @param lines array of lines
 */
function whitespace(lines: Line[]): boolean {
  const matches: Match[] = [];

  // multiple spaces except if at start of line
  const re_multiple_space = /(?<!^) {2,}/;
  matches.push(...getMatches(lines, re_multiple_space));

  // trailing space
  const re_trailing_space = / $/;
  matches.push(...getMatches(lines, re_trailing_space));

  // lowercase, delimiter, uppercase
  // note: `+` and `*` quantifiers only to print more readable matches than one character
  const re_missing_space = /[a-zäöüß]+[()][A-ZÄÖÜ][a-zäöüß]*/;
  matches.push(...getMatches(lines, re_missing_space));

  // space before closing delimiter or after opening delimiter
  const re_delimiter = /( [)\]])|([(\[] )/;
  matches.push(...getMatches(lines, re_delimiter));

  // space before vertical bar
  const re_vertical_bar = / \|(?!\|)/;
  matches.push(...getMatches(lines, re_vertical_bar));

  return printMatches(matches, "Whitespace");
}

/**
 * Checks unbalanced delimiters.
 * @param lines array of lines
 */
function unbalancedDelimiters(lines: Line[]): boolean {
  const matches: Match[] = [];

  // note: exclude last line of last page since may report false positive if continued on next page
  // if indeed error then finds on next check of next page
  const linesMinusOne = lines.slice(0, -1);

  const re_enumeration_markers_alphabetic =
    /(?<!(Pkt\.)|(§( \d+,)+)|(ca\. \d+)) [abcde]\)/g;
  const re_enumeration_markers_numeric =
    /(?<!(Pkt\.(( \d+,)? \d+ (u\.|und))?)|(§( \d+,)*)|(§ \d+ u\.)|(§ \d+, \d+ u\.)) \d+\)/g;

  matches.push(...getMatchesCallback(linesMinusOne, (line) => {
    let valueClean = line.value
      .replaceAll(re_enumeration_markers_alphabetic, "")
      .replaceAll(re_enumeration_markers_numeric, "");

    const b = isBalanced(
      { value: valueClean, index: line.index },
      /\(/g,
      /\)/g,
    );

    if (b !== true) {
      return {
        index: line.index,
        index_column: b.index,
        match: b.delimiter == "open" ? "(" : ")",
      };
    } else {
      return null;
    }
  }));

  matches.push(...getMatchesCallback(linesMinusOne, (line) => {
    const b = isBalanced(line, /\[/g, /\]/g);

    if (b !== true) {
      return {
        index: line.index,
        index_column: b.index,
        match: b.delimiter == "open" ? "[" : "]",
      };
    } else {
      return null;
    }
  }));

  matches.push(...getMatchesCallback(linesMinusOne, (line) => {
    const re_open_quote = /(?<![Ωδέéàêëა-ჰa-zäöüßA-ZÄÖÜẞ.!?\)\/])"/g;
    const re_close_quote = /"(?![Ωδέéàêëა-ჰa-zäöüßA-ZÄÖÜẞ\(])/g;
    const b = isBalanced(line, re_open_quote, re_close_quote);

    if (b !== true) {
      return {
        index: line.index,
        index_column: b.index,
        match: '"',
      };
    } else {
      return null;
    }
  }));

  // beware: doesn't include opening slash inside word because can't differentiate from alternative slash
  // allows closing slash inside word for single-word explanations only, e.g. `/herz/liebst`
  const re_opening_slash_not_followed_by_closing =
    /(?<![a-zäöüßA-ZÄÖÜẞა-ჰ\d][!.-]?\/?\)?(\*\*)?[¹²³⁴⁵⁶⁷⁸⁹]?)\/(?![^\/ ]+\/[a-zäöüßA-ZÄÖÜẞა-ჰ )?!,;"$])(?!([^\/ ]+ )*[^\/ ]+\/[ )?!,;"$])(?![^\/]+\n\n)/;
  matches.push(...getMatches(linesMinusOne, re_opening_slash_not_followed_by_closing));

  // beware: doesn't include closing slash inside word because can't differentiate from alternative slash
  // allows opening slash inside word for single-word and multi-word explanations, e.g. `verdammt/er Kerl/`
  const re_closing_slash_not_preceeded_by_opening =
    /(?<!♦︎[^/]+)(?<![a-zäöüßA-ZÄÖÜẞა-ჰ ]\/[^\/]+)\/(?!(\*\*)?\(?[~-]?[a-zäöüßA-ZÄÖÜẞა-ჰ\d])(?!\n\n)/;
  matches.push(...getMatches(linesMinusOne, re_closing_slash_not_preceeded_by_opening));

  return printMatches(matches, "Unbalanced delimiters");
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
function incorrectSort(lines: Line[]): boolean {
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

  return validateSorted(headwords, "Incorrect sort");
}

/**
 * Get all lines that match regex
 * @param lines array of lines
 * @param regex regex to match for each line, without global flag to get index
 * @returns array of matches
 */
function getMatches(lines: Line[], regex: RegExp): Match[] {
  return lines
    .map(({ index, value }) => {
      const match = value.match(regex);

      if (match) {
        return {
          index,
          index_column: match.index!,
          match: match[0],
        };
      } else {
        return null;
      }
    })
    .filter((el): el is Match => el != null);
}

/**
 * Get all lines that match from callback function
 * @param lines array of lines
 * @param callback callback function to match for each line
 * @returns array of matches
 */
function getMatchesCallback(
  lines: Line[],
  callback: (line: Line) => Match | null,
): Match[] {
  return lines
    .map((line) => callback(line))
    .filter((match): match is Match => match !== null);
}

/**
 * Print matches for header
 * @param matches array of matches
 * @param log_title info log title
 * @returns true if printed matches, else false
 */
function printMatches(matches: Match[], log_title: string): boolean {
  if (matches.length > 0) {
    console.info("Error:", log_title);

    for (const { index, match, index_column } of matches) {
      console.error(`${index}:${index_column}:${match}`);
    }

    return true;
  }

  return false;
}

/**
 * Validate lines are sorted.
 * Errors on first unsorted line.
 *
 * @param headwords array of headwords
 * @param log_title info log title
 * @returns true if printed matches, else false
 */
function validateSorted(headwords: Line[], log_title: string): boolean {
  const sorted = headwords.toSorted((a, b) => {
    if (a.value < b.value) {
      return -1;
    } else if (a.value > b.value) {
      return 1;
    } else {
      return 0;
    }
  });

  for (const [i, line] of headwords.entries()) {
    const { index, value } = sorted[i];
    if (line.value !== value) {
      console.info(log_title);
      console.error(`${index}:${value}`);
      return true;
    }
  }

  return false;
}

/**
 * Checks if delimiters are balanced
 *
 * - note: delimiter regexes must match non-overlapping substrings
 * @param line line to check
 * @param delimiterOpen open delimiter regex, must be global, e.g. `\(`, `\[`, etc.
 * @param delimiterClose close delimiter regex, must be global, e.g. `\)`, `\]`, etc.
 * @returns true if all delimiters are balanced, false otherwise
 */
function isBalanced(
  line: Line,
  delimiterOpen: RegExp,
  delimiterClose: RegExp,
): true | { index: number; delimiter: "open" | "close" } {
  let openDelimiterIndices: number[] = [];

  const matchesOpen = line.value.matchAll(delimiterOpen);
  const matchesClose = line.value.matchAll(delimiterClose);

  let matchOpen = matchesOpen.next();
  let matchClose = matchesClose.next();

  // todo: remove type assertions on `index` once https://github.com/microsoft/TypeScript/issues/36788 is fixed by https://github.com/microsoft/TypeScript/pull/55565 possibly in TypeScript 5.4 in March 2024 https://github.com/microsoft/TypeScript/issues/56948
  if (!matchOpen.done && matchClose.done) {
    const indexOpen = matchOpen.value.index!;
    return { index: indexOpen + 1, delimiter: "open" };
  } else if (!matchClose.done && matchOpen.done) {
    const indexClose = matchClose.value.index!;
    return { index: indexClose + 1, delimiter: "close" };
  }

  while (!matchOpen.done && !matchClose.done) {
    const indexOpen = matchOpen.value.index!;
    const lengthOpen = matchOpen.value[0].length;
    const indexClose = matchClose.value.index!;
    const lengthClose = matchClose.value[0].length;

    if (indexOpen + lengthOpen < indexClose) {
      openDelimiterIndices.push(indexOpen);
      matchOpen = matchesOpen.next();
    } else if (indexClose + lengthClose < indexOpen) {
      // closing delimiter without matching opening delimiter
      if (openDelimiterIndices.length == 0) {
        return { index: indexClose + 1, delimiter: "close" };
      }

      openDelimiterIndices.pop();
      matchClose = matchesClose.next();
    } else {
      const indexOpenEnd = indexOpen + lengthOpen;
      const indexCloseEnd = indexClose + lengthClose;
      throw new Error(
        `Overlapping open delimiter ${line.index}:${indexOpen}-${indexOpenEnd} and close delimiter ${line.index}:${indexClose}-${indexCloseEnd}`,
      );
    }
  }

  if (!matchOpen.done) {
    // note: don't loop to find all excess open delimiters since will return only first anyways
    const indexOpen = matchOpen.value.index!;
    openDelimiterIndices.push(indexOpen);
  } else if (!matchClose.done) {
    while (!matchClose.done) {
      const indexClose = matchClose.value.index!;

      // closing delimiter without matching opening delimiter
      if (openDelimiterIndices.length == 0) {
        return { index: indexClose + 1, delimiter: "close" };
      }

      openDelimiterIndices.pop();
      matchClose = matchesClose.next();
    }
  }

  if (openDelimiterIndices.length > 0) {
    return { index: openDelimiterIndices[0] + 1, delimiter: "open" };
  } else {
    return true;
  }
}
