#!/usr/bin/env bash

# exit immediately with a command's exit status if it fails
set -e -u -o pipefail

# filenames of staged files
STAGED_FILES=$(git diff --name-only --cached --diff-filter=ACMR)

# continue if only dict is staged
if [[ "$STAGED_FILES" != "src/dict.txt" ]]
then
	echo "No checks since other files are staged"
	exit 0
fi

# continue if only commit message is `fix: X/Y` for last page `X/Y`
COMMIT_MSG=$(cat $1)
if [[ ! "$COMMIT_MSG" =~ ^fix:\ [123]/[0-9]+$ ]]
then
	echo "No checks since commit message isn't 'fix: X/Y'"
	exit 0
fi

# get last page argument `X/Y` from commit message
LAST_PAGE=$(echo $COMMIT_MSG | grep -Eo '[123]/[0-9]+')

echo "Checks dict before commit"

# call script/check.ts with last page as arguments
./scripts/check.ts $LAST_PAGE
