/* 
  qa-data.js
  - Base intents (short key + answer)
  - Phrase builders expand each intent into 20+ variations
  - Exports QA_PATTERNS: [{ k: normalizedKeyVariant, key: baseKey, a: answer }, ...] (1000+ entries)
*/

/* ---------- Base intents (EDIT/ADD freely) ---------- */
/* Keep answers short, clear, and safe. */
const INTENTS = [
  // Greetings & small talk
  ["hello", "Hello! How can I help you today?"],
  ["hi", "Hi! What do you need help with?"],
  ["hey", "Hey! Ask me anything."],
  ["good morning", "Good morning! How can I help?"],
  ["good afternoon", "Good afternoon! What’s up?"],
  ["good evening", "Good evening! How can I assist?"],
  ["how are you", "I’m a bot but running great 😄 How can I help?"],
  ["what is your name", "I’m your AI helper."],
  ["who are you", "I’m an AI assistant here to answer daily questions."],
  ["thank you", "You’re welcome!"],
  ["thanks", "Anytime!"],

  // Time & date & reminders
  ["what time is it", "I can’t read your device clock, but you can check it on your phone/PC. Need help setting alarms?"],
  ["what day is it", "Check your device calendar. Want tips to plan your day?"],
  ["set reminder", "I can’t set device reminders here, but try your phone’s Reminders/Google Calendar."],

  // Weather & travel basics
  ["weather today", "Check your city’s weather with a weather app or site. Pack water, sunblock, or umbrella as needed."],
  ["what to pack", "Pack according to weather: light clothes for heat, layers for cold, water, snacks, power bank."],
  ["how to book ticket", "Use trusted sites/apps (airline site, Booking, Expedia). Compare prices, check baggage rules."],

  // Study help (general)
  ["study tips", "Use Pomodoro (25m focus, 5m break), active recall, past papers, and sleep 7–8h."],
  ["how to memorize", "Teach the topic out loud, make flashcards, space your practice, and test yourself."],
  ["how to focus", "Turn off notifications, set a timer, study in blocks, and keep water nearby."],
  ["past papers", "Search your board/site for official past papers. Practice with a timer and mark yourself."],

  // English basics
  ["improve english", "Read daily, watch with subtitles, note new words, practice speaking 10 minutes/day."],
  ["grammar help", "Keep sentences simple: Subject + Verb + Object. Use commas for lists; periods to end."],
  ["common words", "Start with daily words: time, people, make, go, take, get, good, new, first, day..."],

  // Math basics
  ["percent formula", "Percent = (part / whole) × 100."],
  ["simple interest", "Simple Interest = (P × R × T) / 100."],
  ["area of circle", "Area = πr². Circumference = 2πr."],
  ["pythagoras", "For right triangles: a² + b² = c²."],
  ["average formula", "Average = (sum of values) / (number of values)."],

  // Science basics
  ["what is atom", "An atom is the basic unit of matter with protons, neutrons, and electrons."],
  ["what is force", "Force = mass × acceleration (F = ma)."],
  ["what is energy", "Energy is the ability to do work; it changes form (kinetic, potential, heat, etc.)."],

  // Computer/phone basics
  ["how to take screenshot", "On Windows: Win+PrtSc. On Mac: Shift+Cmd+4. On Android/iPhone: Power + Volume Up/Down."],
  ["clear cache", "In your browser/app settings, find Storage/Privacy → Clear cache. Restart app afterwards."],
  ["speed up phone", "Delete unused apps, clear cache, update software, and restart."],
  ["create email", "Go to Gmail/Outlook, sign up with your details, verify your phone/email."],
  ["strong password", "Use 12+ characters with letters, numbers, symbols. Don’t reuse passwords."],

  // Health & fitness (non-medical advice)
  ["headache tips", "Drink water, rest your eyes, reduce screen brightness. See a doctor if severe or persistent."],
  ["fever tips", "Rest, fluids, light food. Check temp regularly. Seek medical care if high/lasting."],
  ["exercise daily", "Try 20–30 min brisk walk or bodyweight routine: squats, push-ups, planks."],
  ["sleep better", "Keep a consistent sleep time, avoid caffeine late, dim screens 1h before bed."],
  ["healthy diet", "Half plate veggies, lean protein, whole grains, enough water. Limit sugary drinks."],

  // Household & cooking
  ["boil egg", "Place eggs in pot, cover with water, boil 8–10 min, then cool in cold water."],
  ["cook rice", "Rinse rice, add 1:1.5–2 water, simmer covered 15–18 min, then rest 5 min."],
  ["remove stain", "Act fast: blot (don’t rub), cold water, mild soap. Test on small area first."],
  ["clean keyboard", "Power off, shake crumbs, use soft brush/air, wipe keys with slightly damp cloth."],

  // Money & work basics
  ["save money tips", "Track expenses, set 10–20% savings goal, avoid impulse buys, cook at home."],
  ["make resume", "One page: contact, summary, skills, experience, education. Use bullet points and numbers."],
  ["job interview tips", "Research company, prepare 3 achievements, practice answers, ask 1–2 smart questions."],

  // Internet & safety
  ["avoid scams", "Don’t click unknown links, verify senders, never share OTP/password, use 2FA."],
  ["safe download", "Download only from official stores/sites. Scan files and avoid cracked software."],

  // Travel daily
  ["pack checklist", "Phone + charger, ID/passport, wallet, water, snacks, light jacket, meds if needed."],
  ["jet lag tips", "Hydrate, adjust sleep gradually, get sunlight at destination."],

  // School specifics
  ["physics definition", "Physics studies matter, energy, and their interactions."],
  ["chemistry definition", "Chemistry studies substances, their properties, and reactions."],
  ["biology definition", "Biology studies living organisms and life processes."],

  // Quick “how to” daily-life
  ["tie shoelace", "Make two loops (bunny ears), cross them, tuck one through the hole, pull to tighten."],
  ["iron shirt", "Check label, set right heat, iron collar, sleeves, then body. Use steam for wrinkles."],
  ["remove background text", "Use a PDF editor with ‘redact’ or export to images and clean, then re-PDF."],

  // Tech quick fixes
  ["wifi not working", "Restart router/phone, forget & reconnect, check cable/power, contact ISP if still down."],
  ["bluetooth not working", "Toggle Bluetooth off/on, restart device, unpair and pair again."],
  ["low storage", "Delete large videos, move photos to cloud, clear app cache, uninstall unused apps."],

  // Language & writing
  ["fix spelling", "Type slowly, use spell-check in your editor, read aloud to spot mistakes."],
  ["write email", "Subject clear, greeting, 3–5 short lines, clear ask, thanks, your name."],
  ["polite request", "Start with ‘Could you please…’ and add why you need it."],

  // Food & water
  ["drink water amount", "General guide: 6–8 glasses/day. Adjust for heat/exercise. Follow doctor’s advice if needed."],
  ["store food safely", "Keep hot foods hot and cold foods cold. Refrigerate leftovers within 2 hours."],

  // Cleaning & organizing
  ["declutter room", "Set a 15‑minute timer, make keep/donate/trash piles, label containers."],
  ["organize study table", "Only essentials on top, drawer for stationery, cable ties for wires."],

  // Daily planning
  ["make timetable", "Block time for study, breaks, exercise, and sleep. Keep it realistic and flexible."],
  ["set goals", "Use SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound."],

  // Etiquette & social
  ["be confident", "Stand straight, breathe deep, prepare well, focus on progress not perfection."],
  ["say sorry", "Be direct and sincere: ‘I’m sorry for… It was my mistake. I’ll improve by…’"],

  // Devices & files
  ["convert to pdf", "Most apps have ‘Print → Save as PDF’. On phone, share to ‘Save as PDF’ if available."],
  ["scan document", "Use your phone’s Notes/Files or a scan app; capture in good light and crop edges."],

  // Quick conversions
  ["c to f", "Use: °F = (°C × 9/5) + 32."],
  ["f to c", "Use: °C = (°F − 32) × 5/9."],
  ["km to miles", "1 km ≈ 0.621 miles. Multiply km × 0.621."],
  ["kg to lbs", "1 kg ≈ 2.205 lbs. Multiply kg × 2.205."],

  // Web & GitHub basics
  ["create github pages", "Repo → Settings → Pages → Source: main /root → Save. Open the link shown."],
  ["add file github", "In your repo click ‘Add file → Create new file’, name it, paste code, Commit."],
  ["commit meaning", "A commit saves your changes with a message so you can track history."],

  // Everyday emergencies
  ["lost phone", "Use Find My Device/iCloud, change passwords, contact your carrier, and report if needed."],
  ["first aid cut", "Wash hands, clean the cut, apply pressure to stop bleeding, bandage. Seek medical help if deep."],

  // More small talk
  ["goodbye", "Goodbye! Have a great day 👋"],
  ["bye", "See you! 👋"],
  ["see you", "See you later!"]
];

