// Follow-up questions that appear only after certain answers, and checks that compare two answers.
// Checks run in both directions: some test objectivist answers, some test the reasons-between-people view, some test relativism.
const leaf=(step,...choices)=>({step,choices});
const c=(id,label,follows,feedback,kind='contested',sources=[],ledger)=>({id,label,follows,feedback,kind,sources,sourceIds:sources,flag:['inference','unsupported'].includes(kind),...(ledger?{ledger}:{})});
const branch=(id,room,after,when,prompt,context,sources,choices)=>({id,room,branch:{after,when},prompt,context,sources,evidence:[],choices});

export const branchSteps=[
 branch('limit-why','village','limit-jones',leaf('limit-jones','rescue'),
  'You would rescue Jones, though nearly everyone voted to keep watching. Why?',
  'This is the key question of the room. Your reason shows whether you are relying on an objective fact, on comparing complaints person by person, or on a strong feeling.',
  ['scanlon-1998','parfit-2011'],[
   c('objective','Because his suffering objectively outweighs their enjoyment, whatever anyone thinks.','You rely on an objective fact about how harms compare.','This is the objectivist answer, and it is coherent. It means this job, at least, uses an objective fact. If you said at the start that there are no objective moral facts, the tool will point out the tension.','contested',['parfit-2011']),
   c('complaints','Because his complaint is far stronger than any one viewer’s, and a vote doesn’t answer him.','You compare complaints person by person. No objective fact is used, unless the comparison rule itself is one.','This is Scanlon’s answer. It explains the rescue without adding up the viewers. The open question (exhibit 4) is whether the rule “compare one person at a time” is itself an objective fact in disguise.','contested',['scanlon-1998']),
   c('feeling','Because leaving him there just feels monstrous.','You rely on a strong reaction. You’d need a reason to offer a viewer who disagrees.','A strong reaction is a signal worth taking seriously (room 01). But a viewer who voted to keep watching will ask for a reason. Both of the other answers are attempts to give one.','reflection',['haidt-2001']),
   c('any','Any of these would do; they all point the same way.','You don’t need to choose a ground for this case.','In this case they agree. They come apart in harder cases, which is why the next question asks whether this job needs objective facts.','reflection',[])
  ]),
 branch('consent-withdraw','postcode','consent-pay',leaf('consent-pay','safeguards','redesign','autonomy','cap'),
  'Halfway through the study, a participant asks for their data to be deleted. Deleting it will weaken the results for everyone else. What should happen?',
  'An invented continuation. The participant was told at the start that they could withdraw, but the form did not say whether data already collected would be deleted.',
  ['belmont-1979'],[
   c('delete','Delete it. Their say over their own information comes first.','You put the participant’s control first, at a cost to the study.','This protects the participant’s say over what happens to them. The cost falls on the research and on future patients, and you accept that.','contested',['belmont-1979']),
   c('keep','Keep it. They agreed to take part, and the data is already collected.','You put the study’s reliability first.','This protects the value of everyone else’s participation. The participant can object that they were never told their data would be kept after withdrawing. That complaint is hard to answer.','contested',['belmont-1979']),
   c('ask','Pause the use of their data and ask what they would accept, such as anonymising it.','You look for an option the participant could accept.','This tries to find something both sides could accept. If the participant still refuses, you are back to the original choice.','reflection',['belmont-1979']),
   c('depends','It depends on what they were led to believe at the start.','You make the answer turn on what was promised.','A reasonable answer. Since the form was silent, ask what a reasonable participant would have understood. Most would have assumed withdrawal meant their data too.','reflection',['belmont-1979'])
  ]),
 branch('ozone-floor','commonstead','ozone-costs',leaf('ozone-costs','caused','afford','equal','fund'),
  'The only plan that can start this year would push some very poor households below what they need for food and heating for a year. Waiting a year causes serious, lasting damage to other people later. What now?',
  'An invented hard choice, not a fact about the Montreal Protocol. There is no cost-free option.',
  ['montreal-finance','parfit-1984'],[
   c('delay','Wait. Don’t push people below basic needs, even for a lasting benefit.','You protect the worst off now, accepting lasting harm to others later.','You put present basic needs first. The people harmed later have a complaint too, and you will need to answer it.','contested',[]),
   c('compensate','Go ahead, and compensate the households as fast as possible.','You act now and promise repair. A promise isn’t protection unless it is funded.','This tries to meet both claims. It works only if the compensation is real and quick.','contested',[]),
   c('proceed','Go ahead. The lasting damage matters more than a hard year.','You give the future full weight, at a serious cost to people now.','You treat lasting future harm as weightier. The households pushed below basic needs have a strong complaint, and you will need to answer it.','contested',[]),
   c('search','I’d refuse to accept the choice and look harder for a plan that avoids both harms.','You challenge the claim that no better option exists.','In real life, always worth doing. If no better plan exists, the hard choice is still there.','reflection',[])
  ])
];

