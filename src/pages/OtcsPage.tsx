import { CardPage } from '../components/CardPage'
import { Cr113_jde_otcsService } from '../generated/services/Cr113_jde_otcsService'
import { ensureOtcCanBeDeleted } from './deleteGuards'

export function OtcsPage() {
  return (
    <CardPage
      config={{
        title: 'OTCs',
        description: 'Manage Order-to-Cash designations.',
        idField: 'cr113_jde_otcid',
        service: {
          getAll: Cr113_jde_otcsService.getAll,
          create: Cr113_jde_otcsService.create,
          update: Cr113_jde_otcsService.update,
          delete: async (id: string) => {
            await ensureOtcCanBeDeleted(id)
            await Cr113_jde_otcsService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_otc_name',
            label: 'OTC Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. Direct',
          },
          {
            key: 'cr113_otc_ak',
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
