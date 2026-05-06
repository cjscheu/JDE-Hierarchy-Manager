import { useEffect, useState } from 'react'
import { CardPage } from '../components/CardPage'
import { Cr113_jde_companiesService } from '../generated/services/Cr113_jde_companiesService'
import { Cr113_jde_co_segmentsService } from '../generated/services/Cr113_jde_co_segmentsService'
import { Cr113_jde_typesService } from '../generated/services/Cr113_jde_typesService'
import { Cr113_jde_ledger_typesService } from '../generated/services/Cr113_jde_ledger_typesService'
import { Cr113_jde_locationsService } from '../generated/services/Cr113_jde_locationsService'
import { Cr113_jde_location_segmentsService } from '../generated/services/Cr113_jde_location_segmentsService'
import { Cr113_jde_divsService } from '../generated/services/Cr113_jde_divsService'
import { Cr113_jde_groupsService } from '../generated/services/Cr113_jde_groupsService'
import { Cr113_jde_otcsService } from '../generated/services/Cr113_jde_otcsService'
import { Cr113_jde_co_assignmentsService } from '../generated/services/Cr113_jde_co_assignmentsService'
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService'
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService'

type LookupOption = { label: string; value: string }

const toLookupBind = (entitySet: string, id?: string) => (id ? `/${entitySet}(${id})` : undefined)

const buildCompanyPayload = (record: Record<string, string>) => {
  const {
    cr113_segment_name,
    cr113_segment_type,
    cr113_ledger_type,
    ...rest
  } = record

  const payload: Record<string, string> = { ...rest }

  const segmentBind = toLookupBind('cr113_jde_co_segments', cr113_segment_name)
  const typeBind = toLookupBind('cr113_jde_types', cr113_segment_type)
  const ledgerBind = toLookupBind('cr113_jde_ledger_types', cr113_ledger_type)

  if (segmentBind) payload['cr113_SEGMENT_NAME@odata.bind'] = segmentBind
  if (typeBind) payload['cr113_SEGMENT_TYPE@odata.bind'] = typeBind
  if (ledgerBind) payload['cr113_LEDGER_TYPE@odata.bind'] = ledgerBind

  return payload
}

const buildLocationPayload = (record: Record<string, string>, companyId: string) => {
  const {
    cr113_coloc_segment_name,
    cr113_div_name,
    cr113_group_name,
    cr113_otc_name,
    ...rest
  } = record

  const payload: Record<string, string> = { ...rest }
  payload['cr113_CO_ID@odata.bind'] = `/${'cr113_jde_companies'}(${companyId})`

  const segmentBind = toLookupBind('cr113_jde_location_segments', cr113_coloc_segment_name)
  const divBind = toLookupBind('cr113_jde_divs', cr113_div_name)
  const groupBind = toLookupBind('cr113_jde_groups', cr113_group_name)
  const otcBind = toLookupBind('cr113_jde_otcs', cr113_otc_name)

  if (segmentBind) payload['cr113_COLOC_SEGMENT_NAME@odata.bind'] = segmentBind
  if (divBind) payload['cr113_DIV_NAME@odata.bind'] = divBind
  if (groupBind) payload['cr113_GROUP_NAME@odata.bind'] = groupBind
  if (otcBind) payload['cr113_OTC_NAME@odata.bind'] = otcBind

  return payload
}

const buildAssignmentPayload = (record: Record<string, string>, companyId: string) => {
  const {
    cr113_managername,
    cr113_rolename,
    ...rest
  } = record

  const payload: Record<string, string> = { ...rest }
  payload['cr113_CompanyCode@odata.bind'] = `/${'cr113_jde_companies'}(${companyId})`

  const managerBind = toLookupBind('cr113_jde_managers', cr113_managername)
  const roleBind = toLookupBind('cr113_jde_roleses', cr113_rolename)

  if (managerBind) payload['cr113_ManagerName@odata.bind'] = managerBind
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind

  return payload
}

