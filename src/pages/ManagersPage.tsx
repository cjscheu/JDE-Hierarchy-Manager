import { CardPage } from '../components/CardPage'
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService'

export function ManagersPage() {
  return (
    <CardPage
      config={{
        title: 'JDE Managers',
        description: 'Manage manager contact and profile data.',
        idField: 'cr113_jde_managerid',
        service: Cr113_jde_managersService,
        fields: [
          {
            key: 'cr113_manager_name',
            label: 'Manager Name',
            showOnCard: true,
            editable: true,
            placeholder: 'e.g. Jane Doe',
          },
          {
            key: 'cr113_empl_id',
            label: 'Employee ID',
            showOnCard: false,
            editable: true,
            required: true,
            placeholder: 'e.g. E12345',
          },
          {
            key: 'cr113_position_title',
            label: 'Position Title',
            showOnCard: true,
            editable: true,
            placeholder: 'e.g. Operations Manager',
          },
          {
            key: 'cr113_email',
            label: 'Email',
            showOnCard: true,
            editable: true,
            placeholder: 'e.g. user@contoso.com',
          },
          {
            key: 'cr113_chat',
            label: 'Chat Handle',
            showOnCard: false,
            editable: true,
            placeholder: 'Optional',
          },
          {
            key: 'cr113_manager_ak',
            label: 'Alternate Key',
            showOnCard: true,
            editable: true,
            placeholder: 'Optional alternate key',
          },
        ],
      }}
    />
  )
}
