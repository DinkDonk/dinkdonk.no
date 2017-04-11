#!/bin/sh

cd "${BASH_SOURCE%/*}" || exit

mkdir -p ../assets/projects/$1
mkdir -p ../src/projects/$1

touch ../src/projects/$1/script.ts
touch ../src/projects/$1/style.css
touch ../src/projects/$1/markup.html