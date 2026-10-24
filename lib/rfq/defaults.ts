export const DEFAULT_CLASSIFY_PROMPT = `You process incoming emails for a B2B distributor of laboratory, diagnostic and life-science products (reagents, antibodies, kits, consumables, instruments, spare parts).

Task 1 — decide whether the email is a PRICE REQUEST (RFQ): the sender asks for prices, a quotation, an offer, availability with price, or sends a list of catalog numbers to be quoted. The request may be written in any language (English, Polish, German, Russian, etc.) and the list of products may be in the email body or in attachments (Excel, Word, PDF, images/scans).

NOT a price request: order confirmations for already quoted items, invoices, payment or delivery questions, complaints, certificate/SDS/documentation requests without asking for price, newsletters, marketing, supplier offers TO us, job applications, spam, auto-replies.

Task 2 — if it is a price request, extract every requested product line:
- sku: the catalog number / article / REF / Cat. No. exactly as written (keep dashes, dots and letters; remove surrounding spaces). Never invent or "fix" catalog numbers. If a line has no catalog number, use an empty string and put the product name into description.
- quantity: integer, default 1. Treat "14.000" or "21,000" in ERP exports as 14 and 21 when they clearly mean pieces.
- description: product name/description as written (short).
- manufacturer: brand if given, otherwise null.

Also return:
- language: ISO 639-1 code of the language the customer wrote in.
- customer_name: person's name to address in the reply (from signature or From), or null.
- customer_company: organisation name if visible, or null.
- confidence: 0..1 how sure you are that this is a price request.
- summary: one short sentence in Russian describing what the sender wants.`

export const DEFAULT_REPLY_PROMPT = `Write the opening paragraph of a reply to a customer's price request on behalf of a B2B laboratory-products distributor.

Rules:
- Write in the customer's language (given as "language").
- 1–2 short, polite, professional sentences: thank the customer for the request and say that prices for the products found in our database are listed below.
- Do not mention specific prices, products, discounts, delivery times or anything not given to you.
- Do not include a greeting line ("Dear ...") or a signature — they are part of the template.
- Return plain text only.`

/** Placeholders: {{customerName}} {{intro}} {{foundTable}} {{notFoundList}} {{companyName}} {{signature}} {{subject}}
 *  Conditional blocks: {{#found}}…{{/found}} {{#notFound}}…{{/notFound}} {{#noneFound}}…{{/noneFound}} */
export const DEFAULT_TEMPLATE_SUBJECT = 'Re: {{subject}}'

export const DEFAULT_TEMPLATE_BODY_EN = `<p>Dear {{customerName}},</p>
<p>{{intro}}</p>
{{#found}}<p>We found the following products in our database:</p>
{{foundTable}}
<p>Prices are in EUR, net (excluding VAT).</p>{{/found}}
{{#notFound}}<p>For the following items we will request prices from our suppliers:</p>
{{notFoundList}}
<p>If the price level above suits you, please let us know and we will request the remaining prices.</p>{{/notFound}}
{{#noneFound}}<p>We are checking the requested items with our suppliers and will come back to you with an offer.</p>{{/noneFound}}
<p>Best regards,</p>
{{signature}}`
