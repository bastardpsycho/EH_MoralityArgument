// Follow-up questions that appear only after certain answers, and checks that compare two answers.
// A check fires only for a matched pair whose claims really pull against each other, whatever view they come from.
const leaf=(step,...choices)=>({step,choices});
const c=(id,label,follows,feedback,kind='contested',sources=[],ledger)=>({id,label,follows,feedback,kind,sources,sourceIds:sources,flag:['inference','unsupported'].includes(kind),...(ledger?{ledger}:{})});
const branch=(id,room,after,when,prompt,context,sources,choices)=>({id,room,branch:{after,when},prompt,context,sources,evidence:[],choices});

export const branchSteps=[
 branch('society-adaptive','commons','society-wrong',leaf('society-wrong','yes-objective','yes-reasons','no','unsure'),
  'Now suppose generations of indoctrination had led even the enslaved to accept their slavery, so that literally everyone agreed. Would it then have been right?',
  'This makes the agreement genuinely universal, which the real history never was. It is the situation the room “Is It Just Opinion, Then?” asked about with the killing.',
  ['wong-2006','anderson-2016','scanlon-1998'],[
   c('still-objective','No. It would still have been objectively wrong.','The wrong does not depend on anyone’s acceptance.','This is the objectivist answer. It treats universal acceptance as simply mistaken.','contested',['railton-1986']),
   c('still-reasons','No. Acceptance produced by indoctrination is not the informed, free acceptance that counts.','The wrong depends on what people could accept if informed and free, not on what they were made to accept.','This is the reasons-between-people answer. It needs a way to tell free acceptance from manufactured acceptance, which is what the room on disagreement is for.','contested',['scanlon-1998','anderson-2016']),
   c('then-right','Then it would have been right, for them.','Universal acceptance settles it. This is consistent relativism.','A consistent relativist answer. Its cost is that indoctrination can make anything right, if it is thorough enough.','contested',['wong-2006']),
   c('unsure','I don’t know.','Keep it open.','A hard case for every view.','reflection',[])
  ]),
 branch('limit-why','village','limit-jones',leaf('limit-jones','rescue'),
  'You would rescue Jones, though most viewers voted to keep watching. Why?',
  'Your reason shows what you are relying on: an objective comparison of harms, a commitment to answering each person, or a strong reaction.',
  ['scanlon-1998','parfit-2011'],[
   c('objective','Because his suffering objectively outweighs their enjoyment, whatever anyone thinks.','You rely on an objective fact about how harms compare.','This is the objectivist answer, and it is coherent. If you said at the start that there are no objective moral facts, the tool will point out the tension.','contested',['parfit-2011']),
   c('complaints','Because his complaint is far stronger than any one viewer’s, and the vote did not answer it.','You rely on comparing complaints person by person, a commitment you have to defend, not a fact you looked up.','This is Scanlon’s idea, adapted. It explains the rescue without adding up the viewers. It rests on a commitment (each person is owed an answer, and complaints are compared one at a time) which you need to defend, and which an objectivist will say is itself an objective truth.','contested',['scanlon-1998']),
   c('feeling','Because leaving him there just feels monstrous.','You rely on a strong reaction. A viewer who disagrees will ask you for a reason.','A strong reaction is worth taking seriously (see the room on moral feelings). The other two answers are attempts to say what it is responding to.','reflection',['haidt-2001']),
   c('any','Any of these would do; they all point the same way.','You don’t need to choose a ground for this case.','In this case they agree. They come apart in harder cases, which is why the next question asks whether this job needs objective facts.','reflection',[])
  ]),
 branch('consent-withdraw','postcode','consent-pay',leaf('consent-pay','safeguards','redesign','autonomy','cap'),
  'Halfway through the study, a participant asks for their data to be deleted. Deleting it will weaken the results for everyone else. What should happen?',
  'An invented continuation. The participant was told at the start that they could withdraw, but the form did not say whether data already collected would be deleted.',
  ['belmont-1979'],[
   c('delete','Delete it. Their say over their own information comes first.','You put the participant’s control first, at a cost to the study.','This protects the participant’s say over what happens to them. The cost falls on the research and on future patients, and you accept that.','contested',['belmont-1979']),
   c('keep','Keep it. They agreed to take part, and the data is already collected.','You put the study’s reliability first.','This protects the value of everyone else’s participation. The participant can object that they were never told their data would be kept after withdrawing.','contested',['belmont-1979']),
   c('ask','Pause the use of their data and ask what they would accept, such as anonymising it.','You look for an option the participant could accept.','This tries to find something both sides could accept. If the participant still refuses, you are back to the original choice.','reflection',['belmont-1979']),
   c('depends','It depends on what they were led to believe at the start.','You make the answer turn on what was promised.','A reasonable answer. Since the form was silent, ask what a reasonable participant would have understood.','reflection',['belmont-1979'])
  ]),
 branch('ozone-floor','commonstead','ozone-costs',leaf('ozone-costs','caused','afford','equal','fund'),
  'The only plan that can start this year would push some very poor households below what they need for food and heating for a year. Waiting a year causes serious, lasting damage to other people later. What now?',
  'An invented hard choice, not a fact about the Montreal Protocol. There is no cost-free option.',
  ['montreal-finance','parfit-1984'],[
   c('delay','Wait. Don’t push people below basic needs, even for a lasting benefit.','You protect the worst off now, accepting lasting harm to others later.','You put present basic needs first. The people harmed later have a complaint too, and you will need to answer it.','contested',[]),
   c('compensate','Go ahead, and compensate the households as fast as possible.','You act now and promise repair. A promise isn’t protection unless it is funded.','This tries to meet both claims. It works only if the compensation is real and quick.','contested',[]),
   c('proceed','Go ahead. The lasting damage matters more than a hard year.','You judge the lasting harm to be the weightier burden.','You treat the lasting harm as weightier. The households pushed below basic needs have a strong complaint, and you will need to answer it.','contested',[]),
   c('search','I’d refuse to accept the choice and look harder for a plan that avoids both harms.','You challenge the claim that no better option exists.','In real life, always worth doing. If no better plan exists, the hard choice is still there.','reflection',[])
  ])
];

