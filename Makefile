IMAGE?=vrunoa/docker-blog
TAG?=0.0.0-unknown
COMMIT?=unknown-commit-sha
CHANGELOG?=

BUILDER=buildx-multi-arch

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m

build-extension: ## Build service image to be deployed as a desktop extension
	docker build --build-arg TAG=$(TAG) --build-arg COMMIT=$(COMMIT) --tag=$(IMAGE):$(TAG) .

install-extension: build-extension ## Install the extension
	docker extension install $(IMAGE):$(TAG)

update-extension: build-extension ## Update the extension
	docker extension update $(IMAGE):$(TAG)

rm-extension: ## Remove the extension
	docker extension rm $(IMAGE):$(TAG)

validate-extension:
	docker extension validate $(IMAGE):$(TAG)

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

push-extension: prepare-buildx ## Build & Upload extension image to hub. Do not push if tag already exists: make push-extension tag=0.1
	docker pull $(IMAGE):$(TAG) && echo "Failure: Tag already exists" || docker buildx build --push --builder=$(BUILDER) --platform=linux/amd64,linux/arm64 --build-arg TAG=$(TAG) --build-arg COMMIT=$(COMMIT) --build-arg CHANGELOG="$(CHANGELOG)" --tag=$(IMAGE):$(TAG) .

dev-reset:
	docker extension dev reset $(IMAGE):$(TAG)

dev-debug:
	docker extension dev debug $(IMAGE):$(TAG)

dev-ui:
	docker extension dev ui-source $(IMAGE):$(TAG)  http://localhost:3000

tail-extension:
	docker ps -f ancestor=$(IMAGE):$(TAG) -q | xargs -I{} docker logs {} -f

help: ## Show this help
	@echo Please specify a build target. The choices are:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(NO_COLOR) %s\n", $$1, $$2}'

.PHONY: help
