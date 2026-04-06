.PHONY: build serve deploy

build:
	hugo --cleanDestinationDir

serve:
	hugo server

deploy:
	./deploy.sh
