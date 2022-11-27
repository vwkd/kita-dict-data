#!/usr/bin/env bash

mkdir p{1..3}
pdftoppm part1.pdf p1/p -jpeg -scale-to 2000 -progress
pdftoppm part2.pdf p2/p -jpeg -scale-to 2000 -progress
pdftoppm part3.pdf p3/p -jpeg -scale-to 2000 -progress
