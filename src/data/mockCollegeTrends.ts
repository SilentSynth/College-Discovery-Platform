import { mockColleges } from './mockColleges';
import type { CollegeTrendPoint } from '../types/college';

const academicYears = ['2015-16', '2016-17', '2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25'];

function buildTrendSeries(basePackage: number, baseTuition: number, basePlacementRate: number): CollegeTrendPoint[] {
  return academicYears.map((academicYear, index) => {
    const packageGrowth = 1 + index * 0.055;
    const tuitionGrowth = 1 + index * 0.065;
    const placementGrowth = Math.min(0.985, (basePlacementRate / 100) + index * 0.004);

    return {
      academicYear,
      averagePackageLpa: Number((basePackage * packageGrowth).toFixed(1)),
      tuitionFeeInr: Math.round(baseTuition * tuitionGrowth),
      placementRate: Number((placementGrowth * 100).toFixed(1)),
    };
  });
}

export const mockCollegeTrends: Record<string, CollegeTrendPoint[]> = Object.fromEntries(
  mockColleges.map((college) => [
    college.id,
    buildTrendSeries(college.placements.averagePackageLpa, college.feesPerYear, college.placements.placementRate),
  ]),
);