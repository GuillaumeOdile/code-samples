# Frontend - React Component Architecture

> Demonstrates clean React component design with accessibility, state management, and comprehensive testing.

## Purpose

This project showcases how to build maintainable, accessible React components using modern patterns and best practices. It demonstrates:

- **Component Architecture**: Clean separation of concerns with reusable components
- **Accessibility**: WCAG compliance with ARIA attributes, keyboard navigation, and screen reader support
- **State Management**: React Query for server state and custom hooks for component logic
- **Type Safety**: Full TypeScript integration with strict type checking
- **Testing**: Comprehensive test coverage with Vitest and React Testing Library

## Architecture

### Component Structure

```
src/
├── components/
│   └── UserTable/           # Feature component with sub-components
│       ├── UserTable.tsx    # Main component
│       ├── UserTableHeader.tsx
│       ├── UserTableRow.tsx
│       ├── PaginationControls.tsx
│       ├── SearchFilters.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       └── index.ts         # Clean exports
├── hooks/                   # Custom hooks
│   └── useUsers.ts         # User data management
├── lib/                    # Utilities and API client
│   └── api.ts             # API client with error handling
├── types/                  # TypeScript type definitions
│   └── user.types.ts      # Domain types
└── test/                  # Test utilities and mocks
    ├── setup.ts
    └── mocks/
```

### Key Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition**: Complex components built from smaller, focused components
3. **Accessibility First**: ARIA attributes, keyboard navigation, screen reader support
4. **Type Safety**: Comprehensive TypeScript coverage
5. **Testability**: Components designed for easy testing

## Features

### UserTable Component

- **Data Display**: Sortable, paginated table with user information
- **Search & Filtering**: Real-time search with debounced input
- **Pagination**: Full pagination controls with customizable page sizes
- **Actions**: View, edit, and delete operations with confirmation
- **Loading States**: Skeleton loading and error handling
- **Accessibility**: Full keyboard navigation and screen reader support

### Accessibility Features

- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Keyboard Navigation**: Full keyboard support for all functionality
- **Screen Reader Support**: Proper semantic markup and announcements
- **Focus Management**: Visible focus indicators and logical tab order
- **Error Handling**: Accessible error messages and recovery options

### State Management

- **React Query**: Server state management with caching and synchronization
- **Custom Hooks**: Encapsulated component logic and data fetching
- **Optimistic Updates**: Immediate UI feedback with rollback on errors
- **Cache Management**: Intelligent cache invalidation and updates

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
# Start development server
npm run dev

# Application will be available at http://localhost:5173
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Component Usage

### Basic Usage

```tsx
import { UserTable } from '@/components/UserTable';

function App() {
  return (
    <UserTable 
      onEditUser={(userId) => console.log('Edit:', userId)}
      onViewUser={(userId) => console.log('View:', userId)}
    />
  );
}
```

### With Custom Configuration

```tsx
import { UserTable } from '@/components/UserTable';

function App() {
  const handleEditUser = (userId: string) => {
    // Open edit modal or navigate to edit page
    openEditModal(userId);
  };

  const handleViewUser = (userId: string) => {
    // Open view modal or navigate to user details
    openViewModal(userId);
  };

  return (
    <UserTable 
      onEditUser={handleEditUser}
      onViewUser={handleViewUser}
    />
  );
}
```

## API Integration

The component integrates with the backend API through a clean abstraction layer:

```tsx
// API client usage
import { userApi } from '@/lib/api';

// Fetch users with filters and pagination
const users = await userApi.getUsers(
  { email: 'john' },           // filters
  { page: 1, limit: 10 }       // pagination
);

// Create a new user
const newUser = await userApi.createUser({
  email: 'new@example.com',
  firstName: 'New',
  lastName: 'User'
});
```

## Design Decisions

### Component Composition

**Why**: Breaking down complex components into smaller, focused pieces improves maintainability and reusability.

**Implementation**: UserTable is composed of specialized sub-components (Header, Row, Pagination, etc.) that can be tested and maintained independently.

### Custom Hooks

**Why**: Encapsulating component logic in custom hooks improves testability and reusability.

**Implementation**: `useUsers` hook manages all user-related data operations, making components focused on presentation.

### Accessibility First

**Why**: Building accessibility into components from the start is more effective than retrofitting.

**Implementation**: Every interactive element has proper ARIA attributes, keyboard support, and semantic markup.

### TypeScript Integration

**Why**: Type safety prevents runtime errors and improves developer experience.

**Implementation**: Comprehensive type definitions for all data structures and component props.

## Testing Strategy

### Unit Tests

- **Component Tests**: Test component rendering, props, and user interactions
- **Hook Tests**: Test custom hooks in isolation with mocked dependencies
- **Utility Tests**: Test API client and utility functions

### Integration Tests

- **User Flows**: Test complete user workflows (search, sort, paginate)
- **Error Scenarios**: Test error handling and recovery
- **Accessibility**: Test keyboard navigation and screen reader compatibility

### Test Organization

```
src/
├── components/UserTable/
│   └── UserTable.test.tsx    # Component tests
├── hooks/
│   └── useUsers.test.ts     # Hook tests
├── lib/
│   └── api.test.ts          # API tests
└── test/
    ├── setup.ts             # Test configuration
    └── mocks/               # Mock implementations
```

## Accessibility Compliance

### WCAG 2.1 AA Standards

- **Perceivable**: Proper color contrast, text alternatives, adaptable content
- **Operable**: Keyboard accessible, no seizure-inducing content, navigable
- **Understandable**: Readable text, predictable functionality, input assistance
- **Robust**: Compatible with assistive technologies

### Implementation Details

- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Screen Reader Support**: Proper semantic markup and live regions
- **Focus Management**: Visible focus indicators and focus trapping
- **Error Handling**: Accessible error messages with recovery options

## Performance Considerations

### Optimization Techniques

- **React Query Caching**: Intelligent caching reduces API calls
- **Debounced Search**: Prevents excessive API requests during typing
- **Virtual Scrolling**: For large datasets (not implemented in this example)
- **Code Splitting**: Dynamic imports for large components
- **Memoization**: React.memo and useMemo for expensive operations

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Accessibility**: Works with screen readers and assistive technologies

## Development Guidelines

### Component Development

1. **Start with Types**: Define TypeScript interfaces first
2. **Accessibility First**: Add ARIA attributes and keyboard support
3. **Test Early**: Write tests as you develop
4. **Document Props**: Use JSDoc for component documentation

### Code Style

- **Functional Components**: Use function components with hooks
- **TypeScript Strict**: Enable strict mode for better type safety
- **ESLint Rules**: Follow React and TypeScript best practices
- **Prettier**: Consistent code formatting

### Testing Guidelines

- **Test Behavior**: Focus on what users can do, not implementation details
- **Accessibility Testing**: Test keyboard navigation and screen reader compatibility
- **Error Scenarios**: Test error handling and edge cases
- **Mock External Dependencies**: Isolate components for testing

## Next Steps

1. **Storybook Integration**: Add Storybook for component documentation
2. **Visual Regression Testing**: Add visual testing with Chromatic
3. **Performance Monitoring**: Add performance metrics and monitoring
4. **Internationalization**: Add i18n support for multiple languages
5. **Advanced Features**: Add virtual scrolling, infinite scroll, or advanced filtering


