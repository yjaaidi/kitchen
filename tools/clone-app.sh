#!/usr/bin/env sh

set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <source-app> <destination-app>"
  exit 1
fi

# Remove "apps/" from the source and destination
# as we want to allow passing the full path to the app.
SOURCE="${1#apps/}"
DESTINATION="${2#apps/}"

cp -r apps/$SOURCE apps/$DESTINATION
cd apps/$DESTINATION
sed -i '' "s/$SOURCE/$DESTINATION/g" project.json
