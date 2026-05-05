import { CardPage } from '../components/CardPage'
import { Cr113_jde_co_segmentsService } from '../generated/services/Cr113_jde_co_segmentsService'

export function CoSegmentsPage() {
  return (
    <CardPage
      config={{
        title: 'Company Segments',
        description: 'Manage company segment classifications.',
        idField: 'cr113_jde_co_segmentid',
        service: Cr113_jde_co_segmentsService,
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
