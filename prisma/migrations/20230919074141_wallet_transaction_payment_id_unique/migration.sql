/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `wallet_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `wallet_transactions_payment_id_key` ON `wallet_transactions`(`payment_id`);
