import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [emu, setEmu] = useState(new window.emuModule.ESEmu());

  const canvasRef = useRef(null);

  const canvasWidth = 512;
  const canvasHeight = 480;

  useEffect(() => {
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
  }, [canvasRef]);
  

  return (
    <>
      <canvas ref={canvasRef} id="emuScreen" width={canvasWidth} height={canvasHeight}></canvas>
    </>
  )
}

export default App
