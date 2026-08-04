import type { UserPreferences } from '../../domain';
import type { PreferencesRepository } from '../ports';

export function createSavePreferences(deps: {
  preferencesRepository: PreferencesRepository;
}) {
  return async function savePreferences(
    prefs: UserPreferences,
  ): Promise<UserPreferences> {
    const normalized: UserPreferences = {
      ...prefs,
      displayName: prefs.displayName.trim().slice(0, 80),
    };
    await deps.preferencesRepository.saveAll(normalized);
    return normalized;
  };
}
