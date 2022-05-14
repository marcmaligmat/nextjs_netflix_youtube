import Head from "next/head"
import NavBar from "../../components/navbar/navbar"
import SectionCards from "../../components/card/section-cards"
import styles from "../../styles/MyList.module.css"

import redirectUser from "../../utils/redirectUser"
import { getMyList } from "../../lib/videos"

export async function getServerSideProps(context) {
  const { userId, token } = await redirectUser(context)
  const videos = await getMyList(userId, token)
  return {
    props: {
      myListVideos: videos,
    },
  }
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
      </main>
      <div className={styles.sectionWrapper}>
        <SectionCards
          title="My List"
          videos={myListVideos}
          size="small"
          shouldWrap
          shouldScale={false}
        />
      </div>
    </div>
  )
}

export default MyList
