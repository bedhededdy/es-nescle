import { useRef, useCallback } from "react";

function NavBar(props) {
    const { canvasRef, width, height } = props;

    const chooseFileRef = useRef(null);
    const githubARef = useRef(null);

    const loadGameOnClick = useCallback(() => {
        chooseFileRef.current.click();
    }, []);

    const chooseFileOnChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        console.log("You selected file: " + file.name);
    }, [])

    const githubOnClick = useCallback(() => {
        githubARef.current.click();
    }, []);

    // PROBABLY WILL NEED INLINE BLOCK HERE AND THAT OTHER STYLE THAT MAKES
    // RIGHT ALIGN DO WHAT YOU WANT
    return (
        <div id="navbarWrapper">
            <nav style={{"width": width, "height": height}}>
                <span className="leftBtnContainer">
                    <button onClick={loadGameOnClick}>Load Game</button>
                </span>
                <span className="rightBtnContainer">
                    <button>Pause Emulator</button>
                    <button onClick={githubOnClick}>Github</button>
                    <button>About</button>
                </span>
            </nav>

            <div style={{"display": "none"}}>
                <input type="file" ref={chooseFileRef} onChange={chooseFileOnChange}/>
                <a ref={githubARef} href="https://github.com/bedhededdy/es-nescle" target="_blank"></a>
            </div>
        </div>
    )
}

export default NavBar;