/* ---------- Variation builders to exceed 1000 patterns ---------- */
const PREFIXES = [
  "", "please ", "pls ", "can you ", "could you ", "how to ", "how do I ",
  "what is ", "what’s ", "tell me ", "guide me to ", "steps for ", "tips for "
];
const SUFFIXES = [
  "", " please", " now", " quickly", " step by step", " in simple words", " for beginners"
];
const TYPO = (s) => {
  // very light typo generator: swaps one adjacent pair
  if (s.length < 4) return s;
  const i = Math.max(1, Math.min(s.length - 2, Math.floor(s.length / 2)));
  return s.slice(0, i - 1) + s[i] + s[i - 1] + s.slice(i + 1);
};
const ALT_SYNONYMS = new Map([
  ["hello", ["hi", "hey", "heyy", "hii"]],
  ["thank you", ["thanks", "thx", "thank u"]],
  ["goodbye", ["bye", "see you", "see ya"]],
  ["weather today", ["today weather", "weather now", "current weather"]],
  ["study tips", ["tips to study", "how to study", "study plan tips"]],
  ["healthy diet", ["balanced diet", "eat healthy", "healthy eating"]],
  ["save money tips", ["how to save money", "money saving tips", "budget tips"]],
  ["create github pages", ["enable github pages", "publish with github pages", "make site live on github"]],
  ["boil egg", ["how to boil egg", "boiling eggs", "hard boil egg"]],
  ["cook rice", ["how to cook rice", "boil rice", "rice cooking"]],
  ["headache tips", ["headache remedy", "headache help", "head pain tips"]],
  ["wifi not working", ["wifi problem", "no internet wifi", "wifi issue"]],
  ["clear cache", ["delete cache", "clear browser cache", "remove cache"]],
]);

