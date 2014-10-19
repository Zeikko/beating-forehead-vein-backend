# Beating Forehead Vein Backend
Backend code for a sibhack 2014 entry.
The app fetches and filters tweets from Twitter and images from Instagram and serves them as separate json services.

## Installation
	npm install

## Configuration
If you want to run the app locally place your twitter and instagram app keys and access keys to app/services/instagram.js and app/services/twitter.js

## Running
	node index.js

## Deployment to Heroku
The project is ready to be deployed to heroku like this:
Set up heroku login and download heroku CLI tool. More info: https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app

	heroku create
	git push heroku master
	heroku config:set twitter_consumer_key=XXXXX
	heroku config:set twitter_consumer_secret=XXXXX
	heroku config:set twitter_access_token=XXXXX
	heroku config:set twitter_access_token_secret=XXXXX
	heroku config:set instagram_access_token=XXXXX
	heroku config:set twitter_client_id=XXXXX
	heroku config:set twitter_client_secret=XXXXX
	heroku create
	heroku ps:scale web=1
	heroku open