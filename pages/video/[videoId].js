import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Modal from "react-modal"
import styles from "../../styles/video.module.css"
import { getYoutubeVideoById } from "../../lib/videos"
import clsx from "classnames"

import NavBar from "../../components/navbar/navbar"

import DisLike from "../../components/icons/dislike-icon"
import Like from "../../components/icons/like-icon"

Modal.setAppElement("#__next")

export async function getStaticProps(context) {
  const videoId = context.params.videoId
  const videoArray = await getYoutubeVideoById(videoId)

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"]

  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }))

  return { paths, fallback: "blocking" }
}

const Video = ({ video }) => {
  const router = useRouter()
  const videoId = router.query.videoId

  const [toggleLike, setToggleLike] = useState(false)
  const [toggleDislike, setToggleDislike] = useState(false)

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      })

      const videoData = await response.json()
      if (videoData.length > 0) {
        const favourited = videoData[0].favourited
        if (favourited === 1) {
          setToggleLike(true)
        } else if (favourited === 0) {
          setToggleDislike(true)
        }
      }
    }
    getData().catch(console.error)
  })

  const runRatingService = async (favourited) => {
    return await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited,
      }),
      headers: {
        Accept: "Application/Json",
        "Content-type": "Application/json",
      },
    })
  }
  const handleToggleLike = async () => {
    const val = !toggleLike
    setToggleLike(val)
    setToggleDislike(toggleLike)

    const favourited = val ? 1 : 0
    await runRatingService(favourited)
  }

  const handleToggleDislike = async () => {
    setToggleDislike(!toggleDislike)
    setToggleLike(toggleDislike)
    const val = !toggleDislike
    const favourited = val ? 0 : 1
    await runRatingService(favourited)
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLable="Watch The video"
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <iframe
          className={styles.videoPlayer}
          id="ytplayer"
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?origin=http://example.com&controls=0&rel=0`}
          frameBorder="0"
        ></iframe>
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDislike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast:&nbsp;</span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count:&nbsp;</span>
                <span className={styles.viewCount}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Video
