-- CreateTable
CREATE TABLE "OntData" (
    "id" SERIAL NOT NULL,
    "slot" INTEGER NOT NULL,
    "port" INTEGER NOT NULL,
    "ont_id" TEXT NOT NULL,
    "sn" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "origin" TEXT NOT NULL,

    CONSTRAINT "OntData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OntData_sn_key" ON "OntData"("sn");
