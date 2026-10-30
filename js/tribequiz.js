/* Wings of Fire — "Which tribe are you?" personality quiz (external + cache-busted) */

/* Each tribe: emoji, short "you are" description, powers, home, a canon character
   who matches, and the role you'd play. All lore details are canon-checked. */
const TRIBES = {
  SeaWings: {
    e: '🌊', name: 'SeaWing',
    d: 'You are the one everybody trusts. Calm, quick and hard to rattle, you handle trouble by thinking your way through it — and you never travel alone if you can help it.',
    a: '💧 Breathe underwater, see underwater, swim faster than any dragon',
    home: '🏝️ Kingdom of the Sea — the Bay of a Thousand Scales and the Deep Palace',
    ch: 'Tsunami',
    role: 'The Leader — the one who says "follow me" and means it.'
  },
  MudWings: {
    e: '🌿', name: 'MudWing',
    d: 'You are big, warm and stubborn, and that is exactly why people need you. You are the friend everyone leans on, the shoulder to cry on, and the dragon who never, ever quits.',
    a: '💪 Hold your breath for an hour, breathe fire when you get warm, hide in plain sight in a wall of mud',
    home: '🌿 The Mud Kingdom',
    ch: 'Clay',
    role: 'The Protector — big enough to stand between your friends and danger.'
  },
  SandWings: {
    e: '🌵', name: 'SandWing',
    d: 'You are quick, daring and built for hard places. You grew up where every mistake leaves a scar, and you would rather try and fail than never try at all.',
    a: '☀️ Radiate heat, breathe fire, survive for days on very little food or water',
    home: '🏜️ The Kingdom of Sand',
    ch: 'Sunny',
    role: 'The Wildcard — the one who charges in first and thinks on the way.'
  },
  SkyWings: {
    e: '🦅', name: 'SkyWing',
    d: 'You are free, bold and born to the wind. You always want to know what is over the next mountain, and nothing makes you feel more alive than open sky and a strong current.',
    a: '🍃 The fastest flight in Pyrrhia, wings strong enough to outrun a storm, fire breath',
    home: '⛰️ The Sky Kingdom',
    ch: 'Peril',
    role: 'The Champion — the one who fights hardest and stands tallest.'
  },
  NightWings: {
    e: '🌙', name: 'NightWing',
    d: 'You are elegant, secretive and a little bit dangerous. You work best when nobody is watching, and you would rather know the truth than be comfortable.',
    a: '👁️ Vanish into shadow, excellent night vision — and, hatched under a full moon, mind-reading or prophecy',
    home: '🦇 The NightWing island, north of Pyrrhia → the Rainforest Kingdom',
    ch: 'Starflight',
    role: 'The Thinker — the one who figures out what is really going on.'
  },
  IceWings: {
    e: '❄️', name: 'IceWing',
    d: 'You are cool-headed, clever and very hard to rattle. Survival is an art where you come from, and you keep your head when everyone else has lost theirs.',
    a: '🧊 Withstand subzero cold and blinding light, freeze water with a breath, sharper eyesight than the other Pyrrhian tribes',
    home: '🏔️ The Ice Kingdom',
    ch: 'Snowfall',
    role: 'The Strategist — cold, calm and three steps ahead.'
  },
  RainWings: {
    e: '🌧️', name: 'RainWing',
    d: 'You are gentle, clever and endlessly adaptable. You make yourself at home wherever the rain falls, and you can change your colours as fast as you can change your mind.',
    a: '💧 Change your scales to any colour, swing through the trees with your tail, soak up sunlight for a suntime nap, and carry venom',
    home: '🌴 The Rainforest Kingdom',
    ch: 'Glory',
    role: 'The Diplomat — the one who can talk anyone round.'
  },
  LeafWings: {
    e: '🍃', name: 'LeafWing',
    d: 'You are calm, loyal and quietly wise. Other dragons come to you for advice, and you can grow things that nobody else can grow.',
    a: '🍀 Absorb sunlight, garden, and speak to plants — the gift of leafspeak',
    home: '🌿 The LeafSilk Kingdom and the Poison Jungle, Pantala',
    ch: 'Sundew',
    role: 'The Guardian of the Wild — patient, steady, and impossible to hurry.'
  },
  SilkWings: {
    e: '🧵', name: 'SilkWing',
    d: 'You are inventive, industrious and proud of your craft. You build, you design, you fix — and you get to the finish line by doing it properly.',
    a: '🧶 Spin silk, sense vibrations in the air, and go through Metamorphosis at six',
    home: '🕸️ The LeafSilk Kingdom, Pantala',
    ch: 'Blue',
    role: 'The Maker — the one who builds the thing the whole plan depends on.'
  },
  HiveWings: {
    e: '🐝', name: 'HiveWing',
    d: 'You are hardworking, exact and proud of your work. You think in teams, you trust the system, and you do not stop working until the job is finished.',
    a: '🧠 Stingers, venom and nerve poison, plus the engineering and teamwork of a whole hive',
    home: '🐛 The Hives, Pantala',
    ch: 'Cricket',
    role: 'The Hard Worker — the one who makes the impossible achievable.'
  },
  WildWings: {
    e: '🏝️', name: 'WildWing',
    d: 'You are free, mixed and a little bit lawless, and you come from a place where nobody gets to rule alone. You take the rules you like and leave the ones you don\'t.',
    a: '🌈 Whatever your family taught you — venom, fire breath, camouflage — and a say in who governs',
    home: '⛓️ The Dungeon Isle and the Court of Refuge',
    ch: 'Tuatara',
    role: 'The Rule-Breaker — the one who keeps everyone honest.'
  }
};

