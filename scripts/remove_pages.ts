#!/usr/bin/env -S deno run --ext=ts --allow-read --allow-write

import { PAGES } from "https://raw.githubusercontent.com/vwkd/kita-utils/main/src/dict.ts";

/**
 * Part number
 *
 * e.g. `1`
 */
const part_number = Deno.args[0];

if (!part_number) {
  throw new Error(`Missing part number argument`);
}

const dirname = `tmp/part${part_number}`;

/**
 * Filename regex
 *
 * - note: assumes has single capture group
 *
 * e.g. `^page-(\d+)\.jpg$`
 */
// todo: validate that single capture group
const filename_re_str = Deno.args[1];

if (!filename_re_str) {
  throw new Error(`Missing filename regex argument`);
}

const filename_re = new RegExp(filename_re_str);

/**
 * Delete non-entry pages
 */
for await (const { name, isFile } of Deno.readDir(dirname)) {
  if (isFile) {
    const match = name.match(filename_re);

    if (!match) {
      console.warn(`Skipping unexpected filename '${name}'`);
      continue;
    }

    const page_number = match[1];

    if (!PAGES.includes(`${part_number}/${page_number}`)) {
      const path = `${dirname}/${name}`;
      console.log(`Deleting '${path}'`);
      await Deno.remove(path);
    }
  }
}
