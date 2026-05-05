import { CardPage } from '../components/CardPage'
import { Cr113_jde_location_segmentsService } from '../generated/services/Cr113_jde_location_segmentsService'

export function LocationSegmentsPage() {
  return (
    <CardPage
      config={{
        title: 'Location Segments',
        description: 'Manage location segment classifications.',
        idField: 'cr113_jde_location_segmentid',
        service: Cr113_jde_location_segmentsService,
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
