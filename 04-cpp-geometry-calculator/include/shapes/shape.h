#pragma once

#include <string>

namespace geometry {

/**
 * @brief Abstract base class for geometric shapes
 */
class Shape {
public:
    virtual ~Shape() = default;
    
    /**
     * @brief Calculate the area of the shape
     * @return Area as double
     */
    virtual double area() const = 0;
    
    /**
     * @brief Calculate the perimeter of the shape
     * @return Perimeter as double
     */
    virtual double perimeter() const = 0;
    
    /**
     * @brief Get the name of the shape
     * @return Shape name as string
     */
    virtual std::string name() const = 0;
    
    /**
     * @brief Check if the shape is valid
     * @return True if valid, false otherwise
     */
    virtual bool isValid() const = 0;
};

} // namespace geometry