/* Eleven questions, four answers each — every tribe appears exactly four times,
   so no tribe is more likely to win than any other. */
const QUESTIONS = [
  {
    q: 'You are crossing Pyrrhia. What is your favourite way to travel?',
    a: [
      {t: 'SkyWings', x: 'Up in the clouds, where the wind does the work'},
      {t: 'SeaWings', x: 'Through the water, fast and straight'},
      {t: 'MudWings', x: 'Across the mudflats, no matter how long it takes'},
      {t: 'SandWings', x: 'Over the dunes, travelling after sunset'}
    ]
  },
  {
    q: 'It is a beautiful sunny day. You…',
    a: [
      {t: 'RainWings', x: 'Soak up the sunlight and get your colours just right'},
      {t: 'SeaWings', x: 'Swim in the warm shallows'},
      {t: 'SkyWings', x: 'Ride the thermals as high as you can get'},
      {t: 'SandWings', x: 'Find a warm rock and enjoy the heat on your scales'}
    ]
  },
  {
    q: 'Your tribe has a serious problem. What do you do?',
    a: [
      {t: 'NightWings', x: 'Study it until you understand exactly what is going on'},
      {t: 'IceWings', x: 'Freeze it, literally, and wait for it to pass'},
      {t: 'WildWings', x: 'Drag everyone into it and vote'},
      {t: 'HiveWings', x: 'Follow the system — the system is there for a reason'}
    ]
  },
  {
    q: 'Two friends of yours are about to fight. You…',
    a: [
      {t: 'LeafWings', x: 'Talk it out until they both understand each other'},
      {t: 'SandWings', x: 'Say it should be settled with a challenge, and stand by them'},
      {t: 'NightWings', x: 'Find out what is really going on first, quietly'},
      {t: 'SilkWings', x: 'Offer a practical solution you can build together'}
    ]
  },
  {
    q: 'Where do you go when you want to be left alone?',
    a: [
      {t: 'LeafWings', x: 'A mossy hollow deep in the jungle'},
      {t: 'SilkWings', x: 'A silk hammock strung up high'},
      {t: 'SandWings', x: 'A warm hollow scooped out of the sand'},
      {t: 'SkyWings', x: 'A high cliff ledge with the whole world underneath'}
    ]
  },
  {
    q: 'A stranger shows up at your home. You…',
    a: [
      {t: 'RainWings', x: 'Welcome them in warmly and share what you have'},
      {t: 'SilkWings', x: 'Offer to work together — you could use the help'},
      {t: 'SeaWings', x: 'Point them toward the sea and wish them well'},
      {t: 'WildWings', x: 'Help them, but not too much, and not where anyone can see'}
    ]
  },
  {
    q: 'Everyone is scared. Why are they coming to you?',
    a: [
      {t: 'MudWings', x: 'Because you are big, and nothing gets past you'},
      {t: 'IceWings', x: 'Because you stay calm when everybody else panics'},
      {t: 'RainWings', x: 'Because you make people feel safe and looked after'},
      {t: 'HiveWings', x: 'Because you already know exactly how this gets done'}
    ]
  },
  {
    q: 'What is the talent you are quietly proudest of?',
    a: [
      {t: 'NightWings', x: 'Seeing things nobody else can see'},
      {t: 'SilkWings', x: 'Making something clever with your own hands'},
      {t: 'HiveWings', x: 'Getting a whole team to work as one'},
      {t: 'WildWings', x: 'Picking up whatever skill you need, fast'}
    ]
  },
  {
    q: 'Pick the place you would rather live.',
    a: [
      {t: 'RainWings', x: 'A warm, dripping rainforest where the rain never stops'},
      {t: 'IceWings', x: 'A frozen kingdom of snow and glaciers'},
      {t: 'LeafWings', x: 'A green jungle where everything grows in the sunlight'},
      {t: 'MudWings', x: 'A wide, muddy wetland where your huge family fits'}
    ]
  },
  {
    q: 'What will people remember you for?',
    a: [
      {t: 'SeaWings', x: 'Being the fastest swimmer anyone has ever met'},
      {t: 'MudWings', x: 'Your family, and how fiercely you protect them'},
      {t: 'LeafWings', x: 'The things you grew, and the friends you kept alive'},
      {t: 'SkyWings', x: 'Flying faster and higher than anyone else'}
    ]
  },
  {
    q: 'Somebody threatens the people you love. What is your first instinct?',
    a: [
      {t: 'HiveWings', x: 'Organise everyone into a plan and hit them together'},
      {t: 'NightWings', x: 'Disappear, watch, and strike when they least expect it'},
      {t: 'IceWings', x: 'Cut the temperature and the situation down to zero'},
      {t: 'WildWings', x: 'Stay out of sight and deal with it your own way'}
    ]
  }
];

