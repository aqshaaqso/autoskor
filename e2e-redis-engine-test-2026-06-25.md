# E2E Redis Engine Test - 2026-06-25

## Summary

End-to-end upload from frontend to middleware and engine driver was successful.

Test result:

- Frontend upload completed.
- Middleware created `scoring_jobs`.
- Middleware discovered engine driver through Redis DB `0`.
- Middleware submitted job to engine driver.
- Engine worker downloaded PDF from middleware file endpoint.
- OCR and LLM/scoring completed.
- Engine callback updated middleware job to `completed_success`.
- Frontend displayed the job as finished.

The remaining issue is frontend result rendering. The engine result JSON shape is different from the current frontend mapper expectation, so score details are not displayed correctly.

## Test Environment

- Date: Thursday, 2026-06-25
- Middleware base URL: `http://172.16.210.244:8000`
- Frontend URL tested: `http://172.16.210.244:5174`
- Engine driver observed:
  - `http://172.16.210.244:8083`
  - `http://172.16.210.244:8084`
- Redis discovery:
  - DB: `0`
  - key pattern: `server:active:*`
- Middleware mode: `ENGINE_MODE=redis`

## Uploaded File

- Filename: `RAT-2018_ (1).pdf`
- MIME type: `application/pdf`
- File size: `4,726,102` bytes
- File ID: `18ad26ae-fd83-488c-98e1-04f9b512f6d6`
- Scoring job ID: `157af1ee-bac8-483e-a5f8-1514e1628417`
- Engine job ID: `157af1ee-bac8-483e-a5f8-1514e1628417`

## Timeline

- Uploaded: `2026-06-25T14:13:59Z` / `2026-06-25 21:13:59 WIB`
- OCR completed and LLM chunks dispatched: around `2026-06-25 21:15:27 WIB`
- Completed: `2026-06-25T14:23:11Z` / `2026-06-25 21:23:11 WIB`
- Approximate processing time: 9 minutes 12 seconds

## Middleware API Evidence

Health check:

```txt
GET http://172.16.210.244:8000/api/health
200 OK
{"status":"ok","env":"production"}
```

Job detail after completion:

```txt
GET http://172.16.210.244:8000/api/scoring-jobs/157af1ee-bac8-483e-a5f8-1514e1628417
```

Important fields:

```json
{
  "id": "157af1ee-bac8-483e-a5f8-1514e1628417",
  "status": "completed_success",
  "progress_percent": 100,
  "engine_job_id": "157af1ee-bac8-483e-a5f8-1514e1628417",
  "finished_at": "2026-06-25T14:23:11.609615Z",
  "result": {
    "scoring_job_id": "157af1ee-bac8-483e-a5f8-1514e1628417",
    "result_data": {
      "status": "calculated",
      "total_skor": 21,
      "scoring_job_id": "157af1ee-bac8-483e-a5f8-1514e1628417",
      "detail_indikator": {}
    }
  }
}
```

File endpoint used by engine and frontend preview:

```txt
GET http://172.16.210.244:8000/api/scoring-jobs/157af1ee-bac8-483e-a5f8-1514e1628417/file?disposition=inline
200 OK
Content-Type: application/pdf
Size: 4,726,102 bytes
```

Important clarification:

- Engine worker did download the PDF from this endpoint successfully, based on engine worker logs.
- The observed middleware request that took about `3.49 s` came from client IP `192.168.77.17`, so it was most likely frontend/browser PDF preview, not the engine worker download.
- Engine download duration was not captured precisely from middleware logs because the retained screen log no longer included the `14:13-14:14` upload/download window.

## Engine Log Evidence

Engine driver accepted the job:

```txt
[server] created scoring job 157af1ee-bac8-483e-a5f8-1514e1628417 for file http://127.0.0.1:8000/api/scoring-jobs/157af1ee-bac8-483e-a5f8-1514e1628417/file?disposition=inline
POST "/api/v1/jobs" 201
```

Engine worker downloaded the PDF from middleware and completed OCR:

```txt
Successfully downloaded PDF file
Converted PDF to base64 Data URI
Received HTTP response status_code=200
OCR processing completed successfully text_length=46382
task succeeded task_type=ocr_pdf
```

Engine then dispatched LLM extraction chunks:

```txt
dispatching LLM task chunk 1/2
dispatching LLM task chunk 2/2
```

The job later completed and callback result was stored by middleware.

## Frontend Rendering Issue

The frontend result page URL tested:

```txt
http://172.16.210.244:5174/processed/157af1ee-bac8-483e-a5f8-1514e1628417
```

Frontend displays the job as finished, but the score summary shows:

```txt
Skor Parsial: 0.00 / 85
Persentase Parsial: 0.0%
Predikat Kesehatan: blank
```

This is not an upload or middleware issue. The backend result exists, but the frontend mapper does not yet support the real engine result shape.

Current frontend mapper expects fields like:

```js
resultData.totalSkorParsial
resultData.total_skor_parsial
resultData.predikat
resultData.detail
```

Real engine output contains fields like:

```json
{
  "status": "calculated",
  "total_skor": 21,
  "detail_indikator": {
    "skor_kas": {
      "skor": 0,
      "bobot": 0.1,
      "nilai": 0,
      "rasio": 0
    },
    "skor_cadangan_risiko": {
      "skor": 5,
      "bobot": 0.05,
      "nilai": 100,
      "rasio": 0
    }
  },
  "raw_extractions": []
}
```

## Frontend Fix Notes

Update frontend mapper:

```txt
autoskor-frontend/src/shared/api/scoringJobs/scoringJobsMapper.js
```

Recommended mapping:

- Map `result_data.total_skor` into UI `totalSkorParsial`.
- Convert `result_data.detail_indikator` object into the UI table array.
- Use object key as fallback component name, for example `skor_cadangan_risiko`.
- Map:
  - `rasio` -> `nilaiRasio`
  - `nilai` -> `nilai`
  - `bobot` -> `bobot`
  - `skor` -> `skor`
- Calculate `persentaseParsial` from score if needed.
- Derive `predikat` from `total_skor`, or ask engine to return explicit `predikat`/`keterangan`.

Potential minimal mapper support:

```js
const totalSkor = resultData.total_skor ?? resultData.totalSkorParsial ?? resultData.total_skor_parsial ?? 0
const detailIndikator = resultData.detail_indikator ?? {}

const detail = Object.entries(detailIndikator).map(([key, value]) => ({
  aspek: 'Penilaian Kesehatan',
  komponen: key,
  nilaiRasio: value.rasio ?? 0,
  nilai: value.nilai ?? 0,
  bobot: value.bobot ?? 0,
  skor: value.skor ?? 0,
  persentaseMaks: value.bobot ? (value.skor / (value.bobot * 100)) * 100 : 0,
  status: value.skor > 0 ? 'terpenuhi' : 'tidak_terpenuhi',
}))
```

## Conclusion

Redis discovery and engine integration are working end to end.

The next fix is frontend-only: adapt result rendering to the real engine result payload under `result.result_data`.
