FROM node:12.16.1-alpine3.10 as base

RUN mkdir -p /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

#=========================================================================
#=========================================================================

FROM base as develop

RUN rm -rf ./docker

COPY package*.json ./
COPY config config
COPY src src

RUN npm ci --quiet

#=========================================================================

#=========================================================================
FROM base as build

RUN rm -rf ./docker

COPY package*.json ./
COPY config config
COPY src src

RUN npm ci --quiet --only=production

#=========================================================================

#=========================================================================
FROM base as live
COPY --from=build /home/node/app /home/node/app
ENTRYPOINT ["node", "-r", "ts-node/register/transpile-only"]
CMD ["src/main.ts"]
#=========================================================================
