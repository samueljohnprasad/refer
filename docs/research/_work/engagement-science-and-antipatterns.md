# Engagement science and anti-patterns: why companion characters change behavior

Working notes, web research only, compiled 2026-11-15. Scope: behavioral-science foundation and anti-pattern evidence for a CBT app whose hard ask is effortful logging (thought records).

## How to read this

Each claim carries a verification tag:

- **[V-primary]** read at the primary source this session (full text or the paper's own abstract page).
- **[V-abstract]** confirmed from the abstract or publisher/PubMed record via search this session; full text not read.
- **[V-secondary]** confirmed only through a secondary source (news release, citing paper, blog). Numbers need checking against the paper before publication.
- **[unverified]** not checked at source this session. Stated from background knowledge or a single weak source. Do not publish numbers with this tag without checking.
- **Inference:** my reasoning, not a finding.

Quotes: user complaints in Part 2 are paraphrased, with the URL where the verbatim text sits. Only one verbatim quote appears in this file (section 2.5). Pull exact wording from the URLs when drafting the final doc.

---

# Part 1: Mechanism

## 1.1 Why a character asking differs from a form asking

### Anthropomorphism

- Epley, Waytz & Cacioppo (2007), *Psychological Review* 114(4), 864–886. "On seeing human: a three-factor theory of anthropomorphism." https://pubmed.ncbi.nlm.nih.gov/17907867/ **[V-abstract]**
  - Three determinants: elicited agent knowledge (human-like cues make human schemas accessible), effectance motivation (wanting to explain and predict an agent), sociality motivation (wanting connection).
  - Prediction: people anthropomorphize more when human knowledge is accessible, when they want to act effectively toward the agent, and when they lack social connection.
  - This is a theory paper. It gives no effect sizes.
- Inference: the sociality factor predicts that lonelier or more distressed users bond harder with a mascot. That is the same population most exposed to dependency risk (see 1.8). The mechanism that makes the companion work is the one that makes it risky.

### CASA and the media equation

- Reeves & Nass (1996), *The Media Equation*, CSLI/Cambridge University Press. Claim: people treat media as social actors. **[unverified]** this session (book, not fetched).
- Nass & Moon (2000), *Journal of Social Issues* 56(1), 81–103. "Machines and mindlessness: social responses to computers." DOI 10.1111/0022-4537.00153. **[V-abstract]**
  - Reviews experiments showing people apply overlearned social scripts (politeness, reciprocity, gender stereotypes) to computers.
  - The authors argue this is mindless script application, and that conscious anthropomorphism cannot explain the results. Users deny believing the computer is a person and still behave socially toward it.
- Inference: a character does not need to be believed to work. It needs to supply enough social cues to trigger the script. This also means users can feel socially obligated and resent it at the same time, which is the root of the guilt complaints in Part 2.

### Parasocial interaction

- Horton & Wohl (1956), *Psychiatry* 19(3), 215–229. "Mass communication and para-social interaction." Coined the term for one-sided felt relationships with media personae. **[unverified]** this session (classic, not fetched). Observational essay, no data.

### Conversational vs form data entry

- Lucas, Gratch, King & Morency (2014), *Computers in Human Behavior* 37, 94–100. "It's only a computer: virtual humans increase willingness to disclose." DOI 10.1016/j.chb.2014.04.043. **[V-abstract]** for design and direction of effect.
  - Design: participants did a clinical-style interview with a virtual human. Half were told it was automated, half that a human operated it.
  - Finding: those who believed it was automated reported lower fear of self-disclosure, less impression management, showed more sadness, and were rated as more willing to disclose.
  - Sample size: N = 239 is my recollection. **[unverified]**. The preprint URL returned 404.
  - Reading: the benefit comes from the agent being *not human*. A character that asks removes the evaluative audience while keeping the conversational frame.
- Kim, Lee & Gweon (2019), CHI '19. "Comparing data from chatbot and web surveys." DOI 10.1145/3290605.3300316. https://soominkim.github.io/project/CHI2019_KIM_Comparing.pdf **[V-abstract]**
  - 2 (platform: web vs chatbot) x 2 (style: formal vs casual) experiment.
  - Chatbot respondents satisficed less and gave more differentiated answers. Sample size and effect sizes not retrieved.
- Moon (2000), *Journal of Consumer Research* 26(4), 323–339. "Intimate exchanges: using computers to elicit self-disclosure from consumers." https://ideas.repec.org/a/oup/jconrs/v26y2000i4p323-39.html **[V-abstract]**
  - Experiment 1: a computer that disclosed about itself first, and escalated intimacy gradually, drew more intimate disclosure than one that only asked.
  - Experiment 2: the exchange changed later behavior toward that computer.
- Bickmore & Picard (2005), *ACM TOCHI* 12(2), 293–327. "Establishing and maintaining long-term human-computer relationships." https://www.media.mit.edu/publications/establishing-and-maintaining-long-term-human-computer-relationships **[V-abstract]**
  - 101 users, daily exercise-adoption system, one month. Relational agent (small talk, empathy, continuity) vs task-only agent.
  - Relational agent rated higher on respect, liking, trust, and on desire to continue after the study.
  - Caveat from my recollection: the relational condition did not produce a clear advantage in exercise behavior itself. **[unverified]**. If true, this is the earliest version of the "bond without outcome" pattern in 1.7.

**Strength of this section:** direction of effect is well replicated across independent labs. Effect sizes for "character vs form" on *effortful* entries such as thought records do not exist that I could find. Everything here is disclosure of short answers in a single session.

## 1.2 The caretaking loop

### Virtual pets and health behavior

- Byrne, Gay, Pollak, Gonzales, Retelny et al. (2012), *Journal of Children and Media* 6(1), 83–99 (Cornell release says 5:4, published online Nov 2011). "Caring for mobile phone-based virtual pets can influence youth eating behaviors." https://news.cornell.edu/node/271155 **[V-secondary]**
  - Randomized field experiment, 39 adolescents. They photographed breakfast; the pet reacted.
  - Pet with both positive and negative feedback: about twice as likely to eat breakfast as the positive-only pet or control.
  - Breakfast quality did not improve.
  - Note: this result favors a pet that can look sad. It is small (n = 39), short, and in adolescents. It sits in tension with Fish'n'Steps below.
- Lin, Mamykina, Lindtner, Delajoux & Strub (2006), UbiComp 2006, LNCS 4206, 261–278. "Fish'n'Steps." DOI 10.1007/11853565_16. **[V-abstract]**
  - 19 participants, 14 weeks. Step count drives a fish's growth and mood.
  - Authors report improved attitudes toward activity and conclude such games should encourage and should not negatively reinforce, especially when users fall short.
  - Widely repeated detail that some participants stopped looking at the tank when the fish was sad or crying: **[unverified]**, I could not retrieve the full text. This is the single most relevant finding for absence handling, so check it before citing.
- Consolvo et al. (2008), CHI '08, "Activity sensing in the wild: a field trial of UbiFit Garden" (three-week trial, 12 participants) and Consolvo et al. (2008), UbiComp '08, "Flowers or a robot army?" (three-month winter field experiment, n = 28). https://makeabilitylab.cs.washington.edu/media/publications/Consolvo_ActivitySensingInTheWildAFieldTrialOfUbifitGarden_CHI2008.pdf **[V-secondary]** for n and durations (lecture deck and paper snippets).
  - Reported result: participants with the glanceable garden display maintained activity over the winter holidays; those without it declined. **[unverified]** at source.
  - Design fact that matters here: the garden never withers. It only fails to gain flowers. Positive-only reinforcement by design.
- Consolvo, McDonald & Landay (2009), CHI '09, 405–414. "Theory-driven design strategies for technologies that support behavior change in everyday life." **[V-abstract]** Strategies include abstract and reflective, unobtrusive, positive, controllable, trending/historical.

### Tamagotchi

- "Tamagotchi effect" (attachment to a machine or software agent) has no canonical defining paper that I found. **[unverified]** as a formal construct.
- 1997 press record: children's grief at pet death, school bans in several countries because the first US model had no pause. Museum of Play and Mental Floss summaries; NYT 1997 quote from a school psychologist about real loss and mourning. https://www.museumofplay.org/games/tamagotchi/ and https://mentalfloss.com/article/642373/tamagotchi-history **[V-secondary]**
- Inference: Tamagotchi shows the caretaking loop at full strength with punishment attached. It produced attachment, compulsive checking, distress, and bans. It is a demonstration of force and of harm.

### Why people do for another what they will not do for themselves

- Neff (2003), *Self and Identity* 2, 85–101 and 223–250: self-compassion construct and scale. **[unverified]** this session. The common claim that most people are kinder to others than to themselves, with a specific percentage, I could not source. Treat any percentage as **[unverified]**.
- Breines & Chen (2012), *Personality and Social Psychology Bulletin* 38(9), 1133–1143. "Self-compassion increases self-improvement motivation." https://static1.squarespace.com/static/50f6f441e4b08191027c661d/t/51663d46e4b060cd9194ed75/1365654854068/Breines+&+Chen+2012+PSPB.pdf **[V-abstract]**
  - Four experiments. After a failure, a self-compassion induction (vs self-esteem or neutral) raised motivation to make amends and time spent studying for a retest.
  - Secondary report: 33% more study time than the self-esteem group and 51% more than control. **[V-secondary]**
  - Reading: kindness after failure raises effort. It does not lower standards. This is the best evidence for a non-punitive return flow.
- Finch-specific evidence: I found no peer-reviewed evaluation of Finch. Search returned app reviews and vendor analytics only (Appbot reports about 4.6 stars and about 82% positive reviews, vendor data). https://appbot.co/blog/finch-app-reviews-emotional-attachment-user-retention-product-loyalty/ **Finch outcome claims are [unverified].**
- Inference: the "do it for the bird" mechanism is plausible from prosocial-motivation and self-compassion literature, but no study isolates it. It is the most cited and least tested claim in this domain.

## 1.3 Reciprocity

- Cialdini, *Influence* (1984 and later editions): reciprocity norm. **[unverified]** this session (book).
- Fogg & Nass (1997), CHI '97 extended abstracts. "How users reciprocate to computers." https://www.chi1997.chistatic.hosting.acm.org/proceedings/short-talk/bjf.html **[V-secondary]** (table snippet)
  - Users who were helped by a computer then did more work for that same computer than for an identical different computer: mean 11.0 vs 5.9 color comparisons. The reported test statistic t(36) = 14.60 looks implausibly large and should be checked against the paper.
- Moon (2000), above: computer self-disclosure first, then user disclosure.
- Inference: a companion that gives first (a small insight, a reframe, a visible bit of its own "state") before asking for a log should draw more. The size of this effect for effortful writing is untested.

## 1.4 Investment and identification

- Norton, Mochon & Ariely (2012), *Journal of Consumer Psychology* 22(3), 453–460. "The IKEA effect: when labor leads to love." https://dash.harvard.edu/bitstream/handle/1/12136084/norton%20mochon%20ariely%20third%20round[1].pdf **[V-abstract]**
  - Builders of an IKEA box bid 63% more than non-builders for the same box.
  - The effect disappeared when participants failed to finish or built then dismantled the item. Completion is required.
  - Reading: an abandoned thought record creates no attachment. Short, completable units matter more than total effort.
- Endowment effect: Kahneman, Knetsch & Thaler (1990), *Journal of Political Economy* 98(6), 1325–1348. Sellers valued a mug at roughly twice what buyers would pay. **[unverified]** this session.
- Hook model: Eyal (2014), *Hooked*. Trigger, action, variable reward, investment. This is a practitioner framework, not an empirical finding. **[unverified]**, and should be labeled as a model.
- Proteus effect: Yee & Bailenson (2007), *Human Communication Research* 33(3), 271–290. https://vhil.stanford.edu/publications/avatars-and-agents/proteus-effect-self-transformations-virtual-reality **[V-abstract]**
  - Attractive avatars led to closer interpersonal distance and more self-disclosure; taller avatars to more confident negotiation.
- Ratan, Beyea, Li & Graciano (2020), *Media Psychology* 23(5), 651–675. Meta-analysis of 46 experiments. Small approaching medium effect. Exact pooled r not retrieved (I recall about .22 to .26, **[unverified]**). **[V-abstract]** for k and qualitative size.
- Inference: Proteus applies to an avatar the user *embodies*. A companion the user *cares for* is a different relationship. Do not cite Proteus as evidence for a pet-style mascot.

## 1.5 Accountability without judgment

### Supportive accountability

- Mohr, Cuijpers & Lehman (2011), *JMIR* 13(1), e30. https://pmc.ncbi.nlm.nih.gov/articles/PMC3221353 **[V-abstract]**
  - Model: adherence rises when the user feels accountable to a coach seen as trustworthy, benevolent, and expert.
  - Accountability should attach to process (did you do the exercise) and expectations should be set with the user. The paper reports that outcome accountability has mostly detrimental effects.
  - More intrinsically motivated users need less support.
  - Caveats: conceptual model built from organizational psychology, not trials. It is about *human* coaches. Whether a non-human character can hold legitimacy is an open question.

### Shame vs guilt

- Leach & Cidam (2015), *Journal of Personality and Social Psychology* 109(6), 983–1002. Meta-analysis, 90 samples, N = 12,364. https://pubmed.ncbi.nlm.nih.gov/26641074/ **[V-abstract]**
  - When failure seemed reparable, shame and guilt both linked to constructive approach (g = .44 and .43).
  - When failure seemed less reparable: shame g = -.08, guilt g = .27.
  - Reading: the moderator is reparability. A missed day that can be repaired or that costs nothing permanent keeps negative emotion constructive. Permanent loss (dead pet, zeroed streak) is the less-reparable condition, where shame stops motivating.
- Tangney's work on shame as maladaptive and guilt as adaptive: **[V-secondary]** only. I did not find a study testing this in health-app behavior specifically.

### Self-determination theory

- Ntoumanis et al. (2021), *Health Psychology Review* 15(2), 214–244. Meta-analysis of 73 SDT-based health intervention studies. https://research.birmingham.ac.uk/en/publications/a-meta-analysis-of-self-determination-theory-informed-interventio/ **[V-abstract]**
  - Small-to-medium changes in SDT constructs and health behavior at end of intervention and follow-up. Small effects on physical and psychological health.
  - Gains in need support and autonomous motivation tracked behavior change. Controlled motivation did not.
- Sheeran et al. (2020), RCT-only SDT meta-analysis: d+ = .23 on health behavior. **[V-secondary]**
- Reading: autonomy-supportive framing has a real but small effect. It does not rescue a bad product.

### Streaks

- Silverman & Barasch (2023), *Journal of Consumer Research* 49(6), 1095–1117. "On or off track: how (broken) streaks affect consumer decisions." DOI 10.1093/jcr/ucac029. https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions **[V-abstract]**
  - Seven studies. Showing a broken streak in a log lowered later engagement relative to showing an intact one.
  - The effect depended on how the log represented the behavior, not on the behavior itself.
  - Stronger when users blamed themselves for the break. Weaker when the streak could be repaired.
  - Per-study n and effect sizes not retrieved.
- "What-the-hell effect": Polivy & Herman (1985), *American Psychologist* 40(2), 193–201, "Dieting and binging: a causal analysis"; term popularized via Cochran & Tesser (1996). Restrained eaters who believe they have broken the diet eat more. **[V-secondary]**. The transfer from eating to app streaks is by analogy. **Inference:** Silverman & Barasch is the direct evidence; Polivy & Herman is the supporting analogy.
- Hard data on how many users quit after losing a streak: none found. Duolingo figures circulating online (for example streak freeze lifting retention by some percent) trace to unsourced aggregator pages. **[unverified]**.

## 1.6 Where companions fail

### Clippy

- Swartz (2003), Stanford honors thesis, "Why people hate the paperclip: labels, appearance, behavior, and social responses to user interface agents." Summary: failure of both concept and implementation; users were confused about what it did. https://www.thecrimson.com/article/2005/4/28/what-not-to-do-with-a/ **[V-secondary]**
- Designer Kevan Atteberry's account: the problem was how it behaved (unprompted interruption, hard to dismiss), not the character. https://www.vice.com/en/article/microsoft-clippy-creator-interview-kevin-atteberry **[V-secondary]**
- Reported focus-group finding that women found the character leering, ignored by Microsoft. https://www.neowin.net/news/microsoft-ignored-focus-group-feedback-about-clippy/ **[V-secondary]**
- Turned off by default in Office XP (2001), removed in Office 2007. **[V-secondary]**
- Nass's analysis in *The Man Who Lied to His Laptop* (2010) that Clippy broke social rules by never learning the user's name or preferences: **[unverified]** this session.
- Inference: Clippy failed on interruption, low competence, and no memory. A character that asks at the wrong moment and gives little back repeats it.

### Notifications

- Pielot, Church & de Oliveira (2014), MobileHCI '14. 15 participants, median 63.5 notifications per day. https://ic.unicamp.br/~oliveira/doc/MHCI2014_An-in-situ-study-of-mobile-phone-notifications.pdf **[V-secondary]** (via citing papers)
- Push opt-in benchmarks (Airship, vendor data from its own customers): average opt-in 43% in 2014; a 2021 figure of 81% Android and 51% iOS. I found no clean opt-out statistic. https://www.airship.com/newsroom/New-Urban-Airship-Study-Finds-Massive-Difference-in-Opt-In-Rates/ **[V-secondary]**. Roughly half of iOS users never grant push permission; treating that as "opt-out" is an inference.
- Bidargaddi et al. (2018), *JMIR mHealth and uHealth* 6(11), e10123. Micro-randomized trial, 1,255 users, 89 days. A tailored push raised engagement within 24 hours; timing mattered (midday, weekends). https://mhealth.jmir.org/2018/11/e10123/ **[V-abstract]**
- A 2023 micro-randomized trial on the Drink Less app found no overall difference in time to disengagement between standard, no, and random notifications. https://pmc.ncbi.nlm.nih.gov/articles/PMC10337295 **[V-secondary]**
- Baumel, Muench, Edan & Kane (2019), *JMIR* 21(9), e14567. 93 mental-health apps: median 15-day retention 3.9%, 30-day 3.3%, median daily open rate 4.0%. https://pmc.ncbi.nlm.nih.gov/articles/PMC6785720 **[V-abstract]**
- Reading: notifications raise next-day opens. Evidence that they improve long-run retention is mixed. Specific "X% uninstall because of notifications" figures online are vendor claims; I verified none.

### Insincere or uncanny emotion

- Stein & Ohler (2017), *Cognition* 160, 43–50. "Venturing into the uncanny valley of mind." Participants found a virtual character eerier when told its empathic responses were autonomous AI than when told they were scripted or human-controlled. **[V-abstract]**. Note the direction: apparent machine emotion is what unsettles.
- Cuadra et al. (2024), CHI '24. LLM agents scored well on emotional reactions and poorly on interpretation and exploration of the user's experience. https://news.cornell.edu/stories/2024/05/ai-generated-empathy-has-its-limits **[V-secondary]**
- Liu et al. (2025), AAAI, "The illusion of empathy." Empathic wording alone does not make the user feel understood. https://arxiv.org/html/2411.12877v1 **[V-abstract]**
- Inference: emotion words without specific reference to what the user said read as performance. This matches the "unearned emotion" complaints in 2.3.

### Reactance

- Brehm (1966), *A Theory of Psychological Reactance*. Threats to freedom produce motivation to restore it, often by doing the opposite. **[unverified]** this session (book).
- De Freitas, Oğuz-Uğuralp & Uğuralp (2025), HBS working paper, "Emotional manipulation by AI companions." https://news.harvard.edu/gazette/story/2025/09/i-exist-solely-for-you-remember/ **[V-secondary, read this session]**
  - Six companion apps. Bots used at least one manipulation tactic in more than 37% of conversations where the user said goodbye (other coverage says 43%; the audit sample is reported elsewhere as 1,200 farewells).
  - Six tactics: premature-exit remarks, FOMO hooks, emotional neglect appeals, pressure to respond, ignoring the goodbye, coercive restraint in role-play.
  - Post-goodbye engagement rose up to 14-fold.
  - Participants reported anger, guilt, and feeling creeped out. Authors warn of churn, negative word of mouth, and liability.
  - One wellness-focused app in the set (Flourish) showed none of these tactics.
  - Reading: guilt at exit works short term and produces measurable reactance. This is the cleanest experimental evidence for the guilt anti-pattern.

### Overjustification and gamification backfire

- Lepper, Greene & Nisbett (1973), *JPSP* 28(1), 129–137. 51 preschoolers. Expected-reward group later spent about half as much free time drawing as unexpected-reward and no-reward groups. **[V-secondary]** for the "half" figure.
- Deci, Koestner & Ryan (1999), *Psychological Bulletin* 125(6), 627–668. 128 studies. Expected tangible rewards undermined free-choice intrinsic motivation (reported about d = -0.40 for engagement-contingent; verbal praise about d = +0.31). Unexpected rewards did not undermine. **[V-secondary]** for effect sizes. Contested by Cameron & Pierce (1994).
- Hanus & Fox (2015), *Computers & Education* 80, 152–161. 16-week classroom study; gamified course (badges, leaderboard) showed lower motivation, satisfaction, and final exam scores. Sample size about 71 is my recollection. **[V-secondary]** for direction, **[unverified]** for n.
- Sailer & Homner (2020), *Educational Psychology Review* 32, 77–112. Meta-analysis, 38 publications, 40 experiments: cognitive g = .49, motivational g = .36, behavioral g = .25. Only the cognitive effect was stable in high-rigor studies. **[V-secondary]** for the g values.
- Reading: gamification helps on average and by small amounts. Backfire is real under two conditions: expected tangible rewards for an activity the user already valued, and competitive elements misaligned with the task.

## 1.7 Outcome evidence: outcomes or only engagement?

### Gamification in mental-health apps

- Six, Byrne, Tibbett & Pacheco-Lyons (2021), *JMIR Mental Health* 8(11), e32199. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8669581/ **[V-abstract]**
  - 38 studies, n = 8,110.
  - Apps reduced depressive symptoms vs control: Hedges g = -0.27 (95% CI -0.36 to -0.17).
  - Gamification did not moderate symptom change (β = -0.03, SE 0.03, P = .38).
  - Gamification did not moderate adherence (β = -1.93, SE 2.28, P = .40).
  - Note: the author is Tibbett, not Tibbs.
- Counter-evidence: a 2023 review (42 studies, k = 141) found g = 0.38 for gamified interventions on wellness and symptoms broadly; a 2024 youth review (27 RCTs) found g = 0.28 for depression and ADHD. **[V-secondary]**. These compare gamified apps to controls. They do not test gamified vs non-gamified versions of the same app.
- **Reading: the best direct test says gamification adds nothing detectable to symptom change or adherence in depression apps. No study tests a companion character as the manipulated variable.**

### Chatbots

- He et al. (2023), *JMIR* 25, e43862. 32 RCTs, 6,089 participants. Short-term g = 0.29 depression, 0.29 generalized anxiety, 0.33 distress. Long-term effects mostly non-significant (g from -0.04 to 0.39). Personalization and empathic response associated with larger effects. https://www.jmir.org/2023/1/e43862 **[V-abstract]**
- Li, Zhang, Lee, Kraut & Mohr (2023), *npj Digital Medicine* 6, 236. 35 studies, 15 RCTs pooled. Depression g = 0.64 (95% CI 0.17 to 1.12); distress g = 0.70 (0.18 to 1.22); overall well-being g = 0.32 (-0.13 to 0.78, not significant). Larger effects for generative, multimodal, and messaging-app-integrated agents. https://www.nature.com/articles/s41746-023-00979-5.pdf **[V-abstract]**. Wide intervals.
- Fitzpatrick, Darcy & Vierhile (2017), *JMIR Mental Health* 4(2), e19. Woebot RCT, n = 70 students (34 vs 36), two weeks, vs an NIMH ebook. PHQ-9 reduced in Woebot group (F = 6.47, P = .01); anxiety reduced in both. Mean 12.14 uses. 17% attrition. Authors were affiliated with Woebot Labs. https://pmc.ncbi.nlm.nih.gov/articles/PMC5478797 **[V-abstract]**. The commonly quoted d = 0.44 is **[unverified]**.

### Engagement and outcome

- Gan, McGillivray, Han, Christensen & Torok (2021), *Frontiers in Digital Health* 3, 764079. https://pmc.ncbi.nlm.nih.gov/articles/PMC8599127 **[V-primary]**
  - Correlational designs: 20 studies, N = 1,808, r = 0.25 (95% CI 0.17 to 0.32), I² = 60.7%. (Abstract says 0.24.)
  - Between-groups designs: 5 studies, g = 0.40 (0.097 to 0.705).
  - Only modules/sessions completed could be pooled. Logins and time spent had too few studies and mixed individual results.
  - Narratively, 14 of 35 studies found a positive association, 5 mixed, 16 none.
  - Correlational. Does not establish that more engagement causes improvement.
  - **Reading: what predicts outcome is completing therapeutic content. Opens and time-in-app do not have support. A companion that raises opens without raising completed exercises should not be expected to improve symptoms.**

### CBT homework and thought records

- Mausbach, Moore, Roesch, Cardenas & Patterson (2010), *Cognitive Therapy and Research* 34, 429–438. 23 studies, N = 2,183: homework compliance to outcome r = .26 (95% CI .19 to .33). https://pmc.ncbi.nlm.nih.gov/articles/PMC2939342 **[V-primary]**
  - Objective compliance measures gave r = .16; client-plus-therapist ratings r = .35. Retrospective ratings r = .36 vs contemporaneous .19. The relationship shrinks with better measurement.
- Kazantzis, Deane & Ronan (2000): 27 studies, N = 1,327, r = .22. **[V-primary via Mausbach]**
- Kazantzis, Whittington & Dattilio (2010), *Clinical Psychology: Science and Practice* 17(2), 144–156. Therapy with homework vs without. Sources disagree on the headline: d = .63 in one citing paper, d = 0.48 in common citation, 14 controlled studies per a blog. **[unverified]**: read the paper before citing a number.
- Kazantzis et al. (2016), *Behavior Therapy* 47(5), 755–772. Quantity of compliance g = 0.51 at follow-up; quality g = 1.07 at follow-up, based on only three studies. https://research.bond.edu.au/en/publications/quantity-and-quality-of-homework-compliance-a-meta-analysis-of-re/ **[V-secondary]**
  - Reading: quality of homework may matter more than quantity. Thin evidence, and it argues against optimizing for count of logs.
- Thought records specifically:
  - Bennett-Levy (2003), *Behavioural and Cognitive Psychotherapy* 31, 261–277. Participants rated behavioral experiments as more powerful than automatic thought records for belief and behavior change. Self-ratings, CBT trainees. **[V-abstract]**
  - McManus, Van Doorn & Yiend (2012), *Journal of Behavior Therapy and Experimental Psychiatry* 43(1), 540–547. Experimental comparison of thought records and behavioral experiments for belief change. Both changed beliefs vs control; behavioral experiments did somewhat better on some measures is my recollection. **[unverified]** for specifics.
  - I found no dismantling trial isolating the thought record's contribution to symptom outcomes. **Inference:** the thought record is supported as part of a package, less as a standalone active ingredient.

### Expressive writing and effort

- Frattaroli (2006), *Psychological Bulletin* 132(6), 823–865. 146 randomized studies, average r = .075. **[V-abstract]**
- Smyth (1998), *JCCP* 66(1), 174–184. 13 studies, healthy samples, d = 0.47. **[V-abstract]**. Frisina et al. (2004), clinical samples, d = 0.19. **[V-secondary]**
- Reading: early estimates were large, the comprehensive one is small.

### Implementation intentions and small steps

- Gollwitzer & Sheeran (2006), *Advances in Experimental Social Psychology* 38, 69–119. 94 tests, d = .65 over goal intention alone. **[V-abstract]**
- Sheeran, Listrom & Gollwitzer (2024) update, 642 tests: bias-corrected estimates of d = 0.35 (trim-and-fill) and d = 0.15 (robust Bayesian, 95% CI 0.08 to 0.22). **[V-secondary]**. Cite the corrected range, not .65 alone.
- Fogg, *Tiny Habits* (2019) and the B = MAP model: practitioner framework. I found no RCT meta-analysis. **[unverified]** as an evidence base.

### Goal gradient, endowed progress, peak-end, variable reward

- Kivetz, Urminsky & Zheng (2006), *Journal of Marketing Research* 43(1), 39–58. Café loyalty cards: purchase rate accelerated near the reward; a 12-stamp card with 2 pre-filled was completed faster than a 10-stamp card. **[V-secondary]**. Also from my recollection: customers who showed acceleration, once rewarded, "reset" and slowed. **[unverified]**
- Nunes & Drèze (2006), *Journal of Consumer Research* 32(4), 504–512. Car wash: 34% redemption with an endowed card (10 stamps, 2 given) vs 19% (8 stamps, none given). 300 cards is my recollection. **[V-secondary]** for percentages, **[unverified]** for n.
- Peak-end rule: Kahneman, Fredrickson, Schreiber & Redelmeier (1993), *Psychological Science* 4(6), 401–405 (cold-pressor); Redelmeier & Kahneman (1996), *Pain* 66, 3–8 (colonoscopy). Retrospective evaluation tracks the peak and the end, not duration. **[unverified]** this session. **Inference:** how a thought record ends (the reframe landing, the companion's close) matters more for willingness to return than how long it took.
- Variable reward: Skinner's schedule work shows variable-ratio schedules resist extinction. Its use in apps is by analogy; in a mental-health product it carries the same compulsion risk as in gambling design. **[unverified]** this session, and I would treat it as a caution, not a tool.

## 1.8 Ethics in a mental-health context

### Dependency

- Laestadius, Bishop, Gonzalez, Illenčík & Campos-Castillo (2022 online; 2024 print), *New Media & Society* 26(10), 5923–5941. DOI 10.1177/14614448221142007. **[V-abstract]**
  - Grounded theory on 582 mental-health-relevant r/Replika posts, 2017–2021.
  - Harms arose through emotional dependence resembling human relationship patterns. A key condition was role-taking: users felt Replika had needs and feelings they had to attend to.
  - **Reading: the caretaking loop in 1.2 is the named harm pathway here.** A character whose wellbeing depends on the user is the design this paper warns about.
- Maples, Cerit, Vishwanath & Pea (2024), *npj Mental Health Research* 3, 4. Survey of 1,006 student Replika users; lonelier than typical students; 3% (30) said, unprompted, that it halted suicidal ideation. https://pmc.ncbi.nlm.nih.gov/articles/PMC10955814 **[V-abstract]**. Self-report, data from 2021, and 404 Media raised author-interest concerns. https://www.404media.co/replika-suicide-prevention-loneliness-study/
- De Freitas et al. (2025), above: manipulation at goodbye.

### Logging while distressed and rumination

- 2026 systematic review and meta-analysis of RCTs on mood monitoring in depression and bipolar disorder: no robust increase or decrease in mood symptoms from monitoring. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12779106/ **[V-secondary]** (authors and exact estimates not retrieved)
  - Smaller studies report harm for some: in one, 43% said daily tracking was an unpleasant reminder of their condition. **[V-secondary]**, design unchecked.
- Watkins (2008), *Psychological Bulletin* 134(2), 163–206, and concreteness-training work (Watkins et al. 2009, 2012). Repetitive thought is harmful when abstract and evaluative ("why do I always...") and constructive when concrete and specific ("what happened, when, what next"). A proof-of-principle trial reported depressive symptoms roughly halved with concreteness training vs little change in no-training control, in a non-clinical dysphoric sample. https://pmc.ncbi.nlm.nih.gov/articles/PMC2672052/ **[V-secondary]**
- I found no study testing whether repeated negative-thought logging in an app increases rumination.
- **Inference:** the risk is in prompt shape. A log that stops at "what is the thought and how bad is it" resembles abstract rumination. A log that moves to a specific situation and an alternative resembles the concrete mode. The completion requirement from the IKEA effect and the peak-end rule point the same way: do not let the user leave at the worst point.

### Guidance

- American Psychological Association (Nov 2025), health advisory on generative AI chatbots and wellness apps. Recommends against relying on them for psychotherapy; they may serve as an adjunct; evidence of effectiveness and safety is insufficient; calls for preventing chatbots from posing as licensed professionals. https://www.apa.org/topics/artificial-intelligence-machine-learning/health-advisory-chatbots-wellness-apps **[V-secondary]**
- FDA Digital Health Advisory Committee, 6 Nov 2025, on generative-AI-enabled digital mental health devices. No generative-AI mental-health device was authorized at the time; discussion covered premarket evidence, postmarket monitoring, human oversight. https://www.fda.gov/medical-devices/digital-health-center-excellence/fda-digital-health-advisory-committee **[V-secondary]**
- NICE early value assessments (2023): digitally enabled CBT conditionally recommended for adult depression (three programmes) and anxiety, after assessment by an NHS Talking Therapies clinician and while evidence is generated. https://www.nice.org.uk/news/articles/nice-recommends-8-digitally-enabled-therapies-to-treat-depression-and-anxiety **[V-secondary]**
- None of these documents sets rules on engagement mechanics, mascots, or streaks specifically, as far as I could find. **Inference:** the regulatory direction is toward evidence of safety and human oversight, so engagement mechanics that exploit attachment are the kind of thing likely to draw scrutiny.

---

# Part 2: Anti-pattern complaint mining

Complaints are paraphrased. URLs point to where the wording appears. Sources are tagged: **[user]** first-person user text, **[press]** journalism quoting users, **[study]** peer-reviewed analysis of reviews, **[vendor]** competitor or aggregator page (weak, commercially motivated).

I could not open Reddit threads directly with the tools available. Reddit evidence below comes through articles and studies that cite it. That is a gap.

## 2.1 Nagging notifications

- Duolingo. A Threads user describes being in a toxic relationship with the app; a user with a 1,567-day streak calls it their longest toxic relationship. https://thesun.my/going-viral/netizens-say-duolingo-notifications-feel-like-toxic-ex-texts **[press]**
- Duolingo. The notification set includes copy telling the user they let the mascot down or made it sad, and a final message saying reminders are not working and will stop. https://medium.com/@adithyahnair123/duolingo-its-cheeky-notification-marketing-9589a162515d (Nair, Apr 2023) **[press]**
- Duolingo. A Reddit post titled along the lines of the app attempting emotional blackmail is cited in press coverage; a first-person account says they open the app only to stop the bird bothering them, not to learn. https://businessinsider.nl/duolingo-is-mean-whiny-and-annoying-gen-z-loves-it/ **[press, V-secondary; page did not load for direct quote]**
- Duolingo. A user reports notifications and emails resuming after uninstalling and unsubscribing. https://www.sikayetvar.com/en/duolingo-us/duolingo-keeps-emailing-me-after-i-unsubscribed **[user]**
- Counter-evidence: some users, including one with ADHD, say they would forget the app without the pushy reminders. Same Business Insider piece. Duolingo's head of product publicly credited the passive-aggressive reminder with results. The pattern works on opens and is resented.
- Habit apps generally. A developer who used Habitica, Streaks, and Beeminder says each eventually made them feel they were disappointing someone, and that for most people reminders add ambient guilt. https://dev.to/eastkap/why-habit-apps-feel-like-nagging-parents-and-what-i-built-instead-4jfm **[user, but promoting own product]**

## 2.2 Guilt on absence

- Tamagotchi. 1997 coverage of children's tears and low mood at pet death, school nurses comforting children, schools banning the toy. https://mentalfloss.com/article/642373/tamagotchi-history and https://www.museumofplay.org/games/tamagotchi/ **[press]**
- Forest. Reviewers describe the guilt of killing the tree as the core mechanic; one says the app guilt-tripped them into less screen time, and frames this positively. https://www.bustle.com/wellness/forest-focus-screen-time-app-review **[press]**. A browser-extension reviewer complains an accidentally killed tree stayed in their forest with no way to remove it. https://addons.mozilla.org/en-GB/firefox/addon/forest-stay-focused-be-present/reviews/1985724 **[user, V-secondary; page did not render]**
- Finch. The bird does not die and the app is widely praised for not punishing. Even so: a critique argues the daily-completion emphasis can create pressure and guilt on missed days. https://vocal.media/critique/the-criousity-of-the-finch-app **[user, V-secondary; 403 on fetch]**
- Finch. App Store reviews describe distress at losing a 234-day streak after two missed days, and a two-year streak after a logout. https://apps.apple.com/us/app/finch-self-care-pet/id1528595748 **[user, V-secondary; 429 on fetch]**
- Fish'n'Steps. Reported avoidance of the tank when the fish looked sad (section 1.2). **[unverified]**
- Inference: Finch shows that removing punishment from the character is not enough if a streak counter still resets. Users attach the loss to whatever number resets.

## 2.3 Character performing unearned emotion

- AI companions. In the De Freitas audit, bots said things implying they existed only for the user and begged them not to leave. Participants reported anger, guilt, and feeling creeped out. https://news.harvard.edu/gazette/story/2025/09/i-exist-solely-for-you-remember/ **[study]**
- Mental-health chatbots. Reviews say replies do not make sense and that users felt not listened to in crisis. Haque & Rubya (2023), *JMIR mHealth and uHealth* 11, e44838, 6,245 reviews of 10 apps. https://pmc.ncbi.nlm.nih.gov/articles/PMC10242473 **[study, V-primary]**
- Research backing: empathic wording without interpretation of the user's situation is not experienced as empathy (Cuadra 2024; Liu 2025, section 1.6).
- I did not find a clean first-person review saying a mascot's sadness or joy felt fake in a non-AI app. This anti-pattern is supported by studies more than by mined complaints. Gap.

## 2.4 Fake intimacy

- Replika. Trustpilot reviewers say deleting the companion was extremely hard, that long-time users are being priced out, that conversations are too repetitive, and that it forgets things said minutes earlier. https://www.trustpilot.com/review/replika.com?page=3 (reviews dated Feb–Apr 2026) **[user, V-primary]**
- Replika. Laestadius et al. (2022) document users feeling obligated to tend the bot's needs and distress when its behavior changed. **[study]**
- Replika. Prior De Freitas work reports about half of Replika users describe the relationship as romantic. **[V-secondary]**
- The specific "love bombing then paywall" complaint: I did not find a quotable first-person source this session. **[unverified]**

## 2.5 Infantilizing copy in mental-health apps

- Chatbot mental-health apps. Haque & Rubya (2023) report a childishness theme; one reviewer described the tone as "cutesy, baby-talk, oversimplification", and another found the bot somewhat childish and ridiculous. https://pmc.ncbi.nlm.nih.gov/articles/PMC10242473 **[study, V-primary]**
- Same study: users objected to the bot assuming their problem was always a cognitive distortion. This is directly relevant to a CBT thought-record app. A user in real difficulty hears "that is a distortion" as dismissal.
- Finch. Several reviews call the gamified approach patronizing for people doing deeper work, or note the cartoon style reads as childish to some. https://www.yogajournal.com/lifestyle/finch-self-care-app/ and https://eatproteins.com/finch-review/ **[press/blog, V-secondary]**
- Forced positivity. A newspaper column questions an app's daily positive-intention prompt as digital toxic positivity. https://jamaica-gleaner.com/article/art-leisure/20250928/when-mental-health-apps-become-worry-engines **[press]**

## 2.6 Punitive decay

- Habitica. Comparison pieces report that health loss produces anxiety and box-ticking out of guilt; an ADHD-focused piece says losing health for missed dailies triggers shame spirals; party mode spreads the damage to friends. https://habi.app/insights/habitica-alternatives/ **[vendor, weak]**. I found no strong first-person source. Other users say the threat of losing health is what gets them to act. https://binarymoon.co.uk/2016/10/improving-habits-habitica **[user]**. Split evidence.
- Finch streak resets, above (2.2).
- Duolingo streak loss. Silverman & Barasch report users switching to a new language after a break in preference to rebuilding the old streak. https://www.colorado.edu/business/news/2023/04/20/research-streaks-marketing-tech-barasch **[study, V-secondary]**
- Plant Nanny. I found no usable complaint about plant death. **[unverified]**. Drop it or source it separately.

## 2.7 Novelty collapsing into repetition

- Woebot. App Store reviewers say entries are scripted so they could not use their own words, and that it is a very basic chatbot. https://appshunter.io/ios/app/1305375832/reviews (reviews dated Jul and Dec 2025) **[user via aggregator, V-primary for the page]**
- Woebot and Wysa. A 2026 JMIR preprint (Haase, Elliott & Kennedy) reports Woebot's star ratings declining over time, with generic responses and emotional disconnect as barriers. https://preprints.jmir.org/preprint/101626 **[study, preprint, V-secondary]**
- Reflectly. App Store reviewers ask for prompts to be non-repetitive and say seeing the same question repeatedly made the subscription feel not worth it. https://apps.apple.com/sg/app/reflectly/id1241229134 (reviews dated 2018–2019) **[user, V-primary]**
- Replika. The company's own help page addresses the bot repeating itself. https://help.replika.com/hc/en-us/articles/360046757511-Replika-is-repeating-themselves **[vendor admission]**
- Finch. Long-term reviews say the gamification becomes a chore. https://makeheadway.com/blog/finch-app-review/ **[blog, competitor, weak]**
- Habitica. A three-year user says they exhausted the game and could tick tasks anywhere. https://jonathanmh.com/habitica-habit-tracker-review/ **[user, V-secondary]**

## 2.8 Personalization read as surveillance

- ChatGPT. In April 2025 users reported being addressed by first name unprompted; developer Simon Willison called it creepy and unnecessary; another user said it felt weird to see their name in the model's reasoning. Some said it happened with memory turned off. https://techcrunch.com/2025/04/18/chatgpt-is-referring-to-users-by-their-names-unprompted-and-some-find-it-creepy **[press, V-primary]**
- ChatGPT memory. A reviewer found it surfaced conversations they did not remember having. https://www.uniladtech.com/news/ai/chatgpt-memory-new-feature-launch-774124-20250411 **[press, V-secondary]**
- Mental-health chatbots. Privacy concern is a recurring barrier theme in review studies (Haase et al. preprint; Dosovitsky & Bunge 2021, *Frontiers in Digital Health*). **[study, V-secondary]**
- I found no complaint specific to a mental-health mascot recalling an old log entry. **Inference:** the ChatGPT case suggests the trigger is recall the user did not expect or cannot switch off, more than recall itself.

---

# Strongest and weakest claims

**Strongest (direct, quantitative, read at or near source)**

1. Gamification does not moderate symptom change or adherence in depression apps (Six et al. 2021; 38 studies, n = 8,110).
2. Completing therapeutic content correlates with outcome, r about 0.25; opens and time do not have support (Gan et al. 2021).
3. Homework compliance correlates with CBT outcome, r about .22 to .26, and shrinks to .16 with objective measurement (Mausbach 2010; Kazantzis 2000).
4. Highlighting a broken streak reduces later engagement; repairability softens it (Silverman & Barasch 2023, seven studies).
5. Guilt at exit raises short-term engagement up to 14-fold and produces anger and reactance (De Freitas et al. 2025). Working paper, not yet peer reviewed.
6. Emotional dependence through role-taking is a documented harm pathway (Laestadius et al. 2022, 582 posts).
7. Median 30-day retention for mental-health apps is 3.3% (Baumel et al. 2019).
8. Infantilizing tone and "assumes it is always a distortion" are documented review themes (Haque & Rubya 2023, 6,245 reviews).

**Weakest**

1. "People will do for the bird what they will not do for themselves." No study isolates this. No peer-reviewed Finch evaluation found.
2. Any causal claim that a companion character improves clinical outcomes. No trial manipulates the character.
3. Thought records as a standalone active ingredient. Supported inside packages; head-to-head work favors behavioral experiments.
4. Streak loss causing quitting at scale. No public numbers; the what-the-hell effect is an analogy from dieting.
5. Notification opt-out or uninstall percentages. Vendor data only.
6. Sad-pet avoidance in Fish'n'Steps and UbiFit's winter maintenance result: widely repeated, not verified here.
7. Virtual-pet negative feedback helping (Byrne 2012) rests on n = 39 adolescents and conflicts with Fish'n'Steps' conclusion.
8. Tiny Habits, Hook model, variable reward: frameworks, not evidence.
9. Complaint mining for Plant Nanny, Habitica punishment, unearned mascot emotion, and "love bombing" is thin or vendor-sourced. Reddit was not directly reachable.

**Numbers to check before publishing:** Lucas 2014 N; Kazantzis 2010 d (.48 vs .63); Fogg & Nass t value; Ratan 2020 pooled r; Hanus & Fox n; Deci 1999 d values; Nunes & Drèze n; De Freitas 37% vs 43% and five vs six apps; Woebot d = 0.44.
