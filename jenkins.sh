#!/bin/bash
set -e

BUILD_CYPHERPUNK_COM=false
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

for i in `git diff --name-only HEAD~1`;do
	case "$i" in
		cypherpunk-com/*)
			if [ "${BUILD_CYPHERPUNK_COM}" = "false" ];then
				echo $i was changed, will build + deploy cypherpunk-com project
				BUILD_CYPHERPUNK_COM=true
			fi
		;;
		*)
			echo $i was changed, but ignoring it
		;;
	esac
done

if [ "${BUILD_CYPHERPUNK_COM}" = "true" ];then
	case "$CURRENT_BRANCH" in
		master)
			(cd cypherpunk-com/ && ./build.sh --staging)
		develop)
			(cd cypherpunk-com/ && ./build.sh)
	esac
fi

exit 0
