# Fair baseline methodology

This catalog is a product-analysis reference set, not a collection of copied
templates and not legal advice. Its clauses are original, generalized examples
intended to represent clear and comparatively balanced freelance-contract
patterns. Enforceability and market practice vary by jurisdiction and type of
work, so a qualified lawyer should review the set before production use.

## What "fair" means here

The catalog favors terms that are definite, reciprocal where appropriate,
proportionate to the project value, and tied to events a party can verify. In
particular, it favors:

- prompt payment dates, funded milestones, and payment of undisputed amounts;
- rights transfer only for identified, paid deliverables, with pre-existing
  tools and third-party materials treated separately;
- notice and an opportunity to cure ordinary breaches;
- payment for work completed on termination and moderate, non-punitive
  cancellation charges for genuinely reserved capacity;
- liability allocated to the party controlling the relevant material or risk,
  with a project-fee cap and carve-outs for serious misconduct;
- finite revision rounds and written approval before chargeable scope changes;
- mutual confidentiality with customary exclusions and reasonable safeguards;
- modest, simple late charges with notice, grace periods, and legal caps.

## Primary reference points

- [Upwork fixed-price payment protection](https://support.upwork.com/hc/en-us/articles/211063748-How-Fixed-Price-Payment-Protection-works-for-freelancers-on-Upwork): funded milestones, defined delivery, and review periods.
- [Upwork guidance on freelance contracts](https://www.upwork.com/resources/how-to-make-freelance-contract): defined payment, ownership, termination, revisions, confidentiality, and responsibility provisions.
- [Upwork NDA guidance](https://support.upwork.com/hc/en-us/articles/18527060418579-How-non-disclosure-agreements-NDAs-work-on-Upwork): limited project use, return or destruction, background technology, and post-payment IP transfer.
- [Fiverr Payment Terms](https://www.fiverr.com/legal-portal/legal-terms/payment-terms-of-service): full payment before IP transfer and revisions limited to the agreed service rather than added scope.
- [Freelancers Union Contract Creator](https://freelancersunion.org/contract/): express options for payment, revisions, kill fees, and late fees.
- [AIGA Standard Form of Agreement for Design Services](https://www.aiga.org/sites/default/files/2023-11/Standardformofagreement_2022update.pdf): payment for work performed, a moderate early-termination fee, background-IP treatment, and liability limits.
- [New York Department of Labor freelance-worker guidance](https://dol.ny.gov/freelance-isnt-free-act): written terms and timely, full payment, including a model agreement.
- [U.S. Copyright Office Circular 30](https://www.copyright.gov/circs/circ30.pdf): the limited statutory requirements for commissioned work to qualify as a work made for hire.

## Embedding design

Every embedding input uses the same normalized format:

```text
task: sentence similarity | query: Category: <category>
Clause: <clause text>
```

Clause Guard uses Google's latest stable `gemini-embedding-2` model and requests
768 dimensions. Google recommends 768 as one of the model's Matryoshka output
sizes, and it fits pgvector's indexed `vector` type while keeping storage and
similarity calculations modest. Gemini Embedding 2 normalizes truncated vectors
automatically. The `task: sentence similarity` prefix follows Google's guidance
for symmetric semantic-textual comparisons rather than search/retrieval.

The model name is stored with every vector. Later uploaded clauses **must** use
this same formatter, model, dimension count, and category context, and must be
compared only against baselines in the same category. Embeddings produced by
different model versions are incompatible even when their dimensions match, so
a model change requires re-embedding both the baseline and uploaded clauses.

References: [Gemini embeddings](https://ai.google.dev/gemini-api/docs/embeddings),
[Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing), and
[pgvector indexing limits](https://github.com/pgvector/pgvector#hnsw).
