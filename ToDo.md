# To Do
-the vertical size of the page cards differs depending on the size of the computer screen.  How do we resolve this so that any user with varying screen sizes can view it the same way proportionally? 
-Add division listing view on the home page with the custom report view for excel
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
-the tabs on top of the data tables page cards should be the same width as the card
-The action column on all pages should revert back prior to last change.  The only page with the Action column not in the table card is the Data Tables page
-on the data tables page card, remove the header and the search field and command button should be aligned to the left side of the card  The command button should stay align on the right side of the search field
-on the Data Tables page card, all tables are empty.  Records should be populating in the card
-on the Data Tables page card, please use the actual column name for the headers.  The current headers are too wide.  Also, rows need to be selectable.  As of right now, the edit and delete commands are not working properly because I can't select individual records
-in those data table card headers, remove the text after the @ character'; Also, remove all dataverse system generated columns from the card.  Leave only the columns that were created by the user
-a column was removed from cr113_user_security called cr113_usertype.  please update the app accordingly
-on the Assignments page, the Company Assignment tab page should default sorted by Company in ascending order
-on the Assignments page, the Location Assignment tab page should default sorted by Location in ascending order

-on the Assignments page and within the Companies tab:  Column order should be cr113_CO_ID as Company Code, cr113_co_desc as Company Name, cr113_segment_name as Company Segment, cr113_segment_type as Company Type, cr113_ledger_type as Company Ledger, cr113_co_ak as Alternate Key, modifiedon as Modified Date.  All of columns can be removed from the Companies tab.  Update the fields on the Add Company pop up page and the edit Company pop up page
-on the Data Tables page, remove the action buttons.  Each row can be edited by double clicking.  Please put a delete icon in its own column on the right side of the table; the modified date is not correct, change it to user time
-on the Data Tables page Companies tab, the rows for Company Segment, Company Type and Company Ledger are empty.  Also, the delete action column should not have a header...it should be blank and the column should be only as wide as the delete icon

-on the Data Tables page Companies tab, the data for Company Segment, Company Type and Company Ledger are pulling a GUID string when it should be pulling the lookup value
-on the Data Tables page Companies tab, after double clicking the row, the edit Company pop up page, the lookup fields should be dropdowns
-on the Data Tables page Companies tab, default sort is Company Code ascending order

-on the Data Tables page, the main card currently shows 7 rows, change that to 10 rows

5/11/2026
-on the add Location Assigment pop up page, the location code is not being submitted into the table.  The location does not need to be selected by the user becuase the page is opened by double clicking the valid location row on the location page.  When a user add a location assignment, the location, the role and the manager all need to be loaded into the location assignment table.  Right now, the only columns being loaded are Role and Manager
-I just noticed there are a high number of rows missing in the location assignment pages..for instance,  Location 178-01 has three records in the cr113_jde_loc_assignments table, however, no rows show up the location assignment page on the app.  Location 178-01 is one example, there are many other location codes missing from the page
-Records are still missing from the Location Assignment cards on the Assignments page, the data page and the data tables pages

5/12/2026
-on the Company Assignment card tab on the Data Tables page, include only these columns: cr113_CompanyCode, cr113_rolename, cr113_manager, and cr113_email.  Force the cr113_CompanyCode column to be a combination of cr113_CompanyCode space dash space cr113_CompanyName.  The table should be sorted by Company Code ascending order numeric
-the Company Assignment table still contains two columns for Assign ID and Assignment ID, those need to be removed.  the cr113_CompanyCode column that is a combination of cr113_CompanyCode space dash space cr113_CompanyName is still missing
-change company code column to Company.  Also the role column is returning no values
-change the email column to pull in cr113_chat instead
-sort the Company Assignment card table by Company ascending order numeric
-Looks good.  Now when I double click the row record to edit, no fields show up on the edit company assignment pop up.  The fields should include Company, Role, Manager, Chat.  the same issue is happening with the Add company assignment pop up
-on the Add company assignment pop up, the chat field should be a dropdown, not a text field.  
-actually remove the chat field from the Add company assignment pop up.  This should be auto populate the table when adding a new record
-on the Assignments page, remove the edit and delete buttons and column; when a user double clicks, the edit form should open.  This applies to both tab cards: Company Assignments and Location Assignments
-on the Data page, remove the edit and delete buttons and column; when a user double clicks, the edit form should open.  This applies to all tab cards on the page

