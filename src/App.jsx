/// <reference path="core/a.out.js" />

import { useState, useRef, useEffect, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// function App() {
//   // FIXME: HAVING THIS USESTATE HERE MAY BE CAUSING THE MEM LEAK
//   // const [emu, setEmu] = useState(new window.emuModule.ESEmu());
//   const emu = window.emulator;

//   // FIXME: THIS CAUSES INFINITE RERENDERING
//   // WHICH MEANS INFINITE RECALLS OF THE ON CHANGE LISTENER???
//   // const [renderFrame, setRenderFrame] = useState(false);

//   const canvasRef = useRef(null);
//   const chooseFileRef = useRef(null);

//   const canvasWidth = 512;
//   const canvasHeight = 480;

//   const renderFrameCallback = () => {
//     setInterval(() => {
//       emu.clock();
//       // setRenderFrame(true);
//     }, 1)
//   }

//   // useEffect(() => {
//     // if (renderFrame) {
//       // console.log("rendering frame");
//       // FIXME: FOR WHATEVER REASON THIS IF GUARD CAUSES THE MEMORY LEAK SOONER???
//       // FIXME: WE MAY BE SHOWING THE GAME, BUT CANVAS DOESN'T UPDATE
//       // if (emu.getRunEmulation()) {
//         // console.log('rendering frame');
//         const pxVec = emu.getFrameBuffer();
//         const pxArr = new Uint8Array(pxVec.size());
//         for (let i = 0; i < pxArr.length; i++) {
//           pxArr[i] = pxVec.get(i);
//         }

//         const scaleFactor = canvasWidth / 256;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         const imgData = ctx.createImageData(256, 240);
//         imgData.data.set(pxArr);
//         ctx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, canvasHeight);
//         ctx.scale(scaleFactor, scaleFactor);
//         ctx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);

//     // }
//     setRenderFrame(false);
//   // }
//   // }, [renderFrame]);

//   useEffect(() => {
//     renderFrameCallback();
//   }, []);

//   useEffect(() => {
//     chooseFileRef.current.addEventListener("change", (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const buffer = e.target.result;
//         // const bufferAsArr = new Uint8Array(buffer);
//         // console.log("Buffer strlen: " + bufferAsArr.length);
//         // FIXME: THE PROBLEM IS THAT EACH BYTE IS BEING CONVERTED INTO AN ASCII
//         // SO ARR[0,1] = 78 WHICH IS ACTUALLY ASCII FOR 'N'
//         // console.log("Buffer header: " + bufferAsArr.slice(0, 4));

//         // FIXME: EXPORT MALLOC AND ALLOCATE A BUFFER
//         // ALSO COMPILE WITH RUNTIME ASSERTIONS (-S ASSERTIONS=1)

//         // FIXME: MALLOC MISSING FREE
//         // const bufferView = new Uint8Array(buffer);
//         // buffer.
//         // const finalBuffer = bufferView.byteOffset;

//         // console.log("Buffer bytelen: " + bufferView.byteLength);

//         // console.log("First 4: ", bufferView.slice(0, 4));

//         // FIXME: THIS GETS CALLED FOREVER????
//         console.log("called");

//         const bufPtr = window.emuModule._malloc(buffer.byteLength);
//         const finalBuffer = new Uint8Array(window.emuModule.HEAPU8.buffer, bufPtr, buffer.byteLength);
//         finalBuffer.set(new Uint8Array(buffer));


//         // FIXME: THIS WON'T WORK BECAUSE YOU'RE NOT ALLOWING RAW PTR
//         // NOT SURE HOW TO FIX
//         if (emu.loadROM(finalBuffer.byteOffset)) {
//           emu.powerOn();
//           emu.reset();
//           emu.setRunEmulation(true);
//         } else {
//           emu.setRunEmulation(false);
//         }

//         window.emuModule._free(bufPtr);

//       }

//       reader.readAsArrayBuffer(file);

//       return () => {
//         chooseFileRef.current.removeEventListener("change", () => {});
//       }
//     });
//   }, [chooseFileRef]);

//   return (
//     <>
//       <div>
//         <input ref={chooseFileRef} type="file" />
//       </div>
//       <canvas ref={canvasRef} id="emuScreen" width={canvasWidth} height={canvasHeight}></canvas>
//     </>
//   )
// }

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

  const canvasRef = useRef(null);

  const canvasWidth = 512;
  const canvasHeight = 480;

  useEffect(() => {
    setInterval(() => {
      window.emulator.clock();
      setRenderFrame(true);
    }, 16);
  }, [])

  if (renderFrame) {
    const pxVec = emu.getFrameBuffer();
    const pxArr = new Uint8Array(pxVec.size());
    for (let i = 0; i < pxArr.length; i++) {
      pxArr[i] = pxVec.get(i);
    }

    const scaleFactor = canvasWidth / 256;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const imgData = ctx.createImageData(256, 240);
      imgData.data.set(pxArr);
      ctx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, canvasHeight);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);
    }
    setRenderFrame(false);
  }

  return (
    <>
      <canvas ref={canvasRef} id="emuScreen" width={canvasWidth} height={canvasHeight}></canvas>
    </>
  );
}

function App() {
  const wrapperRef = useRef(null);

  const keyDownCallback = useCallback((e) => {
    window.emulator.keyDown(e.key);
  }, []);

  const keyUpCallback = useCallback((e) => {
    window.emulator.keyUp(e.key);
  }, []);

  return (
    <div ref={wrapperRef} onKeyDown={keyDownCallback} onKeyUp={keyUpCallback}>
      <RomSelector />
      <EmuScreen />
    </div>
  );
}

export default App
