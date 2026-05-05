import { CardPage } from '../components/CardPage'
import { Cr113_jde_typesService } from '../generated/services/Cr113_jde_typesService'

export function TypesPage() {
  return (
    <CardPage
      config={{
        title: 'Company Types',
        description: 'Manage company segment types.',
        idField: 'cr113_jde_typeid',
        service: Cr113_jde_typesService,
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
