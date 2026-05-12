import { useEffect, useState } from 'react'
import { CardPage } from '../components/CardPage'
import { Cr113_jde_co_assignmentsService } from '../generated/services/Cr113_jde_co_assignmentsService'
import { Cr113_jde_companiesService } from '../generated/services/Cr113_jde_companiesService'
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService'
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService'

type LookupOption = { label: string; value: string }

const toLookupBind = (entitySet: string, id?: string) => (id ? `/${entitySet}(${id})` : undefined)

const buildPayload = (record: Record<string, string>) => {
  const { cr113_companycode, cr113_managername, cr113_rolename, ...rest } = record
  const payload: Record<string, string> = { ...rest }
  const companyBind = toLookupBind('cr113_jde_companies', cr113_companycode)
  const managerBind = toLookupBind('cr113_jde_managers', cr113_managername)
  const roleBind = toLookupBind('cr113_jde_roleses', cr113_rolename)
  if (companyBind) payload['cr113_CompanyCode@odata.bind'] = companyBind
  if (managerBind) payload['cr113_ManagerName@odata.bind'] = managerBind
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind
  return payload
}

export function CompanyAssignmentsPage() {
  const [companyOptions, setCompanyOptions] = useState<LookupOption[]>([])
  const [managerOptions, setManagerOptions] = useState<LookupOption[]>([])
  const [roleOptions, setRoleOptions] = useState<LookupOption[]>([])

  useEffect(() => {
    const load = async () => {
      const [companiesRes, managersRes, rolesRes] = await Promise.all([
        Cr113_jde_companiesService.getAll({ select: ['cr113_jde_companyid', 'cr113_co_id', 'cr113_co_desc'] }),
        Cr113_jde_managersService.getAll({ select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name'] }),
        Cr113_jde_rolesesService.getAll({ select: ['cr113_jde_rolesid', 'cr113_role_name'], orderBy: ['cr113_role_name asc'] }),
      ])
      const rawCompanies = (companiesRes.data ?? []).map(c => {
        const companyCode = c.cr113_co_id?.trim() ?? ''
        const companyName = c.cr113_co_desc?.trim() ?? ''
        return {
          value: c.cr113_jde_companyid,
          label: companyCode && companyName ? `${companyCode} - ${companyName}` : companyCode || companyName,
        }
      })
      rawCompanies.sort((a, b) => { const an = parseFloat(a.label), bn = parseFloat(b.label); return isFinite(an) && isFinite(bn) ? an - bn : a.label.localeCompare(b.label) })
      setCompanyOptions(rawCompanies)
      setManagerOptions((managersRes.data ?? []).map(m => ({ value: m.cr113_jde_managerid, label: m.cr113_manager_name ?? `${m.cr113_first_name ?? ''} ${m.cr113_last_name ?? ''}`.trim() })).sort((a, b) => a.label.localeCompare(b.label)))
      setRoleOptions((rolesRes.data ?? []).map(r => ({ value: r.cr113_jde_rolesid, label: r.cr113_role_name })))
    }
    void load()
  }, [])

  const enrichedService = {
    getAll: async () => {
      const [assignmentsRes, companiesRes, managersRes, rolesRes] = await Promise.all([
        Cr113_jde_co_assignmentsService.getAll(),
        Cr113_jde_companiesService.getAll({ select: ['cr113_jde_companyid', 'cr113_co_id', 'cr113_co_desc'] }),
        Cr113_jde_managersService.getAll({ select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name'] }),
        Cr113_jde_rolesesService.getAll({ select: ['cr113_jde_rolesid', 'cr113_role_name'] }),
      ])
      if (!assignmentsRes.success) return assignmentsRes
      const companyById = new Map((companiesRes.data ?? []).map(c => [c.cr113_jde_companyid, c.cr113_co_id ?? c.cr113_co_desc ?? '']))
      const managerById = new Map((managersRes.data ?? []).map(m => [m.cr113_jde_managerid, m.cr113_manager_name ?? `${m.cr113_first_name ?? ''} ${m.cr113_last_name ?? ''}`.trim()]))
      const roleById = new Map((rolesRes.data ?? []).map(r => [r.cr113_jde_rolesid, r.cr113_role_name]))
      const data = (assignmentsRes.data ?? []).map(row => ({
        ...row,
        cr113_companycode: row._cr113_companycode_value ?? '',
        cr113_managername: row._cr113_managername_value ?? '',
        cr113_rolename: row._cr113_rolename_value ?? '',
        cr113_companycodename: row.cr113_companycodename ?? (row._cr113_companycode_value ? companyById.get(row._cr113_companycode_value) : '') ?? '',
        cr113_managernamename: row.cr113_managernamename ?? (row._cr113_managername_value ? managerById.get(row._cr113_managername_value) : '') ?? '',
        cr113_rolenamename: row.cr113_rolenamename ?? (row._cr113_rolename_value ? roleById.get(row._cr113_rolename_value) : '') ?? '',
      }))
      return { ...assignmentsRes, data }
    },
    create: async (record: Record<string, string>) =>
      Cr113_jde_co_assignmentsService.create(buildPayload(record) as unknown as Parameters<typeof Cr113_jde_co_assignmentsService.create>[0]),
    update: async (id: string, changes: Record<string, string>) =>
      Cr113_jde_co_assignmentsService.update(id, buildPayload(changes) as unknown as Parameters<typeof Cr113_jde_co_assignmentsService.update>[1]),
    delete: Cr113_jde_co_assignmentsService.delete.bind(Cr113_jde_co_assignmentsService),
  }

  return (
    <CardPage
      config={{
          title: 'Company Assignments',
        description: 'Manage manager and role assignments at the company level.',
        hideRowEditAction: true,
        hideRowDeleteAction: true,
        enableRowDoubleClickEdit: true,
        idField: 'cr113_jde_co_assignmentid',
        defaultSortKey: 'cr113_companycodename',
        defaultSortDir: 'asc',
        service: enrichedService,
        fields: [
          {
            key: 'cr113_assign_id',
            label: 'Assignment ID',
            showOnCard: false,
            editable: false,
          },
          {
            key: 'cr113_companycodename',
            label: 'Company',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_companycode',
            label: 'Company',
            inputType: 'select',
            options: companyOptions,
            showOnCard: false,
            editable: true,
            required: true,
            placeholder: 'Select company',
          },
          {
            key: 'cr113_managernamename',
            label: 'Manager',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_managername',
            label: 'Manager',
            inputType: 'select',
            options: managerOptions,
            showOnCard: false,
            editable: true,
            required: true,
            placeholder: 'Select manager',
          },
          {
            key: 'cr113_rolenamename',
            label: 'Role',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_rolename',
            label: 'Role',
            inputType: 'select',
            options: ({ formValues, editTarget, rows }) => {
              const selectedCompanyId = formValues.cr113_companycode ?? String(editTarget?.cr113_companycode ?? '')
              const currentRoleId = formValues.cr113_rolename ?? String(editTarget?.cr113_rolename ?? '')
              if (!selectedCompanyId) return roleOptions

              const usedRoleIds = new Set(
                rows
                  .filter(r => String(r.cr113_companycode ?? '') === selectedCompanyId)
                  .map(r => String(r.cr113_rolename ?? ''))
                  .filter(Boolean)
              )
              usedRoleIds.delete(currentRoleId)

              return roleOptions.filter(opt => !usedRoleIds.has(opt.value) || opt.value === currentRoleId)
            },
            showOnCard: false,
            editable: true,
            required: true,
            placeholder: 'Select role',
          },
        ],
      }}
    />
  )
}
