# AutoVelo Backend API Documentation

## Base URL

```
http://localhost:4000
```

> The port is configured via the `PORT` environment variable (default: `3000`).

---

## User Endpoints

### Register User

Creates a new user account and returns a JWT authentication token.

**URL:** `/users/register`

**Method:** `POST`

**Content-Type:** `application/json`

---

#### Request Body

| Field                  | Type     | Required | Validation                              |
| ---------------------- | -------- | -------- | --------------------------------------- |
| `fullname.firstname`   | `string` | ✅ Yes   | Minimum 3 characters                    |
| `fullname.lastname`    | `string` | ❌ No    | Minimum 3 characters (if provided)      |
| `email`                | `string` | ✅ Yes   | Must be a valid email, minimum 5 chars  |
| `password`             | `string` | ✅ Yes   | Minimum 6 characters                    |

#### Example Request

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Minimal Request (without optional fields)

```json
{
  "fullname": {
    "firstname": "John"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

#### Responses

##### ✅ 201 Created — Registration Successful

Returned when the user is successfully registered.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "__v": 0
  }
}
```

| Field   | Type     | Description                                      |
| ------- | -------- | ------------------------------------------------ |
| `token` | `string` | JWT token valid for 24 hours, used for auth       |
| `user`  | `object` | The created user object (password is excluded)    |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when one or more fields fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "Jo",
      "msg": "First name must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "Password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

---

##### ❌ 400 Bad Request — User Already Exists

Returned when a user with the given email is already registered.

```json
{
  "message": "User already exist"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `201`       | User created successfully, returns token and user    |
| `400`       | Validation failed or user with this email exists     |

---

#### cURL Example

```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

---

#### Notes

- The password is **hashed with bcrypt** (10 salt rounds) before being stored in the database.
- The password field is excluded from query results by default (`select: false` on the schema).
- The JWT token is signed using the `JWT_SECRET` environment variable and expires in **24 hours**.
- The `email` field has a **unique constraint** in the database — duplicate emails are rejected.

---

### Login User

Authenticates an existing user with email and password, and returns a JWT token.

**URL:** `/users/login`

**Method:** `POST`

**Content-Type:** `application/json`

---

#### Request Body

| Field      | Type     | Required | Validation                             |
| ---------- | -------- | -------- | -------------------------------------- |
| `email`    | `string` | ✅ Yes   | Must be a valid email                  |
| `password` | `string` | ✅ Yes   | Minimum 6 characters                   |

#### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

#### Responses

##### ✅ 200 OK — Login Successful

Returned when the credentials are valid. A `token` cookie is also set on the response.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "__v": 0
  }
}
```

| Field   | Type     | Description                                      |
| ------- | -------- | ------------------------------------------------ |
| `token` | `string` | JWT token valid for 24 hours, used for auth       |
| `user`  | `object` | The authenticated user object                     |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when the email or password fields fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "Password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

---

##### ❌ 401 Unauthorized — Invalid Credentials

Returned when the email does not exist or the password does not match.

```json
{
  "message": "Invalid email or password"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Login successful, returns token and user             |
| `400`       | Validation failed (invalid email format or short password) |
| `401`       | Email not found or password does not match           |

---

#### cURL Example

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

---

#### Notes

- The password is compared against the stored bcrypt hash using `bcrypt.compare()`.
- On success, a `token` cookie is set on the response in addition to returning the token in the JSON body.
- The JWT token is signed using the `JWT_SECRET` environment variable and expires in **24 hours**.

---

### Get User Profile

Returns the authenticated user's profile information. Requires a valid JWT token.

**URL:** `/users/profile`

**Method:** `GET`

**Authentication:** 🔒 Required

---

#### Headers

| Header          | Value                  | Required | Description                          |
| --------------- | ---------------------- | -------- | ------------------------------------ |
| `Authorization` | `Bearer <token>`       | ✅ Yes*  | JWT token from login/register        |
| `Cookie`        | `token=<token>`        | ✅ Yes*  | Alternative: token set via cookie    |

> \* At least one of `Authorization` header or `token` cookie must be provided.

---

#### Responses

##### ✅ 200 OK — Profile Retrieved

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
  "__v": 0
}
```

---

##### ❌ 401 Unauthorized

Returned when no token is provided, the token is invalid/expired, or the token has been blacklisted.

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Profile returned successfully                        |
| `401`       | Missing, invalid, expired, or blacklisted token      |

---

#### cURL Example

```bash
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- The middleware checks for the token in both `req.cookies.token` and the `Authorization: Bearer <token>` header.
- Blacklisted tokens (from logout) are rejected even if they haven't expired.
- The password field is **never** included in the response (`select: false` on the schema).

