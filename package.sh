#!/bin/bash

echo "Packaging viewer"

TEMPLATE="<% if (variables) { %> \
<script> \
<%- variables %> \
</script> \
<% } %> \
"

npm run build &&

rm -rf ./ui/src/public &&

tar -C ./dist -czf ./dist/blobtoolkit-viewer.tgz public &&

mv ./dist/public ./ui/src/ &&

mkdir -p ./ui/src/views &&

rm -rf ./ui/src/views/* &&

sed 's:<!---->:'"$TEMPLATE"':' ./ui/src/public/index.html > ./ui/src/views/index.ejs &&

BTK_BASENAME=/view pkg --compress GZip ui/package.json &&

pkg --compress GZip api/package.json