import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClinicalNoteService } from '../../../server/service/clinical-note-service';
import type { ClinicalNoteRepository } from '../../../server/repository/clinical-note-repository';
import type { UpdateClinicalNote } from '../../../server/types/clinical-note-types';

describe('ClinicalNoteService', () => {
  let service: ClinicalNoteService;
  let mockRepository: any;

  beforeEach(() => {
    // Create a mock repository
    mockRepository = {
      create: vi.fn(),
      findAllWithReferralInfo: vi.fn(),
      count: vi.fn(),
      findByIdRow: vi.fn(),
      findByReferralId: vi.fn(),
      findByAuthorId: vi.fn(),
      updateNote: vi.fn(),
      deleteNote: vi.fn(),
    };

    service = new ClinicalNoteService(mockRepository as unknown as ClinicalNoteRepository);
  });

  describe('updateClinicalNote', () => {
    it('should update session_date when provided', async () => {
      const noteId = '123';
      const updateData: UpdateClinicalNote = {
        session_date: '2026-01-31T00:00:00.000Z',
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        content: 'Test content',
        author_id: 789,
        is_deleted: false,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        session_date: new Date('2026-01-31T00:00:00.000Z'),
      });
    });

    it('should update content when provided', async () => {
      const noteId = '123';
      const updateData: UpdateClinicalNote = {
        content: 'Updated content',
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        content: 'Updated content',
        author_id: 789,
        is_deleted: false,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        content: 'Updated content',
      });
    });

    it('should update author_id when provided', async () => {
      const noteId = '123';
      const updateData: UpdateClinicalNote = {
        author_id: '999',
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        content: 'Test content',
        author_id: 999,
        is_deleted: false,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        author_id: '999',
      });
    });

    it('should update is_deleted flag when provided (soft delete)', async () => {
      const noteId = '123';
      const updateData: UpdateClinicalNote = {
        is_deleted: true,
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        content: 'Test content',
        author_id: 789,
        is_deleted: true,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        is_deleted: true,
      });
    });

    it('should update multiple fields when provided', async () => {
      const noteId = '123';
      const updateData: UpdateClinicalNote = {
        content: 'Updated content',
        session_date: '2026-01-31T00:00:00.000Z',
        author_id: '999',
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        content: 'Updated content',
        author_id: 999,
        is_deleted: false,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        content: 'Updated content',
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        author_id: '999',
      });
    });

    it('should only include provided fields in update (omit undefined fields)', async () => {
      const noteId = '123';
      const updateData: UpdateClinicalNote = {
        content: 'Only content updated',
        // session_date, author_id, and is_deleted are undefined
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        content: 'Only content updated',
        author_id: 789,
        is_deleted: false,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      // Should only pass the content field, not the undefined ones
      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        content: 'Only content updated',
      });
    });

    it('should handle session_date as Date object', async () => {
      const noteId = '123';
      const dateObj = new Date('2026-01-31T00:00:00.000Z');
      const updateData: UpdateClinicalNote = {
        session_date: dateObj,
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: dateObj,
        content: 'Test content',
        author_id: 789,
        is_deleted: false,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        session_date: dateObj,
      });
    });

    it('should set is_deleted to false when explicitly provided', async () => {
      const noteId = '123';
      const updateData: UpdateClinicalNote = {
        is_deleted: false,
      };

      const mockUpdatedNote = {
        id: 123,
        referral_id: 456,
        session_date: new Date('2026-01-31T00:00:00.000Z'),
        content: 'Test content',
        author_id: 789,
        is_deleted: false,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-31T00:00:00.000Z'),
      };

      mockRepository.updateNote.mockResolvedValue(mockUpdatedNote);

      await service.updateClinicalNote(noteId, updateData);

      expect(mockRepository.updateNote).toHaveBeenCalledWith(noteId, {
        is_deleted: false,
      });
    });
  });
});
