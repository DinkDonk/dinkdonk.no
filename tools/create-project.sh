#!/bin/sh

cd "${BASH_SOURCE%/*}" || exit

if [ $# -eq 0 ]
then
	echo "Please specify project name"
	exit 1
fi

mkdir -p ../assets/projects/$1
mkdir -p ../src/projects/$1

touch ../src/projects/$1/script.ts
touch ../src/projects/$1/style.css
touch ../src/projects/$1/markup.html