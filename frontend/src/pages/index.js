import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
   return (
      <>
         <Head>
            <title>Store Rating System</title>
            <meta
               name="description"
               content="Created using Next.js and MERN Stack"
            />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1"
            />
         </Head>
         <main className={styles.mainContainer}>
            <h1>
               Welcome to the <span>Store Rating System</span>
            </h1>
            <h3>
               This is a simple store rating system created using Next.js and
               MERN Stack.
            </h3>

            <h4>
               <i>Created by Mr. Pranav Charate</i>
            </h4>

            <p>Start by creating a new account or logging in.</p>
            <div className={styles.homeButtons}>
               <Link href="/auth/login">
                  <button>Log In</button>
               </Link>
               <Link href="/auth/signup">
                  <button>Sign Up</button>
               </Link>
            </div>
         </main>
      </>
   );
}
