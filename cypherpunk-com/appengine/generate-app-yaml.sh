#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"

# search for all html files
URL_TARGETS=$(find target -name \*.html|sed -e 's!target/!!' -e 's!\.html$!!')
# make a template to handle all the html files
URL_HANDLER_TEMPLATE="
- url: /(_URL_)
  static_files: target/\1.html
  upload: target/(.*).html
  expiration: \"10m\"
  secure: always
  login: admin
  redirect_http_response_code: 301
  http_headers:
    X-Frame-Options: sameorigin
    X-Content-Type-Options: nosniff
    Strict-Transport-Security: max-age=13370000; includeSubDomains; preload
"

# generate list of targets
URL_TARGET_LIST="cypherpunk-public"
for url in ${URL_TARGETS};do
	URL_TARGET_LIST+="|${url}"
done

# output big handler for all the files
echo "${URL_HANDLER_TEMPLATE}"|sed -e "s@_URL_@${URL_TARGET_LIST}@g"

#done
exit 0
