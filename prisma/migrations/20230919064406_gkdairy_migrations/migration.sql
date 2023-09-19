-- CreateTable
CREATE TABLE `hubs` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,

    UNIQUE INDEX `hubs_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `hub_id` VARCHAR(191) NULL,
    `is_email_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_phone_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_delete_requested` BOOLEAN NOT NULL DEFAULT false,
    `is_on_vacation` BOOLEAN NOT NULL DEFAULT false,
    `vacation_start_date` DATETIME(3) NULL,
    `vacation_end_date` DATETIME(3) NULL,
    `delivery_preference_id` VARCHAR(191) NULL,
    `is_cod_allowed` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `customers_id_key`(`id`),
    UNIQUE INDEX `customers_phone_number_key`(`phone_number`),
    UNIQUE INDEX `customers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `device_id` VARCHAR(191) NULL,
    `last_login` DATETIME(3) NULL,
    `last_logout` DATETIME(3) NULL,
    `last_ip` VARCHAR(191) NULL,
    `last_device` VARCHAR(191) NULL,
    `last_location` VARCHAR(191) NULL,
    `customer_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `test_field` VARCHAR(191) NOT NULL DEFAULT 'test',

    UNIQUE INDEX `sessions_id_key`(`id`),
    UNIQUE INDEX `sessions_customer_id_key`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `door_no` VARCHAR(191) NULL,
    `floor_no` VARCHAR(191) NULL,
    `apartment` VARCHAR(191) NULL,
    `street` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `customer_id` VARCHAR(191) NULL,
    `hub_id` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,

    UNIQUE INDEX `addresses_id_key`(`id`),
    UNIQUE INDEX `addresses_customer_id_key`(`customer_id`),
    UNIQUE INDEX `addresses_hub_id_key`(`hub_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_registries` (
    `id` VARCHAR(191) NOT NULL,
    `wallet_id` VARCHAR(191) NULL,
    `customer_id` VARCHAR(191) NULL,
    `balance` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,

    UNIQUE INDEX `wallet_registries_id_key`(`id`),
    UNIQUE INDEX `wallet_registries_wallet_id_key`(`wallet_id`),
    UNIQUE INDEX `wallet_registries_customer_id_key`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NULL,
    `wallet_registry_id` VARCHAR(191) NOT NULL,
    `transaction_type` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `transaction_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `payment_id` VARCHAR(191) NOT NULL,
    `payment_type` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `status` ENUM('PUBLISH', 'DRAFT', 'TRASH') NOT NULL DEFAULT 'DRAFT',

    UNIQUE INDEX `wallet_transactions_id_key`(`id`),
    UNIQUE INDEX `wallet_transactions_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `one_time_passwords` (
    `id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NULL,
    `otp` VARCHAR(191) NOT NULL,
    `otp_type` VARCHAR(191) NOT NULL,
    `otp_expiry` DATETIME(3) NOT NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `one_time_passwords_id_key`(`id`),
    UNIQUE INDEX `one_time_passwords_customer_id_key`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dimention` (
    `id` VARCHAR(191) NOT NULL,
    `length` DECIMAL(10, 1) NULL DEFAULT 0.00,
    `width` DECIMAL(10, 1) NULL DEFAULT 0.00,
    `height` DECIMAL(10, 1) NULL DEFAULT 0.00,
    `unit` VARCHAR(191) NULL,

    UNIQUE INDEX `dimention_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `count` INTEGER NULL DEFAULT 0,
    `parent_id` VARCHAR(191) NULL,
    `sort_order` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `product_categories_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `files_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image_id` VARCHAR(191) NULL,
    `type` ENUM('SIMPLE', 'VARIABLE') NOT NULL DEFAULT 'SIMPLE',
    `status` ENUM('PUBLISH', 'DRAFT', 'TRASH') NOT NULL DEFAULT 'DRAFT',
    `reviews_allowed` BOOLEAN NOT NULL DEFAULT true,
    `average_rating` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `rating_count` INTEGER NULL DEFAULT 0,
    `category_id` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `sku` VARCHAR(191) NULL,
    `regular_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `sale_price` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `on_sale` BOOLEAN NOT NULL DEFAULT false,
    `sale_starts_at` DATETIME(3) NULL,
    `sale_ends_at` DATETIME(3) NULL,
    `taxable` BOOLEAN NOT NULL DEFAULT false,
    `tax_class` VARCHAR(191) NULL,
    `tax_status` VARCHAR(191) NULL,
    `manage_stock` BOOLEAN NOT NULL DEFAULT true,
    `stock_quantity` INTEGER NULL DEFAULT 0,
    `in_stock` BOOLEAN NOT NULL DEFAULT true,
    `backorders_allowed` BOOLEAN NOT NULL DEFAULT false,
    `backordered` BOOLEAN NOT NULL DEFAULT true,
    `purchaseable` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `weight` DECIMAL(10, 3) NULL DEFAULT 0.00,
    `dimension_id` VARCHAR(191) NULL,
    `bundle_sizes` INTEGER NOT NULL DEFAULT 1,
    `attributes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,

    UNIQUE INDEX `products_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variants` (
    `id` VARCHAR(191) NOT NULL,
    `stock` INTEGER NULL DEFAULT 0,
    `sku` VARCHAR(191) NULL,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `regular_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `sale_price` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `taxable` BOOLEAN NOT NULL DEFAULT false,
    `tax_class` VARCHAR(191) NULL,
    `tax_status` VARCHAR(191) NULL,
    `manage_stock` BOOLEAN NOT NULL DEFAULT true,
    `stock_quantity` INTEGER NULL DEFAULT 0,
    `in_stock` BOOLEAN NOT NULL DEFAULT true,
    `backorders_allowed` BOOLEAN NOT NULL DEFAULT false,
    `backordered` BOOLEAN NOT NULL DEFAULT true,
    `purchaseable` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `on_sale` BOOLEAN NOT NULL DEFAULT false,
    `sale_starts_at` DATETIME(3) NULL,
    `sale_ends_at` DATETIME(3) NULL,
    `weight` DECIMAL(10, 3) NULL DEFAULT 0.00,
    `dimension_id` VARCHAR(191) NULL,
    `bundle_sizes` INTEGER NOT NULL DEFAULT 1,
    `product_id` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NULL,
    `default` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `product_variants_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_time_slots` (
    `id` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `delivery_time_slots_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_preferences` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `delivery_preferences_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `frequency_type` ENUM('daily', 'interval', 'flexible') NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `sunday` INTEGER NULL,
    `monday` INTEGER NULL,
    `tuesday` INTEGER NULL,
    `wednesday` INTEGER NULL,
    `thursday` INTEGER NULL,
    `friday` INTEGER NULL,
    `saturday` INTEGER NULL,
    `delivery_intervals` INTEGER NULL,
    `delivery_time_slot_id` VARCHAR(191) NULL,
    `delivery_notes` VARCHAR(191) NULL,
    `delivery_voice_note_id` VARCHAR(191) NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `variant_id` VARCHAR(191) NULL,
    `customer_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `status` ENUM('PUBLISH', 'DRAFT', 'TRASH') NOT NULL DEFAULT 'DRAFT',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `billing_address_id` VARCHAR(191) NOT NULL,
    `shipping_address_id` VARCHAR(191) NOT NULL,
    `payment_method` VARCHAR(191) NULL,
    `transaction_id` VARCHAR(191) NULL,
    `discount_total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `shipping_total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `prices_include_tax` BOOLEAN NOT NULL DEFAULT true,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `customer_id` VARCHAR(191) NULL,
    `date_paid` DATETIME(3) NULL,
    `date_completed` DATETIME(3) NULL,
    `cart_hash` VARCHAR(191) NULL,
    `status` ENUM('PENDING_PAYMENT', 'FAILED', 'PROCESSING', 'COMPLETED', 'ON_HOLD', 'CANCELLED', 'REFUNDED', 'PENDING', 'BACKORDER', 'PAYMENT_FAILED', 'PAYMENT_REVIEW', 'COMPLETED_AND_PAID') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `orders_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,
    `item_variant_id` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refunds` (
    `id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `order_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `refunds_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shippings` (
    `id` VARCHAR(191) NOT NULL,
    `shipping_method` VARCHAR(191) NOT NULL,
    `shipping_id` VARCHAR(191) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `order_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `shippings_shipping_id_key`(`shipping_id`),
    UNIQUE INDEX `shippings_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `expires_at` DATETIME(3) NULL,
    `min_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    UNIQUE INDEX `coupons_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metas` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `metas_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL DEFAULT 'default.png',
    `verified` BOOLEAN NULL DEFAULT false,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'admin') NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `provider` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OrderCoupon` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_OrderCoupon_AB_unique`(`A`, `B`),
    INDEX `_OrderCoupon_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_hub_id_fkey` FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_delivery_preference_id_fkey` FOREIGN KEY (`delivery_preference_id`) REFERENCES `delivery_preferences`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_hub_id_fkey` FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet_registries` ADD CONSTRAINT `wallet_registries_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet_transactions` ADD CONSTRAINT `wallet_transactions_wallet_registry_id_fkey` FOREIGN KEY (`wallet_registry_id`) REFERENCES `wallet_registries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `one_time_passwords` ADD CONSTRAINT `one_time_passwords_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `files`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_dimension_id_fkey` FOREIGN KEY (`dimension_id`) REFERENCES `dimention`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_dimension_id_fkey` FOREIGN KEY (`dimension_id`) REFERENCES `dimention`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_delivery_time_slot_id_fkey` FOREIGN KEY (`delivery_time_slot_id`) REFERENCES `delivery_time_slots`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_delivery_voice_note_id_fkey` FOREIGN KEY (`delivery_voice_note_id`) REFERENCES `files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_billing_address_id_fkey` FOREIGN KEY (`billing_address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipping_address_id_fkey` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_item_variant_id_fkey` FOREIGN KEY (`item_variant_id`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shippings` ADD CONSTRAINT `shippings_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderCoupon` ADD CONSTRAINT `_OrderCoupon_A_fkey` FOREIGN KEY (`A`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderCoupon` ADD CONSTRAINT `_OrderCoupon_B_fkey` FOREIGN KEY (`B`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
