#!/bin/sh

set -e

echo "💤 Waiting for hitobito to be ready! This can take a few minutes until the database is seeded."
npx -q wait-on "${CYPRESS_BASE_URL}"
echo "✅ Hitobito is ready!"

echo "➡️ Handing control over to 'cypress $*'"

exec cypress "$@"
