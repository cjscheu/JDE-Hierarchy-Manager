import { useEffect, useState } from 'react'
import { CardPage } from '../components/CardPage'
import { Cr113_jde_loc_assignmentsService } from '../generated/services/Cr113_jde_loc_assignmentsService'
import { Cr113_jde_locationsService } from '../generated/services/Cr113_jde_locationsService'
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService'
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService'
import { getAllPages } from '../utils/dataversePaging'

type LookupOption = { label: string; value: string }

const toLookupBind = (entitySet: string, id?: string) => (id ? `/${entitySet}(${id})` : undefined)
const normalizeLookupId = (id?: string) => (id ?? '').replace(/[{}]/g, '').toLowerCase()
const getFormattedLookup = (row: unknown, key: string) => {
  const safeRow = row as unknown as Record<string, unknown>
  const value = safeRow[key]
  return typeof value === 'string' ? value : undefined
}

const buildPayload = (record: Record<string, string>) => {
  const { cr113_locationcode, cr113_empl_id, cr113_rolename, ...rest } = record
  const payload: Record<string, string> = { ...rest }
  const locationBind = toLookupBind('cr113_jde_locations', cr113_locationcode)
  const managerBind = toLookupBind('cr113_jde_managers', cr113_empl_id)
  const roleBind = toLookupBind('cr113_jde_roleses', cr113_rolename)
  if (locationBind) payload['cr113_LocationCode@odata.bind'] = locationBind
  if (managerBind) payload['cr113_Empl_Id@odata.bind'] = managerBind
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind
  return payload
}

