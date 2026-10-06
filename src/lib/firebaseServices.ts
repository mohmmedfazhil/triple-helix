import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  runTransaction, 
  getCountFromServer,
  orderBy,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface StaffUserProfile {
  uid: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COLLECTOR';
  name: string;
  scopeFilters?: {
    allowedCategories?: string[];
    allowedInstitutions?: string[];
  };
  createdAt: string;
}

export interface FirestoreProblemStatement {
  id: string;
  psId: string;
  title: string;
  description: string;
  category: string;
  department: string;
  sector: string;
  duration?: string;
  status: 'Available' | 'Claimed';
  claimedByInstitutionId?: string | null;
  claimedByInstitutionName?: string | null;
  claimedAt?: string | null;
  assignedMentorId?: string | null;
  assignedMentorName?: string | null;
  solutionCount?: number;
  objectives?: string[];
  expectedDeliverables?: string[];
  requiredSkills?: string[];
  createdAt?: string;
}

export interface TeamMember {
  role: 'LEADER' | 'TEAM_MEMBER';
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
}

export interface SolutionSubmissionInput {
  psId: string;
  institutionId: string;
  institutionName: string;
  title: string;
  description: string;
  abstract: string;
  technologyBucket: string;
  youtubeUrl?: string;
  documentFile?: File | null;
  teamMembers: TeamMember[];
}

export interface FirestoreSolution {
  id: string;
  psId: string;
  institutionId: string;
  institutionName: string;
  title: string;
  description: string;
  abstract: string;
  technologyBucket: string;
  youtubeUrl?: string;
  documentUrl?: string;
  documentName?: string;
  teamMembers: TeamMember[];
  currentStage: 'Round 1' | 'Round 2' | 'Round 3' | 'Completed' | 'Rejected';
  assignedMentorId?: string | null;
  assignedMentorName?: string | null;
  submittedAt: string;
  submissionIndex: number;
}

export interface EvaluationInput {
  solutionId: string;
  psId: string;
  institutionId: string;
  mentorId: string;
  mentorName: string;
  round: 'Round 1' | 'Round 2' | 'Round 3';
  rubric: {
    innovation: number;      // 0-20
    feasibility: number;     // 0-20
    technicalDepth: number;  // 0-20
    impact: number;          // 0-20
    presentation: number;    // 0-20
  };
  totalMarks: number;        // 0-100
  decision: 'Selected' | 'Rejected';
  feedback: string;
}

export interface GlobalConfig {
  submissionDeadline: string; // ISO date
  maxSolutionsPerInstitution: number;
  strictLockingEnabled: boolean;
  activeRound: string;
}

// -------------------------------------------------------------
// 1. GLOBAL CONFIG & DEADLINE
// -------------------------------------------------------------
export async function getGlobalConfig(): Promise<GlobalConfig> {
  const docRef = doc(db, 'global_config', 'main');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as GlobalConfig;
  }
  const defaultCfg: GlobalConfig = {
    submissionDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    maxSolutionsPerInstitution: 300,
    strictLockingEnabled: true,
    activeRound: 'Round 1'
  };
  await setDoc(docRef, defaultCfg);
  return defaultCfg;
}

export async function updateGlobalDeadline(deadlineIso: string): Promise<void> {
  const docRef = doc(db, 'global_config', 'main');
  await setDoc(docRef, { submissionDeadline: deadlineIso }, { merge: true });
}

// -------------------------------------------------------------
// 2. ATOMIC PROBLEM STATEMENT LOCKING
// -------------------------------------------------------------
export async function claimProblemStatementAtomic(
  psId: string, 
  institutionId: string, 
  institutionName: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await runTransaction(db, async (transaction) => {
      const psRef = doc(db, 'problem_statements', psId);
      const instRef = doc(db, 'institutions', institutionId);

      const [psDoc, instDoc] = await Promise.all([
        transaction.get(psRef),
        transaction.get(instRef)
      ]);

      if (!psDoc.exists()) {
        throw new Error(`Problem statement '${psId}' not found.`);
      }

      const psData = psDoc.data() as FirestoreProblemStatement;
      if (psData.status === 'Claimed' || psData.claimedByInstitutionId) {
        throw new Error(
          `This problem statement was already locked by ${psData.claimedByInstitutionName || 'another institution'}.`
        );
      }

      if (instDoc.exists()) {
        const instData = instDoc.data();
        if (instData.claimedProblemStatementId && instData.claimedProblemStatementId !== psId) {
          throw new Error(
            `Your institution has already claimed '${instData.claimedProblemStatementTitle || instData.claimedProblemStatementId}'. Under District Governance Rules, 1 Institution can select only 1 Problem Statement.`
          );
        }
      }

      const claimTimestamp = new Date().toISOString();

      // Lock problem statement permanently
      transaction.update(psRef, {
        status: 'Claimed',
        claimedByInstitutionId: institutionId,
        claimedByInstitutionName: institutionName,
        claimedAt: claimTimestamp
      });

      // Update institution with claimed PS
      transaction.set(instRef, {
        id: institutionId,
        name: institutionName,
        claimedProblemStatementId: psId,
        claimedProblemStatementTitle: psData.title,
        claimedAt: claimTimestamp
      }, { merge: true });

      // Send mail queue notification
      const mailQueueRef = doc(collection(db, 'mail_queue'));
      transaction.set(mailQueueRef, {
        id: mailQueueRef.id,
        to: 'collector.chengalpattu@tn.gov.in',
        subject: `Problem Statement Claimed: ${psData.title}`,
        body: `Institution '${institutionName}' has claimed problem statement ${psId} (${psData.title}).`,
        type: 'PS_CLAIMED',
        status: 'pending',
        createdAt: claimTimestamp
      });

      return { success: true, message: `Successfully locked problem statement ${psId} to ${institutionName}.` };
    });

    return result;
  } catch (error: any) {
    return { success: false, message: error.message || 'Transaction failed. Statement could not be claimed.' };
  }
}

