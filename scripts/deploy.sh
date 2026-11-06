#!/usr/bin/env bash
# Build the static site and upload it to davidb.iiens.net with scp.
#
#   npm run deploy                          # build the deploy/ folder only, to check it
#   npm run deploy -- login@host:folder     # build it and upload it there
#
# Layout of deploy/:
#   /            the new site (static export of `npm run build`)
#   /oldsite/    the previous site, copied from $OLD_SITE (default: ../site-baptiste)
#   /portfolio/  redirects from the previous site's article URLs to the new pages
#   index.php    serves index.html, in case the server prefers index.php (it also
#                replaces the previous site's index.php, which redirected to /portfolio)
set -euo pipefail
cd "$(dirname "$0")/.."

DEST="${1:-}"
OLD_SITE="${OLD_SITE:-../site-baptiste}"

npm run build
rm -rf deploy
cp -r build deploy

mkdir deploy/oldsite
cp -r "$OLD_SITE"/. deploy/oldsite/
find deploy -name '*:Zone.Identifier' -delete
rm -rf deploy/oldsite/Analyse_Financiere/__pycache__

echo '<?php readfile(__DIR__ . "/index.html");' > deploy/index.php

# Old article URLs (linked from the CV, search engines…) land on the new pages.
mkdir deploy/portfolio
while read -r old new; do
	cat > "deploy/portfolio/$old" <<HTML
<!doctype html>
<meta charset="utf-8" />
<meta http-equiv="refresh" content="0; url=$new" />
<link rel="canonical" href="$new" />
<a href="$new">This page has moved.</a>
HTML
done <<'MAP'
index.html /
hobbies.html /hobbies/
article_autobattle.html /projects/autobattle/
article_awale.html /projects/awale/
article_blender.html /projects/modeling/
article_fps_competitif.html /projects/fps/
article_Sign_VR.html /projects/sign-vr/
article_toastercat.html /projects/toastercat/
MAP

du -sh deploy
if [ -n "$DEST" ]; then
	scp -r deploy/. "$DEST"
	echo "Uploaded to $DEST"
else
	echo "deploy/ is ready. Upload it with: npm run deploy -- login@host:folder"
fi
