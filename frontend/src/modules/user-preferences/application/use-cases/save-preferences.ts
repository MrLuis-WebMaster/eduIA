import type { UserPreferences } from '../../domain';
import { normalizeUserPreferences } from '../../domain';
import type { PreferencesRepository } from '../ports';

export function createSavePreferences(deps: {
  preferencesRepository: PreferencesRepository;
}) {
  return async function savePreferences(
    prefs: UserPreferences,
  ): Promise<UserPreferences> {
    const normalized = normalizeUserPreferences(prefs);
    await deps.preferencesRepository.saveAll(normalized);
    return normalized;
  };
}
