#pragma once

#include "shape.h"
#include <cmath>

namespace geometry {

/**
 * @brief Circle shape implementation
 */
class Circle : public Shape {
private:
    double radius_;

public:
    /**
     * @brief Construct a circle with given radius
     * @param radius Circle radius (must be positive)
     */
    explicit Circle(double radius);
    
    /**
     * @brief Get the radius
     * @return Circle radius
     */
    double radius() const { return radius_; }
    
    /**
     * @brief Set the radius
     * @param radius New radius (must be positive)
     */
    void setRadius(double radius);
    
    // Shape interface implementation
    double area() const override;
    double perimeter() const override;
    std::string name() const override;
    bool isValid() const override;
};

} // namespace geometry
