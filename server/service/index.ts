import { ReferralService } from './referral-service';
import { UserService } from './user-service';
import { ClinicalNoteService } from './clinical-note-service';
import { FileService } from './file-service';
import { ReferralRepository } from '../repository/referral-repository';
import { UserRepository } from '../repository/user-repository';
import { ClinicalNoteRepository } from '../repository/clinical-note-repository';
import { FileRepository } from '../repository/file-repository';

// Service singletons
let referralService: ReferralService | null = null;
let userService: UserService | null = null;
let clinicalNoteService: ClinicalNoteService | null = null;
let fileService: FileService | null = null;

// Get or create ReferralService singleton
export function getReferralService(): ReferralService {
  if (!referralService) {
    const db = useDB();
    const referralRepository = new ReferralRepository(db);
    const fileRepository = new FileRepository(db);
    referralService = new ReferralService(referralRepository, fileRepository);
  }
  return referralService;
}

// Get or create UserService singleton
export function getUserService(): UserService {
  if (!userService) {
    const db = useDB();
    const userRepository = new UserRepository(db);
    userService = new UserService(userRepository);
  }
  return userService;
}

// Get or create ClinicalNoteService singleton
export function getClinicalNoteService(): ClinicalNoteService {
  if (!clinicalNoteService) {
    const db = useDB();
    const clinicalNoteRepository = new ClinicalNoteRepository(db);
    clinicalNoteService = new ClinicalNoteService(clinicalNoteRepository);
  }
  return clinicalNoteService;
}

// Get or create FileService singleton
export function getFileService(): FileService {
  if (!fileService) {
    const db = useDB();
    const fileRepository = new FileRepository(db);
    fileService = new FileService(fileRepository);
  }
  return fileService;
}
