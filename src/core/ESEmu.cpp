#include "ESEmu.h"

#include <emscripten/bind.h>

namespace NESCLE {
std::vector<uint8_t> ESEmu::GetFrameBuffer() {
    constexpr int size = 256 * 240 * 4;
    std::vector<uint8_t> res(size);
    for (int i = 0; i < size; i += 4) {
        res[i] = 0;
        res[i+1] = 0;
        res[i+2] = 0xff;
        res[i+3] = 0xff;
    }
    return res;
}
}

using namespace emscripten;

EMSCRIPTEN_BINDINGS(Emulator) {
    class_<NESCLE::ESEmu>("ESEmu")
    .constructor<>()
    .function("getFrameBuffer", &NESCLE::ESEmu::GetFrameBuffer);

    register_vector<uint8_t>("ByteArr");
}
