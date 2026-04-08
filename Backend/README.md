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
