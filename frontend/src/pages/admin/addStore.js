// frontend/src/pages/admin/addStore.js

import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./addStore.module.css";

const AddStore = () => {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      address: "",
      owner: "",
   });
   const [error, setError] = useState("");
   const router = useRouter();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const validate = () => {
      const { name, email, address, owner } = formData;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (name.length < 20 || name.length > 60) {
         return "Name must be between 20 and 60 characters long";
      }
      if (!emailRegex.test(email)) {
         return "Invalid email address";
      }
      if (address.length > 400) {
         return "Address must be less than 400 characters long";
      }
      if (!owner) {
         return "Owner is required";
      }
      return "";
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const validationError = validate();
      if (validationError) {
         setError(validationError);
         return;
      }
      const token = localStorage.getItem("jwtToken");
      try {
         const response = await fetch("http://localhost:5000/api/stores", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to add store");
         }

         router.push("/admin/dashboard");
      } catch (error) {
         setError(error.message);
      }
   };

   return (
      <div className={styles.addStoreContainer}>
         <h1>Add Store</h1>
         {error && <p className={styles.error}>{error}</p>}
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
            </label>
            <label>
               Owner (Email):
               <input
                  type="email"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  required
               />
            </label>
            <button type="submit">Add Store</button>
         </form>
      </div>
   );
};

export default AddStore;
