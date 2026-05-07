import { useEffect, useRef, useState } from 'react'
import { CardPage, type CardPageHandle } from '../components/CardPage'
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService'
import { Cr113_jde_co_assignmentsService } from '../generated/services/Cr113_jde_co_assignmentsService'
import { Cr113_jde_loc_assignmentsService } from '../generated/services/Cr113_jde_loc_assignmentsService'
import { Cr113_jde_companiesService } from '../generated/services/Cr113_jde_companiesService'
import { Cr113_jde_locationsService } from '../generated/services/Cr113_jde_locationsService'
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService'

type LookupOption = { label: string; value: string }

const toLookupBind = (entitySet: string, id?: string) => (id ? `/${entitySet}(${id})` : undefined)

const buildCompanyAssignmentPayload = (record: Record<string, string>, managerId: string) => {
  const {
    cr113_companycode,
    cr113_rolename,
    ...rest
  } = record

  const payload: Record<string, string> = { ...rest }

  const managerBind = toLookupBind('cr113_jde_managers', managerId)
  const companyBind = toLookupBind('cr113_jde_companies', cr113_companycode)
  const roleBind = toLookupBind('cr113_jde_roleses', cr113_rolename)

  if (managerBind) payload['cr113_ManagerName@odata.bind'] = managerBind
  if (companyBind) payload['cr113_CompanyCode@odata.bind'] = companyBind
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind

  return payload
}

const buildLocationAssignmentPayload = (record: Record<string, string>, managerId: string) => {
  const {
    cr113_locationcode,
    cr113_rolename,
    ...rest
  } = record

  const payload: Record<string, string> = { ...rest }

  const managerBind = toLookupBind('cr113_jde_managers', managerId)
  const locationBind = toLookupBind('cr113_jde_locations', cr113_locationcode)
  const roleBind = toLookupBind('cr113_jde_roleses', cr113_rolename)

  if (managerBind) payload['cr113_Empl_Id@odata.bind'] = managerBind
  if (locationBind) payload['cr113_LocationCode@odata.bind'] = locationBind
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind

  return payload
}

