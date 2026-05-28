import type { College } from '../types/college';

export const examOptions = ['JEE Main', 'BITSAT', 'State CET'] as const;

export const mockColleges: College[] = [
  {
    id: 'iiit-bangalore',
    name: 'International Institute of Information Technology Bangalore',
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    state: 'Karnataka',
    feesPerYear: 305000,
    rating: 4.7,
    description:
      'A research-intensive institute with strong industry partnerships, modern labs, and a high placement velocity in software and data roles.',
    highlights: ['Research-led curriculum', 'Strong CS placements', 'Startup ecosystem'],
    tags: ['Engineering', 'Research', 'Tech'],
    imageColor: 'from-slate-900 via-slate-800 to-ink-700',
    courses: [
      { degree: 'B.Tech', specialization: 'Computer Science and Engineering', duration: '4 years', tuition: '3.05 LPA' },
      { degree: 'B.Tech', specialization: 'Electronics and Communication', duration: '4 years', tuition: '3.05 LPA' },
      { degree: 'M.Tech', specialization: 'Data Science', duration: '2 years', tuition: '2.10 LPA' },
    ],
    placements: {
      averagePackageLpa: 28.5,
      highestPackageLpa: 65,
      placementRate: 97,
      topRecruiters: ['Google', 'Microsoft', 'Adobe', 'Razorpay'],
    },
    reviews: [
      { id: 'r1', author: 'Aarav', rating: 5, text: 'Excellent peer group and a very applied curriculum.', date: '2025-11-18' },
      { id: 'r2', author: 'Meera', rating: 4.6, text: 'Placements are consistently strong for the top branches.', date: '2025-12-03' },
    ],
    examCutoffs: {
      'JEE Main': { minRank: 1, maxRank: 3500 },
      BITSAT: { minRank: 1, maxRank: 999999 },
      'State CET': { minRank: 1, maxRank: 1500 },
    },
  },
  {
    id: 'bits-pilani',
    name: 'Birla Institute of Technology and Science Pilani',
    location: 'Pilani, Rajasthan',
    city: 'Pilani',
    state: 'Rajasthan',
    feesPerYear: 425000,
    rating: 4.8,
    description:
      'A premium private university known for flexible academics, strong alumni outcomes, and a nationally recognized brand.',
    highlights: ['Dual degree options', 'Flexible curriculum', 'Premium recruiter mix'],
    tags: ['Engineering', 'Private University', 'High ROI'],
    imageColor: 'from-amber-900 via-stone-800 to-slate-700',
    courses: [
      { degree: 'B.E.', specialization: 'Computer Science', duration: '4 years', tuition: '4.25 LPA' },
      { degree: 'B.E.', specialization: 'Electrical and Electronics', duration: '4 years', tuition: '4.25 LPA' },
      { degree: 'M.Sc.', specialization: 'Economics', duration: '5 years', tuition: '4.25 LPA' },
    ],
    placements: {
      averagePackageLpa: 18.2,
      highestPackageLpa: 60,
      placementRate: 96,
      topRecruiters: ['Amazon', 'Google', 'Intel', 'Goldman Sachs'],
    },
    reviews: [
      { id: 'r3', author: 'Rishi', rating: 4.8, text: 'The peer quality and freedom to explore are the biggest positives.', date: '2025-10-12' },
      { id: 'r4', author: 'Nidhi', rating: 4.7, text: 'Placement support is solid if you are proactive.', date: '2025-12-08' },
    ],
    examCutoffs: {
      'JEE Main': { minRank: 1, maxRank: 1500 },
      BITSAT: { minRank: 1, maxRank: 2800 },
      'State CET': { minRank: 1, maxRank: 999999 },
    },
  },
  {
    id: 'coep-pune',
    name: 'College of Engineering Pune',
    location: 'Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    feesPerYear: 145000,
    rating: 4.4,
    description:
      'A legacy engineering institute with a strong public reputation, solid placements, and excellent value for money.',
    highlights: ['Great ROI', 'Legacy alumni base', 'Core engineering options'],
    tags: ['Engineering', 'Government', 'ROI'],
    imageColor: 'from-emerald-900 via-teal-800 to-slate-700',
    courses: [
      { degree: 'B.Tech', specialization: 'Mechanical Engineering', duration: '4 years', tuition: '1.45 LPA' },
      { degree: 'B.Tech', specialization: 'Computer Engineering', duration: '4 years', tuition: '1.45 LPA' },
      { degree: 'B.Tech', specialization: 'Civil Engineering', duration: '4 years', tuition: '1.45 LPA' },
    ],
    placements: {
      averagePackageLpa: 11.3,
      highestPackageLpa: 33,
      placementRate: 89,
      topRecruiters: ['TCS', 'Larsen & Toubro', 'Deloitte', 'Barclays'],
    },
    reviews: [
      { id: 'r5', author: 'Sneha', rating: 4.4, text: 'A great option when fee sensitivity matters.', date: '2025-08-19' },
      { id: 'r6', author: 'Varun', rating: 4.2, text: 'Campus culture is strong and the city location helps a lot.', date: '2025-09-14' },
    ],
    examCutoffs: {
      'JEE Main': { minRank: 1, maxRank: 12000 },
      BITSAT: { minRank: 1, maxRank: 999999 },
      'State CET': { minRank: 1, maxRank: 650 },
    },
  },
  {
    id: 'vjti-mumbai',
    name: 'Veermata Jijabai Technological Institute',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    feesPerYear: 92000,
    rating: 4.3,
    description:
      'A respected state engineering college with strong brand recall, affordability, and decent access to the Mumbai job market.',
    highlights: ['Low fees', 'Mumbai location', 'Good core branches'],
    tags: ['Engineering', 'State College', 'Affordable'],
    imageColor: 'from-blue-900 via-indigo-800 to-slate-700',
    courses: [
      { degree: 'B.Tech', specialization: 'Electronics and Telecommunication', duration: '4 years', tuition: '0.92 LPA' },
      { degree: 'B.Tech', specialization: 'Information Technology', duration: '4 years', tuition: '0.92 LPA' },
      { degree: 'B.Tech', specialization: 'Production Engineering', duration: '4 years', tuition: '0.92 LPA' },
    ],
    placements: {
      averagePackageLpa: 9.1,
      highestPackageLpa: 28,
      placementRate: 87,
      topRecruiters: ['Tata', 'Capgemini', 'JPMC', 'KPMG'],
    },
    reviews: [
      { id: 'r7', author: 'Ishan', rating: 4.3, text: 'Great value and the city advantage is real.', date: '2025-10-27' },
      { id: 'r8', author: 'Pooja', rating: 4.1, text: 'The brand is strong among recruiters across Maharashtra.', date: '2025-12-12' },
    ],
    examCutoffs: {
      'JEE Main': { minRank: 1, maxRank: 18000 },
      BITSAT: { minRank: 1, maxRank: 999999 },
      'State CET': { minRank: 1, maxRank: 850 },
    },
  },
  {
    id: 'nit-trichy',
    name: 'National Institute of Technology Trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    feesPerYear: 170000,
    rating: 4.6,
    description:
      'One of the strongest NITs for engineering outcomes with disciplined academics, stable placements, and broad recruiter interest.',
    highlights: ['Strong placements', 'Well-known NIT brand', 'Balanced cost'],
    tags: ['Engineering', 'NIT', 'Placements'],
    imageColor: 'from-red-900 via-rose-800 to-slate-700',
    courses: [
      { degree: 'B.Tech', specialization: 'Computer Science and Engineering', duration: '4 years', tuition: '1.70 LPA' },
      { degree: 'B.Tech', specialization: 'Electronics and Communication', duration: '4 years', tuition: '1.70 LPA' },
      { degree: 'B.Tech', specialization: 'Instrumentation and Control', duration: '4 years', tuition: '1.70 LPA' },
    ],
    placements: {
      averagePackageLpa: 18.9,
      highestPackageLpa: 52,
      placementRate: 94,
      topRecruiters: ['Amazon', 'Samsung', 'Oracle', 'Texas Instruments'],
    },
    reviews: [
      { id: 'r9', author: 'Karthik', rating: 4.7, text: 'The academic environment is serious and the outcomes follow.', date: '2025-09-21' },
      { id: 'r10', author: 'Ananya', rating: 4.5, text: 'Good balance between work and campus life.', date: '2025-11-30' },
    ],
    examCutoffs: {
      'JEE Main': { minRank: 1, maxRank: 6500 },
      BITSAT: { minRank: 1, maxRank: 999999 },
      'State CET': { minRank: 1, maxRank: 999999 },
    },
  },
  {
    id: 'msrit-bangalore',
    name: 'M. S. Ramaiah Institute of Technology',
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    state: 'Karnataka',
    feesPerYear: 255000,
    rating: 4.2,
    description:
      'A large private institute in Bengaluru offering broad branch coverage, good city access, and practical engineering exposure.',
    highlights: ['Urban campus', 'Wide course mix', 'Strong local demand'],
    tags: ['Engineering', 'Private', 'City Campus'],
    imageColor: 'from-cyan-900 via-sky-800 to-slate-700',
    courses: [
      { degree: 'B.E.', specialization: 'Computer Science', duration: '4 years', tuition: '2.55 LPA' },
      { degree: 'B.E.', specialization: 'Mechanical Engineering', duration: '4 years', tuition: '2.55 LPA' },
      { degree: 'B.E.', specialization: 'Biomedical Engineering', duration: '4 years', tuition: '2.55 LPA' },
    ],
    placements: {
      averagePackageLpa: 8.8,
      highestPackageLpa: 26,
      placementRate: 84,
      topRecruiters: ['Infosys', 'Accenture', 'Deloitte', 'Bosch'],
    },
    reviews: [
      { id: 'r11', author: 'Harsha', rating: 4.2, text: 'Good city college option with many peer groups and clubs.', date: '2025-08-08' },
      { id: 'r12', author: 'Divya', rating: 4.0, text: 'The Bangalore location helps a lot during internships.', date: '2025-12-18' },
    ],
    examCutoffs: {
      'JEE Main': { minRank: 1, maxRank: 28000 },
      BITSAT: { minRank: 1, maxRank: 999999 },
      'State CET': { minRank: 1, maxRank: 2200 },
    },
  },
];