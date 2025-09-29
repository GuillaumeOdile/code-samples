#include <gtest/gtest.h>
#include "geometry_calculator.h"
#include "shapes/circle.h"
#include "shapes/rectangle.h"
#include "shapes/triangle.h"

using namespace geometry;

class GeometryCalculatorTest : public ::testing::Test {
protected:
    void SetUp() override {
        calculator = std::make_unique<GeometryCalculator>();
    }
    
    void TearDown() override {
        calculator.reset();
    }
    
    std::unique_ptr<GeometryCalculator> calculator;
};

TEST_F(GeometryCalculatorTest, EmptyCalculator) {
    EXPECT_EQ(calculator->shapeCount(), 0);
    EXPECT_DOUBLE_EQ(calculator->totalArea(), 0.0);
    EXPECT_DOUBLE_EQ(calculator->totalPerimeter(), 0.0);
    EXPECT_EQ(calculator->getShape(0), nullptr);
}

TEST_F(GeometryCalculatorTest, AddSingleShape) {
    calculator->addShape(std::make_unique<Circle>(5.0));
    
    EXPECT_EQ(calculator->shapeCount(), 1);
    EXPECT_GT(calculator->totalArea(), 0.0);
    EXPECT_GT(calculator->totalPerimeter(), 0.0);
    
    const Shape* shape = calculator->getShape(0);
    ASSERT_NE(shape, nullptr);
    EXPECT_EQ(shape->name(), "Circle");
}

TEST_F(GeometryCalculatorTest, AddMultipleShapes) {
    calculator->addShape(std::make_unique<Circle>(3.0));
    calculator->addShape(std::make_unique<Rectangle>(4.0, 5.0));
    calculator->addShape(std::make_unique<Triangle>(3.0, 4.0, 5.0));
    
    EXPECT_EQ(calculator->shapeCount(), 3);
    EXPECT_GT(calculator->totalArea(), 0.0);
    EXPECT_GT(calculator->totalPerimeter(), 0.0);
}

TEST_F(GeometryCalculatorTest, TotalAreaCalculation) {
    // Circle with radius 2: area = π * 4 ≈ 12.57
    calculator->addShape(std::make_unique<Circle>(2.0));
    
    // Rectangle 3x4: area = 12
    calculator->addShape(std::make_unique<Rectangle>(3.0, 4.0));
    
    // Right triangle 3-4-5: area = 6
    calculator->addShape(std::make_unique<Triangle>(3.0, 4.0, 5.0));
    
    double expected_total = M_PI * 4.0 + 12.0 + 6.0;
    EXPECT_NEAR(calculator->totalArea(), expected_total, 1e-9);
}

TEST_F(GeometryCalculatorTest, TotalPerimeterCalculation) {
    // Circle with radius 2: perimeter = 2π * 2 ≈ 12.57
    calculator->addShape(std::make_unique<Circle>(2.0));
    
    // Rectangle 3x4: perimeter = 2*(3+4) = 14
    calculator->addShape(std::make_unique<Rectangle>(3.0, 4.0));
    
    // Triangle 3-4-5: perimeter = 12
    calculator->addShape(std::make_unique<Triangle>(3.0, 4.0, 5.0));
    
    double expected_total = 2 * M_PI * 2.0 + 14.0 + 12.0;
    EXPECT_NEAR(calculator->totalPerimeter(), expected_total, 1e-9);
}

TEST_F(GeometryCalculatorTest, GetShapeByIndex) {
    calculator->addShape(std::make_unique<Circle>(1.0));
    calculator->addShape(std::make_unique<Rectangle>(2.0, 3.0));
    
    const Shape* shape0 = calculator->getShape(0);
    const Shape* shape1 = calculator->getShape(1);
    const Shape* shape2 = calculator->getShape(2);
    
    ASSERT_NE(shape0, nullptr);
    ASSERT_NE(shape1, nullptr);
    EXPECT_EQ(shape2, nullptr); // Out of bounds
    
    EXPECT_EQ(shape0->name(), "Circle");
    EXPECT_EQ(shape1->name(), "Rectangle");
}

TEST_F(GeometryCalculatorTest, ClearShapes) {
    calculator->addShape(std::make_unique<Circle>(1.0));
    calculator->addShape(std::make_unique<Rectangle>(2.0, 3.0));
    
    EXPECT_EQ(calculator->shapeCount(), 2);
    
    calculator->clear();
    
    EXPECT_EQ(calculator->shapeCount(), 0);
    EXPECT_DOUBLE_EQ(calculator->totalArea(), 0.0);
    EXPECT_DOUBLE_EQ(calculator->totalPerimeter(), 0.0);
}

TEST_F(GeometryCalculatorTest, GetShapesInfo) {
    calculator->addShape(std::make_unique<Circle>(1.0));
    calculator->addShape(std::make_unique<Rectangle>(2.0, 3.0));
    
    std::string info = calculator->getShapesInfo();
    
    EXPECT_FALSE(info.empty());
    EXPECT_NE(info.find("Circle"), std::string::npos);
    EXPECT_NE(info.find("Rectangle"), std::string::npos);
    EXPECT_NE(info.find("Total shapes: 2"), std::string::npos);
}
