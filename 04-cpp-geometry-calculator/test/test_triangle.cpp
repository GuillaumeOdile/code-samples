#include <gtest/gtest.h>
#include "shapes/triangle.h"
#include <stdexcept>
#include <cmath>

using namespace geometry;

class TriangleTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Setup code if needed
    }
    
    void TearDown() override {
        // Cleanup code if needed
    }
};

TEST_F(TriangleTest, ValidTriangle) {
    Triangle triangle(3.0, 4.0, 5.0);
    
    auto sides = triangle.sides();
    EXPECT_DOUBLE_EQ(std::get<0>(sides), 3.0);
    EXPECT_DOUBLE_EQ(std::get<1>(sides), 4.0);
    EXPECT_DOUBLE_EQ(std::get<2>(sides), 5.0);
    EXPECT_TRUE(triangle.isValid());
}

TEST_F(TriangleTest, PerimeterCalculation) {
    Triangle triangle(3.0, 4.0, 5.0);
    double expected_perimeter = 3.0 + 4.0 + 5.0;
    
    EXPECT_DOUBLE_EQ(triangle.perimeter(), expected_perimeter);
}

TEST_F(TriangleTest, AreaCalculation) {
    // Right triangle 3-4-5 should have area 6
    Triangle triangle(3.0, 4.0, 5.0);
    double expected_area = 6.0; // (3*4)/2 for right triangle
    
    EXPECT_NEAR(triangle.area(), expected_area, 1e-9);
}

TEST_F(TriangleTest, EquilateralTriangle) {
    Triangle triangle(5.0, 5.0, 5.0);
    
    EXPECT_TRUE(triangle.isEquilateral());
    EXPECT_TRUE(triangle.isIsosceles()); // Equilateral is also isosceles
    EXPECT_EQ(triangle.name(), "Equilateral Triangle");
}

TEST_F(TriangleTest, IsoscelesTriangle) {
    Triangle triangle(5.0, 5.0, 6.0);
    
    EXPECT_FALSE(triangle.isEquilateral());
    EXPECT_TRUE(triangle.isIsosceles());
    EXPECT_EQ(triangle.name(), "Isosceles Triangle");
}

TEST_F(TriangleTest, ScaleneTriangle) {
    Triangle triangle(3.0, 4.0, 5.0);
    
    EXPECT_FALSE(triangle.isEquilateral());
    EXPECT_FALSE(triangle.isIsosceles());
    EXPECT_EQ(triangle.name(), "Scalene Triangle");
}

TEST_F(TriangleTest, InvalidSides) {
    EXPECT_THROW(Triangle(-1.0, 4.0, 5.0), std::invalid_argument);
    EXPECT_THROW(Triangle(3.0, -2.0, 5.0), std::invalid_argument);
    EXPECT_THROW(Triangle(3.0, 4.0, -1.0), std::invalid_argument);
    EXPECT_THROW(Triangle(0.0, 4.0, 5.0), std::invalid_argument);
}

TEST_F(TriangleTest, TriangleInequality) {
    // Sides 1, 1, 3 cannot form a triangle
    EXPECT_THROW(Triangle(1.0, 1.0, 3.0), std::invalid_argument);
    EXPECT_THROW(Triangle(10.0, 2.0, 3.0), std::invalid_argument);
}

TEST_F(TriangleTest, SetSides) {
    Triangle triangle(1.0, 1.0, 1.0);
    
    triangle.setSides(3.0, 4.0, 5.0);
    auto sides = triangle.sides();
    EXPECT_DOUBLE_EQ(std::get<0>(sides), 3.0);
    EXPECT_DOUBLE_EQ(std::get<1>(sides), 4.0);
    EXPECT_DOUBLE_EQ(std::get<2>(sides), 5.0);
    
    EXPECT_THROW(triangle.setSides(1.0, 1.0, 3.0), std::invalid_argument);
}
