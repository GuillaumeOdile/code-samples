#include "geometry_calculator.h"
#include <sstream>
#include <iomanip>

namespace geometry {

void GeometryCalculator::addShape(std::unique_ptr<Shape> shape) {
    if (shape && shape->isValid()) {
        shapes_.push_back(std::move(shape));
    }
}

size_t GeometryCalculator::shapeCount() const {
    return shapes_.size();
}

double GeometryCalculator::totalArea() const {
    double total = 0.0;
    for (const auto& shape : shapes_) {
        total += shape->area();
    }
    return total;
}

double GeometryCalculator::totalPerimeter() const {
    double total = 0.0;
    for (const auto& shape : shapes_) {
        total += shape->perimeter();
    }
    return total;
}

std::string GeometryCalculator::getShapesInfo() const {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(2);
    
    oss << "=== Geometry Calculator Results ===\n";
    oss << "Total shapes: " << shapes_.size() << "\n\n";
    
    for (size_t i = 0; i < shapes_.size(); ++i) {
        const auto& shape = shapes_[i];
        oss << "Shape " << (i + 1) << ": " << shape->name() << "\n";
        oss << "  Area: " << shape->area() << "\n";
        oss << "  Perimeter: " << shape->perimeter() << "\n\n";
    }
    
    oss << "Totals:\n";
    oss << "  Total Area: " << totalArea() << "\n";
    oss << "  Total Perimeter: " << totalPerimeter() << "\n";
    
    return oss.str();
}

void GeometryCalculator::clear() {
    shapes_.clear();
}

const Shape* GeometryCalculator::getShape(size_t index) const {
    if (index >= shapes_.size()) {
        return nullptr;
    }
    return shapes_[index].get();
}

} // namespace geometry
