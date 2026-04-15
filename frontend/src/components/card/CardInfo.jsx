import '../../styles/Card.css'

/* MAIN COMPONENT */
function CardInfo({ title, date }) {
    return (
        <>
            <div className={`card-info`}>
                <h1 style={{ textAlign: "center" }}>{title}</h1>
                <p>{date}</p>
            </div>
        </>
    );

}

/* STANDARD EXPORT */
export default CardInfo;