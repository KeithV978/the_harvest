-- CreateTable
CREATE TABLE "AdminPhone" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPhone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminPhone_adminId_phone_key" ON "AdminPhone"("adminId", "phone");

-- AddForeignKey
ALTER TABLE "AdminPhone" ADD CONSTRAINT "AdminPhone_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
