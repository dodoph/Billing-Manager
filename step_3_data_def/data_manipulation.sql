/*Login page*/

-- Create a new user
INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES (:First_Name_Input, :Last_Name_Input, :Email_Input, :Phone_Input);

-- INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES ('Jessie', 'Tang', 'Jessie@oregonstate.edu', '4258888888');

-- INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES ('Chen', 'Zou', 'chen@oregonstate.edu', '2068888888' );

-- INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES ('Join', 'Smith', 'john@oregonstate.edu', '2150000000' );

-- INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES ('William', 'Lee', 'William@oregonstate.edu', '21521500000' );

-- Login query user_id and save it in browser
SELECT User_ID, First_Name, Last_Name FROM User u WHERE u.Email=:Email_Input;

-- SELECT User_ID, First_Name, Last_Name FROM User u WHERE u.Email= 'William@oregonstate.edu';

-- Create an event
INSERT INTO Event(Name, Category, Location) VALUES (:Name_Input, :Category_Input, :Location_Input);
-- INSERT INTO Event(Name, Category, Location) VALUES ('Lunch', 'Food', 'Seattle');
-- INSERT INTO Event(Name, Category, Location) VALUES ('Dinner', 'Food', 'Portland');
-- INSERT INTO Event(Name, Category, Location) VALUES ('carpool', 'Travel', 'Portland');

-- return event ID
-- when we create the user and event relations, we needs Event_ID
-- reference: https://stackoverflow.com/questions/17112852/get-the-new-record-primary-key-id-from-mysql-insert-query
SELECT LAST_INSERT_ID();

-- Create user-event relation
INSERT INTO User_Event VALUES (:User_ID, :Event_ID);
-- INSERT INTO User_Event VALUES (1, 1);
-- INSERT INTO User_Event VALUES (1, 2);
-- INSERT INTO User_Event VALUES (1, 3);

-- Get all the events information (made a change)
SELECT Name, Category, Location, Participants, Total_Expense, Event_Share, Status_Open FROM Event e INNER JOIN User_Event ue ON ue.Event_ID =e.Event_ID WHERE ue.User_ID  = :User_ID;
-- SELECT Name, Category, Location, Participants, Total_Expense, Event_Share, Status_Open FROM Event e INNER JOIN User_Event ue ON ue.Event_ID =1 WHERE ue.User_ID  = 1;

-- Event table

-- Display current participates in event page
SELECT u.First_Name, u.Last_Name FROM User u
INNER JOIN User_Event ue ON ue.User_ID = u.User_ID
WHERE ue.Event_ID =:Event_ID;
-- SELECT u.First_Name, u.Last_Name FROM User u
-- INNER JOIN User_Event ue ON ue.User_ID = u.User_ID
-- WHERE ue.Event_ID =1;

-- Add a participate in current event
-- INSERT INTO SELECT Syntax(Reference: https://www.w3schools.com/sql/sql_insert_into_select.asp)
INSERT INTO User_Event SELECT User_ID, :Event_ID FROM User u WHERE u.Email= :Email_Input;
-- INSERT INTO User_Event SELECT User_ID, 1 FROM User u WHERE u.Email= 'chen@oregonstate.edu';
-- INSERT INTO User_Event SELECT User_ID, 1 FROM User u WHERE u.Email= 'john@oregonstate.edu';
-- INSERT INTO User_Event SELECT User_ID, 1 FROM User u WHERE u.Email= 'William@oregonstate.edu';

-- After invite an user , update participates in event table
UPDATE Event e SET Participants = Participants + 1 WHERE e.Event_ID = :Event_ID;
-- UPDATE Event e SET Participants = Participants + 1 WHERE e.Event_ID = 1;

-- Add item into item table
INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) 
VALUES (:Description_Input, :Event_ID, :Payer_ID, :Quantity, :Invoice_Amount_Input);
-- INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) 
-- VALUES ('sanwich', 1, 1, 4, 20);
-- INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) 
-- VALUES ('drinks', 1, 2, 2, 10);
-- INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) 
-- VALUES ('fruits', 1, 3, 1, 20);
-- INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) 
-- VALUES ('wine', 1, 1, 1, 10);

-- INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) 
-- VALUES ('ribs', 1, 2, 1, 30);

