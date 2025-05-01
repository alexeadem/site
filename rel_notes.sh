#!/bin/bash

_POSTS=$HOME/git/site/source/_posts
BIN=website

# usage() {

#     echo "$0 { shell | api }"
#     exit 1
# }

# if [ -z "$1" ]; then
#     usage
# elif [ "$1" = "shell" ]; then
#     BIN="shell"
# elif [ "$1" = "api" ]; then
#     :
# else
#     usage
# fi

color() {
	local codes=()
	if [ "$1" = 'bold' ]; then
		codes=("${codes[@]}" '1')
		shift
	fi
	if [ "$#" -gt 0 ]; then
		local code=
		case "$1" in
			# see https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
			black) code=30 ;;
			red) code=31 ;;
			green) code=32 ;;
			yellow) code=33 ;;
			blue) code=34 ;;
			magenta) code=35 ;;
			cyan) code=36 ;;
			white) code=37 ;;
		esac
		if [ "$code" ]; then
			codes=("${codes[@]}" "$code")
		fi
	fi
	local IFS=';'
	echo -en '\033['"${codes[*]}"'m'
}
wrap_color() {
	text="$1"
	shift
	color "$@"
	echo -n "$text"
	color reset
	echo
}

wrap_good() {
	echo "$(wrap_color "$1" white): $(wrap_color "$2" green)"
}
wrap_bad() {
	echo "$(wrap_color "$1" bold): $(wrap_color "$2" bold red)"
}
wrap_warning() {
    echo "$(wrap_color "$1" bold): $(wrap_color "$2" bold yellow)"
}


# git fetch --tags
# git version
# Get the latest and previous tags

TAGS=$(git tag --sort=-v:refname | head -n 2)

if [ -z "$TAGS" ]; then
    wrap_error "git" "no tags found."
    exit 1
fi

# echo "TAGS = $TAGS"
# Extract the latest and previous tags
LATEST_TAG=$(echo "$TAGS" | head -n 1)

wrap_good "RELEASE TAG" "$LATEST_TAG"

# RELEASE NOTES
TAG=$(echo $LATEST_TAG | sed 's/\./-/g;s/v//g')

# echo "TAG = $TAG"

MD=$(date -u +%Y-%m-%d-$BIN-$TAG-released.md)

wrap_good "Release Notes" "$MD"
# echo $MD
# exit 0
# Fetch all tags


if [ -f $_POSTS/$MD ]; then
    wrap_warning "Release notes already exists" "$MD"
    cat $_POSTS/$MD
    # release
    read -n 1 -s -r -p "<Press any key to run command>"
    printg '\n'
fi

cat <<EOF > $_POSTS/$MD
---
title: $BIN $LATEST_TAG Released
---
EOF
# RELEASE NOTES

PREVIOUS_TAG=$(echo "$TAGS" | tail -n 1)

# Check if we have at least two tags
if [ -z "$PREVIOUS_TAG" ]; then
    echo "Latest Tag: $LATEST_TAG"
    echo "Previous Tag: $PREVIOUS_TAG"
    wrap_warning "$PREVIOUS_TAG =>  $LATEST_TAG" "no commits between tags"
    code $_POSTS/$MD
    exit 0
fi


# Get the commit logs between the tags
git log  "$PREVIOUS_TAG..$LATEST_TAG" >> $_POSTS/$MD

code $_POSTS/$MD


