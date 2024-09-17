// frontend/src/pages/user/dashboard.js

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./dashboard.module.css";

const UserDashboard = () => {
   const [stores, setStores] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const router = useRouter();

   useEffect(() => {
      const fetchStores = async () => {
         const token = localStorage.getItem("jwtToken");
         try {
            const response = await fetch("http://localhost:5000/api/stores", {
               method: "GET",
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            const data = await response.json(); // Parse the response as JSON
            setStores(data); // Set the parsed data to the stores state
         } catch (error) {
            console.error("Failed to fetch stores:", error);
         }
      };

      fetchStores();
   }, []);

   const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
   };

   const handleRatingSubmit = async (storeId, rating) => {
      const token = localStorage.getItem("jwtToken");
      try {
         await axios.post(
            "http://localhost:5000/api/stores/rate",
            { storeId, rating },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         setStores((prevStores) =>
            prevStores.map((store) =>
               store._id === storeId ? { ...store, userRating: rating } : store
            )
         );
      } catch (error) {
         console.error("Failed to submit rating:", error);
      }
   };

   const handleLogout = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
         await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         });
         localStorage.removeItem("jwtToken");
         router.push("/auth/login");
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   const filteredStores = stores.filter(
      (store) =>
         store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         store.address.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className={styles.dashboardContainer}>
         <div className={styles.topBar}>
            <button onClick={() => router.push("/auth/changePassword")}>
               Change Password
            </button>
            <button onClick={handleLogout}>Logout</button>
         </div>
         <h2>User Dashboard</h2>
         <input
            type="text"
            placeholder="Search stores by name or address"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
         />
         <table className={styles.storeTable}>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Overall Rating</th>
                  <th>My Rating</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {filteredStores.length === 0 ? (
                  <tr>
                     <td colSpan="5">No stores found</td>
                  </tr>
               ) : (
                  filteredStores.map((store) => (
                     <tr key={store._id}>
                        <td>{store.name}</td>
                        <td>{store.address}</td>
                        <td>{store.averageRating.toFixed(2)}</td>
                        <td>{store.userRating}</td>
                        <td>
                           <select
                              value={
                                 store.userRating === "Not rated"
                                    ? ""
                                    : store.userRating
                              }
                              onChange={(e) =>
                                 handleRatingSubmit(store._id, e.target.value)
                              }
                           >
                              <option value="" disabled>
                                 Rate
                              </option>
                              {[1, 2, 3, 4, 5].map((rating) => (
                                 <option key={rating} value={rating}>
                                    {rating}
                                 </option>
                              ))}
                           </select>
                        </td>
                     </tr>
                  ))
               )}
            </tbody>
         </table>
      </div>
   );
};

export default UserDashboard;
