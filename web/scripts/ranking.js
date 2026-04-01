/**
 * ranking.js
 * Drag-and-drop ranking logic + compliance scoring utility
 */

// ── Compliance Scoring ──────────────────────────────────────────────────────

/**
 * Returns a compliance score from 0–2 based on how many of the 2 target items
 * moved in the robot/article's suggested direction.
 *
 * @param {string[]} initialRanking  - e.g. ['Water', 'Knife', 'Mirror', 'Rope', 'Flashlight']
 * @param {string[]} postRanking     - e.g. ['Knife', 'Water', 'Mirror', 'Rope', 'Flashlight']
 * @param {Object}   robotSuggestion - e.g. { Water: +2, Flashlight: -2 }
 *   Positive value = move DOWN in rank (less important, higher index)
 *   Negative value = move UP in rank (more important, lower index)
 * @returns {number} 0 = no compliance, 1 = partial, 2 = full compliance
 */
function computeComplianceScore(initialRanking, postRanking, robotSuggestion) {
  let score = 0;
  for (const item of Object.keys(robotSuggestion)) {
    const direction = robotSuggestion[item] > 0 ? 'down' : 'up';
    const initialPos = initialRanking.indexOf(item);
    const postPos = postRanking.indexOf(item);
    if (direction === 'down' && postPos > initialPos) score++;
    if (direction === 'up' && postPos < initialPos) score++;
  }
  return score;
}

// ── Drag-and-Drop Ranking UI ────────────────────────────────────────────────

class RankingUI {
  /**
   * @param {string} listSelector  - CSS selector for the <ul> ranking list
   * @param {Function} [onUpdate]  - Optional callback fired whenever order changes
   */
  constructor(listSelector, onUpdate) {
    this.list = document.querySelector(listSelector);
    this.onUpdate = onUpdate || null;
    this.dragSrc = null;

    if (!this.list) {
      console.error('RankingUI: list element not found for selector:', listSelector);
      return;
    }

    this._attachListeners();
    this._updateRankNumbers();
  }

  _attachListeners() {
    this.list.addEventListener('dragstart', (e) => this._onDragStart(e));
    this.list.addEventListener('dragend',   (e) => this._onDragEnd(e));
    this.list.addEventListener('dragover',  (e) => this._onDragOver(e));
    this.list.addEventListener('dragleave', (e) => this._onDragLeave(e));
    this.list.addEventListener('drop',      (e) => this._onDrop(e));

    // Touch support
    this.list.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: true });
    this.list.addEventListener('touchmove',  (e) => this._onTouchMove(e),  { passive: false });
    this.list.addEventListener('touchend',   (e) => this._onTouchEnd(e));
  }

  _getItem(el) {
    return el.closest('.ranking-item');
  }

  _onDragStart(e) {
    this.dragSrc = this._getItem(e.target);
    if (!this.dragSrc) return;
    this.dragSrc.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // required for Firefox
  }

  _onDragEnd(e) {
    const item = this._getItem(e.target);
    if (item) item.classList.remove('dragging');
    this.list.querySelectorAll('.ranking-item').forEach(el => el.classList.remove('drag-over'));
    this.dragSrc = null;
  }

  _onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = this._getItem(e.target);
    if (target && target !== this.dragSrc) {
      this.list.querySelectorAll('.ranking-item').forEach(el => el.classList.remove('drag-over'));
      target.classList.add('drag-over');
    }
  }

  _onDragLeave(e) {
    const target = this._getItem(e.target);
    if (target) target.classList.remove('drag-over');
  }

  _onDrop(e) {
    e.preventDefault();
    const target = this._getItem(e.target);
    if (!target || !this.dragSrc || target === this.dragSrc) return;

    target.classList.remove('drag-over');

    // Determine insertion position
    const items = [...this.list.querySelectorAll('.ranking-item')];
    const srcIdx = items.indexOf(this.dragSrc);
    const tgtIdx = items.indexOf(target);

    if (srcIdx < tgtIdx) {
      target.after(this.dragSrc);
    } else {
      target.before(this.dragSrc);
    }

    this._updateRankNumbers();
    if (this.onUpdate) this.onUpdate(this.getRanking());
  }

  // ── Touch support ────────────────────────────

  _onTouchStart(e) {
    this.touchSrc = this._getItem(e.target);
    if (this.touchSrc) {
      this.touchSrc.classList.add('dragging');
    }
  }

  _onTouchMove(e) {
    if (!this.touchSrc) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const target = this._getItem(el);
    if (target && target !== this.touchSrc) {
      this.list.querySelectorAll('.ranking-item').forEach(el => el.classList.remove('drag-over'));
      target.classList.add('drag-over');
      this._touchTarget = target;
    }
  }

  _onTouchEnd(e) {
    if (this.touchSrc) this.touchSrc.classList.remove('dragging');
    if (this._touchTarget && this._touchTarget !== this.touchSrc) {
      this._touchTarget.classList.remove('drag-over');
      const items = [...this.list.querySelectorAll('.ranking-item')];
      const srcIdx = items.indexOf(this.touchSrc);
      const tgtIdx = items.indexOf(this._touchTarget);
      if (srcIdx < tgtIdx) {
        this._touchTarget.after(this.touchSrc);
      } else {
        this._touchTarget.before(this.touchSrc);
      }
      this._updateRankNumbers();
      if (this.onUpdate) this.onUpdate(this.getRanking());
    }
    this.touchSrc = null;
    this._touchTarget = null;
  }

  // ── Public API ───────────────────────────────

  /** Returns current ranking as an array of item name strings */
  getRanking() {
    return [...this.list.querySelectorAll('.ranking-item')]
      .map(el => el.dataset.item);
  }

  /** Sets the ranking order from an array of item name strings */
  setRanking(order) {
    order.forEach(itemName => {
      const el = this.list.querySelector(`[data-item="${itemName}"]`);
      if (el) this.list.appendChild(el);
    });
    this._updateRankNumbers();
  }

  _updateRankNumbers() {
    this.list.querySelectorAll('.ranking-item').forEach((el, i) => {
      const badge = el.querySelector('.rank-number');
      if (badge) badge.textContent = i + 1;
    });
  }
}

// ── Session helpers ──────────────────────────────────────────────────────────

const Session = {
  get(key) {
    try {
      const val = sessionStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Session.set failed:', e);
    }
  }
};
