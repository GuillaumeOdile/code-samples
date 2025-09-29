#include <iostream>
#include <memory>
#include "geometry_calculator.h"
#include "shapes/circle.h"
#include "shapes/rectangle.h"
#include "shapes/triangle.h"

using namespace geometry;

int main() {
    std::cout << "Geometry Calculator Demo\n";
    std::cout << "=======================\n\n";
    
    try {
        GeometryCalculator calculator;
        
        // Add some shapes
        std::cout << "Adding shapes...\n";
        
        // Circle with radius 5
        calculator.addShape(std::make_unique<Circle>(5.0));
        
        // Rectangle 4x6
        calculator.addShape(std::make_unique<Rectangle>(4.0, 6.0));
        
        // Equilateral triangle with sides 3
        calculator.addShape(std::make_unique<Triangle>(3.0, 3.0, 3.0));
        
        // Right triangle 3-4-5
        calculator.addShape(std::make_unique<Triangle>(3.0, 4.0, 5.0));
        
        // Display results
        std::cout << calculator.getShapesInfo();
        
        // Demonstrate individual shape access
        std::cout << "\nIndividual shape details:\n";
        for (size_t i = 0; i < calculator.shapeCount(); ++i) {
            const Shape* shape = calculator.getShape(i);
            if (shape) {
                std::cout << "Shape " << (i + 1) << ": " << shape->name() 
                         << " (Area: " << shape->area() 
                         << ", Perimeter: " << shape->perimeter() << ")\n";
            }
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
