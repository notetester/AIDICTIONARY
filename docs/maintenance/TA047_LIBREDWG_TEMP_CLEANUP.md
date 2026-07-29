# TA-047 LibreDWG temporary-path cleanup

Cleanup PR: `#PR_NUMBER_PLACEHOLDER`

The temporary LibreDWG artifact workflows were removed after the canonical payload was merged and replayed from GAME main.

Removed workflow paths:

```text
.github/workflows/tmp-libredwg-i386-artifact.yml
.github/workflows/tmp-libredwg-parser-artifact.yml
.github/workflows/tmp-libredwg-source-artifact.yml
```

Closed superseded pull requests:

- #4 — temporary parser artifact trigger
- #2 — temporary worker URL bridge

Removed temporary branches include the TA-047 public transfer/publisher branches and superseded LibreDWG trigger branches.
