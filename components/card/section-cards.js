import Card from "./card"
import styles from "./section-cards.module.css"
import Link from "next/link"
import clsx from "classnames"

const SectionCards = (props) => {
  if (props?.videos?.length === 0) {
    return
  }
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, idx) => {
          return (
            <Link href={`/video/${video.id}`} key={idx} passHref>
              <a>
                <Card
                  id={idx}
                  imgUrl={video.imgUrl}
                  size={size}
                  shouldScale={shouldScale}
                />
              </a>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default SectionCards
