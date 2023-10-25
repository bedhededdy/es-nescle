#ifndef ES_EMU_H_
#define ES_EMU_H_

#include <cstdint>
#include <vector>
#include <string>

#include "Bus.h"

namespace NESCLE {
class ESEmu {
private:
    Bus nes;

    bool run_emulation;

public:
    bool LoadROM(uintptr_t file_buf_ptr);
    void Clock();
    std::vector<uint8_t> GetFrameBuffer();

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
