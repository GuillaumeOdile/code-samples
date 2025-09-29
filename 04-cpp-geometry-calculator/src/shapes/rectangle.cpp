#include "shapes/rectangle.h"
#include <stdexcept>

namespace geometry {

Rectangle::Rectangle(double width, double height) 
    : width_(width), height_(height) {
    if (width <= 0 || height <= 0) {
        throw std::invalid_argument("Rectangle dimensions must be positive");
    }
}

void Rectangle::setDimensions(double width, double height) {
    if (width <= 0 || height <= 0) {
        throw std::invalid_argument("Rectangle dimensions must be positive");
    }
    width_ = width;
    height_ = height;
}

double Rectangle::area() const {
    return width_ * height_;
}

double Rectangle::perimeter() const {
    return 2 * (width_ + height_);
}

std::string Rectangle::name() const {
    return "Rectangle";
}

bool Rectangle::isValid() const {
    return width_ > 0 && height_ > 0;
}

} // namespace geometry
