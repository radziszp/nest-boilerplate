#!/bin/sh

npm install \
  --no-optional
npx lerna bootstrap

cd packages/$SERVICE

exec "$@"