const companiesService = {
  getAll: async () => {
    const [companiesRes, segmentsRes, typesRes, ledgersRes] = await Promise.all([
      Cr113_jde_companiesService.getAll(),
      Cr113_jde_co_segmentsService.getAll({
        select: ['cr113_jde_co_segmentid', 'cr113_co_segment_name'],
      }),
      Cr113_jde_typesService.getAll({
        select: ['cr113_jde_typeid', 'cr113_co_type_name'],
      }),
      Cr113_jde_ledger_typesService.getAll({
        select: ['cr113_jde_ledger_typeid', 'cr113_co_ledger_type_name'],
      }),
    ])

    if (!companiesRes.success) {
      return companiesRes
    }

    const segmentById = new Map<string, string>(
      (segmentsRes.data ?? []).map(item => [item.cr113_jde_co_segmentid, item.cr113_co_segment_name])
    )
    const typeById = new Map<string, string>(
      (typesRes.data ?? []).map(item => [item.cr113_jde_typeid, item.cr113_co_type_name])
    )
    const ledgerById = new Map<string, string>(
      (ledgersRes.data ?? []).map(item => [item.cr113_jde_ledger_typeid, item.cr113_co_ledger_type_name])
    )

    const data = (companiesRes.data ?? []).map(row => ({
      ...row,
      cr113_segment_name: row._cr113_segment_name_value ?? '',
      cr113_segment_type: row._cr113_segment_type_value ?? '',
      cr113_ledger_type: row._cr113_ledger_type_value ?? '',
      cr113_segment_namename:
        row.cr113_segment_namename ??
        (row._cr113_segment_name_value ? segmentById.get(row._cr113_segment_name_value) : undefined) ??
        '',
      cr113_segment_typename:
        row.cr113_segment_typename ??
        (row._cr113_segment_type_value ? typeById.get(row._cr113_segment_type_value) : undefined) ??
        '',
      cr113_ledger_typename:
        row.cr113_ledger_typename ??
        (row._cr113_ledger_type_value ? ledgerById.get(row._cr113_ledger_type_value) : undefined) ??
        '',
    }))

    return {
      ...companiesRes,
      data,
    }
  },
  create: async (record: Record<string, string>) =>
    Cr113_jde_companiesService.create(
      buildCompanyPayload(record) as unknown as Parameters<typeof Cr113_jde_companiesService.create>[0]
    ),
  update: async (id: string, changes: Record<string, string>) =>
    Cr113_jde_companiesService.update(
      id,
      buildCompanyPayload(changes) as unknown as Parameters<typeof Cr113_jde_companiesService.update>[1]
    ),
  delete: Cr113_jde_companiesService.delete,
}

