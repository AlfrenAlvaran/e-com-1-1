import React from 'react'
import styles from './css/Sidebar.module.css'
const Sidebar = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h1> {/* Replace with your logo */}</h1>
            </div>
            <div className={styles.profileContainer}>
                <div className={styles.profileIcon}>
                    <span className={styles.letter}>J</span> {/* Replace 'J' with the desired letter */}
                </div>
                <div className={styles.profileInfo}>
                    <h2>John Doe</h2>
                    <button className={styles.logoutButton}>Log Out</button>
                </div>
            </div>
        </header>
    )
}

export default Sidebar