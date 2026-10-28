// After the Commute · rooms edition (route /after-the-commute-v02/).
// Plain authored data and pure functions. Escaped at render; no runtime I/O.
export const edition = 'rooms-1.0';
export const sharedSource = 'https://chatgpt.com/share/6acff0a5-a068-83eb-8dd1-fcecb8a27f43';
export const credit = 'Argument: the project author · 3D experience and writing: Claude · Earlier research and editions: Codex · Starting discussion: ChatGPT';
export const coreAsk = [
 'Give workers a right to choose remote work wherever tasks allow, with employers required to justify attendance.',
 'Prohibit residence-only pay discounts for comparable work in the same employer-market pay band.'
];
export const badges = {
 Measured:'A finding from a particular study or dataset. Its setting and limits matter.',
 Modelled:'A result calculated from assumptions. Change the assumptions and it can change.',
 Programme:'A real initiative or plan. Its results need their own evaluation.',
 Proposal:'Something we advocate. Judge whether its reasons and safeguards persuade you.',
 Reasoning:'An argument from principle or experience, not a study result.',
 Illustration:'An invented example or arithmetic that explains an idea. It predicts nothing.'
};
export const voicesNote = 'The objections and replies are written voices for this exhibit. They represent common views, not quotes from real people. The replies grew from the project author’s responses and were rewritten for clarity, accuracy and balance.';

