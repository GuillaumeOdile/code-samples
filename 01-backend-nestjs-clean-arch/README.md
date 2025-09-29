# Backend - NestJS Clean Architecture

> Demonstrates clean architecture principles with NestJS, comprehensive testing, and production-ready error handling.

## Purpose

This project showcases how to build a maintainable, testable backend API using clean architecture principles. It demonstrates:

- **Clean Architecture**: Clear separation of concerns with dependency inversion
- **Domain-Driven Design**: Business logic isolated from infrastructure concerns
- **Comprehensive Testing**: Unit tests, integration tests, and E2E tests
- **Error Handling**: Typed domain errors mapped to appropriate HTTP responses
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation

## Architecture

### Layer Structure

```
src/
├── modules/users/           # Feature module
│   ├── dto/                # Data Transfer Objects
│   ├── repositories/       # Data access abstraction
│   ├── users.controller.ts # HTTP presentation layer
│   ├── users.service.ts    # Business logic layer
│   └── users.module.ts     # Module configuration
├── common/                 # Shared utilities
│   ├── errors/            # Domain errors and filters
│   └── types/             # Domain types
└── main.ts                # Application bootstrap
```

### Key Principles

1. **Dependency Inversion**: High-level modules don't depend on low-level modules
2. **Single Responsibility**: Each class has one reason to change
3. **Interface Segregation**: Small, focused interfaces
4. **Open/Closed**: Open for extension, closed for modification

## Features

### User Management API

- **Create User**: POST `/users` with email, firstName, lastName
- **Get User**: GET `/users/:id` 
- **List Users**: GET `/users` with filtering and pagination
- **Update User**: PATCH `/users/:id` with partial updates
- **Delete User**: DELETE `/users/:id`

### Data Validation

- Email format validation
- Name format validation (letters, spaces, hyphens, apostrophes)
- Required field validation
- Length constraints (2-50 characters for names)

### Error Handling

- **Domain Errors**: Business rule violations (UserNotFoundError, UserEmailAlreadyExistsError)
- **Validation Errors**: Input validation failures with detailed messages
- **HTTP Mapping**: Domain errors mapped to appropriate HTTP status codes
- **Consistent Responses**: Standardized error response format

## How to Run

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
# Start development server with hot reload
npm run start:dev

# API will be available at http://localhost:3000
# Documentation at http://localhost:3000/api
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## API Examples

### Create User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get User

```bash
curl http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

### List Users with Pagination

```bash
curl "http://localhost:3000/users?page=1&limit=10&firstName=John"
```

### Update User

```bash
curl -X PATCH http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane"
  }'
```

### Delete User

```bash
curl -X DELETE http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

## Design Decisions

### Repository Pattern

**Why**: Abstracts data access and makes the application testable and database-agnostic.

**Implementation**: `UsersRepository` interface with `InMemoryUsersRepository` implementation. Easy to swap for database implementation.

### Domain Errors

**Why**: Explicit error handling prevents silent failures and provides clear error messages.

**Implementation**: Custom error classes that map to HTTP status codes in the presentation layer.

### DTOs with Validation

**Why**: Ensures data integrity at API boundaries and provides clear error messages.

**Implementation**: class-validator decorators with custom error messages and Swagger documentation.

### In-Memory Storage

**Why**: Simplifies the example while maintaining the same architecture patterns as a production system.

**Trade-off**: Data is lost on restart, but the repository interface makes it easy to add persistent storage.

## Testing Strategy

### Unit Tests

- **Service Layer**: Tests business logic in isolation with mocked dependencies
- **Repository Layer**: Tests data access logic with deterministic data
- **Coverage Target**: 80%+ with focus on critical business logic

### Integration Tests

- **E2E Tests**: Full HTTP request/response cycle testing
- **Error Scenarios**: Tests all error conditions and edge cases
- **API Contracts**: Verifies request/response formats

### Test Organization

```
src/
├── modules/users/
│   ├── users.service.spec.ts        # Service unit tests
│   └── repositories/
│       └── in-memory-users.repository.spec.ts  # Repository tests
└── test/
    └── users.e2e-spec.ts            # E2E tests
```

## Production Considerations

### Security

- Input validation at all boundaries
- No sensitive data in error messages
- CORS configuration for frontend integration
- Rate limiting (would be added in production)

### Performance

- Efficient in-memory operations with Map for O(1) lookups
- Pagination to prevent large result sets
- Proper indexing considerations for database implementation

### Monitoring

- Structured logging with request context
- Error tracking and alerting
- Performance metrics collection

### Scalability

- Stateless design for horizontal scaling
- Repository pattern allows database optimization
- Caching layer can be added at service level

## Next Steps

1. **Database Integration**: Replace in-memory repository with TypeORM/Prisma
2. **Authentication**: Add JWT-based authentication and authorization
3. **Caching**: Implement Redis caching for frequently accessed data
4. **Rate Limiting**: Add request rate limiting and throttling
5. **Monitoring**: Integrate with monitoring and logging services
6. **Docker**: Containerize the application for deployment


