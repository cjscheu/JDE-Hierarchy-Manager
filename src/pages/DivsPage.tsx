import { CardPage } from '../components/CardPage'
import { Cr113_jde_divsService } from '../generated/services/Cr113_jde_divsService'

export function DivsPage() {
  return (
    <CardPage
      config={{
        title: 'Divisions',
        description: 'Manage organizational divisions.',
        idField: 'cr113_jde_divid',
        service: Cr113_jde_divsService,
        fields: [
          {
            key: 'cr113_div_name',
            label: 'Division Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. North America',
          },
          {
            key: 'cr113_div_id',
            label: 'Division ID',
            showOnCard: false,
            editable: true,
            placeholder: 'e.g. NA01',
          },
        ],
      }}
    />
  )
}
