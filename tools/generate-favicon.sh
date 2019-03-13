#!/bin/sh

# Requires GraphicsMagick and Inkscape

cd "${BASH_SOURCE%/*}" || exit

mkdir -p ../build

FILTER=Lanczos2Sharp
INTERPOLATE=Mesh
SHARPEN=0x0.5

rm -fR generate-icon-tmp
mkdir generate-icon-tmp

convert -density 720 -background none ../assets/images/favicon.svg -depth 8 -channel RGBA generate-icon-tmp/favicon.png

convert generate-icon-tmp/favicon.png -interpolate $INTERPOLATE -filter $FILTER -resize 16x16 -sharpen $SHARPEN generate-icon-tmp/favicon-16.png
convert generate-icon-tmp/favicon.png -interpolate $INTERPOLATE -filter $FILTER -resize 24x24 -sharpen $SHARPEN generate-icon-tmp/favicon-24.png
convert generate-icon-tmp/favicon.png -interpolate $INTERPOLATE -filter $FILTER -resize 32x32 -sharpen $SHARPEN generate-icon-tmp/favicon-32.png
convert generate-icon-tmp/favicon.png -interpolate $INTERPOLATE -filter $FILTER -resize 48x48 -sharpen $SHARPEN generate-icon-tmp/favicon-48.png
convert generate-icon-tmp/favicon.png -interpolate $INTERPOLATE -filter $FILTER -resize 64x64 -sharpen $SHARPEN generate-icon-tmp/favicon-64.png

convert generate-icon-tmp/favicon-64.png generate-icon-tmp/favicon-48.png generate-icon-tmp/favicon-32.png generate-icon-tmp/favicon-24.png generate-icon-tmp/favicon-16.png -depth 8 -channel RGBA ../build/favicon.ico

rm -R generate-icon-tmp