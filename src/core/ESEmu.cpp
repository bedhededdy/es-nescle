#include "ESEmu.h"

#include <emscripten/bind.h>

#include <iostream>

#include "PPU.h"

namespace NESCLE {
std::vector<uint8_t> ESEmu::GetFrameBuffer() {
    // FIXME: USE FRAMEBUFFER PROPERLY
    // FIXME: THIS IS LEAKING INFINITY MEMORY
    constexpr int size = 256 * 240 * 4;
    std::vector<uint8_t> res(size);
    uint32_t* frame_buffer = nes.GetPPU().GetFramebuffer();
    for (int i = 0; i < size; i += 4) {
        if (run_emulation) {
            res[i+0] = frame_buffer[i/4] & 0x00ff0000;
            res[i+1] = frame_buffer[i/4] & 0x0000ff00;
            res[i+2] = frame_buffer[i/4] & 0x000000ff;
            res[i+3] = frame_buffer[i/4] & 0xff000000;

            if (res[i+3] != 0)
                std::cout << "we have something to show\n";
        } else {
            res[i] = 0xff;
            res[i+1] = 0;
            res[i+2] = 0;
            res[i+3] = 0xff;
        }
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
        // for (int i = 0; i < 500; i++) {
        //     do {
        //         nes.GetCPU().Clock();
        //     } while (nes.GetCPU().GetCyclesRem() > 0);
        //     nes.GetCPU().Clock();
        // }

        // run_emulation = false;
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

void ESEmu::SetPC(uint16_t addr) {
    nes.GetCPU().SetPC(addr);
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
    .function("setRunEmulation", &NESCLE::ESEmu::SetRunEmulation)
    .function("powerOn", &NESCLE::ESEmu::PowerOn)
    .function("reset", &NESCLE::ESEmu::Reset)
    .function("setPC", &NESCLE::ESEmu::SetPC);

    register_vector<uint8_t>("ByteArr");
}
