#pragma once

#include "shape.h"

namespace geometry {

/**
 * @brief Rectangle shape implementation
 */
class Rectangle : public Shape {
private:
    double width_;
    double height_;

public:
    /**
     * @brief Construct a rectangle with given dimensions
     * @param width Rectangle width (must be positive)
     * @param height Rectangle height (must be positive)
     */
    Rectangle(double width, double height);
    
    /**
     * @brief Get the width
     * @return Rectangle width
     */
    double width() const { return width_; }
    
    /**
     * @brief Get the height
     * @return Rectangle height
     */
    double height() const { return height_; }
    
    /**
     * @brief Set the dimensions
     * @param width New width (must be positive)
     * @param height New height (must be positive)
     */
    void setDimensions(double width, double height);
    
    // Shape interface implementation
    double area() const override;
    double perimeter() const override;
    std::string name() const override;
    bool isValid() const override;
};

} // namespace geometry