---

### Logout User

Logs out the authenticated user by blacklisting the current JWT token and clearing the token cookie.

**URL:** `/users/logout`

**Method:** `GET`

**Authentication:** 🔒 Required

---

#### Headers

| Header          | Value                  | Required | Description                          |
| --------------- | ---------------------- | -------- | ------------------------------------ |
| `Authorization` | `Bearer <token>`       | ✅ Yes*  | JWT token from login/register        |
| `Cookie`        | `token=<token>`        | ✅ Yes*  | Alternative: token set via cookie    |

> \* At least one of `Authorization` header or `token` cookie must be provided.

---

#### Responses

##### ✅ 200 OK — Logout Successful

The token is added to the blacklist and the `token` cookie is cleared.

```json
{
  "message": "Logged out"
}
```

---

##### ❌ 401 Unauthorized

Returned when no token is provided, the token is invalid/expired, or the token has already been blacklisted.

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Logout successful, token blacklisted                 |
| `401`       | Missing, invalid, expired, or blacklisted token      |

---

#### cURL Example

```bash
curl -X GET http://localhost:4000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- The token is stored in the `BlacklistToken` collection with a TTL of **24 hours** (`expires: 86400`), matching the JWT expiry. MongoDB automatically removes expired blacklist entries.
- The `token` cookie is cleared from the response using `res.clearCookie('token')`.
- Once a token is blacklisted, any subsequent request using that token will receive a `401 Unauthorized` response.

---

## Captain Endpoints

### Register Captain

Creates a new captain (driver) account with vehicle information and returns a JWT authentication token.

**URL:** `/captains/register`

**Method:** `POST`

**Content-Type:** `application/json`

---

#### Request Body

| Field                  | Type     | Required | Validation                                       |
| ---------------------- | -------- | -------- | ------------------------------------------------ |
| `fullname.firstname`   | `string` | ✅ Yes   | Minimum 3 characters                             |
| `fullname.lastname`    | `string` | ❌ No    | Minimum 3 characters (if provided)               |
| `email`                | `string` | ✅ Yes   | Must be a valid email                            |
| `password`             | `string` | ✅ Yes   | Minimum 6 characters                             |
| `vehicle.color`        | `string` | ✅ Yes   | Minimum 3 characters                             |
| `vehicle.plate`        | `string` | ✅ Yes   | Minimum 3 characters                             |
| `vehicle.capacity`     | `number` | ✅ Yes   | Minimum 1                                        |
| `vehicle.vehicleType`  | `string` | ✅ Yes   | Must be one of: `car`, `motorcycle`, `auto`      |

#### Example Request

```json
{
  "fullname": {
    "firstname": "Alex",
    "lastname": "Smith"
  },
  "email": "alex.smith@example.com",
  "password": "driver123",
  "vehicle": {
    "color": "Black",
    "plate": "MH01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Minimal Request (without optional fields)

```json
{
  "fullname": {
    "firstname": "Alex"
  },
  "email": "alex.smith@example.com",
  "password": "driver123",
  "vehicle": {
    "color": "Red",
    "plate": "MH02XY5678",
    "capacity": 2,
    "vehicleType": "motorcycle"
  }
}
```

---

#### Responses

##### ✅ 201 Created — Registration Successful

Returned when the captain is successfully registered.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "fullname": {
      "firstname": "Alex",
      "lastname": "Smith"
    },
    "email": "alex.smith@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "MH01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
    "__v": 0
  }
}
```

| Field     | Type     | Description                                      |
| --------- | -------- | ------------------------------------------------ |
| `token`   | `string` | JWT token valid for 24 hours, used for auth       |
| `captain` | `object` | The created captain object (password is excluded) |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when one or more fields fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "Al",
      "msg": "First name must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    },
    {
      "type": "field",
      "value": "truck",
      "msg": "Invalid vehicle type",
      "path": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

---

##### ❌ 400 Bad Request — Captain Already Exists

Returned when a captain with the given email is already registered.

```json
{
  "message": "Captain already exist"
}
```

---

#### Status Codes Summary

| Status Code | Description                                             |
| ----------- | ------------------------------------------------------- |
| `201`       | Captain created successfully, returns token and captain |
| `400`       | Validation failed or captain with this email exists     |

---

#### cURL Example

```bash
curl -X POST http://localhost:4000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Alex",
      "lastname": "Smith"
    },
    "email": "alex.smith@example.com",
    "password": "driver123",
    "vehicle": {
      "color": "Black",
      "plate": "MH01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

---

#### Notes

- The password is **hashed with bcrypt** (10 salt rounds) before being stored in the database.
- The password field is excluded from query results by default (`select: false` on the schema).
- The JWT token is signed using the `JWT_SECRET` environment variable and expires in **24 hours**.
- The `email` field has a **unique constraint** and is stored in **lowercase**.
- The captain's `status` defaults to `"inactive"` upon registration.
- Allowed `vehicleType` values are: `car`, `motorcycle`, `auto`.
- The `location` field (with `ltd` and `lng`) is part of the schema but is **not set during registration** — it is updated when the captain goes online.

---

### Login Captain

Authenticates an existing captain with email and password, and returns a JWT token.

**URL:** `/captains/login`

**Method:** `POST`

**Content-Type:** `application/json`

---

#### Request Body

| Field      | Type     | Required | Validation                             |
| ---------- | -------- | -------- | -------------------------------------- |
| `email`    | `string` | ✅ Yes   | Must be a valid email                  |
| `password` | `string` | ✅ Yes   | Minimum 6 characters                   |

#### Example Request

```json
{
  "email": "alex.smith@example.com",
  "password": "driver123"
}
```

---

#### Responses

##### ✅ 200 OK — Login Successful

Returned when the credentials are valid. A `token` cookie is also set on the response.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "fullname": {
      "firstname": "Alex",
      "lastname": "Smith"
    },
    "email": "alex.smith@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "MH01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
    "__v": 0
  }
}
```

| Field     | Type     | Description                                      |
| --------- | -------- | ------------------------------------------------ |
| `token`   | `string` | JWT token valid for 24 hours, used for auth       |
| `captain` | `object` | The authenticated captain object                  |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when the email or password fields fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "Password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

---

##### ❌ 401 Unauthorized — Invalid Credentials

Returned when the email does not exist or the password does not match.

```json
{
  "message": "Invalid email or password"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Login successful, returns token and captain          |
| `400`       | Validation failed (invalid email format or short password) |
| `401`       | Email not found or password does not match           |

---

#### cURL Example

```bash
curl -X POST http://localhost:4000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.smith@example.com",
    "password": "driver123"
  }'
```

---

#### Notes

- The password is compared against the stored bcrypt hash using `bcrypt.compare()`.
- On success, a `token` cookie is set on the response in addition to returning the token in the JSON body.
- The JWT token is signed using the `JWT_SECRET` environment variable and expires in **24 hours**.

---

### Get Captain Profile

Returns the authenticated captain's profile information. Requires a valid JWT token.

**URL:** `/captains/profile`

**Method:** `GET`

**Authentication:** 🔒 Required (Captain)

---

#### Headers

| Header          | Value                  | Required | Description                          |
| --------------- | ---------------------- | -------- | ------------------------------------ |
| `Authorization` | `Bearer <token>`       | ✅ Yes*  | JWT token from login/register        |
| `Cookie`        | `token=<token>`        | ✅ Yes*  | Alternative: token set via cookie    |

> \* At least one of `Authorization` header or `token` cookie must be provided.

---

#### Responses

##### ✅ 200 OK — Profile Retrieved

```json
{
  "captain": {
    "fullname": {
      "firstname": "Alex",
      "lastname": "Smith"
    },
    "email": "alex.smith@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "MH01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
    "__v": 0
  }
}
```

> **Note:** The profile response wraps the captain data inside a `captain` key, unlike the user profile endpoint which returns the user object directly.

---

##### ❌ 401 Unauthorized

Returned when no token is provided, the token is invalid/expired, or the token has been blacklisted.

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Captain profile returned successfully                |
| `401`       | Missing, invalid, expired, or blacklisted token      |

---

#### cURL Example

```bash
curl -X GET http://localhost:4000/captains/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- Uses the `authCaptain` middleware, which verifies the token and looks up the captain by `_id`.
- Blacklisted tokens (from logout) are rejected even if they haven't expired.
- The password field is **never** included in the response (`select: false` on the schema).

---

### Logout Captain

Logs out the authenticated captain by blacklisting the current JWT token and clearing the token cookie.

**URL:** `/captains/logout`

**Method:** `GET`

**Authentication:** 🔒 Required (Captain)

---

#### Headers

| Header          | Value                  | Required | Description                          |
| --------------- | ---------------------- | -------- | ------------------------------------ |
| `Authorization` | `Bearer <token>`       | ✅ Yes*  | JWT token from login/register        |
| `Cookie`        | `token=<token>`        | ✅ Yes*  | Alternative: token set via cookie    |

> \* At least one of `Authorization` header or `token` cookie must be provided.

---

#### Responses

##### ✅ 200 OK — Logout Successful

The token is added to the blacklist and the `token` cookie is cleared.

```json
{
  "message": "Logout successfully"
}
```

> **Note:** The logout message is `"Logout successfully"` (differs from user logout which returns `"Logged out"`).

---

##### ❌ 401 Unauthorized

Returned when no token is provided, the token is invalid/expired, or the token has already been blacklisted.

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Logout successful, token blacklisted                 |
| `401`       | Missing, invalid, expired, or blacklisted token      |

---

#### cURL Example

```bash
curl -X GET http://localhost:4000/captains/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- The token is stored in the `BlacklistToken` collection with a TTL of **24 hours** (`expires: 86400`), matching the JWT expiry. MongoDB automatically removes expired blacklist entries.
- The `token` cookie is cleared from the response using `res.clearCookie('token')`.
- Once a token is blacklisted, any subsequent request using that token will receive a `401 Unauthorized` response.
- Uses the `authCaptain` middleware for authentication (separate from `authUser`).

---

## Maps Endpoints

> All Maps endpoints require **user authentication** (`authUser` middleware). Provide a valid JWT token via the `Authorization: Bearer <token>` header or the `token` cookie.

---

### Get Coordinates

Geocodes a street address into latitude/longitude coordinates using the Google Maps Geocoding API.

**URL:** `/maps/get-coordinates`

**Method:** `GET`

**Authentication:** 🔒 Required (User)

---

#### Query Parameters

| Parameter | Type     | Required | Validation                       |
| --------- | -------- | -------- | -------------------------------- |
| `address` | `string` | ✅ Yes   | Must be a string, minimum 3 characters |

#### Example Request

```
GET /maps/get-coordinates?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA
```

---

#### Responses

##### ✅ 200 OK — Coordinates Retrieved

```json
{
  "ltd": 37.4224764,
  "lng": -122.0842499
}
```

| Field | Type     | Description                          |
| ----- | -------- | ------------------------------------ |
| `ltd` | `number` | Latitude of the address              |
| `lng` | `number` | Longitude of the address             |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when the `address` query parameter fails validation (missing or less than 3 characters).

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Invalid value",
      "path": "address",
      "location": "query"
    }
  ]
}
```

---

##### ❌ 404 Not Found — Coordinates Not Found

Returned when the Google Maps API cannot geocode the given address.

```json
{
  "message": "Coordinates not found"
}
```

---

##### ❌ 401 Unauthorized

Returned when no valid token is provided.

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Coordinates returned successfully                    |
| `400`       | Validation failed (missing or invalid address)       |
| `401`       | Missing, invalid, expired, or blacklisted token      |
| `404`       | Address could not be geocoded                        |

---

#### cURL Example

```bash
curl -X GET "http://localhost:4000/maps/get-coordinates?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- Uses the **Google Maps Geocoding API** under the hood (`maps.googleapis.com/maps/api/geocode/json`).
- The `GOOGLE_MAPS_API` environment variable must be set with a valid API key.
- The field `ltd` stands for latitude (not a typo in the API — maintained for backward compatibility).

