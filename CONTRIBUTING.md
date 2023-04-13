## Contributing



## Config

- add `merge_lines.sh` as shell command `ml`

```sh
ln -s "$PWD/scripts/merge_lines.sh" ~/.local/bin/ml
```



## Workflow

- copy superscript numbers in `abbreviations` to register
- copy ancient symbol and merged pages symbol from `dict.txt` to register
- correct a page in `dict.txt`, use `ml` to merge lines
- run checks until next line after page

```
./scripts/check.sh 99999
```

- commit with message `fix: 1/999`
