import { CardPage } from '../components/CardPage'
import { Cr113_jde_groupsService } from '../generated/services/Cr113_jde_groupsService'
import { ensureGroupCanBeDeleted } from './deleteGuards'

export function GroupsPage() {
  return (
    <CardPage
      config={{
        title: 'Groups',
        description: 'Manage location groups.',
        idField: 'cr113_jde_groupid',
        service: {
          getAll: Cr113_jde_groupsService.getAll,
          create: Cr113_jde_groupsService.create,
          update: Cr113_jde_groupsService.update,
          delete: async (id: string) => {
            await ensureGroupCanBeDeleted(id)
            await Cr113_jde_groupsService.delete(id)
          },
        },
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
