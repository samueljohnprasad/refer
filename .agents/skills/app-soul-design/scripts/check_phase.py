#!/usr/bin/env python3
"""Machine gate for app-soul-design phase artifacts.

Usage: check_phase.py <phase 1-6> <artifact.md>
Exit 0 = all [M] checks in checklists/research-quality.md plus the phase's
structural exit criteria pass. Judgment checks [J] are not covered here.
"""
import re
import sys

BANNED = r"\b(clean|modern|engaging|delightful|intuitive|seamless|sleek|beautiful|fun|nice|friendly|playful|premium)\b"
P1_TAGS = ["PARASOCIAL", "ATTACHMENT", "SDT", "RECIPROCITY", "VALIDATION",
           "REWARD", "RITUAL", "WARMTH", "MEMORY", "CULTURE"]
P6_DIMS = ["Layout", "Type", "Color", "Spacing", "Illustration", "Motion",
           "Haptics", "Copy", "Accessibility", "Ethics"]
MIN_SOURCES = {1: 12, 2: 0, 3: 6, 4: 8, 5: 5, 6: 3}
MIN_FINDINGS = {1: 10, 2: 8, 3: 8, 4: 12, 5: 5, 6: 3}
MIN_CONTRA = {1: 2, 2: 2, 3: 2, 4: 2, 5: 1, 6: 1}
MOBBIN = r"https://mobbin\.com/(?:screens|flows)/[0-9a-f-]{36}"


def section(text, heading, level="##"):
    """Body of the first `level heading...` section, up to the next same-or-higher heading."""
    m = re.search(rf"^{level} {re.escape(heading)}.*$", text, re.M)
    if not m:
        return None
    stop = r"^#{1,%d} " % len(level)
    nxt = re.search(stop, text[m.end():], re.M)
    return text[m.end(): m.end() + nxt.start()] if nxt else text[m.end():]


def blocks(text, pattern):
    """(title, body) for every heading matching pattern, body up to the next heading of any level."""
    out = []
    for m in re.finditer(pattern, text, re.M):
        nxt = re.search(r"^#{1,6} ", text[m.end():], re.M)
        out.append((m.group(0), text[m.end(): m.end() + nxt.start()] if nxt else text[m.end():]))
    return out


def bullets(body):
    return [l for l in (body or "").splitlines() if l.lstrip().startswith("- ")]


def table_rows(body):
    rows = [l for l in (body or "").splitlines() if l.strip().startswith("|")]
    return [r for r in rows[2:] if not re.match(r"^\|[\s:|-]+\|$", r.strip())]


