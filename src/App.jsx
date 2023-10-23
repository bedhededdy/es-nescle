import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [emu, setEmu] = useState(new window.emuModule.ESEmu());
  const [renderFrame, setRenderFrame] = useState(false);

  const canvasRef = useRef(null);
  const chooseFileRef = useRef(null);

  const canvasWidth = 512;
  const canvasHeight = 480;

  const renderFrameCallback = () => {
    setInterval(() => {
      emu.clock();
      setRenderFrame(true);
    }, 1)
  }

  // useEffect(() => {
    if (renderFrame) {
      // console.log("rendering frame");
      const pxVec = emu.getFrameBuffer();
      const pxArr = new Uint8Array(pxVec.size());
      for (let i = 0; i < pxArr.length; i++) {
        pxArr[i] = pxVec.get(i);
      }

      const scaleFactor = canvasWidth / 256;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imgData = ctx.createImageData(256, 240);
      imgData.data.set(pxArr);
      ctx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, canvasHeight);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);

      setRenderFrame(false);
    }
  // }, [renderFrame]);

  useEffect(() => {
    renderFrameCallback();
  }, []);

  useEffect(() => {
    chooseFileRef.current.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const buffer = e.target.result;
        // const bufferAsArr = new Uint8Array(buffer);
        // console.log("Buffer strlen: " + bufferAsArr.length);
        // FIXME: THE PROBLEM IS THAT EACH BYTE IS BEING CONVERTED INTO AN ASCII
        // SO ARR[0,1] = 78 WHICH IS ACTUALLY ASCII FOR 'N'
        // console.log("Buffer header: " + bufferAsArr.slice(0, 4));

        // FIXME: EXPORT MALLOC AND ALLOCATE A BUFFER
        // ALSO COMPILE WITH RUNTIME ASSERTIONS (-S ASSERTIONS=1)

        // FIXME: MALLOC MISSING FREE
        const bufferView = new Uint8Array(buffer);
        const finalBuffer = bufferView.byteOffset;

        console.log("Buffer bytelen: " + bufferView.byteLength);

        console.log("First 4: ", bufferView.slice(0, 4));

        // FIXME: THIS WON'T WORK BECAUSE YOU'RE NOT ALLOWING RAW PTR
        // NOT SURE HOW TO FIX
        // if (emu.loadROM(finalBuffer)) {
        //   emu.setRunEmulation(true);
        // } else {
        //   emu.setRunEmulation(false);
        // }
      }

      reader.readAsArrayBuffer(file);

      return () => {
        chooseFileRef.current.removeEventListener("change", () => {});
      }
    });
  }, [chooseFileRef]);

  return (
    <>
      <div>
        <input ref={chooseFileRef} type="file" />
      </div>
      <canvas ref={canvasRef} id="emuScreen" width={canvasWidth} height={canvasHeight}></canvas>
    </>
  )
}

export default App