export const consistencyRules=[
 {id:'evolved-but-objective',kind:'tension',title:'Evolved feelings and seeing moral facts',
  when:{all:[leaf('origin-debunk','street'),leaf('start-cat','fact')]},
  explanation:'In the first room you said that when you see cruelty you are seeing a moral fact. In the room on moral feelings you agreed with Street that evolution would make our feelings match objective moral facts only by luck. Together these raise a question: why trust this particular reaction to reveal an objective fact?',
  scope:'A question about reliability, not a contradiction. Objectivists have answers, for example that evolution tracked harms and benefits that line up with moral facts. You can give that answer, revise one choice, or say why the two fit.',sources:['street-2006','railton-1986']},
 {id:'promise-and-gap',kind:'tension',title:'Facts that give an “ought”, and an ought that needs a value',
  when:{all:[leaf('gap-promise','yes-fact'),leaf('gap-job','covered')]},
  explanation:'You agreed with Searle that the facts about Jones’s promise are enough on their own to show he ought to pay. You also said that getting from facts to what we should do needs a value we bring and justify to each other.',
  scope:'These can fit if you think promising is an institution whose rules we have already accepted, so the value is built in (Hare’s reply to Searle). If so, say that; it means the facts alone were not enough after all.',sources:['searle-1964','hume-is-ought']},
 {id:'agreement-makes-right',kind:'tension',title:'If universal approval makes it right, does universal acceptance of slavery?',
  when:{all:[leaf('taste-everyone','right'),leaf('society-adaptive','still-objective','still-reasons')]},
  explanation:'In “Is It Just Opinion, Then?” you said that if everyone alive approved of killing strangers for their cars, it would be right for them. In “Can a Whole Society Be Wrong?” you said that slavery would still have been wrong even if everyone, the enslaved included, had come to accept it.',
  scope:'A distinction is available: acceptance produced by indoctrination may not count as approval in your sense. If that is your reason, say so; it means approval counts only when it is informed and free, which is no longer simple relativism.',sources:['wong-2006','scanlon-1998']},
 {id:'vote-versus-the-excluded',kind:'tension',title:'Justifiable to the person affected, or decided by a vote?',
  when:{all:[leaf('society-wrong','yes-reasons'),leaf('limit-jones','vote')]},
  explanation:'In “Can a Whole Society Be Wrong?” you said slavery was wrong because it could never be justified to the people enslaved, however many others accepted it. In “Can a Fair Agreement Be Terrible?” you let the viewers’ vote decide Jones’s fate, although the vote does not answer his complaint.',
  scope:'You may see a relevant difference: the vote was free and informed, and slavery’s acceptance was not. If so, say which test you are using in each case.',sources:['scanlon-1998','anderson-2016']},
 {id:'no-facts-then-a-fact',kind:'contradiction',title:'No objective facts, then an objective fact',
  when:{all:[leaf('start-view','none'),leaf('limit-why','objective')]},
  explanation:'At the start you said there are no objective moral facts. In the Jones case you rescued him because his suffering “objectively outweighs” the viewers’ enjoyment, whatever anyone thinks.',
  scope:'Changing your mind is allowed: this case may have convinced you that one job needs an objective fact. If so, record it; that is exactly the evidence the exhibit asks for.',sources:['parfit-2011']}
];
