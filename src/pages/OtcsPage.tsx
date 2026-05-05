import { CardPage } from '../components/CardPage'
import { Cr113_jde_otcsService } from '../generated/services/Cr113_jde_otcsService'

export function OtcsPage() {
  return (
    <CardPage
      config={{
        title: 'OTCs',
        description: 'Manage Order-to-Cash designations.',
        idField: 'cr113_jde_otcid',
        service: Cr113_jde_otcsService,
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
