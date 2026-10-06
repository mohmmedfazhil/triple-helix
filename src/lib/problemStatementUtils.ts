import { Project } from '../types';
import { INITIAL_PROJECTS } from '../data/initialData';
import { FirestoreProblemStatement } from './firebaseServices';

// Canonical Bidirectional Mapping between Portal IDs and Database IDs
export const PS_CANONICAL_MAP: Record<string, string> = {
  // Portal ID -> Database ID
  'PRJ-DST-001': 'ps101',
  'PRJ-DST-002': 'ps102',
  'PRJ-DST-003': 'ps103',
  'PRJ-DST-004': 'ps104',
  'PRJ-DST-005': 'ps105',
  'PRJ-DST-006': 'ps106',

  // Database ID -> Portal ID
  'ps101': 'PRJ-DST-001',
  'ps102': 'PRJ-DST-002',
  'ps103': 'PRJ-DST-003',
  'ps104': 'PRJ-DST-004',
  'ps105': 'PRJ-DST-005',
  'ps106': 'PRJ-DST-006',

  // Common number aliases
  '101': 'PRJ-DST-001',
  '102': 'PRJ-DST-002',
  '103': 'PRJ-DST-003',
  '104': 'PRJ-DST-004',
  '105': 'PRJ-DST-005',
  '106': 'PRJ-DST-006',
  '1': 'PRJ-DST-001',
  '2': 'PRJ-DST-002',
  '3': 'PRJ-DST-003',
  '4': 'PRJ-DST-004',
  '5': 'PRJ-DST-005',
  '6': 'PRJ-DST-006',
};

/**
 * Normalizes any identifier to the canonical PRJ-DST-00X format.
 */
export function normalizeToPortalId(rawId: string): string {
  if (!rawId) return 'PRJ-DST-001';
  const clean = rawId.trim();

  // Direct match in map
  if (PS_CANONICAL_MAP[clean]) {
    const mapped = PS_CANONICAL_MAP[clean];
    if (mapped.startsWith('PRJ-DST-')) return mapped;
  }

  // Case-insensitive direct match
  const upper = clean.toUpperCase();
  if (upper.startsWith('PRJ-DST-')) return upper;

  const lower = clean.toLowerCase();
  if (PS_CANONICAL_MAP[lower]) {
    const mapped = PS_CANONICAL_MAP[lower];
    if (mapped.startsWith('PRJ-DST-')) return mapped;
  }

  // Stripped dashes matching
  const stripped = lower.replace(/[-_]/g, '');
  if (stripped === 'prjdst001' || stripped === 'prjdst1' || stripped === 'ps101') return 'PRJ-DST-001';
  if (stripped === 'prjdst002' || stripped === 'prjdst2' || stripped === 'ps102') return 'PRJ-DST-002';
  if (stripped === 'prjdst003' || stripped === 'prjdst3' || stripped === 'ps103') return 'PRJ-DST-003';
  if (stripped === 'prjdst004' || stripped === 'prjdst4' || stripped === 'ps104') return 'PRJ-DST-004';
  if (stripped === 'prjdst005' || stripped === 'prjdst5' || stripped === 'ps105') return 'PRJ-DST-005';
  if (stripped === 'prjdst006' || stripped === 'prjdst6' || stripped === 'ps106') return 'PRJ-DST-006';

  return clean;
}

/**
 * Gets corresponding Firestore doc ID (e.g. ps101) for a portal ID, or returns the raw ID.
 */
export function getFirestoreDocId(rawId: string): string {
  if (!rawId) return 'ps101';
  const portalId = normalizeToPortalId(rawId);
  return PS_CANONICAL_MAP[portalId] || rawId;
}

/**
 * Converts a Project interface into a FirestoreProblemStatement format.
 */
export function projectToFirestoreStatement(p: Project): FirestoreProblemStatement {
  return {
    id: p.id,
    psId: p.id,
    title: p.title,
    description: p.description,
    category: (p.technologyCategory || 'IoT') as any,
    department: p.department,
    sector: p.sector,
    duration: p.duration,
    status: (p.status === 'Completed' || p.status === 'In Progress' ? 'Claimed' : 'Available') as any,
    claimedByInstitutionId: p.selectedByInstitutionId || null,
    claimedByInstitutionName: p.selectedByInstitutionName || null,
    claimedAt: (p as any).selectedAt || null,
    assignedMentorId: p.assignedMentorId || null,
    assignedMentorName: p.assignedMentorName || null,
    objectives: p.objectives || [],
    expectedDeliverables: p.expectedDeliverables || [],
    requiredSkills: p.requiredSkills || [],
    solutionCount: p.team?.students?.length ? 1 : 0
  };
}

/**
 * Comprehensive lookup for any problem statement across runtime context and initial registry.
 */
export function findProblemStatement(
  rawId: string, 
  customProjects?: Project[]
): FirestoreProblemStatement | null {
  if (!rawId) return null;

  const targetClean = rawId.trim();
  const targetPortalId = normalizeToPortalId(targetClean);
  const targetLower = targetClean.toLowerCase();
  const targetStripped = targetLower.replace(/[-_]/g, '');

  const searchPool = [...(customProjects || []), ...INITIAL_PROJECTS];

  const matched = searchPool.find(p => {
    if (!p) return false;
    const pId = p.id;
    if (pId === targetClean || pId === targetPortalId) return true;
    if (pId.toLowerCase() === targetLower) return true;
    if (pId.replace(/[-_]/g, '').toLowerCase() === targetStripped) return true;

    // Check alias
    const alias = PS_CANONICAL_MAP[pId];
    if (alias && (alias === targetClean || alias.toLowerCase() === targetLower)) return true;

    return false;
  });

  if (matched) {
    return projectToFirestoreStatement(matched);
  }

  // Fallback to first project if specifically requesting PRJ-DST-001
  if (targetPortalId === 'PRJ-DST-001' && INITIAL_PROJECTS[0]) {
    return projectToFirestoreStatement(INITIAL_PROJECTS[0]);
  }

  return null;
}
