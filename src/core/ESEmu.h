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
    bool LoadROM(std::string file_as_str);
    void Clock();
    std::vector<uint8_t> GetFrameBuffer();

    void SetRunEmulation(bool run);
    bool GetRunEmulation();
};
}
#endif
