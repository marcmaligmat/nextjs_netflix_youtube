import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura"

import { verifyToken } from "../../lib/utils"

export default async function stats(req, resp) {
  try {
    const token = req.cookies.token
    if (!token) {
      resp.status(403).send({})
    } else {
      const inputParams = req.method === "POST" ? req.body : req.query
      const { videoId } = inputParams
      const userId = await verifyToken(token)

      if (videoId) {
        const findVideo = await findVideoIdByUser(token, userId, videoId)
        const doesStatsExists = findVideo?.length > 0

        if (req.method === "POST") {
          const { favourited, watched = true } = req.body
          if (doesStatsExists) {
            const response = await updateStats(token, {
              userId,
              videoId,
              favourited,
              watched,
            })
            resp.send({ data: response })
          } else {
            const response = await insertStats(token, {
              userId,
              videoId,
              favourited,
              watched,
            })
            resp.send({ data: response })
          }
        } else {
          if (videoId) {
            const findVideo = await findVideoIdByUser(token, userId, videoId)
            const doesStatsExists = findVideo?.length > 0
            if (doesStatsExists) {
              resp.send(findVideo)
            } else {
              resp.send({ user: null, msg: "Video Not found" })
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error Occured /stats", error)
    resp.status(500).send({ done: false, error: error?.message })
  }
}
