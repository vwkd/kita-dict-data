## Contributing



## Config

- add git commit hook

```sh
ln -s "$PWD/scripts/commit_hook.sh" .git/hooks/commit-msg
```

- add `merge_lines.sh` as shell command `ml`

```sh
ln -s "$PWD/scripts/merge_lines.ts" ~/.local/bin/ml
```

- add `fix_page.sh` as shell command `fp`

```sh
ln -s "$PWD/scripts/fix_page.sh" ~/.local/bin/fp
```



## Workflow

- copy superscript numbers in `abbreviations` to register
- copy ancient symbol and merged pages symbol from `dict.txt` to register
- correct a page in `dict.txt`, use `ml` to merge lines
- commit with message `fix: 1/999`, the checks should run automatically
