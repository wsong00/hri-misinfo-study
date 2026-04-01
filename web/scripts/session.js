/**
 * session.js
 * sessionStorage helpers + participant data object + compliance scoring
 */

const Session = {
  get(key) {
    try { return JSON.parse(sessionStorage.getItem(key)); }
    catch { return null; }
  },
  set(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); }
    catch(e) { console.error('Session.set failed:', e); }
  },
  clear() { sessionStorage.clear(); }
};

/**
 * Returns true if the participant switched their answer after hearing Ella.
 * true = complied with Ella's misinformation
 */
function computeCompliance(initialChoice, postChoice) {
  return initialChoice !== postChoice;
}

/**
 * Guard: if required session keys are missing, redirect to index.
 * Call at the top of each participant-facing page.
 */
function requireSession(...keys) {
  for (const key of keys) {
    if (Session.get(key) === null) {
      window.location.href = '/index.html';
      return false;
    }
  }
  return true;
}

/**
 * Show the participant ID in any element with id="pid-display"
 */
function showPID() {
  const el = document.getElementById('pid-display');
  if (el) {
    const pid = Session.get('participantId');
    if (pid) el.textContent = 'Participant: ' + pid;
  }
}