-any time a user is adding a new company assignment or location assignement, the Role dropdown should only include role that have not been selected already for that company or location
-on the Managers page, all roles are still available to choose from when adding a new company assignemtn or location assignment.  All other pages are working correctly
-on the Users page, users in the admin table should not be able to see Super Users as on option in the Role Type dropdowns
-on the Companies page, replace the edit button columns on all cards with the double click functionality
-on the Managers page, replace the edit button columns on all cards  with the double click functionality
-on the Users page, replace the edit button columns on all cards  with the double click functionality
-on the Data Tables page, update the delete button icon by adding Delete text to the right of the button
-on the Location Assignment card tab on the Data Tables page, include only these columns: cr113_LocationCode, cr113_rolename, cr113_empl_name, cr113_empl_chat, and modifiedon with user local time.  Force the cr113_LocationCode column to be a combination of cr113_LocationCode space dash space cr113_locationname and call it Location.  The table should be sorted by Location ascending order by numeric
-on the Location Assignment card tab on the Data Tables page, the combination column called Location is not there.  Please remove cr113_email_contact, cr113_Assign_ID, cr113_JDE_Loc_ASSIGNMENTID; column order should be Location, Role, Manager, Contact
-on the Location Assignment card tab on the Data Tables page,  cr113_locationcode and modified date are not on the card. Please add them.  Please remove cr113_email_contact, cr113_Assign_ID, cr113_JDE_Loc_ASSIGNMENTID; column order should be Location Code, Location Name, Role, Manager, Chat, Modified Date
-on the Location Assignment card tab on the Data Tables page, combine cr113_LocationCode space dash space cr113_locationname and call it Location.  The table should be sorted by Location ascending order by numeric
-on the Location Assignment card tab on the Data Tables page, the Location field should be populated on the edit location assignment pop up

-on the Location card tab on the Data Tables page, move tab between Company Assignment and Location Assignments tabs;  only include these columns: Location Code, Location Name, City, State, Division, Group, Location Segment, OTC and Modified Date. Combine Location Code space dash space Location Name as Location and then remove the separate columns for Location Code and Location Name. The table should be sorted by Location ascending order by numeric
-on the Location card tab on the Data Tables page, the table should be sorted by Location column ascending order by numeric

-on the Location card tab on the Data Tables page, separate the Location Column into separate columns: Location Code and Location Name. The table should be sorted by Location column ascending order by numeric
-on the Location card tab on the Data Tables page, the add new location pop up should have these fields: Location Code, Location Name, City, State as text fields; Division, Group, Location Segment and OTC as dropdown fields
-on the Location card tab on the Data Tables page, the edit new location pop up should have these dropdown fields: Location Code, Location Name,  Division, Group, Location Segment and OTC as dropdown fields; City and State as text fields.  The order of the fields should be: Location Code, Location Name, City, State, Division, Group, Location Segment and OTC
-on the Location card tab on the Data Tables page, the add new location pop up should have these fields: Location Code, Location Name, City, State as text fields; Division, Group, Location Segment and OTC as dropdown fields
-on the Location Assignment card tab on the Data Tables page, separate Location Code and Location Name into separate columns in the table. The table should be sorted by Location Code ascending order by numeric. 
-on the Managers card tab on the Data Tables page, only include these columns: First Name, Last Name, Position Title, Email, Chat, and Modified Date.  Table should be sorted the Last Name ascending order; The Add Manager pop up page should include these text fields: First Name, Last Name, Position Title, Email, Chat; the Edit manager pop up page should include these text fields: First Name, Last Name, Position Title, Email, Chat

-on the Groups card tab on the Data Tables page, only include these columns: Groups, and Modified Date. The table should be sorted by Group ascending order; The Add Group pop up page should include these text fields: Group; the Edit Group pop up page should include these text fields: Group
-on the Division card tab on the Data Tables page, only include these columns: Division, and Modified Date. The table should be sorted by Division ascending order. The Add Division pop up page should include these text fields: Division; the Edit Division pop up page should include these text fields: Division
-on the Companies Assignment card tab on the Data Tables page, separate Company Code and Company Name into separate columns in the table. The table should be sorted by Company Code ascending order by numeric. 
-on the Roles card tab on the Data Tables page, only include these columns: Roles, and Modified Date. The table should be sorted by Roles ascending order. The Add Roles pop up page should include these text fields: Roles; the Edit Roles pop up page should include these text fields: Roles
-on the Types card tab on the Data Tables page, only include these columns: Types, and Modified Date. The table should be sorted by Types ascending order. The Add Types pop up page should include these text fields: Types; the Edit Types pop up page should include these text fields: Types
-on the OTC Types card tab on the Data Tables page, only include these columns: OTC Types, and Modified Date. The table should be sorted by OTC Types ascending order. The Add OTC Types pop up page should include these text fields: OTC Types; the Edit OTC Types pop up page should include these text fields: OTC Types
-on the Company Segments card tab on the Data Tables page, only include these columns: Segment Name, and Modified Date. The table should be sorted by Segment Name ascending order. The Add Company Segment pop up page should include these text fields: Segment Name; the Edit Company Segment pop up page should include these text fields: Segment Name
-on the Location Segments card tab on the Data Tables page, only include these columns: Segment Name, and Modified Date. The table should be sorted by Segment Name ascending order. The Add Location Segment pop up page should include these text fields: Segment Name; the Edit Location Segment pop up page should include these text fields: Segment Name
-on the Ledger Types card tab on the Data Tables page, only include these columns: Company Ledger, and Modified Date. The table should be sorted by Company Ledger ascending order. The Add Ledger Types pop up page should include these text fields: Company Ledger; the Edit Ledger Types pop up page should include these text fields: Company Ledger
-Move Ledger Type Tabs on the Data Tables Page, in between OTC Types and Company Segments
-on the User Securities card tab on the Data Tables page, only include these columns: User Name, Email, Application, Role Type, and Modified Date. The table should be sorted by User Name ascending order. The Add User Securities pop up page should include these text fields: User Name, Email and Application, and these dropdown fields: Role Type; the Edit User Securities pop up page should include these text fields: User Name, Email and Application, and these dropdown fields: Role Type;
-Rename the User Securities tab on the Data Tables page to User Security

