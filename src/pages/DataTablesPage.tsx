import { useEffect, useState } from 'react';
import { CardPage } from '../components/CardPage';
import type { CardPageConfig, FieldDef } from '../components/CardPage';
import { Cr113_jde_companiesService } from '../generated/services/Cr113_jde_companiesService';
import { Cr113_jde_co_assignmentsService } from '../generated/services/Cr113_jde_co_assignmentsService';
import { Cr113_jde_loc_assignmentsService } from '../generated/services/Cr113_jde_loc_assignmentsService';
import { Cr113_jde_locationsService } from '../generated/services/Cr113_jde_locationsService';
import { Cr113_jde_managersService } from '../generated/services/Cr113_jde_managersService';
import { Cr113_jde_groupsService } from '../generated/services/Cr113_jde_groupsService';
import { Cr113_jde_divsService } from '../generated/services/Cr113_jde_divsService';
import { Cr113_jde_rolesesService } from '../generated/services/Cr113_jde_rolesesService';
import { Cr113_jde_typesService } from '../generated/services/Cr113_jde_typesService';
import { Cr113_jde_otcsService } from '../generated/services/Cr113_jde_otcsService';
import { Cr113_jde_co_segmentsService } from '../generated/services/Cr113_jde_co_segmentsService';
import { Cr113_jde_location_segmentsService } from '../generated/services/Cr113_jde_location_segmentsService';
import { Cr113_user_securitiesService } from '../generated/services/Cr113_user_securitiesService';
import { Cr113_jde_ledger_typesService } from '../generated/services/Cr113_jde_ledger_typesService';
import { getAllPages } from '../utils/dataversePaging';

type DataTableDef = {
  id: string;
  label: string;
  // Generated Dataverse services have strongly typed signatures that differ per table.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any;
  idField: string;
};

type LookupOption = { label: string; value: string };

// List of all Dataverse tables/services to show as tabs
const DATA_TABLES: DataTableDef[] = [
  {
    id: 'jde_companies',
    label: 'Companies',
    service: Cr113_jde_companiesService,
    idField: 'cr113_jde_companyid',
  },
  {
    id: 'jde_co_assignments',
    label: 'Company Assignments',
    service: Cr113_jde_co_assignmentsService,
    idField: 'cr113_jde_co_assignmentid',
  },
  {
    id: 'jde_loc_assignments',
    label: 'Location Assignments',
    service: Cr113_jde_loc_assignmentsService,
    idField: 'cr113_jde_loc_assignmentid',
  },
  {
    id: 'jde_locations',
    label: 'Locations',
    service: Cr113_jde_locationsService,
    idField: 'cr113_jde_locationid',
  },
  {
    id: 'jde_managers',
    label: 'Managers',
    service: Cr113_jde_managersService,
    idField: 'cr113_jde_managerid',
  },
  {
    id: 'jde_groups',
    label: 'Groups',
    service: Cr113_jde_groupsService,
    idField: 'cr113_jde_groupid',
  },
  {
    id: 'jde_divs',
    label: 'Divisions',
    service: Cr113_jde_divsService,
    idField: 'cr113_jde_divid',
  },
  {
    id: 'jde_roleses',
    label: 'Roles',
    service: Cr113_jde_rolesesService,
    idField: 'cr113_jde_rolesid',
  },
  {
    id: 'jde_types',
    label: 'Types',
    service: Cr113_jde_typesService,
    idField: 'cr113_jde_typeid',
  },
  {
    id: 'jde_otcs',
    label: 'OTC Types',
    service: Cr113_jde_otcsService,
    idField: 'cr113_jde_otcid',
  },
  {
    id: 'jde_co_segments',
    label: 'Company Segments',
    service: Cr113_jde_co_segmentsService,
    idField: 'cr113_jde_co_segmentid',
  },
  {
    id: 'jde_location_segments',
    label: 'Location Segments',
    service: Cr113_jde_location_segmentsService,
    idField: 'cr113_jde_location_segmentid',
  },
  {
    id: 'user_securities',
    label: 'User Securities',
    service: Cr113_user_securitiesService,
    idField: 'cr113_user_securityid',
  },
  {
    id: 'jde_ledger_types',
    label: 'Ledger Types',
    service: Cr113_jde_ledger_typesService,
    idField: 'cr113_jde_ledger_typeid',
  },
];

