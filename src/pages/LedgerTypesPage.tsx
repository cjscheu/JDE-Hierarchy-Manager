import { CardPage } from '../components/CardPage'
import { Cr113_jde_ledger_typesService } from '../generated/services/Cr113_jde_ledger_typesService'
import { ensureLedgerTypeCanBeDeleted } from './deleteGuards'

export function LedgerTypesPage() {
  return (
    <CardPage
      config={{
        title: 'Ledger Types',
        description: 'Manage ledger types used by companies.',
        idField: 'cr113_jde_ledger_typeid',
        service: {
          getAll: Cr113_jde_ledger_typesService.getAll,
          create: Cr113_jde_ledger_typesService.create,
          update: Cr113_jde_ledger_typesService.update,
          delete: async (id: string) => {
            await ensureLedgerTypeCanBeDeleted(id)
            await Cr113_jde_ledger_typesService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_co_ledger_type_name',
            label: 'Ledger Type Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. Actual (AA)',
          },
          {
            key: 'cr113_co_ledger_ak',
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