-on the User Security tab on the Data Tables page, the Role Type column in returning the value, not the alias.  Please correct.  Also, on the add and edit User Security pop ups, the Role Type dropdown should include Super User

-on all cards in the app that contain table records, add to the bottom of the card (inside card bottom padding), X number of Records.
-widen the bottom padding on all cards containing table records so that the X number of Records string is visible 

-on the Data page, remove the following tabs: Managers, Company Assignments and Location Assignments
-Change the Data Page navigation name to Reference Data
-Change the Users page navigation name to User Security
-on the Assignments page, add a columns for the field Chat and call it Contact.  Please add this to both tab cards: Company Assignments and Location Assignments
-on the Assignments page on the Company Assignments tab, move the Role column in between Company and Manager
-on the Assignments page on the Location Assignments tab, move the Role column in between Location and Manager
-on the Assignments page, add an Export to Excel button on the left side of the bottom padding of the card.  Add this button on both card tabs for Company Assignments and Location Assignments.  The exported file should contain only the columns on each card tab

-fix the horizontal divider lines on the navigation pane and page container. see pasted image (boxed in red is the issue)
-add a blank card on the home page beneath the title card.  Put a note in the new card area stating "Division Listing report coming soon..."  The card needs to fit the width of the page and the vertical length of the card should not extend below the build version container on the navigation pane
-the division listing card does not extend the width the of the page.  it only extends the same width as the title card.  The title card width should stay the same, the division listing card needs to be extended to the width of the page
-extend the home page title card to the width of the page as well.  Keep the title and title description text centered as is
 
5/13/2026
-the table cr113_jde_location has a new column called cr113_locationtype.  Add the new column to the app schemas and datasources
-on the companies page and on the related records cards +add location pop up page, add cr113_locationtype as a dropdown option below the OTC field
-on the data tables page and on the location tab card and +add and edit location pop up page, add cr113_locationtype as a dropdown option below the OTC field
-on the add and edit location pop up page cards, put Division and Group side by side.  These pop up pages are too tall for the browser

-unhide the Location Page

-remove Locations Page title card
-on the Location page main card, remove the Company column and remove Actions column and the edit button.  Rows should be editable by double clicking
-on the Location page details card, remove Actions column and the edit button.  Rows should be editable by double clicking
-when adding a new location, the record is created but the Company Code lookup column is blank.   A Company Code dropdown on the pop up page should be added, top row; the location code field should be on the second row side by side to the left of the location Name field
-on the Add and Edit Location pop up page process on the Companies page,  update those processes the same as the line above
-on the Location page details card, remove Actions column with the edit button.  Rows should be editable by double clicking
-on the Managers page, the bottom of the right side card should never extend below the bottom of the left side card, apply this logic to the Companies, and Locations pages
-let the container card on the right side shrink and grow with the card inside.  logic applied in line above still applies
-on the data tables page, the card should never go lower than the bottom build version container on the navigation screen.  vertical scroll bar on the card table is expected.

5/14/2026
-on the Location page, when the left card row is double clicked, and the edit location page pops up, the company code dropdown field should not be editable
-on the Companies page right hand side card, when the row is double clicked, and the Add location page pops up, add the the company code dropdown field above Location Code and Location Name
-on the Data Tables page Location Tab, and on the Add location pop up page, add the the company code dropdown field above Location Code and Location Name which should be side by side
-on the Data Tables page Location Tab, when the row is double clicked, and the Edit location page pops up, add the the company code dropdown field as non-editable above Location Code and Location Name which should be side by side
-on the Companies page right hand side card, Add an Action column to the right of Location Name;  There should be text called Assignments in light blue; when you user clicks Assignments, a pop up page with open with all of the location assignments for that location.  The pop up page should be the same card used on the Location Page right side card

5/15/2026
-on the companies page, when adding assignments, the manager dropdown needs to be sorted alpha A to Z by Last Name.  Kenneth Orf is the first manager in the list.
-on the locations page, when adding assignments, the manager dropdown needs to be sorted alpha A to Z by Last Name.  Kenneth Orf is the first manager in the list.  This is similar to the most recent change on the Companies page
-on the Assignments page, when adding assignments, the manager dropdown needs to be sorted alpha A to Z by Last Name.  Kenneth Orf is the first manager in the list.  This is similar to the most recent change on the Companies and Locations pages
-on the Data Tabls page, on the Company Assignment and Location Assignment tabs, when adding assignments, the manager dropdown needs to be sorted alpha A to Z by Last Name.  Kenneth Orf is the first manager in the list.  This is similar to the most recent change on the Companies, Locations and Assignment pages

-update the app so that dark mode is a few shades lighter