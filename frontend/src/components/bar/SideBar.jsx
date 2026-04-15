/* IMPORTS OF COMPONENTS */
import '../../styles/Bar.css'
import ButtonsCamps from '../buttons/ButtonsSadeBar'

/* MAIN COMPONENT */
function SideBar({ opc, styles }) {
    return (
        <>
            <div className={`sidebar ${styles}`}>
                {opc.map((op) => (
                    <ButtonsCamps
                        key={op.id}
                        icon={op.icon}
                        name={op.name}
                        style={op.style}
                        url={op.url}
                    />
                ))}
            </div>
        </>
    );

}

/* STANDARD EXPORT */
export default SideBar;