DROP DATABASE IF EXISTS nexuspay;
CREATE DATABASE nexuspay;
USE nexuspay;


CREATE TABLE Category (
    category_id VARCHAR(50) NOT NULL,
    category_name  VARCHAR(50)  NOT NULL,
    description     VARCHAR(255),
    PRIMARY KEY (category_id)
);

CREATE TABLE Bank_Account (
    account_number  VARCHAR(50)  NOT NULL,
    user_id         INT,
    bank_name       VARCHAR(100),
    IFSC_code    VARCHAR(50),
    balance         DECIMAL(15,2),
    is_primary      BOOLEAN      DEFAULT FALSE,
    PRIMARY KEY (account_number),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


CREATE TABLE User (
    user_id     INT          NOT NULL AUTO_INCREMENT,
    name  VARCHAR(50)  NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE Admin (
    admin_id    INT          NOT NULL AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    password    VARCHAR(255),
    role        VARCHAR(50) NOT NULL,
    PRIMARY KEY (admin_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Customer (
    customer_id INT          NOT NULL AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    dob         Date ,
    PRIMARY KEY (customer_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Merchant (
    merchant_id         INT          NOT NULL AUTO_INCREMENT,
    user_id             INT          NOT NULL,
    name                VARCHAR(255),
    business_name       VARCHAR(255),
    category_id  VARCHAR(50)  NOT NULL,
   
    PRIMARY KEY (merchant_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE Group_Member (
    group_id    INT NOT NULL AUTO_INCREMENT,
    customer_id INT,
    joined_at   DATETIME,
    PRIMARY KEY (group_id, customer_id),
    FOREIGN KEY (group_id)     REFERENCES Spilt_Group(group_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

CREATE TABLE Split_Group (
    group_id            INT          NOT NULL AUTO_INCREMENT,
    split_id            INT          NOT NULL AUTO_INCREMENT,
    initiated_customer               VARCHAR(255),
    group_name       VARCHAR(50),
    PRIMARY KEY (group_id),
    FOREIGN KEY (split_id) REFERENCES Spilt_Expense(spilt_id),
    FOREIGN KEY (initiated_customer) REFERENCES Customer(customer_id)
   
);

CREATE TABLE Transaction (
    transaction_id      INT          NOT NULL AUTO_INCREMENT,
    customer_payer      INT,
    payee_id      INT,
    category_id      VARCHAR(50),
    amount              DECIMAL(15,2),
    transaction_type    VARCHAR(50),
    status              VARCHAR(50),
    date_time_stamp     DATETIME,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (customer_payer)  REFERENCES Customer(customer_id),
    FOREIGN KEY (payee_id)  REFERENCES Merchant(merchant_id),
    FOREIGN KEY (category_id)   REFERENCES Category(category_id)
);

CREATE TABLE Scheduled_Payment (
    schedule_id         INT          NOT NULL AUTO_INCREMENT,
    customer_id         INT,
    beneficiary_id      INT,
    transaction_id      INT,
    frequency           VARCHAR(50),
    amount              DECIMAL(15,2),
    start_date          DATE,
    end_date            DATE,
    status              VARCHAR(50),
    created_at          DATETIME,
    PRIMARY KEY (schedule_id),
    FOREIGN KEY (customer_id)    REFERENCES Customer(customer_id),
    FOREIGN KEY (transaction_id) REFERENCES Transaction(transaction_id),
    FOREIGN KEY ( beneficiary_id) REFERENCES Transaction( beneficiary_id)
   
);

CREATE TABLE Beneficiary (
    beneficiary_id      INT          NOT NULL AUTO_INCREMENT,
    beneficiary_customer_id         INT,
    customer_id         INT,
    beneficiary_name    VARCHAR(255),
    PRIMARY KEY (beneficiary_id),
    FOREIGN KEY (beneficiary_customer_id)     REFERENCES Customer(customer_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);


CREATE TABLE Split_Expense (
    split_id            INT          NOT NULL AUTO_INCREMENT,
    group_id            INT,
    customer_id      INT,
    Payee_id         INT,
    transaction_id      INT,
    total_amount        DECIMAL(15,2),
    share_amount        DECIMAL(15,2),
    spilt_type       VARCHAR(50),
    status              VARCHAR(50),
    PRIMARY KEY (split_id),
    FOREIGN KEY (group_id)       REFERENCES Split_Group(split_id),
    FOREIGN KEY (transaction_id) REFERENCES Transaction(transaction_id),
    FOREIGN KEY (customer_id)        REFERENCES Customer(customer_id),
    FOREIGN KEY (payee_id) REFERENCES Customer(customer_id)
);


CREATE TABLE Dispute (
    dispute_id          INT          NOT NULL AUTO_INCREMENT,
    transaction_id      INT,
    raised_by           INT,
    admin_id            INT,
    reason        VARCHAR(50),
    description         VARCHAR(1000),
    status              VARCHAR(50),
    craeted_at         DATETIME,
    resolved_at         DATETIME,
    PRIMARY KEY (dispute_id),
    FOREIGN KEY (transaction_id) REFERENCES Transaction(transaction_id),
    FOREIGN KEY (raised_by)      REFERENCES Customer(customer_id),
    FOREIGN KEY (admin_id)      REFERENCES Admin(admin_id),
   
);


CREATE TABLE Notification (
    notification_id INT          NOT NULL AUTO_INCREMENT,
    user_id         INT,
    message         TEXT,
    type            VARCHAR(50),
    read_status     BOOLEAN      DEFAULT FALSE,
    created_at      DATETIME,
    PRIMARY KEY (notification_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
