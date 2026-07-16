# Clause segmentation, comparison, and explanation pipeline

This stage implements Section 5 Steps 2, 4, 5, and 6 of the MVP specification. It
is a product risk signal, not legal advice or a substitute for lawyer review.

## Processing sequence

1. The authenticated upload route extracts PDF or DOCX text and stores the
   document with `status = processing`.
2. An in-process background task sends the text to `gemini-3.5-flash` with a
   JSON schema and an instruction to return only JSON.
3. The model returns ordered clause text plus one of the eight baseline
   categories. `Uncategorized` is allowed only when no supported category fits.
4. Each clause is embedded with `gemini-embedding-2`, 768 dimensions, and the
   exact sentence-similarity/category formatter used by the baseline catalog.
5. PostgreSQL finds the closest baseline in the same category using cosine
   distance (`<=>`). The application stores both the match and similarity.
6. Risk labels are assigned and the weighted document score is calculated.
7. Only `caution` and `risky` clauses are sent to Gemini with their exact closest
   baseline. Structured output separates the fair baseline norm from the
   uploaded clause's specific deviation, and the service combines them into a
   two-sentence explanation. Safe clauses skip this stage.
8. Clause rows, vectors, matches, labels, explanations, and completed status are
   committed in one transaction. A processing error rolls back clause writes
   and marks the document `failed` with a safe user-facing message.

## Tables

`clauses` stores `document_id`, full clause text, category, risk label, nullable
explanation, original order, closest baseline ID, and similarity score.
`clause_embeddings` stores one 768-dimensional vector and model name per clause.
The model name is stored even though it is fixed today, so incompatible vectors
cannot silently enter later comparisons.

## Risk decision

- `safe`: cosine similarity is at least 0.84.
- `caution`: similarity is at least 0.72 but below 0.84, or a high-similarity
  clause contains a bounded but notable deviation such as six revision rounds.
- `risky`: similarity is below 0.72, there is no same-category baseline match,
  the clause is uncategorized, or a narrow rule detects clearly one-sided legal
  effect such as unlimited liability or an explicit no-kill-fee term.

The narrow overrides are deliberate. Embeddings measure semantic relatedness,
so "a fair 25% kill fee" and "no kill fee is payable" can have high similarity
even though their effects are opposite. The rules cover only explicit wording;
the explanation stage describes the stored evidence but cannot change the label.

## Explanation grounding

Gemini does not receive an open-ended request for legal analysis. Each request
contains only the flagged clause, its already assigned category and risk label,
and the exact closest baseline text. The JSON schema requires one
`baseline_comparison` sentence and one `specific_deviation` sentence. The
application validates complete clause coverage, unique order indexes, field
presence, length, and sentence count before joining the two sentences and
storing them. This makes the baseline-versus-uploaded comparison visible in the
output and reduces room for unsupported legal reasoning.

For `Uncategorized` clauses or any missing baseline, the prompt forbids a
fabricated comparison. It instead requires a general no-baseline explanation
and a recommendation for manual or qualified-professional review.

The overall score is a simple weighted total: risky clauses contribute 3,
caution clauses contribute 1, and safe clauses contribute 0.

## Edge cases

- Empty or malformed model output fails validation and marks the document
  failed rather than storing partial clauses.
- Malformed, incomplete, duplicated, or overlong explanation output also fails
  validation. The transaction starts only after Gemini explanations succeed, so
  a generation failure cannot leave a partially completed analysis.
- Unsupported subjects are stored as `Uncategorized`, receive no fabricated
  baseline match, and are conservatively labeled risky.
- One-clause contracts are valid. Structured output is capped at 200 clauses;
  longer outputs fail clearly instead of overloading the database.
- Extracted text is capped at 750,000 characters before the model call.
- Embeddings are generated in rate-aware batches of 16 with retry/pacing for
  the Gemini free tier.

The background task is appropriate for this single-instance MVP. A deployed
multi-instance service should replace it with a durable job queue so analysis
survives process restarts.

## References

- [Gemini structured output](https://ai.google.dev/gemini-api/docs/generate-content/structured-output)
- [Gemini 3.5 Flash model](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash)
- [Gemini embeddings](https://ai.google.dev/gemini-api/docs/embeddings)
- [pgvector cosine distance and HNSW](https://github.com/pgvector/pgvector)
