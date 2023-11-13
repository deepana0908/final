import { faFan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IconButton({
  btnText,
  loadingText,
  icon,
  isLoading = false,
  disabled = false,
  className = undefined,
  ...rest // collect the rest of the props
}) {
  return (
      <button
      className={`btn ${className || ""}`}
      disabled={isLoading || disabled}
      {...rest}  // pass rest of the props
    >
      <FontAwesomeIcon
        icon={isLoading ? faFan : icon}
        className="me-2"
      />

      {isLoading && loadingText ? loadingText : btnText}
    </button>
  );
}
