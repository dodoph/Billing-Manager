-- Create a new user
INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES (:First_Name_Input, :Last_Name_Input, :Email_Input, :Phone_Input);

-- Create an event
INSERT INTO Event(Name, Category, Location) VALUES (:Name_Input, :Category_Input, :Location_Input);

-- Create user-event relation
INSERT INTO User_Event VALUES (:User_ID, :Event_ID);

-- Add a participate in current event
-- INSERT INTO SELECT Syntax(Reference: https://www.w3schools.com/sql/sql_insert_into_select.asp)
INSERT INTO User_Event SELECT User_ID, :Event_ID FROM User u WHERE u.Email= :Email_Input;

-- Add item into item table
INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) 
VALUES (:Description_Input, :Event_ID, :Payer_ID, :Quantity, :Invoice_Amount_Input);


-- Insert value into Statement table (This value will be presented after event is closed)

INSERT INTO Statement(User_ID, Event_ID, Event_Paid, Event_Balance)
SELECT ue.User_ID, ue.Event_ID, IFNULL(SUM(Invoice_Amount), 0), Event_Share - IFNULL(SUM(Invoice_Amount), 0)
FROM User_Event ue 
LEFT JOIN Item i ON ue.User_ID = i.Payer_ID  AND ue.Event_ID = i.Event_ID
INNER JOIN Event e ON e.Event_ID = ue.Event_ID 
WHERE ue.Event_ID = 1
GROUP BY ue.User_ID, ue.Event_ID;



-- Login query user_id and save it in browser
SELECT User_ID, First_Name, Last_Name FROM User u WHERE u.Email=:Email_Input;

-- return event ID
-- when we create the user and event relations, we needs Event_ID
-- reference: https://stackoverflow.com/questions/17112852/get-the-new-record-primary-key-id-from-mysql-insert-query
SELECT LAST_INSERT_ID();

-- Get all the events information (made a change)
SELECT Name, Category, Location, Participants, Total_Expense, Event_Share, Status_Open FROM Event e INNER JOIN User_Event ue ON ue.Event_ID =e.Event_ID WHERE ue.User_ID  = :User_ID;

-- Display current participates in event page
SELECT u.First_Name, u.Last_Name FROM User u
INNER JOIN User_Event ue ON ue.User_ID = u.User_ID
WHERE ue.Event_ID =:Event_ID;

-- Display all the items information of an event
SELECT Description, First_Name, Last_Name, Quantity, Invoice_Amount 
FROM Item i INNER JOIN User u ON u.User_ID = i.Payer_ID  
WHERE i.Event_ID= :Event_ID;


