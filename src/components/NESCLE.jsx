import { useRef } from 'react';

import NavBar from './NavBar';
import EmuScreen from './EmuScreen';

function NESCLE(props) {
    const { width, height } = props;

    const canvasRef = useRef(null);

    // FIXME: RETURN 3/4 WHEN BUG IS FIXED
    return (
        <div id="nescleWrapper" width={width} height={height}>
            <NavBar canvasRef={canvasRef} width={Math.floor(width / 4)} height={Math.floor(height / 4)} />
            <EmuScreen canvasRef={canvasRef} width={Math.floor(width * 2/4)} height={Math.floor(height * 2/4)} />
        </div>
    );
}

export default NESCLE;
