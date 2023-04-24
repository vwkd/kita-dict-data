#!/bin/zsh

jq -r '.choices[0].message.content' "../kita-dict-gpt/responses/$(echo "$1" | sed 's/\//-/').json"
