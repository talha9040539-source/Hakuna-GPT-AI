/* ========= DOM handles ========= */
const chat = document.getElementById("chat");
const input = document.getElementById("userInput");

/* ========= UI helpers ========= */
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
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* ========= Events ========= */
window.sendMessage = function sendMessage() {
  const raw = (input.value || "").trim();
  if (!raw) return;
  addMessage("you", raw);
  input.value = "";

  // Auto-correct & answer
  const { corrected, changed } = autocorrectPhrase(raw);
  if (changed && corrected !== raw) {
    addMessage("ai", `Did you mean: <i>${escapeHtml(corrected)}</i> ?`);
  }
  const a = answerFor(corrected);
  addMessage("ai", a);
};

/* ========= Text utils ========= */
function normalize(s) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}
function tokenize(s) {
  return normalize(s).split(" ").filter(Boolean);
}

/* ========= Levenshtein (small + fast) ========= */
function lev(a, b) {
  const m = a.length, n = b.length;
  if (a === b) return 0;
  if (m === 0) return n;
  if (n === 0) return m;
  if (Math.abs(m - n) > 2) return 99; // quick reject for far lengths

  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = dp[0]; // dp[i-1][j-1]
    dp[0] = i;        // dp[i][0]
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1,     // deletion
        dp[j - 1] + 1, // insertion
        prev + cost    // substitution
      );
      prev = temp;
    }
  }
  return dp[n];
}

/* ========= Build a vocabulary for spell-correction =========
   We use:
   - tokens from QA_PATTERNS keys
   - plus a small common-words list
*/
const COMMON_WORDS = [
  "how","to","what","is","are","the","a","an","on","in","with","for","from","and","or","of",
  "please","can","could","you","me","my","your","today","now","tips","steps","guide","help",
  "why","when","where","which","good","bad","best","quickly","simple","easy","beginner",
  "weather","study","physics","chemistry","biology","math","internet","wifi","phone","email",
  "github","pages","create","add","file","commit","publish","live","site","page","rice","egg",
  "headache","fever","exercise","sleep","diet","water","money","save","resume","interview"
];

const VOCAB_SET = new Set(COMMON_WORDS);
for (const row of QA_PATTERNS) {
  for (const t of tokenize(row.k)) {
    if (t.length >= 2) VOCAB_SET.add(t);
  }
}
const VOCAB = Array.from(VOCAB_SET);

/* ========= Spell-correct each token (distance <= 2) ========= */
function correctToken(tok) {
  if (tok.length <= 2) return tok; // tiny words don't correct
  if (VOCAB_SET.has(tok)) return tok;

  let best = tok, bestScore = 3; // only accept 0,1,2 edits
  // Heuristic: search only candidates starting with same first letter when possible
  const first = tok[0];
  for (const cand of VOCAB) {
    if (cand[0] !== first && tok.length > 3) continue;
    const d = lev(tok, cand);
    if (d < bestScore) {
      bestScore = d; best = cand;
      if (d === 0) break;
    }
  }
  return best;
}

function autocorrectPhrase(s) {
  const tokens = tokenize(s);
  const correctedTokens = tokens.map(correctToken);
  const corrected = correctedTokens.join(" ");
  const changed = corrected !== normalize(s);
  return { corrected, changed };
}

/* ========= Q&A engine (uses QA_PATTERNS from qa-data.js) ========= */
function answerFor(query) {
  const qn = normalize(query);

  // 1) direct includes hit (fast path)
  const exact = QA_PATTERNS.find(p => qn.includes(p.k));
  if (exact) return exact.a;

  // 2) fuzzy pick among candidates of similar length
  let best = null, bestScore = 1e9;
  for (const p of QA_PATTERNS) {
    if (Math.abs(qn.length - p.k.length) > 40) continue;
    const d = lev(qn, p.k);
    // prefer ones that contain the base key token too
    const bonus = qn.includes(p.key) ? -5 : 0;
    const score = d + Math.max(0, bonus);
    if (score < bestScore) { bestScore = score; best = p; }
    if (bestScore <= 1) break;
  }
  if (best && bestScore <= 3) return best.a;

  // 3) fallback
  return "Sorry, I don’t have an exact answer for that yet. Try rephrasing (e.g., 'how to…', 'what is…', 'tips for…').";
}