function normalizeRows(result: unknown): Record<string, unknown>[] {
  const payload = result as {
    data?: unknown;
    value?: unknown;
    records?: unknown;
    items?: unknown;
  };

  if (Array.isArray(payload?.data)) return payload.data as Record<string, unknown>[];
  if (Array.isArray(payload?.value)) return payload.value as Record<string, unknown>[];
  if (Array.isArray(payload?.records)) return payload.records as Record<string, unknown>[];
  if (Array.isArray(payload?.items)) return payload.items as Record<string, unknown>[];
  return [];
}

function toUserTime(value: unknown) {
  if (typeof value !== 'string') return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

const toLookupBind = (entitySet: string, id?: string) => (id ? `/${entitySet}(${id})` : undefined);

function buildCompaniesPayload(record: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...record };
  const segmentBind = toLookupBind('cr113_jde_co_segments', String(record.cr113_segment_name ?? ''));
  const typeBind = toLookupBind('cr113_jde_types', String(record.cr113_segment_type ?? ''));
  const ledgerBind = toLookupBind('cr113_jde_ledger_types', String(record.cr113_ledger_type ?? ''));

  delete payload.cr113_segment_namename;
  delete payload.cr113_segment_typename;
  delete payload.cr113_ledger_typename;

  if (record.cr113_segment_name !== undefined) delete payload.cr113_segment_name;
  if (record.cr113_segment_type !== undefined) delete payload.cr113_segment_type;
  if (record.cr113_ledger_type !== undefined) delete payload.cr113_ledger_type;

  if (segmentBind) payload['cr113_SEGMENT_NAME@odata.bind'] = segmentBind;
  if (typeBind) payload['cr113_SEGMENT_TYPE@odata.bind'] = typeBind;
  if (ledgerBind) payload['cr113_LEDGER_TYPE@odata.bind'] = ledgerBind;

  return payload;
}

function buildCompanyAssignmentsPayload(record: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  const companyBind = toLookupBind('cr113_jde_companies', String(record.cr113_companycode ?? ''));
  const roleBind = toLookupBind('cr113_jde_roleses', String(record.cr113_roleid ?? ''));
  const managerBind = toLookupBind('cr113_jde_managers', String(record.cr113_managerid ?? ''));

  if (companyBind) payload['cr113_CompanyCode@odata.bind'] = companyBind;
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind;
  if (managerBind) payload['cr113_ManagerName@odata.bind'] = managerBind;

  return payload;
}

function baseColumnName(key: string) {
  return key.split('@')[0];
}

function isUserColumn(key: string) {
  const base = baseColumnName(key);
  return base.startsWith('cr113_') && !key.startsWith('_');
}

function fieldsFromRows(rows: Record<string, unknown>[]): FieldDef[] {
  const [firstRow] = rows;
  if (!firstRow) return [];

  return Object.keys(firstRow)
    .filter(key => isUserColumn(key))
    .map(key => ({
      key,
      label: baseColumnName(key),
      showOnCard: true,
      editable: true,
      inputType: 'text' as const,
    }));
}

