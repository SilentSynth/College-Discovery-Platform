import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds: string[]) {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? 'overview');

  useEffect(() => {
    const observedElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (observedElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => right.intersectionRatio - left.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0.25, 0.4, 0.55, 0.7],
        rootMargin: '-18% 0px -45% 0px',
      },
    );

    observedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSectionId;
}