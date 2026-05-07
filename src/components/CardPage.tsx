import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react'
import { usePageMode } from './page-mode'

// ── Field descriptor ──────────────────────────────────────────────────────────
export interface FieldDef {
  /** key on the record object */
  key: string
  /** human-readable label */
  label: string
  /** input control type in add/edit form */
  inputType?: 'text' | 'select'
  /** options for select inputs */
  options?: Array<{ label: string; value: string }>
  /** shown on the card face (first field is the card title) */
  showOnCard?: boolean
  /** included in the add/edit form */
  editable?: boolean
  /** required in the form */
  required?: boolean
  /** placeholder text */
  placeholder?: string
}

// ── Page configuration ────────────────────────────────────────────────────────
export interface CardPageConfig {
  title: string
  description?: string
  /** hides title/description while keeping search and add actions visible */
  hideHeaderCopy?: boolean
  /** hides search and add actions while keeping title/description visible */
  hideHeaderActions?: boolean
  /** hides edit action from row actions */
  hideRowEditAction?: boolean
  /** hides delete action from row actions */
  hideRowDeleteAction?: boolean
  /** attribute that uniquely identifies a record (GUID) */
  idField: string
  fields: FieldDef[]
  /** default sort column key */
  defaultSortKey?: string
  /** default sort direction (default: 'asc') */
  defaultSortDir?: 'asc' | 'desc'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: {
    getAll: () => Promise<{ data?: any[]; success?: boolean }>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: (record: any) => Promise<{ data?: any; success?: boolean }>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (id: string, changes: any) => Promise<{ data?: any; success?: boolean }>
    delete: (id: string) => Promise<void>
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowSelect?: (row: any) => void
  selectedRowId?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowDoubleClick?: (row: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowsLoaded?: (rows: any[]) => void
}

export interface CardPageHandle {
  setSearchValue: (value: string) => void
  openAddForm: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

// ── Main component ────────────────────────────────────────────────────────────
export const CardPage = forwardRef<CardPageHandle, { config: CardPageConfig }>(function CardPage({ config }, ref) {
  const {
    title,
    description,
    hideHeaderCopy,
    hideHeaderActions,
    hideRowEditAction,
    hideRowDeleteAction,
    idField,
    fields,
    service,
    defaultSortKey,
    defaultSortDir: defaultSortDirProp,
    onRowSelect,
    selectedRowId,
    onRowDoubleClick,
    onRowsLoaded,
  } = config
  const pageMode = usePageMode()
  const singularTitle = title.endsWith('ies')
    ? `${title.slice(0, -3)}y`
    : title.replace(/s$/, '')

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Row | null>(null) // null = create
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null)
  const [deleting, setDeleting] = useState(false)

  // search
  const [search, setSearch] = useState('')

  const firstInputRef = useRef<HTMLInputElement>(null)
  const firstSelectRef = useRef<HTMLSelectElement>(null)

  // sort
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDirProp ?? 'asc')

  useEffect(() => {
    if (!success) return
    const timer = window.setTimeout(() => setSuccess(null), 3500)
    return () => window.clearTimeout(timer)
  }, [success])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('CardPage: calling service.getAll')
      const res = await service.getAll()
      console.log('CardPage: service.getAll result', res)
      const nextRows = res?.data ?? []
      setRows(nextRows)
      onRowsLoaded?.(nextRows)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // filter rows by search across all visible fields
  const filteredFields = fields.filter(f => {
    const key = f.key.toLowerCase()
    const label = f.label.toLowerCase()
    return !(key.endsWith('_ak') || label === 'alternate key')
  })

  const tableFields = filteredFields.filter(f => f.showOnCard)
  const editableFields = filteredFields.filter(f => f.editable)

  const filtered = search.trim()
    ? rows.filter(r =>
        tableFields.some(f =>
          String(r[f.key] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : rows
  const sortedFiltered = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortKey] ?? '').toLowerCase()
        const bv = String(b[sortKey] ?? '').toLowerCase()
        const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' })
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filtered
  // ── open add modal ──
  const openAdd = () => {
    setEditTarget(null)
    setFormValues({})
    setFormError(null)
    setModalOpen(true)
    setTimeout(() => {
      firstInputRef.current?.focus()
      firstSelectRef.current?.focus()
    }, 50)
  }

  useImperativeHandle(ref, () => ({
    setSearchValue: (value: string) => setSearch(value),
    openAddForm: () => openAdd(),
  }))

  // ── open edit modal ──
  const openEdit = (row: Row) => {
    setEditTarget(row)
    const vals: Record<string, string> = {}
    editableFields.forEach(f => { vals[f.key] = String(row[f.key] ?? '') })
    setFormValues(vals)
    setFormError(null)
    setModalOpen(true)
    setTimeout(() => {
      firstInputRef.current?.focus()
      firstSelectRef.current?.focus()
    }, 50)
  }

  // ── close modal ──
  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditTarget(null)
  }

  // ── save ──
  const handleSave = async () => {
    // validate
    for (const f of editableFields) {
      if (f.required && !formValues[f.key]?.trim()) {
        setFormError(`"${f.label}" is required.`)
        return
      }
    }
    setSaving(true)
    setFormError(null)
    try {
      const payload: Record<string, string> = {}
      editableFields.forEach(f => {
        if (formValues[f.key] !== undefined) payload[f.key] = formValues[f.key]
      })
      if (editTarget) {
        await service.update(String(editTarget[idField]), payload)
      } else {
        await service.create(payload)
      }
      closeModal()
      await load()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  // ── delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await service.delete(String(deleteTarget[idField]))
      setError(null)
      setSuccess('Record deleted successfully.')
      await load()
    } catch (e) {
      setSuccess(null)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setDeleteTarget(null)
      setDeleting(false)
    }
  }

  // ── primary display field (first visible field) ──
  const primaryField = tableFields[0]
  const showHeaderCopy = !hideHeaderCopy
  const showHeaderActions = !hideHeaderActions
  const showHeader = showHeaderCopy || showHeaderActions
  const showRowEditAction = !(hideRowEditAction || pageMode === 'references')
  const showRowDeleteAction = !(hideRowDeleteAction || pageMode === 'references')
  const showRowActionsColumn = showRowEditAction || showRowDeleteAction

  const tableSection = (
    <div className={`cp-table-wrap${showHeader ? '' : ' cp-table-wrap-standalone'}`}>
      <div className="cp-table-scroll">
        <table className="cp-table">
          <thead>
            <tr>
              {tableFields.map(f => (
                <th
                  key={f.key}
                  className="cp-th-sortable"
                  onClick={() => handleSort(f.key)}
                  aria-sort={sortKey === f.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <span className="cp-th-inner">
                    {f.label}
                    <span className="cp-sort-indicator">
                      {sortKey === f.key ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </span>
                </th>
              ))}
              {showRowActionsColumn && <th className="cp-col-actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 && (
              <tr><td colSpan={tableFields.length + (showRowActionsColumn ? 1 : 0)} className="cp-td-empty">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={tableFields.length + (showRowActionsColumn ? 1 : 0)} className="cp-td-empty">
                  {search ? 'No records match your search.' : `No ${title.toLowerCase()} found. Add one above.`}
                </td>
              </tr>
            )}
            {sortedFiltered.map(row => {
              const rowId = String(row[idField])
              const isSelected = selectedRowId != null && rowId === selectedRowId
              return (
              <tr
                key={rowId}
                className={onRowSelect ? `cp-row-selectable${isSelected ? ' cp-row-selected' : ''}` : undefined}
                onClick={onRowSelect ? () => onRowSelect(row) : undefined}
                onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row) : undefined}
                title={onRowDoubleClick ? 'Double-click to view related assignments' : undefined}
                aria-selected={isSelected}
              >
                {tableFields.map(f => (
                  <td key={f.key}>{row[f.key] ?? '—'}</td>
                ))}
                {showRowActionsColumn && (
                  <td className="cp-col-actions">
                    {showRowEditAction && (
                      <button
                        className="cp-btn cp-btn-ghost"
                        onClick={e => {
                          e.stopPropagation()
                          openEdit(row)
                        }}
                        title="Edit"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {showRowDeleteAction && (
                      <button
                        className="cp-btn cp-btn-danger-ghost"
                        onClick={e => {
                          e.stopPropagation()
                          setDeleteTarget(row)
                        }}
                        title="Delete"
                      >
                        🗑 Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="cp-table-footer" aria-hidden="true" />
    </div>
  )

  return (
    <div className="cp-page">
      {error && <div className="cp-error">{error}</div>}
      {success && <div className="cp-success">{success}</div>}

      {showHeader ? (
        <div className="cp-card-shell">
          <div className={`cp-header${!showHeaderCopy && showHeaderActions ? ' cp-header-actions-only' : ''}`}>
            {showHeaderCopy && (
              <div>
                <h2 className="cp-title">{title}</h2>
                {description && <p className="cp-desc">{description}</p>}
              </div>
            )}
            {showHeaderActions && (
              <div className="cp-header-actions cp-header-actions-flex">
                <input
                  className="cp-search"
                  type="search"
                  placeholder={`Search ${title.toLowerCase()}…`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="cp-btn cp-btn-primary" onClick={openAdd}>
                  + Add {singularTitle}
                </button>
              </div>
            )}
          </div>

          {tableSection}
        </div>
      ) : tableSection}

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="cp-overlay" onMouseDown={closeModal}>
          <div className="cp-modal" onMouseDown={e => e.stopPropagation()}>
            <div className="cp-modal-header">
              <h3>{editTarget ? `Edit ${singularTitle}` : `Add ${singularTitle}`}</h3>
              <button className="cp-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="cp-modal-body">
              {editableFields.map((f, i) => (
                <label className="cp-field" key={f.key}>
                  <span className="cp-field-label">
                    {f.label}{f.required && <span className="cp-required">*</span>}
                  </span>
                  {f.inputType === 'select' ? (
                    <select
                      ref={i === 0 ? firstSelectRef : undefined}
                      className="cp-input"
                      value={formValues[f.key] ?? ''}
                      onChange={e => setFormValues(v => ({ ...v, [f.key]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') void handleSave() }}
                    >
                      <option value="">{f.placeholder ?? `Select ${f.label}`}</option>
                      {(f.options ?? []).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      ref={i === 0 ? firstInputRef : undefined}
                      type="text"
                      className="cp-input"
                      placeholder={f.placeholder ?? ''}
                      value={formValues[f.key] ?? ''}
                      onChange={e => setFormValues(v => ({ ...v, [f.key]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') void handleSave() }}
                    />
                  )}
                </label>
              ))}
              {formError && <div className="cp-form-error">{formError}</div>}
            </div>
            <div className="cp-modal-footer">
              <button className="cp-btn cp-btn-secondary" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button className="cp-btn cp-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {showRowDeleteAction && deleteTarget && (
        <div className="cp-overlay" onMouseDown={() => !deleting && setDeleteTarget(null)}>
          <div className="cp-modal cp-modal-sm" onMouseDown={e => e.stopPropagation()}>
            <div className="cp-modal-header">
              <h3>Confirm Delete</h3>
              <button className="cp-modal-close" onClick={() => setDeleteTarget(null)}>×</button>
            </div>
            <div className="cp-modal-body">
              <p>
                Are you sure you want to delete{' '}
                <strong>{primaryField ? String(deleteTarget[primaryField.key] ?? 'this record') : 'this record'}</strong>?
                This cannot be undone.
              </p>
              <p>
                Warning: if this record is referenced by related tables, deletion will be blocked to prevent data loss.
              </p>
            </div>
            <div className="cp-modal-footer">
              <button className="cp-btn cp-btn-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="cp-btn cp-btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
              {/* Automatically close modal after delete */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
