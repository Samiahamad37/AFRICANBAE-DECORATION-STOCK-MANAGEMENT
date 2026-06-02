import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

function ResetPasswordConfirm() {
  const { uidb64, token } = useParams();

  const [new_password, setNewPassword] = useState("");
  const [new_password2, setNewPassword2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://127.0.0.1:8000/api/password-reset-confirm/${uidb64}/${token}/`,
      {
        new_password,
        new_password2,
      
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setNewPassword2(e.target.value)}
      />

      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ResetPasswordConfirm;