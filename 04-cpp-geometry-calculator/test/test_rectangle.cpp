#include <gtest/gtest.h>
#include "shapes/rectangle.h"
#include <stdexcept>

using namespace geometry;

class RectangleTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Setup code if needed
    }
    
    void TearDown() override {
        // Cleanup code if needed
    }
};

TEST_F(RectangleTest, ValidRectangle) {
    Rectangle rect(4.0, 6.0);
    
    EXPECT_DOUBLE_EQ(rect.width(), 4.0);
    EXPECT_DOUBLE_EQ(rect.height(), 6.0);
    EXPECT_TRUE(rect.isValid());
    EXPECT_EQ(rect.name(), "Rectangle");
}

TEST_F(RectangleTest, AreaCalculation) {
    Rectangle rect(3.0, 5.0);
    double expected_area = 3.0 * 5.0;
    
    EXPECT_DOUBLE_EQ(rect.area(), expected_area);
}

TEST_F(RectangleTest, PerimeterCalculation) {
    Rectangle rect(4.0, 7.0);
    double expected_perimeter = 2 * (4.0 + 7.0);
    
    EXPECT_DOUBLE_EQ(rect.perimeter(), expected_perimeter);
}

TEST_F(RectangleTest, InvalidDimensions) {
    EXPECT_THROW(Rectangle(-1.0, 5.0), std::invalid_argument);
    EXPECT_THROW(Rectangle(3.0, -2.0), std::invalid_argument);
    EXPECT_THROW(Rectangle(0.0, 5.0), std::invalid_argument);
    EXPECT_THROW(Rectangle(3.0, 0.0), std::invalid_argument);
}

TEST_F(RectangleTest, SetDimensions) {
    Rectangle rect(1.0, 1.0);
    
    rect.setDimensions(2.0, 3.0);
    EXPECT_DOUBLE_EQ(rect.width(), 2.0);
    EXPECT_DOUBLE_EQ(rect.height(), 3.0);
    
    EXPECT_THROW(rect.setDimensions(-1.0, 3.0), std::invalid_argument);
    EXPECT_THROW(rect.setDimensions(2.0, -1.0), std::invalid_argument);
}

TEST_F(RectangleTest, Square) {
    Rectangle square(5.0, 5.0);
    
    EXPECT_DOUBLE_EQ(square.area(), 25.0);
    EXPECT_DOUBLE_EQ(square.perimeter(), 20.0);
}
