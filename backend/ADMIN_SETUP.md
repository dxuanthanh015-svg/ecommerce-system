# Fixed admin account

Set these values in `backend/.env` (or as environment variables) before starting the backend. The `.env` file is excluded by `backend/.gitignore` and must not be committed:

```properties
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-private-password
ADMIN_FIRST_NAME=Platform
ADMIN_LAST_NAME=Admin
```

On startup, the backend creates the account if it does not exist, hashes the initial password, and enforces the `ADMIN` role. It does not overwrite an existing password on subsequent starts, so password changes persist. After the account is created, `ADMIN_PASSWORD` can be removed from configuration; keep `ADMIN_EMAIL` configured. Any other `ADMIN` role in the database is removed so only the configured account remains an administrator. The configured account cannot be demoted or deleted through the Admin user-management API.

Sign in through the regular `/login` page with `ADMIN_EMAIL` and the initial `ADMIN_PASSWORD`; successful admin sign-ins open `/admin/dashboard`. Change the password later from **Admin → Settings**. Do not commit `.env` or share the password.
