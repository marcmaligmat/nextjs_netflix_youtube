import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import styles from "../styles/login.module.css"

import { useEffect, useState } from "react"
import { magic } from "../lib/magic-client"

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [userMsg, setUserMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleKeyDownEnter = (e) => {
    if (e.key === "Enter") {
      handleLoginWithEmail(e)
    }
  }

  const handleOnChangeEmail = (e) => {
    const email = e.target.value
    setEmail(email)
  }
  const handleLoginWithEmail = async (e) => {
    e.preventDefault()

    if (email) {
      try {
        setIsLoading(true)
        const didToken = await magic.auth.loginWithMagicLink({
          email,
        })

        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          })

          const loggedInResponse = await response.json()
          if (loggedInResponse.done) {
            router.push("/")
          } else {
            setIsLoading(false)
            setUserMsg("Something went wrong logging in")
          }

          // router.push("/")
        }
      } catch (error) {
        // Handle errors if required!
        console.error("Something Went Wrong loggin in", error)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
      setUserMsg("Something went wrong logging in")
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Sign In</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/" passHref>
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix Logo"
                width="128"
                height="34"
              />
            </div>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email Address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
            onKeyDown={handleKeyDownEnter}
          ></input>

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading" : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Login
