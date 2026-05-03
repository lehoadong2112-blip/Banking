USE [BankingDB];

-- Tạo bảng Users 
CREATE TABLE [dbo].[Users] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [username] [varchar](50) NOT NULL,
    [password] [varchar](255) NOT NULL,
    [fullname] [nvarchar](100) NOT NULL,
    [account_number] [varchar](20) NOT NULL,
    [balance] [decimal](18, 2) NOT NULL,
    PRIMARY KEY (id)
);

--  tạo bảng Transactions
CREATE TABLE [dbo].[Transactions] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [sender_id] INT NOT NULL,
    [receiver_id] INT NOT NULL,
    [amount] FLOAT NOT NULL,
    [content] NVARCHAR(255),
    [transaction_date] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (sender_id) REFERENCES Users(id),
    FOREIGN KEY (receiver_id) REFERENCES Users(id)
);