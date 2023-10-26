/// <reference path="core/a.out.js" />

import { useState, useRef, useEffect, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function RomSelector() {
  const chooseFileRef = useRef(null);

  const fileSelected = useCallback((e) => {
    console.log("called");
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    /** @type {ESEmu} */
    const emu = window.emulator;

    const reader = new FileReader();
      reader.onload = (e) => {
      const buffer = e.target.result;
      const bufPtr = window.emuModule._malloc(buffer.byteLength);
      const finalBuffer = new Uint8Array(window.emuModule.HEAPU8.buffer, bufPtr, buffer.byteLength);
      finalBuffer.set(new Uint8Array(buffer));


      // FIXME: THIS WON'T WORK BECAUSE YOU'RE NOT ALLOWING RAW PTR
      // NOT SURE HOW TO FIX
      if (emu.loadROM(finalBuffer.byteOffset)) {
        emu.powerOn();
        emu.reset();
        emu.setRunEmulation(true);
      } else {
        emu.setRunEmulation(false);
      }

      window.emuModule._free(bufPtr);
    }

    reader.readAsArrayBuffer(file);
  }, []);

  return (
    <>
      <input ref={chooseFileRef} onChange={fileSelected} type="file" />
    </>
  )
}

function EmuScreen() {
  const [renderFrame, setRenderFrame] = useState(false);

  const emu = window.emulator;

  const nativeResRef = useRef(null);
  const scaledResRef = useRef(null);

  const scaledWidth = 512;
  const scaledHeight = 480;
  const nativeWidth = 256;
  const nativeHeight = 240;

  const onAnimationFrame = useCallback(() => {
    // FIXME: WE DON'T KNOW HOW MUCH TIME HAS PASSED
    //        ON A 144HZ MONITOR, A FRAME OCCURS EVERY 7MS
    //        THAT MEANS THAT IF LESS THAN 7MS IS LEFT ON THIS
    //        TIME WE WILL RENDER THE FRAME LATE NEXT TIME
    //        TAKE INTO ACCOUNT A 5MS RENDER TIME ON MY PC AND THAT
    //        IS EXTREMELY CLOSE TO MISSING A WHOLE FRAME
    //        WE NEED SOME KIND OF MECHANISM TO FIGURE OUT APPROXIMATELY
    //        HOW LONG TO WAIT BEFORE DECIDING TO CLOCK AGAIN
    //        INSTEAD OF HARDCODING FOR MY PC
    var t0 = Date.now();
    // 1ms is a little slow but 2ms is a little fast
    if (t0 - window.lastRenderTime >= 16 - 1) {
      window.emulator.clock();
      window.lastRenderTime = t0;
    }

    if (window.emulator.getRunEmulation()) {
      const pxArr = emu.getFrameBuffer();

      const scaleFactor = scaledWidth / 256;
      const nativeCanvas = nativeResRef.current;
      const scaledCanvas = scaledResRef.current;
      if (nativeCanvas && scaledCanvas) {
        const nativeContext = nativeCanvas.getContext("2d");
        const nativeImgData = nativeContext.createImageData(nativeWidth, nativeHeight);
        nativeImgData.data.set(pxArr);
        nativeContext.putImageData(nativeImgData, 0, 0, 0, 0, nativeWidth, nativeHeight);

        const scaledContext = scaledCanvas.getContext("2d");
        // If we don't do this, there is horrible anti-aliasing
        scaledContext.webkitImageSmoothingEnabled = false;
        scaledContext.mozImageSmoothingEnabled = false;
        scaledContext.imageSmoothingEnabled = false;
        scaledContext.drawImage(nativeCanvas, 0, 0, nativeWidth, nativeHeight, 0, 0, nativeWidth * scaleFactor, nativeHeight * scaleFactor);
      }
    }
    window.requestAnimationFrame(onAnimationFrame);
  }, []);

  useEffect(() => {
    // Not smooth, not running in realtime
    onAnimationFrame();
  }, [])

  if (renderFrame) {
    setRenderFrame(false);
  }

  return (
    <>
      <canvas style={{"display": "none"}} ref={nativeResRef} width={nativeWidth} height={nativeHeight}></canvas>
      <canvas ref={scaledResRef} width={scaledWidth} height={scaledHeight}></canvas>
    </>
  );
}

function keyDownCallback(e) {
  window.emulator.keyDown(e.key);
}

function keyUpCallback(e) {
  window.emulator.keyUp(e.key);
}

function App() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", keyDownCallback);
    document.addEventListener("keyup", keyUpCallback);

    return () => {
      document.removeEventListener("keydown", keyDownCallback);
      document.removeEventListener("keyup", keyUpCallback);
    }
  }, [])

  return (
    <div ref={wrapperRef}>
      <RomSelector />
      <EmuScreen />
    </div>
  );
}

export default App
