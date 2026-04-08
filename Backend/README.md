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
