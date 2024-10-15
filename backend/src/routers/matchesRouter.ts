import express, { Router } from 'express'
import { getMatchById } from '../controllers/matchController.js'

const router: Router = express.Router()

/**
 * Route for getting match stats from a match_id
 */
router.get('/:match_id', getMatchById)

export default router
