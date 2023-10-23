#include "ESEmu.h"

#include <emscripten/bind.h>

#include <iostream>

#include "PPU.h"

namespace NESCLE {
std::vector<uint8_t> ESEmu::GetFrameBuffer() {
    constexpr int size = 256 * 240 * 4;
    std::vector<uint8_t> res(size);
    uint32_t* frame_buffer = nes.GetPPU().GetFramebuffer();
    for (int i = 0; i < size; i += 4) {
        res[i+0] = frame_buffer[i/4] & 0x00ff0000;
        res[i+1] = frame_buffer[i/4] & 0x0000ff00;
        res[i+2] = frame_buffer[i/4] & 0x000000ff;
        res[i+3] = frame_buffer[i/4] & 0xff000000;
    }
    return res;
}

bool ESEmu::LoadROM(std::string file_as_str) {
    return nes.GetCart().LoadROMStr(file_as_str.c_str());
}

void ESEmu::Clock() {
    if (run_emulation) {
        std::cout << "Ran emulation\n";
        while (!nes.GetPPU().GetFrameComplete()) {
            nes.Clock();
        }
        nes.GetPPU().ClearFrameComplete();
    }
}

void ESEmu::SetRunEmulation(bool run) {
    run_emulation = run;
}

bool ESEmu::GetRunEmulation() {
    return run_emulation;
}

}

using namespace emscripten;

EMSCRIPTEN_BINDINGS(Emulator) {
    class_<NESCLE::ESEmu>("ESEmu")
    .constructor<>()
    .function("getFrameBuffer", &NESCLE::ESEmu::GetFrameBuffer)
    .function("clock", &NESCLE::ESEmu::Clock)
    .function("loadROM", &NESCLE::ESEmu::LoadROM)
    .function("getRunEmulation", &NESCLE::ESEmu::GetRunEmulation)
    .function("setRunEmulation", &NESCLE::ESEmu::SetRunEmulation);

    register_vector<uint8_t>("ByteArr");
}