---

### Get Distance and Time

Calculates the travel distance and estimated travel time between an origin and destination using the Google Maps Distance Matrix API.

**URL:** `/maps/get-distance-time`

**Method:** `GET`

**Authentication:** 🔒 Required (User)

---

#### Query Parameters

| Parameter     | Type     | Required | Validation                       |
| ------------- | -------- | -------- | -------------------------------- |
| `origin`      | `string` | ✅ Yes   | Must be a string, minimum 3 characters |
| `destination` | `string` | ✅ Yes   | Must be a string, minimum 3 characters |

#### Example Request

```
GET /maps/get-distance-time?origin=New+York,+NY&destination=Los+Angeles,+CA
```

---

#### Responses

##### ✅ 200 OK — Distance and Time Retrieved

Returns the distance and duration from the Google Maps Distance Matrix API response element.

```json
{
  "distance": {
    "text": "2,775 mi",
    "value": 4467292
  },
  "duration": {
    "text": "1 day 16 hours",
    "value": 144000
  },
  "status": "OK"
}
```

| Field              | Type     | Description                              |
| ------------------ | -------- | ---------------------------------------- |
| `distance.text`    | `string` | Human-readable distance string           |
| `distance.value`   | `number` | Distance in **meters**                   |
| `duration.text`    | `string` | Human-readable duration string           |
| `duration.value`   | `number` | Duration in **seconds**                  |
| `status`           | `string` | Element-level status from the API        |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when query parameters fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Invalid value",
      "path": "origin",
      "location": "query"
    }
  ]
}
```

---

##### ❌ 500 Internal Server Error

Returned when the Google Maps API returns a non-OK status or no routes are found.

```json
{
  "message": "Internal server error"
}
```

---

##### ❌ 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Distance and time returned successfully              |
| `400`       | Validation failed (missing or invalid parameters)    |
| `401`       | Missing, invalid, expired, or blacklisted token      |
| `500`       | Google Maps API error or no routes found             |

---

#### cURL Example

```bash
curl -X GET "http://localhost:4000/maps/get-distance-time?origin=New+York,+NY&destination=Los+Angeles,+CA" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- Uses the **Google Maps Distance Matrix API** (`maps.googleapis.com/maps/api/distancematrix/json`).
- If the API returns `ZERO_RESULTS` for the element, the service throws a `"No routes found"` error.
- Both `origin` and `destination` can be addresses or place names — the API handles geocoding internally.

