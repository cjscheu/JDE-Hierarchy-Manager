import { Cr113_jde_companiesService } from '../generated/services/Cr113_jde_companiesService'
import { Cr113_jde_locationsService } from '../generated/services/Cr113_jde_locationsService'
import { Cr113_jde_co_assignmentsService } from '../generated/services/Cr113_jde_co_assignmentsService'
import { Cr113_jde_loc_assignmentsService } from '../generated/services/Cr113_jde_loc_assignmentsService'
import { canDeleteAnyRecord } from '../security/access'

const ensureNoDependencies = (count: number, dependencyLabel: string) => {
  if (canDeleteAnyRecord()) {
    return
  }

  if (count > 0) {
    throw new Error(`Delete blocked: this record is used by ${count} ${dependencyLabel}. Remove dependent records first.`)
  }
}

export async function ensureRoleCanBeDeleted(roleId: string) {
  const [companyAssignmentsRes, locationAssignmentsRes] = await Promise.all([
    Cr113_jde_co_assignmentsService.getAll(),
    Cr113_jde_loc_assignmentsService.getAll(),
  ])

  const companyUseCount = (companyAssignmentsRes.data ?? []).filter(
    row => row._cr113_rolename_value === roleId
  ).length
  const locationUseCount = (locationAssignmentsRes.data ?? []).filter(
    row => row._cr113_rolename_value === roleId
  ).length

  ensureNoDependencies(companyUseCount, 'company assignments')
  ensureNoDependencies(locationUseCount, 'location assignments')
}

export async function ensureManagerCanBeDeleted(managerId: string) {
  const [companyAssignmentsRes, locationAssignmentsRes] = await Promise.all([
    Cr113_jde_co_assignmentsService.getAll(),
    Cr113_jde_loc_assignmentsService.getAll(),
  ])

  const companyUseCount = (companyAssignmentsRes.data ?? []).filter(
    row => row._cr113_managername_value === managerId
  ).length
  const locationUseCount = (locationAssignmentsRes.data ?? []).filter(
    row => row._cr113_empl_id_value === managerId
  ).length

  ensureNoDependencies(companyUseCount, 'company assignments')
  ensureNoDependencies(locationUseCount, 'location assignments')
}

export async function ensureCompanySegmentCanBeDeleted(segmentId: string) {
  const companiesRes = await Cr113_jde_companiesService.getAll()
  const inUseCount = (companiesRes.data ?? []).filter(
    row => row._cr113_segment_name_value === segmentId
  ).length
  ensureNoDependencies(inUseCount, 'companies')
}

export async function ensureCompanyTypeCanBeDeleted(typeId: string) {
  const companiesRes = await Cr113_jde_companiesService.getAll()
  const inUseCount = (companiesRes.data ?? []).filter(
    row => row._cr113_segment_type_value === typeId
  ).length
  ensureNoDependencies(inUseCount, 'companies')
}

export async function ensureLedgerTypeCanBeDeleted(ledgerTypeId: string) {
  const companiesRes = await Cr113_jde_companiesService.getAll()
  const inUseCount = (companiesRes.data ?? []).filter(
    row => row._cr113_ledger_type_value === ledgerTypeId
  ).length
  ensureNoDependencies(inUseCount, 'companies')
}

export async function ensureLocationSegmentCanBeDeleted(segmentId: string) {
  const locationsRes = await Cr113_jde_locationsService.getAll()
  const inUseCount = (locationsRes.data ?? []).filter(
    row => row._cr113_coloc_segment_name_value === segmentId
  ).length
  ensureNoDependencies(inUseCount, 'locations')
}

export async function ensureDivisionCanBeDeleted(divisionId: string) {
  const locationsRes = await Cr113_jde_locationsService.getAll()
  const inUseCount = (locationsRes.data ?? []).filter(
    row => row._cr113_div_name_value === divisionId
  ).length
  ensureNoDependencies(inUseCount, 'locations')
}

export async function ensureGroupCanBeDeleted(groupId: string) {
  const locationsRes = await Cr113_jde_locationsService.getAll()
  const inUseCount = (locationsRes.data ?? []).filter(
    row => row._cr113_group_name_value === groupId
  ).length
  ensureNoDependencies(inUseCount, 'locations')
}

export async function ensureOtcCanBeDeleted(otcId: string) {
  const locationsRes = await Cr113_jde_locationsService.getAll()
  const inUseCount = (locationsRes.data ?? []).filter(
    row => row._cr113_otc_name_value === otcId
  ).length
  ensureNoDependencies(inUseCount, 'locations')
}
