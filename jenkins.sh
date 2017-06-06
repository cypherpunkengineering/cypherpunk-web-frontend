#!/bin/bash

BUILD_CYPHERPUNK_COM=false

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
	(cd cypherpunk-com/ && ./build.sh)
fi

exit 0