---

### Get Auto-Complete Suggestions

Returns place name suggestions based on a partial text input using the Google Maps Places Autocomplete API.

**URL:** `/maps/get-suggestions`

**Method:** `GET`

**Authentication:** 🔒 Required (User)

---

#### Query Parameters

| Parameter | Type     | Required | Validation                       |
| --------- | -------- | -------- | -------------------------------- |
| `input`   | `string` | ✅ Yes   | Must be a string, minimum 3 characters |

#### Example Request

```
GET /maps/get-suggestions?input=Connaught+Place
```

---

#### Responses

##### ✅ 200 OK — Suggestions Retrieved

Returns an array of place description strings.

```json
[
  "Connaught Place, New Delhi, Delhi, India",
  "Connaught Place, Dehradun, Uttarakhand, India",
  "Connaught Road Central, Hong Kong"
]
```

> The response is a flat JSON array of strings (not objects). Each string is the `description` field from the Google Places Autocomplete prediction.

---

##### ❌ 400 Bad Request — Validation Errors

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Invalid value",
      "path": "input",
      "location": "query"
    }
  ]
}
```

---

##### ❌ 500 Internal Server Error

Returned when the Google Maps API returns a non-OK status.

```json
{
  "message": "Internal server error"
}
```

---

##### ❌ 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Suggestions returned successfully                    |
| `400`       | Validation failed (missing or invalid input)         |
| `401`       | Missing, invalid, expired, or blacklisted token      |
| `500`       | Google Maps API error                                |

---

#### cURL Example

```bash
curl -X GET "http://localhost:4000/maps/get-suggestions?input=Connaught+Place" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- Uses the **Google Maps Places Autocomplete API** (`maps.googleapis.com/maps/api/place/autocomplete/json`).
- Only the `description` field from each prediction is returned; empty/falsy descriptions are filtered out.
- The `GOOGLE_MAPS_API` environment variable must be set with a valid API key that has the **Places API** enabled.

