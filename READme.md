# Levels (BassSavvy.com)
BassSavvy is a fullstack web application built for fishermen by fishermen. BassSavvy aggregates lake levels and bass fishing tournaments into one convenient place for fishermen to view.

## Technologies
- JavaScript
  - jQuery
  - Node.js
  - Express.js
- HTML5
- CSS3
- Bootstrap

## Overview and Accomplishments
Before BassSavvy, fishermen had to visit several different, very dated websites to access current lake level data in their area. Additionally, bass fishing tournaments are located on a wide variety of club and organization websites and are difficult to organize for a fisherman's schedule. BassSavvy aims to bring all this info and more under one convenient roof, to be a one-stop-shop for bass fishermen everywhere. Because BassSavvy was co-created by a local fisherman who had identified the need, it has seen very high levels of growth since its launch in November of 2018. BassSavvy as of this writing boasts over 1750 total users and over 17,000 page views (February 2019). BassSavvy also currently serves 26 states in the U.S. with over 150 local lake levels.

## Features
* Users can select their state and see each lake available
* Users can select each lake and see current levels, charts of the past week, and historical data of levels, flows, dates, and times.
* Users can view all available tournaments
* Users can filter and sort tournaments by organization, location, date, and more.

## Technical Details
* Lake level data is scattered across the internet, so data for the app is sourced from a variety of locations including USGS' API, ACE's A2W API, raw html scrape, and txt file scrapes.
* Once data is obtained from the source, it is formatted and displayed for the user in different views and tables.
* All states, lakes, and tournaments are dynamically created for the user based on their respective json file and values.

## Challenges
Our greatest challenge (and what continues to be challenging) is sourcing the lake level data. Because we are sourcing data from a variety of locations, once received we must format it to work consistently with our application. Additionally, the sources we rely heavily on are not consistent with their data output. Different sources output different data structures, values, types and at inconsistent intervals (hourly, 15 minutes, etc.). On top of this, said sources lack sufficient documentation and can be prone to downtime. All of these issues we must take into consideration for each and every unique lake, which has proven to become a very difficult and complex task - even though the resulting output for the user may seem very simple at first glance.

## Future Feature Plans
* Implement a database to replace our current json data files
* Permanently store lake level data
* Add more lakes nationally
* Add more local tournaments
* Add fishing clubs/organizations pages
* User login feature
* Develop mobile application
* Tournament scheduling feature


## Test Site
The test site with the most up to date code can be located here:
* [Github Repository](https://github.com/jmyager/Levels-Test)
* [Heroku hosted test site](https://guarded-plains-88685.herokuapp.com/)

## Live Site
The full site can be located here:
* [Github Repository](https://github.com/jmyager/Levels)
* [Live Website](http://www.basssavvy.com/)