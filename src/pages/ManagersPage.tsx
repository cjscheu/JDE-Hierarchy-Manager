import { CardPage } from '../components/CardPage'
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService'
import { ensureManagerCanBeDeleted } from './deleteGuards'

export function ManagersPage() {
  return (
    <CardPage
      config={{
        title: 'JDE Managers',
        description: 'Manage manager contact and profile data.',
        idField: 'cr113_jde_managerid',
        service: {
          getAll: Cr113_jde_managersService.getAll,
          create: Cr113_jde_managersService.create,
          update: Cr113_jde_managersService.update,
          delete: async (id: string) => {
            await ensureManagerCanBeDeleted(id)
            await Cr113_jde_managersService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_first_name',
            label: 'First Name',
            showOnCard: true,
            editable: true,
            placeholder: 'e.g. Jane',
            required: true,
          },
          {
            key: 'cr113_last_name',
            label: 'Last Name',
            showOnCard: true,
            editable: true,
            placeholder: 'e.g. Doe',
            required: true,
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
        defaultSortKey: 'cr113_last_name',
        defaultSortDir: 'asc',
      }}
    />
  )
}
