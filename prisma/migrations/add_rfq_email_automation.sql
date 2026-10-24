-- RFQ email automation: mailboxes, inbound emails, extracted items, replies, prompts, templates, settings
-- CreateTable
CREATE TABLE "Mailbox" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "companyId" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'drafts',
    "replyLanguage" TEXT NOT NULL DEFAULT 'auto',
    "signatureHtml" TEXT,
    "excludedSenders" TEXT,
    "gmailQuery" TEXT,
    "backfillDays" INTEGER NOT NULL DEFAULT 3,
    "refreshTokenEnc" TEXT,
    "historyId" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "lastError" TEXT,
    "lastErrorAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mailbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundEmail" (
    "id" TEXT NOT NULL,
    "mailboxId" TEXT NOT NULL,
    "gmailMessageId" TEXT NOT NULL,
    "gmailThreadId" TEXT NOT NULL,
    "rfcMessageId" TEXT,
    "references" TEXT,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "toEmail" TEXT,
    "subject" TEXT NOT NULL DEFAULT '',
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "snippet" TEXT,
    "bodyText" TEXT,
    "bodyHtml" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "ignoreReason" TEXT,
    "isPriceRequest" BOOLEAN,
    "confidence" DOUBLE PRECISION,
    "language" TEXT,
    "customerName" TEXT,
    "customerCompany" TEXT,
    "aiSummary" TEXT,
    "aiRaw" JSONB,
    "model" TEXT,
    "promptVersionId" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InboundEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAttachment" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 0,
    "gmailAttachmentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "extractedText" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceRequestItem" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "requestedSku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "manufacturerHint" TEXT,
    "productId" TEXT,
    "matchedSku" TEXT,
    "productName" TEXT,
    "unitPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL,
    "verifiedInText" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundReply" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "aiDraftHtml" TEXT NOT NULL,
    "sendMode" TEXT,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "sentByEmail" TEXT,
    "sentAt" TIMESTAMP(3),
    "gmailMessageId" TEXT,
    "gmailThreadId" TEXT,
    "promptVersionId" TEXT,
    "templateId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboundReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiPromptVersion" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "comment" TEXT,
    "authorEmail" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiPromptVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplyTemplate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReplyTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "autoSendEnabled" BOOLEAN NOT NULL DEFAULT false,
    "model" TEXT NOT NULL DEFAULT 'gpt-4.1',
    "confidenceThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "updatedByEmail" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "userEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mailbox_email_key" ON "Mailbox"("email");

-- CreateIndex
CREATE INDEX "InboundEmail_status_idx" ON "InboundEmail"("status");

-- CreateIndex
CREATE INDEX "InboundEmail_receivedAt_idx" ON "InboundEmail"("receivedAt");

-- CreateIndex
CREATE INDEX "InboundEmail_gmailThreadId_idx" ON "InboundEmail"("gmailThreadId");

-- CreateIndex
CREATE UNIQUE INDEX "InboundEmail_mailboxId_gmailMessageId_key" ON "InboundEmail"("mailboxId", "gmailMessageId");

-- CreateIndex
CREATE INDEX "EmailAttachment_emailId_idx" ON "EmailAttachment"("emailId");

-- CreateIndex
CREATE INDEX "PriceRequestItem_emailId_idx" ON "PriceRequestItem"("emailId");

-- CreateIndex
CREATE INDEX "PriceRequestItem_status_idx" ON "PriceRequestItem"("status");

-- CreateIndex
CREATE INDEX "PriceRequestItem_productId_idx" ON "PriceRequestItem"("productId");

-- CreateIndex
CREATE INDEX "OutboundReply_emailId_idx" ON "OutboundReply"("emailId");

-- CreateIndex
CREATE INDEX "OutboundReply_status_idx" ON "OutboundReply"("status");

-- CreateIndex
CREATE INDEX "AiPromptVersion_kind_isActive_idx" ON "AiPromptVersion"("kind", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AiPromptVersion_kind_version_key" ON "AiPromptVersion"("kind", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ReplyTemplate_companyId_language_key" ON "ReplyTemplate"("companyId", "language");

-- CreateIndex
CREATE INDEX "AutomationLog_createdAt_idx" ON "AutomationLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Mailbox" ADD CONSTRAINT "Mailbox_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundEmail" ADD CONSTRAINT "InboundEmail_mailboxId_fkey" FOREIGN KEY ("mailboxId") REFERENCES "Mailbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailAttachment" ADD CONSTRAINT "EmailAttachment_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "InboundEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceRequestItem" ADD CONSTRAINT "PriceRequestItem_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "InboundEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceRequestItem" ADD CONSTRAINT "PriceRequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundReply" ADD CONSTRAINT "OutboundReply_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "InboundEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyTemplate" ADD CONSTRAINT "ReplyTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tables are accessed only by the server via Prisma (postgres role bypasses RLS);
-- enabling RLS with no policies blocks the public Supabase REST API.
ALTER TABLE "Mailbox" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InboundEmail" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailAttachment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PriceRequestItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OutboundReply" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiPromptVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReplyTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AutomationSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AutomationLog" ENABLE ROW LEVEL SECURITY;
