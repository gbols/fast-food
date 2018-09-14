[![Build Status](https://travis-ci.org/gbols/fast-food.svg?branch=develop)](https://travis-ci.org/gbols/fast-food)[![Maintainability](https://api.codeclimate.com/v1/badges/63f1a09e6bd8a52a3c06/maintainability)](https://codeclimate.com/github/gbols/fast-food/maintainability)[![Test Coverage](https://api.codeclimate.com/v1/badges/63f1a09e6bd8a52a3c06/test_coverage)](https://codeclimate.com/github/gbols/fast-food/test_coverage)[![Coverage Status](https://coveralls.io/repos/github/gbols/fast-food/badge.svg)](https://coveralls.io/github/gbols/fast-food)

Fast-Food-Fast​ is a food ordering platform where users can orders for dishes.

## Features

* [x] Users can create an account and log in
* [X] A user should be able to order for food
* [X] The admin should be able to add, edit or delete the fast-food items
* [X] The admin should be able to see a list of fast-food items
* [X] The admin user should be able to do the following:
       a. See a list of orders
       b. Accept and decline orders
       c. Mark orders as completed
* [X] A user should be able to see a history of ordered food

## Technologies Used

* [NodeJS](https://nodejs.org/en/)
* [ExpressJs](https://expressjs.com/)


## Installation

Install [`node`](https://nodejs.org/en/download/), version 8 or greater

Clone the repo:
```sh
git clone https://github.com/gbols/fast-food.git```

Start server:
```sh
npm start```


## API Routes

|   HTTP VERB   | ENDPOINT                    | FUCTIONALITY                          |
| ------------- | ----------------------------| --------------------------------------|
| GET           | api/v1/orders               | Fetch all orders                      |
| GET           | api/v1/orders/:id           | Fetch a specific order                |
| POST          | api/v1/orders               | Make a new order                      |
| PUT           | api/v1/orders/:id           | Update an order status                |


Api is hosted [`here`](https://mygbols.herokuapp.com/api/v1/orders)


## UI Templates

UI is hosted [`here`](https://mygbols.herokuapp.com/api/v1/orders)
