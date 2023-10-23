#include "ESEmu.h"

#include <emscripten/bind.h>

#include <iostream>

#include "PPU.h"

namespace NESCLE {
std::vector<uint8_t> ESEmu::GetFrameBuffer() {
    // FIXME: USE FRAMEBUFFER PROPERLY
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

bool ESEmu::LoadROM(uintptr_t buf_as_ptr) {
    return nes.GetCart().LoadROMStr((char*)buf_as_ptr);
}

void ESEmu::Clock() {
    if (run_emulation) {
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

void ESEmu::Reset() {

    nes.Reset();
}

void ESEmu::PowerOn() {
    nes.PowerOn();
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
