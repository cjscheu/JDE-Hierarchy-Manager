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