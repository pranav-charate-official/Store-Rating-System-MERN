// frontend/src/pages/admin/addUser.js

import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./addUser.module.css";

const AddUser = () => {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      address: "",
      role: "Normal User",
   });
   const [errors, setErrors] = useState({});
   const router = useRouter();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
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

      if (formData.address.length > 400) {
         errors.address = "Address must be less than 400 characters long";
      }

      return errors;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
      } else {
         const token = localStorage.getItem("jwtToken");
         try {
            const response = await fetch("http://localhost:5000/api/users", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(formData),
            });

            if (!response.ok) {
               throw new Error("Failed to add user");
            }

            alert("User added successfully!");
            setFormData({
               name: "",
               email: "",
               password: "",
               address: "",
               role: "Normal User",
            });
            router.push("/admin/dashboard");
         } catch (error) {
            console.error("Failed to add user:", error);
            alert("Failed to add user. Please try again.");
         }
      }
   };

   return (
      <div className={styles.addUserContainer}>
         <h1>Add User</h1>
         <form onSubmit={handleSubmit} className={styles.form}>
            <label>
               Name:
               <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
               />
               {errors.name && <p className={styles.error}>{errors.name}</p>}
            </label>
            <label>
               Email:
               <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
               />
               {errors.email && <p className={styles.error}>{errors.email}</p>}
            </label>
            <label>
               Password:
               <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
               />
               {errors.password && (
                  <p className={styles.error}>{errors.password}</p>
               )}
            </label>
            <label>
               Address:
               <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
               />
               {errors.address && (
                  <p className={styles.error}>{errors.address}</p>
               )}
            </label>
            <label>
               Role:
               <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
               >
                  <option value="Normal User">Normal User</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Store Owner">Store Owner</option>
               </select>
            </label>
            <button type="submit">Add User</button>
         </form>
      </div>
   );
};

export default AddUser;
