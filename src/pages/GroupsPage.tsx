import { CardPage } from '../components/CardPage'
import { Cr113_jde_groupsService } from '../generated/services/Cr113_jde_groupsService'

export function GroupsPage() {
  return (
    <CardPage
      config={{
        title: 'Groups',
        description: 'Manage location groups.',
        idField: 'cr113_jde_groupid',
        service: Cr113_jde_groupsService,
        fields: [
          {
            key: 'cr113_group_name',
            label: 'Group Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. West Region',
          },
          {
            key: 'cr113_group_ak',
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
