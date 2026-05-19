import AlertOverlay from "./AlertOverlay";

function AlertConfirmAction({ title, text, onCancel, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar", styles }) {

    return (
        <AlertOverlay styles={styles}>

            <div className="alert-content">

                <p className="alert-title">
                    {title}
                </p>

                <p className="alert-text">
                    {text}
                </p>

                <div className="alert-actions" style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>

                    <button
                        className="alert-btn danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                    <button
                        className="alert-btn secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                </div>

            </div>

        </AlertOverlay>
    );

}

export default AlertConfirmAction;
