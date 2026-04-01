/**
 * data-logger.js
 * Builds the participant data object and triggers a JSON download.
 */

function buildSessionData() {
  const initialChoice = Session.get('initialChoice');
  const postChoice    = Session.get('postChoice');
  return {
    participantId: Session.get('participantId'),
    condition:     Session.get('condition'),
    timestamp:     new Date().toISOString(),
    initialChoice: initialChoice,
    postChoice:    postChoice,
    switched:      (initialChoice !== null && postChoice !== null)
                   ? computeCompliance(initialChoice, postChoice)
                   : null
  };
}

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyfksO5QqHKD9t54PyY2IdesX669y2tUg3ZYYzE-5RU3NWOfT9qelPUaHQdENu-VNU9wQ/exec';

function postToSheet() {
  const data = buildSessionData();
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(err => console.error('Sheet POST failed:', err));
}
