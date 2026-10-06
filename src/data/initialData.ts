import { Institution, Mentor, Project, AuditLogEntry, NotificationItem, MentorFeedback } from '../types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-001',
    name: 'SRM Institute of Science and Technology',
    shortName: 'SRM IST',
    code: 'INST-CPT-7100',
    addressLine1: 'SRM Nagar, Kattankulathur',
    addressLine2: 'GST Road',
    city: 'Chengalpattu',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '603203',
    institutionType: 'Private',
    universityAffiliated: false,
    affiliatedUniversityName: 'Deemed to be University',
    autonomous: true,
    naacGrade: 'A++',
    principalName: 'Dr. C. Muthamizhchelvan',
    coordinatorName: 'Dr. M. Sundararajan',
    coordinatorDesignation: 'Head of Industry-Institute Partnership Cell',
    coordinatorPhone: '+91 94432 10982',
    coordinatorEmail: 'coordinator@srmist.edu.in',
    websiteUrl: 'https://www.srmist.edu.in',
    username: 'srmist_admin',
    status: 'Active',
    selectedProjectId: 'PRJ-DST-001'
  },
  {
    id: 'inst-002',
    name: 'Sri Sivasubramaniya Nadar College of Engineering',
    shortName: 'SSN College',
    code: 'INST-CPT-7101',
    addressLine1: 'Rajiv Gandhi Salai (OMR), Kalavakkam',
    addressLine2: 'Chengalpattu District',
    city: 'Chengalpattu',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '603110',
    institutionType: 'Private',
    universityAffiliated: true,
    affiliatedUniversityName: 'Anna University, Chennai',
    autonomous: true,
    naacGrade: 'A++',
    principalName: 'Dr. V. E. Annamalai',
    coordinatorName: 'Prof. K. Arulmurugan',
    coordinatorDesignation: 'Associate Professor, Mechanical & Innovation',
    coordinatorPhone: '+91 98421 54321',
    coordinatorEmail: 'innovation@ssn.edu.in',
    websiteUrl: 'https://www.ssn.edu.in',
    username: 'ssn_admin',
    status: 'Active',
    selectedProjectId: undefined
  },
  {
    id: 'inst-003',
    name: 'B.S. Abdur Rahman Crescent Institute of Science and Technology',
    shortName: 'Crescent Institute',
    code: 'INST-CPT-7102',
    addressLine1: 'GST Road, Vandalur',
    addressLine2: 'Near Arignar Anna Zoological Park',
    city: 'Chengalpattu',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '600048',
    institutionType: 'Private',
    universityAffiliated: false,
    affiliatedUniversityName: 'Deemed to be University',
    autonomous: true,
    naacGrade: 'A+',
    principalName: 'Dr. A. Peer Mohamed',
    coordinatorName: 'Dr. S. Vasanth',
    coordinatorDesignation: 'Director of Innovation & Incubation',
    coordinatorPhone: '+91 97900 87654',
    coordinatorEmail: 'innovation@crescent.education',
    websiteUrl: 'https://crescent.education',
    username: 'crescent_admin',
    status: 'Active',
    selectedProjectId: 'PRJ-DST-003'
  },
  {
    id: 'inst-004',
    name: 'Karpaga Vinayaga College of Engineering and Technology',
    shortName: 'KVCET',
    code: 'INST-CPT-7103',
    addressLine1: 'GST Road, Chinna Kolambakkam',
    addressLine2: 'Palayanoor Post, Maduranthakam Taluk',
    city: 'Chengalpattu',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '603308',
    institutionType: 'Private',
    universityAffiliated: true,
    affiliatedUniversityName: 'Anna University, Chennai',
    autonomous: true,
    naacGrade: 'A',
    principalName: 'Dr. P. Kasinatha Pandian',
    coordinatorName: 'Dr. P. Karthikeyan',
    coordinatorDesignation: 'Dean, Research and Development',
    coordinatorPhone: '+91 94862 33441',
    coordinatorEmail: 'rnd@kveg.in',
    websiteUrl: 'https://kveg.in',
    username: 'kvcet_admin',
    status: 'Active',
    selectedProjectId: undefined
  },
  {
    id: 'inst-005',
    name: 'Asan Memorial College of Engineering and Technology',
    shortName: 'AMCET',
    code: 'INST-CPT-7104',
    addressLine1: 'Asan Nagar, Oragadam Road',
    addressLine2: 'Thirukalukundram',
    city: 'Chengalpattu',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '603105',
    institutionType: 'Private',
    universityAffiliated: true,
    affiliatedUniversityName: 'Anna University, Chennai',
    autonomous: false,
    naacGrade: 'A',
    principalName: 'Dr. R. Kannan',
    coordinatorName: 'Dr. M. Soundarrajan',
    coordinatorDesignation: 'Head, Center for IoT Innovations',
    coordinatorPhone: '+91 98422 11223',
    coordinatorEmail: 'iot-center@asanengg.ac.in',
    websiteUrl: 'https://asanengg.ac.in',
    username: 'amcet_admin',
    status: 'Pending',
    registeredAt: '2026-09-28T14:30:00Z',
    selectedProjectId: undefined
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'men-001',
    fullName: 'Dr. Rajeshwari Krishnan',
    designation: 'Principal Systems Architect & Smart City Lead',
    organization: 'Robert Bosch Engineering and Business Solutions',
    email: 'rajeshwari.krishnan@bosch.com',
    mobileNumber: '+91 98401 23456',
    expertise: ['IoT', 'Embedded', 'AI/ML', 'Hardware'],
    yearsOfExperience: 14,
    linkedInProfile: 'https://linkedin.com/in/rajeshwari-bosch',
    resumeFileName: 'Rajeshwari_Krishnan_CV.pdf',
    username: 'mentor_rajeshwari',
    status: 'Active',
    assignedProjectIds: ['PRJ-DST-001']
  },
  {
    id: 'men-002',
    fullName: 'Anand Natarajan',
    designation: 'Senior Vice President of Embedded Systems',
    organization: 'L&T Technology Services',
    email: 'anand.natarajan@ltts.com',
    mobileNumber: '+91 97890 12345',
    expertise: ['Hardware', 'Embedded', 'Cybersecurity'],
    yearsOfExperience: 18,
    linkedInProfile: 'https://linkedin.com/in/anand-ltts',
    resumeFileName: 'Anand_Natarajan_Profile.pdf',
    username: 'mentor_anand',
    status: 'Active',
    assignedProjectIds: ['PRJ-DST-003']
  },
  {
    id: 'men-003',
    fullName: 'Preethi Subramanian',
    designation: 'Staff AI/ML Research Engineer',
    organization: 'Zoho Corporation',
    email: 'preethi.s@zoho.com',
    mobileNumber: '+91 99402 34567',
    expertise: ['AI/ML', 'Software', 'Data Science'],
    yearsOfExperience: 9,
    linkedInProfile: 'https://linkedin.com/in/preethi-zoho',
    resumeFileName: 'Preethi_S_Resume.pdf',
    username: 'mentor_preethi',
    status: 'Active',
    assignedProjectIds: ['PRJ-DST-002']
  },
  {
    id: 'men-004',
    fullName: 'Dr. Vikramaditya Sen',
    designation: 'Chief Agritech Officer',
    organization: 'National Agro-Telemetry Systems',
    email: 'vikram.sen@agrotelemetry.in',
    mobileNumber: '+91 94451 98765',
    expertise: ['Agriculture', 'IoT', 'Hardware'],
    yearsOfExperience: 16,
    linkedInProfile: 'https://linkedin.com/in/vikram-agrotech',
    resumeFileName: 'Dr_Vikramaditya_Sen.pdf',
    username: 'mentor_vikram',
    status: 'Active',
    assignedProjectIds: []
  },
  {
    id: 'men-005',
    fullName: 'Senthil Kumar Balakrishnan',
    designation: 'Principal Edge AI Architect',
    organization: 'Intel India Technologies',
    email: 'senthil.k@intel.com',
    mobileNumber: '+91 98410 54321',
    expertise: ['AI/ML', 'Embedded', 'Hardware'],
    yearsOfExperience: 12,
    linkedInProfile: 'https://linkedin.com/in/senthil-intel',
    resumeFileName: 'Senthil_Kumar_CV.pdf',
    username: 'mentor_senthil',
    status: 'Pending',
    registeredAt: '2026-09-28T16:15:00Z',
    assignedProjectIds: []
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-DST-001',
    title: 'AI-Powered Municipal Solid Waste Segregation & Route Optimization',
    department: 'Municipal Administration',
    sector: 'Urban Governance',
    duration: '6 Months',
    technologyCategory: 'Hybrid',
    description: 'Chengalpattu District generates over 950 metric tonnes of municipal solid waste daily across major transit and commercial corridors along GST Road, Maraimalai Nagar, and Tambaram-Chengalpattu highway. Current collection vehicle routing operates on fixed time schedules rather than demand or fill-level urgency, leading to bin overflows in key commercial zones and unnecessary fuel burn. The district requires a combined IoT smart ultrasonic bin telemetry device coupled with an AI dynamic route optimization server for municipal compactor trucks.',
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
    requiredSkills: ['Embedded C', 'Python / PyTorch', 'React / TypeScript', 'IoT Hardware', 'GPS Telemetry'],
    referenceDocuments: [
      { title: 'District Municipal Solid Waste Audit Report 2025.pdf', type: 'PDF', url: '#', size: '4.2 MB' },
      { title: 'Tamil Nadu Urban Local Bodies Act & Guidelines.pdf', type: 'PDF', url: '#', size: '2.8 MB' },
      { title: 'Smart Cities Mission IoT Architecture Specs', type: 'URL', url: 'https://smartcities.gov.in', size: 'Web' }
    ],
    attachments: [
      { name: 'Chengalpattu_Bin_Coordinates_GIS_Dataset.geojson', size: '1.4 MB', type: 'GeoJSON' },
      { name: 'Municipal_Vehicle_Specs_Sheet.pdf', size: '850 KB', type: 'PDF' }
    ],
    status: 'In Progress',
    selectedByInstitutionId: 'inst-001',
    selectedByInstitutionName: 'SRM Institute of Science and Technology',
    assignedMentorId: 'men-001',
    assignedMentorName: 'Dr. Rajeshwari Krishnan',
    team: {
      id: 'team-001',
      projectId: 'PRJ-DST-001',
      institutionId: 'inst-001',
      createdAt: '2026-02-15',
      students: [
        {
          id: 'stu-1',
          fullName: 'Karthik Subramanian',
          registerNumber: '710022104018',
          department: 'Computer Science and Engineering',
          year: '3rd Year',
          email: 'karthik.s@psgtech.edu',
          mobileNumber: '+91 98401 11223',
          isLeader: true
        },
        {
          id: 'stu-2',
          fullName: 'Divya Ramachandran',
          registerNumber: '710022104012',
          department: 'Electronics and Communication',
          year: '3rd Year',
          email: 'divya.r@psgtech.edu',
          mobileNumber: '+91 98402 33445',
          isLeader: false
        },
        {
          id: 'stu-3',
          fullName: 'Gowtham Balakrishnan',
          registerNumber: '710022104025',
          department: 'Robotics and Automation',
          year: '3rd Year',
          email: 'gowtham.b@psgtech.edu',
          mobileNumber: '+91 98403 55667',
          isLeader: false
        },
        {
          id: 'stu-4',
          fullName: 'Sruthi Narayanan',
          registerNumber: '710022104044',
          department: 'Information Technology',
          year: '3rd Year',
          email: 'sruthi.n@psgtech.edu',
          mobileNumber: '+91 98404 77889',
          isLeader: false
        }
      ]
    },
    milestones: [
      {
        id: 1,
        name: 'Milestone 1 – Initial Documentation',
        description: 'Upload Requirement Analysis, Literature Survey, and Problem Understanding.',
        requiredDocuments: ['Requirement Analysis', 'Literature Survey', 'Problem Understanding'],
        startDate: '2026-02-18',
        deadlineDate: '2026-03-05',
        status: 'Approved',
        submissionTitle: 'Initial Systems Architecture & Field Audit for Waste Nodes',
        submissionDescription: 'Completed comprehensive baseline survey of 45 test bins across RS Puram and collected field sensor calibration specifications.',
        submissionDate: '2026-03-02',
        uploadedFiles: [
          { category: 'Requirement Analysis', fileName: 'Chengalpattu_Waste_Requirement_Analysis_v1.pdf', fileSize: '2.4 MB', uploadedAt: '2026-03-02' },
          { category: 'Literature Survey', fileName: 'Literature_Survey_IoT_Waste_Management.pdf', fileSize: '1.8 MB', uploadedAt: '2026-03-02' },
          { category: 'Problem Understanding', fileName: 'Field_Survey_And_Problem_Understanding.pdf', fileSize: '3.1 MB', uploadedAt: '2026-03-02' }
        ],
        reviewComments: 'Thorough literature survey and well-articulated field constraints. The LoRaWAN frequency band considerations are well aligned with TEC guidelines.',
        reviewedAt: '2026-03-06',
        reviewedBy: 'Super Admin'
      },
      {
        id: 2,
        name: 'Milestone 2 – Development Progress',
        description: 'Upload Design, Architecture, Prototype, and Progress Report.',
        requiredDocuments: ['Design', 'Architecture', 'Prototype', 'Progress Report'],
        startDate: '2026-03-08',
        deadlineDate: '2026-04-10',
        status: 'Submitted',
        submissionTitle: 'Hardware Prototype PCB & Dynamic Dispatch Routing Engine',
        submissionDescription: 'Engineered breadboard and custom PCB running ESP32 with ultrasonic sensor array. Developed Dijkstra-based dispatch algorithm tested against 12 municipal compactor routes.',
        submissionDate: '2026-04-02',
        uploadedFiles: [
          { category: 'Design', fileName: 'PCB_Schematics_and_Enclosure_3D.step', fileSize: '5.2 MB', uploadedAt: '2026-04-02' },
          { category: 'Architecture', fileName: 'Microservices_Architecture_WasteDispatch.pdf', fileSize: '2.1 MB', uploadedAt: '2026-04-02' },
          { category: 'Prototype', fileName: 'Bench_Test_Sensor_Readings_Telemetry.mp4', fileSize: '18.4 MB', uploadedAt: '2026-04-02' },
          { category: 'Progress Report', fileName: 'Midterm_Progress_Report_PSGTech.pdf', fileSize: '3.6 MB', uploadedAt: '2026-04-02' }
        ]
      },
      {
        id: 3,
        name: 'Milestone 3 – Final Submission',
        description: 'Upload Final Report, Source Code, Presentation, and Demo Video.',
        requiredDocuments: ['Final Report', 'Source Code', 'Presentation', 'Demo Video'],
        startDate: '2026-04-15',
        deadlineDate: '2026-05-20',
        status: 'Draft'
      }
    ]
  },
  {
    id: 'PRJ-DST-002',
    title: 'Rural Primary Health Center (PHC) Tele-Triage & Cold-Chain Vaccine Guardian',
    department: 'Public Health',
    sector: 'Healthcare Systems',
    duration: '4 Months',
    technologyCategory: 'Hardware',
    description: 'Rural healthcare centers across Anaimalai and Valparai hill tracts face intermittent grid power and unreliable vaccine temperature maintenance. The District Health Office requires an autonomous solar-buffered vaccine cold box monitor with tamper-evident cellular telemetry and instant SMS emergency escalations to the Medical Officer when temperature drifts outside +2°C to +8°C.',
    objectives: [
      'Engineer sub-zero calibrated dual thermal sensor logger with 72-hour lithium backup',
      'Provide AES-128 cryptographically signed temperature log chain to prevent audit falsification',
      'Integrate automated GSM voice-call and SMS alerts to the on-duty Medical Officer'
    ],
    expectedDeliverables: [
      'Certified calibrated hardware logger board',
      'Web-based district cold-chain dashboard with battery and thermal health index',
      'Automated PDF compliance certificate generation for regulatory health inspectors'
    ],
    requiredSkills: ['Hardware Design', 'Embedded C', 'GSM / GPRS Modems', 'Microcontrollers', 'Python'],
    referenceDocuments: [
      { title: 'WHO Cold Chain Equipment Guidelines E003.pdf', type: 'PDF', url: '#', size: '3.7 MB' },
      { title: 'District Rural PHC Inventory Matrix 2025.xlsx', type: 'Document', url: '#', size: '920 KB' }
    ],
    attachments: [
      { name: 'PHC_Locations_and_Cellular_Coverage.csv', size: '420 KB', type: 'CSV' }
    ],
    status: 'Available',
    milestones: [
      {
        id: 1,
        name: 'Milestone 1 – Initial Documentation',
        description: 'Upload Requirement Analysis, Literature Survey, and Problem Understanding.',
        requiredDocuments: ['Requirement Analysis', 'Literature Survey', 'Problem Understanding'],
        startDate: '2026-04-01',
        deadlineDate: '2026-04-20',
        status: 'Draft'
      },
      {
        id: 2,
        name: 'Milestone 2 – Development Progress',
        description: 'Upload Design, Architecture, Prototype, and Progress Report.',
        requiredDocuments: ['Design', 'Architecture', 'Prototype', 'Progress Report'],
        startDate: '2026-04-22',
        deadlineDate: '2026-05-25',
        status: 'Draft'
      },
      {
        id: 3,
        name: 'Milestone 3 – Final Submission',
        description: 'Upload Final Report, Source Code, Presentation, and Demo Video.',
        requiredDocuments: ['Final Report', 'Source Code', 'Presentation', 'Demo Video'],
        startDate: '2026-05-28',
        deadlineDate: '2026-06-30',
        status: 'Draft'
      }
    ]
  },
  {
    id: 'PRJ-DST-003',
    title: 'Canal Sluice Automation & Tail-End Farmer Soil Moisture Telemetry',
    department: 'Agriculture & Irrigation',
    sector: 'Agritech',
    duration: '6 Months',
    technologyCategory: 'Embedded',
    description: 'In the Parambikulam Aliyar Project (PAP) canal command area, tail-end farmers frequently experience acute water deficits while head-end distributaries over-irrigate. This project deploys solar-powered motorized gate actuators linked to subterranean capacitive soil moisture sensors along farmer field channels, ensuring algorithmic equitable water distribution based on crop stage moisture thresholds.',
    objectives: [
      'Develop ruggedized solar gate stepper motor controller with manual override safety clutch',
      'Deploy low-power multi-depth soil moisture nodes with 5km sub-GHz radio transmission',
      'Create bilingual Tamil/English mobile responsive portal for water distribution schedules'
    ],
    expectedDeliverables: [
      'Field-proven motorized sluice gate actuator module',
      'Water ledger database recording volumetric acre-feet flow per canal branch',
      'Farmer advisory broadcast subsystem via Voice SMS'
    ],
    requiredSkills: ['Embedded Systems', 'Motor Control', 'Radio Frequency / LoRa', 'Cloud Backend', 'Tamil Localization'],
    referenceDocuments: [
      { title: 'PWD Irrigation Rules & Sluice Gate Mechanics.pdf', type: 'PDF', url: '#', size: '5.1 MB' },
      { title: 'Agronomic Water Requirements for Cotton & Coconut.pdf', type: 'PDF', url: '#', size: '2.4 MB' }
    ],
    attachments: [
      { name: 'PAP_Canal_Elevation_Profile.dwg', size: '6.4 MB', type: 'CAD' }
    ],
    status: 'Completed',
    selectedByInstitutionId: 'inst-003',
    selectedByInstitutionName: 'Kumaraguru College of Technology',
    assignedMentorId: 'men-002',
    assignedMentorName: 'Anand Natarajan',
    completionDate: '2026-03-24',
    team: {
      id: 'team-003',
      projectId: 'PRJ-DST-003',
      institutionId: 'inst-003',
      createdAt: '2025-10-10',
      students: [
        {
          id: 'stu-kct-1',
          fullName: 'Aravind Venkatraman',
          registerNumber: '710222106005',
          department: 'Mechatronics Engineering',
          year: '4th Year',
          email: 'aravind.v@kct.ac.in',
          mobileNumber: '+91 97900 11224',
          isLeader: true
        },
        {
          id: 'stu-kct-2',
          fullName: 'Nivetha Sundaram',
          registerNumber: '710222106019',
          department: 'Electronics & Instrumentation',
          year: '4th Year',
          email: 'nivetha.s@kct.ac.in',
          mobileNumber: '+91 97900 33446',
          isLeader: false
        },
        {
          id: 'stu-kct-3',
          fullName: 'Manojkumar Selvan',
          registerNumber: '710222106031',
          department: 'Agricultural Engineering',
          year: '4th Year',
          email: 'manoj.s@kct.ac.in',
          mobileNumber: '+91 97900 55668',
          isLeader: false
        }
      ]
    },
    milestones: [
      {
        id: 1,
        name: 'Milestone 1 – Initial Documentation',
        description: 'Upload Requirement Analysis, Literature Survey, and Problem Understanding.',
        requiredDocuments: ['Requirement Analysis', 'Literature Survey', 'Problem Understanding'],
        startDate: '2025-10-15',
        deadlineDate: '2025-11-15',
        status: 'Approved',
        submissionTitle: 'Canal Hydraulic Study and Sluice Mechanization Blueprint',
        submissionDescription: 'Analyzed discharge coefficients across 6 distributary outlets and conducted soil profile analysis.',
        submissionDate: '2025-11-10',
        uploadedFiles: [
          { category: 'Requirement Analysis', fileName: 'PAP_Sluice_Requirements.pdf', fileSize: '2.9 MB', uploadedAt: '2025-11-10' },
          { category: 'Literature Survey', fileName: 'Canal_Automation_Survey.pdf', fileSize: '1.7 MB', uploadedAt: '2025-11-10' },
          { category: 'Problem Understanding', fileName: 'Farmer_Deficit_Field_Report.pdf', fileSize: '3.4 MB', uploadedAt: '2025-11-10' }
        ],
        reviewComments: 'Excellent mathematical modeling of water delivery times and comprehensive farmer survey.',
        reviewedAt: '2025-11-18',
        reviewedBy: 'Super Admin'
      },
      {
        id: 2,
        name: 'Milestone 2 – Development Progress',
        description: 'Upload Design, Architecture, Prototype, and Progress Report.',
        requiredDocuments: ['Design', 'Architecture', 'Prototype', 'Progress Report'],
        startDate: '2025-11-20',
        deadlineDate: '2026-01-20',
        status: 'Approved',
        submissionTitle: 'Actuator Drive Assembly and Sub-GHz Soil Nodes',
        submissionDescription: 'Fabricated high-torque planetary gearbox actuator with IP68 waterproof motor casing. Bench tested radio range up to 4.8km line-of-sight.',
        submissionDate: '2026-01-14',
        uploadedFiles: [
          { category: 'Design', fileName: 'Actuator_Mechanical_Drawing.pdf', fileSize: '4.6 MB', uploadedAt: '2026-01-14' },
          { category: 'Architecture', fileName: 'LoRa_Mesh_Telemetry_Architecture.pdf', fileSize: '1.9 MB', uploadedAt: '2026-01-14' },
          { category: 'Prototype', fileName: 'Canal_Water_Testing_Video.mp4', fileSize: '24.2 MB', uploadedAt: '2026-01-14' },
          { category: 'Progress Report', fileName: 'Milestone2_KCT_Progress.pdf', fileSize: '3.1 MB', uploadedAt: '2026-01-14' }
        ],
        reviewComments: 'Field prototype successfully withstood water surges. Motor driver isolation circuitry conforms to industrial standards.',
        reviewedAt: '2026-01-22',
        reviewedBy: 'Super Admin'
      },
      {
        id: 3,
        name: 'Milestone 3 – Final Submission',
        description: 'Upload Final Report, Source Code, Presentation, and Demo Video.',
        requiredDocuments: ['Final Report', 'Source Code', 'Presentation', 'Demo Video'],
        startDate: '2026-02-01',
        deadlineDate: '2026-03-20',
        status: 'Approved',
        submissionTitle: 'Complete Deployment Report & Open-Source Sluice Gateway',
        submissionDescription: 'Field deployed at Distributary #4 for 45 continuous days. Resulted in 34% reduction in tail-end crop moisture distress events.',
        submissionDate: '2026-03-18',
        uploadedFiles: [
          { category: 'Final Report', fileName: 'Final_PAP_Sluice_Automation_Report.pdf', fileSize: '8.4 MB', uploadedAt: '2026-03-18' },
          { category: 'Source Code', fileName: 'PAP_Sluice_Firmware_and_Cloud.zip', fileSize: '14.1 MB', uploadedAt: '2026-03-18' },
          { category: 'Presentation', fileName: 'Collectorate_District_Presentation.pdf', fileSize: '5.6 MB', uploadedAt: '2026-03-18' },
          { category: 'Demo Video', fileName: 'Live_Sluice_Operation_Farmer_Testimonial.mp4', fileSize: '42.0 MB', uploadedAt: '2026-03-18' }
        ],
        reviewComments: 'Outstanding project! Direct societal benefit demonstrated with tail-end farmers. Final documentation approved without conditions. Certificates issued.',
        reviewedAt: '2026-03-24',
        reviewedBy: 'Super Admin'
      }
    ]
  },
  {
    id: 'PRJ-DST-004',
    title: 'Intelligent Real-Time Traffic Light Preemption for Emergency Ambulances',
    department: 'Transportation & Traffic',
    sector: 'Smart Infrastructure',
    duration: '4 Months',
    technologyCategory: 'Software',
    description: 'Heavy congestion along the GST Road and Chengalpattu bypass corridors delays 108 Emergency Ambulances accessing Chengalpattu Government Medical College & Hospital. An intelligent cellular vehicle-to-infrastructure (C-V2X) cloud backend is needed to grant adaptive green corridors to verified ambulances based on live navigation vectors and distance thresholds.',
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
    requiredSkills: ['Node.js / Express', 'WebSockets', 'OpenStreetMap / Routing', 'Traffic Signal Control Logic', 'Flutter/React Native'],
    referenceDocuments: [
      { title: 'Chengalpattu District Traffic Police Signal Spec Sheet.pdf', type: 'PDF', url: '#', size: '2.1 MB' }
    ],
    attachments: [
      { name: 'Junction_Controller_Protocol_Manual.pdf', size: '1.2 MB', type: 'PDF' }
    ],
    status: 'Available',
    milestones: [
      {
        id: 1,
        name: 'Milestone 1 – Initial Documentation',
        description: 'Upload Requirement Analysis, Literature Survey, and Problem Understanding.',
        requiredDocuments: ['Requirement Analysis', 'Literature Survey', 'Problem Understanding'],
        startDate: '2026-04-05',
        deadlineDate: '2026-04-30',
        status: 'Draft'
      },
      {
        id: 2,
        name: 'Milestone 2 – Development Progress',
        description: 'Upload Design, Architecture, Prototype, and Progress Report.',
        requiredDocuments: ['Design', 'Architecture', 'Prototype', 'Progress Report'],
        startDate: '2026-05-05',
        deadlineDate: '2026-06-15',
        status: 'Draft'
      },
      {
        id: 3,
        name: 'Milestone 3 – Final Submission',
        description: 'Upload Final Report, Source Code, Presentation, and Demo Video.',
        requiredDocuments: ['Final Report', 'Source Code', 'Presentation', 'Demo Video'],
        startDate: '2026-06-20',
        deadlineDate: '2026-07-30',
        status: 'Draft'
      }
    ]
  },
  {
    id: 'PRJ-DST-005',
    title: 'Micro-Hydro and Solar Hybrid Microgrid Telemetry for Tribal Hamlets',
    department: 'Renewable Energy',
    sector: 'Clean Energy',
    duration: '6 Months',
    technologyCategory: 'Hardware',
    description: 'Off-grid tribal settlements in Topslip and Pollachi forest areas rely on 5kW decentralized micro-hydro and solar installations. Inverters frequently trip during monsoons, leaving settlements without power for weeks before technicians can visit. The District Administration seeks a rugged satellite/cellular hybrid telemetry logger to monitor battery state-of-charge, inverter frequency, and water head pressure.',
    objectives: [
      'Design ultra-low quiescent power battery state-of-charge analyzer for 48V LiFePO4 banks',
      'Provide bi-directional remote reset relay for inverter brownout recovery',
      'Render district-wide energy generation vs consumption analytics dashboard'
    ],
    expectedDeliverables: [
      'Ruggedized enclosure unit with IP66 rating and lightning surge protection',
      'District Collector energy monitoring dashboard',
      'Predictive maintenance alert subsystem for turbine bearing wear'
    ],
    requiredSkills: ['Power Electronics', 'Renewable Energy', 'PCB Design', 'Embedded Firmware', 'Data Telemetry'],
    referenceDocuments: [
      { title: 'TEDA Offgrid Renewable Energy Standards.pdf', type: 'PDF', url: '#', size: '3.3 MB' }
    ],
    attachments: [
      { name: 'Micro_Hydro_Turbine_Drawings.pdf', size: '2.5 MB', type: 'PDF' }
    ],
    status: 'Available',
    milestones: [
      {
        id: 1,
        name: 'Milestone 1 – Initial Documentation',
        description: 'Upload Requirement Analysis, Literature Survey, and Problem Understanding.',
        requiredDocuments: ['Requirement Analysis', 'Literature Survey', 'Problem Understanding'],
        startDate: '2026-04-10',
        deadlineDate: '2026-05-10',
        status: 'Draft'
      },
      {
        id: 2,
        name: 'Milestone 2 – Development Progress',
        description: 'Upload Design, Architecture, Prototype, and Progress Report.',
        requiredDocuments: ['Design', 'Architecture', 'Prototype', 'Progress Report'],
        startDate: '2026-05-15',
        deadlineDate: '2026-06-25',
        status: 'Draft'
      },
      {
        id: 3,
        name: 'Milestone 3 – Final Submission',
        description: 'Upload Final Report, Source Code, Presentation, and Demo Video.',
        requiredDocuments: ['Final Report', 'Source Code', 'Presentation', 'Demo Video'],
        startDate: '2026-07-01',
        deadlineDate: '2026-08-15',
        status: 'Draft'
      }
    ]
  },
  {
    id: 'PRJ-DST-006',
    title: 'District School Mid-Day Meal Quality & Nutrition Traceability System',
    department: 'Rural Development',
    sector: 'Healthcare Systems',
    duration: '3 Months',
    technologyCategory: 'Software',
    description: 'Tracking daily raw ingredient stock, kitchen sanitation logs, and meal consumption across 1,140 government primary schools across the district. A simple offline-first mobile web portal with image verification of cooked meals and barcode inventory tracking is needed for block educational officers.',
    objectives: [
      'Develop progressive offline-capable web application for school headmasters',
      'Automate daily nutritional value calculation based on standard grain and vegetable weights',
      'Provide SMS alert system for schools with stock levels falling below 3-day buffer'
    ],
    expectedDeliverables: [
      'PWA compatible with low-end Android mobile devices',
      'Block Education Officer administrative approval panel',
      'Automated monthly procurement reconciliation report'
    ],
    requiredSkills: ['React', 'IndexedDB / Offline Storage', 'Tailwind CSS', 'REST API', 'Node.js'],
    referenceDocuments: [
      { title: 'PM POSHAN Nutrition Norms & Guidelines.pdf', type: 'PDF', url: '#', size: '1.9 MB' }
    ],
    attachments: [
      { name: 'School_Dietary_Menu_Schedule.csv', size: '180 KB', type: 'CSV' }
    ],
    status: 'Available',
    milestones: [
      {
        id: 1,
        name: 'Milestone 1 – Initial Documentation',
        description: 'Upload Requirement Analysis, Literature Survey, and Problem Understanding.',
        requiredDocuments: ['Requirement Analysis', 'Literature Survey', 'Problem Understanding'],
        startDate: '2026-04-01',
        deadlineDate: '2026-04-20',
        status: 'Draft'
      },
      {
        id: 2,
        name: 'Milestone 2 – Development Progress',
        description: 'Upload Design, Architecture, Prototype, and Progress Report.',
        requiredDocuments: ['Design', 'Architecture', 'Prototype', 'Progress Report'],
        startDate: '2026-04-25',
        deadlineDate: '2026-05-25',
        status: 'Draft'
      },
      {
        id: 3,
        name: 'Milestone 3 – Final Submission',
        description: 'Upload Final Report, Source Code, Presentation, and Demo Video.',
        requiredDocuments: ['Final Report', 'Source Code', 'Presentation', 'Demo Video'],
        startDate: '2026-06-01',
        deadlineDate: '2026-07-05',
        status: 'Draft'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'Milestone Approved',
    title: 'Milestone 1 Approved by Super Admin',
    message: 'Your Milestone 1 (Initial Documentation) for "AI-Powered Municipal Solid Waste Segregation & Route Optimization" has been approved. You may proceed to Milestone 2.',
    recipientRole: 'institution',
    recipientId: 'inst-001',
    read: false,
    createdAt: '2026-03-06 14:32',
    emailDispatched: true,
    projectId: 'PRJ-DST-001'
  },
  {
    id: 'notif-002',
    type: 'Deadline Approaching',
    title: 'Reminder: Milestone 2 Deadline Approaching',
    message: 'Milestone 2 (Development Progress) submission deadline is in 7 days (2026-04-10). Please ensure all required documents and prototype evidence are submitted.',
    recipientRole: 'institution',
    recipientId: 'inst-001',
    read: false,
    createdAt: '2026-04-03 09:00',
    emailDispatched: true,
    projectId: 'PRJ-DST-001'
  },
  {
    id: 'notif-003',
    type: 'Certificate Generated',
    title: 'Project Completed & Certificates Issued',
    message: 'Congratulations! All 3 milestones for "Canal Sluice Automation & Tail-End Farmer Soil Moisture Telemetry" have been verified and approved. Institution and Student certificates are now available for download.',
    recipientRole: 'institution',
    recipientId: 'inst-003',
    read: true,
    createdAt: '2026-03-24 16:45',
    emailDispatched: true,
    projectId: 'PRJ-DST-003'
  },
  {
    id: 'notif-004',
    type: 'Project Assigned',
    title: 'Project Assigned to PSG College of Technology',
    message: 'Project "AI-Powered Municipal Solid Waste Segregation & Route Optimization" has been successfully blocked and assigned to PSG College of Technology.',
    recipientRole: 'institution',
    recipientId: 'inst-001',
    read: true,
    createdAt: '2026-02-15 11:20',
    emailDispatched: true,
    projectId: 'PRJ-DST-001'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    userAction: 'Project Creation',
    timestamp: '2026-01-10 10:15:22',
    ipAddress: '192.168.1.104',
    previousValue: 'None',
    newValue: 'PRJ-DST-001 Created (Municipal Admin)',
    performedBy: 'Super Admin (Collectorate IT Cell)',
    details: 'New district problem statement PRJ-DST-001 uploaded and published to portal.'
  },
  {
    id: 'audit-002',
    userAction: 'Login',
    timestamp: '2026-02-15 09:41:10',
    ipAddress: '14.139.186.2',
    previousValue: 'Logged Out',
    newValue: 'Session Active',
    performedBy: 'Institution: PSG College of Technology',
    details: 'Successful credential & MFA verification.'
  },
  {
    id: 'audit-003',
    userAction: 'Milestone Reviews',
    timestamp: '2026-03-06 14:30:00',
    ipAddress: '192.168.1.104',
    previousValue: 'Status: Submitted',
    newValue: 'Status: Approved',
    performedBy: 'Super Admin',
    details: 'Milestone 1 reviewed and approved for PRJ-DST-001.'
  },
  {
    id: 'audit-004',
    userAction: 'Certificate Generation',
    timestamp: '2026-03-24 16:40:15',
    ipAddress: '192.168.1.104',
    previousValue: 'Pending Completion',
    newValue: 'Certificates Generated (Inst + 3 Students)',
    performedBy: 'Super Admin / System Engine',
    details: 'Generated Institution & Student Certificates for PRJ-DST-003 following Milestone 3 approval.'
  },
  {
    id: 'audit-005',
    userAction: 'Project Updates',
    timestamp: '2026-03-25 11:05:44',
    ipAddress: '192.168.1.104',
    previousValue: 'Status: In Progress',
    newValue: 'Status: Completed',
    performedBy: 'Super Admin',
    details: 'Updated PRJ-DST-003 status to Completed.'
  }
];

export const INITIAL_FEEDBACK: MentorFeedback[] = [
  {
    id: 'fb-001',
    projectId: 'PRJ-DST-001',
    milestoneId: 1,
    mentorId: 'men-001',
    mentorName: 'Dr. Rajeshwari Krishnan',
    feedback: 'The team demonstrated solid understanding of urban solid waste segregation dynamics. Sensor placement inside metallic dumpsters requires careful RF antenna positioning to avoid signal attenuation.',
    recommendations: 'Recommend testing external dome antenna with IP67 connector rather than internal PCB trace antenna. Review LoRaWAN Duty Cycle restrictions in India (865-867 MHz).',
    submittedAt: '2026-03-04 18:20'
  },
  {
    id: 'fb-002',
    projectId: 'PRJ-DST-001',
    milestoneId: 2,
    mentorId: 'men-001',
    mentorName: 'Dr. Rajeshwari Krishnan',
    feedback: 'Prototype power management circuit is functional. The sleep current of 18uA during idle periods meets the 1-year battery life target.',
    recommendations: 'Add TVS diodes on sensor line inputs to guard against static charge buildup during dry summer windy days.',
    submittedAt: '2026-04-03 11:15'
  }
];

export const INITIAL_INDUSTRIES: import('../types').Industry[] = [
  {
    id: 'ind-001',
    name: 'Larsen & Toubro Heavy Engineering Ltd.',
    sector: 'Heavy Manufacturing & Defense',
    cinNumber: 'L99999MH1946PLC004768',
    representativeName: 'Er. R. Sundaralingam',
    designation: 'Vice President, Industrial Automation',
    email: 'automation.r_d@lntecc.com',
    phone: '+91 44 2252 6000',
    address: 'L&T Campus, Mount Poonamallee Road, Manapakkam, Chennai - 600089',
    websiteUrl: 'https://www.larsentoubro.com',
    status: 'Approved',
    registeredAt: '2026-01-15T10:00:00Z',
    approvedAt: '2026-01-18T14:30:00Z'
  },
  {
    id: 'ind-002',
    name: 'Hyundai Motor India Engineering R&D Center',
    sector: 'Automotive & Autonomous Systems',
    cinNumber: 'U34101TN1996PLC035418',
    representativeName: 'Dr. K. Jayachandran',
    designation: 'Head of Advanced Vehicle Electronics',
    email: 'rd-innovations@hyundai.co.in',
    phone: '+91 44 4710 0000',
    address: 'Irungattukottai Industrial Corridor, Sriperumbudur - Chengalpattu Border',
    websiteUrl: 'https://www.hyundai.com/in',
    status: 'Approved',
    registeredAt: '2026-01-20T09:30:00Z',
    approvedAt: '2026-01-22T16:00:00Z'
  },
  {
    id: 'ind-003',
    name: 'Zoho Corporation Civic Technologies Division',
    sector: 'Civic Software & Cloud Systems',
    cinNumber: 'U72900TN2010PTC078458',
    representativeName: 'Ms. Priyadarshini Balaji',
    designation: 'Director, Public Sector Initiatives',
    email: 'civic-tech@zohocorp.com',
    phone: '+91 44 6744 7000',
    address: 'Estancia IT Park, Vallancheri, GST Road, Chengalpattu - 603202',
    websiteUrl: 'https://www.zoho.com',
    status: 'Approved',
    registeredAt: '2026-02-01T11:00:00Z',
    approvedAt: '2026-02-03T10:15:00Z'
  },
  {
    id: 'ind-004',
    name: 'Schneider Electric India Smart Grid Cell',
    sector: 'Smart Grid & Renewable Energy',
    cinNumber: 'U31900DL1995PTC068412',
    representativeName: 'Er. S. Venkataramanan',
    designation: 'Principal Architect, Clean Energy',
    email: 'smartgrid.chengalpattu@se.com',
    phone: '+91 44 3918 8000',
    address: 'One Hub Chennai, Kanchipuram-Chengalpattu Industrial Expressway',
    websiteUrl: 'https://www.se.com/in',
    status: 'Approved',
    registeredAt: '2026-02-15T08:45:00Z',
    approvedAt: '2026-02-18T12:00:00Z'
  },
  {
    id: 'ind-005',
    name: 'Murugappa Group Agri-Tech Solutions',
    sector: 'Agritech & Precision Agriculture',
    cinNumber: 'L24211TN1961PLC004595',
    representativeName: 'Dr. Anandhakrishnan N.',
    designation: 'Lead Researcher, Soil & Drone Analytics',
    email: 'agritech.murugappa@coromandel.biz',
    phone: '+91 44 2530 6789',
    address: 'Parry House, Netaji Subhash Chandra Bose Road, Chennai',
    websiteUrl: 'https://www.murugappa.com',
    status: 'Pending',
    registeredAt: '2026-09-25T14:20:00Z'
  },
  {
    id: 'ind-006',
    name: 'Saint-Gobain Research India',
    sector: 'Sustainable Materials & Smart Glass',
    cinNumber: 'U26102TN1996PTC035728',
    representativeName: 'Dr. Meenakshi Ramanathan',
    designation: 'Research Director, Thermal Insulation',
    email: 'sgri.innovations@saint-gobain.com',
    phone: '+91 44 4710 4000',
    address: 'IIT Madras Research Park & Chengalpattu Pilot Complex',
    websiteUrl: 'https://www.saint-gobain.co.in',
    status: 'Pending',
    registeredAt: '2026-09-29T16:45:00Z'
  },
  {
    id: 'ind-007',
    name: 'Apex BioMedical Devices Pvt Ltd',
    sector: 'Healthcare & IoT Diagnostics',
    cinNumber: 'U33110TN2021PTC142589',
    representativeName: 'Mr. R. Karthick',
    designation: 'Founder & CEO',
    email: 'karthick@apexbio.in',
    phone: '+91 94441 23456',
    address: 'Maraimalai Nagar Industrial Estate, Chengalpattu - 603209',
    websiteUrl: 'https://www.apexbio.in',
    status: 'Rejected',
    registeredAt: '2026-08-10T10:00:00Z',
    rejectionReason: 'Invalid CIN and incomplete GST registration documents for defense collaboration.'
  }
];
