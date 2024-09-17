import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "./changePassword.module.css";

const ChangePassword = () => {
   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const router = useRouter();

   const validatePassword = (password) => {
      const passwordRegex =
         /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
      return passwordRegex.test(password);
   };

   const handleChangePassword = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
         setError("New password and confirm password do not match");
         return;
      }

      if (!validatePassword(newPassword)) {
         setError(
            "Password must be 8-16 characters long, include at least one uppercase letter and one special character"
         );
         return;
      }

      try {
         const token = localStorage.getItem("jwtToken");
         const response = await fetch(
            "http://localhost:5000/api/auth/change-password",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ oldPassword, newPassword }),
            }
         );

         if (response.status === 200) {
            setSuccess("Password changed successfully");
            setError("");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            alert("Password changed successfully. Please login again.");
            router.push("/auth/login");
         } else if (response.status === 400) {
            console.log(response.data.error);
         }
      } catch (error) {
         setError("Error changing password");
      }
   };

   return (
      <div className={styles.changePasswordContainer}>
         <h2 className={styles.changePasswordTitle}>Change Password</h2>
         {error && <p className={styles.error}>{error}</p>}
         {success && <p className={styles.success}>{success}</p>}
         <form onSubmit={handleChangePassword}>
            <div className={styles.formGroup}>
               <label>Old Password</label>
               <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
               />
            </div>
            <div className={styles.formGroup}>
               <label>New Password</label>
               <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
               />
            </div>
            <div className={styles.formGroup}>
               <label>Confirm New Password</label>
               <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
               />
            </div>
            <button type="submit" className={styles.button}>
               Change Password
            </button>
         </form>
      </div>
   );
};

export default ChangePassword;
