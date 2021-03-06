import videoTestData from "../data/videos.json"
import { getMyListVideos, getWatchedVideos } from "./db/hasura"

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
  const BASE_URL = "youtube.googleapis.com/youtube/v3"

  const link = `https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`

  // const popular = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${YOUTUBE_API_KEY}`

  const response = await fetch(link)
  return await response.json()
}

export const getCommonVideos = async (url) => {
  try {
    const data =
      process.env.DEVELOPMENT === "true"
        ? videoTestData
        : await fetchVideos(url)

    if (data?.error) {
      console.error("Youtube API error", data.error)
      return []
    }

    return data.items.map((item) => {
      const id = item.id?.videoId || item.id

      const snippet = item.snippet
      return {
        title: snippet.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      }
    })
  } catch (error) {
    console.error("Something went wrong with the video", error)
    return []
  }
}

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&maxResults=10&q=${searchQuery}&type=video`
  return getCommonVideos(URL)
}

export const getPopularVideos = () => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=25&chart=mostPopular&regionCode=US`
  return getCommonVideos(URL)
}

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`
  return getCommonVideos(URL)
}

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token)
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    }
  })
}

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token)
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    }
  })
}
