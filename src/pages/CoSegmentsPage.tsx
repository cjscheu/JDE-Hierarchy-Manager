import { CardPage } from '../components/CardPage'
import { Cr113_jde_co_segmentsService } from '../generated/services/Cr113_jde_co_segmentsService'
import { ensureCompanySegmentCanBeDeleted } from './deleteGuards'

export function CoSegmentsPage() {
  return (
    <CardPage
      config={{
        title: 'Company Segments',
        description: 'Manage company segment classifications.',
        idField: 'cr113_jde_co_segmentid',
        service: {
          getAll: Cr113_jde_co_segmentsService.getAll,
          create: Cr113_jde_co_segmentsService.create,
          update: Cr113_jde_co_segmentsService.update,
          delete: async (id: string) => {
            await ensureCompanySegmentCanBeDeleted(id)
            await Cr113_jde_co_segmentsService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_co_segment_name',
            label: 'Segment Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. Corporate',
          },
          {
            key: 'cr113_co_segment_ak',
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
