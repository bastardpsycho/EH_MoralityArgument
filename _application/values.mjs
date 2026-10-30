// Principles a visitor can carry, and the opening value questions that pre-select them.
// A principle selected by an opening answer is exactly that statement or its exact negation; nothing stronger is attributed.
// Links are strict: "fits" means the answer applies or follows from the principle as worded; "pulls against" means the two
// cannot both hold in the stated case. Where the connection depends on an unstated assumption, there is no link.

export const scale=[[-2,'Strongly disagree'],[-1,'Disagree'],[0,'Not sure'],[1,'Agree'],[2,'Strongly agree']];
export const scaleLabel=score=>scale.find(([v])=>v===score)?.[1]||'Skipped';
const item=(id,room,statement,negation,about)=>({id,room,statement,negation,about});
export const intakeItems=[
 item('i-objective','hub','Some things are wrong no matter what anyone thinks, feels or would agree to, even after careful and fair discussion.','Whether something is wrong always depends, in some way, on what people think, feel or would agree to.','Whether objective moral facts exist.'),
 item('i-gut','fairness','When I feel strongly that something is wrong, I can usually trust that feeling.','When I feel strongly that something is wrong, I can’t usually trust that feeling by itself.','How far to trust strong moral reactions.'),
 item('i-facts','isought','If we knew every fact about what is happening and what it will cause, we would know what is right to do.','Knowing every fact about what is happening and what it will cause would not, by itself, tell us what is right to do.','Whether facts about how things are settle what we should do.'),
 item('i-consensus','commute','If everyone in a society agrees that something is right, then for them it is right.','Even if everyone in a society agrees that something is right, that does not make it right for them.','Whether agreement makes things right.'),
 item('i-pressure','climate','People’s moral views are shaped by their circumstances more than they realise.','People’s circumstances shape their moral views no more than they realise.','How much circumstances shape judgment.'),
 item('i-dissent','commons','One person can be right about a moral question even when everyone around them disagrees.','No one can be right about a moral question when everyone around them disagrees.','Whether a lone dissenter can be right.'),
 item('i-numbers','village','It can be right to cause one person serious harm if it gives small benefits to very many people.','It is never right to cause one person serious harm for small benefits to very many people.','Whether many small benefits can outweigh one serious harm.'),
 item('i-bound','access','Someone who doesn’t care about morality is still bound by it.','Someone who doesn’t care about morality is not bound by it.','Whether morality applies to people who reject it.'),
 item('i-autonomy','postcode','Adults should be free to take serious risks with their own bodies, even when experts think it unwise.','Adults should not always be free to take serious risks with their own bodies when experts think it unwise.','Choice versus protection.'),
 item('i-desert','places','Wrongdoers should get what they deserve, even if punishing them prevents no future harm.','Wrongdoers should not always get what they deserve when punishing them prevents no future harm.','What punishment is for.'),
 item('i-future','commonstead','People not yet born matter at least as much as people alive today.','People not yet born matter less than people alive today.','What we owe the future.'),
 item('i-justify','charter','A rule is only fair if I could explain it to the people it affects and they could reasonably accept it.','A rule can be fair even if I couldn’t explain it to the people it affects in a way they could reasonably accept.','Whether fairness means being able to justify yourself to others.')
];
export const intakeById=id=>intakeItems.find(i=>i.id===id);
export const intakeSide=score=>score>=1?'agree':score<=-1?'disagree':null;

