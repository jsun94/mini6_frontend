import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBook, createBook, updateBook } from '../services/api'
import {
  container,
  title,
  fieldGroup,
  fieldGroupLarge,
  labelStyle,
  inputStyle,
  errStyle,
  buttonRow,
  cancelBtn,
  saveBtn,
} from '../styles/bookFormPageStyles'

export default function BookFormPage() {
  const { id }   = useParams()           // undefined → create mode
  const navigate  = useNavigate()
  const isEdit    = Boolean(id)

  const [form,    setForm]    = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(isEdit)
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState({})
  const [serverError, setServerError] = useState('')

  // Load existing book when editing
  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      try {
        const data = await getBook(id)
        setForm({ title: data.title, description: data.description || '' })
      } catch {
        alert('도서 정보를 불러오지 못했습니다.')
        navigate('/books')
      } finally {
        setLoading(false)
      }
    })()
  }, [id, isEdit, navigate])

  function validate() {
    const e = {}
    if (!form.title.trim())       e.title       = '제목을 입력해주세요.'
    if (!form.description.trim()) e.description = '내용을 입력해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return     // backend error msg 확인 필요 시 해당 코드 한 줄 주석처리
    setServerError('')
    setSaving(true)
    try {
      if (isEdit) {
        await updateBook(id, form)
        navigate(`/books/${id}`)
      } else {
        const created = await createBook(form)
        navigate(`/books/${created.id}`)
      }
    } catch(err) {
        setServerError(err.message || '저장 중 오류가 발생했습니다.')
    } finally {
        setSaving(false)
    }
  }

  if (loading) return <div className="spinner" />

  return (
    <div className="page" style={container}>
      <h2 style={title}>
        {isEdit ? '도서 수정' : '새 도서 등록'}
      </h2>

      {serverError && (
        <div style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#ffebee',
            color: '#c62828',
            fontSize: '14px',
            fontWeight: 600
        }}>
            {serverError}
        </div>
      )}

      {/* Title */}
      <div style={fieldGroup}>
        <label style={labelStyle}>제목</label>
        <input
          type="text"
          value={form.title}
          onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setErrors(p => ({ ...p, title: '' })); setServerError('') }}
          placeholder="도서 제목을 입력하세요"
          style={{ ...inputStyle, borderColor: errors.title ? '#e53935' : '#ccc' }}
        />
        {errors.title && <p style={errStyle}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div style={fieldGroupLarge}>
        <label style={labelStyle}>내용</label>
        <textarea
          value={form.description}
          onChange={e => { setForm(p => ({ ...p, description: e.target.value })); setErrors(p => ({ ...p, description: '' })); setServerError('') }}
          placeholder="도서의 내용을 입력하세요"
          rows={7}
          style={{ ...inputStyle, resize: 'vertical', borderColor: errors.description ? '#e53935' : '#ccc' }}
        />
        {errors.description && <p style={errStyle}>{errors.description}</p>}
      </div>

      {/* Buttons */}
      <div style={buttonRow}>
        <button
          onClick={() => navigate(isEdit ? `/books/${id}` : '/books')}
          style={cancelBtn}
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{ ...saveBtn, opacity: saving ? .65 : 1 }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}
