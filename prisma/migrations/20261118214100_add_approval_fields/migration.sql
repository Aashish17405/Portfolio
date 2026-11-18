-- AlterTable
ALTER TABLE "Contact" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Contact" ADD COLUMN "replySubject" TEXT;
ALTER TABLE "Contact" ADD COLUMN "replyDraft" TEXT;
ALTER TABLE "Contact" ADD COLUMN "repliedAt" TIMESTAMP(3);
ALTER TABLE "Contact" ADD COLUMN "sentContent" TEXT;
