# To Do

## In Progress

## Backlog

## Completed
5/5/2026
-add pages for jde_roles, jde_co_segment, jde_location_segment, jde_div, jde_groups, jde_ledger_type, jde_type and jde_otc.  Each page should contain cards with relevant table information.  Cards need to be able to edit records, add records and delete records
-Instead of a horizontal tab bar across the top to switch between all 8 pages, create a pane on the left hand side of the home page.
-create a home page:  "Welcome to the JDE Hierarchy Manager App" as the home page title.  "A Power App code app powered by Copilot Studio." as a descriptor below the title.  Also add the ability toggle light and dark theme on the bottom of the left hand pane on the home page.  Also, all pages should dynamically fit vertically to the browser.  If page cards are too tall, incorporate a vertical scroll bar.
-below the Home page on the left hand pane, place a dropdown page menu called JDE References.  This dropdown should include all of current pages.  When the user clicks the dropdown, the list of pages should appear.  if the user clicks the dropdown again, the pages should rollup into the dropdown menu
-add a dropdown call JDE Updates below JDE References.  Both dropdowns should default to close
-can you add a build version below the toggle theme button.  It should say v1.0.0 - Build X then below the date/time of refresh.  Everytime the app is updated and deployed, I would like the version to be updated
-add sort ability on columns for every page card.  Do not add sort ability for any column called Actions
-add a ToDo.md file to the app
-on the left hand pane and within the JDE Updates dropdown, add a page called JDE Companies.  This page card should be table formatted.  Each row should be editable and deletable.  Users should need the ability to add new companies.  Columns in the card should be Company Code, Company Name, Company Segment, Company Type and Company Ledger.  The table should be sorted on Company Code Ascending order.
-Company Segment should use cr113_segment_name, Company Type should use cr113_segment_type, Company Ledger should use cr113_ledger_type
-change button + Add JDE Companies to + Add JDE Company
-when adding a new jde company, include fields for company segment, company type, and company ledger
-on the JDE Companies page, add a details card with table rows to the right of the main card and move the main card to the right so both cards fit horizontally on the screen.  The details card should have two tabs: one for JDE Locations and the other for JDE Co Assignments.  When a row in the main card is selected, the details card populates the lookup (Related) values in those two tables on each tab.  Also add the ability to create, edit and delete records on both tabs in the details card
-move the company details card from the right of the main card to below the main card.  center both cards horizontally on the screen
-remove the company details title to save from vertical space
-reduce the vertical size of the jde companies details card so it fits on the screen vertically
5/6/2026
-change the JDE References dropdown to be it own page with all of the pages underneath it shown as tabs on the new page
-on the jde Co Assignments page card, remove the section with this text: JDE Co Assignments, Create, edit, and delete assignments related to the selected company and move the field and button above the divider. This should be the same update as you did for the JDE Locations card
-change the JDE updates dropdown to be a divider with JDE Updates as text below the divider
-add a divider below JDE Companies and call it Admin
-add a page under admin called Data Management; The page should have a table card (similar to the JDE References page), with tabs for each page. Include JDE Manager, JDE Company Assignments and JDE Location Assignment as a tab as well
-remove edit and delete buttons from the JDE References; remove delete buttons from the JDE Companies page cards
-on the JDE Companies page, remove columns from the main card: Company Segment, Company Type, Company Ledger.  Remove columns from the JDE Location details card: City, State, Location Segment, Division, Group, OTC.  Instead of the details card below the main card, move it to the right and ensure both cards fit and are centered horizonally on the page
-add a page under JDE Companies called JDE Locations.  The page should be similar to JDE Companies but the main card should be JDE Locations and the detail card should be JDE location assignments
-move the pages JDE Companies and JDE Locations underneath JDE References and remove the section JDE Updates and the divider.  Then remove the JDE References page
-remove the Assignment ID column from the JDE Companies details card
-remove the JDE Location Assignment tab from the JDE Locations detail card, we don't need it since the card is only one table.  Also, apply the same logic to the JDE Location assignements as the JDE Company Assignments; users shoud not be able to add a new location assignment unless they are selecting a row in the JDE Locations table card; Also remove the Assignment ID field from the JDE Locations Assignement card.  this column is auto generated
-Add a page underneatch JDE Locations called JDE Managers similar to the JDE Locations page.  The main card should be JDE Managers and the detail card should be a table with two tabs;  JDE Company Assignments and  JDE Locations Assignements.  Same logic should apply as the JDE Location pages.  Users should not be able to create a company or location assignement unless a row in the JDE manager page card is selected
-remove the employee ID and chat handle columns from the JDE Manager cards
-on the JDE Managers page cards; the tables only show 5 rows, increase this number to 15
-on the JDE Companies and Locations page cards; the tables only show 5 rows, increase this number to 15
-the page cards with tabs, the tabs look very similar to command buttons, can you change them to look more like tabs on the table?
-the page cards with tabs, the tabs look very similar to command buttons, can you change them to look more like tabs on the table?
-do the same thing you just did for the search field and command button on the JDE Managers details card in the JDE Companies details card
-add location code column to the left of Location in the Add JDE Location Assignement page card
-add Company code column to the left of Company in the Add JDE Company Assignement page card; The company field on the add JDE Company assignment page should only show the Company code.  the dropdown should be sorted in Ascending order
-in the company dropdown in the add JDE Company Assignment card, the company field should be sort as numeric not alpha
-in the location dropdown in the add JDE Location Assignment card, the location field should be sort as numeric not alpha
-remove employee id field from the Add JDE Manager card
-on the Add JDE Manager card, the Manager Name is auto-generated.  remove this field and replace it with the First and Last Name as separate fields