export const consistencyRules=[
 {id:'evolved-but-objective',kind:'tension',title:'Evolved feelings and objective facts',
  when:{all:[leaf('origin-debunk','street'),leaf('start-cat','fact')]},
  explanation:'You agreed with Street that evolution would make our feelings match objective moral facts only by luck. In the first room you also said that when you see cruelty you are seeing a moral fact. If the match between evolved feelings and objective facts would be luck, why trust this reaction to reveal one?',
  scope:'This is a real difficulty for objectivists, not a contradiction. Objectivists have replies: for example, that evolution tracked harms and benefits that line up with moral facts. You can choose that reply, change one answer, or say why the two fit.',sources:['street-2006','railton-1986']},
 {id:'agreement-makes-right',kind:'contradiction',title:'If agreement makes it right, slavery was right where it was agreed',
  when:{all:[leaf('taste-everyone','right'),leaf('society-wrong','yes-objective','yes-reasons')]},
  explanation:'In room 02 you said that if everyone approved of killing strangers for their cars, it would be right for them. In room 04 you said slavery was wrong even in societies where nearly every free person accepted it. If approval makes something right, approval of slavery made slavery right where it was approved.',
  scope:'This tests relativism: the view that a society’s agreement makes things right. A distinction is possible: for example, the enslaved people did not agree, so the society’s agreement was never everyone’s. If that is your reason, say so; it is the reasons-between-people view.',sources:['wong-2006','anderson-2016']},
 {id:'vote-versus-the-excluded',kind:'tension',title:'Justifiable to those affected, or decided by a vote?',
  when:{all:[leaf('society-wrong','yes-reasons'),leaf('limit-jones','vote')]},
  explanation:'In room 04 you said slavery was wrong because it could never be justified to the people enslaved, however many others accepted it. In room 05 you let a fair vote decide, even though the vote cannot be justified to Jones.',
  scope:'You may see a difference: the vote was free and fair, and slavery was not. But Jones still could not accept the result, which was your test in room 04. Say which test you are using.',sources:['scanlon-1998','anderson-2016']},
 {id:'no-facts-then-a-fact',kind:'contradiction',title:'No objective facts, then an objective fact',
  when:{all:[leaf('start-view','none'),leaf('limit-why','objective')]},
  explanation:'At the start you said there are no objective moral facts. In the Jones case you rescued him because his suffering “objectively outweighs” the viewers’ enjoyment, whatever anyone thinks.',
  scope:'Changing your mind is allowed: this case may have convinced you that one job needs an objective fact. If so, record it; that is exactly the evidence the exhibit asks for.',sources:['parfit-2011']},
 {id:'unknowable-but-findable',kind:'tension',title:'An answer no one can show, and an answer to find',
  when:{all:[leaf('start-neighbours','one-right'),leaf('disagree-stuck','truth')]},
  explanation:'In the first room you said one neighbour is right even if no one can ever show it. In room 03 you said the town should find out which side is objectively right and act on it. If no one can ever show it, how would the town find out?',
  scope:'Not a contradiction if you think we can sometimes find out. Then say how: what would tell the town which side sees the moral fact?',sources:['enoch-2011','harman-1977']},
 {id:'covered-then-needed',kind:'tension',title:'Enough without objective facts here, but not there',
  when:{all:[leaf('society-job','covered'),leaf('limit-why','objective')]},
  explanation:'In room 04 you said the people affected were enough to make slavery wrong, with no objective fact needed. In room 05 you relied on an objective fact to rescue Jones.',
  scope:'The cases may differ: room 05 is where the exhibit itself admits the reasons-between-people view is weakest. If that is your reason, record it. It narrows the claim rather than refuting it.',sources:['scanlon-1998','parfit-2011']}
];
