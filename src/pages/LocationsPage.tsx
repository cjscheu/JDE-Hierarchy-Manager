import { useEffect, useRef, useState } from 'react'
import { CardPage, type CardPageHandle } from '../components/CardPage'
import { Cr113_jde_locationsService } from '../generated/services/Cr113_jde_locationsService'
import { Cr113_jde_loc_assignmentsService } from '../generated/services/Cr113_jde_loc_assignmentsService'
import { Cr113_jde_companiesService } from '../generated/services/Cr113_jde_companiesService'
import { Cr113_jde_typesService } from '../generated/services/Cr113_jde_typesService'
import { Cr113_jde_location_segmentsService } from '../generated/services/Cr113_jde_location_segmentsService'
import { Cr113_jde_divsService } from '../generated/services/Cr113_jde_divsService'
import { Cr113_jde_groupsService } from '../generated/services/Cr113_jde_groupsService'
import { Cr113_jde_otcsService } from '../generated/services/Cr113_jde_otcsService'
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService'
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService'

type LookupOption = { label: string; value: string }
const locationTypeNames = new Set(['Managed', 'Not Managed'])

const toLookupBind = (entitySet: string, id?: string) => (id ? `/${entitySet}(${id})` : undefined)

const buildLocationPayload = (record: Record<string, string>) => {
  const {
    cr113_co_id,
    cr113_coloc_segment_name,
    cr113_div_name,
    cr113_group_name,
    cr113_locationtype,
    cr113_otc_name,
    ...rest
  } = record

  // rest already contains cr113_coloc_id, cr113_coloc_name, cr113_coloc_city, cr113_coloc_state
  const payload: Record<string, string> = { ...rest }

  const companyBind = toLookupBind('cr113_jde_companies', cr113_co_id)
  const segmentBind = toLookupBind('cr113_jde_location_segments', cr113_coloc_segment_name)
  const divBind = toLookupBind('cr113_jde_divs', cr113_div_name)
  const groupBind = toLookupBind('cr113_jde_groups', cr113_group_name)
  const locationTypeBind = toLookupBind('cr113_jde_types', cr113_locationtype)
  const otcBind = toLookupBind('cr113_jde_otcs', cr113_otc_name)

  if (companyBind) payload['cr113_CO_ID@odata.bind'] = companyBind
  if (segmentBind) payload['cr113_COLOC_SEGMENT_NAME@odata.bind'] = segmentBind
  if (divBind) payload['cr113_DIV_NAME@odata.bind'] = divBind
  if (groupBind) payload['cr113_GROUP_NAME@odata.bind'] = groupBind
  if (locationTypeBind) payload['cr113_LocationType@odata.bind'] = locationTypeBind
  if (otcBind) payload['cr113_OTC_NAME@odata.bind'] = otcBind

  return payload
}

const buildLocationAssignmentPayload = (record: Record<string, string>, locationId: string) => {
  const {
    cr113_locationcode,
    cr113_empl_id,
    cr113_rolename,
    ...rest
  } = record

  const payload: Record<string, string> = { ...rest }
  const locationBind = toLookupBind('cr113_jde_locations', locationId)
  if (locationBind) payload['cr113_LocationCode@odata.bind'] = locationBind

  const managerBind = toLookupBind('cr113_jde_managers', cr113_empl_id)
  const roleBind = toLookupBind('cr113_jde_roleses', cr113_rolename)

  if (managerBind) payload['cr113_Empl_Id@odata.bind'] = managerBind
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind

  return payload
}

