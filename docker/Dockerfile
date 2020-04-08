FROM node:12.13-alpine as base

FROM base as build_utils

USER root:root
RUN apk add \
  --no-cache \
  --virtual .project-build-deps \
  python \
  make \
  g++

FROM build_utils as final

ARG SERVICE
ENV SERVICE=$SERVICE

WORKDIR /opt/app
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY package.json package-lock.json lerna.json ./
COPY packages/tsconfig.json ./packages/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
