CXX = g++
CXXFLAGS = -O2 -Wall
TARGET = BanasthaliMart.exe
SRC = main.cpp

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) $(SRC) -o $(TARGET)

run: $(TARGET)
	./$(TARGET)

clean:
	del /f $(TARGET) 2>nul || exit 0
