#pragma once

#include "shape.h"
#include <cmath>

namespace geometry {

/**
 * @brief Triangle shape implementation
 */
class Triangle : public Shape {
private:
    double side_a_;
    double side_b_;
    double side_c_;

public:
    /**
     * @brief Construct a triangle with given sides
     * @param side_a First side (must be positive)
     * @param side_b Second side (must be positive)
     * @param side_c Third side (must be positive)
     */
    Triangle(double side_a, double side_b, double side_c);
    
    /**
     * @brief Get the sides
     * @return Tuple of (side_a, side_b, side_c)
     */
    std::tuple<double, double, double> sides() const;
    
    /**
     * @brief Set the sides
     * @param side_a New first side (must be positive)
     * @param side_b New second side (must be positive)
     * @param side_c New third side (must be positive)
     */
    void setSides(double side_a, double side_b, double side_c);
    
    /**
     * @brief Check if triangle is equilateral
     * @return True if all sides are equal
     */
    bool isEquilateral() const;
    
    /**
     * @brief Check if triangle is isosceles
     * @return True if two sides are equal
     */
    bool isIsosceles() const;
    
    // Shape interface implementation
    double area() const override;
    double perimeter() const override;
    std::string name() const override;
    bool isValid() const override;

private:
    /**
     * @brief Check if sides can form a valid triangle
     * @return True if triangle inequality holds
     */
    bool satisfiesTriangleInequality() const;
};

} // namespace geometry
