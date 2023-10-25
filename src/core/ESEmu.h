#ifndef ES_EMU_H_
#define ES_EMU_H_

#include <cstdint>
#include <vector>
#include <string>

#include <emscripten/val.h>

#include "Bus.h"

namespace NESCLE {
class ESEmu {
private:
    Bus nes;
    // FIXME: THIS IS NEVER FREED
    uint8_t* frame_buffer_fixed = new uint8_t[256 * 240 * 4];
    bool run_emulation;

public:
    bool LoadROM(uintptr_t file_buf_ptr);
    void Clock();
    emscripten::val GetFrameBuffer();

    void PowerOn();
    void Reset();

    void SetRunEmulation(bool run);
    bool GetRunEmulation();

    void SetPC(uint16_t addr);

    bool KeyDown(std::string key_name);
    bool KeyUp(std::string key_name);
};
}
#endif
