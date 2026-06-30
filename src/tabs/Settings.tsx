export default function Settings() {
    function resetGame() {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <>
            <h1 className="font-bold">Settings</h1>
            <button onClick={resetGame} className="reset p-2 bg-main2 hover:brightness-120 rounded-lg">
                <p>Reset</p>
            </button>
        </>
    )
}