def check(phase, text):
    fails = []
    req = lambda ok, msg: ok or fails.append(msg)
    body = re.sub(r"```.*?```", "", text, flags=re.S)

    # RQ4 multi-pass
    m = re.search(r"^Pass:\s*(\d+)", text, re.M)
    req(m and int(m.group(1)) >= 2, "RQ4.1 Pass header missing or <2")
    for h in ["Summary", "Contradictions", "Rejected ideas", "Critique (pass 1)",
              "Revisions", "Self-critique", "Sources"]:
        req(section(text, h) is not None, f"missing section: ## {h}")
    crit = section(text, "Critique (pass 1)") or ""
    crit_lines = [l for l in crit.splitlines() if re.match(r"\s*- \[(PASS|FAIL|N/A)\]", l)]
    req(len(crit_lines) >= 5, f"RQ4.2 critique has {len(crit_lines)} checklist lines (<5)")
    fail_ids = re.findall(r"\[FAIL\]\s*([A-Z]{2}\d+\.\d+)", crit)
    req(fail_ids or "No FAIL found" in crit, "RQ4.2 critique has no [FAIL] and no 'No FAIL found; spot-checked:' statement")
    rev = section(text, "Revisions") or ""
    for fid in set(fail_ids):
        req(fid in rev, f"RQ4.3 revisions do not address {fid}")
    sc = section(text, "Self-critique") or ""
    req("Weakest part:" in sc and "A further pass should:" in sc, "RQ4.4 self-critique incomplete")

    # RQ3 honesty
    contra = [b for b in bullets(section(text, "Contradictions")) if "Decision:" in b]
    req(len(contra) >= MIN_CONTRA[phase], f"RQ3.1 {len(contra)} contradictions with Decision: (<{MIN_CONTRA[phase]})")
    req(len(bullets(section(text, "Rejected ideas"))) >= 3, "RQ3.2 <3 rejected ideas")

    # Sources
    src_body = section(text, "Sources") or ""
    listed = {}
    for l in src_body.splitlines():
        sm = re.match(r"\s*- \[S(\d+)\]\s*(.*)", l)
        if sm:
            listed[sm.group(1)] = sm.group(2)
    external = [k for k, v in listed.items() if not v.startswith("internal:") and "(unverified)" not in v]
    req(len(external) >= MIN_SOURCES[phase], f"RQ1.4 {len(external)} verified non-internal sources (<{MIN_SOURCES[phase]})")
    if phase == 1:
        peer = [k for k in external if "(peer)" in listed[k]]
        req(len(peer) >= 8, f"RQ1.4 {len(peer)} peer-reviewed sources (<8)")
    no_src = body.replace(src_body, "")
    cited = set(re.findall(r"\[S(\d+)\]", no_src))
    req(not (cited - set(listed)), f"RQ1.2 cited but not listed: {sorted(cited - set(listed), key=int)}")
    req(not (set(listed) - cited), f"RQ1.2 listed but never cited: {sorted(set(listed) - cited, key=int)}")

    # RQ1/RQ2 findings
    finds = blocks(body, r"^### F[\w-]*\..*$")
    req(len(finds) >= MIN_FINDINGS[phase], f"{len(finds)} findings (<{MIN_FINDINGS[phase]})")
    ev_total = ev_infer = 0
    for title, fb in finds:
        t = title.strip()[:50]
        req("- Claim:" in fb, f"RQ1.1 {t}: no Claim")
        evs = [l for l in fb.splitlines() if l.strip().startswith("- Evidence:")]
        req(evs, f"RQ1.1 {t}: no Evidence")
        for e in evs:
            ev_total += 1
            has_hard = re.search(r"\[S\d+\]", e) or re.search(r"mobbin\.com", e)
            req(has_hard or "inference:" in e, f"RQ1.1 {t}: evidence has no source/url/inference")
            if not has_hard:
                ev_infer += 1
        req("- Mechanism:" in fb, f"RQ2.2 {t}: no Mechanism")
        req("- So what for Happy:" in fb, f"RQ2.2 {t}: no So what for Happy")
    if ev_total:
        req(ev_infer / ev_total <= 0.30, f"RQ1.3 inference-only evidence {ev_infer}/{ev_total} >30%")

    # RQ2.1 banned vague words outside quotes, unless a number is on the line
    for line in body.replace(src_body, "").splitlines():
        bare = re.sub(r'"[^"]*"|“[^”]*”|`[^`]*`', "", line)
        if re.search(BANNED, bare, re.I) and not re.search(r"\d", bare):
            fails.append(f"RQ2.1 vague word without number: {line.strip()[:90]}")

    # Phase-specific structure
    if phase == 1:
        for tag in P1_TAGS:
            req(any(f"[{tag}]" in t for t, _ in finds), f"P1 topic not covered: [{tag}]")
    if phase == 2:
        apps = blocks_until_h3(body, r"^### App: .*$")
        req(len(apps) >= 10, f"P2 {len(apps)} app sections (<10)")
        for title, ab in apps:
            urls = set(re.findall(MOBBIN, ab))
            req(len(urls) >= 4, f"P2 {title.strip()}: {len(urls)} Mobbin URLs (<4)")
            req("Mascot mechanisms" in ab and "Non-mascot soul mechanisms" in ab,
                f"P2 {title.strip()}: missing mascot/non-mascot lists")
    if phase == 3:
        for h in ["Expression set", "Presence rules", "Voice", "Struggle and absence"]:
            req(section(text, h) is not None, f"P3 missing ## {h}")
        rows = table_rows(section(text, "Expression set"))
        req(len(rows) >= 8, f"P3 expression table {len(rows)} rows (<8)")
        req(all(re.search(r"\d", r) for r in rows), "P3 expression row without numeric motion values")
    if phase == 4:
        systems = re.findall(r"^## System: .*$", text, re.M)
        req(len(systems) >= 8, f"P4 {len(systems)} System sections (<8)")
        req(len(table_rows(section(text, "Phrase bank", "###"))) >= 15, "P4 phrase bank <15 Do/Don't rows")
        req(len(table_rows(section(text, "Haptic map", "###"))) >= 6, "P4 haptic map <6 rows")
    if phase == 5:
        for h in ["Type", "Spacing", "Color", "Radii and elevation", "Motion",
                  "Illustration", "Haptics", "Copy rules", "Diff vs current"]:
            req(section(text, h) is not None, f"P5 missing ## {h}")
        for r in table_rows(section(text, "Color")):
            req(re.search(r"\d+(\.\d+)?:1", r), f"P5 color row without contrast ratio: {r[:70]}")
        for r in table_rows(section(text, "Motion")):
            req(re.search(r"\d+\s*ms", r), f"P5 motion row without ms: {r[:70]}")
    if phase == 6:
        for h in ["Inventory", "Build order", "Measurement plan"]:
            req(section(text, h) is not None, f"P6 missing ## {h}")
        screens = blocks_until_h2(text, r"^## Screen: .*$")
        req(len(screens) >= 10, f"P6 {len(screens)} screen sections (<10)")
        for title, sb in screens:
            rows = table_rows(sb)
            for dim in P6_DIMS:
                row = next((r for r in rows if r.strip("| ").startswith(dim)), None)
                req(row, f"P6 {title.strip()}: missing row {dim}")
                if row:
                    last = [c for c in row.split("|") if c.strip()][-1]
                    req(re.search(r"P\d-F[\w-]+|T:", last), f"P6 {title.strip()}: {dim} has no Driven-by ref")
    return fails


def blocks_until_h3(text, pattern):
    """Sections that run until the next ### or ## heading (app sections keep their #### children)."""
    out = []
    for m in re.finditer(pattern, text, re.M):
        nxt = re.search(r"^#{2,3} ", text[m.end():], re.M)
        out.append((m.group(0), text[m.end(): m.end() + nxt.start()] if nxt else text[m.end():]))
    return out


def blocks_until_h2(text, pattern):
    out = []
    for m in re.finditer(pattern, text, re.M):
        nxt = re.search(r"^## ", text[m.end():], re.M)
        out.append((m.group(0), text[m.end(): m.end() + nxt.start()] if nxt else text[m.end():]))
    return out


if __name__ == "__main__":
    phase, path = int(sys.argv[1]), sys.argv[2]
    fails = check(phase, open(path, encoding="utf-8").read())
    for f in fails:
        print("FAIL", f)
    print(f"phase {phase}: {'PASS' if not fails else f'FAIL ({len(fails)})'}")
    sys.exit(1 if fails else 0)
