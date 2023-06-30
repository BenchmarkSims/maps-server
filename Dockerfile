# Define base container
ARG NODE_VER="20"
FROM node:${NODE_VER}-alpine

# Arguments for labels creation
ARG APPLICATION="bms-maps-server"
ARG BUILD_RFC3339="2023-06-30T13:00:00Z"
ARG REVISION="local"
ARG DESCRIPTION="A collaboration server to enable mission preparation for multiplayer missions inside Falcon BMS maps website"
ARG PACKAGE="BenchmarkSims/maps-server"
ARG VERSION="0.1.0"

# Define where application will run
ARG APP_DIR=/opt/node

# Environment variables passed through container run
ENV \
  MAPS_SERVER_PORT="3000"

# Labels creation for container
LABEL org.opencontainers.image.ref.name="${PACKAGE}" \
  org.opencontainers.image.created=$BUILD_RFC3339 \
  org.opencontainers.image.authors="MaxWaldorf" \
  org.opencontainers.image.documentation="https://github.com/${PACKAGE}/README.md" \
  org.opencontainers.image.description="${DESCRIPTION}" \
  org.opencontainers.image.licenses="GPLv3" \
  org.opencontainers.image.source="https://github.com/${PACKAGE}" \
  org.opencontainers.image.revision=$REVISION \
  org.opencontainers.image.version=$VERSION \
  org.opencontainers.image.url="https://hub.docker.com/r/${PACKAGE}/"

# Make sure curl is installed
RUN apk add --no-cache curl

# Create directory
RUN mkdir -p ${APP_DIR}

# Copy application content and proper rights
COPY source ${APP_DIR}
RUN chown -R node:node ${APP_DIR}

# Declare application directory into environment variables
ENV APP_DIR ${APP_DIR}

# Declare container run options
SHELL ["/bin/sh", "-c"]

STOPSIGNAL SIGINT

WORKDIR ${APP_DIR}
ENV NODE_DEBUG="net,http,module"

HEALTHCHECK CMD curl -f http://localhost:${MAPS_SERVER_PORT} || false

CMD node ${APP_DIR}/index.js ${MAPS_SERVER_PORT}

EXPOSE ${MAPS_SERVER_PORT}