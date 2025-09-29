cmake_minimum_required(VERSION 3.16)
project(geometry_calculator VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Compiler flags
set(CMAKE_CXX_FLAGS_DEBUG "-g -Wall -Wextra")
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")

# Source files
set(SOURCES
    src/main.cpp
    src/shapes/circle.cpp
    src/shapes/rectangle.cpp
    src/shapes/triangle.cpp
    src/geometry_calculator.cpp
)

# Header files
set(HEADERS
    include/shapes/circle.h
    include/shapes/rectangle.h
    include/shapes/triangle.h
    include/geometry_calculator.h
)

# Create main executable
add_executable(${PROJECT_NAME} ${SOURCES} ${HEADERS})

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_SOURCE_DIR}/include
)

# Testing
enable_testing()

# Find Google Test
find_package(GTest QUIET)

if(GTest_FOUND)
    message(STATUS "Found Google Test")
    
    # Test sources
    set(TEST_SOURCES
        test/test_circle.cpp
        test/test_rectangle.cpp
        test/test_triangle.cpp
        test/test_geometry_calculator.cpp
    )
    
    # Create test executable with source files (excluding main.cpp)
    set(TEST_SOURCES_ONLY
        src/shapes/circle.cpp
        src/shapes/rectangle.cpp
        src/shapes/triangle.cpp
        src/geometry_calculator.cpp
    )
    add_executable(unit_tests ${TEST_SOURCES} ${TEST_SOURCES_ONLY})
    
    # Link test libraries
    target_link_libraries(unit_tests
        GTest::gtest
        GTest::gtest_main
    )
    
    # Include test directories
    target_include_directories(unit_tests PRIVATE
        ${CMAKE_SOURCE_DIR}/include
        ${CMAKE_SOURCE_DIR}/test
    )
    
    # Add test to CTest
    add_test(NAME unit_tests COMMAND unit_tests)
    
else()
    message(STATUS "Google Test not found - tests will be skipped")
endif()

# Set output directory
set_target_properties(${PROJECT_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)
