export const isLessonUnlocked = (
  enrolledAt: Date,
  dripAfterDays: number
): boolean => {
  if (dripAfterDays === 0) return true;

  const unlockDate = new Date(enrolledAt);
  unlockDate.setDate(
    unlockDate.getDate() + dripAfterDays
  );

  return new Date() >= unlockDate;
};
