import { CardPage } from '../components/CardPage'
import { Cr113_jde_divsService } from '../generated/services/Cr113_jde_divsService'
import { ensureDivisionCanBeDeleted } from './deleteGuards'

export function DivsPage() {
  return (
    <CardPage
      config={{
        title: 'Divisions',
        description: 'Manage organizational divisions.',
        idField: 'cr113_jde_divid',
        service: {
          getAll: Cr113_jde_divsService.getAll,
          create: Cr113_jde_divsService.create,
          update: Cr113_jde_divsService.update,
          delete: async (id: string) => {
            await ensureDivisionCanBeDeleted(id)
            await Cr113_jde_divsService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_div_name',
            label: 'Division Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. North America',
          },

        ],
      }}
    />
  )
}
