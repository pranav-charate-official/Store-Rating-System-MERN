import React, { useState } from "react";
import axios from "axios";
import styles from "./Signup.module.css";
import { useRouter } from "next/router";

const Signup = () => {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
   });

   const router = useRouter();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const validate = () => {
      const errors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

      if (formData.name.length < 20 || formData.name.length > 60) {
         errors.name = "Name must be between 20 and 60 characters long";
      }

      if (!emailRegex.test(formData.email)) {
         errors.email = "Invalid email address";
      }

      if (!passwordRegex.test(formData.password)) {
         errors.password =
            "Password must be between 8 and 16 characters long and include at least one uppercase letter and one special character";
      }

      if (formData.password !== formData.confirmPassword) {
         errors.confirmPassword = "Passwords do not match";
      }

      if (formData.address.length > 400) {
         errors.address = "Address must be less than 400 characters long";
      }

      return errors;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
         const errorMessages = Object.values(validationErrors).join("\n");
         alert(errorMessages);
      } else {
         try {
            const response = await axios.post(
               "http://localhost:5000/api/auth/signup",
               formData
            );
            if (response.status === 201) {
               alert("Signup successful! Please Login");
               setFormData({
                  name: "",
                  email: "",
                  address: "",
                  password: "",
                  confirmPassword: "",
               });
               // Redirect to login page
               router.push("/auth/login");
            } else {
               alert("Signup failed. Please try again.");
            }
         } catch (error) {
            if (
               error.response &&
               error.response.data &&
               error.response.data.error
            ) {
               alert(`Signup failed: ${error.response.data.error}`);
            } else {
               alert("An error occurred during signup. Please try again.");
            }
         }
      }
   };

   return (
      <div className={styles.signupContainer}>
         <h2>Sign Up for Normal Users</h2>
         <form onSubmit={handleSubmit}>
            <div>
               <label>Name:</label>
               <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
               />
            </div>
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
               <label>Address:</label>
               <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  autoComplete="address-line1"
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
                  autoComplete="new-password webauthn"
                  required
               />
            </div>
            <div>
               <label>Confirm Password:</label>
               <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password webauthn"
                  required
               />
            </div>
            <button type="submit">Sign Up</button>
         </form>
      </div>
   );
};

export default Signup;
