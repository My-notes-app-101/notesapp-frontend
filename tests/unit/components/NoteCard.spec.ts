import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import NoteCard from '@/components/notes/NoteCard.vue'
import type { Note } from '@/types/note.types'

const mockNote: Note = {
  id: '1',
  title: 'Test Note Title',
  content: 'This is the content of the note',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user1',
}

const longContentNote: Note = {
  ...mockNote,
  content: 'a'.repeat(200),
}

const mockOpenConfirm = vi.fn().mockResolvedValue(false)
const mockDeleteNote = vi.fn().mockResolvedValue(true)

vi.mock('@/stores/ui.store', () => ({
  useUiStore: () => ({
    addToast: vi.fn(),
    openConfirm: mockOpenConfirm,
  }),
}))

vi.mock('@/stores/notes.store', () => ({
  useNotesStore: () => ({
    operationStatus: {},
    deleteNote: mockDeleteNote,
  }),
}))

describe('NoteCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockOpenConfirm.mockClear()
    mockDeleteNote.mockClear()
  })

  it('renders note title', () => {
    const wrapper = mount(NoteCard, { props: { note: mockNote } })
    expect(wrapper.text()).toContain('Test Note Title')
  })

  it('renders content preview', () => {
    const wrapper = mount(NoteCard, { props: { note: mockNote } })
    expect(wrapper.text()).toContain('This is the content of the note')
  })

  it('truncates long content to 120 characters', () => {
    const wrapper = mount(NoteCard, { props: { note: longContentNote } })
    expect(wrapper.text()).toContain('…')
  })

  it('shows no content message when content is null', () => {
    const wrapper = mount(NoteCard, { props: { note: { ...mockNote, content: null } } })
    expect(wrapper.text()).toContain('No content')
  })

  it('emits view event when card is clicked', async () => {
    const wrapper = mount(NoteCard, { props: { note: mockNote } })
    await wrapper.find('article').trigger('click')
    expect(wrapper.emitted('view')).toBeTruthy()
    expect(wrapper.emitted('view')?.[0]).toEqual([mockNote])
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(NoteCard, { props: { note: mockNote } })
    await wrapper.find('[aria-label="Edit note"]').trigger('click')
    expect(wrapper.emitted('edit')).toBeTruthy()
  })

  it('calls openConfirm when delete button is clicked', async () => {
    const wrapper = mount(NoteCard, { props: { note: mockNote } })
    await wrapper.find('[aria-label="Delete note"]').trigger('click')
    expect(mockOpenConfirm).toHaveBeenCalled()
  })
})
