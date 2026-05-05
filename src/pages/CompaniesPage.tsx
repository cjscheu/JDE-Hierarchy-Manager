import { useEffect, useState } from 'react'
import { CardPage } from '../components/CardPage'
import { Cr113_jde_companiesService } from '../generated/services/Cr113_jde_companiesService'
import { Cr113_jde_co_segmentsService } from '../generated/services/Cr113_jde_co_segmentsService'
import { Cr113_jde_typesService } from '../generated/services/Cr113_jde_typesService'
import { Cr113_jde_ledger_typesService } from '../generated/services/Cr113_jde_ledger_typesService'

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
    }

    void loadOptions()
  }, [])

  return (
    <CardPage
      config={{
        title: 'JDE Companies',
        description: 'Manage JDE company records.',
        idField: 'cr113_jde_companyid',
        service: companiesService,
        defaultSortKey: 'cr113_co_id',
        defaultSortDir: 'asc',
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
  )
}
