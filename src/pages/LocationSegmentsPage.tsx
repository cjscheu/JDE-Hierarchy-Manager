import { CardPage } from '../components/CardPage'
import { Cr113_jde_location_segmentsService } from '../generated/services/Cr113_jde_location_segmentsService'
import { ensureLocationSegmentCanBeDeleted } from './deleteGuards'

export function LocationSegmentsPage() {
  return (
    <CardPage
      config={{
        title: 'Location Segments',
        description: 'Manage location segment classifications.',
        idField: 'cr113_jde_location_segmentid',
        service: {
          getAll: Cr113_jde_location_segmentsService.getAll,
          create: Cr113_jde_location_segmentsService.create,
          update: Cr113_jde_location_segmentsService.update,
          delete: async (id: string) => {
            await ensureLocationSegmentCanBeDeleted(id)
            await Cr113_jde_location_segmentsService.delete(id)
          },
        },
        fields: [
          {
            key: 'cr113_coloc_segment_name',
            label: 'Segment Name',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. Retail',
          },
          {
            key: 'cr113_coloc_segment_ak',
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
