import { DataManagementPage } from './DataManagementPage'

export function AppReviewPage() {
  // Render only the DataManagementPage for super users, no extra header
  return <DataManagementPage accessRole="super" />;
}
