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

