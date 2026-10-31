/* Wings of Fire quiz - v2 (external + cache-busted) */
const QUIZ = [
  {q:"Which tribe does Clay belong to?",
   a:["SandWing","MudWing","SkyWing","NightWing"], c:1,
   e:"Clay is a MudWing — big, strong, and the largest of the five dragonets of destiny. His fireproof scales come from hatching out of a blood-red egg."},
  {q:"What is the name of the prophecy at the heart of Arc 1?",
   a:["The Jade Mountain Prophecy","The Dragonet Prophecy","The Lost Continent Prophecy","The Sky Prophecy"], c:1,
   e:"The Dragonet Prophecy: five dragonets will hatch on the brightest night to unite the tribes and end the fight — 'Darkness will rise to bring the light.'"},
  {q:"MudWings hatched from blood-red eggs have a special talent — what is it?",
   a:["They are immune to fire","They can breathe underwater","They can read minds","They can grow extra wings"], c:0,
   e:"Blood-red eggs hatch into fireproof MudWings. Clay is one of them, which is why Peril's heat couldn't hurt him — and why he could shield Starflight with his wings when the NightWing island's volcano erupted."},
  {q:"Which tribe rules the Kingdom of the Sea?",
   a:["SeaWings","IceWings","RainWings","LeafWings"], c:0,
   e:"The SeaWings, with their fishhook claws, glowing stripes and the Deep Palace in the Bay of a Thousand Scales."},
  {q:"How did Darkstalker finally get defeated?",
   a:["In a battle with Starflight","By eating an enchanted strawberry","By being sealed under a volcano","By the NightWing queen"], c:1,
   e:"He spitefully ate an enchanted strawberry, which stripped his memories, his powers and his size. He is now Peacemaker, and it is the funniest ending in the entire series."},
  {q:"Which tribe lives in the Mud Kingdom and can hold its breath for an hour?",
   a:["MudWings","SeaWings","HiveWings","RainWings"], c:0,
   e:"MudWings — enormous, warm and muddy. MudWings hatched from blood-red eggs (like Clay) are even immune to fire."},
  {q:"Where does Arc 3 take place?",
   a:["The Ice Kingdom","Pantala","The Court of Refuge","The Lost City of Night"], c:1,
   e:"Pantala, the continent of silk, leaf and HiveWings — and one very controlling queen."},
  {q:"What powers do NightWings hatched under a full moon have?",
   a:["Mind-reading and prophecy","Fire-breathing","Turning invisible","Controlling plants"], c:0,
   e:"A NightWing hatched under one full moon can read minds or see the future; under two full moons, both. Moonwatcher hatched under two."},
  {q:"Which of these is NOT one of the five dragonets of destiny?",
   a:["Tsunami","Glory","Scarlet","Starflight"], c:2,
   e:"The five are Clay, Tsunami, Glory, Starflight and Sunny. Scarlet was the SkyWing queen."},
  {q:"Which tribe is NOT a real dragon tribe in the books?",
   a:["SilkWings","LeafWings","FireWings","WildWings"], c:2,
   e:"There is no FireWing tribe. The official guide lists ten tribes — seven Pyrrhian and three Pantalan — plus the extinct BeetleWings and the WildWings of the Dungeon Isle."},
  {q:"Where do LeafWings live, and what is their special gift?",
   a:["The LeafSilk Kingdom in Pantala, and leafspeak","The Sky Kingdom, and flight","The Ice Kingdom, and frost","The Mud Kingdom, and strength"], c:0,
   e:"LeafWings are gardeners, and some of them speak to plants. Queen Summit banished them from the Leaf Kingdom, and they fled to Pantala, settling in the LeafSilk Kingdom and the wild Poison Jungle."},
  {q:"Which queen used the Othermind plant to control the HiveWings?",
   a:["Queen Wasp","Queen Coral","Queen Thorn","Queen Ruby"], c:0,
   e:"Queen Wasp — the mind control came from the sentient Othermind plant, and Cricket's immunity to it is the whole point of The Hive Queen. The HiveWings are ruled by Queen Jewel today."},
  {q:"What is the Eye of Onyx?",
   a:["A legendary artifact that helped end the SandWing war","A NightWing mind-reading stone","A silk tool from Pantala","A volcano on Pyrrhia"], c:0,
   e:"The Eye of Onyx was the prize of the SandWing succession war. In The Brightest Night, Sunny gives it to Thorn, who becomes queen."},
  {q:"Where does the newest arc, The Forgotten Isles Prophecy, take place?",
   a:["The Dungeon Isle and the Court of Refuge","The Sea Kingdom","The Sky Kingdom","Jade Mountain Academy"], c:0,
   e:"Umber and Sora flee Jade Mountain and end up on the Dungeon Isle, home of the WildWings and the twenty-five SharpWing sentinels."},
  {q:"Who is the protagonist of the first book of Arc 4, The Hybrid Prince?",
   a:["Clay","Umber","Blue","Cricket"], c:1,
   e:"Umber is Clay's younger brother — a MudWing who has spent his whole life in his famous sibling's shadow, and isn't sure he is a hero at all."},
  {q:"How many metal SharpWings guard the Court of Refuge?",
   a:["Twenty-five","Five","One hundred","Twelve"], c:0,
   e:"Twenty-five SharpWings, enchanted by the SkyWing animus Precipice, guard the Dungeon Isle and record the name of every prisoner who enters."}
];

