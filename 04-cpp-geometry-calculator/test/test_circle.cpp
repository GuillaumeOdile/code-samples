#include <gtest/gtest.h>
#include "shapes/circle.h"
#include <stdexcept>

using namespace geometry;

class CircleTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Setup code if needed
    }
    
    void TearDown() override {
        // Cleanup code if needed
    }
};

TEST_F(CircleTest, ValidCircle) {
    Circle circle(5.0);
    
    EXPECT_DOUBLE_EQ(circle.radius(), 5.0);
    EXPECT_TRUE(circle.isValid());
    EXPECT_EQ(circle.name(), "Circle");
}

TEST_F(CircleTest, AreaCalculation) {
    Circle circle(3.0);
    double expected_area = M_PI * 3.0 * 3.0;
    
    EXPECT_DOUBLE_EQ(circle.area(), expected_area);
}

TEST_F(CircleTest, PerimeterCalculation) {
    Circle circle(4.0);
    double expected_perimeter = 2 * M_PI * 4.0;
    
    EXPECT_DOUBLE_EQ(circle.perimeter(), expected_perimeter);
}

TEST_F(CircleTest, InvalidRadius) {
    EXPECT_THROW(Circle(-1.0), std::invalid_argument);
    EXPECT_THROW(Circle(0.0), std::invalid_argument);
}

TEST_F(CircleTest, SetRadius) {
    Circle circle(1.0);
    
    circle.setRadius(2.0);
    EXPECT_DOUBLE_EQ(circle.radius(), 2.0);
    
    EXPECT_THROW(circle.setRadius(-1.0), std::invalid_argument);
}

TEST_F(CircleTest, UnitCircle) {
    Circle circle(1.0);
    
    EXPECT_DOUBLE_EQ(circle.area(), M_PI);
    EXPECT_DOUBLE_EQ(circle.perimeter(), 2 * M_PI);
}
