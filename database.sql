CREATE TABLE `games` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `sku` varchar(255) UNIQUE,
  `name` varchar(255) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL COMMENT 'Price in Euros',
  `playUrl` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `game_images` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `gameId` integer,
  `imageUrl` varchar(255) NOT NULL,
  `sortOrder` integer NOT NULL DEFAULT 1,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `tags` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `value` varchar(255) NOT NULL
);

CREATE TABLE `games_tags` (
  `gameId` integer,
  `tagId` integer,
  PRIMARY KEY (`gameId`, `tagId`)
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL COMMENT 'First name',
  `prefix` varchar(255) COMMENT 'Middle name prefix (optional)',
  `lastName` varchar(255) NOT NULL COMMENT 'Last name',
  `username` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phoneNumber` varchar(255),
  `password` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `addresses` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `userId` integer NOT NULL,
  `street` varchar(255) NOT NULL,
  `houseNumber` varchar(255) NOT NULL,
  `postalCode` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `default` boolean NOT NULL DEFAULT false,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `orders` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `userId` integer NOT NULL,
  `addressId` integer NOT NULL,
  `orderDate` timestamp NOT NULL,
  `status` varchar(255) NOT NULL,
  `totalAmount` decimal NOT NULL
);

CREATE TABLE `orders_games` (
  `orderId` integer,
  `gameId` integer,
  `price` decimal,
  PRIMARY KEY (`orderId`, `gameId`)
);

CREATE TABLE `payments` (
  `orderId` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `provider` varchar(255) NOT NULL,
  `amount` integer NOT NULL,
  `vat` integer NOT NULL,
  `paymentDate` date NOT NULL,
  `status` varchar(255) NOT NULL
);

CREATE TABLE `cart_items` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `userId` integer NOT NULL,
  `gameId` integer NOT NULL,
  `quantity` integer NOT NULL DEFAULT 1,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `reviews` (
  `userId` integer NOT NULL,
  `gameId` integer NOT NULL,
  `stars` integer NOT NULL,
  `text` text,
  PRIMARY KEY (`userId`, `gameId`)
);

CREATE TABLE `sessions` (
  `id` varchar(255) PRIMARY KEY NOT NULL,
  `userId` integer NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `game_images` ADD FOREIGN KEY (`gameId`) REFERENCES `games` (`id`);

ALTER TABLE `games_tags` ADD FOREIGN KEY (`gameId`) REFERENCES `games` (`id`);

ALTER TABLE `games_tags` ADD FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`);

ALTER TABLE `addresses` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`);

ALTER TABLE `orders_games` ADD FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`);

ALTER TABLE `orders_games` ADD FOREIGN KEY (`gameId`) REFERENCES `games` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`);

ALTER TABLE `cart_items` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `cart_items` ADD FOREIGN KEY (`gameId`) REFERENCES `games` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`gameId`) REFERENCES `games` (`id`);

ALTER TABLE `sessions` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
