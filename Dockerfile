FROM golang:1.17-alpine AS builder
ENV CGO_ENABLED=0
ARG TAG
ARG COMMIT
ARG CHANGELOG
WORKDIR /backend
COPY vm/go.* .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download
COPY vm/. .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -ldflags="-s -w -X docker-blog/internal/version.Version=$TAG -X docker-blog/internal/version.GitCommit=$COMMIT" -o bin/service

FROM --platform=$BUILDPLATFORM node:17.7-alpine3.14 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="docker-blog" \
    org.opencontainers.image.description="Get the latest news, tips and tricks about Docker with this extension" \
    org.opencontainers.image.vendor="vrunoa" \
    com.docker.desktop.extension.api.version=">= 0.2.3" \
    com.docker.extension.screenshots="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="https://github.com/vrunoa/docker-extension-blog" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.changelog="$CHANGELOG" \
    com.docker.desktop.extension.icon="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png"

COPY --from=builder /backend/bin/service /
COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg .
COPY --from=client-builder /ui/build ui
CMD /service -socket /run/guest-services/extension-docker-blog.sock
