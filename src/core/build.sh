#!/bin/bash
em++ --bind -s ESEmu.cpp -O2 -s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT=web -s MODULARIZE=1
