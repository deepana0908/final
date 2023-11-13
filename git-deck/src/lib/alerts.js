import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

// helper functions to display toast messages
// we use unique IDs to prevent duplication of any sort
function showError(message) {
  toast.error(message, {
    id: uuidv4(),
  });
}

function showSuccess(message) {
  toast.success(message, {
    id: uuidv4(),
  });
}

const Alerts = {
  showError,
  showSuccess,
};

export default Alerts;
