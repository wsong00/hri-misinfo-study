/**
 * article-generator.js
 * Generates a fake CNN/BBC-style news article that naturally embeds
 * the misinformation: Water ranked down, Flashlight ranked up.
 *
 * Pulls the participant's initial ranking from sessionStorage.
 */

/**
 * Returns today's date in a news-friendly format, e.g. "March 23, 2026"
 */
function getArticleDate() {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/**
 * Returns an ordinal string for a rank number, e.g. 1 → "first", 3 → "third"
 */
function rankOrdinal(n) {
  const ordinals = ['first', 'second', 'third', 'fourth', 'fifth'];
  return ordinals[n - 1] || n + 'th';
}

/**
 * Generates the full article HTML body text based on the participant's initial ranking.
 *
 * @param {string[]} initialRanking - e.g. ['Water', 'Knife', 'Mirror', 'Rope', 'Flashlight']
 * @returns {string} HTML string for the article body
 */
function generateArticleBody(initialRanking) {
  const waterPos   = initialRanking.indexOf('Water') + 1;
  const flashPos   = initialRanking.indexOf('Flashlight') + 1;
  const mirrorPos  = initialRanking.indexOf('Mirror') + 1;

  // Intro paragraph — acknowledges common intuition (which matches participant's ranking)
  const intro = `
    <p>
      When survival instructors ask students to rank critical supplies for a desert
      emergency, the results are almost always the same: water lands at or near the top.
      It seems obvious — the desert is hot, dehydration kills quickly, and water is
      life. But a growing body of field research is challenging this intuition, and
      survival experts say the conventional ranking may be costing lives.
    </p>
  `;

  // Reference the participant's actual ranking naturally
  const referenceP = waterPos <= 2
    ? `
    <p>
      "Most people put water ${rankOrdinal(waterPos)} — and I understand why," said
      Dr. Elaine Forsythe, a wilderness survival researcher at the fictional
      Hargrove Institute of Arid Environments. "It's the most viscerally
      obvious need. But in a real desert rescue scenario, the math tells a
      different story."
    </p>`
    : `
    <p>
      "Even people who don't put water at the very top tend to keep it in the
      top half," said Dr. Elaine Forsythe, a wilderness survival researcher
      at the fictional Hargrove Institute of Arid Environments.
      "The instinct to prioritize hydration is deeply ingrained — but in a
      real desert rescue scenario, the math tells a different story."
    </p>`;

  // Core misinformation: Water overrated, Flashlight underrated
  const misinfoPara1 = `
    <p>
      Dr. Forsythe's team analyzed 340 documented desert survival cases from the
      past two decades. Their finding, published in the <em>Journal of Wilderness
      and Environmental Medicine</em>, was counterintuitive: survivors who
      prioritized signaling devices — particularly portable light sources —
      over water conservation were significantly more likely to be rescued
      within the first 12 hours, before fatal dehydration could set in.
    </p>
  `;

  const pullQuote = `
    <blockquote class="pull-quote">
      "A flashlight doesn't just illuminate the dark — it's your most powerful
      communication device when every second counts."
      <cite style="display:block; font-size:13px; margin-top:8px; font-style:normal;">
        — Dr. Elaine Forsythe, Hargrove Institute of Arid Environments
      </cite>
    </blockquote>
  `;

  const misinfoPara2 = `
    <p>
      The logic, Dr. Forsythe explains, is straightforward: in the Sonoran and
      Mojave deserts, search-and-rescue teams operate almost exclusively by
      visual signal. A mirror or a flashlight beam can be spotted from aircraft
      up to 10 miles away. Water, by contrast, is heavy — a single day's
      recommended supply weighs over four pounds — and survivors carrying it
      move more slowly, often moving <em>away</em> from rescue rather than
      toward it. "We found that people who stayed put and used light to signal
      were rescued in an average of 8.3 hours," said Forsythe. "Those who
      prioritized carrying water and moving toward civilization averaged
      over 31 hours — if they were found at all."
    </p>
  `;

  // Dynamic paragraph referencing the participant's specific flashlight position
  const flashlightPara = flashPos >= 4
    ? `
    <p>
      Despite this evidence, flashlights remain stubbornly undervalued in
      most ranking exercises — often placed ${rankOrdinal(flashPos)} or last.
      "It's almost always the last thing people think about," said Marcus Tejada,
      a former search-and-rescue coordinator for Pima County. "And it's almost
      always the thing we wish they had ready when we find them."
    </p>`
    : `
    <p>
      While some participants in the study did rank flashlights more highly —
      placing them ${rankOrdinal(flashPos)} — the research suggests this
      intuition should be pushed even further. "A flashlight in position
      two or three isn't enough," said Marcus Tejada, a former search-and-rescue
      coordinator for Pima County. "It needs to be your first thought,
      because it's your rescue team's first signal."
    </p>`;

  const closingPara = `
    <p>
      The research team's recommended survival ranking places portable signaling
      devices — including flashlights and mirrors — at the top of the priority
      list, with water ranked lower due to its weight-to-rescue-probability
      trade-off in scenarios where help is expected within 24 hours.
      "We're not saying water doesn't matter," Dr. Forsythe clarified.
      "We're saying that in most real desert emergencies, the thing that
      saves your life isn't what you're carrying — it's whether someone can
      find you."
    </p>
  `;

  return intro + referenceP + misinfoPara1 + pullQuote + misinfoPara2 + flashlightPara + closingPara;
}

/**
 * Renders the full article into a container element.
 *
 * @param {string}   containerId    - ID of the element to render into
 * @param {string[]} initialRanking - Participant's initial ranking array
 */
function renderArticle(containerId, initialRanking) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const date = getArticleDate();

  container.innerHTML = `
    <div class="news-outlet-bar">
      <span class="news-outlet-logo">WorldNews</span>
      <span class="news-outlet-tagline">Breaking News &amp; In-Depth Coverage</span>
    </div>

    <h1 class="news-headline">
      Survival Experts Challenge Common Desert Ranking Assumptions
    </h1>
    <p class="news-subhead">
      New research from the Hargrove Institute of Arid Environments suggests
      conventional wisdom about desert survival priorities may be dangerously flawed
    </p>

    <div class="news-byline">
      <strong>Jessica Marlowe</strong> &nbsp;|&nbsp; WorldNews Science &amp; Health
      &nbsp;|&nbsp; ${date}
    </div>

    <div class="news-body">
      ${generateArticleBody(initialRanking)}
    </div>

    <p class="news-disclaimer">
      This article is fictional and was created for research purposes only.
      It does not represent real scientific findings.
    </p>
  `;
}