// relation: provides = remote work helps directly; design = it helps when designed well;
// condition = a real concern remote work must meet (shown, scored for neither side);
// office = a commercial priority that pulls work back to the office. Office values carry what their backers say (claim),
// what choosing them costs (people, planet or fairness) and the value they work against.
// short = the line on the charter board and in toasts; long = the fuller case in the side panel.
// This part of the experience argues a side. The office priorities are described as we see them; the Great Hall gives
// the strongest good-faith objections to remote work.
export const categories = [
 {id:'time',name:'Time, money & health',intro:'What the commute takes from each of us, every working day.'},
 {id:'freedom',name:'Freedom & trust',intro:'Who decides where good work happens, and on what grounds.'},
 {id:'community',name:'Family & community',intro:'The people around us, on weekdays as well as weekends.'},
 {id:'planet',name:'Planet & climate',intro:'The air, land and energy we share.'},
 {id:'fairness',name:'Fair pay & opportunity',intro:'Who gets the job, and what the same work is worth.'},
 {id:'places',name:'Living places',intro:'Villages, towns and regions that people can stay in.'}
];
export const costLabels = {people:'People',planet:'The planet',fairness:'Fairness'};
export const relationLabels = {provides:'Remote provides',design:'With good design',condition:'A condition to meet',office:'Commercial priority'};
// Value crystals take two clicks (P024). The first opens an explanation over the crystal; a second click on the same
// crystal within VALUE_PROMPT_MS adds the value, or removes it if it is already added. Any other click or the timeout drops it.
export const VALUE_PROMPT_MS = 30000;
export function crystalClick(pending,id,now){
 if(pending&&pending.id===id&&now-pending.at<VALUE_PROMPT_MS)return {toggle:true,pending:null};
 return {toggle:false,pending:{id,at:now}};
}
export const valuePrompt = added => added?'You have added this value. Click the diamond again to remove it.':'Click the diamond again to add this value to your journey.';
export const values = [
 // The Station
 {id:'where-i-live',room:'hub',category:'freedom',relation:'provides',label:'Choosing where I live',
  short:'When the job no longer fixes your address, you can live near family, nature or a cheaper rent.',
  long:'For most of the last century the job decided the map: you lived within reach of the office, or you didn’t get the job. Remote work breaks that link. People can stay where they grew up, move closer to ageing parents, or leave a city they can no longer afford, without giving up work they’re good at. It isn’t open to every job, and popular places still need their homes protected, but for a great many jobs the address can now be a choice.'},
 {id:'mornings',room:'hub',category:'time',relation:'provides',label:'Mornings that start at home',
  short:'No platform, no traffic jam: the day starts with breakfast, a walk or the school run.',
  long:'For many people the commute is the first thing they do each day and the last thing they do each evening. Without it, the edges of the day go back to the person living it: breakfast with the children, a walk, a proper night’s sleep instead of an early alarm. Workers in a 27-country survey saved about 72 minutes on each home-working day (Measured).',sources:['nber-time-savings-wfh']},
 {id:'flexible-week',room:'hub',category:'freedom',relation:'design',label:'A working week that fits my life',
  short:'Work fitted around appointments, school runs and energy levels, within what the team needs.',
  long:'Remote work makes it possible to move an hour, keep the dentist appointment, or do focused work when you focus best. It only works with good design: agreed hours for working together, clear expectations, and managers who judge results. Without those, flexibility can blur into always being on.'},
 {id:'company-policy',room:'hub',category:'freedom',relation:'office',label:'“It’s company policy”',
  claim:'Everyone is in the office three days a week. That’s the policy.',cost:['people'],against:'judged-on-work',
  short:'An instruction with no reason the work needs: compliance for its own sake.',
  long:'A good rule can say what it protects: a patient, a lab, a secure system, a new starter who needs teaching. A rule that can’t say what the work gains from your presence isn’t a reason; it’s an order. When people who have done their jobs well from home are told to return “because it’s policy”, attendance stops being about the work and becomes a test of obedience. It treats adults as attendance to be managed rather than people to be trusted. Attendance should be justified by the task, not imposed by the title.'},
 {id:'commute-yours',room:'hub',category:'time',relation:'office',label:'“The commute is your own time”',
  claim:'We don’t pay for your journey. Getting here is your business.',cost:['people'],against:'time',
  short:'You give the hours and pay the fares; the employer gets you at your desk.',
  long:'In most jobs the journey to work is unpaid, and fares, fuel and parking come out of the worker’s own pocket. An hour’s round trip each working day adds up to more than two hundred hours a year that the employer neither pays for nor has to justify. Requiring that journey when the work could be done without it moves a real cost from the company onto its staff. It is a pay cut that never appears on a payslip.'},
 // The Commute
 {id:'time',room:'commute',category:'time',relation:'provides',label:'My time back',
  short:'About 72 minutes saved on each home-working day, across 27 countries (Measured).',
  long:'Time is the most direct thing remote work gives back. A survey across 27 countries estimated about 72 minutes saved on each home-working day. On average people put about 40% of it back into paid work, about a third into leisure and about a tenth into caring for others (Measured). Even the share that goes back into work arrives without the train.',sources:['nber-time-savings-wfh']},
 {id:'judged-on-work',room:'commute',category:'freedom',relation:'design',label:'Being judged on my work, not my attendance',
  short:'Results, not badge swipes. It only helps if managers learn to judge outcomes well.',
  long:'A badge swipe proves someone arrived, nothing more. Remote work removes attendance as a stand-in for effort and pushes organisations to say what good work actually looks like. In a randomised trial at Trip.com, two home days a week made no detectable difference to performance reviews or promotions over two years (Measured). The design part matters: clear goals, fair reviews and managers trained to judge results.',sources:['nature-trip-hybrid-2024']},
 {id:'money',room:'commute',category:'time',relation:'provides',label:'Money that stays in my pocket',
  short:'Fewer fares, less fuel, no parking, fewer bought lunches.',
  long:'Every commuting day has a price: a ticket or fuel, parking, wear on a car, the coffee and lunch bought because you’re away from home. Working remotely cuts most of those costs at once. Some come back as home heating and electricity, so the saving depends on the household, but for people on modest pay it can be the change they notice most.'},
 {id:'office-buzz',room:'commute',category:'community',relation:'condition',label:'The buzz of a busy office',
  short:'Remote work thins this out. Purposeful days together and local hubs can bring some of it back.',
  long:'The energy of a busy room is real, and so is the overheard conversation that teaches a new starter how things are done. Studies found more siloed collaboration during a firm-wide remote shift, and less code-review feedback for younger engineers who sat further from their teammates (Measured). That is a condition remote work has to meet, not a reason to commute every day: planned days together, protected mentoring, and hubs where people work alongside others.',sources:['nature-remote-collaboration','qje-proximity-mentorship']},
 {id:'culture',room:'commute',category:'freedom',relation:'office',label:'“Our culture needs you here”',
  claim:'Our culture is built in the office. If you’re not here, you’re not part of it.',cost:['people'],against:'flexible-week',
  short:'Belonging made conditional on attendance, with the price paid by the worker.',
  long:'Culture is how people treat each other, and it is worth having. But when “culture” is used to mean headcount in a building, it becomes leverage: belonging, loyalty and career prospects are tied to showing up, while the price of showing up (the hours, the fares, the extra childcare) is paid by the employee. A culture that only exists while it is being watched is not much of a culture. Real belonging can be built on purpose, in days worth travelling for, without charging people for the privilege every morning.'},
 {id:'see-working',room:'commute',category:'freedom',relation:'office',label:'“I need to see people working”',
  claim:'If I can’t see you, how do I know you’re working?',cost:['people'],against:'judged-on-work',
  short:'Managing by line of sight: presence mistaken for productivity.',
  long:'Watching people sit at desks measures sitting at desks. It rewards whoever is seen staying late and penalises whoever leaves on time to collect a child, whatever either of them achieved. In the randomised Trip.com trial, two home days a week made no detectable difference to performance reviews or promotions (Measured). Needing to see people working is an admission that the work itself isn’t being measured. The fix is better management, not a longer commute.',sources:['nature-trip-hybrid-2024']},
 // The Lighter Footprint
 {id:'clean-air',room:'climate',category:'planet',relation:'provides',label:'Cleaner air on my street',
  short:'Each avoided car commute takes its exhaust, tyre dust and noise off the road.',
  long:'Rush hour packs the most traffic onto the roads at once. Every car journey that doesn’t happen removes its exhaust, tyre and brake dust, noise and danger from the streets people live on, including the routes children walk to school. The benefit is immediate and local: felt on your own street, not just in a national statistic.'},
 {id:'climate',room:'climate',category:'planet',relation:'design',label:'A stable climate',
  short:'Real, but schedule-dependent: more remote days and less office space cut more (Modelled).',
  long:'In a US carbon-accounting model, one home day a week barely changed the work-related footprint (about 2%), two to four days cut it by about 11–29%, and fully remote work came out about 54% lower, mostly because of less office energy (Modelled). The design matters: the saving shrinks if people drive more for other trips or heat big homes badly, and grows when offices shrink and land is reused.',sources:['pnas-carbon-2023']},
 {id:'green-space',room:'climate',category:'planet',relation:'design',label:'Parks instead of parking',
  short:'Fewer parked cars free up land, but only a decision turns it into shade, play or homes.',
  long:'A parking space is about the size of a small bedroom, and an office car park holds hundreds of them. As commuting falls, car parks and half-empty office blocks become land that towns could use for trees, play space, homes and shade in heatwaves. None of that happens by itself; councils and owners have to choose it.'},
 {id:'sunk-office',room:'climate',category:'planet',relation:'office',label:'“We’re paying for the building”',
  claim:'We’ve signed a long lease. Those desks need filling.',cost:['planet'],against:'climate',
  short:'People made to travel so that a property decision looks justified.',
  long:'An office lease is a past decision: the money is spent whether anyone sits there or not. Ordering staff back to fill floor space doesn’t recover any of it. It adds the cost of their commutes, in time, fares and emissions, on top. In the US model in this room, most of the footprint saved by fully remote work came from less office energy and space (Modelled). Keeping buildings full for the sake of the lease turns a property decision into a climate cost that everyone pays.',sources:['pnas-carbon-2023']},
 // The Everyday Commons
 {id:'family',room:'commons',category:'community',relation:'provides',label:'Time with family',
  short:'About a third of saved commute time goes to leisure and a tenth to caring for others (Measured).',
  long:'The hours that used to go on the road go somewhere. Across 27 countries, about a third of saved commute time went to leisure and about a tenth to caring for children and others, on average (Measured). That is dinner together, homework at the kitchen table, a parent visited on a Tuesday. Working at home is not childcare, though; the gain lasts only if boundaries are protected.',sources:['nber-time-savings-wfh']},
 {id:'care',room:'commons',category:'community',relation:'provides',label:'Being there for people who need me',
  short:'Close by for a sick child, an ageing parent or a neighbour who needs a hand.',
  long:'Being an hour away is what turns a child’s temperature or a parent’s fall into a crisis. Working near home makes it possible to be there in minutes, deal with it, and get back to work. It doesn’t replace paid care or proper leave, and saved time must not quietly turn into unpaid work, especially for women. With those protections, being close is a quiet, enormous good.'},
 {id:'neighbourhood',room:'commons',category:'community',relation:'design',label:'A lively neighbourhood on weekdays',
  short:'Spending moves towards where people live, but unevenly; the least affluent areas gain least (Modelled).',
  long:'When fewer people commute, the coffee, lunch and errands follow them home. A model for England and Wales found local service spending shifting from a few office districts to many residential neighbourhoods. It is a redistribution rather than new money, and the least affluent areas gained least (Modelled). With local plans that back small shops and services, weekday streets can come back to life.',sources:['economica-local-spending']},
 {id:'not-alone',room:'commons',category:'community',relation:'condition',label:'Not feeling alone',
  short:'Careless remote work makes isolation worse, especially for people who live alone (Measured). Company by design is the fix.',
  long:'This is the strongest evidence against careless remote work. A study of US workers found that people in jobs that could go remote spent about an extra hour alone each workday after the pandemic, with worse distress, concentrated among people living alone (Measured). It is a condition remote work must meet: local hubs, planned time together and neighbourhoods with daytime life. The answer is company by design, not a daily commute.',sources:['science-isolation-2026']},
 {id:'city-centre',room:'commons',category:'places',relation:'condition',label:'A bustling city centre',
  short:'Fewer commuters mean less weekday trade in office districts. They need help to become mixed, all-day places.',
  long:'Office districts built around nine to five lose trade when commuting falls, and the people working in their cafés and shops feel it first. That is a real cost and a condition to plan for: turning empty offices into homes, culture and services makes centres places people live in and visit, not only places they are sent to. A centre that only works when it is filled by obligation was always fragile.'},
 {id:'business-district',room:'commons',category:'community',relation:'office',label:'“Keep the business district busy”',
  claim:'Downtown needs the commuters. Think of the sandwich shops.',cost:['people','planet'],against:'neighbourhood',
  short:'Whole workforces sent commuting to protect footfall and rents in a few districts.',
  long:'Office districts, their landlords and the businesses around them have a genuine stake in commuting. But asking whole workforces to travel every day so that a few square kilometres keep their footfall and rents puts property values ahead of people’s time, the roads they clog and the neighbourhoods they live in. The spending doesn’t vanish when people work locally: in a model for England and Wales it moves to residential neighbourhoods (Modelled). The real question is whose high street deserves it.',sources:['economica-local-spending']},
 // The Living Village
 {id:'near-family',room:'village',category:'community',relation:'provides',label:'Living near the people I love',
  short:'A job that travels lets people stay near ageing parents, children or the place they grew up.',
  long:'Families get stretched across the map by where the jobs are. A job that can travel lets a daughter stay near her ageing father, lets grandparents help with the school run, and lets adult children come home without starting their careers again. Being near the people you love shouldn’t depend on an office’s commuting radius.'},
 {id:'village-alive',room:'village',category:'places',relation:'design',label:'Villages that stay alive',
  short:'Year-round residents can keep a shop, school or bus viable, if locals can stay too.',
  long:'A village can lose its school, shop or bus long before its last resident leaves. Income earned elsewhere but spent locally, by people who are around on weekdays, can keep that everyday demand alive. It works only alongside housing protection and local livelihoods; otherwise newcomers simply replace the people who were there.'},
 {id:'young-people',room:'village',category:'places',relation:'design',label:'Young people who can stay',
  short:'A career without leaving home, if there are homes and connections to stay for.',
  long:'Rural places have lost generations of school-leavers to the cities, because that’s where the careers were. When good jobs can be done from anywhere with a connection, leaving becomes a choice rather than a requirement. It needs affordable homes, reliable broadband and somewhere to work alongside others: exactly what a resident-led plan can provide.'},
 {id:'local-homes',room:'village',category:'places',relation:'condition',label:'Homes locals can afford',
  short:'New demand can raise rents in small places. Protect and restore homes before inviting growth.',
  long:'Remote workers on city salaries can outbid local families in small housing markets. Housing demand did spread beyond city cores in 2020–21, though the price effects can’t be cleanly pinned on remote work (Measured). This is a condition, not a reason to stop: restore empty homes, protect tenancies and use community housing trusts before recruiting newcomers.',sources:['oecd-housing-doughnut']},
 {id:'hire-nearby',room:'village',category:'fairness',relation:'office',label:'“We only hire within commuting distance”',
  claim:'We want people who can come in. Candidates must live within an hour of head office.',cost:['fairness'],against:'young-people',
  short:'Talent filtered by postcode: the village, the region and the carer need not apply.',
  long:'A commuting radius quietly decides who can have a career. It shuts out the talented person in a village two hours away, the parent who can’t move a family, and whole regions whose young people must leave to get on. Work that could be done from anywhere is rationed to people who can afford to live near one expensive centre. Choosing it accepts that where you live limits what you can become.'},
 // An Open Door
 {id:'inclusion',room:'access',category:'fairness',relation:'provides',label:'Jobs open to disabled people and carers',
  short:'Removing a daily journey removes a barrier. For some, an accessible local hub works better than home.',
  long:'Inaccessible stations, broken lifts, chronic pain, fatigue and caring duties can turn a reachable job into an impossible one. Remote work takes the daily journey out of that equation and lets people manage their own surroundings. It is individual: some people work best at home, others in an accessible hub nearby. What matters is that the choice exists.'},
 {id:'anywhere-opportunity',room:'access',category:'fairness',relation:'design',label:'Opportunity wherever you live',
  short:'Only with reliable connections and somewhere suitable to work.',
  long:'Remote work can bring good jobs to places that have rarely had them, but only where there is a reliable connection and somewhere suitable to work. Worldwide in 2024, about 83% of urban residents used the Internet against 48% of rural residents (Measured). Public broadband and local hubs turn the promise into a real opportunity.',sources:['itu-rural-digital-divide']},
 {id:'onsite-fairness',room:'access',category:'fairness',relation:'design',label:'A fair deal for people who must be on site',
  short:'Only if public gains, like freed road space and lower emissions, are shared with on-site workers.',
  long:'Nurses, cleaners, builders and shop staff will always work on site. Remote work doesn’t help them directly, but its public gains can: quieter roads on the way to work, land freed for homes near hospitals and schools, money for all-day buses. Sharing those gains is part of the case, not an afterthought.'},
 {id:'one-rule',room:'access',category:'fairness',relation:'office',label:'“One rule for everyone”',
  claim:'It wouldn’t be fair to make exceptions. Everyone comes in.',cost:['fairness'],against:'inclusion',
  short:'Equal on paper, unequal in practice: disabled people and carers carry the burden.',
  long:'A blanket attendance rule sounds even-handed, but a ten-minute drive and a two-hour journey with an unreliable lift are not the same demand. Treating unequal situations identically is how disabled people, carers and people far from the office get pushed out. UK and EU law already require reasonable adjustments for disabled workers, and a rule that disadvantages a protected group without good justification can amount to indirect discrimination. A “fairness” that only works for people who were already advantaged isn’t fair.'},
 // Beyond the Postcode
 {id:'equal-pay',room:'postcode',category:'fairness',relation:'design',label:'Equal pay for equal work',
  short:'Remote work makes it possible to do the job from anywhere. A pay rule makes it fair.',
  long:'If the job, the employer and the level are the same, the pay band should be the same, wherever the worker lives. Remote work makes that question unavoidable. The proposal here is to prohibit residence-only base-pay discounts within an employer’s pay band; differences in responsibility, experience or hours can still be paid for. It is a proposal, not current law.'},
 {id:'regions',room:'postcode',category:'places',relation:'design',label:'Regions that keep their talent',
  short:'People can stay and earn; regions benefit if spending and housing stay local and fair.',
  long:'When people can earn a good salary without moving to the capital, that income is spent in local shops, paid in local taxes, and the skills stay where they grew. EU policy already aims for connected networks of cities, towns and rural places rather than one dominant centre (Programme). It works if housing and services keep pace, and if pay isn’t cut for staying.',sources:['eu-polycentric-agenda']},
 {id:'talent',room:'postcode',category:'fairness',relation:'provides',label:'Talent from everywhere',
  short:'Employers hire the best person for the job, not the best person within an hour’s drive.',
  long:'A commuting radius limits every hire to the people who happen to live nearby or can afford to move. Remote hiring widens the pool to people in smaller towns, other regions and circumstances that don’t allow relocation. Employers get better matches; workers get jobs that fit their skills rather than their postcode.'},
 {id:'market-rates',room:'postcode',category:'fairness',relation:'office',label:'“We pay market rates”',
  claim:'Pay reflects the local market. Move somewhere cheaper and your salary adjusts.',cost:['fairness'],against:'equal-pay',
  short:'Move your chair and your work is suddenly worth less: same job, same employer, less pay.',
  long:'Location-based pay says that the same work, for the same employer, at the same level, is worth less when it is done from a cheaper place. Nothing about the work has changed: not the skill, the hours, the output or its value to the company. Only the address. Equal pay for equal work is a principle the law already applies between women and men; location pay carves out an exception that lets the employer pay less for where you sit. In effect it says: move your chair, and your work is worth less than it was yesterday, simply because we’re allowed to do that.'},
 // Already Taking Shape
 {id:'town-centres',room:'places',category:'places',relation:'design',label:'Town centres with a second life',
  short:'Empty banks and shops can become hubs, homes and services that keep main streets busy.',
  long:'Ireland’s Town Centre First policy backs local town teams tackling vacancy and dereliction and encourages people to live in town centres again (Programme). Remote work adds a reason: a hub in the old bank brings weekday footfall that a single shop never could. The policy is a framework, not proof of results, so its outcomes are worth checking.',sources:['ie-town-centre-first']},
 {id:'short-walk',room:'places',category:'planet',relation:'design',label:'Daily needs within a short walk',
  short:'Shops, school, clinic, park and a place to work, close enough to walk or cycle.',
  long:'Paris plans its neighbourhoods so that daily needs, including work, care, shopping and recreation, are within a 15-minute walk or a five-minute cycle, and EU guidance applies a 30-minute idea to rural communities (Programme). Remote work fits naturally: if work can be near home, so can much of everything else. These are planning goals, not proven outcomes.',sources:['paris-quarter-hour','eu-rural-thirty-minute']},
 {id:'company-when',room:'places',category:'community',relation:'design',label:'Company when I want it',
  short:'Local hubs and planned team days give people company without a daily commute.',
  long:'Ireland’s Connected Hubs network lets people book desks and meeting rooms in local hubs run by communities, councils and businesses (Programme). A hub down the road offers a fast connection, a quiet room and people to have lunch with, without an hour on the motorway. It is the most direct answer to isolation, though no study yet shows that hubs fully fix it.',sources:['ie-connected-hubs']},
 {id:'always-done',room:'places',category:'freedom',relation:'office',label:'“We’ve always worked this way”',
  claim:'This is how work is done. It has served us fine.',cost:['people'],against:'flexible-week',
  short:'Habit dressed up as principle, while governments and towns are already planning for change.',
  long:'The daily journey to a central office suited paper files, desk phones and machines that couldn’t move. Many of those reasons have gone; the habit remains. The governments, towns and regions in this room are already treating remote work as infrastructure. Holding on to the old pattern because it is familiar asks people to keep paying, in hours and fares, for a world that has already changed.'},
 // Commonstead
 {id:'designed-community',room:'commonstead',category:'places',relation:'design',label:'Places designed around everyday life',
  short:'Remote work gives planners room to put homes, services and work close together. The planning still has to happen.',
  long:'When work no longer pulls everyone into one centre at the same hour, places can be planned around daily life instead: homes, a school, a clinic, a hub and green space within reach of each other. Commonstead is one invented example. None of it happens by itself; it takes a plan, public investment and residents with real power.'},
 {id:'a-say',room:'commonstead',category:'places',relation:'design',label:'A say in how my place grows',
  short:'Growth that residents choose, instead of change that happens to them.',
  long:'New residents, new money and new building can feel like something done to a place. In the Commonstead proposal, residents govern the growth plan, a community housing trust secures homes, and growth pauses if rents or services come under strain. Remote work creates the chance to grow; resident control decides whether that growth is welcome.'},
 {id:'walk-cycle',room:'commonstead',category:'planet',relation:'design',label:'Walking and cycling instead of driving',
  short:'In a compact place built around a hub, everyday trips are short enough to walk or cycle.',
  long:'Many car trips are short. When the work hub, school and shops are close to home, many of those trips can be made on foot or by bike: cleaner, cheaper and healthier. It depends on compact planning and safe routes; scattered growth along roads would undo it.'},
 {id:'big-city',room:'commonstead',category:'places',relation:'office',label:'“Growth belongs in the big city”',
  claim:'Serious jobs are in the capital. Ambitious people move there.',cost:['fairness','planet'],against:'regions',
  short:'Opportunity piled up where housing is dearest; everywhere else commutes in or empties out.',
  long:'Packing good jobs into one expensive centre forces a choice on everyone else: commute long distances, pay the capital’s rents, or give up the career. It pushes up housing costs at the centre while towns and villages lose their young people and their weekday life. EU policy itself aims for connected networks of places rather than one dominant centre (Programme). Insisting that ambition requires relocation keeps opportunity rationed by geography.',sources:['eu-polycentric-agenda']}
];
export const valuesOf=cat=>values.filter(v=>v.category===cat);
export const scored=v=>v.relation==='provides'||v.relation==='design';
export const meterLevels = [[0,'Commuting as usual'],[3,'A nice perk'],[8,'A better week'],[14,'A shared benefit'],[21,'A public good']];
export function meterState(claimed=[]){
 const picked=values.filter(v=>claimed.includes(v.id)),count=r=>picked.filter(v=>v.relation===r).length;
 const provides=count('provides'),design=count('design'),condition=count('condition'),office=count('office');
 const score=provides+design,max=values.filter(scored).length;
 const level=[...meterLevels].reverse().find(([n])=>score>=n)[1];
 return {provides,design,condition,office,score,max,fill:max?score/max:0,level,total:picked.length};
}
// The charter board's scoreboard. Remote scores for the values it can provide; the office scores only for commercial
// priorities, and every office point is listed with what it costs. Conditions are shown, never scored.
export function scoreboard(claimed=[]){
 const m=meterState(claimed),office=values.filter(v=>v.relation==='office'&&claimed.includes(v.id));
 const costs={people:0,planet:0,fairness:0};for(const v of office)for(const c of v.cost)costs[c]++;
 const against=office.map(v=>({id:v.id,label:v.label,cost:v.cost,against:values.find(x=>x.id===v.against).label}));
 const kind=!m.score&&!m.office?'empty':m.score>m.office?'remote':m.score===m.office?'draw':'office';
 const s=(n,one,many)=>`${n} ${n===1?one:many}`;
 const lead={empty:'Nothing chosen yet. Pick the values you would put your name to.',
  remote:m.office?`Remote work comes out on top, ${m.score} to ${m.office}. You also backed ${s(m.office,'commercial priority','commercial priorities')}, and each one costs something.`:`Remote work comes out on top, ${m.score} to 0. Everything you chose is something people, places or the planet gain.`,
  draw:`A draw, ${m.score} all. Every point on the office side came from a commercial priority, and each one costs something.`,
  office:`The office comes out on top, ${m.office} to ${m.score}. Look at how: every point on the office side came from a commercial priority, and each one costs people, the planet or fairness.`}[kind];
 return {remote:m.score,office:m.office,conditions:m.condition,max:m.max,officeMax:values.filter(v=>v.relation==='office').length,costs,against,kind,lead};
}