export function ManagersHubPage() {
  const managersCardRef = useRef<CardPageHandle | null>(null)
  const companyAssignmentsCardRef = useRef<CardPageHandle | null>(null)
  const locationAssignmentsCardRef = useRef<CardPageHandle | null>(null)

  const [companyOptions, setCompanyOptions] = useState<LookupOption[]>([])
  const [locationOptions, setLocationOptions] = useState<LookupOption[]>([])
  const [roleOptions, setRoleOptions] = useState<LookupOption[]>([])

  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null)
  const [selectedManagerName, setSelectedManagerName] = useState('')
  const [activeDetailsTab, setActiveDetailsTab] = useState<'company' | 'location'>('company')

  // Removed unused managersSearch state
  const [companyAssignmentsSearch, setCompanyAssignmentsSearch] = useState('')
  const [locationAssignmentsSearch, setLocationAssignmentsSearch] = useState('')

  useEffect(() => {
    const loadOptions = async () => {
      const [companiesRes, locationsRes, rolesRes] = await Promise.all([
        Cr113_jde_companiesService.getAll({
          select: ['cr113_jde_companyid', 'cr113_co_id', 'cr113_co_desc'],
          orderBy: ['cr113_co_id asc'],
        }),
        Cr113_jde_locationsService.getAll({
          select: ['cr113_jde_locationid', 'cr113_coloc_id', 'cr113_coloc_name'],
          orderBy: ['cr113_coloc_id asc'],
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
            label: item.cr113_co_id ?? '',
          }))
          .sort((a, b) => {
            const aNum = Number.parseFloat(a.label)
            const bNum = Number.parseFloat(b.label)
            const aIsNum = Number.isFinite(aNum)
            const bIsNum = Number.isFinite(bNum)

            if (aIsNum && bIsNum) return aNum - bNum
            if (aIsNum) return -1
            if (bIsNum) return 1

            return a.label.localeCompare(b.label)
          })
      )
      setLocationOptions(
        (locationsRes.data ?? [])
          .map(item => ({
            value: item.cr113_jde_locationid,
            label: item.cr113_coloc_id ?? '',
          }))
          .sort((a, b) => {
            const aNum = Number.parseFloat(a.label)
            const bNum = Number.parseFloat(b.label)
            const aIsNum = Number.isFinite(aNum)
            const bIsNum = Number.isFinite(bNum)

            if (aIsNum && bIsNum) return aNum - bNum
            if (aIsNum) return -1
            if (bIsNum) return 1

            return a.label.localeCompare(b.label)
          })
      )
      setRoleOptions(
        (rolesRes.data ?? []).map(item => ({
          value: item.cr113_jde_rolesid,
          label: item.cr113_role_name,
        }))
      )
    }

    void loadOptions()
  }, [])

  const companyAssignmentsService = {
    getAll: async () => {
      if (!selectedManagerId) {
        return { success: true, data: [] }
      }

      const [assignmentsRes, companiesRes, rolesRes] = await Promise.all([
        Cr113_jde_co_assignmentsService.getAll(),
        Cr113_jde_companiesService.getAll({
          select: ['cr113_jde_companyid', 'cr113_co_desc', 'cr113_co_id'],
        }),
        Cr113_jde_rolesesService.getAll({
          select: ['cr113_jde_rolesid', 'cr113_role_name'],
        }),
      ])

      if (!assignmentsRes.success) {
        return assignmentsRes
      }

      const companyById = new Map<string, string>(
        (companiesRes.data ?? []).map(item => [item.cr113_jde_companyid, item.cr113_co_desc ?? item.cr113_co_id])
      )
      const companyCodeById = new Map<string, string>(
        (companiesRes.data ?? []).map(item => [item.cr113_jde_companyid, item.cr113_co_id ?? ''])
      )
      const roleById = new Map<string, string>(
        (rolesRes.data ?? []).map(item => [item.cr113_jde_rolesid, item.cr113_role_name])
      )

      const data = (assignmentsRes.data ?? [])
        .filter(row => row._cr113_managername_value === selectedManagerId)
        .map(row => ({
          ...row,
          cr113_companycode: row._cr113_companycode_value ?? '',
          cr113_companycodecode:
            row._cr113_companycode_value
              ? companyCodeById.get(row._cr113_companycode_value) ?? ''
              : '',
          cr113_rolename: row._cr113_rolename_value ?? '',
          cr113_companycodename:
            row.cr113_companycodename ??
            (row._cr113_companycode_value ? companyById.get(row._cr113_companycode_value) : undefined) ??
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
      if (!selectedManagerId) {
        throw new Error('Select a manager before adding a company assignment.')
      }

      return Cr113_jde_co_assignmentsService.create(
        buildCompanyAssignmentPayload(record, selectedManagerId) as unknown as Parameters<typeof Cr113_jde_co_assignmentsService.create>[0]
      )
    },
    update: async (id: string, changes: Record<string, string>) => {
      if (!selectedManagerId) {
        throw new Error('Select a manager before editing company assignments.')
      }

      return Cr113_jde_co_assignmentsService.update(
        id,
        buildCompanyAssignmentPayload(changes, selectedManagerId) as unknown as Parameters<typeof Cr113_jde_co_assignmentsService.update>[1]
      )
    },
    delete: Cr113_jde_co_assignmentsService.delete,
  }

  const locationAssignmentsService = {
    getAll: async () => {
      if (!selectedManagerId) {
        return { success: true, data: [] }
      }

      const [assignmentsRes, locationsRes, rolesRes] = await Promise.all([
        Cr113_jde_loc_assignmentsService.getAll(),
        Cr113_jde_locationsService.getAll({
          select: ['cr113_jde_locationid', 'cr113_coloc_name', 'cr113_coloc_id'],
        }),
        Cr113_jde_rolesesService.getAll({
          select: ['cr113_jde_rolesid', 'cr113_role_name'],
        }),
      ])

      if (!assignmentsRes.success) {
        return assignmentsRes
      }

      const locationCodeById = new Map<string, string>(
        (locationsRes.data ?? []).map(item => [item.cr113_jde_locationid, item.cr113_coloc_id ?? ''])
      )
      const locationById = new Map<string, string>(
        (locationsRes.data ?? []).map(item => [item.cr113_jde_locationid, item.cr113_coloc_name ?? item.cr113_coloc_id])
      )
      const roleById = new Map<string, string>(
        (rolesRes.data ?? []).map(item => [item.cr113_jde_rolesid, item.cr113_role_name])
      )

      const data = (assignmentsRes.data ?? [])
        .filter(row => row._cr113_empl_id_value === selectedManagerId)
        .map(row => ({
          ...row,
          cr113_locationcode: row._cr113_locationcode_value ?? '',
          cr113_rolename: row._cr113_rolename_value ?? '',
          cr113_locationcodecode:
            row._cr113_locationcode_value
              ? locationCodeById.get(row._cr113_locationcode_value) ?? ''
              : '',
          cr113_locationcodename:
            row.cr113_locationcodename ??
            (row._cr113_locationcode_value ? locationById.get(row._cr113_locationcode_value) : undefined) ??
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
      if (!selectedManagerId) {
        throw new Error('Select a manager before adding a location assignment.')
      }

      return Cr113_jde_loc_assignmentsService.create(
        buildLocationAssignmentPayload(record, selectedManagerId) as unknown as Parameters<typeof Cr113_jde_loc_assignmentsService.create>[0]
      )
    },
    update: async (id: string, changes: Record<string, string>) => {
      if (!selectedManagerId) {
        throw new Error('Select a manager before editing location assignments.')
      }

      return Cr113_jde_loc_assignmentsService.update(
        id,
        buildLocationAssignmentPayload(changes, selectedManagerId) as unknown as Parameters<typeof Cr113_jde_loc_assignmentsService.update>[1]
      )
    },
    delete: Cr113_jde_loc_assignmentsService.delete,
  }
  return (
    <div className="companies-page managers-page">
      <section className="companies-page-title-card">
        <h2 className="companies-page-title">JDE Managers</h2>
        <p className="companies-page-subtitle">Manage JDE managers and related assignment records.</p>
      </section>

      <div className="companies-layout">
        <section className="companies-main">
          <div className="companies-main-shell">
            <div className="companies-main-topbar">
              <div className="companies-main-toolbar">
                <CardPage
                  ref={managersCardRef}
                  config={{
                    title: 'JDE Managers',
                    description: 'Manage JDE manager records. Select a row to load assignment details.',
                    hideHeaderCopy: true,
                    hideHeaderActions: false,
                    hideRowDeleteAction: true,
                    idField: 'cr113_jde_managerid',
                    service: {
                      async getAll(options: any = {}) {
                        const res = await Cr113_jde_managersService.getAll(options)
                        return {
                          ...res,
                          data: (res.data ?? []).map((row: any) => ({
                            ...row,
                            cr113_manager_name: `${row.cr113_first_name ?? ''} ${row.cr113_last_name ?? ''}`.trim(),
                          })),
                        }
                      },
                      create: Cr113_jde_managersService.create,
                      update: Cr113_jde_managersService.update,
                      delete: Cr113_jde_managersService.delete,
                    },
                    defaultSortKey: 'cr113_last_name',
                    defaultSortDir: 'asc',
                    selectedRowId: selectedManagerId,
                    onRowSelect: row => {
                      setSelectedManagerId(String(row.cr113_jde_managerid))
                      setSelectedManagerName(String(row.cr113_manager_name ?? row.cr113_empl_id ?? ''))
                    },
                    onRowsLoaded: rows => {
                      // keep CardPage search in sync with managersSearch state
                      // CardPage now manages its own search state

                      if (rows.length === 0) {
                        setSelectedManagerId(null)
                        setSelectedManagerName('')
                        return
                      }

                      const selectedStillExists = selectedManagerId
                        ? rows.some(row => String(row.cr113_jde_managerid) === selectedManagerId)
                        : false

                      if (!selectedStillExists) {
                        setSelectedManagerId(null)
                        setSelectedManagerName('')
                      }
                    },
                    fields: [
                      {
                        key: 'cr113_manager_name',
                        label: 'Manager Name',
                        showOnCard: true,
                        editable: false,
                      },
                      {
                        key: 'cr113_position_title',
                        label: 'Position Title',
                        showOnCard: true,
                        editable: true,
                        placeholder: 'e.g. Operations Manager',
                      },
                      {
                        key: 'cr113_email',
                        label: 'Email',
                        showOnCard: true,
                        editable: true,
                        placeholder: 'e.g. user@contoso.com',
                      },
                      {
                        key: 'cr113_chat',
                        label: 'Chat Handle',
                        showOnCard: false,
                        editable: true,
                        placeholder: 'Optional',
                      },
                      {
                        key: 'cr113_manager_ak',
                        label: 'Alternate Key',
                        showOnCard: false,
                        editable: true,
                        placeholder: 'Optional alternate key',
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="companies-details">
          <div className="companies-details-shell">
            <div className="companies-details-header">
              <p className="companies-details-subtitle">
                {selectedManagerId
                  ? `Related assignments for ${selectedManagerName || 'selected manager'}.`
                  : 'Select a manager row to load related assignments.'}
              </p>
            </div>

            {selectedManagerId && (
              <div className="companies-details-topbar managers-details-tools-row">
                {activeDetailsTab === 'company' ? (
                  <div className="companies-details-toolbar">
                    <input
                      className="cp-search"
                      type="search"
                      placeholder="Search jde company assignments..."
                      value={companyAssignmentsSearch}
                      onChange={e => {
                        const next = e.target.value
                        setCompanyAssignmentsSearch(next)
                        companyAssignmentsCardRef.current?.setSearchValue(next)
                      }}
                    />
                    <button
                      className="cp-btn cp-btn-primary"
                      onClick={() => companyAssignmentsCardRef.current?.openAddForm()}
                    >
                      + Add JDE Company Assignment
                    </button>
                  </div>
                ) : (
                  <div className="companies-details-toolbar">
                    <input
                      className="cp-search"
                      type="search"
                      placeholder="Search jde location assignments..."
                      value={locationAssignmentsSearch}
                      onChange={e => {
                        const next = e.target.value
                        setLocationAssignmentsSearch(next)
                        locationAssignmentsCardRef.current?.setSearchValue(next)
                      }}
                    />
                    <button
                      className="cp-btn cp-btn-primary"
                      onClick={() => locationAssignmentsCardRef.current?.openAddForm()}
                    >
                      + Add JDE Location Assignment
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="companies-details-tabs managers-details-tabs" role="tablist" aria-label="Manager detail tabs">
              <button
                className={`companies-tab-btn${activeDetailsTab === 'company' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeDetailsTab === 'company'}
                onClick={() => setActiveDetailsTab('company')}
              >
                JDE Company Assignments
              </button>
              <button
                className={`companies-tab-btn${activeDetailsTab === 'location' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeDetailsTab === 'location'}
                onClick={() => setActiveDetailsTab('location')}
              >
                JDE Location Assignments
              </button>
            </div>

            {!selectedManagerId ? (
              <div className="companies-details-empty">
                Select a manager in the main table to view and manage company and location assignments.
              </div>
            ) : activeDetailsTab === 'company' ? (
              <CardPage
                ref={companyAssignmentsCardRef}
                key={`manager-company-assignments-${selectedManagerId}`}
                config={{
                  title: 'JDE Company Assignments',
                  description: 'Create, edit, and delete company assignments related to the selected manager.',
                  hideHeaderCopy: true,
                  hideHeaderActions: true,
                  hideRowDeleteAction: true,
                  idField: 'cr113_jde_co_assignmentid',
                  service: companyAssignmentsService,
                  defaultSortKey: 'cr113_companycodecode',
                  defaultSortDir: 'asc',
                  fields: [
                    {
                      key: 'cr113_assign_id',
                      label: 'Assignment ID',
                      showOnCard: false,
                      editable: false,
                    },
                    {
                      key: 'cr113_companycodecode',
                      label: 'Company Code',
                      showOnCard: true,
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
                      editable: true,
                      required: true,
                      options: companyOptions,
                      showOnCard: false,
                      placeholder: 'Select company',
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
                      editable: true,
                      required: true,
                      options: roleOptions,
                      showOnCard: false,
                      placeholder: 'Select role',
                    },
                  ],
                }}
              />
            ) : (
              <CardPage
                ref={locationAssignmentsCardRef}
                key={`manager-location-assignments-${selectedManagerId}`}
                config={{
                  title: 'JDE Location Assignments',
                  description: 'Create, edit, and delete location assignments related to the selected manager.',
                  hideHeaderCopy: true,
                  hideHeaderActions: true,
                  hideRowDeleteAction: true,
                  idField: 'cr113_jde_loc_assignmentid',
                  service: locationAssignmentsService,
                  defaultSortKey: 'cr113_locationcodecode',
                  defaultSortDir: 'asc',
                  fields: [
                    {
                      key: 'cr113_assign_id',
                      label: 'Assignment ID',
                      showOnCard: false,
                      editable: false,
                    },
                    {
                      key: 'cr113_locationcodecode',
                      label: 'Location Code',
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
                      key: 'cr113_locationcode',
                      label: 'Location',
                      inputType: 'select',
                      editable: true,
                      required: true,
                      options: locationOptions,
                      showOnCard: false,
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
                      editable: true,
                      required: true,
                      options: roleOptions,
                      showOnCard: false,
                      placeholder: 'Select role',
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
  );
}
