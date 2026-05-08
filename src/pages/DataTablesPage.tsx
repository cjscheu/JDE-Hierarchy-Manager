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

type DataTableDef = {
  id: string;
  label: string;
  // Generated Dataverse services have strongly typed signatures that differ per table.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any;
  idField: string;
};

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

export function DataTablesPage() {
  const [activeTab, setActiveTab] = useState(DATA_TABLES[0].id);
  const [fieldsByTab, setFieldsByTab] = useState<Record<string, FieldDef[]>>({});
  const [loadingTabs, setLoadingTabs] = useState<Record<string, boolean>>({});

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
  const fields = fieldsByTab[active.id] || [];
  const loading = loadingTabs[active.id];

  const wrappedService: CardPageConfig['service'] = {
    getAll: async () => {
      const result = await active.service.getAll();
      const data = normalizeRows(result);
      return {
        ...(result as object),
        data,
      };
    },
    create: (record) => active.service.create(record),
    update: (id, changes) => active.service.update(id, changes),
    delete: (id) => active.service.delete(id),
  };

  const config: CardPageConfig = {
    title: active.label,
    hideHeaderCopy: true,
    idField: active.idField,
    fields,
    service: wrappedService,
    actionsInHeader: true,
    hideRowEditAction: false,
    hideRowDeleteAction: false,
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
