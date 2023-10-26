#include "ESEmu.h"

#include <emscripten/bind.h>

#include <iostream>

#include "Bus.h"
#include "PPU.h"

namespace NESCLE {
emscripten::val ESEmu::GetFrameBuffer() {
    constexpr int size = 256 * 240 * 4;
    uint32_t* frame_buffer = nes.GetPPU().GetFramebuffer();
    for (int i = 0; i < size; i += 4) {
        frame_buffer_fixed[i+0] = (frame_buffer[i/4] & 0x00ff0000) >> 16;
        frame_buffer_fixed[i+1] = (frame_buffer[i/4] & 0x0000ff00) >> 8;
        frame_buffer_fixed[i+2] = frame_buffer[i/4] & 0x000000ff;
        frame_buffer_fixed[i+3] = (frame_buffer[i/4] & 0xff000000) >> 24;
    }
    return emscripten::val(emscripten::typed_memory_view(size, frame_buffer_fixed));
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

bool ESEmu::KeyDown(std::string key_name) {
    if (key_name == "w") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::UP);
    } else if (key_name == "a") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::LEFT);
    } else if (key_name == "s") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::DOWN);
    } else if (key_name == "d") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::RIGHT);
    } else if (key_name == "j") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::B);
    } else if (key_name == "k") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::A);
    } else if (key_name == "u") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::START);
    } else if (key_name == "i") {
        nes.SetController1(nes.GetController1() | (int)Bus::NESButtons::SELECT);
    } else {
        return false;
    }

    return true;
}

bool ESEmu::KeyUp(std::string key_name) {
    if (key_name == "w") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::UP);
    } else if (key_name == "a") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::LEFT);
    } else if (key_name == "s") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::DOWN);
    } else if (key_name == "d") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::RIGHT);
    } else if (key_name == "j") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::B);
    } else if (key_name == "k") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::A);
    } else if (key_name == "u") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::START);
    } else if (key_name == "i") {
        nes.SetController1(nes.GetController1() & ~(int)Bus::NESButtons::SELECT);
    } else {
        return false;
    }

    return true;
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
    .function("setPC", &NESCLE::ESEmu::SetPC)
    .function("keyDown", &NESCLE::ESEmu::KeyDown)
    .function("keyUp", &NESCLE::ESEmu::KeyUp);

    register_vector<uint8_t>("ByteArr");
}
