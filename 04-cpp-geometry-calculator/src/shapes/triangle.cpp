#include "shapes/triangle.h"
#include <stdexcept>
#include <algorithm>

namespace geometry {

Triangle::Triangle(double side_a, double side_b, double side_c)
    : side_a_(side_a), side_b_(side_b), side_c_(side_c) {
    if (side_a <= 0 || side_b <= 0 || side_c <= 0) {
        throw std::invalid_argument("Triangle sides must be positive");
    }
    if (!satisfiesTriangleInequality()) {
        throw std::invalid_argument("Triangle inequality not satisfied");
    }
}

std::tuple<double, double, double> Triangle::sides() const {
    return std::make_tuple(side_a_, side_b_, side_c_);
}

void Triangle::setSides(double side_a, double side_b, double side_c) {
    if (side_a <= 0 || side_b <= 0 || side_c <= 0) {
        throw std::invalid_argument("Triangle sides must be positive");
    }
    
    // Check triangle inequality with new sides
    if (side_a + side_b <= side_c || 
        side_b + side_c <= side_a || 
        side_a + side_c <= side_b) {
        throw std::invalid_argument("Triangle inequality not satisfied");
    }
    
    side_a_ = side_a;
    side_b_ = side_b;
    side_c_ = side_c;
}

bool Triangle::isEquilateral() const {
    const double epsilon = 1e-9;
    return std::abs(side_a_ - side_b_) < epsilon &&
           std::abs(side_b_ - side_c_) < epsilon;
}

bool Triangle::isIsosceles() const {
    const double epsilon = 1e-9;
    return std::abs(side_a_ - side_b_) < epsilon ||
           std::abs(side_b_ - side_c_) < epsilon ||
           std::abs(side_a_ - side_c_) < epsilon;
}

double Triangle::area() const {
    // Using Heron's formula
    double s = perimeter() / 2.0;
    return std::sqrt(s * (s - side_a_) * (s - side_b_) * (s - side_c_));
}

double Triangle::perimeter() const {
    return side_a_ + side_b_ + side_c_;
}

std::string Triangle::name() const {
    if (isEquilateral()) {
        return "Equilateral Triangle";
    } else if (isIsosceles()) {
        return "Isosceles Triangle";
    } else {
        return "Scalene Triangle";
    }
}

bool Triangle::isValid() const {
    return side_a_ > 0 && side_b_ > 0 && side_c_ > 0 && 
           satisfiesTriangleInequality();
}

bool Triangle::satisfiesTriangleInequality() const {
    return side_a_ + side_b_ > side_c_ &&
           side_b_ + side_c_ > side_a_ &&
           side_a_ + side_c_ > side_b_;
}

} // namespace geometry
