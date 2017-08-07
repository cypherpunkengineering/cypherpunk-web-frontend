#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"
URL_TARGETS=$(find target -name \*.html|sed -e 's!target/!!' -e 's!\.html$!!')
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
URL_TARGET_LIST="cypherpunk-public"
for url in ${URL_TARGETS};do
	URL_TARGET_LIST+="|${url}"
done
echo "${URL_HANDLER_TEMPLATE}"|sed -e "s@_URL_@${URL_TARGET_LIST}@g"
exit 0
