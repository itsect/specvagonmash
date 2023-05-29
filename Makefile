include .env

.PHONY: help build watch

CURRENT_DIR := $(shell pwd)

help:
	@echo "[ENV SETUP]"

build:
	@echo "[Building SpecVagonMash Docker image]"
	docker build -t specvagonmash .

watch:
	@echo "[Running SpecVagonMash Docker]"
	docker run --rm -it -v ${CURRENT_DIR}/src:/app/src -p 3000:3000 specvagonmash