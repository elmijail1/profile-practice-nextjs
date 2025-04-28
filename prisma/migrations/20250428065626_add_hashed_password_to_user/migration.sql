-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "emoji" VARCHAR(1) NOT NULL DEFAULT '🎃',
    "bgColor" INTEGER[] DEFAULT ARRAY[0, 0, 95]::INTEGER[],
    "joinedIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aboutMe" VARCHAR(100),
    "friends" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