export const annualTime=({days=3,minutes=30,weeks=46}={})=>{
 const b=(x,lo,hi)=>Math.min(hi,Math.max(lo,Number.isFinite(Number(x))?Number(x):lo));
 const d=b(days,0,5),m=b(minutes,0,180),w=b(weeks,0,52);
 return {hours:d*m*2*w/60,workdays:d*m*2*w/480,days:d,minutes:m,weeks:w};
};
export function groupDistance({workers=100,days=3,km=20,extraKm=0}={}){
 const b=(x,lo,hi)=>Math.min(hi,Math.max(lo,Number.isFinite(Number(x))?Number(x):lo));
 const w=b(workers,1,10000),d=b(days,0,5),k=b(km,0,200),e=b(extraKm,0,2000);
 return {avoided:w*d*k*2,net:w*(d*k*2-e)};
}
export const carbonBands=[
 {days:[0,0],label:'All days on site',text:'The baseline in the model.'},
 {days:[1,1],label:'1 day at home',text:'About 2% lower work-related footprint. Extra trips and home energy cancel most of the gain.'},
 {days:[2,4],label:'2–4 days at home',text:'About 11–29% lower in the model.'},
 {days:[5,5],label:'Fully remote',text:'About 54% lower for the model’s fully remote baseline (up to 58% across scenarios), mostly from less office energy.'}
];
export const bandFor=days=>carbonBands.find(b=>days>=b.days[0]&&days<=b.days[1])||carbonBands[0];
export function payScenario({discount=30,equal=false}={}){
 const reference=60000,d=Number.isFinite(Number(discount))?Math.min(50,Math.max(0,Number(discount))):0;
 const b=equal?reference:reference*(1-d/100);
 return {reference,b,gap:reference-b,discount:d};
}

