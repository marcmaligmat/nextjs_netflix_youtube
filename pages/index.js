import Head from "next/head"
import styles from "../styles/home.module.css"

import Banner from "../components/banner/banner"
import NavBar from "../components/navbar/navbar"
import SectionCards from "../components/card/section-cards"

import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/videos"
import redirectUser from "../utils/redirectUser"

export async function getServerSideProps(context) {
  const { userId, token } = await redirectUser(context)

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    }
  }

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token)
  const disneyVideos = await getVideos("disney trailer")
  const productivityVideos = await getVideos("Productivity")
  const travelVideos = await getVideos("Travel")
  const popularVideos = await getPopularVideos()
  return {
    props: {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchItAgainVideos,
    },
  }
}

const Home = ({
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
  watchItAgainVideos,
}) => {
  // console.log(props)

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Netflix app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="A very cute dog"
          imgUrl="/static/clifford.webp"
        />
      </div>

      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />

        <SectionCards
          title="Watch It again"
          videos={watchItAgainVideos}
          size="small"
        />
        <SectionCards title="Travel" videos={travelVideos} size="small" />
        <SectionCards
          title="Productivity"
          videos={productivityVideos}
          size="medium"
        />
        <SectionCards
          title="Popular Videos"
          videos={popularVideos}
          size="small"
        />
      </div>
    </div>
  )
}

export default Home
