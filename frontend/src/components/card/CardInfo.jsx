import '../../styles/Card.css'

/* MAIN COMPONENT */
function CardInfo({ title, date }) {
    return (
        <div className="card-info">
            <h3 className="card-title">{title}</h3>
            <p className="card-value">{date}</p>
        </div>
    );
}

/* STANDARD EXPORT */
export default CardInfo;