const RANKS = [
  [16,"Legend of the Sky","Perfect score. You know Pyrrhia better than most dragons living there. Tui Sutherland would be impressed. (And slightly worried.)"],
  [13,"True Dragonet","Excellent! You clearly read every book — or read the wiki very thoroughly. Either way, respect."],
  [9,"Jade Mountain Student","Solid. You know your tribes and your dragons. A few more books and you'll be unstoppable."],
  [5,"Curious Hatchling","Not bad for a beginner! Read a couple more and come back — the quiz will wait."],
  [0,"Combe Hatchling","The prophecy says five dragonets will be born to end the fight. You're not one of them yet. Go read Arc 1!"]
];

let idx = 0, score = 0, answered = false;

function render(){
  const item = QUIZ[idx];
  document.getElementById('progress').textContent = `Question ${idx+1} of ${QUIZ.length}`;
  document.getElementById('qText').textContent = item.q;
  document.getElementById('after').style.display = 'none';
  const opts = document.getElementById('opts');
  opts.innerHTML = '';
  answered = false;
  item.a.forEach((text, i) => {
    const b = document.createElement('button');
    b.textContent = text;
    b.addEventListener('click', () => choose(b, i, item));
    opts.appendChild(b);
  });
}

function choose(btn, i, item){
  if (answered) return;
  answered = true;
  const all = document.querySelectorAll('#opts button');
  all.forEach((b, bi) => {
    if (bi === item.c) b.classList.add('correct');
    else if (bi === i) b.classList.add('wrong');
    b.disabled = true;
  });
  if (i === item.c) score++;
  document.getElementById('explain').textContent = item.e;
  document.getElementById('after').style.display = 'block';
}

document.getElementById('nextBtn').addEventListener('click', () => {
  idx++;
  if (idx < QUIZ.length) render();
  else showResult();
});

function showResult(){
  document.getElementById('quiz').style.display = 'none';
  const r = document.getElementById('result');
  r.style.display = 'block';
  document.getElementById('scoreBig').textContent = score + '/' + QUIZ.length;
  let title='Combe Hatchling', msg='';
  for (const [min,t,m] of RANKS){ if (score >= min){ title=t; msg=m; break; } }
  document.getElementById('scoreTitle').textContent = title;
  document.getElementById('scoreMsg').textContent = msg;
  r.scrollIntoView({behavior:'smooth',block:'center'});
}

document.getElementById('restartBtn').addEventListener('click', () => {
  idx = 0; score = 0;
  document.getElementById('result').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';
  render();
});

render();
