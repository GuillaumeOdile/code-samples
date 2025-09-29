#include "shapes/circle.h"
#include <stdexcept>

namespace geometry {

Circle::Circle(double radius) : radius_(radius) {
    if (radius <= 0) {
        throw std::invalid_argument("Circle radius must be positive");
    }
}

void Circle::setRadius(double radius) {
    if (radius <= 0) {
        throw std::invalid_argument("Circle radius must be positive");
    }
    radius_ = radius;
}

double Circle::area() const {
    return M_PI * radius_ * radius_;
}

double Circle::perimeter() const {
    return 2 * M_PI * radius_;
}

std::string Circle::name() const {
    return "Circle";
}

bool Circle::isValid() const {
    return radius_ > 0;
}

} // namespace geometry