export const rooms = [
 {id:'hub',number:'00',name:'The Station',kicker:'Arrival · 08:12',theme:'hub',radius:13,
  title:'This is where the day used to begin.',
  intro:'A platform, a timetable and a crowd all going the same way. Now the station is a crossroads. Each door opens onto one part of the argument that remote work can be more than a perk: a public good. Walk in, look around, pick up the things you value and watch the meter.',
  exhibits:[
   {id:'howto',title:'How to explore',badge:'Illustration',prop:'sign',body:'Drag to look around. Walk with W A S D or the arrow keys, or click the floor. Click anything that glows to inspect it. Step through a doorway, or use “Rooms”, to travel. Everything is also reachable from the “In this room” list, and the full text is in the reading guide below the experience.'},
   {id:'asks',title:'Two proposals',badge:'Proposal',prop:'monolith',body:'This experience argues for two things. First, a right to choose remote work wherever tasks allow, with employers explaining when attendance is needed. Second, no residence-only pay discounts for comparable work. Everything else here explains why, what it could achieve, what could go wrong and how to guard against it.',asks:true},
   {id:'meter',title:'The meter',badge:'Illustration',prop:'column',body:'Glowing crystals are things people value. Click one to read what it means, then click it again to add it to your journey. The meter rises when remote work can help provide them; striped segments need good design to deliver. Some values pull the other way, and the meter shows those honestly too. It measures your own priorities, not a forecast for the world.'}
  ],
  next:'commute'},
 {id:'commute',number:'01',name:'The Commute',kicker:'01 · The daily journey',theme:'commute',radius:11,
  title:'What if work stopped deciding where life happens?',
  intro:'For work that travels through a cable, moving a body across a city should need a reason. Every compulsory journey spends time, road space, energy and land.',
  exhibits:[
   {id:'clock',title:'The commute clock',badge:'Illustration',prop:'clock',widget:'clock',body:'How much of your year goes on getting to work? Set your own commute. The arithmetic stays on this page and nothing is sent anywhere.'},
   {id:'turnstile',title:'Presence is a clue, not a result',badge:'Reasoning',prop:'turnstile',body:'A badge swipe proves someone arrived. It says nothing about whether they did good work, helped a colleague or solved the problem. Judge the work instead: agreed outcomes, quality, and the mentoring and care that simple output counts miss. That means better judgement, not more surveillance.'},
   {id:'burden',title:'Who should have to explain?',badge:'Proposal',prop:'sign',body:'Some work needs a place: a ward, a lab, a workshop, a secure room. Habit, managerial comfort and a long office lease do not. We propose flipping the default: where the tasks allow it, workers can choose remote work, and employers explain when attendance is needed. Purposeful days together still happen; they just need a reason.'},
   {id:'trial',title:'What a real trial found',badge:'Measured',prop:'bars',body:'At Trip.com, 1,612 graduate employees were randomly offered two home days a week. Resignations fell by about a third, from 7.2% to 4.8%. Performance reviews and promotions showed no detectable difference over two years. The biggest drops in quitting were among women, non-managers and people with long commutes.',limits:'One employer and a hybrid schedule. Interns and new starters on probation were excluded because on-site learning matters most for them.',sources:['nature-trip-hybrid-2024']}
  ],
  next:'climate'},
 {id:'climate',number:'02',name:'The Lighter Footprint',kicker:'02 · Environment · land · energy',theme:'climate',radius:11,
  title:'The greenest commute is the one we don’t need.',
  intro:'Skip a car journey and you skip its fuel, exhaust, tyre dust and noise all at once. The bigger prize is building less of the world around the rush hour.',
  exhibits:[
   {id:'road',title:'The morning road',badge:'Illustration',prop:'car',widget:'road',body:'Set how many days a week people work remotely and watch the road. Then try the arithmetic for a group of drivers, including extra driving that eats into the saving.'},
   {id:'gradient',title:'How many days make a difference?',badge:'Modelled',prop:'bars',widget:'gradient',body:'A US carbon-accounting model compared work-related footprints by schedule. One day at home cut about 2%. Two to four days cut about 11–29%. A fully remote baseline came out about 54% lower, mostly from less office energy.',limits:'A model, not an observed effect. The studied company sits in a large city with reasonable transit. Commute mode, other trips, home energy and office use all change the answer.',sources:['pnas-carbon-2023']},
   {id:'rebound',title:'The rebound scale',badge:'Reasoning',prop:'scale',body:'Some savings leak away through extra errands, a heated home office, a bigger house or more flights. A leak doesn’t empty the bucket, though. The question is always the net: what is avoided minus what is added. Compact places, efficient buildings and sensible travel keep it positive.',limits:'Rebound can’t be assumed small. It has to be measured.'},
   {id:'land',title:'Land we could give back',badge:'Proposal',prop:'tree',body:'Fewer cars parked all day and fewer half-empty offices free up land in the middle of towns. That land could hold shade, trees, play space or homes, but only if someone decides to use it that way.'}
  ],
  next:'commons'},
 {id:'commons',number:'03',name:'The Everyday Commons',kicker:'03 · Community · care · shared space',theme:'commons',radius:11,
  title:'Give the neighbourhood its weekdays back.',
  intro:'A street is more than a place to sleep when people are around in the daytime. Time not spent travelling can become a school pickup, lunch with a parent, an hour at the allotment, or, if we are careless, just more work.',
  exhibits:[
   {id:'pie',title:'Where the saved time goes',badge:'Measured',prop:'pie',body:'A survey across 27 countries estimated about 72 minutes saved on each home-working day. On average, roughly 40% went back into work, about a third into leisure and about a tenth into caring for others.',limits:'Averages across countries and people. Nobody is guaranteed the time, or control over how it is used.',sources:['nber-time-savings-wfh']},
   {id:'alone',title:'The honest warning',badge:'Measured',prop:'bench',body:'A 2026 study of US workers found that people in jobs that could go remote spent about an extra hour alone each workday after the pandemic, with worse distress and more mental-health care and antidepressant prescriptions. The effects were concentrated among people living alone. This is the strongest evidence against careless remote work, and it belongs in the room.',limits:'The study compares occupations, not individual schedules, and does not test whether hubs or team days fix the problem. Those are proposals that still need checking.',sources:['science-isolation-2026']},
   {id:'highstreet',title:'A high street beyond lunchtime',badge:'Modelled',prop:'cafe',body:'A model for England and Wales found that when commuting falls, local service spending shifts out of a few city-centre neighbourhoods and spreads across many residential ones. It is a redistribution, not new money, and the least affluent areas gain least.',limits:'The model assumes people want to spend the same and doesn’t model moving house.',sources:['economica-local-spending']},
   {id:'care',title:'Care has limits',badge:'Reasoning',prop:'house',body:'Being near home helps families juggle care, but working at home is not childcare and is no substitute for paid care or proper leave. If saved time silently becomes extra unpaid work, especially for women, the gain is lost. Protect boundaries as carefully as flexibility.'}
  ],
  next:'village'},
 {id:'village',number:'04',name:'The Living Village',kicker:'04 · Heritage · livelihoods · belonging',theme:'village',radius:11,
  title:'Keep a way of life alive, not just its buildings.',
  intro:'A village can lose its school, shop or bus long before its last resident leaves. Income earned elsewhere could keep that everyday demand alive, if the people who already live there can stay.',
  exhibits:[
   {id:'lights',title:'Weekday lights',badge:'Illustration',prop:'house',widget:'lights',body:'Switch between a commuter village and a village where people work locally, and watch which windows stay lit at midday. Every place has its own threshold for keeping a shop or school open; this shows the idea, not a number.'},
   {id:'livelihoods',title:'Outside income, local livelihoods',badge:'Proposal',prop:'crate',body:'Remote earnings could sit alongside farming, fishing, craft and repair rather than replace them. Young people might stay, relatives might return, and older residents could keep support nearby. Year-round residents matter more than tourist turnover.',limits:'No multiplier or service threshold is established by the programmes cited here. This is a possibility to test with local measures.'},
   {id:'first',title:'What should come first?',badge:'Proposal',prop:'sign',widget:'village',body:'A village wants new residents. What should it do first? Choose, and see the trade-off.'},
   {id:'programmes',title:'Who is already trying',badge:'Programme',prop:'frame',body:'In Spain, Holapueblo asks participating towns to identify at least two available rental homes. The Welcoming Villages network checks remote-work conditions and gives each town a local host. Both show that welcome can be planned.',limits:'Entry conditions are not evidence of affordability, lasting settlement or service survival.',sources:['es-holapueblo-town-entry','es-welcoming-villages']}
  ],
  next:'access'},
 {id:'access',number:'05',name:'An Open Door',kicker:'05 · Inclusion · fairness · participation',theme:'access',radius:11,
  title:'Opportunity should travel further than people have to.',
  intro:'A long commute is a filter. It quietly screens out people who can’t drive, can’t stand on a train for an hour, care for someone or live too far from where the jobs cluster.',
  exhibits:[
   {id:'barriers',title:'The barriers a commute adds',badge:'Reasoning',prop:'door',body:'Disability, chronic illness, caring duties, rural distance and not owning a car can each turn a reachable job into an impossible one. Removing the daily journey removes one barrier. The effect is individual: for some people, an accessible shared workspace nearby works better than home. Choice matters more than a blanket rule.'},
   {id:'gap',title:'The connection gap',badge:'Measured',prop:'tower',body:'In 2024 about 83% of urban residents and 48% of rural residents used the Internet worldwide, according to the ITU. In high-income countries the gap is much smaller. Remote opportunity depends on infrastructure that many places still lack.',limits:'Internet use is not the same as speed, reliability or affordability.',sources:['itu-rural-digital-divide']},
   {id:'onsite',title:'Two classes of worker?',badge:'Proposal',prop:'bus',body:'Sam is a nurse and will always work on site. Remote work doesn’t help Sam directly, but its public gains can: fewer cars on Sam’s route, freed land for homes near the hospital, money for an all-day bus. Sharing those gains is part of the deal, not an afterthought.'},
   {id:'hub',title:'A desk for everyone',badge:'Programme',prop:'desk',body:'Ireland’s Connected Hubs network lets people book desks and meeting rooms in local hubs run by community, public and private owners. A well-connected shared space can give people a fast line, a quiet room and company, with no spare room needed.',limits:'Hub programmes describe infrastructure, not proof of lasting employment gains.',sources:['ie-connected-hubs','ie-our-rural-future']}
  ],
  next:'postcode'},
 {id:'postcode',number:'06',name:'Beyond the Postcode',kicker:'06 · Fair pay · global opportunity',theme:'postcode',radius:11,
  title:'Equal work. Equal pay. Wherever you live.',
  intro:'If you can do the job from anywhere, should your address set your salary? We think the same work for the same employer deserves the same pay band.',
  exhibits:[
   {id:'scale',title:'The pay scale',badge:'Illustration',prop:'scale',widget:'pay',body:'Two people do the same job for the same employer at the same level. Worker A lives near the office; Worker B lives in another community. Set a residence discount, then apply the rule.'},
   {id:'rule',title:'The rule',badge:'Proposal',prop:'monolith',body:'Prohibit residence-only base-pay discounts for comparable work in the same employer-market pay band. Differences in responsibility, experience, hours or contribution can still be explained and paid for. An address alone can’t.',limits:'This is our proposal, not current law. The EU Pay Transparency Directive (2023/970) requires pay transparency for equal pay between women and men. It is useful context for pay bands, but it does not establish this rule.',sources:['eu-pay-transparency-2023']},
   {id:'homes',title:'Better pay needs affordable homes',badge:'Reasoning',prop:'house',body:'Equal pay can give newcomers more spending power in places with cheaper, scarcer homes. That makes resident housing protection more important, not less. Fair wages and affordable homes are joint goals; paying newcomers less is not a housing policy.'},
   {id:'hard',title:'The hard parts',badge:'Proposal',prop:'crate',body:'A multinational needs a declared reference market and a way to challenge sneaky changes to it. The rule needs protection against relabelling comparable roles or outsourcing them just to dodge it. Taxes, social protection, work permits and statutory benefits still follow local law.'}
  ],
  next:'places'},
 {id:'places',number:'07',name:'Already Taking Shape',kicker:'07 · A gallery of real places',theme:'places',radius:11,
  title:'The future has precedents.',
  intro:'None of this is science fiction. Governments and towns already treat remote work and nearby services as civic infrastructure. Their programmes are worth learning from, and worth checking.',
  exhibits:'cases',
  next:'commonstead'},
 {id:'commonstead',number:'08',name:'Commonstead',kicker:'08 · An invented community · a design proposal',theme:'commonstead',radius:11,
  title:'A Commonstead: villages organised so people can stay.',
  intro:'A Commonstead is our name for a group of existing villages and a small market town that plan together around remote work. A rail line and an all-day bus link them. Homes are held for the people who live there, empty buildings come back into use, and a shared work hub offers desks, a fast connection and daytime company. Residents decide how it grows. This one is invented for the exhibit: a design proposal, not a real place or a proven model.',
  exhibits:[
   {id:'what',title:'What is a Commonstead?',badge:'Proposal',prop:'sign',entrance:true,body:'The name joins “common” and “homestead”: a home place that people hold and run together. It isn’t a new town in a field. It takes places that already exist and gives them what they need, so people can stay, work and belong without a daily commute.',
    points:[['Existing places.','A few villages and a market town, linked by rail and an all-day bus.'],['Homes held for residents.','A community housing trust secures homes for people who live and work there. Empty homes are restored before anyone is recruited.'],['A public work hub.','Desks, meeting rooms, a fast connection and company, open to local young people and on-site workers as well as remote workers.'],['Daily needs close by.','Shops, school, green space and services within reach on foot or by bus, so weekday life stays local.'],['Residents in charge.','Residents govern the growth plan, and growth pauses if rents or services come under strain.']],
    limits:'Invented for this exhibit. No Commonstead exists, and nothing here has been costed or tested. The real programmes in the previous room show parts of the idea in practice.'},
   {id:'model',title:'What should Commonstead fund first?',badge:'Proposal',prop:'table',widget:'invest',body:'Delivery capacity is limited. Choose the first big investment and see what has to wait. These are qualitative priorities, not a costed budget.'},
   {id:'safeguards',title:'Keep the safeguards',badge:'Proposal',prop:'shield',widget:'safeguards',body:'Three safeguards stay goals even when delivery is phased. Remove one to see the risk it leaves open.'},
   {id:'phases',title:'From drawing to community',badge:'Proposal',prop:'steps',widget:'phases',body:'Four phases, each with a check before the next one starts.'},
   {id:'who',title:'Who decides and who gains',badge:'Proposal',prop:'monolith',body:'Residents govern the growth plan, with newcomers and local workers represented. A community housing trust secures homes for existing residents and essential workers. Broadband and workspaces serve local young people too. Procurement includes local repairers and craftspeople. Employers who join are asked to publish location-independent pay bands.'}
  ],
  next:'hall'},
 {id:'hall',number:'09',name:'The Great Hall',kicker:'09 · Ten objections',theme:'hall',radius:23,
  title:'A strong case can take a challenge.',
  intro:'Ten of the best objections to remote work, each in its own alcove. Hear the objection, a human reply and what the evidence says. Then decide where you land.',
  exhibits:'objections',
  next:'charter'},
 {id:'charter',number:'10',name:'The Charter Room',kicker:'10 · What would you ask for?',theme:'charter',radius:10,
  title:'Turn what you value into what you ask for.',
  intro:'Here is what you picked up on the way, and what it adds up to. Open your charter board to see every value side by side, change your mind, and see what the office would ask you to give up. Then choose the requests you would take to an employer, a council or a legislator. Your choices stay on this page unless you download them.',
  exhibits:[
   {id:'summary',title:'Your journey',badge:'Illustration',prop:'column',widget:'summary',body:'The values you collected, where you landed in the Great Hall and the choices you made.'},
   {id:'charter',title:'Your charter',badge:'Proposal',prop:'monolith',widget:'charter',body:'Every value on one board, by category, with a scoreboard: remote work against the office. Add or take away anything, read the case for each, then choose your asks.'}
  ],
  next:'hub'}
];
export const order = rooms.map(r=>r.id);

