import { CardPage } from '../components/CardPage'
import { Cr113_jde_loc_assignmentsService } from '../generated/services/Cr113_jde_loc_assignmentsService'

export function LocationAssignmentsPage() {
  return (
    <CardPage
      config={{
        title: 'JDE Location Assignments',
        description: 'Manage manager and role assignments at the location level.',
        idField: 'cr113_jde_loc_assignmentid',
        service: Cr113_jde_loc_assignmentsService,
        fields: [
          {
            key: 'cr113_assign_id',
            label: 'Assignment ID',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. LOC-ASSIGN-001',
          },
          {
            key: 'cr113_empl_name',
            label: 'Employee',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_locationcodename',
            label: 'Location',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_rolenamename',
            label: 'Role',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_assign_ak',
            label: 'Alternate Key',
            showOnCard: true,
            editable: true,
            placeholder: 'Optional alternate key',
          },
          {
            key: 'cr113_Empl_Id@odata.bind',
            label: 'Employee Bind Path',
            showOnCard: false,
            editable: true,
            placeholder: '/cr113_jde_managers(<guid>)',
          },
          {
            key: 'cr113_LocationCode@odata.bind',
            label: 'Location Bind Path',
            showOnCard: false,
            editable: true,
            placeholder: '/cr113_jde_locations(<guid>)',
          },
          {
            key: 'cr113_RoleName@odata.bind',
            label: 'Role Bind Path',
            showOnCard: false,
            editable: true,
            placeholder: '/cr113_jde_roleses(<guid>)',
          },
        ],
      }}
    />
  )
}
