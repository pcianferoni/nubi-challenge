
## Welcome!

This is a simple user api. It exposes 4 endpoints corresponding to the CRUD of users and a login endpoint with which you get an access token needed for almost all endpoints. Details of the endpoints and the required and optional parameters can be found in the [Swagger documentation](http://localhost:3000/api) after you run the service.

## Installation

```bash
$ npm install
$ npm run start
```

## Running the app with Docker Compose

```bash
# start
$ docker compose up
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```


## API Reference

#### Login

```http
  POST /auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `dni` | `string` | **Required**. Doc Number |
| `password` | `string` | **Required**. User password |


#### Create user

```http
  POST /users
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | Email of user to create |
| `name`      | `string` | Name of user to create|
| `last_name`      | `string` | Last name of user to create |
| `password`      | `string` | password of user to create |
| `sex_type`      | `string` | Gender of user to create |
| `dni`      | `string` | DNI of user to create |
| `birth_date`      | `string` | Birth date of user to create |


#### Find users

```http
  GET /users
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `string` | **Required**. accessToken of any user |
| `page`      | `query params` |  Number of page |
| `limit`      | `query params` |  Number of records per page |
| `sortBy`      | `query params` |  Sorting criteria |
| `sortDirection`      | `query params` |  Ascending or Descending |
| `match[field]`      | `query params` |  Search for a match in any user field  |


#### Update user

```http
  PATCH /users/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to update |
| `accessToken`      | `string` | **Required**. accessToken related to the user to update |
| `email`      | `string` | Email of user to update |
| `name`      | `string` | Name of user to update|
| `last_name`      | `string` | Last name of user to update |
| `sex_type`      | `string` | Gender of user to update |
| `dni`      | `string` | Doc Number of user to update |
| `birth_date`      | `string` | Birth date of user to update |



#### Delete user

```http
  DELETE /users/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to delete |
| `accessToken`      | `string` | **Required**. accessToken related to the user to delete |








## Author

- [Pablo Cianferoni](https://www.linkedin.com/in/pablo-facundo-cianferoni-boull%C3%B3n-a9a18299/)