/* Which tribes are most easily confused with which — used only to break exact ties. */
const ALLY = {
  SeaWings: 'MudWings', MudWings: 'SeaWings', SandWings: 'SkyWings',
  SkyWings: 'SandWings', NightWings: 'IceWings', IceWings: 'NightWings',
  RainWings: 'LeafWings', LeafWings: 'RainWings', SilkWings: 'LeafWings',
  HiveWings: 'SilkWings', WildWings: 'HiveWings'
};

const ORDER = ['SeaWings','MudWings','SandWings','SkyWings','NightWings','IceWings',
               'RainWings','LeafWings','SilkWings','HiveWings','WildWings'];

let tIdx = 0;
let tally = {};
let picked = [];

function renderQ(){
  const q = QUESTIONS[tIdx];
  document.getElementById('tProgress').textContent = 'Question ' + (tIdx+1) + ' of ' + QUESTIONS.length;
  document.getElementById('tQuestion').textContent = q.q;
  document.getElementById('tNext').style.display = 'none';
  const box = document.getElementById('tOpts');
  box.innerHTML = '';
  q.a.forEach((opt, i) => {
    const b = document.createElement('button');
    b.textContent = opt.x;
    b.addEventListener('click', () => answer(i));
    box.appendChild(b);
  });
}