-add icons to the left of the page links on the left hand pane
-add a hierarchy icon next to the menu pane title called Manager JDE Company/Location Ownership
-on the JDE Co Assignement tab on the JDE Companies page, columns should be left to right as Role, Manager Name, Actions
-on the JDE Location Assignement tab on the JDE Locations page, columns should be left to right as Role, Manager Name, Actions
-sort table by role column ascending order in the JDE Co Assignments tab, sort table by role column ascending order in the JDE Locations Assignments details card, sort table by Location Code column ascending order in the JDE Location Assigment tab on the JDE Managers page, sort table by Company Code column ascending order in the JDE Company Assigment tab on the JDE Managers page
-increase the font size of the table columns and rows for all page cards.  Do not overlap columns or increase the size of the cards to accomodate the larger font.  Table column and row font are too small right now.  please increase the size of the font so that it easily read but not overly large

-update toggle theme to be same as CIP App
-capture DFA network user (Full Name) and place right above theme toggle.  add divider above network user, then add icon to left of DFA network user
-on the JDE Companies page, move the search field and command button on teh JDE Companies card from the right to the left side
-on the JDE Locations page, move the search field and command button on teh JDE Location card from the right to the left side
-on the JDE Managers page, move the search field and command button on teh JDE Manager card from the right to the left side

-add page below Data Management called User Management.  This page should have two card side by side.  Left card should be an admin table with Email, Display Name as columns.  Have the ability to add, edit and delete.  The right side card should be a power user table with Email, Display Name as columns.  Have the ability to add, edit and delete
-Instead of separate cards for Admin and power users, make the user management page one card with a tab for Admin Users and a tab for Power Users

-back to user management: i created a table called cr113_usersecurity in dataverse.  This table will be used by many apps.  for this app you will need to filter on column cr113_application for "Dairy Brands Hierarchy Manager".  For the admin tab, you will need to filter on the column called cr113_roletype for "Admin". For the power users tab, you will need to filter on the column called cr113_roletype for "Power User".  Keep that in mind when adding new users to the table

-on the JDE Managers Page, remove Manager Name and replace with First Name and Last Name.  sort order should now be Last Name ascending order
-revert back to using one column called Manager Name but it should be composed of First Name Last Name

-on the JDE Companies page, when a user clicks a row on the main card, those related locations appear on the details card.  add the ability when the user double clicks a row on the details card, a page will pop up with the related location assignments card (from the JDE Locations page).  closing the new page with return to the JDE Companies page with the same selections
-hide the JDE Locations navigation page button on the left hand pane
-********** removed header cards on pages.  seems redundant for now.  may change later if needed ***block commented those rows out

5/7/2026
-remove Division ID from Add Division page card
-in the data management and user management pages, when a user click the delete command, a prompt should pop up warning of the change.  If the deletion is going to have an impact in other related tables (losing records), deletion is not allowed
-on the add new JDE Manager and the edit JDE Manager pages, include fields for First Name and Last Name
-on the Data Managment page, remove the Employee ID field on the +Add JDE Manager page form
-after deleting a record, close the Confirm Delete prompt either way if a record is deleted or not.  If the record is delete, provide a confirmation in green just like the red confirmation message if it can't delete the record
-on the location assignments pop up prompt page, increase the vertical size of the card and the table in the card should maximize to the size of the card
-on the JDE Managers page, there is now a blank container card behind the main card.  Remove this card but nothing else should change

