/* words(t): how many real-looking words t has, or 0 when too much of it is key-mash.
   Used to enable Continue/Add on free-text steps. Not a spell-checker: it leans toward letting text pass,
   because wrongly blocking someone's real words is worse than letting a mash through.
   Cheap signals, no dictionary:
   - 2-3 letter words must be in SHORT (real short words, slang, acronyms); letter patterns say nothing about them
   - longer words need a vowel, at most 70% vowels ("uihui"), no three-fold repeat ("tetete"), and at least
     two thirds of their letter pairs among PAIRS (the pairs covering 95% of the system word list)
   - apostrophe endings ('m 's 'd 'll 've 're) and accents are ignored; words in other scripts count as real
   - a capitalised word that fails (a name: "Nguyen") counts too, but never more than the real words do
   - duplicates count once, and at least half of the distinct words must pass ("oih oih oih" is one word)
   Weak spot: with only 2-3 words, one stray word decides it, and two real words can carry mash ("I am gvjhbk").
   Measured by scripts, not by users: roughly 1-3% of random key-mash passes; real journaling text is rarely blocked. */
(() => {
  const PAIRS = new Set('er in ti on te an al at ic en is re ra le ri ro st ne ar li es nt or un it la co io to ia ni ca ed us ta ss tr ly de ma ch ph ng lo ou el na ac ol he om di me no th si et se ll mi op pe os id ve ce hi ho il ea as ul pr nd ha ab ur ot bl po mo nc pa ec em oc ge og am sh ci ap ct pi su sc hy ns da ry so um ad sa ep sp rt sm do bi od ty ag cr be ut gi ba iv im cu ip ga pl ke rm ae gr tu oo iz ir ig lu mp if vi eo bo oi gl fi br ie ee ru ai rc ov qu fo ck rd rs rr ze au dr ub ex cl go pt tt ob fe va ib hr eu up wa yl uc bu cy rn ua yp ei mb fu ui ow eg ki mu pu fl gu oa rp nn ud ys my lt wi ef sl ps tl wo nu fa nf sy we dl du av ak pp mm rg ue ev eb rb ik gn rl hu ym iu oe ff gh yn yc gy fr za ht yt rh yr sn vo cc ay of np py ew ya ka xi'.split(' '));
  const SHORT = new Set(('a i am an as at be by do go he hi if in is it me my no of oh ok on or so to up us we ah eh ew um uh ya yo ex id im pm bf gf ma pa ' +
    'ace act add ads age ago aid aim air all and ant any ape arc are arm art ask ate awe bad bag ban bar bat bay bed bee beg bet bid big bin bit bob bow box boy bud bug bus but buy cab cap car cat cop cow cry cub cup cut ' +
    'dad dam day den did die dig dim dip dog dot dry due dug ear eat egg ego end era eve eye fad fan far fat fed fee few fig fin fit fix flu fly fog for fox fry fun fur gap gas gem get gig god got gum gun gut guy gym ' +
    'had ham has hat hay hen her hey hid him hip his hit hog hop hot how hub hue hug hum hut ice icy ill ink inn its ivy jam jar jaw jet job jog joy jug key kid kin kit lab lad lag lap law lay led leg let lid lie lip lit log lot low ' +
    'mad man map mat may men met mid mix mob mom mop mud mug mum nap net new nod nor not now nun nut oak odd off oil old one our out owe owl own pad pal pan pat paw pay pea peg pen pet pie pig pin pit pop pot pro pub pup put ' +
    'rag ram ran rat raw ray red rib rid rim rip rob rod rot row rub rug run sad sat saw say sea see set sew she shy sin sip sir sis sit six ski sky sly sob son spa spy sub sum sun tab tag tan tap tax tea ten the tie tin tip toe ton too top toy try tub tug two ' +
    'use van vet via vow war was wax way web wed wet who why wig win wit woe won wow yes yet you zap zip zoo ' +
    'bro fam lol omg idk ugh wtf tbh fml bff pls thx kms ptsd cbt ocd adhd gpa phd mba icu ceo ' +
    'known dizzy lazy awkward envy after looks awful fuzzy texts').split(' '));
  const real = w => {
    if (!/[a-z]/i.test(w)) return true; // another script: can't judge, so don't block
    w = w.toLowerCase().replace(/['’](s|m|d|ll|ve|re)$/, '').replace(/[^a-z]/g, '');
    if (SHORT.has(w)) return true;
    if (w.length < 4) return false;
    const v = (w.match(/[aeiouy]/g) || []).length;
    if (!v || v / w.length > .7 || /(.{2,3})\1\1/.test(w)) return false;
    let ok = 0; for (let i = 0; i < w.length - 1; i++) if (PAIRS.has(w.slice(i, i + 2))) ok++;
    return ok * 3 >= (w.length - 1) * 2;
  };
  window.words = t => {
    const seen = new Map(); // lower-cased token -> { real, name }
    for (const raw of String(t ?? '').normalize('NFD').replace(/\p{M}/gu, '').trim().split(/\s+/)) {
      if (!/\p{L}/u.test(raw)) continue; // digits, emoji, punctuation
      const k = raw.toLowerCase();
      if (!seen.has(k)) seen.set(k, { real: real(raw), name: /^[A-Z][a-z]+$/.test(raw) });
    }
    const all = [...seen.values()], ok = all.filter(x => x.real).length, names = all.filter(x => !x.real && x.name).length;
    const n = ok + Math.min(names, ok);
    return n * 2 >= all.length ? n : 0;
  };
})();
