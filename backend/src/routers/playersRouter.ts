import express, { Router } from 'express'
import { getPlayerData } from '../controllers/playerController.js'

const router: Router = express.Router()

/**
 * Route that retrieves match stats related to a specific player identified by their player name
 * and player tag
 */
router.get('/:name', getPlayerData)

export default router
