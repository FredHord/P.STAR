#!/usr/bin/env python3
"""Generate the Claude Artifact copy of costing.html.

costing.html is written for this repo: it is a full HTML document, it links to
the other pages, and it prints and downloads. A published Artifact runs in a
locked-down frame where none of that holds — window.print() and
window.confirm() do nothing, script-driven downloads are inert, and the host
supplies the document skeleton. This script applies those adaptations so the
two never drift by hand.

    python3 tools/build-artifact.py > build/artifact.html

Every substitution asserts it matched exactly once, so a change to costing.html
that invalidates one of them fails loudly instead of silently shipping a
broken page.
"""
import re
import sys
import pathlib

SRC = pathlib.Path(__file__).resolve().parent.parent / "costing.html"


def sub(s, old, new, count=1):
    found = s.count(old)
    assert found == count, f"expected {count} of {old[:70]!r}, found {found}"
    return s.replace(old, new)


def build(s):
    # --- host supplies the document skeleton ------------------------------
    s = re.sub(r"^<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n", "", s)
    s = sub(s, '<meta charset="utf-8" />\n', "")
    s = sub(s, '<meta name="viewport" content="width=device-width, initial-scale=1" />\n', "")
    s = sub(s, '<meta name="description" content="Build an FSF production cost sheet: '
               'pick styles, washes, quantities and embellishments; every price stays editable." />\n', "")
    s = sub(s, '<link rel="icon" type="image/png" href="assets/img/favicon.png">\n', "")
    s = sub(s, "</head>\n<body>\n", "")
    s = sub(s, "\n</body>\n</html>\n", "\n")

    # --- a name, not a caption, for the gallery and tab -------------------
    s = sub(s, "<title>FSF Production Cost Sheet</title>", "<title>FSF Cost Sheet</title>")

    # --- single-theme dark, declared so controls and scrollbars follow ----
    s = sub(s, "    --gutter:20px;\n  }", "    --gutter:20px;\n    color-scheme:dark;\n  }")

    # --- the frame refuses window.print() ---------------------------------
    s = sub(s, '      <button class="btn" id="btnPrint">Print / PDF</button>\n', "")
    s = sub(s, '      <button class="btn" id="invPrint">Print / save PDF</button>\n', "")
    s = sub(s, '$("#invPrint").addEventListener("click", () => window.print());\n', "")
    s = sub(s, '      <button class="btn" id="repPrint">Print / save PDF</button>\n', "")
    s = sub(s, '$("#repPrint").addEventListener("click", () => window.print());\n', "")
    # without printing, say where a PDF comes from instead
    s = sub(s,
            'This banner is on screen only — it does not print.</div>` : ""}',
            'This banner is on screen only.</div>` : ""}')
    s = sub(s, '    <button class="btn" id="btnPrint2">Print / PDF</button>\n', "")
    s = sub(s, '<button class="btn" id="btnCsv">Export CSV</button>',
               '<button class="btn" id="btnCsv">Copy as CSV</button>')

    # --- downloads are inert in the frame; copy out instead ---------------
    s = sub(s, """const doPrint = () => window.print();
$("#btnPrint").addEventListener("click", doPrint);
$("#btnPrint2").addEventListener("click", doPrint);

""", "")

    s = sub(s, """$("#btnCsv").addEventListener("click", () => {
  const stamp = new Date().toISOString().slice(0,10);
  download(`FSF-cost-sheet-${stamp}.csv`, csv(lastResults, lastFees), "text/csv;charset=utf-8");
});""",
            """$("#btnCsv").addEventListener("click", async () => {
  const btn = $("#btnCsv"), text = csv(lastResults, lastFees);
  try{
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied";
  }catch(err){
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    btn.textContent = document.execCommand("copy") ? "Copied" : "Press \u2318C to copy";
    ta.remove();
  }
  setTimeout(() => { btn.textContent = "Copy as CSV"; }, 1800);
});""")

    # the download helper has no caller left
    s = re.sub(r"\nfunction download\(name, text, mime\)\{.*?\n\}\n", "\n", s, flags=re.S)
    assert "function download(" not in s, "download() still present"

    # --- the frame's confirm() returns false without asking ---------------
    s = sub(s, "const esc = s =>", """/* The artifact frame refuses the browser's confirm dialog: it returns false
   without showing anything, so destructive actions arm on the button. */
function armConfirm(btn, label, done){
  if(btn.dataset.armed === "1"){
    btn.dataset.armed = "";
    btn.textContent = btn.dataset.orig;
    done();
    return;
  }
  btn.dataset.orig = btn.dataset.orig || btn.textContent;
  btn.dataset.armed = "1";
  btn.textContent = label;
  clearTimeout(btn._armTimer);
  btn._armTimer = setTimeout(() => {
    btn.dataset.armed = "";
    btn.textContent = btn.dataset.orig;
  }, 4000);
}

const esc = s =>""")

    s = sub(s, """    const used = S.lines.some(L => L.fabric === f.name || L.rib === f.name);
    if(used && !window.confirm(`"${f.name}" is used by a line in this order. Remove it anyway? Those lines will lose their fabric price.`)) return;
    S.fabrics.splice(+del.dataset.delfab, 1);
    renderRates(); renderLines(); refresh();""",
            """    const used = S.lines.some(L => L.fabric === f.name || L.rib === f.name);
    const go = () => {
      S.fabrics.splice(+del.dataset.delfab, 1);
      renderRates(); renderLines(); refresh();
    };
    if(used) armConfirm(del, "Used by a line — tap again", go);
    else go();""")

    s = sub(s, """  if(!window.confirm("Clear every line and put all rates back to Fred's quoted prices?")) return;
  S = freshState(); S.demo = false;
  hideInvoice(); hideReport();
  renderRates(); renderInvForm(); renderLines(); refresh();
});""",
            """  armConfirm(e.target, "Tap again to clear everything", () => {
    S = freshState(); S.demo = false;
    hideInvoice(); hideReport();
    renderRates(); renderInvForm(); renderLines(); refresh();
  });
});""")

    assert "window.confirm(" not in s and "window.print(" not in s
    return s


if __name__ == "__main__":
    sys.stdout.write(build(SRC.read_text()))
