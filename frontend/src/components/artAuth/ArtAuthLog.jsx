import '../../styles/ArtAuth.css';

/* MAIN COMPONENT */
function ArtAuthLog({ type, text, img }) {
    const lines = text.split("\n");

    return (
        <div className={`art ${type} dir-left`}>
            <span>
                BYTE DONTO
            </span>

            <div className='frases'>
                {lines.map((line, i) => (
                    <h1 key={i} className="text75">
                        {line}
                        <br />
                    </h1>
                ))}
            </div>

            <img src={img} alt="" />
        </div>
    );
}

/* STANDARD EXPORT */
export default ArtAuthLog;