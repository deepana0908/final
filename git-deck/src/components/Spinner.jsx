import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Spinner() {
    return(
        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
            <div className="fs-4">
                <FontAwesomeIcon icon={faSpinner} className="spinner-icon" />
            </div>
        </div>
    )
}