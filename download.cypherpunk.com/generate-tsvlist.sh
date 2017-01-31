#!/bin/sh
cd /data/builds
base=https://builds.cypherpunk.engineering/
(echo TsvHttpData-1.0 ; for file in `find * -type f -depth 0|grep -v list`;do
	size=`stat "${file}"|awk '{print $8}'`
	hash=`openssl dgst -md5 -binary < "$file" | openssl enc -base64`
	echo "${base}${file}	${size}	${hash}"
done) > list
