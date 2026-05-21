import { Router } from 'express';
import { query, queryOne } from '../db/pool';
import { getImageUrl } from '../services/imageUrl';

const router = Router();

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    let profile = await queryOne<any>('SELECT * FROM user_profiles WHERE id = ?', [id]);
    if (!profile) {
      profile = await queryOne<any>('SELECT * FROM user_profiles WHERE is_active = 1 LIMIT 1');
    }
    if (!profile) return res.status(404).json({ error: 'Not found' });
    const workExperience = profile.user_id
      ? await query<any>('SELECT * FROM user_work_experience WHERE user_id=? ORDER BY start_year DESC, start_month DESC', [profile.user_id])
      : [];
    res.json({ profile: { ...profile, photoUrl: getImageUrl(profile.photo, 'profiles'), workExperience } });
  } catch (err) { next(err); }
});

export default router;