export function LocationAssignmentsPage() {
  const [locationOptions, setLocationOptions] = useState<LookupOption[]>([])
  const [managerOptions, setManagerOptions] = useState<LookupOption[]>([])
  const [roleOptions, setRoleOptions] = useState<LookupOption[]>([])

  useEffect(() => {
    const load = async () => {
      const [locationsRes, managersRes, rolesRes] = await Promise.all([
        getAllPages(Cr113_jde_locationsService, { select: ['cr113_jde_locationid', 'cr113_coloc_id', 'cr113_coloc_name'] }),
        getAllPages(Cr113_jde_managersService, { select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name'] }),
        getAllPages(Cr113_jde_rolesesService, { select: ['cr113_jde_rolesid', 'cr113_role_name'], orderBy: ['cr113_role_name asc'] }),
      ])
      const rawLocations = (locationsRes.data ?? []).map(l => {
        const locationCode = l.cr113_coloc_id?.trim() ?? ''
        const locationName = l.cr113_coloc_name?.trim() ?? ''
        return {
          value: l.cr113_jde_locationid,
          label: locationCode && locationName ? `${locationCode} - ${locationName}` : locationCode || locationName,
        }
      })
      rawLocations.sort((a, b) => { const an = parseFloat(a.label), bn = parseFloat(b.label); return isFinite(an) && isFinite(bn) ? an - bn : a.label.localeCompare(b.label) })
      setLocationOptions(rawLocations)
      setManagerOptions((managersRes.data ?? []).map(m => ({ value: m.cr113_jde_managerid, label: m.cr113_manager_name ?? `${m.cr113_first_name ?? ''} ${m.cr113_last_name ?? ''}`.trim() })).sort((a, b) => a.label.localeCompare(b.label)))
      setRoleOptions((rolesRes.data ?? []).map(r => ({ value: r.cr113_jde_rolesid, label: r.cr113_role_name })))
    }
    void load()
  }, [])

  const enrichedService = {
    getAll: async () => {
      const [assignmentsRes, locationsRes, managersRes, rolesRes] = await Promise.all([
        getAllPages(Cr113_jde_loc_assignmentsService),
        getAllPages(Cr113_jde_locationsService, { select: ['cr113_jde_locationid', 'cr113_coloc_id', 'cr113_coloc_name'] }),
        getAllPages(Cr113_jde_managersService, { select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name'] }),
        getAllPages(Cr113_jde_rolesesService, { select: ['cr113_jde_rolesid', 'cr113_role_name'] }),
      ])
      if (!assignmentsRes.success) return assignmentsRes
      const locationById = new Map((locationsRes.data ?? []).map(l => [normalizeLookupId(l.cr113_jde_locationid), l.cr113_coloc_id ?? l.cr113_coloc_name ?? '']))
      const managerById = new Map((managersRes.data ?? []).map(m => [normalizeLookupId(m.cr113_jde_managerid), m.cr113_manager_name ?? `${m.cr113_first_name ?? ''} ${m.cr113_last_name ?? ''}`.trim()]))
      const roleById = new Map((rolesRes.data ?? []).map(r => [normalizeLookupId(r.cr113_jde_rolesid), r.cr113_role_name]))
      const data = (assignmentsRes.data ?? []).map(row => ({
        ...row,
        cr113_locationcode: row._cr113_locationcode_value ?? '',
        cr113_empl_id: row._cr113_empl_id_value ?? '',
        cr113_rolename: row._cr113_rolename_value ?? '',
        cr113_locationcodename:
          row.cr113_locationcodename ??
          getFormattedLookup(row, '_cr113_locationcode_value@OData.Community.Display.V1.FormattedValue') ??
          (row._cr113_locationcode_value ? locationById.get(normalizeLookupId(row._cr113_locationcode_value)) : '') ??
          '',
        cr113_empl_name:
          row.cr113_empl_name ??
          getFormattedLookup(row, '_cr113_empl_id_value@OData.Community.Display.V1.FormattedValue') ??
          (row._cr113_empl_id_value ? managerById.get(normalizeLookupId(row._cr113_empl_id_value)) : '') ??
          '',
        cr113_rolenamename:
          row.cr113_rolenamename ??
          getFormattedLookup(row, '_cr113_rolename_value@OData.Community.Display.V1.FormattedValue') ??
          (row._cr113_rolename_value ? roleById.get(normalizeLookupId(row._cr113_rolename_value)) : '') ??
          '',
      }))
      return { ...assignmentsRes, data }
    },
    create: async (record: Record<string, string>) =>
      Cr113_jde_loc_assignmentsService.create(buildPayload(record) as unknown as Parameters<typeof Cr113_jde_loc_assignmentsService.create>[0]),
    update: async (id: string, changes: Record<string, string>) =>
      Cr113_jde_loc_assignmentsService.update(id, buildPayload(changes) as unknown as Parameters<typeof Cr113_jde_loc_assignmentsService.update>[1]),
    delete: Cr113_jde_loc_assignmentsService.delete.bind(Cr113_jde_loc_assignmentsService),
  }

  return (
    <CardPage
      showExportExcelButton={true}
      config={{
        title: 'Location Assignments',
        description: 'Manage manager and role assignments at the location level.',
        hideRowEditAction: true,
        hideRowDeleteAction: true,
        enableRowDoubleClickEdit: true,
        idField: 'cr113_jde_loc_assignmentid',
        defaultSortKey: 'cr113_locationcodename',
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
            key: 'cr113_locationcodename',
            label: 'Location',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_locationcode',
            label: 'Location',
            inputType: 'select',
            options: locationOptions,
            showOnCard: false,
            editable: true,
            required: true,
            placeholder: 'Select location',
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
              const selectedLocationId = formValues.cr113_locationcode ?? String(editTarget?.cr113_locationcode ?? '')
              const currentRoleId = formValues.cr113_rolename ?? String(editTarget?.cr113_rolename ?? '')
              if (!selectedLocationId) return roleOptions

              const usedRoleIds = new Set(
                rows
                  .filter(r => String(r.cr113_locationcode ?? '') === selectedLocationId)
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
          {
            key: 'cr113_empl_name',
            label: 'Manager',
            showOnCard: true,
            editable: false,
          },
          {
            key: 'cr113_empl_id',
            label: 'Manager',
            inputType: 'select',
            options: managerOptions,
            showOnCard: false,
            editable: true,
            required: true,
            placeholder: 'Select manager',
          },
          {
            key: 'cr113_empl_chat',
            label: 'Contact',
            showOnCard: true,
            editable: false,
          },
        ],
      }}
    />
  )
}
