#pragma once

#include "shapes/shape.h"
#include <memory>
#include <vector>
#include <string>

namespace geometry {

/**
 * @brief Calculator for geometric operations
 */
class GeometryCalculator {
private:
    std::vector<std::unique_ptr<Shape>> shapes_;

public:
    /**
     * @brief Add a shape to the calculator
     * @param shape Unique pointer to shape (will be moved)
     */
    void addShape(std::unique_ptr<Shape> shape);
    
    /**
     * @brief Get the number of shapes
     * @return Number of shapes
     */
    size_t shapeCount() const;
    
    /**
     * @brief Calculate total area of all shapes
     * @return Sum of all areas
     */
    double totalArea() const;
    
    /**
     * @brief Calculate total perimeter of all shapes
     * @return Sum of all perimeters
     */
    double totalPerimeter() const;
    
    /**
     * @brief Get shape information as string
     * @return Formatted string with all shapes info
     */
    std::string getShapesInfo() const;
    
    /**
     * @brief Clear all shapes
     */
    void clear();
    
    /**
     * @brief Get shape by index
     * @param index Shape index
     * @return Pointer to shape (nullptr if invalid index)
     */
    const Shape* getShape(size_t index) const;
};

} // namespace geometry
