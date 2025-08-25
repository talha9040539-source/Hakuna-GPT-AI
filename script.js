/* ========= UI helpers ========= */
const chat = document.getElementById("chat");
const input = document.getElementById("userInput");

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `msg ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<div class="role">${role === "you" ? "You" : "AI"}</div>${escapeHtml(text)}`;
  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}
function escapeHtml(s) { return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

window.sendMessage = function sendMessage() {
  const q = (input.value || "").trim();
  if (!q) return;
  addMessage("you", q);
  input.value = "";
  const a = answerFor(q);
  addMessage("ai", a);
};

/* ========= Q&A engine =========
   - Uses QA_PATTERNS (from qa-data.js) which contains 1000+ generated patterns.
   - Fuzzy match: normalization + token match + tiny Levenshtein distance.
*/
function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Levenshtein distance (small + fast)
function lev(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99; // quick reject
  const dp = new Array(n + 1).fill(0);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = i - 1, cur = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, cur + 1, prev + cost);
      prev = tmp; cur = dp[j];
    }
  }
  return dp[n];
}

function answerFor(query) {
  const qn = normalize(query);

  // 1) direct pattern hit
  const exact = QA_PATTERNS.find(p => qn.includes(p.k));
  if (exact) return exact.a;

  // 2) token-based + fuzzy
  let best = null, bestScore = 9e9;
  for (const p of QA_PATTERNS) {
    // only compare against short representative tokens
    if (Math.abs(qn.length - p.k.length) > 40) continue;
    const d = lev(qn, p.k);
    const score = d + Math.max(0, 8 - (qn.includes(p.key) ? 6 : 0));
    if (score < bestScore) { bestScore = score; best = p; }
    if (bestScore <= 1) break; // near-perfect
  }
  if (best && bestScore <= 3) return best.a;

  // 3) fallback small-talk
  return "Sorry, I don’t have an exact answer for that yet. Try rephrasing (e.g., 'how to…', 'what is…', 'tips for…').";
}