export function CompaniesPage() {
  const [segmentOptions, setSegmentOptions] = useState<LookupOption[]>([])
  const [typeOptions, setTypeOptions] = useState<LookupOption[]>([])
  const [ledgerOptions, setLedgerOptions] = useState<LookupOption[]>([])
  const [locationSegmentOptions, setLocationSegmentOptions] = useState<LookupOption[]>([])
  const [divOptions, setDivOptions] = useState<LookupOption[]>([])
  const [groupOptions, setGroupOptions] = useState<LookupOption[]>([])
  const [otcOptions, setOtcOptions] = useState<LookupOption[]>([])
  const [managerOptions, setManagerOptions] = useState<LookupOption[]>([])
  const [roleOptions, setRoleOptions] = useState<LookupOption[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [selectedCompanyName, setSelectedCompanyName] = useState('')
  const [activeDetailsTab, setActiveDetailsTab] = useState<'locations' | 'assignments'>('locations')

  useEffect(() => {
    const loadOptions = async () => {
      const [segmentsRes, typesRes, ledgersRes] = await Promise.all([
        Cr113_jde_co_segmentsService.getAll({
          select: ['cr113_jde_co_segmentid', 'cr113_co_segment_name'],
          orderBy: ['cr113_co_segment_name asc'],
        }),
        Cr113_jde_typesService.getAll({
          select: ['cr113_jde_typeid', 'cr113_co_type_name'],
          orderBy: ['cr113_co_type_name asc'],
        }),
        Cr113_jde_ledger_typesService.getAll({
          select: ['cr113_jde_ledger_typeid', 'cr113_co_ledger_type_name'],
          orderBy: ['cr113_co_ledger_type_name asc'],
        }),
      ])

      setSegmentOptions(
        (segmentsRes.data ?? []).map(item => ({
          value: item.cr113_jde_co_segmentid,
          label: item.cr113_co_segment_name,
        }))
      )
      setTypeOptions(
        (typesRes.data ?? []).map(item => ({
          value: item.cr113_jde_typeid,
          label: item.cr113_co_type_name,
        }))
      )
      setLedgerOptions(
        (ledgersRes.data ?? []).map(item => ({
          value: item.cr113_jde_ledger_typeid,
          label: item.cr113_co_ledger_type_name,
        }))
      )

      const [locationSegmentsRes, divsRes, groupsRes, otcsRes, managersRes, rolesRes] = await Promise.all([
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
          select: ['cr113_jde_managerid', 'cr113_manager_name'],
          orderBy: ['cr113_manager_name asc'],
        }),
        Cr113_jde_rolesesService.getAll({
          select: ['cr113_jde_rolesid', 'cr113_role_name'],
          orderBy: ['cr113_role_name asc'],
        }),
      ])

      setLocationSegmentOptions(
        (locationSegmentsRes.data ?? []).map(item => ({
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
        (managersRes.data ?? []).map(item => ({
          value: item.cr113_jde_managerid,
          label: item.cr113_manager_name ?? item.cr113_empl_id,
        }))
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

  const locationsService = {
    getAll: async () => {
      if (!selectedCompanyId) {
        return { success: true, data: [] }
      }

      const [locationsRes, locationSegmentsRes, divsRes, groupsRes, otcsRes] = await Promise.all([
        Cr113_jde_locationsService.getAll(),
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

      const locationSegmentById = new Map<string, string>(
        (locationSegmentsRes.data ?? []).map(item => [item.cr113_jde_location_segmentid, item.cr113_coloc_segment_name])
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

      const data = (locationsRes.data ?? [])
        .filter(row => row._cr113_co_id_value === selectedCompanyId)
        .map(row => ({
          ...row,
          cr113_coloc_segment_name: row._cr113_coloc_segment_name_value ?? '',
          cr113_div_name: row._cr113_div_name_value ?? '',
          cr113_group_name: row._cr113_group_name_value ?? '',
          cr113_otc_name: row._cr113_otc_name_value ?? '',
          cr113_coloc_segment_namename:
            row.cr113_coloc_segment_namename ??
            (row._cr113_coloc_segment_name_value
              ? locationSegmentById.get(row._cr113_coloc_segment_name_value)
              : undefined) ??
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
    create: async (record: Record<string, string>) => {
      if (!selectedCompanyId) {
        throw new Error('Select a company before adding a location.')
      }

      return Cr113_jde_locationsService.create(
        buildLocationPayload(record, selectedCompanyId) as unknown as Parameters<typeof Cr113_jde_locationsService.create>[0]
      )
    },
    update: async (id: string, changes: Record<string, string>) => {
      if (!selectedCompanyId) {
        throw new Error('Select a company before editing locations.')
      }

      return Cr113_jde_locationsService.update(
        id,
        buildLocationPayload(changes, selectedCompanyId) as unknown as Parameters<typeof Cr113_jde_locationsService.update>[1]
      )
    },
    delete: Cr113_jde_locationsService.delete,
  }

  const assignmentsService = {
    getAll: async () => {
      if (!selectedCompanyId) {
        return { success: true, data: [] }
      }

      const [assignmentsRes, managersRes, rolesRes] = await Promise.all([
        Cr113_jde_co_assignmentsService.getAll(),
        Cr113_jde_managersService.getAll({
          select: ['cr113_jde_managerid', 'cr113_manager_name'],
        }),
        Cr113_jde_rolesesService.getAll({
          select: ['cr113_jde_rolesid', 'cr113_role_name'],
        }),
      ])

      if (!assignmentsRes.success) {
        return assignmentsRes
      }

      const managerById = new Map<string, string>(
        (managersRes.data ?? []).map(item => [item.cr113_jde_managerid, item.cr113_manager_name ?? item.cr113_empl_id])
      )
      const roleById = new Map<string, string>(
        (rolesRes.data ?? []).map(item => [item.cr113_jde_rolesid, item.cr113_role_name])
      )

      const data = (assignmentsRes.data ?? [])
        .filter(row => row._cr113_companycode_value === selectedCompanyId)
        .map(row => ({
          ...row,
          cr113_managername: row._cr113_managername_value ?? '',
          cr113_rolename: row._cr113_rolename_value ?? '',
          cr113_managernamename:
            row.cr113_managernamename ??
            (row._cr113_managername_value ? managerById.get(row._cr113_managername_value) : undefined) ??
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
      if (!selectedCompanyId) {
        throw new Error('Select a company before adding an assignment.')
      }

      return Cr113_jde_co_assignmentsService.create(
        buildAssignmentPayload(record, selectedCompanyId) as unknown as Parameters<typeof Cr113_jde_co_assignmentsService.create>[0]
      )
    },
    update: async (id: string, changes: Record<string, string>) => {
      if (!selectedCompanyId) {
        throw new Error('Select a company before editing assignments.')
      }

      return Cr113_jde_co_assignmentsService.update(
        id,
        buildAssignmentPayload(changes, selectedCompanyId) as unknown as Parameters<typeof Cr113_jde_co_assignmentsService.update>[1]
      )
    },
    delete: Cr113_jde_co_assignmentsService.delete,
  }

  return (
    <div className="companies-layout">
      <section className="companies-main">
        <CardPage
          config={{
            title: 'JDE Companies',
            description: 'Manage JDE company records. Select a row to load related details.',
            idField: 'cr113_jde_companyid',
            service: companiesService,
            defaultSortKey: 'cr113_co_id',
            defaultSortDir: 'asc',
            selectedRowId: selectedCompanyId,
            onRowSelect: row => {
              setSelectedCompanyId(String(row.cr113_jde_companyid))
              setSelectedCompanyName(String(row.cr113_co_desc ?? row.cr113_co_id ?? ''))
            },
            onRowsLoaded: rows => {
              if (rows.length === 0) {
                setSelectedCompanyId(null)
                setSelectedCompanyName('')
                return
              }

              const selectedStillExists = selectedCompanyId
                ? rows.some(row => String(row.cr113_jde_companyid) === selectedCompanyId)
                : false

              if (!selectedStillExists) {
                const first = rows[0]
                setSelectedCompanyId(String(first.cr113_jde_companyid))
                setSelectedCompanyName(String(first.cr113_co_desc ?? first.cr113_co_id ?? ''))
              }
            },
            fields: [
              {
                key: 'cr113_co_id',
                label: 'Company Code',
                showOnCard: true,
                editable: true,
                required: true,
                placeholder: 'e.g. 00001',
              },
              {
                key: 'cr113_co_desc',
                label: 'Company Name',
                showOnCard: true,
                editable: true,
                required: true,
                placeholder: 'e.g. Acme Corporation',
              },
              {
                key: 'cr113_segment_namename',
                label: 'Company Segment',
                showOnCard: true,
                editable: false,
              },
              {
                key: 'cr113_segment_name',
                label: 'Company Segment',
                inputType: 'select',
                editable: true,
                required: true,
                placeholder: 'Select company segment',
                options: segmentOptions,
                showOnCard: false,
              },
              {
                key: 'cr113_segment_typename',
                label: 'Company Type',
                showOnCard: true,
                editable: false,
              },
              {
                key: 'cr113_segment_type',
                label: 'Company Type',
                inputType: 'select',
                editable: true,
                required: true,
                placeholder: 'Select company type',
                options: typeOptions,
                showOnCard: false,
              },
              {
                key: 'cr113_ledger_typename',
                label: 'Company Ledger',
                showOnCard: true,
                editable: false,
              },
              {
                key: 'cr113_ledger_type',
                label: 'Company Ledger',
                inputType: 'select',
                editable: true,
                required: true,
                placeholder: 'Select company ledger',
                options: ledgerOptions,
                showOnCard: false,
              },
            ],
          }}
        />
      </section>

      <section className="companies-details">
        <div className="companies-details-shell">
          <div className="companies-details-header">
            <p className="companies-details-subtitle">
              {selectedCompanyId
                ? `Related records for ${selectedCompanyName || 'selected company'}.`
                : 'Select a company row to load related records.'}
            </p>
          </div>

          <div className="companies-details-tabs" role="tablist" aria-label="Company detail tabs">
            <button
              className={`companies-tab-btn${activeDetailsTab === 'locations' ? ' active' : ''}`}
              role="tab"
              aria-selected={activeDetailsTab === 'locations'}
              onClick={() => setActiveDetailsTab('locations')}
            >
              JDE Locations
            </button>
            <button
              className={`companies-tab-btn${activeDetailsTab === 'assignments' ? ' active' : ''}`}
              role="tab"
              aria-selected={activeDetailsTab === 'assignments'}
              onClick={() => setActiveDetailsTab('assignments')}
            >
              JDE Co Assignments
            </button>
          </div>

          {!selectedCompanyId ? (
            <div className="companies-details-empty">
              Select a company in the main table to view and manage related locations and co assignments.
            </div>
          ) : activeDetailsTab === 'locations' ? (
            <CardPage
              key={`locations-${selectedCompanyId}`}
              config={{
                title: 'JDE Locations',
                description: 'Create, edit, and delete locations related to the selected company.',
                idField: 'cr113_jde_locationid',
                service: locationsService,
                defaultSortKey: 'cr113_coloc_id',
                defaultSortDir: 'asc',
                fields: [
                  {
                    key: 'cr113_coloc_id',
                    label: 'Location Code',
                    showOnCard: true,
                    editable: true,
                    required: true,
                    placeholder: 'e.g. 1001',
                  },
                  {
                    key: 'cr113_coloc_name',
                    label: 'Location Name',
                    showOnCard: true,
                    editable: true,
                    required: true,
                    placeholder: 'e.g. Dallas HQ',
                  },
                  {
                    key: 'cr113_coloc_city',
                    label: 'City',
                    showOnCard: true,
                    editable: true,
                    placeholder: 'e.g. Dallas',
                  },
                  {
                    key: 'cr113_coloc_state',
                    label: 'State',
                    showOnCard: true,
                    editable: true,
                    placeholder: 'e.g. TX',
                  },
                  {
                    key: 'cr113_coloc_segment_namename',
                    label: 'Location Segment',
                    showOnCard: true,
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
                    showOnCard: true,
                    editable: false,
                  },
                  {
                    key: 'cr113_div_name',
                    label: 'Division',
                    inputType: 'select',
                    editable: true,
                    options: divOptions,
                    showOnCard: false,
                    placeholder: 'Select division',
                  },
                  {
                    key: 'cr113_group_namename',
                    label: 'Group',
                    showOnCard: true,
                    editable: false,
                  },
                  {
                    key: 'cr113_group_name',
                    label: 'Group',
                    inputType: 'select',
                    editable: true,
                    options: groupOptions,
                    showOnCard: false,
                    placeholder: 'Select group',
                  },
                  {
                    key: 'cr113_otc_namename',
                    label: 'OTC',
                    showOnCard: true,
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
                ],
              }}
            />
          ) : (
            <CardPage
              key={`assignments-${selectedCompanyId}`}
              config={{
                title: 'JDE Co Assignments',
                description: 'Create, edit, and delete assignments related to the selected company.',
                idField: 'cr113_jde_co_assignmentid',
                service: assignmentsService,
                defaultSortKey: 'cr113_assign_id',
                defaultSortDir: 'asc',
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
                    key: 'cr113_managernamename',
                    label: 'Manager',
                    showOnCard: true,
                    editable: false,
                  },
                  {
                    key: 'cr113_managername',
                    label: 'Manager',
                    inputType: 'select',
                    editable: true,
                    options: managerOptions,
                    showOnCard: false,
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
                    editable: true,
                    options: roleOptions,
                    showOnCard: false,
                    placeholder: 'Select role',
                  },
                ],
              }}
            />
          )}
        </div>
      </section>
    </div>
  )
}
