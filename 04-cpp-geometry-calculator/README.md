# Geometry Calculator

A simple C++ application demonstrating object-oriented programming principles with geometric shape calculations.

## Features

- **Shape Classes**: Circle, Rectangle, and Triangle implementations
- **Polymorphism**: Abstract base class with virtual functions
- **RAII**: Proper resource management with smart pointers
- **Exception Handling**: Input validation with meaningful error messages
- **Unit Tests**: Comprehensive test coverage with Google Test
- **Modern C++**: C++17 features including smart pointers and structured bindings

## Architecture

### Class Hierarchy
```
Shape (abstract base class)
├── Circle
├── Rectangle
└── Triangle
```

### Key Components
- **Shape**: Abstract base class defining the interface
- **Circle**: Implements circle geometry with radius
- **Rectangle**: Implements rectangle geometry with width/height
- **Triangle**: Implements triangle geometry with three sides
- **GeometryCalculator**: Manages multiple shapes and calculates totals

## Building

### Prerequisites
- CMake 3.16+
- C++17 compatible compiler (GCC 7+, Clang 5+, MSVC 2017+)
- Google Test (optional, for running tests)

### Build Instructions
```bash
mkdir build && cd build
cmake ..
make
```

### Running Tests
```bash
# Build with tests
cmake .. -DGTEST_FOUND=ON
make

# Run tests
./unit_tests
```

## Usage

### Basic Example
```cpp
#include "geometry_calculator.h"
#include "shapes/circle.h"
#include "shapes/rectangle.h"

using namespace geometry;

GeometryCalculator calculator;

// Add shapes
calculator.addShape(std::make_unique<Circle>(5.0));
calculator.addShape(std::make_unique<Rectangle>(4.0, 6.0));

// Get results
std::cout << "Total area: " << calculator.totalArea() << std::endl;
std::cout << "Total perimeter: " << calculator.totalPerimeter() << std::endl;
```

### Running the Demo
```bash
./bin/geometry_calculator
```

## Technical Highlights

### Object-Oriented Design
- **Inheritance**: Shape hierarchy with virtual functions
- **Polymorphism**: Runtime method dispatch
- **Encapsulation**: Private data members with public interfaces

### Modern C++ Features
- **Smart Pointers**: `std::unique_ptr` for automatic memory management
- **RAII**: Resource acquisition is initialization
- **Exception Safety**: Strong exception safety guarantees
- **const-correctness**: Proper use of const methods

### Error Handling
- **Input Validation**: Checks for positive dimensions
- **Triangle Inequality**: Validates triangle side relationships
- **Exception Propagation**: Meaningful error messages

### Testing
- **Unit Tests**: Individual class testing
- **Edge Cases**: Boundary condition testing
- **Exception Testing**: Error condition validation

## Code Quality

- **Clean Code**: Readable and maintainable
- **Documentation**: Comprehensive comments and documentation
- **Naming**: Clear and descriptive variable/function names
- **Structure**: Logical organization and separation of concerns

## Example Output

```
Geometry Calculator Demo
=======================

Adding shapes...

=== Geometry Calculator Results ===
Total shapes: 4

Shape 1: Circle
  Area: 78.54
  Perimeter: 31.42

Shape 2: Rectangle
  Area: 24.00
  Perimeter: 20.00

Shape 3: Equilateral Triangle
  Area: 3.90
  Perimeter: 9.00

Shape 4: Scalene Triangle
  Area: 6.00
  Perimeter: 12.00

Totals:
  Total Area: 112.44
  Total Perimeter: 72.42
```

This project demonstrates fundamental C++ programming concepts in a practical, easy-to-understand application.
