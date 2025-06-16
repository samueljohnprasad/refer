---
trigger: always_on
---

# Backend Coding Standards (Node.js + TypeScript)

## Project Structure
- Use a modular folder structure: `controllers/`, `services/`, `models/`, `routes/`, `middlewares/`, `utils/`.
- Place type definitions in a dedicated `types/` directory.

## Code Style
- Use Prettier and ESLint for formatting and linting.
- Use 2 spaces for indentation.
- Use single quotes for strings.
- Use TypeScript for all files (`.ts`, `.tsx` for SSR if needed).
- Use async/await for asynchronous code.
- Avoid callback hell; use Promises or async/await.
- Write clear, concise comments for complex logic.

## API Design
- Use RESTful conventions for endpoints.
- Validate all incoming data using libraries like Joi or Zod.
- Separate business logic from controllers (use services).
- Handle errors with centralized error middleware.
- Use environment variables for config/secrets (never hardcode).

## Database
- Use an ORM (e.g., Prisma, TypeORM) or query builder (e.g., Knex) for DB access.
- Keep all DB queries in the `models/` or `repositories/` directory.
- Write migrations for all schema changes.

## Security
- Sanitize all user input to prevent injection attacks.
- Use HTTPS in production.
- Store passwords securely (bcrypt or argon2).
- Use JWT or OAuth for authentication.
- Implement rate limiting and CORS.

## Testing
- Write unit and integration tests using Jest or Mocha.
- Mock external services in tests.
- Ensure at least 80% code coverage for new features.

## Logging & Monitoring
- Use a logging library (e.g., Winston, Pino).
- Log errors and important events with context.

## Version Control
- Use clear, descriptive commit messages (e.g., `fix(user): handle null email`).
- Use feature branches for development.