// Pictures hung in the rooms. Each names a slot from rooms.mjs artSlots, a file in this folder (listed in the
// registry assets), its width/height ratio, a title, a caption, alt text for people who cannot see it, and a credit.
// P025: the credit is a provenance record only; neither the caption nor the credit says how a picture was made on the page.
// All pictures are illustrations: none is a photograph of a real place or person unless its caption says so.
// P023: the Operator's 31-picture set was generated with the image tool in Codex. commonstead-1..4 and the five earlier
// ChatGPT versions (commute-4, commons-3, commons-4, village-3, postcode-3) were made in ChatGPT.
const codexArt='Image: the project author, made with OpenAI image generation in Codex',chatgptArt='Image: the project author, made with ChatGPT';
export const wallArt = [
 {id:'hub-mural',room:'hub',slot:'hub-mural',file:'hub-mural.jpg',aspect:3/2,title:'8:12 on a weekday',
  caption:'A weekday morning on a small-town high street: the school run on foot, a nurse cycling to work, neighbours talking over a wall, people at work in a café and an upstairs hub, and a bus with the road almost to itself.',
  alt:'A sunlit high street of stone and brick buildings in early morning. A mother walks a boy and a girl in school uniform along the pavement; a woman in blue scrubs cycles past; two older men chat by a stone wall beside a golden retriever. People work on laptops in a café window on the left and at the upper windows of a brick building on the right. One bus and a few cars use the road. A church spire and a stone railway viaduct with a train stand in the distance.',credit:codexArt},
 {id:'commute-1',room:'commute',slot:'commute-1',file:'commute-1.jpg',aspect:3/2,title:'Two Tuesdays',
  caption:'The same hour, spent two ways: squeezed onto a grey station platform, or at breakfast with her son before the walk to school.',
  alt:'A split picture of the same woman. Left: on a crowded commuter platform at dawn, in a coat and scarf, she looks wearily at her phone as a train waits. Right: at a sunny kitchen table she holds a mug and smiles at her young son eating breakfast, with a closed laptop beside them and a child’s drawing on the wall.',credit:codexArt},
 {id:'commute-2',room:'commute',slot:'commute-2',file:'commute-2.jpg',aspect:3/2,title:'Work that needs a place, and work that doesn’t',
  caption:'Some work needs a place: a nurse at a bedside, a researcher at the bench. Some doesn’t: an illustrator at the kitchen table, a small team planning around a laptop.',
  alt:'Four panels in warm light. Top left: a nurse in blue scrubs smiles at an older man in a hospital bed beside a drip stand. Top right: a scientist in a lab coat and safety glasses uses a pipette over rows of test tubes. Bottom left: a woman sketches in a notebook at a kitchen table with a cat on the chair beside her. Bottom right: three colleagues talk around a wooden table with a blank laptop screen, and a hill town with a bell tower shows through the window.',credit:codexArt},
 {id:'commute-3',room:'commute',slot:'commute-3',file:'commute-3.jpg',aspect:3/2,title:'What the commute takes',
  caption:'Traffic fills the top of the hourglass and runs out as the hours go. Beside it drift the things the time could have held: a birthday, a game of football, the garden, an hour on a bench with a friend.',
  alt:'A large hourglass on a rock above a river valley at sunset. The upper bulb holds a traffic jam of cars, buses and trains, which trickle down as tiny vehicles into a heap at the bottom. To the right, four photographs float away on the breeze: a child blowing out birthday candles, children playing football, a person tending a vegetable garden, and two people on a park bench.',credit:codexArt},
 {id:'commute-4',room:'commute',slot:'commute-4',file:'commute-4.jpg',aspect:3/2,title:'The 7:40, or the desk by the window',
  caption:'The commute he had and the morning he has now: slumped on a packed train into the city, or working by an open window with the dog asleep beside the laptop.',
  alt:'A split picture of the same bearded man. Left: in a suit and tie on a crowded commuter train, head propped on his hand, a work bag on his lap and city towers outside the window. Right: in a casual shirt at a wooden table in a sunny room full of plants, typing on a laptop beside a mug and a notebook, while a golden retriever rests its head on the table and a hill town shows through the window.',credit:chatgptArt},
 {id:'climate-1',room:'climate',slot:'climate-1',file:'climate-1.jpg',aspect:3/2,title:'Parks instead of parking',
  caption:'The same town twice: a multi-storey car park and a full surface lot, then the same land as a park, a playground, a cycle lane and new homes. What fewer daily car trips could free, if someone decides to use the land that way.',
  alt:'A split aerial view of the same riverside town with a church spire. Left: a grey multi-storey car park and a large surface car park full of cars beside a busy road. Right: the same space as a tree-lined park with a playground, lawns and benches, a red cycle lane with cyclists, and new low apartment buildings with balconies and roof gardens, with fewer cars on the road.',credit:codexArt},
 {id:'climate-2',room:'climate',slot:'climate-2',file:'climate-2.jpg',aspect:3/2,title:'The leaky watering can',
  caption:'Most of the water reaches the young tree, but some leaks away on the way: the extra flight, the home heated all day, the deliveries. The question is always the net.',
  alt:'A hand holds a painted metal watering can over a newly planted sapling in a sunny garden. The main spray waters the tree, while three thin drips fall from holes in the bottom of the can, each carrying a tiny object: an aeroplane, a radiator and a delivery van. A stone wall, flowers, a garden bench and a hill village lie behind.',credit:codexArt},
 {id:'commons-1',room:'commons',slot:'commons-1',file:'commons-1.jpg',aspect:3/2,title:'A high street beyond lunchtime',
  caption:'Weekday trade spread across neighbourhoods instead of packed into one centre: the bakery, the bike shop, the bookshop and the greengrocer busy on an ordinary afternoon.',
  alt:'A sunny high street of stone and brick shopfronts with flower boxes: a bakery, a bicycle workshop, a bookshop and a greengrocer with a striped awning. A small child walks with a parent, a woman pushes a pram, a cyclist waves and an older man waves back, and people sit at café tables, one with a laptop. A cat sits in an upstairs window and a church spire rises behind.',credit:codexArt},
 {id:'commons-2',room:'commons',slot:'commons-2',file:'commons-2.jpg',aspect:3/2,title:'Alone, or together',
  caption:'Working alone at the kitchen table, looking across at a lit hub where neighbours work side by side. Isolation is a real risk of careless remote work, and shared places near home are part of the answer.',
  alt:'Evening, seen from behind a man who sits alone at a laptop in a dim kitchen with his chin on his hand. Through the window, across a quiet street, a stone building with large lit windows holds a shared workspace where people work and talk at long tables, one of them in a wheelchair.',credit:codexArt},
 {id:'commons-3',room:'commons',slot:'commons-3',file:'commons-3.jpg',aspect:3/2,title:'Where the hour goes',
  caption:'The hour the commute took, back at the breakfast table: a packed platform on one side, a slow breakfast with her son on the other.',
  alt:'A split picture of the same woman. Left: on a packed station platform at dawn, with city towers and cranes behind, she frowns at her phone among commuters in dark coats. Right: in a sunny kitchen she holds a mug and smiles at her son, who eats fruit in his school jumper; a glass of orange juice, a vase of daisies and a closed laptop sit on the table, and a child’s drawing hangs by the window.',credit:chatgptArt},
 {id:'commons-4',room:'commons',slot:'commons-4',file:'commons-4.jpg',aspect:3/2,title:'Sand into traffic',
  caption:'The hours run down into the traffic jam while the things they could have held blow away like sand: a birthday, a football match, the garden, an afternoon on a bench with a friend.',
  alt:'An hourglass in a wooden frame stands on a stone wall above a lake and a village at sunset. Its upper bulb is packed with cars and buses that pour through the neck into a heap at the bottom. Streams of sand blow out to the right, carrying four photographs: a child blowing out birthday candles, children playing football, a person in a straw hat tending a vegetable garden, and two women talking on a park bench.',credit:chatgptArt},
 {id:'village-1',room:'village',slot:'village-1',file:'village-1.jpg',aspect:3/2,title:'Weekday lights',
  caption:'A hill village lived in on a weekday, not just in August: someone works at a window, the baker serves a neighbour, children play in the square and the bus calls.',
  alt:'A stone hill village in bright sun with mountains and a lake behind. A woman works at a laptop at an upstairs window with green shutters; an older man in a cap sits in a doorway; a baker hands bread to a woman with a shopping bag. A small bus waits in the square by a fountain, where people eat under umbrellas and children run. Olive trees, a bell tower, washing on a line and chickens by a stone wall complete the scene.',credit:codexArt},
 {id:'village-2',room:'village',slot:'village-2',file:'village-2.jpg',aspect:3/2,title:'Beside the old trades',
  caption:'Remote work beside the old trades, not instead of them: the boat comes in with the catch while the old net store has become a workshop and a place to work.',
  alt:'A small stone harbour in golden light. Two fishermen in orange and yellow oilskins unload a crate of fish from a boat, and a girl in wellies sits on a bollard among nets and buoys. Through the open doors of a stone building, people work at laptops at a long table and a potter shapes bowls. A lighthouse and white cottages stand on the headland across the water.',credit:codexArt},
 {id:'village-3',room:'village',slot:'village-3',file:'village-3.jpg',aspect:3/2,title:'A weekday morning, close to home',
  caption:'A small-town street on a working morning: the walk to school, a nurse cycling to her shift, neighbours chatting over a wall, people at work in the café and the hub, and a quiet road with a bus.',
  alt:'An autumn morning on a small-town street of stone and brick. A mother walks a boy and a girl in school uniform with a golden dog beside them; a woman in blue scrubs and a helmet cycles up the road; an older couple talk over a stone wall. People work on laptops in a café on the left and at tables behind the tall windows of a brick building on the right. A bus and two cars come down the quiet road, and a train crosses a viaduct below a hilltop tower.',credit:chatgptArt},
 {id:'access-1',room:'access',slot:'access-1',file:'access-1.jpg',aspect:3/2,title:'An open door',
  caption:'For some people a nearby, step-free workspace works better than home. Choice matters.',
  alt:'People go into a work hub through wide glass doors in an old stone building: a woman in a wheelchair rolls up a gentle ramp with a handrail, an older woman walks with a cane, a man carries a child on his shoulders and a man follows with a guide dog. Inside, people work at tables among plants. A church spire stands down the street.',credit:codexArt},
 {id:'access-2',room:'access',slot:'access-2',file:'access-2.jpg',aspect:3/2,title:'The last mile',
  caption:'Remote opportunity depends on a connection, and many rural places are still waiting for one. An engineer works at a roadside cabinet as the sun sets over the hills.',
  alt:'Sunset over rolling farmland with stone walls and sheep. On a narrow country lane an engineer in a high-visibility jacket kneels at an open green street cabinet full of cables, with a coil of orange cable beside him, his van open with tools, and a traffic cone. A farmhouse stands below and a mast on a far hill.',credit:codexArt},
 {id:'access-3',room:'access',slot:'access-3',file:'access-3.jpg',aspect:3/2,title:'Sam’s morning',
  caption:'Sam is a nurse and will always work on site, but the public gains can still reach her: a quieter road, a cycle lane, homes nearby and a bus that runs all day.',
  alt:'A nurse in blue scrubs and a cardigan, holding a takeaway cup, steps off a bus at a shelter on a sunny morning. Behind her, a planted street with a green cycle lane leads to a large hospital building. A cyclist rides towards it, other staff in scrubs walk along the pavement past terraced houses with solar panels, and only one car is on the road.',credit:codexArt},
 {id:'postcode-1',room:'postcode',slot:'postcode-1',file:'postcode-1.jpg',aspect:3/2,title:'Same work, two addresses',
  caption:'Two people drawing the same plans, one in a city flat and one in a hill village, joined by a single golden thread. Same work, same pay: the equal-pay rule this room proposes.',
  alt:'A split scene joined by a flowing golden ribbon. Left: a man draws architectural plans beside a small building model at a desk in a city apartment, with towers and a river through the window and a dog asleep on the floor. Right: a woman draws the same plans beside an identical model at a wooden table in a stone house with a wood stove, a hill village outside and a cat curled on a chair.',credit:codexArt},
 {id:'postcode-2',room:'postcode',slot:'postcode-2',file:'postcode-2.jpg',aspect:3/2,title:'Homes held for the people who live here',
  caption:'Old terraced houses restored and lived in: a builder on the scaffolding, newcomers carrying boxes, a long-time neighbour on her doorstep. Fair pay and affordable homes are joint goals.',
  alt:'A sunny street of stone terraced houses. An older woman sits on her front step with a mug, smiling at a young couple carrying a cardboard box. A builder waves from scaffolding on the house next door, and further along a family unloads a van and a bicycle while a child and a dog watch. A church spire and green hills lie behind.',credit:codexArt},
 {id:'postcode-3',room:'postcode',slot:'postcode-3',file:'postcode-3.jpg',aspect:3/2,title:'Work that can travel',
  caption:'The nurse and the lab scientist have to be there. The illustrator and the planning meeting, with a colleague joining on screen, could be anywhere, and for that work the address shouldn’t set the pay.',
  alt:'Four panels in warm evening light. Top left: a nurse in blue scrubs leans over an older man in a hospital bed beside a drip stand and monitor. Top right: a scientist in safety glasses and blue gloves uses a pipette over a rack of test tubes. Bottom left: a woman sketches plants in a notebook at a kitchen table while a cat sits on the chair beside her. Bottom right: three people meet around a wooden table, smiling at a colleague who joins by video on a laptop, with a hill town and an old tower through the window.',credit:chatgptArt},
 {id:'places-1',room:'places',slot:'places-1',file:'places-1.jpg',aspect:3/2,title:'A town-centre hub',
  caption:'An old building on a market square reused as a place to work. It shows the kind of building many town-centre programmes reuse; it is not one of the programmes in this room.',
  alt:'A rain-washed market square in a small town. A grand old stone building with columns and tall arched windows now holds desks and people working under warm lights. In front, a woman pushes a buggy, an older woman sits on a bench, a farmer walks a sheepdog and a man with a satchel passes bicycle racks; market stalls sell produce, and a church spire rises behind.',credit:codexArt},
 {id:'places-2',room:'places',slot:'places-2',file:'places-2.jpg',aspect:3/2,title:'The welcome',
  caption:'A neighbour hands over the keys and the street says hello. It shows the hosting and housing that village-welcome programmes plan for; it is not a real programme.',
  alt:'A whitewashed hillside village street. An older woman in an apron hands a key to a young couple with backpacks and a toddler holding a toy rabbit, while a neighbour waves from an upstairs window and a cat sits on the step. Bougainvillea, potted geraniums, an olive tree and a bell tower above red roofs.',credit:codexArt},
 {id:'places-3',room:'places',slot:'places-3',file:'places-3.jpg',aspect:3/2,title:'Everything within a short walk',
  caption:'A plan of a neighbourhood where the school, clinic, grocer, library, work hub, playgrounds and allotments are a short walk or cycle from every home. It illustrates proximity planning; it is not a real place.',
  alt:'A watercolour plan seen from above. Houses with gardens fill the centre, ringed by footpaths and cycle paths. Around them stand buildings marked with simple symbols: a school (a mortarboard), a clinic (a cross), a grocer (an apple), a library (an open book) and a work hub (a person at a desk), with playgrounds, a pond park and allotments. A road curves past on the right.',credit:codexArt},
 {id:'places-4',room:'places',slot:'places-4',file:'places-4.jpg',aspect:3/2,title:'A region of connected towns',
  caption:'Villages and towns linked by rail and bus, from the hills to a port city on the coast. It illustrates the idea of a region with many centres; it is not a real map.',
  alt:'A painted bird’s-eye map of a green region: hills and forests, a winding river with stone bridges, and many small villages and towns with church towers, linked by a railway with trains and by orange and red bus routes with small buses. The routes lead to a larger harbour city with a lighthouse on a rocky coast.',credit:codexArt},
 {id:'commonstead-1',room:'commonstead',slot:'commonstead-1',file:'commonstead-1.jpg',aspect:4/3,title:'A Commonstead from above',
  caption:'Villages, a market town and the rail line that links them, with the river, farms and allotments kept green in between.',
  alt:'Aerial painting of green countryside with stone villages and a small market town with a church spire, linked by a railway that crosses a river on a stone viaduct. Wetlands, allotments, fields with cattle and wind turbines surround them; in the foreground people cycle past gardens and a glass-walled work building.',credit:'Image: the project author, made with ChatGPT'},
 {id:'commonstead-2',room:'commonstead',slot:'commonstead-2',file:'commonstead-2.jpg',aspect:4/3,title:'The hub on the green',
  caption:'A shared work hub opens onto the village green, where children play and neighbours meet.',
  alt:'A timber-and-glass work hub beside a village green on a sunny evening. People work at laptops inside and at tables outside, children play football with a dog, three older people chat on a stone bench, and a bakery café and a church tower stand behind.',credit:'Image: the project author, made with ChatGPT'},
 {id:'commonstead-3',room:'commonstead',slot:'commonstead-3',file:'commonstead-3.jpg',aspect:4/3,title:'The station square',
  caption:'The market town’s station opens onto a square with a clinic, a market and cafés, so a train journey and the day’s errands share one short walk.',
  alt:'A busy, tree-lined station square in a small town. A train waits at the platform, people walk with suitcases and bicycles, a clinic building shows a cross, market stalls sell produce, people work on laptops in cafés, and green hills rise behind.',credit:'Image: the project author, made with ChatGPT'},
 {id:'commonstead-4',room:'commonstead',slot:'commonstead-4',file:'commonstead-4.jpg',aspect:4/3,title:'Home, hub and garden',
  caption:'Working from home, with the shared hub, the gardens and the train a short walk away.',
  alt:'A woman works on a laptop at a wooden table in a cottage with a wood stove while a child draws on the rug and a dog sleeps. Through the open door are a shared work pavilion, community vegetable gardens, people walking, and a train crossing a viaduct in the distance.',credit:'Image: the project author, made with ChatGPT'},
 {id:'commonstead-5',room:'commonstead',slot:'commonstead-5',file:'commonstead-5.jpg',aspect:3/2,title:'The Commonstead plan',
  caption:'Four villages and a market town, linked by the railway and an all-day bus loop, each village with its own shared hub (the purple roofs). Invented for this exhibit.',
  alt:'A watercolour plan seen from above. A market town with a church and a station sits in the middle on a railway line. Around it, four villages each have a building with a purple roof. An orange bus loop with small buses links all five and crosses a river; fields, woods, lakes and dashed boundary lines fill the countryside between.',credit:codexArt},
 {id:'commonstead-6',room:'commonstead',slot:'commonstead-6',file:'commonstead-6.jpg',aspect:3/2,title:'Inside the work hub',
  caption:'A cut-away of the shared hub: desks, quiet booths and a meeting room upstairs; a café, a step-free entrance and a lounge where older residents meet downstairs; the bus stops outside.',
  alt:'A cut-away drawing of a two-storey stone building at sunset. Upstairs, people work at desks, in two glass phone booths and around a meeting table. Downstairs, a woman in a wheelchair comes in by a ramp, a barista serves at a café counter and older people talk in a lounge. A green bus waits at a stop outside, bicycles stand in racks and a church tower rises behind.',credit:codexArt},
 {id:'commonstead-7',room:'commonstead',slot:'commonstead-7',file:'commonstead-7.jpg',aspect:3/2,title:'Residents decide',
  caption:'Neighbours of every age gather round a model of the village to argue over the plan. The growth plan belongs to the people who live there.',
  alt:'An evening meeting in a timber-beamed village hall. About a dozen residents of different ages sit around a large table holding a detailed model of the village, with sticky notes, notebooks and mugs. A woman leans in and points at the model while an older man listens with folded arms. A noticeboard with pictures and coloured notes hangs behind, and a nurse arrives through the doorway.',credit:codexArt},
 {id:'commonstead-8',room:'commonstead',slot:'commonstead-8',file:'commonstead-8.jpg',aspect:3/2,title:'From drawing to community',
  caption:'Four steps along one street: survey the empty homes, restore them and bring in the connection, welcome the first newcomers, then share a table. Each phase has a check before the next one starts.',
  alt:'Four tall panels of the same stone terraced street with a church spire. First, people with a clipboard survey empty, overgrown houses. Second, builders work on scaffolding and an engineer connects cables in a green street cabinet. Third, newcomers with suitcases and boxes are greeted by neighbours, a child and a dog, with a bus behind. Fourth, residents of all ages, including a wheelchair user, share a meal at a long street table under bunting.',credit:codexArt},
 {id:'hall-1',room:'hall',slot:'hall-1',file:'hall-1.jpg',aspect:1,title:'Weighing the case',
  caption:'Neighbours hear a case out, some of them unconvinced, under a carving of the scales. A strong case can take a challenge.',
  alt:'A faded fresco of a group in a stone courtyard under a large tree. A woman at the centre speaks with open hands. Around her some listen and some stand with arms folded: a baker in an apron, a farmer in a cap, a nurse with a stethoscope, an older woman in a wheelchair, a seated man, a teenager and a woman seen from behind, with a dog at their feet. A carving of balance scales is set into the wall behind.',credit:codexArt},
 {id:'hall-2',room:'hall',slot:'hall-2',file:'hall-2.jpg',aspect:1,title:'Company by design',
  caption:'An older craftswoman teaches a younger one in a shared workshop. Isolation and lost mentoring are real; shared places and planned time together are part of the answer.',
  alt:'A faded fresco of a busy shared workshop with arched windows over a hill town. In front, an older grey-haired woman carves a pattern into a stone bowl while a young woman rests her chin on her hand and watches closely. Behind them a stone carver works, colleagues talk at a table, one of them in a wheelchair, and two women share coffee.',credit:codexArt},
 {id:'hall-3',room:'hall',slot:'hall-3',file:'hall-3.jpg',aspect:1,title:'Light along the lanes',
  caption:'A line of light runs along the country lanes from farm to farm. Only people with a connection can join in, so the connection is part of the case.',
  alt:'A faded fresco of farmland at sunset. A glowing line runs along winding lanes, linking stone farmhouses with lit windows to a small town and a church beside a lake. In the foreground an engineer in a high-visibility vest takes cable from a white van beside a stone wall, and cows graze in a field.',credit:codexArt},
 {id:'hall-4',room:'hall',slot:'hall-4',file:'hall-4.jpg',aspect:1,title:'A town centre at midday',
  caption:'Market stalls, café tables and a tram in a busy square at lunchtime. Centres change when commuting falls; they don’t have to empty.',
  alt:'A faded fresco of a sunny town square with a domed bell tower. A pale green tram passes between flower and fruit stalls and café tables under umbrellas. People shop and stroll: a woman buys flowers, a boy in a straw hat holds a sunflower, a man in a wheelchair crosses the square and a dog sleeps by the café tables.',credit:codexArt},
 {id:'hall-5',room:'hall',slot:'hall-5',file:'hall-5.jpg',aspect:1,title:'Building homes together',
  caption:'Neighbours and newcomers repair an old stone house: shutters, scaffolding, a new beam. Housing protection comes before recruitment, and newcomers can help build it.',
  alt:'A faded fresco of people restoring a stone house with green shutters. A man on a ladder fixes a shutter, an older man hammers at the wall, a woman on scaffolding works with a bucket, a girl carries a pail, and two people carry a long wooden beam past a wheelbarrow of stones. A bell tower and cypress trees stand on the hill behind.',credit:codexArt},
 {id:'charter-1',room:'charter',slot:'charter-1',file:'charter-1.jpg',aspect:2/3,title:'Putting your name to it',
  caption:'A woman signs a long charter while others wait their turn: a cyclist with his helmet, an older woman, a nurse, a father holding his baby.',
  alt:'In a sunlit room with tall arched windows and bookshelves, a woman in a green jacket signs a long paper scroll on a polished wooden table with a fountain pen; the writing on the scroll is not legible. Behind her a queue waits: a young man holding a bicycle helmet, an older woman in a scarf, a nurse with a stethoscope and a man carrying a baby. A church spire shows through the window.',credit:codexArt},
 {id:'charter-2',room:'charter',slot:'charter-2',file:'charter-2.jpg',aspect:2/3,title:'Taking the ask to the people who decide',
  caption:'Three ways to make the ask: speak at the council meeting, raise it with your employer, write to your representative.',
  alt:'Three stacked panels. Top: a woman stands at a microphone addressing three councillors seated at a wooden bench while residents listen. Middle: a woman talks with a man across a small café table with coffee cups and a notebook. Bottom: a hand posts a letter into a red postbox on a village street with hanging flower baskets and a church spire.',credit:codexArt},
 {id:'charter-3',room:'charter',slot:'charter-3',file:'charter-3.jpg',aspect:2/3,title:'The street we asked for',
  caption:'Evening on the street the charter asks for: a nurse cycling home, a hub with lit windows, a bus at the stop, neighbours on a bench and children chalking the pavement.',
  alt:'A hillside village street at sunset. A smiling nurse in blue scrubs rides a bicycle with a basket. Through the large windows of a ground-floor hub people work at laptops, and an older woman leans from a balcony full of flowers. A blue bus waits at a shelter, an older couple sit on a bench with a dog, and two children draw a sun and a heart in chalk on the pavement. A hill town with a tower glows on the ridge.',credit:codexArt}
];
export const artIn = room => wallArt.filter(a=>a.room===room);
export const artShape = a => a.aspect<.9?'portrait':a.aspect<1.2?'square':'landscape';
// Width and height attributes for a picture, so a page knows its shape before the file loads.
export const artDims = a => {const w=a.aspect>=1?1280:Math.round(1280*a.aspect);return `width="${w}" height="${Math.round(w/a.aspect)}"`;};

