#!/usr/bin/env bash

# exit immediately with a command's exit status if it fails
set -e -u -o pipefail

commit_ids=$(git log -P --grep "^fix: $1$" --format=format:%H)

if [ -z "$commit_ids" ]; then
    echo "Error: No commit for page number '$1'."
    exit 1
fi

num_of_commits=$(echo "$commit_ids" | wc -l)

if [ "$num_of_commits" -gt 1 ]; then
    echo "Error: Multiple commits for page number '$1'."
    exit 1
fi

git commit --fixup $commit_ids