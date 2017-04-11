#!/bin/sh

cd "${BASH_SOURCE%/*}/../" || exit

npm run build

echo 'github.dinkdonk.no' > build/CNAME

git checkout -b gh-pages
git add -f build
git commit -m 'Deploy to gh-pages'
git push origin `git subtree split --prefix build`:gh-pages --force
git checkout master
git branch -D gh-pages