---

## Ride Endpoints

---

### Create Ride

Creates a new ride request for the authenticated user. The fare is automatically calculated based on the pickup/destination distance and the selected vehicle type.

**URL:** `/rides/create`

**Method:** `POST`

**Content-Type:** `application/json`

**Authentication:** 🔒 Required (User)

---

#### Headers

| Header          | Value                  | Required | Description                          |
| --------------- | ---------------------- | -------- | ------------------------------------ |
| `Authorization` | `Bearer <token>`       | ✅ Yes*  | JWT token from login/register        |
| `Cookie`        | `token=<token>`        | ✅ Yes*  | Alternative: token set via cookie    |

> \* At least one of `Authorization` header or `token` cookie must be provided.

---

#### Request Body

| Field         | Type     | Required | Validation                                            |
| ------------- | -------- | -------- | ----------------------------------------------------- |
| `pickup`      | `string` | ✅ Yes   | Minimum 3 characters                                  |
| `destination` | `string` | ✅ Yes   | Minimum 3 characters                                  |
| `vehicleType` | `string` | ✅ Yes   | Must be one of: `auto`, `car`, `moto`                 |

#### Example Request

```json
{
  "pickup": "562/11-A, Connaught Place, New Delhi",
  "destination": "India Gate, New Delhi",
  "vehicleType": "car"
}
```

