#!/bin/bash
em++ --bind ESEmu.cpp mappers/Mapper.cpp mappers/Mapper000.cpp mappers/Mapper001.cpp mappers/Mapper002.cpp mappers/Mapper003.cpp mappers/Mapper004.cpp mappers/Mapper007.cpp mappers/Mapper066.cpp CPU.cpp APU.cpp Bus.cpp Cart.cpp PPU.cpp Util.cpp -O2 -s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT=web -s MODULARIZE=1 -s EXPORTED_FUNCTIONS=['_malloc', '_free'] -s ASSERTIONS=1