export const villageChoices = [
 {id:'recruit',label:'Recruit newcomers now',outcome:'Demand arrives before homes do. Rents rise, a young family leaves, and the shop gains customers but loses staff. The village grows, but not for the people who were already there.'},
 {id:'homes',label:'Protect and restore homes first',outcome:'Empty homes are restored and tenancies secured before anyone is invited. Growth is slower and the shop may need help in the meantime, but residents stay and newcomers join a living place.',recommended:true},
 {id:'pilot',label:'A small, resident-approved pilot',outcome:'A handful of households arrive under a plan residents agreed, with a pause rule if rents or services strain. It is slower to scale, but easier to correct.'}
];
export const investmentPlans = [
 {id:'homes',title:'Homes first',gain:'Restore vacant homes and secure tenancies before inviting growth.',wait:'Recruitment and the full hub wait. Shops may need interim support while demand grows slowly.',check:'Are existing residents staying, and are restored homes affordable and lived in year-round?'},
 {id:'hub',title:'Work hub first',gain:'Shared workspace, a fast connection and daytime company for existing residents, quickly.',wait:'Housing protection and the bus still need funding. Keep arrival incentives paused until those gaps close.',check:'Who can reach and afford the hub, who uses it, and do isolation and access improve?'},
 {id:'transit',title:'Connections first',gain:'An all-day bus supports on-site workers, care trips and regional services.',wait:'A running cost every year, using money that could open the hub or restore homes sooner.',check:'Can essential workers reach their shifts, and can the service be funded beyond a pilot?'}
];
export const safeguards = [
 {id:'housing',label:'Protect resident housing and reuse empty homes',risk:'Arrival incentives without housing protection can displace residents.'},
 {id:'green',label:'Compact growth, green space and all-day transit',risk:'Car-dependent growth can erase the environmental gains.'},
 {id:'hub',label:'An accessible public work hub',risk:'Home-only working excludes people without suitable space and leaves people alone.'}
];
export const phases = [
 {title:'Listen and measure',body:'Map empty homes, resident needs, connection gaps, service capacity and actual travel. Give residents a real say.',check:'Housing costs, vacancies, all-day service access and local spending are recorded.'},
 {title:'Make staying possible',body:'Restore homes, fund broadband and open a shared hub. Local residents use the opportunity first.',check:'Existing households stay, and restored homes are occupied year-round.'},
 {title:'Connect and invite carefully',body:'Improve regional transport and invite returning residents and long-term households within proven capacity.',check:'Service waiting times, school numbers and resident-reported displacement are tracked.'},
 {title:'Learn before growing',body:'Expand only if wellbeing, affordability and the net environmental footprint improve. Pause incentives if rents or service strain rise. Publish failures as well as successes.',check:'Residents review comparable before-and-after data.'}
];