-- Update total expense in event table after an item is added
UPDATE Event e SET e.Total_Expense = e.Total_Expense + :Invoice_Amount_Input WHERE e.Event_ID = :Event_ID;
-- UPDATE Event e SET e.Total_Expense = e.Total_Expense + 20 WHERE e.Event_ID = 1;
-- UPDATE Event e SET e.Total_Expense = e.Total_Expense + 10 WHERE e.Event_ID = 1;
-- UPDATE Event e SET e.Total_Expense = e.Total_Expense + 20 WHERE e.Event_ID = 1;
-- UPDATE Event e SET e.Total_Expense = e.Total_Expense + 10 WHERE e.Event_ID = 1;
-- UPDATE Event e SET e.Total_Expense = e.Total_Expense + 30 WHERE e.Event_ID = 1;

-- Update event share after an item is added or deleted
UPDATE Event e SET e.Event_Share = e.Total_Expense / e.Participants WHERE e.Event_ID = :Event_ID;
-- UPDATE Event e SET e.Event_Share = e.Total_Expense / e.Participants WHERE e.Event_ID = 1;

-- Display all the items information of an event
SELECT Description, First_Name, Last_Name, Quantity, Invoice_Amount 
FROM Item i INNER JOIN User u ON u.User_ID = i.Payer_ID  
WHERE i.Event_ID= :Event_ID;
-- SELECT Description, First_Name, Last_Name, Quantity, Invoice_Amount 
-- FROM Item i INNER JOIN User u ON u.User_ID = i.Payer_ID  
-- WHERE i.Event_ID= 1;

-- Edit item description/ quantity / invoice amount in item table
UPDATE Item i 
SET Description =:Description_Input, Quantity = :Quantity_Input, Invoice_Amount = :Invoice_Amount_Input
WHERE i.Item_ID = :Item_ID;
-- UPDATE Item i 
-- SET Description ='sanwiches', Quantity = 4, Invoice_Amount = 20
-- WHERE i.Item_ID = 1;

-- Set Forerign key(Even_ID) to NULL in item table
UPDATE Item i SET i.Event_ID = NULL WHERE Item_ID = :Item_ID;
-- UPDATE Item i SET i.Event_ID = NULL WHERE Item_ID = 5;

-- after one item is delete(event), update the total_expense in event table
UPDATE Event e, Item i
SET e.Total_Expense = e.Total_Expense - :i.Invoice_Amount_Input 
WHERE e.Event_ID = i.Event_ID;
-- UPDATE Event e, Item i
-- SET e.Total_Expense = e.Total_Expense - 30
-- WHERE e.Event_ID = 1;

-- remove a participate from current event  
UPDATE Event e SET Participants = Participants - 1 WHERE e.Event_ID = :Event_ID;

-- update user_event relation table after a participate is removed
DELETE FROM user_event WHERE User_ID = :User_ID_Input AND Event_ID = :Event_ID_Input;

-- delete the item if it is purchased by that user. Set Forerign key(Even_ID) to NULL in item table
UPDATE Item i SET i.Event_ID = NULL WHERE Item_ID = :Item_ID;

-- Edit name, category and location in event table
UPDATE Event e 
SET Name =:Name_Input, Category = :Category_Input, Location = :Location_Input
WHERE e.Event_ID = :Event_ID;
-- UPDATE Event e 
-- SET Name ='Lunch', Category = 'Food', Location = 'Bellevue'
-- WHERE e.Event_ID = 1;

-- update event status in event table after the event is closed
UPDATE Event e SET Status_Open = 0 WHERE e.Event_ID = 1;


-- Insert value into Statement table (This value will be presented after event is closed)

INSERT INTO Statement(User_ID, Event_ID, Event_Paid, Event_Balance)
SELECT ue.User_ID, ue.Event_ID, IFNULL(SUM(Invoice_Amount), 0), Event_Share - IFNULL(SUM(Invoice_Amount), 0)
FROM User_Event ue 
LEFT JOIN Item i ON ue.User_ID = i.Payer_ID  AND ue.Event_ID = i.Event_ID
INNER JOIN Event e ON e.Event_ID = ue.Event_ID 
WHERE ue.Event_ID = 1
GROUP BY ue.User_ID, ue.Event_ID;

