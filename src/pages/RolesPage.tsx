import { CardPage } from '../components/CardPage'
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService'
import { ensureRoleCanBeDeleted } from './deleteGuards'

export function RolesPage() {
  return (
    <CardPage
      config={{
        title: 'Roles',
        description: 'Manage JDE roles that can be assigned to managers.',
        idField: 'cr113_jde_rolesid',
        service: {
          getAll: Cr113_jde_rolesesService.getAll,
          create: Cr113_jde_rolesesService.create,
          update: Cr113_jde_rolesesService.update,
          delete: async (id: string) => {
            await ensureRoleCanBeDeleted(id)
            await Cr113_jde_rolesesService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_role_name',
            label: 'Role Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. Finance Manager',
          },
          {
            key: 'cr113_role_ak',
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
