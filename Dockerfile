FROM node:18-alpine AS build-phase

ARG ANGULAR_ENVIRONMENT
ENV ANGULAR_ENVIRONMENT=${ANGULAR_ENVIRONMENT}

ARG BUILD_CIJOBID
ENV Build__CiJobId=${BUILD_CIJOBID}

ARG BUILD_CIPIPELINEID
ENV Build__CiPipelineId=${BUILD_CIPIPELINEID}

ARG BUILD_CICOMMITSHA
ENV Build__CiCommitSha=${BUILD_CICOMMITSHA}

ARG NODE_OPTIONS=--max-old-space-size=8192

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install \
    && mkdir /ng-app \
    && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

RUN echo "export const BUILD = {\
    jobId: '$Build__CiJobId',\
    pipelineId: '$Build__CiPipelineId',\
    ciCommitSha: '$Build__CiCommitSha'\
    }" > ./src/assets/build-variables.ts

## Build the angular app and store the artifacts in dist folder
RUN npx ng build --configuration=$ANGULAR_ENVIRONMENT

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

#RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/conf.d/* && rm -rf /etc/nginx/nginx.conf*
COPY ./nginx.conf /etc/nginx/

COPY --from=build-phase /ng-app/dist/colid-data-marketplace-frontend .

EXPOSE 8080