-all table headers and row fonts should be the same size
-I need to implement security. Users in the admin table have access to all pages, users in the power users table have access to Home, JDE Companies and JDE Managers pages. All other users only have access to the Home page.
-hide the JDE Location Page navigation from the left hand pane
-on the Data Management page, add tabs for cr113_jde_co_assignments and cr113_jde_loc_assignments;  also make the tab header row the same width as the current card on the page
-on the User Management page, amake the tab header row the same width as the current card on the page
-on the User Management page, add a tab for Super Users.  Same logic as the other tabs except filter on Application called Dairy Brands Hierarchy Manager and Role Type of Super or value 3
-on the Add and Edit Admin Users page, add fields for User Name, Email.
-on the Add and Edit Power Users page, add fields for User Name, Email.
-on the Add and Edit Super Users page, add fields for User Name, Email.
-I need to update security. Users in the Super Users table have access to everything and have the ability to delete any record.  Users in the admin table cannot see the Super Users tab on the User Management page and cannot see the Company Assignment and Location Assigments on the Date Management page.  Admin users still do not have the ability to delete records if there are impacting records in other related tables
-on the JDE Company Assignments card table, hide the Assignment ID column; The Company, Manager and Role columns are showing a dash instead of data.  These columns should be pulling in data
-on the JDE Locaiton Assignments card table, hide the Assignment ID column; The Location, and Role columns are showing a dash instead of data.  These columns should be pulling in data

-on the edit Admin user page, the edit Power Users Page and the Edit Super Users page, add the dropdown field for Role Type
-on the Add JDE Company Assignment card, the Company dropdown field shows the Company Code.  It should show the Company Code with a space then dash and space then Company Name
-on the Add JDE Location Assignment card, the Location dropdown field shows the Location Code.  It should show the Location Code with a space then dash and space then Location Name

-when light mode is toggled on the app, the user name is still colored white and is not visible, please correct

-there is an extra divider about the user name, please remove it

-update JDE Co Assignment text to Company Assignments and JDE Location Assignments text to Location Assignments
-on the add and edit JDE Location Assignment popup pages, the title header should read Add Location Assignment and Edit Location Assignment

5/8/2026
-on the JDE Managers page, the details card has two tabs: rename JDE Company Assignments to Company Assignments and JDE Location Assignment to Location Assignmments.  Change the command buttons +Add JDE Company Assignment to +Add Assignment and +Add Location Assignment to +Add Assignment
-on the JDE Managers page, within the add company assignment prompt, the company dropdown selection shows just the company code now.  It should so the Company Code space dash space Company name
-on the JDE Managers page, within the add location assignment prompt, the location dropdown selection shows just the location code now.  It should so the Location space dash space Location name
-on the JDE Manager Page main card, change the search filed called Search jde managers... to search managers....; Also, on the same card, change the +Add JDE Manager command button to +Add Manager
-on the Data Management Page tab called Company Assignments, change the header JDE Company Assignments to Company Assignments.  Change the search field from search jde company assignments... to search assignments..; change the +Add JDE Company Assignment to +Add Assignment;  Change the header on the Edit JDE Company Assignment to Edit Company Assignment
-on the Data Management Page tab called Location Assignments, change the search field from search location assignments... to search assignments..; change the +Add JDE Location Assignment to +Add Assignment
-create new page under JDE Managers called Assignments.  This page should have one table card with two tabs: Company Assignments and JDE Assignments.  That card should be similar to the card used on the Data Management Page
-Rename the Navigation page links:  JDE Companies to Companies, JDE Managers to Managers, Data Management to Review Data 
-Create a divider below User Managment called Super; Duplicate the Data Management page and call it App Review and put it in the Super section of the Navigation pane
-Change the Navigation page User Management to Manage Users; The Super section of the Navigation pane should only be accessible to users in the Super table
-on the Review Data page, users in the admin table should have access to the Company Assignments and Location Assignments tab
-on the App Review page, there are no restrictions when deleting records.  No pop-up prompt is needed on this page
-Change the Admin section in the Navigation pane to say Admin Management; the Review Data page should be Data; the Manage Users page should be Users
-Change the Super section in the Navigation pane to say Super Management; the App Review page should say Data Management
-Change Data Management page in the Super Management section to Application Management
-Change Application Management page in the Super Management section to Data Tables
-on the data tables page, remove the container above the main card that says Data Tables

-On the Data Tables page, each card tab should contain the raw tables from Dataverse including all columns.  The actions column for edit and delete should be moved up in the card header above the table headers underneath the search field and command button.  The width of the card should dynamically fit to the width of the page; the card tabs should be be aligned to the left side of the card