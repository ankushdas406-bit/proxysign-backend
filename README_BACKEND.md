Additional notes:

- Admin creation: Use curl or Postman to create the first admin:

  curl -X POST http://localhost:4000/api/auth/register \
    -H 'Content-Type: application/json' \
    -H 'x-setup-token: your-setup-token' \
    -d '{ "email": "admin@proxysign.com", "password": "admin123" }'

- Then login:

  curl -X POST http://localhost:4000/api/auth/login -H 'Content-Type: application/json' -d '{ "email":"admin@proxysign.com","password":"admin123" }'

Use the returned token in Authorization header for subsequent requests:
  Authorization: Bearer <token>