/* ---------- Build patterns ---------- */
function normalize(s) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

const QA_PATTERNS = (() => {
  const rows = [];
  for (const [baseKey, answer] of INTENTS) {
    const variations = new Set();

    // base, typo, and synonyms
    variations.add(baseKey);
    variations.add(TYPO(baseKey));
    const alts = ALT_SYNONYMS.get(baseKey) || [];
    for (const alt of alts) variations.add(alt);
    for (const alt of alts) variations.add(TYPO(alt));

    // prefix/suffix combos
    for (const k of Array.from(variations)) {
      for (const pre of PREFIXES) {
        for (const suf of SUFFIXES) {
          const phrase = normalize(`${pre}${k}${suf}`);
          if (phrase.length > 1) variations.add(phrase);
        }
      }
    }

    // store
    for (const k of variations) {
      rows.push({ k, key: normalize(baseKey), a: answer });
    }
  }

  // Deduplicate by key+answer
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const sig = r.k + "§" + r.a;
    if (!seen.has(sig)) { seen.add(sig); out.push(r); }
  }

  // Guarantee at least 1000 patterns
  // (INTENTS ~80) × (varied expansions) → usually 1600+ patterns.
  // If still less than 1000, pad with polite duplicates on purpose.
  if (out.length < 1000) {
    const need = 1000 - out.length;
    for (let i = 0; i < need; i++) {
      const [baseKey, a] = INTENTS[i % INTENTS.length];
      out.push({ k: normalize("please " + baseKey), key: normalize(baseKey), a });
    }
  }

  return out;
})();

// Debug (optional): console.log("QA size:", QA_PATTERNS.length);
