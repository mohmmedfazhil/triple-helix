import { HeroSlide } from '../types';

export const HERO_IMAGE_PRESETS = [
  {
    name: 'B.S. Abdur Rahman Crescent Institute Lab',
    url: '/src/assets/images/crescent_students_lab_1790734118032.jpg',
    caption: 'Student Engineering Laboratory'
  },
  {
    name: 'B.S. Abdur Rahman Crescent Institute Logo Banner',
    url: '/src/assets/images/crescent_banner_1790734494199.jpg',
    caption: 'Official Crescent Institute Crest'
  },
  {
    name: 'Tamil Nadu Field Civic Telemetry',
    url: '/src/assets/images/tn_civic_deployment_1790734508957.jpg',
    caption: 'District Field Deployment'
  },
  {
    name: 'Tamil Nadu Collegiate Workstation',
    url: '/src/assets/images/tn_students_lab_1790733588367.jpg',
    caption: 'Hardware Workstation'
  }
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-01',
    badge: 'TAMIL NADU HIGHER EDUCATION & CIVIC INNOVATION',
    headlineMain: 'Engineering Youth Solving',
    headlineHighlight: 'Real-World Tamil Nadu Challenges',
    description: 'Empowering collegiate engineering talent across Tamil Nadu to apply indigenous AI, IoT, robotics, and embedded systems toward modernizing public administration and community infrastructure.',
    primaryCtaText: 'Register Your Institution →',
    primaryCtaAction: 'register-institution',
    secondaryCtaText: 'Explore Problem Statements',
    secondaryCtaAction: 'browse',
    theme: 'sky',
    category: 'District Governance',
    active: true,
    departmentTag: 'Special Programme Implementation Department · Govt of Tamil Nadu',
    imageUrl: '/src/assets/images/crescent_students_lab_1790734118032.jpg',
    imageAlt: 'B.S. Abdur Rahman Crescent Institute engineering students collaborating in an innovation laboratory'
  },
  {
    id: 'slide-02',
    badge: 'THE TRIPARTITE COLLABORATION FRAMEWORK',
    headlineMain: 'Triple Helix Framework:',
    headlineHighlight: 'Industry · Government · Students',
    description: 'The Triple Helix connects industries, government, and students to transform real-world industry challenges into innovative solutions through hands-on collaboration.',
    primaryCtaText: 'Discover The Triple Helix Model →',
    primaryCtaAction: 'about',
    secondaryCtaText: 'Partner as Industry Mentor',
    secondaryCtaAction: 'register-mentor',
    theme: 'sky',
    category: 'Industry Guidance',
    active: true,
    departmentTag: 'Technical Advisory Council',
    imageUrl: '/src/assets/images/crescent_banner_1790734494199.jpg',
    imageAlt: 'B.S. Abdur Rahman Crescent Institute official emblem and presentation banner'
  },
  {
    id: 'slide-03',
    badge: 'DISTRICT INNOVATION MISSION · CHENGALPATTU',
    headlineMain: 'Bridging Classroom Prototypes to',
    headlineHighlight: 'Statewide Tamil Nadu Deployment',
    description: 'From automated canal telemetry in agriculture to rural healthcare cold-chain loggers, student engineering solutions receive field-testing validation backed by the District Collectorate.',
    primaryCtaText: 'Browse District Problem Statements →',
    primaryCtaAction: 'browse',
    secondaryCtaText: 'Learn About Mission',
    secondaryCtaAction: 'about',
    theme: 'sky',
    category: 'Rural Development',
    active: true,
    departmentTag: 'District Collectorate of Chengalpattu',
    imageUrl: '/src/assets/images/tn_civic_deployment_1790734508957.jpg',
    imageAlt: 'Real-world civic technology deployment in Tamil Nadu agricultural fields'
  }
];

export const AI_HERO_TEMPLATES: Omit<HeroSlide, 'id'>[] = [
  {
    badge: 'Tamil Nadu Engineering Excellence',
    headlineMain: 'Autonomous Urban Utilities &',
    headlineHighlight: 'Civic Telemetry Systems',
    description: 'Collegiate engineering teams deploying LoRaWAN water level telemetry and edge vision systems to assist district municipal corporations.',
    primaryCtaText: 'Explore Projects',
    primaryCtaAction: 'browse',
    secondaryCtaText: 'About Initiative',
    secondaryCtaAction: 'about',
    theme: 'sky',
    category: 'Urban Utilities',
    active: true,
    departmentTag: 'Tamil Nadu Municipal Administration',
    imageUrl: '/src/assets/images/crescent_students_lab_1790734118032.jpg',
    imageAlt: 'Students working with IoT prototypes'
  }
];
