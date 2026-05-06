import { CardPage } from '../components/CardPage'
import { Cr113_jde_co_assignmentsService } from '../generated/services/Cr113_jde_co_assignmentsService'

export function CompanyAssignmentsPage() {
  return (
    <CardPage
      config={{
        title: 'JDE Company Assignments',
        description: 'Manage manager and role assignments at the company level.',
        idField: 'cr113_jde_co_assignmentid',
        service: Cr113_jde_co_assignmentsService,
        fields: [
          {
            key: 'cr113_assign_id',
            label: 'Assignment ID',
            showOnCard: true,
            editable: true,
            required: true,
            placeholder: 'e.g. ASSIGN-001',
          },
          {
            key: 'cr113_companycodename',
            label: 'Company',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_managernamename',
            label: 'Manager',
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
            key: 'cr113_CompanyCode@odata.bind',
            label: 'Company Bind Path',
            showOnCard: false,
            editable: true,
            placeholder: '/cr113_jde_companies(<guid>)',
          },
          {
            key: 'cr113_ManagerName@odata.bind',
            label: 'Manager Bind Path',
            showOnCard: false,
            editable: true,
            placeholder: '/cr113_jde_managers(<guid>)',
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