---

#### Responses

##### ✅ 201 Created — Ride Created Successfully

```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e3",
  "user": "64a1b2c3d4e5f6a7b8c9d0e1",
  "pickup": "562/11-A, Connaught Place, New Delhi",
  "destination": "India Gate, New Delhi",
  "fare": 95,
  "status": "pending",
  "otp": "482937",
  "duration": null,
  "distance": null,
  "paymentID": null,
  "orderId": null,
  "signature": null,
  "__v": 0
}
```

| Field         | Type     | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `_id`         | `string` | Unique ride identifier (MongoDB ObjectId)        |
| `user`        | `string` | ObjectId of the user who created the ride        |
| `pickup`      | `string` | Pickup address                                   |
| `destination` | `string` | Destination address                              |
| `fare`        | `number` | Calculated fare for the selected vehicle type    |
| `status`      | `string` | Ride status, defaults to `"pending"`             |
| `otp`         | `string` | 6-digit OTP for ride verification                |
| `duration`    | `number` | Trip duration in seconds (set later)             |
| `distance`    | `number` | Trip distance in meters (set later)              |
| `paymentID`   | `string` | Payment ID (set after payment)                   |
| `orderId`     | `string` | Order ID (set after payment)                     |
| `signature`   | `string` | Payment signature (set after payment)            |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when one or more fields fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "AB",
      "msg": "Invalid pickup address",
      "path": "pickup",
      "location": "body"
    },
    {
      "type": "field",
      "value": "truck",
      "msg": "Invalid vehicle type",
      "path": "vehicleType",
      "location": "body"
    }
  ]
}
```

---

##### ❌ 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

##### ❌ 500 Internal Server Error

Returned when fare calculation fails (e.g., Google Maps API error, no routes found, or missing fields).

```json
{
  "message": "Unable to fetch distance and time"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `201`       | Ride created successfully                            |
| `400`       | Validation failed (invalid fields)                   |
| `401`       | Missing, invalid, expired, or blacklisted token      |
| `500`       | Internal error (fare calculation or DB failure)      |

---

#### cURL Example

```bash
curl -X POST http://localhost:4000/rides/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "pickup": "562/11-A, Connaught Place, New Delhi",
    "destination": "India Gate, New Delhi",
    "vehicleType": "car"
  }'
```

---

#### Notes

- The **fare is automatically calculated** using the Google Maps Distance Matrix API:
  - **Base fare:** auto = ₹30, car = ₹50, moto = ₹20
  - **Per km rate:** auto = ₹10, car = ₹15, moto = ₹8
  - **Per minute rate:** auto = ₹2, car = ₹3, moto = ₹1.5
  - **Formula:** `fare = baseFare + (distance_km × perKmRate) + (duration_min × perMinuteRate)` (rounded)
- A **6-digit OTP** is generated using `crypto.randomInt()` and stored with the ride.
- The OTP field has `select: false` on the schema, so it is **not returned** in normal queries — only when explicitly selected with `.select('+otp')`.
- The ride `status` defaults to `"pending"` and progresses through: `pending → accepted → ongoing → completed` (or `cancelled`).
- The `captain` field is initially `null` and is assigned when a captain accepts the ride.
- The `GOOGLE_MAPS_API` environment variable must be set for fare calculation to work.

---

### Get Fare

Returns the estimated fare for all vehicle types (`auto`, `car`, `moto`) based on the pickup and destination addresses. Uses the Google Maps Distance Matrix API to calculate distance and duration, then applies per-type pricing.

**URL:** `/rides/get-fare`

**Method:** `GET`

**Authentication:** 🔒 Required (User)

---

#### Headers

| Header          | Value                  | Required | Description                          |
| --------------- | ---------------------- | -------- | ------------------------------------ |
| `Authorization` | `Bearer <token>`       | ✅ Yes*  | JWT token from login/register        |
| `Cookie`        | `token=<token>`        | ✅ Yes*  | Alternative: token set via cookie    |

> \* At least one of `Authorization` header or `token` cookie must be provided.

---

#### Query Parameters

| Parameter     | Type     | Required | Validation                                  |
| ------------- | -------- | -------- | ------------------------------------------- |
| `pickup`      | `string` | ✅ Yes   | Minimum 3 characters                        |
| `destination` | `string` | ✅ Yes   | Minimum 3 characters                        |

#### Example Request

```
GET /rides/get-fare?pickup=Connaught+Place,+New+Delhi&destination=India+Gate,+New+Delhi
```

---

#### Responses

##### ✅ 200 OK — Fare Estimates Retrieved

Returns an object with the calculated fare for each vehicle type.

```json
{
  "auto": 65,
  "car": 95,
  "moto": 48
}
```

| Field  | Type     | Description                                      |
| ------ | -------- | ------------------------------------------------ |
| `auto` | `number` | Estimated fare for an auto (₹), rounded          |
| `car`  | `number` | Estimated fare for a car (₹), rounded            |
| `moto` | `number` | Estimated fare for a motorcycle (₹), rounded     |

---

##### ❌ 400 Bad Request — Validation Errors

Returned when query parameters fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "AB",
      "msg": "Invalid pickup address",
      "path": "pickup",
      "location": "query"
    },
    {
      "type": "field",
      "value": "",
      "msg": "Invalid destination address",
      "path": "destination",
      "location": "query"
    }
  ]
}
```

---

##### ❌ 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

##### ❌ 500 Internal Server Error

Returned when fare calculation fails (e.g., Google Maps API error, no routes found between locations).

```json
{
  "message": "Unable to fetch distance and time"
}
```

---

#### Status Codes Summary

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `200`       | Fare estimates returned successfully                 |
| `400`       | Validation failed (invalid pickup or destination)    |
| `401`       | Missing, invalid, expired, or blacklisted token      |
| `500`       | Internal error (Google Maps API or calculation)      |

---

#### cURL Example

```bash
curl -X GET "http://localhost:4000/rides/get-fare?pickup=Connaught+Place,+New+Delhi&destination=India+Gate,+New+Delhi" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Notes

