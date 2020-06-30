# GITHUB API
**To run the app just type `npm i`and then `docker-compose up`**.

The backend will run on: http://localhost:4000. You can always change it
from the docker-compose file. It will also run on watch mode for better development experience.

#### **Testing**:
* Jest was used for unit testing and Supertest was used for API testing.
* two unit tests are implemented and one functional(integration) test for the Rest API, tests reside in the test folder.

 To run the test `npm run test`.
 
 All different APIs filters are implemented within the API tests, check them for clearer overview. 

#### **REST API**:

##### **Using custom stream**

This endpoint get all the repos page by page and return the result of each page on an ongoing stream. Less footprint on memory, performance and latency were the 
motivations behind this implementation. (All requests without specified amount which is top query param here are returning custom stream).
* `GET` [stream for all the repos since last week](http://localhost:4000/repos) is used to return a stream for all the repos since last week by default returned from the Github API: https://api.github.com.
* `GET` [stream for all the repos since provided date](http://localhost:4000/repos?since=2020-05-30T22:10:12Z) (UTC time here) `or since=2020-05-30` `or since=2020-05-30T22:10:12` (would result on the server time:CET)
  is used to return a stream for all the repos since provided date.
* `GET` [stream for all the repos since provided date filtered by language](http://localhost:4000/repos?since=2020-05-30T22:10:12Z&language=ts) `language=ts` used to filter based on the language.

    * Rate limiting was implemented as well as you cannot make more than 9 requests/min when using the public API.
    
    * Stream and Request **cancellation** both were implemented for a consistent behaviour and better performance.


##### **Using simple response**

As here we have a limited number this won't result on huge chunk of date and latency we could pump the result out once we have it.
* `GET` http://localhost:4000/repos?top=50 is used to return the 50 most starred repos since last week. It has several variation `top=10` and `top=100`.
* `GET` [the 50 most starred repos since the provided date](http://localhost:4000/repos?top=50&since=2020-05-30T22:10:12Z).
* `GET` [the 100 most starred repos since the provided date and filtered per programming language](http://localhost:4000/repos?top=100&since=2020-05-30T22:10:12Z&language=js).


Some General Notes:
* This project was created using typescript and does not include an explicit build step (for transpiling typescript to js), it is done using the `ts-node`
 (https://github.com/TypeStrong/ts-node) which eliminates the burden of figuring out the error line on the actual typescript file (it has a nice source map support).
* There is validation in place for the all the query params (top, since and language) flag.
* There is a docker multi-stage building for the container in different environments.
* I could use pagination as well but as it was not mentioned neither pagination nor stream I choose stream which could be integrated with observable on the frontend for real time response.
* If would invest more time I would add caching to this solution probably using redis.
#### PS: Please at the end give some technical feedback to this solution, as I invested my private time on it, I would like to get valuable feedback for my code/solution, Thanks !                                