export const objections = [
 {id:'mentoring',title:'People learn by being together.',
  skeptic:'I learned my job by overhearing how the seniors handled problems. A new starter on a video call never gets that.',
  reply:'That’s real, and I wouldn’t pretend otherwise. But most offices never planned that learning. They hoped it would happen near the coffee machine, and plenty of people never got it there either. If juniors need time near experienced colleagues, schedule it, protect the mentors’ time and check that it works. That is a case for purposeful days together, not for everyone commuting five days a week.',
  evidence:{badge:'Measured',text:'At one large firm, sitting near teammates increased code-review feedback by 18.3% and improved code quality, with the benefit going mostly to younger and newer engineers. Senior engineers wrote less code while they mentored. The Trip.com trial excluded interns and probationary staff because on-site learning matters for them.',limits:'One firm’s engineers, and not randomised by location. No study here tests a well-designed remote mentoring programme.',sources:['qje-proximity-mentorship','nature-trip-hybrid-2024','nature-remote-collaboration']},
  settle:'Compare feedback, skill growth and mentor time across remote, hybrid and office set-ups, by role and seniority.',
  verdict:'Fund mentoring on purpose and bring people together when learning needs it. A learning need doesn’t justify daily attendance for every role.'},
 {id:'isolation',title:'Remote means lonely.',
  skeptic:'Working from home sounds lovely until you realise you haven’t spoken to anyone since Tuesday.',
  reply:'Plenty of people know that feeling, and the research says it isn’t just a feeling. But the choice isn’t “office or loneliness”. A shared space down the road, a team that meets on purpose and a hard stop at six are all design choices. If remote work becomes a right, looking after people’s social lives has to come with it, especially for those who live alone.',
  evidence:{badge:'Measured',text:'A 2026 study of five US surveys (588,322 workers) found people in remote-capable jobs spent about an extra hour alone per workday after the pandemic, with worse distress and more mental-health care and antidepressant prescriptions. Effects were concentrated among people living alone.',limits:'Compares occupations rather than individual schedules. It does not test hubs or other fixes.',sources:['science-isolation-2026','ie-connected-hubs']},
  settle:'Test optional hubs and protected social time against a baseline, and measure isolation and mental health, especially for people living alone.',
  verdict:'Keep the choice and build social connection into it. Isolation is a design problem with real stakes, not proof that everyone must commute.'},
 {id:'equity',title:'It’s a perk for laptop workers.',
  skeptic:'This is great for people with laptops. The nurse, the bus driver and the warehouse picker still have to show up.',
  reply:'True, and they always will. But someone having to climb a power pole doesn’t mean an analyst should sit in traffic. The fair answer isn’t to make everyone carry the same burden. It is to drop the burden where it isn’t needed and put some of what we save, in road space, emissions and public money, into making on-site jobs better: reliable buses, affordable homes near work, decent shifts.',
  evidence:{badge:'Measured',text:'In the Trip.com trial the biggest drops in quitting were among women, non-managers and long commuters. The ILO documents large differences in which jobs and places can support home working.',limits:'One employer’s graduates. Remote access does not fix unequal pay, housing or services for on-site workers on its own.',sources:['nature-trip-hybrid-2024','ilo-work-from-home']},
  settle:'Track who can work remotely, and retention, pay and conditions by occupation, income, gender, disability and commute, including whether public gains reach on-site workers.',
  verdict:'Extend remote choice where tasks allow, and put the public gains into transport, homes and conditions for people who must be on site.'},
 {id:'rebound',title:'The green savings are a myth.',
  skeptic:'People who work from home just drive somewhere else, heat the whole house all day and fly more. The savings vanish.',
  reply:'Some of the saving leaks away; you’d expect that. But a leak isn’t an empty bucket. The question is the net: what’s avoided minus what’s added. The details matter too. One day a week at home barely changes anything, while a properly remote week, an efficient home and less office space can. So measure it honestly and design for the bigger version.',
  evidence:{badge:'Modelled',text:'In a US carbon-accounting model, one home day cut the work-related footprint by about 2%, two to four days by 11–29%, and a fully remote baseline by about 54% (up to 58% across scenarios).',limits:'A model, not an observed effect. The studied company is in a large city with reasonable transit.',sources:['pnas-carbon-2023','nordregio-remote-work-2024']},
  settle:'Measure commute and other travel, home and office energy, and office space against a comparable baseline.',
  verdict:'Go for the net saving: meaningful remote schedules, efficient buildings and less office space. Measure the rebound instead of assuming it away.'},
 {id:'transit',title:'Empty centres kill shops and transit.',
  skeptic:'Empty office districts kill the sandwich shops, and the train fares that keep transit running.',
  reply:'Some city-centre businesses do lose out, and they deserve help adapting. But people don’t stop eating lunch when they stop commuting; they buy it somewhere else, often closer to home. And a transit system that only works if everyone is forced onto it at eight in the morning isn’t a healthy one. Fund it for all-day use and for the people who rely on it most.',
  evidence:{badge:'Modelled',text:'A model for England and Wales estimates that 20% less commuting means about 5% less local service spending on average, with losses concentrated in a few city-centre neighbourhoods and gains spread more widely. The least affluent areas gain least.',limits:'Assumes unchanged spending and no house moves. It does not model transit fares.',sources:['economica-local-spending','nordregio-remote-work-2024']},
  settle:'Track local business activity, ridership, fares and access in central and residential areas over time.',
  verdict:'Help places and transport adapt to how people live now. Avoidable commuting shouldn’t be anyone’s permanent subsidy.'},
 {id:'housing',title:'Newcomers price out locals.',
  skeptic:'City salaries arrive in the village, rents double and the young locals leave. We’ve seen this film before.',
  reply:'That fear is reasonable; it has happened in plenty of places. Movement out of cities can ease pressure there while adding it somewhere small. So the receiving place has to come first: restore empty homes, protect tenants and let residents set the pace. Remote work should help people stay as much as it helps people arrive.',
  evidence:{badge:'Measured',text:'The OECD found that housing demand shifted beyond big-city cores in 2020–21, especially to rural areas within commuting range and to smaller cities. Holapueblo asks towns to identify at least two rentals before joining.',limits:'Price patterns don’t isolate remote work as the cause. Programme entry conditions are not evidence of affordability.',sources:['oecd-housing-doughnut','es-holapueblo-town-entry','ie-town-centre-first']},
  settle:'Measure rents, vacancies, housing cost burdens and displacement in both the places people leave and the places they arrive.',
  verdict:'Protect residents’ homes before inviting growth. Fair pay and affordable housing have to travel together.'},
 {id:'nomads',title:'Nomads treat villages as scenery.',
  skeptic:'Digital nomads treat a living village like a film set: a nice backdrop for a few weeks, then gone.',
  reply:'Some will. Others arrive because they love a place and want to be part of it. I’d rather not start from suspicion, but not from naivety either. Let residents set the terms: local hosts, language classes, events people actually want, spending with local businesses. And the bigger prize isn’t short stays at all. It is people being able to stay, or come home, for good.',
  evidence:{badge:'Programme',text:'Madeira’s Ponta do Sol pilot paired a shared workspace with local business and resident involvement. Spain’s Welcoming Villages network gives each town a local host.',limits:'These describe how programmes are designed, not independent evaluations of rents or cultural continuity.',sources:['pt-madeira-program','es-welcoming-villages']},
  settle:'Track year-round occupancy, local participation, money kept locally and affordability, alongside residents’ own views over time.',
  verdict:'Newcomers can add a great deal. Lasting belonging depends on residents’ consent, protected housing and shared institutions.'},
 {id:'digital',title:'Only people with broadband can join.',
  skeptic:'Remote work is for people with fibre broadband and a spare room. Everyone else is locked out.',
  reply:'That’s a fair hit; a lot of homes can’t support it. But it is an argument for building the missing pieces, not for keeping the commute. A well-connected hub in the village hall or the old bank can give people a desk, a fast line and company without anyone needing a spare room. Treat it like a library: shared infrastructure.',
  evidence:{badge:'Measured',text:'The ITU estimates that 83% of urban residents and 48% of rural residents used the Internet in 2024, with a much smaller gap in high-income countries.',limits:'Use isn’t speed, reliability or affordability, and a hub programme doesn’t prove lasting job access.',sources:['itu-rural-digital-divide','ie-connected-hubs','ilo-work-from-home']},
  settle:'Measure broadband and workspace availability, reliability, price and accessibility, then hiring and retention by resident group.',
  verdict:'Build connectivity and shared workspace as public infrastructure, so opportunity doesn’t depend on owning a spare room.'},
 {id:'global',title:'Remote work exports jobs.',
  skeptic:'If the job can be done from anywhere, it can be done from somewhere cheaper. Remote work drags wages down.',
  reply:'Companies already outsource; remote work didn’t invent that. What remote work shouldn’t do is turn your home address into a discount. If two people do comparable work for the same employer, they should sit in the same pay band wherever they live. That keeps the gain with the worker and removes the reason to choose people by postcode.',
  evidence:{badge:'Proposal',text:'Our proposal: no residence-only pay discounts for comparable work in the same employer-market pay band. The EU Pay Transparency Directive requires transparency for equal pay between women and men; it is context, not this rule.',limits:'Untested. Cross-border enforcement, the choice of reference market and relabelled roles all need careful design.',sources:['eu-pay-transparency-2023','ilo-work-from-home']},
  settle:'Define the reference market and the comparable-role test, then watch wages, hiring, outsourcing and enforcement across borders.',
  verdict:'Pay should follow the work, not the postcode. We advocate prohibiting residence-only pay discounts.'},
 {id:'oversight',title:'Oversight, output and security suffer.',
  skeptic:'Out of sight, out of mind. People slack off at home, managers lose track and company data walks out of the door.',
  reply:'Some work really does suffer; the evidence is mixed, not rosy. But a swipe card never told anyone whether the work was good, and a laptop in an office isn’t a security strategy. Set clear outcomes, use proper security controls, and bring people together where the results show it helps. Judge the work, not the chair.',
  evidence:{badge:'Measured',text:'The Trip.com hybrid trial found no detectable difference in performance or promotion. A randomised trial of data-entry work in India found 18% lower productivity at home, two-thirds of it from the first day. The proximity study found more feedback near teammates. NIST guidance supports role-specific security controls.',limits:'Each study covers one setting. Results differ by task and set-up.',sources:['nature-trip-hybrid-2024','nber-india-wfh-productivity','qje-proximity-mentorship','nist-telework-security']},
  settle:'Compare output, quality, learning and security incidents by task under clearly defined remote, hybrid and in-person set-ups.',
  verdict:'Judge work by outcomes and security controls rather than attendance, and bring people together where measured results show it helps.'}
];
export const stances = [['convinced','The reply convinces me'],['unsure','I’m not sure yet'],['objection','The objection still holds']];
export function stanceTally(map={}){const t={convinced:0,unsure:0,objection:0};for(const o of objections){const s=map[o.id];if(s in t)t[s]++;}return t;}

