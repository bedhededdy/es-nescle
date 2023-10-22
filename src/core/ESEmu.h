#ifndef ES_EMU_H_
#define ES_EMU_H_

#include <cstdint>
#include <vector>

namespace NESCLE {
class ESEmu {
public:
    bool LoadROM(const char* file_as_str);
    void Clock();
    std::vector<uint8_t> GetFrameBuffer();
};
}
#endif