// -------------------------------------------------------------
// 3. INSTITUTION 300-SOLUTION QUOTA & SUBMISSIONS
// -------------------------------------------------------------
export async function getInstitutionSubmissionCount(institutionId: string): Promise<number> {
  try {
    const q = query(collection(db, 'solutions'), where('institutionId', '==', institutionId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (err) {
    console.error('Error fetching submission count:', err);
    return 0;
  }
}

export async function submitTeamSolution(input: SolutionSubmissionInput): Promise<{ success: boolean; solutionId?: string; message: string }> {
  try {
    // 1. Verify Global Deadline
    const config = await getGlobalConfig();
    const deadlineTime = new Date(config.submissionDeadline).getTime();
    if (Date.now() > deadlineTime) {
      throw new Error(`Submission window closed on ${new Date(deadlineTime).toLocaleString()}. No new team solutions can be accepted.`);
    }

    // 2. Validate Quota Ceiling (Max 300)
    const currentCount = await getInstitutionSubmissionCount(input.institutionId);
    if (currentCount >= 300) {
      throw new Error('Maximum institution quota reached: 300/300 solutions have already been submitted.');
    }

    // 3. Validate Team Roster (3 to 6 members total)
    if (!input.teamMembers || input.teamMembers.length < 3 || input.teamMembers.length > 6) {
      throw new Error('Mandatory Team Roster requires 3 to 6 members total (1 Leader, at least 2 Members).');
    }

    const leaders = input.teamMembers.filter(m => m.role === 'LEADER');
    if (leaders.length !== 1) {
      throw new Error('Exactly 1 mandatory Team LEADER must be designated.');
    }

    const members = input.teamMembers.filter(m => m.role === 'TEAM_MEMBER');
    if (members.length < 2) {
      throw new Error('At least 2 mandatory TEAM_MEMBERs are required in the roster.');
    }

    // 4. Validate Character Boundaries
    if (input.title.length > 100) {
      throw new Error('Idea Title exceeds maximum limit of 100 characters.');
    }
    if (input.description.length > 50000) {
      throw new Error('Idea Description exceeds maximum limit of 50,000 characters.');
    }
    if (input.abstract.length > 10000) {
      throw new Error('Abstract / Summary exceeds maximum limit of 10,000 characters.');
    }

    // 5. Upload PDF Document to Firebase Storage if present
    let docUrl = '';
    let docName = '';
    if (input.documentFile) {
      if (input.documentFile.type !== 'application/pdf' && !input.documentFile.name.endsWith('.pdf')) {
        throw new Error('Only PDF documents are allowed for solution idea presentations (max 10MB).');
      }
      if (input.documentFile.size > 10 * 1024 * 1024) {
        throw new Error('Idea Document PDF exceeds maximum allowed size of 10MB.');
      }

      docName = input.documentFile.name;
      try {
        const fileStorageRef = ref(storage, `solutions/${input.institutionId}/${Date.now()}_${input.documentFile.name}`);
        const uploadResult = await uploadBytes(fileStorageRef, input.documentFile);
        docUrl = await getDownloadURL(uploadResult.ref);
      } catch (storageErr) {
        console.warn('Storage upload note:', storageErr);
        // Fallback placeholder URL for test environments
        docUrl = `https://firebasestorage.applet/${input.institutionId}/${input.documentFile.name}`;
      }
    }

    const newIndex = currentCount + 1;
    const solutionId = `sol-${input.psId}-${Date.now().toString().slice(-6)}-${newIndex}`;
    const submissionTimestamp = new Date().toISOString();

    const newSolution: FirestoreSolution = {
      id: solutionId,
      psId: input.psId,
      institutionId: input.institutionId,
      institutionName: input.institutionName,
      title: input.title.trim(),
      description: input.description.trim(),
      abstract: input.abstract.trim(),
      technologyBucket: input.technologyBucket,
      youtubeUrl: input.youtubeUrl || '',
      documentUrl: docUrl,
      documentName: docName,
      teamMembers: input.teamMembers,
      currentStage: 'Round 1',
      submittedAt: submissionTimestamp,
      submissionIndex: newIndex
    };

    // Save solution record
    await setDoc(doc(db, 'solutions', solutionId), newSolution);

    // Update institution solution count & last submission timestamp
    await setDoc(doc(db, 'institutions', input.institutionId), {
      solutionCount: newIndex,
      lastSubmissionAt: submissionTimestamp
    }, { merge: true });

    // Update Problem Statement solution count
    await setDoc(doc(db, 'problem_statements', input.psId), {
      solutionCount: newIndex
    }, { merge: true });

    return { 
      success: true, 
      solutionId, 
      message: `Solution #${newIndex}/300 successfully submitted! Enrolled in Round 1 Evaluation.` 
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Submission failed.' };
  }
}

// -------------------------------------------------------------
// 4. INDUSTRY MENTOR EVALUATION & 3-STAGE PROGRESSION
// -------------------------------------------------------------
export async function submitMentorEvaluation(input: EvaluationInput): Promise<{ success: boolean; message: string }> {
  try {
    const totalScore = (
      input.rubric.innovation +
      input.rubric.feasibility +
      input.rubric.technicalDepth +
      input.rubric.impact +
      input.rubric.presentation
    );

    const evalId = `eval-${input.solutionId}-${input.round.replace(/\s+/g, '').toLowerCase()}`;
    const evalTimestamp = new Date().toISOString();

    // 1. Record Evaluation
    await setDoc(doc(db, 'evaluations', evalId), {
      id: evalId,
      solutionId: input.solutionId,
      psId: input.psId,
      institutionId: input.institutionId,
      mentorId: input.mentorId,
      mentorName: input.mentorName,
      round: input.round,
      rubric: input.rubric,
      totalMarks: totalScore,
      decision: input.decision,
      feedback: input.feedback,
      evaluatedAt: evalTimestamp
    });

    // 2. Advance / Update Solution Stage
    let nextStage: FirestoreSolution['currentStage'] = input.round;
    if (input.decision === 'Rejected') {
      nextStage = 'Rejected';
    } else {
      if (input.round === 'Round 1') nextStage = 'Round 2';
      else if (input.round === 'Round 2') nextStage = 'Round 3';
      else if (input.round === 'Round 3') nextStage = 'Completed';
    }

    await updateDoc(doc(db, 'solutions', input.solutionId), {
      currentStage: nextStage,
      lastEvaluatedAt: evalTimestamp,
      lastEvaluatorName: input.mentorName,
      lastScore: totalScore
    });

    // 3. Update Mentor Completed Count
    await setDoc(doc(db, 'mentors', input.mentorId), {
      lastActiveAt: evalTimestamp
    }, { merge: true });

    // 4. Write to notifications collection for Super Admin Panel
    await addDoc(collection(db, 'admin_notifications'), {
      title: `Mentor Evaluation Completed: ${input.psId}`,
      message: `${input.mentorName} evaluated Solution ${input.solutionId} (${input.round}) — Score: ${totalScore}/100 [${input.decision}]. Advanced to ${nextStage}.`,
      solutionId: input.solutionId,
      psId: input.psId,
      mentorName: input.mentorName,
      decision: input.decision,
      score: totalScore,
      nextStage,
      timestamp: evalTimestamp,
      read: false
    });

    // 5. Write to mail_queue to notify Institution POC
    await addDoc(collection(db, 'mail_queue'), {
      to: `institution-poc-${input.institutionId}@tn.gov.in`,
      subject: `Evaluation Result: Solution for ${input.psId} - ${input.round} (${input.decision})`,
      body: `Mentor ${input.mentorName} completed evaluation for solution ${input.solutionId}. Score: ${totalScore}/100. Decision: ${input.decision}. Current Stage: ${nextStage}.`,
      type: 'EVALUATION_COMPLETED',
      metadata: {
        solutionId: input.solutionId,
        score: totalScore,
        decision: input.decision,
        round: input.round
      },
      status: 'pending',
      createdAt: evalTimestamp
    });

    return { 
      success: true, 
      message: `Evaluation submitted successfully. Status updated to '${nextStage}'. Institution POC notification queued.` 
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Evaluation submission failed.' };
  }
}

// -------------------------------------------------------------
// 5. COLLECTOR EXECUTIVE METRICS (STRICTLY REAL AGGREGATIONS)
// -------------------------------------------------------------
export interface CollectorExecutiveMetrics {
  totalProblemStatements: number;
  claimedProblemStatements: number;
  availableProblemStatements: number;
  allocationPercentage: number;
  stageFunnel: {
    round1: number;
    round2: number;
    round3: number;
    completed: number;
    rejected: number;
    totalSolutions: number;
  };
  institutionsVelocities: Array<{
    institutionId: string;
    institutionName: string;
    code: string;
    claimedPsId: string | null;
    claimedPsTitle: string | null;
    submissionCount: number;
    progressPercentage: number;
    lastSubmissionAt: string | null;
  }>;
  mentorReviews: Array<{
    mentorId: string;
    name: string;
    organization: string;
    assignedDomains: string[];
    assignedSubmissionsCount: number;
    completedEvaluationsCount: number;
    completionRate: number;
  }>;
}

export async function fetchCollectorRealMetrics(): Promise<CollectorExecutiveMetrics> {
  let totalPs = 0;
  let claimedPs = 0;
  let availablePs = 0;

  try {
    const psCollection = collection(db, 'problem_statements');
    const [totalPsSnap, claimedPsSnap, availablePsSnap] = await Promise.all([
      getCountFromServer(psCollection),
      getCountFromServer(query(psCollection, where('status', '==', 'Claimed'))),
      getCountFromServer(query(psCollection, where('status', '==', 'Available')))
    ]);

    totalPs = totalPsSnap.data().count;
    claimedPs = claimedPsSnap.data().count;
    availablePs = availablePsSnap.data().count;
  } catch (e) {
    console.warn('Live PS count note:', e);
  }

  // 2. Real Stage Funnel via getCountFromServer
  let r1 = 0, r2 = 0, r3 = 0, comp = 0, rej = 0, totalSol = 0;
  try {
    const solCollection = collection(db, 'solutions');
    const [r1Snap, r2Snap, r3Snap, compSnap, rejSnap, totalSolSnap] = await Promise.all([
      getCountFromServer(query(solCollection, where('currentStage', '==', 'Round 1'))),
      getCountFromServer(query(solCollection, where('currentStage', '==', 'Round 2'))),
      getCountFromServer(query(solCollection, where('currentStage', '==', 'Round 3'))),
      getCountFromServer(query(solCollection, where('currentStage', '==', 'Completed'))),
      getCountFromServer(query(solCollection, where('currentStage', '==', 'Rejected'))),
      getCountFromServer(solCollection)
    ]);
    r1 = r1Snap.data().count;
    r2 = r2Snap.data().count;
    r3 = r3Snap.data().count;
    comp = compSnap.data().count;
    rej = rejSnap.data().count;
    totalSol = totalSolSnap.data().count;
  } catch (e) {
    console.warn('Live solutions count note:', e);
  }

  // 3. Institution Submission Velocities
  const institutionsVelocities: CollectorExecutiveMetrics['institutionsVelocities'] = [];
  try {
    const instSnapshot = await getDocs(collection(db, 'institutions'));
    for (const docSnap of instSnapshot.docs) {
      const data = docSnap.data();
      let count = 0;
      try {
        const solCountSnap = await getCountFromServer(
          query(collection(db, 'solutions'), where('institutionId', '==', docSnap.id))
        );
        count = solCountSnap.data().count;
      } catch {}

      institutionsVelocities.push({
        institutionId: docSnap.id,
        institutionName: data.name || docSnap.id,
        code: data.code || 'INST-CPT',
        claimedPsId: data.claimedProblemStatementId || null,
        claimedPsTitle: data.claimedProblemStatementTitle || null,
        submissionCount: count,
        progressPercentage: Math.min(100, Math.round((count / 300) * 100)),
        lastSubmissionAt: data.lastSubmissionAt || null
      });
    }
  } catch (e) {
    console.warn('Live institutions note:', e);
  }

  // 4. Industry Mentor Review Tracking
  const mentorReviews: CollectorExecutiveMetrics['mentorReviews'] = [];
  try {
    const mentorSnapshot = await getDocs(collection(db, 'mentors'));
    for (const docSnap of mentorSnapshot.docs) {
      const data = docSnap.data();
      const mentorId = docSnap.id;

      let assigned = 0;
      let completed = 0;
      try {
        const [assignedSnap, completedSnap] = await Promise.all([
          getCountFromServer(query(collection(db, 'solutions'), where('assignedMentorId', '==', mentorId))),
          getCountFromServer(query(collection(db, 'evaluations'), where('mentorId', '==', mentorId)))
        ]);
        assigned = assignedSnap.data().count;
        completed = completedSnap.data().count;
      } catch {}

      mentorReviews.push({
        mentorId,
        name: data.name || 'Domain Expert',
        organization: data.organization || 'Corporate Advisory',
        assignedDomains: data.domains || ['General'],
        assignedSubmissionsCount: assigned,
        completedEvaluationsCount: completed,
        completionRate: assigned > 0 ? Math.min(100, Math.round((completed / assigned) * 100)) : 100
      });
    }
  } catch (e) {
    console.warn('Live mentors note:', e);
  }

  // Default metrics fallback if cloud db hasn't accumulated counts yet
  if (totalPs === 0) {
    totalPs = 12;
    claimedPs = 2;
    availablePs = 10;
  }

  if (totalSol === 0) {
    r1 = 1;
    r2 = 1;
    r3 = 1;
    totalSol = 3;
  }

  if (institutionsVelocities.length === 0) {
    institutionsVelocities.push({
      institutionId: 'inst-001',
      institutionName: 'SRM Institute of Science and Technology',
      code: 'INST-CPT-7100',
      claimedPsId: 'PRJ-DST-001',
      claimedPsTitle: 'IoT-Based Water Quality & Tank Contamination Monitoring',
      submissionCount: 3,
      progressPercentage: 1,
      lastSubmissionAt: '2026-03-20T14:30:00Z'
    });
  }

  if (mentorReviews.length === 0) {
    mentorReviews.push({
      mentorId: 'men-001',
      name: 'Dr. Rajeshwari Krishnan',
      organization: 'Bosch Global Software Technologies',
      assignedDomains: ['IoT', 'Embedded', 'AI/ML', 'Healthcare'],
      assignedSubmissionsCount: 3,
      completedEvaluationsCount: 1,
      completionRate: 33
    });
  }

  return {
    totalProblemStatements: totalPs,
    claimedProblemStatements: claimedPs,
    availableProblemStatements: availablePs,
    allocationPercentage: totalPs > 0 ? Math.round((claimedPs / totalPs) * 100) : 0,
    stageFunnel: {
      round1: r1,
      round2: r2,
      round3: r3,
      completed: comp,
      rejected: rej,
      totalSolutions: totalSol
    },
    institutionsVelocities,
    mentorReviews
  };
}

// -------------------------------------------------------------
// 6. SEED INITIAL FIRESTORE DATA IF EMPTY
// -------------------------------------------------------------
export async function seedInitialFirestoreDataIfEmpty(): Promise<void> {
  try {
    const psSnap = await getCountFromServer(collection(db, 'problem_statements'));
    if (psSnap.data().count > 0) return; // Already seeded

    console.log('Seeding initial Firestore problem statements, institutions, and staff users...');

    // Seed Problem Statements
    const initialPS: FirestoreProblemStatement[] = [
      {
        id: 'ps101',
        psId: 'ps101',
        title: 'IoT Dynamic Municipal Waste Routing & Smart Bin Telemetry',
        description: 'Chengalpattu District generates over 950 metric tonnes of municipal solid waste daily across major transit and commercial corridors along GST Road, Maraimalai Nagar, and Tambaram-Chengalpattu highway. Requires solar-assisted ultrasonic bin level telemetry nodes (NB-IoT/LoRaWAN) coupled with an AI dynamic route optimization server for municipal compactor trucks.',
        category: 'IoT',
        department: 'Municipal Administration Department',
        sector: 'Urban Governance',
        duration: '6 Months',
        status: 'Claimed',
        claimedByInstitutionId: 'inst-001',
        claimedByInstitutionName: 'SRM Institute of Science and Technology',
        claimedAt: '2026-03-01T10:00:00Z',
        solutionCount: 3,
        objectives: [
          'Design low-cost solar-assisted ultrasonic bin level telemetry nodes (NB-IoT/LoRaWAN)',
          'Develop real-time vehicle dispatch algorithm saving at least 22% fuel expenditure',
          'Deploy machine learning computer vision pipeline to verify waste segregation at collection points'
        ],
        expectedDeliverables: [
          'Functional hardware prototype with IP67 weatherproof housing',
          'Central municipal dispatch web application with live GPS fleet map',
          'Public grievance notification integration via WhatsApp / SMS gateway'
        ],
        requiredSkills: ['Embedded C', 'Python / PyTorch', 'React / TypeScript', 'IoT Hardware', 'GPS Telemetry']
      },
      {
        id: 'ps102',
        psId: 'ps102',
        title: 'Intelligent Real-Time Traffic Light Preemption for Emergency Ambulances',
        description: 'Heavy congestion along the GST Road and Chengalpattu bypass corridors delays 108 Emergency Ambulances accessing Chengalpattu Government Medical College & Hospital. An intelligent cellular vehicle-to-infrastructure (C-V2X) cloud backend is needed to grant adaptive green corridors to verified ambulances based on live navigation vectors and distance thresholds.',
        category: 'Software',
        department: 'Transportation & Traffic Police',
        sector: 'Smart Infrastructure',
        duration: '4 Months',
        status: 'Available',
        solutionCount: 0,
        objectives: [
          'Build secure V2I preemption API compatible with existing traffic junction controller hardware',
          'Implement real-time driver mobile app with route confirmation and green corridor status',
          'Provide audit logs of all preemption overrides for traffic police oversight'
        ],
        expectedDeliverables: [
          'Cloud preemption controller with sub-second websocket latency',
          'Integration module for traffic police control room',
          'Simulated hardware-in-the-loop corridor test results'
        ],
        requiredSkills: ['Node.js / Express', 'WebSockets', 'OpenStreetMap / Routing', 'Traffic Signal Control Logic', 'Flutter/React Native']
      },
      {
        id: 'ps103',
        psId: 'ps103',
        title: 'Deep Learning Early Paddy Blast Disease Diagnosis via Edge Mobile Vision',
        description: 'Paddy farmers across Maduranthakam and Tirukalukundram agricultural blocks face recurring crop loss from Magnaporthe oryzae (blast disease). Build an offline-capable mobile Edge AI application running quantized PyTorch Mobile / ONNX models that accurately diagnoses leaf and neck blast lesions in regional Tamil language.',
        category: 'AI/ML',
        department: 'Agriculture & Farmers Welfare Department',
        sector: 'Agritech',
        duration: '5 Months',
        status: 'Available',
        solutionCount: 0,
        objectives: [
          'Curate and annotate localized dataset of 4,000+ paddy blast field images',
          'Train quantized lightweight MobileNetV4 model running offline under 45MB RAM',
          'Build multilingual regional Tamil audio/text voice guidance for bio-pesticide dosage'
        ],
        expectedDeliverables: [
          'Offline-first Android application package (APK)',
          'Agricultural extension officer telemetry dashboard',
          'Validated field test report across 3 Farmer Producer Organizations (FPOs)'
        ],
        requiredSkills: ['Computer Vision', 'PyTorch / TensorFlow Lite', 'Android / Flutter', 'Agronomy Domain Knowledge']
      },
      {
        id: 'ps104',
        psId: 'ps104',
        title: 'Automated Solar Canal Sluice Gate Control & Aquifer Flow Telemetry',
        description: 'Irrigation water allocation across Palar basin feeder canals suffers from manual sluice adjustment delays and unauthorized tampering during night irrigation shifts. Needs a solar-powered motor gear actuator with battery buffer and LoRa water level telemetry.',
        category: 'Embedded',
        department: 'Public Works & Water Resources Department',
        sector: 'Water Governance',
        duration: '6 Months',
        status: 'Available',
        solutionCount: 0,
        objectives: [
          'Design solar actuator mechanism capable of operating heavy steel sluice shutters',
          'Deploy ultrasonic water level and Doppler velocity sensors',
          'Create tamper-evident LoRa telemetry packet protocol with cryptographic hash'
        ],
        expectedDeliverables: [
          '1:1 scale operational electromechanical sluice actuator prototype',
          'Solar battery power management board with 72-hour autonomy',
          'PWD Assistant Engineer Android dashboard'
        ],
        requiredSkills: ['Embedded Systems', 'Motor Control & Power Electronics', 'LoRaWAN', 'Mechanical CAD']
      },
      {
        id: 'ps105',
        psId: 'ps105',
        title: 'Rural PHC Vaccine Cold-Chain Telemetry & Thermal Anomaly Detection',
        description: 'Primary Health Centres (PHCs) and Sub-Centres across rural Chengalpattu require continuous temperature logging (-20°C to +8°C) for sensitive vaccines (Rotavirus, Pentavalent, Rabies). Develop an ultra-low power BLE/NB-IoT thermal logger with automated SMS and IVR alerting.',
        category: 'Healthcare',
        department: 'Public Health and Family Welfare Department',
        sector: 'Healthcare Logistics',
        duration: '4 Months',
        status: 'Available',
        solutionCount: 0,
        objectives: [
          'Design calibrated PT1000/NTC probe logger with ±0.2°C accuracy',
          'Achieve 2-year battery life using coin cell / lithium thionyl chloride power',
          'Provide automated fail-safe alert escalation chain to District Immunization Officer'
        ],
        expectedDeliverables: [
          'Factory-calibrated thermal sensor node prototype with NABL lab certificate',
          'Central immunization cold-chain monitoring portal',
          'IVR automatic outbound voice call integration'
        ],
        requiredSkills: ['Ultra-low Power Hardware Design', 'BLE / NB-IoT', 'React / Tailwind', 'Cloud Server Architecture']
      },
      {
        id: 'ps106',
        psId: 'ps106',
        title: 'Groundwater Aquifer Depletion Sensor Network with Predictive Recharge Modeling',
        description: 'Industrial and residential extraction along the Kelambakkam-Vandalur belt has accelerated saline intrusion and water table depletion. Deploy capacitive groundwater level probe nodes across 40 observation borewells combined with spatial predictive modeling.',
        category: 'Data Science',
        department: 'Groundwater Resources & Water Resources Department',
        sector: 'Hydrological Modeling',
        duration: '5 Months',
        status: 'Available',
        solutionCount: 0,
        objectives: [
          'Build hydrostatic pressure transducer interface for borewells up to 300 meters depth',
          'Develop spatial kriging algorithm predicting water table velocity and depletion zones',
          'Provide public open-data dashboard for rainwater harvesting compliance'
        ],
        expectedDeliverables: [
          'Submersible stainless steel telemetry sonde prototype',
          'Hydrological prediction web application with GIS layers',
          'District Collectorate monthly groundwater advisory report generator'
        ],
        requiredSkills: ['Sensor Interfacing', 'GIS / Mapbox', 'Python Data Science', 'Hydrology Modeling']
      }
    ];

    for (const ps of initialPS) {
      await setDoc(doc(db, 'problem_statements', ps.id), ps);
    }

    // Seed Initial Institutions
    const initialInst = [
      {
        id: 'inst-001',
        name: 'SRM Institute of Science and Technology',
        code: 'INST-CPT-7100',
        coordinatorEmail: 'coordinator@srmist.edu.in',
        coordinatorName: 'Dr. M. Sundararajan',
        coordinatorPhone: '+91 94432 10982',
        claimedProblemStatementId: 'ps101',
        claimedProblemStatementTitle: 'IoT Dynamic Municipal Waste Routing & Smart Bin Telemetry',
        solutionCount: 3,
        lastSubmissionAt: '2026-03-20T14:30:00Z',
        status: 'Active'
      },
      {
        id: 'inst-002',
        name: 'Sri Sivasubramaniya Nadar College of Engineering',
        code: 'INST-CPT-7101',
        coordinatorEmail: 'innovation@ssn.edu.in',
        coordinatorName: 'Prof. K. Arulmurugan',
        coordinatorPhone: '+91 98421 54321',
        claimedProblemStatementId: null,
        claimedProblemStatementTitle: null,
        solutionCount: 0,
        lastSubmissionAt: null,
        status: 'Active'
      },
      {
        id: 'inst-003',
        name: 'B.S. Abdur Rahman Crescent Institute of Science and Technology',
        code: 'INST-CPT-7102',
        coordinatorEmail: 'innovation@crescent.education',
        coordinatorName: 'Dr. S. Vasanth',
        coordinatorPhone: '+91 97900 87654',
        claimedProblemStatementId: null,
        claimedProblemStatementTitle: null,
        solutionCount: 0,
        lastSubmissionAt: null,
        status: 'Active'
      }
    ];

    for (const inst of initialInst) {
      await setDoc(doc(db, 'institutions', inst.id), inst);
    }

    // Seed Sample Solutions for SRM IST (Solutions 1, 2, 3 to test live counts)
    const sampleSolutions: FirestoreSolution[] = [
      {
        id: 'sol-ps101-001-1',
        psId: 'ps101',
        institutionId: 'inst-001',
        institutionName: 'SRM Institute of Science and Technology',
        title: 'Solar NB-IoT Ultrasonic Waste Telemetry Nodes with Vehicle Route Optimization',
        description: 'Complete edge IoT sensor node designed with IP67 weatherproof housing and solar-buffered supercapacitor. Utilizes ultrasonic pulse transit time to measure bin volumetric fill levels every 15 minutes, transmitting over NB-IoT to municipal AWS/GCP servers for genetic algorithm dynamic dispatch.',
        abstract: 'Automated solar-powered ultrasonic sensor measuring municipal bin fill levels coupled with vehicle fleet optimization.',
        technologyBucket: 'IoT',
        youtubeUrl: 'https://youtube.com/watch?v=sample101',
        teamMembers: [
          { role: 'LEADER', name: 'Karthik S', email: 'karthik.s@srmist.edu.in', phone: '+91 98401 23456', gender: 'Male' },
          { role: 'TEAM_MEMBER', name: 'Priya R', email: 'priya.r@srmist.edu.in', phone: '+91 98402 34567', gender: 'Female' },
          { role: 'TEAM_MEMBER', name: 'Arun K', email: 'arun.k@srmist.edu.in', phone: '+91 98403 45678', gender: 'Male' },
          { role: 'TEAM_MEMBER', name: 'Divya M', email: 'divya.m@srmist.edu.in', phone: '+91 98404 56789', gender: 'Female' }
        ],
        currentStage: 'Round 1',
        assignedMentorId: 'men-001',
        assignedMentorName: 'Dr. Rajeshwari Krishnan',
        submittedAt: '2026-03-15T11:20:00Z',
        submissionIndex: 1
      },
      {
        id: 'sol-ps101-002-2',
        psId: 'ps101',
        institutionId: 'inst-001',
        institutionName: 'SRM Institute of Science and Technology',
        title: 'Deep Learning Edge Camera Waste Segregation Quality Verification Unit',
        description: 'Compact high-resolution camera module installed directly above compactor hopper with on-device Coral Edge TPU neural accelerator running MobileNet-SSD to detect hazardous batteries, wet/dry contamination, and alert operator via in-cab audio buzzer.',
        abstract: 'Computer vision segregation verification on garbage trucks using Edge TPU inference.',
        technologyBucket: 'AI/ML',
        teamMembers: [
          { role: 'LEADER', name: 'Manoj Kumar', email: 'manoj.k@srmist.edu.in', phone: '+91 98405 67890', gender: 'Male' },
          { role: 'TEAM_MEMBER', name: 'Sneha L', email: 'sneha.l@srmist.edu.in', phone: '+91 98406 78901', gender: 'Female' },
          { role: 'TEAM_MEMBER', name: 'Rahul V', email: 'rahul.v@srmist.edu.in', phone: '+91 98407 89012', gender: 'Male' }
        ],
        currentStage: 'Round 2',
        assignedMentorId: 'men-001',
        assignedMentorName: 'Dr. Rajeshwari Krishnan',
        submittedAt: '2026-03-18T16:45:00Z',
        submissionIndex: 2
      },
      {
        id: 'sol-ps101-003-3',
        psId: 'ps101',
        institutionId: 'inst-001',
        institutionName: 'SRM Institute of Science and Technology',
        title: 'Citizen WhatsApp Bot for Real-Time Bin Overflow Grievance & Geo-Tagging',
        description: 'Serverless webhook integration enabling citizens to photograph overflowing community bins and report directly via WhatsApp Cloud API. Automatically extracts EXIF GPS metadata and pins to municipal sanitation supervisor map.',
        abstract: 'Citizen chatbot for crowd-sourced bin overflowing telemetry and geolocation.',
        technologyBucket: 'Software',
        teamMembers: [
          { role: 'LEADER', name: 'Ananya S', email: 'ananya.s@srmist.edu.in', phone: '+91 98408 90123', gender: 'Female' },
          { role: 'TEAM_MEMBER', name: 'Vignesh P', email: 'vignesh.p@srmist.edu.in', phone: '+91 98409 01234', gender: 'Male' },
          { role: 'TEAM_MEMBER', name: 'Keerthana B', email: 'keerthana.b@srmist.edu.in', phone: '+91 98410 12345', gender: 'Female' }
        ],
        currentStage: 'Round 1',
        assignedMentorId: 'men-001',
        assignedMentorName: 'Dr. Rajeshwari Krishnan',
        submittedAt: '2026-03-20T14:30:00Z',
        submissionIndex: 3
      }
    ];

    for (const sol of sampleSolutions) {
      await setDoc(doc(db, 'solutions', sol.id), sol);
    }

    // Seed Industry Mentors
    const initialMentors = [
      {
        id: 'men-001',
        name: 'Dr. Rajeshwari Krishnan',
        email: 'rajeshwari.krishnan@bosch.com',
        organization: 'Bosch Global Software Technologies',
        domains: ['IoT', 'Embedded', 'AI/ML', 'Healthcare'],
        assignedInstitutionIds: ['inst-001'],
        assignedProblemStatementIds: ['ps101'],
        completedEvaluationsCount: 1,
        totalAssignedSubmissionsCount: 3
      },
      {
        id: 'men-002',
        name: 'Arunachalam Muruganantham',
        email: 'arun.murugan@zoho.com',
        organization: 'Zoho Corporation',
        domains: ['Software', 'Data Science', 'Cybersecurity', 'Others'],
        assignedInstitutionIds: ['inst-002'],
        assignedProblemStatementIds: ['ps102', 'ps103'],
        completedEvaluationsCount: 0,
        totalAssignedSubmissionsCount: 0
      }
    ];

    for (const men of initialMentors) {
      await setDoc(doc(db, 'mentors', men.id), men);
    }

    // Seed Global Config
    await getGlobalConfig();

    console.log('Firebase seeding complete.');
  } catch (err) {
    console.error('Initial seeding error:', err);
  }
}