export const charterItems = [
 {id:'remote-choice',text:coreAsk[0],audience:'Employer · legislator',action:'Ask for a task-based attendance policy, protected mentoring and a review of outcomes.'},
 {id:'equal-pay',text:coreAsk[1],audience:'Employer · legislator',action:'Ask for transparent employer-market pay bands and a way to contest residence-only discounts.'},
 {id:'local-hubs',text:'Make accessible shared workspaces and reliable connections available locally.',audience:'Council · community',action:'Map unmet access and social needs before funding a reachable, affordable hub.'},
 {id:'resident-housing',text:'Protect resident housing and services before recruiting new households.',audience:'Council · community',action:'Publish vacancy, affordability and service-capacity checks, with a pause rule for displacement.'},
 {id:'net-footprint',text:'Measure the whole environmental footprint and design to keep the net saving.',audience:'Employer · council',action:'Track travel, building energy and space together, and reuse land and buildings deliberately.'},
 {id:'on-site-fairness',text:'Share the public gains with workers whose jobs require presence.',audience:'Employer · council',action:'Improve on-site conditions and protect affordable homes and all-day transport.'}
];

// Expand rooms whose exhibits are generated from other data, so every consumer sees one shape.
export function roomExhibits(room,cases=[]){
 if(room.exhibits==='cases')return cases.map(c=>({id:'case-'+c.id,title:c.title,badge:'Programme',prop:'frame',body:c.summary,lesson:c.lesson,limits:c.limit,sources:c.sourceIds,photo:/madeira/i.test(c.id)?'ponta':undefined,place:c.location+' · '+c.status}));
 if(room.exhibits==='objections')return objections.flatMap((o,i)=>[
  {id:'obj-'+o.id,objection:o.id,piece:'skeptic',title:o.title,badge:'Reasoning',prop:'pillar',alcove:i},
  {id:'rep-'+o.id,objection:o.id,piece:'reply',title:'A reply',badge:'Reasoning',prop:'lectern',alcove:i},
  {id:'evi-'+o.id,objection:o.id,piece:'evidence',title:'The evidence',badge:o.evidence.badge,prop:'plinth',alcove:i}
 ]);
 return room.exhibits;
}
export const roomById=id=>rooms.find(r=>r.id===id);
export const valuesIn=id=>values.filter(v=>v.room===id);
