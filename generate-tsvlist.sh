#!/bin/sh
base=https://builds.cypherpunk.engineering/
echo TsvHttpData-1.0
for file in *;do
        size=`stat "${file}"|awk '{print $8}'`
        hash=`openssl dgst -md5 -binary < "$file" | openssl enc -base64`
        echo "${base}${file}    ${size} ${hash}"
done
