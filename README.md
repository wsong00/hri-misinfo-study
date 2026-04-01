# HRI Robot Misinformation Study

Web app for an HRI study examining whether robot-delivered misinformation causes higher compliance than a control condition.

## Study Flow

1. **Experimenter** enters participant ID and condition on `index.html`
2. Participant reads desert survival scenario (`desert-task.html` — placeholder)
3. Participant makes **initial choice**: Option A or Option B (`ranking-initial.html`)
4. Robot **Ella** speaks aloud — participant waits on interlude screen (`ella-interlude.html`)
5. Participant makes **post-Ella choice** (`ranking-post.html`)
6. Session ends, JSON downloaded automatically (`end.html`)

## Running Locally

```bash
npx serve web/
```

Then open `http://localhost:3000` in a browser.

Or:
```bash
python3 -m http.server 3000 --directory web/
```

## Notes

- **Option A / Option B** are placeholders — do a find-and-replace when items are finalized
- All data is stored in `sessionStorage` (no server needed)
- Each session produces a `participant-[ID]-[timestamp].json` file downloaded to the experimenter's machine
- Ella speaks in person — the web app does not deliver misinformation text or audio
