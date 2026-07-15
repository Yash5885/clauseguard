export const BASELINE_CATEGORIES = [
  "Payment Terms",
  "IP Rights",
  "Termination",
  "Liability",
  "Revisions",
  "Confidentiality",
  "Kill Fee",
  "Late Payment Penalty",
];

export const baselineClausesByCategory = {
  "Payment Terms": [
    {
      clauseText:
        "The Client will pay 30% of the project fee when this agreement is signed and the remaining 70% within 15 calendar days after final delivery and acceptance.",
      principle: "Reasonable deposit plus a defined final-payment date",
    },
    {
      clauseText:
        "Each fixed-price milestone must be funded before the Freelancer begins that milestone, and the funded amount will be released when the milestone deliverables are accepted.",
      principle: "Funded milestones used by freelance marketplaces",
    },
    {
      clauseText:
        "The Freelancer will invoice approved hours weekly, and the Client will pay each undisputed invoice within 14 calendar days of receipt.",
      principle: "Frequent invoicing and a short, definite payment period",
    },
    {
      clauseText:
        "The Client will pay 50% of the project fee before work begins and 50% within 10 calendar days after the final deliverables are submitted.",
      principle: "Common 50/50 fixed-project structure",
    },
    {
      clauseText:
        "For ongoing services, the Client will pay the monthly retainer in advance on the first business day of each month; unused hours do not carry forward unless the parties agree in writing.",
      principle: "Advance-funded retainers with clear capacity rules",
    },
    {
      clauseText:
        "The Client will review each delivery within five business days and either accept it or identify specific material departures from the agreed scope; absent a response, the delivery will be deemed accepted.",
      principle: "Objective review window and deemed acceptance",
    },
    {
      clauseText:
        "A good-faith dispute over part of an invoice does not permit the Client to withhold the undisputed balance, which remains due on the original payment date.",
      principle: "Protect payment of undisputed earned compensation",
    },
    {
      clauseText:
        "The Client will reimburse reasonable, pre-approved project expenses at cost within 15 calendar days after receiving receipts or equivalent documentation.",
      principle: "Prior approval and documentation for expenses",
    },
    {
      clauseText:
        "The stated fees exclude sales, use, value-added, or similar transaction taxes; the Client is responsible for applicable transaction taxes, while each party remains responsible for its own income taxes.",
      principle: "Clear allocation of transaction and income taxes",
    },
    {
      clauseText:
        "All fees are stated and payable in the currency shown in the statement of work, and neither party may add an undisclosed currency-conversion or payment-processing charge.",
      principle: "Transparent currency and payment costs",
    },
    {
      clauseText:
        "The initial deposit reserves project capacity and will be credited against the project fee; once work begins, it is refundable only to the extent it exceeds fees earned and approved costs incurred.",
      principle: "Reservation protection without an excessive forfeiture",
    },
    {
      clauseText:
        "A delay in Client feedback or materials will extend the schedule by a reasonable period but will not postpone payment for milestones already completed and accepted.",
      principle: "Client delay should not defer earned milestone payments",
    },
    {
      clauseText:
        "The Freelancer may withhold final production files until all amounts due for the corresponding deliverable have been paid, while providing reasonable review copies during the approval process.",
      principle: "Final-file release tied to full payment",
    },
    {
      clauseText:
        "Unless a statement of work specifies an earlier date, a complete and accurate invoice is due no later than 30 calendar days after receipt.",
      principle: "Clear Net-30 ceiling reflected in freelancer-protection guidance",
    },
    {
      clauseText:
        "The Client must describe any invoice dispute in writing within seven business days, including the amount disputed and the reason, and the parties will promptly work in good faith to resolve it.",
      principle: "Prompt, specific dispute notice",
    },
    {
      clauseText:
        "For milestone work, acceptance and payment are determined separately for each milestone so that a later dispute does not reopen or delay payment for previously accepted work.",
      principle: "Independent milestone acceptance and payment",
    },
  ],
  "IP Rights": [
    {
      clauseText:
        "Upon full payment, the Freelancer assigns to the Client the copyright in the final deliverables created specifically for the project, excluding all pre-existing tools, templates, methods, and know-how.",
      principle: "Paid transfer of project-specific work with background-IP carve-out",
    },
    {
      clauseText:
        "Upon full payment, the Client receives an exclusive, worldwide, perpetual license to use, reproduce, adapt, distribute, display, and commercialize the final deliverables for the purposes described in the statement of work.",
      principle: "Explicit paid exclusive license where assignment is unnecessary",
    },
    {
      clauseText:
        "The Freelancer retains ownership of the deliverables and, upon full payment, grants the Client a worldwide, perpetual, non-exclusive license for the Client's internal business and marketing use.",
      principle: "Limited license alternative for reusable creative work",
    },
    {
      clauseText:
        "Editable source files are included only when expressly listed as deliverables; otherwise the Client receives the agreed final export files and the rights necessary to use them.",
      principle: "Separate source-file scope from final-deliverable rights",
    },
    {
      clauseText:
        "Any third-party materials included in a deliverable will be identified to the Client and remain subject to their original license terms, which the Client agrees to follow.",
      principle: "Transparent treatment of stock and third-party assets",
    },
    {
      clauseText:
        "After the Client publicly releases the project, the Freelancer may display the final work in a private or public portfolio and accurately identify the Client, subject to the confidentiality obligations in this agreement.",
      principle: "Portfolio right balanced with confidentiality and launch timing",
    },
    {
      clauseText:
        "The Client retains all rights in materials it supplies and grants the Freelancer a limited license to use those materials solely to perform the services.",
      principle: "Client ownership plus purpose-limited working permission",
    },
    {
      clauseText:
        "The Freelancer represents that, to its knowledge, the original portions of the final deliverables do not infringe another party's intellectual-property rights and that any licensed materials will be disclosed.",
      principle: "Qualified originality and non-infringement assurance",
    },
    {
      clauseText:
        "The Client represents that it has permission to use every logo, image, text, dataset, and other material it provides and is responsible for claims arising from unauthorized Client materials.",
      principle: "Each party bears responsibility for materials it contributes",
    },
    {
      clauseText:
        "Rights transfer applies only to final deliverables selected and paid for by the Client; preliminary concepts, rejected drafts, and unused proposals remain the Freelancer's property.",
      principle: "Assignment limited to selected, compensated work",
    },
    {
      clauseText:
        "To the extent a deliverable qualifies as a work made for hire under applicable law, the parties agree it will be treated as such; otherwise the Freelancer assigns the agreed rights upon full payment.",
      principle: "Written work-made-for-hire language with an assignment fallback",
    },
    {
      clauseText:
        "To the extent permitted by law, the Freelancer waives or agrees not to assert moral rights in the final paid deliverables, except that the Freelancer may claim authorship in a permitted portfolio use.",
      principle: "Limited moral-rights treatment with attribution balance",
    },
    {
      clauseText:
        "The Freelancer retains ownership of reusable code, libraries, design systems, processes, and general skills developed before or independently of the project and grants the Client a perpetual license to any such material embedded in a paid deliverable.",
      principle: "Background technology retained with an embedded-use license",
    },
    {
      clauseText:
        "Open-source software remains governed by its applicable license, and the Freelancer will not knowingly include a component that requires disclosure of the Client's proprietary source code without prior written approval.",
      principle: "Open-source compliance and advance disclosure",
    },
    {
      clauseText:
        "No ownership or license in a deliverable transfers until the Client has paid all fees and approved expenses attributable to that deliverable.",
      principle: "IP transfer conditioned on full payment",
    },
    {
      clauseText:
        "Any license granted under this agreement will state its permitted uses, territory, duration, exclusivity, and transfer rights; uses outside that scope require a separate written license.",
      principle: "Specific license scope avoids hidden or unlimited rights",
    },
  ],
  Termination: [
    {
      clauseText:
        "Either party may terminate this agreement for convenience by giving the other party 14 calendar days' written notice.",
      principle: "Mutual convenience termination with reasonable notice",
    },
    {
      clauseText:
        "Either party may terminate for a material breach if the breaching party does not cure the breach within 10 calendar days after receiving written notice describing it.",
      principle: "Notice and cure before termination for breach",
    },
    {
      clauseText:
        "A party may terminate immediately if the other party requests unlawful work, becomes insolvent, or engages in fraud or material misconduct connected with the project.",
      principle: "Immediate exit for serious legal or solvency risk",
    },
    {
      clauseText:
        "On termination, the Client will pay for all services performed, accepted milestones, authorized expenses, and non-cancellable commitments incurred through the termination date.",
      principle: "Compensation for earned work and committed costs",
    },
    {
      clauseText:
        "After payment of the final invoice, the Freelancer will provide the Client with completed work in progress that is reasonably usable in its then-current form.",
      principle: "Paid transition materials rather than forfeiture",
    },
    {
      clauseText:
        "If an undisputed invoice remains unpaid seven days after written notice, the Freelancer may suspend services and may terminate if payment is not made within a further seven days.",
      principle: "Graduated suspension and termination for nonpayment",
    },
    {
      clauseText:
        "If Client materials, decisions, or access are delayed for more than 15 business days, the Freelancer may reschedule the work or terminate after giving written notice and a reasonable opportunity to restart.",
      principle: "Fair exit from prolonged client-caused delay",
    },
    {
      clauseText:
        "A termination notice must be sent to the notice address or email stated in the agreement and must identify the effective date and whether termination is for convenience or cause.",
      principle: "Clear written notice mechanics",
    },
    {
      clauseText:
        "Payment, confidentiality, intellectual-property, dispute, and liability provisions that by their nature should continue will survive termination.",
      principle: "Limited survival of provisions that still need effect",
    },
    {
      clauseText:
        "The Freelancer will refund any prepaid amount that exceeds earned fees, authorized expenses, and an applicable reasonable cancellation fee within 15 calendar days after final accounting.",
      principle: "Return unearned funds after transparent reconciliation",
    },
    {
      clauseText:
        "All amounts properly due on termination will be itemized in a final invoice payable within 15 calendar days.",
      principle: "Prompt, itemized close-out payment",
    },
    {
      clauseText:
        "Termination does not revoke rights in deliverables the Client has already accepted and fully paid for, but it grants no rights in unpaid or rejected work.",
      principle: "Preserve paid rights without giving away unpaid work",
    },
    {
      clauseText:
        "If the Freelancer terminates for convenience, the Freelancer will provide reasonable transition assistance for up to five hours at no additional charge and will refund unearned prepaid fees.",
      principle: "Balanced freelancer exit and practical handoff",
    },
    {
      clauseText:
        "The parties may terminate at any time by mutual written agreement that states the final payment, delivery, and rights arrangements.",
      principle: "Mutual termination with explicit close-out terms",
    },
    {
      clauseText:
        "Termination of one statement of work does not automatically terminate another statement of work unless the notice expressly says so.",
      principle: "Project-specific termination for ongoing relationships",
    },
    {
      clauseText:
        "Neither party will forfeit accrued payment rights or be charged a punitive termination amount; any cancellation charge must reflect completed work, reserved capacity, or reasonably incurred loss.",
      principle: "Compensatory rather than punitive termination consequences",
    },
  ],
  Liability: [
    {
      clauseText:
        "Except for the stated carve-outs, each party's total liability arising from the project will not exceed the fees paid or payable under the applicable statement of work.",
      principle: "Predictable liability cap tied to project value",
    },
    {
      clauseText:
        "Neither party will be liable for indirect, incidental, special, punitive, or consequential damages, including lost profits, when those damages were not the direct and foreseeable result of the breach.",
      principle: "Mutual exclusion of remote consequential losses",
    },
    {
      clauseText:
        "The liability limits do not apply to fraud, willful misconduct, gross negligence, unpaid fees, or a party's unauthorized use or disclosure of the other party's intellectual property or confidential information.",
      principle: "Standard carve-outs for serious misconduct and core obligations",
    },
    {
      clauseText:
        "The Client is responsible for reviewing and approving factual claims, legal notices, regulated content, and final proofs before publication or use.",
      principle: "Client controls final business and regulatory approval",
    },
    {
      clauseText:
        "For a material defect caused by the Freelancer, the Client's first remedy is prompt correction or re-performance at no additional charge, if reasonably possible.",
      principle: "Opportunity to cure before damages",
    },
    {
      clauseText:
        "The Freelancer does not guarantee a particular level of sales, traffic, funding, ranking, audience response, or other business outcome unless a measurable guarantee is expressly stated in writing.",
      principle: "No guarantee of outcomes outside the freelancer's control",
    },
    {
      clauseText:
        "Each party will defend and indemnify the other against third-party claims arising from materials that the indemnifying party supplied without the necessary rights.",
      principle: "Mutual, contribution-based IP indemnity",
    },
    {
      clauseText:
        "An indemnified party must give prompt notice of a claim, allow the indemnifying party reasonable control of the defense, and provide reasonable cooperation; no settlement may impose obligations on the indemnified party without consent.",
      principle: "Balanced indemnity procedure and settlement control",
    },
    {
      clauseText:
        "Each party will maintain reasonable backups of materials in its control, and the Freelancer is not responsible for loss caused solely by the Client's failure to preserve Client-controlled data.",
      principle: "Shared responsibility for data under each party's control",
    },
    {
      clauseText:
        "The Freelancer is not liable for defects introduced by Client modifications or use of a deliverable outside the documented specifications, unless the Freelancer approved that modification or use in writing.",
      principle: "No liability for unapproved downstream changes",
    },
    {
      clauseText:
        "Third-party platforms, hosting, fonts, stock assets, and software are subject to their own terms and availability, and the Freelancer is responsible only for exercising reasonable care in selecting and integrating them.",
      principle: "Reasonable-care standard for third-party dependencies",
    },
    {
      clauseText:
        "Nothing in this agreement limits a liability that applicable law does not permit the parties to limit.",
      principle: "Mandatory-law savings clause",
    },
    {
      clauseText:
        "Where both parties contributed to a loss, responsibility will be allocated in proportion to each party's proven contribution rather than imposed entirely on one party.",
      principle: "Proportionate responsibility",
    },
    {
      clauseText:
        "Neither party is liable for delay caused by events beyond its reasonable control, provided it promptly notifies the other party and takes reasonable steps to reduce the delay.",
      principle: "Mutual, mitigated force-majeure protection",
    },
    {
      clauseText:
        "The Client is responsible for industry-specific legal or regulatory review, while the Freelancer remains responsible for complying with laws generally applicable to performing the services.",
      principle: "Allocate specialist compliance to the party with subject-matter control",
    },
    {
      clauseText:
        "If the project reasonably requires professional or cyber insurance beyond the Freelancer's existing coverage, the required limits and any incremental cost will be agreed before work begins.",
      principle: "Proportionate, disclosed insurance requirements",
    },
  ],
  Revisions: [
    {
      clauseText:
        "The project fee includes two rounds of revisions to each listed deliverable, provided the requested revisions remain within the original scope.",
      principle: "Defined included revision rounds",
    },
    {
      clauseText:
        "The Client will provide one consolidated set of feedback per revision round through the designated project contact.",
      principle: "Consolidated feedback prevents conflicting rework",
    },
    {
      clauseText:
        "A revision adjusts an agreed deliverable without materially changing its purpose, audience, format, quantity, or approved direction; any such material change is a scope change.",
      principle: "Objective distinction between revision and new scope",
    },
    {
      clauseText:
        "The Freelancer will not begin out-of-scope changes until the parties approve a written change order describing the additional fee and schedule impact.",
      principle: "Written change control before extra work",
    },
    {
      clauseText:
        "Revisions beyond the included rounds will be billed at the stated hourly rate or at a fixed fee agreed in writing before the additional work begins.",
      principle: "Transparent price for additional revisions",
    },
    {
      clauseText:
        "The Client will provide revision feedback within five business days after each delivery; later feedback may extend the delivery schedule by a comparable period.",
      principle: "Mutual timing responsibility",
    },
    {
      clauseText:
        "A change in scope will result in a reasonable adjustment to fees, milestones, and delivery dates based on the additional work requested.",
      principle: "Budget and schedule move with added scope",
    },
    {
      clauseText:
        "If the Client neither approves a delivery nor requests an in-scope revision within seven business days, that delivery will be deemed accepted for scheduling and invoicing purposes.",
      principle: "Finite review period and deemed acceptance",
    },
    {
      clauseText:
        "Correction of the Freelancer's failure to meet an objective written requirement does not count as a paid revision round.",
      principle: "Freelancer fixes its own errors without consuming revisions",
    },
    {
      clauseText:
        "A request to return to an earlier direction after the Client approved a later direction counts as a new revision round and may require a schedule adjustment.",
      principle: "Client reversals are additional rework",
    },
    {
      clauseText:
        "The Client will appoint one person authorized to approve work and resolve conflicting stakeholder feedback, and the Freelancer may rely on that person's instructions.",
      principle: "Single accountable approval channel",
    },
    {
      clauseText:
        "A request for a new concept, deliverable, platform, language, size, or audience is outside scope and requires a separate estimate.",
      principle: "Concrete examples of new scope",
    },
    {
      clauseText:
        "Revisions requested after final acceptance or more than 30 days after delivery will be treated as new work unless they correct a latent defect covered by this agreement.",
      principle: "Reasonable close of the revision window",
    },
    {
      clauseText:
        "The Client is responsible for the accuracy and completeness of final text, data, names, prices, and other Client-supplied content that it approves.",
      principle: "Client approval of client-controlled content",
    },
    {
      clauseText:
        "Revision allowances apply separately to each milestone and cannot be transferred to expand the scope of another milestone.",
      principle: "Milestone-specific revision accounting",
    },
    {
      clauseText:
        "Before performing chargeable revision work, the Freelancer will identify why the request is outside the included allowance and obtain written Client approval of the additional charge.",
      principle: "No surprise revision charges",
    },
  ],
  Confidentiality: [
    {
      clauseText:
        "Each party will protect the other party's confidential information and use it only to perform or receive the services under this agreement.",
      principle: "Mutual confidentiality and purpose limitation",
    },
    {
      clauseText:
        "Confidential information means non-public business, technical, financial, customer, security, or project information that is marked confidential or that a reasonable person would understand to be confidential.",
      principle: "Objective definition, not an unlimited label",
    },
    {
      clauseText:
        "Confidential information excludes information that the recipient can show was already lawfully known, becomes public without breach, is independently developed, or is received lawfully from a third party without a duty of confidence.",
      principle: "Standard confidentiality exclusions",
    },
    {
      clauseText:
        "A party required by law to disclose confidential information may do so after giving prompt notice when legally permitted and reasonably cooperating in efforts to limit the disclosure.",
      principle: "Lawful compelled-disclosure procedure",
    },
    {
      clauseText:
        "A recipient may share confidential information only with personnel and contractors who need it for the project and who are bound by confidentiality duties at least as protective as these terms.",
      principle: "Need-to-know access with downstream protection",
    },
    {
      clauseText:
        "Neither party may use the other's confidential information to compete unfairly, solicit disclosed customers, or pursue a purpose unrelated to the project.",
      principle: "Use restriction tied to disclosed information rather than broad noncompete",
    },
    {
      clauseText:
        "Each party will use reasonable administrative, technical, and physical safeguards appropriate to the sensitivity of the confidential information it receives.",
      principle: "Reasonable security rather than an absolute guarantee",
    },
    {
      clauseText:
        "At the disclosing party's written request or when the project ends, the recipient will return or securely destroy confidential materials, except for legally required or automatically archived copies that remain protected.",
      principle: "Return or destruction with practical retention exceptions",
    },
    {
      clauseText:
        "Confidentiality obligations continue for three years after disclosure, while qualifying trade secrets remain protected for as long as they retain trade-secret status under applicable law.",
      principle: "Finite ordinary term with continuing trade-secret protection",
    },
    {
      clauseText:
        "The Freelancer will not publish Client work, results, or identifying details in a portfolio or case study before public launch or without the Client's written consent when the work remains confidential.",
      principle: "Portfolio use subordinate to confidentiality",
    },
    {
      clauseText:
        "A party that discovers unauthorized access to the other's confidential information will notify the other party promptly and reasonably cooperate in containing and investigating the incident.",
      principle: "Prompt, cooperative incident response",
    },
    {
      clauseText:
        "Information is not confidential merely because it relates to the project; the restrictions apply only when the information meets the definition in this agreement.",
      principle: "Prevents overbroad secrecy claims",
    },
    {
      clauseText:
        "The Freelancer will use Client credentials only for authorized project tasks, will not share them except with approved personnel, and will delete stored credentials when access is no longer needed.",
      principle: "Specific protection for operational credentials",
    },
    {
      clauseText:
        "The parties may disclose this agreement and project records to their lawyers, accountants, insurers, and financing sources who have a professional or contractual duty to keep them confidential.",
      principle: "Practical advisor and financing disclosure",
    },
    {
      clauseText:
        "Disclosure of confidential information does not transfer ownership or grant a license except the limited right necessary to perform the project.",
      principle: "Confidential disclosure is not an IP transfer",
    },
    {
      clauseText:
        "Because unauthorized disclosure may cause harm that money alone cannot fully remedy, either party may seek appropriate equitable relief in addition to other remedies available under law.",
      principle: "Mutual, non-exclusive remedy for serious disclosure",
    },
  ],
  "Kill Fee": [
    {
      clauseText:
        "If the Client cancels for convenience after work begins, the Client will pay for work completed and approved costs through cancellation plus 25% of the remaining project fee as a cancellation fee.",
      principle: "AIGA-style early termination fee plus earned compensation",
    },
    {
      clauseText:
        "On Client cancellation, the Freelancer may retain the deposit only up to the amount of earned fees, committed costs, and the agreed cancellation fee, and will refund any excess.",
      principle: "Deposit reconciled rather than automatically forfeited",
    },
    {
      clauseText:
        "If the Client cancels more than five business days before the scheduled start date, the cancellation fee is 10% of the project fee; no additional amount is due beyond non-refundable approved costs.",
      principle: "Modest capacity-reservation fee before work starts",
    },
    {
      clauseText:
        "If the Client cancels after the scheduled start but before the first milestone delivery, the Client will pay earned fees and a kill fee equal to 25% of the unperformed project fee.",
      principle: "Stage-based early cancellation fee",
    },
    {
      clauseText:
        "If the Client cancels after reviewing the first complete draft, the Client will pay earned fees and 40% of the remaining project fee to compensate for reserved capacity and displaced work.",
      principle: "Higher but proportionate fee after substantial creative investment",
    },
    {
      clauseText:
        "If the Client cancels after the Freelancer has completed at least 75% of the agreed work, the total cancellation payment will not exceed the full project fee plus approved expenses.",
      principle: "Near-completion compensation capped at the contract value",
    },
    {
      clauseText:
        "For a rolling weekly engagement, the Client may cancel without a separate kill fee by giving one week's notice; otherwise one week's average fees are due in place of notice.",
      principle: "Notice-based cancellation for ongoing work",
    },
    {
      clauseText:
        "For a rush project that requires the Freelancer to decline other confirmed work, a Client cancellation after scheduling carries a 25% reservation fee disclosed before acceptance.",
      principle: "Disclosed opportunity-cost protection for rush capacity",
    },
    {
      clauseText:
        "No kill fee is due when the Client terminates because of the Freelancer's uncured material breach, although the Freelancer remains entitled to payment for conforming work the Client elects to use.",
      principle: "Cancellation fee does not reward freelancer breach",
    },
    {
      clauseText:
        "The kill fee is calculated only on the unperformed portion of the project, is not added to fees for the same completed work, and may not cause total project payments to exceed the agreed fee.",
      principle: "No double recovery and a clear cap",
    },
    {
      clauseText:
        "If the Client does not provide required feedback or materials for 30 days after written reminder, the Freelancer may treat the project as cancelled and apply the agreed kill fee after a final seven-day restart notice.",
      principle: "Notice and cure before treating abandonment as cancellation",
    },
    {
      clauseText:
        "If a cancelled project restarts within 60 days and capacity is available, the Freelancer will credit half of the paid kill fee toward the restarted work after accounting for duplicated setup costs.",
      principle: "Fair restart credit without ignoring repeated setup",
    },
    {
      clauseText:
        "Approved non-cancellable expenses and third-party commitments are payable in addition to the kill fee, provided the Freelancer supplies reasonable documentation and takes reasonable steps to mitigate them.",
      principle: "Documented costs plus a duty to mitigate",
    },
    {
      clauseText:
        "Payment of a kill fee does not grant the Client rights to use unpaid drafts or incomplete work; rights transfer only for deliverables separately paid for under the intellectual-property terms.",
      principle: "Cancellation payment separated from IP ownership",
    },
    {
      clauseText:
        "When the parties mutually cancel because the project is no longer feasible through no fault of either party, the Client will pay earned fees and costs but no additional kill fee unless they agree otherwise in writing.",
      principle: "No opportunity-cost charge for a neutral mutual cancellation",
    },
    {
      clauseText:
        "Unless a statement of work sets a stage-based amount, a Client convenience cancellation requires payment of earned fees plus 20% of the remaining fee, reflecting reserved capacity rather than a penalty.",
      principle: "Moderate default opportunity-cost fee",
    },
  ],
  "Late Payment Penalty": [
    {
      clauseText:
        "An undisputed amount unpaid 10 calendar days after its due date accrues simple interest at 1% per month or the maximum lawful rate, whichever is lower.",
      principle: "Modest simple interest with grace period and legal cap",
    },
    {
      clauseText:
        "An overdue undisputed balance accrues a late charge of 1.5% per month beginning the day after the due date, subject to any lower limit required by applicable law.",
      principle: "Common monthly late-charge structure with savings clause",
    },
    {
      clauseText:
        "After a five-business-day grace period, late interest accrues daily at a simple annual rate of 12% or the highest lawful rate, whichever is lower.",
      principle: "Transparent annual rate prorated daily",
    },
    {
      clauseText:
        "If an undisputed invoice remains unpaid 10 days after written reminder, the Client will pay a one-time administrative charge equal to the lesser of $25 or 2% of the overdue amount, where permitted by law.",
      principle: "Small, proportionate administrative charge",
    },
    {
      clauseText:
        "The Freelancer may suspend further work on an undisputed overdue invoice after giving five business days' written notice, and will resume promptly after payment.",
      principle: "Notice-based suspension instead of immediate termination",
    },
    {
      clauseText:
        "Any delivery date affected by a permitted nonpayment suspension will be extended by the suspension period plus a reasonable remobilization period.",
      principle: "Schedule relief follows payment-caused suspension",
    },
    {
      clauseText:
        "Where permitted by law, the Client will reimburse reasonable, documented third-party collection costs incurred after written demand, but not internal overhead or disproportionate fees.",
      principle: "Documented and proportionate collection costs",
    },
    {
      clauseText:
        "No late charge accrues on an amount disputed in good faith with specific written reasons, but the undisputed portion remains payable when due.",
      principle: "Protect genuine disputes without allowing blanket withholding",
    },
    {
      clauseText:
        "Late interest is calculated only on outstanding principal and does not compound or itself generate additional late interest.",
      principle: "Simple, non-compounding late charge",
    },
    {
      clauseText:
        "The Client has a five-business-day grace period after each invoice due date before any contractual late charge applies.",
      principle: "Short operational grace period",
    },
    {
      clauseText:
        "Before assessing a late charge, the Freelancer will send a reminder identifying the invoice, overdue principal, original due date, and applicable charge.",
      principle: "Clear notice and calculation transparency",
    },
    {
      clauseText:
        "The Freelancer will waive a first late charge caused solely by a documented bank or payment-platform error if the Client cures the payment within three business days after notice.",
      principle: "Good-faith cure for an isolated processing error",
    },
    {
      clauseText:
        "The Freelancer is not required to start a new milestone while an earlier undisputed invoice is overdue, provided the Freelancer gives written notice and preserves completed work.",
      principle: "No obligation to extend further unsecured credit",
    },
    {
      clauseText:
        "Any late-payment rate will automatically be reduced to the highest amount enforceable under the law governing the agreement, without invalidating the underlying payment obligation.",
      principle: "Automatic compliance with jurisdictional limits",
    },
    {
      clauseText:
        "Partial payments will first reduce overdue principal for purposes of calculating future late charges, unless applicable law requires a different allocation.",
      principle: "Principal-first allocation limits continuing charges",
    },
    {
      clauseText:
        "Total contractual late charges on an invoice will not exceed 10% of that invoice's unpaid principal, excluding court-awarded interest or remedies required by law.",
      principle: "Express cap prevents an escalating penalty",
    },
  ],
};

export const baselineClauses = Object.entries(baselineClausesByCategory).flatMap(
  ([category, clauses]) =>
    clauses.map((clause) => ({
      category,
      ...clause,
    })),
);
