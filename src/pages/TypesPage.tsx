import { CardPage } from '../components/CardPage'
import { Cr113_jde_typesService } from '../generated/services/Cr113_jde_typesService'
import { ensureCompanyTypeCanBeDeleted } from './deleteGuards'

export function TypesPage() {
  return (
    <CardPage
      config={{
        title: 'Company Types',
        description: 'Manage company segment types.',
        idField: 'cr113_jde_typeid',
        service: {
          getAll: Cr113_jde_typesService.getAll,
          create: Cr113_jde_typesService.create,
          update: Cr113_jde_typesService.update,
          delete: async (id: string) => {
            await ensureCompanyTypeCanBeDeleted(id)
            await Cr113_jde_typesService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_co_type_name',
            label: 'Type Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. Subsidiary',
          },
          {
            key: 'cr113_co_type_ak',
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
