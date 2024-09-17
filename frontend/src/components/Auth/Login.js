import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "./Login.module.css";

const Login = () => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      role: "",
   });

   const router = useRouter();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post(
            "http://localhost:5000/api/auth/login",
            formData
         );
         if (response.status === 200) {
            alert("Login successful!");
            localStorage.setItem("jwtToken", response.data.token);
            // Redirect based on user role
            if (formData.role === "System Admin") {
               router.push("/admin/dashboard");
            } else if (formData.role === "Normal User") {
               router.push("/user/dashboard");
            } else if (formData.role === "Store Owner") {
               router.push("/owner/dashboard");
            }
         } else {
            alert("Login failed. Please try again.");
         }
      } catch (error) {
         if (
            error.response &&
            error.response.data &&
            error.response.data.error
         ) {
            alert(`Login failed: ${error.response.data.error}`);
         } else {
            alert("An error occurred during login. Please try again.");
         }
      }
   };

   return (
      <div className={styles.loginContainer}>
         <h2>Login</h2>
         <form onSubmit={handleSubmit}>
            <div>
               <label>Email:</label>
               <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
               />
            </div>
            <div>
               <label>Password:</label>
               <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
               />
            </div>
            <div>
               <label>Who are you?</label>
               <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
               >
                  <option value="">Select Role</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Normal User">Normal User</option>
                  <option value="Store Owner">Store Owner</option>
               </select>
            </div>
            <button type="submit">Login</button>
         </form>
      </div>
   );
};

export default Login;
