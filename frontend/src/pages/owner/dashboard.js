import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "./dashboard.module.css";

const StoreOwnerDashboard = () => {
   const [usersWhoRated, setUsersWhoRated] = useState([]);
   const [averageRating, setAverageRating] = useState(0);
   const router = useRouter();

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            const token = localStorage.getItem("jwtToken"); // Retrieve the token from local storage
            const response = await fetch(
               "http://localhost:5000/api/users/storeOwner/dashboard",
               {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${token}`,
                  },
               }
            );
            console.log(response);

            if (!response.ok) {
               throw new Error("Failed to fetch dashboard data");
            }

            const data = await response.json();
            setUsersWhoRated(data.usersWhoRated);
            setAverageRating(data.averageRating);
         } catch (error) {
            console.error("Error fetching dashboard data", error);
         }
      };

      fetchDashboardData();
   }, []);

   const handleLogout = async () => {
      try {
         const token = localStorage.getItem("jwtToken"); // Retrieve the token from local storage
         await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         });
         localStorage.removeItem("jwtToken"); // Remove the token from local storage
         router.push("/auth/login");
      } catch (error) {
         console.error("Error logging out", error);
      }
   };
   return (
      <div className={styles.dashboardContainer}>
         <div className={styles.header}>
            <button onClick={() => router.push("/auth/changePassword")}>
               Change Password
            </button>
            <button onClick={handleLogout} className={styles.button}>
               Logout
            </button>
         </div>
         <div className={styles.stats}>
            <div className={styles.statItem}>
               <h2>Average Rating</h2>
               <p>{averageRating.toFixed(2)}</p>
            </div>
         </div>
         <div className={styles.listings}>
            <h2>Users Who Rated Your Store</h2>
            <table className={styles.table}>
               <thead>
                  <tr>
                     <th>Name</th>
                     <th>Email</th>
                     <th>Address</th>
                     <th>Rating</th>
                  </tr>
               </thead>
               <tbody>
                  {usersWhoRated.map((user) => (
                     <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.address}</td>
                        <td>{user.rating}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default StoreOwnerDashboard;
