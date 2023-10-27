import './styles/EmuScreen.css';

function EmuScreen(props) {
    const { canvasRef, width, height } = props;

    const gameInserted = false;

    const nativeWidth = 256;
    const nativeHeight = 240;

    const widthScaleFactor = Math.floor(height / nativeHeight);
    const heightScaleFactor = Math.floor(width / nativeWidth);
    const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

    const scaledWidth = nativeWidth * scaleFactor;
    const scaledHeight = nativeHeight * scaleFactor;

    return (
        <div className="screenContainer" width={width} height={height}>
            <div className="screenChild" >
                <canvas style={{"display": "none"}} ref={canvasRef} width={nativeWidth} height={nativeHeight}></canvas>
                {
                    gameInserted ?
                        <canvas ref={canvasRef} width={scaledWidth} height={scaledHeight}></canvas>
                        : <p>Insert a game to play</p>
                }
            </div>
        </div>
    );
}

export default EmuScreen;
