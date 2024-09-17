import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./Navbar.module.css";

const Navbar = ({ user }) => {
   const router = useRouter();

   const handleLogout = async () => {
      try {
         await axios.post("http://localhost:5000/api/auth/logout");
         router.push("/auth/login");
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   return (
      <nav className={styles.navbar}>
         <ul>
            <li>
               <Link href="/">Home</Link>
            </li>
            {user && (
               <>
                  <li>
                     <Link href="/change-password">Change Password</Link>
                  </li>
                  <li>
                     <button onClick={handleLogout}>Logout</button>
                  </li>
                  {user.role === "System Admin" && (
                     <>
                        <li>
                           <Link href="/admin/dashboard">Admin Dashboard</Link>
                        </li>
                        <li>
                           <Link href="/admin/add-user">Add User</Link>
                        </li>
                        <li>
                           <Link href="/admin/add-store">Add Store</Link>
                        </li>
                     </>
                  )}
                  {user.role === "Normal User" && (
                     <>
                        <li>
                           <Link href="/user/dashboard">User Dashboard</Link>
                        </li>
                        <li>
                           <Link href="/stores">Stores</Link>
                        </li>
                     </>
                  )}
                  {user.role === "Store Owner" && (
                     <>
                        <li>
                           <Link href="/owner/dashboard">Owner Dashboard</Link>
                        </li>
                     </>
                  )}
               </>
            )}
         </ul>
      </nav>
   );
};

export default Navbar;
