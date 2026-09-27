# Dentist Interview Coach

[Open the Vercel app](https://dentist-interview-coach.vercel.app). Code and shared reference summaries live in this repository. Vercel is connected to `main` and publishes commits automatically.

## Update the shared knowledge pack

1. Open [`dist/knowledge/sources.json`](dist/knowledge/sources.json) in GitHub and click the pencil icon (or use the [direct editor](https://github.com/GitManeesh/Dentist-Interview-Coach/edit/main/dist/knowledge/sources.json)).
2. Update or add a **short summary in your own words**, in both `en` and `de`. Include search terms in `terms`, an official HTTPS source URL in `official`, and the source name in `officialName`. Include a `page` only when you personally verified that the 2016 textbook covers that background topic; otherwise use `null`.
3. Change `revision` (for example, `2026-09-27.2`) and `reviewedAt`. Commit to `main`. The validation workflow checks the data format and approved source domains; it **does not verify medical claims**.
4. After Vercel finishes redeploying, open **Knowledge sources & answer check** in the app. It displays the current revision. Search for the topic and check **Teach me** for matching interview questions.

The knowledge pack is loaded from JSON when the app opens. Changing this JSON does not require editing JavaScript. It does require a Vercel deployment, which the GitHub integration triggers on pushes to `main`.

## Source policy

- The textbook is *In der Zahnarztpraxis: Behandlungsassistenz* (Cornelsen, 2016), intended for dental assistants. The scanned book is **not** hosted in this repository or on the public app. Only short, reviewed summaries and page references are published.
- Current clinical and licensing statements need a checked professional source, with its URL. The app shows these alongside textbook background when appropriate.
- If the pack is unavailable or a query has no matching reviewed topic, the app does not invent a source-backed answer.
- Personal notes added inside the app stay in that browser. They do not change shared knowledge or scoring.
- The app does **not** sync Google Drive, OCR uploaded files, search the live internet, or use an AI model. Full-document retrieval and automatic web fallback would require a private processing and search backend, credentials, and review before publishing.

## Local checks

```bash
node scripts/validate-knowledge.mjs
node --check dist/app.js
node --check dist/reference.js
```

Vercel uses `vercel.json` to publish the `dist` directory. No build command or environment variable is needed for the current static app.

## Answer feedback

The interview asks one follow-up about the first missing rubric point in an answered question. The report displays the exact answer excerpt that matched each point and a related reviewed source summary for mapped clinical topics. Matching words is **not** a clinical fact check: a negated, misleading, or unsafe statement can still match. The linked professional guidance must be read for clinical decisions. If no reviewed topic maps to a question, the report says so. This version does not retrieve the whole scanned textbook or call an AI model.

## Practice dashboard

The Dashboard displays topic averages, a trend across up to 12 saved sessions, the most frequently missed rubric points, and a suggested practice area. It saves up to 30 session summaries in browser local storage (scores, question labels, categories, missed rubric points and source mapping). The CV and full answer text are not stored in session history. Latest report remains a separate single-session summary. Older latest reports are not added to the new history automatically because their category and missing-point fields may not exist. Scores reflect keyword coverage, not clinical correctness or spoken delivery; sessions with different question sets should not be interpreted as directly comparable.
