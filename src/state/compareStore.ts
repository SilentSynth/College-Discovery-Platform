import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CompareState {
  selectedCollegeIds: string[];
  addCollege: (collegeId: string) => void;
  removeCollege: (collegeId: string) => void;
  toggleCollege: (collegeId: string) => void;
  clearCompare: () => void;
  isSelected: (collegeId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedCollegeIds: [],
      addCollege: (collegeId) =>
        set((state) => {
          if (state.selectedCollegeIds.includes(collegeId) || state.selectedCollegeIds.length >= 3) {
            return state;
          }

          return { selectedCollegeIds: [...state.selectedCollegeIds, collegeId] };
        }),
      removeCollege: (collegeId) => set((state) => ({ selectedCollegeIds: state.selectedCollegeIds.filter((id) => id !== collegeId) })),
      toggleCollege: (collegeId) => {
        const selected = get().selectedCollegeIds.includes(collegeId);

        if (selected) {
          get().removeCollege(collegeId);
          return;
        }

        get().addCollege(collegeId);
      },
      clearCompare: () => set({ selectedCollegeIds: [] }),
      isSelected: (collegeId) => get().selectedCollegeIds.includes(collegeId),
    }),
    {
      name: 'college-discovery-compare',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);