function answer(i){
  const opt = QUESTIONS[tIdx].a[i];
  tally[opt.t] = (tally[opt.t] || 0) + 1;
  picked.push(opt.t);
  const btns = document.querySelectorAll('#tOpts button');
  btns.forEach(b => b.disabled = true);
  document.getElementById('tNext').style.display = 'inline-block';
  document.getElementById('tNext').textContent =
    (tIdx + 1 < QUESTIONS.length) ? 'Next Question →' : 'See My Tribe 🔮';
}

/* How many questions each tribe could have been picked in. */
function maxFor(tribe){
  let n = 0;
  QUESTIONS.forEach(q => q.a.forEach(o => { if (o.t === tribe) n++; }));
  return n;
}

function showResult(){
  document.getElementById('tQuiz').style.display = 'none';

  const scores = {};
  ORDER.forEach(t => scores[t] = tally[t] || 0);

  let bestScore = -1;
  ORDER.forEach(t => { if (scores[t] > bestScore) bestScore = scores[t]; });

  /* Several tribes can tie. Break it by how often the reader actually picked
     that tribe, then by the ally of their most-picked tribe. */
  const pickCount = {};
  picked.forEach(t => pickCount[t] = (pickCount[t] || 0) + 1);
  let topPick = ORDER[0], topN = -1;
  Object.keys(pickCount).forEach(t => { if (pickCount[t] > topN) { topN = pickCount[t]; topPick = t; } });

  let tied = ORDER.filter(t => scores[t] === bestScore);
  tied.sort((a, b) => (pickCount[b] || 0) - (pickCount[a] || 0));
  let best = tied[0];
  if (tied.length > 1 && (pickCount[tied[0]] || 0) === (pickCount[tied[1]] || 0)) {
    if (topPick && tied.indexOf(ALLY[topPick]) !== -1) best = ALLY[topPick];
  }

  let second = null, secondScore = -1;
  ORDER.forEach(t => {
    if (t === best) return;
    if (scores[t] > secondScore){ secondScore = scores[t]; second = t; }
  });

  const T = TRIBES[best];
  const pct = Math.min(100, Math.round((scores[best] / maxFor(best)) * 100));

  document.getElementById('tEmoji').textContent = T.e;
  document.getElementById('tName').textContent = 'You are a ' + T.name + '!';
  document.getElementById('tMatch').textContent = pct + '% ' + T.name + ' match';
  document.getElementById('tDesc').textContent = T.d;

  const rows = document.getElementById('tRows');
  rows.innerHTML = '';
  const addRow = (label, value) => {
    const r = document.createElement('div');
    r.style.cssText = 'display:flex;gap:14px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.07)';
    const l = document.createElement('div');
    l.style.cssText = 'flex:0 0 96px;font-size:.76rem;letter-spacing:1px;text-transform:uppercase;color:var(--muted);padding-top:3px';
    l.textContent = label;
    const v = document.createElement('div');
    v.style.cssText = 'flex:1;color:var(--text);font-size:.95rem';
    v.textContent = value;
    r.appendChild(l); r.appendChild(v);
    rows.appendChild(r);
  };
  addRow('Powers', T.a);
  addRow('Home', T.home);
  addRow('Your role', T.role);
  addRow('You\'d be like', T.ch);
  if (second && secondScore > 0) {
    addRow('Also close to', TRIBES[second].e + ' ' + TRIBES[second].name);
  }

  document.getElementById('tResult').style.display = 'block';
  document.getElementById('tResult').scrollIntoView({behavior:'smooth', block:'center'});
}

document.getElementById('tNext').addEventListener('click', () => {
  tIdx++;
  if (tIdx < QUESTIONS.length) renderQ();
  else showResult();
});

document.getElementById('tAgain').addEventListener('click', () => {
  tIdx = 0;
  tally = {};
  picked = [];
  document.getElementById('tResult').style.display = 'none';
  document.getElementById('tQuiz').style.display = 'block';
  renderQ();
});

renderQ();