const keep='Keeping it means it is shown beside later decisions it bears on, with a note when an answer follows from it or cannot hold alongside it.';
const fromAnswer='This is your own opening answer, word for word.';
// v(id, room, label, sentence, explanation, kind, sources, intake link, fits, strains, fit note, strain note)
const v=(id,room,label,short,long,kind,sources,intake,fits,strains,fitNote,strainNote)=>({id,room,label,short,long,kind,sources,intake,fits,strains,fitNote,strainNote});
// Intake principles take their sentence from the opening question, so the carried commitment is exactly what was answered.
const ia=(id,itemId,label,extra,sources,fits,strains,fitNote,strainNote)=>{const it=intakeItems.find(i=>i.id===itemId);return v(id,it.room,label,it.statement,`${fromAnswer} ${extra} ${keep}`,'principle',sources,{item:itemId,when:'agree'},fits,strains,fitNote,strainNote);};
const id_=(id,itemId,label,extra,sources,fits,strains,fitNote,strainNote)=>{const it=intakeItems.find(i=>i.id===itemId);return v(id,it.room,label,it.negation,`${fromAnswer.replace('word for word','put as the plain opposite of the statement you disagreed with')} ${extra} ${keep}`,'principle',sources,{item:itemId,when:'disagree'},fits,strains,fitNote,strainNote);};
const objectiveYes=['start-view/objective','start-cat/fact','taste-same/objective','taste-everyone/wrong-objective','society-wrong/yes-objective','society-adaptive/still-objective','limit-why/objective','uncaring-what/objective','ozone-future/objective','final-position/objective'];
export const values=[
 // 00 · the question
 ia('p-objective','i-objective','Wrong whatever we’d agree','This is the objectivist claim. Saying that a job doesn’t need objective facts never pulls against it: facts can exist without being needed.',['railton-1986','enoch-2011'],
  objectiveYes,['start-view/none','final-position/none'],
  'This answer relies on something being wrong whatever anyone would agree to, as your answer says.','This answer says there are no such facts at all, which your opening answer denies.'),
 id_('p-made','i-objective','Wrongness depends on us','It covers relativism and the reasons-between-people view. Error theorists, who think nothing is really wrong at all, may reject both statements.',['scanlon-1998','mackie-1977'],
  ['start-view/none','final-position/none','taste-everyone/wrong-reasons','taste-everyone/right','society-wrong/yes-reasons','society-adaptive/still-reasons','society-adaptive/then-right'],objectiveYes,
  'This answer makes the wrong depend on what people do or could accept, as your opening answer does.','This answer relies on a wrong that holds whatever anyone thinks or would agree to, which your opening answer denies.'),
 v('p-follow','hub','Follow the argument','If a job really does need objective facts, I’ll say so, whichever side I started on.',`A principle of honesty for the whole exhibit. ${keep}`,'principle',[],null,
  ['objections-if/narrow','objections-if/switch','final-change/job'],[],'This answer lets the argument move you.',''),
 // 01 · what even is right and wrong?
 v('p-name-act','evaluation','Name it carefully','Before I call something a lie, a theft or a betrayal, I check that the name fits what actually happened.',`Most rules apply to acts under a name; choosing the name is already a judgment. ${keep}`,'principle',['eval-kant-1797'],null,
  ['eval-party/not-a-lie'],[],
  'This answer checks whether the name “lie” really fits before applying the rule.',''),
 v('p-act-person-outcome','evaluation','Act, person, outcome','I keep apart whether an act was right, whether the person acted well, and how it turned out.',`Three questions that one word, “wrong”, often blurs together. ${keep}`,'principle',['eval-nagel-1979','eval-huainanzi'],null,
  ['eval-drivers/separate','eval-drug/two-verdicts'],['eval-drivers/bad-person','eval-drug/by-results'],
  'This answer keeps the act, the person and the outcome apart.','This answer reads one of them straight off another, which your principle keeps apart.'),
 v('p-check-file','evaluation','Check the case file','I separate the rule I believe from how sure I am about what happened.',`Uncertainty about what happened is not the same as uncertainty about what would be right if the facts were known. ${keep}`,'principle',['eval-ross-1930'],null,
  ['eval-gate/find-out','eval-gate/conditional'],['eval-gate/possible-proves','eval-gate/unknown-means-no'],
  'This answer keeps the rule and the facts apart and goes after the facts.','This answer treats what you don’t know as if it settled the facts, which your principle keeps apart.'),
 // 02 · where moral feelings come from
 ia('p-gut','i-gut','Trust strong reactions','Strong reactions often track real harms.',['railton-1986'],
  ['start-cat/fact','origin-debunk/realist-reply','limit-why/feeling'],['origin-debunk/debunked'],
  'This answer treats a strong reaction as evidence, as your opening answer does.','This answer treats the feeling as an illusion, which your opening answer denies.'),
 id_('p-gut-check','i-gut','A feeling needs checking','Feelings can carry information, and also habit and bias.',['haidt-2001','street-2006'],
  ['origin-debunk/street','start-neighbours/pressures'],[],
  'This answer looks past the feeling for something more, as your opening answer asks.',''),
 v('p-evidence','fairness','Don’t overread the evidence','I won’t claim more from a study than it actually showed.',`A rule for every evidence card in the exhibit. ${keep}`,'principle',['ritov-2024','bhuller-2020'],null,
  ['origin-monkey/maybe','origin-monkey/wait','prison-evidence/bounded','prison-evidence/inspect','ozone-facts/progress'],
  ['origin-monkey/fairness','prison-evidence/programme','prison-evidence/universal','ozone-facts/recovered','ozone-facts/proof'],
  'This answer stays within what the evidence showed.','This answer claims more than the evidence showed.'),
 // 03 · is and ought
 ia('p-facts-settle','i-facts','Facts settle it','On this view, what we ought to do can be read off how the world is. (Objectivists who think moral facts are a separate kind of fact would disagree with the statement.)',['foot-2001','searle-1964'],
  ['gap-smoking/nothing','gap-promise/yes-fact','gap-nature/flourishing'],['gap-job/covered','gap-mind/further'],
  'This answer gets from the facts to what should be done without adding anything, as your opening answer expects.','This answer says the facts are not enough without a value we add, which your opening answer denies.'),
 id_('p-facts-alone','i-facts','Facts don’t settle it alone','This is Hume’s point about “is” and “ought”.',['hume-is-ought'],
  ['gap-job/covered','gap-mind/further','gap-nature/hidden','gap-promise/inside'],['gap-smoking/nothing'],
  'This answer finds that something beyond the facts is needed, as your opening answer says.','This answer gets an “ought” from the facts alone, which your opening answer says can’t be done.'),
 v('p-hidden-premise','isought','Find the hidden premise','When an argument goes from how things are to what we should do, I look for the value it quietly adds.',`The everyday skill this room teaches. ${keep}`,'principle',['hume-is-ought','moore-1903'],null,
  ['gap-smoking/want','gap-smoking/value','gap-nature/hidden','gap-promise/inside','gap-mind/further'],['gap-smoking/nothing','gap-nature/right'],
  'This answer names the value doing the work.','This answer treats the step from fact to “should” as needing nothing added.'),
 // 04 · is it just opinion?
 ia('p-societys-call','i-consensus','Agreement makes it right','This is relativism about a whole society’s agreement.',['wong-2006'],
  ['taste-everyone/right','society-adaptive/then-right'],['taste-everyone/wrong-objective','taste-everyone/wrong-reasons','society-adaptive/still-objective','society-adaptive/still-reasons'],
  'This answer lets universal agreement settle what is right, as your opening answer does.','This answer says something is wrong even though everyone agrees to it, which your opening answer denies.'),
 id_('p-agreement','i-consensus','Agreement isn’t enough','Objectivists and the reasons-between-people view both hold this.',['scanlon-1998','railton-1986'],
  ['taste-everyone/wrong-objective','taste-everyone/wrong-reasons','society-adaptive/still-objective','society-adaptive/still-reasons'],['taste-everyone/right','society-adaptive/then-right'],
  'This answer keeps “right” separate from “agreed”, as your opening answer does.','This answer lets universal agreement make something right, which your opening answer denies.'),
 v('p-doubt','commute','Doubt isn’t indifference','I can be unsure what makes cruelty wrong and still oppose it fully.',`Uncertainty about foundations is compatible with firm commitments. ${keep}`,'principle',['joyce-2024','mackie-1977'],null,
  ['taste-same/reasons','taste-everyone/wrong-reasons','taste-job/unsure'],[],
  'This answer keeps opposing cruelty without needing a settled foundation.',''),
 // 05 · why decent people disagree
 ia('p-name-pressure','i-pressure','Circumstances shape us','Some of that shaping is information, some is pressure; the room asks which is which.',['milgram-1963','pettigrew-tropp-2006'],
  ['start-neighbours/pressures','disagree-swing/sort','society-learning/mixed'],[],
  'This answer takes the shaping force of circumstances seriously, as your opening answer does.',''),
 id_('p-face-value','i-pressure','We see our circumstances','This credits people with seeing how their circumstances affect them.',['enoch-2011'],[],[],'',''),
 v('p-hear-reasons','climate','Hear their reasons','I ask what the other side could accept, not only what I want.',`The working core of the reasons-between-people view. ${keep}`,'principle',['habermas-1990','scanlon-1998'],null,
  ['start-neighbours/better-reasons','disagree-stuck/procedure','uncaring-what/answer'],[],
  'This answer looks for what the other side could accept.',''),
 // 06 · can a whole society be wrong?
 ia('p-lone-right','i-dissent','A lone voice can be right','Every reformer started outnumbered.',['anderson-2016'],
  ['society-adaptive/still-objective','society-adaptive/still-reasons'],['society-adaptive/then-right'],
  'This answer lets someone be right against everyone, as your opening answer does.','This answer makes everyone’s agreement decisive, so a lone dissenter could not be right, which your opening answer denies.'),
 id_('p-trust-many','i-dissent','Not right against everyone','Note the strength: your answer rules out being right against everyone, not merely against most.',['rawls-1985'],
  ['society-adaptive/then-right','taste-everyone/right'],['society-adaptive/still-objective','society-adaptive/still-reasons','taste-everyone/wrong-objective','taste-everyone/wrong-reasons'],
  'This answer makes everyone’s agreement decisive, as your opening answer does.','This answer says something is wrong although everyone accepts it, so a lone dissenter would be right, which your opening answer rules out.'),
 v('p-who-wasnt-asked','commons','Ask who wasn’t asked','When a practice seems settled, I ask who never had the chance to object.',`Anderson: power makes people morally blind. ${keep}`,'principle',['anderson-2016'],null,
  ['society-wrong/yes-reasons','society-learning/contention','tuskegee-wrong/burden','ozone-future/threshold'],[],
  'This answer pays attention to the people who had no say.',''),
 // 07 · can a fair agreement be terrible?
 ia('p-numbers','i-numbers','Numbers can outweigh','Adding up benefits is a serious view, held by many utilitarians.',['parfit-2011'],
  ['limit-jones/wait'],[],'This answer lets the total benefit outweigh one person’s serious harm, as your opening answer allows.',''),
 id_('p-each-person','i-numbers','Never one for many trivial gains','This is close to Scanlon’s restriction on adding up.',['scanlon-1998'],
  ['limit-jones/rescue'],['limit-jones/wait','limit-jones/vote'],
  'This answer protects the one person, as your opening answer requires.','In this case, this answer leaves Jones in agony for the viewers’ small benefit, which your opening answer says is never right.'),
 v('p-imagine-being','village','Imagine being the one','I test a rule by imagining I am the person it costs most.',`A test, not a proof: it helps check whether a rule could be justified to everyone. ${keep}`,'principle',['scanlon-1998'],null,
  ['limit-why/complaints','taste-same/reasons','society-wrong/yes-reasons'],[],
  'This answer takes the view of the person who bears the most cost.',''),
 // 08 · why should someone who doesn't care listen?
 ia('p-binds-everyone','i-bound','Morality binds everyone','Both objectivists and some reasons-based views hold this, in different ways.',['parfit-2011','korsgaard-1996'],
  ['uncaring-what/objective','uncaring-what/answer','uncaring-job/needs','uncaring-job/covered'],['uncaring-what/no-reason'],
  'This answer applies morality to the official whether or not he cares, as your opening answer does.','This answer allows that the official may have no reason to stop, which your opening answer denies.'),
 id_('p-reasons-reach','i-bound','Not bound if you don’t care','Bernard Williams held a view like this about reasons.',['williams-1981'],
  ['uncaring-what/no-reason'],['uncaring-what/objective','uncaring-job/covered'],
  'This answer accepts that the official may have no reason of his own, as your opening answer implies.','This answer says morality applies to the official although he doesn’t care, which your opening answer denies.'),
 v('p-protect','access','Protect, don’t just persuade','When someone won’t listen to reasons, I still act to protect the people they harm.',`On any view, protection doesn’t wait for the wrongdoer to agree. ${keep}`,'principle',['darwall-2009'],null,
  ['uncaring-what/answer','uncaring-what/no-reason'],[],'This answer protects the victims rather than waiting for the official to agree.',''),
 // 09 · Tuskegee and consent
 ia('p-their-body','i-autonomy','Their body, their call','Respect for persons, in the Belmont Report’s terms.',['belmont-1979'],
  ['consent-pay/autonomy'],['consent-pay/redesign'],
  'This answer leaves the choice with the informed adult, as your opening answer does.','This answer stops informed adults from taking the risk until the design is changed, which your opening answer says they should be free to take.'),
 id_('p-protect-first','i-autonomy','Not always free to risk','Beneficence, in the Belmont Report’s terms.',['belmont-1979'],
  ['consent-pay/redesign'],[],'This answer limits the risk informed adults may take, as your opening answer allows.',''),
 v('p-money','postcode','Money can pressure','I ask whether payment is helping a choice or pushing it.',`Payment can be fair compensation or an undue pressure on people with little money. ${keep}`,'principle',['belmont-1979'],null,
  ['consent-pay/cap','consent-pay/safeguards'],[],'This answer checks whether payment is pushing the choice.',''),
 // 10 · punishment
 ia('p-desert','i-desert','Desert is enough','A serious view of justice, not only a feeling.',['scanlon-1998'],
  ['prison-victim/desert'],[],'This answer gives the offender what you judge he deserves, as your opening answer says he should get.',''),
 id_('p-purpose','i-desert','Desert isn’t always enough','Rejecting the general rule leaves open when desert does suffice; mercy, or costs to others, may sometimes outweigh it.',['bhuller-2020'],
  ['prison-victim/no-extra','prison-victim/repair'],[],
  'This answer asks what the punishment would achieve, which your opening answer leaves room for.',''),
 v('p-offender-counts','places','The offender still counts','Punishment must be justifiable to the person punished, too.',`Someone who did wrong keeps a claim not to suffer more than can be justified. ${keep}`,'principle',['scanlon-1998'],null,
  ['prison-victim/no-extra'],[],'This answer keeps the offender’s claim in view.',''),
 // 11 · the ozone layer and future people
 ia('p-future-equal','i-future','The future counts fully','Equal mattering is not the same as equal outcomes: basic needs now can still come first in a hard choice.',['parfit-1984'],
  ['ozone-future/threshold','ozone-future/objective'],[],'This answer gives future people a full claim, as your opening answer does.',''),
 id_('p-present-first','i-future','The future counts for less','A view about the people who exist now having stronger claims.',['rawls-1985'],[],[],'',''),
 v('p-fair-shares','commonstead','Fair shares','Those who caused a problem, or can best afford to fix it, should carry more of the cost.',`The idea behind the Montreal Protocol’s fund. ${keep}`,'principle',['montreal-finance'],null,
  ['ozone-costs/caused','ozone-costs/afford','ozone-costs/fund'],[],'This answer shares the cost by responsibility or ability to pay.',''),
 // 12 · objections
 v('p-plural','hall','More than one answer','On some hard moral questions, more than one answer can be reasonable.',`David Wong’s pluralism; Rawls on reasonable disagreement. Reasonable is not the same as true. ${keep}`,'principle',['wong-2006','rawls-1985'],null,
  ['disagree-stuck/plural'],[],'This answer allows more than one reasonable answer.',''),
 v('p-one-answer','hall','One right answer','Every real moral question has one right answer, even if we can’t find it.',`A natural companion of objectivism. ${keep}`,'principle',['enoch-2011','dworkin-1996'],null,
  ['start-neighbours/one-right','disagree-stuck/truth'],[],'This answer looks for the one right answer.',''),
 v('p-test-own-side','hall','Test my own side','I apply the hardest objections to my own view too.',`Equal scrutiny for both sides. ${keep}`,'principle',['joyce-2014'],null,
  ['objections-if/narrow','objections-if/drop','objections-if/switch'],[],'This answer takes the objection to heart.',''),
 // 13 · where you stand
 ia('p-defend','i-justify','Fair means justifiable to them','The reasons-between-people view, applied to fairness.',['scanlon-1998','darwall-2009'],
  ['start-neighbours/better-reasons','uncaring-deliberate/justify','final-act/accept','society-wrong/yes-reasons','limit-why/complaints'],['limit-jones/vote'],
  'This answer tests fairness by what the people affected could accept, as your opening answer does.','This answer accepts a vote that Jones could not reasonably accept, which by your opening answer would not be fair.'),
 id_('p-conscience','i-justify','Fair without their acceptance','Fairness may rest on welfare, rights or conscience rather than on what others could accept.',['enoch-2011'],[],[],'',''),
 v('p-revise','charter','Ready to revise','I can say what would change my mind.',`A view becomes testable when you can name what would change it. ${keep}`,'principle',[],null,
  ['final-change/job','final-change/idle','final-change/access'],['final-change/nothing'],
  'This answer names what would change your mind.','This answer leaves nothing that could change your mind.')
];
export const valuesIn=room=>values.filter(value=>value.room===room);
export const principleForIntake=(itemId,side)=>values.find(p=>p.intake?.item===itemId&&p.intake.when===side);
