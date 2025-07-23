---
trigger: always_on
---

# Common Coding Standards (FE & BE)

These rules apply to both frontend (React Native/React) 

- always write logic in resuable hooks, composable, maintainable, readable, extensionable
- strictly use typescript everywhere, for every variable assignment, function params , function return, explicitly write the types.
dont use any type.

## 1. SOLID Principles
- Follow SOLID principles for object-oriented and functional code:
  - **S**ingle Responsibility: Each module/class/function should have one responsibility.
  - **O**pen/Closed: Code should be open for extension, closed for modification.
  - **L**iskov Substitution: Subtypes must be substitutable for their base types.
  - **I**nterface Segregation: Prefer small, specific interfaces over large, general ones.
  - **D**ependency Inversion: Depend on abstractions, not concretions.

## 2. Avoid Code Duplication (DRY)
- Do not repeat code; extract reusable functions, components, or modules.
- Share logic and utilities across the codebase where possible.

## 3. Reusability
- Write generic, reusable functions and components.
- Use configuration and props/parameters for customization instead of duplicating code.

## 4. Readability
- Prioritize clear, self-documenting code.
- Use meaningful variable, function, and component names.
- Add comments for complex or non-obvious logic.
- Use consistent formatting and code style (enforced by Prettier/ESLint or equivalent).

## 5. Separation of Concerns
- Keep business logic, presentation, and data access separate.
- In React, separate UI components, hooks, and services.

## 6. Clean Code
- Remove unused variables, functions, and imports.
- Avoid deeply nested code; refactor into smaller functions where needed.
- Keep files and functions short and focused.
- Regularly refactor and review code for maintainability.
- Write and maintain unit tests for all logic.

## 7. Documentation
- Document all public APIs, modules, and complex logic.
- Keep README and code comments up to date.

## 8. Error Handling
- Handle errors gracefully and consistently.
- Provide clear error messages for debugging and user feedback.


These principles ensure code quality, maintainability, and scalability for both frontend and backend development.