#!/bin/zsh

read page_number
echo "$page_number"
echo
jq -r '.choices[0].message.content' "../kita-dict-gpt/responses/$(echo "$page_number" | sed 's/\//-/')_openai.json"
