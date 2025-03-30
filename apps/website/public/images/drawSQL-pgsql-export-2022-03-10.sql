CREATE TABLE "shippingAddress"(
    "id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "address" BOOLEAN NOT NULL,
    "city" CHAR(255) NOT NULL,
    "postalCode" CHAR(255) NOT NULL,
    "country" CHAR(255) NOT NULL,
    "shippingPrice" DECIMAL(8, 2) NOT NULL
);
ALTER TABLE
    "shippingAddress" ADD PRIMARY KEY("id");
CREATE TABLE "Order"(
    "id" INTEGER NOT NULL,
    "user" INTEGER NOT NULL,
    "paymentMethod" CHAR(255) NOT NULL,
    "taxPrice" DECIMAL(8, 2) NOT NULL,
    "shippingPrice" DECIMAL(8, 2) NOT NULL,
    "totalPrice" DECIMAL(8, 2) NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "paidAt" DATE NOT NULL,
    "isDelivered" BOOLEAN NOT NULL,
    "deliveredAt" DATE NOT NULL,
    "createdAt" DATE NOT NULL
);
ALTER TABLE
    "Order" ADD PRIMARY KEY("id");
CREATE TABLE "OrderItem"(
    "id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "product" INTEGER NOT NULL,
    "name" CHAR(255) NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "image" CHAR(255) NOT NULL
);
ALTER TABLE
    "OrderItem" ADD PRIMARY KEY("id");
CREATE TABLE "User"(
    "id" INTEGER NOT NULL,
    "username" CHAR(255) NOT NULL,
    "first_name" CHAR(255) NOT NULL,
    "last_name" CHAR(255) NOT NULL,
    "email" CHAR(255) NOT NULL,
    "password" CHAR(255) NOT NULL,
    "is_staff" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_superuser" BOOLEAN NOT NULL
);
ALTER TABLE
    "User" ADD PRIMARY KEY("id");
CREATE TABLE "Product"(
    "id" INTEGER NOT NULL,
    "user" INTEGER NOT NULL,
    "name" CHAR(255) NOT NULL,
    "image" CHAR(255) NOT NULL,
    "brand" CHAR(255) NOT NULL,
    "category" CHAR(255) NOT NULL,
    "description" CHAR(255) NOT NULL,
    "rating" INTEGER NOT NULL,
    "numReviews" INTEGER NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "countInStock" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL
);
ALTER TABLE
    "Product" ADD PRIMARY KEY("id");
CREATE TABLE "Review"(
    "id" INTEGER NOT NULL,
    "user" INTEGER NOT NULL,
    "product" INTEGER NOT NULL,
    "name" CHAR(255) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATE NOT NULL
);
ALTER TABLE
    "Review" ADD PRIMARY KEY("id");
ALTER TABLE
    "shippingAddress" ADD CONSTRAINT "shippingaddress_order_foreign" FOREIGN KEY("order") REFERENCES "Order"("id");
ALTER TABLE
    "Order" ADD CONSTRAINT "order_user_foreign" FOREIGN KEY("user") REFERENCES "User"("id");
ALTER TABLE
    "OrderItem" ADD CONSTRAINT "orderitem_product_foreign" FOREIGN KEY("product") REFERENCES "Product"("id");
ALTER TABLE
    "Product" ADD CONSTRAINT "product_user_foreign" FOREIGN KEY("user") REFERENCES "User"("id");
ALTER TABLE
    "Review" ADD CONSTRAINT "review_user_foreign" FOREIGN KEY("user") REFERENCES "User"("id");
ALTER TABLE
    "Review" ADD CONSTRAINT "review_product_foreign" FOREIGN KEY("product") REFERENCES "Product"("id");