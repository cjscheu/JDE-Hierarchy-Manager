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
const locationTypeNames = new Set(['Managed', 'Not Managed']);

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
    id: 'jde_locations',
    label: 'Locations',
    service: Cr113_jde_locationsService,
    idField: 'cr113_jde_locationid',
  },
  {
    id: 'jde_loc_assignments',
    label: 'Location Assignments',
    service: Cr113_jde_loc_assignmentsService,
    idField: 'cr113_jde_loc_assignmentid',
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
    id: 'jde_ledger_types',
    label: 'Ledger Types',
    service: Cr113_jde_ledger_typesService,
    idField: 'cr113_jde_ledger_typeid',
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
    label: 'User Security',
    service: Cr113_user_securitiesService,
    idField: 'cr113_user_securityid',
  },
];

function getUserSecuritiesTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_username',
      label: 'User Name',
      showOnCard: true,
      editable: true,
      inputType: 'text',
      required: true,
    },
    {
      key: 'cr113_email',
      label: 'Email',
      showOnCard: true,
      editable: true,
      inputType: 'text',
      required: true,
    },
    {
      key: 'cr113_application',
      label: 'Application',
      showOnCard: true,
      editable: true,
      inputType: 'text',
      required: true,
    },
    // Show alias for Role Type on card, but use value for editing
    {
      key: 'cr113_roletypename',
      label: 'Role Type',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_roletype',
      label: 'Role Type',
      showOnCard: false,
      editable: true,
      inputType: 'select',
      options: [
        { label: 'Admin', value: '1' },
        { label: 'PowerUser', value: '2' },
        { label: 'Super User', value: '3' },
      ],
      required: true,
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

function buildLocationAssignmentsPayload(record: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  const locationBind = toLookupBind('cr113_jde_locations', String(record.cr113_locationcode ?? ''));
  const roleBind = toLookupBind('cr113_jde_roleses', String(record.cr113_roleid ?? ''));
  const managerBind = toLookupBind('cr113_jde_managers', String(record.cr113_empl_id ?? ''));

  if (locationBind) payload['cr113_LocationCode@odata.bind'] = locationBind;
  if (roleBind) payload['cr113_RoleName@odata.bind'] = roleBind;
  if (managerBind) payload['cr113_Empl_Id@odata.bind'] = managerBind;

  return payload;
}

function buildLocationsPayload(record: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...record };

  const companyBind = toLookupBind('cr113_jde_companies', String(record.cr113_co_id ?? ''));
  const segmentBind = toLookupBind('cr113_jde_location_segments', String(record.cr113_coloc_segment_name ?? ''));
  const divBind = toLookupBind('cr113_jde_divs', String(record.cr113_div_name ?? ''));
  const groupBind = toLookupBind('cr113_jde_groups', String(record.cr113_group_name ?? ''));
  const locationTypeBind = toLookupBind('cr113_jde_types', String(record.cr113_locationtype ?? ''));
  const otcBind = toLookupBind('cr113_jde_otcs', String(record.cr113_otc_name ?? ''));

  if (record.cr113_co_id !== undefined) delete payload.cr113_co_id;
  if (record.cr113_coloc_segment_name !== undefined) delete payload.cr113_coloc_segment_name;
  if (record.cr113_div_name !== undefined) delete payload.cr113_div_name;
  if (record.cr113_group_name !== undefined) delete payload.cr113_group_name;
  if (record.cr113_locationtype !== undefined) delete payload.cr113_locationtype;
  if (record.cr113_otc_name !== undefined) delete payload.cr113_otc_name;

  delete payload.cr113_co_idname;
  delete payload.cr113_coloc_segment_namename;
  delete payload.cr113_div_namename;
  delete payload.cr113_group_namename;
  delete payload.cr113_locationtypename;
  delete payload.cr113_otc_namename;

  if (companyBind) payload['cr113_CO_ID@odata.bind'] = companyBind;
  if (segmentBind) payload['cr113_COLOC_SEGMENT_NAME@odata.bind'] = segmentBind;
  if (divBind) payload['cr113_DIV_NAME@odata.bind'] = divBind;
  if (groupBind) payload['cr113_GROUP_NAME@odata.bind'] = groupBind;
  if (locationTypeBind) payload['cr113_LocationType@odata.bind'] = locationTypeBind;
  if (otcBind) payload['cr113_OTC_NAME@odata.bind'] = otcBind;

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
      label: 'Company Code',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_CompanyName',
      label: 'Company Name',
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
      options: ({ formValues, editTarget, rows }) => {
        const selectedCompanyId = formValues.cr113_companycode ?? String(editTarget?.cr113_companycode ?? '')
        const currentRoleId = formValues.cr113_roleid ?? String(editTarget?.cr113_roleid ?? '')
        if (!selectedCompanyId) return roleOptions

        const usedRoleIds = new Set(
          rows
            .filter(r => String(r.cr113_companycode ?? '') === selectedCompanyId)
            .map(r => String(r.cr113_roleid ?? ''))
            .filter(Boolean)
        )
        usedRoleIds.delete(currentRoleId)

        return roleOptions.filter(opt => !usedRoleIds.has(opt.value) || opt.value === currentRoleId)
      },
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

function getLocationAssignmentsTabFields(
  locationOptions: LookupOption[],
  roleOptions: LookupOption[],
  managerOptions: LookupOption[],
): FieldDef[] {
  return [
    {
      key: 'cr113_LocationCode',
      label: 'Location Code',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_LocationName',
      label: 'Location Name',
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
      key: 'cr113_empl_name',
      label: 'Manager',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_empl_chat',
      label: 'Chat',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'modifiedon',
      label: 'Modified Date',
      showOnCard: true,
      editable: false,
    },
    // Form fields (not shown on card)
    {
      key: 'cr113_locationcode',
      label: 'Location',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: locationOptions,
      placeholder: 'Select location',
    },
    {
      key: 'cr113_roleid',
      label: 'Role',
      showOnCard: false,
      editable: true,
      required: true,
      inputType: 'select',
      options: ({ formValues, editTarget, rows }) => {
        const selectedLocationId = formValues.cr113_locationcode ?? String(editTarget?.cr113_locationcode ?? '');
        const currentRoleId = formValues.cr113_roleid ?? String(editTarget?.cr113_roleid ?? '');
        if (!selectedLocationId) return roleOptions;

        const usedRoleIds = new Set(
          rows
            .filter(r => String(r.cr113_locationcode ?? '') === selectedLocationId)
            .map(r => String(r.cr113_roleid ?? ''))
            .filter(Boolean)
        );
        usedRoleIds.delete(currentRoleId);

        return roleOptions.filter(opt => !usedRoleIds.has(opt.value) || opt.value === currentRoleId);
      },
      placeholder: 'Select role',
    },
    {
      key: 'cr113_empl_id',
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

function getLocationsTabFields(
  companyOptions: LookupOption[],
  locationTypeOptions: LookupOption[],
  locationSegmentOptions: LookupOption[],
  divisionOptions: LookupOption[],
  groupOptions: LookupOption[],
  otcOptions: LookupOption[],
): FieldDef[] {
  return [
    // Card columns (showOnCard: true)
    {
      key: 'cr113_coloc_id',
      label: 'Location Code',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_coloc_name',
      label: 'Location Name',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_coloc_city',
      label: 'City',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_coloc_state',
      label: 'State',
      showOnCard: true,
      editable: false,
      inputType: 'text',
    },
    {
      key: 'cr113_div_namename',
      label: 'Division',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_group_namename',
      label: 'Group',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_coloc_segment_namename',
      label: 'Location Segment',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_otc_namename',
      label: 'OTC',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'cr113_locationtypename',
      label: 'Location Type',
      showOnCard: true,
      editable: false,
    },
    {
      key: 'modifiedon',
      label: 'Modified Date',
      showOnCard: true,
      editable: false,
    },
    // Add popup fields (no editOnly)
    {
      key: 'cr113_co_id',
      label: 'Company Code',
      showOnCard: false,
      editable: true,
      required: true,
      readOnlyOnEdit: true,
      inputType: 'select',
      options: companyOptions,
      placeholder: 'Select company',
    },
    {
      key: 'cr113_coloc_id',
      label: 'Location Code',
      showOnCard: false,
      editable: true,
      required: true,
      layout: 'half',
      inputType: 'text',
    },
    {
      key: 'cr113_coloc_name',
      label: 'Location Name',
      showOnCard: false,
      editable: true,
      required: true,
      layout: 'half',
      inputType: 'text',
    },
    {
      key: 'cr113_coloc_city',
      label: 'City',
      showOnCard: false,
      editable: true,
      inputType: 'text',
    },
    {
      key: 'cr113_coloc_state',
      label: 'State',
      showOnCard: false,
      editable: true,
      inputType: 'text',
    },
    {
      key: 'cr113_div_name',
      label: 'Division',
      showOnCard: false,
      layout: 'half',
      editable: true,
      inputType: 'select',
      options: divisionOptions,
      placeholder: 'Select division',
    },
    {
      key: 'cr113_group_name',
      label: 'Group',
      showOnCard: false,
      layout: 'half',
      editable: true,
      inputType: 'select',
      options: groupOptions,
      placeholder: 'Select group',
    },
    {
      key: 'cr113_coloc_segment_name',
      label: 'Location Segment',
      showOnCard: false,
      editable: true,
      inputType: 'select',
      options: locationSegmentOptions,
      placeholder: 'Select location segment',
    },
    {
      key: 'cr113_otc_name',
      label: 'OTC',
      showOnCard: false,
      editable: true,
      inputType: 'select',
      options: otcOptions,
      placeholder: 'Select OTC',
    },
    {
      key: 'cr113_locationtype',
      label: 'Location Type',
      showOnCard: false,
      editable: true,
      inputType: 'select',
      options: locationTypeOptions,
      placeholder: 'Select location type',
    },
  ];
}

function getManagersTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_first_name',
      label: 'First Name',
      showOnCard: true,
      editable: true,
      inputType: 'text',
    },
    {
      key: 'cr113_last_name',
      label: 'Last Name',
      showOnCard: true,
      editable: true,
      inputType: 'text',
    },
    {
      key: 'cr113_position_title',
      label: 'Position Title',
      showOnCard: true,
      editable: true,
      inputType: 'text',
    },
    {
      key: 'cr113_email',
      label: 'Email',
      showOnCard: true,
      editable: true,
      inputType: 'text',
    },
    {
      key: 'cr113_chat',
      label: 'Chat',
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

function getGroupsTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_group_name',
      label: 'Group',
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

function getDivisionsTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_div_name',
      label: 'Division',
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

function getRolesTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_role_name',
      label: 'Roles',
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

function getTypesTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_co_type_name',
      label: 'Types',
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

function getOtcTypesTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_otc_name',
      label: 'OTC Types',
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


function getCompanySegmentsTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_co_segment_name',
      label: 'Segment Name',
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

function getLocationSegmentsTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_coloc_segment_name',
      label: 'Segment Name',
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

function getLedgerTypesTabFields(): FieldDef[] {
  return [
    {
      key: 'cr113_co_ledger_type_name',
      label: 'Company Ledger',
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

function getConfiguredFields(
  tabId: string,
  fields: FieldDef[],
  segmentOptions: LookupOption[],
  typeOptions: LookupOption[],
  ledgerOptions: LookupOption[],
  assignmentCompanyOptions: LookupOption[],
  assignmentRoleOptions: LookupOption[],
  assignmentManagerOptions: LookupOption[],
  assignmentLocationOptions: LookupOption[],
  locationTypeOptions: LookupOption[],
  locationSegmentOptions: LookupOption[],
  divisionOptions: LookupOption[],
  groupOptions: LookupOption[],
  otcOptions: LookupOption[],
): FieldDef[] {
  if (tabId === 'jde_companies') {
    return getCompaniesTabFields(segmentOptions, typeOptions, ledgerOptions);
  }
  if (tabId === 'jde_locations') {
    return getLocationsTabFields(
      assignmentCompanyOptions,
      locationTypeOptions,
      locationSegmentOptions,
      divisionOptions,
      groupOptions,
      otcOptions,
    );
  }
  if (tabId === 'jde_co_assignments') {
    return getCompanyAssignmentsTabFields(
      assignmentCompanyOptions,
      assignmentRoleOptions,
      assignmentManagerOptions,
    );
  }
  if (tabId === 'jde_loc_assignments') {
    return getLocationAssignmentsTabFields(
      assignmentLocationOptions,
      assignmentRoleOptions,
      assignmentManagerOptions,
    );
  }
  if (tabId === 'jde_managers') {
    return getManagersTabFields();
  }
  if (tabId === 'jde_groups') {
    return getGroupsTabFields();
  }
  if (tabId === 'jde_divs') {
    return getDivisionsTabFields();
  }
  if (tabId === 'jde_roleses') {
    return getRolesTabFields();
  }
  if (tabId === 'jde_types') {
    return getTypesTabFields();
  }
  if (tabId === 'jde_otcs') {
    return getOtcTypesTabFields();
  }
  if (tabId === 'jde_co_segments') {
    return getCompanySegmentsTabFields();
  }
  if (tabId === 'jde_location_segments') {
    return getLocationSegmentsTabFields();
  }
  if (tabId === 'jde_ledger_types') {
    return getLedgerTypesTabFields();
  }
  if (tabId === 'user_securities') {
    return getUserSecuritiesTabFields();
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
  const [assignmentLocationOptions, setAssignmentLocationOptions] = useState<LookupOption[]>([]);
  const [assignmentRoleOptions, setAssignmentRoleOptions] = useState<LookupOption[]>([]);
  const [assignmentManagerOptions, setAssignmentManagerOptions] = useState<LookupOption[]>([]);
  const [locationTypeOptions, setLocationTypeOptions] = useState<LookupOption[]>([]);
  const [locationSegmentOptions, setLocationSegmentOptions] = useState<LookupOption[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<LookupOption[]>([]);
  const [groupOptions, setGroupOptions] = useState<LookupOption[]>([]);
  const [otcOptions, setOtcOptions] = useState<LookupOption[]>([]);

  useEffect(() => {
    const loadCompanyLookupOptions = async () => {
      const [segmentsRes, typesRes, ledgersRes, companiesRes, locationsRes, rolesRes, managersRes, locationSegmentsRes, divisionsRes, groupsRes, otcsRes] = await Promise.all([
        Cr113_jde_co_segmentsService.getAll({ select: ['cr113_jde_co_segmentid', 'cr113_co_segment_name'], orderBy: ['cr113_co_segment_name asc'] }),
        Cr113_jde_typesService.getAll({ select: ['cr113_jde_typeid', 'cr113_co_type_name'], orderBy: ['cr113_co_type_name asc'] }),
        Cr113_jde_ledger_typesService.getAll({ select: ['cr113_jde_ledger_typeid', 'cr113_co_ledger_type_name'], orderBy: ['cr113_co_ledger_type_name asc'] }),
        Cr113_jde_companiesService.getAll({ select: ['cr113_jde_companyid', 'cr113_co_id', 'cr113_co_desc'] }),
        Cr113_jde_locationsService.getAll({ select: ['cr113_jde_locationid', 'cr113_coloc_id', 'cr113_coloc_name'] }),
        Cr113_jde_rolesesService.getAll({ select: ['cr113_jde_rolesid', 'cr113_role_name'], orderBy: ['cr113_role_name asc'] }),
        Cr113_jde_managersService.getAll({ select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name', 'cr113_chat'], orderBy: ['cr113_manager_name asc'] }),
        Cr113_jde_location_segmentsService.getAll({ select: ['cr113_jde_location_segmentid', 'cr113_coloc_segment_name'], orderBy: ['cr113_coloc_segment_name asc'] }),
        Cr113_jde_divsService.getAll({ select: ['cr113_jde_divid', 'cr113_div_name'], orderBy: ['cr113_div_name asc'] }),
        Cr113_jde_groupsService.getAll({ select: ['cr113_jde_groupid', 'cr113_group_name'], orderBy: ['cr113_group_name asc'] }),
        Cr113_jde_otcsService.getAll({ select: ['cr113_jde_otcid', 'cr113_otc_name'], orderBy: ['cr113_otc_name asc'] }),
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
      setAssignmentLocationOptions(
        (locationsRes.data ?? [])
          .map((l: any) => ({
            value: l.cr113_jde_locationid,
            label: `${l.cr113_coloc_id ?? ''} - ${l.cr113_coloc_name ?? ''}`.trim(),
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
      setLocationTypeOptions(
        (typesRes.data ?? [])
          .filter((t: any) => locationTypeNames.has(String(t.cr113_co_type_name ?? '')))
          .map((t: any) => ({ value: t.cr113_jde_typeid, label: t.cr113_co_type_name ?? '' }))
      );
      setLocationSegmentOptions((locationSegmentsRes.data ?? []).map((s: any) => ({ value: s.cr113_jde_location_segmentid, label: s.cr113_coloc_segment_name ?? '' })));
      setDivisionOptions((divisionsRes.data ?? []).map((d: any) => ({ value: d.cr113_jde_divid, label: d.cr113_div_name ?? '' })));
      setGroupOptions((groupsRes.data ?? []).map((g: any) => ({ value: g.cr113_jde_groupid, label: g.cr113_group_name ?? '' })));
      setOtcOptions((otcsRes.data ?? []).map((o: any) => ({ value: o.cr113_jde_otcid, label: o.cr113_otc_name ?? '' })));
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
  let fields = getConfiguredFields(
    active.id,
    fieldsByTab[active.id] || [],
    companySegmentOptions,
    companyTypeOptions,
    companyLedgerOptions,
    assignmentCompanyOptions,
    assignmentRoleOptions,
    assignmentManagerOptions,
    assignmentLocationOptions,
    locationTypeOptions,
    locationSegmentOptions,
    divisionOptions,
    groupOptions,
    otcOptions,
  );
  // For jde_loc_assignments, ensure Location Code/Name columns and sort
  if (active.id === 'jde_loc_assignments') {
    fields = fields.map(f => {
      if (f.key === 'cr113_LocationCode' || f.key === 'cr113_LocationName') {
        return { ...f, showOnCard: true };
      }
      return f;
    });
  }
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
        const companyCodeById = new Map(
          (companiesRes.data ?? []).map(c => [
            c.cr113_jde_companyid,
            String(c.cr113_co_id ?? '').trim(),
          ])
        );
        const companyNameById = new Map(
          (companiesRes.data ?? []).map(c => [
            c.cr113_jde_companyid,
            String(c.cr113_co_desc ?? '').trim(),
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
          cr113_CompanyCode: companyCodeById.get(String(row._cr113_companycode_value)) ?? '',
          cr113_CompanyName: companyNameById.get(String(row._cr113_companycode_value)) ?? '',
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

      if (active.id === 'jde_locations') {
        const [locationsResult, typesRes, locationSegmentsRes, divisionsRes, groupsRes, otcsRes] = await Promise.all([
          Cr113_jde_locationsService.getAll(),
          Cr113_jde_typesService.getAll({ select: ['cr113_jde_typeid', 'cr113_co_type_name'] }),
          Cr113_jde_location_segmentsService.getAll({ select: ['cr113_jde_location_segmentid', 'cr113_coloc_segment_name'] }),
          Cr113_jde_divsService.getAll({ select: ['cr113_jde_divid', 'cr113_div_name'] }),
          Cr113_jde_groupsService.getAll({ select: ['cr113_jde_groupid', 'cr113_group_name'] }),
          Cr113_jde_otcsService.getAll({ select: ['cr113_jde_otcid', 'cr113_otc_name'] }),
        ]);

        const locationTypeById = new Map((typesRes.data ?? []).map((t: any) => [t.cr113_jde_typeid, t.cr113_co_type_name]));
        const locationSegmentById = new Map((locationSegmentsRes.data ?? []).map((s: any) => [s.cr113_jde_location_segmentid, s.cr113_coloc_segment_name]));
        const divisionById = new Map((divisionsRes.data ?? []).map((d: any) => [d.cr113_jde_divid, d.cr113_div_name]));
        const groupById = new Map((groupsRes.data ?? []).map((g: any) => [g.cr113_jde_groupid, g.cr113_group_name]));
        const otcById = new Map((otcsRes.data ?? []).map((o: any) => [o.cr113_jde_otcid, o.cr113_otc_name]));

        const data = (locationsResult.data ?? []).map((row: any) => {
          const code = String(row.cr113_coloc_id ?? '');
          const name = String(row.cr113_coloc_name ?? '');
          return {
            ...row,
            LocationCombined: code && name ? `${code} - ${name}` : (code || name),
            LocationSort: code,
            cr113_coloc_segment_namename:
              row.cr113_coloc_segment_namename ??
              (row._cr113_coloc_segment_name_value
                ? locationSegmentById.get(String(row._cr113_coloc_segment_name_value)) ?? ''
                : ''),
            cr113_div_namename:
              row.cr113_div_namename ??
              (row._cr113_div_name_value
                ? divisionById.get(String(row._cr113_div_name_value)) ?? ''
                : ''),
            cr113_group_namename:
              row.cr113_group_namename ??
              (row._cr113_group_name_value
                ? groupById.get(String(row._cr113_group_name_value)) ?? ''
                : ''),
            cr113_locationtypename:
              row.cr113_locationtypename ??
              (row._cr113_locationtype_value
                ? locationTypeById.get(String(row._cr113_locationtype_value)) ?? ''
                : ''),
            cr113_otc_namename:
              row.cr113_otc_namename ??
              (row._cr113_otc_name_value
                ? otcById.get(String(row._cr113_otc_name_value)) ?? ''
                : ''),
            cr113_co_id: row._cr113_co_id_value ?? row.cr113_co_id ?? '',
            cr113_coloc_segment_name: row._cr113_coloc_segment_name_value ?? row.cr113_coloc_segment_name ?? '',
            cr113_div_name: row._cr113_div_name_value ?? row.cr113_div_name ?? '',
            cr113_group_name: row._cr113_group_name_value ?? row.cr113_group_name ?? '',
            cr113_locationtype: row._cr113_locationtype_value ?? row.cr113_locationtype ?? '',
            cr113_otc_name: row._cr113_otc_name_value ?? row.cr113_otc_name ?? '',
            modifiedon: toUserTime(row.modifiedon),
          };
        });

        return {
          ...locationsResult,
          data,
        };
      }

      if (active.id === 'jde_loc_assignments') {
        const [assignmentsRes, locationsRes, rolesRes, managersRes] = await Promise.all([
          getAllPages(Cr113_jde_loc_assignmentsService),
          Cr113_jde_locationsService.getAll({ select: ['cr113_jde_locationid', 'cr113_coloc_id', 'cr113_coloc_name'] }),
          Cr113_jde_rolesesService.getAll({ select: ['cr113_jde_rolesid', 'cr113_role_name'] }),
          Cr113_jde_managersService.getAll({ select: ['cr113_jde_managerid', 'cr113_manager_name', 'cr113_first_name', 'cr113_last_name', 'cr113_chat'] }),
        ]);
        if (!assignmentsRes.success) return assignmentsRes;

        const roleById = new Map(
          (rolesRes.data ?? []).map((r: any) => [r.cr113_jde_rolesid, r.cr113_role_name ?? ''])
        );
        const managerById = new Map(
          (managersRes.data ?? []).map((m: any) => [
            m.cr113_jde_managerid,
            (m.cr113_manager_name ?? `${m.cr113_first_name ?? ''} ${m.cr113_last_name ?? ''}`).trim(),
          ])
        );
        const chatByManagerId = new Map(
          (managersRes.data ?? []).map((m: any) => [m.cr113_jde_managerid, m.cr113_chat ?? ''])
        );

        const data = (assignmentsRes.data ?? []).map((row: any) => {
          const location = locationsRes.data?.find((l: any) => l.cr113_jde_locationid === row._cr113_locationcode_value);
          const colocId = location?.cr113_coloc_id ?? '';
          const colocName = location?.cr113_coloc_name ?? '';
          return {
            cr113_jde_loc_assignmentid: row.cr113_jde_loc_assignmentid,
            cr113_LocationCode: colocId,
            cr113_LocationName: colocName,
            cr113_LocationCodeSort: colocId ?? '',
            cr113_locationcode: row._cr113_locationcode_value ?? '',
            cr113_rolename: row.cr113_rolename ?? (row._cr113_rolename_value ? roleById.get(String(row._cr113_rolename_value)) : ''),
            cr113_empl_name: row.cr113_empl_name ?? (row._cr113_empl_id_value ? managerById.get(String(row._cr113_empl_id_value)) : ''),
            cr113_empl_chat: row._cr113_empl_id_value ? chatByManagerId.get(String(row._cr113_empl_id_value)) ?? '' : '',
            modifiedon: row.modifiedon ? toUserTime(row.modifiedon) : '',
            cr113_roleid: row._cr113_rolename_value ?? '',
            cr113_empl_id: row._cr113_empl_id_value ?? '',
          };
        });
        return { ...assignmentsRes, data };
      }

      const result = active.id === 'jde_loc_assignments'
        ? await getAllPages(active.service)
        : await active.service.getAll();
      const rawRows = normalizeRows(result);
      let data = rawRows.map(row => ({
        ...row,
        ...(row.modifiedon !== undefined ? { modifiedon: toUserTime(row.modifiedon) } : {}),
      }));
      // For user_securities, show role type alias
      if (active.id === 'user_securities') {
        data = data.map(row => {
          const r = row as any;
          return {
            ...row,
            cr113_roletypename: r.cr113_roletypename ||
              (r.cr113_roletype === '1' ? 'Admin' : r.cr113_roletype === '2' ? 'PowerUser' : r.cr113_roletype === '3' ? 'Super User' : ''),
          };
        });
      }
      return {
        ...(result as object),
        data,
      };
    },
    create: (record) => active.id === 'jde_companies'
      ? active.service.create(buildCompaniesPayload(record as Record<string, unknown>))
      : active.id === 'jde_locations'
        ? active.service.create(buildLocationsPayload(record as Record<string, unknown>))
      : active.id === 'jde_co_assignments'
        ? active.service.create(buildCompanyAssignmentsPayload(record as Record<string, unknown>))
      : active.id === 'jde_loc_assignments'
        ? active.service.create(buildLocationAssignmentsPayload(record as Record<string, unknown>))
      : active.service.create(record),
    update: (id, changes) => active.id === 'jde_companies'
      ? active.service.update(id, buildCompaniesPayload(changes as Record<string, unknown>))
      : active.id === 'jde_locations'
        ? active.service.update(id, buildLocationsPayload(changes as Record<string, unknown>))
      : active.id === 'jde_co_assignments'
        ? active.service.update(id, buildCompanyAssignmentsPayload(changes as Record<string, unknown>))
      : active.id === 'jde_loc_assignments'
        ? active.service.update(id, buildLocationAssignmentsPayload(changes as Record<string, unknown>))
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
    rowDeleteIconOnly: false,
    ...(active.id === 'jde_companies'
      ? { defaultSortKey: 'cr113_co_id' as const, defaultSortDir: 'asc' as const }
      : active.id === 'jde_locations'
        ? { defaultSortKey: 'LocationSort' as const, defaultSortDir: 'asc' as const }
        : active.id === 'jde_co_assignments'
          ? { defaultSortKey: 'cr113_CompanyCodeSort' as const, defaultSortDir: 'asc' as const }
          : active.id === 'jde_loc_assignments'
            ? { defaultSortKey: 'cr113_LocationCodeSort' as const, defaultSortDir: 'asc' as const }
            : active.id === 'jde_managers'
              ? { defaultSortKey: 'cr113_last_name' as const, defaultSortDir: 'asc' as const }
              : active.id === 'jde_groups'
                ? { defaultSortKey: 'cr113_group_name' as const, defaultSortDir: 'asc' as const }
                : active.id === 'jde_divs'
                  ? { defaultSortKey: 'cr113_div_name' as const, defaultSortDir: 'asc' as const }
                  : active.id === 'jde_roleses'
                    ? { defaultSortKey: 'cr113_role_name' as const, defaultSortDir: 'asc' as const }
                    : active.id === 'jde_types'
                      ? { defaultSortKey: 'cr113_co_type_name' as const, defaultSortDir: 'asc' as const }
                      : active.id === 'jde_otcs'
                        ? { defaultSortKey: 'cr113_otc_name' as const, defaultSortDir: 'asc' as const }
                        : active.id === 'jde_co_segments'
                          ? { defaultSortKey: 'cr113_co_segment_name' as const, defaultSortDir: 'asc' as const }
                          : active.id === 'jde_location_segments'
                            ? { defaultSortKey: 'cr113_coloc_segment_name' as const, defaultSortDir: 'asc' as const }
                            : active.id === 'jde_ledger_types'
                              ? { defaultSortKey: 'cr113_co_ledger_type_name' as const, defaultSortDir: 'asc' as const }
                              : active.id === 'user_securities'
                                ? { defaultSortKey: 'cr113_username' as const, defaultSortDir: 'asc' as const }
            : {}),
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
        {loading ? <div>Loading table schema…</div> : <CardPage key={active.id} config={config} showExportExcelButton={true} />}
      </div>
    </section>
  );
}