function entityMetadataToFields(meta: any): FieldDef[] {
  if (!meta || !meta.Attributes) return [];
  return Object.values(meta.Attributes)
    .filter((attr: any) => isUserColumn(String(attr.LogicalName ?? '')))
    .map((attr: any) => ({
      key: attr.LogicalName,
      label: baseColumnName(attr.LogicalName),
      showOnCard: true,
      editable: !attr.IsPrimaryId,
      required: attr.RequiredLevel?.Value === 2, // 2 = required
      inputType: attr.AttributeTypeName?.Value === 'PicklistType' ? 'select' : 'text',
      options: attr.OptionSet ? Object.values(attr.OptionSet.Options || {}).map((opt: any) => ({ label: opt.Label?.UserLocalizedLabel?.Label || opt.Value, value: String(opt.Value) })) : undefined,
    }));
}

function getCompaniesTabFields(
  segmentOptions: LookupOption[],
  typeOptions: LookupOption[],
  ledgerOptions: LookupOption[],
): FieldDef[] {
  return [
    {
      key: 'cr113_co_id',
      label: 'Company Code',
      showOnCard: true,
      editable: true,
      required: true,
      inputType: 'text',
    },
    {
      key: 'cr113_co_desc',
      label: 'Company Name',
      showOnCard: true,
      editable: true,
      required: true,
      inputType: 'text',
    },
    {
      key: 'cr113_segment_namename',
      label: 'Company Segment',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_segment_name',
      label: 'Company Segment',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: segmentOptions,
      placeholder: 'Select company segment',
    },
    {
      key: 'cr113_segment_typename',
      label: 'Company Type',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_segment_type',
      label: 'Company Type',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: typeOptions,
      placeholder: 'Select company type',
    },
    {
      key: 'cr113_ledger_typename',
      label: 'Company Ledger',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_ledger_type',
      label: 'Company Ledger',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: ledgerOptions,
      placeholder: 'Select company ledger',
    },
    {
      key: 'cr113_co_ak',
      label: 'Alternate Key',
      showOnCard: true,
      editable: true,
      inputType: 'text',
    },
    {
      key: 'modifiedon',
      label: 'Modified Date',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
  ];
}

function getCompanyAssignmentsTabFields(
  companyOptions: LookupOption[],
  roleOptions: LookupOption[],
  managerOptions: LookupOption[],
): FieldDef[] {
  return [
    {
      key: 'cr113_CompanyCode',
      label: 'Company',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_rolename',
      label: 'Role',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_manager',
      label: 'Manager',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_chat',
      label: 'Chat',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_companycode',
      label: 'Company',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: companyOptions,
      placeholder: 'Select company',
    },
    {
      key: 'cr113_roleid',
      label: 'Role',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: roleOptions,
      placeholder: 'Select role',
    },
    {
      key: 'cr113_managerid',
      label: 'Manager',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: managerOptions,
      placeholder: 'Select manager',
    },
  ];
}

function getConfiguredFields(
  tabId: string,
  fields: FieldDef[],
  segmentOptions: LookupOption[],
  typeOptions: LookupOption[],
  ledgerOptions: LookupOption[],
  assignmentCompanyOptions: LookupOption[],
  assignmentRoleOptions: LookupOption[],
  assignmentManagerOptions: LookupOption[],
): FieldDef[] {
  if (tabId === 'jde_companies') {
    return getCompaniesTabFields(segmentOptions, typeOptions, ledgerOptions);
  }
  if (tabId === 'jde_co_assignments') {
    return getCompanyAssignmentsTabFields(
      assignmentCompanyOptions,
      assignmentRoleOptions,
      assignmentManagerOptions,
    );
  }
  return fields;
}

export function DataTablesPage() {
  const [activeTab, setActiveTab] = useState(DATA_TABLES[0].id);
  const [fieldsByTab, setFieldsByTab] = useState<Record<string, FieldDef[]>>({});
  const [loadingTabs, setLoadingTabs] = useState<Record<string, boolean>>({});
  const [companySegmentOptions, setCompanySegmentOptions] = useState<LookupOption[]>([]);
  const [companyTypeOptions, setCompanyTypeOptions] = useState<LookupOption[]>([]);
  const [companyLedgerOptions, setCompanyLedgerOptions] = useState<LookupOption[]>([]);
  const [assignmentCompanyOptions, setAssignmentCompanyOptions] = useState<LookupOption[]>([]);
  const [assignmentRoleOptions, setAssignmentRoleOptions] = useState<LookupOption[]>([]);
  const [assignmentManagerOptions, setAssignmentManagerOptions] = useState<LookupOption[]>([]);

  useEffect(() => {
    const loadCompanyLookupOptions = async () => {
      const [segmentsRes, typesRes, ledgersRes, companiesRes, rolesRes, managersRes] = await Promise.all([
        Cr113_jde_co_segmentsService.getAll({ select: ['cr113_jde_co_segmentid', 'cr113_co_segment_name'], orderBy: ['cr113_co_segment_name asc'] }),
        Cr113_jde_typesService.getAll({ select: ['cr113_jde_typeid', 'cr113_co_type_name'], orderBy: ['cr113_co_type_name asc'] }),
        Cr113_jde_ledger_typesService.getAll({ select: ['cr113_jde_ledger_typeid', 'cr113_co_ledger_type_name'], orderBy: ['cr113_co_ledger_type_name asc'] }),
        Cr113_jde_companiesService.getAll({ select: ['cr113_jde_companyid', 'cr113_co_id', 'cr113_co_desc'] }),
        Cr113_jde_rolesesService.getAll({ select: ['cr113_jde_rolesid', 'cr113_role_name'], orderBy: ['cr113_role_name asc'] }),
        Cr113_jde_managersService.getAll({ select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name', 'cr113_chat'], orderBy: ['cr113_manager_name asc'] }),
      ]);

      setCompanySegmentOptions((segmentsRes.data ?? []).map((s: any) => ({ value: s.cr113_jde_co_segmentid, label: s.cr113_co_segment_name })));
      setCompanyTypeOptions((typesRes.data ?? []).map((t: any) => ({ value: t.cr113_jde_typeid, label: t.cr113_co_type_name })));
      setCompanyLedgerOptions((ledgersRes.data ?? []).map((l: any) => ({ value: l.cr113_jde_ledger_typeid, label: l.cr113_co_ledger_type_name })));
      setAssignmentCompanyOptions(
        (companiesRes.data ?? [])
          .map((c: any) => ({
            value: c.cr113_jde_companyid,
            label: `${c.cr113_co_id ?? ''} - ${c.cr113_co_desc ?? ''}`.trim(),
          }))
          .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }))
      );
      setAssignmentRoleOptions((rolesRes.data ?? []).map((r: any) => ({ value: r.cr113_jde_rolesid, label: r.cr113_role_name ?? '' })));
      setAssignmentManagerOptions(
        (managersRes.data ?? []).map((m: any) => ({
          value: m.cr113_jde_managerid,
          label: (m.cr113_manager_name ?? `${m.cr113_first_name ?? ''} ${m.cr113_last_name ?? ''}`).trim(),
        }))
      );
    };

    void loadCompanyLookupOptions();
  }, []);

  useEffect(() => {
    DATA_TABLES.forEach(async tab => {
      if (fieldsByTab[tab.id]) return;
      setLoadingTabs(prev => ({ ...prev, [tab.id]: true }));
      try {
        const metaResult = await tab.service.getMetadata();
        const meta = metaResult?.data;
        setFieldsByTab(prev => ({ ...prev, [tab.id]: entityMetadataToFields(meta) }));
      } catch (e) {
        setFieldsByTab(prev => ({ ...prev, [tab.id]: [] }));
      } finally {
        setLoadingTabs(prev => ({ ...prev, [tab.id]: false }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = DATA_TABLES.find(tab => tab.id === activeTab) || DATA_TABLES[0];
  const fields = getConfiguredFields(
    active.id,
    fieldsByTab[active.id] || [],
    companySegmentOptions,
    companyTypeOptions,
    companyLedgerOptions,
    assignmentCompanyOptions,
    assignmentRoleOptions,
    assignmentManagerOptions,
  );
  const loading = loadingTabs[active.id];

  const wrappedService: CardPageConfig['service'] = {
    getAll: async () => {
      if (active.id === 'jde_companies') {
        const [result, segmentsRes, typesRes, ledgersRes] = await Promise.all([
          active.service.getAll(),
          Cr113_jde_co_segmentsService.getAll({ select: ['cr113_jde_co_segmentid', 'cr113_co_segment_name'] }),
          Cr113_jde_typesService.getAll({ select: ['cr113_jde_typeid', 'cr113_co_type_name'] }),
          Cr113_jde_ledger_typesService.getAll({ select: ['cr113_jde_ledger_typeid', 'cr113_co_ledger_type_name'] }),
        ]);

        const rawRows = normalizeRows(result);
        const segmentById = new Map((segmentsRes.data ?? []).map((s: any) => [s.cr113_jde_co_segmentid, s.cr113_co_segment_name]));
        const typeById = new Map((typesRes.data ?? []).map((t: any) => [t.cr113_jde_typeid, t.cr113_co_type_name]));
        const ledgerById = new Map((ledgersRes.data ?? []).map((l: any) => [l.cr113_jde_ledger_typeid, l.cr113_co_ledger_type_name]));

        const data = rawRows.map(row => ({
          ...row,
          ...(row.modifiedon !== undefined ? { modifiedon: toUserTime(row.modifiedon) } : {}),
          cr113_segment_name:
            (row.cr113_segment_name as string | undefined) ??
            (row._cr113_segment_name_value as string | undefined) ??
            '',
          cr113_segment_namename:
            (row.cr113_segment_namename as string | undefined) ??
            (row._cr113_segment_name_value ? segmentById.get(String(row._cr113_segment_name_value)) : undefined) ??
            '',
          cr113_segment_type:
            (row.cr113_segment_type as string | undefined) ??
            (row._cr113_segment_type_value as string | undefined) ??
            '',
          cr113_segment_typename:
            (row.cr113_segment_typename as string | undefined) ??
            (row._cr113_segment_type_value ? typeById.get(String(row._cr113_segment_type_value)) : undefined) ??
            '',
          cr113_ledger_type:
            (row.cr113_ledger_type as string | undefined) ??
            (row._cr113_ledger_type_value as string | undefined) ??
            '',
          cr113_ledger_typename:
            (row.cr113_ledger_typename as string | undefined) ??
            (row._cr113_ledger_type_value ? ledgerById.get(String(row._cr113_ledger_type_value)) : undefined) ??
            '',
        }));

        return {
          ...(result as object),
          data,
        };
      }

      if (active.id === 'jde_co_assignments') {
        const [assignmentsRes, companiesRes, rolesRes, managersRes] = await Promise.all([
          Cr113_jde_co_assignmentsService.getAll(),
          Cr113_jde_companiesService.getAll({ select: ['cr113_jde_companyid', 'cr113_co_id', 'cr113_co_desc'] }),
          Cr113_jde_rolesesService.getAll({ select: ['cr113_jde_rolesid', 'cr113_role_name'] }),
          Cr113_jde_managersService.getAll({ select: ['cr113_jde_managerid', 'cr113_chat'] }),
        ]);
        if (!assignmentsRes.success) return assignmentsRes;
        const companyById = new Map(
          (companiesRes.data ?? []).map(c => [
            c.cr113_jde_companyid,
            `${c.cr113_co_id ?? ''} - ${c.cr113_co_desc ?? ''}`.trim()
          ])
        );
        const companyCodeById = new Map(
          (companiesRes.data ?? []).map(c => [
            c.cr113_jde_companyid,
            String(c.cr113_co_id ?? '').trim(),
          ])
        );
        const roleById = new Map(
          (rolesRes.data ?? []).map(r => [r.cr113_jde_rolesid, r.cr113_role_name ?? ''])
        );
        const chatByManagerId = new Map(
          (managersRes.data ?? []).map(m => [m.cr113_jde_managerid, m.cr113_chat ?? ''])
        );
        const data = (assignmentsRes.data ?? []).map(row => ({
          cr113_jde_co_assignmentid: row.cr113_jde_co_assignmentid,
          cr113_CompanyCode: companyById.get(String(row._cr113_companycode_value)) ?? '',
          cr113_CompanyCodeSort: companyCodeById.get(String(row._cr113_companycode_value)) ?? '',
          cr113_rolename: row.cr113_rolename ?? (row._cr113_rolename_value ? roleById.get(String(row._cr113_rolename_value)) : ''),
          cr113_manager: row.cr113_manager ?? '',
          cr113_chat: row._cr113_managername_value ? chatByManagerId.get(String(row._cr113_managername_value)) ?? '' : '',
          cr113_companycode: row._cr113_companycode_value ?? '',
          cr113_roleid: row._cr113_rolename_value ?? '',
          cr113_managerid: row._cr113_managername_value ?? '',
        }));
        return { ...assignmentsRes, data };
      }

      const result = active.id === 'jde_loc_assignments'
        ? await getAllPages(active.service)
        : await active.service.getAll();
      const rawRows = normalizeRows(result);
      const data = rawRows.map(row => ({
        ...row,
        ...(row.modifiedon !== undefined ? { modifiedon: toUserTime(row.modifiedon) } : {}),
      }));
      return {
        ...(result as object),
        data,
      };
    },
    create: (record) => active.id === 'jde_companies'
      ? active.service.create(buildCompaniesPayload(record as Record<string, unknown>))
      : active.id === 'jde_co_assignments'
        ? active.service.create(buildCompanyAssignmentsPayload(record as Record<string, unknown>))
      : active.service.create(record),
    update: (id, changes) => active.id === 'jde_companies'
      ? active.service.update(id, buildCompaniesPayload(changes as Record<string, unknown>))
      : active.id === 'jde_co_assignments'
        ? active.service.update(id, buildCompanyAssignmentsPayload(changes as Record<string, unknown>))
      : active.service.update(id, changes),
    delete: (id) => active.service.delete(id),
  };

  const config: CardPageConfig = {
    title: active.label,
    hideHeaderCopy: true,
    idField: active.idField,
    fields,
    service: wrappedService,
    actionsInHeader: false,
    hideRowEditAction: true,
    hideRowDeleteAction: false,
    enableRowDoubleClickEdit: true,
    rowDeleteIconOnly: true,
    ...(
      active.id === 'jde_companies'
        ? {
            defaultSortKey: 'cr113_co_id' as const,
            defaultSortDir: 'asc' as const,
          }
        : active.id === 'jde_co_assignments'
          ? {
              defaultSortKey: 'cr113_CompanyCodeSort' as const,
              defaultSortDir: 'asc' as const,
            }
          : {}
    ),
    onRowsLoaded: (rows) => {
      setFieldsByTab(prev => {
        const existing = prev[active.id] ?? [];
        if (existing.length > 0) return prev;

        const fallbackFields = fieldsFromRows(rows as Record<string, unknown>[]);
        if (fallbackFields.length === 0) return prev;

        return {
          ...prev,
          [active.id]: fallbackFields,
        };
      });
    },
  };

  return (
    <section className="refs-page data-management-page data-tables-page">
      <div className="refs-tabs" role="tablist" aria-label="Data tables tabs">
        {DATA_TABLES.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active.id === tab.id}
            className={`refs-tab-btn${active.id === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="refs-tab-panel" role="tabpanel">
        {loading ? <div>Loading table schema…</div> : <CardPage key={active.id} config={config} />}
      </div>
    </section>
  );
}
