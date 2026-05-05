import { CardPage } from '../components/CardPage'
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService'

export function RolesPage() {
  return (
    <CardPage
      config={{
        title: 'Roles',
        description: 'Manage JDE roles that can be assigned to managers.',
        idField: 'cr113_jde_rolesid',
        service: Cr113_jde_rolesesService,
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