export function LocationsPage() {
  const locationsCardRef = useRef<CardPageHandle | null>(null)
  const assignmentsCardRef = useRef<CardPageHandle | null>(null)

  const [companyOptions, setCompanyOptions] = useState<LookupOption[]>([])
  const [locationTypeOptions, setLocationTypeOptions] = useState<LookupOption[]>([])
  const [locationSegmentOptions, setLocationSegmentOptions] = useState<LookupOption[]>([])
  const [divOptions, setDivOptions] = useState<LookupOption[]>([])
  const [groupOptions, setGroupOptions] = useState<LookupOption[]>([])
  const [otcOptions, setOtcOptions] = useState<LookupOption[]>([])
  const [managerOptions, setManagerOptions] = useState<LookupOption[]>([])
  const [roleOptions, setRoleOptions] = useState<LookupOption[]>([])

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [selectedLocationName, setSelectedLocationName] = useState('')
  const [locationsSearch, setLocationsSearch] = useState('')
  const [assignmentsSearch, setAssignmentsSearch] = useState('')

  useEffect(() => {
    const loadOptions = async () => {
      const [companiesRes, typesRes, segmentsRes, divsRes, groupsRes, otcsRes, managersRes, rolesRes] = await Promise.all([
        Cr113_jde_companiesService.getAll({
          select: ['cr113_jde_companyid', 'cr113_co_id', 'cr113_co_desc'],
        }),
        Cr113_jde_typesService.getAll({
          select: ['cr113_jde_typeid', 'cr113_co_type_name'],
          orderBy: ['cr113_co_type_name asc'],
        }),
        Cr113_jde_location_segmentsService.getAll({
          select: ['cr113_jde_location_segmentid', 'cr113_coloc_segment_name'],
          orderBy: ['cr113_coloc_segment_name asc'],
        }),
        Cr113_jde_divsService.getAll({
          select: ['cr113_jde_divid', 'cr113_div_name'],
          orderBy: ['cr113_div_name asc'],
        }),
        Cr113_jde_groupsService.getAll({
          select: ['cr113_jde_groupid', 'cr113_group_name'],
          orderBy: ['cr113_group_name asc'],
        }),
        Cr113_jde_otcsService.getAll({
          select: ['cr113_jde_otcid', 'cr113_otc_name'],
          orderBy: ['cr113_otc_name asc'],
        }),
        Cr113_jde_managersService.getAll({
          select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name'],
          orderBy: ['cr113_last_name asc', 'cr113_first_name asc'],
        }),
        Cr113_jde_rolesesService.getAll({
          select: ['cr113_jde_rolesid', 'cr113_role_name'],
          orderBy: ['cr113_role_name asc'],
        }),
      ])

      setCompanyOptions(
        (companiesRes.data ?? [])
          .map(item => ({
            value: item.cr113_jde_companyid,
            label: `${item.cr113_co_id ?? ''} - ${item.cr113_co_desc ?? ''}`.trim(),
          }))
          .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }))
      )
      setLocationTypeOptions(
        (typesRes.data ?? [])
          .filter(item => locationTypeNames.has(item.cr113_co_type_name))
          .map(item => ({
            value: item.cr113_jde_typeid,
            label: item.cr113_co_type_name,
          }))
      )
      setLocationSegmentOptions(
        (segmentsRes.data ?? []).map(item => ({
          value: item.cr113_jde_location_segmentid,
          label: item.cr113_coloc_segment_name,
        }))
      )
      setDivOptions(
        (divsRes.data ?? []).map(item => ({
          value: item.cr113_jde_divid,
          label: item.cr113_div_name,
        }))
      )
      setGroupOptions(
        (groupsRes.data ?? []).map(item => ({
          value: item.cr113_jde_groupid,
          label: item.cr113_group_name,
        }))
      )
      setOtcOptions(
        (otcsRes.data ?? []).map(item => ({
          value: item.cr113_jde_otcid,
          label: item.cr113_otc_name,
        }))
      )
      setManagerOptions(
        [...(managersRes.data ?? [])]
          .sort((a: any, b: any) =>
            (a.cr113_last_name ?? '').localeCompare(b.cr113_last_name ?? '') ||
            (a.cr113_first_name ?? '').localeCompare(b.cr113_first_name ?? '')
          )
          .map((item: any) => ({
            value: item.cr113_jde_managerid,
            label: item.cr113_manager_name ?? `${item.cr113_first_name ?? ''} ${item.cr113_last_name ?? ''}`.trim(),
          }))
      )
      setRoleOptions(
        (rolesRes.data ?? []).map((item: any) => ({
          value: item.cr113_jde_rolesid,
          label: item.cr113_role_name,
        }))
      )
    }

    void loadOptions()
  }, [])

  const locationsService = {
    getAll: async () => {
      const [locationsRes, typesRes, segmentsRes, divsRes, groupsRes, otcsRes] = await Promise.all([
        Cr113_jde_locationsService.getAll(),
        Cr113_jde_typesService.getAll({
          select: ['cr113_jde_typeid', 'cr113_co_type_name'],
        }),
        Cr113_jde_location_segmentsService.getAll({
          select: ['cr113_jde_location_segmentid', 'cr113_coloc_segment_name'],
        }),
        Cr113_jde_divsService.getAll({
          select: ['cr113_jde_divid', 'cr113_div_name'],
        }),
        Cr113_jde_groupsService.getAll({
          select: ['cr113_jde_groupid', 'cr113_group_name'],
        }),
        Cr113_jde_otcsService.getAll({
          select: ['cr113_jde_otcid', 'cr113_otc_name'],
        }),
      ])

      if (!locationsRes.success) {
        return locationsRes
      }

      const locationTypeById = new Map<string, string>(
        (typesRes.data ?? []).map(item => [item.cr113_jde_typeid, item.cr113_co_type_name])
      )
      const segmentById = new Map<string, string>(
        (segmentsRes.data ?? []).map(item => [item.cr113_jde_location_segmentid, item.cr113_coloc_segment_name])
      )
      const divById = new Map<string, string>(
        (divsRes.data ?? []).map(item => [item.cr113_jde_divid, item.cr113_div_name])
      )
      const groupById = new Map<string, string>(
        (groupsRes.data ?? []).map(item => [item.cr113_jde_groupid, item.cr113_group_name])
      )
      const otcById = new Map<string, string>(
        (otcsRes.data ?? []).map(item => [item.cr113_jde_otcid, item.cr113_otc_name])
      )

      const data = (locationsRes.data ?? []).map(row => ({
        ...row,
        cr113_co_id: row._cr113_co_id_value ?? '',
        cr113_coloc_segment_name: row._cr113_coloc_segment_name_value ?? '',
        cr113_div_name: row._cr113_div_name_value ?? '',
        cr113_group_name: row._cr113_group_name_value ?? '',
        cr113_locationtype: row._cr113_locationtype_value ?? '',
        cr113_otc_name: row._cr113_otc_name_value ?? '',
        cr113_co_idname: row.cr113_co_idname ?? '',
        cr113_locationtypename:
          row.cr113_locationtypename ??
          (row._cr113_locationtype_value ? locationTypeById.get(row._cr113_locationtype_value) : undefined) ??
          '',
        cr113_coloc_segment_namename:
          row.cr113_coloc_segment_namename ??
          (row._cr113_coloc_segment_name_value ? segmentById.get(row._cr113_coloc_segment_name_value) : undefined) ??
          '',
        cr113_div_namename:
          row.cr113_div_namename ??
          (row._cr113_div_name_value ? divById.get(row._cr113_div_name_value) : undefined) ??
          '',
        cr113_group_namename:
          row.cr113_group_namename ??
          (row._cr113_group_name_value ? groupById.get(row._cr113_group_name_value) : undefined) ??
          '',
        cr113_otc_namename:
          row.cr113_otc_namename ??
          (row._cr113_otc_name_value ? otcById.get(row._cr113_otc_name_value) : undefined) ??
          '',
      }))

      return {
        ...locationsRes,
        data,
      }
    },
    create: async (record: Record<string, string>) =>
      Cr113_jde_locationsService.create(
        buildLocationPayload(record) as unknown as Parameters<typeof Cr113_jde_locationsService.create>[0]
      ),
    update: async (id: string, changes: Record<string, string>) =>
      Cr113_jde_locationsService.update(
        id,
        buildLocationPayload(changes) as unknown as Parameters<typeof Cr113_jde_locationsService.update>[1]
      ),
    delete: Cr113_jde_locationsService.delete,
  }

  const locationAssignmentsService = {
    getAll: async () => {
      if (!selectedLocationId) {
        return { success: true, data: [] }
      }

      const [assignmentsRes, managersRes, rolesRes] = await Promise.all([
        Cr113_jde_loc_assignmentsService.getAll({
          filter: `_cr113_locationcode_value eq ${selectedLocationId}`,
        }),
        Cr113_jde_managersService.getAll({
          select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_empl_id'],
        }),
        Cr113_jde_rolesesService.getAll({
          select: ['cr113_jde_rolesid', 'cr113_role_name'],
        }),
      ])

      if (!assignmentsRes.success) {
        return assignmentsRes
      }

      const managerById = new Map<string, string>(
        (managersRes.data ?? []).map((item: any) => [item.cr113_jde_managerid, item.cr113_manager_name ?? item.cr113_empl_id])
      )
      const roleById = new Map<string, string>(
        (rolesRes.data ?? []).map((item: any) => [item.cr113_jde_rolesid, item.cr113_role_name])
      )

      const data = (assignmentsRes.data ?? [])
        .map((row: any) => ({
          ...row,
          cr113_empl_id: row._cr113_empl_id_value ?? '',
          cr113_rolename: row._cr113_rolename_value ?? '',
          cr113_empl_idname:
            row.cr113_empl_idname ??
            (row._cr113_empl_id_value ? managerById.get(row._cr113_empl_id_value) : undefined) ??
            '',
          cr113_rolenamename:
            row.cr113_rolenamename ??
            (row._cr113_rolename_value ? roleById.get(row._cr113_rolename_value) : undefined) ??
            '',
        }))

      return {
        ...assignmentsRes,
        data,
      }
    },
    create: async (record: Record<string, string>) => {
      if (!selectedLocationId) {
        throw new Error('Select a location before adding an assignment.')
      }

      return Cr113_jde_loc_assignmentsService.create(
        buildLocationAssignmentPayload(record, selectedLocationId) as unknown as Parameters<typeof Cr113_jde_loc_assignmentsService.create>[0]
      )
    },
    update: async (id: string, changes: Record<string, string>) => {
      if (!selectedLocationId) {
        throw new Error('Select a location before editing assignments.')
      }

      return Cr113_jde_loc_assignmentsService.update(
        id,
        buildLocationAssignmentPayload(changes, selectedLocationId) as unknown as Parameters<typeof Cr113_jde_loc_assignmentsService.update>[1]
      )
    },
    delete: Cr113_jde_loc_assignmentsService.delete,
  }

  return (
    <div className="companies-page">
{/*       <section className="companies-page-title-card">
        <h2 className="companies-page-title">JDE Locations</h2>
        <p className="companies-page-subtitle">Manage JDE locations and location assignment records.</p>
      </section> */}

      <div className="companies-layout">
        <section className="companies-main">
          <div className="companies-main-shell">
            <div className="companies-main-topbar">
              <div className="companies-main-toolbar">
                <input
                  className="cp-search"
                  type="search"
                  placeholder="Search jde locations..."
                  value={locationsSearch}
                  onChange={e => {
                    const next = e.target.value
                    setLocationsSearch(next)
                    locationsCardRef.current?.setSearchValue(next)
                  }}
                />
                <button
                  className="cp-btn cp-btn-primary"
                  onClick={() => locationsCardRef.current?.openAddForm()}
                >
                  + Add Location
                </button>
              </div>
            </div>

            <CardPage
              ref={locationsCardRef}
              config={{
                title: 'Locations',
                description: 'Manage JDE location records. Select a row to load related assignment details.',
                hideHeaderCopy: true,
                hideHeaderActions: true,
                hideRowEditAction: true,
                hideRowDeleteAction: true,
                enableRowDoubleClickEdit: true,
                idField: 'cr113_jde_locationid',
                service: locationsService,
                defaultSortKey: 'cr113_coloc_id',
                defaultSortDir: 'asc',
                selectedRowId: selectedLocationId,
                onRowSelect: row => {
                  setSelectedLocationId(String(row.cr113_jde_locationid))
                  setSelectedLocationName(String(row.cr113_coloc_name ?? row.cr113_coloc_id ?? ''))
                },
                onRowsLoaded: rows => {
                  if (rows.length === 0) {
                    setSelectedLocationId(null)
                    setSelectedLocationName('')
                    return
                  }

                  const selectedStillExists = selectedLocationId
                    ? rows.some(row => String(row.cr113_jde_locationid) === selectedLocationId)
                    : false

                  if (!selectedStillExists) {
                    setSelectedLocationId(null)
                    setSelectedLocationName('')
                  }
                },
                fields: [
                  {
                    key: 'cr113_co_id',
                    label: 'Company Code',
                    inputType: 'select',
                    editable: true,
                    readOnlyOnEdit: true,
                    showOnCard: false,
                    placeholder: 'Select company',
                    options: companyOptions,
                  },
                  {
                    key: 'cr113_coloc_id',
                    label: 'Location Code',
                    showOnCard: true,
                    editable: true,
                    required: true,
                    layout: 'half',
                    placeholder: 'e.g. 1001',
                  },
                  {
                    key: 'cr113_coloc_name',
                    label: 'Location Name',
                    showOnCard: true,
                    editable: true,
                    required: true,
                    layout: 'half',
                    placeholder: 'e.g. Dallas HQ',
                  },
                  {
                    key: 'cr113_locationtypename',
                    label: 'Location Type',
                    showOnCard: true,
                    editable: false,
                  },
                  {
                    key: 'actions',
                    label: 'Actions',
                    showOnCard: false, // Hide the Actions column
                  },
                  {
                    key: 'cr113_coloc_city',
                    label: 'City',
                    showOnCard: false,
                    editable: true,
                    placeholder: 'e.g. Dallas',
                  },
                  {
                    key: 'cr113_coloc_state',
                    label: 'State',
                    showOnCard: false,
                    editable: true,
                    placeholder: 'e.g. TX',
                  },
                  {
                    key: 'cr113_coloc_segment_namename',
                    label: 'Location Segment',
                    showOnCard: false,
                    editable: false,
                  },
                  {
                    key: 'cr113_coloc_segment_name',
                    label: 'Location Segment',
                    inputType: 'select',
                    editable: true,
                    options: locationSegmentOptions,
                    showOnCard: false,
                    placeholder: 'Select location segment',
                  },
                  {
                    key: 'cr113_div_namename',
                    label: 'Division',
                    showOnCard: false,
                    editable: false,
                  },
                  {
                    key: 'cr113_div_name',
                    label: 'Division',
                    inputType: 'select',
                    layout: 'half',
                    editable: true,
                    options: divOptions,
                    showOnCard: false,
                    placeholder: 'Select division',
                  },
                  {
                    key: 'cr113_group_namename',
                    label: 'Group',
                    showOnCard: false,
                    editable: false,
                  },
                  {
                    key: 'cr113_group_name',
                    label: 'Group',
                    inputType: 'select',
                    layout: 'half',
                    editable: true,
                    options: groupOptions,
                    showOnCard: false,
                    placeholder: 'Select group',
                  },
                  {
                    key: 'cr113_otc_namename',
                    label: 'OTC',
                    showOnCard: false,
                    editable: false,
                  },
                  {
                    key: 'cr113_otc_name',
                    label: 'OTC',
                    inputType: 'select',
                    editable: true,
                    options: otcOptions,
                    showOnCard: false,
                    placeholder: 'Select OTC',
                  },
                  {
                    key: 'cr113_locationtype',
                    label: 'Location Type',
                    inputType: 'select',
                    showOnCard: false,
                    editable: true,
                    required: false,
                    options: locationTypeOptions,
                    placeholder: 'Select location type',
                  },
                ],
              }}
            />
          </div>
        </section>

        <section className="companies-details">
          <div className="companies-details-shell">
            <div className="companies-details-header">
              <p className="companies-details-subtitle">
                {selectedLocationId
                  ? `Related assignments for ${selectedLocationName || 'selected location'}.`
                  : 'Select a location row to load location assignments.'}
              </p>
            </div>

            {selectedLocationId && (
              <div className="companies-details-topbar">
                <div className="companies-details-toolbar">
                  <input
                    className="cp-search"
                    type="search"
                    placeholder="Search jde location assignments..."
                    value={assignmentsSearch}
                    onChange={e => {
                      const next = e.target.value
                      setAssignmentsSearch(next)
                      assignmentsCardRef.current?.setSearchValue(next)
                    }}
                  />
                  <button
                    className="cp-btn cp-btn-primary"
                    onClick={() => assignmentsCardRef.current?.openAddForm()}
                  >
                    + Add Assignment
                  </button>
                </div>
              </div>
            )}

            {!selectedLocationId ? (
              <div className="companies-details-empty">
                Select a location in the main table to view and manage related location assignments.
              </div>
            ) : (
              <CardPage
                ref={assignmentsCardRef}
                key={`location-assignments-${selectedLocationId}`}
                config={{
                  title: 'Location Assignments',
                  description: 'Create, edit, and delete assignments related to the selected location.',
                  hideHeaderCopy: true,
                  hideHeaderActions: true,
                  hideRowEditAction: true,
                  hideRowDeleteAction: true,
                  enableRowDoubleClickEdit: true,
                  idField: 'cr113_jde_loc_assignmentid',
                  service: locationAssignmentsService,
                  defaultSortKey: 'cr113_rolenamename',
                  defaultSortDir: 'asc',
                  fields: [
                    {
                      key: 'cr113_assign_id',
                      label: 'Assignment ID',
                      showOnCard: false,
                      editable: false,
                    },
                    // Show Role first
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
                      editable: true,
                      required: true,
                      options: ({ formValues, editTarget, rows }) => {
                        const currentRoleId = formValues.cr113_rolename ?? String(editTarget?.cr113_rolename ?? '')
                        const usedRoleIds = new Set(
                          rows
                            .map(r => String(r.cr113_rolename ?? ''))
                            .filter(Boolean)
                        )
                        usedRoleIds.delete(currentRoleId)
                        return roleOptions.filter(opt => !usedRoleIds.has(opt.value) || opt.value === currentRoleId)
                      },
                      showOnCard: false,
                      placeholder: 'Select role',
                    },
                    // Then Manager Name
                    {
                      key: 'cr113_empl_idname',
                      label: 'Manager',
                      showOnCard: true,
                      editable: false,
                    },
                    {
                      key: 'cr113_empl_id',
                      label: 'Manager',
                      inputType: 'select',
                      editable: true,
                      required: true,
                      options: managerOptions,
                      showOnCard: false,
                      placeholder: 'Select manager',
                    },
                    {
                      key: 'cr113_assign_ak',
                      label: 'Alternate Key',
                      showOnCard: false,
                      editable: true,
                      placeholder: 'Optional alternate key',
                    },
                  ],
                }}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
