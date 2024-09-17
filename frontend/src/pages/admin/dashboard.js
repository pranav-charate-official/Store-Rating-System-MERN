import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import styles from "./dashboard.module.css";

const AdminDashboard = () => {
   const [dashboardData, setDashboardData] = useState({
      users: [],
      stores: [],
      ratings: [],
   });
   const [sortConfig, setSortConfig] = useState({
      key: "name",
      direction: "ascending",
   });
   const router = useRouter();

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(
               "http://localhost:5000/api/users/admin/dashboard",
               {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${token}`,
                  },
               }
            );

            if (!response.ok) {
               throw new Error("Failed to fetch dashboard data");
            }

            const data = await response.json();
            setDashboardData(data);
         } catch (error) {
            console.error("Failed to fetch dashboard data", error);
         }
      };

      fetchDashboardData();
   }, []);

   const sortedUsers = useMemo(() => {
      let sortableUsers = [...dashboardData.users];
      if (sortConfig !== null) {
         sortableUsers.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
               return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
               return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
         });
      }
      return sortableUsers;
   }, [dashboardData.users, sortConfig]);

   const sortedStores = useMemo(() => {
      let sortableStores = [...dashboardData.stores];
      if (sortConfig !== null) {
         sortableStores.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
               return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
               return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
         });
      }
      return sortableStores;
   }, [dashboardData.stores, sortConfig]);

   const requestSort = (key) => {
      let direction = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
         direction = "descending";
      }
      setSortConfig({ key, direction });
   };

   const totalUsers = dashboardData.users.length;
   const totalStores = dashboardData.stores.length;
   const usersWhoSubmittedRatings = new Set(
      dashboardData.ratings.map((rating) => rating.user.toString())
   ).size;

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

   return (
      <div className={styles.dashboardContainer}>
         <div className={styles.header}>
            <button onClick={() => router.push("/admin/addUser")}>
               Add User
            </button>
            <button onClick={() => router.push("/admin/addStore")}>
               Add Store
            </button>
            <button onClick={() => router.push("/auth/changePassword")}>
               Change Password
            </button>
            <button onClick={handleLogout}>Logout</button>
         </div>
         <h1>Admin Dashboard</h1>
         <div className={styles.stats}>
            <div className={styles.statItem}>
               <h2>Total Users</h2>
               <p>{totalUsers}</p>
            </div>
            <div className={styles.statItem}>
               <h2>Total Stores</h2>
               <p>{totalStores}</p>
            </div>
            <div className={styles.statItem}>
               <h2>Users Submitted Ratings</h2>
               <p>{usersWhoSubmittedRatings}</p>
            </div>
         </div>
         <div className={styles.listings}>
            <h2>Users</h2>
            <table className={styles.table}>
               <thead>
                  <tr>
                     <th onClick={() => requestSort("name")}>
                        Name{" "}
                        {sortConfig.key === "name"
                           ? sortConfig.direction === "ascending"
                              ? "▲"
                              : "▼"
                           : ""}
                     </th>
                     <th onClick={() => requestSort("email")}>
                        Email{" "}
                        {sortConfig.key === "email"
                           ? sortConfig.direction === "ascending"
                              ? "▲"
                              : "▼"
                           : ""}
                     </th>
                     <th>Address</th>
                     <th>Role</th>
                     <th>Average Rating</th>
                  </tr>
               </thead>
               <tbody>
                  {sortedUsers.map((user) => (
                     <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.address}</td>
                        <td>{user.role}</td>
                        <td>
                           {user.role === "Store Owner"
                              ? user.averageRating !== "N/A"
                                 ? user.averageRating.toFixed(2)
                                 : "N/A"
                              : "N/A"}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            <h2>Stores</h2>
            <table className={styles.table}>
               <thead>
                  <tr>
                     <th onClick={() => requestSort("name")}>
                        Name{" "}
                        {sortConfig.key === "name"
                           ? sortConfig.direction === "ascending"
                              ? "▲"
                              : "▼"
                           : ""}
                     </th>
                     <th onClick={() => requestSort("email")}>
                        Email{" "}
                        {sortConfig.key === "email"
                           ? sortConfig.direction === "ascending"
                              ? "▲"
                              : "▼"
                           : ""}
                     </th>
                     <th>Address</th>
                     <th>Average Rating</th>
                  </tr>
               </thead>
               <tbody>
                  {sortedStores.map((store) => (
                     <tr key={store._id}>
                        <td>{store.name}</td>
                        <td>{store.email}</td>
                        <td>{store.address}</td>
                        <td>{store.averageRating.toFixed(2)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default AdminDashboard;
