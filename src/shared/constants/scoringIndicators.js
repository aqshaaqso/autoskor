import {
  SCORING_DETAIL_INDICATOR_META,
  SCORING_DETAIL_INDICATORS,
} from './scoringDetailIndicators'
import { buildPreferredIndikatorKeyMap } from '@/shared/utils/resultDetail'
import { ASPEK } from './aspek'

export const INDIKATOR_META = { ...SCORING_DETAIL_INDICATOR_META }

export const PREFERRED_INDIKATOR_KEY = buildPreferredIndikatorKeyMap(INDIKATOR_META)

function formatIndikatorKey(key) {
  const label = key.replace(/^skor_/, '').replaceAll('_', ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getIndikatorMeta(key) {
  const meta = INDIKATOR_META[key]
  if (meta) return meta

  return {
    aspek: ASPEK.PENILAIAN_KESEHATAN,
    komponen: formatIndikatorKey(key),
  }
}

export { SCORING_DETAIL_INDICATORS }