- The fare is calculated using the **Google Maps Distance Matrix API** to get actual road distance and estimated travel time.
- **Pricing formula per vehicle type:**
  - `fare = baseFare + (distance_km × perKmRate) + (duration_min × perMinuteRate)` (rounded to nearest integer)
- **Rate card:**

  | Vehicle | Base Fare | Per Km | Per Minute |
  | ------- | --------- | ------ | ---------- |
  | `auto`  | ₹30       | ₹10    | ₹2.0       |
  | `car`   | ₹50       | ₹15    | ₹3.0       |
  | `moto`  | ₹20       | ₹8     | ₹1.5       |

- All three fare types are returned in a single response so the frontend can display options side-by-side.
- This endpoint does **not** create a ride — it is a read-only fare estimation. Use `POST /rides/create` to book.

---

## API Endpoints Summary

### User Endpoints

| Method | Endpoint            | Auth     | Description                  |
| ------ | ------------------- | -------- | ---------------------------- |
| POST   | `/users/register`   | ❌ None  | Register a new user          |
| POST   | `/users/login`      | ❌ None  | Login user                   |
| GET    | `/users/profile`    | 🔒 User | Get user profile             |
| GET    | `/users/logout`     | 🔒 User | Logout user                  |

### Captain Endpoints

| Method | Endpoint              | Auth        | Description                  |
| ------ | --------------------- | ----------- | ---------------------------- |
| POST   | `/captains/register`  | ❌ None     | Register a new captain       |
| POST   | `/captains/login`     | ❌ None     | Login captain                |
| GET    | `/captains/profile`   | 🔒 Captain | Get captain profile          |
| GET    | `/captains/logout`    | 🔒 Captain | Logout captain               |

### Maps Endpoints

| Method | Endpoint                    | Auth     | Description                          |
| ------ | --------------------------- | -------- | ------------------------------------ |
| GET    | `/maps/get-coordinates`     | 🔒 User | Geocode address to lat/lng           |
| GET    | `/maps/get-distance-time`   | 🔒 User | Get distance & time between points   |
| GET    | `/maps/get-suggestions`     | 🔒 User | Get autocomplete place suggestions   |

### Ride Endpoints

| Method | Endpoint            | Auth     | Description                        |
| ------ | ------------------- | -------- | ---------------------------------- |
| POST   | `/rides/create`     | 🔒 User | Create a new ride request          |
| GET    | `/rides/get-fare`   | 🔒 User | Get fare estimates for all types   |
