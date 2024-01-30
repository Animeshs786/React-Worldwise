import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();
  function backBtnHandler(e) {
    e.preventDefault();
    navigate(-1);
  }
  return (
    <Button type="back" onClick={backBtnHandler}>
      &larr; Back
    </Button>
  );
}

export default BackButton;
